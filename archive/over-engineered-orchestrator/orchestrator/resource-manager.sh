#!/bin/bash

# Claude Hooks Orchestration System - Resource Manager
# Centralized resource coordination and conflict prevention
# Manages shared state, locks, and operation caching

set -e

# Source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../lib/hook-utils.sh"

# Resource management configuration
SESSION_ID="${CLAUDE_SESSION_ID:-$(date +%s)}"
SHARED_STATE_DIR="/tmp/claude-hooks-session-${SESSION_ID}"
CACHE_DIR="$SHARED_STATE_DIR/cache"
LOCKS_DIR="$SHARED_STATE_DIR/locks"
SHARED_STATE_FILE="$SHARED_STATE_DIR/state.json"

# Cache TTL settings (in seconds)
CACHE_TTL_PORT_DETECTION=1800      # 30 minutes
CACHE_TTL_TYPESCRIPT=900           # 15 minutes
CACHE_TTL_BUILD=600                # 10 minutes
CACHE_TTL_SCREENSHOT=3600          # 1 hour

# Initialize resource management
initialize_resource_manager() {
    mkdir -p "$SHARED_STATE_DIR" "$CACHE_DIR" "$LOCKS_DIR"
    
    # Create initial shared state if it doesn't exist
    if [[ ! -f "$SHARED_STATE_FILE" ]]; then
        cat > "$SHARED_STATE_FILE" << EOF
{
  "session_id": "$SESSION_ID",
  "initialized": "$(date -Iseconds)",
  "active_port": null,
  "typescript_status": "unknown",
  "dev_server_health": "unknown",
  "last_port_check": 0,
  "last_typescript_check": 0,
  "last_build_check": 0,
  "performance_baseline": {},
  "visual_baseline": "unknown",
  "active_operations": [],
  "resource_locks": {}
}
EOF
    fi
    
    log_info "Resource manager initialized for session: $SESSION_ID"
    log_info "State directory: $SHARED_STATE_DIR"
}

# Cleanup function for session end
cleanup_resource_manager() {
    log_info "Cleaning up resource manager for session: $SESSION_ID"
    
    # Release all locks
    release_all_locks
    
    # Archive session data if valuable
    if [[ -d "$SHARED_STATE_DIR" ]]; then
        local archive_dir="$HOME/.claude/hooks/session-archive"
        mkdir -p "$archive_dir"
        
        # Keep only the last 10 sessions
        local session_count=$(ls -1 "$archive_dir" | wc -l)
        if [[ $session_count -gt 10 ]]; then
            ls -1t "$archive_dir" | tail -n +11 | xargs -I {} rm -rf "$archive_dir/{}"
        fi
        
        # Archive current session
        cp -r "$SHARED_STATE_DIR" "$archive_dir/session-${SESSION_ID}-$(date +%Y%m%d-%H%M%S)"
        
        # Remove active session
        rm -rf "$SHARED_STATE_DIR"
    fi
    
    log_info "Resource manager cleanup completed"
}

# Read shared state value
read_shared_state() {
    local key="$1"
    local default_value="${2:-null}"
    
    if [[ ! -f "$SHARED_STATE_FILE" ]]; then
        echo "$default_value"
        return
    fi
    
    # Use jq if available, otherwise fall back to grep/sed
    if command -v jq >/dev/null 2>&1; then
        jq -r ".$key // \"$default_value\"" "$SHARED_STATE_FILE" 2>/dev/null || echo "$default_value"
    else
        # Simple grep/sed fallback for basic values
        grep "\"$key\":" "$SHARED_STATE_FILE" | sed 's/.*: *"\?//; s/"\?,\?$//' || echo "$default_value"
    fi
}

# Write shared state value
write_shared_state() {
    local key="$1"
    local value="$2"
    
    if [[ ! -f "$SHARED_STATE_FILE" ]]; then
        initialize_resource_manager
    fi
    
    # Use jq if available for proper JSON manipulation
    if command -v jq >/dev/null 2>&1; then
        local temp_file=$(mktemp)
        jq ".$key = \"$value\"" "$SHARED_STATE_FILE" > "$temp_file" && mv "$temp_file" "$SHARED_STATE_FILE"
    else
        # Simple sed-based update for basic values
        if grep -q "\"$key\":" "$SHARED_STATE_FILE"; then
            sed -i "s/\"$key\": *\"[^\"]*\"/\"$key\": \"$value\"/" "$SHARED_STATE_FILE"
        else
            # Add new key (simplified approach)
            sed -i 's/}$/,\n  "'"$key"'": "'"$value"'"\n}/' "$SHARED_STATE_FILE"
        fi
    fi
}

# Acquire resource lock with timeout
acquire_resource_lock() {
    local resource="$1"
    local timeout="${2:-30}"
    local lock_file="$LOCKS_DIR/${resource}.lock"
    
    log_info "Acquiring lock for resource: $resource"
    
    local start_time=$(date +%s)
    local end_time=$((start_time + timeout))
    
    while [[ $(date +%s) -lt $end_time ]]; do
        # Try to acquire lock atomically
        if (set -C; echo $$ > "$lock_file") 2>/dev/null; then
            # Lock acquired successfully
            log_info "Lock acquired for resource: $resource (PID: $$)"
            
            # Set up trap to release lock on exit
            trap "release_resource_lock $resource" EXIT INT TERM
            
            # Update shared state
            write_shared_state "resource_locks.$resource" "$$"
            
            return 0
        fi
        
        # Check if the lock holder is still alive
        if [[ -f "$lock_file" ]]; then
            local lock_pid=$(cat "$lock_file" 2>/dev/null || echo "")
            if [[ -n "$lock_pid" ]] && ! kill -0 "$lock_pid" 2>/dev/null; then
                log_warning "Stale lock detected for resource $resource (PID: $lock_pid), removing"
                rm -f "$lock_file"
                continue
            fi
        fi
        
        sleep 0.1
    done
    
    log_error "Failed to acquire lock for resource $resource within ${timeout}s"
    return 1
}

# Release resource lock
release_resource_lock() {
    local resource="$1"
    local lock_file="$LOCKS_DIR/${resource}.lock"
    
    if [[ -f "$lock_file" ]]; then
        local lock_pid=$(cat "$lock_file" 2>/dev/null || echo "")
        if [[ "$lock_pid" == "$$" ]]; then
            rm -f "$lock_file"
            log_info "Lock released for resource: $resource"
            
            # Update shared state
            write_shared_state "resource_locks.$resource" "null"
        else
            log_warning "Cannot release lock for resource $resource: not owned by this process"
        fi
    fi
}

# Release all locks held by current process
release_all_locks() {
    for lock_file in "$LOCKS_DIR"/*.lock; do
        if [[ -f "$lock_file" ]]; then
            local lock_pid=$(cat "$lock_file" 2>/dev/null || echo "")
            if [[ "$lock_pid" == "$$" ]]; then
                local resource=$(basename "$lock_file" .lock)
                release_resource_lock "$resource"
            fi
        fi
    done
}

# Cache operation result with TTL
cache_operation_result() {
    local operation="$1"
    local result="$2"
    local ttl="${3:-900}"  # Default 15 minutes
    
    local cache_file="$CACHE_DIR/${operation}.cache"
    local cache_meta_file="$CACHE_DIR/${operation}.meta"
    local timestamp=$(date +%s)
    local expires_at=$((timestamp + ttl))
    
    # Store result and metadata
    echo "$result" > "$cache_file"
    echo "$expires_at" > "$cache_meta_file"
    
    log_info "Cached result for operation: $operation (expires: $(date -d @$expires_at))"
}

# Get cached operation result
get_cached_operation_result() {
    local operation="$1"
    local cache_file="$CACHE_DIR/${operation}.cache"
    local cache_meta_file="$CACHE_DIR/${operation}.meta"
    
    # Check if cache files exist
    if [[ ! -f "$cache_file" || ! -f "$cache_meta_file" ]]; then
        return 1
    fi
    
    # Check if cache is expired
    local expires_at=$(cat "$cache_meta_file" 2>/dev/null || echo "0")
    local current_time=$(date +%s)
    
    if [[ $current_time -gt $expires_at ]]; then
        log_info "Cache expired for operation: $operation"
        rm -f "$cache_file" "$cache_meta_file"
        return 1
    fi
    
    # Return cached result
    log_info "Using cached result for operation: $operation"
    cat "$cache_file"
    return 0
}

# Invalidate cache for operation
invalidate_cache() {
    local operation="$1"
    local cache_file="$CACHE_DIR/${operation}.cache"
    local cache_meta_file="$CACHE_DIR/${operation}.meta"
    
    rm -f "$cache_file" "$cache_meta_file"
    log_info "Cache invalidated for operation: $operation"
}

# Shared port detection with caching
get_shared_port_detection() {
    local context="${1:-general}"
    
    # Try to get from cache first
    if get_cached_operation_result "port_detection" >/dev/null 2>&1; then
        local cached_port=$(get_cached_operation_result "port_detection")
        if [[ -n "$cached_port" && "$cached_port" != "null" ]]; then
            export ACTIVE_DEV_PORT="$cached_port"
            write_shared_state "active_port" "$cached_port"
            log_info "Using cached port detection: $cached_port"
            return 0
        fi
    fi
    
    # Acquire lock for port detection
    if acquire_resource_lock "port_detection" 10; then
        log_info "Performing port detection for context: $context"
        
        # Source and execute port detection
        if [[ -f "$SCRIPT_DIR/../lib/port-detection-utils.sh" ]]; then
            source "$SCRIPT_DIR/../lib/port-detection-utils.sh"
            if get_active_port "$context"; then
                local detected_port="$ACTIVE_DEV_PORT"
                
                # Cache the result
                cache_operation_result "port_detection" "$detected_port" "$CACHE_TTL_PORT_DETECTION"
                write_shared_state "active_port" "$detected_port"
                write_shared_state "last_port_check" "$(date +%s)"
                
                log_success "Port detection successful: $detected_port"
                release_resource_lock "port_detection"
                return 0
            else
                log_warning "Port detection failed"
                cache_operation_result "port_detection" "null" "$CACHE_TTL_PORT_DETECTION"
                release_resource_lock "port_detection"
                return 1
            fi
        else
            log_error "Port detection utilities not found"
            release_resource_lock "port_detection"
            return 1
        fi
    else
        log_error "Failed to acquire port detection lock"
        return 1
    fi
}

# Shared TypeScript validation with caching
get_shared_typescript_validation() {
    # Try to get from cache first
    if get_cached_operation_result "typescript_validation" >/dev/null 2>&1; then
        local cached_result=$(get_cached_operation_result "typescript_validation")
        if [[ "$cached_result" == "success" ]]; then
            log_info "Using cached TypeScript validation: success"
            return 0
        elif [[ "$cached_result" == "failure" ]]; then
            log_info "Using cached TypeScript validation: failure"
            return 1
        fi
    fi
    
    # Acquire lock for TypeScript validation
    if acquire_resource_lock "typescript" 60; then
        log_info "Performing TypeScript validation"
        
        local validation_result="failure"
        if npm run typecheck --silent 2>/dev/null; then
            validation_result="success"
            log_success "TypeScript validation successful"
        else
            log_error "TypeScript validation failed"
        fi
        
        # Cache the result
        cache_operation_result "typescript_validation" "$validation_result" "$CACHE_TTL_TYPESCRIPT"
        write_shared_state "typescript_status" "$validation_result"
        write_shared_state "last_typescript_check" "$(date +%s)"
        
        release_resource_lock "typescript"
        
        if [[ "$validation_result" == "success" ]]; then
            return 0
        else
            return 1
        fi
    else
        log_error "Failed to acquire TypeScript validation lock"
        return 1
    fi
}

# Shared dev server health check
get_shared_dev_server_health() {
    local port="${1:-$ACTIVE_DEV_PORT}"
    
    if [[ -z "$port" ]]; then
        # Try to get port from shared state
        port=$(read_shared_state "active_port")
        if [[ "$port" == "null" || -z "$port" ]]; then
            log_warning "No port available for dev server health check"
            return 1
        fi
    fi
    
    # Source cloud environment utilities if not already loaded
    if [[ -z "${PORT_DETECTION_UTILS_LOADED:-}" ]]; then
        source "$SCRIPT_DIR/../lib/port-detection-utils.sh"
    fi
    
    # Check server health using cloud-aware connectivity
    if test_server_connectivity "$port" 5; then
        write_shared_state "dev_server_health" "healthy"
        local server_url=$(construct_test_url "$port")
        log_info "Dev server healthy on port $port ($server_url)"
        return 0
    else
        write_shared_state "dev_server_health" "unhealthy"
        local server_url=$(construct_test_url "$port")
        log_warning "Dev server unhealthy on port $port ($server_url)"
        return 1
    fi
}

# Resource usage monitoring
monitor_resource_usage() {
    local operation="$1"
    local start_time=$(date +%s%3N)
    
    # Log resource usage start
    log_info "Starting resource monitoring for operation: $operation"
    
    # Store monitoring data (simplified for now)
    echo "$start_time" > "$CACHE_DIR/${operation}_monitor.start"
    
    return 0
}

# Complete resource monitoring
complete_resource_monitoring() {
    local operation="$1"
    local exit_code="${2:-0}"
    local start_file="$CACHE_DIR/${operation}_monitor.start"
    
    if [[ -f "$start_file" ]]; then
        local start_time=$(cat "$start_file")
        local end_time=$(date +%s%3N)
        local duration=$((end_time - start_time))
        
        log_info "Operation $operation completed in ${duration}ms (exit code: $exit_code)"
        
        # Cleanup monitoring file
        rm -f "$start_file"
        
        # Log to performance history
        echo "$(date -Iseconds),$operation,$duration,$exit_code" >> "$CACHE_DIR/performance_history.csv"
    fi
}

# Command line interface
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    case "${1:-}" in
        "init")
            initialize_resource_manager
            ;;
        "cleanup")
            cleanup_resource_manager
            ;;
        "lock")
            acquire_resource_lock "$2" "$3"
            ;;
        "unlock")
            release_resource_lock "$2"
            ;;
        "cache")
            cache_operation_result "$2" "$3" "$4"
            ;;
        "get-cache")
            get_cached_operation_result "$2"
            ;;
        "invalidate")
            invalidate_cache "$2"
            ;;
        "port")
            get_shared_port_detection "$2"
            ;;
        "typescript")
            get_shared_typescript_validation
            ;;
        "health")
            get_shared_dev_server_health "$2"
            ;;
        "state")
            if [[ -n "$3" ]]; then
                write_shared_state "$2" "$3"
            else
                read_shared_state "$2"
            fi
            ;;
        *)
            echo "Usage: $0 {init|cleanup|lock|unlock|cache|get-cache|invalidate|port|typescript|health|state} [args...]"
            exit 1
            ;;
    esac
fi

# Auto-initialize if not already done
if [[ ! -d "$SHARED_STATE_DIR" ]]; then
    initialize_resource_manager
fi

# Set up cleanup trap
trap cleanup_resource_manager EXIT