#!/bin/bash

# Claude Code Pre-Edit Validation Hook
# Runs before Claude edits any files to ensure safety and quality

set -e

# Source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/hook-utils.sh"
source "$SCRIPT_DIR/lib/file-protection.sh"
source "$SCRIPT_DIR/lib/context-detection.sh"

# Parse command line arguments
TOOL_NAME="${1:-unknown}"
TOOL_ARGS="${2:-}"

# Initialize hook execution
log_hook_start "PRE_EDIT_VALIDATION" "$TOOL_NAME"

# Extract file path from tool arguments
FILE_PATH=""
if [[ "$TOOL_ARGS" =~ \"file_path\":\"([^\"]+)\" ]]; then
    FILE_PATH="${BASH_REMATCH[1]}"
elif [[ "$TOOL_ARGS" =~ file_path.*[[:space:]]+([^[:space:]]+) ]]; then
    FILE_PATH="${BASH_REMATCH[1]}"
fi

# Skip validation for non-file operations
if [[ -z "$FILE_PATH" || "$TOOL_NAME" == "Bash" || "$TOOL_NAME" == "Read" ]]; then
    log_info "Skipping validation for non-file operation: $TOOL_NAME"
    exit 0
fi

log_info "Validating file operation: $FILE_PATH"

# 1. Protected File Validation
if is_protected_file "$FILE_PATH"; then
    log_warning "Attempting to modify protected file: $FILE_PATH"
    if ! request_protected_file_confirmation "$FILE_PATH"; then
        log_error "Protected file modification denied"
        exit 1
    fi
    log_info "Protected file modification approved"
fi

# 2. TypeScript Pre-Validation
if [[ "$FILE_PATH" =~ \.(ts|tsx)$ ]]; then
    log_info "Running TypeScript pre-validation..."
    if ! npm run typecheck --silent 2>/dev/null; then
        log_warning "TypeScript errors detected before edit"
        log_warning "Proceeding with edit but recommend fixing existing errors first"
    fi
fi

# 3. Build State Validation
log_info "Checking current build state..."
if ! npm run build --silent 2>/dev/null; then
    log_warning "Build errors detected before edit"
    log_warning "Current codebase has build issues - proceed with caution"
fi

# 4. Context Detection
CONTEXT=$(detect_development_context "$FILE_PATH")
log_info "Development context: $CONTEXT"

# Set context-specific environment variables
case "$CONTEXT" in
    "redesign_2")
        export DEVELOPMENT_CONTEXT="redesign_2"
        export FAST_MODE="true"
        ;;
    "main_portfolio")
        export DEVELOPMENT_CONTEXT="main_portfolio"
        ;;
    *)
        export DEVELOPMENT_CONTEXT="general"
        ;;
esac

log_hook_success "PRE_EDIT_VALIDATION completed successfully"
exit 0