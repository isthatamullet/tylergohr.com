#!/bin/bash

# MCP Function Health Monitor
# Automated monitoring script to ensure all MCP functions remain operational
# Version 1.0.0 - Continuous Health Monitoring

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MCP_SERVER_DIR="$PROJECT_ROOT/mcp-server"
HEALTH_LOG="$PROJECT_ROOT/.mcp-health-monitor.log"
ALERT_LOG="$PROJECT_ROOT/.mcp-health-alerts.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Enhanced logging function
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case "$level" in
        "ERROR")   echo -e "${RED}[ERROR]${NC} $message" >&2 ;;
        "WARN")    echo -e "${YELLOW}[WARN]${NC} $message" ;;
        "INFO")    echo -e "${BLUE}[INFO]${NC} $message" ;;
        "SUCCESS") echo -e "${GREEN}[SUCCESS]${NC} $message" ;;
        "DEBUG")   echo -e "${PURPLE}[DEBUG]${NC} $message" ;;
        "MONITOR") echo -e "${CYAN}[MONITOR]${NC} $message" ;;
    esac
    
    # Log to file
    echo "[$timestamp] [$level] $message" >> "$HEALTH_LOG"
}

# Function to check MCP server basic health
check_mcp_server_health() {
    cd "$MCP_SERVER_DIR"
    if timeout 15s node dist/index.js health >/dev/null 2>&1; then
        log "SUCCESS" "✅ MCP Server health check passed"
        cd "$PROJECT_ROOT"
        return 0
    else
        log "ERROR" "❌ MCP Server health check failed"
        cd "$PROJECT_ROOT"
        return 1
    fi
}

# Function to check command interception system
check_command_interception() {
    local test_commands=(
        "npm:run dev:startDevServerMCP"
        "npm:run test:e2e:smoke:executeTestMCP"
        "npm:run validate:validateQualityGatesMCP"
    )
    
    local failed_count=0
    
    for test_case in "${test_commands[@]}"; do
        local command=$(echo "$test_case" | cut -d':' -f1)
        local args=$(echo "$test_case" | cut -d':' -f2)
        local expected=$(echo "$test_case" | cut -d':' -f3)
        
        local result
        if result=$("$SCRIPT_DIR/mcp-enforcement-system.sh" analyze "$command" "$args" 2>/dev/null | tail -1); then
            if [[ "$result" == "$expected" ]]; then
                log "SUCCESS" "✅ Command interception: $command $args → $expected"
            else
                log "ERROR" "❌ Command interception: $command $args → $result (expected $expected)"
                failed_count=$((failed_count + 1))
            fi
        else
            log "ERROR" "❌ Command interception: Failed to analyze $command $args"
            failed_count=$((failed_count + 1))
        fi
    done
    
    if [[ $failed_count -eq 0 ]]; then
        log "SUCCESS" "✅ Command interception system healthy"
        return 0
    else
        log "ERROR" "❌ Command interception system has $failed_count failures"
        return 1
    fi
}

# Function to check environment variables
check_environment_variables() {
    local required_vars=(
        "CLAUDE_AUTO_SUBAGENT"
        "USE_SUBAGENT"
        "MCP_ENFORCEMENT_ACTIVE"
        "TIMEOUT_PREVENTION_MODE"
    )
    
    local missing_count=0
    
    for var_name in "${required_vars[@]}"; do
        if [[ -n "${!var_name:-}" ]]; then
            log "SUCCESS" "✅ Environment variable: $var_name=${!var_name}"
        else
            log "WARN" "⚠️ Environment variable: $var_name not set"
            missing_count=$((missing_count + 1))
        fi
    done
    
    if [[ $missing_count -eq 0 ]]; then
        log "SUCCESS" "✅ All environment variables configured"
        return 0
    else
        log "WARN" "⚠️ $missing_count environment variables missing"
        return 1
    fi
}

# Function to check VS Code tasks
check_vscode_tasks() {
    local tasks_file="$PROJECT_ROOT/.vscode/tasks.json"
    
    if [[ -f "$tasks_file" ]]; then
        local mcp_task_count
        if mcp_task_count=$(grep -c "MCP:" "$tasks_file" 2>/dev/null); then
            if [[ $mcp_task_count -ge 6 ]]; then
                log "SUCCESS" "✅ VS Code MCP tasks: $mcp_task_count tasks configured"
                return 0
            else
                log "WARN" "⚠️ VS Code MCP tasks: Only $mcp_task_count found (expected ≥6)"
                return 1
            fi
        else
            log "ERROR" "❌ No MCP tasks found in VS Code configuration"
            return 1
        fi
    else
        log "ERROR" "❌ VS Code tasks.json not found"
        return 1
    fi
}

# Function to check documentation completeness
check_documentation() {
    local docs=(
        "docs/MCP-ENFORCEMENT-IMPLEMENTATION.md"
        "scripts/mcp-enforcement-system.sh"
        "scripts/validate-mcp-system-complete.sh"
    )
    
    local missing_count=0
    
    for doc in "${docs[@]}"; do
        if [[ -f "$PROJECT_ROOT/$doc" ]]; then
            log "SUCCESS" "✅ Documentation: $doc exists"
        else
            log "ERROR" "❌ Documentation: $doc missing"
            missing_count=$((missing_count + 1))
        fi
    done
    
    if [[ $missing_count -eq 0 ]]; then
        log "SUCCESS" "✅ All documentation files present"
        return 0
    else
        log "ERROR" "❌ $missing_count documentation files missing"
        return 1
    fi
}

# Function to run comprehensive health check
run_health_check() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local health_score=0
    local max_score=5
    
    log "MONITOR" "🔍 Starting MCP system health check at $timestamp"
    
    # Run all health checks
    if check_mcp_server_health; then
        health_score=$((health_score + 1))
    fi
    
    if check_command_interception; then
        health_score=$((health_score + 1))
    fi
    
    if check_environment_variables; then
        health_score=$((health_score + 1))
    fi
    
    if check_vscode_tasks; then
        health_score=$((health_score + 1))
    fi
    
    if check_documentation; then
        health_score=$((health_score + 1))
    fi
    
    # Calculate health percentage
    local health_percentage=$((health_score * 100 / max_score))
    
    # Log health summary
    if [[ $health_score -eq $max_score ]]; then
        log "SUCCESS" "🎉 MCP System Health: $health_percentage% ($health_score/$max_score) - EXCELLENT"
    elif [[ $health_score -ge 4 ]]; then
        log "SUCCESS" "✅ MCP System Health: $health_percentage% ($health_score/$max_score) - GOOD"
    elif [[ $health_score -ge 3 ]]; then
        log "WARN" "⚠️ MCP System Health: $health_percentage% ($health_score/$max_score) - FAIR"
    else
        log "ERROR" "❌ MCP System Health: $health_percentage% ($health_score/$max_score) - POOR"
        echo "[$timestamp] ALERT: MCP System Health Below 60% ($health_percentage%)" >> "$ALERT_LOG"
    fi
    
    return $health_score
}

# Function to run continuous monitoring
run_continuous_monitoring() {
    local interval_seconds=${1:-300}  # Default 5 minutes
    local max_iterations=${2:-12}     # Default 1 hour (12 * 5 minutes)
    
    log "MONITOR" "🚀 Starting continuous MCP health monitoring"
    log "MONITOR" "📊 Check interval: ${interval_seconds}s, Duration: $((max_iterations * interval_seconds / 60)) minutes"
    
    for ((i=1; i<=max_iterations; i++)); do
        log "MONITOR" "🔄 Health check iteration $i/$max_iterations"
        
        if run_health_check; then
            if [[ $? -ge 4 ]]; then
                log "MONITOR" "✅ System healthy, continuing monitoring..."
            else
                log "MONITOR" "⚠️ System issues detected, but continuing monitoring..."
            fi
        fi
        
        if [[ $i -lt $max_iterations ]]; then
            log "MONITOR" "⏰ Next check in ${interval_seconds}s..."
            sleep "$interval_seconds"
        fi
    done
    
    log "MONITOR" "🏁 Continuous monitoring session completed"
}

