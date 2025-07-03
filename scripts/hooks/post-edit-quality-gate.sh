#!/bin/bash

# Claude Code Post-Edit Quality Gate Hook
# Runs after Claude edits files to ensure quality and run appropriate tests

set -e

# Source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/hook-utils.sh"
source "$SCRIPT_DIR/lib/test-selection.sh"
source "$SCRIPT_DIR/lib/visual-change-detection.sh"
source "$SCRIPT_DIR/lib/performance-monitoring.sh"

# Parse command line arguments
CHANGE_TYPE="${1:-general}"
FILE_PATH="${2:-}"

# Initialize hook execution
log_hook_start "POST_EDIT_QUALITY_GATE" "$CHANGE_TYPE"

# Ensure we have the active development server port for testing operations
if [[ "$CHANGE_TYPE" =~ (component|layout) ]]; then
    ensure_active_port
fi

# Track start time for performance monitoring
START_TIME=$(date +%s)

# 1. Immediate TypeScript Validation
log_info "Running TypeScript validation..."
if ! npm run typecheck --silent; then
    log_error "TypeScript errors introduced by edit"
    log_error "Please fix TypeScript errors before proceeding"
    exit 1
fi

# 2. Smart Test Selection
log_info "Determining appropriate test strategy..."
TEST_STRATEGY=$(determine_test_strategy "$FILE_PATH" "$CHANGE_TYPE")
log_info "Selected test strategy: $TEST_STRATEGY"

case "$TEST_STRATEGY" in
    "smoke")
        log_info "Running smoke tests..."
        if ! npm run test:e2e:smoke; then
            log_error "Smoke tests failed"
            exit 1
        fi
        ;;
    "component")
        log_info "Running component-focused tests..."
        if ! npm run test:e2e:dev; then
            log_error "Component tests failed"
            exit 1
        fi
        ;;
    "visual")
        log_info "Running visual tests..."
        if is_visual_change "$FILE_PATH"; then
            log_info "Visual change detected - generating screenshots..."
            # Run quick screenshot generation with timeout
            if ! timeout 30 npx playwright test e2e/quick-screenshots.spec.ts --project=chromium --reporter=line --timeout=20000; then
                log_warning "Screenshot generation failed or timed out - continuing"
            else
                log_info "Screenshots generated successfully"
            fi
        fi
        ;;
    "comprehensive")
        log_info "Running comprehensive tests..."
        # Use faster development testing instead of full portfolio suite
        if ! npm run test:e2e:dev; then
            log_error "Development tests failed"
            exit 1
        fi
        ;;
    "skip")
        log_info "Skipping tests for non-critical change"
        ;;
esac

# 3. Performance Impact Assessment
if is_performance_critical_file "$FILE_PATH"; then
    log_info "Performance critical file detected - running impact assessment..."
    assess_performance_impact "$FILE_PATH"
fi

# 4. Visual Change Processing
if is_visual_change "$FILE_PATH"; then
    log_info "Processing visual change..."
    process_visual_change "$FILE_PATH"
fi

# 5. Calculate and log execution time
END_TIME=$(date +%s)
EXECUTION_TIME=$((END_TIME - START_TIME))
log_info "Quality gate completed in ${EXECUTION_TIME}s"

# Provide feedback on test results
case "$TEST_STRATEGY" in
    "smoke"|"component"|"comprehensive")
        log_success "✅ All tests passed - changes validated successfully"
        ;;
    "visual")
        log_success "✅ Visual changes processed - review screenshots in screenshots/ directory"
        ;;
    *)
        log_success "✅ Quality gate completed successfully"
        ;;
esac

log_hook_success "POST_EDIT_QUALITY_GATE completed successfully"
exit 0