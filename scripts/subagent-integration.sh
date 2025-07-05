#!/bin/bash

# Sub-agent Integration Script
# Enhances npm scripts to use sub-agents for timeout-prone operations

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/hooks/lib/hook-utils.sh"

# Sub-agent recommendation engine
recommend_subagent_for_command() {
    local command="$1"
    local args="$2"
    
    case "$command" in
        "npm")
            case "$args" in
                *"test:e2e:smoke"*)
                    echo "test_execution_agent"
                    ;;
                *"test:e2e"*|*"playwright"*)
                    echo "test_execution_agent"
                    ;;
                *"run dev"*)
                    echo "environment_setup_agent"
                    ;;
                *)
                    echo "none"
                    ;;
            esac
            ;;
        "npx")
            case "$args" in
                *"playwright test"*)
                    echo "test_execution_agent"
                    ;;
                *)
                    echo "none"
                    ;;
            esac
            ;;
        *)
            echo "none"
            ;;
    esac
}

# Generate sub-agent prompt
generate_subagent_prompt() {
    local agent_type="$1"
    local original_command="$2"
    local context="$3"
    
    case "$agent_type" in
        "environment_setup_agent")
            cat << EOF
Use the Agent tool to handle complete environment setup for this command:

**Original Command**: $original_command
**Context**: $context

**Task**: 
1. Detect active development server ports
2. Verify server health and accessibility  
3. Set correct environment variables (ACTIVE_DEV_PORT, ACTIVE_DEV_URL)
4. Clean up any conflicting or unresponsive servers
5. Start fresh server if needed
6. Validate environment is ready for development/testing

**Goal**: Eliminate timeout issues by ensuring proper environment setup before command execution.
EOF
            ;;
        "test_execution_agent")
            cat << EOF
Use the Agent tool to execute this test command with full environment validation:

**Original Command**: $original_command
**Context**: $context

**Task**:
1. Verify development server is running and accessible
2. Set correct environment variables for testing
3. Execute the test command with proper timeout handling
4. Provide detailed analysis of any failures
5. Handle Framer Motion animation timing issues if present
6. Generate screenshots for visual validation if applicable

**Goal**: Transform 2-minute timeout failures into successful test execution with proper environment setup.
EOF
            ;;
        "timeout_prevention_agent")
            cat << EOF
Use the Agent tool to handle this timeout-prone operation:

**Original Command**: $original_command  
**Context**: $context

**Task**:
1. Analyze why this command typically times out
2. Set up optimal environment conditions
3. Execute with intelligent retry and fallback strategies
4. Provide detailed feedback on execution results
5. Recommend permanent solutions to prevent future timeouts

**Goal**: Ensure reliable execution of commands that historically timeout.
EOF
            ;;
        *)
            echo "No sub-agent recommendation available for this command type."
            ;;
    esac
}

# Check if command should use sub-agent
should_use_subagent() {
    local command="$1"
    local args="$2"
    
    # Check environment variable for forcing sub-agent usage
    if [[ "${USE_SUBAGENT:-false}" == "true" ]]; then
        return 0
    fi
    
    # Check for timeout-prone patterns
    case "$command $args" in
        *"test:e2e:smoke"*|*"playwright test"*|*"npm run dev"*)
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# Enhanced command wrapper
enhanced_command() {
    local command="$1"
    shift
    local args="$*"
    
    log_info "🔍 Analyzing command: $command $args"
    
    # Get sub-agent recommendation
    local recommendation=$(recommend_subagent_for_command "$command" "$args")
    
    if [[ "$recommendation" != "none" ]] && should_use_subagent "$command" "$args"; then
        log_info "🤖 TIMEOUT-PRONE COMMAND DETECTED"
        log_info "🤖 Recommendation: Use '$recommendation' pattern"
        log_info ""
        log_info "💡 SUGGESTED CLAUDE PROMPT:"
        log_info "$(generate_subagent_prompt "$recommendation" "$command $args" "Tyler's portfolio development")"
        log_info ""
        log_warning "⚠️  This command has historically caused timeouts. Consider using the Agent tool as suggested above."
        log_info ""
        
        if [[ "${FORCE_SUBAGENT:-false}" == "true" ]]; then
            log_error "🛑 FORCE_SUBAGENT=true - Blocking direct execution to enforce sub-agent usage"
            return 1
        else
            log_info "🔄 Proceeding with direct execution (set FORCE_SUBAGENT=true to block)"
        fi
    fi
    
    # Execute the original command
    log_info "▶️  Executing: $command $args"
    exec "$command" "$@"
}

# Command line interface
case "${1:-}" in
    "analyze")
        recommend_subagent_for_command "$2" "$3"
        ;;
    "prompt")
        agent_type=$(recommend_subagent_for_command "$2" "$3")
        if [[ "$agent_type" != "none" ]]; then
            generate_subagent_prompt "$agent_type" "$2 $3" "Tyler's portfolio development"
        else
            echo "No sub-agent recommendation for this command"
        fi
        ;;
    "run")
        shift
        enhanced_command "$@"
        ;;
    *)
        cat << EOF
Sub-agent Integration Script

Usage:
  $0 analyze COMMAND ARGS          # Get sub-agent recommendation
  $0 prompt COMMAND ARGS           # Generate sub-agent prompt  
  $0 run COMMAND ARGS              # Run command with sub-agent analysis

Environment Variables:
  USE_SUBAGENT=true               # Always recommend sub-agent for timeout-prone commands
  FORCE_SUBAGENT=true            # Block direct execution of timeout-prone commands

Examples:
  $0 analyze npm "run test:e2e:smoke"
  $0 prompt npx "playwright test e2e/quick-screenshots.spec.ts"
  $0 run npm run test:e2e:smoke
  
  USE_SUBAGENT=true $0 run npm run dev
  FORCE_SUBAGENT=true $0 run npm run test:e2e:smoke
EOF
        ;;
esac