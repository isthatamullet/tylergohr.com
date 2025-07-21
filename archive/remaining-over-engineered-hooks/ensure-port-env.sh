#!/bin/bash

# Environment Variable Persistence for Port Detection
# Ensures ACTIVE_DEV_PORT and ACTIVE_DEV_URL are always available for Playwright tests
# Called automatically by hook system and can be sourced manually

set -e

# Source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/hook-utils.sh"

# Environment persistence configuration
ENV_CACHE_DIR="$HOME/.claude/hooks"
ENV_CACHE_FILE="$ENV_CACHE_DIR/environment.cache"
ENV_TTL_SECONDS=1800  # 30 minutes

# Ensure cache directory exists
mkdir -p "$ENV_CACHE_DIR"

# Function to check if cached environment is valid
is_cached_env_valid() {
    if [[ ! -f "$ENV_CACHE_FILE" ]]; then
        return 1
    fi
    
    # Check if cache is expired
    local cache_timestamp=$(grep -o '"timestamp":[0-9]*' "$ENV_CACHE_FILE" 2>/dev/null | cut -d: -f2)
    if [[ -z "$cache_timestamp" ]]; then
        return 1
    fi
    
    local current_time=$(date +%s)
    local age=$((current_time - cache_timestamp))
    if [[ $age -gt $ENV_TTL_SECONDS ]]; then
        return 1
    fi
    
    return 0
}

# Function to load environment from cache
load_cached_environment() {
    if ! is_cached_env_valid; then
        return 1
    fi
    
    local cached_port=$(grep -o '"port":[[:space:]]*[0-9]*' "$ENV_CACHE_FILE" | sed 's/.*://' | tr -d ' ')
    local cached_url=$(grep -o '"url":"[^"]*"' "$ENV_CACHE_FILE" | cut -d'"' -f4)
    local cached_env=$(grep -o '"environment":"[^"]*"' "$ENV_CACHE_FILE" | cut -d'"' -f4)
    
    if [[ -n "$cached_port" && -n "$cached_url" ]]; then
        export ACTIVE_DEV_PORT="$cached_port"
        export ACTIVE_DEV_URL="$cached_url"
        log_info "Loaded cached environment: port=$cached_port, env=$cached_env"
        return 0
    fi
    
    return 1
}

# Function to save environment to cache
save_environment_cache() {
    local port="$1"
    local url="$2"
    local environment="$3"
    local timestamp=$(date +%s)
    
    cat > "$ENV_CACHE_FILE" << EOF
{
  "timestamp": $timestamp,
  "port": $port,
  "url": "$url",
  "environment": "$environment",
  "session": "$$"
}
EOF
    
    log_info "Cached environment: port=$port, env=$environment"
}

# Function to ensure environment variables are set
ensure_port_environment() {
    local force_refresh="${1:-false}"
    
    # If already set and not forcing refresh, return success
    if [[ -n "$ACTIVE_DEV_PORT" && -n "$ACTIVE_DEV_URL" && "$force_refresh" != "true" ]]; then
        log_info "Environment already set: port=$ACTIVE_DEV_PORT"
        return 0
    fi
    
    # Try to load from cache first
    if [[ "$force_refresh" != "true" ]] && load_cached_environment; then
        return 0
    fi
    
    log_info "Detecting active development server environment..."
    
    # Source port detection utilities
    if [[ -f "$SCRIPT_DIR/lib/port-detection-utils.sh" ]]; then
        source "$SCRIPT_DIR/lib/port-detection-utils.sh"
        
        # Clear and detect fresh
        unset ACTIVE_DEV_PORT ACTIVE_DEV_URL
        
        if get_active_port "testing"; then
            local detected_port="$ACTIVE_DEV_PORT"
            local detected_url="$ACTIVE_DEV_URL"
            local environment=$(detect_environment 2>/dev/null || echo "unknown")
            
            # Clean the port value if it contains logging
            if [[ "$detected_port" =~ [0-9]+$ ]]; then
                detected_port=$(echo "$detected_port" | grep -o '[0-9]*$' | tail -1)
            fi
            
            # Clean the URL value if it contains logging
            if [[ "$detected_url" =~ https://[0-9]+-[^/]+\.cloudworkstations\.dev/ ]]; then
                detected_url=$(echo "$detected_url" | grep -oE 'https://[0-9]+-[^/]+\.cloudworkstations\.dev/' | head -1)
            fi
            
            # Set clean values
            export ACTIVE_DEV_PORT="$detected_port"
            export ACTIVE_DEV_URL="$detected_url"
            
            # Cache for future use
            save_environment_cache "$detected_port" "$detected_url" "$environment"
            
            log_info "Environment detection successful: port=$detected_port"
            log_info "Server URL: $detected_url"
            return 0
        else
            log_warning "Failed to detect active development server"
            return 1
        fi
    else
        log_error "Port detection utilities not found"
        return 1
    fi
}

# Function to clear environment cache
clear_environment_cache() {
    if [[ -f "$ENV_CACHE_FILE" ]]; then
        rm -f "$ENV_CACHE_FILE"
        log_info "Environment cache cleared"
    fi
    unset ACTIVE_DEV_PORT ACTIVE_DEV_URL
}

# Function to show environment status
show_environment_status() {
    echo "=== Environment Status ==="
    echo "ACTIVE_DEV_PORT: ${ACTIVE_DEV_PORT:-not set}"
    echo "ACTIVE_DEV_URL: ${ACTIVE_DEV_URL:-not set}"
    echo "Cache file: $ENV_CACHE_FILE"
    echo "Cache exists: $([ -f "$ENV_CACHE_FILE" ] && echo "yes" || echo "no")"
    if [[ -f "$ENV_CACHE_FILE" ]]; then
        echo "Cache content:"
        cat "$ENV_CACHE_FILE" 2>/dev/null | sed 's/^/  /'
    fi
    echo "========================="
}

# Main function - call when script is executed directly
main() {
    case "${1:-ensure}" in
        "ensure")
            ensure_port_environment
            ;;
        "refresh")
            ensure_port_environment "true"
            ;;
        "clear")
            clear_environment_cache
            ;;
        "status")
            show_environment_status
            ;;
        *)
            echo "Usage: $0 {ensure|refresh|clear|status}"
            echo "  ensure  - Ensure environment variables are set (use cache if valid)"
            echo "  refresh - Force refresh environment detection"
            echo "  clear   - Clear environment cache"
            echo "  status  - Show current environment status"
            exit 1
            ;;
    esac
}

# Export functions for sourcing
export -f ensure_port_environment
export -f load_cached_environment
export -f save_environment_cache
export -f clear_environment_cache
export -f show_environment_status

# Auto-execute if called directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi