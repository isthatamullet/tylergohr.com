#!/bin/bash

# Tyler Gohr Portfolio - Hook-Safe Testing Protocol
# Temporarily disable hooks during critical testing operations

set -e

CLAUDE_SETTINGS="/home/user/.claude/settings.json"
BACKUP_SETTINGS="/home/user/.claude/settings.json.backup"

# Function to backup and disable hooks
disable_hooks() {
    if [ -f "$CLAUDE_SETTINGS" ]; then
        echo "📦 Backing up Claude settings..."
        cp "$CLAUDE_SETTINGS" "$BACKUP_SETTINGS"
        
        echo "🔇 Temporarily disabling Claude hooks for testing..."
        cat > "$CLAUDE_SETTINGS" << 'EOF'
{
  "model": "sonnet",
  "hooks": {},
  "metadata": {
    "version": "2.0.0",
    "description": "Temporarily disabled for testing",
    "testing_mode": true
  }
}
EOF
        echo "✅ Hooks disabled"
    else
        echo "✅ No Claude settings found - hooks already disabled"
    fi
}

# Function to restore hooks
restore_hooks() {
    if [ -f "$BACKUP_SETTINGS" ]; then
        echo "🔄 Restoring Claude settings..."
        mv "$BACKUP_SETTINGS" "$CLAUDE_SETTINGS"
        echo "✅ Hooks restored"
    else
        echo "⚠️  No backup found - hooks remain disabled"
    fi
}

# Function to get actual development server port from hook cache
get_active_dev_port() {
    local cache_file="/home/user/.claude/hooks/active-port.cache"
    local default_port=3000
    
    if [ -f "$cache_file" ]; then
        # Extract port from cache JSON (avoiding jq dependency)
        local cached_port=$(grep -o '"port":[0-9]*' "$cache_file" | cut -d: -f2)
        if [ -n "$cached_port" ]; then
            echo "$cached_port"
            return 0
        fi
    fi
    
    # Fallback: check common ports
    for port in 3000 3001 3002 3003; do
        if curl -s -o /dev/null -w "%{http_code}" --max-time 2 "http://localhost:$port" | grep -q "200"; then
            echo "$port"
            return 0
        fi
    done
    
    echo "$default_port"
    return 1
}

# Function to run test with proper cleanup
run_test_with_cleanup() {
    local test_command="$1"
    local test_description="$2"
    
    echo ""
    echo "🧪 Running: $test_description"
    echo "Command: $test_command"
    
    # Get active port for testing
    local active_port=$(get_active_dev_port)
    echo "🔍 Using development server port: $active_port"
    echo "----------------------------------------"
    
    # Export port for test scripts to use
    export ACTIVE_DEV_PORT="$active_port"
    
    # Set up cleanup trap
    trap 'restore_hooks; exit 1' INT TERM ERR
    
    # Run the test
    if eval "$test_command"; then
        echo "✅ Test completed successfully"
        restore_hooks
        return 0
    else
        echo "❌ Test failed"
        restore_hooks
        return 1
    fi
}

# Main execution
case "${1:-help}" in
    "disable")
        disable_hooks
        ;;
    "restore")
        restore_hooks
        ;;
    "screenshot")
        disable_hooks
        run_test_with_cleanup "npx playwright test e2e/quick-screenshots.spec.ts --project=chromium --timeout=60000" "Screenshot Generation"
        ;;
    "single-page")
        disable_hooks
        page="${2:-homepage}"
        run_test_with_cleanup "npx playwright test e2e/quick-screenshots.spec.ts --project=chromium --grep=\"$page\" --timeout=60000" "Single Page Screenshot: $page"
        ;;
    "detail-pages")
        disable_hooks
        run_test_with_cleanup "npx playwright test e2e/detail-pages-screenshots.spec.ts --project=chromium --timeout=60000" "Detail Pages Screenshots"
        ;;
    "smoke")
        disable_hooks
        run_test_with_cleanup "npm run test:e2e:smoke" "Smoke Tests"
        ;;
    "dev")
        disable_hooks
        run_test_with_cleanup "npm run test:e2e:dev" "Development Tests"
        ;;
    *)
        echo "Tyler Gohr Portfolio - Hook-Safe Testing Protocol"
        echo ""
        echo "Usage: $0 [command] [options]"
        echo ""
        echo "Commands:"
        echo "  disable              - Disable hooks only"
        echo "  restore              - Restore hooks only"
        echo "  screenshot           - Run screenshot tests with hooks disabled"
        echo "  single-page [page]   - Run single page screenshot (homepage, case-studies, etc.)"
        echo "  detail-pages         - Run detail pages screenshots"
        echo "  smoke                - Run smoke tests with hooks disabled"
        echo "  dev                  - Run development tests with hooks disabled"
        echo ""
        echo "Examples:"
        echo "  $0 screenshot                    # Generate all screenshots"
        echo "  $0 single-page case-studies     # Screenshot just case studies page"
        echo "  $0 smoke                         # Run smoke tests"
        ;;
esac