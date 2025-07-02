#!/bin/bash

# Claude Code Context Detection Utilities
# Intelligent detection of development context for workflow optimization

# Source hook utilities if not already loaded
if [[ "${HOOK_UTILS_LOADED:-}" != "true" ]]; then
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    source "$SCRIPT_DIR/hook-utils.sh"
fi

# Context patterns for different development areas
REDESIGN_2_PATTERNS=(
    "src/app/2/"
    "app/2/"
    "/2/"
    "redesign"
    "enterprise"
)

MAIN_PORTFOLIO_PATTERNS=(
    "src/app/page"
    "src/app/layout"
    "src/components/"
    "app/page"
    "app/layout"
)

TESTING_PATTERNS=(
    "e2e/"
    "test"
    "spec"
    ".spec."
    ".test."
    "playwright"
)

PERFORMANCE_PATTERNS=(
    "performance"
    "web-vitals"
    "lighthouse"
    "optimization"
    "core-web-vitals"
)

# Detect development context based on file path
detect_development_context() {
    local file_path="$1"
    local relative_path=$(get_relative_path "$file_path")
    
    # Check for /2 redesign context
    for pattern in "${REDESIGN_2_PATTERNS[@]}"; do
        if [[ "$relative_path" =~ $pattern ]]; then
            echo "redesign_2"
            return 0
        fi
    done
    
    # Check for testing context
    for pattern in "${TESTING_PATTERNS[@]}"; do
        if [[ "$relative_path" =~ $pattern ]]; then
            echo "testing"
            return 0
        fi
    done
    
    # Check for performance context
    for pattern in "${PERFORMANCE_PATTERNS[@]}"; do
        if [[ "$relative_path" =~ $pattern ]]; then
            echo "performance"
            return 0
        fi
    done
    
    # Check for main portfolio context
    for pattern in "${MAIN_PORTFOLIO_PATTERNS[@]}"; do
        if [[ "$relative_path" =~ $pattern ]]; then
            echo "main_portfolio"
            return 0
        fi
    done
    
    # Default context
    echo "general"
}

# Detect current development context based on working directory and recent files
detect_current_development_context() {
    local current_dir="$PWD"
    local project_root=$(get_project_root)
    
    # Check current working directory
    if [[ "$current_dir" =~ /2/ ]]; then
        echo "redesign_2"
        return 0
    fi
    
    # Check recently modified files (git-based detection)
    if is_git_repo; then
        local recent_files=$(git diff --name-only HEAD~1 2>/dev/null || echo "")
        
        if [[ "$recent_files" =~ app/2/ ]]; then
            echo "redesign_2"
            return 0
        fi
        
        if [[ "$recent_files" =~ e2e/ ]]; then
            echo "testing"
            return 0
        fi
        
        if [[ "$recent_files" =~ performance ]]; then
            echo "performance"
            return 0
        fi
    fi
    
    # Check environment variables
    if [[ "${DEVELOPMENT_CONTEXT:-}" ]]; then
        echo "${DEVELOPMENT_CONTEXT}"
        return 0
    fi
    
    # Check for active development indicators
    if [[ "${FAST_MODE:-}" == "true" ]]; then
        echo "fast_development"
        return 0
    fi
    
    if [[ "${SKIP_VISUAL:-}" == "true" ]]; then
        echo "testing"
        return 0
    fi
    
    # Default context
    echo "general"
}

# Get context-specific configuration
get_context_config() {
    local context="$1"
    
    case "$context" in
        "redesign_2")
            echo '{
                "focus_area": "/2",
                "test_strategy": "fast",
                "visual_testing": true,
                "brand_validation": true,
                "performance_monitoring": true,
                "target_audience": "enterprise"
            }'
            ;;
        "main_portfolio")
            echo '{
                "focus_area": "main",
                "test_strategy": "comprehensive", 
                "visual_testing": true,
                "brand_validation": false,
                "performance_monitoring": true,
                "target_audience": "general"
            }'
            ;;
        "testing")
            echo '{
                "focus_area": "quality",
                "test_strategy": "fast",
                "visual_testing": false,
                "brand_validation": false,
                "performance_monitoring": false,
                "target_audience": "developers"
            }'
            ;;
        "performance")
            echo '{
                "focus_area": "optimization",
                "test_strategy": "performance",
                "visual_testing": false,
                "brand_validation": false,
                "performance_monitoring": true,
                "target_audience": "technical"
            }'
            ;;
        *)
            echo '{
                "focus_area": "general",
                "test_strategy": "standard",
                "visual_testing": true,
                "brand_validation": false,
                "performance_monitoring": false,
                "target_audience": "general"
            }'
            ;;
    esac
}

# Get context-specific environment variables
get_context_environment() {
    local context="$1"
    
    case "$context" in
        "redesign_2")
            cat << EOF
export DEVELOPMENT_CONTEXT="redesign_2"
export FAST_MODE="true"
export FOCUS_AREA="/2"
export TEST_SCOPE="redesign"
export BRAND_VALIDATION="true"
EOF
            ;;
        "main_portfolio")
            cat << EOF
export DEVELOPMENT_CONTEXT="main_portfolio"
export FOCUS_AREA="main"
export TEST_SCOPE="full"
export BRAND_VALIDATION="false"
EOF
            ;;
        "testing")
            cat << EOF
export DEVELOPMENT_CONTEXT="testing"
export FAST_MODE="true"
export SKIP_VISUAL="true"
export TEST_SCOPE="functional"
EOF
            ;;
        "performance")
            cat << EOF
export DEVELOPMENT_CONTEXT="performance"
export MONITOR_CORE_WEB_VITALS="true"
export TEST_SCOPE="performance"
export PERFORMANCE_TRACKING="true"
EOF
            ;;
        *)
            cat << EOF
export DEVELOPMENT_CONTEXT="general"
export TEST_SCOPE="standard"
EOF
            ;;
    esac
}

# Provide context-aware notifications
provide_context_notifications() {
    local context="$1"
    
    case "$context" in
        "redesign_2")
            log_info "🎨 /2 Redesign Development Context Active"
            log_info "  → Enterprise Solutions Architect focus"
            log_info "  → Fast development testing enabled"
            log_info "  → Brand consistency validation active"
            log_info "  → Performance standards: 60fps animations, <2.5s LCP"
            ;;
        "main_portfolio")
            log_info "🏠 Main Portfolio Development Context Active"
            log_info "  → Creative sophistication focus"
            log_info "  → Comprehensive testing strategy"
            log_info "  → Preserve existing functionality"
            ;;
        "testing")
            log_info "🧪 Testing Development Context Active"
            log_info "  → Fast mode testing enabled"
            log_info "  → Visual testing skipped for speed"
            log_info "  → Focus on functional validation"
            ;;
        "performance")
            log_info "⚡ Performance Development Context Active"
            log_info "  → Core Web Vitals monitoring enabled"
            log_info "  → Animation performance validation"
            log_info "  → Enterprise presentation standards"
            ;;
        *)
            log_info "🔧 General Development Context Active"
            log_info "  → Standard testing and validation"
            ;;
    esac
}

# Optimize pre-work environment based on context
optimize_pre_work_environment() {
    local context="$1"
    
    log_info "Optimizing pre-work environment for: $context"
    
    case "$context" in
        "redesign_2")
            # Set up /2 development environment
            log_info "Setting up /2 redesign development environment..."
            export DEVELOPMENT_CONTEXT="redesign_2"
            export FAST_MODE="true"
            
            # Ensure dev server is optimized for /2 work
            if is_dev_server_running; then
                log_success "Dev server ready for /2 development"
            else
                log_info "Consider starting dev server: npm run dev"
            fi
            ;;
        "testing")
            # Set up testing environment
            log_info "Setting up testing environment..."
            export SKIP_VISUAL="true"
            export FAST_MODE="true"
            
            # Check Playwright setup
            if command -v npx > /dev/null && npx playwright --version > /dev/null 2>&1; then
                log_success "Playwright ready for testing"
            else
                log_warning "Playwright setup may be needed"
            fi
            ;;
        "performance")
            # Set up performance monitoring
            log_info "Setting up performance monitoring environment..."
            export MONITOR_CORE_WEB_VITALS="true"
            export PERFORMANCE_TRACKING="true"
            ;;
    esac
}

# Optimize post-work cleanup based on context
optimize_post_work_cleanup() {
    local context="$1"
    
    log_info "Running post-work optimization for: $context"
    
    case "$context" in
        "redesign_2")
            log_info "/2 redesign session complete"
            log_info "📸 Check screenshots in screenshots/quick-review/"
            log_info "🎯 Verify Enterprise presentation standards"
            ;;
        "testing")
            log_info "Testing session complete"
            log_info "📊 Review test results and logs"
            ;;
        "performance")
            log_info "Performance optimization session complete"
            log_info "⚡ Review Core Web Vitals impact"
            ;;
    esac
}

# Get recommended workflow for context
get_recommended_workflow() {
    local context="$1"
    
    case "$context" in
        "redesign_2")
            echo "1. Work in src/app/2/ directory"
            echo "2. Use npm run test:e2e:smoke for quick validation"
            echo "3. Generate screenshots with quick-screenshots.spec.ts"
            echo "4. Focus on Enterprise Solutions Architect branding"
            echo "5. Validate brand token usage and 60fps animations"
            ;;
        "main_portfolio")
            echo "1. Work in src/app/ root or src/components/"
            echo "2. Use npm run test:e2e:portfolio for comprehensive testing"
            echo "3. Maintain creative sophistication"
            echo "4. Preserve existing functionality"
            echo "5. Run visual regression tests for changes"
            ;;
        "testing")
            echo "1. Focus on test reliability and speed"
            echo "2. Use FAST_MODE and SKIP_VISUAL flags"
            echo "3. Prioritize functional validation"
            echo "4. Update test baselines when needed"
            echo "5. Document test coverage improvements"
            ;;
        "performance")
            echo "1. Monitor Core Web Vitals impact"
            echo "2. Validate 60fps animation performance"
            echo "3. Check bundle size and optimization"
            echo "4. Test Enterprise presentation standards"
            echo "5. Run performance tests before completion"
            ;;
        *)
            echo "1. Follow standard development workflow"
            echo "2. Run appropriate tests for changes"
            echo "3. Generate visual documentation as needed"
            echo "4. Maintain code quality standards"
            echo "5. Validate changes before completion"
            ;;
    esac
}

# Export functions for use in other scripts
export -f detect_development_context
export -f detect_current_development_context
export -f get_context_config
export -f get_context_environment
export -f provide_context_notifications
export -f optimize_pre_work_environment
export -f optimize_post_work_cleanup
export -f get_recommended_workflow