#!/bin/bash

# Claude Code File Protection Utilities
# Protects critical files from accidental modification

# Source hook utilities if not already loaded
if [[ "${HOOK_UTILS_LOADED:-}" != "true" ]]; then
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    source "$SCRIPT_DIR/hook-utils.sh"
fi

# Protected file patterns (relative to project root)
PROTECTED_FILES=(
    "next.config.js"
    "package.json"
    "package-lock.json"
    "tsconfig.json"
    "playwright.config.ts"
    ".env*"
    "src/app/2/styles/brand-tokens.css"
    "CLAUDE.md"
    "README.md"
    "Dockerfile"
    "docker-compose.yml"
)

# Critical directories that require extra confirmation
CRITICAL_DIRECTORIES=(
    ".git"
    "node_modules"
    ".next"
    "dist"
    "build"
)

# Check if a file is protected
is_protected_file() {
    local file_path="$1"
    local relative_path=$(get_relative_path "$file_path")
    
    # Check against protected file patterns
    for pattern in "${PROTECTED_FILES[@]}"; do
        if [[ "$relative_path" =~ $pattern || "$file_path" =~ $pattern ]]; then
            return 0
        fi
    done
    
    # Check if file is in a critical directory
    for dir in "${CRITICAL_DIRECTORIES[@]}"; do
        if [[ "$relative_path" =~ ^$dir/ ]]; then
            return 0
        fi
    done
    
    return 1
}

# Get protection level for a file
get_protection_level() {
    local file_path="$1"
    local relative_path=$(get_relative_path "$file_path")
    
    # Critical system files
    case "$relative_path" in
        "package.json"|"package-lock.json"|"next.config.js")
            echo "critical"
            ;;
        "CLAUDE.md"|"README.md"|"Dockerfile")
            echo "important"
            ;;
        "src/app/2/styles/brand-tokens.css")
            echo "design_system"
            ;;
        ".env"*|"tsconfig.json"|"playwright.config.ts")
            echo "configuration"
            ;;
        *)
            if [[ "$relative_path" =~ ^\.git/ ]]; then
                echo "system"
            else
                echo "standard"
            fi
            ;;
    esac
}

# Request confirmation for protected file modification
request_protected_file_confirmation() {
    local file_path="$1"
    local relative_path=$(get_relative_path "$file_path")
    local protection_level=$(get_protection_level "$file_path")
    
    echo -e "${YELLOW}⚠️  PROTECTED FILE MODIFICATION REQUESTED${NC}"
    echo -e "${CYAN}File: $relative_path${NC}"
    echo -e "${CYAN}Protection Level: $protection_level${NC}"
    
    case "$protection_level" in
        "critical")
            echo -e "${RED}🚨 CRITICAL SYSTEM FILE${NC}"
            echo "This file is essential for project functionality."
            echo "Modification could break the build, deployment, or development workflow."
            ;;
        "important")
            echo -e "${YELLOW}📖 IMPORTANT DOCUMENTATION${NC}"
            echo "This file contains critical project documentation."
            echo "Changes should maintain accuracy and completeness."
            ;;
        "design_system")
            echo -e "${PURPLE}🎨 DESIGN SYSTEM FILE${NC}"
            echo "This file defines the /2 redesign brand tokens."
            echo "Changes affect the entire Enterprise Solutions Architect design system."
            ;;
        "configuration")
            echo -e "${BLUE}⚙️  CONFIGURATION FILE${NC}"
            echo "This file contains project configuration."
            echo "Changes may affect development, testing, or deployment."
            ;;
        "system")
            echo -e "${RED}💀 SYSTEM FILE${NC}"
            echo "This is a system file that should not be modified."
            echo "Modification could corrupt the repository."
            ;;
    esac
    
    echo ""
    echo "Reasons for modification should include:"
    echo "  - Explicit user request"
    echo "  - Required dependency update"
    echo "  - Critical bug fix"
    echo "  - Planned configuration change"
    echo ""
    
    # Different confirmation levels based on protection
    case "$protection_level" in
        "critical"|"system")
            echo -e "${RED}This requires explicit confirmation.${NC}"
            if ask_confirmation "Are you absolutely sure you want to modify this critical file? (yes/no)" "no"; then
                log_warning "CRITICAL FILE MODIFICATION APPROVED: $relative_path"
                return 0
            else
                log_info "CRITICAL FILE MODIFICATION DENIED: $relative_path"
                return 1
            fi
            ;;
        "design_system")
            echo -e "${PURPLE}This affects the entire /2 redesign brand system.${NC}"
            if ask_confirmation "Do you want to modify the design system file? (y/n)" "n"; then
                log_warning "DESIGN SYSTEM MODIFICATION APPROVED: $relative_path"
                return 0
            else
                log_info "DESIGN SYSTEM MODIFICATION DENIED: $relative_path"
                return 1
            fi
            ;;
        *)
            if ask_confirmation "Do you want to proceed with modifying this protected file? (y/n)" "n"; then
                log_warning "PROTECTED FILE MODIFICATION APPROVED: $relative_path"
                return 0
            else
                log_info "PROTECTED FILE MODIFICATION DENIED: $relative_path"
                return 1
            fi
            ;;
    esac
}

# Check if file modification is allowed
check_file_modification_allowed() {
    local file_path="$1"
    
    if ! is_protected_file "$file_path"; then
        return 0
    fi
    
    # Check for bypass flags
    if [[ "${HOOK_BYPASS_PROTECTION:-}" == "true" ]]; then
        log_warning "File protection bypassed for: $(get_relative_path "$file_path")"
        return 0
    fi
    
    # Request confirmation for protected files
    request_protected_file_confirmation "$file_path"
}

# Validate file modification context
validate_modification_context() {
    local file_path="$1"
    local modification_reason="${2:-unknown}"
    
    if is_protected_file "$file_path"; then
        log_info "Validating modification context for protected file"
        log_info "File: $(get_relative_path "$file_path")"
        log_info "Reason: $modification_reason"
        
        # Log the modification for audit trail
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] PROTECTED_FILE_MODIFICATION: $(get_relative_path "$file_path") - $modification_reason" >> "$HOOK_LOG_FILE"
    fi
}

# Get list of all protected files
list_protected_files() {
    echo "Protected Files:"
    for pattern in "${PROTECTED_FILES[@]}"; do
        echo "  - $pattern"
    done
    
    echo ""
    echo "Protected Directories:"
    for dir in "${CRITICAL_DIRECTORIES[@]}"; do
        echo "  - $dir/"
    done
}

# Backup protected file before modification
backup_protected_file() {
    local file_path="$1"
    
    if is_protected_file "$file_path" && is_file_exists "$file_path"; then
        local backup_dir="$HOME/.claude/hooks/backups/$(date +%Y%m%d)"
        local relative_path=$(get_relative_path "$file_path")
        local backup_file="$backup_dir/${relative_path//\//_}.backup"
        
        mkdir -p "$backup_dir"
        cp "$file_path" "$backup_file"
        log_info "Protected file backed up: $backup_file"
    fi
}

# Restore protected file from backup
restore_protected_file() {
    local file_path="$1"
    local backup_date="${2:-$(date +%Y%m%d)}"
    
    local backup_dir="$HOME/.claude/hooks/backups/$backup_date"
    local relative_path=$(get_relative_path "$file_path")
    local backup_file="$backup_dir/${relative_path//\//_}.backup"
    
    if [[ -f "$backup_file" ]]; then
        cp "$backup_file" "$file_path"
        log_success "Protected file restored from backup: $file_path"
        return 0
    else
        log_error "No backup found for: $file_path"
        return 1
    fi
}

# Export functions for use in other scripts
export -f is_protected_file
export -f get_protection_level
export -f request_protected_file_confirmation
export -f check_file_modification_allowed
export -f validate_modification_context
export -f list_protected_files
export -f backup_protected_file
export -f restore_protected_file