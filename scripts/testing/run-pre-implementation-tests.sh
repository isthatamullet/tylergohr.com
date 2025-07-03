#!/bin/bash

# Master Test Runner for Dynamic Port Detection Pre-Implementation Testing
# Coordinates all testing phases and provides comprehensive validation
# BEFORE implementing dynamic port detection in actual hook system

set -e

echo "🚀 Dynamic Port Detection - Pre-Implementation Testing Suite"
echo "============================================================"
echo "Master Test Runner v1.0.0"
echo "Date: $(date)"
echo ""

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="/tmp/pre-implementation-tests-$$"
SUMMARY_FILE="$LOG_DIR/test_summary.txt"

# Test tracking
TOTAL_PHASES=5
PHASE_RESULTS=()
DETAILED_RESULTS=()

# Colors for output (if terminal supports them)
if [[ -t 1 ]]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    NC='\033[0m' # No Color
else
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    NC=''
fi

# Cleanup function
cleanup_test_logs() {
    if [[ -d "$LOG_DIR" ]]; then
        echo ""
        echo "📁 Test logs saved in: $LOG_DIR"
        echo "   - Summary: $SUMMARY_FILE"
        echo "   - Individual phase logs available"
    fi
}

# Set up cleanup trap
trap cleanup_test_logs EXIT

# Initialize test environment
initialize_test_environment() {
    echo "🔧 Initializing Test Environment"
    echo "--------------------------------"
    
    # Create log directory
    mkdir -p "$LOG_DIR"
    echo "📁 Created log directory: $LOG_DIR"
    
    # Initialize summary file
    cat > "$SUMMARY_FILE" << EOF
Dynamic Port Detection - Pre-Implementation Testing Summary
===========================================================
Test Date: $(date)
Test Environment: $(uname -a)
Working Directory: $(pwd)

EOF
    
    # Check if dev server is running for testing
    echo "🔍 Checking development server status..."
    local server_found=false
    for port in 3000 3001 3002 3003; do
        if curl -s -o /dev/null -w "%{http_code}" --max-time 2 "http://localhost:$port" | grep -q "200"; then
            echo "✅ Found development server on port $port"
            server_found=true
            break
        fi
    done
    
    if [[ "$server_found" == "false" ]]; then
        echo "⚠️  No development server detected"
        echo "💡 Starting development server for testing..."
        
        # Start dev server in background
        npm run dev >/dev/null 2>&1 &
        local dev_pid=$!
        echo "🚀 Started dev server (PID: $dev_pid)"
        
        # Wait for server to start
        echo "⏱️  Waiting for server to start (10 seconds)..."
        sleep 10
        
        # Verify server started
        local server_started=false
        for port in 3000 3001 3002 3003; do
            if curl -s -o /dev/null -w "%{http_code}" --max-time 2 "http://localhost:$port" | grep -q "200"; then
                echo "✅ Development server started on port $port"
                server_started=true
                break
            fi
        done
        
        if [[ "$server_started" == "false" ]]; then
            echo "❌ Failed to start development server"
            echo "⚠️  Some tests may fail or be skipped"
        fi
    fi
    
    echo "✅ Test environment initialized"
    echo ""
}

# Run a test phase with logging
run_test_phase() {
    local phase_number="$1"
    local phase_name="$2"
    local test_script="$3"
    local phase_description="$4"
    
    echo -e "${BLUE}📋 Phase $phase_number: $phase_name${NC}"
    echo "$(printf '%.0s-' {1..50})"
    echo "$phase_description"
    echo ""
    
    local phase_log="$LOG_DIR/phase_${phase_number}_${phase_name// /_}.log"
    local start_time=$(date +%s)
    
    # Add to summary
    echo "Phase $phase_number: $phase_name" >> "$SUMMARY_FILE"
    echo "Description: $phase_description" >> "$SUMMARY_FILE"
    echo "Start Time: $(date)" >> "$SUMMARY_FILE"
    
    # Run the test
    local exit_code=0
    if [[ -f "$test_script" ]]; then
        echo "🔧 Running: $test_script"
        echo ""
        
        # Run the test and capture output
        if "$test_script" > "$phase_log" 2>&1; then
            exit_code=0
            echo -e "${GREEN}✅ Phase $phase_number PASSED${NC}"
            PHASE_RESULTS+=("PASS")
            DETAILED_RESULTS+=("Phase $phase_number ($phase_name): PASSED")
            echo "Status: PASSED" >> "$SUMMARY_FILE"
        else
            exit_code=1
            echo -e "${RED}❌ Phase $phase_number FAILED${NC}"
            PHASE_RESULTS+=("FAIL")
            DETAILED_RESULTS+=("Phase $phase_number ($phase_name): FAILED")
            echo "Status: FAILED" >> "$SUMMARY_FILE"
        fi
        
        # Show summary of test output
        echo ""
        echo "📄 Test Output Summary:"
        tail -10 "$phase_log" | sed 's/^/   /'
        
    else
        echo -e "${RED}❌ Test script not found: $test_script${NC}"
        PHASE_RESULTS+=("SKIP")
        DETAILED_RESULTS+=("Phase $phase_number ($phase_name): SKIPPED (script not found)")
        echo "Status: SKIPPED (script not found)" >> "$SUMMARY_FILE"
        exit_code=2
    fi
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    echo "End Time: $(date)" >> "$SUMMARY_FILE"
    echo "Duration: ${duration}s" >> "$SUMMARY_FILE"
    echo "Log File: $phase_log" >> "$SUMMARY_FILE"
    echo "" >> "$SUMMARY_FILE"
    
    echo "⏱️  Phase completed in ${duration}s"
    echo ""
    
    return $exit_code
}

