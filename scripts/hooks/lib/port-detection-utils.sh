#!/bin/bash

# Claude Code Port Detection Utilities
# Smart dynamic port discovery and caching system for development server detection
# Cloud-aware infrastructure supporting Google Cloud Workstations, GitHub Codespaces, Gitpod, and local development

# Source common utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/hook-utils.sh"

# Source cloud environment utilities (integrating our testing infrastructure)
source "$SCRIPT_DIR/../../testing/lib/cloud-environment-utils.sh"

# Configuration
PORT_CACHE_DIR="$HOME/.claude/hooks"
PORT_CACHE_FILE="$PORT_CACHE_DIR/active-port.cache"
PORT_CONFIG_FILE="$(dirname "$SCRIPT_DIR")/config/port-detection-config.json"

# Ensure cache directory exists
mkdir -p "$PORT_CACHE_DIR"

# Dynamic port detection configuration (no hardcoded arrays)
CACHE_TTL_SECONDS=1800  # 30 minutes
QUICK_CHECK_TIMEOUT=5   # 5 seconds for cloud environments (higher latency)
DETECTION_TIMEOUT=10    # 10 seconds for full detection
MAX_DETECTION_ATTEMPTS=3

# Dynamic port range for scanning (when process discovery fails)
PORT_RANGE_START=3000
PORT_RANGE_END=4010

# Logging functions specific to port detection
log_port_info() {
    log_info "[PORT_DETECTION] $1"
}

log_port_success() {
    log_success "[PORT_DETECTION] $1"
}

log_port_warning() {
    log_warning "[PORT_DETECTION] $1"
}

log_port_error() {
    log_error "[PORT_DETECTION] $1"
}

# Function to check if a port is responsive and serving Next.js (cloud-aware)
is_port_serving_nextjs() {
    local port="$1"
    local timeout="${2:-$QUICK_CHECK_TIMEOUT}"
    
    # Use cloud-aware validation from our testing infrastructure (suppress output)
    if validate_nextjs_server_cloud "$port" "$timeout" >/dev/null 2>&1; then
        echo "$port" >&1  # Explicit stdout redirect
        return 0
    fi
    
    return 1
}

