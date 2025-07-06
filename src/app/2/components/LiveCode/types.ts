// Core types for the live code demonstration system

export interface CodeExecutionResult {
  success: boolean;
  output?: unknown;
  error?: string;
  executionTime?: number;
  memoryUsage?: number;
  visualizationData?: VisualizationData;
}

export interface VisualizationData {
  type: 'component' | 'chart' | 'data-structure' | 'architecture' | 'performance';
  data: unknown;
  metadata?: {
    title?: string;
    description?: string;
    timestamp?: number;
  };
}

export interface CodeExecutionEngine {
  executeJavaScript: (code: string) => Promise<CodeExecutionResult>;
  executeTypeScript: (code: string) => Promise<CodeExecutionResult>;
  executeSQL: (query: string) => Promise<CodeExecutionResult>;
  executePython?: (code: string) => Promise<CodeExecutionResult>;
}

export interface CodeDemonstration {
  id: string;
  title: string;
  description: string;
  language: 'javascript' | 'typescript' | 'python' | 'sql';
  initialCode: string;
  completedCode?: string;
  businessValue: string;
  category: 'frontend' | 'backend' | 'database' | 'architecture' | 'performance';
  difficulty: 'beginner' | 'intermediate' | 'expert';
  visualizationType: VisualizationData['type'];
  estimatedTime?: number; // minutes
  learningObjectives?: string[];
}

export interface InteractiveCodeChallenge extends CodeDemonstration {
  challenges: CodeChallenge[];
  currentStep: number;
  completionCriteria: CompletionCriteria;
}

export interface CodeChallenge {
  stepNumber: number;
  title: string;
  description: string;
  hint?: string;
  startingCode: string;
  expectedOutput?: unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validationFunction?: (code: string, output: any) => boolean;
}

export interface CompletionCriteria {
  requiredSteps: number;
  timeLimit?: number; // minutes
  allowedErrors?: number;
  minimumScore?: number;
}

export interface CodeExecutionEnvironment {
  sandbox: {
    timeoutMs: number;
    memoryLimitMB: number;
    allowedGlobals: string[];
    blockedFunctions: string[];
  };
  visualization: {
    maxObjects: number;
    maxTriangles: number;
    enableWebGL: boolean;
    fallbackToCanvas: boolean;
  };
}

export interface EnterpriseCodeExample {
  title: string;
  description: string;
  businessScenario: string;
  initialCode: string;
  category: 'react' | 'api' | 'database' | 'architecture' | 'optimization';
  techStack: string[];
  visualizationType: VisualizationData['type'];
  businessValue: string;
  keyFeatures: string[];
}

// React Three Fiber visualization types
export interface React3DVisualizationProps {
  data: unknown;
  type: VisualizationData['type'];
  interactive?: boolean;
  autoRotate?: boolean;
  showControls?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onInteraction?: (event: any) => void;
}

// Performance monitoring types
export interface CodePerformanceMetrics {
  executionTime: number;
  memoryUsage: number;
  cpuUsage?: number;
  renderTime?: number;
  frameRate?: number;
}

// Mobile optimization types
export interface MobileCodeEditorConfig {
  enableTouchOptimization: boolean;
  virtualKeyboard: boolean;
  gestureNavigation: boolean;
  reducedFeatures?: boolean;
  fallbackToTextarea?: boolean;
}

// Accessibility types
export interface CodeEditorAccessibility {
  screenReaderSupport: boolean;
  keyboardNavigation: boolean;
  highContrastMode: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  voiceAnnouncements: boolean;
}

// Error handling types
export interface CodeExecutionError {
  type: 'syntax' | 'runtime' | 'timeout' | 'memory' | 'security';
  message: string;
  line?: number;
  column?: number;
  stack?: string;
  suggestion?: string;
}

// Integration types for scroll effects
export interface ScrollIntegratedCodeDemo {
  triggerPoint: number; // scroll percentage
  activationThreshold: number;
  deactivationThreshold: number;
  autoExecute: boolean;
  smoothTransition: boolean;
}

// Export types without default
export type {};