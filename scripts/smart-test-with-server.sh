#!/bin/bash

# Smart Test with Server - Intelligent E2E testing with server coordination
# Uses existing VS Code task integration for dynamic port detection
# Prevents conflicts and timeouts by coordinating with existing servers

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

echo "🧪 Smart Test with Server"
echo "=========================="

# Step 1: Try to detect existing server using smart detection
DETECTED_PORT=""

if command -v get_task_managed_port >/dev/null 2>&1; then
    log_info "Checking for existing development server..."
    
    DETECTED_PORT=$(get_task_managed_port 2>/dev/null | head -1)
    if [[ -n "$DETECTED_PORT" && "$DETECTED_PORT" =~ ^[0-9]+$ ]]; then
        log_info "Found task-managed port: $DETECTED_PORT"
        
        # Quick validation - check if Next.js is responding
        if timeout 3 curl -s "http://localhost:$DETECTED_PORT" | grep -q "This is a Next.js app\|__next\|_next" 2>/dev/null; then
            log_success "✅ Next.js development server already running on port $DETECTED_PORT"
            export ACTIVE_DEV_PORT="$DETECTED_PORT"
            export ACTIVE_DEV_URL="http://localhost:$DETECTED_PORT"
        else
            log_warning "Port $DETECTED_PORT not responding as Next.js server"
            DETECTED_PORT=""
        fi
    fi
fi

# Step 2: Scan for ANY existing Next.js development server if not found
if [[ -z "$DETECTED_PORT" ]]; then
    log_info "Scanning for existing Next.js servers..."
    
    # Look for Next.js processes
    EXISTING_PORTS=$(netstat -tlnp 2>/dev/null | grep 'next-server' | grep -o ':[0-9]*' | cut -d: -f2 | sort -u)
    
    if [[ -n "$EXISTING_PORTS" ]]; then
        log_info "Found Next.js servers on ports: $(echo $EXISTING_PORTS | tr '\n' ' ')"
        
        # Test each port to see if it's serving Next.js
        for port in $EXISTING_PORTS; do
            if timeout 3 curl -s "http://localhost:$port" | grep -q "This is a Next.js app\|__next\|_next" 2>/dev/null; then
                log_success "✅ Active Next.js server found on port $port"
                DETECTED_PORT="$port"
                export ACTIVE_DEV_PORT="$port"
                export ACTIVE_DEV_URL="http://localhost:$port"
                break
            fi
        done
    fi
fi

# Step 3: Start server if none exists, or use existing one
if [[ -n "$DETECTED_PORT" ]]; then
    # Use existing server
    log_success "Using existing server on port $DETECTED_PORT"
    log_info "🌐 Server URL: http://localhost:$DETECTED_PORT"
    
    # Run tests directly with detected server
    log_info "Running E2E tests with existing server..."
    exec npm run test:e2e:screenshot
else
    # Need to start server
    log_info "No existing server found, starting new development server..."
    
    # Check VS Code settings for preferred port
    PREFERRED_PORT="3000"
    if [[ -f ".vscode/settings.json" ]]; then
        SETTINGS_PORT=$(grep -o '"tylergohr.devServerPort":[[:space:]]*[0-9]*' .vscode/settings.json | grep -o '[0-9]*$')
        if [[ -n "$SETTINGS_PORT" ]]; then
            PREFERRED_PORT="$SETTINGS_PORT"
            log_info "Using preferred port from VS Code settings: $PREFERRED_PORT"
        fi
    fi
    
    # Check if preferred port is available
    if lsof -ti ":$PREFERRED_PORT" >/dev/null 2>&1; then
        log_warning "Port $PREFERRED_PORT is in use, letting Next.js auto-select port"
        # Use dynamic port selection
        exec concurrently \
            "npm run dev" \
            "wait-on http-get://localhost:$PREFERRED_PORT,http-get://localhost:3001,http-get://localhost:3002,http-get://localhost:4000 --timeout 30000 && npm run test:e2e:screenshot"
    else
        log_info "Port $PREFERRED_PORT is available, using it"
        export PORT="$PREFERRED_PORT"
        export ACTIVE_DEV_PORT="$PREFERRED_PORT"
        export ACTIVE_DEV_URL="http://localhost:$PREFERRED_PORT"
        
        exec concurrently \
            "PORT=$PREFERRED_PORT npm run dev" \
            "wait-on http://localhost:$PREFERRED_PORT --timeout 30000 && npm run test:e2e:screenshot"
    fi
fi