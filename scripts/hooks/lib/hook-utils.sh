#!/bin/bash

# Claude Code Hook Utilities
# Common functions and utilities for all hooks

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Hook execution tracking
HOOK_LOG_DIR="$HOME/.claude/hooks/logs"
HOOK_LOG_FILE="$HOOK_LOG_DIR/hook-execution-$(date +%Y%m%d).log"

# Ensure log directory exists
mkdir -p "$HOOK_LOG_DIR"

# Logging functions
log_info() {
    local message="$1"
    echo -e "${BLUE}[INFO]${NC} $message"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO] $message" >> "$HOOK_LOG_FILE"
}

log_success() {
    local message="$1"
    echo -e "${GREEN}[SUCCESS]${NC} $message"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [SUCCESS] $message" >> "$HOOK_LOG_FILE"
}

log_warning() {
    local message="$1"
    echo -e "${YELLOW}[WARNING]${NC} $message"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [WARNING] $message" >> "$HOOK_LOG_FILE"
}

log_error() {
    local message="$1"
    echo -e "${RED}[ERROR]${NC} $message" >&2
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $message" >> "$HOOK_LOG_FILE"
}

log_hook_start() {
    local hook_name="$1"
    local context="$2"
    echo -e "${PURPLE}🔗 Starting Hook: $hook_name${NC}"
    echo -e "${CYAN}   Context: $context${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [HOOK_START] $hook_name - $context" >> "$HOOK_LOG_FILE"
}

log_hook_success() {
    local message="$1"
    echo -e "${GREEN}✅ $message${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [HOOK_SUCCESS] $message" >> "$HOOK_LOG_FILE"
}

# File path utilities
get_project_root() {
    # Find project root by looking for package.json
    local current_dir="$PWD"
    while [[ "$current_dir" != "/" ]]; do
        if [[ -f "$current_dir/package.json" ]]; then
            echo "$current_dir"
            return 0
        fi
        current_dir="$(dirname "$current_dir")"
    done
    
    # Fallback to current working directory
    echo "$PWD"
}

is_file_exists() {
    local file_path="$1"
    [[ -f "$file_path" ]]
}

get_file_extension() {
    local file_path="$1"
    echo "${file_path##*.}"
}

get_relative_path() {
    local file_path="$1"
    local project_root=$(get_project_root)
    echo "${file_path#$project_root/}"
}

# Development server utilities (enhanced with dynamic port detection)
is_dev_server_running() {
    local port="${ACTIVE_DEV_PORT:-3000}"
    local response_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "http://localhost:$port" 2>/dev/null || echo "000")
    [[ "$response_code" =~ ^[2-5][0-9][0-9]$ ]]
}

get_dev_server_url() {
    local port="${ACTIVE_DEV_PORT:-3000}"
    echo "http://localhost:$port"
}

wait_for_dev_server() {
    local max_attempts=30
    local attempt=1
    local port="${ACTIVE_DEV_PORT:-3000}"
    
    log_info "Waiting for development server on port $port..."
    while [[ $attempt -le $max_attempts ]]; do
        if is_dev_server_running; then
            log_success "Development server is ready on port $port"
            return 0
        fi
        
        log_info "Attempt $attempt/$max_attempts - waiting for dev server on port $port..."
        sleep 2
        ((attempt++))
    done
    
    log_warning "Development server not available on port $port after $max_attempts attempts"
    return 1
}

# Function to validate or detect port if not set (enhanced with VS Code task integration)
ensure_active_port() {
    if [[ -z "$ACTIVE_DEV_PORT" ]]; then
        log_info "ACTIVE_DEV_PORT not set, attempting enhanced detection..."
        
        # NEW: Try VS Code task integration first
        local vscode_task_utils="$(dirname "${BASH_SOURCE[0]}")/vscode-task-integration.sh"
        if [[ -f "$vscode_task_utils" ]]; then
            source "$vscode_task_utils"
            if ensure_active_port_task_managed; then
                log_success "Port detected via VS Code task integration: $ACTIVE_DEV_PORT"
                return 0
            fi
        fi
        
        # FALLBACK: Try traditional port detection utilities
        local port_utils="$(dirname "${BASH_SOURCE[0]}")/port-detection-utils.sh"
        if [[ -f "$port_utils" ]]; then
            source "$port_utils"
            if get_active_port "fallback"; then
                log_success "Port detected via traditional method: $ACTIVE_DEV_PORT"
                return 0
            else
                log_warning "Traditional port detection failed, using default 3000"
                export ACTIVE_DEV_PORT="3000"
            fi
        else
            log_warning "Port detection utilities not available, using default 3000"
            export ACTIVE_DEV_PORT="3000"
        fi
    else
        log_info "Using existing ACTIVE_DEV_PORT: $ACTIVE_DEV_PORT"
    fi
}

# Environment detection
get_development_mode() {
    if [[ "${DEVELOPMENT_CONTEXT:-}" == "redesign_2" ]]; then
        echo "redesign_2"
    elif [[ "${DEVELOPMENT_CONTEXT:-}" == "main_portfolio" ]]; then
        echo "main_portfolio"
    elif [[ "${FAST_MODE:-}" == "true" ]]; then
        echo "fast"
    else
        echo "standard"
    fi
}

should_skip_visual_tests() {
    [[ "${SKIP_VISUAL:-}" == "true" || "${FAST_MODE:-}" == "true" ]]
}

# Configuration utilities
load_hook_config() {
    local config_name="$1"
    local config_file="$(dirname "${BASH_SOURCE[0]}")/../config/$config_name.json"
    
    if [[ -f "$config_file" ]]; then
        cat "$config_file"
    else
        log_warning "Configuration file not found: $config_file"
        echo "{}"
    fi
}

# Process utilities
run_with_timeout() {
    local timeout_duration="$1"
    local command="$2"
    
    timeout "$timeout_duration" bash -c "$command"
}

# Git utilities
get_changed_files() {
    git diff --name-only HEAD^ HEAD 2>/dev/null || echo ""
}

is_git_repo() {
    git rev-parse --git-dir > /dev/null 2>&1
}

# npm utilities
run_npm_script() {
    local script_name="$1"
    local quiet="${2:-false}"
    
    if [[ "$quiet" == "true" ]]; then
        npm run "$script_name" --silent 2>/dev/null
    else
        npm run "$script_name"
    fi
}

npm_script_exists() {
    local script_name="$1"
    npm run --silent 2>&1 | grep -q "^  $script_name$"
}

# Performance utilities
measure_execution_time() {
    local start_time="$1"
    local end_time=$(date +%s)
    echo $((end_time - start_time))
}

# Error handling utilities
handle_hook_error() {
    local hook_name="$1"
    local error_message="$2"
    local exit_code="${3:-1}"
    
    log_error "Hook $hook_name failed: $error_message"
    log_error "Check logs at: $HOOK_LOG_FILE"
    exit "$exit_code"
}

# Confirmation utilities
ask_confirmation() {
    local prompt="$1"
    local default="${2:-n}"
    
    echo -n "$prompt [$default]: "
    read -r response
    response="${response:-$default}"
    
    case "$response" in
        [yY]|[yY][eE][sS])
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# Hook metadata
export HOOK_UTILS_LOADED="true"
export HOOK_EXECUTION_START=$(date +%s)