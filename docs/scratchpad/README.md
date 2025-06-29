# Development Scratchpad System

A structured workspace for capturing development insights, experiments, and planning notes while working with Claude Code.

## 📁 Directory Structure

```
docs/scratchpad/
├── README.md              # This guide
├── investigations/        # Bug investigation and debugging notes
├── experiments/          # Code experiments and prototypes  
├── planning/             # Architecture and feature planning
└── templates/            # Reusable templates for common tasks
```

## 🎯 Purpose

Scratchpads provide a persistent workspace to:
- **Capture ideas** during development sessions
- **Document investigation processes** for future reference
- **Test approaches** before implementing in main codebase
- **Share context** between Claude Code sessions
- **Build knowledge base** of solutions and patterns

## 🚀 Quick Start

### For Bug Investigations
```bash
cp docs/scratchpad/templates/investigation.md docs/scratchpad/investigations/hero-positioning-issue.md
```

### For Feature Planning
```bash
cp docs/scratchpad/templates/feature-planning.md docs/scratchpad/planning/new-blog-system.md
```

### For Code Experiments
```bash
cp docs/scratchpad/templates/experiment.md docs/scratchpad/experiments/css-grid-layout.md
```

## 🔧 Integration with Claude Code

### Session Continuity
- Save research findings in scratchpads between Claude sessions
- Reference previous investigations when similar issues arise
- Build cumulative knowledge base of project patterns

### Problem-Solving Workflow
1. **Create scratchpad** for the specific issue/feature
2. **Document investigation process** as you work
3. **Test solutions** in scratchpad before implementing
4. **Convert findings** to formal documentation or GitHub issues
5. **Archive completed** scratchpads for future reference

### Context Sharing
When starting a new Claude session:
1. Reference relevant scratchpads from previous work
2. Copy key insights to maintain context
3. Update scratchpads with new findings

## 📝 Best Practices

### Naming Conventions
- **investigations/**: `issue-description-YYYY-MM-DD.md`
- **experiments/**: `technology-feature-description.md`  
- **planning/**: `feature-name-architecture.md`

### Content Guidelines
- Use descriptive titles and section headers
- Include timestamps for investigation steps
- Document both successful and failed approaches
- Add links to relevant files and documentation
- Use code blocks for snippets and configurations

### Privacy & Security
- Scratchpads are gitignored by default
- Avoid including sensitive information (API keys, passwords)
- Use placeholder data for examples
- Clean up scratchpads before sharing externally

## 🔗 VS Code Integration

### Recommended Extensions
- **Markdown All in One**: Enhanced markdown editing
- **Code Spell Checker**: Catch typos in documentation
- **GitLens**: Track changes and history
- **Folder Templates**: Quick scratchpad creation

### Workspace Settings
Configure VS Code for optimal scratchpad experience:
- File associations for markdown files
- Snippets for quick template insertion
- Custom file icons for scratchpad organization

## 📊 Example Use Cases

### Recent Success: Hero Positioning Fix
The hero positioning investigation could have been documented as:

```markdown
# Hero Section Positioning Investigation - 2025-06-29

## Problem
"How I Work" page hero text positioned 16px higher than other pages

## Investigation Timeline
14:30 - Initial Puppeteer testing revealed 87px vs 103px positioning
14:45 - CSS audit discovered identical design tokens but different computed styles
15:00 - Root cause: longer description text → taller container → different flexbox centering
15:15 - Solution: justify-content: flex-start + padding-top: 34px

## Lessons Learned
- Design tokens ensure consistency but don't account for content height variations
- Flexbox centering can create positioning issues with variable content
- Puppeteer testing invaluable for precise positioning validation
```

## 🎯 Future Enhancements

- **Template automation**: Scripts to generate scratchpads from templates
- **Integration with GitHub Issues**: Convert scratchpad findings to formal issues
- **Search functionality**: Quick search across all scratchpads
- **Archival system**: Organize completed investigations by project phase

---

*This scratchpad system enhances the Claude Code development workflow by providing structured knowledge capture and context preservation across sessions.*