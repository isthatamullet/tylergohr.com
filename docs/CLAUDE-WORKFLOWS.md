# Claude Code Workflows - Tyler Gohr Portfolio

## Overview

This guide provides patterns and best practices for Claude Code instances working with the Tyler Gohr Portfolio project. **Philosophy: Proactively use the Agent tool for systematic approaches to complex operations rather than just reactive timeout prevention.**

## Quick Start - Claude Code Instances

### **Agent Tool Philosophy**
```bash
# Proactive Agent Tool Usage - Use for:
✅ Any operation with >30 second complexity potential
✅ Multi-step workflows and coordination tasks  
✅ Environment setup and validation scenarios
✅ Complex testing with multiple components
✅ When systematic approach would prevent issues
✅ When in doubt, prefer Agent tool over direct execution

# Standard commands - consider Agent tool proactively:
npm run dev                             # Agent tool for environment setup
npm run test:e2e:smoke                  # Agent tool for systematic testing
playwright test commands                # Agent tool for complex scenarios
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

### **Proactive Agent Tool Integration**
Use the Agent tool systematically for complex operations, not just reactively for timeouts:

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

### **Agent Tool Decision Philosophy**

```bash
# Proactive decision pattern for Claude Code instances:

IF operation_could_benefit_from_systematic_approach:
    → USE Agent tool proactively
    
IF multi_step_workflow OR coordination_needed:
    → USE Agent tool for orchestration
    
IF environment_setup OR complex_testing:
    → USE Agent tool for reliability
    
IF uncertain_about_complexity:
    → PREFER Agent tool over direct execution
    
RATIONALE: Prevention is better than debugging
```

### **High-Value Agent Tool Scenarios**
```bash
# Use Agent tool proactively for:
🔧 Development environment setup and health validation
🧪 Complex testing with environment coordination  
📁 Multi-file changes and feature implementation
🔍 Research and codebase analysis tasks
⚡ Quality gate orchestration and validation
🛠️ Any operation requiring systematic coordination
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

# Standard commands - use Agent tool when timeouts occur
npm run dev                           # Use Agent tool for environment setup issues
npm run test:e2e:smoke                # Use Agent tool for testing timeouts
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

### **Standard Commands with Agent Tool Guidance**
```bash
# Standard development commands - use Agent tool for complex operations
npm run dev                         # Development server (Agent tool for timeouts)
npm run test:e2e:smoke             # Quick testing (Agent tool for complex scenarios)
npm run test:e2e:claude-review     # Visual testing for Claude analysis
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

# Standard commands with Agent tool for complex operations:
# npm run dev, npm run test:e2e:smoke
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
✅ File protection understanding (currently enabled via simple hooks)
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

**Claude Code Focus**: Proactive Agent tool usage for systematic, reliable development workflows  
**Agent Tool Philosophy**: Prevention over reaction - use systematically for complex operations  
**File Protection**: Enabled via simple hooks for critical file safety  
**Development**: Intelligent automation through strategic Agent tool usage