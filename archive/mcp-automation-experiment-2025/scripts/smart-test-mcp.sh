#!/bin/bash

# Smart Test Execution - MCP Integration
# Intelligently selects between MCP executeTestMCP and hooks system

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/mcp-selection-engine.sh"

# =============================================================================
# SMART TEST EXECUTION SELECTION
# =============================================================================

smart_test_execution() {
    local test_type="${1:-smoke}"
    local browser="${2:-chromium}" 
    local skip_visual="${3:-false}"
    local fast_mode="${4:-false}"
    
    echo "🧪 Smart Test Execution - Phase 2 MCP Integration"
    echo "=================================================="
    
    # Get optimal tool selection
    local selected_tool=$(select_optimal_tool "test-execution")
    local environment=$(detect_environment)
    local mcp_available=$(check_mcp_server_availability)
    
    echo "🔍 Environment: $environment"
    echo "🤖 MCP Available: $mcp_available"
    echo "🎯 Selected Tool: $selected_tool"
    echo "🧪 Test Type: $test_type"
    echo ""
    
    case "$selected_tool" in
        "mcp")
            execute_mcp_test_execution "$test_type" "$browser" "$skip_visual" "$fast_mode"
            ;;
        "hooks")
            execute_hooks_test_execution "$test_type" "$browser" "$skip_visual" "$fast_mode"
            ;;
        *)
            log_error "Unknown tool selection: $selected_tool"
            exit 1
            ;;
    esac
}

# =============================================================================
# MCP TEST EXECUTION
# =============================================================================

execute_mcp_test_execution() {
    local test_type="$1"
    local browser="$2"
    local skip_visual="$3"
    local fast_mode="$4"
    
    log_info "🤖 Using MCP test execution tools"
    
    # Show test strategy information from existing configuration
    show_test_strategy_info "$test_type"
    
    echo ""
    echo "🚨 CLAUDE CODE: USE MCP TOOLS NOW"
    echo "🚨 CLAUDE PROMPT: executeTestMCP({"
    echo "  testType: \"$test_type\","
    echo "  browser: \"$browser\","
    echo "  skipVisual: $skip_visual,"
    echo "  fastMode: $fast_mode"
    echo "})"
    echo "🚨 REASON: Timeout-resistant test execution with intelligent strategy selection"
    echo ""
    echo "⚡ **MCP Benefits**:"
    echo "- ✅ Environment validation before test execution"
    echo "- ✅ Intelligent test strategy selection from test-strategies.json"
    echo "- ✅ Timeout-resistant execution with progress parsing"
    echo "- ✅ Cloud environment URL handling"
    echo "- ✅ Comprehensive result formatting for Claude analysis"
    echo ""
    echo "💡 **Alternative**: If MCP unavailable, will fallback to hooks system"
    
    # For demonstration, show what the MCP tool would validate
    if [[ "$DEMO_MCP_RESPONSE" == "true" ]]; then
        echo ""
        echo "📋 **Expected MCP Validation Steps**:"
        echo "1. ✅ Development server health check"
        echo "2. ✅ Test environment validation"
        echo "3. ✅ Test strategy selection: $test_type"
        echo "4. ✅ Environment variable setup"
        echo "5. ✅ Timeout-resistant test execution"
        echo "6. ✅ Result analysis and formatting"
    fi
    
    return 0
}

# =============================================================================
# HOOKS TEST EXECUTION
# =============================================================================

execute_hooks_test_execution() {
    local test_type="$1"
    local browser="$2"
    local skip_visual="$3"
    local fast_mode="$4"
    
    log_info "🔧 Using hooks system test execution"
    
    # Set up environment variables for hooks system
    export SKIP_VISUAL="$skip_visual"
    export FAST_MODE="$fast_mode"
    
    case "$test_type" in
        "smoke")
            if [[ "$fast_mode" == "true" ]]; then
                "$SCRIPT_DIR/subagent-integration.sh" run npm run test:e2e:smoke
            else
                npm run test:e2e:smoke
            fi
            ;;
        "dev"|"component")
            npm run test:e2e:dev
            ;;
        "visual")
            if [[ "$skip_visual" == "true" ]]; then
                log_warning "Visual testing requested but skip_visual=true, running component tests instead"
                npm run test:e2e:dev
            else
                npm run test:e2e:visual
            fi
            ;;
        "navigation")
            npm run test:e2e:navigation
            ;;
        "accessibility")
            npm run test:e2e:accessibility
            ;;
        "performance")
            npm run test:e2e:performance
            ;;
        "mobile")
            npm run test:e2e:mobile
            ;;
        "comprehensive")
            npm run test:e2e:portfolio
            ;;
        "screenshot")
            npm run test:e2e:screenshot
            ;;
        *)
            log_error "Unknown test type: $test_type"
            echo ""
            show_available_test_types
            exit 1
            ;;
    esac
}

# =============================================================================
# TEST STRATEGY INFORMATION
# =============================================================================

show_test_strategy_info() {
    local test_type="$1"
    local strategies_file="$SCRIPT_DIR/hooks/config/test-strategies.json"
    
    if [[ -f "$strategies_file" ]]; then
        echo "📋 **Test Strategy Information**:"
        
        # Extract strategy info using basic shell tools
        if command -v jq >/dev/null 2>&1; then
            local description=$(jq -r ".test_strategies.${test_type}.description // \"Unknown test type\"" "$strategies_file" 2>/dev/null)
            local estimated_time=$(jq -r ".test_strategies.${test_type}.estimated_time // \"Unknown\"" "$strategies_file" 2>/dev/null)
            local coverage=$(jq -r ".test_strategies.${test_type}.coverage // \"Unknown\"" "$strategies_file" 2>/dev/null)
            
            echo "- Description: $description"
            echo "- Estimated Time: $estimated_time"
            echo "- Coverage: $coverage"
        else
            # Fallback without jq
            echo "- Test Type: $test_type"
            echo "- Strategy file: test-strategies.json (jq not available for detailed parsing)"
        fi
    else
        echo "- Test Type: $test_type (strategy file not found)"
    fi
}

show_available_test_types() {
    echo "Available test types:"
    echo "  smoke         Essential functionality validation (<1min)"
    echo "  dev           Component behavior testing (2-3min)"
    echo "  component     Same as dev - component testing"
    echo "  visual        Visual regression testing (5-8min)"
    echo "  navigation    Navigation behavior testing (3-4min)"
    echo "  accessibility WCAG compliance testing (2-3min)"
    echo "  performance   Core Web Vitals testing (4-6min)"
    echo "  mobile        Cross-device testing (3-5min)"
    echo "  comprehensive Full test suite (8-10min)"
    echo "  screenshot    Screenshot generation only"
}

show_usage() {
    echo "Smart Test Execution - MCP Integration"
    echo ""
    echo "Usage: $0 [test_type] [browser] [skip_visual] [fast_mode]"
    echo ""
    echo "Test Types:"
    show_available_test_types
    echo ""
    echo "Options:"
    echo "  browser       Browser to use (chromium, firefox, webkit, all)"
    echo "  skip_visual   Skip visual regression (true/false)"
    echo "  fast_mode     Use fast mode settings (true/false)"
    echo ""
    echo "Environment Variables:"
    echo "  USE_MCP=true              Force MCP tools"
    echo "  FORCE_HOOKS=true          Force hooks system"
    echo "  AUTO_SELECT_MCP=true      Auto-use MCP in cloud environments (default)"
    echo "  MCP_FALLBACK=true         Enable hooks fallback (default)"
    echo "  DEMO_MCP_RESPONSE=true    Show example MCP validation steps"
    echo ""
    echo "Examples:"
    echo "  $0                        # Run smoke tests with smart selection"
    echo "  $0 visual chromium        # Run visual tests in Chrome"
    echo "  $0 smoke all true true    # Fast smoke tests, skip visual, all browsers"
    echo "  USE_MCP=true $0 dev       # Force MCP for component testing"
}

# =============================================================================
# MAIN EXECUTION
# =============================================================================

case "${1:-smoke}" in
    "smoke"|"dev"|"component"|"visual"|"navigation"|"accessibility"|"performance"|"mobile"|"comprehensive"|"screenshot")
        smart_test_execution "$1" "${2:-chromium}" "${3:-false}" "${4:-false}"
        ;;
    "list"|"types")
        show_available_test_types
        ;;
    "info")
        print_selection_info "test-execution"
        ;;
    "help"|"--help"|"-h")
        show_usage
        ;;
    *)
        echo "Unknown test type: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac