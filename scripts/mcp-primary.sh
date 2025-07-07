#!/bin/bash

# Tyler Gohr Portfolio - MCP Primary Development Server
# Phase 4 "MCP-Primary Transition" - Primary development interface
# Replaces timeout-prone "npm run dev" with intelligent MCP automation

set -euo pipefail

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MCP_SERVER_DIR="$PROJECT_ROOT/mcp-server"
MCP_SERVER_SCRIPT="$MCP_SERVER_DIR/dist/index.js"

# Color coding for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${CYAN}[MCP-PRIMARY]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[MCP-PRIMARY]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[MCP-PRIMARY]${NC} $1"
}

log_error() {
    echo -e "${RED}[MCP-PRIMARY]${NC} $1"
}

# Help function
show_help() {
    cat << 'EOF'
MCP Primary Development Server - Phase 4 MCP-Primary Transition

USAGE:
    ./scripts/mcp-primary.sh [OPTIONS] [ACTION]

ACTIONS:
    start          Start development server with intelligent automation (default)
    status         Check development server status  
    stop           Stop development server
    restart        Restart development server
    health         Check MCP server health

OPTIONS:
    --port PORT    Preferred port for development server
    --enhanced     Use enhanced mode with sub-agent recommendations
    --environment  Specify environment: auto|local|cloud-workstation|codespaces|gitpod
    --help, -h     Show this help message

FEATURES:
    ✨ Intelligent port detection with cloud environment support
    🚀 Timeout-resistant server startup (vs 2-minute npm timeouts)
    🧠 MCP-powered automation with Phase 4 intelligence
    📊 Real-time performance monitoring and optimization recommendations
    🛡️ File protection and quality gate integration
    🔄 Automatic fallback and error recovery

EXAMPLES:
    ./scripts/mcp-primary.sh                    # Start with auto-detection
    ./scripts/mcp-primary.sh --port 3001        # Force specific port
    ./scripts/mcp-primary.sh --enhanced         # Enhanced mode with recommendations
    ./scripts/mcp-primary.sh status             # Check server status
    ./scripts/mcp-primary.sh restart            # Restart development server

PHASE 4 BENEFITS:
    🎯 Replaces timeout-prone "npm run dev" 
    ⚡ 30-60 second execution vs 2-minute timeouts
    🧠 Context-aware optimization (main portfolio vs /2 redesign)
    📈 Performance monitoring with enterprise standards
    🔧 Intelligent troubleshooting and recovery

EOF
}

# Check if MCP server is built
check_mcp_server() {
    if [[ ! -f "$MCP_SERVER_SCRIPT" ]]; then
        log_error "MCP server not built. Building now..."
        cd "$MCP_SERVER_DIR"
        npm run build
        cd "$PROJECT_ROOT"
    fi
}

# Test MCP server health
test_mcp_health() {
    log_info "Testing MCP server health..."
    
    if node "$MCP_SERVER_SCRIPT" health 2>/dev/null; then
        log_success "MCP server health check passed"
        return 0
    else
        log_error "MCP server health check failed"
        return 1
    fi
}

# Detect active development servers
detect_active_servers() {
    log_info "Detecting active development servers..."
    
    # Use MCP port detection for intelligence
    cat << 'EOF' | node "$MCP_SERVER_SCRIPT" 2>/dev/null || echo "Port detection fallback needed"
const { ProjectContext } = require('./dist/types/project.js');
const { detectActivePortMCP } = require('./dist/tools/index.js');

async function detectPorts() {
    try {
        const context = { projectRoot: process.cwd(), environment: 'auto', developmentContext: 'mixed' };
        const result = await detectActivePortMCP({ scanPorts: true, includeHealth: true }, context);
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Port detection error:', error.message);
        process.exit(1);
    }
}

detectPorts();
EOF
}

# Start development server using MCP intelligence
start_dev_server() {
    local port="$1"
    local enhanced="$2"
    local environment="$3"
    
    log_info "Starting development server with MCP intelligence..."
    log_info "Environment: $environment | Enhanced: $enhanced | Port: ${port:-auto}"
    
    # Construct MCP command for starting dev server
    local mcp_params="{\"port\": ${port:-null}, \"enhanced\": $enhanced, \"action\": \"start\", \"environment\": \"$environment\"}"
    
    log_info "Using MCP startDevServerMCP tool for intelligent server startup..."
    
    # Execute via MCP server with timeout handling
    timeout 300 node -e "
const { ProjectContext } = require('$MCP_SERVER_DIR/dist/types/project.js');
const { startDevServerMCP } = require('$MCP_SERVER_DIR/dist/tools/index.js');

async function startServer() {
    try {
        const context = { 
            projectRoot: '$PROJECT_ROOT', 
            environment: '$environment', 
            developmentContext: 'mixed' 
        };
        const params = $mcp_params;
        
        console.log('🚀 MCP Development Server Startup');
        console.log('================================');
        console.log('Using Phase 4 MCP-Primary intelligence...');
        console.log('');
        
        const result = await startDevServerMCP(params, context);
        
        if (result.content && result.content[0]) {
            console.log(result.content[0].text);
        }
        
        if (result.isError) {
            console.error('❌ MCP server startup failed');
            process.exit(1);
        } else {
            console.log('✅ MCP development server started successfully');
        }
    } catch (error) {
        console.error('💥 MCP startup error:', error.message);
        console.log('');
        console.log('🔄 Fallback: Using standard npm run dev...');
        
        // Fallback to standard npm command
        const { spawn } = require('child_process');
        const child = spawn('npm', ['run', 'dev'], { 
            stdio: 'inherit', 
            cwd: '$PROJECT_ROOT'
        });
        
        child.on('exit', (code) => {
            process.exit(code);
        });
    }
}

startServer();
" || {
        log_warning "MCP startup timed out or failed, falling back to npm run dev"
        cd "$PROJECT_ROOT"
        npm run dev
    }
}

# Get development server status
get_server_status() {
    log_info "Checking development server status..."
    
    # Use MCP port detection to check status
    detect_active_servers
    
    # Check common ports
    local ports=(3000 3001 4000)
    local found_server=false
    
    for port in "${ports[@]}"; do
        if lsof -i ":$port" >/dev/null 2>&1; then
            local process_info=$(lsof -i ":$port" -t | head -1)
            if [[ -n "$process_info" ]]; then
                log_success "Development server found on port $port (PID: $process_info)"
                found_server=true
                
                # Test server health
                if curl -s -o /dev/null -w "%{http_code}" "http://localhost:$port" | grep -q "200"; then
                    log_success "Server is responding correctly"
                else
                    log_warning "Server found but not responding to HTTP requests"
                fi
            fi
        fi
    done
    
    if [[ "$found_server" == false ]]; then
        log_warning "No development server detected"
        return 1
    fi
    
    return 0
}

# Stop development server
stop_dev_server() {
    log_info "Stopping development server..."
    
    # Find and kill Next.js development processes
    if pgrep -f "next-server" >/dev/null; then
        log_info "Stopping Next.js development server..."
        pkill -f "next-server"
        sleep 2
    fi
    
    if pgrep -f "npm run dev" >/dev/null; then
        log_info "Stopping npm dev processes..."
        pkill -f "npm run dev"
        sleep 2
    fi
    
    # Check if servers are stopped
    if get_server_status >/dev/null 2>&1; then
        log_warning "Some development processes may still be running"
    else
        log_success "Development server stopped successfully"
    fi
}

# Restart development server
restart_dev_server() {
    log_info "Restarting development server..."
    stop_dev_server
    sleep 3
    start_dev_server "$1" "$2" "$3"
}

# Main function
main() {
    local action="start"
    local port=""
    local enhanced=false
    local environment="auto"
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --port)
                port="$2"
                shift 2
                ;;
            --enhanced)
                enhanced=true
                shift
                ;;
            --environment)
                environment="$2"
                shift 2
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            start|status|stop|restart|health)
                action="$1"
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Header
    echo
    log_info "Tyler Gohr Portfolio - MCP Primary Development Server"
    log_info "Phase 4 'MCP-Primary Transition' - Intelligent Development Automation"
    echo
    
    # Ensure we're in the project root
    cd "$PROJECT_ROOT"
    
    # Check MCP server
    check_mcp_server
    
    # Execute action
    case $action in
        start)
            start_dev_server "$port" "$enhanced" "$environment"
            ;;
        status)
            get_server_status
            ;;
        stop)
            stop_dev_server
            ;;
        restart)
            restart_dev_server "$port" "$enhanced" "$environment"
            ;;
        health)
            test_mcp_health
            ;;
        *)
            log_error "Unknown action: $action"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"