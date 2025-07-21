#!/bin/bash

# Screenshot Strategy Selector for Claude Hooks System
# Intelligent decision matrix for optimal screenshot generation
# Integrates with VS Code Tasks and timeout management

# Source dependencies
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/hook-utils.sh"
source "$SCRIPT_DIR/vscode-task-integration.sh"

# Strategy Configuration
STRATEGY_TIMEOUT_THRESHOLD=15      # Seconds remaining to prefer fast strategies
STRATEGY_CRITICAL_THRESHOLD=10     # Seconds remaining to force fast strategies
STRATEGY_COMPREHENSIVE_MIN=20      # Minimum seconds needed for comprehensive testing

# Logging functions specific to strategy selection
log_strategy_info() {
    log_info "[STRATEGY] $1"
}

log_strategy_success() {
    log_success "[STRATEGY] $1"
}

log_strategy_warning() {
    log_warning "[STRATEGY] $1"
}

log_strategy_error() {
    log_error "[STRATEGY] $1"
}

# Change Type Analysis Functions

analyze_change_criticality() {
    local change_type="$1"
    local file_path="$2"
    
    case "$change_type" in
        "layout"|"template"|"page_structure")
            echo "critical"
            ;;
        "design_tokens"|"brand_tokens"|"global_styles")
            echo "high"
            ;;
        "component"|"css_module"|"component_styles")
            echo "medium"
            ;;
        "content"|"text_change"|"documentation")
            echo "low"
            ;;
        *)
            # Analyze by file path patterns
            if [[ "$file_path" =~ (layout|template|page)\.(tsx|ts|jsx|js) ]]; then
                echo "critical"
            elif [[ "$file_path" =~ (brand-tokens|globals)\.(css|scss) ]]; then
                echo "high"
            elif [[ "$file_path" =~ \.(css|scss|module\.css)$ ]]; then
                echo "medium"
            else
                echo "low"
            fi
            ;;
    esac
}

detect_development_context() {
    # Determine if we're in active development vs testing context
    if [[ "${FAST_MODE:-}" == "true" ]]; then
        echo "fast_development"
    elif [[ "${SKIP_VISUAL:-}" == "true" ]]; then
        echo "functional_testing"
    elif [[ "${DEV_SERVER_MANAGED:-}" == "true" ]]; then
        echo "vscode_development"
    elif [[ "${CI:-}" == "true" ]]; then
        echo "ci_testing"
    elif [[ -n "${PLAYWRIGHT_WORKERS:-}" ]]; then
        echo "comprehensive_testing"
    else
        echo "standard_development"
    fi
}

calculate_timeout_remaining() {
    # Hook orchestrator timeout management
    local hook_start_time="${HOOK_START_TIME:-}"
    local hook_timeout="${HOOK_TIMEOUT:-45}"  # Default 45 seconds
    
    if [[ -n "$hook_start_time" ]]; then
        local current_time=$(date +%s)
        local elapsed=$((current_time - hook_start_time))
        local remaining=$((hook_timeout - elapsed))
        echo "$remaining"
    else
        # No timeout tracking available, assume plenty of time
        echo "30"
    fi
}

assess_resource_availability() {
    local context="$1"
    
    # Check system load and available resources
    local load_avg=$(uptime | awk -F'load average:' '{ print $2 }' | awk '{ print $1 }' | tr -d ',')
    local memory_usage=$(free | grep '^Mem:' | awk '{printf "%.0f", $3/$2 * 100}' 2>/dev/null || echo "50")
    
    # Check for concurrent browser processes
    local browser_processes=$(pgrep -f "chrome|chromium|firefox|webkit" | wc -l)
    
    log_strategy_info "Resource assessment - Load: $load_avg, Memory: ${memory_usage}%, Browsers: $browser_processes"
    
    # Determine resource availability
    if (( $(echo "$load_avg > 2.0" | bc -l 2>/dev/null || echo "0") )) || [[ "$memory_usage" -gt 80 ]] || [[ "$browser_processes" -gt 3 ]]; then
        echo "constrained"
    elif [[ "$context" == "vscode_development" ]] && [[ "$browser_processes" -lt 2 ]]; then
        echo "optimal"
    else
        echo "moderate"
    fi
}

# Strategy Decision Matrix

determine_screenshot_strategy() {
    local change_type="$1"
    local file_path="${2:-}"
    local override_context="${3:-}"
    
    log_strategy_info "Analyzing screenshot strategy for change type: $change_type"
    
    # Gather decision factors
    local criticality=$(analyze_change_criticality "$change_type" "$file_path")
    local context="${override_context:-$(detect_development_context)}"
    local timeout_remaining=$(calculate_timeout_remaining)
    local resource_status=$(assess_resource_availability "$context")
    
    log_strategy_info "Decision factors - Criticality: $criticality, Context: $context, Timeout: ${timeout_remaining}s, Resources: $resource_status"
    
    # Strategy decision matrix
    local strategy="playwright_comprehensive"  # Default fallback
    
    case "$criticality" in
        "critical")
            # Critical changes always need comprehensive testing
            if [[ $timeout_remaining -ge $STRATEGY_COMPREHENSIVE_MIN ]]; then
                strategy="playwright_comprehensive"
                log_strategy_info "Critical change detected - using comprehensive Playwright testing"
            else
                strategy="puppeteer_fast_with_playwright_queue"
                log_strategy_warning "Critical change with limited time - using hybrid approach"
            fi
            ;;
        "high")
            # High criticality with context awareness
            case "$context" in
                "fast_development"|"vscode_development")
                    if [[ $timeout_remaining -ge $STRATEGY_TIMEOUT_THRESHOLD ]] && [[ "$resource_status" == "optimal" ]]; then
                        strategy="hybrid_validation"
                        log_strategy_info "High criticality in development - using hybrid validation"
                    else
                        strategy="puppeteer_fast"
                        log_strategy_info "High criticality with constraints - using fast Puppeteer"
                    fi
                    ;;
                "comprehensive_testing"|"ci_testing")
                    strategy="playwright_comprehensive"
                    log_strategy_info "High criticality in testing context - using comprehensive validation"
                    ;;
                *)
                    if [[ $timeout_remaining -ge $STRATEGY_TIMEOUT_THRESHOLD ]]; then
                        strategy="hybrid_validation"
                    else
                        strategy="puppeteer_fast"
                    fi
                    ;;
            esac
            ;;
        "medium")
            # Medium criticality with performance optimization
            case "$context" in
                "fast_development")
                    strategy="puppeteer_fast"
                    log_strategy_info "Medium criticality in fast development - using Puppeteer"
                    ;;
                "vscode_development")
                    if [[ $timeout_remaining -ge $STRATEGY_TIMEOUT_THRESHOLD ]] && [[ "$resource_status" != "constrained" ]]; then
                        strategy="puppeteer_fast"
                        log_strategy_info "Medium criticality in VS Code - using fast Puppeteer"
                    else
                        strategy="playwright_standard"
                        log_strategy_info "Medium criticality with constraints - using standard Playwright"
                    fi
                    ;;
                "comprehensive_testing")
                    strategy="playwright_comprehensive"
                    ;;
                *)
                    if [[ $timeout_remaining -lt $STRATEGY_CRITICAL_THRESHOLD ]]; then
                        strategy="puppeteer_fast"
                    elif [[ $timeout_remaining -ge $STRATEGY_TIMEOUT_THRESHOLD ]]; then
                        strategy="puppeteer_fast"
                    else
                        strategy="playwright_standard"
                    fi
                    ;;
            esac
            ;;
        "low")
            # Low criticality optimized for speed
            case "$context" in
                "comprehensive_testing"|"ci_testing")
                    strategy="playwright_standard"
                    log_strategy_info "Low criticality in testing - using standard Playwright"
                    ;;
                *)
                    if [[ $timeout_remaining -lt $STRATEGY_CRITICAL_THRESHOLD ]]; then
                        strategy="skip_screenshots"
                        log_strategy_warning "Low criticality with critical timeout - skipping screenshots"
                    else
                        strategy="puppeteer_fast"
                        log_strategy_info "Low criticality - using fast Puppeteer"
                    fi
                    ;;
            esac
            ;;
    esac
    
    # Final timeout safety check
    if [[ $timeout_remaining -lt $STRATEGY_CRITICAL_THRESHOLD ]] && [[ "$strategy" != "skip_screenshots" ]]; then
        if [[ "$criticality" == "critical" ]]; then
            strategy="puppeteer_fast"
            log_strategy_warning "Critical timeout reached - forcing fast Puppeteer for critical change"
        else
            strategy="skip_screenshots"
            log_strategy_warning "Critical timeout reached - skipping non-critical screenshots"
        fi
    fi
    
    log_strategy_success "Selected strategy: $strategy"
    echo "$strategy"
}

# Strategy Execution Functions

execute_strategy() {
    local strategy="$1"
    local change_type="$2"
    local file_path="$3"
    
    log_strategy_info "Executing strategy: $strategy"
    
    case "$strategy" in
        "puppeteer_fast")
            if [[ -f "$SCRIPT_DIR/puppeteer-screenshot-service.sh" ]]; then
                source "$SCRIPT_DIR/puppeteer-screenshot-service.sh"
                puppeteer_screenshot_service "quick"
            else
                log_strategy_error "Puppeteer service not available"
                return 1
            fi
            ;;
        "puppeteer_component")
            if [[ -f "$SCRIPT_DIR/puppeteer-screenshot-service.sh" ]]; then
                source "$SCRIPT_DIR/puppeteer-screenshot-service.sh"
                puppeteer_screenshot_service "component" "$file_path"
            else
                log_strategy_error "Puppeteer service not available"
                return 1
            fi
            ;;
        "puppeteer_mobile")
            if [[ -f "$SCRIPT_DIR/puppeteer-screenshot-service.sh" ]]; then
                source "$SCRIPT_DIR/puppeteer-screenshot-service.sh"
                puppeteer_screenshot_service "mobile"
            else
                log_strategy_error "Puppeteer service not available"
                return 1
            fi
            ;;
        "playwright_standard")
            if command -v npx >/dev/null 2>&1; then
                npx playwright test e2e/quick-screenshots.spec.ts --project=chromium
            else
                log_strategy_error "Playwright not available"
                return 1
            fi
            ;;
        "playwright_comprehensive")
            if command -v npx >/dev/null 2>&1; then
                npx playwright test e2e/screenshot-generation.spec.ts
            else
                log_strategy_error "Playwright not available"
                return 1
            fi
            ;;
        "hybrid_validation")
            log_strategy_info "Executing hybrid validation strategy"
            # Fast Puppeteer first
            if execute_strategy "puppeteer_fast" "$change_type" "$file_path"; then
                log_strategy_success "Puppeteer screenshots completed"
                # Queue Playwright for background comprehensive validation
                if command -v npx >/dev/null 2>&1; then
                    log_strategy_info "Queueing Playwright comprehensive validation..."
                    (npx playwright test e2e/visual-regression-2.spec.ts --project=chromium > /dev/null 2>&1 &)
                fi
            else
                log_strategy_warning "Puppeteer failed - falling back to Playwright"
                execute_strategy "playwright_standard" "$change_type" "$file_path"
            fi
            ;;
        "puppeteer_fast_with_playwright_queue")
            # For critical changes with time constraints
            execute_strategy "puppeteer_fast" "$change_type" "$file_path"
            local puppeteer_result=$?
            # Always queue comprehensive testing for critical changes
            if command -v npx >/dev/null 2>&1; then
                log_strategy_info "Queueing critical change comprehensive validation..."
                (npx playwright test e2e/screenshot-generation.spec.ts > /dev/null 2>&1 &)
            fi
            return $puppeteer_result
            ;;
        "skip_screenshots")
            log_strategy_warning "Skipping screenshots due to timeout constraints"
            return 0
            ;;
        *)
            log_strategy_error "Unknown strategy: $strategy"
            return 1
            ;;
    esac
}

# Testing and Validation Functions

test_strategy_selection() {
    local test_cases=(
        "css_module:/src/app/2/components/Hero/Hero.module.css:vscode_development"
        "layout:/src/app/2/layout.tsx:standard_development"
        "design_tokens:/src/app/2/styles/brand-tokens.css:fast_development"
        "component:/src/app/2/components/About/About.tsx:comprehensive_testing"
        "content:/src/app/2/page.tsx:ci_testing"
    )
    
    log_strategy_info "Testing strategy selection with various scenarios..."
    
    for test_case in "${test_cases[@]}"; do
        IFS=':' read -r change_type file_path context <<< "$test_case"
        log_strategy_info "Test case: $change_type in $context"
        
        local strategy=$(determine_screenshot_strategy "$change_type" "$file_path" "$context")
        log_strategy_success "  Result: $strategy"
        echo ""
    done
}

validate_strategy_performance() {
    local strategy="$1"
    local start_time=$(date +%s%3N)
    
    log_strategy_info "Performance testing strategy: $strategy"
    
    case "$strategy" in
        "puppeteer_fast")
            # Mock execution for testing
            sleep 2
            ;;
        "playwright_standard")
            # Mock execution for testing
            sleep 8
            ;;
        "playwright_comprehensive")
            # Mock execution for testing
            sleep 15
            ;;
    esac
    
    local end_time=$(date +%s%3N)
    local duration=$((end_time - start_time))
    
    log_strategy_success "Strategy '$strategy' completed in ${duration}ms"
    echo "$duration"
}

# Main Service Function

screenshot_strategy_service() {
    local action="${1:-select}"
    local change_type="$2"
    local file_path="$3"
    local context="$4"
    
    case "$action" in
        "select")
            determine_screenshot_strategy "$change_type" "$file_path" "$context"
            ;;
        "execute")
            local strategy=$(determine_screenshot_strategy "$change_type" "$file_path" "$context")
            execute_strategy "$strategy" "$change_type" "$file_path"
            ;;
        "test")
            test_strategy_selection
            ;;
        "validate")
            validate_strategy_performance "$change_type"
            ;;
        "analyze")
            log_strategy_info "Analyzing current system state for strategy selection..."
            log_strategy_info "Context: $(detect_development_context)"
            log_strategy_info "Timeout remaining: $(calculate_timeout_remaining)s"
            log_strategy_info "Resource status: $(assess_resource_availability "$(detect_development_context)")"
            ;;
        *)
            log_strategy_error "Unknown action: $action"
            log_strategy_info "Available actions: select, execute, test, validate, analyze"
            return 1
            ;;
    esac
}

# Main execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # Script is being executed directly
    screenshot_strategy_service "$@"
fi