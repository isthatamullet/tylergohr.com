# Tyler Gohr Portfolio MCP Server - Claude Code Usage Guide

## Quick Start for Claude Code Instances

**Status**: ✅ Ready for immediate use  
**Configuration**: Already configured in `~/.claudecode/mcp.json`  
**Tools Available**: 6 timeout-resistant development tools

## 🚀 Available Tools

### **1. startDevServerMCP**
**Purpose**: Replace timeout-prone `npm run dev` commands

```typescript
// Start development server with intelligent port detection
startDevServerMCP({
  port: 3000,           // Optional: preferred port
  enhanced: true,       // Use enhanced mode
  action: "start",      // start|stop|restart|status
  environment: "auto"   // Auto-detect cloud environment
})

// Common usage patterns:
// - Start server: action="start" 
// - Check status: action="status"
// - Restart stuck server: action="restart"
// - Stop server: action="stop"
```

### **2. executeTestMCP**
**Purpose**: Timeout-resistant test execution with strategy selection

```typescript
// Quick smoke tests (most common)
executeTestMCP({
  testType: "smoke",     // Quick validation (<1min)
  skipVisual: true,      // Skip visual regression
  fastMode: true,        // Ultra-fast mode
  browser: "chromium"    // Browser choice
})

// Other test types:
// - "dev": Component testing (2-3min)
// - "visual": Screenshot generation 
// - "comprehensive": Full test suite
// - "navigation": Navigation testing
// - "accessibility": WCAG compliance
```

### **3. detectActivePortMCP**
**Purpose**: Environment-aware port detection

```typescript
// Detect active servers and environment
detectActivePortMCP({
  scanPorts: true,        // Scan for all active servers
  includeHealth: true,    // Check server health
  preferredPort: 3000,    // Preferred port if available
  timeout: 10000          // Detection timeout (10s)
})

// Returns: Active servers, environment info, recommended ports
```

### **4. validateQualityGatesMCP**
**Purpose**: Comprehensive quality validation

```typescript
// Full quality validation (replaces npm run validate)
validateQualityGatesMCP({
  checks: ["typescript", "eslint", "build", "bundle"],
  parallel: true,         // Run checks in parallel
  failFast: false,        // Continue even if one check fails
  timeout: 300000         // 5 minute timeout for full validation
})

// Available checks:
// - "typescript": TypeScript compilation
// - "eslint": Code quality and style
// - "build": Production build test
// - "bundle": Bundle size validation (<6MB)
```

### **5. handleFileOperationMCP**
**Purpose**: Safe file operations with protection validation

```typescript
// Read protected files safely
handleFileOperationMCP({
  operation: "read",
  path: "package.json",
  validateProtection: true,  // Check protection level
  createBackup: false        // No backup needed for reads
})

// Write with protection validation
handleFileOperationMCP({
  operation: "write", 
  path: "src/app/2/styles/brand-tokens.css",
  content: "/* updated styles */",
  validateProtection: true,  // Will warn about protected file
  createBackup: true         // Create backup before writing
})
```

### **6. queryDocumentationMCP**
**Purpose**: Intelligent project documentation access

```typescript
// Query development workflows
queryDocumentationMCP({
  query: "how to run tests",
  category: "development",    // development|testing|deployment|hooks
  context: "2",              // main|2|mixed (development context)
  includeCommands: true      // Include relevant commands
})

// Common queries:
// - "testing workflows"
// - "deployment process" 
// - "hook system usage"
// - "development setup"
// - "troubleshooting"
```

## 🎯 Common Usage Patterns

### **Replace Timeout-Prone Commands**

| Instead of | Use |
|------------|-----|
| `npm run dev` | `startDevServerMCP({action: "start"})` |
| `npm run test:e2e:smoke` | `executeTestMCP({testType: "smoke"})` |
| `npm run validate` | `validateQualityGatesMCP({checks: ["typescript", "eslint", "build"]})` |
| Manual port detection | `detectActivePortMCP({scanPorts: true})` |

### **Development Workflow Example**

```typescript
// 1. Check if server is already running
const portStatus = await detectActivePortMCP({scanPorts: true, includeHealth: true});

// 2. Start server if needed
if (!portStatus.activeServers.length) {
  await startDevServerMCP({action: "start", enhanced: true});
}

// 3. Run quick validation
await executeTestMCP({testType: "smoke", fastMode: true});

// 4. Quality check before committing
await validateQualityGatesMCP({checks: ["typescript", "eslint"]});
```

### **Environment Detection**

The MCP server automatically detects and adapts to:
- **Local**: `http://localhost:3000`
- **Google Cloud Workstations**: `https://3000-tylergohr.cluster-[region].cloudworkstations.dev`
- **GitHub Codespaces**: `https://[codespace]-3000.preview.app.github.dev` 
- **Gitpod**: `https://3000-[workspace].[cluster]`

## ⚡ Performance Benefits

### **Timeout Prevention**
- **Before**: 2-minute timeout failures on `npm run dev` and `npm run test:e2e:smoke`
- **After**: 30-60 second reliable execution with intelligent error handling

### **Cross-Session Consistency**
- **Before**: Environment setup required for each Claude Code session
- **After**: MCP server maintains context across sessions

### **Intelligent Error Handling**
- **Port Conflicts**: Automatic detection and resolution
- **Environment Issues**: Clear actionable error messages
- **Health Validation**: Server responsiveness checks before proceeding

## 🔄 Integration with Existing System

### **Parallel Operation**
- **Hooks System**: Continues operating normally
- **Enhanced Commands**: Still provide sub-agent recommendations
- **Zero Disruption**: Both systems coexist without conflicts

### **Migration Strategy**
- **Gradual Adoption**: Start with most timeout-prone operations
- **Choice Architecture**: Use MCP tools or enhanced commands based on preference
- **Fallback Safety**: Enhanced commands provide backup if MCP server unavailable

## 🛠️ Troubleshooting

### **MCP Server Not Available**
```bash
# Check MCP server health
node /home/user/tylergohr.com/mcp-server/dist/index.js health

# Verify Claude Code configuration
cat ~/.claudecode/mcp.json
```

### **Tool Execution Issues**
- Check project context: Ensure you're in the correct directory
- Verify environment: Cloud environments may need different URLs
- Check permissions: Ensure write access for file operations

### **Fallback to Enhanced Commands**
If MCP tools are unavailable, use existing enhanced commands:
- `npm run dev:enhanced`
- `npm run test:e2e:smoke:enhanced`

## 📚 Documentation References

- **Complete Implementation**: `@docs/mcp/phase1-implementation-complete.md`
- **Migration Strategy**: `@docs/mcp/migration-strategy.md`
- **Enhanced Capabilities**: `@docs/mcp/enhanced-capabilities-specification.md`
- **Troubleshooting**: `@docs/TROUBLESHOOTING.md`

---

**Ready for Production Use**: Claude Code instances can immediately use these tools for reliable, timeout-resistant development workflows.