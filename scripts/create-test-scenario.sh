#!/bin/bash

# Create a complex port scenario for testing port management
set -e

echo "🔥 Creating complex port scenario for testing..."

# Create dummy servers on different ports
for port in 3001 3002 3003; do
    echo "Creating dummy server on port $port..."
    
    # Create a simple HTTP server that listens on the port
    cat > "/tmp/dummy-server-${port}.py" << EOF
#!/usr/bin/env python3
import socket
import time
import sys
import os

def start_server(port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    
    try:
        sock.bind(('localhost', port))
        sock.listen(1)
        print(f"Dummy server listening on port {port}")
        print(f"PID: {os.getpid()}")
        
        # Keep running
        while True:
            time.sleep(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
    finally:
        sock.close()

if __name__ == "__main__":
    start_server($port)
EOF
    
    chmod +x "/tmp/dummy-server-${port}.py"
    
    # Start the server in background
    python3 "/tmp/dummy-server-${port}.py" > "/tmp/dummy-server-${port}.log" 2>&1 &
    echo $! > "/tmp/dummy-server-${port}.pid"
    
    # Wait a moment for server to start
    sleep 2
done

# Create some unresponsive servers (bind but don't respond to HTTP)
for port in 3004 3005; do
    echo "Creating unresponsive server on port $port..."
    
    cat > "/tmp/unresponsive-server-${port}.py" << EOF
#!/usr/bin/env python3
import socket
import time
import os

def start_unresponsive_server(port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    
    try:
        sock.bind(('localhost', port))
        sock.listen(1)
        print(f"Unresponsive server bound to port {port}")
        print(f"PID: {os.getpid()}")
        
        # Accept connections but never respond
        while True:
            try:
                conn, addr = sock.accept()
                print(f"Connection from {addr} - hanging...")
                # Don't respond, just hang
                time.sleep(300)  # Hang for 5 minutes
                conn.close()
            except:
                pass
    except Exception as e:
        print(f"Error: {e}")
    finally:
        sock.close()

if __name__ == "__main__":
    start_unresponsive_server($port)
EOF
    
    chmod +x "/tmp/unresponsive-server-${port}.py"
    
    # Start the unresponsive server in background
    python3 "/tmp/unresponsive-server-${port}.py" > "/tmp/unresponsive-server-${port}.log" 2>&1 &
    echo $! > "/tmp/unresponsive-server-${port}.pid"
    
    sleep 1
done

# Create a hanging process that looks like next-server
echo "Creating hanging next-server process..."
cat > "/tmp/hanging-next-server.py" << EOF
#!/usr/bin/env python3
import time
import os
import sys

# Rename process to look like next-server
import ctypes
import ctypes.util

# Try to change process name
try:
    libc = ctypes.CDLL(ctypes.util.find_library('c'))
    libc.prctl(15, b'next-server', 0, 0, 0)  # PR_SET_NAME
except:
    pass

print(f"Hanging next-server process PID: {os.getpid()}")

# Just hang indefinitely
while True:
    time.sleep(1)
EOF

chmod +x "/tmp/hanging-next-server.py"
python3 "/tmp/hanging-next-server.py" > "/tmp/hanging-next-server.log" 2>&1 &
echo $! > "/tmp/hanging-next-server.pid"

echo "✅ Complex port scenario created!"
echo ""
echo "Summary:"
echo "- Port 3000: Real Next.js server (healthy)"
echo "- Port 3001-3003: Dummy servers (should be detected but not Next.js)"
echo "- Port 3004-3005: Unresponsive servers (will timeout)"
echo "- Hanging next-server process (dead process)"
echo ""
echo "Process files stored in /tmp/dummy-server-*.pid and /tmp/unresponsive-server-*.pid"
echo "Log files stored in /tmp/dummy-server-*.log and /tmp/unresponsive-server-*.log"
echo ""
echo "Run './scripts/port-manager.sh full-cycle' to test cleanup"