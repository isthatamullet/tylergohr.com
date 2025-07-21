#!/bin/bash

# Comprehensive MCP Function Test Suite
# Tests all 26 MCP functions to ensure they work correctly and are used consistently
# Version 1.0.0

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MCP_SERVER_DIR="$PROJECT_ROOT/mcp-server"
TEST_LOG="$PROJECT_ROOT/.mcp-function-tests.log"
RESULTS_FILE="$PROJECT_ROOT/.mcp-test-results.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
SKIPPED_TESTS=0

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
        "TEST")    echo -e "${CYAN}[TEST]${NC} $message" ;;
    esac
    
    # Log to file
    echo "[$timestamp] [$level] $message" >> "$TEST_LOG"
}

# Function to test an MCP function with timeout and error handling
test_mcp_function() {
    local function_name="$1"
    local test_description="$2"
    local timeout_seconds="${3:-30}"
    shift 3
    local mcp_args=("$@")
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    log "TEST" "Testing $function_name: $test_description"
    
    # Create test result object
    local test_start=$(date +%s)
    local test_result=""
    local error_message=""
    local execution_time=0
    
    # Execute MCP function with timeout
    if timeout "${timeout_seconds}s" node "$MCP_SERVER_DIR/dist/index.js" "$function_name" "${mcp_args[@]}" >/tmp/mcp_test_output 2>&1; then
        execution_time=$(($(date +%s) - test_start))
        test_result="PASS"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        log "SUCCESS" "✅ $function_name: $test_description (${execution_time}s)"
    else
        execution_time=$(($(date +%s) - test_start))
        test_result="FAIL"
        error_message=$(cat /tmp/mcp_test_output 2>/dev/null || echo "Unknown error")
        FAILED_TESTS=$((FAILED_TESTS + 1))
        log "ERROR" "❌ $function_name: $test_description (${execution_time}s)"
        log "ERROR" "Error: $error_message"
    fi
    
    # Record result in JSON format
    cat >> "$RESULTS_FILE" << EOF
{
  "function": "$function_name",
  "description": "$test_description", 
  "result": "$test_result",
  "execution_time": $execution_time,
  "error": "$error_message",
  "timestamp": "$(date -Iseconds)"
},
EOF
}

# Function to test command interception
test_command_interception() {
    local command="$1"
    local expected_mcp_function="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    log "TEST" "Testing command interception: $command -> $expected_mcp_function"
    
    # Test command analysis
    local actual_result
    if actual_result=$("$SCRIPT_DIR/mcp-enforcement-system.sh" analyze $command 2>/dev/null); then
        if [[ "$actual_result" == "$expected_mcp_function" ]]; then
            PASSED_TESTS=$((PASSED_TESTS + 1))
            log "SUCCESS" "✅ Command interception: $command correctly mapped to $expected_mcp_function"
        else
            FAILED_TESTS=$((FAILED_TESTS + 1))
            log "ERROR" "❌ Command interception: $command mapped to $actual_result, expected $expected_mcp_function"
        fi
    else
        FAILED_TESTS=$((FAILED_TESTS + 1))
        log "ERROR" "❌ Command interception: Failed to analyze $command"
    fi
}

# Initialize results file
echo '[' > "$RESULTS_FILE"

log "INFO" "🚀 Starting comprehensive MCP function test suite..."
log "INFO" "Testing all 26 MCP functions across 6 intelligence domains"

# Domain 1: Development Server Intelligence
log "INFO" "📊 Testing Domain 1: Development Server Intelligence"

test_mcp_function "startDevServerMCP" "Start development server" 60 \
    "--action=start" "--enhanced=true" "--environment=auto"

test_mcp_function "startDevServerMCP" "Check server status" 30 \
    "--action=status"

test_mcp_function "detectActivePortMCP" "Detect active ports with health check" 30 \
    "--includeHealth=true" "--scanPorts=true"

test_mcp_function "detectActivePortMCP" "Quick port detection" 15 \
    "--includeHealth=false" "--scanPorts=false"

# Domain 2: Testing Strategy Intelligence  
log "INFO" "🧪 Testing Domain 2: Testing Strategy Intelligence"

test_mcp_function "executeTestMCP" "Execute smoke tests" 90 \
    "--testType=smoke" "--strategy=auto" "--fastMode=true"

test_mcp_function "executeTestMCP" "Execute component tests" 60 \
    "--testType=component" "--strategy=auto"

test_mcp_function "analyzeTestingNeedsMCP" "Analyze testing needs" 30 \
    "--context=main" "--priority=development"

test_mcp_function "selectTestingStrategyMCP" "Select testing strategy" 30 \
    "--context=main" "--priority=development" "--timeConstraints=fast"

test_mcp_function "getTestingRecommendationsMCP" "Get testing recommendations" 30 \
    "--scenario=quick-development" "--timeAvailable=5 minutes"

test_mcp_function "validateTestingConfigurationMCP" "Validate testing configuration" 30 \
    "--checkCommands=true" "--checkEnvironment=true"

# Domain 3: Quality Gates Intelligence
log "INFO" "🔍 Testing Domain 3: Quality Gates Intelligence"

test_mcp_function "validateQualityGatesMCP" "Validate TypeScript only" 60 \
    "--checks=[\"typescript\"]" "--fix=false"

test_mcp_function "validateQualityGatesMCP" "Validate all quality gates" 120 \
    "--checks=[\"typescript\",\"eslint\",\"build\"]" "--fix=false"

test_mcp_function "handleFileOperationMCP" "Check file exists" 15 \
    "--operation=exists" "--filePath=package.json"

test_mcp_function "handleFileOperationMCP" "Read package.json" 15 \
    "--operation=read" "--filePath=package.json"

# Domain 4: Component Architecture Intelligence
log "INFO" "🏗️ Testing Domain 4: Component Architecture Intelligence"

test_mcp_function "analyzeComponentArchitectureMCP" "Analyze component architecture" 45 \
    "--includePatterns=true" "--includeBrandTokens=true"

test_mcp_function "generateComponentMCP" "Generate UI component (dry run)" 30 \
    "--componentName=TestComponent" "--componentType=ui" "--generateFiles=false"

test_mcp_function "validateComponentComplianceMCP" "Validate component compliance" 30 \
    "--componentPath=src/app/2/layout.tsx" "--checkBrandTokens=true"

test_mcp_function "getComponentArchitectureInsightsMCP" "Get architecture insights" 30 \
    "--includeRecommendations=true" "--includePerformance=true"

# Domain 5: Performance Monitoring Intelligence
log "INFO" "⚡ Testing Domain 5: Performance Monitoring Intelligence"

test_mcp_function "monitorPerformanceMCP" "Monitor performance" 60 \
    "--context=main" "--includeBundle=true" "--realTime=false"

test_mcp_function "analyzePerformanceAspectMCP" "Analyze Core Web Vitals" 45 \
    "--type=core-web-vitals" "--includeOptimizations=true"

test_mcp_function "getPerformanceOptimizationsMCP" "Get performance optimizations" 30 \
    "--category=all" "--priority=immediate"

# Domain 6: Cross-System Coordination Intelligence
log "INFO" "🔄 Testing Domain 6: Cross-System Coordination Intelligence"

test_mcp_function "checkSystemHealthMCP" "Check system health" 30 \
    "--format=detailed" "--includeInsights=true"

test_mcp_function "planCrossSystemOperationMCP" "Plan development operation" 30 \
    "--operation=development" "--preferredSystem=auto"

test_mcp_function "executeFallbackStrategyMCP" "Execute fallback strategy" 30 \
    "--trigger=manual" "--fromSystem=mcp" "--operation=test"

test_mcp_function "getCoordinationInsightsMCP" "Get coordination insights" 30 \
    "--analysisDepth=detailed" "--includeOptimizations=true"

# Emergency Rollback Intelligence
log "INFO" "🚨 Testing Emergency Rollback Intelligence"

test_mcp_function "detectEmergencyTriggersMCP" "Detect emergency triggers" 30 \
    "--checkSystems=[\"mcp\",\"build\"]" "--includeMinor=false"

test_mcp_function "generateRollbackStrategyMCP" "Generate rollback strategy" 30 \
    "--triggerType=manual" "--severity=low" "--preserveState=true"

test_mcp_function "executeEmergencyRollbackMCP" "Execute emergency rollback (dry run)" 30 \
    "--dryRun=true" "--triggerType=manual"

test_mcp_function "analyzeEmergencyRecoveryMCP" "Analyze emergency recovery" 30 \
    "--analysisDepth=detailed" "--includePreventionTips=true"

# Documentation and Workflow Intelligence
log "INFO" "📚 Testing Documentation and Workflow Intelligence"

test_mcp_function "queryDocumentationMCP" "Query general documentation" 30 \
    "--query=testing" "--category=general" "--includeExamples=true"

test_mcp_function "getContextualGuidanceMCP" "Get contextual guidance" 30 \
    "--currentTask=development setup" "--urgency=medium"

test_mcp_function "resolveWorkflowStepsMCP" "Resolve workflow steps" 30 \
    "--workflow=development setup" "--detailLevel=detailed"

# Test Command Interception System
log "INFO" "🛡️ Testing Command Interception System"

test_command_interception "npm run dev" "startDevServerMCP"
test_command_interception "npm run test:e2e:smoke" "executeTestMCP"
test_command_interception "npm run validate" "validateQualityGatesMCP"
test_command_interception "npx playwright test" "executeTestMCP"

# Close JSON array
echo '{}]' >> "$RESULTS_FILE"

# Generate final test report
log "INFO" "📊 Generating final test report..."

cat << EOF

🎯 COMPREHENSIVE MCP FUNCTION TEST RESULTS
==========================================

📊 Test Summary:
- Total Tests: $TOTAL_TESTS
- Passed: $PASSED_TESTS ($(( PASSED_TESTS * 100 / TOTAL_TESTS ))%)
- Failed: $FAILED_TESTS ($(( FAILED_TESTS * 100 / TOTAL_TESTS ))%)
- Skipped: $SKIPPED_TESTS

📁 Detailed Results: $RESULTS_FILE
📁 Test Log: $TEST_LOG

EOF

if [[ $FAILED_TESTS -eq 0 ]]; then
    log "SUCCESS" "🎉 ALL MCP FUNCTIONS WORKING CORRECTLY!"
    log "SUCCESS" "✅ MCP functions are ready for consistent usage"
    log "SUCCESS" "✅ Command interception system validated"
    log "SUCCESS" "✅ Enforcement system ensures MCP functions will be used"
    exit 0
else
    log "ERROR" "❌ $FAILED_TESTS tests failed - see details above"
    log "ERROR" "🔧 Fix failing functions before deploying enforcement system"
    exit 1
fi