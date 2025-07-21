#!/bin/bash

# Tyler Gohr Portfolio - Standalone Port Detection Helper
# Detects active development servers and exports environment variables
# Works independently of Claude Code hooks for manual command execution

set -e

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source required utilities
source "$SCRIPT_DIR/hooks/lib/hook-utils.sh" 2>/dev/null || {
    # Fallback if hook-utils.sh is not available
    log_info() { echo "[INFO] $*"; }
    log_success() { echo "[SUCCESS] $*"; }
    log_warning() { echo "[WARNING] $*"; }
    log_error() { echo "[ERROR] $*"; }
}

source "$SCRIPT_DIR/testing/lib/cloud-environment-utils.sh"
source "$SCRIPT_DIR/hooks/lib/port-detection-utils.sh"

# Configuration
QUIET_MODE="${1:-false}"
EXPORT_FORMAT="${2:-shell}"

# Usage information
show_usage() {
    cat << EOF
Tyler Gohr Portfolio - Standalone Port Detection

USAGE:
    $0 [quiet] [format]

ARGUMENTS:
    quiet     - Suppress informational output (default: false)
    format    - Output format: shell|export|json (default: shell)

EXAMPLES:
    # Interactive mode with full output
    $0

    # Quiet mode for scripting
    $0 quiet

    # Export format for sourcing
    $0 quiet export

    # JSON format for programmatic use
    $0 quiet json

    # Source into current shell
    eval "\$($0 quiet export)"

CLOUD ENVIRONMENTS:
    Automatically detects and supports:
    • Google Cloud Workstations
    • GitHub Codespaces  
    • Gitpod
    • Local development

OUTPUT:
    Sets ACTIVE_DEV_PORT and ACTIVE_DEV_URL environment variables
    Playwright and other tools will automatically use these values

INTEGRATION:
    Works with existing Claude Code hook system when available
    Falls back to standalone detection when hooks are not active
EOF
}

# Helper to log only in non-quiet mode
conditional_log() {
    local level="$1"
    shift
    if [[ "$QUIET_MODE" != "quiet" ]]; then
        case "$level" in
            "info") log_info "$@" ;;
            "success") log_success "$@" ;;
            "warning") log_warning "$@" ;;
            "error") log_error "$@" ;;
        esac
    fi
}

