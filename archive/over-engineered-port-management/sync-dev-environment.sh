#!/bin/bash

# Environment Variable Synchronization Script
# Ensures ACTIVE_DEV_PORT and ACTIVE_DEV_URL are correctly set across all development contexts

set -e

# Function to detect and set environment variables
sync_environment() {
    local action="${1:-detect}"
    local force_port="${2:-}"
    
    echo "🔄 Synchronizing development environment variables..."
    
    # If force port is provided, use it
    if [[ -n "$force_port" ]]; then
        echo "🎯 Using forced port: $force_port"
        export ACTIVE_DEV_PORT="$force_port"
        
        # Construct URL based on environment
        if [[ -n "$CLOUDWORKSTATIONS_REGION" ]]; then
            export ACTIVE_DEV_URL="https://${force_port}-tylergohr.cluster-${CLOUDWORKSTATIONS_REGION}.cloudworkstations.dev"
        elif [[ -n "$CODESPACE_NAME" ]]; then
            export ACTIVE_DEV_URL="https://${CODESPACE_NAME}-${force_port}.preview.app.github.dev"
        elif [[ -n "$GITPOD_WORKSPACE_URL" ]]; then
            workspace_id=$(echo "$GITPOD_WORKSPACE_URL" | sed 's/https:\/\///')
            export ACTIVE_DEV_URL="https://${force_port}-${workspace_id}"
        else
            export ACTIVE_DEV_URL="http://localhost:${force_port}"
        fi
        
        echo "✅ Environment variables set:"
        echo "   ACTIVE_DEV_PORT=$ACTIVE_DEV_PORT"
        echo "   ACTIVE_DEV_URL=$ACTIVE_DEV_URL"
        return 0
    fi
    
    # Try to detect existing server
    echo "🔍 Scanning for active development servers..."
    
    # Check netstat for both IPv4 and IPv6
    if command -v netstat >/dev/null 2>&1; then
        # Look for Next.js servers on common ports
        local netstat_output
        netstat_output=$(netstat -tlnp 2>/dev/null || true)
        
        # Parse both IPv4 and IPv6 patterns
        local found_port found_pid
        
        # IPv6 pattern (:::3000)
        if [[ "$netstat_output" =~ :::([0-9]{4})[[:space:]]+.*LISTEN[[:space:]]+([0-9]+)/ ]]; then
            found_port="${BASH_REMATCH[1]}"
            found_pid="${BASH_REMATCH[2]}"
        # IPv4 pattern (:3000 or 127.0.0.1:3000)
        elif [[ "$netstat_output" =~ :([0-9]{4})[[:space:]]+.*LISTEN[[:space:]]+([0-9]+)/ ]]; then
            found_port="${BASH_REMATCH[1]}"
            found_pid="${BASH_REMATCH[2]}"
        fi
        
        if [[ -n "$found_port" && -n "$found_pid" ]]; then
            # Verify it's a Next.js process
            local process_info
            process_info=$(ps -p "$found_pid" -o cmd --no-headers 2>/dev/null || true)
            
            if [[ "$process_info" =~ (next|dev) ]]; then
                echo "✅ Found Next.js server on port $found_port (PID: $found_pid)"
                
                # Test if port is responding
                local test_url="http://localhost:${found_port}"
                if curl -s -o /dev/null -w "%{http_code}" "$test_url" | grep -q "200"; then
                    sync_environment "force" "$found_port"
                    echo "🎯 Server is healthy and responding"
                    return 0
                else
                    echo "⚠️  Port $found_port found but not responding to HTTP requests"
                fi
            fi
        fi
    fi
    
    # Fallback: Check common development ports directly
    echo "🔍 Testing common development ports..."
    local common_ports=(3000 3001 3002 4000 4001)
    
    for port in "${common_ports[@]}"; do
        local test_url="http://localhost:${port}"
        if curl -s -o /dev/null -w "%{http_code}" "$test_url" | grep -q "200"; then
            echo "✅ Found responding server on port $port"
            sync_environment "force" "$port"
            return 0
        fi
    done
    
    echo "❌ No active development server found"
    echo "💡 Start a server with: npm run dev"
    return 1
}

# Function to export environment variables for shell use
export_environment() {
    if [[ -n "$ACTIVE_DEV_PORT" && -n "$ACTIVE_DEV_URL" ]]; then
        echo "export ACTIVE_DEV_PORT=\"$ACTIVE_DEV_PORT\""
        echo "export ACTIVE_DEV_URL=\"$ACTIVE_DEV_URL\""
    else
        echo "# No active development server environment variables found"
    fi
}

# Function to validate current environment
validate_environment() {
    echo "🔍 Current environment status:"
    echo "   ACTIVE_DEV_PORT: ${ACTIVE_DEV_PORT:-not set}"
    echo "   ACTIVE_DEV_URL: ${ACTIVE_DEV_URL:-not set}"
    
    if [[ -n "$ACTIVE_DEV_PORT" ]]; then
        echo "🧪 Testing server health..."
        if curl -s -o /dev/null -w "%{http_code}" "$ACTIVE_DEV_URL" | grep -q "200"; then
            echo "✅ Server is healthy and responding"
            return 0
        else
            echo "❌ Server not responding - environment variables may be stale"
            return 1
        fi
    else
        echo "ℹ️  No environment variables set"
        return 1
    fi
}

# Main script logic
main() {
    local command="${1:-sync}"
    
    case "$command" in
        "sync"|"detect")
            sync_environment
            ;;
        "export")
            sync_environment >/dev/null 2>&1 || true
            export_environment
            ;;
        "validate"|"check")
            validate_environment
            ;;
        "force")
            local port="${2:-3000}"
            sync_environment "force" "$port"
            ;;
        "help"|"-h"|"--help")
            echo "Environment Variable Synchronization Script"
            echo ""
            echo "Usage: $0 [command] [options]"
            echo ""
            echo "Commands:"
            echo "  sync, detect     - Detect and set environment variables (default)"
            echo "  export          - Output shell export commands"
            echo "  validate, check - Check current environment status"
            echo "  force <port>    - Force specific port (default: 3000)"
            echo "  help            - Show this help"
            echo ""
            echo "Examples:"
            echo "  $0                              # Detect and sync"
            echo "  eval \"\$($0 export)\"            # Set in current shell"
            echo "  $0 validate                     # Check current status"
            echo "  $0 force 3001                   # Force port 3001"
            ;;
        *)
            echo "❌ Unknown command: $command"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi