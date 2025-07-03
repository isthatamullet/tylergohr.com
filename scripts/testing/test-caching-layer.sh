#!/bin/bash

# Dynamic Caching Layer - Standalone Testing Script
# Tests TTL caching and invalidation logic
# BEFORE implementing in actual hook system

set -e

# Source cloud environment utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/cloud-environment-utils.sh"

echo "🧪 Testing Dynamic Caching Layer Logic (Standalone)"
echo "==================================================="

# Print environment information
print_environment_info

# Test cache directory
TEST_CACHE_DIR="/tmp/port-detection-test-cache-$$"

# Cleanup function
cleanup_test_cache() {
    if [[ -d "$TEST_CACHE_DIR" ]]; then
        rm -rf "$TEST_CACHE_DIR"
        echo "   🧹 Cleaned up test cache directory"
    fi
}

# Set up cleanup trap
trap cleanup_test_cache EXIT

# Initialize test cache
initialize_test_cache() {
    mkdir -p "$TEST_CACHE_DIR"
    echo "   📁 Created test cache directory: $TEST_CACHE_DIR"
}

# Cache port information with TTL (test version)
cache_port_info_test() {
    local port="$1"
    local ttl="${2:-1800}"  # Default 30 minutes
    local cache_file="$TEST_CACHE_DIR/port_detection.cache"
    local cache_meta_file="$TEST_CACHE_DIR/port_detection.meta"
    local timestamp=$(date +%s)
    local expires_at=$((timestamp + ttl))
    
    echo "   💾 Caching port $port with TTL ${ttl}s (expires: $(date -d @$expires_at))"
    
    # Create cache entry with metadata (cloud-aware URL)
    local validation_url=$(construct_test_url "$port")
    cat > "$cache_file" << EOF
{
  "port": $port,
  "timestamp": $timestamp,
  "validation_url": "$validation_url",
  "operation_context": "testing",
  "environment": "$(detect_environment)",
  "process_info": {
    "pid": $(lsof -t -i :$port 2>/dev/null | head -1 || echo "null"),
    "process_name": "$(ps -p $(lsof -t -i :$port 2>/dev/null | head -1) -o comm= 2>/dev/null || echo "unknown")"
  }
}
EOF
    
    # Store expiration time
    echo "$expires_at" > "$cache_meta_file"
    
    echo "   ✅ Port $port cached successfully"
    return 0
}

# Get cached port information (test version)
get_cached_port_test() {
    local cache_file="$TEST_CACHE_DIR/port_detection.cache"
    local cache_meta_file="$TEST_CACHE_DIR/port_detection.meta"
    
    echo "   🔍 Checking cache validity..."
    
    # Check if cache files exist
    if [[ ! -f "$cache_file" || ! -f "$cache_meta_file" ]]; then
        echo "   ❌ Cache files not found"
        return 1
    fi
    
    # Check if cache is expired
    local expires_at=$(cat "$cache_meta_file" 2>/dev/null || echo "0")
    local current_time=$(date +%s)
    
    echo "   ⏰ Current time: $(date -d @$current_time)"
    echo "   ⏰ Expires at: $(date -d @$expires_at)"
    
    if [[ $current_time -gt $expires_at ]]; then
        echo "   ⏰ Cache expired (age: $((current_time - expires_at))s over limit)"
        return 1
    fi
    
    # Return cached port (handle whitespace in JSON)
    local cached_port=$(grep -o '"port":[[:space:]]*[0-9]*' "$cache_file" | sed 's/.*://' | tr -d ' ')
    echo "   ✅ Cache valid, returning port: $cached_port"
    echo "$cached_port"
    return 0
}

# Invalidate cache (test version)
invalidate_cache_test() {
    local cache_file="$TEST_CACHE_DIR/port_detection.cache"
    local cache_meta_file="$TEST_CACHE_DIR/port_detection.meta"
    
    echo "   🗑️  Invalidating cache..."
    
    rm -f "$cache_file" "$cache_meta_file"
    
    if [[ ! -f "$cache_file" && ! -f "$cache_meta_file" ]]; then
        echo "   ✅ Cache invalidated successfully"
        return 0
    else
        echo "   ❌ Cache invalidation failed"
        return 1
    fi
}

# Test cache creation and retrieval
test_cache_creation() {
    echo ""
    echo "🎯 Test 1: Cache Creation and Retrieval"
    echo "--------------------------------------"
    
    initialize_test_cache
    
    # Cache a port
    local test_port=3000
    cache_port_info_test "$test_port" 3600  # 1 hour TTL
    
    # Retrieve cached port
    local retrieved_port=$(get_cached_port_test)
    
    if [[ "$retrieved_port" == "$test_port" ]]; then
        echo "   ✅ Cache creation and retrieval working correctly"
        return 0
    else
        echo "   ❌ Cache creation or retrieval failed"
        echo "     Expected: $test_port, Got: $retrieved_port"
        return 1
    fi
}

