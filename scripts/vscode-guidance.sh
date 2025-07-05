#!/bin/bash

# VS Code Guidance Script - Dynamic port information
# Provides context-aware guidance based on current VS Code configuration

set -e

GUIDANCE_TYPE="${1:-dev-server}"

# Source the existing VS Code task integration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "$SCRIPT_DIR/hooks/lib/vscode-task-integration.sh" ]]; then
    source "$SCRIPT_DIR/hooks/lib/vscode-task-integration.sh"
fi

# Colors for better output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 VS Code Development Guidance${NC}"
echo "================================="

case "$GUIDANCE_TYPE" in
    "dev-server"|"server")
        echo -e "${GREEN}Starting Development Server:${NC}"
        echo ""
        
        # Check current configuration
        CONFIGURED_PORT=""
        if [[ -f ".vscode/settings.json" ]]; then
            CONFIGURED_PORT=$(grep -o '"tylergohr.devServerPort":[[:space:]]*[0-9]*' .vscode/settings.json | grep -o '[0-9]*$')
        fi
        
        if [[ -n "$CONFIGURED_PORT" ]]; then
            echo "📋 Your VS Code is configured for port: $CONFIGURED_PORT"
            echo ""
            echo "✅ Recommended approach:"
            echo "   F1 → 'Tasks: Run Task' → 'Dev Server - Port $CONFIGURED_PORT'"
            echo ""
            echo "🔄 Alternative methods:"
            echo "   • npm run dev:$CONFIGURED_PORT"
            echo "   • npm run dev (smart auto-detection)"
        else
            echo "📋 No specific port configured in VS Code settings"
            echo ""
            echo "✅ Recommended approaches:"
            echo "   F1 → 'Tasks: Run Task' → 'Dev Server - Port 3000'"
            echo ""
            echo "🔄 Alternative methods:"
            echo "   • npm run dev (smart auto-detection)"
            echo "   • npm run dev:3000 (force port 3000)"
        fi
        
        echo ""
        echo -e "${YELLOW}💡 Pro Tips:${NC}"
        echo "   • All commands now use smart port detection"
        echo "   • No more 2+ minute timeouts!"
        echo "   • VS Code tasks provide the best integration"
        ;;
        
    "test"|"testing")
        echo -e "${GREEN}Running E2E Tests:${NC}"
        echo ""
        
        # Check for existing server
        DETECTED_PORT=""
        if command -v get_task_managed_port >/dev/null 2>&1; then
            DETECTED_PORT=$(get_task_managed_port 2>/dev/null | head -1)
        fi
        
        if [[ -n "$DETECTED_PORT" && "$DETECTED_PORT" =~ ^[0-9]+$ ]]; then
            if timeout 2 curl -s "http://localhost:$DETECTED_PORT" >/dev/null 2>&1; then
                echo "✅ Development server detected on port $DETECTED_PORT"
                echo ""
                echo "🎭 Ready to run tests:"
                echo "   • npm run test:e2e:portfolio"
                echo "   • npm run test:e2e:visual"
                echo "   • npm run test:e2e:smoke"
            else
                echo "⚠️  Server detected but not responding"
                echo ""
                echo "🚀 Start server first:"
                echo "   • npm run dev"
                echo "   • Or: npm run test:e2e:with-server (auto-starts)"
            fi
        else
            echo "❌ No development server detected"
            echo ""
            echo "🚀 Start server first:"
            echo "   • npm run dev"
            echo "   • Or: npm run test:e2e:with-server (auto-starts)"
        fi
        
        echo ""
        echo -e "${YELLOW}💡 Pro Tips:${NC}"
        echo "   • All test commands now check for servers automatically"
        echo "   • Use 'test:e2e:with-server' for full automation"
        echo "   • VS Code tasks can run tests with dependencies"
        ;;
        
    *)
        echo "Available guidance topics:"
        echo "  dev-server  - Development server guidance"
        echo "  test        - E2E testing guidance"
        echo ""
        echo "Usage: $0 <topic>"
        ;;
esac

echo ""