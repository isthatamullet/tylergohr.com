# Development Guide - Tyler Gohr Portfolio

## Overview

This guide covers daily development workflows for the Tyler Gohr Portfolio (Enterprise Solutions Architect). Use this as your primary reference for efficient development within the sophisticated automation and testing infrastructure.

## Development Environment Setup

### **Quick Start**
```bash
# Navigate to enterprise portfolio development context
cd /home/user/tylergohr.com/

# Start development server (auto-detects optimal port)
npm run dev                          # Smart development server with port detection

# Alternative development servers
npm run dev:enhanced                 # Sub-agent integration for timeout prevention
npm run dev:claude                   # Claude Code optimized with priority alerts
```

### **VS Code Integration & Auto-Start**
The project includes VS Code task integration for automated development workflows:

```bash
# VS Code tasks automatically configured in .vscode/tasks.json
# - Auto-starts dev server on workspace open
# - Integrated testing workflows
# - Port detection and environment setup

# Manual VS Code integration commands
npm run vscode:dev-server            # VS Code-managed development server
npm run vscode:test-suite            # VS Code-integrated testing
```

### **Environment Variables & Port Detection**
```bash
# Set environment for current shell (cloud workstations)
eval "$(./scripts/detect-active-port.sh quiet export)"

# Manual environment setup
./scripts/init-port-env.sh           # Initialize port environment
./scripts/ensure-port-env.sh         # Ensure port environment is set

# Check current environment
echo "Port: $ACTIVE_DEV_PORT, URL: $ACTIVE_DEV_URL"
```

## Enterprise Portfolio Architecture

### **Component Organization**
```bash
src/app/components/
├── About/                           # Network animation & Emmy Award background
├── BrowserTabs/                     # Cross-page browser tab simulation
│   ├── BrowserTabs.tsx              # Main tab interface
│   ├── CaseStudyContent.tsx         # Case studies tab content
│   └── TechnicalExpertiseContent.tsx # Technical expertise tab content
├── CaseStudies/                     # Interactive project showcases
│   ├── CaseStudiesPreview.tsx       # Homepage preview cards
│   ├── CaseStudyCard.tsx           # Individual project cards
│   └── CaseStudyCard3D.tsx         # 3D enhanced project cards
├── Contact/                         # Professional engagement forms
├── Hero/                           # Enterprise Solutions Architect positioning
├── HowIWork/                       # Process methodology showcase
├── Navigation/                     # Enterprise navigation system
├── Results/                        # Measurable business impact metrics
├── Scene/                          # React Three Fiber 3D scenes
├── ScrollEffects/                  # Advanced scroll-driven animations
│   ├── MobileScrollOptimizer.tsx   # Mobile scroll performance
│   ├── ScrollSections.tsx          # Section-based scroll effects
│   ├── TechnicalStorytellingScroll.tsx # Technical content scroll
│   └── WebGLParallax.tsx          # WebGL-powered parallax effects
├── TechnicalExpertise/             # Comprehensive skills demonstration
│   ├── InteractiveArchitectureDiagram.tsx # Architecture visualization
│   └── TechnicalExpertisePreview.tsx # Glassmorphism skill cards
└── ui/                            # Shared UI components (Button, Card)
```

### **File Structure Patterns**
```bash
# Standard component pattern
src/app/components/[ComponentName]/
├── [ComponentName].tsx              # React component
├── [ComponentName].module.css       # CSS modules styling
└── index.ts                        # Export definitions (optional)

# Page structure pattern  
src/app/[page-name]/
├── page.tsx                        # Next.js page component
└── page.module.css                 # Page-specific styling
```

