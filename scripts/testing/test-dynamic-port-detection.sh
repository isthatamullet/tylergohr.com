#!/bin/bash

# Dynamic Port Detection - Standalone Testing Script
# Tests core dynamic port discovery functions in isolation
# BEFORE implementing in actual hook system

set -e

# Source cloud environment utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/cloud-environment-utils.sh"

echo "🧪 Testing Dynamic Port Detection Logic (Standalone)"
echo "===================================================="

# Print environment information
print_environment_info

# Test implementation of new dynamic scanning logic
find_nextjs_process_port_test() {
    echo "🔍 Phase 1: Process-based discovery..."
    
    # Method 1: Find actual Next.js processes and their ports
    local nextjs_processes=$(ps aux | grep -E "next-server|npm run dev|next dev" | grep -v grep)
    
    if [[ -n "$nextjs_processes" ]]; then
        echo "   Found Next.js processes:"
        echo "$nextjs_processes" | sed 's/^/     /'
        
        echo "$nextjs_processes" | while read -r process; do
            local pid=$(echo "$process" | awk '{print $2}')
            if [[ -n "$pid" ]]; then
                local port=$(lsof -i -P -n 2>/dev/null | grep "$pid" | grep LISTEN | grep -o ":[3-9][0-9][0-9][0-9]" | head -1 | cut -d: -f2)
                if [[ -n "$port" ]] && validate_nextjs_server_test "$port"; then
                    echo "   ✅ Found via process discovery: $port"
                    echo "$port"
                    return 0
                fi
            fi
        done
    fi
    
    echo "🔍 Phase 2: Dynamic range scanning..."
    
    # Method 2: Dynamic range scanning (no hardcoded ports)
    local start_port=3000
    local end_port=4000  # Limited range for testing
    local found_ports=()
    
    # Quick scan for active ports
    for ((port=start_port; port<=end_port; port++)); do
        if netstat -tuln 2>/dev/null | grep -q ":$port "; then
            found_ports+=("$port")
        fi
    done
    
    if [[ ${#found_ports[@]} -gt 0 ]]; then
        echo "   Found active ports: ${found_ports[*]}"
        
        # Validate each found port
        for port in "${found_ports[@]}"; do
            if validate_nextjs_server_test "$port"; then
                echo "   ✅ Found via range scanning: $port"
                echo "$port"
                return 0
            fi
        done
    fi
    
    echo "   ❌ No Next.js servers found"
    return 1
}

# Test version of enhanced server validation (cloud-aware)
validate_nextjs_server_test() {
    local port="$1"
    local timeout="${2:-5}"
    
    # Use cloud-aware validation function
    validate_nextjs_server_cloud "$port" "$timeout"
}

# Test the main function
test_dynamic_port_scanning() {
    echo ""
    echo "🎯 Running Dynamic Port Detection Test"
    echo "------------------------------------"
    
    local detected_port=$(find_nextjs_process_port_test)
    local exit_code=$?
    
    if [[ $exit_code -eq 0 && -n "$detected_port" ]]; then
        echo ""
        echo "✅ Dynamic port detection successful!"
        echo "   Detected port: $detected_port"
        echo "   Method: Dynamic scanning (no hardcoded ports)"
        
        # Verify the detected port is actually serving Next.js
        echo ""
        echo "🔍 Final validation of detected port..."
        if test_server_connectivity "$detected_port" 5; then
            echo "✅ Port $detected_port is responding correctly"
            echo "   URL: $(construct_test_url "$detected_port")"
            return 0
        else
            echo "❌ Port $detected_port is not responding"
            echo "   URL: $(construct_test_url "$detected_port")"
            return 1
        fi
    else
        echo ""
        echo "❌ Dynamic port detection failed"
        echo "   No suitable Next.js servers found"
        echo "   💡 Consider starting dev server: npm run dev"
        return 1
    fi
}

# Run the test
test_dynamic_port_scanning
exit_code=$?

echo ""
echo "================================================"
if [[ $exit_code -eq 0 ]]; then
    echo "🎉 Dynamic Port Detection Test PASSED"
    echo "   Ready for integration testing"
else
    echo "❌ Dynamic Port Detection Test FAILED"
    echo "   Fix issues before proceeding"
fi
echo "================================================"

exit $exit_code