# Generate final report
generate_final_report() {
    local passed_count=0
    local failed_count=0
    local skipped_count=0
    
    # Count results
    for result in "${PHASE_RESULTS[@]}"; do
        case "$result" in
            "PASS") ((passed_count++)) ;;
            "FAIL") ((failed_count++)) ;;
            "SKIP") ((skipped_count++)) ;;
        esac
    done
    
    echo "============================================================"
    echo "🎯 Pre-Implementation Testing Final Report"
    echo "============================================================"
    echo ""
    echo "📊 Overall Results:"
    echo "  ✅ Phases Passed: $passed_count"
    echo "  ❌ Phases Failed: $failed_count"
    echo "  ⚠️  Phases Skipped: $skipped_count"
    echo "  📋 Total Phases: $TOTAL_PHASES"
    echo ""
    
    echo "📋 Detailed Results:"
    for result in "${DETAILED_RESULTS[@]}"; do
        if [[ "$result" =~ "PASSED" ]]; then
            echo -e "  ${GREEN}$result${NC}"
        elif [[ "$result" =~ "FAILED" ]]; then
            echo -e "  ${RED}$result${NC}"
        else
            echo -e "  ${YELLOW}$result${NC}"
        fi
    done
    echo ""
    
    # Add to summary file
    cat >> "$SUMMARY_FILE" << EOF
FINAL RESULTS
=============
Phases Passed: $passed_count
Phases Failed: $failed_count
Phases Skipped: $skipped_count
Total Phases: $TOTAL_PHASES

DETAILED RESULTS
================
$(printf '%s\n' "${DETAILED_RESULTS[@]}")

EOF
    
    # Determine overall result
    if [[ $failed_count -eq 0 ]]; then
        echo -e "${GREEN}🎉 ALL TESTS PASSED - Ready for implementation!${NC}"
        echo ""
        echo "📋 Next Steps:"
        echo "   1. ✅ Pre-implementation validation complete"
        echo "   2. 🚀 Proceed with Phase 1 implementation"
        echo "   3. 📝 Apply dynamic scanning enhancements"
        echo "   4. 🧪 Test integration with actual hook system"
        echo "   5. 🎯 Validate performance in production environment"
        echo ""
        
        cat >> "$SUMMARY_FILE" << EOF
CONCLUSION
==========
Status: READY FOR IMPLEMENTATION
All pre-implementation tests passed successfully.
Dynamic port detection enhancements are validated and ready.

EOF
        return 0
    else
        echo -e "${RED}❌ SOME TESTS FAILED - Fix issues before implementation!${NC}"
        echo ""
        echo "📋 Next Steps:"
        echo "   1. ❌ Review failed test logs in $LOG_DIR"
        echo "   2. 🔧 Fix identified issues"
        echo "   3. 🔄 Re-run testing suite"
        echo "   4. ✅ Only proceed after all tests pass"
        echo ""
        
        cat >> "$SUMMARY_FILE" << EOF
CONCLUSION
==========
Status: IMPLEMENTATION BLOCKED
Some tests failed. Review and fix issues before proceeding.
Check individual phase logs for detailed error information.

EOF
        return 1
    fi
}

# Main test execution
main() {
    echo "Starting comprehensive pre-implementation testing..."
    echo ""
    
    # Initialize environment
    initialize_test_environment
    
    # Phase 1: Standalone Function Testing
    run_test_phase 1 "Standalone Function Testing" \
        "$SCRIPT_DIR/test-dynamic-port-detection.sh" \
        "Testing core dynamic port discovery functions in isolation"
    
    run_test_phase 1.1 "Server Validation Testing" \
        "$SCRIPT_DIR/test-server-validation.sh" \
        "Testing enhanced server validation without hardcoded endpoints"
    
    run_test_phase 1.2 "Caching Layer Testing" \
        "$SCRIPT_DIR/test-caching-layer.sh" \
        "Testing TTL caching and invalidation logic"
    
    # Phase 2: Integration Testing
    echo -e "${BLUE}📋 Phase 2: Integration Testing${NC}"
    echo "$(printf '%.0s-' {1..50})"
    echo "Testing integration with existing infrastructure"
    echo ""
    
    # Disable hooks for integration testing
    if [[ -f "$SCRIPT_DIR/hook-safe-test.sh" ]]; then
        echo "🔇 Temporarily disabling hooks for integration testing..."
        "$SCRIPT_DIR/hook-safe-test.sh" disable
    fi
    
    run_test_phase 2.1 "Backward Compatibility" \
        "$SCRIPT_DIR/test-backward-compatibility.sh" \
        "Testing compatibility with existing workflows and scripts"
    
    # Restore hooks
    if [[ -f "$SCRIPT_DIR/hook-safe-test.sh" ]]; then
        echo "🔄 Restoring hooks..."
        "$SCRIPT_DIR/hook-safe-test.sh" restore
    fi
    
    # Phase 3: Simulation Environment Testing
    run_test_phase 3.1 "Multi-Server Scenarios" \
        "$SCRIPT_DIR/test-multi-server-scenario.sh" \
        "Testing discovery when multiple servers are running"
    
    run_test_phase 3.2 "Edge Cases" \
        "$SCRIPT_DIR/test-edge-cases.sh" \
        "Testing edge cases and error handling scenarios"
    
    # Phase 4: Performance Benchmarking
    run_test_phase 4 "Performance Benchmarking" \
        "$SCRIPT_DIR/benchmark-port-detection.sh" \
        "Validating performance targets and optimization effectiveness"
    
    # Generate final report
    generate_final_report
    local final_result=$?
    
    echo ""
    echo "📁 Complete test logs available in: $LOG_DIR"
    echo "📄 Summary report: $SUMMARY_FILE"
    
    return $final_result
}

# Script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
    exit $?
fi