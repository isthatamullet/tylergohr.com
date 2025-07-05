#!/bin/bash

# Claude Code Hooks - Port Management Integration
# Provides seamless integration between port management and hooks system

set -e

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Source utilities
source "$SCRIPT_DIR/../lib/hook-utils.sh"
source "$SCRIPT_DIR/../lib/port-detection-utils.sh"

# Integration configuration
INTEGRATION_LOG="$HOME/.claude/hooks/port-management-integration.log"
INTEGRATION_CONFIG="$SCRIPT_DIR/../../config/port-management-integration.json"

# Logging functions
log_integration_info() {
    echo "$(date -Iseconds) [PORT_INTEGRATION] [INFO] $1" | tee -a "$INTEGRATION_LOG"
}

log_integration_success() {
    echo "$(date -Iseconds) [PORT_INTEGRATION] [SUCCESS] $1" | tee -a "$INTEGRATION_LOG"
}

log_integration_warning() {
    echo "$(date -Iseconds) [PORT_INTEGRATION] [WARNING] $1" | tee -a "$INTEGRATION_LOG"
}

log_integration_error() {
    echo "$(date -Iseconds) [PORT_INTEGRATION] [ERROR] $1" | tee -a "$INTEGRATION_LOG"
}

# Hook integration functions
integrate_with_pre_tool_hook() {
    local operation="$1"
    local file_path="$2"
    
    log_integration_info "Pre-tool integration for operation: $operation"
    
    # Check if port management is needed for this operation
    if should_manage_ports_for_operation "$operation" "$file_path"; then
        log_integration_info "Port management required for operation: $operation"
        
        # Discover and assess current state
        if "$PROJECT_ROOT/scripts/port-manager.sh" discover >/dev/null 2>&1; then
            log_integration_success "Port discovery completed for pre-tool hook"
        else
            log_integration_warning "Port discovery failed in pre-tool hook"
        fi
        
        # Quick health assessment
        if "$PROJECT_ROOT/scripts/port-manager.sh" assess >/dev/null 2>&1; then
            log_integration_success "Port health assessment completed"
        else
            log_integration_warning "Port health assessment failed"
        fi
        
        # Export optimal port for hook operations
        if eval "$("$PROJECT_ROOT/scripts/port-manager.sh" select 2>/dev/null)"; then
            log_integration_success "Optimal port selected: $ACTIVE_DEV_PORT"
            return 0
        else
            log_integration_error "Failed to select optimal port"
            return 1
        fi
    else
        log_integration_info "Port management not required for operation: $operation"
        return 0
    fi
}

integrate_with_post_tool_hook() {
    local operation="$1"
    local file_path="$2"
    local hook_result="$3"
    
    log_integration_info "Post-tool integration for operation: $operation (result: $hook_result)"
    
    # If hook operation was successful and involves server operations
    if [[ "$hook_result" == "0" ]] && should_optimize_ports_after_operation "$operation" "$file_path"; then
        log_integration_info "Port optimization required after operation: $operation"
        
        # Cleanup unhealthy servers
        if "$PROJECT_ROOT/scripts/port-manager.sh" cleanup >/dev/null 2>&1; then
            log_integration_success "Post-operation port cleanup completed"
        else
            log_integration_warning "Post-operation port cleanup failed"
        fi
        
        # Consolidate to optimal server
        if "$PROJECT_ROOT/scripts/port-manager.sh" consolidate >/dev/null 2>&1; then
            log_integration_success "Post-operation port consolidation completed"
        else
            log_integration_warning "Post-operation port consolidation failed"
        fi
        
        # Cache optimal configuration
        if "$PROJECT_ROOT/scripts/port-manager.sh" select >/dev/null 2>&1; then
            log_integration_success "Post-operation optimal port cached"
        else
            log_integration_warning "Post-operation port caching failed"
        fi
    else
        log_integration_info "Port optimization not required for operation: $operation"
    fi
    
    return 0
}

integrate_with_notification_hook() {
    local context="$1"
    
    log_integration_info "Notification integration for context: $context"
    
    # Generate port management report for notification context
    local report_file
    if report_file=$("$PROJECT_ROOT/scripts/port-manager.sh" report 2>/dev/null); then
        log_integration_success "Port management report generated: $report_file"
        
        # Extract key metrics for notification
        local total_servers=$(grep -o '"total_servers":[0-9]*' "$report_file" | cut -d: -f2)
        local healthy_servers=$(grep -o '"healthy_servers":[0-9]*' "$report_file" | cut -d: -f2)
        local optimal_port=$(grep -o '"optimal_port":[0-9]*' "$report_file" | cut -d: -f2)
        
        if [[ -n "$total_servers" && -n "$healthy_servers" && -n "$optimal_port" ]]; then
            log_integration_success "Port metrics: $healthy_servers/$total_servers servers healthy, optimal port: $optimal_port"
            
            # Set environment variables for notification hook
            export PORT_MANAGEMENT_TOTAL_SERVERS="$total_servers"
            export PORT_MANAGEMENT_HEALTHY_SERVERS="$healthy_servers"
            export PORT_MANAGEMENT_OPTIMAL_PORT="$optimal_port"
            
            return 0
        else
            log_integration_warning "Failed to extract port metrics from report"
            return 1
        fi
    else
        log_integration_warning "Failed to generate port management report"
        return 1
    fi
}

integrate_with_stop_hook() {
    local context="$1"
    
    log_integration_info "Stop hook integration for context: $context"
    
    # Perform final cleanup and optimization
    if "$PROJECT_ROOT/scripts/port-manager.sh" full-cycle >/dev/null 2>&1; then
        log_integration_success "Final port management cycle completed"
    else
        log_integration_warning "Final port management cycle failed"
    fi
    
    # Clear any stale caches
    if "$PROJECT_ROOT/scripts/port-manager.sh" clear-cache >/dev/null 2>&1; then
        log_integration_success "Port management cache cleared"
    else
        log_integration_warning "Port management cache cleanup failed"
    fi
    
    return 0
}

# Decision functions
should_manage_ports_for_operation() {
    local operation="$1"
    local file_path="$2"
    
    # Port management is needed for:
    case "$operation" in
        "Edit"|"MultiEdit"|"Write")
            # Check if editing files that might affect server
            if [[ "$file_path" =~ \.(tsx?|jsx?|css|scss|json)$ ]]; then
                return 0
            fi
            ;;
        "Bash")
            # Check if bash command might start/stop servers
            if [[ "$file_path" =~ (npm|yarn|pnpm|next|dev|build|start) ]]; then
                return 0
            fi
            ;;
        "NotebookEdit"|"NotebookRead")
            # Notebook operations might need server access
            return 0
            ;;
    esac
    
    return 1
}

should_optimize_ports_after_operation() {
    local operation="$1"
    local file_path="$2"
    
    # Port optimization is needed after:
    case "$operation" in
        "Bash")
            # After bash commands that might affect servers
            if [[ "$file_path" =~ (npm|yarn|pnpm|next|dev|build|start|kill|pkill) ]]; then
                return 0
            fi
            ;;
        "Edit"|"MultiEdit"|"Write")
            # After editing package.json or server configuration
            if [[ "$file_path" =~ (package\.json|next\.config\.|tsconfig\.json|\.env) ]]; then
                return 0
            fi
            ;;
    esac
    
    return 1
}

# Configuration management
load_integration_config() {
    if [[ -f "$INTEGRATION_CONFIG" ]]; then
        log_integration_info "Loading integration configuration from $INTEGRATION_CONFIG"
        # Could load JSON config here if needed
    else
        log_integration_info "No integration configuration found, using defaults"
    fi
}

save_integration_config() {
    local config_dir="$(dirname "$INTEGRATION_CONFIG")"
    mkdir -p "$config_dir"
    
    cat > "$INTEGRATION_CONFIG" << EOF
{
  "integration_version": "1.0.0",
  "enabled": true,
  "port_management_enabled": true,
  "auto_cleanup_enabled": true,
  "auto_consolidation_enabled": true,
  "health_check_enabled": true,
  "performance_monitoring_enabled": true,
  "last_updated": "$(date -Iseconds)"
}
EOF
    
    log_integration_success "Integration configuration saved to $INTEGRATION_CONFIG"
}

# Utility functions
get_port_management_status() {
    local report_file
    if report_file=$("$PROJECT_ROOT/scripts/port-manager.sh" report 2>/dev/null); then
        echo "Port management status: Active"
        echo "Report location: $report_file"
        
        # Extract key information
        local total_servers=$(grep -o '"total_servers":[0-9]*' "$report_file" | cut -d: -f2)
        local healthy_servers=$(grep -o '"healthy_servers":[0-9]*' "$report_file" | cut -d: -f2)
        local optimal_port=$(grep -o '"optimal_port":[0-9]*' "$report_file" | cut -d: -f2)
        
        echo "Servers: $healthy_servers/$total_servers healthy"
        echo "Optimal port: $optimal_port"
        
        return 0
    else
        echo "Port management status: Unavailable"
        return 1
    fi
}

perform_port_health_check() {
    log_integration_info "Performing port health check..."
    
    if "$PROJECT_ROOT/scripts/port-manager.sh" assess >/dev/null 2>&1; then
        log_integration_success "Port health check completed successfully"
        return 0
    else
        log_integration_error "Port health check failed"
        return 1
    fi
}

# Main integration interface
case "${1:-status}" in
    "pre-tool")
        integrate_with_pre_tool_hook "$2" "$3"
        ;;
    "post-tool")
        integrate_with_post_tool_hook "$2" "$3" "$4"
        ;;
    "notification")
        integrate_with_notification_hook "$2"
        ;;
    "stop")
        integrate_with_stop_hook "$2"
        ;;
    "status")
        get_port_management_status
        ;;
    "health-check")
        perform_port_health_check
        ;;
    "config-save")
        save_integration_config
        ;;
    "config-load")
        load_integration_config
        ;;
    *)
        echo "Usage: $0 {pre-tool|post-tool|notification|stop|status|health-check|config-save|config-load}"
        exit 1
        ;;
esac