### **Brand Tokens System**
```bash
# Design system reference
src/app/styles/brand-tokens.css    # Complete design system

# Usage in components
.component {
  background: var(--hero-bg);        # Pure black (#0a0a0a)
  color: var(--text-on-dark);        # White text on dark sections
  font-family: var(--font-family-primary); # JetBrains Mono
}

# Section-specific color variables
--hero-bg: #0a0a0a                  # Hero - Pure black
--about-bg: #1a1a1a                 # About - Dark grey  
--results-bg: #10b981               # Results - Success green
--case-studies-bg: #1d4ed8          # Case Studies - Navy blue
--how-i-work-bg: #ec4899            # How I Work - Hot pink
--contact-bg: #fbbf24               # Contact - Bright yellow
```

## Daily Development Workflows

### **⚡ Fast Development Pattern**
```bash
# 1. Quick validation before starting work
npm run test:e2e:smoke              # <1 minute essential validation

# 2. Active development with live testing  
npm run test:e2e:dev                # 2-3 minutes functional testing
npm run dev                         # Development server with hot reload

# 3. Component-specific testing
npm run test:e2e:component -- --grep "ComponentName" # Focused component testing

# 4. Visual review with Claude
npx playwright test e2e/quick-screenshots.spec.ts --project=chromium

# 5. Pre-commit validation
npm run validate                    # TypeScript + ESLint + Build
npm run test:e2e:portfolio          # Comprehensive E2E validation
```

### **Component Development Workflow**
```bash
# Create new component in enterprise architecture
mkdir src/app/components/NewComponent
touch src/app/components/NewComponent/NewComponent.tsx
touch src/app/components/NewComponent/NewComponent.module.css

# Follow established patterns:
# - Use CSS modules for styling
# - Integrate brand tokens from brand-tokens.css
# - Implement responsive design (mobile-first)
# - Add TypeScript interfaces for props
# - Include accessibility attributes (ARIA)
```

### **Testing Integration During Development**
```bash
# Environment-aware testing options
SKIP_VISUAL=true npm run test:e2e:portfolio    # Skip visual regression during active development
FAST_MODE=true npm run test:e2e:navigation     # Ultra-fast essential testing
PUPPETEER_FIRST=true npm run test:e2e:dev      # Puppeteer-first screenshot strategy

# Hook-integrated testing
npm run hooks:screenshot            # Puppeteer screenshot automation
npm run hooks:visual-workflow       # Visual development workflow automation
npm run hooks:performance-check     # Performance monitoring during development
```

## npm Scripts Reference

### **Development Servers**
```bash
# Standard development
npm run dev                         # Smart development server (optimal port detection)
npm run dev:enhanced                # Sub-agent integration for complex operations
npm run dev:claude                  # Claude Code optimized (priority alerts)

# Port-specific development (manual port selection)
npm run dev:3000                    # Force port 3000
npm run dev:3001                    # Force port 3001  
npm run dev:4000                    # Force port 4000
```

### **Testing Workflows**
```bash
# Fast development testing
npm run test:e2e:smoke              # Quick validation (<1min)
npm run test:e2e:dev                # Functional testing (2-3min) 
npm run test:e2e:debug              # Interactive debugging with browser

# Comprehensive testing
npm run test:e2e:portfolio          # Complete enterprise portfolio validation
npm run test:e2e:navigation         # Navigation behavior testing
npm run test:e2e:visual            # Visual regression testing
npm run test:e2e:accessibility     # WCAG 2.1 AA compliance
npm run test:e2e:mobile            # Cross-device responsive validation

# Browser-specific testing
npm run test:e2e:chrome             # Chrome-specific testing
npm run test:e2e:firefox            # Firefox compatibility
npm run test:e2e:safari             # Safari compatibility

# Screenshot generation
npm run test:e2e:screenshot         # Comprehensive screenshot generation
npm run test:e2e:claude-review      # Claude visual review screenshots
npm run test:e2e:preview            # Quick preview screenshots
```

