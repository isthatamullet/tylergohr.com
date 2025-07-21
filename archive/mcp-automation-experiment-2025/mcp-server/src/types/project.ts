// Tyler Gohr Portfolio Project Context Types

export interface ProjectContext {
  projectRoot: string;
  environment: Environment;
  developmentContext: DevelopmentContext;
  activePort?: number;
  activeUrl?: string;
  lastUpdated: Date;
  
  // Project-specific configuration
  packageJson?: PackageJsonInfo;
  gitInfo?: GitInfo;
  hooksSystemAvailable: boolean;
  
  // Performance and quality metrics
  lastTestRun?: TestRunInfo;
  performanceBaseline?: PerformanceMetrics;
  qualityGateStatus?: QualityStatus;
}

export type Environment = 
  | "local" 
  | "cloud-workstation" 
  | "codespaces" 
  | "gitpod" 
  | "unknown";

export type DevelopmentContext = 
  | "main"        // Main portfolio development
  | "2"           // /2 redesign development
  | "mixed"       // Working across both
  | "unknown";

export interface PackageJsonInfo {
  name: string;
  version: string;
  scripts: string[];
  dependencies: string[];
  devDependencies: string[];
}

export interface GitInfo {
  branch: string;
  hasUnstagedChanges: boolean;
  hasStagedChanges: boolean;
  lastCommit?: {
    hash: string;
    message: string;
    author: string;
    date: Date;
  };
}

export interface TestRunInfo {
  strategy: string;
  timestamp: Date;
  success: boolean;
  duration: number;
  testsRun: number;
  testsPassed: number;
  testsFailed: number;
}

export interface PerformanceMetrics {
  bundleSize?: number;
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay  
  cls?: number; // Cumulative Layout Shift
  lighthouse?: number;
  lastMeasured: Date;
}

export interface QualityStatus {
  typescript: boolean;
  eslint: boolean;
  build: boolean;
  bundleSize: boolean;
  lastValidated: Date;
  errors?: string[];
}

// File change tracking
export interface FileChange {
  path: string;
  type: "added" | "modified" | "deleted";
  timestamp: Date;
  size?: number;
}

// Test strategy configuration (from hooks system)
export interface TestStrategy {
  name: string;
  command: string;
  description: string;
  estimatedTime: string;
  coverage: string;
  environment: Record<string, string>;
}

// Protection levels for files
export type ProtectionLevel = 
  | "critical"      // package.json, next.config.js, etc.
  | "important"     // CLAUDE.md, README.md, etc.
  | "design_system" // brand-tokens.css, globals.css
  | "configuration" // .env*, eslint.config.js, etc.
  | "none";

export interface ProtectedFile {
  path: string;
  level: ProtectionLevel;
  reason: string;
  requiresConfirmation: boolean;
  backupRecommended: boolean;
}

// Documentation structure
export interface DocumentationFile {
  path: string;
  title: string;
  description: string;
  sections: DocumentationSection[];
  lastModified: Date;
}

export interface DocumentationSection {
  title: string;
  content: string;
  lineStart: number;
  lineEnd: number;
  tags: string[];
}

// Cloud environment detection
export interface CloudEnvironmentInfo {
  type: Environment;
  detected: boolean;
  indicators: string[];
  urlPattern?: string;
  limitations?: string[];
  optimizations?: string[];
}

// Port and server information
export interface ServerInfo {
  port: number;
  url: string;
  pid?: number;
  processName?: string;
  healthy: boolean;
  responseTime?: number;
  lastChecked: Date;
}

// Sub-agent integration (from hooks system)
export interface SubAgentRecommendation {
  agentType: "environment_setup_agent" | "test_execution_agent" | "timeout_prevention_agent" | "none";
  complexityScore: number;
  timeoutRisk: "low" | "medium" | "high";
  prompt: string;
  reasoning: string;
}