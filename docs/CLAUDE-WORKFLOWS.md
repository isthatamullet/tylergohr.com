# Claude Code Workflows - Tyler Gohr Portfolio

## Overview

This guide provides patterns and best practices for Claude Code instances working with the Tyler Gohr Portfolio project. The project uses simple npm commands with Agent tool guidance for timeout prevention and reliable development processes.

## Quick Start - Claude Code Instances

### **Timeout-Prone Command Recognition**
```bash
# Watch for these commands that may timeout in cloud environments
npm run dev                             # 2-minute timeout risk
npm run test:e2e:smoke                  # 2-minute timeout risk
playwright test commands                # Timeout-prone

# When you see timeouts - USE AGENT TOOL
# Enhanced commands serve as reminders:
npm run dev:enhanced                    # Reminds you to use Agent tool
npm run test:e2e:smoke:enhanced         # Reminds you to use Agent tool
```

### **Daily Workflow Pattern**
```bash
# 1. Check project status
gh issue list --state open               # Active development tasks
npm run test:e2e:smoke                    # Quick validation (<1min)

# 2. Development (use Agent tool if timeouts occur)
npm run dev                               # May timeout in cloud environments
npm run test:e2e:smoke                    # May timeout in cloud environments

# 4. Visual review with Claude
npx playwright test e2e/quick-screenshots.spec.ts --project=chromium
```

## Agent Tool Integration

### **Simple Timeout Prevention**
When commands timeout after 2 minutes, use the Agent tool with these patterns:

### **Sub-Agent Patterns**

#### **1. Environment Setup Agent**
```bash
# Triggered by: npm run dev, port conflicts, server issues
# Use when: Starting development servers, environment setup

💡 Claude Prompt Pattern:
"Use the Agent tool to handle complete environment setup for this command:

**Task**: 
1. Detect active development server ports
2. Verify server health and accessibility  
3. Set correct environment variables (ACTIVE_DEV_PORT, ACTIVE_DEV_URL)
4. Clean up any conflicting or unresponsive servers
5. Start fresh server if needed
6. Validate environment is ready for development/testing

**Goal**: Eliminate timeout issues by ensuring proper environment setup."
```

#### **2. Test Execution Agent**
```bash
# Triggered by: npm run test:e2e:smoke, playwright commands, testing operations
# Use when: Running E2E tests, screenshot generation, comprehensive testing

💡 Claude Prompt Pattern:
"Use the Agent tool to execute this test command with full environment validation:

**Task**:
1. Verify development server is running and accessible
2. Set correct environment variables for testing
3. Execute the test command with proper timeout handling
4. Provide detailed analysis of any failures
5. Handle Framer Motion animation timing issues if present
6. Generate screenshots for visual validation if applicable

**Goal**: Transform 2-minute timeout failures into successful test execution."
```

#### **3. Timeout Prevention Agent**
```bash
# Triggered by: Complex operations, multi-step commands, historically problematic tasks
# Use when: Any operation that has previously timed out

💡 Claude Prompt Pattern:
"Use the Agent tool to handle this timeout-prone operation:

**Task**:
1. Analyze why this command typically times out
2. Set up optimal environment conditions
3. Execute with intelligent retry and fallback strategies
4. Provide detailed feedback on execution results
5. Recommend permanent solutions to prevent future timeouts

**Goal**: Ensure reliable execution of commands that historically timeout."
```

### **Agent Tool Decision Guide**

```bash
# Simple decision pattern for Claude Code instances:

IF previous_attempt_timed_out_at_2_minutes:
    → USE Agent tool with appropriate pattern immediately
    
ELIF command matches ["npm run dev", "npm run test:e2e:smoke", "playwright test"]:
    → CONSIDER Agent tool for reliability in cloud environments
    
ELIF working_in_cloud_environment AND complex_operation:
    → RECOMMEND Agent tool for timeout prevention
    
ELSE:
    → Proceed with direct execution
```

### **When to Use Agent Tool**
```bash
# Use Agent tool for these timeout-prone operations:
npm run dev                              # Environment setup timeouts
npm run test:e2e:smoke                   # Test execution timeouts
playwright test commands                 # Complex testing operations

# Enhanced commands serve as reminders:
npm run dev:enhanced                     # Reminds you to use Agent tool
npm run test:e2e:smoke:enhanced          # Reminds you to use Agent tool
```

## File Protection System

### **What It Does**
```bash
# Safety net for AI-assisted development
# Prevents accidental corruption of critical files
# Currently ENABLED via simple hooks configuration
# Will prompt for confirmation before modifying protected files
```

### **Protected File Categories**
```bash
# CRITICAL FILES (require explicit confirmation)
- package.json, package-lock.json
- next.config.js, tsconfig.json
- playwright.config.ts

# IMPORTANT FILES (backup before modification)
- CLAUDE.md, README.md
- Dockerfile, docker-compose.yml

# DESIGN SYSTEM FILES (brand validation required)
- src/app/styles/brand-tokens.css
- src/app/globals.css

# CONFIGURATION FILES (audit logging)
- .env*, postcss.config.js, eslint.config.js
```

### **How To Enable/Disable**
```bash
# File protection is now ENABLED via ~/.claude/settings.json

# To disable: Remove the "hooks" section from ~/.claude/settings.json
# To enable: Add hooks configuration to ~/.claude/settings.json

# Emergency bypass (when protection is active)
HOOK_BYPASS_PROTECTION=true [command]

# Current status: File protection is ACTIVE
```


## Testing Workflow Integration

### **Fast Development Testing**
```bash
# 🚀 OPTIMIZED DAILY TESTING PATTERN
npm run test:e2e:smoke               # Essential validation (<1min)
npm run test:e2e:dev                 # Functional testing (2-3min)
npm run test:e2e:component           # Component-specific testing

# 📸 CLAUDE VISUAL REVIEW
npx playwright test e2e/quick-screenshots.spec.ts --project=chromium  # RECOMMENDED
npm run test:e2e:claude-review       # Complete visual analysis
```

### **Screenshot Generation for Claude Analysis**
```bash
# Quick screenshot locations for Claude review
screenshots/quick-review/
├── homepage-desktop.png & homepage-mobile.png
├── case-studies-desktop.png & case-studies-mobile.png  
├── how-i-work-desktop.png & how-i-work-mobile.png
└── technical-expertise-desktop.png & technical-expertise-mobile.png

# Usage pattern
npx playwright test e2e/quick-screenshots.spec.ts --project=chromium
# Then analyze screenshots in screenshots/quick-review/
```

### **Environment-Aware Testing**
```bash
# Skip visual regression during development
SKIP_VISUAL=true npm run test:e2e:portfolio

# Ultra-fast essential testing
FAST_MODE=true npm run test:e2e:navigation

# Enhanced commands serve as Agent tool reminders
npm run dev:enhanced                  # Use Agent tool if timeouts occur
npm run test:e2e:smoke:enhanced       # Use Agent tool if timeouts occur
```

## Quality Gates & Validation

### **Pre-Work Validation**
```bash
# MANDATORY before starting development
npm run test:e2e:smoke              # Quick validation (<1min)
npm run validate                    # typecheck + lint + build

# Branch and issue context
gh issue list --label "redesign"    # Check /2 development tasks
git status                          # Check current branch state
```

### **Pre-Commit Validation**
```bash
# MANDATORY before commits
npm run validate                    # Standard quality gates
npm run test:e2e:portfolio         # /2-specific E2E validation
npm run test:e2e:visual           # Visual regression testing

# Optional comprehensive validation
npm run test:e2e:accessibility     # WCAG 2.1 AA compliance
npm run test:e2e:mobile           # Cross-device validation
```



## Development Automation

### **VS Code Integration**
```bash
# Auto-start dev server on folder open
.vscode/tasks.json configured with "runOn": "folderOpen"

# Available tasks:
- Dev Server (Auto-start)
- Test: E2E Smoke Tests
- Test: E2E Development Tests
- Test: Quick Screenshots
- Validate: Quality Gates
```

### **Claude-Optimized Commands**
```bash
# Enhanced development commands
npm run dev:claude                  # Claude Code optimized dev server
npm run test:e2e:smoke:claude      # Test execution with Agent tool integration
npm run test:e2e:claude-review     # Visual testing for Claude analysis

# Enhanced commands with Agent tool reminders
npm run dev:enhanced                  # Timeout-resistant with Agent tool guidance
npm run test:e2e:smoke:enhanced       # Timeout-resistant with Agent tool guidance
```

## Troubleshooting Patterns

### **Common Timeout Scenarios**
```bash
# Scenario 1: npm run dev timing out
→ Use environment_setup_agent pattern
→ Agent tool handles port detection and server setup

# Scenario 2: npm run test:e2e:smoke timing out
→ Use test_execution_agent pattern  
→ Agent tool handles environment validation and test execution

# Scenario 3: Complex multi-step operations
→ Use timeout_prevention_agent pattern
→ Agent tool handles complexity analysis and execution strategy
```

### **Emergency Procedures**
```bash
# If hooks system is blocking development
HOOK_BYPASS_PROTECTION=true [command]

# If all tests are failing
pkill -f "next-server|npm run dev"     # Kill existing servers
npm run dev                            # Start fresh

# Enhanced commands are just reminders - no environment variables needed
# Use standard commands if you prefer: npm run dev, npm run test:e2e:smoke
```

## Performance Optimization

### **Bundle Size Monitoring**
```bash
# Budget enforcement
npm run bundle-check                # <6MB budget validation
npm run build                       # Production build test

# Analysis tools
npx next build --analyze            # Bundle composition analysis
```

### **Core Web Vitals Targets**
```bash
# Performance standards for both routes
- LCP (Largest Contentful Paint): <2.5s
- FID (First Input Delay): <100ms  
- CLS (Cumulative Layout Shift): <0.1
- Bundle Size: <6MB total
```

## Success Metrics

### **Claude Code Efficiency**
```bash
# Indicators of optimal Claude Code workflow
✅ Agent tool used for timeout-prone operations when needed
✅ File protection understanding (currently disabled for simplicity)
✅ Context switching between main and /2 development seamless
✅ Quality gates passed before commits
✅ Environment setup automated via port detection
✅ Visual testing integrated into development workflow
```

### **Development Velocity**
```bash
# Performance improvements with proper Claude Code integration
- 2-minute timeout failures → 30-60 second successful execution
- Manual environment setup → Automatic port detection and validation
- Ad-hoc testing → Structured fast development testing pattern
- Context confusion → Clear main vs /2 development separation
- File protection accidents → Automated prevention with override capability
```

---

**Claude Code Focus**: Simple npm commands with Agent tool guidance for timeout prevention  
**Agent Tool Usage**: Reliable execution vs 2-minute timeout failures  
**File Protection**: Optional basic protection for critical files  
**Development**: Fast 4-6 second workflows vs complex automation