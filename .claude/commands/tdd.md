# TDD - Test-Driven Development with Playwright

Automate test-driven development workflow with clear test/code separation, commit checkpoints, and integration with Tyler Gohr Portfolio's Playwright-only testing strategy.

**Usage**: `/tdd "feature description" [--test-framework=playwright] [--test-pattern=unit|integration|e2e|component] [--coverage-threshold=80]`

**For task**: $ARGUMENTS

## Phase 1: Test Design & Creation (Red Phase)

### **Requirement Analysis & Test Planning**
1. **Parse Feature Requirements**:
   - Break down feature description into specific, testable behaviors
   - Identify input/output pairs, edge cases, and error conditions
   - Map requirements to existing test patterns in codebase
   - Analyze integration points with current Tyler Gohr Portfolio architecture

2. **Test Framework Integration** (Playwright-focused):
   - Auto-detect project's Playwright testing setup (your 93 comprehensive tests)
   - Leverage existing test infrastructure:
     - `e2e/contact-component.spec.ts` patterns for component testing
     - `e2e/navigation-component.spec.ts` patterns for interaction testing
     - `e2e/visual-regression-2.spec.ts` patterns for visual validation
     - `e2e/accessibility-enhanced.spec.ts` patterns for a11y compliance
     - **NEW**: `e2e/utils/dev-test-helpers.ts` deterministic wait utilities
     - **NEW**: `e2e/screenshot-generation.spec.ts` for Claude visual integration

3. **Test Suite Generation**:
   - Create comprehensive Playwright test suite covering all requirements
   - Use project-specific testing patterns and conventions
   - Integrate with existing visual regression baseline system (100+ screenshots)
   - Ensure tests fail initially (red phase) to establish baseline

### **Test Categories & Patterns**

#### **Component Testing** (leveraging your existing patterns)
```typescript
// Example pattern from your e2e/contact-component.spec.ts
test.describe('New Feature Component', () => {
  test('should render with proper accessibility', async ({ page }) => {
    // Real browser testing following your 19-test component pattern
  });
});
```

#### **Visual Testing** (leveraging your existing visual regression)
```typescript  
// Pattern from your e2e/visual-regression-2.spec.ts
test('visual consistency across viewports', async ({ page }) => {
  // Screenshot comparison using your existing 100+ baseline system
});
```

#### **Accessibility Testing** (leveraging your existing a11y framework)
```typescript
// Pattern from your e2e/accessibility-enhanced.spec.ts  
test('WCAG 2.1 AA compliance', async ({ page }) => {
  // @axe-core/playwright testing following your 24-test pattern
});
```

### **Test Commit Checkpoint**
1. **Commit Failing Tests**:
   - Run tests to confirm they fail appropriately (red phase)
   - Generate descriptive commit message: "Add failing tests for [feature]"
   - Establish clear baseline for implementation
   - Document test coverage expectations and success criteria

## Phase 2: Implementation Iteration (Green Phase)

### **Minimal Implementation Strategy**
1. **Write Minimal Code to Pass First Test**:
   - Focus on making tests green incrementally, one test at a time
   - Avoid over-engineering or premature optimization
   - Apply Tyler Gohr Portfolio coding standards:
     - Next.js 14+ with App Router and TypeScript
     - CSS Modules with cutting-edge CSS features (never Tailwind)
     - Container Queries, CSS Grid Subgrid, Scroll-driven Animations

2. **Test-Code Cycle Automation**:
   - Use fast development testing for rapid TDD iteration:
     - `npm run test:e2e:dev` for functional testing without visual overhead (2-3min)
     - `SKIP_VISUAL=true npm run test:e2e:portfolio` for faster comprehensive testing
     - `npx playwright test [test-file]` for specific test file iteration
   - Iterate systematically until all tests pass
   - Maintain test integrity (no test modifications during implementation)
   - Progress tracking with TodoWrite for each test group

3. **Real Browser Validation** (leveraging Playwright strength):
   - Test actual user interactions (no mocking complexity like old Jest approach)
   - Validate cross-device responsiveness in real viewports
   - Ensure animations perform at 60fps in actual browsers
   - Test accessibility with real screen readers and keyboard navigation

### **Implementation Standards**
- **Performance**: Maintain Core Web Vitals targets (LCP <2.5s, FID <100ms, CLS <0.1)
- **Accessibility**: WCAG 2.1 AA compliance throughout implementation  
- **Visual Consistency**: Match portfolio's dark theme with green/red accents
- **Mobile-First**: Touch-optimized interactions maintaining desktop sophistication

## Phase 3: Refactor & Quality Enhancement (Refactor Phase)

### **Code Quality Enhancement**
1. **Refactor While Maintaining Green Tests**:
   - Apply advanced CSS techniques (Container Queries, CSS Grid Subgrid)
   - Optimize animations for performance and smooth 60fps delivery
   - Enhance accessibility beyond compliance to excellence
   - Implement creative storytelling elements where appropriate

2. **Integration with Portfolio Architecture**:
   - Ensure consistency with existing component patterns
   - Integrate with brand design system and color palette
   - Optimize for Google Cloud Run deployment compatibility
   - Maintain cutting-edge technical demonstration standards

### **Verification with Advanced Testing**
1. **Comprehensive Validation**:
   - Run full relevant test suite based on changes:
     - Component changes: `npm run test:e2e:component` for focused testing
     - Visual changes: `npm run test:e2e:visual` and `npm run test:e2e:claude-review` for comprehensive visual validation
     - Navigation changes: `npm run test:e2e:navigation` for behavior testing
     - Accessibility changes: `npm run test:e2e:accessibility` for enhanced a11y testing

2. **Cross-Device & Performance Testing**:
   - Mobile responsiveness: `npm run test:e2e:mobile`
   - Visual consistency: `npm run test:e2e:visual`
   - Accessibility: `npm run test:e2e:accessibility`
   - Performance validation with Core Web Vitals

### **Implementation Commit**
1. **Quality Gates Validation**:
   - Execute `npm run typecheck` for TypeScript validation
   - Run `npm run lint` for code quality standards
   - Test production build: `npm run build`
   - Use optimized testing workflow:
     - `npm run test:e2e:dev` for fast functional validation
     - `npm run test:e2e:portfolio` for comprehensive E2E validation
     - `npm run test:e2e:claude-review:current` for visual validation

2. **Professional Commit & Documentation**:
   - Generate comprehensive commit message linking to requirements
   - Include test coverage metrics and implementation notes
   - Create pull request with before/after visual comparisons
   - Update documentation and link to related GitHub issues

## TDD-Specific Features & Integration

### **Leveraging Tyler Gohr Portfolio Testing Infrastructure**
- **Visual Regression**: Use existing 100+ screenshot baseline system
- **Accessibility Framework**: Build on @axe-core/playwright setup (24 tests)
- **Component Patterns**: Follow established e2e/contact-component.spec.ts patterns (19 tests)
- **Cross-Device Testing**: Integrate with mobile, tablet, desktop viewport testing

### **Test Framework Auto-Detection**
- **Playwright Integration**: Seamlessly integrate with your existing 93 comprehensive tests
- **Fast Development Testing**: Automatic use of `npm run test:e2e:dev` and `npm run test:e2e:smoke` for rapid TDD cycles
- **Environment-Aware Testing**: Leverage `SKIP_VISUAL=true` and `FAST_MODE=true` options during TDD iteration
- **Coverage Analysis**: Report test coverage metrics and identify gaps
- **Failure Analysis**: Intelligent test failure debugging with actionable suggestions
- **Performance Monitoring**: Track test execution time and optimize for speed (80% improvement achieved)

### **Portfolio-Specific TDD Benefits**
- **Real Browser Testing**: No mocking complexity - test actual user experience
- **Visual TDD**: Write failing visual regression tests, implement until screenshots match
- **Accessibility TDD**: Test with real assistive technologies, not simulated
- **Performance TDD**: Test actual animation performance and Core Web Vitals

## Command Arguments & Customization

### **Available Options**
- `--test-framework=playwright` (default, matches your setup)
- `--test-pattern=e2e` (default), `component`, `visual`, `accessibility`, `dev`, `smoke`
- `--coverage-threshold=80` (default): Minimum test coverage requirement
- `--fast-iteration`: Use `npm run test:e2e:dev` and skip visual regression for rapid TDD cycles
- `--visual-validation`: Include `npm run test:e2e:claude-review` for visual TDD workflow
- `--environment-aware`: Use `SKIP_VISUAL=true` and `FAST_MODE=true` for focused testing

### **Integration with Existing Workflow**
- **TodoWrite Integration**: Automatic task breakdown and progress tracking
- **GitHub Issues**: Link tests and implementation to project roadmap
- **Quality Gates**: Integration with your existing `npm run validate` process

## Tyler Gohr Portfolio TDD Advantages

### 🧪 **Superior Testing Strategy**
- **100% Reliability**: Your Playwright tests have 100% success rate vs. 25% Jest success
- **Real User Experience**: Test actual interactions, not simulated events
- **Visual Validation**: Screenshot comparison catches visual regressions
- **Cross-Device Truth**: Real browser testing across all viewports

### 🚀 **Creative Development Integration**
- **Animation TDD**: Test smooth 60fps performance in real browsers
- **Responsive TDD**: Test actual responsive behavior across real devices
- **Accessibility TDD**: Test with real assistive technologies
- **Performance TDD**: Validate Core Web Vitals in real deployment conditions

This TDD approach transforms feature development into a disciplined, test-first methodology that leverages your world-class Playwright testing infrastructure for maximum confidence and minimum maintenance overhead.