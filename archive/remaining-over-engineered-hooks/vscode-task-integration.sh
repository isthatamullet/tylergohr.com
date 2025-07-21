#!/bin/bash

# VS Code Task Integration for Claude Hooks System
# Provides shell integration for VS Code Tasks-managed development servers
# Eliminates complex port detection by using explicit configuration

# Source common utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/hook-utils.sh"

# VS Code Task Integration Configuration
VSCODE_TASKS_CONFIG=".vscode/tasks.json"
VSCODE_SETTINGS_CONFIG=".vscode/settings.json"

# Logging functions specific to VS Code integration
log_vscode_info() {
    log_info "[VSCODE_TASKS] $1"
}

log_vscode_success() {
    log_success "[VSCODE_TASKS] $1"
}

log_vscode_warning() {
    log_warning "[VSCODE_TASKS] $1"
}

log_vscode_error() {
    log_error "[VSCODE_TASKS] $1"
}

# Function to get task-managed port from environment or VS Code settings
get_task_managed_port() {
    log_vscode_info "Checking for task-managed port configuration..."
    
    # Method 1: Check if we're in a task-managed environment
    if [[ "$DEV_SERVER_MANAGED" == "true" ]]; then
        # Use the explicitly set environment variables
        if [[ -n "$ACTIVE_DEV_PORT" ]]; then
            log_vscode_success "Using task-managed environment port: $ACTIVE_DEV_PORT"
            echo "$ACTIVE_DEV_PORT"
            return 0
        fi
    fi
    
    # Method 2: Check VS Code settings for tylergohr.devServerPort
    if [[ -f "$VSCODE_SETTINGS_CONFIG" ]]; then
        local port=$(grep -o '"tylergohr.devServerPort":[[:space:]]*[0-9]*' "$VSCODE_SETTINGS_CONFIG" | grep -o '[0-9]*$')
        if [[ -n "$port" ]]; then
            log_vscode_success "Using VS Code settings port: $port"
            echo "$port"
            return 0
        fi
    fi
    
    # Method 3: Check workspace file for port configuration
    local workspace_file=$(find . -name "*.code-workspace" -maxdepth 1 | head -1)
    if [[ -f "$workspace_file" ]]; then
        local port=$(grep -o '"tylergohr.devServerPort":[[:space:]]*[0-9]*' "$workspace_file" | grep -o '[0-9]*$')
        if [[ -n "$port" ]]; then
            log_vscode_success "Using workspace file port: $port"
            echo "$port"
            return 0
        fi
    fi
    
    log_vscode_warning "No task-managed port configuration found"
    return 1
}

# Function to get task-managed URL (cloud-aware)
get_task_managed_url() {
    local port="$1"
    
    # Check if we have an explicitly set URL from task environment
    if [[ -n "$ACTIVE_DEV_URL" ]]; then
        echo "$ACTIVE_DEV_URL"
        return 0
    fi
    
    # Construct cloud-aware URL
    if [[ -n "$CODESPACE_NAME" ]]; then
        # GitHub Codespaces environment
        echo "https://${CODESPACE_NAME}-${port}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
    elif [[ -n "$GITPOD_WORKSPACE_ID" ]]; then
        # Gitpod environment
        echo "https://${port}-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}"
    else
        # Local development
        echo "http://localhost:${port}"
    fi
}

# Function to validate that a port is serving the application
validate_task_managed_port() {
    local port="$1"
    local timeout="${2:-5}"
    
    if [[ -z "$port" ]]; then
        return 1
    fi
    
    local test_url=$(get_task_managed_url "$port")
    log_vscode_info "Validating server on $test_url (timeout: ${timeout}s)"
    
    if timeout "$timeout" curl -s "$test_url" >/dev/null 2>&1; then
        log_vscode_success "Server validated on port $port"
        return 0
    else
        log_vscode_warning "Server not responsive on port $port"
        return 1
    fi
}

# Function to ensure dev server is running (VS Code task-aware)
ensure_dev_server_running() {
    local target_port="${1:-3000}"
    local max_wait_time="${2:-60}"
    
    log_vscode_info "Ensuring dev server is running on port $target_port..."
    
    # Check if server is already running
    if validate_task_managed_port "$target_port" 2; then
        export ACTIVE_DEV_PORT="$target_port"
        export ACTIVE_DEV_URL=$(get_task_managed_url "$target_port")
        log_vscode_success "Dev server already running on port $target_port"
        return 0
    fi
    
    # Check if we're in VS Code and can start server via task
    if command -v code >/dev/null 2>&1 && [[ -f "$VSCODE_TASKS_CONFIG" ]]; then
        log_vscode_info "Starting dev server via VS Code task..."
        
        # Try to run the VS Code task
        code --new-window . --command "workbench.action.tasks.runTask" --args "Dev Server - Port $target_port" &
        
        # Wait for server to be ready
        local elapsed=0
        local check_interval=2
        
        while [[ $elapsed -lt $max_wait_time ]]; do
            sleep $check_interval
            elapsed=$((elapsed + check_interval))
            
            if validate_task_managed_port "$target_port" 2; then
                export ACTIVE_DEV_PORT="$target_port"
                export ACTIVE_DEV_URL=$(get_task_managed_url "$target_port")
                log_vscode_success "Dev server ready on port $target_port (took ${elapsed}s)"
                return 0
            fi
            
            log_vscode_info "Waiting for dev server... (${elapsed}s/${max_wait_time}s)"
        done
        
        log_vscode_error "Timeout waiting for dev server to start via VS Code task"
        return 1
    else
        log_vscode_warning "VS Code or tasks.json not available - cannot start server automatically"
        return 1
    fi
}

# Function to get port with enhanced fallback chain (integrates with existing system)
get_port_with_task_fallback() {
    local context="${1:-general}"
    
    log_vscode_info "Enhanced port detection with task-managed fallback..."
    
    # NEW: Try task-managed port first (highest priority)
    local task_port=$(get_task_managed_port)
    if [[ -n "$task_port" ]] && validate_task_managed_port "$task_port" 2; then
        export ACTIVE_DEV_PORT="$task_port"
        export ACTIVE_DEV_URL=$(get_task_managed_url "$task_port")
        log_vscode_success "Using task-managed port: $task_port"
        return 0
    fi
    
    # NEW: Quick common port check second (5 seconds maximum)
    log_vscode_info "Task-managed port not available, trying quick detection..."
    local common_ports=(3000 3001 4000 8000)
    for port in "${common_ports[@]}"; do
        if timeout 1 curl -s "http://localhost:$port" >/dev/null 2>&1; then
            export ACTIVE_DEV_PORT="$port"
            export ACTIVE_DEV_URL=$(get_task_managed_url "$port")
            log_vscode_success "Using quick-detected port: $port"
            return 0
        fi
    done
    
    # FALLBACK: Try to use existing port detection system
    log_vscode_info "Quick detection failed, checking for existing port detection system..."
    if [[ -f "$SCRIPT_DIR/port-detection-utils.sh" ]]; then
        source "$SCRIPT_DIR/port-detection-utils.sh"
        if get_active_port "$context"; then
            log_vscode_success "Using existing port detection result: $ACTIVE_DEV_PORT"
            return 0
        fi
    fi
    
    # FINAL FALLBACK: Default port
    export ACTIVE_DEV_PORT="3000"
    export ACTIVE_DEV_URL=$(get_task_managed_url "3000")
    log_vscode_warning "Using default port: 3000"
    return 0
}

# Function to check if VS Code tasks are available
check_vscode_tasks_available() {
    if [[ ! -f "$VSCODE_TASKS_CONFIG" ]]; then
        log_vscode_warning "VS Code tasks.json not found at $VSCODE_TASKS_CONFIG"
        return 1
    fi
    
    if ! command -v code >/dev/null 2>&1; then
        log_vscode_warning "VS Code CLI not available"
        return 1
    fi
    
    log_vscode_success "VS Code tasks system available"
    return 0
}

# Function to provide guidance on using VS Code tasks
provide_vscode_task_guidance() {
    echo ""
    echo "🔧 VS Code Task Integration Available"
    echo "   Use Command Palette (F1) with these tasks:"
    echo "   • 'Dev Server - Port 3000' - Start development server"
    echo "   • 'Test: E2E Quick Screenshots' - Generate screenshots"
    echo "   • 'Full E2E Test Suite' - Complete testing workflow"
    echo "   • 'Quality Gates: Full Validation' - TypeScript + Lint + Build"
    echo ""
    echo "   Or use npm scripts:"
    echo "   • npm run vscode:dev-server"
    echo "   • npm run vscode:test-suite"
    echo ""
}

# Function to migrate from complex port detection to task-managed
migrate_to_task_managed() {
    log_vscode_info "Migrating from complex port detection to task-managed system..."
    
    # Check if VS Code configuration exists
    if check_vscode_tasks_available; then
        log_vscode_success "VS Code tasks system detected - migration ready"
        provide_vscode_task_guidance
        return 0
    else
        log_vscode_error "VS Code tasks system not available - cannot migrate"
        return 1
    fi
}

# Override the ensure_active_port function from hook-utils.sh with task-aware version
ensure_active_port_task_managed() {
    log_vscode_info "Task-managed port detection starting..."
    
    # Use enhanced fallback chain
    if get_port_with_task_fallback "task-managed"; then
        log_vscode_success "Active port: $ACTIVE_DEV_PORT"
        log_vscode_info "Active URL: $ACTIVE_DEV_URL"
        return 0
    else
        log_vscode_error "Failed to determine active port"
        return 1
    fi
}

# Export functions for use in hooks
export -f get_task_managed_port
export -f get_task_managed_url
export -f validate_task_managed_port
export -f ensure_dev_server_running
export -f get_port_with_task_fallback
export -f check_vscode_tasks_available
export -f provide_vscode_task_guidance
export -f migrate_to_task_managed
export -f ensure_active_port_task_managed

# Mark as loaded
export VSCODE_TASK_INTEGRATION_LOADED="true"

# Command line interface for testing
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    case "${1:-}" in
        "get-port")
            get_task_managed_port
            ;;
        "get-url")
            port="${2:-$(get_task_managed_port)}"
            get_task_managed_url "$port"
            ;;
        "validate")
            port="${2:-$(get_task_managed_port)}"
            validate_task_managed_port "$port"
            ;;
        "ensure-server")
            ensure_dev_server_running "${2:-3000}"
            ;;
        "check-tasks")
            check_vscode_tasks_available
            ;;
        "guidance")
            provide_vscode_task_guidance
            ;;
        "migrate")
            migrate_to_task_managed
            ;;
        "test")
            echo "Testing VS Code Task Integration..."
            get_port_with_task_fallback "test"
            ;;
        *)
            echo "Usage: $0 {get-port|get-url|validate|ensure-server|check-tasks|guidance|migrate|test} [args...]"
            echo ""
            echo "VS Code Task Integration Commands:"
            echo "  get-port          - Get task-managed port"
            echo "  get-url [port]    - Get cloud-aware URL for port"
            echo "  validate [port]   - Validate server on port"
            echo "  ensure-server [port] - Ensure dev server is running"
            echo "  check-tasks       - Check if VS Code tasks are available"
            echo "  guidance          - Show VS Code task usage guidance"
            echo "  migrate          - Migrate from complex port detection"
            echo "  test             - Test the integration system"
            exit 1
            ;;
    esac
fi