# Explore Plan Commit - Systematic Complex Problem Solving

Automate the "Explore, plan, code, commit" workflow - the most versatile pattern for complex problems requiring deep investigation and systematic implementation.

**Usage**: `/explore-plan-commit "task description" [--thinking-level=think|think-hard|think-harder|ultrathink] [--skip-subagents]`

**For task**: $ARGUMENTS

## Phase 1: Explore (Information Gathering) - No Code Changes

### **Automatic Investigation Deployment**
1. **Deploy Subagents for Parallel Investigation** (unless --skip-subagents):
   - Auto-generate exploration queries based on task analysis
   - Deploy multiple subagents to investigate different aspects simultaneously
   - Gather relevant files, documentation, and architectural context
   - Investigate similar patterns and implementations in codebase

2. **Context Synthesis & Analysis**:
   - Consolidate all subagent findings into comprehensive understanding
   - Identify key constraints, requirements, and dependencies
   - Map existing codebase patterns and architectural decisions
   - Analyze similar implementations for consistency and best practices
   - Check workspace diagnostics for any existing TypeScript errors

3. **GitHub Issues & Project Context**:
   - Check `gh issue list --state open` for related priorities
   - Reference completed milestones and related issues for context
   - Understand how task aligns with current project phase
   - Identify potential conflicts or dependencies with other work

## Phase 2: Plan (Strategic Design & Extended Thinking)

### **Extended Thinking Activation**
1. **Apply Advanced Reasoning** (configurable thinking level):
   - Use specified thinking level: think / think-hard / think-harder / ultrathink
   - Generate multiple solution approaches and evaluate trade-offs
   - Consider implementation complexity, maintainability, and performance impact
   - Evaluate creative opportunities for interactive showcases

2. **Comprehensive Plan Documentation**:
   - Create TodoWrite breakdown with specific, actionable items
   - Auto-generate detailed GitHub issue with implementation plan
   - Establish clear success criteria and testing approach
   - Document architectural decisions and alternative approaches considered

3. **Tyler Gohr Portfolio Integration Planning**:
   - Ensure alignment with cutting-edge CSS features and creative principles
   - Plan for mobile-first creative innovation and interactive storytelling
   - Consider performance impact on Core Web Vitals (LCP <2.5s, FID <100ms, CLS <0.1)
   - Verify compatibility with Google Cloud Run deployment requirements

### **Plan Validation & Approval**
- Present comprehensive plan for user review and approval
- Allow plan modifications before proceeding to implementation
- Confirm approach enhances technical storytelling and portfolio objectives

## Phase 3: Code (Systematic Implementation)

### **Step-by-Step Implementation**
1. **Execute Plan with Verification**:
   - Follow validated plan systematically with incremental progress
   - Apply Tyler Gohr Portfolio coding standards and patterns:
     - Next.js 14+ with App Router and TypeScript
     - CSS Modules with cutting-edge CSS features (never Tailwind)
     - Container Queries, CSS Grid Subgrid, Scroll-driven Animations
     - Dark theme with strategic green/red business accents
     - Mobile-first creative innovation and interactive storytelling

2. **Real-Time Progress Tracking**:
   - Update TodoWrite items in real-time as each step completes
   - Provide implementation status updates and handle blockers
   - Adaptive re-planning if unexpected challenges arise
   - Run quality gates at each major milestone

3. **Creative Excellence & Testing Standards**:
   - Implement with performance optimization for 60fps smooth animations
   - Maintain WCAG 2.1 AA accessibility compliance throughout
   - Test changes incrementally using `npm run dev`
   - Verify mobile responsiveness and cross-device compatibility
   - Ensure creative elements enhance rather than distract from content

## Phase 4: Commit (Quality Validation & Integration)

### **Comprehensive Quality Gates**
1. **Technical Validation**:
   - Execute `npm run typecheck` for TypeScript validation
   - Run `npm run lint` for code quality and standards
   - Test production build with `npm run build` 
   - Run relevant Playwright tests based on changes made:
     - Visual changes: `npx playwright test e2e/visual-regression-2.spec.ts`
     - Navigation changes: `npx playwright test e2e/navigation-component.spec.ts`
     - Accessibility: `npx playwright test e2e/accessibility-enhanced.spec.ts`
     - Component changes: `npx playwright test e2e/contact-component.spec.ts`

2. **Performance & Accessibility Validation**:
   - Verify Core Web Vitals performance targets maintained
   - Test interactive elements and animations across devices
   - Validate creative storytelling effectiveness and professional presentation
   - Ensure smooth 60fps performance and accessibility compliance

### **Git Integration & Documentation**
1. **Professional Commit Process**:
   - Generate descriptive commit messages following project conventions
   - Create pull request with comprehensive context and implementation details
   - Update documentation as needed (README, CLAUDE.md, etc.)
   - Link to related GitHub issues and close completed items

2. **Final TodoWrite Completion**:
   - Mark all TodoWrite items as completed immediately after finishing
   - Add any discovered follow-up tasks for future consideration
   - Update GitHub issues with completion status and any new findings

## Workflow Customization Options

### **Command Arguments**
- `--thinking-level=think-hard` (default): Use think / think-hard / think-harder / ultrathink
- `--skip-subagents`: Skip automatic subagent deployment for simpler tasks
- `--manual-approval`: Require approval between each major phase

### **Error Recovery & Rollback**
- Handle implementation failures gracefully with rollback options
- Preserve conversation continuity across all phases
- Allow workflow modifications and re-planning when needed

## Tyler Gohr Portfolio Specific Considerations

### 🎨 **Creative Design Integration**
- **Dark Theme Sophistication**: Maintain high-contrast professional aesthetics
- **Strategic Color Usage**: Integrate green/red accents representing business logic
- **Interactive Storytelling**: Ensure every element demonstrates technical mastery
- **Brand Voice**: Confident expertise demonstrated through interactive experiences

### 🚀 **Technical Excellence Standards**
- **Modern Architecture**: Next.js 14+ App Router with TypeScript
- **Advanced CSS**: Container Queries, CSS Grid Subgrid, Scroll-driven Animations
- **Performance**: 90+ Lighthouse scores, <2.5s LCP, 60fps animations
- **Accessibility**: WCAG 2.1 AA compliance with inclusive design principles

### 🛡️ **Quality & Safety**
- **File Protection**: Never modify .env*, next.config.js, package.json without confirmation
- **Read Before Edit**: Always read files before making changes
- **Testing Integration**: Leverage Playwright-only testing strategy (100% reliability)

This systematic approach transforms complex problems into manageable, high-quality implementations that showcase technical mastery through creative, interactive portfolio experiences.