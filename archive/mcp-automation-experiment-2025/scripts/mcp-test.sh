#!/bin/bash

# Tyler Gohr Portfolio - MCP Test Execution Engine
# Phase 4 "MCP-Primary Transition" - Intelligent testing automation
# Replaces timeout-prone test commands with MCP-powered execution

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
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${CYAN}[MCP-TEST]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[MCP-TEST]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[MCP-TEST]${NC} $1"
}

log_error() {
    echo -e "${RED}[MCP-TEST]${NC} $1"
}

log_strategy() {
    echo -e "${PURPLE}[STRATEGY]${NC} $1"
}

# Help function
show_help() {
    cat << 'EOF'
MCP Test Execution Engine - Phase 4 MCP-Primary Transition

USAGE:
    ./scripts/mcp-test.sh [OPTIONS] [TEST_TYPE]

TEST TYPES:
    smoke              Quick essential tests (<1 min) - DEFAULT
    dev                Development tests (2-3 min, skip visual)
    component          Component-specific testing
    visual             Visual regression testing
    navigation         Navigation behavior tests
    accessibility      WCAG 2.1 AA compliance tests
    performance        Core Web Vitals and performance tests
    mobile             Cross-device responsive tests
    comprehensive      Full E2E test suite (8-10 min)

OPTIONS:
    --skip-visual      Skip visual regression tests
    --fast-mode        Ultra-fast testing mode
    --browser BROWSER  Browser: chromium|firefox|webkit|all (default: chromium)
    --timeout MS       Timeout in milliseconds (default: 120000)
    --strategy STRAT   Strategy: auto|parallel|sequential (default: auto)
    --component NAME   Test specific component
    --context CONTEXT  Context: main|2|mixed (default: auto-detect)
    --screenshots      Generate screenshots for Claude review
    --help, -h         Show this help message

INTELLIGENT FEATURES:
    🧠 Smart test strategy selection based on file changes
    ⚡ Timeout-resistant execution (vs 2-minute npm timeouts)
    📊 Real-time risk assessment and optimization
    🎯 Context-aware testing (main portfolio vs /2 redesign)
    📸 Automated screenshot generation for visual review
    🛡️ Environment validation and setup
    🔧 Intelligent fallback and error recovery

EXAMPLES:
    ./scripts/mcp-test.sh                              # Quick smoke tests
    ./scripts/mcp-test.sh dev --fast-mode              # Fast development testing
    ./scripts/mcp-test.sh visual --browser webkit      # Visual tests in Safari
    ./scripts/mcp-test.sh component --component Button # Test specific component
    ./scripts/mcp-test.sh --screenshots                # Generate Claude review screenshots
    ./scripts/mcp-test.sh comprehensive --timeout 600000 # Full suite with 10min timeout

TESTING STRATEGY INTELLIGENCE:
    📋 Analyzes changed files for intelligent test selection
    🎯 Prioritizes tests based on development context
    ⚡ Optimizes execution for time constraints
    🧪 Provides alternative strategies and recommendations
    📈 Tracks test execution patterns and success rates

PHASE 4 BENEFITS:
    🎯 Replaces "npm run test:e2e:smoke" timeouts
    ⚡ 30-60 second execution vs 2-minute failures
    🧠 File-change-aware test selection
    📊 Performance impact monitoring
    🔄 Intelligent retry and error recovery

EOF
}

# Check if MCP server is available
check_mcp_server() {
    if [[ ! -f "$MCP_SERVER_SCRIPT" ]]; then
        log_error "MCP server not built. Building now..."
        cd "$MCP_SERVER_DIR"
        npm run build || {
            log_error "Failed to build MCP server"
            exit 1
        }
        cd "$PROJECT_ROOT"
    fi
}

# Test MCP server health  
test_mcp_health() {
    log_info "Testing MCP server health for testing capabilities..."
    
    if node "$MCP_SERVER_SCRIPT" health 2>/dev/null; then
        log_success "MCP server health check passed"
        return 0
    else
        log_error "MCP server health check failed"
        return 1
    fi
}

# Detect development context (main vs /2 redesign)
detect_context() {
    local context="main"
    
    # Check if we're in /2 directory or working with /2 files
    if [[ "$PWD" == *"/2"* ]] || [[ "$PWD" == *"/src/app/2"* ]]; then
        context="2"
    elif git diff --name-only HEAD~1 2>/dev/null | grep -q "src/app/2/" 2>/dev/null; then
        context="2"
    elif git status --porcelain 2>/dev/null | grep -q "src/app/2/" 2>/dev/null; then
        context="2"
    fi
    
    echo "$context"
}

# Get changed files for intelligent test selection
get_changed_files() {
    local changed_files=()
    
    # Get staged changes
    if git diff --cached --name-only >/dev/null 2>&1; then
        while IFS= read -r file; do
            [[ -n "$file" ]] && changed_files+=("$file")
        done < <(git diff --cached --name-only 2>/dev/null)
    fi
    
    # Get unstaged changes
    if git diff --name-only >/dev/null 2>&1; then
        while IFS= read -r file; do
            [[ -n "$file" ]] && changed_files+=("$file")
        done < <(git diff --name-only 2>/dev/null)
    fi
    
    # Get untracked files
    if git ls-files --others --exclude-standard >/dev/null 2>&1; then
        while IFS= read -r file; do
            [[ -n "$file" ]] && changed_files+=("$file")
        done < <(git ls-files --others --exclude-standard 2>/dev/null)
    fi
    
    # Remove duplicates and return as JSON array
    printf '%s\n' "${changed_files[@]}" | sort -u | jq -R -s -c 'split("\n") | map(select(length > 0))'
}

# Analyze testing needs using MCP intelligence
analyze_testing_needs() {
    local context="$1"
    local changed_files="$2"
    local time_constraints="$3"
    
    log_info "Analyzing testing needs with MCP intelligence..."
    log_strategy "Context: $context | Time constraints: $time_constraints"
    
    # Use MCP Testing Strategy Intelligence
    local analysis_params="{
        \"changedFiles\": $changed_files,
        \"context\": \"$context\",
        \"timeConstraints\": \"$time_constraints\",
        \"environment\": \"local\",
        \"priority\": \"development\",
        \"includeRiskAssessment\": true
    }"
    
    node -e "
const { ProjectContext } = require('$MCP_SERVER_DIR/dist/types/project.js');
const { analyzeTestingNeedsMCP } = require('$MCP_SERVER_DIR/dist/tools/index.js');

async function analyzeNeeds() {
    try {
        const context = { 
            projectRoot: '$PROJECT_ROOT', 
            environment: 'local', 
            developmentContext: '$context' 
        };
        const params = $analysis_params;
        
        const result = await analyzeTestingNeedsMCP(params, context);
        
        if (result.content && result.content[0]) {
            console.log(result.content[0].text);
        } else {
            console.log('Testing needs analysis completed');
        }
    } catch (error) {
        console.error('Testing needs analysis error:', error.message);
    }
}

analyzeNeeds();
" 2>/dev/null || {
        log_warning "MCP testing needs analysis failed, using fallback strategy"
    }
}

# Select optimal testing strategy using MCP intelligence
select_testing_strategy() {
    local test_type="$1"
    local context="$2"
    local changed_files="$3"
    local skip_visual="$4"
    local fast_mode="$5"
    
    log_info "Selecting optimal testing strategy..."
    
    # Map test type to time constraints
    local time_constraints="normal"
    case "$test_type" in
        smoke) time_constraints="fast" ;;
        dev) time_constraints="normal" ;;
        comprehensive) time_constraints="comprehensive" ;;
    esac
    
    # Use MCP Testing Strategy Intelligence
    local strategy_params="{
        \"changedFiles\": $changed_files,
        \"context\": \"$context\",
        \"timeConstraints\": \"$time_constraints\",
        \"environment\": \"local\",
        \"priority\": \"development\",
        \"includeScreenshots\": $skip_visual,
        \"includeAlternatives\": true
    }"
    
    log_strategy "Using MCP Testing Strategy Intelligence for optimal selection..."
    
    node -e "
const { ProjectContext } = require('$MCP_SERVER_DIR/dist/types/project.js');
const { selectTestingStrategyMCP } = require('$MCP_SERVER_DIR/dist/tools/index.js');

async function selectStrategy() {
    try {
        const context = { 
            projectRoot: '$PROJECT_ROOT', 
            environment: 'local', 
            developmentContext: '$context' 
        };
        const params = $strategy_params;
        
        const result = await selectTestingStrategyMCP(params, context);
        
        if (result.content && result.content[0]) {
            console.log(result.content[0].text);
        }
    } catch (error) {
        console.error('Strategy selection error:', error.message);
    }
}

selectStrategy();
" 2>/dev/null || {
        log_warning "MCP strategy selection failed, using default strategy"
    }
}

# Execute tests using MCP intelligence
execute_tests() {
    local test_type="$1"
    local skip_visual="$2"
    local fast_mode="$3"
    local browser="$4"
    local timeout="$5"
    local strategy="$6"
    local component="$7"
    local screenshots="$8"
    
    log_info "Executing tests with MCP Test Execution Engine..."
    log_info "Type: $test_type | Browser: $browser | Timeout: ${timeout}ms"
    
    # Prepare MCP test execution parameters
    local test_params="{
        \"testType\": \"$test_type\",
        \"skipVisual\": $skip_visual,
        \"fastMode\": $fast_mode,
        \"browser\": \"$browser\",
        \"timeout\": $timeout,
        \"strategy\": \"$strategy\"
    }"
    
    if [[ -n "$component" ]]; then
        test_params=$(echo "$test_params" | jq --arg comp "$component" '. + {component: $comp}')
    fi
    
    log_success "🚀 Starting MCP-powered test execution..."
    echo
    
    # Execute via MCP with timeout handling
    timeout $((timeout / 1000 + 60)) node -e "
const { ProjectContext } = require('$MCP_SERVER_DIR/dist/types/project.js');
const { executeTestMCP } = require('$MCP_SERVER_DIR/dist/tools/index.js');

async function executeTests() {
    try {
        const context = { 
            projectRoot: '$PROJECT_ROOT', 
            environment: 'local', 
            developmentContext: 'mixed' 
        };
        const params = $test_params;
        
        console.log('🧪 MCP Test Execution Engine');
        console.log('============================');
        console.log('Using Phase 4 Testing Strategy Intelligence...');
        console.log('');
        
        const result = await executeTestMCP(params, context);
        
        if (result.content && result.content[0]) {
            console.log(result.content[0].text);
        }
        
        if (result.isError) {
            console.error('❌ MCP test execution failed');
            process.exit(1);
        } else {
            console.log('');
            console.log('✅ MCP test execution completed successfully');
        }
    } catch (error) {
        console.error('💥 MCP test execution error:', error.message);
        console.log('');
        console.log('🔄 Fallback: Using standard npm test commands...');
        
        // Fallback to standard npm testing
        const { spawn } = require('child_process');
        let fallbackCommand = 'npm';
        let fallbackArgs = [];
        
        switch ('$test_type') {
            case 'smoke':
                fallbackArgs = ['run', 'test:e2e:smoke'];
                break;
            case 'dev':
                fallbackArgs = ['run', 'test:e2e:dev'];
                break;
            case 'visual':
                fallbackArgs = ['run', 'test:e2e:visual'];
                break;
            case 'comprehensive':
                fallbackArgs = ['run', 'test:e2e:portfolio'];
                break;
            default:
                fallbackArgs = ['run', 'test:e2e:smoke'];
        }
        
        const child = spawn(fallbackCommand, fallbackArgs, { 
            stdio: 'inherit', 
            cwd: '$PROJECT_ROOT'
        });
        
        child.on('exit', (code) => {
            process.exit(code);
        });
    }
}

executeTests();
" || {
        log_error "MCP test execution timed out or failed completely"
        log_info "Attempting direct fallback to npm commands..."
        
        cd "$PROJECT_ROOT"
        case "$test_type" in
            smoke) npm run test:e2e:smoke ;;
            dev) npm run test:e2e:dev ;;
            visual) npm run test:e2e:visual ;;
            comprehensive) npm run test:e2e:portfolio ;;
            *) npm run test:e2e:smoke ;;
        esac
    }
    
    # Generate screenshots if requested
    if [[ "$screenshots" == "true" ]]; then
        log_info "Generating screenshots for Claude review..."
        cd "$PROJECT_ROOT"
        npx playwright test e2e/quick-screenshots.spec.ts --project=chromium || {
            log_warning "Screenshot generation failed"
        }
    fi
}

# Get testing recommendations
get_testing_recommendations() {
    local scenario="$1"
    local context="$2"
    
    log_info "Getting testing recommendations from MCP intelligence..."
    
    local rec_params="{
        \"scenario\": \"$scenario\",
        \"context\": \"$context\",
        \"timeAvailable\": \"5 minutes\",
        \"includeAlternatives\": true,
        \"includeWorkflow\": true,
        \"includeTips\": true
    }"
    
    node -e "
const { ProjectContext } = require('$MCP_SERVER_DIR/dist/types/project.js');
const { getTestingRecommendationsMCP } = require('$MCP_SERVER_DIR/dist/tools/index.js');

async function getRecommendations() {
    try {
        const context = { 
            projectRoot: '$PROJECT_ROOT', 
            environment: 'local', 
            developmentContext: '$context' 
        };
        const params = $rec_params;
        
        const result = await getTestingRecommendationsMCP(params, context);
        
        if (result.content && result.content[0]) {
            console.log(result.content[0].text);
        }
    } catch (error) {
        console.error('Testing recommendations error:', error.message);
    }
}

getRecommendations();
" 2>/dev/null || {
        log_warning "MCP testing recommendations failed"
    }
}

# Main function
main() {
    local test_type="smoke"
    local skip_visual=false
    local fast_mode=false
    local browser="chromium"
    local timeout=120000
    local strategy="auto"
    local component=""
    local context=""
    local screenshots=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-visual)
                skip_visual=true
                shift
                ;;
            --fast-mode)
                fast_mode=true
                shift
                ;;
            --browser)
                browser="$2"
                shift 2
                ;;
            --timeout)
                timeout="$2"
                shift 2
                ;;
            --strategy)
                strategy="$2"
                shift 2
                ;;
            --component)
                component="$2"
                shift 2
                ;;
            --context)
                context="$2"
                shift 2
                ;;
            --screenshots)
                screenshots=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            smoke|dev|component|visual|navigation|accessibility|performance|mobile|comprehensive)
                test_type="$1"
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Auto-detect context if not specified
    if [[ -z "$context" ]]; then
        context=$(detect_context)
    fi
    
    # Map test type to time constraints
    local time_constraints="normal"
    case "$test_type" in
        smoke) time_constraints="fast" ;;
        comprehensive) time_constraints="comprehensive" ;;
    esac
    
    # Header
    echo
    log_info "Tyler Gohr Portfolio - MCP Test Execution Engine"
    log_info "Phase 4 'MCP-Primary Transition' - Intelligent Testing Automation"
    log_info "Context: $([ "$context" = "2" ] && echo "Enterprise Solutions Architect (/2 redesign)" || echo "Main Portfolio")"
    echo
    
    # Ensure we're in the project root
    cd "$PROJECT_ROOT"
    
    # Check MCP server
    check_mcp_server
    test_mcp_health
    
    # Get changed files for intelligent analysis
    log_info "Analyzing changed files for intelligent test selection..."
    local changed_files
    changed_files=$(get_changed_files)
    log_info "Found $(echo "$changed_files" | jq '. | length') changed files"
    
    # Analyze testing needs
    analyze_testing_needs "$context" "$changed_files" "$time_constraints"
    echo
    
    # Select testing strategy
    select_testing_strategy "$test_type" "$context" "$changed_files" "$skip_visual" "$fast_mode"
    echo
    
    # Execute tests
    execute_tests "$test_type" "$skip_visual" "$fast_mode" "$browser" "$timeout" "$strategy" "$component" "$screenshots"
    
    # Get recommendations for next steps
    echo
    log_info "Getting recommendations for next testing steps..."
    get_testing_recommendations "quick-development" "$context"
}

# Run main function with all arguments
main "$@"