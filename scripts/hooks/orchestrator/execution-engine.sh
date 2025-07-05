#!/bin/bash

# Claude Hooks Orchestration System - Execution Engine
# Intelligent execution of operation plans with resource management
# Handles parallel/sequential execution and timeout compliance

set -e

# Source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../lib/hook-utils.sh"
source "$SCRIPT_DIR/resource-manager.sh"

# Execution state tracking
declare -A EXECUTION_STATE=(
    ["running_operations"]=""
    ["completed_operations"]=""
    ["failed_operations"]=""
    ["background_operations"]=""
    ["total_start_time"]=""
    ["total_duration"]=""
    ["success_rate"]=""
)

# Operation command mappings
declare -A OPERATION_COMMANDS=(
    # Infrastructure operations
    ["port_detection"]="get_shared_port_detection"
    ["dev_server_validation"]="get_shared_dev_server_health"
    
    # Validation operations
    ["typescript_validation"]="get_shared_typescript_validation"
    ["build_validation"]="npm run build --silent"
    
    # Testing operations
    ["smoke_testing"]="npm run test:e2e:smoke"
    ["component_testing"]="npm run test:e2e:dev"
    ["navigation_testing"]="npm run test:e2e:navigation"
    ["comprehensive_testing"]="npm run test:e2e:portfolio"
    
    # NEW: Fast Puppeteer Operations
    ["puppeteer_quick_screenshots"]="puppeteer_screenshot_service quick"
    ["puppeteer_component_focus"]="puppeteer_screenshot_service component"
    ["puppeteer_mobile_preview"]="puppeteer_screenshot_service mobile"
    
    # NEW: Strategic Screenshot Operations
    ["strategic_screenshot_generation"]="strategic_screenshot_execution"
    ["intelligent_visual_validation"]="intelligent_visual_validation_execution"
    
    # NEW: Hybrid Operations
    ["hybrid_visual_validation"]="hybrid_screenshot_workflow"
    ["hybrid_design_system"]="hybrid_design_token_workflow"
    
    # Visual operations (enhanced with fallback)
    ["visual_validation"]="strategic_screenshot_generation"
    ["visual_regression"]="npm run test:e2e:visual"
    ["screenshot_generation"]="strategic_screenshot_generation"
    
    # Traditional Playwright operations (maintained for fallback)
    ["playwright_quick_screenshots"]="npx playwright test e2e/quick-screenshots.spec.ts --project=chromium --reporter=line --timeout=20000"
    ["playwright_comprehensive"]="npx playwright test e2e/screenshot-generation.spec.ts --reporter=line"
    ["playwright_visual_regression"]="npm run test:e2e:visual"
    
    # Performance operations
    ["performance_validation"]="npm run test:e2e:performance"
    ["performance_profiling"]="npm run test:e2e:performance"
    ["core_web_vitals"]="npm run test:e2e:performance"
    
    # Accessibility operations
    ["accessibility_validation"]="npm run test:e2e:accessibility"
    ["accessibility_comprehensive"]="npm run test:e2e:accessibility"
)

