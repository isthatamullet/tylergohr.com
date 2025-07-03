#!/bin/bash

# Tyler Gohr Portfolio - Shell Environment Initialization
# Automatically sets port environment variables for the current shell session
# Source this script to have ACTIVE_DEV_PORT and ACTIVE_DEV_URL available

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source the port detection script in quiet export mode
if [[ -f "$SCRIPT_DIR/detect-active-port.sh" ]]; then
    # Run port detection and evaluate the export commands
    eval "$("$SCRIPT_DIR/detect-active-port.sh" quiet export 2>/dev/null)"
    
    # Check if variables were set successfully
    if [[ -n "$ACTIVE_DEV_PORT" && -n "$ACTIVE_DEV_URL" ]]; then
        echo "✅ Port environment initialized successfully"
        echo "   ACTIVE_DEV_PORT: $ACTIVE_DEV_PORT"
        echo "   ACTIVE_DEV_URL: $ACTIVE_DEV_URL"
        echo "   Environment: $(source "$SCRIPT_DIR/testing/lib/cloud-environment-utils.sh" && detect_environment)"
        echo ""
        echo "🎯 Your shell is now configured for testing!"
        echo "   Test commands will automatically use the correct URLs."
    else
        echo "⚠️  Port detection failed or no development server found"
        echo "💡 Start your development server first: npm run dev"
        return 1 2>/dev/null || exit 1
    fi
else
    echo "❌ Port detection script not found at $SCRIPT_DIR/detect-active-port.sh"
    return 1 2>/dev/null || exit 1
fi