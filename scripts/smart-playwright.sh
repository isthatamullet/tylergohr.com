#!/bin/bash

# Smart Playwright Runner - Ensures dev server is available before running tests
# Uses existing VS Code task integration for dynamic port detection
# Prevents test failures due to missing or unreachable development server

set -e

# Source the existing VS Code task integration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "$SCRIPT_DIR/hooks/lib/vscode-task-integration.sh" ]]; then
    source "$SCRIPT_DIR/hooks/lib/vscode-task-integration.sh"
fi

# Source hook utilities for logging
if [[ -f "$SCRIPT_DIR/hooks/lib/hook-utils.sh" ]]; then
    source "$SCRIPT_DIR/hooks/lib/hook-utils.sh"
else
    # Fallback logging functions
    log_info() { echo "[INFO] $1"; }
    log_success() { echo "[SUCCESS] $1"; }
    log_warning() { echo "[WARNING] $1"; }
    log_error() { echo "[ERROR] $1"; }
fi

echo "🎭 Smart Playwright Runner"
echo "=========================="

# Get all arguments passed to this script (these will be passed to playwright)
PLAYWRIGHT_ARGS="$@"

if [[ -z "$PLAYWRIGHT_ARGS" ]]; then
    log_error "No Playwright arguments provided"
    echo "Usage: $0 <playwright-arguments>"
    echo "Example: $0 test e2e/portfolio-redesign.spec.ts"
    exit 1
fi

log_info "Playwright args: $PLAYWRIGHT_ARGS"

# Step 1: Ensure we have an active dev server
DETECTED_PORT=""

if command -v get_task_managed_port >/dev/null 2>&1; then
    log_info "Checking for development server..."
    
    DETECTED_PORT=$(get_task_managed_port 2>/dev/null | head -1)
    if [[ -n "$DETECTED_PORT" && "$DETECTED_PORT" =~ ^[0-9]+$ ]]; then
        # Quick validation - check if server is responding
        if timeout 5 curl -s "http://localhost:$DETECTED_PORT" >/dev/null 2>&1; then
            log_success "✅ Development server found on port $DETECTED_PORT"
            export ACTIVE_DEV_PORT="$DETECTED_PORT"
            export ACTIVE_DEV_URL="http://localhost:$DETECTED_PORT"
        else
            log_warning "Port $DETECTED_PORT not responding"
            DETECTED_PORT=""
        fi
    fi
fi

# Step 2: If no task-managed port, scan for any active server
if [[ -z "$DETECTED_PORT" ]]; then
    log_info "Scanning for any active development server..."
    
    # Check common development ports quickly
    for port in 3000 3001 3002 4000 8000; do
        if timeout 2 curl -s "http://localhost:$port" >/dev/null 2>&1; then
            log_success "✅ Active server found on port $port"
            DETECTED_PORT="$port"
            export ACTIVE_DEV_PORT="$port"
            export ACTIVE_DEV_URL="http://localhost:$port"
            break
        fi
    done
fi

# Step 3: Check if we found a server
if [[ -z "$DETECTED_PORT" ]]; then
    log_error "❌ No development server found!"
    echo ""
    echo "Please start a development server first:"
    echo "  npm run dev"
    echo "  or"
    echo "  npm run test:e2e:with-server  (starts server automatically)"
    echo ""
    exit 1
fi

# Step 4: Run Playwright with the active server
log_info "🎭 Running Playwright tests..."
log_info "Server: http://localhost:$DETECTED_PORT"

# Execute Playwright with all the original arguments
exec npx playwright $PLAYWRIGHT_ARGS