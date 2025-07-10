#!/bin/bash

# Simple Environment Setup - Assumes Dev Server Always Running
# Quick validation and environment variable setup only

set -e

# Support quiet mode for eval usage
if [[ "$1" == "quiet" ]]; then
    # Just output the export commands for eval
    if timeout 3 curl -s -f http://localhost:3000 >/dev/null 2>&1; then
        echo "export ACTIVE_DEV_PORT=3000"
        echo "export ACTIVE_DEV_URL=\"http://localhost:3000\""
    else
        echo "echo '❌ No server on port 3000'"
        exit 1
    fi
    exit 0
fi

echo "🔍 Quick server validation on port 3000..."

# Quick health check with 3-second timeout
if timeout 3 curl -s -f http://localhost:3000 >/dev/null 2>&1; then
    # Set environment variables for testing
    export ACTIVE_DEV_PORT=3000
    export ACTIVE_DEV_URL="http://localhost:3000"
    
    echo "✅ Server confirmed and environment ready"
    echo "📍 Port: 3000"
    echo "🌐 URL: http://localhost:3000"
    echo ""
    echo "# To use environment variables in your shell:"
    echo "eval \"\$(./scripts/simple-env-setup.sh quiet)\""
else
    echo "❌ No server responding on port 3000"
    echo "💡 Ensure VS Code auto-started the dev server"
    exit 1
fi