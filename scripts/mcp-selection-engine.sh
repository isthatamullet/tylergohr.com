#!/bin/bash

# MCP Selection Engine - Phase 2 Smart Tool Selection
# Intelligently chooses between MCP tools and hooks system based on context

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Source existing utilities
if [ -f "$SCRIPT_DIR/hooks/lib/hook-utils.sh" ]; then
    source "$SCRIPT_DIR/hooks/lib/hook-utils.sh"
fi

# =============================================================================
# ENVIRONMENT DETECTION
# =============================================================================

detect_environment() {
    if [[ -n "$CLOUDWORKSTATIONS_REGION" ]]; then
        echo "cloud-workstation"
    elif [[ -n "$CODESPACES" ]]; then
        echo "codespaces"  
    elif [[ -n "$GITPOD_WORKSPACE_ID" ]]; then
        echo "gitpod"
    else
        echo "local"
    fi
}

# =============================================================================
# MCP SERVER AVAILABILITY
# =============================================================================

check_mcp_server_availability() {
    local mcp_server_path="$PROJECT_ROOT/mcp-server/dist/index.js"
    
    # Check if MCP server executable exists
    if [[ ! -f "$mcp_server_path" ]]; then
        echo "false"
        return 1
    fi
    
    # Quick health check
    if node "$mcp_server_path" health >/dev/null 2>&1; then
        echo "true"
        return 0
    else
        echo "false"
        return 1
    fi
}

# =============================================================================
# SELECTION LOGIC
# =============================================================================

# Determine optimal tool for operation
select_optimal_tool() {
    local operation="$1"
    local environment=$(detect_environment)
    local mcp_available=$(check_mcp_server_availability)
    
    # Check user preferences first
    if [[ "$USE_MCP" == "true" ]]; then
        if [[ "$mcp_available" == "true" ]]; then
            echo "mcp"
            return 0
        else
            echo "hooks"
            log_warning "MCP requested but unavailable, falling back to hooks"
            return 0
        fi
    fi
    
    if [[ "$FORCE_HOOKS" == "true" ]]; then
        echo "hooks"
        return 0
    fi
    
    # Cloud environment auto-selection
    if [[ "$AUTO_SELECT_MCP" == "true" ]] || [[ -z "$AUTO_SELECT_MCP" ]]; then
        case "$environment" in
            "cloud-workstation"|"codespaces"|"gitpod")
                if [[ "$mcp_available" == "true" ]]; then
                    echo "mcp"
                    return 0
                else
                    echo "hooks"
                    log_info "Cloud environment detected but MCP unavailable, using hooks"
                    return 0
                fi
                ;;
        esac
    fi
    
    # Operation-specific selection
    case "$operation" in
        "dev-server")
            # Development server: MCP excels in cloud environments
            if [[ "$environment" != "local" ]] && [[ "$mcp_available" == "true" ]]; then
                echo "mcp"
            else
                echo "hooks"
            fi
            ;;
        "test-execution")
            # Test execution: MCP for timeout resistance
            if [[ "$mcp_available" == "true" ]]; then
                echo "mcp"
            else
                echo "hooks"
            fi
            ;;
        "quality-gates")
            # Quality gates: Both systems work well, prefer hooks for stability
            if [[ "$HYBRID_MODE" == "true" ]] && [[ "$mcp_available" == "true" ]]; then
                echo "mcp"
            else
                echo "hooks"
            fi
            ;;
        "port-detection")
            # Port detection: MCP has better cloud environment support
            if [[ "$mcp_available" == "true" ]]; then
                echo "mcp"
            else
                echo "hooks"
            fi
            ;;
        *)
            # Default: hooks system for unknown operations
            echo "hooks"
            ;;
    esac
}

# =============================================================================
# EXECUTION WITH FALLBACK
# =============================================================================

execute_with_fallback() {
    local operation="$1"
    local selected_tool="$2"
    shift 2
    local operation_args="$@"
    
    case "$selected_tool" in
        "mcp")
            execute_mcp_operation "$operation" "$operation_args"
            local mcp_result=$?
            
            if [[ $mcp_result -ne 0 ]] && [[ "$MCP_FALLBACK" != "false" ]]; then
                log_warning "MCP operation failed, falling back to hooks system"
                execute_hooks_operation "$operation" "$operation_args"
                return $?
            else
                return $mcp_result
            fi
            ;;
        "hooks")
            execute_hooks_operation "$operation" "$operation_args"
            return $?
            ;;
        *)
            log_error "Unknown tool selection: $selected_tool"
            return 1
            ;;
    esac
}

# =============================================================================
# TOOL-SPECIFIC EXECUTION
# =============================================================================

