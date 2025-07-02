#!/bin/bash

# Claude Code Development Context Optimizer Hook
# Intelligent context detection and workflow optimization

set -e

# Source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/hook-utils.sh"
source "$SCRIPT_DIR/lib/context-detection.sh"

# Parse command line arguments
HOOK_TYPE="${1:-notification}"
CONTEXT_INFO="${2:-}"

# Initialize hook execution
log_hook_start "DEVELOPMENT_CONTEXT_OPTIMIZER" "$HOOK_TYPE"

# 1. Detect Current Development Context
CURRENT_CONTEXT=$(detect_current_development_context)
log_info "Current development context: $CURRENT_CONTEXT"

# 2. Set Context-Specific Environment Variables
case "$CURRENT_CONTEXT" in
    "redesign_2")
        log_info "Optimizing for /2 redesign development..."
        export DEVELOPMENT_CONTEXT="redesign_2"
        export FAST_MODE="true"
        export FOCUS_AREA="/2"
        export TEST_SCOPE="redesign"
        ;;
    "main_portfolio")
        log_info "Optimizing for main portfolio development..."
        export DEVELOPMENT_CONTEXT="main_portfolio"
        export FAST_MODE="false"
        export FOCUS_AREA="main"
        export TEST_SCOPE="full"
        ;;
    "testing")
        log_info "Optimizing for testing workflow..."
        export DEVELOPMENT_CONTEXT="testing"
        export FAST_MODE="true"
        export SKIP_VISUAL="true"
        export TEST_SCOPE="functional"
        ;;
    "performance")
        log_info "Optimizing for performance development..."
        export DEVELOPMENT_CONTEXT="performance"
        export MONITOR_CORE_WEB_VITALS="true"
        export TEST_SCOPE="performance"
        ;;
    *)
        log_info "General development context detected"
        export DEVELOPMENT_CONTEXT="general"
        ;;
esac

# 3. Optimize Testing Strategy Based on Context
case "$CURRENT_CONTEXT" in
    "redesign_2")
        log_info "Setting /2 redesign testing strategy..."
        # Recommend fast development tests for /2 work
        log_info "💡 Recommended tests for /2 development:"
        log_info "  - npm run test:e2e:smoke (quick validation)"
        log_info "  - npm run test:e2e:dev (functional testing)"
        log_info "  - npx playwright test e2e/quick-screenshots.spec.ts (visual review)"
        ;;
    "main_portfolio")
        log_info "Setting main portfolio testing strategy..."
        log_info "💡 Recommended tests for main portfolio:"
        log_info "  - npm run test:e2e:portfolio (comprehensive)"
        log_info "  - npm run test:e2e:visual (visual regression)"
        ;;
    "performance")
        log_info "Setting performance testing strategy..."
        log_info "💡 Performance testing recommendations:"
        log_info "  - npm run test:e2e:performance (Core Web Vitals)"
        log_info "  - Monitor lighthouse scores"
        ;;
esac

# 4. Environment-Aware Development Optimization
case "$HOOK_TYPE" in
    "notification")
        log_info "Providing context-aware development notifications..."
        provide_context_notifications "$CURRENT_CONTEXT"
        ;;
    "pre_work")
        log_info "Optimizing pre-work environment..."
        optimize_pre_work_environment "$CURRENT_CONTEXT"
        ;;
    "post_work")
        log_info "Optimizing post-work cleanup..."
        optimize_post_work_cleanup "$CURRENT_CONTEXT"
        ;;
esac

# 5. Workflow Recommendations
log_info "🚀 Context-optimized workflow:"

case "$CURRENT_CONTEXT" in
    "redesign_2")
        log_info "  1. Work in src/app/2/ directory"
        log_info "  2. Use fast development testing (2-3 min cycles)"
        log_info "  3. Generate screenshots for visual validation"
        log_info "  4. Focus on Enterprise Solutions Architect branding"
        ;;
    "main_portfolio")
        log_info "  1. Work in src/app/ root or src/components/"
        log_info "  2. Use comprehensive testing"
        log_info "  3. Maintain creative sophistication"
        log_info "  4. Preserve existing functionality"
        ;;
    "testing")
        log_info "  1. Focus on test reliability and speed"
        log_info "  2. Use FAST_MODE and SKIP_VISUAL flags"
        log_info "  3. Prioritize functional validation"
        ;;
esac

# 6. Performance Context Optimization
if [[ "$CURRENT_CONTEXT" == "performance" || "$CURRENT_CONTEXT" == "redesign_2" ]]; then
    log_info "🎯 Performance optimization active:"
    log_info "  - Core Web Vitals monitoring enabled"
    log_info "  - 60fps animation validation"
    log_info "  - Enterprise presentation standards"
fi

# 7. Creative Development Context
if [[ "$CURRENT_CONTEXT" == "redesign_2" ]]; then
    log_info "🎨 Creative development optimization:"
    log_info "  - Brand token consistency validation"
    log_info "  - Interactive storytelling elements"
    log_info "  - Cross-device experience validation"
fi

log_hook_success "DEVELOPMENT_CONTEXT_OPTIMIZER completed successfully"
exit 0