# Main port detection function
detect_and_export_port() {
    conditional_log info "Starting standalone port detection..."
    
    # Show environment info in non-quiet mode
    if [[ "$QUIET_MODE" != "quiet" ]]; then
        print_environment_info
    fi
    
    # Try to get port from existing cache/session first
    if [[ -n "$ACTIVE_DEV_PORT" ]]; then
        conditional_log info "Using existing session port: $ACTIVE_DEV_PORT"
        local validation_url=$(construct_test_url "$ACTIVE_DEV_PORT")
        
        # Validate it's still working
        if validate_nextjs_server_cloud "$ACTIVE_DEV_PORT" 3 >/dev/null 2>&1; then
            export ACTIVE_DEV_URL="$validation_url"
            conditional_log success "Existing port validated: $ACTIVE_DEV_PORT"
            conditional_log info "Server URL: $validation_url"
            return 0
        else
            conditional_log warning "Existing port $ACTIVE_DEV_PORT no longer valid, detecting new port..."
            unset ACTIVE_DEV_PORT ACTIVE_DEV_URL
        fi
    fi
    
    # Hook system integration removed - using direct detection
    # (Orchestrator system archived as over-engineering)
            conditional_log info "Hook system not available, using standalone detection..."
        fi
        
        # Standalone detection using direct port detection utilities (non-quiet mode)
        conditional_log info "Performing standalone dynamic port detection..."
        
        if get_active_port "standalone" >/dev/null 2>&1; then
            if [[ -n "$ACTIVE_DEV_PORT" ]]; then
                local validation_url=$(construct_test_url "$ACTIVE_DEV_PORT")
                export ACTIVE_DEV_URL="$validation_url"
                conditional_log success "Port detected: $ACTIVE_DEV_PORT"
                conditional_log info "Server URL: $validation_url"
                conditional_log info "Environment: $(detect_environment)"
                return 0
            fi
        fi
    fi
    
    # Final fallback - try manual detection
    conditional_log warning "Automated detection failed, trying manual detection..."
    
    # Simplified manual detection without logging
    local nextjs_processes=$(ps aux | grep -E "next-server|next dev" | grep -v grep | awk '{print $2}')
    for pid in $nextjs_processes; do
        local ports=$(lsof -i -P -n | grep "$pid" | grep LISTEN | grep -o ":[0-9]\+" | cut -d: -f2 | sort -n | uniq)
        for port in $ports; do
            if [[ "$port" =~ ^[0-9]+$ ]] && [[ $port -ge 3000 ]] && [[ $port -le 65535 ]]; then
                if validate_nextjs_server_cloud "$port" 3 >/dev/null 2>&1; then
                    export ACTIVE_DEV_PORT="$port"
                    local validation_url=$(construct_test_url "$port")
                    export ACTIVE_DEV_URL="$validation_url"
                    conditional_log success "Manual detection successful: $port"
                    conditional_log info "Server URL: $validation_url"
                    return 0
                fi
            fi
        done
    done
    
    # Try scanning active ports directly
    local active_ports=$(netstat -tuln 2>/dev/null | grep LISTEN | grep -o ":[0-9]\+" | cut -d: -f2 | sort -n | uniq)
    for port in $active_ports; do
        if [[ $port -ge 3000 ]] && [[ $port -le 4010 ]]; then
            if validate_nextjs_server_cloud "$port" 3 >/dev/null 2>&1; then
                export ACTIVE_DEV_PORT="$port"
                local validation_url=$(construct_test_url "$port")
                export ACTIVE_DEV_URL="$validation_url"
                conditional_log success "Network scan detection successful: $port"
                conditional_log info "Server URL: $validation_url"
                return 0
            fi
        fi
    done
    
    # No server found
    conditional_log warning "No active development server detected"
    conditional_log info "💡 Consider running: npm run dev"
    conditional_log info "💡 Or start dev server on a specific port: PORT=3000 npm run dev"
    return 1
}

# Output results in requested format
output_results() {
    local port="$ACTIVE_DEV_PORT"
    local url="$ACTIVE_DEV_URL"
    local environment=$(detect_environment)
    
    if [[ -z "$port" ]]; then
        case "$EXPORT_FORMAT" in
            "json")
                echo '{"error": "No active development server found", "active_port": null, "active_url": null}'
                ;;
            "export")
                echo "# No active development server found"
                echo "# export ACTIVE_DEV_PORT="
                echo "# export ACTIVE_DEV_URL="
                ;;
            "shell"|*)
                echo "No active development server found"
                echo "ACTIVE_DEV_PORT: (not set)"
                echo "ACTIVE_DEV_URL: (not set)"
                ;;
        esac
        return 1
    fi
    
    case "$EXPORT_FORMAT" in
        "json")
            cat << EOF
{
  "active_port": $port,
  "active_url": "$url",
  "environment": "$environment",
  "detection_time": "$(date -Iseconds)",
  "success": true
}
EOF
            ;;
        "export")
            echo "export ACTIVE_DEV_PORT=\"$port\""
            echo "export ACTIVE_DEV_URL=\"$url\""
            ;;
        "shell"|*)
            echo "Active port detected: $port"
            echo "ACTIVE_DEV_PORT: $port"
            echo "ACTIVE_DEV_URL: $url"
            echo "Environment: $environment"
            echo ""
            echo "🎯 Ready for testing! Your tools will now use the correct URLs."
            echo ""
            echo "💡 To use in current shell:"
            echo "   eval \"\$($0 quiet export)\""
            echo ""
            echo "💡 Example test commands:"
            echo "   npm run test:e2e:smoke"
            echo "   npx playwright test e2e/quick-screenshots.spec.ts --project=chromium"
            ;;
    esac
}

# Main execution
main() {
    # Handle help requests
    if [[ "$1" =~ ^(-h|--help|help)$ ]]; then
        show_usage
        exit 0
    fi
    
    # Perform detection
    if detect_and_export_port; then
        output_results
        exit 0
    else
        output_results
        exit 1
    fi
}

# Execute if called directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi