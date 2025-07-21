# Tool Reference - Tyler Gohr Portfolio MCP Server

> Comprehensive catalog of all 27 MCP tools across 6 Tier 1 Intelligence Servers

## Overview

This reference provides detailed documentation for every tool available in the Tyler Gohr Portfolio MCP Server v1.4.0. Tools are organized by Intelligence Server and include complete parameter schemas, usage examples, and integration patterns.

## Table of Contents

- [Core Tools (5)](#core-tools)
- [Documentation Intelligence (3)](#documentation-intelligence)
- [Component Architecture Intelligence (4)](#component-architecture-intelligence)
- [Testing Strategy Intelligence (4)](#testing-strategy-intelligence)
- [Performance Monitoring Intelligence (3)](#performance-monitoring-intelligence)
- [Cross-System Coordinator Intelligence (4)](#cross-system-coordinator-intelligence)
- [Emergency Rollback Intelligence (4)](#emergency-rollback-intelligence)

---

## Core Tools

Essential development automation and timeout prevention tools.

### 1. `startDevServerMCP`

**Description**: Start development server with intelligent port detection and cloud environment support (replaces timeout-prone npm run dev)

**Parameters**:
```typescript
{
  preferredPort?: number;           // Preferred port (default: 3000)
  cloudEnvironment?: boolean;       // Enable cloud environment detection
  enableHotReload?: boolean;        // Enable hot reload (default: true)
  timeout?: number;                 // Startup timeout in ms (default: 30000)
}
```

**Example**:
```typescript
startDevServerMCP({ 
  preferredPort: 3000, 
  cloudEnvironment: true,
  enableHotReload: true 
})
```

**Use Cases**:
- Starting development server with automatic port conflict resolution
- Cloud environment development (Google Cloud Workstations, Codespaces)
- Replacing timeout-prone `npm run dev` commands

---

### 2. `executeTestMCP`

**Description**: Execute tests with intelligent strategy selection and timeout-resistant execution (replaces npm run test:e2e:smoke timeouts)

**Parameters**:
```typescript
{
  testType?: "smoke" | "dev" | "e2e" | "component" | "visual";
  strategy?: "fast" | "comprehensive" | "custom";
  skipVisual?: boolean;             // Skip visual regression tests
  targetFiles?: string[];          // Specific files to test
  timeout?: number;                 // Test timeout in ms
}
```

**Example**:
```typescript
executeTestMCP({ 
  testType: "smoke", 
  strategy: "fast",
  skipVisual: true 
})
```

**Use Cases**:
- Quick validation during development (smoke tests)
- Comprehensive testing before commits
- Context-aware test selection based on file changes

---

### 3. `detectActivePortMCP`

**Description**: Detect active development server ports with cloud environment support (replaces complex bash port detection)

**Parameters**:
```typescript
{
  includeHealthCheck?: boolean;     // Perform health check on detected ports
  portRange?: [number, number];     // Port range to scan (default: [3000, 4000])
  cloudEnvironment?: boolean;       // Enable cloud URL construction
}
```

**Example**:
```typescript
detectActivePortMCP({ 
  includeHealthCheck: true,
  cloudEnvironment: true 
})
```

**Use Cases**:
- Finding active development servers in cloud environments
- Constructing correct URLs for testing in cloud workstations
- Port conflict detection and resolution

---

### 4. `validateQualityGatesMCP`

**Description**: Run TypeScript validation, ESLint, and build checks (direct tool access without bash timeouts)

**Parameters**:
```typescript
{
  includeTypeCheck?: boolean;       // Run TypeScript validation (default: true)
  includeLint?: boolean;            // Run ESLint checks (default: true)
  includeBuild?: boolean;           // Run build validation (default: true)
  strict?: boolean;                 // Use strict validation mode
}
```

**Example**:
```typescript
validateQualityGatesMCP({ 
  includeTypeCheck: true,
  includeLint: true,
  includeBuild: true,
  strict: true 
})
```

**Use Cases**:
- Pre-commit quality validation
- Continuous integration quality gates
- Development workflow validation

---

### 5. `handleFileOperationMCP`

**Description**: Safe file operations with protection validation and automatic backups

**Parameters**:
```typescript
{
  operation: "read" | "write" | "delete" | "backup";
  filePath: string;                 // Target file path
  content?: string;                 // Content for write operations
  createBackup?: boolean;           // Create backup before modifications
  overrideProtection?: boolean;     // Override file protection (use carefully)
}
```

**Example**:
```typescript
handleFileOperationMCP({ 
  operation: "write",
  filePath: "src/app/2/components/NewComponent/NewComponent.tsx",
  content: "/* Component code */",
  createBackup: true 
})
```

**Use Cases**:
- Protected file modifications with backup
- Safe component file creation
- Automated file operations with validation

---

## Documentation Intelligence

Semantic search and contextual guidance tools.

### 6. `queryDocumentationMCP`

**Description**: Enhanced documentation intelligence with semantic search and contextual guidance (Phase 3 Tier 1 capability)

**Parameters**:
```typescript
{
  query: string;                    // Search query
  scope?: "all" | "testing" | "development" | "architecture" | "deployment";
  includeExamples?: boolean;        // Include usage examples
  contextAware?: boolean;           // Use current project context
}
```

**Example**:
```typescript
queryDocumentationMCP({ 
  query: "How to optimize bundle size for /2 redesign",
  scope: "architecture",
  includeExamples: true,
  contextAware: true 
})
```

**Use Cases**:
- Quick answers to development questions
- Finding relevant documentation sections
- Context-aware guidance for specific tasks

---

### 7. `getContextualGuidanceMCP`

**Description**: Get intelligent contextual guidance for development tasks with checklists and warnings (Phase 3 enhanced capability)

**Parameters**:
```typescript
{
  task: string;                     // Development task description
  context?: "main" | "2" | "mixed"; // Development context
  includeWarnings?: boolean;        // Include potential issues and warnings
  detailLevel?: "basic" | "detailed" | "comprehensive";
}
```

**Example**:
```typescript
getContextualGuidanceMCP({ 
  task: "Create new /2 component with glassmorphism effects",
  context: "2",
  includeWarnings: true,
  detailLevel: "comprehensive" 
})
```

**Use Cases**:
- Step-by-step guidance for complex tasks
- Warning about potential issues
- Context-specific development advice

---

### 8. `resolveWorkflowStepsMCP`

**Description**: Resolve complex development workflows into step-by-step guides with validation and troubleshooting (Phase 3 enhanced capability)

**Parameters**:
```typescript
{
  workflow: string;                 // Workflow description
  includeValidation?: boolean;      // Include validation steps
  includeTroubleshooting?: boolean; // Include troubleshooting guidance
  optimizeForSpeed?: boolean;       // Optimize for development speed
}
```

**Example**:
```typescript
resolveWorkflowStepsMCP({ 
  workflow: "Implement new /2 case study with performance optimization",
  includeValidation: true,
  includeTroubleshooting: true,
  optimizeForSpeed: false 
})
```

**Use Cases**:
- Breaking down complex development tasks
- Creating actionable implementation plans
- Workflow optimization and troubleshooting

---

## Component Architecture Intelligence

/2 redesign component generation and validation tools.

### 9. `analyzeComponentArchitectureMCP`

**Description**: Analyze existing /2 component architecture patterns, brand token usage, and architectural insights (Phase 4 Tier 1 capability)

**Parameters**:
```typescript
{
  componentPath?: string;           // Specific component to analyze
  scope?: "single" | "section" | "all"; // Analysis scope
  includeInsights?: boolean;        // Include architectural recommendations
  focusArea?: "performance" | "accessibility" | "brandCompliance" | "all";
}
```

**Example**:
```typescript
analyzeComponentArchitectureMCP({ 
  componentPath: "src/app/2/components/Hero/",
  scope: "single",
  includeInsights: true,
  focusArea: "all" 
})
```

**Use Cases**:
- Understanding existing component patterns
- Architecture compliance validation
- Performance and accessibility analysis

---

### 10. `generateComponentMCP`

**Description**: Generate new /2 components with automatic brand token compliance and enterprise architecture patterns (Phase 4 enhanced capability)

**Parameters**:
```typescript
{
  name: string;                     // Component name
  type: "preview" | "detail" | "ui" | "layout";
  context: "2" | "main";           // Development context
  features?: string[];             // Requested features (e.g., "glassmorphism", "animation")
  includeTests?: boolean;          // Generate test files
  includeStyles?: boolean;         // Generate CSS module files
}
```

**Example**:
```typescript
generateComponentMCP({ 
  name: "SkillsShowcase",
  type: "preview",
  context: "2",
  features: ["glassmorphism", "responsive", "animation"],
  includeTests: true,
  includeStyles: true 
})
```

**Use Cases**:
- Rapid component development for /2 redesign
- Brand-compliant component generation
- Consistent architecture pattern implementation

---

### 11. `validateComponentComplianceMCP`

**Description**: Validate component compliance with brand tokens, accessibility standards, and performance best practices (Phase 4 validation)

**Parameters**:
```typescript
{
  componentPath: string;            // Component directory path
  checkBrandTokens?: boolean;       // Validate brand token usage
  checkAccessibility?: boolean;     // WCAG 2.1 AA compliance check
  checkPerformance?: boolean;       // Performance best practices check
  checkResponsive?: boolean;        // Responsive design validation
}
```

**Example**:
```typescript
validateComponentComplianceMCP({ 
  componentPath: "src/app/2/components/CaseStudies/",
  checkBrandTokens: true,
  checkAccessibility: true,
  checkPerformance: true,
  checkResponsive: true 
})
```

**Use Cases**:
- Pre-commit component validation
- Brand consistency enforcement
- Accessibility compliance verification

---

### 12. `getComponentArchitectureInsightsMCP`

**Description**: Get comprehensive architecture insights including performance optimizations and accessibility recommendations (Phase 4 intelligence)

**Parameters**:
```typescript
{
  scope?: "project" | "section" | "component";
  includeOptimizations?: boolean;   // Include performance optimization suggestions
  includeAlternatives?: boolean;    // Include alternative architecture patterns
  focusArea?: "performance" | "maintainability" | "scalability" | "all";
}
```

**Example**:
```typescript
getComponentArchitectureInsightsMCP({ 
  scope: "project",
  includeOptimizations: true,
  includeAlternatives: true,
  focusArea: "performance" 
})
```

**Use Cases**:
- Architecture improvement recommendations
- Performance optimization strategies
- Long-term maintainability planning

---

## Testing Strategy Intelligence

Smart test selection and execution tools.

### 13. `analyzeTestingNeedsMCP`

**Description**: Analyze testing needs based on file changes and development context with intelligent strategy recommendations (Phase 4 Tier 1 capability)

**Parameters**:
```typescript
{
  changedFiles?: string[];          // Files that have changed
  developmentContext?: "main" | "2" | "mixed";
  riskLevel?: "low" | "medium" | "high";
  timeConstraint?: number;          // Available time in minutes
}
```

**Example**:
```typescript
analyzeTestingNeedsMCP({ 
  changedFiles: ["src/app/2/components/Hero/Hero.tsx"],
  developmentContext: "2",
  riskLevel: "medium",
  timeConstraint: 10 
})
```

**Use Cases**:
- Intelligent test selection based on changes
- Risk-based testing prioritization
- Time-constrained testing strategies

---

### 14. `selectTestingStrategyMCP`

**Description**: Select optimal testing strategy with intelligent analysis of file changes, risk assessment, and context awareness (Phase 4 enhanced capability)

**Parameters**:
```typescript
{
  changedFiles: string[];           // Files that have changed
  developmentContext?: "main" | "2" | "mixed";
  timeAvailable?: number;           // Available time in minutes
  riskTolerance?: "low" | "medium" | "high";
  includeVisual?: boolean;          // Include visual regression tests
}
```

**Example**:
```typescript
selectTestingStrategyMCP({ 
  changedFiles: ["src/app/2/components/CaseStudies/CaseStudyCard.tsx"],
  developmentContext: "2",
  timeAvailable: 15,
  riskTolerance: "low",
  includeVisual: true 
})
```

**Use Cases**:
- Optimal test strategy selection
- Context-aware testing recommendations
- Efficient testing workflow planning

---

### 15. `getTestingRecommendationsMCP`

**Description**: Get testing recommendations for specific development scenarios with workflow guidance and optimization tips (Phase 4 intelligence)

**Parameters**:
```typescript
{
  scenario: string;                 // Development scenario description
  includeWorkflow?: boolean;        // Include workflow guidance
  includeOptimizations?: boolean;   // Include testing optimizations
  targetAudience?: "developer" | "qa" | "cicd";
}
```

**Example**:
```typescript
getTestingRecommendationsMCP({ 
  scenario: "Pre-commit validation for /2 component changes",
  includeWorkflow: true,
  includeOptimizations: true,
  targetAudience: "developer" 
})
```

**Use Cases**:
- Scenario-specific testing guidance
- Testing workflow optimization
- Best practices recommendations

---

### 16. `validateTestingConfigurationMCP`

**Description**: Validate and optimize testing strategy configuration with health scoring and improvement recommendations (Phase 4 validation)

**Parameters**:
```typescript
{
  configPath?: string;              // Path to test configuration
  includeHealthScore?: boolean;     // Include configuration health score
  includeImprovements?: boolean;    // Include improvement recommendations
  checkCoverage?: boolean;          // Validate test coverage
}
```

**Example**:
```typescript
validateTestingConfigurationMCP({ 
  configPath: "playwright.config.ts",
  includeHealthScore: true,
  includeImprovements: true,
  checkCoverage: true 
})
```

**Use Cases**:
- Testing configuration validation
- Test strategy health assessment
- Configuration optimization recommendations

---

## Performance Monitoring Intelligence

Real-time optimization and monitoring tools.

### 17. `monitorPerformanceMCP`

**Description**: Monitor real-time performance metrics with Core Web Vitals analysis, bundle monitoring, and enterprise standards compliance (Phase 4 Tier 1 capability)

**Parameters**:
```typescript
{
  url?: string;                     // URL to monitor (default: auto-detect)
  includeWebVitals?: boolean;       // Include Core Web Vitals analysis
  includeBundleAnalysis?: boolean;  // Include bundle size analysis
  includeRecommendations?: boolean; // Include optimization recommendations
  monitoringDuration?: number;      // Monitoring duration in seconds
}
```

**Example**:
```typescript
monitorPerformanceMCP({ 
  url: "http://localhost:3000/2",
  includeWebVitals: true,
  includeBundleAnalysis: true,
  includeRecommendations: true,
  monitoringDuration: 30 
})
```

**Use Cases**:
- Real-time performance monitoring
- Core Web Vitals tracking
- Bundle size validation

---

### 18. `analyzePerformanceAspectMCP`

**Description**: Analyze specific performance aspects (Core Web Vitals, Lighthouse, bundle size, animation, CSS) with detailed insights and recommendations (Phase 4 enhanced capability)

**Parameters**:
```typescript
{
  aspect: "webVitals" | "lighthouse" | "bundle" | "animation" | "css" | "all";
  url?: string;                     // URL to analyze
  includeInsights?: boolean;        // Include detailed analysis insights
  includeComparisons?: boolean;     // Include performance comparisons
  targetMetrics?: object;           // Target performance metrics
}
```

**Example**:
```typescript
analyzePerformanceAspectMCP({ 
  aspect: "webVitals",
  url: "http://localhost:3000/2",
  includeInsights: true,
  includeComparisons: true,
  targetMetrics: { lcp: 2.5, fid: 100, cls: 0.1 } 
})
```

**Use Cases**:
- Specific performance aspect analysis
- Target metric validation
- Performance optimization insights

---

### 19. `getPerformanceOptimizationsMCP`

**Description**: Get performance optimization recommendations with prioritization and implementation guidance for enterprise standards (Phase 4 intelligence)

**Parameters**:
```typescript
{
  currentMetrics?: object;          // Current performance metrics
  targetMetrics?: object;           // Target performance metrics
  includePrioritization?: boolean;  // Include optimization prioritization
  includeImplementation?: boolean;  // Include implementation guidance
  focus?: "speed" | "size" | "ux" | "all";
}
```

**Example**:
```typescript
getPerformanceOptimizationsMCP({ 
  currentMetrics: { lcp: 3.2, fid: 120, cls: 0.15 },
  targetMetrics: { lcp: 2.5, fid: 100, cls: 0.1 },
  includePrioritization: true,
  includeImplementation: true,
  focus: "all" 
})
```

**Use Cases**:
- Performance optimization planning
- Implementation guidance
- Prioritized improvement recommendations

---

## Cross-System Coordinator Intelligence

System coordination and fallback strategy tools.

### 20. `checkSystemHealthMCP`

**Description**: Check health of both MCP and hooks systems with intelligent coordination analysis and fallback recommendations (Phase 4 Cross-System Coordinator)

**Parameters**:
```typescript
{
  includeInsights?: boolean;        // Include coordination insights
  includeRecommendations?: boolean; // Include system recommendations
  format?: "summary" | "detailed" | "operational";
}
```

**Example**:
```typescript
checkSystemHealthMCP({ 
  includeInsights: true,
  includeRecommendations: true,
  format: "detailed" 
})
```

**Use Cases**:
- System health monitoring
- Cross-system coordination analysis
- Preventive maintenance recommendations

---

### 21. `planCrossSystemOperationMCP`

**Description**: Plan cross-system operations with intelligent system selection, fallback strategies, and monitoring configuration (Phase 4 Cross-System Coordinator)

**Parameters**:
```typescript
{
  operation: "development" | "testing" | "validation" | "deployment";
  preferredSystem?: "mcp" | "hooks" | "auto";
  enableFallback?: boolean;         // Enable fallback strategies
  includeMonitoring?: boolean;      // Include monitoring configuration
}
```

**Example**:
```typescript
planCrossSystemOperationMCP({ 
  operation: "testing",
  preferredSystem: "auto",
  enableFallback: true,
  includeMonitoring: true 
})
```

**Use Cases**:
- Cross-system operation planning
- Fallback strategy configuration
- System coordination optimization

---

### 22. `executeFallbackStrategyMCP`

**Description**: Execute intelligent fallback strategies when primary systems fail, with state preservation and automatic recovery (Phase 4 Cross-System Coordinator)

**Parameters**:
```typescript
{
  trigger: "timeout" | "failure" | "health-degradation" | "manual";
  fromSystem: "mcp" | "hooks";     // System to fallback from
  operation: string;               // Operation that requires fallback
  preserveState?: boolean;         // Attempt state preservation
}
```

**Example**:
```typescript
executeFallbackStrategyMCP({ 
  trigger: "timeout",
  fromSystem: "hooks",
  operation: "test-execution",
  preserveState: true 
})
```

**Use Cases**:
- Automatic system fallback execution
- State preservation during failures
- System recovery coordination

---

### 23. `getCoordinationInsightsMCP`

**Description**: Get comprehensive insights into cross-system coordination with performance analysis and optimization recommendations (Phase 4 Cross-System Coordinator)

**Parameters**:
```typescript
{
  includePerformance?: boolean;     // Include performance analysis
  includeOptimizations?: boolean;   // Include optimization recommendations
  includeAlternatives?: boolean;    // Include alternative system options
  analysisDepth?: "basic" | "detailed" | "comprehensive";
}
```

**Example**:
```typescript
getCoordinationInsightsMCP({ 
  includePerformance: true,
  includeOptimizations: true,
  includeAlternatives: true,
  analysisDepth: "comprehensive" 
})
```

**Use Cases**:
- Cross-system performance analysis
- Coordination optimization strategies
- Alternative system recommendations

---

## Emergency Rollback Intelligence

Failure detection and recovery tools.

### 24. `detectEmergencyTriggersMCP`

**Description**: Detect emergency triggers requiring rollback with automatic system health monitoring and trigger analysis (Phase 4 Emergency Rollback Intelligence)

**Parameters**:
```typescript
{
  includeMinor?: boolean;           // Include low-severity triggers
  checkSystems?: ("mcp" | "hooks" | "build" | "server")[];
  format?: "summary" | "detailed" | "actionable";
}
```

**Example**:
```typescript
detectEmergencyTriggersMCP({ 
  includeMinor: false,
  checkSystems: ["mcp", "hooks", "build", "server"],
  format: "actionable" 
})
```

**Use Cases**:
- Proactive system failure detection
- Emergency trigger monitoring
- Preventive issue identification

---

### 25. `generateRollbackStrategyMCP`

**Description**: Generate intelligent rollback strategies with state preservation and alternative approaches for emergency recovery (Phase 4 Emergency Rollback Intelligence)

**Parameters**:
```typescript
{
  triggerType: "system-failure" | "hook-timeout" | "build-failure" | "test-failure" | "server-crash" | "manual";
  severity: "critical" | "high" | "medium" | "low";
  preferredStrategy?: "immediate" | "graceful" | "staged" | "minimal";
  preserveState?: boolean;          // Attempt state preservation
  includeAlternatives?: boolean;    // Include alternative strategies
}
```

**Example**:
```typescript
generateRollbackStrategyMCP({ 
  triggerType: "system-failure",
  severity: "high",
  preferredStrategy: "graceful",
  preserveState: true,
  includeAlternatives: true 
})
```

**Use Cases**:
- Emergency rollback planning
- Recovery strategy generation
- Risk-appropriate rollback methods

---

### 26. `executeEmergencyRollbackMCP`

**Description**: Execute emergency rollback with intelligent strategy selection, state preservation, and automatic validation (Phase 4 Emergency Rollback Intelligence)

**Parameters**:
```typescript
{
  triggerType?: "system-failure" | "hook-timeout" | "build-failure" | "test-failure" | "server-crash" | "manual";
  dryRun?: boolean;                 // Perform dry run without execution
  confirmExecution?: boolean;       // Explicit confirmation for execution
}
```

**Example**:
```typescript
executeEmergencyRollbackMCP({ 
  triggerType: "hook-timeout",
  dryRun: false,
  confirmExecution: true 
})
```

**Use Cases**:
- Emergency system recovery
- Rollback execution with validation
- State preservation during failures

---

### 27. `analyzeEmergencyRecoveryMCP`

**Description**: Analyze comprehensive emergency recovery with risk assessment, prevention tips, and system health insights (Phase 4 Emergency Rollback Intelligence)

**Parameters**:
```typescript
{
  includePreventionTips?: boolean;  // Include prevention tips and best practices
  includeSystemHealth?: boolean;    // Include current system health analysis
  analysisDepth?: "basic" | "detailed" | "comprehensive";
}
```

**Example**:
```typescript
analyzeEmergencyRecoveryMCP({ 
  includePreventionTips: true,
  includeSystemHealth: true,
  analysisDepth: "comprehensive" 
})
```

**Use Cases**:
- Post-incident analysis
- Prevention strategy development
- System reliability assessment

---

## Tool Integration Patterns

### Common Tool Combinations

**Development Workflow**:
```typescript
// 1. Start development
await startDevServerMCP({ cloudEnvironment: true })

// 2. Generate component
await generateComponentMCP({ name: "NewFeature", context: "2" })

// 3. Validate component
await validateComponentComplianceMCP({ componentPath: "src/app/2/components/NewFeature/" })

// 4. Test changes
await executeTestMCP({ testType: "smoke", strategy: "fast" })
```

**Emergency Recovery**:
```typescript
// 1. Detect issues
const triggers = await detectEmergencyTriggersMCP({ format: "actionable" })

// 2. Generate strategy
const strategy = await generateRollbackStrategyMCP({ 
  triggerType: triggers[0].type, 
  severity: triggers[0].severity 
})

// 3. Execute recovery
await executeEmergencyRollbackMCP({ confirmExecution: true })
```

**Performance Optimization**:
```typescript
// 1. Monitor performance
await monitorPerformanceMCP({ includeWebVitals: true })

// 2. Analyze specific aspects
await analyzePerformanceAspectMCP({ aspect: "webVitals" })

// 3. Get optimization recommendations
await getPerformanceOptimizationsMCP({ includePrioritization: true })
```

---

## Error Handling

All tools return standardized error responses:

```typescript
{
  content: [{
    type: "text",
    text: JSON.stringify({
      error: "Tool execution failed",
      message: "Detailed error message",
      timestamp: "ISO timestamp",
      troubleshooting: ["Step 1", "Step 2", "Step 3"]
    })
  }],
  isError: true
}
```

## Best Practices

1. **Use Context-Aware Tools**: Specify `developmentContext` when working on /2 redesign
2. **Combine Related Tools**: Use tool chains for complete workflows
3. **Monitor Performance**: Regular performance monitoring prevents issues
4. **Emergency Preparedness**: Understand rollback tools before emergencies
5. **Documentation Integration**: Use documentation tools for guidance and examples

---

**Tyler Gohr Portfolio MCP Server v1.4.0** - Complete tool reference for enterprise development automation.