#!/bin/bash

# Claude Hooks Orchestration System - Context Analyzer
# Intelligent analysis of change context to determine required operations
# Replaces chaotic parallel hook execution with smart decision making

set -e

# Source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../lib/hook-utils.sh"

# Analysis result structure
declare -A ANALYSIS_RESULT=(
    ["context"]=""
    ["file_type"]=""
    ["component_scope"]=""
    ["visual_impact"]=""
    ["performance_impact"]=""
    ["accessibility_impact"]=""
    ["required_operations"]=""
    ["execution_strategy"]=""
    ["estimated_time"]=""
    ["priority"]=""
)

# Analyze file type and extension
analyze_file_type() {
    local file_path="$1"
    
    if [[ -z "$file_path" ]]; then
        echo "unknown"
        return
    fi
    
    local extension="${file_path##*.}"
    local basename="$(basename "$file_path")"
    
    case "$extension" in
        "tsx"|"ts")
            echo "typescript"
            ;;
        "css")
            if [[ "$basename" == *".module.css" ]]; then
                echo "css_module"
            elif [[ "$basename" == "brand-tokens.css" ]]; then
                echo "design_system"
            else
                echo "css"
            fi
            ;;
        "js"|"jsx")
            echo "javascript"
            ;;
        "json")
            if [[ "$basename" == "package.json" || "$basename" == "tsconfig.json" ]]; then
                echo "config_critical"
            else
                echo "config"
            fi
            ;;
        "md"|"txt")
            echo "documentation"
            ;;
        "png"|"jpg"|"jpeg"|"svg"|"webp")
            echo "image_asset"
            ;;
        *)
            echo "unknown"
            ;;
    esac
}

# Determine development context
analyze_development_context() {
    local file_path="$1"
    local tool_name="$2"
    
    # /2 redesign context
    if [[ "$file_path" =~ app/2/ ]]; then
        echo "redesign_2"
        return
    fi
    
    # Main portfolio context
    if [[ "$file_path" =~ src/app/ ]]; then
        echo "main_portfolio"
        return
    fi
    
    # Testing context
    if [[ "$file_path" =~ (test|spec|e2e) || "$tool_name" =~ test ]]; then
        echo "testing"
        return
    fi
    
    # Configuration context
    if [[ "$file_path" =~ (config|\.json|\.yml|\.toml)$ ]]; then
        echo "configuration"
        return
    fi
    
    # Documentation context
    if [[ "$file_path" =~ \.(md|txt)$ ]]; then
        echo "documentation"
        return
    fi
    
    # Dev server context
    if [[ "$tool_name" == "Bash" && "$tool_name" =~ dev ]]; then
        echo "dev_server"
        return
    fi
    
    echo "general"
}

# Analyze component scope
analyze_component_scope() {
    local file_path="$1"
    local file_type="$2"
    
    if [[ -z "$file_path" ]]; then
        echo "unknown"
        return
    fi
    
    # Layout components (highest impact)
    if [[ "$file_path" =~ (layout|page)\.tsx$ ]]; then
        echo "layout"
        return
    fi
    
    # Navigation components (specialized testing)
    if [[ "$file_path" =~ components/Navigation ]]; then
        echo "navigation"
        return
    fi
    
    # UI components
    if [[ "$file_path" =~ components/ && "$file_type" =~ (typescript|css_module) ]]; then
        echo "ui_component"
        return
    fi
    
    # Design system changes
    if [[ "$file_type" == "design_system" ]]; then
        echo "design_system"
        return
    fi
    
    # Hooks and utilities
    if [[ "$file_path" =~ (hooks|lib|utils)/ ]]; then
        echo "utility"
        return
    fi
    
    # Configuration
    if [[ "$file_type" =~ config ]]; then
        echo "configuration"
        return
    fi
    
    echo "general"
}

# Assess visual impact
assess_visual_impact() {
    local file_path="$1"
    local file_type="$2"
    local component_scope="$3"
    
    case "$file_type" in
        "design_system")
            echo "very_high"
            ;;
        "css_module"|"css")
            echo "high"
            ;;
        "typescript")
            if [[ "$component_scope" =~ (layout|navigation|ui_component) ]]; then
                echo "medium"
            else
                echo "low"
            fi
            ;;
        "image_asset")
            echo "medium"
            ;;
        *)
            echo "none"
            ;;
    esac
}

# Assess performance impact
assess_performance_impact() {
    local file_path="$1"
    local file_type="$2"
    local component_scope="$3"
    
    case "$component_scope" in
        "layout")
            echo "high"
            ;;
        "design_system")
            echo "high"
            ;;
        "ui_component")
            if [[ "$file_path" =~ (animation|transition|scroll) ]]; then
                echo "medium"
            else
                echo "low"
            fi
            ;;
        "image_asset")
            echo "medium"
            ;;
        "configuration")
            if [[ "$file_path" =~ (package\.json|next\.config) ]]; then
                echo "high"
            else
                echo "low"
            fi
            ;;
        *)
            echo "low"
            ;;
    esac
}

# Assess accessibility impact
assess_accessibility_impact() {
    local file_path="$1"
    local file_type="$2"
    local component_scope="$3"
    
    case "$component_scope" in
        "navigation")
            echo "high"
            ;;
        "layout")
            echo "medium"
            ;;
        "ui_component")
            if [[ "$file_path" =~ (form|button|input|modal) ]]; then
                echo "high"
            else
                echo "medium"
            fi
            ;;
        "design_system")
            echo "medium"  # Color contrast, typography
            ;;
        *)
            echo "low"
            ;;
    esac
}

# Determine required operations based on analysis
determine_required_operations() {
    local context="$1"
    local file_type="$2"
    local component_scope="$3"
    local visual_impact="$4"
    local performance_impact="$5"
    local accessibility_impact="$6"
    
    local operations=()
    
    # Always include TypeScript validation for code changes
    if [[ "$file_type" =~ (typescript|javascript) ]]; then
        operations+=("typescript_validation")
    fi
    
    # Build validation for CSS and config changes
    if [[ "$file_type" =~ (css|design_system|config) ]]; then
        operations+=("build_validation")
    fi
    
    # Testing based on component scope
    case "$component_scope" in
        "layout")
            operations+=("comprehensive_testing")
            ;;
        "navigation")
            operations+=("navigation_testing")
            ;;
        "ui_component")
            operations+=("component_testing")
            ;;
        "utility")
            operations+=("smoke_testing")
            ;;
        *)
            if [[ "$file_type" =~ (typescript|javascript) ]]; then
                operations+=("smoke_testing")
            fi
            ;;
    esac
    
    # Visual operations based on impact
    case "$visual_impact" in
        "very_high"|"high")
            operations+=("visual_regression" "screenshot_generation")
            ;;
        "medium")
            operations+=("visual_validation")
            ;;
    esac
    
    # Performance operations based on impact
    case "$performance_impact" in
        "high")
            operations+=("performance_profiling" "core_web_vitals")
            ;;
        "medium")
            operations+=("performance_validation")
            ;;
    esac
    
    # Accessibility operations based on impact
    case "$accessibility_impact" in
        "high")
            operations+=("accessibility_comprehensive")
            ;;
        "medium")
            operations+=("accessibility_validation")
            ;;
    esac
    
    # Port detection for operations that need dev server
    if [[ "${operations[*]}" =~ (testing|visual|performance) ]]; then
        operations=("port_detection" "${operations[@]}")
    fi
    
    # Join operations with commas
    IFS=','
    echo "${operations[*]}"
    IFS=' '
}

# Determine execution strategy
determine_execution_strategy() {
    local operations="$1"
    local context="$2"
    local estimated_time="$3"
    
    # Fast mode for rapid iteration
    if [[ "${FAST_MODE:-}" == "true" || "$context" == "testing" ]]; then
        echo "parallel_fast"
        return
    fi
    
    # Sequential for complex operations
    if [[ "$operations" =~ (comprehensive_testing|visual_regression|performance_profiling) ]]; then
        echo "sequential_safe"
        return
    fi
    
    # Parallel for independent operations
    if [[ "$estimated_time" -lt 45 ]]; then
        echo "parallel_safe"
    else
        echo "sequential_with_background"
    fi
}

# Estimate execution time
estimate_execution_time() {
    local operations="$1"
    local context="$2"
    
    local time_estimates=(
        ["port_detection"]=2
        ["typescript_validation"]=30
        ["build_validation"]=15
        ["smoke_testing"]=60
        ["component_testing"]=120
        ["navigation_testing"]=180
        ["comprehensive_testing"]=480
        ["visual_validation"]=60
        ["visual_regression"]=240
        ["screenshot_generation"]=120
        ["performance_validation"]=120
        ["performance_profiling"]=300
        ["core_web_vitals"]=180
        ["accessibility_validation"]=90
        ["accessibility_comprehensive"]=180
    )
    
    local total_time=0
    local max_parallel_time=0
    
    IFS=',' read -ra ops <<< "$operations"
    
    for op in "${ops[@]}"; do
        local op_time=${time_estimates[$op]:-30}
        total_time=$((total_time + op_time))
        if [[ $op_time -gt $max_parallel_time ]]; then
            max_parallel_time=$op_time
        fi
    done
    
    # For parallel execution, use max time; for sequential, use total
    case "$context" in
        "redesign_2")
            # /2 optimized timing
            echo $((max_parallel_time * 3 / 4))
            ;;
        "testing")
            # Fast mode timing
            echo $((max_parallel_time / 2))
            ;;
        *)
            # Standard timing - assume some parallelization
            echo $(((total_time + max_parallel_time) / 2))
            ;;
    esac
}

# Determine priority
determine_priority() {
    local component_scope="$1"
    local visual_impact="$2"
    local performance_impact="$3"
    
    # Critical priority
    if [[ "$component_scope" == "layout" || "$performance_impact" == "high" ]]; then
        echo "critical"
        return
    fi
    
    # High priority
    if [[ "$component_scope" =~ (navigation|design_system) || "$visual_impact" =~ (very_high|high) ]]; then
        echo "high"
        return
    fi
    
    # Medium priority
    if [[ "$component_scope" == "ui_component" || "$visual_impact" == "medium" ]]; then
        echo "medium"
        return
    fi
    
    # Low priority
    echo "low"
}

# Main analysis function
analyze_change_context() {
    local tool_name="$1"
    local tool_args="$2"
    local file_path="$3"
    
    log_info "Analyzing change context..."
    log_info "Tool: $tool_name, Args: $tool_args, File: $file_path"
    
    # Perform analysis
    ANALYSIS_RESULT["file_type"]=$(analyze_file_type "$file_path")
    ANALYSIS_RESULT["context"]=$(analyze_development_context "$file_path" "$tool_name")
    ANALYSIS_RESULT["component_scope"]=$(analyze_component_scope "$file_path" "${ANALYSIS_RESULT[file_type]}")
    ANALYSIS_RESULT["visual_impact"]=$(assess_visual_impact "$file_path" "${ANALYSIS_RESULT[file_type]}" "${ANALYSIS_RESULT[component_scope]}")
    ANALYSIS_RESULT["performance_impact"]=$(assess_performance_impact "$file_path" "${ANALYSIS_RESULT[file_type]}" "${ANALYSIS_RESULT[component_scope]}")
    ANALYSIS_RESULT["accessibility_impact"]=$(assess_accessibility_impact "$file_path" "${ANALYSIS_RESULT[file_type]}" "${ANALYSIS_RESULT[component_scope]}")
    
    ANALYSIS_RESULT["required_operations"]=$(determine_required_operations \
        "${ANALYSIS_RESULT[context]}" \
        "${ANALYSIS_RESULT[file_type]}" \
        "${ANALYSIS_RESULT[component_scope]}" \
        "${ANALYSIS_RESULT[visual_impact]}" \
        "${ANALYSIS_RESULT[performance_impact]}" \
        "${ANALYSIS_RESULT[accessibility_impact]}")
    
    ANALYSIS_RESULT["estimated_time"]=$(estimate_execution_time "${ANALYSIS_RESULT[required_operations]}" "${ANALYSIS_RESULT[context]}")
    ANALYSIS_RESULT["execution_strategy"]=$(determine_execution_strategy "${ANALYSIS_RESULT[required_operations]}" "${ANALYSIS_RESULT[context]}" "${ANALYSIS_RESULT[estimated_time]}")
    ANALYSIS_RESULT["priority"]=$(determine_priority "${ANALYSIS_RESULT[component_scope]}" "${ANALYSIS_RESULT[visual_impact]}" "${ANALYSIS_RESULT[performance_impact]}")
    
    log_info "Analysis complete:"
    log_info "  Context: ${ANALYSIS_RESULT[context]}"
    log_info "  Component Scope: ${ANALYSIS_RESULT[component_scope]}"
    log_info "  Required Operations: ${ANALYSIS_RESULT[required_operations]}"
    log_info "  Execution Strategy: ${ANALYSIS_RESULT[execution_strategy]}"
    log_info "  Estimated Time: ${ANALYSIS_RESULT[estimated_time]}s"
    log_info "  Priority: ${ANALYSIS_RESULT[priority]}"
}

# Export analysis result as JSON
export_analysis_json() {
    cat << EOF
{
  "context": "${ANALYSIS_RESULT[context]}",
  "file_type": "${ANALYSIS_RESULT[file_type]}",
  "component_scope": "${ANALYSIS_RESULT[component_scope]}",
  "visual_impact": "${ANALYSIS_RESULT[visual_impact]}",
  "performance_impact": "${ANALYSIS_RESULT[performance_impact]}",
  "accessibility_impact": "${ANALYSIS_RESULT[accessibility_impact]}",
  "required_operations": "${ANALYSIS_RESULT[required_operations]}",
  "execution_strategy": "${ANALYSIS_RESULT[execution_strategy]}",
  "estimated_time": ${ANALYSIS_RESULT[estimated_time]},
  "priority": "${ANALYSIS_RESULT[priority]}"
}
EOF
}

# Get specific analysis result
get_analysis_result() {
    local key="$1"
    echo "${ANALYSIS_RESULT[$key]}"
}

# Command line interface
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    case "${1:-}" in
        "analyze")
            analyze_change_context "$2" "$3" "$4"
            ;;
        "json")
            export_analysis_json
            ;;
        "get")
            get_analysis_result "$2"
            ;;
        *)
            echo "Usage: $0 {analyze|json|get} [args...]"
            echo "  analyze TOOL_NAME TOOL_ARGS FILE_PATH"
            echo "  json"
            echo "  get KEY"
            exit 1
            ;;
    esac
fi