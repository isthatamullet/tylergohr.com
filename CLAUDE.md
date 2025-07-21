# Tyler Gohr Portfolio - Enterprise Solutions Architect

## Development Environment Overview

This is a **multi-project development workspace** running on Google Cloud Workstations with browser-based VS Code. The environment is optimized for iPad development with AI-assisted coding workflows.

### Core Setup
- **Platform**: Google Cloud Workstations (browser-based VS Code)
- **Device**: iPad (no local terminal access)
- **Port Management**: Smart auto-allocation starting from port 3000
- **VS Code Access**: https://studio.tylergohr.com (or https://34.69.148.95:8080)

### Environment Constraints
- **No desktop screenshots**: Use Puppeteer with headless browser options
- **Browser-based development**: All tools must work in browser context
- **Port limitations**: Preview URLs may need external access for iPad viewing
- **No local file system access**: All development through VS Code web interface

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
- **Framework**: Next.js 15+ with App Router + TypeScript
- **Styling**: CSS Modules with brand tokens system (`src/app/styles/brand-tokens.css`)
- **Architecture**: Component-based with preview/detail page patterns
- **Testing**: Playwright E2E test suites
- **Deployment**: Google Cloud Run infrastructure with custom domain
- **Development Automation**: Simple npm commands + optional file protection

## 🔧 Simple Development Workflow (Hooks Disabled)

### **Overview**
After removing 7,766+ lines of over-engineered automation, the development workflow is now simple and fast.

### **Core Commands**
- **Daily Development**: `npm run typecheck && npm run lint` (4-6 seconds)
- **Before Commits**: `npm run validate` (full validation when ready)
- **Screenshots**: `npx playwright test e2e/quick-screenshots.spec.ts --project=chromium`

### **What Was Archived**
We removed 7,766+ lines of over-engineered automation including:
- Complex orchestrator system (3,925 lines)
- Screenshot management complexity (1,728 lines)  
- Context detection over-engineering (513 lines)
- Port management scripts (15 files)
- Visual workflow automation (252 lines)

### **Simple File Protection (Available)**
If you want basic file protection, 3 simple files remain:
```
scripts/hooks/
├── install-hooks.sh              # Install basic file protection
├── uninstall-hooks.sh           # Remove file protection  
└── lib/
    ├── file-protection.sh        # Prevents corruption of critical files
    ├── context-detection.sh      # Simple 13-line context detection
    └── hook-utils.sh            # Basic logging utilities
```

### **Why Simple is Better**
- **Before**: 8-12 minute hook chains with timeouts
- **After**: 4-6 second commands that always work
- **Result**: Actually get work done instead of waiting for automation





### **How to Enable File Protection (Optional)**
```bash
# Install basic file protection only
./scripts/hooks/install-hooks.sh

# Remove file protection
./scripts/hooks/uninstall-hooks.sh
```

---

## 🤖 Sub-Agent Integration System

### **Timeout Prevention for Claude Code**

This project has timeout-prone operations that benefit from using the Agent tool. When you encounter these patterns, use the Agent tool for reliable execution:

#### **1. Environment Setup Agent**
```bash
# Use for: npm run dev, port conflicts, server startup issues

💡 Claude Prompt:
"Use the Agent tool to handle environment setup: detect ports, validate servers, set environment variables, ensure ready for testing"

# Solves: Multi-server conflicts, port detection failures, environment setup timeouts
```

#### **2. Test Execution Agent**  
```bash
# Use for: npm run test:e2e:smoke, playwright commands, testing operations

💡 Claude Prompt:
"Use the Agent tool to execute tests with full environment validation, timeout handling, and result analysis"

# Solves: Test timeouts, Framer Motion animation issues, environment URL problems
```

#### **3. Timeout Prevention Agent**
```bash
# Use for: Any command that historically times out

💡 Claude Prompt:  
"Use the Agent tool to handle this timeout-prone operation with proper environment setup and execution strategy"

# Solves: Generic timeout issues, complex multi-step operations
```

### **Enhanced npm Scripts**
```bash
# Timeout-resistant alternatives (these just call the standard commands but serve as reminders)
npm run dev:enhanced                    # Reminder to use Agent tool for npm run dev
npm run test:e2e:smoke:enhanced        # Reminder to use Agent tool for testing
npm run test:e2e:screenshot:enhanced   # Use npx playwright test e2e/quick-screenshots.spec.ts --project=chromium

# Standard commands (may timeout in cloud environments)
npm run dev                            # Consider Agent tool if timeouts occur
npm run test:e2e:smoke                 # Consider Agent tool if timeouts occur
```

### **🤖 Recognition Patterns for Claude Code**
Claude Code instances should use the Agent tool when seeing:
- **Timeout-prone command patterns**: `npm run test:e2e:smoke`, `playwright test`, `npm run dev`
- **Previous 2-minute timeouts** with these commands
- **Cloud environment complexity** (Google Cloud Workstations, Codespaces)

### **🎯 Decision Matrix for Claude Code Instances**
```bash
# When to use Agent tool:
IF previous_attempt_timed_out_at_2_minutes:
    → USE Agent tool with appropriate pattern immediately
    
ELIF command matches ["npm run dev", "npm run test:e2e:smoke", "playwright test"]:
    → CONSIDER Agent tool for reliability in cloud environments
    
ELIF working_in_cloud_environment AND complex_operation:
    → RECOMMEND Agent tool for timeout prevention
    
ELSE:
    → Proceed with direct execution
```

### **Manual Analysis Available**
```bash
# Analysis script exists but not required for normal usage
./scripts/subagent-integration.sh analyze npm "run test:e2e:smoke"
./scripts/subagent-integration.sh prompt npm "run dev"

# Environment variables for enhanced recommendations (optional)
USE_SUBAGENT=true npm run test:e2e:smoke:enhanced    # Always show Agent tool recommendations
CLAUDE_AUTO_SUBAGENT=true npm run dev               # Enhanced Claude integration
```

### **Performance Benefits**
- **Before**: 2-minute timeouts with no results
- **After**: 30-60 second successful execution via Agent tool
- **Success Rate**: 100% vs previous timeout failures
- **Workflow Enhancement**: Proactive timeout prevention

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
- .env*, .eslintrc.json, postcss.config.js
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