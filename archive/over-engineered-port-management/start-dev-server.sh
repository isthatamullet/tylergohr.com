#!/bin/bash

# Smart Dev Server Starter
# Starts dev server on clean port and updates all configurations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to find available port
find_available_port() {
    local start_port=${1:-3000}
    local port=$start_port
    
    while [ $port -le 3010 ]; do
        if ! lsof -i ":$port" >/dev/null 2>&1; then
            echo "$port"
            return 0
        fi
        ((port++))
    done
    
    log_error "No available ports found in range 3000-3010"
    return 1
}

# Function to kill existing dev servers and free ports
cleanup_existing_servers() {
    log_info "Cleaning up existing development servers..."
    
    # Kill all node processes that might be dev servers
    for port in 3000 3001 3002 3003 3004 3005; do
        local pids=$(lsof -t -i ":$port" 2>/dev/null || true)
        if [ -n "$pids" ]; then
            log_warning "Killing processes on port $port: $pids"
            echo "$pids" | xargs kill -9 2>/dev/null || true
        fi
    done
    
    # Also kill by process name
    pkill -9 -f "next-server\|npm.*dev\|next dev\|node.*next" 2>/dev/null || true
    
    # Wait for ports to be freed
    sleep 3
    
    # Verify ports are free
    local blocked_ports=""
    for port in 3000 3001 3002 3003 3004 3005; do
        if lsof -i ":$port" >/dev/null 2>&1; then
            blocked_ports="$blocked_ports $port"
        fi
    done
    
    if [ -n "$blocked_ports" ]; then
        log_warning "Ports still blocked:$blocked_ports"
        log_info "Waiting additional time for cleanup..."
        sleep 5
    else
        log_success "All development ports are now free"
    fi
}

# Function to start dev server on specific port
start_dev_server() {
    local target_port="$1"
    
    log_info "Starting development server on port $target_port..."
    
    # Set the port environment variable
    export PORT="$target_port"
    
    # Start the dev server in background
    PORT="$target_port" npm run dev &
    local dev_pid=$!
    
    # Wait for server to start
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s -o /dev/null -w "%{http_code}" --max-time 2 "http://localhost:$target_port" | grep -q "200"; then
            log_success "Development server started successfully on port $target_port"
            return 0
        fi
        
        sleep 1
        ((attempt++))
        
        # Check if process is still running
        if ! kill -0 $dev_pid 2>/dev/null; then
            log_error "Development server process died during startup"
            return 1
        fi
        
        log_info "Waiting for server to start... ($attempt/$max_attempts)"
    done
    
    log_error "Development server failed to start within $max_attempts seconds"
    kill $dev_pid 2>/dev/null || true
    return 1
}

# Function to update configurations
update_configurations() {
    local active_port="$1"
    
    log_info "Updating configurations with active port $active_port..."
    
    # Run the port detection script to update all configs
    if ./scripts/detect-active-port.sh >/dev/null 2>&1; then
        log_success "Configurations updated successfully"
    else
        log_warning "Configuration update had issues, but continuing..."
    fi
}

# Function to show server info
show_server_info() {
    local port="$1"
    
    echo ""
    echo "🚀 Development Server Ready!"
    echo "================================"
    echo "📍 URL: http://localhost:$port"
    echo "🌐 Network: http://$(hostname -I | awk '{print $1}'):$port"
    echo "📁 Main Portfolio: http://localhost:$port"
    echo "🎨 /2 Redesign: http://localhost:$port/2"
    echo ""
    echo "🧪 Testing Commands:"
    echo "   npm run test:e2e:smoke              # Quick validation"
    echo "   npm run test:e2e:dev                # Development testing"
    echo "   npx playwright test --ui             # Interactive testing"
    echo ""
    echo "📸 Screenshot Generation:"
    echo "   npx playwright test e2e/quick-screenshots.spec.ts --project=chromium"
    echo ""
    echo "🛑 To stop server: Ctrl+C or pkill -f 'next-server'"
}

# Main execution
main() {
    echo "🚀 Smart Development Server Starter"
    echo "===================================="
    
    # Step 1: Clean up existing servers
    cleanup_existing_servers
    
    # Step 2: Find available port (prefer 3000 if available)
    log_info "Finding available port..."
    if available_port=$(find_available_port 3000); then
        log_success "Available port found: $available_port"
    else
        log_error "Failed to find available port"
        exit 1
    fi
    
    # Step 3: Start dev server
    if start_dev_server "$available_port"; then
        # Step 4: Update configurations
        update_configurations "$available_port"
        
        # Step 5: Show server info
        show_server_info "$available_port"
        
        # Keep script running to maintain server
        log_info "Server running in background. Press Ctrl+C to stop."
        
        # Wait for user interrupt
        trap 'log_warning "Stopping development server..."; exit 0' INT
        
        # Keep alive
        while true; do
            # Check if server is still running
            if ! curl -s -o /dev/null --max-time 2 "http://localhost:$available_port" >/dev/null 2>&1; then
                log_error "Development server appears to have stopped"
                exit 1
            fi
            sleep 10
        done
    else
        log_error "Failed to start development server"
        exit 1
    fi
}

# Handle command line arguments
case "${1:-start}" in
    "start")
        main
        ;;
    "detect")
        ./scripts/detect-active-port.sh
        ;;
    "stop")
        log_info "Stopping all development servers..."
        pkill -f "next-server\|npm.*dev\|next dev" 2>/dev/null || true
        log_success "Development servers stopped"
        ;;
    "status")
        log_info "Checking development server status..."
        ./scripts/detect-active-port.sh
        ;;
    *)
        echo "Usage: $0 [start|detect|stop|status]"
        echo ""
        echo "Commands:"
        echo "  start   - Clean start development server (default)"
        echo "  detect  - Detect active port and update configs"
        echo "  stop    - Stop all development servers"
        echo "  status  - Check current server status"
        exit 1
        ;;
esac