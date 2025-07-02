# Tyler Gohr Portfolio - /2 Redesign (Enterprise Solutions Architect)

## Quick Project Reference
**Mission**: Enterprise Solutions Architect portfolio redesign showcasing business-focused technical mastery  
**Live URLs**: 
- **Production**: https://tylergohr.com (original portfolio)
- **Redesign**: https://tylergohr.com/2 (Enterprise Solutions Architect focus)
**Status**: 🚧 Active Development - /2 redesign in progress  
**Current Priority**: Check GitHub issues for latest /2 development focus

## Project Goals - /2 Redesign Specific
- **Primary Purpose**: Enterprise Solutions Architect portfolio demonstrating business value delivery
- **Brand Focus**: Emmy Award-winning developer with 16+ years Fox Corporation & Warner Bros experience
- **Target Audience**: Enterprise clients, technical decision makers, business stakeholders
- **Messaging Strategy**: "Powerful digital solutions that solve real business problems"
- **Creative Freedom**: Professional sophistication with interactive technical demonstrations

## Tech Stack (Shared Infrastructure)
- **Framework**: Next.js 14+ with App Router + TypeScript
- **Styling**: CSS Modules with brand tokens system (`/2/styles/brand-tokens.css`)
- **Architecture**: Component-based with preview/detail page patterns
- **Testing**: Playwright E2E with /2-specific test suites
- **Deployment**: Same Google Cloud Run infrastructure as main site
- **Development Automation**: Claude Code hooks system for workflow optimization

## 🚀 Claude Code Hooks System - Development Automation

### **Overview**
Intelligent development workflow automation system that provides real-time quality gates, performance monitoring, and context-aware optimization for the Tyler Gohr Portfolio development process.

### **Core Features**
- **File Protection**: Prevents accidental modification of critical files
- **Quality Gates**: Automated TypeScript validation and testing
- **Visual Development**: Automated screenshot generation for design iteration
- **Performance Monitoring**: Real-time Core Web Vitals impact detection
- **Context Awareness**: Optimizes workflow for main portfolio vs /2 redesign development

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
# 6. Brand consistency validation for /2 redesign
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
│   ├── context-detection.sh        # Main vs /2 detection
│   └── hook-utils.sh               # Shared utilities
└── config/                         # Configuration files
    ├── protected-files.json         # Critical file definitions
    ├── test-strategies.json         # Test selection rules
    ├── performance-thresholds.json  # Excellence standards
    └── visual-change-patterns.json  # UI change detection patterns
```

### **Smart Testing Integration**
- **Context-Aware**: Different testing strategies for main portfolio vs /2 redesign
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
- **100% Context Awareness**: Perfect workflow adaptation for main vs /2 development
- **Zero Protected File Accidents**: Automated prevention of critical file modifications
- **Continuous Performance Monitoring**: Real-time Core Web Vitals impact detection

## /2 Architecture & File Structure

### **Directory Structure**
```
src/app/2/
├── components/           # /2 redesign components
│   ├── Hero/            # Enterprise Solutions intro
│   ├── About/           # Network animation & background
│   ├── Results/         # Measurable business impact metrics
│   ├── CaseStudies/     # 4 interactive preview cards
│   ├── HowIWork/        # 4 process highlight cards  
│   ├── TechnicalExpertise/ # 4 glassmorphism skill cards
│   ├── Contact/         # Dual-column form & info
│   ├── Navigation/      # /2-specific navigation system
│   ├── BrowserTabs/     # Cross-page browser tab UI
│   └── ui/              # Shared UI components (Button, Card)
├── hooks/               # /2-specific React hooks
├── lib/                 # Framer Motion client wrapper
├── styles/              # Brand tokens & /2-specific styling
│   └── brand-tokens.css # Complete design system
├── case-studies/        # Detail page for case studies
├── how-i-work/          # Detail page for work process
├── technical-expertise/ # Detail page for technical skills
├── layout.tsx           # /2-specific layout with Enterprise metadata
├── page.tsx             # Main /2 homepage
└── template.tsx         # /2 page transitions
```

### **Route Structure**
- **Main**: `/2` - Enterprise Solutions Architect homepage
- **Case Studies**: `/2/case-studies` - Detailed project showcases
- **How I Work**: `/2/how-i-work` - Process methodology deep dive
- **Technical Expertise**: `/2/technical-expertise` - Comprehensive skills demonstration

## Essential Development Commands - /2 Specific

### **Standard Development Workflow**
```bash
# Development (same as main project)
npm run dev                 # Next.js dev server (localhost:3000)
npm run build              # Production build test
npm run validate           # 🔥 MANDATORY before commits

# 🚀 FAST DEVELOPMENT TESTING (/2 Optimized - New)
npm run test:e2e:dev                    # Functional testing, skip visual regression (2-3min)
npm run test:e2e:smoke                  # Essential tests only for quick validation (<1min)
npm run test:e2e:debug                  # Enhanced headed mode for interactive debugging

# 📸 CLAUDE VISUAL REVIEW (/2 Specific - New)
npx playwright test e2e/quick-screenshots.spec.ts --project=chromium  # Fast, reliable screenshots (2-3min)
npm run test:e2e:claude-review          # Complete /2 page set across viewports (complex, use if quick fails)
npm run test:e2e:screenshot             # Quick /2 full page capture (complex, use if quick fails)
npm run test:e2e:preview                # Pre-commit /2 visual preview

# /2-Specific Testing Commands (Comprehensive)
npm run test:e2e:portfolio              # /2 redesign E2E tests
npm run test:e2e:navigation             # /2 navigation comprehensive tests
npm run test:e2e:visual                 # Visual consistency tests for /2
npm run test:e2e:mobile                 # /2 mobile responsiveness tests

# Cross-browser testing for /2
npm run test:e2e:chrome                 # Chrome-specific /2 tests
npm run test:e2e:firefox                # Firefox compatibility /2
npm run test:e2e:safari                 # Safari compatibility /2
```

### **Quality Gates - Same Infrastructure**
```bash
# MANDATORY before every commit:
npm run validate    # Runs: typecheck && lint && build (Jest removed)

# Post-development testing:
npm run test:e2e:portfolio         # /2-specific E2E validation
npm run test:e2e:visual            # Visual regression for /2 components

# Visual testing for /2 changes:
npm run test:e2e:visual    # Playwright visual regression for /2
```

## Brand System - Enterprise Solutions Architect

### **Color Palette (/2/styles/brand-tokens.css)**
```css
/* Section-Specific Colors */
--hero-bg: #0a0a0a           /* Hero - Pure black */
--about-bg: #1a1a1a          /* About - Dark grey */
--results-bg: #10b981        /* Results - Bright green (success) */
--case-studies-bg: #1d4ed8   /* Case Studies - Navy blue */
--how-i-work-bg: #ec4899     /* How I Work - Hot pink */
--contact-bg: #fbbf24        /* Contact - Bright yellow */

/* Typography */
--font-family-primary: 'JetBrains Mono', monospace
--text-on-dark: #ffffff      /* Primary text on dark sections */
--text-on-light: #000000     /* Text on bright sections */
```

### **Typography System**
- **Primary Font**: JetBrains Mono (developer-focused monospace)
- **Scale**: Responsive clamp() system (mobile-first)
- **Weight Scale**: 400 (body) → 500 (subheads) → 600 (emphasis) → 700 (titles)

### **Responsive Design**
- **Mobile**: 320px base design
- **Tablet**: 768px (iPad breakpoint)
- **Desktop**: 1200px (laptop/desktop)
- **Wide**: 1400px (large monitors)

## /2 Component Architecture

### **Preview/Detail Pattern**
Each major section follows a consistent preview → detail pattern:

1. **Preview Components** (on `/2` homepage):
   - `CaseStudiesPreview` - 4 interactive project cards
   - `HowIWorkPreview` - 7 process highlight steps in descending staircase design
   - `TechnicalExpertisePreview` - 4 glassmorphism skill cards

2. **Detail Pages** (dedicated routes):
   - `/2/case-studies` - Full project case studies
   - `/2/how-i-work` - Complete process methodology
   - `/2/technical-expertise` - Comprehensive technical showcase

### **Cross-Page Navigation System**
- **BrowserTabs Component**: Simulates browser tab navigation
- **Active Link Detection**: Scroll-based navigation state management
- **Dropdown Menu**: Hover-enhanced navigation for detail pages

### **Key Interactive Elements**
- **Network Animation**: About section dynamic node connections
- **Metric Cards**: Animated business impact statistics
- **Glassmorphism**: Frosted glass effects for technical expertise
- **Lazy Loading**: Performance-optimized component loading

## Development Protocols - /2 Specific

### **🔴 MANDATORY Pre-Work Checklist**
1. **Check GitHub Issues** - Filter for `/2` or "redesign" related tasks
2. **Read TodoList** - Use TodoRead for current /2 development state
3. **Test /2 Route** - Always test on localhost:3000/2 during development
4. **Component Isolation** - Work within `/2` component architecture
5. **Brand Token Usage** - Use design system from `brand-tokens.css`

### **🚨 /2-Specific Quality Gates**
```bash
# ⚡ FAST DEVELOPMENT WORKFLOW (New - Primary for Daily Work)
npm run test:e2e:smoke             # Quick validation before coding (<1min)
npm run test:e2e:dev               # Functional testing during development (2-3min)
npm run test:e2e:claude-review:current  # Visual review with Claude

# 🎯 BEFORE COMMITTING /2 CHANGES:
npm run validate                    # Standard quality gates (TypeScript + ESLint + Build)
npm run test:e2e:portfolio         # /2-specific E2E validation (optimized)
npm run test:e2e:visual            # Visual regression for /2 components

# 📱 CROSS-DEVICE TESTING FOR /2:
npm run test:e2e:mobile            # Mobile responsiveness validation

# 🛠️ ENVIRONMENT-AWARE TESTING (New Options):
SKIP_VISUAL=true npm run test:e2e:portfolio  # Skip visual regression during development
FAST_MODE=true npm run test:e2e:navigation   # Ultra-fast essential testing
```

### **PR Workflow - /2 Development**
1. **Create Feature Branch**: `git checkout -b feature/2-short-name` (identify /2 work)
2. **Develop in /2 Context**: Work within `src/app/2/` architecture
3. **Test /2 Route**: Validate changes on localhost:3000/2
4. **Run /2 Tests**: Execute /2-specific test suites
5. **Create PR**: Include "/2 redesign" context in PR title/description
6. **Preview URL Testing**: Test full /2 experience on Cloud Run preview
7. **Cross-Device Validation**: Essential for Enterprise presentation

### **Branch Naming for /2 Work**
- ✅ `feature/2-hero` (9 chars) - /2 hero section work
- ✅ `fix/2-nav` (8 chars) - /2 navigation fixes
- ✅ `feature/2-case` (12 chars) - /2 case studies
- ❌ `feature/2-technical-expertise` (29 chars) - too long for Docker tags

## Content Strategy - Enterprise Solutions Architect

### **Brand Voice & Positioning**
- **Tone**: Confident, results-driven, business-focused
- **Authority**: Emmy Award recognition, Fox Corporation & Warner Bros experience
- **Value Proposition**: "Creating powerful digital solutions that solve real business problems"
- **Technical Depth**: Enterprise architecture with measurable business impact
- **Credibility**: 16+ years enterprise development, major media industry experience

### **Messaging Hierarchy**
1. **Hero**: Enterprise Solutions Architect positioning
2. **About**: Emmy Award background + technical network visualization  
3. **Results**: Quantified business impact metrics
4. **Case Studies**: Real project outcomes with business value
5. **How I Work**: Professional methodology and process
6. **Technical Expertise**: Comprehensive technology demonstration
7. **Contact**: Professional engagement and consultation

### **SEO Strategy - /2 Specific**
- **Primary Keywords**: "Enterprise Solutions Architect", "Digital Solutions"
- **Secondary**: "Emmy Award developer", "Fox Corporation", "Warner Bros"
- **Technical**: "React", "Next.js", "TypeScript", "Enterprise Architecture"
- **Business**: "Custom software development", "Business applications"

## Testing Strategy - Playwright-Only Approach (July 2025)

### **🎯 Modern Testing Philosophy**
**Decision**: Playwright-only testing strategy adopted July 2025
- **Rationale**: Real browser testing, comprehensive coverage, lower maintenance
- **Previous Jest Issues**: 25% success rate, mocking complexity, React 19 compatibility
- **Current Success**: 100% Playwright test reliability with enterprise-grade coverage

### **🚨 FIRST-TIME PLAYWRIGHT SETUP (MANDATORY)**

**BEFORE running any Playwright tests for the first time, Claude MUST install all required dependencies:**

```bash
# 1. Install Playwright browsers and system dependencies (REQUIRES SUDO)
sudo npx playwright install-deps

# 2. Install Playwright browsers
npx playwright install

# 3. Verify installation works
npx playwright --version

# 4. Test basic functionality (optional verification)
npm run test:e2e:smoke
```

**⚠️ CRITICAL REQUIREMENTS:**
- **Use `sudo`** for `npx playwright install-deps` - system dependencies require root privileges
- **Run this setup** before attempting any `npm run test:e2e:*` commands
- **Verify success** by running a quick smoke test
- **If installation fails**, run individual browser installs: `npx playwright install chromium firefox webkit`

**📋 What gets installed:**
- **System Dependencies**: Browser libraries, fonts, media codecs
- **Browser Binaries**: Chromium, Firefox, WebKit for cross-browser testing
- **Playwright Runtime**: Testing framework and automation libraries

**🔍 Troubleshooting first-time setup:**
```bash
# If sudo playwright install-deps fails, try:
sudo apt-get update
sudo apt-get install -y libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2

# Then retry Playwright installation:
sudo npx playwright install-deps
npx playwright install
```

### **Essential Testing Commands**
```bash
# Quality Gates (MANDATORY before commits)
npm run validate                    # typecheck + lint + build (Jest removed)

# 🚀 FAST DEVELOPMENT TESTS (New - Primary for Active Development)
npm run test:e2e:dev               # Functional testing, skip visual regression (2-3min)
npm run test:e2e:smoke             # Essential tests only for quick validation (<1min)
npm run test:e2e:component         # Single component testing for focused changes
npm run test:e2e:debug             # Enhanced headed mode for interactive debugging

# 📸 SCREENSHOT GENERATION FOR CLAUDE REVIEW (New)
npx playwright test e2e/quick-screenshots.spec.ts --project=chromium      # RECOMMENDED: Fast, reliable screenshots (2-3min)
npx playwright test e2e/detail-pages-screenshots.spec.ts --project=chromium  # Detail pages only (1-2min)
npm run test:e2e:claude-review              # Complete page set across viewports (complex)
npm run test:e2e:screenshot                 # Quick full page capture (complex, <30sec if working)
npm run test:e2e:screenshot:mobile          # Mobile viewport screenshots only
npm run test:e2e:preview                    # Pre-commit visual preview

# Core Test Suites (Comprehensive - Use for Final Validation)
npm run test:e2e:portfolio         # /2 redesign comprehensive E2E tests
npm run test:e2e:navigation        # Navigation behavior + intersection observers
npm run test:e2e:visual           # Visual regression across viewports
npm run test:e2e:accessibility    # WCAG 2.1 AA/AAA compliance testing
npm run test:e2e:mobile           # Cross-device responsive validation

# Individual Component Testing
npx playwright test e2e/contact-component.spec.ts     # Form validation + submission (19 tests)
npx playwright test e2e/navigation-component.spec.ts  # Navigation behavior (21 tests)
npx playwright test e2e/visual-regression-2.spec.ts   # Visual consistency (100+ screenshots)
npx playwright test e2e/accessibility-enhanced.spec.ts # Enterprise accessibility (24 tests)
npx playwright test e2e/screenshot-generation.spec.ts  # Claude review screenshot generation
npx playwright test e2e/quick-screenshots.spec.ts --project=chromium     # NEW: Fast, reliable screenshots
npx playwright test e2e/detail-pages-screenshots.spec.ts --project=chromium  # NEW: Detail pages only
```

### **Screenshot Output Locations**
```bash
# Quick screenshots (recommended for Claude review)
screenshots/quick-review/
├── homepage-desktop.png & homepage-mobile.png
├── case-studies-desktop.png & case-studies-mobile.png  
├── how-i-work-desktop.png & how-i-work-mobile.png
└── technical-expertise-desktop.png & technical-expertise-mobile.png

# Detail pages screenshots (alternative)
screenshots/detail-pages/
├── case-studies-desktop.png & case-studies-mobile.png
├── how-i-work-desktop.png & how-i-work-mobile.png
└── technical-expertise-desktop.png & technical-expertise-mobile.png

# Complex screenshot outputs (use if simple methods fail)
screenshots/claude-review/
└── [timestamp-based subdirectories with comprehensive screenshots]
```

### **Testing Workflow Integration**
```bash
# 🎯 DAILY DEVELOPMENT WORKFLOW (New Optimized Pattern)
# 1. Start coding:
npm run test:e2e:smoke             # Quick validation (<1min)

# 2. Component work:
npm run test:e2e:component -- --grep "ComponentName"  # Focused testing

# 3. Feature testing:
npm run test:e2e:dev               # Functional validation (2-3min)

# 4. Visual review with Claude:
npx playwright test e2e/quick-screenshots.spec.ts --project=chromium  # Generate screenshots for Claude analysis

# 5. Pre-commit validation:
npm run test:e2e:portfolio         # Comprehensive check (8-10min)

# 🎨 CLAUDE VISUAL REVIEW WORKFLOW (New)
npm run test:e2e:claude-review              # Complete analysis set
npm run test:e2e:screenshot -- --section="hero"         # Hero section only
npm run test:e2e:screenshot -- --component="BrowserTabs" # Component isolation
npm run test:e2e:preview                    # Pre-commit visual preview

# 🛠️ ENVIRONMENT-AWARE TESTING (New)
SKIP_VISUAL=true npm run test:e2e:portfolio         # Skip visual regression during development
FAST_MODE=true npm run test:e2e:navigation          # Ultra-fast essential testing
npm run test:e2e:debug                              # Interactive debugging

# TRADITIONAL WORKFLOW (Use for Final Validation)
# Before /2 development:
npm run test:e2e:portfolio         # Validate current state

# After /2 changes:
npm run validate                   # Quality gates
npm run test:e2e:visual           # Visual regression check
npm run test:e2e:accessibility    # A11y compliance

# Visual baseline updates (when intentional):
npx playwright test e2e/visual-regression-2.spec.ts --update-snapshots

# Debugging failed tests:
npx playwright test e2e/contact-component.spec.ts --headed  # See browser
npx playwright test --grep "specific test name"             # Run specific test
npx playwright test --reporter=html                         # Generate HTML report
```

### **Test Coverage Highlights**
- **Fast Development Tests**: Sub-2-minute functional validation for daily workflow
- **Claude Review Integration**: Automated screenshot generation for visual analysis
- **Component Testing**: ContactSection (19 tests), Navigation (21 tests), Screenshot generation
- **Visual Regression**: 100+ screenshots across viewports and components
- **Accessibility**: WCAG 2.1 AA/AAA + Section 508 compliance (24 tests)
- **Performance**: Core Web Vitals, animation performance, scroll optimization (80% speed improvement)
- **Cross-Device**: Mobile, tablet, desktop responsive validation
- **Environment-Aware**: Skip visual regression during development, fast mode testing

### **🔧 Screenshot Testing Troubleshooting**

**If screenshots fail, follow this recovery pattern:**

1. **Check Playwright Setup** (if first time):
   ```bash
   sudo npx playwright install-deps    # Install system dependencies
   npx playwright install              # Install browser binaries
   ```

2. **Check Dev Server Health**:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://localhost:3000/2
   # If not 200, restart: pkill -f "next-server|npm run dev" && npm run dev &
   ```

3. **Use Simple Screenshot Mode**:
   ```bash
   # Create output directory
   mkdir -p screenshots/quick-review
   
   # Run quick, reliable screenshots
   npx playwright test e2e/quick-screenshots.spec.ts --project=chromium
   ```

4. **If still failing, try single page**:
   ```bash
   npx playwright test e2e/quick-screenshots.spec.ts --project=chromium --grep "homepage only"
   ```

**📖 Full Testing Guides**: 
- `docs/testing/playwright-workflow.md` - Comprehensive testing documentation
- `docs/testing/testing-enhancements-summary.md` - New capabilities implementation guide
- `.claude/commands/visual-iterate.md` - Screenshot generation and visual development workflow

## Performance Standards - Enterprise Presentation

### **Core Web Vitals Targets**
- **LCP**: <2.5s (Enterprise credibility)
- **FID**: <100ms (Professional responsiveness)  
- **CLS**: <0.1 (Stable business presentation)
- **Lighthouse**: 90+ across all metrics

### **/2-Specific Performance Considerations**
- **Lazy Loading**: Below-fold /2 components optimized
- **Animation Performance**: Network animation 60fps requirement
- **Image Optimization**: Case study assets and professional imagery
- **Font Loading**: JetBrains Mono performance optimization

## Quick Reference - /2 Development

### **Starting /2 Development Session**
```bash
# Navigate to /2 context (loads this CLAUDE.md)
cd /home/user/tylergohr.com/src/app/2/

# Launch Claude Code (gets /2-specific context)
claude code

# Check current /2 development status
gh issue list --label "redesign" --state open
gh issue list --label "/2" --state open

# Start development server and test /2
npm run dev    # Then visit localhost:3000/2
```

### **Common /2 Development Tasks**
```bash
# Component development in /2
# Work in: src/app/2/components/[ComponentName]/
# Follow: [ComponentName].tsx + [ComponentName].module.css pattern

# Brand token usage
# Reference: src/app/2/styles/brand-tokens.css
# Use: CSS custom properties for consistency

# Testing /2 changes (New Optimized Workflow)
npm run test:e2e:smoke        # Quick validation during coding (<1min)
npm run test:e2e:dev          # Functional validation (2-3min)
npx playwright test e2e/quick-screenshots.spec.ts --project=chromium  # Visual review with Claude (2-3min)
npm run test:e2e:portfolio    # Full /2 E2E validation (when ready for commit)
npm run test:e2e:visual       # Visual regression testing (final validation)
```

### **Cross-Page Navigation Development**
```bash
# BrowserTabs component location:
# src/app/2/components/BrowserTabs/

# Navigation component:
# src/app/2/components/Navigation/

# Active link detection testing:
npm run test:e2e:navigation
```

## Integration with Main Project

### **Shared Infrastructure**
- **Same Repository**: All /2 work in same repo as main portfolio
- **Same CI/CD**: GitHub Actions, Google Cloud Run deployment
- **Same Quality Gates**: npm run validate, same testing standards
- **Same PR Workflow**: Preview URLs work for /2 routes

### **Isolated Architecture**
- **Separate Layout**: `/2/layout.tsx` with Enterprise metadata
- **Dedicated Components**: All /2 components isolated in `/2/components/`
- **Independent Styling**: Brand tokens system separate from main portfolio
- **Route Isolation**: `/2/*` routes independent of main site navigation

### **Development Context Switching**
```bash
# For /2 redesign work:
cd /home/user/tylergohr.com/src/app/2/
claude code    # Gets /2 Enterprise context

# For main portfolio work:  
cd /home/user/tylergohr.com/
claude code    # Gets general portfolio context
```

## File Protection Rules - /2 Specific

### **NEVER modify without explicit confirmation:**
- `src/app/2/styles/brand-tokens.css` (core design system)
- `src/app/2/layout.tsx` (Enterprise metadata)
- Any existing /2 component without understanding full architecture

### **Safe to modify with standard workflow:**
- Individual component files within `/2/components/`
- Component-specific CSS modules
- /2 page content (page.tsx files in /2 subdirectories)

## Success Metrics - Enterprise Portfolio

### **Business Presentation Standards**
- **Professional Polish**: Consistent Enterprise Solutions Architect branding
- **Technical Credibility**: Interactive demonstrations of technical mastery
- **Business Value**: Clear ROI and impact messaging throughout
- **Cross-Device Excellence**: Flawless presentation on all professional devices
- **Performance Validation**: Sub-2.5s load times proving optimization expertise

### **/2-Specific KPIs**
- **Navigation Accuracy**: Perfect scroll detection and active states
- **Animation Performance**: 60fps network animation and metric displays
- **Cross-Page Consistency**: Seamless browser tab simulation
- **Enterprise Messaging**: Clear value proposition and business positioning
- **Contact Conversion**: Professional engagement through contact forms

---

## 🔥 Quick Start - /2 Development

**When working on the /2 redesign:**

1. **Start Here**: `cd /home/user/tylergohr.com/src/app/2/`
2. **Launch Claude**: `claude code` (loads this context)
3. **Check Status**: `gh issue list --label "redesign"`
4. **Start Dev**: `npm run dev` → test at `localhost:3000/2`
5. **🚀 NEW: Fast Testing**: `npm run test:e2e:smoke` for quick validation
6. **📸 NEW: Quick Screenshots**: `npx playwright test e2e/quick-screenshots.spec.ts --project=chromium` for visual analysis
7. **Quality Gates**: `npm run validate` before commits
8. **Final Test**: `npm run test:e2e:portfolio` for comprehensive validation

## 🎯 **NEW: Daily Development Testing Pattern**

**Optimized workflow for faster development feedback:**

```bash
# 1. Quick validation before starting work
npm run test:e2e:smoke                    # <1 minute

# 2. During active development  
npm run test:e2e:dev                      # 2-3 minutes functional testing

# 3. Visual review with Claude
npx playwright test e2e/quick-screenshots.spec.ts --project=chromium    # Generate screenshots for Claude analysis

# 4. Component-specific testing
npm run test:e2e:component -- --grep "ComponentName"  # Focused testing

# 5. Pre-commit comprehensive validation
npm run test:e2e:portfolio                # Full validation when ready
```

**Enterprise Solutions Architect Portfolio - Built for Business Impact** 🏢