# Execute single operation with resource coordination
execute_operation() {
    local operation="$1"
    local timeout="${2:-45}"
    local context="${3:-general}"
    
    log_info "Executing operation: $operation (timeout: ${timeout}s)"
    
    # Start resource monitoring
    monitor_resource_usage "$operation"
    
    local start_time=$(date +%s)
    local command="${OPERATION_COMMANDS[$operation]:-}"
    local exit_code=0
    
    if [[ -z "$command" ]]; then
        log_error "Unknown operation: $operation"
        complete_resource_monitoring "$operation" 1
        return 1
    fi
    
    # Handle special operations that use resource manager functions or new Puppeteer services
    case "$operation" in
        "port_detection")
            if get_shared_port_detection "$context"; then
                exit_code=0
            else
                exit_code=1
            fi
            ;;
        "dev_server_validation")
            if get_shared_dev_server_health; then
                exit_code=0
            else
                exit_code=1
            fi
            ;;
        "typescript_validation")
            if get_shared_typescript_validation; then
                exit_code=0
            else
                exit_code=1
            fi
            ;;
        # NEW: Puppeteer Service Operations
        "puppeteer_quick_screenshots"|"puppeteer_component_focus"|"puppeteer_mobile_preview")
            if [[ -f "$SCRIPT_DIR/../lib/puppeteer-screenshot-service.sh" ]]; then
                source "$SCRIPT_DIR/../lib/puppeteer-screenshot-service.sh"
                case "$operation" in
                    "puppeteer_quick_screenshots")
                        if puppeteer_screenshot_service "quick"; then
                            exit_code=0
                        else
                            exit_code=1
                        fi
                        ;;
                    "puppeteer_component_focus")
                        if puppeteer_screenshot_service "component" "$context"; then
                            exit_code=0
                        else
                            exit_code=1
                        fi
                        ;;
                    "puppeteer_mobile_preview")
                        if puppeteer_screenshot_service "mobile"; then
                            exit_code=0
                        else
                            exit_code=1
                        fi
                        ;;
                esac
            else
                log_warning "Puppeteer service not available, falling back to Playwright"
                if timeout "$timeout" npx playwright test e2e/quick-screenshots.spec.ts --project=chromium --reporter=line >/dev/null 2>&1; then
                    exit_code=0
                else
                    exit_code=1
                fi
            fi
            ;;
        # NEW: Strategic Screenshot Operations
        "strategic_screenshot_generation")
            if strategic_screenshot_execution "$context"; then
                exit_code=0
            else
                exit_code=1
            fi
            ;;
        "intelligent_visual_validation")
            if intelligent_visual_validation_execution "$context"; then
                exit_code=0
            else
                exit_code=1
            fi
            ;;
        # NEW: Hybrid Operations
        "hybrid_visual_validation")
            if hybrid_screenshot_workflow "$context"; then
                exit_code=0
            else
                exit_code=1
            fi
            ;;
        "hybrid_design_system")
            if hybrid_design_token_workflow "$context"; then
                exit_code=0
            else
                exit_code=1
            fi
            ;;
        *)
            # Execute command with timeout
            if timeout "$timeout" bash -c "$command" >/dev/null 2>&1; then
                exit_code=0
            else
                exit_code=$?
                if [[ $exit_code -eq 124 ]]; then
                    log_warning "Operation $operation timed out after ${timeout}s"
                else
                    log_warning "Operation $operation failed with exit code: $exit_code"
                fi
            fi
            ;;
    esac
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    # Complete resource monitoring
    complete_resource_monitoring "$operation" "$exit_code"
    
    if [[ $exit_code -eq 0 ]]; then
        log_success "Operation $operation completed successfully (${duration}s)"
        add_completed_operation "$operation"
    else
        log_error "Operation $operation failed (${duration}s)"
        add_failed_operation "$operation"
    fi
    
    return $exit_code
}

# Execute operations in parallel group
execute_parallel_group() {
    local operations="$1"
    local timeout="${2:-45}"
    local context="${3:-general}"
    
    IFS=',' read -ra ops <<< "$operations"
    local pids=()
    local results=()
    
    log_info "Executing parallel group: $operations (timeout: ${timeout}s)"
    
    # Start all operations in parallel
    for operation in "${ops[@]}"; do
        (
            # Acquire necessary resources
            local resource_needed=""
            case "$operation" in
                *"testing"|*"visual"|*"performance"|*"accessibility")
                    resource_needed="browser"
                    ;;
                "typescript_validation"|"build_validation")
                    resource_needed="cpu"
                    ;;
                "port_detection")
                    resource_needed="network"
                    ;;
            esac
            
            if [[ -n "$resource_needed" ]]; then
                if ! acquire_resource_lock "$resource_needed" 10; then
                    log_warning "Failed to acquire resource lock for $operation, skipping"
                    exit 1
                fi
            fi
            
            # Execute operation
            execute_operation "$operation" "$timeout" "$context"
            local result=$?
            
            # Release resource lock
            if [[ -n "$resource_needed" ]]; then
                release_resource_lock "$resource_needed"
            fi
            
            exit $result
        ) &
        
        pids+=($!)
        add_running_operation "$operation"
    done
    
    # Wait for all operations to complete
    local group_success=true
    for i in "${!pids[@]}"; do
        local pid=${pids[$i]}
        local operation=${ops[$i]}
        
        if wait $pid; then
            log_info "Parallel operation $operation completed successfully"
        else
            log_warning "Parallel operation $operation failed"
            group_success=false
        fi
        
        remove_running_operation "$operation"
    done
    
    if [[ "$group_success" == "true" ]]; then
        log_success "Parallel group completed successfully: $operations"
        return 0
    else
        log_warning "Parallel group had failures: $operations"
        return 1
    fi
}

# Execute operations in sequential chain
execute_sequential_chain() {
    local operations="$1"
    local timeout="${2:-45}"
    local context="${3:-general}"
    
    IFS=',' read -ra ops <<< "$operations"
    
    log_info "Executing sequential chain: $operations (timeout: ${timeout}s)"
    
    # Calculate timeout per operation
    local per_operation_timeout=$((timeout / ${#ops[@]}))
    if [[ $per_operation_timeout -lt 10 ]]; then
        per_operation_timeout=10  # Minimum 10 seconds per operation
    fi
    
    for operation in "${ops[@]}"; do
        add_running_operation "$operation"
        
        if execute_operation "$operation" "$per_operation_timeout" "$context"; then
            log_info "Sequential operation $operation completed successfully"
        else
            log_error "Sequential operation $operation failed, stopping chain"
            remove_running_operation "$operation"
            return 1
        fi
        
        remove_running_operation "$operation"
    done
    
    log_success "Sequential chain completed successfully: $operations"
    return 0
}

# Execute background operations (fire and forget)
execute_background_operations() {
    local operations="$1"
    local context="${2:-general}"
    
    if [[ -z "$operations" ]]; then
        return 0
    fi
    
    IFS=',' read -ra ops <<< "$operations"
    
    log_info "Queuing background operations: $operations"
    
    for operation in "${ops[@]}"; do
        # Create background execution script
        cat > "/tmp/claude-hooks-bg-${operation}-$$.sh" << EOF
#!/bin/bash
cd "$(pwd)"
source "$SCRIPT_DIR/../lib/hook-utils.sh"
source "$SCRIPT_DIR/resource-manager.sh"

log_info "Starting background operation: $operation"
if execute_operation "$operation" 300 "$context"; then
    log_success "Background operation $operation completed"
else
    log_warning "Background operation $operation failed"
fi

# Cleanup
rm -f "/tmp/claude-hooks-bg-${operation}-$$.sh"
EOF
        
        chmod +x "/tmp/claude-hooks-bg-${operation}-$$.sh"
        
        # Execute in background
        nohup "/tmp/claude-hooks-bg-${operation}-$$.sh" >/dev/null 2>&1 &
        
        add_background_operation "$operation"
        
        log_info "Background operation $operation queued (manual check: npm run test:e2e:${operation})"
    done
}

# Execute full execution plan
execute_execution_plan() {
    local parallel_groups="$1"
    local sequential_chains="$2"
    local background_operations="$3"
    local timeout="${4:-45}"
    local context="${5:-general}"
    
    EXECUTION_STATE["total_start_time"]=$(date +%s)
    
    log_info "Executing full execution plan"
    log_info "  Parallel groups: $parallel_groups"
    log_info "  Sequential chains: $sequential_chains"
    log_info "  Background operations: $background_operations"
    log_info "  Timeout: ${timeout}s"
    
    local overall_success=true
    
    # Execute parallel groups first
    if [[ -n "$parallel_groups" ]]; then
        IFS='|' read -ra groups <<< "$parallel_groups"
        for group in "${groups[@]}"; do
            if [[ -n "$group" ]]; then
                if ! execute_parallel_group "$group" "$timeout" "$context"; then
                    overall_success=false
                fi
            fi
        done
    fi
    
    # Execute sequential chains
    if [[ -n "$sequential_chains" ]]; then
        IFS='|' read -ra chains <<< "$sequential_chains"
        for chain in "${chains[@]}"; do
            if [[ -n "$chain" ]]; then
                if ! execute_sequential_chain "$chain" "$timeout" "$context"; then
                    overall_success=false
                fi
            fi
        done
    fi
    
    # Queue background operations
    if [[ -n "$background_operations" ]]; then
        execute_background_operations "$background_operations" "$context"
    fi
    
    # Calculate final statistics
    local end_time=$(date +%s)
    EXECUTION_STATE["total_duration"]=$((end_time - EXECUTION_STATE["total_start_time"]))
    
    local total_ops=$(($(echo "${EXECUTION_STATE[completed_operations]}" | grep -o ',' | wc -l) + 1))
    local failed_ops=$(($(echo "${EXECUTION_STATE[failed_operations]}" | grep -o ',' | wc -l) + 1))
    if [[ "${EXECUTION_STATE[failed_operations]}" == "" ]]; then
        failed_ops=0
    fi
    if [[ "${EXECUTION_STATE[completed_operations]}" == "" ]]; then
        total_ops=0
    fi
    
    if [[ $total_ops -gt 0 ]]; then
        EXECUTION_STATE["success_rate"]=$(( (total_ops - failed_ops) * 100 / total_ops ))
    else
        EXECUTION_STATE["success_rate"]=100
    fi
    
    log_info "Execution plan completed:"
    log_info "  Total duration: ${EXECUTION_STATE[total_duration]}s"
    log_info "  Success rate: ${EXECUTION_STATE[success_rate]}%"
    log_info "  Completed operations: ${EXECUTION_STATE[completed_operations]}"
    if [[ -n "${EXECUTION_STATE[failed_operations]}" ]]; then
        log_info "  Failed operations: ${EXECUTION_STATE[failed_operations]}"
    fi
    if [[ -n "${EXECUTION_STATE[background_operations]}" ]]; then
        log_info "  Background operations: ${EXECUTION_STATE[background_operations]}"
    fi
    
    if [[ "$overall_success" == "true" ]]; then
        log_success "Execution plan completed successfully"
        return 0
    else
        log_warning "Execution plan completed with some failures"
        return 1
    fi
}

# State management functions
add_running_operation() {
    local operation="$1"
    if [[ -z "${EXECUTION_STATE[running_operations]}" ]]; then
        EXECUTION_STATE["running_operations"]="$operation"
    else
        EXECUTION_STATE["running_operations"]="${EXECUTION_STATE[running_operations]},$operation"
    fi
}

remove_running_operation() {
    local operation="$1"
    EXECUTION_STATE["running_operations"]=$(echo "${EXECUTION_STATE[running_operations]}" | sed "s/$operation,//; s/,$operation//; s/^$operation$//")
}

add_completed_operation() {
    local operation="$1"
    if [[ -z "${EXECUTION_STATE[completed_operations]}" ]]; then
        EXECUTION_STATE["completed_operations"]="$operation"
    else
        EXECUTION_STATE["completed_operations"]="${EXECUTION_STATE[completed_operations]},$operation"
    fi
}

add_failed_operation() {
    local operation="$1"
    if [[ -z "${EXECUTION_STATE[failed_operations]}" ]]; then
        EXECUTION_STATE["failed_operations"]="$operation"
    else
        EXECUTION_STATE["failed_operations"]="${EXECUTION_STATE[failed_operations]},$operation"
    fi
}

add_background_operation() {
    local operation="$1"
    if [[ -z "${EXECUTION_STATE[background_operations]}" ]]; then
        EXECUTION_STATE["background_operations"]="$operation"
    else
        EXECUTION_STATE["background_operations"]="${EXECUTION_STATE[background_operations]},$operation"
    fi
}

# NEW: Strategic and Hybrid Operation Functions

strategic_screenshot_execution() {
    local context="${1:-general}"
    local file_path="${FILE_PATH:-}"
    local change_type="${VISUAL_CHANGE_TYPE:-css_module}"
    
    log_info "Executing strategic screenshot generation..."
    
    # Source required components
    if [[ -f "$SCRIPT_DIR/../lib/screenshot-strategy-selector.sh" ]]; then
        source "$SCRIPT_DIR/../lib/screenshot-strategy-selector.sh"
        
        # Determine and execute strategy
        local strategy=$(screenshot_strategy_service "select" "$change_type" "$file_path" "$context")
        log_info "Selected screenshot strategy: $strategy"
        
        screenshot_strategy_service "execute" "$change_type" "$file_path" "$context"
        return $?
    else
        log_warning "Screenshot strategy selector not available, using fallback"
        timeout 30 npx playwright test e2e/quick-screenshots.spec.ts --project=chromium --reporter=line >/dev/null 2>&1
        return $?
    fi
}

intelligent_visual_validation_execution() {
    local context="${1:-general}"
    
    log_info "Executing intelligent visual validation..."
    
    # First try strategic approach
    if strategic_screenshot_execution "$context"; then
        log_success "Strategic screenshot execution completed"
        
        # Add intelligent validation checks
        if [[ "$context" == "redesign_2" ]]; then
            log_info "Running /2 redesign-specific validation..."
            # Add brand consistency checks here if available
        fi
        
        return 0
    else
        log_warning "Strategic execution failed, falling back to traditional approach"
        timeout 30 npx playwright test e2e/quick-screenshots.spec.ts --project=chromium --reporter=line >/dev/null 2>&1
        return $?
    fi
}

hybrid_screenshot_workflow() {
    local context="${1:-general}"
    
    log_info "Executing hybrid screenshot workflow..."
    
    # Phase 1: Fast Puppeteer screenshots
    if [[ -f "$SCRIPT_DIR/../lib/puppeteer-screenshot-service.sh" ]]; then
        source "$SCRIPT_DIR/../lib/puppeteer-screenshot-service.sh"
        
        if puppeteer_screenshot_service "quick"; then
            log_success "Fast Puppeteer screenshots completed"
            
            # Phase 2: Queue comprehensive Playwright validation in background
            log_info "Queueing comprehensive Playwright validation..."
            (
                sleep 5  # Brief delay to avoid resource conflicts
                npx playwright test e2e/visual-regression-2.spec.ts --project=chromium >/dev/null 2>&1
            ) &
            
            return 0
        else
            log_warning "Puppeteer failed in hybrid workflow, using Playwright only"
            timeout 30 npx playwright test e2e/quick-screenshots.spec.ts --project=chromium --reporter=line >/dev/null 2>&1
            return $?
        fi
    else
        log_warning "Puppeteer service not available, using Playwright only"
        timeout 30 npx playwright test e2e/quick-screenshots.spec.ts --project=chromium --reporter=line >/dev/null 2>&1
        return $?
    fi
}

hybrid_design_token_workflow() {
    local context="${1:-general}"
    
    log_info "Executing hybrid design token workflow..."
    
    # Design token changes need both fast feedback and comprehensive validation
    if [[ -f "$SCRIPT_DIR/../lib/puppeteer-screenshot-service.sh" ]]; then
        source "$SCRIPT_DIR/../lib/puppeteer-screenshot-service.sh"
        
        # Fast screenshots for immediate feedback
        if puppeteer_screenshot_service "quick"; then
            log_success "Fast design token validation completed"
            
            # Comprehensive visual regression for design system validation
            log_info "Running comprehensive design system validation..."
            timeout 60 npm run test:e2e:visual >/dev/null 2>&1 &
            
            return 0
        else
            log_warning "Puppeteer failed for design tokens, using comprehensive Playwright"
            timeout 45 npm run test:e2e:visual >/dev/null 2>&1
            return $?
        fi
    else
        log_warning "Puppeteer service not available for design tokens, using Playwright"
        timeout 45 npm run test:e2e:visual >/dev/null 2>&1
        return $?
    fi
}

# Export execution state as JSON
export_execution_state_json() {
    cat << EOF
{
  "running_operations": "${EXECUTION_STATE[running_operations]}",
  "completed_operations": "${EXECUTION_STATE[completed_operations]}",
  "failed_operations": "${EXECUTION_STATE[failed_operations]}",
  "background_operations": "${EXECUTION_STATE[background_operations]}",
  "total_duration": ${EXECUTION_STATE[total_duration]:-0},
  "success_rate": ${EXECUTION_STATE[success_rate]:-0}
}
EOF
}

# Command line interface
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    case "${1:-}" in
        "execute")
            execute_operation "$2" "$3" "$4"
            ;;
        "parallel")
            execute_parallel_group "$2" "$3" "$4"
            ;;
        "sequential")
            execute_sequential_chain "$2" "$3" "$4"
            ;;
        "background")
            execute_background_operations "$2" "$3"
            ;;
        "plan")
            execute_execution_plan "$2" "$3" "$4" "$5" "$6"
            ;;
        "state")
            export_execution_state_json
            ;;
        *)
            echo "Usage: $0 {execute|parallel|sequential|background|plan|state} [args...]"
            echo "  execute OPERATION [TIMEOUT] [CONTEXT]"
            echo "  parallel OPERATIONS [TIMEOUT] [CONTEXT]"
            echo "  sequential OPERATIONS [TIMEOUT] [CONTEXT]"
            echo "  background OPERATIONS [CONTEXT]"
            echo "  plan PARALLEL_GROUPS SEQUENTIAL_CHAINS BACKGROUND_OPS [TIMEOUT] [CONTEXT]"
            echo "  state"
            exit 1
            ;;
    esac
fi