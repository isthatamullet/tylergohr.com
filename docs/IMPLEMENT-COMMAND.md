# /implement - Systematic Feature Development Command

## Overview
The `/implement` command provides a comprehensive, end-to-end development workflow from feature conception to Cloud Run preview deployment. It ensures consistent, high-quality implementation following Tyler Gohr Portfolio's proven development methodology.

## Command Usage

### Basic Syntax
```bash
# Simple feature implementation
/implement "description of feature or fix"

# GitHub issue-based implementation (optional)
/implement gh-123 "description referencing issue"
/implement #456 "implement feature from issue 456"
```

### Usage Examples

#### **Simple Features (Direct Implementation)**
```bash
/implement "add dark mode toggle to settings page"
/implement "fix navigation dropdown hover effects on mobile"
/implement "create animated contact form with validation"
/implement "optimize image loading with lazy loading"
/implement "implement logo float animation from hero to nav"
```

#### **GitHub Issue Integration**
```bash
/implement gh-42 "implement user authentication system"
/implement #15 "add blog post pagination with infinite scroll"
/implement gh-78 "fix responsive layout issues on mobile devices"
```

### **Complexity Detection**
The command automatically detects feature complexity and adapts workflow:
- **Simple (≤15 min)**: Streamlined single-commit approach
- **Medium (15-30 min)**: Enhanced documentation with optional iterative commits
- **Complex (30+ min)**: Full enterprise workflow with step-by-step commits

## Workflow Stages

### 🔍 **Stage 1: Planning & Investigation**
**Duration**: 2-7 minutes (varies by complexity)
**Actions**:
- Create timestamped investigation scratchpad
- **GitHub Issue Integration** (if provided): Pull issue context and requirements
- **Prior Art Research**: Systematic search of existing implementations
  - Search related scratchpads for similar work
  - Review GitHub PR history for relevant patterns
  - Analyze existing codebase components
- **Complexity Assessment**: Determine appropriate workflow approach
- Document findings, challenges, and solution approach
- Create TodoWrite task breakdown for implementation

**Enhanced Research Capabilities**:
- **Scratchpad History**: `grep -r "feature-keyword" docs/scratchpad/`
- **GitHub PR Search**: `gh pr list --search "keyword" --state all`
- **Issue Context**: `gh issue view <number>` (when issue provided)
- **Codebase Analysis**: Component and pattern identification

**Outputs**:
- Scratchpad: `docs/scratchpad/investigations/implement-[timestamp]-[feature-slug].md`
- TodoWrite: Structured task list with priorities
- Implementation plan with technical details
- Prior art summary and lessons learned
- GitHub issue context (if applicable)

### 🔧 **Stage 2: Implementation**
**Duration**: 10-30 minutes (varies by complexity)
**Actions**:
- Create feature branch with appropriate naming (≤15 chars)
- Follow systematic coding approach from CLAUDE.md
- Apply TypeScript best practices and Next.js patterns
- Implement mobile-first responsive design
- Follow CSS Modules architecture (no Tailwind)
- Maintain cutting-edge CSS features integration

**Outputs**:
- Clean, production-ready code
- Proper TypeScript typing
- Responsive CSS implementation
- Component integration

### ✅ **Stage 3: Quality Validation**
**Duration**: 3-7 minutes
**Actions**:
- Run mandatory quality gates: `npm run validate`
- Execute visual testing with Puppeteer (for UI changes)
- Cross-device compatibility testing (desktop/mobile)
- Performance validation (Core Web Vitals)
- Accessibility compliance verification

**Outputs**:
- Quality gate validation results
- Visual testing screenshots
- Cross-device compatibility confirmation
- Performance impact assessment

### 📋 **Stage 4: Version Control**
**Duration**: 1-3 minutes (varies by complexity)
**Actions**:
- **Flexible Commit Strategy** (based on complexity):
  - **Simple Features**: Single comprehensive commit
  - **Medium Features**: Optional step-by-step commits with milestones
  - **Complex Features**: Iterative commits preserving development history
- Include visual testing validation status
- Follow conventional commit message format
- Link to GitHub issue (if applicable)
- Push feature branch to GitHub

**Commit Strategy Examples**:
```bash
# Simple feature (single commit)
Add hover animation to navigation buttons

✅ Visual testing validated (desktop/mobile)
🚀 Generated with Claude Code

# Complex feature (iterative commits)
1. "Setup: Create authentication context and types"
2. "Feature: Add login form with validation"
3. "Enhancement: Implement JWT token management"
4. "Fix: Handle authentication edge cases"
5. "Polish: Add loading states and error handling"
```

**Outputs**:
- Commit history appropriate to feature complexity
- Descriptive commit messages with testing status
- GitHub issue linking (when applicable)
- Proper branch organization

### 🚀 **Stage 5: Preview & Review**
**Duration**: 5-8 minutes (including CI/CD)
**Actions**:
- Create comprehensive GitHub PR
- Include detailed description with testing results
- Add visual testing screenshots
- Generate Cloud Run preview URL
- Provide testing checklist for validation

**Outputs**:
- GitHub PR with comprehensive documentation
- Cloud Run preview URL for testing
- Testing checklist for validation

## Command Implementation Protocol

### **Automatic Integrations**
- **CLAUDE.md Compliance**: All mandatory protocols automatically followed
- **Visual Testing**: Auto-detects UI changes and runs appropriate Puppeteer tests
- **GitHub Integration**: Uses existing `gh` CLI commands for PR creation
- **CI/CD Pipeline**: Leverages existing preview deployment system
- **Quality Gates**: Mandatory validation before any commits

### **Smart Detection**
- **UI Changes**: Automatically runs visual testing for component/CSS modifications
- **Performance Impact**: Tests Core Web Vitals for changes affecting load times
- **Mobile Compatibility**: Cross-device testing for responsive design changes
- **Accessibility**: WCAG 2.1 AA compliance validation for UI components
- **Complexity Assessment**: Auto-detects feature scope and suggests appropriate workflow
- **GitHub Integration**: Recognizes issue references and pulls contextual information
- **Prior Art Detection**: Identifies similar implementations for pattern reuse

### **Documentation Standards**
- **Scratchpad Creation**: Automatic investigation documentation
- **PR Descriptions**: Comprehensive technical details and testing results
- **Commit Messages**: Include visual testing status and change summary
- **Testing Documentation**: Screenshots and validation results

## Feature Categories & Workflow Selection

### **Simple Features (≤15 min) - Streamlined Workflow**
- Minor UI adjustments and styling fixes
- Small component modifications
- Quick bug fixes
- Performance micro-optimizations

**Examples**:
```bash
/implement "add hover effect to contact button"
/implement "fix mobile navigation padding"
/implement "update color scheme for accessibility"
```

**Workflow**: Single commit, basic testing, fast PR creation

### **Medium Features (15-30 min) - Balanced Workflow**
- Component creation/modification
- Animation and interaction improvements
- Responsive design adjustments
- Accessibility enhancements

**Examples**:
```bash
/implement "add smooth scroll progress indicator to sidebar"
/implement "create animated contact form with validation"
/implement gh-42 "implement dark mode toggle system"
```

**Workflow**: Optional iterative commits, comprehensive testing, detailed documentation

### **Complex Features (30+ min) - Enterprise Workflow**
- Multi-component integrations
- Advanced functionality additions
- System-wide improvements
- GitHub issue-based implementations

**Examples**:
```bash
/implement gh-15 "add blog system with CMS integration"
/implement #78 "implement user authentication with OAuth"
/implement "create interactive portfolio showcase with 3D animations"
```

**Workflow**: Step-by-step commits, extensive testing, comprehensive documentation, issue integration

### **Workflow Auto-Selection Logic**

**Triggers for Complex Workflow**:
- GitHub issue reference provided (`gh-123`, `#456`)
- Feature description indicates multiple components
- Keywords: "system", "integration", "authentication", "CMS", "database"
- Estimated time > 30 minutes based on description analysis

**Triggers for Simple Workflow**:
- Single component or style changes
- Bug fix descriptions
- Keywords: "fix", "adjust", "update", "add hover", "change color"
- Estimated time ≤ 15 minutes

## Quality Standards

### **Code Quality**
- ✅ TypeScript strict mode compliance
- ✅ ESLint validation passing
- ✅ Next.js best practices
- ✅ CSS Modules architecture
- ✅ Mobile-first responsive design

### **Visual Quality**
- ✅ Cross-device compatibility (desktop, tablet, mobile)
- ✅ 60fps animation performance
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ Professional design consistency
- ✅ Brand guideline adherence

### **Performance Standards**
- ✅ Core Web Vitals targets met
- ✅ No bundle size regression
- ✅ Smooth scroll performance
- ✅ Fast interaction response
- ✅ Optimized asset loading

## Success Metrics

### **Development Efficiency**
- Complete feature implementation in single session
- Consistent quality across all implementations
- Reduced manual workflow steps
- Comprehensive documentation generation

### **Quality Assurance**
- Zero production bugs from implemented features
- 100% visual testing coverage for UI changes
- Consistent cross-device experience
- Performance targets maintained

### **Documentation Excellence**
- Complete implementation history in scratchpads
- Detailed PR descriptions with testing results
- Clear commit messages with visual validation
- Maintainable code with proper typing

## Command Response Format

When `/implement` is executed, Claude will respond with:

### **Simple Feature Response**:
```
🚀 Implementing: [Feature Description] (Simple Workflow)

📋 Stage 1: Planning & Investigation (2-3 min)
   ✅ Created scratchpad: implement-[timestamp]-[slug].md
   ✅ Analyzed existing code patterns
   ✅ Documented approach

🔧 Stage 2: Implementation (5-10 min)
   ✅ Created feature branch: feature/[short-name]
   ✅ Implemented changes
   ✅ Applied responsive design

✅ Stage 3: Quality Validation (2-3 min)
   ✅ Quality gates passed
   ✅ Visual testing completed

📋 Stage 4: Version Control (1 min)
   ✅ Single commit with testing validation
   ✅ Pushed to GitHub

🚀 Stage 5: Preview & Review (5 min)
   ✅ Created GitHub PR #[number]
   ✅ Preview URL: [URL] (available in ~5 minutes)

🎉 Simple Feature Complete! Ready for review.
```

### **Complex Feature Response**:
```
🚀 Implementing: [Feature Description] (Complex Workflow)
📋 GitHub Issue: #[number] - [issue title]

📋 Stage 1: Planning & Investigation (5-7 min)
   ✅ Created scratchpad: implement-[timestamp]-[slug].md
   ✅ Analyzed GitHub issue context
   ✅ Researched prior art in scratchpads
   ✅ Reviewed related PRs and implementations
   ✅ Documented comprehensive approach
   ✅ Created detailed TodoWrite breakdown

🔧 Stage 2: Implementation (20-40 min)
   ✅ Created feature branch: feature/[descriptive-name]
   ✅ Step 1: [Implementation milestone] (commit)
   ✅ Step 2: [Implementation milestone] (commit)
   ✅ Step 3: [Implementation milestone] (commit)
   ✅ Applied comprehensive testing strategy

✅ Stage 3: Quality Validation (5-10 min)
   ✅ Quality gates passed (all components)
   ✅ Visual testing with screenshots
   ✅ Cross-device validation
   ✅ Performance impact assessment
   ✅ Accessibility compliance verified

📋 Stage 4: Version Control (2-3 min)
   ✅ Multiple commits preserving development history
   ✅ Issue linking and context preservation
   ✅ Pushed feature branch to GitHub

🚀 Stage 5: Preview & Review (5-8 min)
   ✅ Created comprehensive GitHub PR #[number]
   ✅ Linked to issue #[number]
   ✅ Included visual testing results
   ✅ Preview URL: [URL] (available in ~5 minutes)

🎉 Complex Feature Complete!
Issue implementation ready for stakeholder review.
```

## Integration with Existing Workflow

### **CLAUDE.md Compliance**
- Follows all mandatory pre-commit quality gates
- Applies visual testing requirements automatically
- Uses established branch naming conventions
- Maintains file protection rules

### **Enhanced Scratchpad System**
- **Prior Art Integration**: Automatic search of related scratchpads
- **GitHub Context**: Links to issues, PRs, and implementation history
- **Pattern Recognition**: Identifies successful implementation approaches
- **Knowledge Preservation**: Builds institutional memory over time
- **Cross-Reference Network**: Links related implementations and decisions

### **CI/CD Pipeline**
- Leverages existing GitHub Actions workflow
- Uses established Docker tag naming patterns
- Generates Cloud Run preview deployments
- Provides comprehensive testing environment

This command transforms the development process into a systematic, repeatable workflow that ensures consistent quality while maximizing development efficiency.