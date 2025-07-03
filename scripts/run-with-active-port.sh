#!/bin/bash

# Universal Port Detection Wrapper
# Ensures any command runs with the correct ACTIVE_DEV_PORT

set -e

# Function to detect and export active port
setup_active_port() {
    local detected_port=""
    
    # Method 1: Check environment variable
    if [ -n "$ACTIVE_DEV_PORT" ]; then
        # Verify the env var port is actually active
        if curl -s -o /dev/null --max-time 2 "http://localhost:$ACTIVE_DEV_PORT" >/dev/null 2>&1; then
            detected_port="$ACTIVE_DEV_PORT"
        fi
    fi
    
    # Method 2: Live port scanning if env var failed
    if [ -z "$detected_port" ]; then
        for port in 3000 3001 3002 3003 3004 3005; do
            if curl -s -o /dev/null --max-time 2 "http://localhost:$port" >/dev/null 2>&1; then
                # Double-check it's a Next.js server
                if curl -s --max-time 2 "http://localhost:$port" | grep -q "next\|_next" 2>/dev/null; then
                    detected_port="$port"
                    break
                fi
            fi
        done
    fi
    
    if [ -n "$detected_port" ]; then
        export ACTIVE_DEV_PORT="$detected_port"
        echo "🎯 Using active port: $detected_port"
        return 0
    else
        echo "❌ No active development server found"
        echo "💡 Start dev server first: ./scripts/start-dev-server.sh"
        return 1
    fi
}

# Main execution
if [ $# -eq 0 ]; then
    echo "Usage: $0 <command> [args...]"
    echo ""
    echo "Examples:"
    echo "  $0 npm run test:e2e:smoke"
    echo "  $0 npx playwright test"
    echo "  $0 ./scripts/testing/pre-test-check.sh"
    exit 1
fi

# Setup active port detection
if setup_active_port; then
    # Execute the command with active port available
    exec "$@"
else
    exit 1
fi