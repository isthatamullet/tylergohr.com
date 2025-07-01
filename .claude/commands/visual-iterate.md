# Visual Iterate - Visual Mock-Driven Development

Automate visual mock-driven development with screenshot comparison, iterative refinement, and integration with Tyler Gohr Portfolio's comprehensive Playwright visual testing infrastructure.

**Usage**: `/visual-iterate "UI feature description" --mock=path/to/mockup.png [--viewport=mobile|tablet|desktop|all] [--iterations=3] [--threshold=0.95]`

**For task**: $ARGUMENTS

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
   - Capture screenshots across specified viewports (mobile/tablet/desktop/all)
   - Use existing Playwright infrastructure for consistent, reliable screenshots
   - Generate visual diff reports comparing against target mock
   - Leverage your proven 100+ screenshot baseline system

2. **Gap Analysis & Improvement Planning**:
   - Identify visual discrepancies using AI-powered difference detection
   - Prioritize fixes based on visual impact and user experience importance
   - Plan iterative improvements with clear success criteria
   - Document deviations that may be acceptable or intentional

## Phase 3: Iterative Refinement & Progressive Enhancement

### **Improvement Cycles with Real-Time Feedback**
1. **Targeted Visual Improvements**:
   - Make focused improvements based on visual diff analysis
   - Re-capture screenshots after each significant change
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
     - Visual regression test suite for baseline update
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