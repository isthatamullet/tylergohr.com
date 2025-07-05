#!/bin/bash

# Tyler Gohr Portfolio - Advanced Port Management System
# Comprehensive port management strategy for development environment cleanup and optimization
# Handles complex port scenarios, multi-server conflicts, and provides intelligent cleanup

set -e

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source utilities
source "$SCRIPT_DIR/hooks/lib/hook-utils.sh" 2>/dev/null || {
    # Fallback logging functions
    log_info() { echo -e "\e[34m[INFO]\e[0m $*"; }
    log_success() { echo -e "\e[32m[SUCCESS]\e[0m $*"; }
    log_warning() { echo -e "\e[33m[WARNING]\e[0m $*"; }
    log_error() { echo -e "\e[31m[ERROR]\e[0m $*"; }
}

source "$SCRIPT_DIR/testing/lib/cloud-environment-utils.sh" 2>/dev/null || {
    echo "Warning: Cloud environment utilities not found"
    detect_environment() { echo "local"; }
    construct_test_url() { echo "http://localhost:$1"; }
    validate_nextjs_server_cloud() { 
        curl -s -o /dev/null -w "%{http_code}" --max-time "${2:-5}" "http://localhost:$1" | grep -q "200"
    }
}

# Configuration
PORT_RANGE_START=3000
PORT_RANGE_END=4010
MAX_CONCURRENT_SERVERS=1  # Optimal for development
HEALTH_CHECK_TIMEOUT=10
CLEANUP_GRACE_PERIOD=5
LOCK_FILE="/tmp/port-manager.lock"
LOG_FILE="/tmp/port-manager.log"

# Server health states
declare -A SERVER_HEALTH
declare -A SERVER_PIDS
declare -A SERVER_PORTS
declare -A SERVER_RESPONSIVENESS

# Lock management
acquire_lock() {
    local max_wait=30
    local waited=0
    
    while [[ -f "$LOCK_FILE" ]] && [[ $waited -lt $max_wait ]]; do
        log_info "Waiting for port manager lock..."
        sleep 1
        ((waited++))
    done
    
    if [[ -f "$LOCK_FILE" ]]; then
        log_error "Failed to acquire lock after ${max_wait}s"
        return 1
    fi
    
    echo $$ > "$LOCK_FILE"
}

release_lock() {
    rm -f "$LOCK_FILE"
}

# Cleanup on exit
cleanup_on_exit() {
    release_lock
    exit 0
}

trap cleanup_on_exit EXIT INT TERM

# Enhanced server discovery with health assessment
discover_all_servers() {
    log_info "🔍 Discovering all Next.js development servers..."
    
    # Clear previous state
    SERVER_HEALTH=()
    SERVER_PIDS=()
    SERVER_PORTS=()
    SERVER_RESPONSIVENESS=()
    
    # Method 1: Process-based discovery
    log_info "Phase 1: Process-based discovery"
    local nextjs_processes=$(ps aux | grep -E "next-server|next dev" | grep -v grep | awk '{print $2}')
    
    for pid in $nextjs_processes; do
        if kill -0 "$pid" 2>/dev/null; then
            # More efficient: check only commonly used ports first
            for port in 3000 3001 3002 3003; do
                local port_pid=$(fuser -n tcp "$port" 2>/dev/null | tr -d ' ')
                if [[ "$port_pid" == "$pid" ]]; then
                    SERVER_PIDS[$port]=$pid
                    SERVER_PORTS[$port]=$port
                    log_info "Found Next.js server: PID=$pid, Port=$port"
                    break  # Found the port, no need to check others for this PID
                fi
            done
        fi
    done
    
    # Method 2: Network-based discovery (catch orphaned ports)
    log_info "Phase 2: Network-based discovery"
    local active_ports=$(netstat -tuln 2>/dev/null | grep LISTEN | grep -E ":[0-9]+" | grep -o ":[0-9]\+" | cut -d: -f2 | sort -n | uniq)
    
    for port in $active_ports; do
        if [[ $port -ge $PORT_RANGE_START ]] && [[ $port -le $PORT_RANGE_END ]]; then
            if [[ -z "${SERVER_PORTS[$port]}" ]]; then
                # Port is active but not associated with a known process
                local pid=$(fuser -n tcp "$port" 2>/dev/null | tr -d ' ')
                if [[ -n "$pid" ]]; then
                    SERVER_PIDS[$port]=$pid
                    SERVER_PORTS[$port]=$port
                    log_warning "Found orphaned port: $port (PID: $pid)"
                fi
            fi
        fi
    done
    
    log_info "Total servers discovered: ${#SERVER_PORTS[@]}"
}

# Health check with detailed assessment
assess_server_health() {
    log_info "🏥 Assessing server health..."
    
    local healthy_count=0
    local unhealthy_count=0
    local timeout_count=0
    
    for port in "${SERVER_PORTS[@]}"; do
        local pid=${SERVER_PIDS[$port]}
        local start_time=$(date +%s)
        
        log_info "Testing server health: Port=$port, PID=$pid"
        
        # Check if process is still running
        if ! kill -0 "$pid" 2>/dev/null; then
            SERVER_HEALTH[$port]="dead_process"
            log_warning "Server $port: Process $pid is dead"
            ((unhealthy_count++))
            continue
        fi
        
        # Check HTTP responsiveness
        local response_code=""
        local url=$(construct_test_url "$port")
        
        response_code=$(timeout $HEALTH_CHECK_TIMEOUT curl -s -o /dev/null -w "%{http_code}" --max-time $HEALTH_CHECK_TIMEOUT "$url" 2>/dev/null || echo "timeout")
        
        local end_time=$(date +%s)
        local response_time=$((end_time - start_time))
        SERVER_RESPONSIVENESS[$port]=$response_time
        
        case "$response_code" in
            "200"|"302"|"304")
                SERVER_HEALTH[$port]="healthy"
                log_success "Server $port: Healthy (${response_code}) (${response_time}s response)"
                ((healthy_count++))
                ;;
            "timeout")
                SERVER_HEALTH[$port]="timeout"
                log_warning "Server $port: Timeout after ${HEALTH_CHECK_TIMEOUT}s"
                ((timeout_count++))
                ;;
            "000")
                SERVER_HEALTH[$port]="unresponsive"
                log_warning "Server $port: Unresponsive (connection failed)"
                ((unhealthy_count++))
                ;;
            *)
                SERVER_HEALTH[$port]="error_$response_code"
                log_warning "Server $port: Error response $response_code"
                ((unhealthy_count++))
                ;;
        esac
    done
    
    log_info "Health assessment complete: $healthy_count healthy, $unhealthy_count unhealthy, $timeout_count timeout"
    
    # Return counts for decision making
    echo "$healthy_count:$unhealthy_count:$timeout_count"
}

# Smart cleanup strategy
cleanup_unhealthy_servers() {
    log_info "🧹 Cleaning up unhealthy servers..."
    
    local cleaned_count=0
    local failed_count=0
    
    for port in "${!SERVER_HEALTH[@]}"; do
        local health=${SERVER_HEALTH[$port]}
        local pid=${SERVER_PIDS[$port]}
        
        case "$health" in
            "dead_process"|"unresponsive"|"timeout")
                log_info "Cleaning up unhealthy server: Port=$port, PID=$pid, Health=$health"
                
                if kill -0 "$pid" 2>/dev/null; then
                    # Try graceful shutdown first
                    log_info "Attempting graceful shutdown of PID $pid..."
                    kill -TERM "$pid" 2>/dev/null || true
                    
                    # Wait for graceful shutdown
                    local wait_count=0
                    while kill -0 "$pid" 2>/dev/null && [[ $wait_count -lt $CLEANUP_GRACE_PERIOD ]]; do
                        sleep 1
                        ((wait_count++))
                    done
                    
                    # Force kill if still running
                    if kill -0 "$pid" 2>/dev/null; then
                        log_warning "Force killing PID $pid..."
                        kill -9 "$pid" 2>/dev/null || true
                        sleep 1
                    fi
                    
                    # Verify cleanup
                    if kill -0 "$pid" 2>/dev/null; then
                        log_error "Failed to cleanup PID $pid"
                        ((failed_count++))
                    else
                        log_success "Successfully cleaned up Port=$port, PID=$pid"
                        ((cleaned_count++))
                        unset SERVER_HEALTH[$port]
                        unset SERVER_PIDS[$port]
                        unset SERVER_PORTS[$port]
                        unset SERVER_RESPONSIVENESS[$port]
                    fi
                else
                    log_info "Process $pid already dead, cleaning up references"
                    ((cleaned_count++))
                    unset SERVER_HEALTH[$port]
                    unset SERVER_PIDS[$port]
                    unset SERVER_PORTS[$port]
                    unset SERVER_RESPONSIVENESS[$port]
                fi
                ;;
            "healthy")
                log_info "Keeping healthy server: Port=$port, PID=$pid"
                ;;
            *)
                log_warning "Unknown health state '$health' for Port=$port, PID=$pid"
                ;;
        esac
    done
    
    log_info "Cleanup complete: $cleaned_count cleaned, $failed_count failed"
    return $failed_count
}

# Intelligent port selection for optimal performance
select_optimal_port() {
    log_info "🎯 Selecting optimal port for development..."
    
    local healthy_ports=()
    local best_port=""
    local best_response_time=999
    
    # Collect healthy ports
    for port in "${!SERVER_HEALTH[@]}"; do
        if [[ "${SERVER_HEALTH[$port]}" == "healthy" ]]; then
            healthy_ports+=("$port")
        fi
    done
    
    if [[ ${#healthy_ports[@]} -eq 0 ]]; then
        log_warning "No healthy servers found"
        return 1
    fi
    
    # If only one healthy server, use it
    if [[ ${#healthy_ports[@]} -eq 1 ]]; then
        best_port=${healthy_ports[0]}
        log_success "Single healthy server selected: Port=$best_port"
    else
        # Multiple healthy servers - select based on performance
        log_info "Multiple healthy servers found, selecting best performer..."
        
        for port in "${healthy_ports[@]}"; do
            local response_time=${SERVER_RESPONSIVENESS[$port]:-999}
            log_info "Port $port: Response time = ${response_time}s"
            
            if [[ $response_time -lt $best_response_time ]]; then
                best_response_time=$response_time
                best_port=$port
            fi
        done
        
        log_success "Best performing server selected: Port=$best_port (${best_response_time}s response)"
    fi
    
    # Export the optimal port
    export ACTIVE_DEV_PORT="$best_port"
    export ACTIVE_DEV_URL="$(construct_test_url "$best_port")"
    
    # Cache the selection
    if [[ -n "$best_port" ]]; then
        cache_optimal_port "$best_port"
    fi
    
    echo "$best_port"
}

# Cache management for optimal port selection
cache_optimal_port() {
    local port="$1"
    local cache_dir="$HOME/.claude/hooks"
    local cache_file="$cache_dir/optimal-port.cache"
    
    mkdir -p "$cache_dir"
    
    cat > "$cache_file" << EOF
{
  "port": $port,
  "timestamp": $(date +%s),
  "environment": "$(detect_environment)",
  "validation_url": "$(construct_test_url "$port")",
  "health_status": "${SERVER_HEALTH[$port]:-unknown}",
  "response_time": ${SERVER_RESPONSIVENESS[$port]:-0},
  "pid": ${SERVER_PIDS[$port]:-0}
}
EOF
    
    log_info "Cached optimal port: $port"
}

# Consolidate multiple servers to single optimal instance
consolidate_servers() {
    log_info "🔄 Consolidating multiple servers to optimal instance..."
    
    local healthy_count=$(echo "${!SERVER_HEALTH[@]}" | wc -w)
    
    if [[ $healthy_count -le $MAX_CONCURRENT_SERVERS ]]; then
        log_info "Server count ($healthy_count) within optimal range ($MAX_CONCURRENT_SERVERS)"
        return 0
    fi
    
    # Select optimal port first
    local optimal_port=$(select_optimal_port)
    
    if [[ -z "$optimal_port" ]]; then
        log_error "Failed to select optimal port"
        return 1
    fi
    
    # Clean up all servers except the optimal one
    local consolidated_count=0
    for port in "${!SERVER_HEALTH[@]}"; do
        if [[ "$port" != "$optimal_port" && "${SERVER_HEALTH[$port]}" == "healthy" ]]; then
            local pid=${SERVER_PIDS[$port]}
            log_info "Consolidating: Stopping server on port $port (PID: $pid)"
            
            # Graceful shutdown
            kill -TERM "$pid" 2>/dev/null || true
            sleep 2
            
            # Force kill if needed
            if kill -0 "$pid" 2>/dev/null; then
                kill -9 "$pid" 2>/dev/null || true
            fi
            
            ((consolidated_count++))
        fi
    done
    
    log_success "Consolidated $consolidated_count servers, optimal port: $optimal_port"
    return 0
}

# Generate comprehensive report
generate_report() {
    local report_file="/tmp/port-manager-report.json"
    
    cat > "$report_file" << EOF
{
  "timestamp": "$(date -Iseconds)",
  "environment": "$(detect_environment)",
  "scan_summary": {
    "total_servers": ${#SERVER_PORTS[@]},
    "healthy_servers": $(echo "${SERVER_HEALTH[@]}" | grep -o "healthy" | wc -l),
    "unhealthy_servers": $(echo "${SERVER_HEALTH[@]}" | grep -v "healthy" | wc -l)
  },
  "servers": [
EOF
    
    local first=true
    for port in "${!SERVER_HEALTH[@]}"; do
        if [[ "$first" != "true" ]]; then
            echo "," >> "$report_file"
        fi
        first=false
        
        cat >> "$report_file" << EOF
    {
      "port": $port,
      "pid": ${SERVER_PIDS[$port]:-null},
      "health": "${SERVER_HEALTH[$port]:-unknown}",
      "response_time": ${SERVER_RESPONSIVENESS[$port]:-null},
      "url": "$(construct_test_url "$port")"
    }
EOF
    done
    
    cat >> "$report_file" << EOF
  ],
  "optimal_port": ${ACTIVE_DEV_PORT:-null},
  "optimal_url": "${ACTIVE_DEV_URL:-null}"
}
EOF
    
    log_success "Report generated: $report_file"
    echo "$report_file"
}

# Main execution modes
show_usage() {
    cat << EOF
Tyler Gohr Portfolio - Advanced Port Management System

USAGE:
    $0 <command> [options]

COMMANDS:
    discover        - Discover all Next.js servers
    assess          - Assess server health
    cleanup         - Clean up unhealthy servers
    consolidate     - Consolidate to single optimal server
    select          - Select optimal port for development
    report          - Generate detailed report
    full-cycle      - Complete management cycle (discover -> assess -> cleanup -> consolidate)
    
    # Resilience testing commands
    create-chaos    - Create complex port scenario for testing
    stress-test     - Test system under stress conditions
    recovery-test   - Test recovery from various failure scenarios

OPTIONS:
    --force         - Force operations without confirmation
    --dry-run       - Show what would be done without executing
    --quiet         - Suppress informational output
    --timeout=N     - Set health check timeout (default: $HEALTH_CHECK_TIMEOUT)

EXAMPLES:
    # Complete management cycle
    $0 full-cycle
    
    # Just discover and assess
    $0 discover && $0 assess
    
    # Cleanup and consolidate
    $0 cleanup && $0 consolidate
    
    # Create testing scenario
    $0 create-chaos
    
    # Generate report
    $0 report

INTEGRATION:
    This tool is designed to integrate with Tyler's Claude Code hooks system.
    It provides detailed information that can be passed back to hooks for
    workflow optimization.

EOF
}

# Commands implementation
cmd_discover() {
    if ! acquire_lock; then
        return 1
    fi
    
    discover_all_servers
    
    echo "Discovered servers:"
    for port in "${SERVER_PORTS[@]}"; do
        echo "  Port: $port, PID: ${SERVER_PIDS[$port]}"
    done
}

cmd_assess() {
    if [[ ${#SERVER_PORTS[@]} -eq 0 ]]; then
        log_warning "No servers discovered yet. Running discovery first..."
        discover_all_servers
        if [[ ${#SERVER_PORTS[@]} -eq 0 ]]; then
            log_warning "No servers found after discovery."
            return 1
        fi
    fi
    
    assess_server_health
    
    echo "Health assessment:"
    for port in "${!SERVER_HEALTH[@]}"; do
        echo "  Port: $port, Health: ${SERVER_HEALTH[$port]}, Response: ${SERVER_RESPONSIVENESS[$port]:-N/A}s"
    done
}

cmd_cleanup() {
    if [[ ${#SERVER_PORTS[@]} -eq 0 ]]; then
        log_warning "No servers discovered yet. Run 'discover' first."
        return 1
    fi
    
    cleanup_unhealthy_servers
}

cmd_consolidate() {
    if [[ ${#SERVER_PORTS[@]} -eq 0 ]]; then
        log_warning "No servers discovered yet. Run 'discover' first."
        return 1
    fi
    
    consolidate_servers
}

cmd_select() {
    if [[ ${#SERVER_PORTS[@]} -eq 0 ]]; then
        log_warning "No servers discovered yet. Run 'discover' first."
        return 1
    fi
    
    local optimal_port=$(select_optimal_port)
    if [[ -n "$optimal_port" ]]; then
        echo "Optimal port: $optimal_port"
        echo "URL: $ACTIVE_DEV_URL"
        echo "export ACTIVE_DEV_PORT=\"$optimal_port\""
        echo "export ACTIVE_DEV_URL=\"$ACTIVE_DEV_URL\""
    fi
}

cmd_report() {
    generate_report
}

cmd_full_cycle() {
    log_info "🚀 Starting full port management cycle..."
    
    if ! acquire_lock; then
        return 1
    fi
    
    discover_all_servers
    
    if [[ ${#SERVER_PORTS[@]} -eq 0 ]]; then
        log_warning "No servers found. Consider starting development server."
        return 1
    fi
    
    assess_server_health
    cleanup_unhealthy_servers
    
    # Re-discover after cleanup
    discover_all_servers
    
    if [[ ${#SERVER_PORTS[@]} -gt 0 ]]; then
        consolidate_servers
        select_optimal_port
    fi
    
    generate_report
    
    log_success "Full cycle complete. Optimal port: ${ACTIVE_DEV_PORT:-none}"
}

# Resilience testing commands
cmd_create_chaos() {
    log_info "🔥 Creating complex port scenario for testing..."
    
    # Start multiple servers on different ports
    for port in 3001 3002 3003; do
        if ! netstat -tuln | grep -q ":$port "; then
            log_info "Starting server on port $port..."
            PORT=$port npm run dev > "/tmp/server-$port.log" 2>&1 &
            echo $! > "/tmp/server-$port.pid"
        fi
    done
    
    # Wait for servers to start
    sleep 10
    
    # Create some hanging processes
    log_info "Creating hanging processes..."
    (sleep 300 & echo $! > "/tmp/hanging-process.pid")
    
    log_success "Chaos scenario created. Use 'full-cycle' to test cleanup."
}

cmd_stress_test() {
    log_info "🔧 Starting stress test..."
    
    # Rapid discovery cycles
    for i in {1..10}; do
        log_info "Stress cycle $i/10"
        discover_all_servers
        assess_server_health
        sleep 1
    done
    
    log_success "Stress test complete."
}

cmd_recovery_test() {
    log_info "🔄 Testing recovery scenarios..."
    
    # Test recovery from network issues
    log_info "Testing network timeout recovery..."
    HEALTH_CHECK_TIMEOUT=1 assess_server_health
    
    # Test recovery from process death
    log_info "Testing process death recovery..."
    discover_all_servers
    
    log_success "Recovery test complete."
}

# Main execution
main() {
    local command="${1:-help}"
    shift || true
    
    case "$command" in
        "discover")
            cmd_discover "$@"
            ;;
        "assess")
            cmd_assess "$@"
            ;;
        "cleanup")
            cmd_cleanup "$@"
            ;;
        "consolidate")
            cmd_consolidate "$@"
            ;;
        "select")
            cmd_select "$@"
            ;;
        "report")
            cmd_report "$@"
            ;;
        "full-cycle")
            cmd_full_cycle "$@"
            ;;
        "create-chaos")
            cmd_create_chaos "$@"
            ;;
        "stress-test")
            cmd_stress_test "$@"
            ;;
        "recovery-test")
            cmd_recovery_test "$@"
            ;;
        "help"|"-h"|"--help")
            show_usage
            ;;
        *)
            log_error "Unknown command: $command"
            show_usage
            exit 1
            ;;
    esac
}

# Execute if called directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi