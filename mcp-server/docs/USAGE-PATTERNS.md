# Usage Patterns - Tyler Gohr Portfolio MCP Server

> Common development workflows and tool combinations for maximum efficiency

## Overview

This guide provides practical patterns for using the Tyler Gohr Portfolio MCP Server in real development scenarios. Each pattern includes tool combinations, example code, and best practices for enterprise development workflows.

## Table of Contents

- [Daily Development Patterns](#daily-development-patterns)
- [Component Development Patterns](#component-development-patterns)
- [Testing & Quality Patterns](#testing--quality-patterns)
- [Performance Optimization Patterns](#performance-optimization-patterns)
- [Emergency Recovery Patterns](#emergency-recovery-patterns)
- [Advanced Integration Patterns](#advanced-integration-patterns)

---

## Daily Development Patterns

### Pattern 1: Morning Development Startup

**Scenario**: Starting a new development session with environment validation and health checks.

```typescript
// 1. Check system health
const systemHealth = await checkSystemHealthMCP({
  includeInsights: true,
  includeRecommendations: true,
  format: "summary"
});

// 2. Detect and start development server
const portInfo = await detectActivePortMCP({
  includeHealthCheck: true,
  cloudEnvironment: true
});

// 3. Start server if not running
if (!portInfo.serverRunning) {
  await startDevServerMCP({
    preferredPort: 3000,
    cloudEnvironment: true,
    enableHotReload: true
  });
}

// 4. Quick smoke test to validate environment
await executeTestMCP({
  testType: "smoke",
  strategy: "fast",
  skipVisual: true
});
```

**Use Cases**:
- Daily development startup routine
- Environment validation after system updates
- Cloud workstation environment setup

**Expected Results**:
- Development server running on optimal port
- Environment validated and ready
- Basic functionality confirmed

---

### Pattern 2: Quick Development Iteration

**Scenario**: Rapid development cycle with immediate feedback during active coding.

```typescript
// 1. Quick validation during development
await validateQualityGatesMCP({
  includeTypeCheck: true,
  includeLint: false,  // Skip lint for speed
  includeBuild: false, // Skip build for speed
  strict: false
});

// 2. Fast testing for immediate feedback
await executeTestMCP({
  testType: "dev",
  strategy: "fast",
  skipVisual: true,
  targetFiles: ["src/app/2/components/Hero/"]
});

// 3. Get contextual guidance if needed
await getContextualGuidanceMCP({
  task: "Optimizing animation performance in Hero component",
  context: "2",
  includeWarnings: true,
  detailLevel: "basic"
});
```

**Use Cases**:
- Active development with immediate feedback
- Component-specific iteration
- Performance-conscious development

**Expected Results**:
- Sub-2-minute feedback cycle
- TypeScript validation
- Component-specific testing

---

### Pattern 3: End-of-Day Quality Gates

**Scenario**: Comprehensive validation before ending development session or committing changes.

```typescript
// 1. Comprehensive quality validation
await validateQualityGatesMCP({
  includeTypeCheck: true,
  includeLint: true,
  includeBuild: true,
  strict: true
});

// 2. Full testing suite
await executeTestMCP({
  testType: "e2e",
  strategy: "comprehensive",
  skipVisual: false
});

// 3. Performance monitoring
await monitorPerformanceMCP({
  url: "http://localhost:3000/2",
  includeWebVitals: true,
  includeBundleAnalysis: true,
  includeRecommendations: true
});

// 4. Emergency trigger check
await detectEmergencyTriggersMCP({
  includeMinor: true,
  checkSystems: ["mcp", "hooks", "build", "server"],
  format: "summary"
});
```

**Use Cases**:
- Pre-commit validation
- End-of-development-session checks
- Release preparation

**Expected Results**:
- All quality gates passed
- Performance within targets
- No emergency triggers detected

---

## Component Development Patterns

### Pattern 4: New /2 Component Creation

**Scenario**: Creating a new component for the /2 redesign with full compliance and testing.

```typescript
// 1. Get guidance for component creation
const guidance = await getContextualGuidanceMCP({
  task: "Create new /2 technical showcase component with glassmorphism",
  context: "2",
  includeWarnings: true,
  detailLevel: "comprehensive"
});

// 2. Generate component with brand compliance
await generateComponentMCP({
  name: "TechnicalShowcase",
  type: "preview",
  context: "2",
  features: ["glassmorphism", "responsive", "animation"],
  includeTests: true,
  includeStyles: true
});

// 3. Validate component compliance
await validateComponentComplianceMCP({
  componentPath: "src/app/2/components/TechnicalShowcase/",
  checkBrandTokens: true,
  checkAccessibility: true,
  checkPerformance: true,
  checkResponsive: true
});

// 4. Test component functionality
await executeTestMCP({
  testType: "component",
  strategy: "comprehensive",
  targetFiles: ["src/app/2/components/TechnicalShowcase/"]
});

// 5. Performance validation
await analyzePerformanceAspectMCP({
  aspect: "animation",
  url: "http://localhost:3000/2",
  includeInsights: true,
  includeComparisons: true
});
```

**Use Cases**:
- New /2 component development
- Brand-compliant component creation
- Performance-optimized development

**Expected Results**:
- Component generated with full compliance
- Tests passing
- Performance within enterprise standards

---

### Pattern 5: Component Architecture Analysis

**Scenario**: Understanding and improving existing component architecture.

```typescript
// 1. Analyze existing component architecture
const architectureAnalysis = await analyzeComponentArchitectureMCP({
  componentPath: "src/app/2/components/",
  scope: "all",
  includeInsights: true,
  focusArea: "all"
});

// 2. Get comprehensive architecture insights
const insights = await getComponentArchitectureInsightsMCP({
  scope: "project",
  includeOptimizations: true,
  includeAlternatives: true,
  focusArea: "performance"
});

// 3. Query documentation for best practices
const documentation = await queryDocumentationMCP({
  query: "Component architecture patterns for /2 redesign",
  scope: "architecture",
  includeExamples: true,
  contextAware: true
});

// 4. Validate current components
await validateComponentComplianceMCP({
  componentPath: "src/app/2/components/",
  checkBrandTokens: true,
  checkAccessibility: true,
  checkPerformance: true,
  checkResponsive: true
});
```

**Use Cases**:
- Architecture review and improvement
- Performance optimization planning
- Code quality assessment

**Expected Results**:
- Complete architecture analysis
- Optimization recommendations
- Compliance validation results

---

## Testing & Quality Patterns

### Pattern 6: Intelligent Test Selection

**Scenario**: Smart test selection based on changes and available time.

```typescript
// 1. Analyze testing needs based on changes
const testingNeeds = await analyzeTestingNeedsMCP({
  changedFiles: [
    "src/app/2/components/Hero/Hero.tsx",
    "src/app/2/components/Hero/Hero.module.css"
  ],
  developmentContext: "2",
  riskLevel: "medium",
  timeConstraint: 15
});

// 2. Select optimal testing strategy
const strategy = await selectTestingStrategyMCP({
  changedFiles: [
    "src/app/2/components/Hero/Hero.tsx",
    "src/app/2/components/Hero/Hero.module.css"
  ],
  developmentContext: "2",
  timeAvailable: 15,
  riskTolerance: "medium",
  includeVisual: true
});

// 3. Execute selected tests
await executeTestMCP({
  testType: strategy.recommendedType,
  strategy: strategy.approach,
  skipVisual: !strategy.includeVisual,
  targetFiles: strategy.targetFiles
});

// 4. Get recommendations for future testing
await getTestingRecommendationsMCP({
  scenario: "Ongoing /2 component development",
  includeWorkflow: true,
  includeOptimizations: true,
  targetAudience: "developer"
});
```

**Use Cases**:
- Time-constrained testing
- Risk-based test selection
- Efficient development workflows

**Expected Results**:
- Optimal test strategy selected
- Tests executed within time constraints
- Risk-appropriate coverage

---

### Pattern 7: Comprehensive Quality Assurance

**Scenario**: Full quality assurance workflow for production readiness.

```typescript
// 1. Validate testing configuration
await validateTestingConfigurationMCP({
  configPath: "playwright.config.ts",
  includeHealthScore: true,
  includeImprovements: true,
  checkCoverage: true
});

// 2. Execute comprehensive test suite
await executeTestMCP({
  testType: "e2e",
  strategy: "comprehensive",
  skipVisual: false
});

// 3. Quality gates validation
await validateQualityGatesMCP({
  includeTypeCheck: true,
  includeLint: true,
  includeBuild: true,
  strict: true
});

// 4. Performance comprehensive analysis
await monitorPerformanceMCP({
  url: "http://localhost:3000/2",
  includeWebVitals: true,
  includeBundleAnalysis: true,
  includeRecommendations: true,
  monitoringDuration: 60
});

// 5. Component compliance validation
await validateComponentComplianceMCP({
  componentPath: "src/app/2/components/",
  checkBrandTokens: true,
  checkAccessibility: true,
  checkPerformance: true,
  checkResponsive: true
});
```

**Use Cases**:
- Pre-production validation
- Release quality assurance
- Comprehensive compliance checking

**Expected Results**:
- All quality metrics passed
- Performance targets met
- Full compliance validation

---

## Performance Optimization Patterns

### Pattern 8: Performance Investigation & Optimization

**Scenario**: Investigating performance issues and implementing optimizations.

```typescript
// 1. Monitor current performance
const currentMetrics = await monitorPerformanceMCP({
  url: "http://localhost:3000/2",
  includeWebVitals: true,
  includeBundleAnalysis: true,
  includeRecommendations: true
});

// 2. Analyze specific performance aspects
const webVitalsAnalysis = await analyzePerformanceAspectMCP({
  aspect: "webVitals",
  url: "http://localhost:3000/2",
  includeInsights: true,
  includeComparisons: true,
  targetMetrics: { lcp: 2.5, fid: 100, cls: 0.1 }
});

// 3. Get optimization recommendations
const optimizations = await getPerformanceOptimizationsMCP({
  currentMetrics: currentMetrics.webVitals,
  targetMetrics: { lcp: 2.5, fid: 100, cls: 0.1 },
  includePrioritization: true,
  includeImplementation: true,
  focus: "all"
});

// 4. Query documentation for optimization techniques
await queryDocumentationMCP({
  query: "Performance optimization techniques for /2 redesign",
  scope: "architecture",
  includeExamples: true,
  contextAware: true
});

// 5. Validate optimizations with testing
await executeTestMCP({
  testType: "e2e",
  strategy: "comprehensive",
  skipVisual: false
});
```

**Use Cases**:
- Performance issue diagnosis
- Optimization strategy development
- Performance improvement validation

**Expected Results**:
- Performance bottlenecks identified
- Prioritized optimization recommendations
- Implementation guidance provided

---

### Pattern 9: Bundle Size Optimization

**Scenario**: Monitoring and optimizing bundle size to stay within 6MB budget.

```typescript
// 1. Analyze bundle composition
const bundleAnalysis = await analyzePerformanceAspectMCP({
  aspect: "bundle",
  includeInsights: true,
  includeComparisons: true
});

// 2. Get bundle-specific optimizations
const bundleOptimizations = await getPerformanceOptimizationsMCP({
  focus: "size",
  includePrioritization: true,
  includeImplementation: true
});

// 3. Monitor performance impact
await monitorPerformanceMCP({
  includeBundleAnalysis: true,
  includeRecommendations: true
});

// 4. Validate changes don't impact functionality
await executeTestMCP({
  testType: "e2e",
  strategy: "comprehensive"
});
```

**Use Cases**:
- Bundle size management
- Performance budget enforcement
- Size optimization strategies

**Expected Results**:
- Bundle size within 6MB budget
- Optimization opportunities identified
- No functionality regressions

---

## Emergency Recovery Patterns

### Pattern 10: Proactive Issue Detection

**Scenario**: Regular monitoring to prevent emergencies before they occur.

```typescript
// 1. Regular emergency trigger monitoring
const triggers = await detectEmergencyTriggersMCP({
  includeMinor: true,
  checkSystems: ["mcp", "hooks", "build", "server"],
  format: "detailed"
});

// 2. System health monitoring
const systemHealth = await checkSystemHealthMCP({
  includeInsights: true,
  includeRecommendations: true,
  format: "operational"
});

// 3. Cross-system coordination analysis
const coordination = await getCoordinationInsightsMCP({
  includePerformance: true,
  includeOptimizations: true,
  includeAlternatives: true,
  analysisDepth: "detailed"
});

// 4. Emergency recovery analysis
const recoveryAnalysis = await analyzeEmergencyRecoveryMCP({
  includePreventionTips: true,
  includeSystemHealth: true,
  analysisDepth: "basic"
});
```

**Use Cases**:
- Preventive monitoring
- System health assessment
- Early issue detection

**Expected Results**:
- Issues detected before becoming critical
- Prevention strategies identified
- System health maintained

---

### Pattern 11: Emergency Response & Recovery

**Scenario**: Responding to system failures with intelligent recovery.

```typescript
// 1. Detect emergency triggers
const emergencyTriggers = await detectEmergencyTriggersMCP({
  includeMinor: false,
  checkSystems: ["mcp", "hooks", "build", "server"],
  format: "actionable"
});

if (emergencyTriggers.status === "triggers-detected") {
  // 2. Generate rollback strategy
  const rollbackStrategy = await generateRollbackStrategyMCP({
    triggerType: emergencyTriggers.triggers[0].type,
    severity: emergencyTriggers.triggers[0].severity,
    preferredStrategy: "graceful",
    preserveState: true,
    includeAlternatives: true
  });

  // 3. Execute rollback (dry run first)
  const dryRun = await executeEmergencyRollbackMCP({
    triggerType: emergencyTriggers.triggers[0].type,
    dryRun: true,
    confirmExecution: false
  });

  // 4. Execute actual rollback if dry run successful
  if (dryRun.status === "dry-run") {
    await executeEmergencyRollbackMCP({
      triggerType: emergencyTriggers.triggers[0].type,
      dryRun: false,
      confirmExecution: true
    });
  }

  // 5. Analyze recovery and prevention
  await analyzeEmergencyRecoveryMCP({
    includePreventionTips: true,
    includeSystemHealth: true,
    analysisDepth: "comprehensive"
  });
}
```

**Use Cases**:
- Emergency system recovery
- Automatic failure response
- Post-incident analysis

**Expected Results**:
- System restored to working state
- Minimal data/work loss
- Prevention strategies for future

---

## Advanced Integration Patterns

### Pattern 12: Full Development Workflow Automation

**Scenario**: Complete automated development workflow from start to deployment.

```typescript
// 1. Environment setup and validation
await startDevServerMCP({ cloudEnvironment: true });
await checkSystemHealthMCP({ format: "summary" });

// 2. Feature development
const guidance = await getContextualGuidanceMCP({
  task: "Implement new /2 case study showcase with performance optimization",
  context: "2",
  detailLevel: "comprehensive"
});

const workflow = await resolveWorkflowStepsMCP({
  workflow: "Complete /2 case study implementation",
  includeValidation: true,
  includeTroubleshooting: true,
  optimizeForSpeed: false
});

// 3. Component generation and validation
await generateComponentMCP({
  name: "CaseStudyShowcase",
  type: "detail",
  context: "2",
  features: ["glassmorphism", "responsive", "animation"]
});

await validateComponentComplianceMCP({
  componentPath: "src/app/2/components/CaseStudyShowcase/",
  checkBrandTokens: true,
  checkAccessibility: true,
  checkPerformance: true
});

// 4. Testing and quality assurance
const testStrategy = await selectTestingStrategyMCP({
  changedFiles: ["src/app/2/components/CaseStudyShowcase/"],
  developmentContext: "2",
  riskTolerance: "low"
});

await executeTestMCP({
  testType: testStrategy.recommendedType,
  strategy: testStrategy.approach
});

// 5. Performance optimization
await monitorPerformanceMCP({
  includeWebVitals: true,
  includeBundleAnalysis: true
});

const optimizations = await getPerformanceOptimizationsMCP({
  includePrioritization: true,
  includeImplementation: true
});

// 6. Final validation
await validateQualityGatesMCP({
  includeTypeCheck: true,
  includeLint: true,
  includeBuild: true,
  strict: true
});
```

**Use Cases**:
- Complete feature implementation
- Automated workflow execution
- Enterprise development standards

**Expected Results**:
- Feature fully implemented and tested
- All quality gates passed
- Performance optimized
- Ready for production

---

### Pattern 13: Documentation-Driven Development

**Scenario**: Using documentation intelligence to guide development decisions.

```typescript
// 1. Query project-specific documentation
const architectureGuidance = await queryDocumentationMCP({
  query: "Best practices for /2 component architecture and performance",
  scope: "architecture",
  includeExamples: true,
  contextAware: true
});

// 2. Get contextual guidance for specific tasks
const taskGuidance = await getContextualGuidanceMCP({
  task: "Implement glassmorphism effects with 60fps performance",
  context: "2",
  includeWarnings: true,
  detailLevel: "detailed"
});

// 3. Resolve complex workflows
const workflow = await resolveWorkflowStepsMCP({
  workflow: "Optimize existing /2 components for Core Web Vitals",
  includeValidation: true,
  includeTroubleshooting: true,
  optimizeForSpeed: true
});

// 4. Get testing recommendations
const testingGuidance = await getTestingRecommendationsMCP({
  scenario: "Performance testing for visual components",
  includeWorkflow: true,
  includeOptimizations: true,
  targetAudience: "developer"
});

// 5. Architecture insights for improvement
const insights = await getComponentArchitectureInsightsMCP({
  scope: "project",
  includeOptimizations: true,
  includeAlternatives: true,
  focusArea: "performance"
});
```

**Use Cases**:
- Knowledge-driven development
- Best practices implementation
- Complex problem solving

**Expected Results**:
- Well-informed development decisions
- Best practices applied consistently
- Complex workflows simplified

---

## Performance Benchmarks

### Expected Tool Execution Times

| Pattern Category | Expected Duration | Key Benefits |
|------------------|-------------------|--------------|
| **Daily Startup** | 2-3 minutes | Environment validated, server running |
| **Quick Iteration** | 30-60 seconds | Immediate feedback, fast iteration |
| **Component Creation** | 3-5 minutes | Complete component with compliance |
| **Quality Gates** | 5-8 minutes | Comprehensive validation |
| **Performance Analysis** | 2-4 minutes | Detailed insights and recommendations |
| **Emergency Recovery** | 30-60 seconds | System restored to working state |

### Success Metrics

- **Development Velocity**: 60% faster component creation
- **Quality Assurance**: 100% compliance validation
- **Issue Prevention**: 95% of issues caught before production
- **Recovery Time**: 80% faster emergency recovery
- **Documentation Access**: 90% faster than manual searching

---

## Best Practices

### Tool Selection
1. **Use context-aware parameters** - Always specify `developmentContext: "2"` for /2 work
2. **Combine related tools** - Chain tools for complete workflows
3. **Monitor performance regularly** - Use performance tools proactively
4. **Leverage documentation intelligence** - Query docs before manual searching

### Error Handling
1. **Check system health regularly** - Prevent issues before they occur
2. **Use dry runs for risky operations** - Test rollbacks before execution
3. **Monitor emergency triggers** - Early detection prevents failures
4. **Preserve state during recovery** - Minimize work loss during emergencies

### Performance Optimization
1. **Monitor Core Web Vitals continuously** - Stay within enterprise targets
2. **Use intelligent test selection** - Optimize testing time and coverage
3. **Generate components with compliance** - Avoid manual brand token work
4. **Leverage cross-system coordination** - Use best system for each task

---

**Tyler Gohr Portfolio MCP Server v1.4.0** - Enabling enterprise development workflows with intelligent automation.