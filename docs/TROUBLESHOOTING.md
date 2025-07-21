# Troubleshooting Guide - Tyler Gohr Portfolio

## Overview

This guide provides solutions for common development, testing, and deployment issues in the Tyler Gohr Portfolio project. Solutions are organized by problem category with step-by-step resolution procedures.

## Development Server Issues

### **Server Not Starting / Port Conflicts**

#### Problem: `npm run dev` fails or shows port conflicts
```bash
# Symptoms
Error: listen EADDRINUSE: address already in use :::3000
# or
TypeError: fetch failed (connection refused)
```

#### Solution 1: Use Smart Port Detection
```bash
# Let smart-dev.sh handle port conflicts automatically
npm run dev                        # Detects existing servers or finds available port

# If that fails, check what's running
./scripts/detect-active-port.sh    # Interactive port detection
lsof -i :3000                     # Check what's using port 3000
```

#### Solution 2: Force Specific Port
```bash
# Try alternative ports
npm run dev:3001                   # Force port 3001
npm run dev:4000                   # Force port 4000

# Or manually set port
PORT=3002 npm run dev              # Use custom port
```

#### Solution 3: Clean Restart
```bash
# Kill all Next.js processes
pkill -f "next-server|npm run dev"
ps aux | grep -E "next-server|npm run dev" | grep -v grep  # Verify killed

# Clear environment and restart
unset ACTIVE_DEV_PORT ACTIVE_DEV_URL
npm run dev
```

### **Development Server Timeouts (2+ Minutes)**

#### Problem: Commands timeout after 2 minutes
```bash
# Symptoms
Command timed out after 120000ms
npm run dev hangs indefinitely
```

#### Solution 1: Use Sub-Agent Integration (RECOMMENDED)
```bash
# For Claude Code instances - use Agent tool with these patterns:

# Environment setup timeout
Use the Agent tool to handle complete environment setup:
1. Detect active development server ports
2. Verify server health and accessibility  
3. Set correct environment variables
4. Start fresh server if needed

# Testing timeout
Use the Agent tool to execute tests with full environment validation:
1. Verify development server is running
2. Set correct environment variables for testing
3. Execute command with proper timeout handling
```

#### Solution 2: Enhanced Commands
```bash
# Use enhanced versions designed to prevent timeouts
npm run dev:enhanced               # Sub-agent integration
npm run dev:claude                 # Claude Code optimized
npm run test:e2e:smoke:enhanced    # Enhanced testing
```

#### Solution 3: Environment Variables
```bash
# Enable automatic sub-agent recommendations
export CLAUDE_AUTO_SUBAGENT=true
npm run dev                        # Will show sub-agent recommendations

# Force sub-agent usage for timeout-prone commands
export FORCE_SUBAGENT=true
npm run test:e2e:smoke            # Will block and require Agent tool
```

### **Cloud Environment Issues (Google Cloud Workstations, Codespaces)**

#### Problem: URLs not working in cloud environments
```bash
# Symptoms
http://localhost:3000 not accessible in cloud environment
Testing commands can't reach development server
```

#### Solution: Use Smart Port Detection
```bash
# Detect cloud environment and construct proper URLs
./scripts/detect-active-port.sh
# Output example: https://3000-tylergohr.cluster-[id].cloudworkstations.dev

# Set environment variables for testing
eval "$(./scripts/detect-active-port.sh quiet export)"
echo "URL: $ACTIVE_DEV_URL"       # Verify correct cloud URL

# Test connectivity
curl -s -k "$ACTIVE_DEV_URL" | head -5
```

## Testing Issues

### **Playwright Installation Problems**

#### Problem: Playwright tests fail with browser installation errors
```bash
# Symptoms
browserType.launch: Executable doesn't exist
Error: Cannot find module '@playwright/test'
```

#### Solution: Complete Playwright Setup
```bash
# 1. Install system dependencies (REQUIRES SUDO)
sudo npx playwright install-deps

# 2. Install browser binaries
npx playwright install

# 3. Verify installation
npx playwright --version
npm run test:e2e:smoke            # Test basic functionality

# If still failing, try individual browser install
npx playwright install chromium firefox webkit
```

#### Troubleshooting Playwright Issues
```bash
# Check Playwright configuration
cat playwright.config.ts          # Verify config is correct

# Reset Playwright installation
rm -rf ~/.cache/ms-playwright/     # Clear browser cache
npx playwright install            # Reinstall browsers

# Test with specific browser
npx playwright test --project=chromium --headed  # Test with visible browser
```

### **Test Timeouts and Environment Setup**

#### Problem: Tests timeout or can't reach development server
```bash
# Symptoms
Test timeout exceeded (30000ms)
Error: connect ECONNREFUSED ::1:3000
```

#### Solution 1: Use Agent Tool (RECOMMENDED for Claude Code)
```bash
# For complex test operations, use Agent tool with this pattern:
Use the Agent tool to execute tests with full environment validation:
1. Verify development server is running and accessible
2. Set correct environment variables for testing
3. Execute the test command with proper timeout handling
4. Handle Framer Motion animation timing issues if present
5. Generate screenshots for visual validation if applicable
```

#### Solution 2: Environment Validation Before Testing
```bash
# Ensure environment is ready before testing
./scripts/detect-active-port.sh              # Verify dev server
eval "$(./scripts/detect-active-port.sh quiet export)"  # Set environment
curl -s "$ACTIVE_DEV_URL" | grep -q "next"   # Test connectivity

# Then run tests
npm run test:e2e:smoke                       # Quick validation
```

#### Solution 3: Alternative Testing Approaches
```bash
# Use development testing pattern (faster)
npm run test:e2e:dev                         # Functional tests, skip visual
SKIP_VISUAL=true npm run test:e2e:portfolio  # Skip visual regression

# Use enhanced testing with sub-agent support
npm run test:e2e:smoke:enhanced              # Sub-agent integration
```

### **Visual Regression / Screenshot Issues**

#### Problem: Screenshot generation fails or times out
```bash
# Symptoms
Screenshots not generated in expected directories
Visual regression tests fail with timeout
```

#### Solution 1: Use Quick Screenshot Method (RECOMMENDED)
```bash
# Use optimized screenshot generation
npx playwright test e2e/quick-screenshots.spec.ts --project=chromium

# Check output location
ls -la screenshots/quick-review/             # Should contain desktop/mobile screenshots
```

#### Solution 2: Environment-Specific Solutions
```bash
# For cloud environments, verify URLs
./scripts/detect-active-port.sh              # Ensure correct URL construction
echo "Testing URL: $ACTIVE_DEV_URL"

# Test single page screenshot
npx playwright test e2e/quick-screenshots.spec.ts --project=chromium --grep "homepage only"
```

#### Solution 3: Fallback to Puppeteer
```bash
# If Playwright screenshots fail, try Puppeteer
npm run test:e2e:puppeteer-quick            # Puppeteer quick screenshots
npm run hooks:screenshot                    # Hook-powered screenshots
```

## Hook System Issues

### **File Protection Blocking Development**

#### Problem: Hooks preventing necessary file modifications
```bash
# Symptoms
🛡️ PROTECTED FILE DETECTED: [filename]
🛡️ Confirmation required: yes
Hook validation blocking edits
```

#### Solution 1: Understand Protection Levels
```bash
# Check protection configuration
cat scripts/hooks/config/protected-files.json

# Protection levels:
# - critical: package.json, next.config.js, tsconfig.json
# - important: CLAUDE.md, README.md, Dockerfile
# - design_system: brand-tokens.css, globals.css
# - configuration: .env*, eslint.config.js
```

#### Solution 2: Safe Override Patterns
```bash
# Emergency bypass (use carefully)
HOOK_BYPASS_PROTECTION=true [command]

# Example: Emergency config file edit
HOOK_BYPASS_PROTECTION=true npx code next.config.js
```

#### Solution 3: Request User Confirmation
```bash
# For Claude Code instances:
# 1. Explain why the protected file needs modification
# 2. Ask user for explicit confirmation
# 3. Proceed only after user grants permission
```

### **Hook System Performance Issues**

#### Problem: Hooks causing slowdowns or failures
```bash
# Symptoms
Hook execution taking too long
Hook system error messages
Performance degradation with hooks active
```

#### Solution 1: Check File Protection Status
```bash
# File protection is managed via ~/.claude/settings.json
# Check if "hooks" section exists in settings
cat ~/.claude/settings.json | grep -A10 "hooks"

# File protection logs appear in Claude Code interface when triggered
```

#### Solution 2: Reset File Protection
```bash
# Disable file protection (remove hooks from settings)
# Edit ~/.claude/settings.json and remove the "hooks" section

# Re-enable file protection (add hooks back to settings)
# Add the hooks configuration back to ~/.claude/settings.json
# File protection uses simple JSON configuration, no installation needed
```

#### Solution 3: Temporary Hook Bypass
```bash
# Bypass hook system for immediate development needs
export HOOK_BYPASS_PROTECTION=true
# Work with hooks disabled
unset HOOK_BYPASS_PROTECTION                  # Re-enable when done
```

## Build and Production Issues

### **Build Failures**

#### Problem: Production build fails
```bash
# Symptoms
npm run build fails with errors
TypeScript compilation errors
ESLint rule violations
```

#### Solution 1: Quality Gates Validation
```bash
# Run individual quality checks
npm run typecheck                    # Fix TypeScript errors first
npm run lint                         # Fix ESLint issues
npm run build                        # Then try build

# Full validation
npm run validate                     # All quality gates together
```

#### Solution 2: Common Build Issues
```bash
# TypeScript errors
npx tsc --noEmit --skipLibCheck      # Check for type issues
# Fix type errors in components, then retry

# ESLint errors  
npx eslint . --fix                   # Auto-fix what's possible
# Manually fix remaining linting issues

# Dependency issues
rm -rf node_modules package-lock.json
npm ci                               # Clean dependency install
```

### **Bundle Size Exceeds Budget**

#### Problem: Bundle size over 6MB limit
```bash
# Symptoms
❌ Bundle size exceeds budget: 7500KB > 6MB
Bundle size check fails
```

#### Solution 1: Analyze Bundle Composition
```bash
# Detailed bundle analysis
npx next build --analyze             # Generate bundle analysis
# Opens interactive bundle analyzer in browser

# Quick bundle check
npm run bundle-check                 # Check current size
du -sh .next/static                  # Manual size check
```

#### Solution 2: Optimize Bundle Size
```bash
# Check for large dependencies
npm ls --depth=0                     # List direct dependencies
# Look for unexpectedly large packages

# Optimize imports (example)
# Bad:  import * as Icons from 'lucide-react'
# Good: import { User, Mail } from 'lucide-react'

# Check next.config.js optimizations
grep -A 10 "modularizeImports" next.config.js
```

### **Container / Docker Issues**

#### Problem: Docker build or runtime failures
```bash
# Symptoms
Docker build fails
Container won't start
Health check failures
```

#### Solution 1: Local Container Testing
```bash
# Build and test locally
docker build -t tylergohr-portfolio .
docker run -p 3000:3000 tylergohr-portfolio

# Test health endpoint
curl http://localhost:3000/api/health
# Should return: {"status": "healthy", ...}
```

#### Solution 2: Container Debugging
```bash
# Check container logs
docker logs [container-id]

# Interactive container debugging
docker run -it --entrypoint /bin/sh tylergohr-portfolio
# Explore container filesystem and setup

# Check standalone build
ls -la .next/standalone               # Verify standalone build exists
```

## Environment and Configuration Issues

### **Environment Variable Problems**

#### Problem: Environment variables not working correctly
```bash
# Symptoms
ACTIVE_DEV_PORT not set
ACTIVE_DEV_URL incorrect
Environment-dependent features failing
```

#### Solution 1: Reset Environment Detection
```bash
# Clear and re-detect environment
unset ACTIVE_DEV_PORT ACTIVE_DEV_URL
./scripts/detect-active-port.sh              # Re-run detection
eval "$(./scripts/detect-active-port.sh quiet export)"  # Set variables

# Verify settings
echo "Port: $ACTIVE_DEV_PORT"
echo "URL: $ACTIVE_DEV_URL"
```

#### Solution 2: Manual Environment Setup
```bash
# For local development
export ACTIVE_DEV_PORT=3000
export ACTIVE_DEV_URL="http://localhost:3000"

# For cloud environments (example Google Cloud Workstations)
export ACTIVE_DEV_PORT=3000
export ACTIVE_DEV_URL="https://3000-tylergohr.cluster-[id].cloudworkstations.dev"
```

### **VS Code Integration Issues**

#### Problem: VS Code tasks not working properly
```bash
# Symptoms
VS Code tasks fail to start dev server
Task-managed port detection not working
Auto-start dev server not triggering
```

#### Solution 1: Check VS Code Configuration
```bash
# Verify tasks configuration
cat .vscode/tasks.json               # Check task definitions
cat .vscode/settings.json            # Check VS Code settings

# Test VS Code integration manually
npm run vscode:dev-server            # Manual VS Code guidance
npm run vscode:test-suite            # Test suite guidance
```

#### Solution 2: Reset VS Code Integration
```bash
# Clear VS Code workspace state
rm -rf .vscode/settings.json.backup
# Restart VS Code and folder

# Test task-managed environment
npm run test:e2e:task-managed        # Should use VS Code environment
```

## Performance and Memory Issues

### **Out of Memory Errors**

#### Problem: Build or test processes run out of memory
```bash
# Symptoms
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed
JavaScript heap out of memory
```

#### Solution 1: Increase Node.js Memory
```bash
# Increase memory for specific commands
NODE_OPTIONS="--max_old_space_size=4096" npm run build
NODE_OPTIONS="--max_old_space_size=4096" npm run test:e2e:portfolio

# For development server
NODE_OPTIONS="--max_old_space_size=4096" npm run dev
```

#### Solution 2: Optimize Testing Strategy
```bash
# Use memory-efficient testing patterns
npm run test:e2e:smoke               # Minimal memory usage
npm run test:e2e:dev                 # Skip memory-intensive visual tests
SKIP_VISUAL=true npm run test:e2e:portfolio  # Skip visual regression
```

### **Animation Performance Issues**

#### Problem: Animations are janky or causing performance problems
```bash
# Symptoms
Framer Motion animations dropping frames
Page scrolling feels sluggish
Core Web Vitals scores degraded
```

#### Solution 1: Animation Debugging
```bash
# Test with reduced motion
# Add ?reducedMotion=true to URL for testing

# Check animation performance
npm run test:e2e:performance         # Performance-specific tests
# Look for CLS and FID issues
```

#### Solution 2: Optimize Animation Settings
```bash
# Check for will-change CSS properties
grep -r "will-change" src/           # Should be used sparingly

# Verify GPU acceleration
grep -r "transform3d\|translateZ" src/  # Check for GPU-accelerated animations
```

## Emergency Recovery Procedures

### **Complete Environment Reset**

#### When everything seems broken
```bash
# 1. Kill all processes
pkill -f "next-server|npm|playwright|node"

# 2. Clear caches and temporary files
rm -rf node_modules .next test-results
rm -rf ~/.cache/ms-playwright

# 3. Clean install
npm ci
sudo npx playwright install-deps
npx playwright install

# 4. Reset environment detection
unset ACTIVE_DEV_PORT ACTIVE_DEV_URL
./scripts/detect-active-port.sh

# 5. Test basic functionality
npm run dev &
sleep 10
npm run test:e2e:smoke
```

### **Hook System Emergency Reset**

#### When hook system is completely broken
```bash
# 1. Bypass all hooks temporarily
export HOOK_BYPASS_PROTECTION=true

# 2. Reset file protection system
# Remove "hooks" section from ~/.claude/settings.json

# 3. Clean any temporary files
rm -rf /tmp/claude-hooks-*
rm -rf ~/.claude/temp-hooks-*

# 4. Reinstall fresh
# File protection is now managed via simple JSON configuration
# No installation scripts needed

# 5. Verify file protection is working
# Try editing a protected file like package.json to test
```

### **Project Repository Reset**

#### When git state is problematic
```bash
# Check git status
git status
git log --oneline -10

# If working directory is clean but issues persist
git clean -fdx                       # Remove all untracked files
npm ci                               # Reinstall dependencies

# If major git issues
git stash                            # Save current work
git reset --hard HEAD               # Reset to last commit
git stash pop                        # Restore work if needed
```

---

**Troubleshooting Focus**: Rapid issue resolution with escalating solution complexity  
**Timeout Prevention**: Sub-agent integration patterns for Claude Code instances  
**Environment Compatibility**: Cloud environment and local development solutions  
**Emergency Procedures**: Complete recovery patterns for critical system failures