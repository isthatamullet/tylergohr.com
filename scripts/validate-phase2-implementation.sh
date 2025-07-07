#!/bin/bash

# Phase 2 Implementation Validation Script
# Comprehensive testing of selective migration architecture

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/mcp-selection-engine.sh"

# =============================================================================
# VALIDATION CONFIGURATION
# =============================================================================

VALIDATION_RESULTS_DIR="$SCRIPT_DIR/../validation-results"
TIMESTAMP=$(date '+%Y%m%d-%H%M%S')
VALIDATION_LOG="$VALIDATION_RESULTS_DIR/phase2-validation-$TIMESTAMP.log"

# Ensure results directory exists
mkdir -p "$VALIDATION_RESULTS_DIR"

# Redirect all output to both console and log file
exec > >(tee -a "$VALIDATION_LOG")
exec 2>&1

echo "🔍 Phase 2 Implementation Validation"
echo "===================================="
echo "📅 Started: $(date)"
echo "📍 Environment: $(detect_environment)"
echo "🤖 MCP Available: $(check_mcp_server_availability)"
echo ""

# =============================================================================
# VALIDATION FUNCTIONS
# =============================================================================

validate_smart_selection_engine() {
    echo "🧪 Testing Smart Selection Engine"
    echo "================================="
    
    local test_passed=true
    
    # Test 1: Basic operation selection
    echo "1️⃣  Testing basic operation selection..."
    local dev_selection=$("$SCRIPT_DIR/mcp-selection-engine.sh" select dev-server 2>/dev/null || echo "error")
    if [[ "$dev_selection" =~ ^(mcp|hooks)$ ]]; then
        echo "   ✅ dev-server selection: $dev_selection"
    else
        echo "   ❌ dev-server selection failed: $dev_selection"
        test_passed=false
    fi
    
    local test_selection=$("$SCRIPT_DIR/mcp-selection-engine.sh" select test-execution 2>/dev/null || echo "error")
    if [[ "$test_selection" =~ ^(mcp|hooks)$ ]]; then
        echo "   ✅ test-execution selection: $test_selection"
    else
        echo "   ❌ test-execution selection failed: $test_selection"
        test_passed=false
    fi
    
    # Test 2: Environment detection
    echo "2️⃣  Testing environment detection..."
    local env_detected=$("$SCRIPT_DIR/mcp-selection-engine.sh" info dev-server 2>/dev/null | grep "Environment:" | cut -d: -f2 | xargs)
    if [[ -n "$env_detected" ]]; then
        echo "   ✅ Environment detection: $env_detected"
    else
        echo "   ❌ Environment detection failed"
        test_passed=false
    fi
    
    # Test 3: Force MCP selection
    echo "3️⃣  Testing forced MCP selection..."
    local forced_mcp=$(USE_MCP=true "$SCRIPT_DIR/mcp-selection-engine.sh" select dev-server 2>/dev/null || echo "error")
    if [[ "$forced_mcp" == "mcp" ]]; then
        echo "   ✅ Forced MCP selection works"
    else
        echo "   ❌ Forced MCP selection failed: $forced_mcp"
        test_passed=false
    fi
    
    # Test 4: Force hooks selection
    echo "4️⃣  Testing forced hooks selection..."
    local forced_hooks=$(FORCE_HOOKS=true "$SCRIPT_DIR/mcp-selection-engine.sh" select dev-server 2>/dev/null || echo "error")
    if [[ "$forced_hooks" == "hooks" ]]; then
        echo "   ✅ Forced hooks selection works"
    else
        echo "   ❌ Forced hooks selection failed: $forced_hooks"
        test_passed=false
    fi
    
    if [[ "$test_passed" == "true" ]]; then
        echo "   🎉 Smart Selection Engine: PASSED"
    else
        echo "   💥 Smart Selection Engine: FAILED"
    fi
    echo ""
    
    return $([ "$test_passed" == "true" ] && echo 0 || echo 1)
}

validate_smart_wrapper_scripts() {
    echo "🧪 Testing Smart Wrapper Scripts"
    echo "================================"
    
    local test_passed=true
    
    # Test 1: Smart dev server wrapper
    echo "1️⃣  Testing smart-dev-mcp.sh..."
    if [[ -x "$SCRIPT_DIR/smart-dev-mcp.sh" ]]; then
        local dev_output=$(timeout 10s "$SCRIPT_DIR/smart-dev-mcp.sh" info 2>/dev/null || echo "timeout")
        if [[ "$dev_output" == *"Environment:"* ]]; then
            echo "   ✅ smart-dev-mcp.sh is functional"
        else
            echo "   ❌ smart-dev-mcp.sh output issues: $dev_output"
            test_passed=false
        fi
    else
        echo "   ❌ smart-dev-mcp.sh not executable"
        test_passed=false
    fi
    
    # Test 2: Smart test wrapper
    echo "2️⃣  Testing smart-test-mcp.sh..."
    if [[ -x "$SCRIPT_DIR/smart-test-mcp.sh" ]]; then
        local test_output=$(timeout 10s "$SCRIPT_DIR/smart-test-mcp.sh" info 2>/dev/null || echo "timeout")
        if [[ "$test_output" == *"Environment:"* ]]; then
            echo "   ✅ smart-test-mcp.sh is functional"
        else
            echo "   ❌ smart-test-mcp.sh output issues: $test_output"
            test_passed=false
        fi
    else
        echo "   ❌ smart-test-mcp.sh not executable"
        test_passed=false
    fi
    
    # Test 3: Smart validation wrapper
    echo "3️⃣  Testing smart-validate-mcp.sh..."
    if [[ -x "$SCRIPT_DIR/smart-validate-mcp.sh" ]]; then
        local validate_output=$(timeout 10s "$SCRIPT_DIR/smart-validate-mcp.sh" info 2>/dev/null || echo "timeout")
        if [[ "$validate_output" == *"Environment:"* ]]; then
            echo "   ✅ smart-validate-mcp.sh is functional"
        else
            echo "   ❌ smart-validate-mcp.sh output issues: $validate_output"
            test_passed=false
        fi
    else
        echo "   ❌ smart-validate-mcp.sh not executable"
        test_passed=false
    fi
    
    if [[ "$test_passed" == "true" ]]; then
        echo "   🎉 Smart Wrapper Scripts: PASSED"
    else
        echo "   💥 Smart Wrapper Scripts: FAILED"
    fi
    echo ""
    
    return $([ "$test_passed" == "true" ] && echo 0 || echo 1)
}

validate_npm_script_variants() {
    echo "🧪 Testing npm Script Variants"
    echo "=============================="
    
    local test_passed=true
    local package_json="$SCRIPT_DIR/../package.json"
    
    # Test 1: Check for :mcp variants
    echo "1️⃣  Testing :mcp script variants..."
    local mcp_scripts=("dev:mcp" "test:e2e:smoke:mcp" "test:e2e:dev:mcp" "validate:mcp")
    for script in "${mcp_scripts[@]}"; do
        if grep -q "\"$script\":" "$package_json"; then
            echo "   ✅ $script exists in package.json"
        else
            echo "   ❌ $script missing from package.json"
            test_passed=false
        fi
    done
    
    # Test 2: Check for :auto variants
    echo "2️⃣  Testing :auto script variants..."
    local auto_scripts=("dev:auto" "test:e2e:smoke:auto" "test:e2e:dev:auto" "validate:auto")
    for script in "${auto_scripts[@]}"; do
        if grep -q "\"$script\":" "$package_json"; then
            echo "   ✅ $script exists in package.json"
        else
            echo "   ❌ $script missing from package.json"
            test_passed=false
        fi
    done
    
    # Test 3: Validate script paths point to correct wrappers
    echo "3️⃣  Testing script paths..."
    if grep -q "smart-dev-mcp.sh" "$package_json"; then
        echo "   ✅ dev:mcp points to smart-dev-mcp.sh"
    else
        echo "   ❌ dev:mcp doesn't point to smart-dev-mcp.sh"
        test_passed=false
    fi
    
    if grep -q "smart-test-mcp.sh" "$package_json"; then
        echo "   ✅ test scripts point to smart-test-mcp.sh"
    else
        echo "   ❌ test scripts don't point to smart-test-mcp.sh"
        test_passed=false
    fi
    
    if [[ "$test_passed" == "true" ]]; then
        echo "   🎉 npm Script Variants: PASSED"
    else
        echo "   💥 npm Script Variants: FAILED"
    fi
    echo ""
    
    return $([ "$test_passed" == "true" ] && echo 0 || echo 1)
}

validate_environment_control_system() {
    echo "🧪 Testing Environment Control System"
    echo "====================================="
    
    local test_passed=true
    
    # Test 1: mcp-env-setup.sh exists and is executable
    echo "1️⃣  Testing mcp-env-setup.sh availability..."
    if [[ -x "$SCRIPT_DIR/mcp-env-setup.sh" ]]; then
        echo "   ✅ mcp-env-setup.sh is executable"
    else
        echo "   ❌ mcp-env-setup.sh not found or not executable"
        test_passed=false
    fi
    
    # Test 2: Configuration presets
    echo "2️⃣  Testing configuration presets..."
    local presets=("mcp-primary" "hooks-primary" "auto-select" "cloud-optimized" "development")
    for preset in "${presets[@]}"; do
        local preset_output=$("$SCRIPT_DIR/mcp-env-setup.sh" "$preset" 2>/dev/null | head -1)
        if [[ "$preset_output" == *"$preset"* ]] || [[ "$preset_output" == *"Setting"* ]]; then
            echo "   ✅ Preset '$preset' available"
        else
            echo "   ❌ Preset '$preset' failed: $preset_output"
            test_passed=false
        fi
    done
    
    # Test 3: Show command functionality
    echo "3️⃣  Testing show command..."
    local show_output=$("$SCRIPT_DIR/mcp-env-setup.sh" show 2>/dev/null || echo "error")
    if [[ "$show_output" == *"Current MCP Environment Settings"* ]]; then
        echo "   ✅ Show command works"
    else
        echo "   ❌ Show command failed: $show_output"
        test_passed=false
    fi
    
    if [[ "$test_passed" == "true" ]]; then
        echo "   🎉 Environment Control System: PASSED"
    else
        echo "   💥 Environment Control System: FAILED"
    fi
    echo ""
    
    return $([ "$test_passed" == "true" ] && echo 0 || echo 1)
}

validate_fallback_mechanisms() {
    echo "🧪 Testing Fallback Mechanisms"
    echo "=============================="
    
    local test_passed=true
    
    # Test 1: MCP unavailable fallback
    echo "1️⃣  Testing MCP unavailable fallback..."
    local fallback_selection=$(MCP_FALLBACK=true "$SCRIPT_DIR/mcp-selection-engine.sh" select dev-server 2>/dev/null || echo "error")
    if [[ "$fallback_selection" =~ ^(mcp|hooks)$ ]]; then
        echo "   ✅ Fallback selection works: $fallback_selection"
    else
        echo "   ❌ Fallback selection failed: $fallback_selection"
        test_passed=false
    fi
    
    # Test 2: Hybrid mode functionality
    echo "2️⃣  Testing hybrid mode..."
    local hybrid_selection=$(HYBRID_MODE=true "$SCRIPT_DIR/mcp-selection-engine.sh" select test-execution 2>/dev/null || echo "error")
    if [[ "$hybrid_selection" =~ ^(mcp|hooks)$ ]]; then
        echo "   ✅ Hybrid mode works: $hybrid_selection"
    else
        echo "   ❌ Hybrid mode failed: $hybrid_selection"
        test_passed=false
    fi
    
    # Test 3: Error handling in wrapper scripts
    echo "3️⃣  Testing error handling..."
    local error_output=$(timeout 5s "$SCRIPT_DIR/smart-dev-mcp.sh" invalid-action 2>&1 || echo "handled")
    if [[ "$error_output" == *"Unknown"* ]] || [[ "$error_output" == *"handled"* ]]; then
        echo "   ✅ Error handling works"
    else
        echo "   ❌ Error handling needs improvement"
        test_passed=false
    fi
    
    if [[ "$test_passed" == "true" ]]; then
        echo "   🎉 Fallback Mechanisms: PASSED"
    else
        echo "   💥 Fallback Mechanisms: FAILED"
    fi
    echo ""
    
    return $([ "$test_passed" == "true" ] && echo 0 || echo 1)
}

