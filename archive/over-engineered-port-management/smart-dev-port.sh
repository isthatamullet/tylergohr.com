#!/bin/bash

# Smart Port-Specific Dev Server
# Gracefully handles port conflicts and provides clear feedback
# Args: $1 = target port

set -e

TARGET_PORT="${1:-3000}"

# Validate port number
if ! [[ "$TARGET_PORT" =~ ^[0-9]+$ ]] || [[ "$TARGET_PORT" -lt 1000 ]] || [[ "$TARGET_PORT" -gt 65535 ]]; then
    echo "❌ Invalid port number: $TARGET_PORT"
    echo "Port must be between 1000 and 65535"
    exit 1
fi

echo "🎯 Smart Port-Specific Dev Server"
echo "================================="
echo "Target port: $TARGET_PORT"

# Check if target port is available (double-check for race conditions)
if lsof -ti ":$TARGET_PORT" >/dev/null 2>&1 || netstat -tln | grep -q ":$TARGET_PORT "; then
    # Port is in use - check what's using it
    PROCESS_INFO=$(lsof -ti ":$TARGET_PORT" | head -1)
    PROCESS_NAME=$(ps -p "$PROCESS_INFO" -o comm= 2>/dev/null || echo "unknown")
    
    echo "⚠️  Port $TARGET_PORT is already in use by: $PROCESS_NAME (PID: $PROCESS_INFO)"
    
    # Check if it's already a Next.js server
    if timeout 3 curl -s "http://localhost:$TARGET_PORT" | grep -q "This is a Next.js app\|__next\|_next" 2>/dev/null; then
        echo "✅ Found existing Next.js server on port $TARGET_PORT"
        echo "🌐 Access your site at: http://localhost:$TARGET_PORT"
        echo ""
        echo "Server is already running! No need to start a new one."
        echo "Press Ctrl+C to exit this message."
        
        # Set environment variables for coordination
        export ACTIVE_DEV_PORT="$TARGET_PORT"
        export ACTIVE_DEV_URL="http://localhost:$TARGET_PORT"
        
        # Keep script running to maintain npm process
        trap 'echo "Exiting..."; exit 0' INT
        while true; do sleep 10; done
    else
        echo ""
        echo "❌ Port $TARGET_PORT is occupied by a different service."
        echo ""
        echo "Options:"
        echo "  1. Stop the other service and try again"
        echo "  2. Use 'npm run dev' to auto-select an available port"
        echo "  3. Try a different port: npm run dev:3001 or npm run dev:4000"
        echo ""
        exit 1
    fi
else
    echo "✅ Port $TARGET_PORT is available"
    
    # Set environment variables
    export PORT="$TARGET_PORT"
    export ACTIVE_DEV_PORT="$TARGET_PORT"
    export ACTIVE_DEV_URL="http://localhost:$TARGET_PORT"
    
    echo "🚀 Starting Next.js development server on port $TARGET_PORT..."
    echo "🌐 Will be available at: http://localhost:$TARGET_PORT"
    
    # Start the development server
    exec next dev
fi