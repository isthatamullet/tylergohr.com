# Visual Iterate - Visual Mock-Driven Development

Automate visual mock-driven development with screenshot comparison, iterative refinement, and integration with Tyler Gohr Portfolio's comprehensive Playwright visual testing infrastructure.

**Usage**: `/visual-iterate "UI feature description" [--mock=path/to/mockup.png] [--viewport=mobile|tablet|desktop|all] [--iterations=3] [--threshold=0.95]`

**For task**: $ARGUMENTS

## 🚀 Reliability-First Execution Strategy

**ALWAYS START HERE**: Determine the appropriate mode based on the user's request:

### **Mode 1: Quick Screenshots** (Default for simple requests)
- **Triggers**: "take screenshots", "show me", "capture current state", "how does X look"
- **Approach**: Use simplified screenshot generation for immediate visual review
- **Time**: 2-3 minutes, highly reliable
- **Output**: Mobile + Desktop screenshots of requested pages

### **Mode 2: Visual Development** (For iterative design work)  
- **Triggers**: "--mock=" parameter provided, "iterate", "compare with", "improve design"
- **Approach**: Full visual development workflow with mock comparison
- **Time**: 15-30 minutes, comprehensive analysis
- **Output**: Before/after comparisons, iterative improvements, production-ready code

### **Execution Order** (Reliability-First):
1. **Environment Check** → Validate prerequisites & fix issues
2. **Mode Detection** → Simple screenshots OR complex development
3. **Quick Success** → Get screenshots working first  
4. **Progressive Enhancement** → Add complexity only if requested

## Prerequisites & Environment Setup (Essential First Steps)

### **🔍 Environment Validation & Auto-Setup**
Before attempting any screenshot generation, verify and setup the required infrastructure:

1. **Playwright Installation Check**:
   ```bash
   # Check if Playwright is installed and browsers are available
   npx playwright --version
   
   # If missing or browsers not installed, run setup:
   sudo npx playwright install-deps    # Install system dependencies
   npx playwright install              # Install browser binaries
   
   # Verify installation with a quick test:
   npx playwright test --help
   ```

2. **Dev Server Health Check**:
   ```bash
   # Check if dev server is running and responsive
   curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://localhost:3000/2
   
   # If timeout or not running, restart dev server:
   pkill -f "next-server|npm run dev"  # Kill hung processes
   npm run dev &                       # Start fresh dev server
   
   # Wait for server to be ready before continuing
   ```

3. **Playwright Configuration Validation**:
   ```bash
   # Ensure headless mode is configured to avoid X server issues
   # Check playwright.config.ts has: headless: true
   
   # Test basic screenshot capability:
   npx playwright test --grep "simple" --project=chromium
   ```

### **📸 Quick Screenshot Mode (For Immediate Visual Review)**

When the request is simply "take screenshots" or "show me the current state", use this streamlined approach:

1. **Simple Screenshot Test Creation**:
   ```typescript
   // Create: e2e/quick-screenshots.spec.ts
   import { test } from '@playwright/test'
   
   test.describe('Quick Screenshots for Visual Review', () => {
     const pages = [
       '/2',                    // Homepage
       '/2/case-studies',       // Case Studies  
       '/2/how-i-work',         // Process
       '/2/technical-expertise' // Technical Skills
     ]
     
     const viewports = [
       { name: 'mobile', width: 375, height: 667 },
       { name: 'desktop', width: 1200, height: 800 }
     ]
   
     for (const route of pages) {
       for (const viewport of viewports) {
         test(`${route.replace('/2/', '') || 'homepage'} - ${viewport.name}`, async ({ page }) => {
           await page.setViewportSize(viewport)
           await page.goto(route)
           await page.waitForLoadState('networkidle')
           await page.waitForTimeout(1000) // Brief settle
           
           const filename = `${route.replace('/2/', '') || 'homepage'}-${viewport.name}.png`
           await page.screenshot({ 
             path: `screenshots/quick-review/${filename}`,
             fullPage: true 
           })
         })
       }
     }
   })
   ```

2. **Quick Execution Command**:
   ```bash
   # Fast, reliable screenshot generation (2-3 minutes)
   npx playwright test e2e/quick-screenshots.spec.ts --project=chromium
   
   # Results in: screenshots/quick-review/*.png
   ```

### **🛠️ Common Issues & Auto-Recovery**

**Issue 1: Playwright Dependencies Missing**
```bash
# Symptoms: libgtk-4.so.1 errors, browser launch failures
# Fix:
sudo npx playwright install-deps
npx playwright install
```

**Issue 2: Hung Dev Server** 
```bash
# Symptoms: Timeouts on /2 route, curl timeouts
# Fix:
pkill -f "next-server|npm run dev"
npm run dev &
sleep 5  # Wait for startup
```

**Issue 3: X Server/Display Issues**
```bash
# Symptoms: "Missing X server or $DISPLAY" errors
# Fix: Ensure playwright.config.ts has headless: true
# Or use: DISPLAY=:99 xvfb-run npx playwright test
```

**Issue 4: Complex Tests Timing Out**
```bash
# Symptoms: screenshot-generation.spec.ts fails with timeouts
# Fix: Use simple mode instead
npx playwright test e2e/quick-screenshots.spec.ts --project=chromium
```

### **🎯 Mode Detection & Execution Strategy**

**Simple Requests** (just want to see current state):
- "take screenshots of [pages]"
- "show me how [page] looks"  
- "capture the current design"
→ **Use Quick Screenshot Mode**

**Complex Requests** (visual development/iteration):
- "compare against this mockup"
- "iterate on this design"
- "comprehensive visual analysis"
→ **Use Full Visual Iterate Workflow**

---

## 🎯 Implementation Guide for Claude

### **Step-by-Step Execution for Screenshot Requests**

**When user requests screenshots (e.g., "take screenshots of /2's detail pages"):**

1. **First, ALWAYS run environment checks:**
   ```bash
   # Check dev server health
   curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://localhost:3000/2
   
   # If not 200, fix dev server:
   pkill -f "next-server|npm run dev" && npm run dev &
   ```

2. **For simple screenshot requests, use Quick Mode:**
   ```bash
   # Create screenshots/quick-review directory if needed
   mkdir -p screenshots/quick-review
   
   # Run quick screenshot test (2-3 minutes, reliable)
   npx playwright test e2e/quick-screenshots.spec.ts --project=chromium
   
   # Display results from screenshots/quick-review/*.png
   ```

3. **Only use complex modes when specifically requested:**
   - User provides a mock image: Use full visual development workflow
   - User asks for "comprehensive analysis": Use advanced testing
   - User wants "iteration": Use comparison features

### **Failure Recovery Pattern**

If quick screenshots fail:
1. **Check Playwright setup:**
   ```bash
   sudo npx playwright install-deps
   npx playwright install
   ```

2. **Verify headless configuration:**
   ```bash
   # Ensure playwright.config.ts has: headless: true
   ```

3. **Try even simpler approach:**
   ```bash
   # Create a basic one-off test if needed
   npx playwright test --grep "single test" --project=chromium
   ```

### **Success Indicators**
- ✅ Screenshots generated in 2-3 minutes
- ✅ Files appear in screenshots/quick-review/
- ✅ Both mobile and desktop versions captured
- ✅ User can immediately see visual results

**Remember:** The goal is to make "take screenshots" requests **just work** quickly and reliably, not to run comprehensive visual testing unless specifically requested.

---

## Phase 1: Visual Target Establishment & Infrastructure Setup

### **Mock Analysis & Design Extraction**
1. **Analyze Provided Visual Mock**:
   - Extract design elements, layout structure, and visual hierarchy
   - Identify responsive behavior requirements across viewports
   - Analyze color scheme integration with Tyler Gohr Portfolio brand (dark theme, green/red accents)
   - Map interactive elements, animations, and micro-interactions

2. **Design System Integration Analysis**:
   - Ensure compatibility with existing brand tokens and CSS architecture
   - Plan integration with cutting-edge CSS features:
     - Container Queries for responsive component design
     - CSS Grid Subgrid for perfect alignment
     - Scroll-driven Animations for performance-optimized effects
     - CSS custom properties for dynamic theming

### **Screenshot Infrastructure Leverage**
1. **Configure Playwright Visual Testing** (using your existing setup):
   - Leverage existing `e2e/visual-regression-2.spec.ts` infrastructure (100+ screenshots)
   - **NEW**: Use `e2e/screenshot-generation.spec.ts` for automated Claude review screenshot generation
   - **NEW**: Utilize `e2e/utils/dev-test-helpers.ts` deterministic wait utilities for reliable screenshots
   - Set up viewport configurations matching your current testing matrix
   - Establish baseline comparison system using your proven visual regression framework
   - Configure screenshot capture across mobile, tablet, desktop viewports

2. **Visual Diff Analysis Preparation**:
   - Set comparison threshold (default 0.95 for pixel-perfect results)
   - Configure screenshot capture settings for consistent comparison
   - Prepare iterative comparison workflow for rapid feedback

## Phase 2: Implementation & Real-Time Visual Comparison

### **Initial Implementation Generation**
1. **Generate Code Based on Mock Analysis**:
   - Create initial implementation using Tyler Gohr Portfolio patterns:
     - Next.js 14+ with App Router and TypeScript
     - CSS Modules with modern CSS features (never Tailwind)
     - Mobile-first responsive design with sophisticated desktop enhancements
     - Dark theme integration with strategic green/red business accents

2. **Apply Portfolio Design Standards**:
   - Implement with 60fps performance optimization for smooth animations
   - Ensure WCAG 2.1 AA accessibility compliance from the start
   - Apply brand voice through confident, interactive element design
   - Integrate technical storytelling elements where appropriate

### **Screenshot Capture & Visual Comparison**
1. **Multi-Viewport Screenshot Generation**:
   - **NEW**: Use fast screenshot commands for rapid iteration:
     - `npm run test:e2e:screenshot` for quick full page capture (<30sec)
     - `npm run test:e2e:claude-review` for comprehensive Claude analysis sets
     - `npm run test:e2e:claude-review:current` for current state capture
   - **NEW**: Section-specific screenshot generation with `--section="hero"` or `--component="BrowserTabs"`
   - Capture screenshots across specified viewports (mobile/tablet/desktop/all)
   - Use existing Playwright infrastructure with deterministic waits for consistent, reliable screenshots
   - Generate visual diff reports comparing against target mock
   - Leverage your proven 100+ screenshot baseline system

2. **Gap Analysis & Improvement Planning**:
   - **NEW**: Generate screenshots for Claude visual analysis:
     - `npm run test:e2e:claude-review:current` for current state capture
     - Use Claude to analyze design alignment and suggest improvements
     - Generate component isolation screenshots for detailed analysis
     - Use `generateClaudeReviewScreenshots()` from dev-test-helpers for automated capture
   - **NEW**: Fast iteration workflow with environment-aware testing:
     - `SKIP_VISUAL=true npm run test:e2e:portfolio` when focusing on functionality
     - `FAST_MODE=true` options for rapid development cycles
   - Identify visual discrepancies using AI-powered difference detection
   - Prioritize fixes based on visual impact and user experience importance
   - Plan iterative improvements with clear success criteria
   - Document deviations that may be acceptable or intentional

## Phase 3: Iterative Refinement & Progressive Enhancement

### **Improvement Cycles with Real-Time Feedback**
1. **Targeted Visual Improvements**:
   - Make focused improvements based on visual diff analysis
   - **NEW**: Use fast development testing for rapid iteration:
     - `npm run test:e2e:dev` for functional testing during visual development (2-3min)
     - `npm run test:e2e:smoke` for ultra-fast validation during coding (<1min)
     - `SKIP_VISUAL=true npm run test:e2e:portfolio` when focusing on functionality
   - **NEW**: Use deterministic wait utilities for reliable testing:
     - `waitForAnimationComplete()` for animation-dependent screenshots
     - `waitForNetworkAnimationReady()` for complex interactive elements
   - Re-capture screenshots after each significant change using `npm run test:e2e:screenshot`
   - Compare progress against target using automated diff analysis
   - Track improvement progress with visual similarity metrics

2. **Advanced CSS Implementation**:
   - Implement sophisticated effects using Container Queries for smart responsiveness
   - Apply CSS Grid Subgrid for pixel-perfect alignment
   - Add Scroll-driven Animations for performance-optimized motion
   - Enhance with glassmorphism, shadows, and premium visual effects

### **Multi-Viewport Optimization**
1. **Cross-Device Excellence**:
   - Ensure visual consistency across all target viewports
   - Optimize touch interactions for mobile while maintaining desktop sophistication
   - Validate hover states, focus management, and interactive feedback
   - Test responsive behavior with real browser viewport simulation

2. **Performance Integration During Visual Development**:
   - Monitor performance impact of visual changes in real-time
   - Optimize animations and transitions for 60fps delivery
   - Ensure Core Web Vitals targets maintained (LCP <2.5s, FID <100ms, CLS <0.1)
   - Use hardware-accelerated transforms for premium performance

## Phase 4: Final Validation & Production Integration

### **Comprehensive Cross-Browser & Accessibility Testing**
1. **Browser Compatibility Validation**:
   - Test across Chrome, Firefox, Safari using your existing Playwright setup
   - Validate visual consistency across browser rendering engines
   - Test interactive behaviors and animation performance
   - Ensure graceful fallbacks for advanced CSS features

2. **Accessibility Excellence Integration**:
   - Validate with @axe-core/playwright using your existing 24-test accessibility framework
   - Test with real keyboard navigation and screen reader compatibility
   - Ensure sufficient color contrast and focus management
   - Validate that visual changes maintain or enhance accessibility

### **Visual Acceptance & Documentation**
1. **Final Comparison & User Approval**:
   - Present comprehensive before/after visual comparison report
   - Generate detailed diff analysis with similarity metrics
   - Request user approval for visual match or document acceptable deviations
   - Create visual documentation for future reference and maintenance

2. **Production Integration & Quality Gates**:
   - Execute complete quality validation pipeline:
     - `npm run typecheck` for TypeScript validation
     - `npm run lint` for code quality standards
     - `npm run build` for production build verification
     - **NEW**: Use optimized testing workflow:
       - `npm run test:e2e:dev` for functional validation
       - `npm run test:e2e:visual` for visual regression testing
       - `npm run test:e2e:claude-review` for final visual approval
   - Update visual regression baselines with approved changes

### **Professional Commit & Documentation**
1. **Comprehensive Implementation Commit**:
   - Generate detailed commit message with visual implementation summary
   - Include before/after screenshots in pull request documentation
   - Link to original mock and document any intentional deviations
   - Update component documentation with visual specifications

2. **Integration with Portfolio Standards**:
   - Ensure implementation showcases technical mastery through visual excellence
   - Validate integration with existing interactive storytelling elements
   - Confirm enhancement of overall portfolio presentation quality
   - Update visual style guide or component library as needed

## Visual-Specific Features & Advanced Capabilities

### **Smart Visual Analysis**
- **Claude Integration**: Automated screenshot generation for intelligent visual analysis and feedback
- **Fast Iteration Workflow**: Use `npm run test:e2e:dev` and screenshot commands for rapid visual development
- **AI-Powered Diff Detection**: Intelligent visual difference analysis with actionable feedback
- **Progressive Enhancement Workflow**: Layer visual improvements systematically for maximum impact
- **Accessibility-First Visual Design**: Ensure visual changes enhance rather than compromise accessibility
- **Performance-Conscious Visual Development**: Monitor and optimize visual performance impact

### **Integration with Tyler Gohr Portfolio Infrastructure**
- **Visual Regression Leverage**: Build on your existing 100+ screenshot baseline system
- **Cross-Device Truth**: Use real browser testing across actual mobile, tablet, desktop viewports  
- **Brand Consistency**: Automatic integration with dark theme and green/red accent system
- **Quality Assurance**: Integration with your proven Playwright testing reliability (100% success rate)

## Command Arguments & Customization

### **Required Arguments**
- `--mock=path/to/mockup.png`: Path to target visual mock (required)

### **Optional Configuration**
- `--viewport=all` (default): mobile, tablet, desktop, or all
- `--iterations=3` (default): Maximum number of improvement iterations
- `--threshold=0.95` (default): Visual similarity threshold for acceptance
- `--fast-mode`: Skip some comprehensive checks for rapid iteration

### **Advanced Options**
- `--capture-animations`: Include animation frame capture for motion design
- `--accessibility-overlay`: Include accessibility overlay in visual comparison
- `--performance-monitoring`: Track performance metrics during visual development
- `--claude-integration`: Use `npm run test:e2e:claude-review` for AI-powered visual analysis
- `--fast-iteration`: Use `npm run test:e2e:dev` and skip visual regression for rapid development
- `--environment-aware`: Use `SKIP_VISUAL=true` options for functionality-focused development

## Tyler Gohr Portfolio Visual Development Advantages

### 🎨 **Premium Visual Development**
- **Pixel-Perfect Results**: Automated comparison ensures exact visual fidelity
- **Real Browser Rendering**: No simulation - test actual browser rendering behavior
- **Cross-Device Truth**: Real viewport testing across actual mobile, tablet, desktop devices
- **Performance-Integrated**: Visual development with built-in performance optimization

### 🚀 **Creative Excellence Standards**
- **Brand Integration**: Automatic integration with sophisticated dark theme system
- **Advanced CSS Showcase**: Demonstrate Container Queries, CSS Grid Subgrid, and Scroll-driven Animations
- **Interactive Storytelling**: Visual elements that demonstrate technical mastery
- **Professional Presentation**: Enterprise-grade visual quality for business client presentation

### 🛡️ **Quality & Reliability**
- **100% Test Reliability**: Build on your proven Playwright visual testing infrastructure
- **Accessibility Integrated**: Visual development that maintains WCAG 2.1 AA compliance
- **Performance Guaranteed**: Visual excellence without sacrificing Core Web Vitals targets
- **Maintainable Excellence**: Visual changes integrated into your comprehensive testing system

This visual development approach transforms design implementation into a systematic, iterative process that leverages your world-class visual testing infrastructure to achieve pixel-perfect results with professional quality and performance.