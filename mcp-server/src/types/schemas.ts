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