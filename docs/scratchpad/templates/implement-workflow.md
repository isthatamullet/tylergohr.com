# /implement Workflow Template
**Feature/Fix**: [USER_DESCRIPTION]
**Date**: [TIMESTAMP]
**Status**: 🔄 In Progress
**Workflow Type**: [Simple / Medium / Complex]
**GitHub Issue**: [#ISSUE_NUMBER] (if applicable)
**Estimated Completion**: [TIME_ESTIMATE]

## 📋 Feature Analysis

### **User Request**
> [ORIGINAL_USER_DESCRIPTION]

### **Technical Interpretation**
[Claude's interpretation of what needs to be implemented]

### **Scope & Complexity**
- **Type**: [Feature Addition / Bug Fix / Enhancement / Performance]
- **Complexity**: [Low / Medium / High]
- **Workflow Selected**: [Simple / Medium / Complex] - [Rationale]
- **Estimated Time**: [≤15 min / 15-30 min / 30+ min]
- **Impact Areas**: [List affected components/files]
- **GitHub Integration**: [Issue #NUMBER] / [Direct Implementation]

## 🔍 Investigation Phase

### **GitHub Issue Context** (if applicable)
**Issue Details**:
- **Title**: [Issue title from `gh issue view`]
- **Description**: [Key requirements and context]
- **Labels**: [Issue labels and categorization]
- **Related Work**: [Links to related issues/PRs]

### **Prior Art Research**
**Scratchpad History Search**:
- **Command**: `grep -r "[keyword]" docs/scratchpad/investigations/`
- **Related Implementations**: [List similar features found]
- **Lessons Learned**: [Key insights from previous work]
- **Pattern Reuse**: [Successful approaches to apply]

**GitHub PR History**:
- **Command**: `gh pr list --search "[keyword]" --state all`
- **Related PRs**: [PRs with similar implementations]
- **Implementation Patterns**: [Successful patterns identified]
- **Code Reuse Opportunities**: [Components/utilities to leverage]

**Issue History Analysis**:
- **Related Issues**: [Connected feature requests or bugs]
- **Previous Discussions**: [Key decisions and context]
- **Implementation Constraints**: [Known limitations or requirements]

### **Codebase Analysis**
**Files to Examine**:
- [ ] [File 1] - [Purpose/relevance]
- [ ] [File 2] - [Purpose/relevance]
- [ ] [File 3] - [Purpose/relevance]

**Related Components**:
- [ ] [Component 1] - [Relationship to feature]
- [ ] [Component 2] - [Relationship to feature]

**Dependencies**:
- [ ] [Dependency 1] - [Why needed]
- [ ] [Dependency 2] - [Why needed]

### **Implementation Approach**
**Strategy**: [High-level approach description]

**Technical Decisions**:
1. **[Decision 1]**: [Rationale]
2. **[Decision 2]**: [Rationale]
3. **[Decision 3]**: [Rationale]

**Challenges Identified**:
- [ ] [Challenge 1] - [Mitigation strategy]
- [ ] [Challenge 2] - [Mitigation strategy]

## 🔧 Implementation Plan

### **TodoWrite Task Breakdown**
```
Priority: High
- [ ] [Main implementation task]
- [ ] [Sub-task 1]
- [ ] [Sub-task 2]

Priority: Medium  
- [ ] [Supporting task 1]
- [ ] [Supporting task 2]

Priority: Low
- [ ] [Polish/enhancement task]
```

### **Implementation Steps**

#### **Simple Workflow (≤15 min)**
1. **Quick Setup**
   - [ ] Create feature branch: `feature/[short-name]` (≤15 chars)
   - [ ] Single-focus implementation
   
2. **Streamlined Implementation**
   - [ ] [Primary change]
   - [ ] Basic responsive adjustments
   - [ ] Quick visual validation
   
3. **Single Commit Strategy**
   - [ ] Comprehensive commit with all changes
   - [ ] Visual testing validation included

#### **Medium Workflow (15-30 min)**
1. **Structured Setup**
   - [ ] Create feature branch: `feature/[descriptive-name]`
   - [ ] Update TodoWrite with detailed task breakdown
   
2. **Systematic Implementation**
   - [ ] [Implementation milestone 1]
   - [ ] [Implementation milestone 2]
   - [ ] [Implementation milestone 3]
   
3. **Enhanced Integration**
   - [ ] Component integration testing
   - [ ] Cross-device validation
   
4. **Optional Iterative Commits**
   - [ ] Milestone-based commits (optional)
   - [ ] Final comprehensive commit

#### **Complex Workflow (30+ min)**
1. **Enterprise Setup**
   - [ ] Create feature branch: `feature/[github-issue-name]`
   - [ ] Link to GitHub issue: #[NUMBER]
   - [ ] Comprehensive TodoWrite breakdown
   
2. **Phase-Based Implementation**
   - [ ] Phase 1: [Core functionality] → Commit
   - [ ] Phase 2: [Integration layer] → Commit
   - [ ] Phase 3: [Enhancement features] → Commit
   - [ ] Phase 4: [Polish and optimization] → Commit
   
3. **Comprehensive Integration**
   - [ ] Multi-component testing
   - [ ] Performance impact assessment
   - [ ] Accessibility compliance validation
   
4. **Step-by-Step Commit Strategy**
   - [ ] Development history preservation
   - [ ] Issue milestone linking
   - [ ] Comprehensive testing at each phase

## ✅ Quality Validation Plan

### **Code Quality**
- [ ] TypeScript validation (`npm run typecheck`)
- [ ] ESLint compliance (`npm run lint`)
- [ ] Production build test (`npm run build`)
- [ ] No console errors in development

### **Visual Testing** (if UI changes)
- [ ] Desktop viewport testing (1200x800)
- [ ] Mobile viewport testing (375x667)
- [ ] Animation performance validation (60fps)
- [ ] Cross-device consistency check
- [ ] Accessibility compliance (WCAG 2.1 AA)

### **Functionality Testing**
- [ ] Core feature functionality
- [ ] Edge case handling
- [ ] Error state behavior
- [ ] Loading state behavior

### **Performance Validation**
- [ ] Core Web Vitals impact assessment
- [ ] Bundle size impact check
- [ ] Smooth scroll/interaction performance
- [ ] No memory leaks in animations

## 📋 Implementation Log

### **Progress Updates**
- **[Time]**: [Progress update]
- **[Time]**: [Progress update]
- **[Time]**: [Progress update]

### **Decisions Made**
- **[Decision]**: [Rationale and impact]
- **[Decision]**: [Rationale and impact]

### **Challenges Encountered**
- **[Challenge]**: [How resolved]
- **[Challenge]**: [How resolved]

### **Files Modified**
- **[File Path]**: [Changes made]
- **[File Path]**: [Changes made]
- **[File Path]**: [Changes made]

## 🚀 Deployment Preparation

### **Branch & Commit Strategy**

#### **Simple Features**
- **Branch Name**: `feature/[short-name]` (≤15 chars)
- **Commit Strategy**: Single comprehensive commit
- **Commit Message Template**:
  ```
  [Action] [component/feature description]
  
  ✅ Visual testing validated (desktop/mobile)
  🚀 Generated with Claude Code
  ```

#### **Medium Features**
- **Branch Name**: `feature/[descriptive-name]`
- **Commit Strategy**: Optional milestone commits + final commit
- **Commit Message Template**:
  ```
  [Milestone]: [Specific implementation detail]
  
  - [Key change 1]
  - [Key change 2]
  
  ✅ Visual testing: [status]
  🚀 Generated with Claude Code
  ```

#### **Complex Features**
- **Branch Name**: `feature/[github-issue-slug]`
- **Commit Strategy**: Step-by-step development history
- **Commit Message Template**:
  ```
  [Phase N]: [Implementation milestone]
  
  Implements part of #[ISSUE_NUMBER]
  - [Detailed change 1]
  - [Detailed change 2]
  
  ✅ Visual testing: [comprehensive/phase-specific]
  🚀 Generated with Claude Code
  
  Co-Authored-By: Claude <noreply@anthropic.com>
  ```

**Visual Testing Status**: ✅ Validated / ❌ N/A / 🔄 In Progress

### **PR Preparation**

#### **Simple Feature PRs**
- **Title**: `[Action] [brief description]`
- **Labels**: `enhancement`, `simple-feature`
- **Description Template**:
  ```markdown
  ## Summary
  [Brief description of change]
  
  ## Implementation
  - [Key technical detail]
  
  ## Testing
  ✅ Visual testing validated (desktop/mobile)
  ✅ Quality gates passed
  
  ## Preview
  Test the change in the preview URL once CI/CD completes.
  ```

#### **Medium Feature PRs**
- **Title**: `[Feature] [descriptive title]`
- **Labels**: `enhancement`, `medium-feature`
- **Description Template**:
  ```markdown
  ## Summary
  [Detailed description with context]
  
  ## Implementation Details
  - [Technical approach]
  - [Key components modified]
  - [Design decisions made]
  
  ## Testing Results
  ✅ Visual testing with screenshots
  ✅ Cross-device compatibility
  ✅ Performance validation
  
  ## Preview Testing
  [Specific testing scenarios for reviewers]
  ```

#### **Complex Feature PRs**
- **Title**: `[GitHub Issue Integration] [comprehensive title]`
- **Labels**: `enhancement`, `complex-feature`, `github-issue`
- **Description Template**:
  ```markdown
  ## Summary
  Implements #[ISSUE_NUMBER] - [issue title]
  
  [Comprehensive description with full context]
  
  ## Implementation Details
  ### Technical Approach
  [Detailed technical explanation]
  
  ### Components Modified
  - [Component 1]: [specific changes]
  - [Component 2]: [specific changes]
  
  ### Key Decisions
  - [Decision 1]: [rationale]
  - [Decision 2]: [rationale]
  
  ## Testing Strategy
  ✅ Comprehensive visual testing with screenshots
  ✅ Cross-device and cross-browser validation
  ✅ Performance impact assessment
  ✅ Accessibility compliance verification
  
  ## Prior Art Integration
  - [Related scratchpad implementations]
  - [Pattern reuse from previous PRs]
  
  ## Preview Testing Checklist
  - [ ] [Specific test scenario 1]
  - [ ] [Specific test scenario 2]
  - [ ] [Cross-device validation]
  
  Closes #[ISSUE_NUMBER]
  ```

### **Preview Testing Plan**
**Cloud Run Preview URL Testing**:
1. **Desktop Browser Testing**:
   - [ ] Chrome: Core functionality
   - [ ] Firefox: Cross-browser compatibility
   - [ ] Safari: WebKit-specific behavior
   
2. **Mobile Device Testing**:
   - [ ] iPhone: Touch interactions
   - [ ] iPad: Tablet experience
   - [ ] Android: Cross-platform compatibility
   
3. **Feature-Specific Testing**:
   - [ ] [Specific test scenario 1]
   - [ ] [Specific test scenario 2]
   - [ ] [Specific test scenario 3]

## 📊 Success Criteria

### **Functional Requirements**
- [ ] [Requirement 1]
- [ ] [Requirement 2]
- [ ] [Requirement 3]

### **Quality Standards**
- [ ] Code passes all quality gates
- [ ] Visual testing validates design
- [ ] Cross-device compatibility confirmed
- [ ] Performance targets maintained
- [ ] Accessibility compliance verified

### **User Experience**
- [ ] Intuitive interaction patterns
- [ ] Smooth animations (60fps)
- [ ] Professional visual polish
- [ ] Consistent brand experience
- [ ] Mobile-optimized experience

## 🎉 Completion Summary

### **Implementation Results**
**Status**: [Completed / In Progress / Blocked]
**Total Time**: [Actual time taken]
**Quality Gates**: [Pass/Fail status]

### **Deliverables**
- [ ] Feature implementation complete
- [ ] Visual testing validated
- [ ] GitHub PR created: #[PR_NUMBER]
- [ ] Cloud Run preview URL: [URL]
- [ ] Documentation updated

### **Key Achievements**
- [Achievement 1]
- [Achievement 2]
- [Achievement 3]

### **Lessons Learned**
- [Lesson 1]
- [Lesson 2]

### **Follow-up Actions**
- [ ] [Follow-up task 1]
- [ ] [Follow-up task 2]

---
**Workflow Status**: ✅ Complete | 📋 Documentation Archived | 🚀 Live in Production