# Documentation Restructure Plan - January 6, 2025

## Overview

This document outlines the plan to create a comprehensive, up-to-date documentation structure for the Tyler Gohr Portfolio project. The goal is to replace outdated documentation with focused, concise .md files that accurately reflect the current state of the project and provide clear guidance for Claude Code instances.

## Current Documentation Issues

### **Outdated Files Identified**
- `scripts/README.md` - 90% outdated, missing entire hooks system
- `docs/TESTING-GUIDE.md` - 70% outdated, contains removed Jest references
- `docs/DEPLOYMENT.md` - 40% outdated, missing /2 redesign deployment info
- Multiple other files with stale information

### **Missing Documentation Areas**
- Claude Code hooks system (comprehensive automation)
- Puppeteer screenshot workflows
- Sub-agent integration and timeout prevention
- /2 redesign specific development patterns
- Fast development testing workflows
- Port detection and cloud environment handling

## New Documentation Structure

### **8 Core Documentation Files to Create**

#### **1. `docs/HOOKS.md` - Claude Code Hooks System**
**Purpose**: Complete reference for the sophisticated hooks automation system
**Contents**:
- Hook installation and configuration
- Pre/Post tool use workflows
- Sub-agent integration patterns
- Timeout prevention strategies
- File protection rules
- Performance monitoring integration
- Hook troubleshooting and debugging

#### **2. `docs/TESTING.md` - Comprehensive Testing Workflows**
**Purpose**: All testing approaches consolidated in one authoritative guide
**Contents**:
- Playwright-only approach (current standard)
- Puppeteer screenshot workflows and integration
- Fast development testing (`test:e2e:smoke`, `test:e2e:dev`)
- Claude visual review workflows (`quick-screenshots.spec.ts`)
- Cross-browser testing strategies
- Performance testing (Core Web Vitals)
- Accessibility testing (WCAG 2.1 AA)
- Testing troubleshooting patterns

#### **3. `docs/DEVELOPMENT.md` - Daily Development Workflows**
**Purpose**: Efficient development patterns for /2 redesign work
**Contents**:
- /2 redesign development patterns and context switching
- Component development within `/2` architecture
- Brand token usage and design system integration
- Port detection and cloud environment compatibility
- VS Code tasks integration and automation
- Quality gates and validation workflows
- Development troubleshooting

#### **4. `docs/ARCHITECTURE.md` - Project Structure & /2 Redesign**
**Purpose**: Technical architecture and /2 redesign implementation
**Contents**:
- /2 redesign vs main portfolio architecture comparison
- Component organization and file structure patterns
- Route structure and navigation system
- Preview/detail page patterns and relationships
- Brand tokens system and usage
- Performance optimization strategies
- Integration patterns between main and /2 routes

#### **5. `docs/DEPLOYMENT.md` - Infrastructure & Deployment**
**Purpose**: Production deployment and infrastructure management
**Contents**:
- Google Cloud Run deployment for both main and /2 routes
- CI/CD pipeline optimization and fast-track deployment
- Preview URL testing and validation
- Environment management (local, cloud workstations, production)
- Performance monitoring and alerting
- Security configuration and best practices

#### **6. `docs/CLAUDE-WORKFLOWS.md` - Claude Code Integration Patterns**
**Purpose**: How Claude Code instances should work optimally with this project
**Contents**:
- Agent tool usage patterns and best practices
- Sub-agent delegation strategies for complex tasks
- Timeout prevention recognition and response
- File protection awareness and override patterns
- Context switching between main portfolio and /2 development
- Priority alert recognition and response patterns
- Decision matrix for tool selection

#### **7. `docs/COMMANDS.md` - Quick Command Reference**
**Purpose**: Essential commands for daily development and troubleshooting
**Contents**:
- npm script quick reference with usage scenarios
- Testing command patterns for different workflows
- Hook management and debugging commands
- Port detection and environment setup commands
- Quality gate and validation commands
- Troubleshooting command sequences
- Environment variable management

#### **8. `docs/TROUBLESHOOTING.md` - Common Issues & Solutions**
**Purpose**: Rapid problem resolution for development and deployment issues
**Contents**:
- Port conflicts and dynamic port detection issues
- Test timeouts and environment setup problems
- Hook system failures and debugging
- Screenshot generation and visual testing issues
- Development server and cloud environment problems
- Performance debugging and optimization
- CI/CD pipeline troubleshooting

## Implementation Strategy

### **Phase 1: Content Creation**
1. **Extract current information** from existing CLAUDE.md and project files
2. **Validate accuracy** against current project state and npm scripts
3. **Add missing information** based on recent project developments
4. **Ensure conciseness** - focus on actionable, essential information
5. **Test accuracy** with real development workflows

### **Phase 2: Integration**
1. **Update CLAUDE.md** to reference new documentation structure
2. **Create clear navigation** between related documentation files
3. **Validate cross-references** and ensure no broken links
4. **Test with Claude Code instances** to ensure usability

### **Phase 3: Maintenance**
1. **Establish update patterns** for keeping documentation current
2. **Link to development workflows** so updates happen naturally
3. **Regular validation** against project changes and npm script updates

## Benefits of New Structure

### **For Claude Code Instances**
- **Focused context** - each file covers one domain clearly
- **Current information** - no outdated commands or approaches
- **Clear boundaries** - know exactly which file contains needed information
- **Reduced confusion** - no mixed or conflicting information

### **For Development Workflow**
- **Role-based documentation** - different files for different development tasks
- **Scalable maintenance** - easy to update individual areas without affecting others
- **Comprehensive coverage** - complete project coverage without overlap
- **Efficient reference** - quick access to specific information needed

## File Exclusions

**Not creating new versions of**:
- `STYLE-GUIDE.md` - Very outdated and design system is stable
- Phase-specific documentation - Temporary implementation tracking
- Investigation files - Specific problem-solving documents
- Archive documentation - Historical reference only

## Success Criteria

### **Documentation Quality**
- ✅ All commands in documentation work with current project setup
- ✅ No references to removed technologies (Jest, etc.)
- ✅ Clear, actionable guidance for common development tasks
- ✅ Accurate reflection of current hooks system and automation

### **Claude Code Integration**
- ✅ Claude Code instances can efficiently find needed information
- ✅ Clear patterns for complex task delegation and timeout prevention
- ✅ Accurate file protection and development workflow guidance
- ✅ Effective context switching between main and /2 development

### **Developer Experience**
- ✅ Faster onboarding for new development sessions
- ✅ Efficient troubleshooting with clear solution paths
- ✅ Reduced context switching between multiple information sources
- ✅ Reliable reference for testing, deployment, and development workflows

## Timeline

**Target completion**: Within current development session
**Priority order**: TESTING.md → HOOKS.md → DEVELOPMENT.md → others
**Validation method**: Test each file with actual development workflows

---

**Created**: January 6, 2025  
**Status**: Planning Phase  
**Next Action**: Begin with TESTING.md creation and validation