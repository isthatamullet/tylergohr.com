#!/bin/bash

# Claude Code Hook System Uninstallation Script
# Safely removes the hook system from Tyler Gohr Portfolio
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CLAUDE_SETTINGS_FILE="$HOME/.claude/settings.json"
BACKUP_DIR="$HOME/.claude/backups"
HOOKS_DIR="/home/user/tylergohr.com/scripts/hooks"

echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}  Claude Code Hooks Uninstaller${NC}"
echo -e "${BLUE}  Tyler Gohr Portfolio${NC}"
echo -e "${BLUE}===========================================${NC}"
echo

# Function to log messages
log() {
    echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to backup current settings
backup_settings() {
    log "Creating backup of current Claude settings..."
    
    mkdir -p "$BACKUP_DIR"
    
    if [ -f "$CLAUDE_SETTINGS_FILE" ]; then
        local backup_file="$BACKUP_DIR/settings-$(date +%Y%m%d-%H%M%S)-pre-uninstall.json"
        cp "$CLAUDE_SETTINGS_FILE" "$backup_file"
        log "Settings backed up to: $backup_file"
    else
        warn "No existing Claude settings file found"
    fi
}

# Function to remove hooks from settings.json
remove_hooks_config() {
    log "Removing hooks configuration from Claude settings..."
    
    if [ ! -f "$CLAUDE_SETTINGS_FILE" ]; then
        warn "Claude settings file not found at $CLAUDE_SETTINGS_FILE"
        return 0
    fi
    
    # Create settings without hooks using jq if available, otherwise manual approach
    if command -v jq &> /dev/null; then
        # Use jq for clean JSON manipulation
        jq 'del(.hooks) | del(.metadata)' "$CLAUDE_SETTINGS_FILE" > "${CLAUDE_SETTINGS_FILE}.tmp"
        mv "${CLAUDE_SETTINGS_FILE}.tmp" "$CLAUDE_SETTINGS_FILE"
        log "Hooks configuration removed using jq"
    else
        # Manual approach - create minimal settings file
        cat > "$CLAUDE_SETTINGS_FILE" << 'EOF'
{
  "model": "sonnet"
}
EOF
        log "Hooks configuration removed (manual approach)"
    fi
}

# Function to offer to remove hook scripts
remove_hook_scripts() {
    echo
    echo -e "${YELLOW}Do you want to remove the hook scripts directory?${NC}"
    echo -e "Directory: ${BLUE}$HOOKS_DIR${NC}"
    echo -e "This will remove all hook scripts but keep the main scripts directory."
    echo -n "Remove hook scripts? [y/N]: "
    
    read -r response
    case "$response" in
        [yY][eE][sS]|[yY])
            if [ -d "$HOOKS_DIR" ]; then
                log "Removing hooks directory..."
                rm -rf "$HOOKS_DIR"
                log "Hook scripts directory removed"
            else
                warn "Hooks directory not found"
            fi
            ;;
        *)
            log "Hook scripts directory preserved"
            ;;
    esac
}

# Function to validate uninstallation
validate_uninstall() {
    log "Validating uninstallation..."
    
    local issues=0
    
    # Check if hooks are removed from settings
    if [ -f "$CLAUDE_SETTINGS_FILE" ]; then
        if grep -q '"hooks"' "$CLAUDE_SETTINGS_FILE"; then
            error "Hooks configuration still present in settings.json"
            issues=$((issues + 1))
        else
            log "✓ Hooks configuration removed from settings.json"
        fi
    fi
    
    # Check if scripts directory was removed (if user chose to)
    if [ -d "$HOOKS_DIR" ]; then
        log "Hook scripts directory still present (preserved by user choice)"
    else
        log "✓ Hook scripts directory removed"
    fi
    
    if [ $issues -eq 0 ]; then
        log "Uninstallation validation successful"
    else
        error "Uninstallation validation failed with $issues issues"
        return 1
    fi
}

# Function to show post-uninstall info
show_post_uninstall_info() {
    echo
    echo -e "${GREEN}===========================================${NC}"
    echo -e "${GREEN}  Uninstallation Complete${NC}"
    echo -e "${GREEN}===========================================${NC}"
    echo
    echo -e "${BLUE}What was removed:${NC}"
    echo "• Hook configuration from Claude settings"
    echo "• Metadata from Claude settings"
    
    if [ ! -d "$HOOKS_DIR" ]; then
        echo "• Hook scripts directory"
    fi
    
    echo
    echo -e "${BLUE}What was preserved:${NC}"
    echo "• Original settings backup in $BACKUP_DIR"
    echo "• Main project files and configuration"
    
    if [ -d "$HOOKS_DIR" ]; then
        echo "• Hook scripts directory (by user choice)"
    fi
    
    echo
    echo -e "${YELLOW}To completely remove all traces:${NC}"
    echo "• Manually remove: $BACKUP_DIR"
    if [ -d "$HOOKS_DIR" ]; then
        echo "• Manually remove: $HOOKS_DIR"
    fi
    
    echo
    echo -e "${YELLOW}To reinstall:${NC}"
    echo "• Run: ./scripts/hooks/install-hooks.sh"
    echo
}

# Main uninstallation process
main() {
    echo -e "${BLUE}Starting Claude Code hooks uninstallation...${NC}"
    echo
    
    # Confirm uninstallation
    echo -e "${YELLOW}This will remove the Claude Code hooks system from your development workflow.${NC}"
    echo -e "This action can be reversed by running the installation script again."
    echo -n "Continue with uninstallation? [y/N]: "
    
    read -r confirm
    case "$confirm" in
        [yY][eE][sS]|[yY])
            log "Proceeding with uninstallation..."
            ;;
        *)
            log "Uninstallation cancelled"
            exit 0
            ;;
    esac
    
    echo
    
    # Execute uninstallation steps
    backup_settings
    remove_hooks_config
    remove_hook_scripts
    validate_uninstall
    show_post_uninstall_info
    
    echo -e "${GREEN}Claude Code hooks have been successfully uninstalled!${NC}"
}

# Error handling
trap 'error "Uninstallation failed. Check the error above."; exit 1' ERR

# Run main function
main "$@"