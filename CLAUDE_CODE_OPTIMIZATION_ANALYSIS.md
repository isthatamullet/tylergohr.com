# Claude Code Setup Optimization Analysis

## Context & Goals

### What We've Accomplished (July 21, 2025)

This project has undergone **massive simplification** to eliminate over-engineering and focus on what actually works:

#### **Hooks System Simplification**
- **Before**: 7,766+ lines of complex orchestrator automation
- **After**: 331 lines of simple file protection
- **Archived**: `/archive/over-engineered-orchestrator/`, `/archive/over-engineered-port-management/`, etc.

#### **MCP Server Experiment Removal**
- **Before**: 13,000+ line custom MCP server trying to solve VS Code preview limitations
- **After**: 3 standard MCP servers (puppeteer, context7, sequential-thinking)
- **Archived**: `/archive/mcp-automation-experiment-2025/`

#### **Total Complexity Reduction**
- **~20,000+ lines of automation** archived
- **40+ npm script variants** removed from package.json
- **Simple development workflow** restored

### Current Goal
Optimize the remaining Claude Code configuration and environment setup to maintain the same simplicity philosophy.

---

## Current Active Claude Code Setup

### ✅ **Working Systems (Keep These)**

#### **1. MCP Servers (3 Standard Servers)**
```json
// .mcp.json & .claudecode/mcp.json
{
  "mcpServers": {
    "puppeteer": { /* Browser automation and screenshots */ },
    "context7": { /* Documentation lookup */ },
    "sequential-thinking": { /* Structured thinking tool */ }
  }
}
```

#### **2. Simple File Protection Hook**
```json
// ~/.claude/settings.json
{
  "model": "sonnet",
  "hooks": {
    "PreToolUse": [{
      "matcher": "Edit|Write|MultiEdit",
      "hooks": [{"command": "/home/user/tylergohr.com/scripts/hooks/lib/file-protection.sh"}]
    }]
  }
}
```

**Protected Files**: package.json, next.config.js, brand-tokens.css, CLAUDE.md, tsconfig.json, playwright.config.ts

#### **3. Permission Settings**
```json
// ~/.claude/settings.local.json
{
  "permissions": {
    "allow": [
      "Bash(gcloud compute disks list:*)",
      "Bash(gcloud workstations clusters list:*)", 
      "Bash(gcloud compute instances list:*)",
      "WebFetch(domain:github.com)",
      "mcp__context7__get-library-docs",
      "mcp__puppeteer__puppeteer_navigate"
    ],
    "deny": []
  }
}
```

---

## 🔍 **Areas for Optimization Analysis**

### **1. Remaining Scripts (29 files - Potential Cleanup)**

**Location**: `/home/user/tylergohr.com/scripts/`

**Questionable Scripts Found**:
- `validate-phase2-implementation.sh`
- `phase3-completion-validation.sh`
- `update-hooks-for-simplified.sh`
- `subagent-integration.sh`
- `sync-systems.sh`
- `cost-monitor.sh`
- `monitor-preview.sh`
- Plus 22 others...

**Analysis Needed**:
- Which scripts are from previous automation experiments?
- Which scripts are actually used vs referenced in documentation?
- Are any scripts calling archived MCP servers or orchestrator systems?
- Can we archive more complexity and keep only essential scripts?

### **2. VS Code Configuration (Potentially Over-Configured)**

**Files to Analyze**:
- `.vscode/tasks.json` (8,880 bytes - quite large)
- `.vscode/settings.json` (4,493 bytes)
- `.vscode/snippets.code-snippets` (5,541 bytes)

**Questions**:
- Does `tasks.json` contain references to archived MCP systems?
- Are there complex automation tasks that could be simplified?
- Are all the configured tasks actually used?
- Can we achieve the same functionality with simpler configuration?

### **3. Claude Configuration Directories**

**Directories Found**:
```
~/.claude/
├── hooks/logs/           # Hook execution logs
├── projects/             # Project-specific settings (5 subdirs)
├── todos/                # Todo list storage
├── backups/              # Configuration backups
├── shell-snapshots/      # Shell state snapshots
├── ide/                  # IDE integration files
├── local/                # Local configuration
└── statsig/              # Analytics/stats
```

**Analysis Needed**:
- Are there old logs or configurations referencing archived systems?
- Can we clean up unused project configurations?
- Are all these directories providing value or just accumulating cruft?

### **4. Permission Settings Optimization**

**Current Permissions**:
- 6 allowed operations
- Google Cloud commands (gcloud compute, workstations)
- GitHub WebFetch access
- MCP server access

**Questions**:
- Are all these permissions still needed?
- Are there missing permissions for current workflow?
- Can we simplify the permission model?

---

## 🎯 **Optimization Tasks for New Claude Session**

### **Task 1: Script Audit & Cleanup**
```bash
# Analyze all remaining scripts
find /home/user/tylergohr.com/scripts -name "*.sh" | grep -v archive

# Questions to answer:
# - Which scripts are referenced in current documentation?
# - Which scripts are called by current npm commands?
# - Which scripts reference archived systems?
# - Which scripts haven't been modified in months?
```

### **Task 2: VS Code Configuration Analysis**
```bash
# Examine VS Code configuration files
/home/user/tylergohr.com/.vscode/tasks.json
/home/user/tylergohr.com/.vscode/settings.json

# Questions to answer:
# - Are there MCP-related tasks that should be removed?
# - Are there complex automation tasks that could be simplified?
# - Can task configuration be reduced while maintaining functionality?
```

### **Task 3: Claude Directory Cleanup**
```bash
# Analyze Claude configuration directories
~/.claude/hooks/logs/
~/.claude/projects/
~/.claude/todos/

# Questions to answer:
# - Can old logs be cleaned up?
# - Are project configurations still relevant?
# - Can we simplify the directory structure?
```

### **Task 4: Permission Review**
```bash
# Review current permission settings
~/.claude/settings.local.json

# Questions to answer:
# - Are all permissions still needed for current workflow?
# - Are there missing permissions that would improve workflow?
# - Can permission model be simplified?
```

---

## 🎯 **Success Criteria**

Following the same philosophy that led to archiving 20,000+ lines of automation:

### **Goals**:
1. **Maintain functionality** while reducing configuration complexity
2. **Archive outdated scripts** from previous automation experiments
3. **Simplify VS Code configuration** to essential tasks only
4. **Clean up Claude directories** of unused artifacts
5. **Optimize permissions** for current simplified workflow

### **Red Flags to Watch For**:
- Scripts with "phase", "mcp", "orchestrator" in their names
- Complex automation for simple tasks
- References to archived systems
- Configuration files larger than necessary
- Unused directories accumulating cruft

### **Expected Outcome**:
A **clean, simple Claude Code setup** that matches the simplified development workflow - fast, reliable, and easy to understand.

---

## 📋 **Instructions for New Claude Session**

1. **Start with Script Audit** - Examine the 29 remaining scripts and identify candidates for archival
2. **Analyze VS Code Configuration** - Look for over-configuration and MCP references
3. **Review Claude Directories** - Clean up old logs and unused configurations
4. **Optimize Permissions** - Ensure permission settings match current simplified workflow
5. **Test Everything** - Verify that essential functionality still works after cleanup

**Remember**: The goal is **simplicity and reliability** over complex automation. If a configuration or script isn't clearly providing value, it's a candidate for archival.

---

**Created**: July 21, 2025  
**Context**: Post-simplification optimization of Claude Code environment  
**Goal**: Extend simplification philosophy to environment configuration