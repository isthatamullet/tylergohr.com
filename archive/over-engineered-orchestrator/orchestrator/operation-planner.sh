#!/bin/bash

# Claude Hooks Orchestration System - Operation Planner
# Creates optimal execution plans based on context analysis
# Handles parallel/sequential execution strategies and timeout management

set -e

# Source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../lib/hook-utils.sh"

# Load test strategies configuration
TEST_STRATEGIES_CONFIG="$SCRIPT_DIR/../config/test-strategies.json"

# Execution plan structure
declare -A EXECUTION_PLAN=(
    ["parallel_groups"]=""
    ["sequential_chains"]=""
    ["background_operations"]=""
    ["total_estimated_time"]=""
    ["timeout_compliant"]=""
    ["resource_requirements"]=""
)

# Operation definitions with resource requirements
declare -A OPERATION_DEFINITIONS=(
    # Infrastructure operations
    ["port_detection"]="command:get_active_port,resources:network,time:2,conflicts:none"
    ["dev_server_validation"]="command:is_dev_server_running,resources:network,time:5,conflicts:none"
    
    # Validation operations
    ["typescript_validation"]="command:npm run typecheck,resources:cpu+memory,time:30,conflicts:none"
    ["build_validation"]="command:npm run build,resources:cpu+memory+disk,time:45,conflicts:disk"
    
    # Testing operations
    ["smoke_testing"]="command:npm run test:e2e:smoke,resources:browser+network,time:60,conflicts:browser"
    ["component_testing"]="command:npm run test:e2e:dev,resources:browser+network,time:120,conflicts:browser"
    ["navigation_testing"]="command:npm run test:e2e:navigation,resources:browser+network,time:180,conflicts:browser"
    ["comprehensive_testing"]="command:npm run test:e2e:portfolio,resources:browser+network+cpu,time:480,conflicts:browser"
    
    # Visual operations
    ["visual_validation"]="command:npx playwright test e2e/quick-screenshots.spec.ts --project=chromium,resources:browser+disk,time:60,conflicts:browser+disk"
    ["visual_regression"]="command:npm run test:e2e:visual,resources:browser+disk+memory,time:240,conflicts:browser+disk"
    ["screenshot_generation"]="command:npx playwright test e2e/quick-screenshots.spec.ts --project=chromium,resources:browser+disk,time:120,conflicts:browser+disk"
    
    # Performance operations
    ["performance_validation"]="command:npm run test:e2e:performance,resources:browser+cpu+memory,time:120,conflicts:browser"
    ["performance_profiling"]="command:npm run test:e2e:performance,resources:browser+cpu+memory+network,time:300,conflicts:browser"
    ["core_web_vitals"]="command:npm run test:e2e:performance,resources:browser+network,time:180,conflicts:browser"
    
    # Accessibility operations
    ["accessibility_validation"]="command:npm run test:e2e:accessibility,resources:browser,time:90,conflicts:browser"
    ["accessibility_comprehensive"]="command:npm run test:e2e:accessibility,resources:browser+memory,time:180,conflicts:browser"
)

# Parse operation definition
parse_operation() {
    local operation="$1"
    local definition="${OPERATION_DEFINITIONS[$operation]:-}"
    
    if [[ -z "$definition" ]]; then
        log_warning "Unknown operation: $operation"
        return 1
    fi
    
    echo "$definition"
}

# Get operation time estimate
get_operation_time() {
    local operation="$1"
    local definition=$(parse_operation "$operation")
    
    if [[ -n "$definition" ]]; then
        echo "$definition" | grep -o "time:[0-9]*" | cut -d: -f2
    else
        echo "30"  # Default
    fi
}

# Get operation resources
get_operation_resources() {
    local operation="$1"
    local definition=$(parse_operation "$operation")
    
    if [[ -n "$definition" ]]; then
        echo "$definition" | grep -o "resources:[^,]*" | cut -d: -f2
    else
        echo "cpu"  # Default
    fi
}

# Get operation conflicts
get_operation_conflicts() {
    local operation="$1"
    local definition=$(parse_operation "$operation")
    
    if [[ -n "$definition" ]]; then
        echo "$definition" | grep -o "conflicts:[^,]*" | cut -d: -f2
    else
        echo "none"  # Default
    fi
}

# Check if operations can run in parallel
can_run_parallel() {
    local op1="$1"
    local op2="$2"
    
    local conflicts1=$(get_operation_conflicts "$op1")
    local conflicts2=$(get_operation_conflicts "$op2")
    
    # If either has no conflicts, they can run parallel
    if [[ "$conflicts1" == "none" || "$conflicts2" == "none" ]]; then
        return 0
    fi
    
    # Check for resource conflicts
    local resources1=$(get_operation_resources "$op1")
    local resources2=$(get_operation_resources "$op2")
    
    # Browser conflicts are exclusive
    if [[ "$resources1" =~ browser && "$resources2" =~ browser ]]; then
        return 1
    fi
    
    # Disk conflicts during intensive operations
    if [[ "$conflicts1" =~ disk && "$conflicts2" =~ disk ]]; then
        return 1
    fi
    
    return 0
}

# Create parallel groups for safe concurrent execution
create_parallel_groups() {
    local operations="$1"
    local strategy="$2"
    
    IFS=',' read -ra ops <<< "$operations"
    local parallel_groups=()
    local current_group=()
    
    # Creating parallel groups for strategy: $strategy
    
    case "$strategy" in
        "parallel_fast")
            # Fast mode: minimal operations in single group
            local fast_ops=()
            for op in "${ops[@]}"; do
                if [[ "$op" =~ (smoke|typescript|port) ]]; then
                    fast_ops+=("$op")
                fi
            done
            if [[ ${#fast_ops[@]} -gt 0 ]]; then
                IFS=',' 
                parallel_groups+=("${fast_ops[*]}")
                IFS=' '
            fi
            ;;
        
        "parallel_safe")
            # Group operations that can safely run together
            local infrastructure_group=()
            local validation_group=()
            local testing_group=()
            
            for op in "${ops[@]}"; do
                case "$op" in
                    "port_detection"|"dev_server_validation")
                        infrastructure_group+=("$op")
                        ;;
                    "typescript_validation"|"build_validation")
                        validation_group+=("$op")
                        ;;
                    "smoke_testing"|"component_testing")
                        testing_group+=("$op")
                        ;;
                    *)
                        # Add to validation group by default
                        validation_group+=("$op")
                        ;;
                esac
            done
            
            # Create groups only if they have operations
            if [[ ${#infrastructure_group[@]} -gt 0 ]]; then
                IFS=','
                parallel_groups+=("${infrastructure_group[*]}")
                IFS=' '
            fi
            if [[ ${#validation_group[@]} -gt 0 ]]; then
                IFS=','
                parallel_groups+=("${validation_group[*]}")
                IFS=' '
            fi
            if [[ ${#testing_group[@]} -gt 0 ]]; then
                IFS=','
                parallel_groups+=("${testing_group[*]}")
                IFS=' '
            fi
            ;;
            
        *)
            # Default: no parallel groups, use sequential
            ;;
    esac
    
    IFS='|'
    echo "${parallel_groups[*]}"
    IFS=' '
}

# Create sequential chains for dependent operations
create_sequential_chains() {
    local operations="$1"
    local strategy="$2"
    
    IFS=',' read -ra ops <<< "$operations"
    local sequential_chains=()
    
    # Creating sequential chains for strategy: $strategy
    
    case "$strategy" in
        "sequential_safe"|"sequential_with_background")
            # Infrastructure → Validation → Testing → Visual/Performance
            local infrastructure_chain=()
            local validation_chain=()
            local testing_chain=()
            local visual_chain=()
            local performance_chain=()
            
            for op in "${ops[@]}"; do
                case "$op" in
                    "port_detection"|"dev_server_validation")
                        infrastructure_chain+=("$op")
                        ;;
                    "typescript_validation"|"build_validation")
                        validation_chain+=("$op")
                        ;;
                    "smoke_testing"|"component_testing"|"navigation_testing"|"comprehensive_testing")
                        testing_chain+=("$op")
                        ;;
                    "visual_validation"|"visual_regression"|"screenshot_generation")
                        visual_chain+=("$op")
                        ;;
                    "performance_validation"|"performance_profiling"|"core_web_vitals")
                        performance_chain+=("$op")
                        ;;
                    "accessibility_validation"|"accessibility_comprehensive")
                        testing_chain+=("$op")  # Group with testing
                        ;;
                esac
            done
            
            # Build sequential chains
            if [[ ${#infrastructure_chain[@]} -gt 0 ]]; then
                IFS=','
                sequential_chains+=("${infrastructure_chain[*]}")
                IFS=' '
            fi
            if [[ ${#validation_chain[@]} -gt 0 ]]; then
                IFS=','
                sequential_chains+=("${validation_chain[*]}")
                IFS=' '
            fi
            if [[ ${#testing_chain[@]} -gt 0 ]]; then
                IFS=','
                sequential_chains+=("${testing_chain[*]}")
                IFS=' '
            fi
            if [[ ${#visual_chain[@]} -gt 0 ]]; then
                IFS=','
                sequential_chains+=("${visual_chain[*]}")
                IFS=' '
            fi
            if [[ ${#performance_chain[@]} -gt 0 ]]; then
                IFS=','
                sequential_chains+=("${performance_chain[*]}")
                IFS=' '
            fi
            ;;
            
        *)
            # Single chain for all operations
            sequential_chains+=("$operations")
            ;;
    esac
    
    IFS='|'
    echo "${sequential_chains[*]}"
    IFS=' '
}

# Identify background operations (exceed timeout)
identify_background_operations() {
    local operations="$1"
    local timeout_limit="$2"
    
    IFS=',' read -ra ops <<< "$operations"
    local background_ops=()
    
    for op in "${ops[@]}"; do
        local op_time=$(get_operation_time "$op")
        if [[ $op_time -gt $timeout_limit ]]; then
            background_ops+=("$op")
            # Operation $op (${op_time}s) moved to background queue
        fi
    done
    
    IFS=','
    echo "${background_ops[*]}"
    IFS=' '
}

# Calculate total execution time
calculate_execution_time() {
    local parallel_groups="$1"
    local sequential_chains="$2"
    local strategy="$3"
    
    local total_time=0
    
    # Calculate parallel group times (max time in each group)
    if [[ -n "$parallel_groups" ]]; then
        IFS='|' read -ra groups <<< "$parallel_groups"
        for group in "${groups[@]}"; do
            local max_group_time=0
            IFS=',' read -ra group_ops <<< "$group"
            for op in "${group_ops[@]}"; do
                local op_time=$(get_operation_time "$op")
                if [[ $op_time -gt $max_group_time ]]; then
                    max_group_time=$op_time
                fi
            done
            total_time=$((total_time + max_group_time))
        done
    fi
    
    # Calculate sequential chain times (sum of operations in each chain)
    if [[ -n "$sequential_chains" ]]; then
        IFS='|' read -ra chains <<< "$sequential_chains"
        for chain in "${chains[@]}"; do
            local chain_time=0
            IFS=',' read -ra chain_ops <<< "$chain"
            for op in "${chain_ops[@]}"; do
                local op_time=$(get_operation_time "$op")
                chain_time=$((chain_time + op_time))
            done
            total_time=$((total_time + chain_time))
        done
    fi
    
    echo "$total_time"
}

# Check timeout compliance
check_timeout_compliance() {
    local total_time="$1"
    local timeout_limit="${2:-45}"  # Default 45s for safety margin
    
    if [[ $total_time -le $timeout_limit ]]; then
        echo "true"
    else
        echo "false"
    fi
}

# Generate resource requirements
generate_resource_requirements() {
    local operations="$1"
    
    IFS=',' read -ra ops <<< "$operations"
    local required_resources=()
    
    for op in "${ops[@]}"; do
        local resources=$(get_operation_resources "$op")
        IFS='+' read -ra res_list <<< "$resources"
        for res in "${res_list[@]}"; do
            if [[ ! " ${required_resources[*]} " =~ " $res " ]]; then
                required_resources+=("$res")
            fi
        done
    done
    
    IFS=','
    echo "${required_resources[*]}"
    IFS=' '
}

# Main planning function
create_execution_plan() {
    local operations="$1"
    local strategy="$2"
    local timeout_limit="${3:-45}"
    
    log_info "Creating execution plan for operations: $operations"
    log_info "Strategy: $strategy, Timeout limit: ${timeout_limit}s"
    
    # Identify background operations first
    local background_ops=$(identify_background_operations "$operations" "$timeout_limit")
    
    # Remove background operations from main execution
    local main_operations="$operations"
    if [[ -n "$background_ops" ]]; then
        # Filter out background operations
        IFS=',' read -ra all_ops <<< "$operations"
        IFS=',' read -ra bg_ops <<< "$background_ops"
        local main_ops=()
        
        for op in "${all_ops[@]}"; do
            local is_background=false
            for bg_op in "${bg_ops[@]}"; do
                if [[ "$op" == "$bg_op" ]]; then
                    is_background=true
                    break
                fi
            done
            if [[ "$is_background" == "false" ]]; then
                main_ops+=("$op")
            fi
        done
        
        IFS=','
        main_operations="${main_ops[*]}"
        IFS=' '
    fi
    
    # Create execution groups based on strategy
    local parallel_groups=""
    local sequential_chains=""
    
    case "$strategy" in
        "parallel_fast"|"parallel_safe")
            parallel_groups=$(create_parallel_groups "$main_operations" "$strategy")
            ;;
        "sequential_safe"|"sequential_with_background")
            sequential_chains=$(create_sequential_chains "$main_operations" "$strategy")
            ;;
        *)
            log_warning "Unknown strategy: $strategy, using sequential"
            sequential_chains="$main_operations"
            ;;
    esac
    
    # Calculate execution time
    local total_time=$(calculate_execution_time "$parallel_groups" "$sequential_chains" "$strategy")
    local timeout_compliant=$(check_timeout_compliance "$total_time" "$timeout_limit")
    local resource_requirements=$(generate_resource_requirements "$main_operations")
    
    # Store execution plan
    EXECUTION_PLAN["parallel_groups"]="$parallel_groups"
    EXECUTION_PLAN["sequential_chains"]="$sequential_chains"
    EXECUTION_PLAN["background_operations"]="$background_ops"
    EXECUTION_PLAN["total_estimated_time"]="$total_time"
    EXECUTION_PLAN["timeout_compliant"]="$timeout_compliant"
    EXECUTION_PLAN["resource_requirements"]="$resource_requirements"
    
    log_info "Execution plan created:"
    log_info "  Parallel groups: $parallel_groups"
    log_info "  Sequential chains: $sequential_chains"
    log_info "  Background operations: $background_ops"
    log_info "  Total estimated time: ${total_time}s"
    log_info "  Timeout compliant: $timeout_compliant"
    log_info "  Resource requirements: $resource_requirements"
}

# Export execution plan as JSON
export_execution_plan_json() {
    cat << EOF
{
  "parallel_groups": "${EXECUTION_PLAN[parallel_groups]}",
  "sequential_chains": "${EXECUTION_PLAN[sequential_chains]}",
  "background_operations": "${EXECUTION_PLAN[background_operations]}",
  "total_estimated_time": ${EXECUTION_PLAN[total_estimated_time]},
  "timeout_compliant": ${EXECUTION_PLAN[timeout_compliant]},
  "resource_requirements": "${EXECUTION_PLAN[resource_requirements]}"
}
EOF
}

# Get specific execution plan element
get_execution_plan_element() {
    local key="$1"
    echo "${EXECUTION_PLAN[$key]}"
}

# Command line interface
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    case "${1:-}" in
        "plan")
            create_execution_plan "$2" "$3" "$4"
            ;;
        "json")
            export_execution_plan_json
            ;;
        "get")
            get_execution_plan_element "$2"
            ;;
        *)
            echo "Usage: $0 {plan|json|get} [args...]"
            echo "  plan OPERATIONS STRATEGY [TIMEOUT_LIMIT]"
            echo "  json"
            echo "  get KEY"
            exit 1
            ;;
    esac
fi