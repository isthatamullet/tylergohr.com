#!/bin/bash

# Smart Quality Gates - MCP Integration  
# Intelligently selects between MCP validateQualityGatesMCP and hooks system

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/mcp-selection-engine.sh"

# =============================================================================
# SMART QUALITY GATES SELECTION
# =============================================================================

smart_quality_gates() {
    local checks="${1:-typescript,eslint,build}"
    local parallel="${2:-true}"
    local fail_fast="${3:-false}"
    
    echo "✅ Smart Quality Gates - Phase 2 MCP Integration"
    echo "================================================"
    
    # Get optimal tool selection
    local selected_tool=$(select_optimal_tool "quality-gates")
    local environment=$(detect_environment)
    local mcp_available=$(check_mcp_server_availability)
    
    echo "🔍 Environment: $environment"
    echo "🤖 MCP Available: $mcp_available"
    echo "🎯 Selected Tool: $selected_tool"
    echo "🔍 Checks: $checks"
    echo ""
    
    case "$selected_tool" in
        "mcp")
            execute_mcp_quality_gates "$checks" "$parallel" "$fail_fast"
            ;;
        "hooks")
            execute_hooks_quality_gates "$checks" "$parallel" "$fail_fast"
            ;;
        *)
            log_error "Unknown tool selection: $selected_tool"
            exit 1
            ;;
    esac
}

# =============================================================================
# MCP QUALITY GATES EXECUTION
# =============================================================================

execute_mcp_quality_gates() {
    local checks="$1"
    local parallel="$2"
    local fail_fast="$3"
    
    log_info "🤖 Using MCP quality gates validation"
    
    # Convert comma-separated checks to array format for Claude
    local checks_array=$(echo "$checks" | sed 's/,/", "/g' | sed 's/^/["/' | sed 's/$/"]/')
    
    echo ""
    echo "🚨 CLAUDE CODE: USE MCP TOOLS NOW"
    echo "🚨 CLAUDE PROMPT: validateQualityGatesMCP({"
    echo "  checks: $checks_array,"
    echo "  parallel: $parallel,"
    echo "  failFast: $fail_fast,"
    echo "  timeout: 300000"
    echo "})"
    echo "🚨 REASON: Comprehensive quality validation without bash timeout risks"
    echo ""
    echo "⚡ **MCP Benefits**:"
    echo "- ✅ Direct TypeScript compiler access (no npm script overhead)"
    echo "- ✅ Parallel execution of quality checks"
    echo "- ✅ Timeout-resistant validation with progress feedback"
    echo "- ✅ Bundle size validation with detailed analysis"
    echo "- ✅ Comprehensive error reporting with actionable guidance"
    echo ""
    echo "💡 **Alternative**: If MCP unavailable, will fallback to hooks system"
    
    # Show what checks will be performed
    echo ""
    echo "📋 **Quality Checks to be performed**:"
    IFS=',' read -ra CHECK_ARRAY <<< "$checks"
    for check in "${CHECK_ARRAY[@]}"; do
        case "$check" in
            "typescript")
                echo "- 🔷 TypeScript compilation validation"
                ;;
            "eslint")
                echo "- 🔧 ESLint code quality and style validation"
                ;;
            "build")
                echo "- 🏗️  Production build test"
                ;;
            "bundle")
                echo "- 📦 Bundle size validation (<6MB budget)"
                ;;
            *)
                echo "- ❓ Unknown check: $check"
                ;;
        esac
    done
    
    # For demonstration, show expected execution flow
    if [[ "$DEMO_MCP_RESPONSE" == "true" ]]; then
        echo ""
        echo "📋 **Expected MCP Execution Flow**:"
        echo "1. ✅ Project context validation"
        echo "2. ✅ Quality check orchestration setup"
        if [[ "$parallel" == "true" ]]; then
            echo "3. ✅ Parallel execution of selected checks"
        else
            echo "3. ✅ Sequential execution of selected checks"
        fi
        echo "4. ✅ Result aggregation and analysis"
        echo "5. ✅ Comprehensive report with actionable recommendations"
    fi
    
    return 0
}

# =============================================================================
# HOOKS QUALITY GATES EXECUTION
# =============================================================================

execute_hooks_quality_gates() {
    local checks="$1"
    local parallel="$2"
    local fail_fast="$3"
    
    log_info "🔧 Using hooks system quality gates"
    
    local exit_code=0
    
    # Parse checks and execute accordingly
    IFS=',' read -ra CHECK_ARRAY <<< "$checks"
    
    if [[ "$parallel" == "true" ]]; then
        execute_parallel_checks "${CHECK_ARRAY[@]}"
        exit_code=$?
    else
        execute_sequential_checks "$fail_fast" "${CHECK_ARRAY[@]}"
        exit_code=$?
    fi
    
    if [[ $exit_code -eq 0 ]]; then
        log_success "All quality gates passed!"
    else
        log_error "Quality gates failed"
    fi
    
    return $exit_code
}

execute_parallel_checks() {
    local checks=("$@")
    local pids=()
    local results=()
    
    echo "🔄 Running quality checks in parallel..."
    
    # Start all checks in background
    for check in "${checks[@]}"; do
        (
            case "$check" in
                "typescript")
                    echo "🔷 Running TypeScript validation..."
                    npm run typecheck
                    ;;
                "eslint")
                    echo "🔧 Running ESLint validation..."
                    npm run lint
                    ;;
                "build")
                    echo "🏗️  Running build validation..."
                    npm run build
                    ;;
                "bundle")
                    echo "📦 Running bundle size validation..."
                    if command -v bundlesize >/dev/null 2>&1; then
                        bundlesize
                    else
                        # Simple bundle size check
                        if [[ -d ".next" ]]; then
                            local size=$(du -sm .next 2>/dev/null | cut -f1)
                            if [[ $size -gt 6 ]]; then
                                echo "❌ Bundle size ${size}MB exceeds 6MB budget"
                                exit 1
                            else
                                echo "✅ Bundle size ${size}MB within 6MB budget"
                            fi
                        else
                            echo "⚠️  No build found, run 'npm run build' first"
                            exit 1
                        fi
                    fi
                    ;;
                *)
                    echo "❓ Unknown check: $check"
                    exit 1
                    ;;
            esac
        ) &
        pids+=($!)
    done
    
    # Wait for all checks to complete
    local overall_exit_code=0
    for i in "${!pids[@]}"; do
        local pid=${pids[$i]}
        local check=${checks[$i]}
        
        if wait $pid; then
            results+=("✅ $check: PASSED")
        else
            results+=("❌ $check: FAILED")
            overall_exit_code=1
        fi
    done
    
    # Show results
    echo ""
    echo "📊 Quality Gates Results:"
    for result in "${results[@]}"; do
        echo "  $result"
    done
    
    return $overall_exit_code
}

execute_sequential_checks() {
    local fail_fast="$1"
    shift
    local checks=("$@")
    local exit_code=0
    
    echo "🔄 Running quality checks sequentially..."
    
    for check in "${checks[@]}"; do
        echo ""
        echo "▶️  Running $check validation..."
        
        case "$check" in
            "typescript")
                if ! npm run typecheck; then
                    echo "❌ TypeScript validation failed"
                    exit_code=1
                    [[ "$fail_fast" == "true" ]] && return $exit_code
                fi
                ;;
            "eslint")
                if ! npm run lint; then
                    echo "❌ ESLint validation failed"
                    exit_code=1
                    [[ "$fail_fast" == "true" ]] && return $exit_code
                fi
                ;;
            "build")
                if ! npm run build; then
                    echo "❌ Build validation failed"
                    exit_code=1
                    [[ "$fail_fast" == "true" ]] && return $exit_code
                fi
                ;;
            "bundle")
                # Bundle size check (simplified)
                if [[ -d ".next" ]]; then
                    local size=$(du -sm .next 2>/dev/null | cut -f1)
                    if [[ $size -gt 6 ]]; then
                        echo "❌ Bundle size ${size}MB exceeds 6MB budget"
                        exit_code=1
                        [[ "$fail_fast" == "true" ]] && return $exit_code
                    else
                        echo "✅ Bundle size ${size}MB within 6MB budget"
                    fi
                else
                    echo "⚠️  No build found for bundle validation"
                fi
                ;;
            *)
                echo "❓ Unknown check: $check"
                exit_code=1
                [[ "$fail_fast" == "true" ]] && return $exit_code
                ;;
        esac
    done
    
    return $exit_code
}

# =============================================================================
# UTILITIES
# =============================================================================

show_available_checks() {
    echo "Available quality checks:"
    echo "  typescript    TypeScript compilation validation"
    echo "  eslint        ESLint code quality and style"
    echo "  build         Production build test"
    echo "  bundle        Bundle size validation (<6MB)"
}

show_usage() {
    echo "Smart Quality Gates - MCP Integration"
    echo ""
    echo "Usage: $0 [checks] [parallel] [fail_fast]"
    echo ""
    echo "Quality Checks:"
    show_available_checks
    echo ""
    echo "Options:"
    echo "  checks        Comma-separated list of checks (default: typescript,eslint,build)"
    echo "  parallel      Run checks in parallel (true/false, default: true)"
    echo "  fail_fast     Stop on first failure (true/false, default: false)"
    echo ""
    echo "Environment Variables:"
    echo "  USE_MCP=true              Force MCP tools"
    echo "  FORCE_HOOKS=true          Force hooks system"
    echo "  HYBRID_MODE=true          Use best tool for operation"
    echo "  MCP_FALLBACK=true         Enable hooks fallback (default)"
    echo "  DEMO_MCP_RESPONSE=true    Show example MCP execution flow"
    echo ""
    echo "Examples:"
    echo "  $0                        # Run default checks with smart selection"
    echo "  $0 typescript,eslint      # Run only TypeScript and ESLint"
    echo "  $0 typescript,eslint,build,bundle true false # All checks, parallel, no fail fast"
    echo "  USE_MCP=true $0           # Force MCP for quality gates"
    echo "  FORCE_HOOKS=true $0       # Force hooks system"
}

# =============================================================================
# MAIN EXECUTION
# =============================================================================

case "${1:-default}" in
    "default")
        smart_quality_gates "typescript,eslint,build" "true" "false"
        ;;
    "typescript"|"eslint"|"build"|"bundle"|*","*)
        smart_quality_gates "$1" "${2:-true}" "${3:-false}"
        ;;
    "checks"|"list")
        show_available_checks
        ;;
    "info")
        print_selection_info "quality-gates"
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