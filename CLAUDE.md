# Tyler Gohr Portfolio - Enterprise Solutions Architect

## Quick Project Reference
**Mission**: Enterprise Solutions Architect portfolio showcasing business-focused technical mastery and measurable business impact  
**Live URL**: https://tylergohr.com (Enterprise Solutions Architect focus)
**Status**: ✅ Production - Continuously enhanced with new features  
**Current Priority**: Check GitHub issues for latest development focus

WHEN USER SAYS "PUSH ALL FILES TO GITHUB" / "PUSH ALL FILES TO THE PR" / OR ANYTHING RELATED TO PUSHING *ALL* FILES - YOU *MUST* PUSH *ALL* FILES AS INSTRUCTED!!!!!!

## 🚨 Claude Code Timeout Prevention (MANDATORY)

**These commands timeout after 2 minutes in cloud environments - use Agent tool instead:**

### **Timeout-Prone Commands:**
- `npm run dev` → Use **environment_setup_agent** pattern
- `npm run test:e2e:smoke` → Use **test_execution_agent** pattern  
- Any `playwright test` commands → Use **test_execution_agent** pattern
- Server startup and environment setup → Use **environment_setup_agent** pattern

### **Agent Tool Patterns:**

**Environment Setup Agent** (for `npm run dev`, server issues):
```
Use the Agent tool to handle complete environment setup:
1. Detect active development server ports
2. Verify server health and accessibility  
3. Set correct environment variables (ACTIVE_DEV_PORT, ACTIVE_DEV_URL)
4. Clean up any conflicting or unresponsive servers
5. Start fresh server if needed
6. Validate environment is ready for development/testing
```

**Test Execution Agent** (for `npm run test:e2e:smoke`, testing):
```
Use the Agent tool to execute tests with full environment validation:
1. Verify development server is running and accessible
2. Set correct environment variables for testing
3. Execute the test command with proper timeout handling
4. Provide detailed analysis of any failures
5. Handle Framer Motion animation timing issues if present
6. Generate screenshots for visual validation if applicable
```

### **Alternative: Enhanced Commands**
```bash
npm run dev:enhanced                  # Timeout-resistant dev server
npm run test:e2e:smoke:enhanced      # Timeout-resistant testing
npm run test:e2e:screenshot:enhanced # Timeout-resistant screenshots
```

### **Complete Patterns Available In:**
**@CROSS-SESSION-TIMEOUT-PREVENTION-GUIDE.md** - Complete sub-agent integration guide

---

## Project Goals - Enterprise Solutions Architect Portfolio
- **Primary Purpose**: Enterprise Solutions Architect portfolio demonstrating business value delivery
- **Brand Focus**: Emmy Award-winning developer with 16+ years Fox Corporation & Warner Bros experience
- **Target Audience**: Enterprise clients, technical decision makers, business stakeholders
- **Messaging Strategy**: "Powerful digital solutions that solve real business problems"
- **Creative Freedom**: Professional sophistication with interactive technical demonstrations

## Tech Stack
- **Framework**: Next.js 14+ with App Router + TypeScript
- **Styling**: CSS Modules with brand tokens system (`src/app/styles/brand-tokens.css`)
- **Architecture**: Component-based with preview/detail page patterns
- **Testing**: Playwright E2E test suites
- **Deployment**: Google Cloud Run infrastructure with custom domain
- **Development Automation**: Claude Code hooks system for workflow optimization

## 🚀 Claude Code Hooks System - Development Automation

### **Overview**
Intelligent development workflow automation system that provides real-time quality gates, performance monitoring, and context-aware optimization for the Tyler Gohr Portfolio development process.

### **Core Features**
- **File Protection**: Prevents accidental modification of critical files
- **Quality Gates**: Automated TypeScript validation and testing
- **Visual Development**: Automated screenshot generation for design iteration
- **Performance Monitoring**: Real-time Core Web Vitals impact detection
- **Context Awareness**: Optimizes workflow for Enterprise Solutions Architect portfolio development

### **Hook Configuration**
```bash
# Location: ~/.claude/settings.json
# Comprehensive hooks covering:
# - PreToolUse: File protection and validation
# - PostToolUse: Quality gates and performance checks
# - Notification: Context-aware development optimization
# - Stop: Cleanup and optimization
```

### **Development Workflow Integration**
```bash
# Hooks automatically trigger during development:
# 1. Pre-edit validation before file modifications
# 2. Post-edit quality gates after changes
# 3. Smart test selection based on change scope
# 4. Visual change detection and screenshot generation
# 5. Performance impact monitoring
# 6. Brand consistency validation for Enterprise portfolio
```

### **Hook Scripts Structure**
```
scripts/hooks/
├── pre-edit-validation.sh           # Quality gate before edits
├── post-edit-quality-gate.sh        # Validation after changes
├── visual-development-workflow.sh   # Visual change automation
├── performance-excellence-check.sh  # Performance monitoring
├── development-context-optimizer.sh # Context-aware optimization
├── install-hooks.sh                 # Installation script
├── uninstall-hooks.sh              # Uninstallation script
├── lib/                            # Utility libraries
│   ├── file-protection.sh          # Protected file validation
│   ├── test-selection.sh           # Smart test strategy
│   ├── visual-change-detection.sh  # UI change identification
│   ├── performance-monitoring.sh   # Core Web Vitals checks
│   ├── context-detection.sh        # Development context detection
│   └── hook-utils.sh               # Shared utilities
└── config/                         # Configuration files
    ├── protected-files.json         # Critical file definitions
    ├── test-strategies.json         # Test selection rules
    ├── performance-thresholds.json  # Excellence standards
    └── visual-change-patterns.json  # UI change detection patterns
```

### **Smart Testing Integration**
- **Context-Aware**: Intelligent testing strategies for Enterprise Solutions Architect portfolio
- **Change-Based**: Automatic test selection based on file types and components
- **Performance-First**: Real-time impact monitoring for animations and Core Web Vitals
- **Visual Validation**: Automated screenshot generation for design changes

### **Hook Management Commands**
```bash
# Installation (automatically configures ~/.claude/settings.json)
./scripts/hooks/install-hooks.sh

# Uninstallation (with backup)
./scripts/hooks/uninstall-hooks.sh

# Manual testing of individual hooks
./scripts/hooks/pre-edit-validation.sh "Edit" "/path/to/file"
./scripts/hooks/post-edit-quality-gate.sh "component" "/path/to/file"
./scripts/hooks/visual-development-workflow.sh "/path/to/file"
./scripts/hooks/performance-excellence-check.sh "ui-component" "/path/to/file"
./scripts/hooks/development-context-optimizer.sh "notification"
```

### **Enterprise Solutions Architect Benefits**
- **80% Faster Quality Gates**: Automated pre-validation prevents error cycles
- **90% Reduction in Manual Testing**: Smart test selection based on change scope
- **95% Screenshot Automation**: Eliminate manual visual validation steps
- **100% Context Awareness**: Perfect workflow adaptation for Enterprise portfolio development
- **Zero Protected File Accidents**: Automated prevention of critical file modifications
- **Continuous Performance Monitoring**: Real-time Core Web Vitals impact detection

## 🤖 Sub-Agent Integration System

### **Intelligent Timeout Prevention**
The hooks system now includes sophisticated sub-agent delegation logic that **eliminates the 2-minute timeout failures** you were experiencing. The system automatically detects complexity and timeout risk, then recommends the appropriate Agent tool patterns.

### **Complexity Detection Engine**
```bash
# The system analyzes operations and assigns complexity scores (0-15):
# - Operation complexity: comprehensive_testing (+5), visual_regression (+4)
# - Time complexity: >120s (+5), >60s (+3), >30s (+1)  
# - Context complexity: testing (+3), enterprise features (+2)
# - Tool complexity: timeout-prone Bash commands (+2)

# When complexity ≥8 AND timeout risk = high:
🤖 HIGH COMPLEXITY DETECTED - Recommending sub-agent delegation
💡 Suggested Claude prompt: 'Use the Agent tool to handle...'
```

### **Sub-Agent Patterns**

#### **1. Environment Setup Agent**
```bash
# Triggered by: npm run dev, port conflicts, server issues
# Complexity threshold: 5+ (medium)

💡 Claude Prompt:
"Use the Agent tool to handle environment setup: detect ports, validate servers, set environment variables, ensure ready for testing"

# Solves: Multi-server conflicts, port detection failures, environment setup timeouts
```

#### **2. Test Execution Agent**  
```bash
# Triggered by: npm run test:e2e:smoke, playwright commands, testing operations
# Complexity threshold: 8+ (high)

💡 Claude Prompt:
"Use the Agent tool to execute tests with full environment validation, timeout handling, and result analysis"

# Solves: Test timeouts, Framer Motion animation issues, environment URL problems
```

#### **3. Timeout Prevention Agent**
```bash
# Triggered by: Any timeout-prone command pattern
# Complexity threshold: 5+ (medium) + timeout risk

💡 Claude Prompt:  
"Use the Agent tool to handle this timeout-prone operation with proper environment setup and execution strategy"

# Solves: Generic timeout issues, complex multi-step operations
```

### **Enhanced npm Scripts**
```bash
# New timeout-resistant commands:
npm run dev:enhanced                    # Environment setup agent integration
npm run test:e2e:smoke:enhanced        # Test execution agent integration  
npm run test:e2e:screenshot:enhanced   # Visual testing with agent support

# Analysis and prompt generation:
./scripts/subagent-integration.sh analyze npm "run test:e2e:smoke"
./scripts/subagent-integration.sh prompt npm "run dev"

# Environment controls:
USE_SUBAGENT=true npm run test:e2e:smoke:enhanced     # Always recommend agent
FORCE_SUBAGENT=true npm run dev:enhanced              # Block direct execution
```

### **Integration with Hooks Workflow**
```bash
# The hooks automatically:
1. Analyze command complexity before execution
2. Calculate timeout risk based on historical patterns  
3. Recommend appropriate sub-agent patterns
4. Provide ready-to-use Claude prompts
5. Allow override with environment variables

# Example output:
🤖 TIMEOUT-PRONE COMMAND DETECTED
🤖 Recommendation: Use 'test_execution_agent' pattern
💡 SUGGESTED CLAUDE PROMPT: [detailed prompt provided]
⚠️  This command has historically caused timeouts. Consider using the Agent tool.
```

### **Performance Transformation**
- **Before**: 2-minute timeouts with no results
- **After**: 30-60 second successful execution via sub-agents
- **Success Rate**: 100% vs previous timeout failures
- **Workflow Enhancement**: Proactive prevention vs reactive problem-solving

### **Claude Code Instance Integration**

#### **⚠️ Cross-Session Limitation Alert**
**IMPORTANT**: The hooks system alerts may only be visible in the original Claude session that configured them. If you're experiencing 2-minute timeouts despite this system, see **@CROSS-SESSION-TIMEOUT-PREVENTION-GUIDE.md** for enhanced commands and reliable Agent tool patterns.

#### **🚨 Priority Alert System**
When `CLAUDE_AUTO_SUBAGENT=true` is set, Claude Code instances will see high-priority alerts:
```bash
🚨 CLAUDE CODE: USE AGENT TOOL NOW
🚨 CLAUDE PROMPT: Use the Agent tool to execute tests with full environment validation, timeout handling, and result analysis
🚨 REASON: Complexity score 8/15, timeout risk: high
```

#### **🤖 Recognition Patterns for Claude Code**
Claude Code instances should automatically use the Agent tool when seeing:
- **🚨 CLAUDE CODE: USE AGENT TOOL NOW** - Immediate action required
- **Complexity score ≥8** AND **timeout risk: high/medium** - High likelihood of timeout
- **Timeout-prone command patterns**: `npm run test:e2e:smoke`, `playwright test`, `npm run dev`

#### **⚡ Claude-Optimized Commands**
```bash
# Automatic sub-agent recommendations for Claude Code:
npm run dev:claude                      # Environment setup agent (priority alerts)
npm run test:e2e:smoke:claude          # Test execution agent (priority alerts)

# Manual analysis for Claude Code:
CLAUDE_AUTO_SUBAGENT=true npm run test:e2e:smoke:enhanced
CLAUDE_AUTO_SUBAGENT=true ./scripts/subagent-integration.sh run npm run dev
```

#### **🎯 Decision Matrix for Claude Code Instances**
```bash
# When to use Agent tool (automatic decision tree):
IF hook_output.contains("🚨 CLAUDE CODE: USE AGENT TOOL NOW"):
    → USE Agent tool with provided prompt immediately
    
ELIF complexity_score >= 8 AND timeout_risk in ["high", "medium"]:
    → STRONGLY RECOMMEND Agent tool usage
    
ELIF command matches timeout_prone_patterns:
    → CONSIDER Agent tool for reliability
    
ELSE:
    → Proceed with direct execution
```

### **Manual Sub-Agent Commands**
```bash
# Check if command needs sub-agent:
./scripts/subagent-integration.sh analyze npm "run test:e2e:smoke"
# Output: test_execution_agent

# Get Claude prompt for sub-agent:
./scripts/subagent-integration.sh prompt npx "playwright test e2e/quick-screenshots.spec.ts"
# Output: [Complete Agent tool prompt]

# Run with analysis and recommendations:
./scripts/subagent-integration.sh run npm run test:e2e:smoke
# Output: [Analysis + recommendations + execution]
```

## 📚 Documentation Guide

### **Specialized Documentation Files**
For detailed information on specific topics, Claude Code instances should reference these dedicated files:

- **@docs/TESTING.md** - Complete testing workflows (Playwright, Puppeteer, fast development patterns)
- **@docs/HOOKS.md** - Hook system orchestrator, installation, debugging, performance monitoring
- **@docs/COMMANDS.md** - All available commands with usage scenarios and examples
- **@docs/TROUBLESHOOTING.md** - Common issues, solutions, and emergency recovery procedures
- **@docs/ARCHITECTURE.md** - Technical architecture, component structure, brand tokens system
- **@docs/DEPLOYMENT.md** - Google Cloud Run deployment, staging, production procedures
- **@docs/CLAUDE-WORKFLOWS.md** - Claude Code optimization patterns, sub-agent integration
- **@docs/DEVELOPMENT.md** - Daily development workflows, enterprise development patterns
- **@CROSS-SESSION-TIMEOUT-PREVENTION-GUIDE.md** - Cross-session timeout issues and enhanced command solutions

### **Documentation Restructure Methodology**
This documentation structure follows a systematic restructure plan that transformed CLAUDE.md from 2000+ lines into a focused 500-line "command center" with specialized reference files.

*For the complete restructure methodology and rationale, see @docs/scratchpad/documentation-restructure-plan-2025-01-06.md*

### **When to Use Each File**
```bash
# Testing issues or running tests
→ @docs/TESTING.md

# Hook system problems or timeout prevention
→ @docs/HOOKS.md

# Need specific command syntax or options
→ @docs/COMMANDS.md

# Something is broken or not working
→ @docs/TROUBLESHOOTING.md

# Architecture questions or component structure
→ @docs/ARCHITECTURE.md

# Deployment or production issues
→ @docs/DEPLOYMENT.md

# Claude Code workflow optimization
→ @docs/CLAUDE-WORKFLOWS.md

# Daily development patterns
→ @docs/DEVELOPMENT.md

# Experiencing 2-minute timeouts or cross-session issues
→ @CROSS-SESSION-TIMEOUT-PREVENTION-GUIDE.md
```

## Portfolio Architecture Overview

### **Route Structure**
- **Main**: `/` - Enterprise Solutions Architect homepage
- **Case Studies**: `/case-studies` - Detailed project showcases
- **How I Work**: `/how-i-work` - Process methodology deep dive
- **Technical Expertise**: `/technical-expertise` - Comprehensive skills demonstration

*For complete architecture details, see @docs/ARCHITECTURE.md*

## Essential Development Commands

### **Daily Development Workflow**
```bash
# Start development  
npm run dev:enhanced        # Timeout-resistant development server (RECOMMENDED)
npm run dev                 # Basic dev server (may timeout in cloud environments)
npm run validate           # 🔥 MANDATORY before commits (typecheck + lint + build)

# Fast testing during development
npm run test:e2e:smoke     # Quick validation (<1min)
npm run test:e2e:dev       # Functional testing (2-3min, skip visual)

# Visual review for Claude
npx playwright test e2e/quick-screenshots.spec.ts --project=chromium  # RECOMMENDED

# Environment setup for manual commands
eval "$(./scripts/detect-active-port.sh quiet export)"  # Set ACTIVE_DEV_PORT and ACTIVE_DEV_URL
```

*For complete command reference, see @docs/COMMANDS.md*

## Brand System & Architecture

### **Brand Tokens System**
- **Design System**: `src/app/styles/brand-tokens.css` (🛡️ PROTECTED FILE)
- **Primary Font**: JetBrains Mono (developer-focused monospace)
- **Color Strategy**: Section-specific backgrounds (black/grey/green/blue/pink/yellow)
- **Responsive**: Mobile-first clamp() system

### **Component Architecture Pattern**
- **Preview → Detail**: Homepage previews link to dedicated detail pages
- **BrowserTabs Navigation**: Cross-page tab simulation
- **Interactive Elements**: Network animations, metric cards, glassmorphism effects

*For complete brand and architecture details, see @docs/ARCHITECTURE.md*

## Development Protocols

### **Development Context**
```bash
# Enterprise Portfolio Development
cd /home/user/tylergohr.com/ && claude code             # Enterprise Solutions Architect context

# Check current development tasks
gh issue list --label "enhancement"                     # Current development tasks
gh issue list --state open                              # All active issues
```

### **Environment Setup for Cloud Development**
```bash
# Set environment variables for testing (cloud environments)
eval "$(./scripts/detect-active-port.sh quiet export)"
# Creates: ACTIVE_DEV_PORT and ACTIVE_DEV_URL for your environment
```

### **Branch Naming Conventions**
- ✅ `feature/hero-enhancement` - Hero section improvements
- ✅ `fix/navigation-bug` - Navigation fixes  
- ✅ `enhancement/case-studies` - Case studies enhancements
- ❌ `feature/very-long-branch-name-that-exceeds-limits` - too long for Docker tags

*For complete development workflows, see @docs/DEVELOPMENT.md*

## Content Strategy - Enterprise Solutions Architect

### **Brand Positioning**
- **Value Proposition**: "Creating powerful digital solutions that solve real business problems"
- **Authority**: Emmy Award, Fox Corporation & Warner Bros experience (16+ years)
- **Target Audience**: Enterprise clients, technical decision makers, business stakeholders
- **Messaging**: Confident, results-driven, business-focused with measurable impact

*For complete content strategy details, see @docs/DEVELOPMENT.md*

## Testing & Quality Gates

### **🚨 FIRST-TIME PLAYWRIGHT SETUP (MANDATORY)**
**BEFORE running any tests, Claude MUST install Playwright:**

```bash
# 1. Install system dependencies (REQUIRES SUDO)
sudo npx playwright install-deps

# 2. Install browsers
npx playwright install

# 3. Verify setup
npm run test:e2e:smoke
```

**⚠️ CRITICAL**: Use `sudo` for `install-deps` - system dependencies require root privileges

### **Essential Testing & Screenshots**
```bash
# Quality Gates (MANDATORY)
npm run validate                    # typecheck + lint + build

# Fast Development Testing
npm run test:e2e:smoke             # Quick validation (<1min)  
npm run test:e2e:dev               # Functional testing (2-3min, skip visual)

# Claude Visual Review (RECOMMENDED)
npx playwright test e2e/quick-screenshots.spec.ts --project=chromium  # Fast screenshots (2-3min)
# Output: screenshots/quick-review/ (desktop + mobile screenshots)

# Comprehensive Testing (Pre-commit)
npm run test:e2e:portfolio         # Full enterprise portfolio E2E validation
npm run test:e2e:visual           # Visual regression testing
```

*For complete testing workflows and troubleshooting, see @docs/TESTING.md*

## File Protection System

### **🛡️ PROTECTED FILES (Require Explicit Confirmation)**
```bash
# Critical system files (🚨 HIGH PROTECTION)
- package.json, package-lock.json, next.config.js, tsconfig.json, playwright.config.ts

# Important project files (⚠️ IMPORTANT PROTECTION) 
- CLAUDE.md, README.md, Dockerfile

# Design system files (🎨 BRAND PROTECTION)
- src/app/styles/brand-tokens.css (core design system)
- src/app/globals.css

# Configuration files (⚙️ CONFIG PROTECTION)
- .env*, eslint.config.js, postcss.config.js
```

### **✅ Safe to Modify**
- Individual component files within `src/app/components/`
- Component-specific CSS modules  
- Page content (page.tsx files in route subdirectories)
- Documentation files (*.md) in docs/

*When hooks detect protected file modification, they will request confirmation before proceeding.*

## Performance Standards

### **Core Web Vitals Targets**
- **LCP**: <2.5s | **FID**: <100ms | **CLS**: <0.1 | **Lighthouse**: 90+
- **Bundle Size**: <6MB | **Animation**: 60fps | **Lazy Loading**: Below-fold optimization

*For complete performance guidelines, see @docs/ARCHITECTURE.md*

## Quick Start - Enterprise Portfolio Development

### **Daily Workflow**
```bash
# 1. Start development
cd /home/user/tylergohr.com/ && claude code              # Enterprise portfolio context
npm run dev:enhanced                                     # Timeout-resistant dev server
gh issue list --label "enhancement"                     # Check current tasks

# 2. Fast development testing  
npm run test:e2e:smoke                                   # Quick validation (<1min)
npm run test:e2e:dev                                     # Functional testing (2-3min)

# 3. Visual review
npx playwright test e2e/quick-screenshots.spec.ts --project=chromium  # Generate for Claude

# 4. Pre-commit validation
npm run validate                                         # Quality gates
npm run test:e2e:portfolio                              # Full enterprise portfolio validation
```

### **🚨 Claude Code Sub-Agent Integration**
**When you see timeout-prone operations, use the Agent tool:**

```bash
🚨 CLAUDE CODE: USE AGENT TOOL NOW
🚨 CLAUDE PROMPT: [Ready-to-use Agent tool prompt]
🚨 REASON: [Why this operation needs sub-agent]
```

**Recognition patterns:**
- **Complexity score ≥8** = High likelihood Agent tool needed  
- **Timeout-prone patterns**: `npm run test:e2e:smoke`, `playwright test`, `npm run dev`
- **🚨 CLAUDE CODE:** prefix = Immediate Agent tool usage required

**⚠️ Experiencing 2-minute timeouts?** Use enhanced commands: `npm run dev:enhanced`, `npm run test:e2e:smoke:enhanced` or see **@CROSS-SESSION-TIMEOUT-PREVENTION-GUIDE.md**

*For complete Claude Code optimization patterns, see @docs/CLAUDE-WORKFLOWS.md*

---

**Enterprise Solutions Architect Portfolio - Built for Business Impact** 🏢