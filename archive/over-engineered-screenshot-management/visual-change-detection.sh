#!/bin/bash

# Claude Code Visual Change Detection Utilities
# Detects and categorizes visual changes for automated screenshot generation

# Source hook utilities if not already loaded
if [[ "${HOOK_UTILS_LOADED:-}" != "true" ]]; then
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    source "$SCRIPT_DIR/hook-utils.sh"
fi

# Visual change patterns
CSS_PATTERNS=(
    "\.css$"
    "\.scss$" 
    "\.module\.css$"
    "brand-tokens\.css$"
)

COMPONENT_PATTERNS=(
    "\.tsx$"
    "\.jsx$"
    "components/"
    "app/2/components/"
)

LAYOUT_PATTERNS=(
    "layout\.tsx$"
    "page\.tsx$"
    "template\.tsx$"
)

IMAGE_PATTERNS=(
    "\.png$"
    "\.jpg$"
    "\.jpeg$"
    "\.svg$"
    "\.webp$"
)

# Check if file change is visual
is_visual_change() {
    local file_path="$1"
    local relative_path=$(get_relative_path "$file_path")
    
    # Check CSS patterns
    for pattern in "${CSS_PATTERNS[@]}"; do
        if [[ "$relative_path" =~ $pattern ]]; then
            return 0
        fi
    done
    
    # Check component patterns
    for pattern in "${COMPONENT_PATTERNS[@]}"; do
        if [[ "$relative_path" =~ $pattern ]]; then
            return 0
        fi
    done
    
    # Check layout patterns
    for pattern in "${LAYOUT_PATTERNS[@]}"; do
        if [[ "$relative_path" =~ $pattern ]]; then
            return 0
        fi
    done
    
    # Check image patterns
    for pattern in "${IMAGE_PATTERNS[@]}"; do
        if [[ "$relative_path" =~ $pattern ]]; then
            return 0
        fi
    done
    
    return 1
}

# Detect specific type of visual change
detect_visual_change_type() {
    local file_path="$1"
    local relative_path=$(get_relative_path "$file_path")
    
    # CSS changes
    if [[ "$relative_path" =~ \.module\.css$ ]]; then
        echo "css_module"
    elif [[ "$relative_path" =~ brand-tokens\.css$ ]]; then
        echo "design_tokens"
    elif [[ "$relative_path" =~ \.(css|scss)$ ]]; then
        echo "global_styles"
    
    # Component changes
    elif [[ "$relative_path" =~ components/.*\.(tsx|jsx)$ ]]; then
        echo "component"
    elif [[ "$relative_path" =~ app/2/components/ ]]; then
        echo "redesign_component"
    
    # Layout changes
    elif [[ "$relative_path" =~ layout\.tsx$ ]]; then
        echo "layout"
    elif [[ "$relative_path" =~ page\.tsx$ ]]; then
        echo "page"
    elif [[ "$relative_path" =~ template\.tsx$ ]]; then
        echo "template"
    
    # Asset changes
    elif [[ "$relative_path" =~ \.(png|jpg|jpeg|svg|webp)$ ]]; then
        echo "image_asset"
    
    else
        echo "unknown"
    fi
}

# Get screenshot requirements for change type
get_screenshot_requirements() {
    local change_type="$1"
    
    case "$change_type" in
        "css_module"|"component"|"redesign_component")
            echo "component_focused"
            ;;
        "design_tokens"|"global_styles")
            echo "comprehensive_visual"
            ;;
        "layout"|"page"|"template")
            echo "full_page"
            ;;
        "image_asset")
            echo "asset_verification"
            ;;
        *)
            echo "standard"
            ;;
    esac
}

# Generate screenshots based on requirements
generate_screenshots_for_change() {
    local change_type="$1"
    local requirements=$(get_screenshot_requirements "$change_type")
    
    log_info "Generating screenshots for $change_type (requirements: $requirements)"
    
    case "$requirements" in
        "component_focused")
            # Quick screenshots for component changes
            if ! npx playwright test e2e/quick-screenshots.spec.ts --project=chromium --reporter=line; then
                log_warning "Quick screenshots failed - trying alternative"
                npm run test:e2e:screenshot || true
            fi
            ;;
        "comprehensive_visual")
            # Full visual regression for design system changes
            if ! npm run test:e2e:visual; then
                log_warning "Visual regression tests failed"
                return 1
            fi
            ;;
        "full_page")
            # Complete page screenshots
            if ! npm run test:e2e:claude-review; then
                log_warning "Full page screenshots failed - trying quick method"
                npx playwright test e2e/quick-screenshots.spec.ts --project=chromium --reporter=line || true
            fi
            ;;
        "asset_verification")
            # Asset-specific screenshots
            log_info "Asset change detected - generating verification screenshots"
            npx playwright test e2e/quick-screenshots.spec.ts --project=chromium --reporter=line || true
            ;;
        *)
            # Standard screenshot generation
            npx playwright test e2e/quick-screenshots.spec.ts --project=chromium --reporter=line || true
            ;;
    esac
}

