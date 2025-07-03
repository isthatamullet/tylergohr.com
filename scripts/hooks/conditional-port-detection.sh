#!/bin/bash

# Claude Code Conditional Port Detection Hook
# Meta-hook that intelligently detects development server ports only when needed
# Uses Claude Code hooks to solve hook system infrastructure challenges

set -e

# Source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/hook-utils.sh"
source "$SCRIPT_DIR/lib/port-detection-utils.sh"

# Parse command line arguments
TOOL_NAME="${1:-unknown}"
TOOL_ARGS="${2:-}"

# Initialize hook execution
log_hook_start "CONDITIONAL_PORT_DETECTION" "meta_hook"

# Performance tracking
HOOK_START_TIME=$(date +%s%3N)

# Function to determine if operation needs port detection
needs_port_detection() {
    local tool_name="$1"
    local tool_args="$2"
    
    # PRIORITY: Check for dev server operations
    if [[ "$tool_name" == "Bash" && "$tool_args" =~ npm.*run.*dev ]]; then
        echo "dev_server_start"
        return 0
    fi
    
    # Check for testing operations that need live server
    if [[ "$tool_name" == "Bash" && ("$tool_args" =~ playwright || "$tool_args" =~ test:e2e) ]]; then
        echo "testing"
        return 0
    fi
    
    # Check for visual/UI operations
    if [[ "$tool_args" =~ \.(tsx|css|module\.css)$ ]]; then
        echo "visual_development"
        return 0
    fi
    
    # Check for component operations
    if [[ "$tool_args" =~ components/ ]]; then
        echo "visual_development"
        return 0
    fi
    
    # Check for testing operations
    if [[ "$tool_args" =~ (test|e2e|playwright|screenshot|visual) ]]; then
        echo "testing"
        return 0
    fi
    
    # Check for performance operations
    if [[ "$tool_args" =~ (performance|accessibility|core-web-vitals) ]]; then
        echo "performance_monitoring"
        return 0
    fi
    
    # Check for /2 redesign specific operations
    if [[ "$tool_args" =~ app/2/ ]]; then
        echo "visual_development"
        return 0
    fi
    
    # Check for brand tokens or design system changes
    if [[ "$tool_args" =~ brand-tokens\.css ]]; then
        echo "visual_development"
        return 0
    fi
    
    # Skip patterns - operations that definitely don't need port detection
    if [[ "$tool_args" =~ \.(md|txt|json|yml|yaml|toml)$ ]]; then
        return 1
    fi
    
    if [[ "$tool_args" =~ (README|CHANGELOG|\.d\.ts|types/) ]]; then
        return 1
    fi
    
    if [[ "$tool_name" =~ (git|commit|push|pull) ]]; then
        return 1
    fi
    
    # Default: no port detection needed for general operations
    return 1
}

# Function to log operation decision
log_operation_decision() {
    local needs_port="$1"
    local context="$2"
    local tool_args="$3"
    
    if [[ "$needs_port" == "true" ]]; then
        log_info "🎯 Port detection REQUIRED for context: $context"
        log_info "   Operation: $tool_args"
    else
        log_info "⚡ Port detection SKIPPED - pure text/config operation"
        log_info "   Operation: $tool_args"
    fi
}

# Function to perform ultra-fast exit
ultra_fast_exit() {
    local end_time=$(date +%s%3N)
    local duration=$((end_time - HOOK_START_TIME))
    log_success "✅ CONDITIONAL_PORT_DETECTION fast exit (${duration}ms)"
    exit 0
}

# Main execution logic
main() {
    log_info "Analyzing operation for port detection necessity..."
    log_info "Tool: $TOOL_NAME, Args: $TOOL_ARGS"
    
    # Determine if this operation needs port detection
    local operation_context
    if operation_context=$(needs_port_detection "$TOOL_NAME" "$TOOL_ARGS"); then
        log_operation_decision "true" "$operation_context" "$TOOL_ARGS"
        
        # Special handling for dev server start operations
        if [[ "$operation_context" == "dev_server_start" ]]; then
            log_info "🚀 Dev server start detected - ensuring clean port"
            
            # Kill any existing dev servers on common ports to prevent conflicts
            log_info "Cleaning up existing dev servers..."
            pkill -f "next-server\|npm run dev" 2>/dev/null || true
            sleep 1
            
            # Wait for port to be freed
            for port in 3000 3001 3002 3003; do
                if ! lsof -i ":$port" >/dev/null 2>&1; then
                    log_info "✅ Port $port is available for dev server"
                    break
                fi
            done
            
            log_info "🔍 Port detection will update after dev server starts..."
        else
            # Regular port detection for testing/visual operations
            log_info "🔍 Initiating smart port detection..."
            
            # Check if we already have a valid port in the current session
            if [[ -n "$ACTIVE_DEV_PORT" ]]; then
                log_success "Using existing session port: $ACTIVE_DEV_PORT"
            else
                # Attempt to get active port with caching
                if get_active_port "$operation_context"; then
                    log_success "Port detection successful: $ACTIVE_DEV_PORT"
                else
                    log_warning "No development server detected"
                    log_info "💡 Consider running: npm run dev"
                    
                    # Set a flag that other hooks can check
                    export DEV_SERVER_UNAVAILABLE="true"
                fi
            fi
        fi
        
        # Export context for other hooks
        export PORT_DETECTION_CONTEXT="$operation_context"
        
    else
        log_operation_decision "false" "skip" "$TOOL_ARGS"
        ultra_fast_exit
    fi
    
    # Log completion with timing
    local end_time=$(date +%s%3N)
    local duration=$((end_time - HOOK_START_TIME))
    
    if [[ -n "$ACTIVE_DEV_PORT" ]]; then
        log_hook_success "CONDITIONAL_PORT_DETECTION completed (${duration}ms) - Port: $ACTIVE_DEV_PORT"
    else
        log_hook_success "CONDITIONAL_PORT_DETECTION completed (${duration}ms) - No server required"
    fi
}

# Error handling
handle_error() {
    local exit_code=$?
    log_error "Port detection hook failed with exit code: $exit_code"
    log_error "Tool: $TOOL_NAME, Args: $TOOL_ARGS"
    
    # Don't fail the entire workflow for port detection issues
    log_warning "Continuing workflow without port detection"
    exit 0
}

trap handle_error ERR

# Execute main function
main "$@"