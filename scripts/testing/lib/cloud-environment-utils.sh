#!/bin/bash

# Cloud Environment Detection Utilities
# Shared functions for detecting cloud development environments
# and constructing appropriate URLs for testing

# Detect the current development environment
detect_environment() {
    if [[ "$GOOGLE_CLOUD_WORKSTATIONS" == "true" ]]; then
        echo "google-cloud-workstations"
    elif [[ -n "$CODESPACE_NAME" ]]; then
        echo "github-codespaces"
    elif [[ -n "$GITPOD_WORKSPACE_ID" ]]; then
        echo "gitpod"
    else
        echo "local"
    fi
}

# Construct localhost URL for all environments (localhost-first strategy)
construct_test_url() {
    local port="$1"
    local path="${2:-/}"
    
    # Always return localhost URL for reliable testing and development
    # This eliminates authentication issues and provides consistent behavior
    # across all cloud environments while maintaining compatibility with VS Code tasks
    echo "http://localhost:${port}${path}"
}

# Test server connectivity (optimized for localhost)
test_server_connectivity() {
    local port="$1"
    local timeout="${2:-5}"
    local environment=$(detect_environment)
    local test_url=$(construct_test_url "$port")
    
    echo "   🔍 Testing connectivity to: $test_url"
    echo "   🌐 Environment: $environment (using localhost)"
    
    # Always use HTTP for localhost (fast and reliable)
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$timeout" "$test_url" 2>/dev/null || echo "000")
    
    echo "     Status code: $status_code"
    
    # Check if status code indicates a working server
    if [[ "$status_code" =~ ^[2-3][0-9][0-9]$ ]]; then
        # 2xx = success, 3xx = redirect
        return 0
    else
        return 1
    fi
}

# Get server response content for validation (optimized for localhost)
get_server_response() {
    local port="$1"
    local path="${2:-/}"
    local timeout="${3:-5}"
    local test_url=$(construct_test_url "$port" "$path")
    
    # Always use HTTP for localhost (fast and reliable)
    curl -s --max-time "$timeout" "$test_url" 2>/dev/null || echo ""
}

# Get server headers for validation (optimized for localhost)
get_server_headers() {
    local port="$1"
    local path="${2:-/}"
    local timeout="${3:-5}"
    local test_url=$(construct_test_url "$port" "$path")
    
    # Always use HTTP for localhost (fast and reliable)
    curl -s -I --max-time "$timeout" "$test_url" 2>/dev/null || echo ""
}

# Enhanced Next.js server validation for cloud environments
validate_nextjs_server_cloud() {
    local port="$1"
    local timeout="${2:-5}"
    local environment=$(detect_environment)
    
    echo "   🧪 Validating Next.js server on port $port (env: $environment)..."
    
    # Test basic connectivity first
    if ! test_server_connectivity "$port" "$timeout"; then
        echo "     ❌ Server not responding"
        return 1
    fi
    
    # Multi-endpoint validation strategy (cloud-aware)
    local endpoints=("/" "/_next/static" "/favicon.ico")
    if [[ "$environment" == "local" ]]; then
        endpoints+=("/api/health")  # Only test API routes in local environment
    fi
    local validation_score=0
    local indicators_found=()
    
    echo "   Checking endpoints for Next.js indicators..."
    
    for endpoint in "${endpoints[@]}"; do
        echo "   📡 Testing endpoint: $endpoint"
        
        local response=$(get_server_response "$port" "$endpoint" "$timeout")
        local headers=$(get_server_headers "$port" "$endpoint" "$timeout")
        
        # Score based on Next.js indicators
        if [[ "$headers" =~ [Xx]-[Pp]owered-[Bb]y.*[Nn]ext ]]; then
            ((validation_score += 10))
            indicators_found+=("X-Powered-By: Next.js header")
            echo "     ✅ X-Powered-By: Next.js header (+10 points)"
        fi
        
        if [[ "$response" =~ __next|_next/static|__NEXT_DATA__ ]]; then
            ((validation_score += 5))
            indicators_found+=("Next.js content indicators")
            echo "     ✅ Next.js content indicators (+5 points)"
        fi
        
        if [[ "$headers" =~ [Ss]erver.*next ]]; then
            ((validation_score += 5))
            indicators_found+=("Next.js server header")
            echo "     ✅ Next.js server header (+5 points)"
        fi
        
        # Check for React development indicators
        if [[ "$response" =~ __NEXT_DATA__|_next/static|react-refresh ]]; then
            ((validation_score += 3))
            indicators_found+=("React development indicators")
            echo "     ✅ React development indicators (+3 points)"
        fi
        
        # In cloud environments, also check process information  
        if [[ "$environment" != "local" ]]; then
            # Check for Next.js processes on this port (handles both IPv4 and IPv6)
            local process_info=$(netstat -tlnp 2>/dev/null | grep ":$port " | head -1)
            if [[ "$process_info" =~ next-server|node ]]; then
                ((validation_score += 7))
                indicators_found+=("Next.js process on port")
                echo "     ✅ Next.js process detected on port (+7 points)"
            elif [[ -n "$process_info" ]] && netstat -tlnp 2>/dev/null | grep ":$port " | grep -q "LISTEN"; then
                ((validation_score += 3))
                indicators_found+=("Active server process on port")
                echo "     ✅ Active server process on port (+3 points)"
            fi
        fi
        
        echo "     Current validation score: $validation_score"
        
        # Accept server if validation score is high enough (cloud-aware thresholds)
        local required_score=10
        if [[ "$environment" != "local" ]]; then
            required_score=5  # Lower threshold for cloud environments
        fi
        
        if [[ $validation_score -ge $required_score ]]; then
            echo "     🎯 Validation threshold reached!"
            break
        fi
    done
    
    # Final validation with cloud-aware threshold
    local required_score=10
    if [[ "$environment" != "local" ]]; then
        required_score=5  # Lower threshold for cloud environments
    fi
    
    echo ""
    echo "   📊 Final validation results:"
    echo "     Score: $validation_score (threshold: $required_score)"
    echo "     Environment: $environment"
    echo "     Indicators found: ${#indicators_found[@]}"
    for indicator in "${indicators_found[@]}"; do
        echo "       - $indicator"
    done
    
    if [[ $validation_score -ge $required_score ]]; then
        echo "   ✅ Next.js server validation PASSED"
        return 0
    else
        echo "   ❌ Next.js server validation FAILED (insufficient score)"
        return 1
    fi
}

# Print environment information
print_environment_info() {
    local environment=$(detect_environment)
    echo "🌐 Cloud Environment Detection"
    echo "-----------------------------"
    echo "Environment: $environment"
    echo "Hostname: $(hostname)"
    
    case "$environment" in
        "google-cloud-workstations")
            echo "Google Cloud Workstations detected"
            echo "Preview URL format: https://PORT-$(hostname).cluster-cbx7armcmnaqcxcx5fojjql2bo.cloudworkstations.dev"
            ;;
        "github-codespaces")
            echo "GitHub Codespaces detected"
            echo "Codespace: $CODESPACE_NAME"
            ;;
        "gitpod")
            echo "Gitpod detected"
            echo "Workspace: $GITPOD_WORKSPACE_ID"
            ;;
        "local")
            echo "Local development environment"
            echo "Using localhost URLs"
            ;;
    esac
    echo ""
}

# Export functions for use in other scripts
export -f detect_environment
export -f construct_test_url
export -f test_server_connectivity
export -f get_server_response
export -f get_server_headers
export -f validate_nextjs_server_cloud
export -f print_environment_info