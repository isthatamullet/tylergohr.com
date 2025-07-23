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

## 🤖 Agent Tool Usage

**Philosophy**: Proactive Agent tool usage for systematic, reliable development workflows.

**For detailed patterns and workflows**: See @docs/CLAUDE-WORKFLOWS.md

**Quick reminder**: Use Agent tool proactively for:
- Environment setup (`npm run dev`)
- Complex testing (`npm run test:e2e:smoke`) 
- Multi-step operations
- When in doubt, prefer Agent tool over direct execution

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
File protection is now managed via `~/.claude/settings.json` configuration:
```
scripts/hooks/lib/
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
# File protection is managed via ~/.claude/settings.json
# Currently ENABLED - configured in settings with hooks section

# To disable: Remove the "hooks" section from ~/.claude/settings.json
# To enable: Add hooks configuration back to ~/.claude/settings.json
```

---


## 📚 Documentation Guide

### **Available Documentation Files**
For detailed information on specific topics, Claude Code instances should reference these files:

- **@docs/CLAUDE-WORKFLOWS.md** - Agent tool patterns, workflow optimization, proactive usage philosophy
- **@docs/COMMANDS.md** - All available commands with usage scenarios and examples  
- **@docs/TESTING.md** - Complete testing workflows (Playwright, fast development patterns)
- **@docs/TROUBLESHOOTING.md** - Common issues, solutions, and emergency recovery procedures
- **@docs/DEPLOYMENT.md** - Google Cloud Run deployment, staging, production procedures

### **Documentation Restructure Methodology**
This documentation structure follows a systematic restructure plan that transformed CLAUDE.md from 2000+ lines into a focused 500-line "command center" with specialized reference files.

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
npm run dev                 # Development server (use Agent tool if timeouts occur)
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
npm run dev                                              # Development server
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

**⚠️ Experiencing 2-minute timeouts?** Use the Agent tool for complex operations as described in @docs/CLAUDE-WORKFLOWS.md

*For complete Claude Code optimization patterns, see @docs/CLAUDE-WORKFLOWS.md*

---

**Enterprise Solutions Architect Portfolio - Built for Business Impact** 🏢