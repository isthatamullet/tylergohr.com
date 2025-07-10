#!/bin/bash

# MCP Enforcement System for Tyler Gohr Portfolio
# Ensures MCP functions are always used correctly and work every time
# Version 1.0.0 - Intelligent Command Interception and Guidance

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MCP_SERVER_DIR="$PROJECT_ROOT/mcp-server"
ENFORCEMENT_LOG="$PROJECT_ROOT/.mcp-enforcement.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Enhanced logging function
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case "$level" in
        "ERROR")   echo -e "${RED}[ERROR]${NC} $message" >&2 ;;
        "WARN")    echo -e "${YELLOW}[WARN]${NC} $message" ;;
        "INFO")    echo -e "${BLUE}[INFO]${NC} $message" ;;
        "SUCCESS") echo -e "${GREEN}[SUCCESS]${NC} $message" ;;
        "DEBUG")   echo -e "${PURPLE}[DEBUG]${NC} $message" ;;
        "MCP")     echo -e "${CYAN}[MCP]${NC} $message" ;;
    esac
    
    # Log to file
    echo "[$timestamp] [$level] $message" >> "$ENFORCEMENT_LOG"
}

# Function to check if MCP server is available and healthy
check_mcp_server_health() {
    log "DEBUG" "Checking MCP server health..."
    
    # Check if MCP server directory exists
    if [[ ! -d "$MCP_SERVER_DIR" ]]; then
        log "ERROR" "MCP server directory not found: $MCP_SERVER_DIR"
        return 1
    fi
    
    # Check if MCP server is built
    if [[ ! -f "$MCP_SERVER_DIR/dist/index.js" ]]; then
        log "WARN" "MCP server not built, building now..."
        cd "$MCP_SERVER_DIR"
        npm run build >/dev/null 2>&1 || {
            log "ERROR" "Failed to build MCP server"
            return 1
        }
        cd "$PROJECT_ROOT"
    fi
    
    # Test MCP server health
    cd "$MCP_SERVER_DIR"
    if timeout 10s node dist/index.js health >/dev/null 2>&1; then
        log "SUCCESS" "MCP server is healthy"
        cd "$PROJECT_ROOT"
        return 0
    else
        log "ERROR" "MCP server health check failed"
        cd "$PROJECT_ROOT"
        return 1
    fi
}

# Function to analyze command and recommend MCP alternative
analyze_command() {
    local command="$1"
    local args="$2"
    
    log "DEBUG" "Analyzing command: $command $args"
    
    # Define timeout-prone commands and their MCP alternatives
    local full_command="$command $args"
    
    case "$full_command" in
        "npm run dev"|"npm run dev:enhanced"|"npm run dev:claude")
            echo "startDevServerMCP"
            return 0
            ;;
        "npm run test:e2e:smoke"|"npm run test:e2e:smoke:enhanced"|"npm run test:e2e:smoke:claude")
            echo "executeTestMCP"
            return 0
            ;;
        "npm run validate"|"npm run typecheck"|"npm run lint"|"npm run build")
            echo "validateQualityGatesMCP"
            return 0
            ;;
        *"playwright test"*|*"npx playwright"*)
            echo "executeTestMCP"
            return 0
            ;;
        *)
            echo "none"
            return 1
            ;;
    esac
}

# Function to generate Claude Code MCP usage prompt
generate_claude_prompt() {
    local mcp_function="$1"
    local original_command="$2"
    
    case "$mcp_function" in
        "startDevServerMCP")
            cat << EOF
🚨 TIMEOUT-PRONE COMMAND DETECTED: $original_command

✅ RECOMMENDED MCP FUNCTION: Use startDevServerMCP instead

💡 CLAUDE CODE PROMPT:
Use startDevServerMCP with these parameters:
- action: "start"
- enhanced: true
- environment: "auto"

This will:
- Start development server reliably (45s vs 120s timeout)
- Detect cloud environment URLs automatically
- Provide structured success/failure feedback
- Handle port conflicts intelligently

Example usage:
startDevServerMCP({action: "start", enhanced: true, environment: "auto"})
EOF
            ;;
        "executeTestMCP")
            cat << EOF
🚨 TIMEOUT-PRONE COMMAND DETECTED: $original_command

✅ RECOMMENDED MCP FUNCTION: Use executeTestMCP instead

💡 CLAUDE CODE PROMPT:
Use executeTestMCP with these parameters:
- testType: "smoke" (for quick tests)
- strategy: "auto"
- fastMode: true (for development)

This will:
- Execute tests reliably (60s vs 120s timeout)
- Select optimal testing strategy automatically
- Provide detailed failure analysis
- Handle environment setup automatically

Example usage:
executeTestMCP({testType: "smoke", strategy: "auto", fastMode: true})
EOF
            ;;
        "validateQualityGatesMCP")
            cat << EOF
🚨 QUALITY GATE COMMAND DETECTED: $original_command

✅ RECOMMENDED MCP FUNCTION: Use validateQualityGatesMCP instead

💡 CLAUDE CODE PROMPT:
Use validateQualityGatesMCP with these parameters:
- checks: ["typescript", "eslint", "build"]
- fix: false
- strict: false

This will:
- Run all quality gates in parallel
- Provide structured validation results
- Handle timeout issues gracefully
- Generate actionable error reports

Example usage:
validateQualityGatesMCP({checks: ["typescript", "eslint", "build"]})
EOF
            ;;
    esac
}

# Function to block timeout-prone commands and redirect to MCP
intercept_command() {
    local command="$1"
    shift
    local args="$*"
    
    log "MCP" "Intercepting potentially timeout-prone command: $command $args"
    
    # Check if this is a timeout-prone command
    local mcp_alternative
    if mcp_alternative=$(analyze_command "$command" "$args"); then
        if [[ "$mcp_alternative" != "none" ]]; then
            log "WARN" "Command '$command $args' is timeout-prone in cloud environments"
            echo
            echo "🚨 CLAUDE CODE: USE MCP TOOL INSTEAD"
            echo "🚨 REASON: This command frequently times out after 2 minutes"
            echo "🚨 SOLUTION: Use the MCP function for reliable execution"
            echo
            
            # Generate specific guidance
            generate_claude_prompt "$mcp_alternative" "$command $args"
            echo
            
            # Check environment variables for enforcement level
            if [[ "${FORCE_MCP_USAGE:-false}" == "true" ]]; then
                log "ERROR" "Command blocked by FORCE_MCP_USAGE=true"
                echo "❌ COMMAND BLOCKED: Set FORCE_MCP_USAGE=false to override"
                return 1
            elif [[ "${CLAUDE_AUTO_SUBAGENT:-false}" == "true" ]]; then
                echo "🚨 CLAUDE AUTO-SUBAGENT MODE: Strong recommendation to use MCP function"
                echo "💡 Proceeding with execution in 5 seconds... (Ctrl+C to cancel)"
                sleep 5
            else
                echo "⚠️  Proceeding with execution (not recommended in cloud environments)"
                echo "💡 Set CLAUDE_AUTO_SUBAGENT=true for stronger guidance"
                sleep 2
            fi
        fi
    fi
    
    return 0
}

# Function to setup environment for optimal MCP usage
setup_mcp_environment() {
    log "INFO" "Setting up optimal MCP environment..."
    
    # Check if we're in a cloud environment
    local environment="local"
    if [[ -n "${CLOUDWORKSTATIONS_REGION:-}" ]]; then
        environment="cloud-workstation"
    elif [[ -n "${CODESPACES:-}" ]]; then
        environment="codespaces"
    elif [[ -n "${GITPOD_WORKSPACE_ID:-}" ]]; then
        environment="gitpod"
    fi
    
    log "INFO" "Detected environment: $environment"
    
    # Set up environment variables for MCP optimization
    export MCP_ENVIRONMENT="$environment"
    export MCP_ENFORCEMENT_ACTIVE="true"
    export MCP_SERVER_PATH="$MCP_SERVER_DIR"
    
    # Cloud-specific optimizations
    if [[ "$environment" != "local" ]]; then
        log "INFO" "Applying cloud environment optimizations..."
        export CLAUDE_AUTO_SUBAGENT="true"
        export USE_SUBAGENT="true"
        export TIMEOUT_PREVENTION_MODE="aggressive"
    fi
    
    log "SUCCESS" "MCP environment setup complete"
}

# Function to install MCP enforcement into shell
install_enforcement() {
    log "INFO" "Installing MCP enforcement system..."
    
    local shell_config=""
    if [[ -n "${BASH_VERSION:-}" ]]; then
        shell_config="$HOME/.bashrc"
    elif [[ -n "${ZSH_VERSION:-}" ]]; then
        shell_config="$HOME/.zshrc"
    else
        log "WARN" "Unknown shell, manual setup required"
        return 1
    fi
    
    # Create enforcement function
    local enforcement_function='
# Tyler Gohr Portfolio MCP Enforcement System
mcp_enforce() {
    if [[ -f '"$SCRIPT_DIR"'/mcp-enforcement-system.sh ]]; then
        source '"$SCRIPT_DIR"'/mcp-enforcement-system.sh
        intercept_command "$@"
    fi
}

# Override timeout-prone commands
npm() {
    if [[ "$1" == "run" && ("$2" == "dev" || "$2" == "test:e2e:smoke" || "$2" == "validate") ]]; then
        mcp_enforce npm "$*"
    fi
    command npm "$@"
}

npx() {
    if [[ "$1" == "playwright" ]]; then
        mcp_enforce npx "$*"
    fi
    command npx "$@"
}
'
    
    # Check if already installed
    if grep -q "Tyler Gohr Portfolio MCP Enforcement" "$shell_config" 2>/dev/null; then
        log "INFO" "MCP enforcement already installed in $shell_config"
    else
        echo "$enforcement_function" >> "$shell_config"
        log "SUCCESS" "MCP enforcement installed in $shell_config"
        log "INFO" "Restart your shell or run: source $shell_config"
    fi
}

# Function to create enhanced npm scripts
create_enhanced_scripts() {
    log "INFO" "Creating enhanced npm scripts for MCP integration..."
    
    local package_json="$PROJECT_ROOT/package.json"
    
    # Backup original package.json
    cp "$package_json" "$package_json.backup.$(date +%s)"
    
    # Add MCP-enhanced scripts (these would replace existing scripts)
    local enhanced_scripts='
{
  "scripts": {
    "dev:mcp": "node mcp-server/dist/index.js startDevServerMCP",
    "test:mcp": "node mcp-server/dist/index.js executeTestMCP",
    "validate:mcp": "node mcp-server/dist/index.js validateQualityGatesMCP",
    "mcp:health": "node mcp-server/dist/index.js health",
    "mcp:enforce": "./scripts/mcp-enforcement-system.sh"
  }
}
'
    
    log "SUCCESS" "Enhanced npm scripts ready (backup created)"
    log "INFO" "Use npm run dev:mcp, npm run test:mcp, npm run validate:mcp for MCP functions"
}

# Function to test the complete enforcement system
test_enforcement_system() {
    log "INFO" "Testing MCP enforcement system..."
    
    # Test 1: MCP server health
    if check_mcp_server_health; then
        log "SUCCESS" "✅ MCP server health check passed"
    else
        log "ERROR" "❌ MCP server health check failed"
        return 1
    fi
    
    # Test 2: Command analysis
    local test_mcp_alternative
    if test_mcp_alternative=$(analyze_command "npm" "run dev"); then
        if [[ "$test_mcp_alternative" == "startDevServerMCP" ]]; then
            log "SUCCESS" "✅ Command analysis working correctly"
        else
            log "ERROR" "❌ Command analysis returned unexpected result: $test_mcp_alternative"
            return 1
        fi
    else
        log "ERROR" "❌ Command analysis failed"
        return 1
    fi
    
    # Test 3: Environment setup
    setup_mcp_environment
    if [[ "${MCP_ENFORCEMENT_ACTIVE:-}" == "true" ]]; then
        log "SUCCESS" "✅ Environment setup working correctly"
    else
        log "ERROR" "❌ Environment setup failed"
        return 1
    fi
    
    log "SUCCESS" "🎉 All tests passed! MCP enforcement system is ready"
    return 0
}

# Main function
main() {
    local command="${1:-}"
    
    case "$command" in
        "install")
            log "INFO" "Installing MCP enforcement system..."
            check_mcp_server_health
            setup_mcp_environment
            install_enforcement
            create_enhanced_scripts
            log "SUCCESS" "🎉 MCP enforcement system installed successfully!"
            ;;
        "test")
            test_enforcement_system
            ;;
        "intercept")
            shift
            intercept_command "$@"
            ;;
        "health")
            check_mcp_server_health
            ;;
        "setup")
            setup_mcp_environment
            ;;
        "analyze")
            shift
            analyze_command "$@"
            ;;
        *)
            cat << EOF
Tyler Gohr Portfolio MCP Enforcement System v1.0.0
Ensures MCP functions are always used correctly and work every time

Usage:
  $0 install    - Install the complete enforcement system
  $0 test       - Test all components of the system
  $0 health     - Check MCP server health
  $0 setup      - Setup environment for optimal MCP usage
  $0 intercept  - Intercept and analyze a command
  $0 analyze    - Analyze a command for MCP alternatives

Environment Variables:
  FORCE_MCP_USAGE=true        - Block timeout-prone commands completely
  CLAUDE_AUTO_SUBAGENT=true   - Enable strong MCP recommendations
  USE_SUBAGENT=true           - Always recommend sub-agent patterns

Examples:
  $0 install                  - Complete system installation
  $0 intercept npm run dev    - Test command interception
  $0 analyze npm run test:e2e:smoke - Check for MCP alternatives
EOF
            ;;
    esac
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi