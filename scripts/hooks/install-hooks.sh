#!/bin/bash

# Claude Code Hook System Installation Script
# Installs and configures the complete hook system for Tyler Gohr Portfolio

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
CLAUDE_DIR="$HOME/.claude"
HOOKS_DIR="$CLAUDE_DIR/hooks"

# Logging
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_header() {
    echo -e "${PURPLE}🔗 $1${NC}"
}

# Main installation function
install_hooks() {
    log_header "Installing Claude Code Hook System for Tyler Gohr Portfolio"
    echo ""
    
    # 1. Create necessary directories
    log_info "Creating hook system directories..."
    mkdir -p "$HOOKS_DIR/logs"
    mkdir -p "$HOOKS_DIR/backups"
    mkdir -p "$HOOKS_DIR/config"
    
    # 2. Make hook scripts executable
    log_info "Setting hook script permissions..."
    chmod +x "$SCRIPT_DIR"/*.sh
    chmod +x "$SCRIPT_DIR/lib"/*.sh
    
    # 3. Validate hook scripts
    log_info "Validating hook scripts..."
    validate_hook_scripts
    
    # 4. Test hook utilities
    log_info "Testing hook utilities..."
    test_hook_utilities
    
    # 5. Validate Claude Code settings
    log_info "Validating Claude Code settings..."
    validate_claude_settings
    
    # 6. Create hook status file
    log_info "Creating hook status tracking..."
    create_hook_status
    
    # 7. Installation summary
    log_success "Hook system installation completed successfully!"
    echo ""
    display_installation_summary
}

# Validate hook scripts
validate_hook_scripts() {
    local scripts=(
        "pre-edit-validation.sh"
        "post-edit-quality-gate.sh"
        "visual-development-workflow.sh"
        "performance-excellence-check.sh"
        "development-context-optimizer.sh"
    )
    
    for script in "${scripts[@]}"; do
        if [[ -f "$SCRIPT_DIR/$script" ]]; then
            if bash -n "$SCRIPT_DIR/$script"; then
                log_success "✓ $script syntax valid"
            else
                log_error "✗ $script syntax error"
                return 1
            fi
        else
            log_error "✗ $script not found"
            return 1
        fi
    done
    
    # Validate utility libraries
    local utils=(
        "hook-utils.sh"
        "file-protection.sh"
        "test-selection.sh"
        "visual-change-detection.sh"
        "performance-monitoring.sh"
        "context-detection.sh"
    )
    
    for util in "${utils[@]}"; do
        if [[ -f "$SCRIPT_DIR/lib/$util" ]]; then
            if bash -n "$SCRIPT_DIR/lib/$util"; then
                log_success "✓ $util syntax valid"
            else
                log_error "✗ $util syntax error"
                return 1
            fi
        else
            log_error "✗ $util not found"
            return 1
        fi
    done
}

# Test hook utilities
test_hook_utilities() {
    # Test basic functionality
    if source "$SCRIPT_DIR/lib/hook-utils.sh"; then
        log_success "✓ Hook utilities loaded successfully"
    else
        log_error "✗ Failed to load hook utilities"
        return 1
    fi
    
    # Test project root detection
    local detected_root=$(get_project_root)
    if [[ "$detected_root" == "$PROJECT_ROOT" ]]; then
        log_success "✓ Project root detection working"
    else
        log_warning "! Project root mismatch: expected $PROJECT_ROOT, got $detected_root"
    fi
    
    # Test npm script detection
    if command -v npm > /dev/null; then
        log_success "✓ npm available for script execution"
    else
        log_error "✗ npm not found - required for hook functionality"
        return 1
    fi
}

# Validate Claude Code settings
validate_claude_settings() {
    local settings_file="$CLAUDE_DIR/settings.json"
    
    if [[ -f "$settings_file" ]]; then
        if command -v jq > /dev/null; then
            if jq . "$settings_file" > /dev/null 2>&1; then
                log_success "✓ Claude Code settings.json is valid JSON"
                
                # Check for hooks configuration
                if jq -e '.hooks' "$settings_file" > /dev/null 2>&1; then
                    log_success "✓ Hooks configuration found in settings"
                    
                    # Count configured hooks
                    local pre_hooks=$(jq -r '.hooks.PreToolUse | length' "$settings_file" 2>/dev/null || echo "0")
                    local post_hooks=$(jq -r '.hooks.PostToolUse | length' "$settings_file" 2>/dev/null || echo "0")
                    
                    log_info "  - PreToolUse hooks: $pre_hooks"
                    log_info "  - PostToolUse hooks: $post_hooks"
                else
                    log_error "✗ No hooks configuration found in settings"
                    return 1
                fi
            else
                log_error "✗ Invalid JSON in Claude Code settings"
                return 1
            fi
        else
            log_warning "! jq not available - cannot validate JSON structure"
            log_info "  Settings file exists at: $settings_file"
        fi
    else
        log_error "✗ Claude Code settings.json not found at: $settings_file"
        return 1
    fi
}

# Create hook status tracking
create_hook_status() {
    local status_file="$HOOKS_DIR/status.json"
    
    cat > "$status_file" << EOF
{
  "installation": {
    "date": "$(date -Iseconds)",
    "version": "1.0.0",
    "project": "Tyler Gohr Portfolio",
    "status": "active"
  },
  "hooks": {
    "pre_edit_validation": {
      "enabled": true,
      "last_execution": null,
      "execution_count": 0
    },
    "post_edit_quality_gate": {
      "enabled": true,
      "last_execution": null,
      "execution_count": 0
    },
    "visual_development_workflow": {
      "enabled": true,
      "last_execution": null,
      "execution_count": 0
    },
    "performance_excellence_check": {
      "enabled": true,
      "last_execution": null,
      "execution_count": 0
    },
    "development_context_optimizer": {
      "enabled": true,
      "last_execution": null,
      "execution_count": 0
    }
  },
  "statistics": {
    "total_executions": 0,
    "successful_executions": 0,
    "failed_executions": 0,
    "protected_files_blocked": 0,
    "tests_triggered": 0,
    "screenshots_generated": 0
  }
}
EOF
    
    log_success "✓ Hook status tracking created"
}

# Display installation summary
display_installation_summary() {
    echo ""
    log_header "🎉 Claude Code Hook System - Installation Complete"
    echo ""
    echo "📁 Hook System Locations:"
    echo "  • Hook Scripts: $SCRIPT_DIR"
    echo "  • Hook Utilities: $SCRIPT_DIR/lib"
    echo "  • Configuration: $SCRIPT_DIR/config"
    echo "  • Claude Settings: $CLAUDE_DIR/settings.json"
    echo "  • Logs: $HOOKS_DIR/logs"
    echo "  • Backups: $HOOKS_DIR/backups"
    echo ""
    echo "🔗 Configured Hooks:"
    echo "  • PreToolUse: File protection and validation"
    echo "  • PostToolUse: Quality gates and testing automation"
    echo "  • Notification: Context-aware development optimization"
    echo "  • Stop: Post-work cleanup and guidance"
    echo ""
    echo "🎯 Key Features Enabled:"
    echo "  • ✅ File protection for critical files"
    echo "  • ✅ Smart test selection and automation"
    echo "  • ✅ Visual change detection and screenshots"
    echo "  • ✅ Performance monitoring (Core Web Vitals)"
    echo "  • ✅ Context-aware /2 redesign optimization"
    echo "  • ✅ Enterprise presentation standards"
    echo ""
    echo "🚀 Next Steps:"
    echo "  1. Restart Claude Code to activate hooks"
    echo "  2. Test with a simple file edit"
    echo "  3. Monitor hook execution in logs: $HOOKS_DIR/logs"
    echo "  4. Use './scripts/hooks/test-hooks.sh' for validation"
    echo ""
    echo "📖 Usage:"
    echo "  • Hooks run automatically when Claude edits files"
    echo "  • Protected files will prompt for confirmation"
    echo "  • Visual changes trigger screenshot generation"
    echo "  • Context detection optimizes workflow for /2 vs main portfolio"
    echo ""
    log_success "Installation completed successfully! 🎉"
}

# Handle installation errors
handle_error() {
    local error_code=$?
    log_error "Installation failed with exit code $error_code"
    echo ""
    echo "❌ Troubleshooting:"
    echo "  • Check file permissions in $SCRIPT_DIR"
    echo "  • Ensure npm is available and working"
    echo "  • Verify Claude Code settings.json exists"
    echo "  • Check installation logs for details"
    echo ""
    echo "🔧 Manual Recovery:"
    echo "  • Run './scripts/hooks/uninstall-hooks.sh' to clean up"
    echo "  • Fix issues and re-run installation"
    exit $error_code
}

# Set error handler
trap handle_error ERR

# Command line options
case "${1:-install}" in
    "install")
        install_hooks
        ;;
    "validate")
        log_info "Validating hook system..."
        validate_hook_scripts
        test_hook_utilities
        validate_claude_settings
        log_success "Hook system validation complete"
        ;;
    "status")
        if [[ -f "$HOOKS_DIR/status.json" ]]; then
            echo "Hook System Status:"
            if command -v jq > /dev/null; then
                jq . "$HOOKS_DIR/status.json"
            else
                cat "$HOOKS_DIR/status.json"
            fi
        else
            log_error "Hook system not installed"
            exit 1
        fi
        ;;
    "help")
        echo "Claude Code Hook System Installer"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  install   - Install the complete hook system (default)"
        echo "  validate  - Validate existing installation"
        echo "  status    - Show hook system status"
        echo "  help      - Show this help message"
        ;;
    *)
        log_error "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac