# Work On - Systematic Task Execution

Execute tasks using Tyler Gohr Portfolio's proven workflow patterns.

**Usage**: `/work-on "task description"`

**For task**: $ARGUMENTS

## Phase 1: Explore & Plan (No Code Changes)

1. **Use TodoWrite for Complex Tasks**:
   - If task has 3+ steps or affects multiple files, use TodoWrite to break it down
   - Create specific, actionable todo items with clear success criteria
   - Mark the main task as in_progress before beginning

2. **Check GitHub Issues for Context**:
   - Use `gh issue view 1` to understand overall project roadmap
   - Check `gh issue list --state open` for current priorities
   - Reference completed milestones like issue #5 for context
   - Align task with current phase and development priorities

3. **Read Relevant Files**:
   - Identify and read all files related to the task
   - Explicitly do NOT write any code yet - focus on understanding
   - Check workspace diagnostics first for any existing TypeScript errors
   - Review existing patterns and architecture in the codebase
   - Reference CLAUDE.md for project context and requirements

4. **Plan Creative Approach**:
   - Use "think" or "think hard" to trigger extended reasoning if needed
   - Develop a detailed implementation approach considering portfolio constraints
   - Consider creative opportunities for interactive showcases
   - Plan with performance and Core Web Vitals in mind
   - Document the plan before proceeding to implementation

5. **Validate Plan**:
   - Review plan against tylergohr.com requirements and brand focus
   - Check alignment with cutting-edge CSS features and creative principles
   - Ensure approach maintains Google Cloud Run deployment compatibility
   - Confirm creative approach enhances technical storytelling
   - Verify plan before moving to implementation

## Phase 2: Implement

6. **Follow Systematic Implementation**:
   - Follow the validated plan step by step
   - Make incremental changes with verification at each step
   - Apply tylergohr.com coding standards and patterns:
     - Next.js 14+ with App Router and TypeScript
     - CSS Modules with cutting-edge CSS features (never Tailwind)
     - Container Queries, CSS Grid Subgrid, Scroll-driven Animations
     - Dark theme with strategic green/red business accents
     - Mobile-first creative innovation
     - Interactive storytelling elements

7. **Creative Excellence Standards**:
   - Implement with performance optimization in mind
   - Ensure 60fps smooth animations and interactions
   - Maintain accessibility compliance (WCAG 2.1 AA)
   - Create responsive experiences across all devices
   - Integrate technical storytelling elements where appropriate

8. **Test Changes Incrementally**:
   - Test changes as you implement them using `npm run dev`
   - Verify mobile responsiveness and cross-device compatibility
   - Check performance impact of animations and effects
   - Ensure creative elements enhance rather than distract from content

## Phase 3: Verify & Complete

9. **Run Comprehensive Quality Gates**:
   - Execute `npm run typecheck` for TypeScript validation
   - Run `npm run lint` for code quality and standards
   - Execute `npm test` if tests are available
   - Test production build with `npm run build`
   - Verify Core Web Vitals performance targets

10. **Creative & Performance Validation**:
    - Test interactive elements and animations across devices
    - Verify smooth 60fps performance
    - Check accessibility compliance
    - Validate creative storytelling effectiveness
    - Ensure professional portfolio presentation standards

11. **Complete TodoWrite Items**:
    - Mark TodoWrite items as completed immediately after finishing each
    - Do not batch completions - update status in real-time
    - Add any discovered follow-up tasks to the todo list

12. **GitHub Issue Integration**:
    - Reference or update relevant GitHub issues if applicable
    - Create new issues for significant features or discovered work
    - Maintain issue-based status tracking for project transparency

## Tyler Gohr Portfolio Specific Considerations:

### 🎨 Creative Design Principles:
- **Dark Theme Sophistication**: High-contrast design with professional aesthetics
- **Strategic Color Usage**: Green/red accents representing business logic
- **Interactive Storytelling**: Every element demonstrates technical mastery
- **Mobile-First Artistry**: Touch-optimized experiences maintaining desktop sophistication
- **Brand Voice**: Confident expertise demonstrated through interactive experiences

### 🚀 Cutting-Edge Technical Requirements:
- **Next.js 14+**: App Router with TypeScript for modern development
- **CSS Modules**: Never add Tailwind - use cutting-edge CSS features
- **Container Queries**: Responsive components adapting to container context
- **CSS Grid Subgrid**: Perfect alignment for complex layouts
- **Scroll-driven Animations**: Native CSS animations for performance
- **Performance Excellence**: Core Web Vitals 90+ scores, <2.5s LCP

### 🛡️ File Protection & Safety:
- **Never modify without confirmation**: .env* files, next.config.js, package.json
- **Read before edit**: Always read files before making changes
- **Quality first**: Run typecheck and lint before considering task complete

### 📊 Performance & Accessibility:
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **60fps animations**: Smooth performance across all devices
- **WCAG 2.1 AA**: Full accessibility compliance
- **Mobile-first**: Responsive design with touch optimization

### 🎯 Portfolio Storytelling:
- **Technical Depth**: Show expertise through interactive demonstrations
- **Problem-Solution Narrative**: Demonstrate real-world problem solving
- **Architecture Visualization**: Interactive system design explanations
- **Live Code Examples**: Syntax-highlighted implementation showcases
- **Creative Innovation**: Balance artistry with technical sophistication

This systematic approach ensures consistent, high-quality development that creates an impressive portfolio showcasing technical mastery through creative, interactive experiences.