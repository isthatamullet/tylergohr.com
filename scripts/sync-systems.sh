#!/bin/bash

# Sync Systems - Ensure MCP and Hooks know about simplified dev server
# Run this to sync environment variables across all systems

set -e

echo "🔄 Syncing development server environment across systems..."

# 1. Get environment from simplified setup
echo "📍 Setting environment variables..."
eval "$(./scripts/simple-env-setup.sh quiet)"

if [[ -z "$ACTIVE_DEV_PORT" || -z "$ACTIVE_DEV_URL" ]]; then
    echo "❌ Failed to get environment variables"
    exit 1
fi

echo "✅ Environment detected: Port $ACTIVE_DEV_PORT, URL $ACTIVE_DEV_URL"

# 2. Update hooks system cache
echo "🔧 Updating hooks system..."
if [[ -f "./scripts/hooks/ensure-port-env.sh" ]]; then
    ./scripts/hooks/ensure-port-env.sh refresh >/dev/null 2>&1 || true
    echo "✅ Hooks system synced"
else
    echo "⚠️  Hooks system not found"
fi

# 3. Test MCP server detection
echo "🤖 Testing MCP server detection..."
if command -v node >/dev/null 2>&1 && [[ -f "./mcp-server/dist/lib/context.js" ]]; then
    MCP_RESULT=$(node -e "
        const { detectActivePort } = require('./mcp-server/dist/lib/context.js');
        detectActivePort().then(result => {
            console.log(result ? 'SUCCESS' : 'FAILED');
        }).catch(() => console.log('FAILED'));
    " 2>/dev/null || echo "FAILED")
    
    if [[ "$MCP_RESULT" == "SUCCESS" ]]; then
        echo "✅ MCP server detection working"
    else
        echo "⚠️  MCP server detection needs attention"
    fi
else
    echo "ℹ️  MCP server not available"
fi

# 4. Export for current shell
echo ""
echo "📋 To use in your current shell:"
echo "eval \"\$(./scripts/simple-env-setup.sh quiet)\""
echo ""
echo "🎯 All systems synced with simplified dev server approach!"