# Function to find Next.js process and its port (fully dynamic)
find_nextjs_process_port() {
    log_port_info "Phase 1: Process-based discovery..."
    
    # Method 1: Find Next.js processes and extract their ports
    local nextjs_processes=$(ps aux | grep -E "next-server|next dev" | grep -v grep | sort -k2 -nr | awk '{print $2}')
    
    for pid in $nextjs_processes; do
        # Use lsof to find listening ports for this PID (handles both IPv4 and IPv6)
        local ports=$(lsof -i -P -n | grep "$pid" | grep LISTEN | grep -o ":[0-9]\+" | cut -d: -f2 | sort -n | uniq)
        for port in $ports; do
            if [[ "$port" =~ ^[0-9]+$ ]] && [[ $port -ge 3000 ]] && [[ $port -le 65535 ]]; then
                log_port_info "Testing process port: $port (PID: $pid)"
                if is_port_serving_nextjs "$port" >/dev/null; then
                    log_port_success "Found Next.js server on port $port (process-based)"
                    echo "$port" >&1  # Explicit stdout redirect
                    return 0
                fi
            fi
        done
    done
    
    # Method 2: Dynamic port range scanning (no hardcoded arrays)
    log_port_info "Phase 2: Dynamic range scanning..."
    local discovered_ports=()
    
    # Find all active listening ports in our range
    local active_ports=$(netstat -tuln 2>/dev/null | grep LISTEN | grep -o ":[0-9]\+" | cut -d: -f2 | sort -n | uniq)
    for port in $active_ports; do
        if [[ $port -ge $PORT_RANGE_START ]] && [[ $port -le $PORT_RANGE_END ]]; then
            discovered_ports+=("$port")
        fi
    done
    
    if [[ ${#discovered_ports[@]} -gt 0 ]]; then
        log_port_info "Found active ports: ${discovered_ports[*]}"
        
        # Test each discovered port for Next.js
        for port in "${discovered_ports[@]}"; do
            if is_port_serving_nextjs "$port" >/dev/null; then
                log_port_success "Found Next.js server on port $port (network-based)"
                echo "$port" >&1  # Explicit stdout redirect
                return 0
            fi
        done
    fi
    
    log_port_warning "No Next.js servers found"
    return 1
}

# Function to get process info for a port
get_port_process_info() {
    local port="$1"
    
    # Find PID listening on the port
    local pid=$(lsof -ti:"$port" 2>/dev/null | head -1)
    if [[ -n "$pid" ]]; then
        local process_name=$(ps -p "$pid" -o comm= 2>/dev/null | tr -d ' ')
        echo "{\"pid\":$pid,\"process_name\":\"$process_name\"}"
    else
        echo "{\"pid\":null,\"process_name\":null}"
    fi
}

# Function to validate cached port
is_cached_port_valid() {
    if [[ ! -f "$PORT_CACHE_FILE" ]]; then
        return 1
    fi
    
    # Read cache file
    local cache_content=$(cat "$PORT_CACHE_FILE" 2>/dev/null)
    if [[ -z "$cache_content" ]]; then
        return 1
    fi
    
    # Extract values using basic parsing (avoiding jq dependency)
    local cached_port=$(echo "$cache_content" | grep -o '"port":[0-9]*' | cut -d: -f2)
    local cached_timestamp=$(echo "$cache_content" | grep -o '"timestamp":[0-9]*' | cut -d: -f2)
    local cached_pid=$(echo "$cache_content" | grep -o '"pid":[0-9]*' | cut -d: -f2)
    
    if [[ -z "$cached_port" || -z "$cached_timestamp" ]]; then
        return 1
    fi
    
    # Check if cache is expired
    local current_timestamp=$(date +%s)
    local age=$((current_timestamp - cached_timestamp))
    if [[ $age -gt $CACHE_TTL_SECONDS ]]; then
        log_port_info "Cache expired (age: ${age}s, TTL: ${CACHE_TTL_SECONDS}s)"
        return 1
    fi
    
    # Check if process still exists (if PID was cached)
    if [[ -n "$cached_pid" && "$cached_pid" != "null" ]]; then
        if ! kill -0 "$cached_pid" 2>/dev/null; then
            log_port_info "Cached process (PID: $cached_pid) no longer exists"
            return 1
        fi
    fi
    
    # Validate port is still responsive using cloud-aware validation
    if is_port_serving_nextjs "$cached_port" >/dev/null; then
        export ACTIVE_DEV_PORT="$cached_port"
        local validation_url=$(construct_test_url "$cached_port")
        export ACTIVE_DEV_URL="$validation_url"  # Set complete cloud-aware URL
        log_port_success "Using cached port: $cached_port"
        log_port_info "Active dev URL: $validation_url"
        return 0
    else
        log_port_info "Cached port $cached_port is no longer responsive"
        return 1
    fi
}

# Function to cache discovered port (cloud-aware)
cache_port_info() {
    local port="$1"
    local operation_context="${2:-general}"
    
    local timestamp=$(date +%s)
    local process_info=$(get_port_process_info "$port")
    local environment=$(detect_environment)
    local validation_url=$(construct_test_url "$port")
    
    # Create cache content with cloud-aware URL
    cat > "$PORT_CACHE_FILE" << EOF
{
  "port": $port,
  "timestamp": $timestamp,
  "validation_url": "$validation_url",
  "environment": "$environment",
  "operation_context": "$operation_context",
  "process_info": $process_info
}
EOF
    
    log_port_success "Cached port $port with context: $operation_context (env: $environment)"
    log_port_info "Validation URL: $validation_url"
}

# Function to detect active development server port
detect_active_port() {
    local operation_context="${1:-general}"
    
    log_port_info "Detecting active development server port..."
    
    # First, try to find Next.js process and its port
    local detected_port=$(find_nextjs_process_port)
    
    if [[ -n "$detected_port" ]]; then
        export ACTIVE_DEV_PORT="$detected_port"
        local server_url=$(construct_test_url "$detected_port")
        export ACTIVE_DEV_URL="$server_url"  # Set complete cloud-aware URL
        cache_port_info "$detected_port" "$operation_context"
        log_port_success "Detected active port: $detected_port"
        log_port_info "Active dev URL: $server_url"
        return 0
    else
        log_port_warning "No active development server found"
        return 1
    fi
}

# Function to get active port with caching
get_active_port() {
    local operation_context="${1:-general}"
    local force_refresh="${2:-false}"
    
    # Check if port is already exported in current session
    if [[ -n "$ACTIVE_DEV_PORT" && "$force_refresh" != "true" ]]; then
        log_port_info "Using existing session port: $ACTIVE_DEV_PORT"
        return 0
    fi
    
    # Try to use cached port if not forcing refresh
    if [[ "$force_refresh" != "true" ]] && is_cached_port_valid; then
        return 0
    fi
    
    # Cache miss or invalid - detect new port
    if detect_active_port "$operation_context"; then
        return 0
    else
        log_port_error "Failed to detect active development server port"
        return 1
    fi
}

# Function to clear port cache
clear_port_cache() {
    if [[ -f "$PORT_CACHE_FILE" ]]; then
        rm -f "$PORT_CACHE_FILE"
        log_port_info "Port cache cleared"
    fi
    unset ACTIVE_DEV_PORT
}

# Function to get port info for debugging (cloud-aware)
get_port_info() {
    echo "=== Port Detection Info ==="
    echo "Environment: $(detect_environment)"
    echo "Cache file: $PORT_CACHE_FILE"
    echo "Cache exists: $([ -f "$PORT_CACHE_FILE" ] && echo "yes" || echo "no")"
    
    if [[ -f "$PORT_CACHE_FILE" ]]; then
        echo "Cache content:"
        cat "$PORT_CACHE_FILE" 2>/dev/null | sed 's/^/  /'
    fi
    
    echo "Session ACTIVE_DEV_PORT: ${ACTIVE_DEV_PORT:-not set}"
    
    # Show currently active ports (dynamic discovery)
    echo "Active Next.js processes:"
    local nextjs_processes=$(ps aux | grep -E "next-server|next dev" | grep -v grep)
    if [[ -n "$nextjs_processes" ]]; then
        echo "$nextjs_processes" | sed 's/^/  /'
    else
        echo "  No Next.js processes found"
    fi
    
    echo "Active listening ports in range ($PORT_RANGE_START-$PORT_RANGE_END):"
    local active_ports=$(netstat -tuln 2>/dev/null | grep LISTEN | grep -o ":[0-9]\+" | cut -d: -f2 | sort -n | uniq)
    local found_ports=0
    for port in $active_ports; do
        if [[ $port -ge $PORT_RANGE_START ]] && [[ $port -le $PORT_RANGE_END ]]; then
            local url=$(construct_test_url "$port")
            if is_port_serving_nextjs "$port" >/dev/null; then
                echo "  $port: ✓ Next.js server - $url"
            else
                echo "  $port: ○ Active (non-Next.js) - $url"
            fi
            found_ports=1
        fi
    done
    if [[ $found_ports -eq 0 ]]; then
        echo "  No active ports found in range"
    fi
    echo "=========================="
}

# Function to wait for development server with timeout (cloud-aware)
wait_for_dev_server_on_port() {
    local port="$1"
    local max_attempts="${2:-15}"
    local attempt=1
    
    local validation_url=$(construct_test_url "$port")
    log_port_info "Waiting for development server on port $port..."
    log_port_info "Expected URL: $validation_url"
    
    while [[ $attempt -le $max_attempts ]]; do
        if is_port_serving_nextjs "$port" >/dev/null; then
            export ACTIVE_DEV_PORT="$port"
            export ACTIVE_DEV_URL="$validation_url"  # Set complete cloud-aware URL
            log_port_success "Development server ready on port $port"
            log_port_info "Server URL: $validation_url"
            return 0
        fi
        
        log_port_info "Attempt $attempt/$max_attempts - waiting for server on port $port..."
        sleep 2
        ((attempt++))
    done
    
    log_port_warning "Development server not available on port $port after $max_attempts attempts"
    return 1
}

# Export functions for use in other scripts
export -f is_port_serving_nextjs
export -f find_nextjs_process_port
export -f get_port_process_info
export -f is_cached_port_valid
export -f cache_port_info
export -f detect_active_port
export -f get_active_port
export -f clear_port_cache
export -f get_port_info
export -f wait_for_dev_server_on_port

# Mark utilities as loaded
export PORT_DETECTION_UTILS_LOADED="true"