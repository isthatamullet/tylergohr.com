#!/bin/bash

# Claude Code Performance Monitoring Utilities
# Monitors performance impact and maintains Enterprise standards

# Source hook utilities if not already loaded
if [[ "${HOOK_UTILS_LOADED:-}" != "true" ]]; then
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    source "$SCRIPT_DIR/hook-utils.sh"
fi

# Performance thresholds (Enterprise Solutions Architect standards)
declare -A PERFORMANCE_THRESHOLDS=(
    ["lcp_target"]="2.5"      # Largest Contentful Paint (seconds)
    ["fid_target"]="0.1"      # First Input Delay (seconds)
    ["cls_target"]="0.1"      # Cumulative Layout Shift
    ["lighthouse_min"]="90"   # Lighthouse score minimum
    ["animation_fps"]="60"    # Animation frame rate target
)

# Performance critical file patterns
PERFORMANCE_CRITICAL_PATTERNS=(
    "page\.tsx$"
    "layout\.tsx$"
    "globals\.css$"
    "brand-tokens\.css$"
    "components/.*\.(tsx|css)$"
    "app/2/.*\.(tsx|css)$"
)

# Check if file is performance critical
is_performance_critical_file() {
    local file_path="$1"
    local relative_path=$(get_relative_path "$file_path")
    
    for pattern in "${PERFORMANCE_CRITICAL_PATTERNS[@]}"; do
        if [[ "$relative_path" =~ $pattern ]]; then
            return 0
        fi
    done
    
    return 1
}

# Assess performance impact of changes
assess_performance_impact() {
    local file_path="$1"
    local relative_path=$(get_relative_path "$file_path")
    
    log_info "Assessing performance impact for: $relative_path"
    
    # File-specific performance analysis
    case "$relative_path" in
        *"page.tsx"|*"layout.tsx")
            assess_page_performance_impact "$file_path"
            ;;
        *".css"|*".module.css")
            assess_css_performance_impact "$file_path"
            ;;
        *"components/"*)
            assess_component_performance_impact "$file_path"
            ;;
        *)
            log_info "Standard performance assessment for: $relative_path"
            ;;
    esac
}

# Assess page-level performance impact
assess_page_performance_impact() {
    local file_path="$1"
    
    log_info "Analyzing page-level performance impact..."
    
    # Check for performance-affecting patterns
    if [[ -f "$file_path" ]]; then
        # Large imports or dynamic imports
        if grep -q "import.*from.*node_modules" "$file_path"; then
            log_warning "Large library imports detected - monitor bundle size"
        fi
        
        # Dynamic imports (good for performance)
        if grep -q "import(" "$file_path"; then
            log_success "Dynamic imports found - good for code splitting"
        fi
        
        # useEffect patterns that might affect performance
        if grep -q "useEffect.*\[\]" "$file_path"; then
            log_info "useEffect with empty deps found - check for performance impact"
        fi
    fi
}

# Assess CSS performance impact
assess_css_performance_impact() {
    local file_path="$1"
    
    log_info "Analyzing CSS performance impact..."
    
    if [[ -f "$file_path" ]]; then
        # Performance-heavy CSS properties
        local heavy_properties=(
            "box-shadow"
            "filter"
            "backdrop-filter"
            "clip-path"
        )
        
        for prop in "${heavy_properties[@]}"; do
            if grep -q "$prop" "$file_path"; then
                log_warning "Performance-heavy CSS property '$prop' detected"
                grep -n "$prop" "$file_path" | head -2 || true
            fi
        done
        
        # Animation performance check
        check_animation_performance "$file_path"
        
        # Brand token usage check
        check_brand_token_performance "$file_path"
    fi
}

# Check animation performance
check_animation_performance() {
    local file_path="$1"
    
    if [[ -f "$file_path" ]]; then
        log_info "Checking animation performance..."
        
        # Good animation properties (60fps friendly)
        local good_props=("transform" "opacity")
        local found_good=false
        
        for prop in "${good_props[@]}"; do
            if grep -q "animation.*$prop\|transition.*$prop" "$file_path"; then
                log_success "60fps-friendly animation property '$prop' found"
                found_good=true
            fi
        done
        
        # Problematic animation properties
        local bad_props=("left" "top" "width" "height" "margin" "padding")
        
        for prop in "${bad_props[@]}"; do
            if grep -q "animation.*$prop\|transition.*$prop" "$file_path"; then
                log_warning "Performance-heavy animation property '$prop' detected"
                log_warning "Consider using 'transform' instead for 60fps animations"
            fi
        done
        
        # Check for will-change usage
        if grep -q "will-change" "$file_path"; then
            log_info "will-change property found - ensure proper cleanup"
        fi
    fi
}

# Assess component performance impact
assess_component_performance_impact() {
    local file_path="$1"
    
    log_info "Analyzing component performance impact..."
    
    if [[ -f "$file_path" ]]; then
        # React performance patterns
        if grep -q "React.memo\|useMemo\|useCallback" "$file_path"; then
            log_success "React performance optimizations found"
        fi
        
        # Potential performance issues
        if grep -q "useEffect.*\[.*\].*{" "$file_path"; then
            local effect_count=$(grep -c "useEffect" "$file_path")
            if [[ $effect_count -gt 3 ]]; then
                log_warning "Multiple useEffect hooks found ($effect_count) - review for performance"
            fi
        fi
        
        # Large components (potential for splitting)
        local line_count=$(wc -l < "$file_path")
        if [[ $line_count -gt 200 ]]; then
            log_warning "Large component file ($line_count lines) - consider splitting"
        fi
    fi
}

# Run Core Web Vitals check
run_core_web_vitals_check() {
    log_info "Running Core Web Vitals check..."
    
    # Check if dev server is available
    if ! is_dev_server_running; then
        log_warning "Dev server not available - skipping live Core Web Vitals check"
        return 1
    fi
    
    # Run performance tests if available
    if npm_script_exists "test:e2e:performance"; then
        log_info "Running Playwright performance tests..."
        if ! npm run test:e2e:performance --silent; then
            log_warning "Performance tests failed - review Core Web Vitals impact"
            return 1
        fi
    else
        log_info "No performance test script found - manual Core Web Vitals check recommended"
    fi
    
    return 0
}

# Check brand token performance impact
check_brand_token_performance() {
    local file_path="$1"
    
    if [[ -f "$file_path" && "$file_path" =~ \.(css|scss|module\.css)$ ]]; then
        # CSS custom properties are performance-optimized
        local token_count=$(grep -c "var(--" "$file_path" 2>/dev/null || echo "0")
        local hardcode_count=$(grep -c "#[0-9a-fA-F]\{3,6\}" "$file_path" 2>/dev/null || echo "0")
        
        if [[ $token_count -gt 0 ]]; then
            log_success "Brand tokens usage found ($token_count instances) - optimized for performance"
        fi
        
        if [[ $hardcode_count -gt 0 ]]; then
            log_warning "Hard-coded values found ($hardcode_count instances) - consider brand tokens"
        fi
    fi
}

# Check bundle size impact
check_bundle_size_impact() {
    local file_path="$1"
    
    if [[ -f "$file_path" ]]; then
        log_info "Checking bundle size impact..."
        
        # Large imports that might affect bundle size
        if grep -q "import.*\*.*from" "$file_path"; then
            log_warning "Wildcard imports detected - consider specific imports for smaller bundles"
            grep -n "import.*\*.*from" "$file_path" | head -2 || true
        fi
        
        # Third-party library imports
        local lib_imports=$(grep -c "from ['\"].*['\"]" "$file_path" 2>/dev/null || echo "0")
        if [[ $lib_imports -gt 10 ]]; then
            log_info "Multiple library imports ($lib_imports) - monitor bundle size"
        fi
    fi
}

# Validate Enterprise performance standards
validate_enterprise_performance_standards() {
    local file_path="$1"
    
    log_info "Validating Enterprise Solutions Architect performance standards..."
    
    # Context-specific standards
    local relative_path=$(get_relative_path "$file_path")
    if [[ "$relative_path" =~ app/2/ ]]; then
        log_info "Applying /2 redesign Enterprise standards:"
        log_info "  - LCP: <${PERFORMANCE_THRESHOLDS[lcp_target]}s (Enterprise credibility)"
        log_info "  - FID: <${PERFORMANCE_THRESHOLDS[fid_target]}s (Professional responsiveness)"
        log_info "  - CLS: <${PERFORMANCE_THRESHOLDS[cls_target]} (Stable business presentation)"
        log_info "  - Animations: ${PERFORMANCE_THRESHOLDS[animation_fps]}fps (Smooth interactions)"
    fi
    
    # File-specific validation
    if is_performance_critical_file "$file_path"; then
        log_info "Performance critical file - extra validation applied"
        
        # Run additional checks if dev server is available
        if is_dev_server_running; then
            log_info "Dev server available - consider running performance tests"
        fi
    fi
}

# Generate performance recommendations
generate_performance_recommendations() {
    local file_path="$1"
    local change_type="${2:-general}"
    
    log_info "🎯 Performance Recommendations:"
    
    case "$change_type" in
        "css-change")
            log_info "  → Use transform and opacity for animations (60fps)"
            log_info "  → Minimize use of box-shadow and filter properties"
            log_info "  → Prefer CSS custom properties (brand tokens) over hard-coded values"
            ;;
        "ui-component")
            log_info "  → Use React.memo, useMemo, useCallback for optimization"
            log_info "  → Minimize useEffect dependencies and side effects"
            log_info "  → Consider component splitting for large files (>200 lines)"
            ;;
        "image-asset")
            log_info "  → Ensure images are optimized (WebP, proper sizing)"
            log_info "  → Use responsive images with srcset"
            log_info "  → Consider lazy loading for below-fold images"
            ;;
        *)
            log_info "  → Monitor Core Web Vitals impact"
            log_info "  → Test performance across devices"
            log_info "  → Maintain Enterprise presentation standards"
            ;;
    esac
    
    log_info "  → Target: LCP <2.5s, FID <100ms, CLS <0.1"
    log_info "  → Lighthouse score: 90+ for Enterprise credibility"
}

# Export functions for use in other scripts
export -f is_performance_critical_file
export -f assess_performance_impact
export -f assess_page_performance_impact
export -f assess_css_performance_impact
export -f check_animation_performance
export -f assess_component_performance_impact
export -f run_core_web_vitals_check
export -f check_brand_token_performance
export -f check_bundle_size_impact
export -f validate_enterprise_performance_standards
export -f generate_performance_recommendations