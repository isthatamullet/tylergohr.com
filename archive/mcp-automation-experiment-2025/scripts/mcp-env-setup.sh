#!/bin/bash

# MCP Environment Setup - Phase 2 Environment Control System
# Configure user preferences for MCP vs hooks system selection

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# =============================================================================
# ENVIRONMENT CONTROL VARIABLES
# =============================================================================

show_current_settings() {
    echo "🎯 Current MCP Environment Settings"
    echo "=================================="
    echo ""
    echo "System Selection:"
    echo "  USE_MCP: ${USE_MCP:-auto}"
    echo "  FORCE_HOOKS: ${FORCE_HOOKS:-false}"
    echo "  AUTO_SELECT_MCP: ${AUTO_SELECT_MCP:-true}"
    echo ""
    echo "Reliability & Fallback:"
    echo "  MCP_FALLBACK: ${MCP_FALLBACK:-true}"
    echo "  HYBRID_MODE: ${HYBRID_MODE:-false}"
    echo ""
    echo "Development & Testing:"
    echo "  CLAUDE_AUTO_SUBAGENT: ${CLAUDE_AUTO_SUBAGENT:-false}"
    echo "  DEMO_MCP_RESPONSE: ${DEMO_MCP_RESPONSE:-false}"
    echo ""
    echo "Environment Detection:"
    echo "  Current Environment: $(detect_current_environment)"
    echo "  MCP Server Available: $(check_mcp_availability)"
    echo ""
}

detect_current_environment() {
    if [[ -n "$CLOUDWORKSTATIONS_REGION" ]]; then
        echo "Google Cloud Workstations"
    elif [[ -n "$CODESPACES" ]]; then
        echo "GitHub Codespaces"
    elif [[ -n "$GITPOD_WORKSPACE_ID" ]]; then
        echo "Gitpod"
    else
        echo "Local Development"
    fi
}

check_mcp_availability() {
    local mcp_server_path="$SCRIPT_DIR/../mcp-server/dist/index.js"
    if [[ -f "$mcp_server_path" ]] && node "$mcp_server_path" health >/dev/null 2>&1; then
        echo "✅ Available"
    else
        echo "❌ Unavailable"
    fi
}

# =============================================================================
# CONFIGURATION PRESETS
# =============================================================================

set_mcp_primary() {
    echo "🤖 Setting MCP as primary development tool"
    export USE_MCP=true
    export FORCE_HOOKS=false
    export AUTO_SELECT_MCP=true
    export MCP_FALLBACK=true
    export HYBRID_MODE=false
    
    echo "✅ MCP Primary Mode Enabled"
    echo "   - All operations will prefer MCP tools"
    echo "   - Hooks system available as fallback"
    echo "   - Cloud environments will auto-select MCP"
}

set_hooks_primary() {
    echo "🔧 Setting hooks as primary development tool"
    export USE_MCP=false
    export FORCE_HOOKS=true
    export AUTO_SELECT_MCP=false
    export MCP_FALLBACK=false
    export HYBRID_MODE=false
    
    echo "✅ Hooks Primary Mode Enabled"
    echo "   - All operations will use hooks system"
    echo "   - MCP tools available via :mcp commands"
    echo "   - Proven stable hooks system prioritized"
}

set_auto_select() {
    echo "🎯 Setting intelligent auto-selection mode"
    export USE_MCP=auto
    export FORCE_HOOKS=false
    export AUTO_SELECT_MCP=true
    export MCP_FALLBACK=true
    export HYBRID_MODE=true
    
    echo "✅ Auto-Selection Mode Enabled"
    echo "   - Cloud environments will prefer MCP"
    echo "   - Local environments will prefer hooks"
    echo "   - Best tool selected for each operation"
    echo "   - Automatic fallback when tools unavailable"
}

set_cloud_optimized() {
    echo "☁️  Setting cloud environment optimization"
    export USE_MCP=true
    export FORCE_HOOKS=false
    export AUTO_SELECT_MCP=true
    export MCP_FALLBACK=true
    export HYBRID_MODE=false
    export CLAUDE_AUTO_SUBAGENT=true
    
    echo "✅ Cloud Optimization Enabled"
    echo "   - MCP prioritized for timeout resistance"
    echo "   - Enhanced Claude Code integration"
    echo "   - Automatic sub-agent recommendations"
    echo "   - Hooks fallback for reliability"
}

set_development_mode() {
    echo "🚀 Setting development/testing mode"
    export USE_MCP=auto
    export FORCE_HOOKS=false
    export AUTO_SELECT_MCP=true
    export MCP_FALLBACK=true
    export HYBRID_MODE=true
    export DEMO_MCP_RESPONSE=true
    
    echo "✅ Development Mode Enabled"
    echo "   - Intelligent tool selection"
    echo "   - Demo MCP responses for testing"
    echo "   - Full fallback capabilities"
    echo "   - Optimal for Phase 2 testing"
}

# =============================================================================
# PERSISTENCE
# =============================================================================

save_to_bashrc() {
    local bashrc_file="$HOME/.bashrc"
    
    echo ""
    echo "💾 Save current settings to ~/.bashrc? [y/N]"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "" >> "$bashrc_file"
        echo "# Tyler Gohr Portfolio - MCP Environment Settings" >> "$bashrc_file"
        echo "export USE_MCP=${USE_MCP:-auto}" >> "$bashrc_file"
        echo "export FORCE_HOOKS=${FORCE_HOOKS:-false}" >> "$bashrc_file"
        echo "export AUTO_SELECT_MCP=${AUTO_SELECT_MCP:-true}" >> "$bashrc_file"
        echo "export MCP_FALLBACK=${MCP_FALLBACK:-true}" >> "$bashrc_file"
        echo "export HYBRID_MODE=${HYBRID_MODE:-false}" >> "$bashrc_file"
        
        if [[ "${CLAUDE_AUTO_SUBAGENT:-false}" == "true" ]]; then
            echo "export CLAUDE_AUTO_SUBAGENT=true" >> "$bashrc_file"
        fi
        
        if [[ "${DEMO_MCP_RESPONSE:-false}" == "true" ]]; then
            echo "export DEMO_MCP_RESPONSE=true" >> "$bashrc_file"
        fi
        
        echo "✅ Settings saved to ~/.bashrc"
        echo "🔄 Run 'source ~/.bashrc' or restart terminal to apply"
    else
        echo "⏭️  Settings not saved (current session only)"
    fi
}

create_env_file() {
    local env_file="$SCRIPT_DIR/../.env.mcp"
    
    echo ""
    echo "💾 Create .env.mcp file for project-specific settings? [y/N]"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        cat > "$env_file" << EOF
# Tyler Gohr Portfolio - MCP Environment Configuration
# Phase 2 - Selective Migration Settings

# System Selection
USE_MCP=${USE_MCP:-auto}
FORCE_HOOKS=${FORCE_HOOKS:-false}
AUTO_SELECT_MCP=${AUTO_SELECT_MCP:-true}

# Reliability & Fallback
MCP_FALLBACK=${MCP_FALLBACK:-true}
HYBRID_MODE=${HYBRID_MODE:-false}

# Development & Testing
CLAUDE_AUTO_SUBAGENT=${CLAUDE_AUTO_SUBAGENT:-false}
DEMO_MCP_RESPONSE=${DEMO_MCP_RESPONSE:-false}

# Usage:
# source .env.mcp
# Or add to your shell profile
EOF
        
        echo "✅ Created .env.mcp file"
        echo "🔄 Run 'source .env.mcp' to load settings"
        echo "📁 File location: $env_file"
    else
        echo "⏭️  .env.mcp file not created"
    fi
}

# =============================================================================
# TESTING & VALIDATION
# =============================================================================

test_configuration() {
    echo ""
    echo "🧪 Testing current configuration..."
    echo ""
    
    # Test development server selection
    echo "🔍 Development Server Selection:"
    "$SCRIPT_DIR/mcp-selection-engine.sh" select dev-server
    
    echo ""
    echo "🔍 Test Execution Selection:"
    "$SCRIPT_DIR/mcp-selection-engine.sh" select test-execution
    
    echo ""
    echo "🔍 Quality Gates Selection:"
    "$SCRIPT_DIR/mcp-selection-engine.sh" select quality-gates
    
    echo ""
    echo "🔍 Environment Information:"
    "$SCRIPT_DIR/mcp-selection-engine.sh" info dev-server
}

# =============================================================================
# USAGE & HELP
# =============================================================================

show_usage() {
    echo "MCP Environment Setup - Phase 2 Configuration"
    echo ""
    echo "Usage: $0 <command>"
    echo ""
    echo "Configuration Presets:"
    echo "  mcp-primary       Set MCP as primary tool (cloud-optimized)"
    echo "  hooks-primary     Set hooks as primary tool (stable/proven)"
    echo "  auto-select       Intelligent selection based on environment"
    echo "  cloud-optimized   Optimize for cloud environments (Codespaces, etc.)"
    echo "  development       Development/testing mode with demo responses"
    echo ""
    echo "Management:"
    echo "  show              Show current settings"
    echo "  test              Test current configuration"
    echo "  save              Save settings to ~/.bashrc"
    echo "  env-file          Create .env.mcp file"
    echo "  reset             Reset to defaults"
    echo ""
    echo "Environment Variables:"
    echo "  USE_MCP           Force MCP tools (true/false/auto)"
    echo "  FORCE_HOOKS       Force hooks system (true/false)"
    echo "  AUTO_SELECT_MCP   Auto-select MCP in cloud environments"
    echo "  MCP_FALLBACK      Enable hooks fallback when MCP fails"
    echo "  HYBRID_MODE       Use best tool for each operation"
    echo ""
    echo "Examples:"
    echo "  $0 cloud-optimized    # Optimize for cloud development"
    echo "  $0 auto-select       # Use intelligent selection"
    echo "  $0 show              # Show current settings"
    echo "  $0 test              # Test configuration"
}

reset_to_defaults() {
    echo "🔄 Resetting to default settings..."
    unset USE_MCP FORCE_HOOKS AUTO_SELECT_MCP MCP_FALLBACK HYBRID_MODE
    unset CLAUDE_AUTO_SUBAGENT DEMO_MCP_RESPONSE
    
    echo "✅ Reset complete - using system defaults"
    echo "   - Auto-selection enabled"
    echo "   - Cloud environments prefer MCP"
    echo "   - Hooks fallback enabled"
}

# =============================================================================
# MAIN EXECUTION
# =============================================================================

case "${1:-show}" in
    "mcp-primary")
        set_mcp_primary
        ;;
    "hooks-primary")
        set_hooks_primary
        ;;
    "auto-select")
        set_auto_select
        ;;
    "cloud-optimized")
        set_cloud_optimized
        ;;
    "development")
        set_development_mode
        ;;
    "show"|"status")
        show_current_settings
        ;;
    "test")
        test_configuration
        ;;
    "save")
        save_to_bashrc
        ;;
    "env-file")
        create_env_file
        ;;
    "reset")
        reset_to_defaults
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