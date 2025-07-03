#!/bin/bash

# Dynamic Server Validation - Standalone Testing Script
# Tests Next.js server validation without hardcoded endpoints
# BEFORE implementing in actual hook system

set -e

# Source cloud environment utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/cloud-environment-utils.sh"

echo "🧪 Testing Dynamic Server Validation Logic (Standalone)"
echo "======================================================="

# Print environment information
print_environment_info

# Enhanced server validation logic (cloud-aware)
validate_nextjs_server_test() {
    local port="$1"
    local timeout="${2:-5}"
    
    # Use cloud-aware validation function
    validate_nextjs_server_cloud "$port" "$timeout"
}

# Test validation against current development server
test_current_dev_server() {
    echo ""
    echo "🎯 Testing Against Current Development Server"
    echo "--------------------------------------------"
    
    # Try to detect current server port using existing script
    local current_port=""
    if [[ -f "./scripts/detect-active-port.sh" ]]; then
        current_port=$(./scripts/detect-active-port.sh 2>/dev/null | grep "Active port detected:" | grep -o "[0-9]*" | tail -1)
    fi
    
    # Fallback: try common ports with cloud-aware testing
    if [[ -z "$current_port" ]]; then
        echo "   Using fallback port detection..."
        for port in 3000 3001 3002 3003; do
            if test_server_connectivity "$port" 2; then
                current_port="$port"
                echo "   Found server on port $port"
                echo "   URL: $(construct_test_url "$port")"
                break
            fi
        done
    fi
    
    if [[ -n "$current_port" ]]; then
        echo "   Testing server on port: $current_port"
        
        if validate_nextjs_server_test "$current_port"; then
            echo "   ✅ Current dev server validation successful"
            return 0
        else
            echo "   ❌ Current dev server validation failed"
            return 1
        fi
    else
        echo "   ⚠️  No active development server found"
        echo "   💡 Start dev server with: npm run dev"
        return 1
    fi
}

# Test validation against non-Next.js server
test_non_nextjs_server() {
    echo ""
    echo "🎯 Testing Against Non-Next.js Server"
    echo "------------------------------------"
    
    # Start a simple Python HTTP server for testing
    local test_port=3099
    echo "   Starting Python HTTP server on port $test_port for testing..."
    
    python3 -m http.server $test_port >/dev/null 2>&1 &
    local python_pid=$!
    sleep 2
    
    echo "   Testing validation against Python server..."
    
    if validate_nextjs_server_test "$test_port"; then
        echo "   ❌ Validation incorrectly passed for non-Next.js server"
        kill $python_pid 2>/dev/null || true
        return 1
    else
        echo "   ✅ Validation correctly rejected non-Next.js server"
        kill $python_pid 2>/dev/null || true
        return 0
    fi
}

# Test validation timeout behavior
test_validation_timeout() {
    echo ""
    echo "🎯 Testing Validation Timeout Behavior"
    echo "-------------------------------------"
    
    local non_existent_port=9999
    echo "   Testing timeout behavior with non-existent port: $non_existent_port"
    
    local start_time=$(date +%s)
    test_server_connectivity "$non_existent_port" 1  # 1 second timeout
    local exit_code=$?
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    echo "   Validation took ${duration}s"
    
    if [[ $exit_code -ne 0 && $duration -le 5 ]]; then
        echo "   ✅ Timeout behavior working correctly"
        return 0
    else
        echo "   ❌ Timeout behavior not working as expected"
        return 1
    fi
}

# Run all validation tests
run_validation_tests() {
    echo ""
    echo "🚀 Running All Server Validation Tests"
    echo "======================================"
    
    local tests_passed=0
    local tests_failed=0
    
    # Test 1: Current dev server
    if test_current_dev_server; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    # Test 2: Non-Next.js server
    if test_non_nextjs_server; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    # Test 3: Timeout behavior
    if test_validation_timeout; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    echo ""
    echo "======================================"
    echo "📊 Server Validation Test Results"
    echo "======================================"
    echo "✅ Tests Passed: $tests_passed"
    echo "❌ Tests Failed: $tests_failed"
    
    if [[ $tests_failed -eq 0 ]]; then
        echo ""
        echo "🎉 All server validation tests PASSED!"
        echo "   Enhanced validation logic is working correctly"
        return 0
    else
        echo ""
        echo "❌ Some server validation tests FAILED!"
        echo "   Fix issues before proceeding"
        return 1
    fi
}

# Execute the test suite
run_validation_tests
exit $?