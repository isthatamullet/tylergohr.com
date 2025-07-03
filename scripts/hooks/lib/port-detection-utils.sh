#!/bin/bash

# Claude Code Port Detection Utilities
# Smart port discovery and caching system for development server detection

# Source common utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/hook-utils.sh"

# Configuration
PORT_CACHE_DIR="$HOME/.claude/hooks"
PORT_CACHE_FILE="$PORT_CACHE_DIR/active-port.cache"
PORT_CONFIG_FILE="$(dirname "$SCRIPT_DIR")/config/port-detection-config.json"

# Ensure cache directory exists
mkdir -p "$PORT_CACHE_DIR"

# Port detection configuration
COMMON_PORTS=(3000 3001 3002 3003 3004 3005 3006 3007 3008 3009 4000 4001 4002 4003 4004 4005)
CACHE_TTL_SECONDS=1800  # 30 minutes
QUICK_CHECK_TIMEOUT=2   # 2 seconds for port responsiveness

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

# Function to check if a port is responsive and serving Next.js
is_port_serving_nextjs() {
    local port="$1"
    local timeout="${2:-$QUICK_CHECK_TIMEOUT}"
    
    # Quick HTTP check with timeout
    local response_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$timeout" "http://localhost:$port" 2>/dev/null || echo "000")
    
    # Check if we get a valid HTTP response (200, 404, etc.)
    if [[ "$response_code" =~ ^[2-5][0-9][0-9]$ ]]; then
        # Additional check for Next.js specific headers or content
        local next_check=$(curl -s --max-time "$timeout" "http://localhost:$port" 2>/dev/null | grep -i "next\|react\|_next" || echo "")
        if [[ -n "$next_check" ]] || [[ "$response_code" == "200" ]]; then
            echo "$port"
            return 0
        fi
    fi
    
    return 1
}

# Function to find Next.js process and its port
find_nextjs_process_port() {
    # Method 1: Find most recent Next.js server process
    # Get next-server processes sorted by PID (most recent first)
    local nextjs_processes=$(ps aux | grep "next-server" | grep -v grep | sort -k2 -nr | awk '{print $2}')
    
    for pid in $nextjs_processes; do
        # Use lsof or netstat to find listening ports for this PID
        local port=$(lsof -i -P -n | grep "$pid" | grep LISTEN | grep -o ":[3-9][0-9][0-9][0-9]" | head -1 | cut -d: -f2)
        if [[ -n "$port" ]]; then
            if is_port_serving_nextjs "$port" >/dev/null; then
                echo "$port"
                return 0
            fi
        fi
    done
    
    # Method 2: Check common ports directly
    for port in "${COMMON_PORTS[@]}"; do
        if is_port_serving_nextjs "$port" >/dev/null; then
            echo "$port"
            return 0
        fi
    done
    
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
    
    # Validate port is still responsive
    if is_port_serving_nextjs "$cached_port" >/dev/null; then
        export ACTIVE_DEV_PORT="$cached_port"
        log_port_success "Using cached port: $cached_port"
        return 0
    else
        log_port_info "Cached port $cached_port is no longer responsive"
        return 1
    fi
}

# Function to cache discovered port
cache_port_info() {
    local port="$1"
    local operation_context="${2:-general}"
    
    local timestamp=$(date +%s)
    local process_info=$(get_port_process_info "$port")
    
    # Create cache content
    cat > "$PORT_CACHE_FILE" << EOF
{
  "port": $port,
  "timestamp": $timestamp,
  "validation_url": "http://localhost:$port",
  "operation_context": "$operation_context",
  "process_info": $process_info
}
EOF
    
    log_port_success "Cached port $port with context: $operation_context"
}

# Function to detect active development server port
detect_active_port() {
    local operation_context="${1:-general}"
    
    log_port_info "Detecting active development server port..."
    
    # First, try to find Next.js process and its port
    local detected_port=$(find_nextjs_process_port)
    
    if [[ -n "$detected_port" ]]; then
        export ACTIVE_DEV_PORT="$detected_port"
        cache_port_info "$detected_port" "$operation_context"
        log_port_success "Detected active port: $detected_port"
        return 0
    else
        log_port_warning "No active development server found on common ports"
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

# Function to get port info for debugging
get_port_info() {
    echo "=== Port Detection Info ==="
    echo "Cache file: $PORT_CACHE_FILE"
    echo "Cache exists: $([ -f "$PORT_CACHE_FILE" ] && echo "yes" || echo "no")"
    
    if [[ -f "$PORT_CACHE_FILE" ]]; then
        echo "Cache content:"
        cat "$PORT_CACHE_FILE" 2>/dev/null | sed 's/^/  /'
    fi
    
    echo "Session ACTIVE_DEV_PORT: ${ACTIVE_DEV_PORT:-not set}"
    echo "Available ports:"
    for port in "${COMMON_PORTS[@]}"; do
        if is_port_serving_nextjs "$port" >/dev/null; then
            echo "  $port: ✓ responsive"
        else
            echo "  $port: ✗ not responsive"
        fi
    done
    echo "=========================="
}

# Function to wait for development server with timeout
wait_for_dev_server_on_port() {
    local port="$1"
    local max_attempts="${2:-15}"
    local attempt=1
    
    log_port_info "Waiting for development server on port $port..."
    
    while [[ $attempt -le $max_attempts ]]; do
        if is_port_serving_nextjs "$port" >/dev/null; then
            export ACTIVE_DEV_PORT="$port"
            log_port_success "Development server ready on port $port"
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