execute_mcp_operation() {
    local operation="$1"
    local args="$2"
    
    log_info "🤖 Executing via MCP: $operation"
    
    case "$operation" in
        "dev-server")
            # Signal to Claude Code to use startDevServerMCP
            echo "🤖 MCP RECOMMENDED: Use startDevServerMCP tool"
            echo "💡 CLAUDE PROMPT: startDevServerMCP({action: \"start\", enhanced: true})"
            echo "⚡ REASON: Timeout-resistant development server with cloud environment support"
            return 0
            ;;
        "test-execution")
            # Signal to Claude Code to use executeTestMCP  
            echo "🤖 MCP RECOMMENDED: Use executeTestMCP tool"
            echo "💡 CLAUDE PROMPT: executeTestMCP({testType: \"smoke\", fastMode: true})"
            echo "⚡ REASON: Timeout-resistant test execution with strategy selection"
            return 0
            ;;
        "quality-gates")
            # Signal to Claude Code to use validateQualityGatesMCP
            echo "🤖 MCP RECOMMENDED: Use validateQualityGatesMCP tool"  
            echo "💡 CLAUDE PROMPT: validateQualityGatesMCP({checks: [\"typescript\", \"eslint\", \"build\"]})"
            echo "⚡ REASON: Direct quality validation without bash timeout risks"
            return 0
            ;;
        "port-detection")
            # Signal to Claude Code to use detectActivePortMCP
            echo "🤖 MCP RECOMMENDED: Use detectActivePortMCP tool"
            echo "💡 CLAUDE PROMPT: detectActivePortMCP({scanPorts: true, includeHealth: true})"
            echo "⚡ REASON: Cloud-aware port detection with health validation"
            return 0
            ;;
        *)
            log_error "Unknown MCP operation: $operation"
            return 1
            ;;
    esac
}

execute_hooks_operation() {
    local operation="$1"
    local args="$2"
    
    log_info "🔧 Executing via hooks system: $operation"
    
    case "$operation" in
        "dev-server")
            # Use existing smart development server
            "$SCRIPT_DIR/smart-dev.sh" $args
            return $?
            ;;
        "test-execution")
            # Use existing subagent integration
            "$SCRIPT_DIR/subagent-integration.sh" run npm run test:e2e:smoke
            return $?
            ;;
        "quality-gates")
            # Use standard quality gates
            npm run typecheck && npm run lint && npm run build
            return $?
            ;;
        "port-detection")
            # Use existing port detection
            "$SCRIPT_DIR/detect-active-port.sh"
            return $?
            ;;
        *)
            log_error "Unknown hooks operation: $operation"
            return 1
            ;;
    esac
}

# =============================================================================
# LOGGING UTILITIES
# =============================================================================

log_info() {
    echo -e "\\033[34m[INFO]\\033[0m $1" >&2
}

log_warning() {
    echo -e "\\033[33m[WARNING]\\033[0m $1" >&2
}

log_error() {
    echo -e "\\033[31m[ERROR]\\033[0m $1" >&2
}

log_success() {
    echo -e "\\033[32m[SUCCESS]\\033[0m $1" >&2
}

# =============================================================================
# INFORMATION & STATUS
# =============================================================================

print_selection_info() {
    local operation="$1"
    local selected_tool=$(select_optimal_tool "$operation")
    local environment=$(detect_environment)
    local mcp_available=$(check_mcp_server_availability)
    
    echo "🎯 MCP Selection Engine - Phase 2"
    echo "=================================="
    echo "Operation: $operation"
    echo "Environment: $environment"
    echo "MCP Available: $mcp_available"
    echo "Selected Tool: $selected_tool"
    echo ""
    echo "Environment Variables:"
    echo "  USE_MCP: ${USE_MCP:-auto}"
    echo "  FORCE_HOOKS: ${FORCE_HOOKS:-false}"
    echo "  AUTO_SELECT_MCP: ${AUTO_SELECT_MCP:-true}"
    echo "  MCP_FALLBACK: ${MCP_FALLBACK:-true}"
    echo "  HYBRID_MODE: ${HYBRID_MODE:-false}"
    echo ""
}

# =============================================================================
# MAIN EXECUTION
# =============================================================================

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # Script is being executed directly
    case "${1:-help}" in
        "select")
            select_optimal_tool "$2"
            ;;
        "execute")
            operation="$2"
            selected_tool=$(select_optimal_tool "$operation")
            shift 2
            execute_with_fallback "$operation" "$selected_tool" "$@"
            ;;
        "info")
            print_selection_info "$2"
            ;;
        "check-mcp")
            check_mcp_server_availability
            ;;
        "environment")
            detect_environment
            ;;
        "help"|*)
            echo "MCP Selection Engine - Phase 2"
            echo ""
            echo "Usage: $0 <command> [args...]"
            echo ""
            echo "Commands:"
            echo "  select <operation>        Select optimal tool for operation"
            echo "  execute <operation> [args] Execute operation with smart selection"
            echo "  info <operation>          Show selection information"
            echo "  check-mcp                 Check MCP server availability"
            echo "  environment               Detect current environment"
            echo "  help                      Show this help"
            echo ""
            echo "Operations:"
            echo "  dev-server                Development server management"
            echo "  test-execution            Test execution with strategy selection"
            echo "  quality-gates             Quality validation (typecheck, lint, build)"
            echo "  port-detection            Port detection and environment analysis"
            echo ""
            echo "Environment Variables:"
            echo "  USE_MCP=true              Force MCP tools"
            echo "  FORCE_HOOKS=true          Force hooks system" 
            echo "  AUTO_SELECT_MCP=true      Auto-use MCP in cloud environments"
            echo "  MCP_FALLBACK=true         Enable hooks fallback when MCP fails"
            echo "  HYBRID_MODE=true          Use best tool for each operation"
            ;;
    esac
fi