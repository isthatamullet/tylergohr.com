# Troubleshooting Guide - Tyler Gohr Portfolio MCP Server

> Common issues, solutions, and diagnostic procedures for the MCP server

## Overview

This guide provides comprehensive troubleshooting for the Tyler Gohr Portfolio MCP Server v1.4.0. Issues are organized by category with step-by-step resolution procedures, diagnostic commands, and prevention strategies.

## Table of Contents

- [Quick Diagnostic Commands](#quick-diagnostic-commands)
- [Server Startup Issues](#server-startup-issues)
- [Tool Execution Issues](#tool-execution-issues)
- [Development Environment Issues](#development-environment-issues)
- [Performance Issues](#performance-issues)
- [Cross-System Coordination Issues](#cross-system-coordination-issues)
- [Emergency Recovery Issues](#emergency-recovery-issues)
- [Cloud Environment Issues](#cloud-environment-issues)

---

## Quick Diagnostic Commands

### Essential Health Checks

```bash
# 1. MCP Server Health Check
cd mcp-server && npm run test

# 2. Build Validation
npm run build

# 3. Project Context Check
node dist/index.js health

# 4. System Health Check (if server is running)
# Use checkSystemHealthMCP tool via Claude Code

# 5. Environment Validation
echo "Node: $(node --version)"
echo "npm: $(npm --version)"
echo "TypeScript: $(npx tsc --version)"
```

### Common Status Indicators

| Status | Meaning | Action Required |
|--------|---------|-----------------|
| ✅ `Server initialized successfully` | MCP server healthy | Continue development |
| ❌ `Server initialization failed` | Critical startup issue | Check Node.js version, dependencies |
| ⚠️ `Tool execution timeout` | Tool performance issue | Check system resources, network |
| 🔄 `Fallback strategy activated` | Cross-system coordination | Monitor and investigate primary system |

---

## Server Startup Issues

### Issue 1: MCP Server Won't Start

**Symptoms**:
```bash
npm run test
# Error: Cannot find module 'dist/index.js'
# or
# TypeError: Cannot read property...
```

**Diagnosis**:
```bash
# Check if TypeScript compiled successfully
ls -la dist/
cat dist/index.js | head -10

# Check for TypeScript errors
npx tsc --noEmit
```

**Solutions**:

#### Solution 1: Clean Build
```bash
# Remove build artifacts
rm -rf dist node_modules

# Clean install and build
npm ci
npm run build

# Test server
npm run test
```

#### Solution 2: TypeScript Configuration
```bash
# Check TypeScript configuration
cat tsconfig.json

# Verify TypeScript version compatibility
npx tsc --version  # Should be 5.0+
```

#### Solution 3: Node.js Version
```bash
# Check Node.js version
node --version  # Should be 18.0+

# If version is incorrect, update Node.js
# Then rebuild
npm ci && npm run build
```

---

### Issue 2: Port Conflicts During Startup

**Symptoms**:
```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Diagnosis**:
```bash
# Check what's using the port
lsof -i :3000
ps aux | grep -E "next-server|npm run dev"
```

**Solutions**:

#### Solution 1: Use MCP Port Detection
```typescript
// Use intelligent port detection
await detectActivePortMCP({
  includeHealthCheck: true,
  portRange: [3000, 4000],
  cloudEnvironment: true
});
```

#### Solution 2: Manual Port Management
```bash
# Kill existing processes
pkill -f "next-server|npm run dev"

# Start with specific port
PORT=3001 npm start
```

#### Solution 3: Environment Reset
```bash
# Clear environment variables
unset ACTIVE_DEV_PORT ACTIVE_DEV_URL

# Restart with fresh detection
npm run test
```

---

### Issue 3: Permission Errors

**Symptoms**:
```bash
Error: EACCES: permission denied, open '/path/to/file'
```

**Solutions**:
```bash
# Fix file permissions
chmod +x dist/index.js

# Check ownership
ls -la dist/

# Rebuild with correct permissions
npm run build
```

---

## Tool Execution Issues

### Issue 4: Tool Timeouts

**Symptoms**:
```bash
Tool execution timeout after 120000ms
Tool 'startDevServerMCP' failed with timeout
```

**Diagnosis**:
```typescript
// Check system health
await checkSystemHealthMCP({
  includeInsights: true,
  includeRecommendations: true,
  format: "detailed"
});
```

**Solutions**:

#### Solution 1: Use Emergency Recovery
```typescript
// Detect timeout triggers
await detectEmergencyTriggersMCP({
  includeMinor: false,
  checkSystems: ["mcp", "hooks", "build", "server"],
  format: "actionable"
});

// Execute recovery if needed
await executeEmergencyRollbackMCP({
  triggerType: "system-failure",
  dryRun: false,
  confirmExecution: true
});
```

#### Solution 2: Fallback Strategy
```typescript
// Use cross-system coordination
await executeFallbackStrategyMCP({
  trigger: "timeout",
  fromSystem: "mcp",
  operation: "development-server",
  preserveState: true
});
```

#### Solution 3: Resource Optimization
```bash
# Check system resources
free -h
df -h
ps aux --sort=-%mem | head -10

# Close unnecessary processes
# Increase timeout for resource-constrained environments
```

---

### Issue 5: Tool Parameter Validation Errors

**Symptoms**:
```bash
Error: Invalid parameter 'context' - expected "main" | "2" | "mixed"
Tool schema validation failed
```

**Solutions**:

#### Check Parameter Format
```typescript
// Correct parameter usage
await generateComponentMCP({
  name: "ComponentName",     // Required: string
  type: "preview",          // Required: "preview" | "detail" | "ui" | "layout"
  context: "2",             // Required: "2" | "main"
  features: ["responsive"], // Optional: string[]
  includeTests: true,       // Optional: boolean
  includeStyles: true       // Optional: boolean
});
```

#### Validate Project Context
```typescript
// Check current project context
const context = await getProjectContext();
console.log("Available context:", context.developmentContext);

// Use detected context
await generateComponentMCP({
  name: "ComponentName",
  type: "preview",
  context: context.developmentContext, // Use detected context
});
```

---

### Issue 6: File Operation Failures

**Symptoms**:
```bash
Error: ENOENT: no such file or directory
Protected file modification blocked
```

**Solutions**:

#### Solution 1: File Path Validation
```typescript
// Use absolute paths
await handleFileOperationMCP({
  operation: "write",
  filePath: "/full/path/to/file.tsx", // Use absolute path
  content: "content",
  createBackup: true
});
```

#### Solution 2: Protected File Override
```typescript
// Override protection carefully
await handleFileOperationMCP({
  operation: "write",
  filePath: "src/app/2/styles/brand-tokens.css",
  content: "new content",
  createBackup: true,
  overrideProtection: true // Use with caution
});
```

#### Solution 3: Directory Creation
```bash
# Ensure target directory exists
mkdir -p src/app/2/components/NewComponent

# Then use MCP tool
```

---

## Development Environment Issues

### Issue 7: Cloud Environment Detection Failures

**Symptoms**:
```bash
Cloud environment not detected
URL construction failed for cloud workstation
```

**Diagnosis**:
```bash
# Check environment variables
env | grep -E "(CLOUD|WORKSPACE|CODESPACE|GITPOD)"

# Test port detection
cd /home/user/tylergohr.com && ./scripts/detect-active-port.sh
```

**Solutions**:

#### Solution 1: Manual Cloud Configuration
```typescript
// Force cloud environment detection
await startDevServerMCP({
  preferredPort: 3000,
  cloudEnvironment: true, // Force cloud mode
  enableHotReload: true
});

await detectActivePortMCP({
  includeHealthCheck: true,
  cloudEnvironment: true // Force cloud URL construction
});
```

#### Solution 2: Environment Variable Setup
```bash
# Set cloud environment indicators
export CLOUD_ENVIRONMENT=true
export ACTIVE_DEV_PORT=3000

# Test MCP server
npm run test
```

---

### Issue 8: Context Detection Problems

**Symptoms**:
```bash
Development context: "mixed" when expecting "2"
Component generation fails with wrong context
```

**Solutions**:

#### Force Context Detection
```typescript
// Override context detection
await generateComponentMCP({
  name: "ComponentName",
  type: "preview",
  context: "2", // Explicitly specify context
  features: ["glassmorphism"]
});
```

#### Verify Working Directory
```bash
# Check current directory
pwd
# Should be in /home/user/tylergohr.com for proper context detection

# Navigate to correct directory
cd /home/user/tylergohr.com
```

---

## Performance Issues

### Issue 9: Slow Tool Response Times

**Symptoms**:
```bash
Tool execution taking >30 seconds
Performance degradation over time
```

**Diagnosis**:
```typescript
// Monitor performance
await monitorPerformanceMCP({
  includeWebVitals: true,
  includeBundleAnalysis: true,
  includeRecommendations: true,
  monitoringDuration: 30
});

// Check system coordination
await getCoordinationInsightsMCP({
  includePerformance: true,
  includeOptimizations: true,
  analysisDepth: "comprehensive"
});
```

**Solutions**:

#### Solution 1: Resource Optimization
```bash
# Check system resources
htop
# or
top

# Free memory if needed
# Close unnecessary applications
```

#### Solution 2: Tool-Specific Optimization
```typescript
// Use fast strategies for development
await executeTestMCP({
  testType: "smoke",
  strategy: "fast",        // Use fast strategy
  skipVisual: true,        // Skip visual tests
  timeout: 60000          // Reduce timeout
});
```

#### Solution 3: Cross-System Fallback
```typescript
// Use intelligent system selection
await planCrossSystemOperationMCP({
  operation: "testing",
  preferredSystem: "auto", // Let system choose optimal
  enableFallback: true,
  includeMonitoring: true
});
```

---

### Issue 10: Memory Usage Issues

**Symptoms**:
```bash
JavaScript heap out of memory
Process killed due to memory usage
```

**Solutions**:

#### Increase Memory Limit
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max_old_space_size=4096" npm run test

# For development
NODE_OPTIONS="--max_old_space_size=4096" npm start
```

#### Optimize Tool Usage
```typescript
// Use memory-efficient strategies
await executeTestMCP({
  testType: "smoke",      // Lighter testing
  strategy: "fast",       // Fast execution
  skipVisual: true        // Reduce memory usage
});
```

---

## Cross-System Coordination Issues

### Issue 11: Hooks System Conflicts

**Symptoms**:
```bash
Hook system timeout during MCP operation
Cross-system coordination failed
```

**Diagnosis**:
```typescript
// Check system health
await checkSystemHealthMCP({
  includeInsights: true,
  includeRecommendations: true,
  format: "operational"
});
```

**Solutions**:

#### Solution 1: System Health Recovery
```bash
# Reset hooks system
./scripts/hooks/uninstall-hooks.sh
./scripts/hooks/install-hooks.sh

# Test coordination
```

#### Solution 2: Fallback Execution
```typescript
// Use MCP fallback for hooks timeout
await executeFallbackStrategyMCP({
  trigger: "timeout",
  fromSystem: "hooks",
  operation: "test-execution",
  preserveState: true
});
```

#### Solution 3: System Coordination Analysis
```typescript
// Get coordination insights
await getCoordinationInsightsMCP({
  includePerformance: true,
  includeOptimizations: true,
  includeAlternatives: true,
  analysisDepth: "comprehensive"
});
```

---

### Issue 12: State Preservation Failures

**Symptoms**:
```bash
State lost during system fallback
Work in progress not preserved
```

**Solutions**:

#### Enable State Preservation
```typescript
// Always preserve state during fallbacks
await executeFallbackStrategyMCP({
  trigger: "failure",
  fromSystem: "hooks",
  operation: "development",
  preserveState: true  // Always preserve state
});
```

#### Manual State Backup
```bash
# Create manual backup before risky operations
git stash push -m "Pre-MCP-operation backup"

# Run MCP operation

# Restore if needed
git stash pop
```

---

## Emergency Recovery Issues

### Issue 13: Emergency Detection False Positives

**Symptoms**:
```bash
Emergency triggers detected when system is healthy
False alarms causing unnecessary rollbacks
```

**Solutions**:

#### Adjust Detection Sensitivity
```typescript
// Reduce sensitivity for stable environments
await detectEmergencyTriggersMCP({
  includeMinor: false,     // Exclude minor issues
  checkSystems: ["mcp"],   // Check fewer systems
  format: "summary"        // Less detailed analysis
});
```

#### Manual Validation
```typescript
// Verify triggers before acting
const triggers = await detectEmergencyTriggersMCP({
  format: "detailed"
});

// Only act on critical triggers
if (triggers.triggerCount > 0 && triggers.highestSeverity === "critical") {
  // Proceed with emergency response
}
```

---

### Issue 14: Rollback Strategy Failures

**Symptoms**:
```bash
Rollback execution failed
System not restored to working state
```

**Solutions**:

#### Solution 1: Use Dry Run First
```typescript
// Always test rollback strategy
const dryRun = await executeEmergencyRollbackMCP({
  triggerType: "system-failure",
  dryRun: true,           // Test first
  confirmExecution: false
});

// Only execute if dry run successful
if (dryRun.status === "dry-run") {
  await executeEmergencyRollbackMCP({
    triggerType: "system-failure",
    dryRun: false,
    confirmExecution: true
  });
}
```

#### Solution 2: Alternative Strategies
```typescript
// Generate multiple strategies
const strategies = await generateRollbackStrategyMCP({
  triggerType: "system-failure",
  severity: "high",
  includeAlternatives: true // Get multiple options
});

// Try alternative if primary fails
```

#### Solution 3: Manual Recovery
```bash
# Manual emergency recovery
pkill -f "next-server|npm run dev"
rm -rf node_modules .next
npm ci
npm run build
npm run dev
```

---

## Cloud Environment Issues

### Issue 15: Google Cloud Workstations URL Issues

**Symptoms**:
```bash
URL construction failed for cloud workstation
Cannot access development server in cloud environment
```

**Solutions**:

#### Verify Cloud Environment
```bash
# Check cloud environment variables
env | grep -i cloud

# Check workspace URL pattern
echo $CLOUDSHELL_GCP_PROJECT
```

#### Force Cloud URL Construction
```typescript
// Manual cloud URL construction
await detectActivePortMCP({
  includeHealthCheck: true,
  cloudEnvironment: true, // Force cloud mode
  portRange: [3000, 3000] // Specific port
});
```

---

### Issue 16: Codespaces/Gitpod Integration Issues

**Symptoms**:
```bash
Port forwarding not working
Development server not accessible
```

**Solutions**:

#### Check Port Forwarding
```bash
# In Codespaces/Gitpod, check port forwarding settings
# Ensure port 3000 is public/forwarded

# Test connectivity
curl -I http://localhost:3000
```

#### Use Alternative Ports
```typescript
// Try different ports
await startDevServerMCP({
  preferredPort: 3001, // Alternative port
  cloudEnvironment: true,
  enableHotReload: true
});
```

---

## General Troubleshooting Strategies

### Escalation Path

1. **Quick Fixes** (1-2 minutes)
   - Restart MCP server: `npm run test`
   - Clear environment: `unset ACTIVE_DEV_PORT ACTIVE_DEV_URL`
   - Kill conflicting processes: `pkill -f "next-server"`

2. **Standard Troubleshooting** (5-10 minutes)
   - Clean build: `rm -rf dist && npm run build`
   - System health check: Use `checkSystemHealthMCP`
   - Environment validation: Check Node.js version, dependencies

3. **Deep Diagnosis** (15-30 minutes)
   - Emergency trigger analysis: Use `detectEmergencyTriggersMCP`
   - Cross-system coordination check: Use `getCoordinationInsightsMCP`
   - Performance analysis: Use `monitorPerformanceMCP`

4. **Emergency Recovery** (30+ minutes)
   - Use emergency rollback tools
   - Manual system restoration
   - Fresh environment setup

### Prevention Strategies

#### Regular Health Monitoring
```typescript
// Daily health check routine
await checkSystemHealthMCP({
  includeInsights: true,
  includeRecommendations: true,
  format: "summary"
});

await detectEmergencyTriggersMCP({
  includeMinor: true,
  checkSystems: ["mcp", "hooks", "build", "server"],
  format: "summary"
});
```

#### Proactive Performance Monitoring
```typescript
// Regular performance validation
await monitorPerformanceMCP({
  includeWebVitals: true,
  includeBundleAnalysis: true,
  includeRecommendations: true
});
```

#### Backup and Recovery Preparation
```bash
# Regular git commits
git add . && git commit -m "WIP: Before MCP operations"

# Environment documentation
echo "Working environment:" > environment.log
node --version >> environment.log
npm --version >> environment.log
env | grep -E "(PORT|URL)" >> environment.log
```

---

## Diagnostic Scripts

### Health Check Script
```bash
#!/bin/bash
# mcp-health-check.sh

echo "=== MCP Server Health Check ==="

echo "1. Node.js version:"
node --version

echo "2. MCP Server build status:"
cd mcp-server && npm run build

echo "3. MCP Server test:"
npm run test

echo "4. Project context:"
node dist/index.js health

echo "5. Environment variables:"
env | grep -E "(ACTIVE_DEV|NODE_ENV|PORT)"

echo "=== Health Check Complete ==="
```

### Emergency Recovery Script
```bash
#!/bin/bash
# mcp-emergency-recovery.sh

echo "=== Emergency Recovery ==="

echo "1. Killing development processes..."
pkill -f "next-server|npm run dev"

echo "2. Clearing environment..."
unset ACTIVE_DEV_PORT ACTIVE_DEV_URL

echo "3. Clean build..."
cd mcp-server
rm -rf dist node_modules
npm ci
npm run build

echo "4. Testing server..."
npm run test

echo "=== Recovery Complete ==="
```

---

## Getting Help

### Information to Collect

When reporting issues, include:

1. **System Information**:
   ```bash
   node --version
   npm --version
   uname -a
   ```

2. **MCP Server Status**:
   ```bash
   cd mcp-server && npm run test
   ```

3. **Error Messages**: Full error output and stack traces

4. **Environment**: Local, Cloud Workstations, Codespaces, Gitpod

5. **Recent Changes**: What was working before the issue occurred

### Log Analysis

```bash
# Check MCP server logs
cd mcp-server && npm run test 2>&1 | tee mcp-debug.log

# Check system logs for Node.js issues
journalctl -u node --since "1 hour ago"

# Check development server logs
ps aux | grep -E "next-server|npm run dev"
```

---

**Tyler Gohr Portfolio MCP Server v1.4.0** - Comprehensive troubleshooting for enterprise development reliability.