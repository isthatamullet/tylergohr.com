#!/bin/bash

# Timeout Manager - Enhanced Timeout-Aware Operation Management
# Part of Claude Hooks Orchestration System v2.0.0

# Get operation timeout based on hook event and operation type
get_operation_timeout() {
    local hook_event="$1"
    local operation="${2:-default}"
    
    case "$hook_event" in
        "PreToolUse")
            echo "10"  # 10 seconds - quick validation
            ;;
        "PostToolUse")
            echo "45"  # 45 seconds - comprehensive
            ;;
        "Notification")
            echo "5"   # 5 seconds - minimal
            ;;
        "Stop")
            echo "15"  # 15 seconds - immediate cleanup
            ;;
        "SubagentStop")
            echo "120" # 120 seconds - full analysis
            ;;
        *)
            echo "30"  # Default fallback
            ;;
    esac
}

# Execute operation with timeout awareness
execute_with_timeout_awareness() {
    local hook_event="$1"
    local operation="$2"
    local max_timeout=$(get_operation_timeout "$hook_event" "$operation")
    
    log_info "Executing $operation with timeout awareness (max: ${max_timeout}s)"
    
    # Adaptive operation selection based on available time
    if [[ $max_timeout -lt 15 ]]; then
        # Quick operations only
        execute_essential_operations "$operation" "$max_timeout"
    elif [[ $max_timeout -lt 60 ]]; then
        # Standard operations
        execute_standard_operations "$operation" "$max_timeout"
    else
        # Extended operations possible
        execute_comprehensive_operations "$operation" "$max_timeout"
    fi
}

# Execute essential operations (for timeouts < 15s)
execute_essential_operations() {
    local operation="$1"
    local timeout="$2"
    
    log_info "Executing essential operations for $operation (timeout: ${timeout}s)"
    
    case "$operation" in
        "file-validation")
            execute_quick_file_validation "$timeout"
            ;;
        "typescript-check")
            execute_quick_typescript_check "$timeout"
            ;;
        "lint-check")
            execute_quick_lint_check "$timeout"
            ;;
        "cleanup")
            execute_quick_cleanup "$timeout"
            ;;
        *)
            log_info "No essential operation defined for: $operation"
            return 0
            ;;
    esac
}

# Execute standard operations (for timeouts 15-60s)
execute_standard_operations() {
    local operation="$1"
    local timeout="$2"
    
    log_info "Executing standard operations for $operation (timeout: ${timeout}s)"
    
    case "$operation" in
        "file-validation")
            execute_standard_file_validation "$timeout"
            ;;
        "typescript-check")
            execute_standard_typescript_check "$timeout"
            ;;
        "lint-check")
            execute_standard_lint_check "$timeout"
            ;;
        "testing")
            execute_standard_testing "$timeout"
            ;;
        "build-check")
            execute_standard_build_check "$timeout"
            ;;
        "cleanup")
            execute_standard_cleanup "$timeout"
            ;;
        *)
            log_info "No standard operation defined for: $operation"
            return 0
            ;;
    esac
}

# Execute comprehensive operations (for timeouts > 60s)
execute_comprehensive_operations() {
    local operation="$1"
    local timeout="$2"
    
    log_info "Executing comprehensive operations for $operation (timeout: ${timeout}s)"
    
    case "$operation" in
        "file-validation")
            execute_comprehensive_file_validation "$timeout"
            ;;
        "typescript-check")
            execute_comprehensive_typescript_check "$timeout"
            ;;
        "testing")
            execute_comprehensive_testing "$timeout"
            ;;
        "performance-analysis")
            execute_comprehensive_performance_analysis "$timeout"
            ;;
        "visual-regression")
            execute_comprehensive_visual_regression "$timeout"
            ;;
        "security-scan")
            execute_comprehensive_security_scan "$timeout"
            ;;
        "cleanup")
            execute_comprehensive_cleanup "$timeout"
            ;;
        *)
            log_info "No comprehensive operation defined for: $operation"
            return 0
            ;;
    esac
}

# Essential operation implementations
execute_quick_file_validation() {
    local timeout="$1"
    
    # Basic file existence and syntax check
    if [[ -n "$FILE_PATH" ]] && [[ -f "$FILE_PATH" ]]; then
        case "$FILE_PATH" in
            *.tsx|*.ts|*.js|*.jsx)
                timeout 5 node -c "$FILE_PATH" 2>/dev/null || log_warning "File syntax issue: $FILE_PATH"
                ;;
            *.json)
                timeout 5 python3 -m json.tool "$FILE_PATH" >/dev/null 2>&1 || log_warning "JSON syntax issue: $FILE_PATH"
                ;;
            *)
                log_info "File validation skipped for: $FILE_PATH"
                ;;
        esac
    fi
}

execute_quick_typescript_check() {
    local timeout="$1"
    
    if command -v npx >/dev/null 2>&1; then
        timeout 8 npx tsc --noEmit --skipLibCheck >/dev/null 2>&1 || log_warning "TypeScript check failed (quick)"
    fi
}

execute_quick_lint_check() {
    local timeout="$1"
    
    if command -v npm >/dev/null 2>&1; then
        timeout 8 npm run lint -- --max-warnings=0 >/dev/null 2>&1 || log_warning "Lint check failed (quick)"
    fi
}

execute_quick_cleanup() {
    local timeout="$1"
    
    # Essential cleanup only
    cleanup_temp_files
    cleanup_process_state
}

# Standard operation implementations
execute_standard_file_validation() {
    local timeout="$1"
    
    # More thorough file validation
    execute_quick_file_validation "$timeout"
    
    # Check file permissions and integrity
    if [[ -n "$FILE_PATH" ]] && [[ -f "$FILE_PATH" ]]; then
        # Check file size (avoid processing huge files)
        local file_size=$(stat -c%s "$FILE_PATH" 2>/dev/null || echo "0")
        if [[ $file_size -gt 1048576 ]]; then  # 1MB
            log_warning "Large file detected: $FILE_PATH ($file_size bytes)"
        fi
    fi
}

execute_standard_typescript_check() {
    local timeout="$1"
    
    if command -v npx >/dev/null 2>&1; then
        timeout 30 npx tsc --noEmit >/dev/null 2>&1 || log_warning "TypeScript check failed (standard)"
    fi
}

execute_standard_lint_check() {
    local timeout="$1"
    
    if command -v npm >/dev/null 2>&1; then
        timeout 20 npm run lint >/dev/null 2>&1 || log_warning "Lint check failed (standard)"
    fi
}

execute_standard_testing() {
    local timeout="$1"
    
    if command -v npm >/dev/null 2>&1; then
        timeout 30 npm run test:e2e:smoke >/dev/null 2>&1 || log_warning "Standard testing failed"
    fi
}

execute_standard_build_check() {
    local timeout="$1"
    
    if command -v npm >/dev/null 2>&1; then
        timeout 35 npm run build >/dev/null 2>&1 || log_warning "Build check failed (standard)"
    fi
}

execute_standard_cleanup() {
    local timeout="$1"
    
    # Standard cleanup with some optimizations
    execute_quick_cleanup "$timeout"
    save_session_state
}

# Comprehensive operation implementations
execute_comprehensive_file_validation() {
    local timeout="$1"
    
    # Full file validation suite
    execute_standard_file_validation "$timeout"
    
    # Additional checks for comprehensive validation
    if [[ -n "$FILE_PATH" ]] && [[ -f "$FILE_PATH" ]]; then
        # Check encoding
        timeout 5 file -b --mime-encoding "$FILE_PATH" | grep -q "utf-8\|ascii" || log_warning "File encoding issue: $FILE_PATH"
        
        # Check for common issues
        timeout 5 grep -q "debugger\|console\.log\|TODO\|FIXME" "$FILE_PATH" && log_info "Development artifacts found in: $FILE_PATH"
    fi
}

execute_comprehensive_typescript_check() {
    local timeout="$1"
    
    if command -v npx >/dev/null 2>&1; then
        timeout 60 npx tsc --noEmit --strict >/dev/null 2>&1 || log_warning "TypeScript check failed (comprehensive)"
    fi
}

execute_comprehensive_testing() {
    local timeout="$1"
    
    if command -v npm >/dev/null 2>&1; then
        # Run multiple test suites
        timeout 40 npm run test:e2e:dev >/dev/null 2>&1 || log_warning "Comprehensive dev testing failed"
        timeout 30 npm run test:e2e:smoke >/dev/null 2>&1 || log_warning "Comprehensive smoke testing failed"
    fi
}

execute_comprehensive_performance_analysis() {
    local timeout="$1"
    
    # Generate comprehensive performance report
    generate_performance_report
    
    # Analyze resource usage
    analyze_resource_usage
}

execute_comprehensive_visual_regression() {
    local timeout="$1"
    
    if command -v npm >/dev/null 2>&1; then
        timeout 80 npm run test:e2e:visual >/dev/null 2>&1 || log_warning "Visual regression testing failed"
    fi
}

execute_comprehensive_security_scan() {
    local timeout="$1"
    
    if command -v npm >/dev/null 2>&1; then
        timeout 30 npm audit --audit-level=moderate >/dev/null 2>&1 || log_warning "Security scan found issues"
    fi
}

execute_comprehensive_cleanup() {
    local timeout="$1"
    
    # Full cleanup with optimizations
    execute_standard_cleanup "$timeout"
    
    # Additional comprehensive cleanup
    optimize_cache_and_state
    generate_session_metrics
}

# Helper functions
analyze_resource_usage() {
    local resource_file="/tmp/claude-hooks-resource-usage.json"
    
    cat > "$resource_file" << EOF
{
    "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "resource_usage": {
        "memory": "$(get_memory_usage)",
        "cpu": "$(get_cpu_usage)",
        "disk": "$(get_disk_usage)"
    },
    "process_info": {
        "pid": $$,
        "ppid": $PPID,
        "user": "$(whoami)"
    }
}
EOF
    
    log_info "Resource usage analysis saved: $resource_file"
}

# Timeout compliance checking
check_timeout_compliance() {
    local start_time="$1"
    local timeout_limit="$2"
    local current_time=$(date +%s%3N)
    local elapsed=$((current_time - start_time))
    local timeout_ms=$((timeout_limit * 1000))
    
    if [[ $elapsed -gt $timeout_ms ]]; then
        log_warning "Timeout exceeded: ${elapsed}ms > ${timeout_ms}ms"
        return 1
    else
        local remaining=$((timeout_ms - elapsed))
        log_info "Timeout compliance: ${elapsed}ms / ${timeout_ms}ms (${remaining}ms remaining)"
        return 0
    fi
}

# Dynamic timeout adjustment
adjust_timeout_dynamically() {
    local base_timeout="$1"
    local operation_complexity="${2:-normal}"
    local system_load="${3:-normal}"
    
    local adjusted_timeout=$base_timeout
    
    # Adjust based on operation complexity
    case "$operation_complexity" in
        "high")
            adjusted_timeout=$((base_timeout * 120 / 100))  # +20%
            ;;
        "low")
            adjusted_timeout=$((base_timeout * 80 / 100))   # -20%
            ;;
    esac
    
    # Adjust based on system load
    case "$system_load" in
        "high")
            adjusted_timeout=$((adjusted_timeout * 150 / 100))  # +50%
            ;;
        "low")
            adjusted_timeout=$((adjusted_timeout * 90 / 100))   # -10%
            ;;
    esac
    
    echo "$adjusted_timeout"
}

# Get current system load level
get_system_load_level() {
    local load_avg
    if [[ -f "/proc/loadavg" ]]; then
        load_avg=$(awk '{print $1}' /proc/loadavg)
        local load_int=$(echo "$load_avg" | cut -d. -f1)
        
        if [[ $load_int -gt 2 ]]; then
            echo "high"
        elif [[ $load_int -lt 1 ]]; then
            echo "low"
        else
            echo "normal"
        fi
    else
        echo "normal"
    fi
}

# Operation complexity assessment
assess_operation_complexity() {
    local operation="$1"
    local context="${2:-}"
    
    case "$operation" in
        "comprehensive-testing"|"visual-regression"|"performance-analysis")
            echo "high"
            ;;
        "file-validation"|"quick-check"|"cleanup")
            echo "low"
            ;;
        *)
            echo "normal"
            ;;
    esac
}