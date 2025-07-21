#!/bin/bash

# Browser Pool Coordinator for Claude Hooks System
# Advanced resource management and conflict prevention
# Ensures optimal browser usage across development workflows

# Source dependencies
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/hook-utils.sh"

# Configuration
BROWSER_POOL_DIR="$HOME/.claude/hooks/browser-pool"
BROWSER_LOCK_DIR="$HOME/.claude/hooks/browser-locks"
BROWSER_METRICS_DIR="$HOME/.claude/hooks/browser-metrics"
BROWSER_PROCESS_DIR="$HOME/.claude/hooks/browser-processes"

# Resource limits
MAX_CONCURRENT_BROWSERS=3
MEMORY_LIMIT_MB=1000
BROWSER_IDLE_TIMEOUT=300      # 5 minutes
BROWSER_CLEANUP_INTERVAL=60   # 1 minute
LOCK_TIMEOUT=30               # 30 seconds

# Ensure directories exist
mkdir -p "$BROWSER_POOL_DIR" "$BROWSER_LOCK_DIR" "$BROWSER_METRICS_DIR" "$BROWSER_PROCESS_DIR"

# Logging functions specific to browser coordination
log_browser_info() {
    log_info "[BROWSER_POOL] $1"
}

log_browser_success() {
    log_success "[BROWSER_POOL] $1"
}

log_browser_warning() {
    log_warning "[BROWSER_POOL] $1"
}

log_browser_error() {
    log_error "[BROWSER_POOL] $1"
}

# System Resource Monitoring

get_system_memory_usage() {
    # Get current memory usage in MB
    free -m | awk '/^Mem:/ {printf "%.0f", $3}'
}

get_system_load_average() {
    uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | tr -d ','
}

get_browser_process_count() {
    # Count all browser-related processes
    pgrep -f "chrome|chromium|firefox|webkit|puppeteer|playwright" | wc -l
}

get_browser_memory_usage() {
    # Get total memory usage of browser processes in MB
    local browser_pids=$(pgrep -f "chrome|chromium|firefox|webkit|puppeteer|playwright")
    local total_memory=0
    
    if [[ -n "$browser_pids" ]]; then
        for pid in $browser_pids; do
            local mem=$(ps -o rss= -p "$pid" 2>/dev/null | awk '{sum += $1} END {print sum/1024}')
            if [[ -n "$mem" ]]; then
                total_memory=$(echo "$total_memory + $mem" | bc -l 2>/dev/null || echo "$total_memory")
            fi
        done
    fi
    
    printf "%.0f" "$total_memory"
}

assess_system_capacity() {
    local memory_usage=$(get_system_memory_usage)
    local load_avg=$(get_system_load_average)
    local browser_count=$(get_browser_process_count)
    local browser_memory=$(get_browser_memory_usage)
    
    log_browser_info "System assessment - Memory: ${memory_usage}MB, Load: $load_avg, Browsers: $browser_count, Browser Memory: ${browser_memory}MB"
    
    # Determine system capacity
    if [[ "$browser_count" -ge "$MAX_CONCURRENT_BROWSERS" ]] || [[ "$browser_memory" -ge "$MEMORY_LIMIT_MB" ]]; then
        echo "at_capacity"
    elif (( $(echo "$load_avg > 2.0" | bc -l 2>/dev/null || echo "0") )) || [[ "$memory_usage" -gt 6000 ]]; then
        echo "constrained"
    elif [[ "$browser_count" -eq 0 ]]; then
        echo "optimal"
    else
        echo "available"
    fi
}

# Browser Pool Management

generate_browser_pool_id() {
    local service_type="${1:-general}"
    local port="${ACTIVE_DEV_PORT:-3000}"
    echo "${service_type}_${port}_$(date +%s)"
}

register_browser_process() {
    local pool_id="$1"
    local browser_pid="$2"
    local browser_type="${3:-unknown}"
    
    local process_file="$BROWSER_PROCESS_DIR/$pool_id"
    
    cat > "$process_file" << EOF
{
    "pool_id": "$pool_id",
    "browser_pid": $browser_pid,
    "browser_type": "$browser_type",
    "start_time": $(date +%s),
    "port": "${ACTIVE_DEV_PORT:-3000}",
    "dev_url": "${ACTIVE_DEV_URL:-http://localhost:3000}",
    "service_type": "screenshot_generation"
}
EOF
    
    log_browser_success "Registered browser process: $pool_id (PID: $browser_pid)"
}

unregister_browser_process() {
    local pool_id="$1"
    local process_file="$BROWSER_PROCESS_DIR/$pool_id"
    
    if [[ -f "$process_file" ]]; then
        rm -f "$process_file"
        log_browser_info "Unregistered browser process: $pool_id"
    fi
}

get_active_browser_pools() {
    find "$BROWSER_PROCESS_DIR" -name "*" -type f -mmin -5 2>/dev/null | while read -r process_file; do
        if [[ -f "$process_file" ]]; then
            local pool_id=$(basename "$process_file")
            local browser_pid=$(grep -o '"browser_pid": [0-9]*' "$process_file" | grep -o '[0-9]*')
            
            # Verify process is still alive
            if [[ -n "$browser_pid" ]] && kill -0 "$browser_pid" 2>/dev/null; then
                echo "$pool_id:$browser_pid"
            else
                # Clean up dead process
                unregister_browser_process "$pool_id"
            fi
        fi
    done
}

# Resource Locking System

acquire_resource_lock() {
    local resource_type="$1"
    local lock_id="${2:-$(generate_browser_pool_id "$resource_type")}"
    local lock_file="$BROWSER_LOCK_DIR/${resource_type}_${lock_id}.lock"
    local timeout="${3:-$LOCK_TIMEOUT}"
    
    log_browser_info "Acquiring $resource_type lock: $lock_id"
    
    local elapsed=0
    while [[ $elapsed -lt $timeout ]]; do
        if (set -C; echo $$ > "$lock_file") 2>/dev/null; then
            log_browser_success "Acquired $resource_type lock: $lock_id"
            echo "$lock_id"
            return 0
        fi
        
        # Check if lock holder is still alive
        if [[ -f "$lock_file" ]]; then
            local lock_pid=$(cat "$lock_file" 2>/dev/null)
            if [[ -n "$lock_pid" ]] && ! kill -0 "$lock_pid" 2>/dev/null; then
                log_browser_warning "Removing stale lock (PID $lock_pid no longer exists)"
                rm -f "$lock_file"
                continue
            fi
        fi
        
        sleep 1
        ((elapsed++))
    done
    
    log_browser_warning "Failed to acquire $resource_type lock within ${timeout}s"
    return 1
}

release_resource_lock() {
    local resource_type="$1"
    local lock_id="$2"
    local lock_file="$BROWSER_LOCK_DIR/${resource_type}_${lock_id}.lock"
    
    if [[ -f "$lock_file" ]]; then
        local lock_pid=$(cat "$lock_file" 2>/dev/null)
        if [[ "$lock_pid" == "$$" ]]; then
            rm -f "$lock_file"
            log_browser_success "Released $resource_type lock: $lock_id"
        else
            log_browser_warning "Cannot release lock owned by different process (PID: $lock_pid)"
            return 1
        fi
    else
        log_browser_warning "Lock file not found: $lock_file"
    fi
}

cleanup_stale_locks() {
    log_browser_info "Cleaning up stale resource locks..."
    
    find "$BROWSER_LOCK_DIR" -name "*.lock" -type f | while read -r lock_file; do
        if [[ -f "$lock_file" ]]; then
            local lock_pid=$(cat "$lock_file" 2>/dev/null)
            if [[ -n "$lock_pid" ]] && ! kill -0 "$lock_pid" 2>/dev/null; then
                log_browser_info "Removing stale lock: $(basename "$lock_file") (PID $lock_pid)"
                rm -f "$lock_file"
            fi
        fi
    done
}

# Browser Conflict Prevention

check_port_conflicts() {
    local port="${ACTIVE_DEV_PORT:-3000}"
    
    # Check if VS Code dev server is running on the port
    if lsof -ti ":$port" >/dev/null 2>&1; then
        local port_process=$(lsof -ti ":$port" | head -1)
        local process_name=$(ps -p "$port_process" -o comm= 2>/dev/null || echo "unknown")
        
        log_browser_info "Port $port is in use by: $process_name (PID: $port_process)"
        
        # Check if it's a development server
        if ps -p "$port_process" -o args= 2>/dev/null | grep -q "next\|dev\|serve"; then
            log_browser_success "Development server detected on port $port"
            return 0
        else
            log_browser_warning "Unexpected process on port $port: $process_name"
            return 1
        fi
    else
        log_browser_warning "No process found on port $port"
        return 1
    fi
}

coordinate_with_dev_server() {
    log_browser_info "Coordinating browser pool with development server..."
    
    # Ensure development server is available
    if ! check_port_conflicts; then
        log_browser_error "Development server coordination failed"
        return 1
    fi
    
    # Wait briefly to ensure server is stable
    sleep 1
    
    # Test server responsiveness
    local dev_url="${ACTIVE_DEV_URL:-http://localhost:${ACTIVE_DEV_PORT:-3000}}"
    if curl -s -f --max-time 5 "$dev_url" >/dev/null 2>&1; then
        log_browser_success "Development server responsive at $dev_url"
        return 0
    else
        log_browser_error "Development server not responsive at $dev_url"
        return 1
    fi
}

# Browser Pool Lifecycle Management

create_browser_pool() {
    local service_type="${1:-screenshot}"
    local browser_type="${2:-chromium}"
    
    log_browser_info "Creating browser pool for $service_type ($browser_type)"
    
    # Check system capacity
    local capacity=$(assess_system_capacity)
    if [[ "$capacity" == "at_capacity" ]]; then
        log_browser_warning "System at capacity - attempting cleanup before creating new browser"
        cleanup_idle_browsers
        
        # Re-assess after cleanup
        capacity=$(assess_system_capacity)
        if [[ "$capacity" == "at_capacity" ]]; then
            log_browser_error "Cannot create browser pool - system at capacity"
            return 1
        fi
    fi
    
    # Acquire resource lock
    local lock_id
    if ! lock_id=$(acquire_resource_lock "browser_creation" "$(generate_browser_pool_id "$service_type")"); then
        log_browser_error "Failed to acquire browser creation lock"
        return 1
    fi
    
    # Coordinate with development server
    if ! coordinate_with_dev_server; then
        release_resource_lock "browser_creation" "$lock_id"
        return 1
    fi
    
    # Create browser pool entry
    local pool_id=$(generate_browser_pool_id "$service_type")
    local pool_file="$BROWSER_POOL_DIR/$pool_id"
    
    cat > "$pool_file" << EOF
{
    "pool_id": "$pool_id",
    "service_type": "$service_type",
    "browser_type": "$browser_type",
    "created_time": $(date +%s),
    "last_used": $(date +%s),
    "port": "${ACTIVE_DEV_PORT:-3000}",
    "dev_url": "${ACTIVE_DEV_URL:-http://localhost:3000}",
    "status": "ready"
}
EOF
    
    release_resource_lock "browser_creation" "$lock_id"
    log_browser_success "Created browser pool: $pool_id"
    echo "$pool_id"
}

cleanup_browser_pool() {
    local pool_id="$1"
    local pool_file="$BROWSER_POOL_DIR/$pool_id"
    
    log_browser_info "Cleaning up browser pool: $pool_id"
    
    # Clean up associated processes
    unregister_browser_process "$pool_id"
    
    # Remove pool file
    if [[ -f "$pool_file" ]]; then
        rm -f "$pool_file"
    fi
    
    # Clean up any associated locks
    find "$BROWSER_LOCK_DIR" -name "*${pool_id}*" -type f -delete 2>/dev/null || true
    
    log_browser_success "Browser pool cleaned up: $pool_id"
}

cleanup_idle_browsers() {
    log_browser_info "Cleaning up idle browser processes..."
    
    local current_time=$(date +%s)
    local cleanup_count=0
    
    # Find and cleanup idle browser pools
    find "$BROWSER_POOL_DIR" -name "*" -type f | while read -r pool_file; do
        if [[ -f "$pool_file" ]]; then
            local created_time=$(grep -o '"created_time": [0-9]*' "$pool_file" | grep -o '[0-9]*')
            local age=$((current_time - created_time))
            
            if [[ $age -gt $BROWSER_IDLE_TIMEOUT ]]; then
                local pool_id=$(basename "$pool_file")
                cleanup_browser_pool "$pool_id"
                ((cleanup_count++))
            fi
        fi
    done
    
    # Clean up orphaned browser processes
    get_active_browser_pools | while IFS=':' read -r pool_id browser_pid; do
        if [[ -n "$browser_pid" ]]; then
            local process_age=$(ps -o etimes= -p "$browser_pid" 2>/dev/null | tr -d ' ')
            if [[ -n "$process_age" ]] && [[ $process_age -gt $BROWSER_IDLE_TIMEOUT ]]; then
                log_browser_info "Terminating idle browser process: $browser_pid"
                kill -TERM "$browser_pid" 2>/dev/null || true
                sleep 2
                kill -KILL "$browser_pid" 2>/dev/null || true
                unregister_browser_process "$pool_id"
                ((cleanup_count++))
            fi
        fi
    done
    
    if [[ $cleanup_count -gt 0 ]]; then
        log_browser_success "Cleaned up $cleanup_count idle browser resources"
    fi
}

