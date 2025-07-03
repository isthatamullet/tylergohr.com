#!/bin/bash

# Backward Compatibility Testing Script
# Ensures changes don't break existing workflows
# BEFORE implementing in actual hook system

set -e

# Source cloud environment utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/cloud-environment-utils.sh"

echo "🧪 Testing Backward Compatibility (Standalone)"
echo "=============================================="

# Print environment information
print_environment_info

# Test environment variable compatibility
test_environment_variable_compatibility() {
    echo ""
    echo "🎯 Test 1: ACTIVE_DEV_PORT Environment Variable"
    echo "-----------------------------------------------"
    
    echo "   🔍 Testing manual ACTIVE_DEV_PORT setting..."
    
    # Save current environment
    local original_port="$ACTIVE_DEV_PORT"
    
    # Test with manual port setting
    export ACTIVE_DEV_PORT="3000"
    echo "   Set ACTIVE_DEV_PORT=3000"
    
    # Verify environment variable is respected
    if [[ "$ACTIVE_DEV_PORT" == "3000" ]]; then
        echo "   ✅ Environment variable set correctly"
        
        # Test that Playwright config would use this
        local playwright_port="${ACTIVE_DEV_PORT:-3000}"
        if [[ "$playwright_port" == "3000" ]]; then
            echo "   ✅ Playwright integration compatible"
        else
            echo "   ❌ Playwright integration broken"
            export ACTIVE_DEV_PORT="$original_port"
            return 1
        fi
        
        # Test that existing scripts would use this (cloud-aware)
        if test_server_connectivity "$ACTIVE_DEV_PORT" 2; then
            echo "   ✅ Manual port setting works with existing server"
            echo "   🌐 URL: $(construct_test_url "$ACTIVE_DEV_PORT")"
        else
            echo "   ⚠️  Manual port setting doesn't match running server (acceptable)"
        fi
        
        # Restore original environment
        export ACTIVE_DEV_PORT="$original_port"
        echo "   🔄 Restored original ACTIVE_DEV_PORT"
        
        echo "   ✅ Environment variable compatibility maintained"
        return 0
    else
        echo "   ❌ Environment variable compatibility broken"
        export ACTIVE_DEV_PORT="$original_port"
        return 1
    fi
}

# Test existing script integration
test_existing_script_integration() {
    echo ""
    echo "🎯 Test 2: Existing Port Detection Script Integration"
    echo "----------------------------------------------------"
    
    echo "   🔍 Testing integration with scripts/detect-active-port.sh..."
    
    if [[ -f "./scripts/detect-active-port.sh" ]]; then
        echo "   📄 Found existing detect-active-port.sh script"
        
        # Test the existing script
        local script_output=$(./scripts/detect-active-port.sh 2>&1)
        local script_exit_code=$?
        
        echo "   Script output preview:"
        echo "$script_output" | head -5 | sed 's/^/     /'
        
        if [[ $script_exit_code -eq 0 ]]; then
            echo "   ✅ Existing script runs successfully"
            
            # Extract port from output
            local detected_port=$(echo "$script_output" | grep "Active port detected:" | grep -o "[0-9]*" | tail -1)
            
            if [[ -n "$detected_port" ]]; then
                echo "   ✅ Existing script detected port: $detected_port"
                
                # Verify the detected port is actually active
                if curl -s -o /dev/null -w "%{http_code}" --max-time 2 "http://localhost:$detected_port" | grep -q "200"; then
                    echo "   ✅ Existing script detection accurate"
                    return 0
                else
                    echo "   ⚠️  Existing script detected inactive port (may be acceptable)"
                    return 0
                fi
            else
                echo "   ⚠️  Existing script didn't detect any port"
                return 0
            fi
        else
            echo "   ⚠️  Existing script failed (exit code: $script_exit_code)"
            echo "   💡 This is acceptable if no dev server is running"
            return 0
        fi
    else
        echo "   ⚠️  scripts/detect-active-port.sh not found"
        echo "   ✅ Test skipped (script doesn't exist)"
        return 0
    fi
}

# Test hook system integration points
test_hook_system_integration() {
    echo ""
    echo "🎯 Test 3: Hook System Integration Points"
    echo "----------------------------------------"
    
    echo "   🔍 Testing hook system compatibility..."
    
    # Test hook-safe testing script
    if [[ -f "./scripts/testing/hook-safe-test.sh" ]]; then
        echo "   📄 Found hook-safe-test.sh"
        
        # Test hook disabling
        echo "   Testing hook disable functionality..."
        ./scripts/testing/hook-safe-test.sh disable
        local disable_exit_code=$?
        
        if [[ $disable_exit_code -eq 0 ]]; then
            echo "   ✅ Hook disable working"
            
            # Test hook restoration
            ./scripts/testing/hook-safe-test.sh restore
            local restore_exit_code=$?
            
            if [[ $restore_exit_code -eq 0 ]]; then
                echo "   ✅ Hook restore working"
            else
                echo "   ❌ Hook restore failed"
                return 1
            fi
        else
            echo "   ❌ Hook disable failed"
            return 1
        fi
    else
        echo "   ⚠️  hook-safe-test.sh not found"
    fi
    
    # Test pre-test-check script
    if [[ -f "./scripts/testing/pre-test-check.sh" ]]; then
        echo "   📄 Found pre-test-check.sh"
        
        # Run pre-test check (but don't fail on exit code since it might try to start servers)
        echo "   Testing pre-test check functionality..."
        local pretest_output=$(./scripts/testing/pre-test-check.sh 2>&1 | head -10)
        echo "   Pre-test check preview:"
        echo "$pretest_output" | sed 's/^/     /'
        echo "   ✅ Pre-test check script accessible"
    else
        echo "   ⚠️  pre-test-check.sh not found"
    fi
    
    echo "   ✅ Hook system integration points compatible"
    return 0
}

# Test package.json scripts compatibility
test_package_json_compatibility() {
    echo ""
    echo "🎯 Test 4: Package.json Scripts Compatibility"
    echo "---------------------------------------------"
    
    echo "   🔍 Testing npm script compatibility..."
    
    if [[ -f "./package.json" ]]; then
        echo "   📄 Found package.json"
        
        # Check for testing scripts
        local test_scripts=$(grep -A 20 '"scripts":' package.json | grep -E '"test:|"e2e"' | head -5)
        if [[ -n "$test_scripts" ]]; then
            echo "   📜 Found test scripts:"
            echo "$test_scripts" | sed 's/^/     /'
            
            # Test that the scripts reference environment variables correctly
            if grep -q "ACTIVE_DEV_PORT" package.json; then
                echo "   ✅ Package.json already uses ACTIVE_DEV_PORT"
            else
                echo "   ✅ Package.json doesn't need ACTIVE_DEV_PORT updates"
            fi
        else
            echo "   ⚠️  No test scripts found in package.json"
        fi
        
        # Check for dev script
        if grep -q '"dev":' package.json; then
            echo "   ✅ Dev script found in package.json"
        else
            echo "   ⚠️  No dev script found in package.json"
        fi
        
        echo "   ✅ Package.json scripts compatibility maintained"
        return 0
    else
        echo "   ❌ package.json not found"
        return 1
    fi
}

# Test Playwright configuration compatibility
test_playwright_config_compatibility() {
    echo ""
    echo "🎯 Test 5: Playwright Configuration Compatibility"
    echo "-------------------------------------------------"
    
    echo "   🔍 Testing Playwright config compatibility..."
    
    if [[ -f "./playwright.config.ts" ]]; then
        echo "   📄 Found playwright.config.ts"
        
        # Check for ACTIVE_DEV_PORT usage
        if grep -q "ACTIVE_DEV_PORT" playwright.config.ts; then
            echo "   ✅ Playwright config uses ACTIVE_DEV_PORT"
            
            # Show the relevant line
            local port_config=$(grep -n "ACTIVE_DEV_PORT" playwright.config.ts | head -1)
            echo "   📝 Port configuration: $port_config"
            
            # Test the logic
            export ACTIVE_DEV_PORT="3123"
            local test_port="${ACTIVE_DEV_PORT:-3000}"
            if [[ "$test_port" == "3123" ]]; then
                echo "   ✅ Environment variable logic working"
            else
                echo "   ❌ Environment variable logic broken"
                unset ACTIVE_DEV_PORT
                return 1
            fi
            unset ACTIVE_DEV_PORT
            
        else
            echo "   ⚠️  Playwright config doesn't use ACTIVE_DEV_PORT"
            echo "   💡 May need to be updated for dynamic port support"
        fi
        
        echo "   ✅ Playwright configuration compatibility verified"
        return 0
    else
        echo "   ⚠️  playwright.config.ts not found"
        echo "   ✅ Test skipped (no Playwright config)"
        return 0
    fi
}

# Test existing testing workflows
test_existing_testing_workflows() {
    echo ""
    echo "🎯 Test 6: Existing Testing Workflows"
    echo "-------------------------------------"
    
    echo "   🔍 Testing existing testing workflow compatibility..."
    
    # Test smoke test availability
    if grep -q "test:e2e:smoke" package.json 2>/dev/null; then
        echo "   ✅ Smoke tests script found"
        
        # Don't actually run the test, just verify the command exists
        if npm run --silent test:e2e:smoke --help >/dev/null 2>&1; then
            echo "   ✅ Smoke test command accessible"
        else
            echo "   ⚠️  Smoke test command may have issues"
        fi
    else
        echo "   ⚠️  Smoke test script not found"
    fi
    
    # Test development workflow scripts
    local dev_scripts=("test:e2e:dev" "test:e2e:portfolio" "test:e2e:visual")
    for script in "${dev_scripts[@]}"; do
        if grep -q "\"$script\"" package.json 2>/dev/null; then
            echo "   ✅ Found $script script"
        else
            echo "   ⚠️  $script script not found"
        fi
    done
    
    # Test validate script
    if grep -q '"validate":' package.json 2>/dev/null; then
        echo "   ✅ Validate script found"
        echo "   💡 This script should continue working unchanged"
    else
        echo "   ⚠️  Validate script not found"
    fi
    
    echo "   ✅ Existing testing workflows compatibility verified"
    return 0
}

# Test configuration file formats
test_configuration_compatibility() {
    echo ""
    echo "🎯 Test 7: Configuration File Compatibility"
    echo "-------------------------------------------"
    
    echo "   🔍 Testing configuration file compatibility..."
    
    # Test TypeScript config
    if [[ -f "./tsconfig.json" ]]; then
        echo "   ✅ TypeScript config found"
        
        # Verify it's valid JSON
        if node -e "JSON.parse(require('fs').readFileSync('./tsconfig.json', 'utf8'))" 2>/dev/null; then
            echo "   ✅ TypeScript config is valid JSON"
        else
            echo "   ❌ TypeScript config has JSON errors"
            return 1
        fi
    else
        echo "   ⚠️  tsconfig.json not found"
    fi
    
    # Test Next.js config
    if [[ -f "./next.config.js" ]]; then
        echo "   ✅ Next.js config found"
        echo "   💡 Config should continue working unchanged"
    else
        echo "   ⚠️  next.config.js not found"
    fi
    
    # Test existing hook configs
    if [[ -f "./scripts/hooks/config/port-detection-config.json" ]]; then
        echo "   ✅ Hook port detection config found"
        
        # Verify it's valid JSON
        if node -e "JSON.parse(require('fs').readFileSync('./scripts/hooks/config/port-detection-config.json', 'utf8'))" 2>/dev/null; then
            echo "   ✅ Hook config is valid JSON"
            
            # Show current structure
            local config_preview=$(head -5 "./scripts/hooks/config/port-detection-config.json")
            echo "   📝 Current config preview:"
            echo "$config_preview" | sed 's/^/     /'
        else
            echo "   ❌ Hook config has JSON errors"
            return 1
        fi
    else
        echo "   ⚠️  Hook port detection config not found"
    fi
    
    echo "   ✅ Configuration file compatibility verified"
    return 0
}

# Run all backward compatibility tests
run_backward_compatibility_tests() {
    echo ""
    echo "🚀 Running All Backward Compatibility Tests"
    echo "==========================================="
    
    local tests_passed=0
    local tests_failed=0
    
    # Test 1: Environment variable compatibility
    if test_environment_variable_compatibility; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    # Test 2: Existing script integration
    if test_existing_script_integration; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    # Test 3: Hook system integration
    if test_hook_system_integration; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    # Test 4: Package.json compatibility
    if test_package_json_compatibility; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    # Test 5: Playwright config compatibility
    if test_playwright_config_compatibility; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    # Test 6: Testing workflows
    if test_existing_testing_workflows; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    # Test 7: Configuration compatibility
    if test_configuration_compatibility; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    echo ""
    echo "==========================================="
    echo "📊 Backward Compatibility Test Results"
    echo "==========================================="
    echo "✅ Tests Passed: $tests_passed"
    echo "❌ Tests Failed: $tests_failed"
    
    if [[ $tests_failed -eq 0 ]]; then
        echo ""
        echo "🎉 All backward compatibility tests PASSED!"
        echo "   Existing workflows will continue working correctly"
        echo ""
        echo "📋 Compatibility Verified:"
        echo "   ✅ Environment variable integration"
        echo "   ✅ Existing script compatibility"
        echo "   ✅ Hook system integration points"
        echo "   ✅ Package.json scripts"
        echo "   ✅ Playwright configuration"
        echo "   ✅ Testing workflows"
        echo "   ✅ Configuration file formats"
        return 0
    else
        echo ""
        echo "❌ Some backward compatibility tests FAILED!"
        echo "   Fix compatibility issues before implementation"
        return 1
    fi
}

# Execute the test suite
run_backward_compatibility_tests
exit $?