#!/bin/bash

# Claude Code Post-Dev-Server-Start Hook
# Updates port cache after dev server starts

set -e

# Source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/hook-utils.sh"
source "$SCRIPT_DIR/lib/port-detection-utils.sh"

# Parse command line arguments
TOOL_NAME="${1:-unknown}"
TOOL_ARGS="${2:-}"

# Initialize hook execution
log_hook_start "POST_DEV_SERVER_START" "port_cache_update"

# Only run for dev server commands
if [[ "$TOOL_ARGS" =~ npm.*dev|yarn.*dev|pnpm.*dev ]]; then
    log_info "🚀 Dev server start detected - updating port cache..."
    
    # Wait for dev server to start
    sleep 3
    
    # Detect and cache the actual port
    for port in 3000 3001 3002 3003 3004; do
        if curl -s -o /dev/null -w "%{http_code}" --max-time 2 "http://localhost:$port" | grep -q "200"; then
            log_info "✅ Found dev server on port $port"
            
            # Update port cache
            cache_active_port "$port" "post_dev_start"
            
            log_success "🎯 Port cache updated: $port"
            break
        fi
    done
    
    log_success "✅ POST_DEV_SERVER_START completed successfully"
else
    log_info "⚡ Skipping - not a dev server command"
fi

exit 0