# Monitoring and Metrics

log_browser_metrics() {
    local pool_id="$1"
    local action="$2"
    local duration="${3:-0}"
    
    local metrics_file="$BROWSER_METRICS_DIR/$(date +%Y%m%d).log"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo "[$timestamp] $pool_id | $action | ${duration}ms | Memory: $(get_browser_memory_usage)MB | Load: $(get_system_load_average)" >> "$metrics_file"
}

generate_performance_report() {
    local report_file="$BROWSER_METRICS_DIR/performance_report_$(date +%Y%m%d_%H%M%S).txt"
    
    log_browser_info "Generating browser pool performance report..."
    
    cat > "$report_file" << EOF
Browser Pool Coordinator Performance Report
Generated: $(date)

System Status:
- Memory Usage: $(get_system_memory_usage)MB
- Load Average: $(get_system_load_average)
- Browser Processes: $(get_browser_process_count)
- Browser Memory: $(get_browser_memory_usage)MB
- System Capacity: $(assess_system_capacity)

Active Browser Pools:
$(get_active_browser_pools | wc -l) pools currently active

Recent Browser Activity:
$(tail -20 "$BROWSER_METRICS_DIR/$(date +%Y%m%d).log" 2>/dev/null || echo "No recent activity")

Resource Utilization:
- Max Concurrent Browsers: $MAX_CONCURRENT_BROWSERS
- Memory Limit: ${MEMORY_LIMIT_MB}MB
- Current Browser Memory: $(get_browser_memory_usage)MB
- Utilization: $(echo "scale=1; $(get_browser_memory_usage) * 100 / $MEMORY_LIMIT_MB" | bc -l 2>/dev/null || echo "N/A")%
EOF
    
    log_browser_success "Performance report generated: $report_file"
    echo "$report_file"
}

# Main Coordinator Functions

browser_pool_coordinator() {
    local action="${1:-status}"
    local service_type="${2:-screenshot}"
    local browser_type="${3:-chromium}"
    
    case "$action" in
        "create")
            create_browser_pool "$service_type" "$browser_type"
            ;;
        "cleanup")
            cleanup_idle_browsers
            cleanup_stale_locks
            ;;
        "status")
            log_browser_info "Browser Pool Coordinator Status"
            log_browser_info "System Capacity: $(assess_system_capacity)"
            log_browser_info "Active Pools: $(get_active_browser_pools | wc -l)"
            log_browser_info "Browser Memory: $(get_browser_memory_usage)MB / ${MEMORY_LIMIT_MB}MB"
            ;;
        "monitor")
            generate_performance_report
            ;;
        "coordinate")
            coordinate_with_dev_server
            ;;
        "lock")
            acquire_resource_lock "$service_type" "$browser_type"
            ;;
        "unlock")
            release_resource_lock "$service_type" "$browser_type"
            ;;
        *)
            log_browser_error "Unknown action: $action"
            log_browser_info "Available actions: create, cleanup, status, monitor, coordinate, lock, unlock"
            return 1
            ;;
    esac
}

# Background cleanup daemon
start_cleanup_daemon() {
    if [[ ! -f "$BROWSER_POOL_DIR/.cleanup_daemon_pid" ]]; then
        (
            while true; do
                sleep "$BROWSER_CLEANUP_INTERVAL"
                cleanup_idle_browsers
                cleanup_stale_locks
            done
        ) &
        
        echo $! > "$BROWSER_POOL_DIR/.cleanup_daemon_pid"
        log_browser_success "Started browser pool cleanup daemon (PID: $!)"
    fi
}

stop_cleanup_daemon() {
    local daemon_pid_file="$BROWSER_POOL_DIR/.cleanup_daemon_pid"
    if [[ -f "$daemon_pid_file" ]]; then
        local daemon_pid=$(cat "$daemon_pid_file")
        if kill -0 "$daemon_pid" 2>/dev/null; then
            kill "$daemon_pid"
            log_browser_info "Stopped browser pool cleanup daemon (PID: $daemon_pid)"
        fi
        rm -f "$daemon_pid_file"
    fi
}

# Signal handlers for graceful shutdown
cleanup_coordinator() {
    log_browser_info "Browser pool coordinator shutting down..."
    cleanup_idle_browsers
    cleanup_stale_locks
    stop_cleanup_daemon
}

trap cleanup_coordinator EXIT

# Main execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # Script is being executed directly
    browser_pool_coordinator "$@"
fi