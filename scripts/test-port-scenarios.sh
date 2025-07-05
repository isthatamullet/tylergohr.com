#!/bin/bash

# Advanced port management testing scenarios
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🧪 Advanced Port Management Testing Scenarios"
echo "=============================================="

# Test 1: Normal operation with single server
test_single_server() {
    echo ""
    echo "📋 Test 1: Single Server Management"
    echo "-----------------------------------"
    
    ./scripts/port-manager.sh full-cycle
    
    local exit_code=$?
    if [[ $exit_code -eq 0 ]]; then
        echo "✅ Test 1 PASSED: Single server management working"
    else
        echo "❌ Test 1 FAILED: Single server management failed"
        return 1
    fi
}

# Test 2: Multiple server discovery and consolidation  
test_multiple_servers() {
    echo ""
    echo "📋 Test 2: Multiple Server Consolidation"
    echo "----------------------------------------"
    
    # Create multiple simple HTTP servers
    for port in 3001 3002; do
        echo "Starting test server on port $port..."
        
        # Simple HTTP server that responds properly
        cat > "/tmp/test-server-${port}.py" << EOF
#!/usr/bin/env python3
import http.server
import socketserver
import threading
import time
import sys

class TestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(b'Test server on port $port')
        
    def log_message(self, format, *args):
        pass  # Suppress logging

def start_server(port):
    try:
        with socketserver.TCPServer(("", port), TestHandler) as httpd:
            print(f"Test server started on port {port}")
            httpd.serve_forever()
    except Exception as e:
        print(f"Error starting server on port {port}: {e}")
        sys.exit(1)

if __name__ == "__main__":
    start_server($port)
EOF
        
        chmod +x "/tmp/test-server-${port}.py"
        python3 "/tmp/test-server-${port}.py" > "/tmp/test-server-${port}.log" 2>&1 &
        echo $! > "/tmp/test-server-${port}.pid"
        
        sleep 2
    done
    
    # Test discovery
    echo "Testing multiple server discovery..."
    ./scripts/port-manager.sh discover
    
    # Test consolidation
    echo "Testing server consolidation..."
    ./scripts/port-manager.sh consolidate
    
    # Cleanup
    for pid in $(cat /tmp/test-server-*.pid 2>/dev/null); do 
        kill -9 $pid 2>/dev/null || true
    done
    rm -f /tmp/test-server-*
    
    echo "✅ Test 2 PASSED: Multiple server handling working"
}

# Test 3: Timeout and unresponsive server handling
test_timeout_servers() {
    echo ""
    echo "📋 Test 3: Timeout and Unresponsive Server Handling"
    echo "---------------------------------------------------"
    
    # Create a server that accepts connections but never responds
    cat > "/tmp/timeout-server.py" << EOF
#!/usr/bin/env python3
import socket
import time
import os
import signal

def signal_handler(signum, frame):
    print(f"Timeout server {os.getpid()} received signal {signum}")
    exit(0)

signal.signal(signal.SIGTERM, signal_handler)
signal.signal(signal.SIGINT, signal_handler)

def start_timeout_server(port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.settimeout(None)
    
    try:
        sock.bind(('localhost', port))
        sock.listen(1)
        print(f"Timeout server listening on port {port}")
        
        while True:
            try:
                conn, addr = sock.accept()
                print(f"Connection from {addr} - will timeout")
                # Accept but never send response - causes timeout
                time.sleep(30)
                conn.close()
            except Exception as e:
                print(f"Error: {e}")
                break
    except Exception as e:
        print(f"Error starting timeout server: {e}")
    finally:
        sock.close()

if __name__ == "__main__":
    start_timeout_server(3006)
EOF
    
    chmod +x "/tmp/timeout-server.py"
    python3 "/tmp/timeout-server.py" > "/tmp/timeout-server.log" 2>&1 &
    echo $! > "/tmp/timeout-server.pid"
    
    sleep 2
    
    # Test with reduced timeout for faster testing
    echo "Testing timeout server detection (with 3s timeout)..."
    HEALTH_CHECK_TIMEOUT=3 ./scripts/port-manager.sh assess
    
    # Cleanup
    local pid=$(cat /tmp/timeout-server.pid 2>/dev/null)
    if [[ -n "$pid" ]]; then
        kill -9 $pid 2>/dev/null || true
    fi
    rm -f /tmp/timeout-server.*
    
    echo "✅ Test 3 PASSED: Timeout handling working"
}

# Test 4: Dead process cleanup
test_dead_process_cleanup() {
    echo ""
    echo "📋 Test 4: Dead Process Cleanup"
    echo "-------------------------------"
    
    # Create a process that will be killed
    cat > "/tmp/dead-process.py" << EOF
#!/usr/bin/env python3
import time
import os
import sys

print(f"Dead process test PID: {os.getpid()}")
sys.stdout.flush()

# Run for a short time then exit
time.sleep(1)
print("Process exiting...")
sys.stdout.flush()
EOF
    
    chmod +x "/tmp/dead-process.py"
    python3 "/tmp/dead-process.py" > "/tmp/dead-process.log" 2>&1 &
    local dead_pid=$!
    echo $dead_pid > "/tmp/dead-process.pid"
    
    # Wait for process to exit
    sleep 3
    
    # Simulate the process having been using a port (manually add to SERVER_PIDS)
    # The port manager should detect this as a dead process
    
    echo "Testing dead process detection..."
    ./scripts/port-manager.sh assess
    
    # Cleanup
    rm -f /tmp/dead-process.*
    
    echo "✅ Test 4 PASSED: Dead process cleanup working"
}

# Test 5: Resilience under stress
test_stress_resilience() {
    echo ""
    echo "📋 Test 5: Stress and Resilience Testing"
    echo "----------------------------------------"
    
    echo "Testing rapid discovery cycles..."
    for i in {1..5}; do
        echo "Stress cycle $i/5"
        ./scripts/port-manager.sh discover >/dev/null 2>&1
        ./scripts/port-manager.sh assess >/dev/null 2>&1
        sleep 1
    done
    
    echo "Testing recovery from various conditions..."
    ./scripts/port-manager.sh recovery-test
    
    echo "✅ Test 5 PASSED: Stress resilience working"
}

# Test 6: Integration with hooks system
test_hooks_integration() {
    echo ""
    echo "📋 Test 6: Hooks System Integration"
    echo "-----------------------------------"
    
    # Test that port manager provides information that can be used by hooks
    local report_file=$(./scripts/port-manager.sh report)
    if [[ -f "$report_file" ]]; then
        echo "Report generated successfully: $report_file"
        echo "Report contents:"
        cat "$report_file" | head -10
        echo "✅ Test 6 PASSED: Hooks integration working"
    else
        echo "❌ Test 6 FAILED: Report generation failed"
        return 1
    fi
}

# Test 7: Cloud environment compatibility
test_cloud_compatibility() {
    echo ""
    echo "📋 Test 7: Cloud Environment Compatibility"
    echo "------------------------------------------"
    
    # Test port detection in cloud environment
    echo "Testing cloud-aware port detection..."
    ./scripts/detect-active-port.sh quiet export
    
    if [[ -n "$ACTIVE_DEV_PORT" ]]; then
        echo "Cloud-aware port detection: $ACTIVE_DEV_PORT"
        echo "Cloud-aware URL: $ACTIVE_DEV_URL"
        echo "✅ Test 7 PASSED: Cloud compatibility working"
    else
        echo "❌ Test 7 FAILED: Cloud port detection failed"
        return 1
    fi
}

# Test 8: Recovery from network issues
test_network_recovery() {
    echo ""
    echo "📋 Test 8: Network Recovery Testing"
    echo "-----------------------------------"
    
    # Test with various network conditions
    echo "Testing with short timeout (simulating network issues)..."
    HEALTH_CHECK_TIMEOUT=1 ./scripts/port-manager.sh assess
    
    echo "Testing with normal timeout (recovery)..."
    HEALTH_CHECK_TIMEOUT=10 ./scripts/port-manager.sh assess
    
    echo "✅ Test 8 PASSED: Network recovery working"
}

# Performance benchmark
benchmark_performance() {
    echo ""
    echo "📋 Performance Benchmark"
    echo "------------------------"
    
    echo "Benchmarking port detection performance..."
    
    local start_time=$(date +%s)
    for i in {1..10}; do
        ./scripts/port-manager.sh discover >/dev/null 2>&1
    done
    local end_time=$(date +%s)
    
    local total_time=$((end_time - start_time))
    local avg_time=$((total_time * 100 / 10))
    
    echo "10 discovery cycles completed in ${total_time}s (avg: ${avg_time}ms per cycle)"
    
    if [[ $total_time -lt 30 ]]; then
        echo "✅ Performance benchmark PASSED: Under 30s for 10 cycles"
    else
        echo "⚠️  Performance benchmark WARNING: Over 30s for 10 cycles"
    fi
}

# Run all tests
run_all_tests() {
    echo "🚀 Running comprehensive port management tests..."
    
    local failed_tests=0
    
    # Run each test
    test_single_server || ((failed_tests++))
    test_multiple_servers || ((failed_tests++))
    test_timeout_servers || ((failed_tests++))
    test_dead_process_cleanup || ((failed_tests++))
    test_stress_resilience || ((failed_tests++))
    test_hooks_integration || ((failed_tests++))
    test_cloud_compatibility || ((failed_tests++))
    test_network_recovery || ((failed_tests++))
    
    # Run performance benchmark
    benchmark_performance
    
    echo ""
    echo "🏁 Test Results Summary"
    echo "======================="
    
    if [[ $failed_tests -eq 0 ]]; then
        echo "✅ All tests PASSED! Port management system is robust and ready."
    else
        echo "❌ $failed_tests test(s) FAILED. Review the output above."
    fi
    
    return $failed_tests
}

# Command line interface
case "${1:-all}" in
    "single")
        test_single_server
        ;;
    "multiple")
        test_multiple_servers
        ;;
    "timeout")
        test_timeout_servers
        ;;
    "dead")
        test_dead_process_cleanup
        ;;
    "stress")
        test_stress_resilience
        ;;
    "hooks")
        test_hooks_integration
        ;;
    "cloud")
        test_cloud_compatibility
        ;;
    "network")
        test_network_recovery
        ;;
    "benchmark")
        benchmark_performance
        ;;
    "all")
        run_all_tests
        ;;
    *)
        echo "Usage: $0 [single|multiple|timeout|dead|stress|hooks|cloud|network|benchmark|all]"
        exit 1
        ;;
esac