#!/bin/bash

# Claude Code Test Selection Utilities
# Smart test strategy selection based on file changes and context

# Source hook utilities if not already loaded
if [[ "${HOOK_UTILS_LOADED:-}" != "true" ]]; then
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    source "$SCRIPT_DIR/hook-utils.sh"
fi

# Test strategy definitions
declare -A TEST_STRATEGIES=(
    ["smoke"]="npm run test:e2e:smoke"
    ["component"]="npm run test:e2e:dev"
    ["visual"]="npm run test:e2e:visual"
    ["navigation"]="npm run test:e2e:navigation"
    ["accessibility"]="npm run test:e2e:accessibility"
    ["performance"]="npm run test:e2e:performance"
    ["mobile"]="npm run test:e2e:mobile"
    ["comprehensive"]="npm run test:e2e:portfolio"
    ["skip"]="echo 'Skipping tests for non-critical change'"
)

# File type to test strategy mapping
get_test_strategy_for_file_type() {
    local file_path="$1"
    local file_extension=$(get_file_extension "$file_path")
    local relative_path=$(get_relative_path "$file_path")
    
    case "$file_extension" in
        "tsx"|"ts")
            if [[ "$relative_path" =~ components/ ]]; then
                echo "component"
            elif [[ "$relative_path" =~ Navigation ]]; then
                echo "navigation"
            elif [[ "$relative_path" =~ app/2/ ]]; then
                echo "component"  # /2 redesign components get component testing
            else
                echo "comprehensive"
            fi
            ;;
        "css"|"module.css")
            if [[ "$relative_path" =~ brand-tokens\.css ]]; then
                echo "visual"  # Design token changes need full visual testing
            elif [[ "$relative_path" =~ Navigation ]]; then
                echo "navigation"
            else
                echo "visual"
            fi
            ;;
        "json")
            if [[ "$relative_path" =~ package\.json ]]; then
                echo "comprehensive"  # Package changes need full testing
            else
                echo "smoke"
            fi
            ;;
        "js")
            if [[ "$relative_path" =~ config ]]; then
                echo "comprehensive"
            else
                echo "component"
            fi
            ;;
        "md")
            echo "skip"  # Documentation changes don't need tests
            ;;
        *)
            echo "smoke"  # Default to smoke tests for unknown types
            ;;
    esac
}

# Context-aware test strategy
get_context_aware_test_strategy() {
    local file_path="$1"
    local development_context=$(get_development_mode)
    local base_strategy=$(get_test_strategy_for_file_type "$file_path")
    
    case "$development_context" in
        "redesign_2")
            # /2 redesign gets optimized testing
            case "$base_strategy" in
                "comprehensive")
                    echo "component"  # Downgrade to component for faster feedback
                    ;;
                "visual")
                    if should_skip_visual_tests; then
                        echo "component"
                    else
                        echo "visual"
                    fi
                    ;;
                *)
                    echo "$base_strategy"
                    ;;
            esac
            ;;
        "fast")
            # Fast mode prioritizes speed
            case "$base_strategy" in
                "comprehensive"|"visual")
                    echo "smoke"
                    ;;
                "component")
                    echo "smoke"
                    ;;
                *)
                    echo "$base_strategy"
                    ;;
            esac
            ;;
        "performance")
            # Performance context adds performance testing
            case "$base_strategy" in
                "component"|"visual")
                    echo "performance"
                    ;;
                *)
                    echo "$base_strategy"
                    ;;
            esac
            ;;
        *)
            echo "$base_strategy"
            ;;
    esac
}

# Determine optimal test strategy
determine_test_strategy() {
    local file_path="$1"
    local change_type="${2:-general}"
    
    # Skip tests for certain conditions
    if [[ "${SKIP_TESTS:-}" == "true" ]]; then
        echo "skip"
        return 0
    fi
    
    # Override strategy based on change type
    case "$change_type" in
        "hotfix")
            echo "smoke"
            ;;
        "visual")
            echo "visual"
            ;;
        "navigation")
            echo "navigation"
            ;;
        "performance")
            echo "performance"
            ;;
        *)
            get_context_aware_test_strategy "$file_path"
            ;;
    esac
}

# Execute selected test strategy
execute_test_strategy() {
    local strategy="$1"
    local timeout="${2:-300}"  # 5 minute default timeout
    
    if [[ -z "${TEST_STRATEGIES[$strategy]}" ]]; then
        log_error "Unknown test strategy: $strategy"
        return 1
    fi
    
    local command="${TEST_STRATEGIES[$strategy]}"
    log_info "Executing test strategy: $strategy"
    log_info "Command: $command"
    
    # Set environment variables for context-aware testing
    local env_vars=""
    case "$strategy" in
        "smoke"|"component")
            env_vars="SKIP_VISUAL=true"
            ;;
        "visual")
            env_vars=""  # Visual tests need all capabilities
            ;;
    esac
    
    # Execute with timeout
    if [[ -n "$env_vars" ]]; then
        if ! run_with_timeout "${timeout}s" "$env_vars $command"; then
            log_error "Test strategy '$strategy' failed or timed out"
            return 1
        fi
    else
        if ! run_with_timeout "${timeout}s" "$command"; then
            log_error "Test strategy '$strategy' failed or timed out"
            return 1
        fi
    fi
    
    log_success "Test strategy '$strategy' completed successfully"
    return 0
}

# Get test execution time estimate
get_test_time_estimate() {
    local strategy="$1"
    
    case "$strategy" in
        "smoke")
            echo "< 1 minute"
            ;;
        "component")
            echo "2-3 minutes"
            ;;
        "visual")
            echo "5-8 minutes"
            ;;
        "navigation")
            echo "3-4 minutes"
            ;;
        "accessibility")
            echo "2-3 minutes"
            ;;
        "performance")
            echo "4-6 minutes"
            ;;
        "mobile")
            echo "3-5 minutes"
            ;;
        "comprehensive")
            echo "8-10 minutes"
            ;;
        "skip")
            echo "0 seconds"
            ;;
        *)
            echo "Unknown"
            ;;
    esac
}

# Suggest follow-up tests
suggest_follow_up_tests() {
    local primary_strategy="$1"
    local file_path="$2"
    
    case "$primary_strategy" in
        "smoke")
            if [[ "$file_path" =~ \.(css|scss|module\.css)$ ]]; then
                echo "Consider running visual tests: npm run test:e2e:visual"
            fi
            ;;
        "component")
            if [[ "$file_path" =~ Navigation ]]; then
                echo "Consider running navigation tests: npm run test:e2e:navigation"
            fi
            ;;
        "visual")
            echo "Consider running accessibility tests: npm run test:e2e:accessibility"
            ;;
    esac
}

# Test strategy validation
validate_test_strategy() {
    local strategy="$1"
    
    # Check if required npm scripts exist
    case "$strategy" in
        "smoke")
            npm_script_exists "test:e2e:smoke"
            ;;
        "component")
            npm_script_exists "test:e2e:dev"
            ;;
        "visual")
            npm_script_exists "test:e2e:visual"
            ;;
        "comprehensive")
            npm_script_exists "test:e2e:portfolio"
            ;;
        *)
            return 0  # Skip validation for other strategies
            ;;
    esac
}

# Get test coverage for strategy
get_test_coverage() {
    local strategy="$1"
    
    case "$strategy" in
        "smoke")
            echo "Essential functionality validation"
            ;;
        "component")
            echo "Component behavior and integration"
            ;;
        "visual")
            echo "Visual regression and design consistency"
            ;;
        "navigation")
            echo "Navigation behavior and scroll detection"
            ;;
        "accessibility")
            echo "WCAG 2.1 AA compliance and screen reader compatibility"
            ;;
        "performance")
            echo "Core Web Vitals and performance metrics"
            ;;
        "mobile")
            echo "Cross-device responsive validation"
            ;;
        "comprehensive")
            echo "Full portfolio functionality and quality"
            ;;
        *)
            echo "Custom test coverage"
            ;;
    esac
}

# Export functions for use in other scripts
export -f get_test_strategy_for_file_type
export -f get_context_aware_test_strategy
export -f determine_test_strategy
export -f execute_test_strategy
export -f get_test_time_estimate
export -f suggest_follow_up_tests
export -f validate_test_strategy
export -f get_test_coverage