# Test cache TTL expiration
test_cache_ttl() {
    echo ""
    echo "🎯 Test 2: Cache TTL Expiration"
    echo "------------------------------"
    
    initialize_test_cache
    
    # Cache a port with very short TTL
    local test_port=3001
    cache_port_info_test "$test_port" 2  # 2 seconds TTL
    
    echo "   ⏱️  Waiting for cache to expire (3 seconds)..."
    sleep 3
    
    # Try to retrieve expired cache
    if get_cached_port_test >/dev/null 2>&1; then
        echo "   ❌ Cache TTL not working - expired cache was returned"
        return 1
    else
        echo "   ✅ Cache TTL working correctly - expired cache rejected"
        return 0
    fi
}

# Test cache invalidation
test_cache_invalidation() {
    echo ""
    echo "🎯 Test 3: Cache Invalidation"
    echo "-----------------------------"
    
    initialize_test_cache
    
    # Cache a port
    local test_port=3002
    cache_port_info_test "$test_port" 3600  # 1 hour TTL
    
    # Verify cache exists
    if ! get_cached_port_test >/dev/null 2>&1; then
        echo "   ❌ Cache setup failed for invalidation test"
        return 1
    fi
    
    # Invalidate cache
    invalidate_cache_test
    
    # Verify cache is gone
    if get_cached_port_test >/dev/null 2>&1; then
        echo "   ❌ Cache invalidation failed - cache still exists"
        return 1
    else
        echo "   ✅ Cache invalidation working correctly"
        return 0
    fi
}

# Test cache performance (timing)
test_cache_performance() {
    echo ""
    echo "🎯 Test 4: Cache Performance"
    echo "---------------------------"
    
    initialize_test_cache
    
    # Cache a port
    local test_port=3003
    cache_port_info_test "$test_port" 3600
    
    # Time cache retrieval
    local start_time=$(date +%s%3N)
    get_cached_port_test >/dev/null 2>&1
    local end_time=$(date +%s%3N)
    
    local duration=$((end_time - start_time))
    echo "   ⏱️  Cache retrieval took: ${duration}ms"
    
    # Should be very fast (under 50ms)
    if [[ $duration -lt 50 ]]; then
        echo "   ✅ Cache performance excellent (<50ms)"
        return 0
    elif [[ $duration -lt 100 ]]; then
        echo "   ⚠️  Cache performance acceptable (50-100ms)"
        return 0
    else
        echo "   ❌ Cache performance poor (>100ms)"
        return 1
    fi
}

# Test cache with real server validation
test_cache_with_validation() {
    echo ""
    echo "🎯 Test 5: Cache with Server Validation"
    echo "--------------------------------------"
    
    initialize_test_cache
    
    # Try to find an actual running server using cloud-aware testing
    local active_port=""
    for port in 3000 3001 3002 3003; do
        if test_server_connectivity "$port" 2; then
            active_port="$port"
            echo "   🔍 Found active server on port: $port"
            echo "   🌐 URL: $(construct_test_url "$port")"
            break
        fi
    done
    
    if [[ -n "$active_port" ]]; then
        # Cache the active port
        cache_port_info_test "$active_port" 1800
        
        # Retrieve and validate
        local cached_port=$(get_cached_port_test)
        
        if [[ "$cached_port" == "$active_port" ]]; then
            # Test that cached port is still valid using cloud-aware connectivity
            if test_server_connectivity "$cached_port" 2; then
                echo "   ✅ Cache with validation working correctly"
                return 0
            else
                echo "   ❌ Cached port is no longer valid"
                return 1
            fi
        else
            echo "   ❌ Cache retrieval failed"
            return 1
        fi
    else
        echo "   ⚠️  No active server found - skipping validation test"
        return 0
    fi
}

# Run all caching tests
run_caching_tests() {
    echo ""
    echo "🚀 Running All Caching Layer Tests"
    echo "=================================="
    
    local tests_passed=0
    local tests_failed=0
    
    # Test 1: Cache creation and retrieval
    if test_cache_creation; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    # Test 2: Cache TTL expiration
    if test_cache_ttl; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    # Test 3: Cache invalidation
    if test_cache_invalidation; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    # Test 4: Cache performance
    if test_cache_performance; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    # Test 5: Cache with validation
    if test_cache_with_validation; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    echo ""
    echo "=================================="
    echo "📊 Caching Layer Test Results"
    echo "=================================="
    echo "✅ Tests Passed: $tests_passed"
    echo "❌ Tests Failed: $tests_failed"
    
    if [[ $tests_failed -eq 0 ]]; then
        echo ""
        echo "🎉 All caching layer tests PASSED!"
        echo "   TTL caching and invalidation logic working correctly"
        return 0
    else
        echo ""
        echo "❌ Some caching layer tests FAILED!"
        echo "   Fix issues before proceeding"
        return 1
    fi
}

# Execute the test suite
run_caching_tests
exit $?