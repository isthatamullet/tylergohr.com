#!/bin/bash

# Minimal Context Detection for Hook System
# Simplified replacement for over-engineered context detection

# Simple context detection function
detect_development_context() {
    local file_path="${1:-$(pwd)}"
    
    # Simple path-based detection
    if [[ "$file_path" =~ /2/ ]]; then
        echo "redesign_2"
    else
        echo "main_portfolio"
    fi
}

# Export function for use in other scripts
export -f detect_development_context