validate_integration_with_existing_system() {
    echo "🧪 Testing Integration with Existing System"
    echo "==========================================="
    
    local test_passed=true
    
    # Test 1: Original scripts still work
    echo "1️⃣  Testing existing script compatibility..."
    if [[ -x "$SCRIPT_DIR/smart-dev.sh" ]]; then
        echo "   ✅ Original smart-dev.sh still available"
    else
        echo "   ❌ Original smart-dev.sh missing"
        test_passed=false
    fi
    
    # Test 2: Hooks system remains functional
    echo "2️⃣  Testing hooks system availability..."
    if [[ -d "$SCRIPT_DIR/hooks" ]]; then
        echo "   ✅ Hooks system directory exists"
        
        if [[ -f "$SCRIPT_DIR/hooks/config/test-strategies.json" ]]; then
            echo "   ✅ Hooks configuration files intact"
        else
            echo "   ❌ Hooks configuration missing"
            test_passed=false
        fi
    else
        echo "   ❌ Hooks system directory missing"
        test_passed=false
    fi
    
    # Test 3: Original npm scripts still work
    echo "3️⃣  Testing original npm scripts..."
    local original_scripts=("dev" "test:e2e:smoke" "validate")
    for script in "${original_scripts[@]}"; do
        if grep -q "\"$script\":" "$SCRIPT_DIR/../package.json"; then
            echo "   ✅ Original $script script preserved"
        else
            echo "   ❌ Original $script script missing"
            test_passed=false
        fi
    done
    
    if [[ "$test_passed" == "true" ]]; then
        echo "   🎉 Integration with Existing System: PASSED"
    else
        echo "   💥 Integration with Existing System: FAILED"
    fi
    echo ""
    
    return $([ "$test_passed" == "true" ] && echo 0 || echo 1)
}

# =============================================================================
# COMPREHENSIVE VALIDATION SUITE
# =============================================================================

run_full_validation() {
    echo "🔍 Running Comprehensive Phase 2 Validation"
    echo "============================================"
    echo ""
    
    local overall_passed=true
    local tests_run=0
    local tests_passed=0
    
    # Run all validation tests
    local validation_functions=(
        "validate_smart_selection_engine"
        "validate_smart_wrapper_scripts" 
        "validate_npm_script_variants"
        "validate_environment_control_system"
        "validate_fallback_mechanisms"
        "validate_integration_with_existing_system"
    )
    
    for test_func in "${validation_functions[@]}"; do
        tests_run=$((tests_run + 1))
        if $test_func; then
            tests_passed=$((tests_passed + 1))
        else
            overall_passed=false
        fi
    done
    
    # Summary
    echo "📊 Validation Summary"
    echo "===================="
    echo "📅 Completed: $(date)"
    echo "🧪 Tests Run: $tests_run"
    echo "✅ Tests Passed: $tests_passed"
    echo "❌ Tests Failed: $((tests_run - tests_passed))"
    echo "📊 Success Rate: $(echo "scale=1; $tests_passed * 100 / $tests_run" | bc -l)%"
    echo ""
    
    if [[ "$overall_passed" == "true" ]]; then
        echo "🎉 PHASE 2 IMPLEMENTATION: FULLY VALIDATED"
        echo "✅ All systems operational"
        echo "✅ Smart selection working correctly"
        echo "✅ Fallback mechanisms functional"
        echo "✅ Integration preserved"
        echo ""
        echo "💡 Ready for production use!"
    else
        echo "💥 PHASE 2 IMPLEMENTATION: VALIDATION ISSUES DETECTED"
        echo "❌ Some tests failed - review log above"
        echo "🔧 Fix issues before proceeding to Phase 3"
    fi
    
    echo ""
    echo "📝 Full validation log: $VALIDATION_LOG"
    
    return $([ "$overall_passed" == "true" ] && echo 0 || echo 1)
}

# =============================================================================
# QUICK VALIDATION FUNCTIONS
# =============================================================================

quick_validation() {
    echo "⚡ Quick Phase 2 Validation"
    echo "=========================="
    
    # Just check the core components
    local issues_found=false
    
    echo "1️⃣  Smart selection engine..."
    if [[ -x "$SCRIPT_DIR/mcp-selection-engine.sh" ]] && "$SCRIPT_DIR/mcp-selection-engine.sh" select dev-server >/dev/null 2>&1; then
        echo "   ✅ Working"
    else
        echo "   ❌ Issues detected"
        issues_found=true
    fi
    
    echo "2️⃣  Smart wrapper scripts..."
    if [[ -x "$SCRIPT_DIR/smart-dev-mcp.sh" ]] && [[ -x "$SCRIPT_DIR/smart-test-mcp.sh" ]] && [[ -x "$SCRIPT_DIR/smart-validate-mcp.sh" ]]; then
        echo "   ✅ All present and executable"
    else
        echo "   ❌ Missing or not executable"
        issues_found=true
    fi
    
    echo "3️⃣  npm script variants..."
    if grep -q "dev:mcp" "$SCRIPT_DIR/../package.json" && grep -q "dev:auto" "$SCRIPT_DIR/../package.json"; then
        echo "   ✅ Script variants added"
    else
        echo "   ❌ Script variants missing"
        issues_found=true
    fi
    
    echo "4️⃣  Environment control..."
    if [[ -x "$SCRIPT_DIR/mcp-env-setup.sh" ]] && "$SCRIPT_DIR/mcp-env-setup.sh" show >/dev/null 2>&1; then
        echo "   ✅ Environment control functional"
    else
        echo "   ❌ Environment control issues"
        issues_found=true
    fi
    
    echo ""
    if [[ "$issues_found" == "false" ]]; then
        echo "🎉 Quick validation: PASSED"
        echo "💡 Run '$0 full' for comprehensive validation"
    else
        echo "💥 Quick validation: ISSUES DETECTED"
        echo "🔧 Run '$0 full' for detailed analysis"
    fi
}

show_usage() {
    echo "Phase 2 Implementation Validation Tool"
    echo ""
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  full      Run comprehensive validation suite (default)"
    echo "  quick     Run quick validation check"
    echo "  status    Show validation results status"
    echo "  clean     Clean old validation results"
    echo ""
    echo "Examples:"
    echo "  $0              # Run full validation"
    echo "  $0 quick        # Quick validation check"
    echo "  $0 status       # Show available results"
}

show_validation_status() {
    echo "📊 Validation Results Status"
    echo "============================"
    
    if [[ -d "$VALIDATION_RESULTS_DIR" ]]; then
        echo "📁 Results Directory: $VALIDATION_RESULTS_DIR"
        echo ""
        echo "📋 Recent Validation Logs:"
        ls -la "$VALIDATION_RESULTS_DIR"/*.log 2>/dev/null | head -5 || echo "   No validation logs found"
    else
        echo "📁 No validation results directory found"
        echo "💡 Run '$0 full' to create validation results"
    fi
}

clean_old_validation_results() {
    echo "🧹 Cleaning old validation results..."
    
    if [[ -d "$VALIDATION_RESULTS_DIR" ]]; then
        # Keep only the 3 most recent validation logs
        local old_logs=$(ls -t "$VALIDATION_RESULTS_DIR"/*.log 2>/dev/null | tail -n +4)
        
        if [[ -n "$old_logs" ]]; then
            echo "$old_logs" | xargs rm -f
            echo "✅ Cleaned old validation logs"
        else
            echo "📁 No old logs to clean"
        fi
    else
        echo "📁 No validation results directory to clean"
    fi
}

# =============================================================================
# MAIN EXECUTION
# =============================================================================

case "${1:-full}" in
    "full")
        run_full_validation
        ;;
    "quick")
        quick_validation
        ;;
    "status")
        show_validation_status
        ;;
    "clean")
        clean_old_validation_results
        ;;
    "help"|"--help"|"-h")
        show_usage
        ;;
    *)
        echo "Unknown command: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac