#!/bin/bash

# Minimal Hook Utilities
# Only functions actually used by file-protection.sh

# Color codes for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Hook execution tracking
HOOK_LOG_DIR="$HOME/.claude/hooks/logs"
HOOK_LOG_FILE="$HOOK_LOG_DIR/hook-execution-$(date +%Y%m%d).log"

# Ensure log directory exists
mkdir -p "$HOOK_LOG_DIR"

# Logging functions (only the ones actually used)
log_warning() {
    local message="$1"
    echo -e "${YELLOW}[WARNING]${NC} $message"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [WARNING] $message" >> "$HOOK_LOG_FILE"
}

log_error() {
    local message="$1"
    echo -e "${RED}[ERROR]${NC} $message"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $message" >> "$HOOK_LOG_FILE"
}

# Project utilities
get_project_root() {
    # Find project root by looking for package.json
    local current_dir="$PWD"
    while [[ "$current_dir" != "/" ]]; do
        if [[ -f "$current_dir/package.json" ]]; then
            echo "$current_dir"
            return 0
        fi
        current_dir="$(dirname "$current_dir")"
    done
    
    # Fallback to current directory
    echo "$PWD"
}

get_relative_path() {
    local file_path="$1"
    local project_root=$(get_project_root)
    echo "${file_path#$project_root/}"
}

# User interaction
ask_confirmation() {
    local question="$1"
    local default="${2:-no}"
    
    echo -e "${YELLOW}🛡️  $question${NC}"
    read -r response
    
    if [[ -z "$response" ]]; then
        response="$default"
    fi
    
    case "$response" in
        [Yy]|[Yy][Ee][Ss])
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# Mark utilities as loaded
HOOK_UTILS_LOADED="true"
export HOOK_UTILS_LOADED