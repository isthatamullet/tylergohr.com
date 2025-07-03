#!/bin/bash

# Tyler Gohr Portfolio - Pre-Testing Dependency Check
# MANDATORY script to run before ANY playwright testing

set -e

echo "🔍 Tyler Gohr Portfolio - Pre-Testing Dependency Check"
echo "=================================================="

# Function to check command existence
check_command() {
    if command -v "$1" >/dev/null 2>&1; then
        echo "✅ $1 is available"
        return 0
    else
        echo "❌ $1 is NOT available"
        return 1
    fi
}

# Function to get actual development server port with live detection
get_active_dev_port() {
    # First try to detect active port with live scanning
    if [ -f "./scripts/detect-active-port.sh" ]; then
        local detected_port=$(./scripts/detect-active-port.sh 2>/dev/null | grep "Active port detected:" | grep -o "[0-9]*" | tail -1)
        if [ -n "$detected_port" ]; then
            echo "$detected_port"
            return 0
        fi
    fi
    
    # Fallback: check hook cache
    local cache_file="/home/user/.claude/hooks/active-port.cache"
    if [ -f "$cache_file" ]; then
        local cached_port=$(grep -o '"port":[0-9]*' "$cache_file" | cut -d: -f2)
        if [ -n "$cached_port" ]; then
            # Verify cached port is still active
            if curl -s -o /dev/null -w "%{http_code}" --max-time 2 "http://localhost:$cached_port" | grep -q "200"; then
                echo "$cached_port"
                return 0
            fi
        fi
    fi
    
    # Final fallback: scan common ports
    for port in 3000 3001 3002 3003 3004; do
        if curl -s -o /dev/null -w "%{http_code}" --max-time 2 "http://localhost:$port" | grep -q "200"; then
            echo "$port"
            return 0
        fi
    done
    
    echo "3000"
    return 1
}

# Function to check if dev server is running
check_dev_server() {
    local port=${1:-$(get_active_dev_port)}
    if curl -s -o /dev/null -w "%{http_code}" --max-time 5 "http://localhost:$port" | grep -q "200"; then
        echo "✅ Development server is running on port $port"
        return 0
    else
        echo "❌ Development server is NOT running on port $port"
        return 1
    fi
}

# Function to check if playwright browsers are installed
check_playwright_browsers() {
    if npx playwright --version >/dev/null 2>&1; then
        echo "✅ Playwright CLI is available"
        
        # Check if browser directories exist
        local browser_dir="$HOME/.cache/ms-playwright"
        if [ -d "$browser_dir/chromium-"* ] && [ -d "$browser_dir/firefox-"* ] && [ -d "$browser_dir/webkit-"* ]; then
            echo "✅ Playwright browsers are installed"
            return 0
        else
            echo "❌ Playwright browsers need installation"
            return 1
        fi
    else
        echo "❌ Playwright CLI is NOT available"
        return 1
    fi
}

# Function to test basic page load
test_basic_page_load() {
    local url="$1"
    local page_name="$2"
    
    echo "📡 Testing basic page load: $page_name ($url)"
    
    # Use curl to test basic HTTP response
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url")
    
    if [ "$status_code" = "200" ]; then
        echo "✅ $page_name loads successfully (HTTP $status_code)"
        return 0
    else
        echo "❌ $page_name failed to load (HTTP $status_code)"
        return 1
    fi
}

# Main dependency checks
DEPS_OK=true

echo ""
echo "1️⃣ Checking system dependencies..."
check_command "node" || DEPS_OK=false
check_command "npm" || DEPS_OK=false
check_command "npx" || DEPS_OK=false
check_command "curl" || DEPS_OK=false

echo ""
echo "2️⃣ Checking development server..."
# Get the active port (from hook cache or detection)
ACTIVE_PORT=$(get_active_dev_port)
echo "🔍 Detected active port: $ACTIVE_PORT"

if ! check_dev_server "$ACTIVE_PORT"; then
    echo "⚠️  Starting development server..."
    npm run dev &
    sleep 5
    # Re-detect port after starting server
    ACTIVE_PORT=$(get_active_dev_port)
    if ! check_dev_server "$ACTIVE_PORT"; then
        echo "❌ Failed to start development server"
        DEPS_OK=false
    fi
fi

echo ""
echo "3️⃣ Checking Playwright installation..."
if ! check_playwright_browsers; then
    echo "⚠️  Installing Playwright dependencies..."
    sudo npx playwright install-deps || {
        echo "❌ Failed to install Playwright system dependencies"
        DEPS_OK=false
    }
    
    npx playwright install || {
        echo "❌ Failed to install Playwright browsers"
        DEPS_OK=false
    }
    
    # Re-check after installation
    check_playwright_browsers || DEPS_OK=false
fi

echo ""
echo "4️⃣ Testing critical page loads..."
test_basic_page_load "http://localhost:$ACTIVE_PORT/2" "Homepage" || DEPS_OK=false
test_basic_page_load "http://localhost:$ACTIVE_PORT/2/case-studies" "Case Studies" || DEPS_OK=false  
test_basic_page_load "http://localhost:$ACTIVE_PORT/2/how-i-work" "How I Work" || DEPS_OK=false
test_basic_page_load "http://localhost:$ACTIVE_PORT/2/technical-expertise" "Technical Expertise" || DEPS_OK=false

echo ""
echo "5️⃣ Checking hook system status..."
if [ -f "/home/user/.claude/settings.json" ]; then
    echo "⚠️  Claude hooks are active - this may affect testing"
    echo "💡 Consider temporarily disabling hooks for critical testing"
else
    echo "✅ No Claude hooks detected"
fi

echo ""
echo "=================================================="

if [ "$DEPS_OK" = true ]; then
    echo "🎉 ALL CHECKS PASSED - Ready for testing!"
    exit 0
else
    echo "❌ SOME CHECKS FAILED - Fix issues before testing!"
    exit 1
fi