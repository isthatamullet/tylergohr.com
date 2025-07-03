#!/bin/bash

# Active Port Detection Script
# Detects the actual running dev server port and sets environment variables

set -e

# Function to detect active dev server port
detect_active_port() {
    local detected_port=""
    
    echo "🔍 Scanning for active development server..." >&2
    
    # Check common Next.js ports
    for port in 3000 3001 3002 3003 3004 3005; do
        if curl -s -o /dev/null -w "%{http_code}" --max-time 2 "http://localhost:$port" | grep -q "200"; then
            # Verify it's actually a Next.js server by checking for Next.js indicators
            if curl -s --max-time 2 "http://localhost:$port" | grep -q "next\|_next\|__next" 2>/dev/null; then
                detected_port="$port"
                echo "✅ Found Next.js dev server on port $port" >&2
                break
            fi
        fi
    done
    
    if [ -z "$detected_port" ]; then
        echo "❌ No active development server found" >&2
        echo "💡 Start dev server with: npm run dev" >&2
        return 1
    fi
    
    echo "$detected_port"
    return 0
}

# Function to update environment files
update_environment() {
    local port="$1"
    
    # Update .env.local
    local env_file="/home/user/tylergohr.com/.env.local"
    
    if [ -f "$env_file" ]; then
        # Remove existing ACTIVE_DEV_PORT line
        sed -i '/^ACTIVE_DEV_PORT=/d' "$env_file"
    fi
    
    # Add current active port
    echo "ACTIVE_DEV_PORT=$port" >> "$env_file"
    echo "📝 Updated .env.local with ACTIVE_DEV_PORT=$port"
    
    # Export for current session
    export ACTIVE_DEV_PORT="$port"
    echo "🔧 Exported ACTIVE_DEV_PORT=$port for current session"
}

# Function to update hook cache
update_hook_cache() {
    local port="$1"
    local cache_file="/home/user/.claude/hooks/active-port.cache"
    local cache_dir=$(dirname "$cache_file")
    
    # Create cache directory if it doesn't exist
    mkdir -p "$cache_dir"
    
    # Create cache entry
    cat > "$cache_file" << EOF
{
  "port": $port,
  "timestamp": $(date +%s),
  "validation_url": "http://localhost:$port",
  "operation_context": "active_detection",
  "process_info": {
    "pid": $(lsof -t -i :$port 2>/dev/null | head -1),
    "process_name": "$(ps -p $(lsof -t -i :$port 2>/dev/null | head -1) -o comm= 2>/dev/null)"
  }
}
EOF
    
    echo "💾 Updated hook cache with port $port"
}

# Function to validate port is working
validate_port() {
    local port="$1"
    
    echo "🧪 Validating port $port..."
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "http://localhost:$port")
    
    if [ "$status_code" = "200" ]; then
        echo "✅ Port $port is responding correctly (HTTP $status_code)"
        return 0
    else
        echo "❌ Port $port validation failed (HTTP $status_code)"
        return 1
    fi
}

# Main execution
main() {
    echo "🚀 Active Port Detection Script"
    echo "================================"
    
    # Detect active port
    if detected_port=$(detect_active_port); then
        echo ""
        echo "🎯 Active port detected: $detected_port"
        
        # Validate the port
        if validate_port "$detected_port"; then
            # Update all configurations
            update_environment "$detected_port"
            update_hook_cache "$detected_port"
            
            echo ""
            echo "✅ Port detection complete!"
            echo "📋 Summary:"
            echo "   - Active Port: $detected_port"
            echo "   - Environment: Updated"
            echo "   - Hook Cache: Updated"
            echo "   - Status: Ready for testing"
            
            # Output for shell evaluation
            echo ""
            echo "🔧 To use in current shell:"
            echo "   export ACTIVE_DEV_PORT=$detected_port"
            
            return 0
        else
            echo "❌ Port validation failed"
            return 1
        fi
    else
        echo ""
        echo "❌ No active development server found"
        echo "💡 Next steps:"
        echo "   1. Start development server: npm run dev"
        echo "   2. Wait for server to start"
        echo "   3. Run this script again: ./scripts/detect-active-port.sh"
        return 1
    fi
}

# Execute main function
main "$@"