# Process visual change with context awareness
process_visual_change() {
    local file_path="$1"
    local change_type=$(detect_visual_change_type "$file_path")
    local development_context=$(get_development_mode)
    
    log_info "Processing visual change: $change_type"
    log_info "Development context: $development_context"
    
    # Context-specific processing
    case "$development_context" in
        "redesign_2")
            # /2 redesign specific processing
            process_redesign_visual_change "$file_path" "$change_type"
            ;;
        "fast")
            # Fast mode - minimal screenshot generation
            if [[ "$change_type" == "design_tokens" ]]; then
                # Design tokens always need visual verification
                generate_screenshots_for_change "$change_type"
            else
                log_info "Fast mode - skipping non-critical screenshot generation"
            fi
            ;;
        *)
            # Standard visual processing
            generate_screenshots_for_change "$change_type"
            ;;
    esac
    
    # Provide visual review guidance
    provide_visual_review_guidance "$change_type"
}

# Process /2 redesign specific visual changes
process_redesign_visual_change() {
    local file_path="$1"
    local change_type="$2"
    local relative_path=$(get_relative_path "$file_path")
    
    # Check if change affects /2 redesign
    if [[ "$relative_path" =~ app/2/ ]]; then
        log_info "/2 redesign change detected - optimized processing"
        
        case "$change_type" in
            "design_tokens")
                log_info "Brand tokens change - comprehensive /2 visual testing"
                npm run test:e2e:visual || log_warning "Visual regression failed"
                ;;
            "redesign_component"|"component")
                log_info "/2 component change - focused testing"
                npx playwright test e2e/quick-screenshots.spec.ts --project=chromium --reporter=line || true
                ;;
            *)
                # Standard /2 processing
                generate_screenshots_for_change "$change_type"
                ;;
        esac
    else
        # Non-/2 change while in redesign context
        log_info "Non-/2 change in redesign context"
        generate_screenshots_for_change "$change_type"
    fi
}

# Brand consistency validation
validate_brand_consistency() {
    local file_path="$1"
    local relative_path=$(get_relative_path "$file_path")
    
    if [[ "$relative_path" =~ app/2/ && "$relative_path" =~ \.(css|scss|module\.css)$ ]]; then
        log_info "Validating brand consistency for /2 redesign..."
        
        # Check for brand token usage
        if [[ -f "$file_path" ]]; then
            # Look for CSS custom property usage
            if grep -q "var(--" "$file_path"; then
                log_success "✅ Brand tokens (CSS custom properties) detected"
            else
                log_warning "⚠️  No brand tokens found - consider using design system variables"
            fi
            
            # Check for color consistency
            if grep -E "#[0-9a-fA-F]{3,6}" "$file_path" > /dev/null; then
                log_warning "⚠️  Hard-coded colors detected - consider using brand tokens"
                grep -n -E "#[0-9a-fA-F]{3,6}" "$file_path" | head -3 || true
            fi
        fi
    fi
}

# Provide visual review guidance
provide_visual_review_guidance() {
    local change_type="$1"
    
    log_info "📸 Visual Review Guidance:"
    
    case "$change_type" in
        "css_module"|"component")
            log_info "  → Check component appearance and interactions"
            log_info "  → Verify responsive behavior across viewports"
            log_info "  → Review screenshots in screenshots/quick-review/"
            ;;
        "design_tokens")
            log_info "  → Validate design system consistency"
            log_info "  → Check color, typography, and spacing changes"
            log_info "  → Review comprehensive visual regression results"
            ;;
        "layout"|"page")
            log_info "  → Verify page layout and structure"
            log_info "  → Check navigation and scroll behavior"
            log_info "  → Test cross-device compatibility"
            ;;
        "image_asset")
            log_info "  → Verify asset loading and display"
            log_info "  → Check image optimization and performance"
            log_info "  → Validate responsive image behavior"
            ;;
        *)
            log_info "  → Review generated screenshots for visual consistency"
            log_info "  → Check for unintended visual changes"
            ;;
    esac
    
    log_info "  → Screenshots available in: screenshots/quick-review/"
    log_info "  → Use Claude to analyze visual changes and provide feedback"
}

# Check if visual change requires special handling
requires_special_visual_handling() {
    local file_path="$1"
    local change_type=$(detect_visual_change_type "$file_path")
    
    case "$change_type" in
        "design_tokens"|"layout"|"template")
            return 0  # Requires special handling
            ;;
        *)
            return 1  # Standard handling
            ;;
    esac
}

# Export functions for use in other scripts
export -f is_visual_change
export -f detect_visual_change_type
export -f get_screenshot_requirements
export -f generate_screenshots_for_change
export -f process_visual_change
export -f process_redesign_visual_change
export -f validate_brand_consistency
export -f provide_visual_review_guidance
export -f requires_special_visual_handling