# Function to show health status dashboard
show_health_dashboard() {
    cat << 'EOF'
╔══════════════════════════════════════════════════════════════════════════════╗
║                         MCP SYSTEM HEALTH DASHBOARD                         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  🚀 Domain 1: Development Server Intelligence                                ║
║     • startDevServerMCP - Timeout-resistant dev server startup              ║
║     • detectActivePortMCP - Cloud-aware port detection                      ║
║                                                                              ║
║  🧪 Domain 2: Testing Strategy Intelligence                                  ║
║     • executeTestMCP - Timeout-resistant test execution                     ║
║     • analyzeTestingNeedsMCP - Intelligent test strategy analysis           ║
║     • selectTestingStrategyMCP - Optimized testing workflows                ║
║     • getTestingRecommendationsMCP - Context-aware test guidance            ║
║     • validateTestingConfigurationMCP - Test setup validation               ║
║                                                                              ║
║  🔍 Domain 3: Quality Gates Intelligence                                     ║
║     • validateQualityGatesMCP - Parallel quality validation                 ║
║     • handleFileOperationMCP - Safe file operations                         ║
║                                                                              ║
║  🏗️ Domain 4: Component Architecture Intelligence                           ║
║     • analyzeComponentArchitectureMCP - Component pattern analysis          ║
║     • generateComponentMCP - Automated component generation                 ║
║     • validateComponentComplianceMCP - Brand compliance validation          ║
║     • getComponentArchitectureInsightsMCP - Architecture recommendations    ║
║                                                                              ║
║  ⚡ Domain 5: Performance Monitoring Intelligence                           ║
║     • monitorPerformanceMCP - Real-time Core Web Vitals monitoring         ║
║     • analyzePerformanceAspectMCP - Specific performance analysis          ║
║     • getPerformanceOptimizationsMCP - Performance recommendations         ║
║                                                                              ║
║  🔄 Domain 6: Cross-System Coordination Intelligence                        ║
║     • checkSystemHealthMCP - System health validation                      ║
║     • planCrossSystemOperationMCP - Operation planning                     ║
║     • executeFallbackStrategyMCP - Fallback execution                      ║
║     • getCoordinationInsightsMCP - System insights                         ║
║                                                                              ║
║  🚨 Emergency Rollback Intelligence                                         ║
║     • detectEmergencyTriggersMCP - Emergency detection                     ║
║     • generateRollbackStrategyMCP - Rollback planning                      ║
║     • executeEmergencyRollbackMCP - Emergency rollback                     ║
║     • analyzeEmergencyRecoveryMCP - Recovery analysis                      ║
║                                                                              ║
║  📚 Documentation & Workflow Intelligence                                   ║
║     • queryDocumentationMCP - Documentation queries                        ║
║     • getContextualGuidanceMCP - Contextual development guidance           ║
║     • resolveWorkflowStepsMCP - Workflow step resolution                   ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
EOF
}

# Main function
main() {
    local command="${1:-status}"
    
    case "$command" in
        "status")
            log "MONITOR" "🔍 Running single health check..."
            run_health_check
            ;;
        "monitor")
            local interval="${2:-300}"
            local duration="${3:-12}"
            run_continuous_monitoring "$interval" "$duration"
            ;;
        "dashboard")
            show_health_dashboard
            ;;
        "logs")
            if [[ -f "$HEALTH_LOG" ]]; then
                tail -20 "$HEALTH_LOG"
            else
                log "INFO" "No health logs found yet"
            fi
            ;;
        "alerts")
            if [[ -f "$ALERT_LOG" ]]; then
                cat "$ALERT_LOG"
            else
                log "INFO" "No alerts found"
            fi
            ;;
        *)
            cat << EOF
MCP Function Health Monitor v1.0.0

Usage:
  $0 status                    - Run single health check
  $0 monitor [interval] [iter] - Run continuous monitoring (default: 300s, 12 iterations)
  $0 dashboard                 - Show health dashboard
  $0 logs                      - Show recent health logs
  $0 alerts                    - Show health alerts

Examples:
  $0 status                    - Quick health check
  $0 monitor 60 24             - Monitor every 60s for 24 iterations
  $0 dashboard                 - Show complete function inventory
EOF
            ;;
    esac
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi