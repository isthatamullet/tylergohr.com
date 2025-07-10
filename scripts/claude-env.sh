#!/bin/bash

# Ultra-Simple Environment for Claude Code
# Just sets the environment variables since dev server is always running

export ACTIVE_DEV_PORT=3000
export ACTIVE_DEV_URL="http://localhost:3000"

# Quick validation (optional - server is guaranteed running)
if [[ "$1" == "validate" ]]; then
    if timeout 2 curl -s -f http://localhost:3000 >/dev/null 2>&1; then
        echo "✅ Server confirmed on port 3000"
    else
        echo "❌ Server not responding on port 3000" 
        exit 1
    fi
fi

echo "📍 Environment ready - Port: 3000"