### **Hook Integration Commands**
```bash
# Puppeteer screenshot automation
npm run test:e2e:puppeteer-quick    # Quick Puppeteer screenshots
npm run test:e2e:puppeteer-component # Component-focused screenshots
npm run test:e2e:puppeteer-mobile   # Mobile viewport screenshots

# Visual workflow automation
npm run test:e2e:strategy-test      # Test screenshot strategies
npm run test:e2e:hybrid-visual      # Hybrid Playwright-Puppeteer validation

# Enhanced testing with sub-agent integration
npm run test:e2e:smoke:enhanced     # Smoke tests with Agent tool integration
npm run test:e2e:smoke:claude       # Claude Code optimized smoke tests
npm run test:e2e:screenshot:enhanced # Screenshot generation with Agent tool
```

### **Quality Gates**
```bash
# Mandatory before commits
npm run validate                    # TypeScript + ESLint + Build + Bundle check
npm run typecheck                   # TypeScript validation only
npm run lint                        # ESLint code quality
npm run build                       # Production build test
npm run bundle-check                # Bundle size validation (6MB budget)
```

## Context Switching & Architecture

### **Enterprise Portfolio Development**
```bash
# Enterprise portfolio development context
cd /home/user/tylergohr.com/           # Navigate to portfolio root
claude code                           # Launch Claude Code with Enterprise Solutions Architect context
```

### **Route Structure Understanding**
```bash
# Enterprise portfolio routes
/                                  # Enterprise Solutions Architect homepage
/case-studies                      # Detailed project showcases
/how-i-work                        # Process methodology deep dive
/technical-expertise               # Comprehensive skills demonstration

# Shared infrastructure but isolated routing
# - Same repository and CI/CD pipeline
# - Same quality gates and testing standards
# - Independent styling and component systems
```

### **Cross-Page Navigation Development**
```bash
# Key navigation components
src/app/components/BrowserTabs/   # Simulates browser tab navigation
src/app/components/Navigation/    # Enterprise navigation system

# Navigation testing
npm run test:e2e:navigation         # Comprehensive navigation behavior tests

# Navigation features to maintain:
# - Active link detection based on scroll position
# - Dropdown menu hover effects
# - Deep linking from homepage cards to specific browser tabs
# - Keyboard accessibility and ARIA compliance
```

## Port Management & Cloud Environments

### **Automatic Port Detection**
```bash
# Smart development server (recommended)
npm run dev                         # Automatically detects and uses optimal port

# Manual port detection and setup
./scripts/detect-active-port.sh     # Interactive port detection with diagnostics
./scripts/detect-active-port.sh quiet export # Environment variable format
eval "$(./scripts/detect-active-port.sh quiet export)" # Set environment for current shell
```

### **Cloud Workstation Integration**
```bash
# Cloud environment support (automatic)
# - Google Cloud Workstations: https://3000-tylergohr.cluster-*.cloudworkstations.dev
# - GitHub Codespaces: https://{codespace}-{port}.preview.app.github.dev
# - Gitpod: https://{port}-{workspace}.{cluster}
# - Local Development: http://localhost:{port}

# Manual cloud environment setup
source ./scripts/init-port-env.sh   # Initialize cloud-aware environment
./scripts/smart-dev.sh              # Cloud-aware development server startup
```

### **Environment Validation**
```bash
# Check development server health
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000  # Should return 200

# Verify environment variables
echo "Port: $ACTIVE_DEV_PORT, URL: $ACTIVE_DEV_URL"

# Re-detect if server port changed
./scripts/detect-active-port.sh
eval "$(./scripts/detect-active-port.sh quiet export)"
```

## Performance & Optimization

### **Development-Time Performance Monitoring**
```bash
# Performance testing during development
npm run test:e2e:performance        # Core Web Vitals monitoring
npm run hooks:performance-check     # Hooks-integrated performance validation

# Core Web Vitals targets for enterprise portfolio
# - LCP (Largest Contentful Paint): <2.5s
# - FID (First Input Delay): <100ms  
# - CLS (Cumulative Layout Shift): <0.1
# - Bundle Size: <6MB budget
```

### **Animation Performance Requirements**
```bash
# 60fps animation standards for enterprise portfolio
# - Network animation in About section
# - Metric counter animations in Results section
# - Scroll-driven animations throughout
# - Browser tab transitions (350ms Framer Motion)
# - Glassmorphism effects in Technical Expertise

# Performance optimization strategies:
# - CSS-based animations over JavaScript when possible
# - GPU acceleration for 3D transforms
# - Reduced motion compliance (prefers-reduced-motion)
# - Mobile-optimized touch interactions
```

### **Bundle Size Management**
```bash
# Monitor bundle size during development
npm run bundle-check                # Validates <6MB budget for enterprise portfolio

# Bundle optimization strategies:
# - Lazy loading for below-fold components
# - Dynamic imports for heavy 3D components
# - Image optimization for case study assets
# - Font loading optimization (JetBrains Mono)
```

## Troubleshooting

### **Development Server Issues**
```bash
# Server not starting or port conflicts
./scripts/detect-active-port.sh     # Check port availability and conflicts
pkill -f "next-server|npm run dev"  # Kill existing development servers
npm run dev                         # Restart with automatic port detection

# VS Code auto-start not working
# Check .vscode/tasks.json configuration
# Ensure "runOn": "folderOpen" is set for dev server task
```

### **Testing Environment Problems**
```bash
# Tests timing out or server not available
npm run dev &                       # Ensure development server is running
sleep 5 && npm run test:e2e:smoke  # Wait for server startup then test

# Port detection issues in cloud environments
eval "$(./scripts/detect-active-port.sh quiet export)" # Set correct environment
npx playwright test e2e/quick-screenshots.spec.ts --project=chromium # Test with correct URLs
```

### **Component Development Issues**
```bash
# TypeScript errors in enterprise components
npm run typecheck                   # Validate TypeScript across entire project
# Check imports and ensure @types packages are installed

# CSS module issues
# Verify CSS module imports: import styles from './Component.module.css'
# Check brand token usage: var(--brand-token-name)
# Ensure responsive design patterns follow mobile-first approach
```

### **Hook System Integration Problems**
```bash
# Hooks not executing or timing out
./scripts/hooks/orchestrator/orchestrator.sh health # Check orchestrator health
ORCHESTRATOR_DEBUG=true npm run test:e2e:smoke    # Debug hook execution

# Sub-agent recommendations not appearing
CLAUDE_AUTO_SUBAGENT=true npm run dev:enhanced     # Force sub-agent recommendations
# Look for 🚨 CLAUDE CODE: USE AGENT TOOL NOW alerts
```

### **Performance Issues During Development**
```bash
# Slow development server or hot reload
# Check for large file imports or heavy 3D components
# Use React DevTools Profiler for component performance
# Monitor Core Web Vitals impact with hooks:performance-check

# Animation performance problems  
# Verify 60fps performance with browser DevTools
# Check for layout thrashing in scroll-driven animations
# Ensure GPU acceleration for 3D transforms and effects
```

## File Protection & Safety

### **Protected Files (Hooks System)**
```bash
# Critical files that require extra confirmation before modification:
src/app/styles/brand-tokens.css   # Core design system
src/app/layout.tsx                  # Enterprise metadata and routing
next.config.js                      # Build configuration
package.json                        # Dependencies and scripts
.env* files                         # Environment configuration

# Override protection (use carefully)
OVERRIDE_PROTECTION=true [command]   # Override file protection when intentional
```

### **Safe Development Practices**
```bash
# Always read files before editing
# Use npm run validate before committing changes
# Test changes incrementally with npm run test:e2e:dev
# Maintain brand token consistency across components
# Follow established component and CSS module patterns
# Ensure accessibility compliance with ARIA attributes
```

---

**Focus**: Daily enterprise portfolio development workflows with automation  
**Architecture**: Component-based with brand tokens, CSS modules, and TypeScript  
**Performance**: 60fps animations, <2.5s LCP, <6MB bundle budget  
**Quality**: 100% TypeScript compliance, WCAG 2.1 AA accessibility standards