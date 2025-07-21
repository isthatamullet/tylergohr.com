# Commands Reference - Tyler Gohr Portfolio

## Overview

This is a comprehensive quick reference for all essential commands in the Tyler Gohr Portfolio project, organized by workflow and usage scenario. Commands are optimized for both main portfolio and `/2` redesign development.

## Daily Development Commands

### **Starting Development**
```bash
# 🚀 PRIMARY DEVELOPMENT COMMANDS
npm run dev                      # Smart development server (auto port detection)
npm run dev:enhanced             # With sub-agent integration for timeout prevention
npm run dev:claude               # Claude Code optimized with automatic sub-agent alerts

# Port-specific servers (for conflict resolution)
npm run dev:3000                 # Force port 3000
npm run dev:3001                 # Force port 3001  
npm run dev:4000                 # Force port 4000

# Environment setup for manual commands
eval "$(./scripts/detect-active-port.sh quiet export)"  # Set ACTIVE_DEV_PORT and ACTIVE_DEV_URL
```

### **Quality Gates (MANDATORY)**
```bash
# 🔥 BEFORE EVERY COMMIT
npm run validate                 # Complete validation: typecheck + lint + build + bundle check

# Individual quality checks
npm run typecheck               # TypeScript validation
npm run lint                    # ESLint code quality
npm run build                   # Production build test
npm run bundle-check            # Bundle size validation (<6MB budget)
```

## Testing Commands

### **⚡ Fast Development Testing (NEW - Primary for Daily Use)**
```bash
# Quick validation during active development
npm run test:e2e:smoke          # Essential tests only (<1min)
npm run test:e2e:dev            # Functional testing, skip visual regression (2-3min)
npm run test:e2e:component      # Component-specific testing

# Enhanced testing with sub-agent integration
npm run test:e2e:smoke:enhanced # Smoke tests with sub-agent recommendations
npm run test:e2e:smoke:claude   # Automatic Claude Code sub-agent alerts
```

### **📸 Screenshot & Visual Testing**
```bash
# 🎯 RECOMMENDED: Quick screenshots for Claude review
npx playwright test e2e/quick-screenshots.spec.ts --project=chromium  # Fast, reliable (2-3min)

# Alternative screenshot commands
npm run test:e2e:screenshot:enhanced    # Sub-agent integration for screenshot generation
npm run test:e2e:claude-review         # Complete visual analysis for Claude
npm run test:e2e:claude-review:current # Current state capture for review
npm run test:e2e:preview               # Pre-commit visual preview

# Mobile screenshots
npm run test:e2e:screenshot:mobile     # Mobile viewport screenshots only
```

### **Comprehensive Testing Suites**
```bash
# /2 Redesign Testing
npm run test:e2e:portfolio      # Complete /2 redesign E2E tests (8-10min)
npm run test:e2e:navigation     # Navigation behavior + intersection observers
npm run test:e2e:visual         # Visual regression across viewports

# Specialized Testing
npm run test:e2e:accessibility  # WCAG 2.1 AA/AAA compliance testing
npm run test:e2e:performance    # Core Web Vitals and performance testing
npm run test:e2e:mobile         # Cross-device responsive validation
npm run test:e2e:api            # API endpoint testing

# Cross-browser Testing
npm run test:e2e:chrome         # Chromium-specific tests
npm run test:e2e:firefox        # Firefox compatibility
npm run test:e2e:safari         # Safari/WebKit compatibility
```

### **Testing Utilities**
```bash
# Interactive testing
npm run test:e2e:ui             # Playwright UI mode for interactive debugging
npm run test:e2e:headed         # Run tests in headed browser
npm run test:e2e:debug          # Enhanced debugging with infinite timeout

# Environment-aware testing  
SKIP_VISUAL=true npm run test:e2e:portfolio    # Skip visual regression during development
FAST_MODE=true npm run test:e2e:navigation     # Ultra-fast essential testing
npm run test:e2e:dev:verbose                   # Verbose output with HTML reporter

# Update visual baselines
npm run test:e2e:update-screenshots   # Update all visual regression baselines
```

## Environment & Port Management

### **Smart Port Detection**
```bash
# Automatic port detection (works in all environments)
./scripts/detect-active-port.sh               # Interactive mode with diagnostics
./scripts/detect-active-port.sh quiet         # Quiet mode
./scripts/detect-active-port.sh quiet export  # Shell export format
./scripts/detect-active-port.sh quiet json    # JSON format for scripts

# Manual environment setup
eval "$(./scripts/detect-active-port.sh quiet export)"  # Set environment variables
echo "Port: $ACTIVE_DEV_PORT, URL: $ACTIVE_DEV_URL"     # Check current settings

# Environment diagnostics
curl -s -k "$ACTIVE_DEV_URL" | head -5                  # Test server connectivity
```

### **VS Code Integration**
```bash
# VS Code task integration
npm run vscode:dev-server       # VS Code guided dev server setup
npm run vscode:test-suite       # VS Code guided testing workflow

# Task-managed testing (when VS Code tasks are active)
npm run test:e2e:task-managed   # Use VS Code task-managed environment
```

## Hook System Commands

### **Simple File Protection Management**
```bash
# File protection is now managed via ~/.claude/settings.json
# No complex orchestrator commands needed

# Emergency bypass when protection is active
HOOK_BYPASS_PROTECTION=true [command]     # Bypass file protection temporarily

# Current status: File protection is ACTIVE via simple hooks configuration
```

### **Hook-Integrated Workflows**
```bash
# Hooks-based screenshot generation
npm run hooks:screenshot        # Quick hook-powered screenshots
npm run hooks:visual-workflow   # Visual development workflow
npm run hooks:performance-check # Performance excellence check

# Puppeteer integration via hooks
npm run test:e2e:puppeteer-quick     # Quick Puppeteer screenshots
npm run test:e2e:puppeteer-component # Component-specific Puppeteer shots
npm run test:e2e:puppeteer-mobile    # Mobile Puppeteer screenshots
```

### **Hook System Debugging**
```bash
# File protection is managed via ~/.claude/settings.json
# No installation/uninstall scripts needed

# Manual hook testing
./scripts/hooks/pre-edit-validation.sh "Edit" "/path/to/file"
./scripts/hooks/post-edit-quality-gate.sh "component" "/path/to/file"
./scripts/hooks/visual-development-workflow.sh "/path/to/file"
./scripts/hooks/performance-excellence-check.sh "ui-component" "/path/to/file"
```

## Sub-Agent Integration Commands

### **Sub-Agent Analysis & Recommendations**
```bash
# Analyze commands for sub-agent needs
./scripts/subagent-integration.sh analyze npm "run test:e2e:smoke"     # Get recommendation
./scripts/subagent-integration.sh prompt npx "playwright test"         # Get Claude prompt
./scripts/subagent-integration.sh run npm run test:e2e:smoke          # Run with analysis

# Environment variables for sub-agent control
USE_SUBAGENT=true npm run test:e2e:smoke              # Always recommend sub-agent
CLAUDE_AUTO_SUBAGENT=true npm run dev                 # Enhanced Claude integration
FORCE_SUBAGENT=true npm run test:e2e:smoke           # Block direct execution
```

### **Claude Code Optimization**
```bash
# Claude-optimized commands with automatic sub-agent integration
npm run dev:claude                  # Dev server with Claude sub-agent alerts
npm run test:e2e:smoke:claude      # Testing with Claude sub-agent integration
npm run test:e2e:screenshot:enhanced # Screenshot generation with sub-agent support

# Priority alert activation
CLAUDE_AUTO_SUBAGENT=true npm run test:e2e:smoke     # Automatic Claude alerts
CLAUDE_AUTO_SUBAGENT=true ./scripts/detect-active-port.sh  # Port detection with alerts
```

## Deployment & Production Commands

### **Build & Validation**
```bash
# Production build testing
npm run build                   # Next.js production build
npm run start                   # Test production build locally
npm run bundle-check            # Validate bundle size (<6MB)

# Pre-deployment validation
npm run validate                # Complete quality gates
npm run test:e2e:portfolio     # Comprehensive E2E validation
npm run test:e2e:performance   # Performance validation
```

### **Deployment Scripts**
```bash
# Staging deployment
./scripts/deploy-staging.sh                    # Deploy current branch to staging
./scripts/deploy-staging.sh feature/new-feature # Deploy specific branch

# Container testing
docker build -t tylergohr-portfolio .          # Build production container
docker run -p 3000:3000 tylergohr-portfolio   # Test container locally
curl http://localhost:3000/api/health          # Test health endpoint
```

## GitHub & Project Management

### **Issue Management**
```bash
# Check current development context
gh issue list --state open                    # All open issues
gh issue list --label "redesign"              # /2 redesign tasks
gh issue list --label "/2"                    # /2 specific issues
gh issue view 1                               # View specific issue details

# GitHub CLI utilities
gh pr list                                     # List pull requests
gh pr create --title "feature" --body "description"  # Create PR
gh repo view                                   # Repository overview
```

### **Git Workflow**
```bash
# Branch management for /2 work
git checkout -b feature/2-short-name          # Create /2 feature branch
git status                                    # Check current state
git add .                                     # Stage changes
git commit -m "feat: description"            # Commit with conventional format

# Development context switching
cd /home/user/tylergohr.com/src/app/2/       # /2 redesign context
cd /home/user/tylergohr.com/                 # Main portfolio context
```

## Performance & Monitoring

### **Bundle Analysis**
```bash
# Bundle size monitoring
npm run bundle-check                # Quick bundle size check
npx next build --analyze           # Detailed bundle composition analysis

# Performance testing
npm run test:e2e:performance       # Core Web Vitals testing
lighthouse http://localhost:3000   # Lighthouse performance audit
```

### **Core Web Vitals Targets**
```bash
# Performance standards (enforced by testing)
# LCP: <2.5s (Largest Contentful Paint)
# FID: <100ms (First Input Delay)  
# CLS: <0.1 (Cumulative Layout Shift)
# Bundle: <6MB (Bundle size budget)
```

## Troubleshooting Commands

### **Development Server Issues**
```bash
# Kill existing servers
pkill -f "next-server|npm run dev"           # Kill all Next.js processes
ps aux | grep -E "next-server|npm run dev"   # Find active dev processes
lsof -ti :3000 | xargs kill                  # Kill process on specific port

# Environment reset
unset ACTIVE_DEV_PORT ACTIVE_DEV_URL         # Clear environment variables
./scripts/detect-active-port.sh              # Re-detect port settings
```

### **Testing Issues**
```bash
# Reset testing environment
npx playwright install                       # Reinstall Playwright browsers
npx playwright install-deps                  # Install system dependencies
rm -rf test-results/                         # Clear test results

# Debug failing tests
npx playwright test --grep "specific test name" --headed    # Run specific test in browser
npx playwright test --reporter=html                         # Generate HTML report
npx playwright show-report                                  # View test report
```

### **Hook System Issues**
```bash
# File protection debugging
HOOK_BYPASS_PROTECTION=true [command]        # Bypass file protection
# Hook logs appear in Claude Code interface when protection is triggered
# No complex orchestrator debugging needed

# Emergency reset: Remove "hooks" section from ~/.claude/settings.json to disable
# Re-add "hooks" section to ~/.claude/settings.json to re-enable
```

## Environment Variables Reference

### **Development Control**
```bash
export PORT=3000                      # Force specific port for dev server
export NODE_ENV=development           # Development mode
export ACTIVE_DEV_PORT=3000           # Detected active port
export ACTIVE_DEV_URL="http://localhost:3000"  # Constructed dev URL
```

### **Testing Control**
```bash
export SKIP_VISUAL=true               # Skip visual regression tests
export FAST_MODE=true                 # Ultra-fast testing mode
export PUPPETEER_FIRST=true           # Use Puppeteer before Playwright
```

### **Sub-Agent Control**
```bash
export USE_SUBAGENT=true              # Always recommend sub-agent
export CLAUDE_AUTO_SUBAGENT=true      # Enhanced Claude Code integration
export FORCE_SUBAGENT=true            # Block direct execution of timeout-prone commands
export HOOK_BYPASS_PROTECTION=true   # Bypass file protection (emergency)
```

## Quick Reference Cheat Sheet

### **Daily Development Workflow**
```bash
# 1. Start development
npm run dev                           # Smart dev server
npm run test:e2e:smoke               # Quick validation (<1min)

# 2. During development  
npm run test:e2e:dev                 # Functional testing (2-3min)
npx playwright test e2e/quick-screenshots.spec.ts --project=chromium  # Visual review

# 3. Before commit
npm run validate                     # Quality gates
npm run test:e2e:portfolio          # Full validation

# 4. Emergency reset
pkill -f "next-server" && npm run dev  # Restart dev server
```

### **Context Switching**
```bash
# /2 Redesign Development
cd /home/user/tylergohr.com/src/app/2/ && claude code

# Main Portfolio Development  
cd /home/user/tylergohr.com/ && claude code

# Check development context
gh issue list --label "redesign"     # /2 tasks
pwd | grep -q "/2" && echo "/2 context" || echo "Main context"
```

---

**Command Focus**: Fast development workflows, timeout prevention, environment automation  
**Sub-Agent Integration**: Automatic Claude Code optimization for complex operations  
**Testing Strategy**: Playwright-only with fast development patterns and visual automation  
**Performance**: <1min smoke tests, 2-3min functional tests, comprehensive validation when ready