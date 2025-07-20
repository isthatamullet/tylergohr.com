#!/bin/bash

# Smart Development Server - MCP Integration
# Intelligently selects between MCP startDevServerMCP and hooks system

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/mcp-selection-engine.sh"

# Phase 3 Hybrid Orchestrator Integration
HYBRID_ORCHESTRATOR="$SCRIPT_DIR/hybrid-orchestrator-cli.js"

# =============================================================================
# SMART DEVELOPMENT SERVER SELECTION
# =============================================================================

smart_dev_server() {
    local action="${1:-start}"
    local port="$2"
    local enhanced_mode="${3:-false}"
    
    echo "🚀 Smart Development Server - Phase 3 Hybrid Orchestrator"
    echo "=========================================================="
    
    # Use Phase 3 Hybrid Orchestrator for intelligent tool selection
    local orchestrator_result=""
    if [ -f "$HYBRID_ORCHESTRATOR" ]; then
        echo "🧠 Using Phase 3 Hybrid Orchestrator for intelligent selection..."
        orchestrator_result=$(node "$HYBRID_ORCHESTRATOR" "dev-server" "auto" "json" 2>/dev/null || echo '{"selectedTool":"hooks","confidence":75,"reasoning":"Fallback to legacy selection"}')
        
        # Parse orchestrator results
        local selected_tool=$(echo "$orchestrator_result" | grep -o '"selectedTool":"[^"]*"' | cut -d'"' -f4 || echo "hooks")
        local confidence=$(echo "$orchestrator_result" | grep -o '"confidence":[0-9]*' | cut -d':' -f2 || echo "75")
        local reasoning=$(echo "$orchestrator_result" | grep -o '"reasoning":"[^"]*"' | cut -d'"' -f4 || echo "Legacy fallback")
        local environment=$(echo "$orchestrator_result" | grep -o '"environment":"[^"]*"' | cut -d'"' -f4 || detect_environment)
        
        echo "🎯 Hybrid Orchestrator Analysis:"
        echo "   Selected Tool: $selected_tool (confidence: $confidence%)"
        echo "   Environment: $environment"
        echo "   Reasoning: $reasoning"
    else
        echo "⚠️  Hybrid Orchestrator not available, using legacy selection..."
        local selected_tool=$(select_optimal_tool "dev-server")
        local environment=$(detect_environment)
        local confidence="75"
        echo "🔍 Environment: $environment"
        echo "🎯 Selected Tool: $selected_tool"
    fi
    
    local mcp_available=$(check_mcp_server_availability)
    echo "🤖 MCP Available: $mcp_available"
    echo ""
    
    case "$selected_tool" in
        "mcp")
            execute_mcp_dev_server "$action" "$port" "$enhanced_mode"
            ;;
        "hooks")
            execute_hooks_dev_server "$action" "$port" "$enhanced_mode"
            ;;
        *)
            log_error "Unknown tool selection: $selected_tool"
            exit 1
            ;;
    esac
}

# =============================================================================
# MCP DEVELOPMENT SERVER EXECUTION
# =============================================================================

execute_mcp_dev_server() {
    local action="$1"
    local port="$2"
    local enhanced_mode="$3"
    
    log_info "🤖 Using MCP development server tools"
    
    case "$action" in
        "start")
            echo ""
            echo "🚨 CLAUDE CODE: USE MCP TOOLS NOW"
            echo "🚨 CLAUDE PROMPT: startDevServerMCP({action: \"start\", port: ${port:-3000}, enhanced: $enhanced_mode})"
            echo "🚨 REASON: Timeout-resistant development server with cloud environment support"
            echo ""
            echo "⚡ **MCP Benefits**:"
            echo "- ✅ 45-second reliable startup vs 2-minute timeout risk"
            echo "- ✅ Automatic cloud environment URL detection" 
            echo "- ✅ Intelligent port conflict resolution"
            echo "- ✅ Health validation before proceeding"
            echo ""
            echo "💡 **Alternative**: If MCP unavailable, will fallback to hooks system"
            
            # For demonstration, let's also show what the MCP tool would return
            if [[ "$DEMO_MCP_RESPONSE" == "true" ]]; then
                echo ""
                echo "📋 **Expected MCP Response**:"
                echo "🚀 Development server started successfully!"
                echo "📍 Port: ${port:-3000}"
                echo "📍 URL: $(construct_demo_url ${port:-3000})"
                echo "📍 Environment: $environment"
                echo "⚡ Ready for development!"
            fi
            ;;
        "stop")
            echo ""
            echo "🚨 CLAUDE CODE: USE MCP TOOLS NOW"
            echo "🚨 CLAUDE PROMPT: startDevServerMCP({action: \"stop\"})"
            echo "🚨 REASON: Clean server shutdown with port cleanup"
            ;;
        "restart")
            echo ""
            echo "🚨 CLAUDE CODE: USE MCP TOOLS NOW"  
            echo "🚨 CLAUDE PROMPT: startDevServerMCP({action: \"restart\", port: ${port:-3000}})"
            echo "🚨 REASON: Reliable server restart without manual intervention"
            ;;
        "status")
            echo ""
            echo "🚨 CLAUDE CODE: USE MCP TOOLS NOW"
            echo "🚨 CLAUDE PROMPT: startDevServerMCP({action: \"status\"})"
            echo "🚨 REASON: Comprehensive server health and environment analysis"
            ;;
        *)
            log_error "Unknown action: $action"
            exit 1
            ;;
    esac
    
    return 0
}

# =============================================================================
# HOOKS DEVELOPMENT SERVER EXECUTION  
# =============================================================================

execute_hooks_dev_server() {
    local action="$1"
    local port="$2" 
    local enhanced_mode="$3"
    
    log_info "🔧 Using hooks system development server"
    
    case "$action" in
        "start")
            if [[ "$enhanced_mode" == "true" ]]; then
                # Use enhanced/subagent integration
                "$SCRIPT_DIR/subagent-integration.sh" run npm run dev
            else
                # Use standard smart development server
                "$SCRIPT_DIR/smart-dev.sh" $port
            fi
            ;;
        "stop")
            # Kill existing servers
            pkill -f "next-server|npm run dev" 2>/dev/null || true
            log_success "Development server stopped"
            ;;
        "restart")
            execute_hooks_dev_server "stop"
            sleep 2
            execute_hooks_dev_server "start" "$port" "$enhanced_mode"
            ;;
        "status")
            # Check for active Next.js servers
            if pgrep -f "next-server" >/dev/null; then
                log_success "Development server is running"
                ps aux | grep -E "next-server|npm run dev" | grep -v grep || true
            else
                log_info "No development server currently running"
            fi
            ;;
        *)
            log_error "Unknown action: $action"
            exit 1
            ;;
    esac
}

# =============================================================================
# UTILITIES
# =============================================================================

construct_demo_url() {
    local port="$1"
    local environment=$(detect_environment)
    
    case "$environment" in
        "cloud-workstation")
            echo "https://${port}-tylergohr.cluster-region.cloudworkstations.dev"
            ;;
        "codespaces") 
            echo "https://\${CODESPACE_NAME}-${port}.preview.app.github.dev"
            ;;
        "gitpod")
            echo "https://${port}-\${GITPOD_WORKSPACE_URL#https://}"
            ;;
        *)
            echo "http://localhost:${port}"
            ;;
    esac
}

show_usage() {
    echo "Smart Development Server - MCP Integration"
    echo ""
    echo "Usage: $0 [action] [port] [enhanced]"
    echo ""
    echo "Actions:"
    echo "  start     Start development server (default)"
    echo "  stop      Stop development server"
    echo "  restart   Restart development server"
    echo "  status    Check development server status"
    echo "  info      Show selection information"
    echo ""
    echo "Options:"
    echo "  port      Port number (default: 3000)"
    echo "  enhanced  Use enhanced mode (true/false, default: false)"
    echo ""
    echo "Environment Variables:"
    echo "  USE_MCP=true              Force MCP tools"
    echo "  FORCE_HOOKS=true          Force hooks system"
    echo "  AUTO_SELECT_MCP=true      Auto-use MCP in cloud environments (default)"
    echo "  MCP_FALLBACK=true         Enable hooks fallback (default)"
    echo "  DEMO_MCP_RESPONSE=true    Show example MCP response"
    echo ""
    echo "Examples:"
    echo "  $0                        # Start server with smart selection"
    echo "  $0 start 3001 true       # Start on port 3001 with enhanced mode"
    echo "  USE_MCP=true $0           # Force MCP tool usage"
    echo "  FORCE_HOOKS=true $0       # Force hooks system usage"
}

# =============================================================================
# MAIN EXECUTION
# =============================================================================

case "${1:-start}" in
    "start"|"stop"|"restart"|"status")
        smart_dev_server "$1" "$2" "$3"
        ;;
    "info")
        print_selection_info "dev-server"
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