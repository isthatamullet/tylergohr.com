import { z } from "zod";

// Development Server Schema
export const DevServerSchema = z.object({
  port: z.number().int().min(1000).max(65535).optional(),
  enhanced: z.boolean().default(false),
  action: z.enum(["start", "stop", "status", "restart"]).default("start"),
  environment: z.enum(["auto", "local", "cloud-workstation", "codespaces", "gitpod"]).default("auto"),
});

export type DevServerRequest = z.infer<typeof DevServerSchema>;

// Test Execution Schema
export const TestExecutionSchema = z.object({
  testType: z.enum([
    "smoke", 
    "dev", 
    "component", 
    "visual", 
    "navigation", 
    "accessibility", 
    "performance", 
    "mobile", 
    "comprehensive",
    "skip"
  ]).default("smoke"),
  skipVisual: z.boolean().default(false),
  fastMode: z.boolean().default(false),
  browser: z.enum(["chromium", "firefox", "webkit", "all"]).default("chromium"),
  timeout: z.number().int().min(10000).max(600000).default(120000), // 10s to 10min
  strategy: z.enum(["auto", "parallel", "sequential"]).default("auto"),
  component: z.string().optional(), // For component-specific testing
});

export type TestExecutionRequest = z.infer<typeof TestExecutionSchema>;

// Port Detection Schema
export const PortDetectionSchema = z.object({
  scanPorts: z.boolean().default(false),
  preferredPort: z.number().int().min(1000).max(65535).optional(),
  includeHealth: z.boolean().default(true),
  timeout: z.number().int().min(1000).max(30000).default(10000), // 1s to 30s
});

export type PortDetectionRequest = z.infer<typeof PortDetectionSchema>;

// Quality Gates Schema
export const QualityGatesSchema = z.object({
  checks: z.array(z.enum([
    "typescript", 
    "eslint", 
    "build", 
    "bundle", 
    "all"
  ])).default(["typescript", "eslint", "build"]),
  fix: z.boolean().default(false), // Auto-fix linting issues
  strict: z.boolean().default(false), // Stop on first failure
  timeout: z.number().int().min(30000).max(300000).default(120000), // 30s to 5min
});

export type QualityGatesRequest = z.infer<typeof QualityGatesSchema>;

// File Operation Schema
export const FileOperationSchema = z.object({
  operation: z.enum(["read", "create", "modify", "delete", "exists"]),
  filePath: z.string().min(1),
  content: z.string().optional(),
  backup: z.boolean().default(false),
  force: z.boolean().default(false),
});

export type FileOperationRequest = z.infer<typeof FileOperationSchema>;

// Documentation Query Schema - Enhanced for Phase 3 Intelligence
export const DocumentationQuerySchema = z.object({
  query: z.string().min(1),
  category: z.enum(["general", "testing", "deployment", "hooks", "architecture", "/2", "development", "troubleshooting", "commands", "workflows"]).optional(),
  includeExamples: z.boolean().default(true),
  format: z.enum(["summary", "detailed", "contextual", "guidance"]).default("detailed"),
  intelligence: z.boolean().default(true), // Enable enhanced intelligence features
});

export type DocumentationQueryRequest = z.infer<typeof DocumentationQuerySchema>;

// Contextual Guidance Schema - New Enhanced Capability
export const ContextualGuidanceSchema = z.object({
  currentTask: z.string().min(1),
  context: z.enum(["main", "2", "mixed"]).default("main"),
  urgency: z.enum(["low", "medium", "high"]).default("medium"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
});

export type ContextualGuidanceRequest = z.infer<typeof ContextualGuidanceSchema>;

// Workflow Resolution Schema - New Enhanced Capability
export const WorkflowResolutionSchema = z.object({
  workflow: z.string().min(1),
  context: z.enum(["main", "2", "mixed"]).default("main"),
  includePrerequisites: z.boolean().default(true),
  detailLevel: z.enum(["basic", "detailed", "comprehensive"]).default("detailed"),
});

export type WorkflowResolutionRequest = z.infer<typeof WorkflowResolutionSchema>;

// Component Architecture Intelligence schemas for Phase 4 capabilities
export const ComponentArchitectureAnalysisSchema = z.object({
  includePatterns: z.boolean().default(true).describe("Whether to include component pattern analysis"),
  includeBrandTokens: z.boolean().default(true).describe("Whether to include brand token usage analysis"),
  includeInsights: z.boolean().default(true).describe("Whether to include architecture insights"),
  componentType: z.enum(["ui", "section", "layout", "interactive"]).optional().describe("Filter analysis by component type")
});

export type ComponentArchitectureAnalysisRequest = z.infer<typeof ComponentArchitectureAnalysisSchema>;

export const ComponentGenerationSchema = z.object({
  componentName: z.string().min(1).describe("PascalCase component name (e.g., MyComponent, ButtonGroup)"),
  componentType: z.enum(["ui", "section", "layout", "interactive"]).describe("Type of component to generate"),
  section: z.enum(["hero", "about", "results", "case-studies", "how-i-work", "technical-expertise", "contact"]).default("hero").describe("Section context for styling"),
  features: z.array(z.enum(["variant", "size", "disabled", "loading"])).default(["variant", "size"]).describe("Component features to include"),
  styling: z.enum(["css-modules", "styled-components", "emotion"]).default("css-modules").describe("Styling approach to use"),
  animation: z.boolean().default(true).describe("Whether to include Framer Motion animations"),
  responsive: z.boolean().default(true).describe("Whether to include responsive design"),
  accessibility: z.boolean().default(true).describe("Whether to include WCAG 2.1 AA compliance"),
  generateFiles: z.boolean().default(false).describe("Whether to actually generate files (disabled for safety)")
});

export type ComponentGenerationRequest = z.infer<typeof ComponentGenerationSchema>;

export const ComponentComplianceValidationSchema = z.object({
  componentPath: z.string().min(1).describe("Path to component file to validate"),
  checkBrandTokens: z.boolean().default(true).describe("Whether to validate brand token usage"),
  checkAccessibility: z.boolean().default(true).describe("Whether to validate accessibility compliance"),
  checkPerformance: z.boolean().default(true).describe("Whether to validate performance optimizations"),
  checkResponsive: z.boolean().default(true).describe("Whether to validate responsive design")
});

export type ComponentComplianceValidationRequest = z.infer<typeof ComponentComplianceValidationSchema>;

export const ComponentArchitectureInsightsSchema = z.object({
  includePerformance: z.boolean().default(true).describe("Whether to include performance optimization insights"),
  includeAccessibility: z.boolean().default(true).describe("Whether to include accessibility insights"),
  includeBrandTokens: z.boolean().default(true).describe("Whether to include brand token insights"),
  includeRecommendations: z.boolean().default(true).describe("Whether to include architecture recommendations")
});

export type ComponentArchitectureInsightsRequest = z.infer<typeof ComponentArchitectureInsightsSchema>;

// Testing Strategy Intelligence schemas for Phase 4 capabilities
export const TestingNeedsAnalysisSchema = z.object({
  changedFiles: z.array(z.string()).default([]).describe("List of changed file paths to analyze"),
  context: z.enum(["main", "2", "mixed"]).default("main").describe("Development context (main portfolio or /2 redesign)"),
  timeConstraints: z.enum(["fast", "normal", "comprehensive"]).default("normal").describe("Time constraints for testing"),
  environment: z.enum(["local", "cloud-workstation", "codespaces", "gitpod"]).default("local").describe("Development environment"),
  priority: z.enum(["development", "pre-commit", "ci-cd"]).default("development").describe("Testing priority level"),
  includeRiskAssessment: z.boolean().default(true).describe("Whether to include risk assessment analysis")
});

export type TestingNeedsAnalysisRequest = z.infer<typeof TestingNeedsAnalysisSchema>;

export const TestingStrategySelectionSchema = z.object({
  changedFiles: z.array(z.string()).default([]).describe("List of changed file paths to analyze"),
  context: z.enum(["main", "2", "mixed"]).default("main").describe("Development context (main portfolio or /2 redesign)"),
  timeConstraints: z.enum(["fast", "normal", "comprehensive"]).default("normal").describe("Time constraints for testing"),
  environment: z.enum(["local", "cloud-workstation", "codespaces", "gitpod"]).default("local").describe("Development environment"),
  priority: z.enum(["development", "pre-commit", "ci-cd"]).default("development").describe("Testing priority level"),
  includeScreenshots: z.boolean().default(false).describe("Whether to include screenshot generation"),
  forceStrategy: z.string().optional().describe("Force specific testing strategy (smoke, component, visual, etc.)"),
  includeAlternatives: z.boolean().default(true).describe("Whether to include alternative strategy recommendations")
});

export type TestingStrategySelectionRequest = z.infer<typeof TestingStrategySelectionSchema>;

export const TestingRecommendationsSchema = z.object({
  scenario: z.enum(["quick-development", "pre-commit", "comprehensive-review", "visual-changes", "performance-critical"]).describe("Testing scenario to get recommendations for"),
  context: z.enum(["main", "2", "mixed"]).default("main").describe("Development context (main portfolio or /2 redesign)"),
  timeAvailable: z.string().default("5 minutes").describe("Available time for testing"),
  includeAlternatives: z.boolean().default(true).describe("Whether to include alternative strategies"),
  includeWorkflow: z.boolean().default(true).describe("Whether to include step-by-step workflow"),
  includeTips: z.boolean().default(true).describe("Whether to include pro tips and best practices")
});

export type TestingRecommendationsRequest = z.infer<typeof TestingRecommendationsSchema>;

export const TestingConfigurationValidationSchema = z.object({
  checkStrategies: z.boolean().default(true).describe("Whether to validate strategy configurations"),
  checkCommands: z.boolean().default(true).describe("Whether to validate command validity"),
  checkEnvironment: z.boolean().default(true).describe("Whether to validate environment variables"),
  includeOptimizations: z.boolean().default(true).describe("Whether to include optimization recommendations")
});

export type TestingConfigurationValidationRequest = z.infer<typeof TestingConfigurationValidationSchema>;

// Performance Monitoring Intelligence schemas for Phase 4 capabilities
export const PerformanceMonitoringSchema = z.object({
  context: z.enum(["main", "2", "mixed"]).default("main").describe("Development context (main portfolio or /2 redesign)"),
  includeBundle: z.boolean().default(true).describe("Whether to include bundle size analysis"),
  includeLighthouse: z.boolean().default(true).describe("Whether to include Lighthouse audit scores"),
  includeRegression: z.boolean().default(true).describe("Whether to check for performance regressions"),
  includeOptimizations: z.boolean().default(true).describe("Whether to include optimization recommendations"),
  realTime: z.boolean().default(false).describe("Whether to perform real-time monitoring")
});

export type PerformanceMonitoringRequest = z.infer<typeof PerformanceMonitoringSchema>;

export const PerformanceAspectAnalysisSchema = z.object({
  type: z.enum(["core-web-vitals", "lighthouse", "bundle-size", "animation", "css-performance"]).describe("Specific performance aspect to analyze"),
  context: z.enum(["main", "2", "mixed"]).default("main").describe("Development context (main portfolio or /2 redesign)"),
  includeRecommendations: z.boolean().default(true).describe("Whether to include specific recommendations"),
  includeOptimizations: z.boolean().default(true).describe("Whether to include optimization strategies")
});

export type PerformanceAspectAnalysisRequest = z.infer<typeof PerformanceAspectAnalysisSchema>;

export const PerformanceOptimizationSchema = z.object({
  context: z.enum(["main", "2", "mixed"]).default("main").describe("Development context (main portfolio or /2 redesign)"),
  priority: z.enum(["immediate", "short-term", "long-term", "all"]).default("all").describe("Priority level of optimizations"),
  category: z.enum(["core-web-vitals", "bundle", "animation", "css", "all"]).default("all").describe("Category of performance optimizations"),
  includeDetails: z.boolean().default(true).describe("Whether to include detailed descriptions and implementation guidance")
});

export type PerformanceOptimizationRequest = z.infer<typeof PerformanceOptimizationSchema>;

// Cross-System Coordinator Intelligence schemas for Phase 4 capabilities
export const CrossSystemHealthCheckSchema = z.object({
  includeInsights: z.boolean().default(true).describe("Whether to include coordination insights"),
  includeRecommendations: z.boolean().default(true).describe("Whether to include system recommendations"),
  format: z.enum(["summary", "detailed", "operational"]).default("detailed").describe("Format of health check output")
});

export type CrossSystemHealthCheckRequest = z.infer<typeof CrossSystemHealthCheckSchema>;

export const CrossSystemOperationPlanningSchema = z.object({
  operation: z.enum(["development", "testing", "validation", "deployment"]).describe("Type of operation to plan"),
  preferredSystem: z.enum(["mcp", "hooks", "auto"]).default("auto").describe("Preferred execution system"),
  enableFallback: z.boolean().default(true).describe("Whether to enable fallback strategies"),
  includeMonitoring: z.boolean().default(true).describe("Whether to include monitoring configuration")
});

export type CrossSystemOperationPlanningRequest = z.infer<typeof CrossSystemOperationPlanningSchema>;

export const CrossSystemFallbackExecutionSchema = z.object({
  trigger: z.enum(["timeout", "failure", "health-degradation", "manual"]).describe("What triggered the fallback"),
  fromSystem: z.enum(["mcp", "hooks"]).describe("System to fallback from"),
  operation: z.string().min(1).describe("Operation that requires fallback"),
  preserveState: z.boolean().default(true).describe("Whether to attempt state preservation")
});

export type CrossSystemFallbackExecutionRequest = z.infer<typeof CrossSystemFallbackExecutionSchema>;

export const CrossSystemInsightsSchema = z.object({
  includePerformance: z.boolean().default(true).describe("Whether to include performance analysis"),
  includeOptimizations: z.boolean().default(true).describe("Whether to include optimization recommendations"),
  includeAlternatives: z.boolean().default(true).describe("Whether to include alternative system options"),
  analysisDepth: z.enum(["basic", "detailed", "comprehensive"]).default("detailed").describe("Depth of insights analysis")
});

export type CrossSystemInsightsRequest = z.infer<typeof CrossSystemInsightsSchema>;

// MCP Tool Response - matches official CallToolResult interface
export interface MCPToolResponse {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
}

export interface DevServerResult {
  success: boolean;
  port?: number;
  url?: string;
  pid?: number;
  environment?: string;
  message: string;
  logs?: string[];
}

export interface TestExecutionResult {
  success: boolean;
  strategy: string;
  testsRun: number;
  testsPassed: number;
  testsFailed: number;
  duration: number;
  output: string;
  screenshotsGenerated?: string[];
  errors?: string[];
}

export interface PortDetectionResult {
  activeServers: Array<{
    port: number;
    url: string;
    pid?: number;
    processName?: string;
    healthy: boolean;
    responseTime?: number;
    lastChecked: Date;
  }>;
  recommendedPort?: number;
  scannedPorts: number;
  scanDuration: number;
  environment: string;
  environmentUrl?: string;
}

export interface QualityGatesResult {
  success: boolean;
  checks: {
    [key: string]: {
      passed: boolean;
      output: string;
      duration: number;
      errors?: string[];
    };
  };
  overallDuration: number;
  summary: string;
}

export interface FileOperationResult {
  operation: string;
  filePath: string;
  success: boolean;
  duration: number;
  content?: string;
  backupPath?: string;
  exists?: boolean;
  error?: string;
}

// Enhanced Documentation Query Result - Phase 3 Intelligence
export interface DocumentationQueryResult {
  files: Array<{
    path: string;
    title: string;
    relevantSections: string[];
  }>;
  totalMatches: number;
  searchDuration: number;
  // Enhanced intelligence fields
  primarySource?: string;
  supportingSources?: string[];
  contextualAdvice?: string;
  suggestedActions?: string[];
  confidence?: number;
  estimatedReadTime?: string;
}

// Contextual Guidance Result - New Enhanced Capability
export interface ContextualGuidanceResult {
  relevantDocs: string[];
  checklist: string[];
  warnings: string[];
  nextSteps: string[];
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  relatedWorkflows?: string[];
}

// Workflow Resolution Result - New Enhanced Capability
export interface WorkflowResolutionResult {
  steps: Array<{
    step: number;
    title: string;
    description: string;
    commands: string[];
    validation: string;
    troubleshooting: string[];
  }>;
  prerequisites: string[];
  estimatedTime: string;
  relatedWorkflows: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
}