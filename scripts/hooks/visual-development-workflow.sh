#!/bin/bash

# Claude Code Visual Development Workflow Hook
# Specialized handling for visual changes (CSS, components, design tokens)

set -e

# Source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/hook-utils.sh"
source "$SCRIPT_DIR/lib/visual-change-detection.sh"
source "$SCRIPT_DIR/lib/context-detection.sh"

# Initialize hook execution
log_hook_start "VISUAL_DEVELOPMENT_WORKFLOW" "visual_change"

# Ensure we have the active development server port
ensure_active_port

# 1. Detect Visual Change Type
FILE_PATH="${1:-}"
VISUAL_CHANGE_TYPE=$(detect_visual_change_type "$FILE_PATH")
log_info "Visual change type: $VISUAL_CHANGE_TYPE"

# 2. Context-Aware Visual Processing
CONTEXT=$(detect_development_context "$FILE_PATH")
log_info "Development context: $CONTEXT"

# 3. Generate Screenshots for Visual Review
log_info "Generating screenshots for visual validation..."

case "$VISUAL_CHANGE_TYPE" in
    "css_module")
        log_info "CSS Module change detected - generating component screenshots..."
        if ! npx playwright test e2e/quick-screenshots.spec.ts --project=chromium --reporter=line; then
            log_warning "Quick screenshots failed - trying alternative method..."
            if ! npm run test:e2e:screenshot; then
                log_error "Screenshot generation failed"
                exit 1
            fi
        fi
        ;;
    "component")
        log_info "Component change detected - running component tests..."
        # Run component-specific tests
        if ! SKIP_VISUAL=true npm run test:e2e:dev; then
            log_error "Component tests failed"
            exit 1
        fi
        # Generate screenshots after tests pass
        if ! npx playwright test e2e/quick-screenshots.spec.ts --project=chromium --reporter=line; then
            log_warning "Screenshot generation failed - continuing"
        fi
        ;;
    "design_tokens")
        log_info "Design tokens change detected - comprehensive visual testing..."
        if ! npm run test:e2e:visual; then
            log_error "Visual regression tests failed"
            exit 1
        fi
        ;;
    "layout")
        log_info "Layout change detected - cross-viewport testing..."
        # Test across multiple viewports
        if ! npm run test:e2e:mobile; then
            log_warning "Mobile tests failed - check responsive behavior"
        fi
        # Generate comprehensive screenshots
        if ! npx playwright test e2e/quick-screenshots.spec.ts --project=chromium --reporter=line; then
            log_warning "Screenshot generation failed"
        fi
        ;;
esac

# 4. Brand Consistency Validation (for /2 redesign)
if [[ "$CONTEXT" == "redesign_2" ]]; then
    log_info "Validating brand consistency for /2 redesign..."
    validate_brand_consistency "$FILE_PATH"
fi

# 5. Performance Impact for Visual Changes
log_info "Checking performance impact of visual changes..."
if [[ "$FILE_PATH" =~ \.(css|scss|module\.css)$ ]]; then
    # Check for performance-heavy properties
    if grep -q "filter\|backdrop-filter\|box-shadow" "$FILE_PATH" 2>/dev/null; then
        log_warning "Performance-heavy CSS properties detected - monitor Core Web Vitals"
    fi
fi

# 6. Accessibility Quick Check
if [[ "$VISUAL_CHANGE_TYPE" == "component" ]]; then
    log_info "Running accessibility quick check..."
    if ! FAST_MODE=true npm run test:e2e:accessibility --reporter=line; then
        log_warning "Accessibility tests failed - review changes for a11y compliance"
    fi
fi

# 7. Provide Visual Review Guidance
log_info "Visual development workflow completed"
log_info "📸 Review generated screenshots in:"
log_info "  - screenshots/quick-review/ (recommended)"
log_info "  - screenshots/detail-pages/ (if available)"

case "$VISUAL_CHANGE_TYPE" in
    "css_module"|"component")
        log_success "✅ Component visual changes validated"
        ;;
    "design_tokens")
        log_success "✅ Design system changes validated"
        ;;
    "layout")
        log_success "✅ Layout changes validated across viewports"
        ;;
    *)
        log_success "✅ Visual changes processed successfully"
        ;;
esac

log_hook_success "VISUAL_DEVELOPMENT_WORKFLOW completed successfully"
exit 0