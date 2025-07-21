#!/bin/bash

# Claude Code Performance Excellence Check Hook
# Monitors performance impact of changes and maintains Enterprise standards

set -e

# Source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/hook-utils.sh"
source "$SCRIPT_DIR/lib/performance-monitoring.sh"
source "$SCRIPT_DIR/lib/context-detection.sh"

# NEW: Source VS Code task integration for enhanced port management
if [[ -f "$SCRIPT_DIR/lib/vscode-task-integration.sh" ]]; then
    source "$SCRIPT_DIR/lib/vscode-task-integration.sh"
fi

# Parse command line arguments
CHANGE_TYPE="${1:-general}"
FILE_PATH="${2:-}"

# Initialize hook execution
log_hook_start "PERFORMANCE_EXCELLENCE_CHECK" "$CHANGE_TYPE"

# Ensure we have the active development server port if needed
if [[ "$CHANGE_TYPE" =~ (ui-component|design_system|layout) ]]; then
    ensure_active_port
fi

# 1. Performance Impact Assessment
log_info "Assessing performance impact for: $FILE_PATH"

case "$CHANGE_TYPE" in
    "ui-component")
        log_info "UI component change - checking animation performance..."
        check_animation_performance "$FILE_PATH"
        ;;
    "css-change")
        log_info "CSS change - validating performance properties..."
        check_css_performance_impact "$FILE_PATH"
        ;;
    "image-asset")
        log_info "Image asset change - validating optimization..."
        check_image_optimization "$FILE_PATH"
        ;;
    *)
        log_info "General change - running standard performance checks..."
        ;;
esac

# 2. Core Web Vitals Monitoring
log_info "Monitoring Core Web Vitals impact..."
if is_performance_critical_file "$FILE_PATH"; then
    log_info "Performance critical file detected - running comprehensive checks..."
    
    # Check if dev server is running for performance tests
    if curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost:3000 | grep -q "200"; then
        log_info "Dev server available - running Core Web Vitals check..."
        run_core_web_vitals_check
    else
        log_warning "Dev server not available - skipping live performance checks"
    fi
fi

# 3. Animation Performance Validation (60fps requirement)
if [[ "$FILE_PATH" =~ \.(css|scss|module\.css)$ ]]; then
    log_info "CSS file change - validating animation performance..."
    
    # Check for performance-heavy animation properties
    if grep -E "(transform|opacity|filter)" "$FILE_PATH" > /dev/null 2>&1; then
        log_info "Animation properties detected - ensuring 60fps compliance"
        validate_animation_properties "$FILE_PATH"
    fi
    
    # Check for problematic CSS properties
    if grep -E "(box-shadow|backdrop-filter|filter)" "$FILE_PATH" > /dev/null 2>&1; then
        log_warning "Performance-heavy CSS properties detected:"
        grep -n -E "(box-shadow|backdrop-filter|filter)" "$FILE_PATH" || true
        log_warning "Monitor impact on Core Web Vitals"
    fi
fi

# 4. Brand Consistency Performance
CONTEXT=$(detect_development_context "$FILE_PATH")
if [[ "$CONTEXT" == "redesign_2" ]]; then
    log_info "Checking /2 redesign performance standards..."
    
    # Validate brand token usage (optimal for performance)
    if [[ "$FILE_PATH" =~ \.module\.css$ ]]; then
        check_brand_token_performance "$FILE_PATH"
    fi
fi

# 5. Accessibility Performance Impact
if [[ "$CHANGE_TYPE" == "ui-component" ]]; then
    log_info "Checking accessibility performance impact..."
    
    # Skip accessibility tests in hooks to prevent timeouts
    log_info "Accessibility performance check skipped in hooks - run manually if needed"
fi

# 6. Bundle Size Impact (for JS/TS changes)
if [[ "$FILE_PATH" =~ \.(ts|tsx|js|jsx)$ ]]; then
    log_info "JavaScript/TypeScript change - checking bundle impact..."
    check_bundle_size_impact "$FILE_PATH"
fi

# 7. Enterprise Performance Standards Validation
log_info "Validating Enterprise Solutions Architect standards..."
validate_enterprise_performance_standards "$FILE_PATH"

# 8. Provide Performance Guidance
log_info "Performance excellence check completed"

case "$CHANGE_TYPE" in
    "ui-component")
        log_success "✅ UI component performance validated"
        log_info "💡 Ensure 60fps animations and smooth interactions"
        ;;
    "css-change")
        log_success "✅ CSS performance impact assessed"
        log_info "💡 Monitor Core Web Vitals for visual changes"
        ;;
    *)
        log_success "✅ Performance impact assessed"
        ;;
esac

# Performance recommendations
log_info "🎯 Performance targets:"
log_info "  - LCP: <2.5s (Enterprise credibility)"
log_info "  - FID: <100ms (Professional responsiveness)"
log_info "  - CLS: <0.1 (Stable business presentation)"
log_info "  - Animations: 60fps (Smooth user experience)"

log_hook_success "PERFORMANCE_EXCELLENCE_CHECK completed successfully"
exit 0