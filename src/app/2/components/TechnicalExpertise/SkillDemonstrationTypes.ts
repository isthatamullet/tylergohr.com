/**
 * Type definitions for Phase 3.3 Week 3 - 3D Skill Demonstrations
 * 
 * Purpose: TypeScript interfaces for advanced 3D skill visualization,
 * progression timelines, and technology-specific demonstrations.
 */

import * as THREE from 'three';

/**
 * 3D Skill Card with advanced interactive effects
 */
export interface SkillCard3D {
  id: string;
  title: string;
  category: string;
  proficiencyLevel: number;
  yearsExperience: number;
  technologies: string[];
  skills: string[];
  experience: string;
  currentExample: string;
  projects: string[];
  achievement: string;
  icon: string;
  
  // 3D-specific properties
  visualization: {
    type: '3d-skill-orbit' | '3d-technology-demo' | '3d-progression-display';
    particleCount: number;
    animationDuration: number;
    interactionRadius: number;
    interactionLevel: 'basic' | 'detailed' | 'expert';
    animationComplexity: 'low' | 'medium' | 'high';
    businessMetrics: Array<{
      label: string;
      value: number;
      color: string;
    }>;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
  
  // Business value and credibility
  businessValue: string;
  achievements: string[];
  certifications?: string[];
  
  // Performance configuration
  performance: {
    desktopComplexity: 'high' | 'medium' | 'low';
    mobileComplexity: 'high' | 'medium' | 'low';
    targetFPS: number;
    fallbackMode: '2d-card' | 'static-display';
  };
}

/**
 * Skill progression timeline with 3D visualization
 */
export interface SkillProgression3D {
  id: string;
  title: string;
  timespan: {
    start: number; // Year
    end: number;   // Year or current
    duration: string;
  };
  
  // Timeline visualization
  timeline: {
    milestones: Milestone3D[];
    progressionCurve: THREE.Vector3[];
    visualization: {
      type: '3d-timeline' | '3d-growth-curve' | '3d-skill-tree';
      complexity: 'enterprise' | 'standard' | 'simplified';
    };
  };
  
  // Current capabilities
  currentState: {
    proficiencyLevel: number; // 1-10 scale
    activeProjects: string[];
    recentAchievements: string[];
    technologyMastery: TechnologyMastery3D[];
  };
}

/**
 * Timeline milestone with 3D positioning
 */
export interface Milestone3D {
  id: string;
  year: number;
  title: string;
  description: string;
  significance: 'major' | 'standard' | 'minor';
  
  // 3D visualization
  position: THREE.Vector3;
  visualization: {
    nodeSize: number;
    glowIntensity: number;
    connectionStrength: number;
    animationDelay: number;
  };
  
  // Achievement details
  achievement: {
    type: 'promotion' | 'project' | 'certification' | 'innovation' | 'leadership';
    impact: string;
    technologiesLearned: string[];
    businessValue: string;
  };
}

/**
 * Technology mastery with 3D demonstration capability
 */
export interface TechnologyMastery3D {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'cloud' | 'database' | 'tools' | 'leadership';
  proficiencyLevel: number; // 1-10 scale
  yearsExperience: number;
  
  // 3D demonstration
  demonstration: {
    type: 'live-code' | '3d-architecture' | 'interactive-example' | 'case-study-link';
    visualizationData?: unknown;
    exampleProjects: string[];
    businessApplications: string[];
  };
  
  // Visual representation
  visualization: {
    color: string;
    size: number;
    animationType: 'orbit' | 'pulse' | 'grow' | 'float';
    interactionEffects: InteractionEffect3D[];
  };
}

/**
 * 3D interaction effects for technology demonstrations
 */
export interface InteractionEffect3D {
  trigger: 'hover' | 'click' | 'scroll' | 'focus';
  effect: {
    type: 'scale' | 'rotation' | 'color-change' | 'particle-burst' | 'info-display';
    duration: number;
    intensity: number;
    easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  };
  
  // Content to display
  content?: {
    title: string;
    description: string;
    codeExample?: string;
    businessValue?: string;
  };
}

/**
 * Technology-specific 3D visualization configuration
 */
export interface TechnologyVisualization3D {
  id: string;
  technology: string;
  category: 'frontend' | 'backend' | 'cloud' | 'database' | 'tools';
  
  // 3D scene configuration
  scene: {
    type: 'component-tree' | 'data-flow' | 'architecture-diagram' | 'code-execution';
    complexity: 'enterprise' | 'standard' | 'simplified';
    elements: TechnologyElement3D[];
  };
  
  // Real-world examples
  examples: {
    projectName: string;
    implementation: string;
    businessImpact: string;
    codeSnippet?: string;
    architectureDiagram?: string;
  }[];
  
  // Performance requirements
  performance: {
    targetFPS: number;
    maxComplexity: number;
    mobileOptimized: boolean;
    fallbackStrategy: 'reduce-complexity' | 'disable-3d' | 'static-display';
  };
}

/**
 * Individual elements in technology 3D visualization
 */
export interface TechnologyElement3D {
  id: string;
  label: string;
  type: 'node' | 'connection' | 'data-flow' | 'component' | 'service';
  position: THREE.Vector3;
  scale: THREE.Vector3;
  
  // Visual properties
  material: {
    color: string;
    opacity: number;
    metalness?: number;
    roughness?: number;
    emissive?: string;
  };
  
  // Interaction behavior
  interactions: {
    expandable: boolean;
    clickable: boolean;
    hoverable: boolean;
    detailLevel: 'overview' | 'detailed' | 'expert';
  };
  
  // Content and information
  content: {
    title: string;
    description: string;
    technicalDetails: string;
    businessValue: string;
    relatedTechnologies: string[];
  };
}

/**
 * Device capability and performance configuration
 */
export interface DeviceCapability3D {
  tier: 'high' | 'medium' | 'low';
  webglSupport: boolean;
  estimatedPerformance: number; // 1-10 scale
  
  // Recommended settings
  settings: {
    maxParticles: number;
    animationQuality: 'high' | 'medium' | 'low';
    complexityReduction: number; // 0-1 scale
    effectsEnabled: {
      particles: boolean;
      glow: boolean;
      shadows: boolean;
      postProcessing: boolean;
    };
  };
}

/**
 * Animation configuration for 3D skill demonstrations
 */
export interface Animation3DConfig {
  type: 'entrance' | 'idle' | 'interaction' | 'transition' | 'exit';
  duration: number;
  easing: string;
  delay?: number;
  
  // Transform properties
  transform: {
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    scale?: THREE.Vector3;
  };
  
  // Material properties
  material?: {
    opacity?: number;
    color?: string;
    emissive?: string;
  };
  
  // Performance considerations
  performance: {
    priority: 'high' | 'medium' | 'low';
    canSkip: boolean;
    reducedMotionAlternative?: Animation3DConfig;
  };
}

/**
 * 3D Skill demonstration component props
 */
export interface SkillDemonstration3DProps {
  skill: SkillCard3D;
  isActive: boolean;
  isVisible: boolean;
  interactionMode: 'desktop' | 'mobile' | 'touch';
  
  // Performance settings
  qualityLevel: 'high' | 'medium' | 'low';
  enableInteractions: boolean;
  enableAnimations: boolean;
  
  // Event handlers
  onSkillHover?: (skillId: string, hovered: boolean) => void;
  onSkillClick?: (skillId: string) => void;
  onVisualizationLoad?: (skillId: string, loadTime: number) => void;
  onPerformanceIssue?: (skillId: string, issue: string) => void;
  
  // Layout and styling
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Error handling for 3D skill demonstrations
 */
export interface SkillDemonstrationError {
  type: 'webgl-failure' | 'performance-issue' | 'resource-load-error' | 'interaction-error';
  skillId: string;
  message: string;
  stack?: string;
  recovery: {
    fallbackMode: 'reduce-complexity' | 'disable-3d' | 'show-static';
    retryable: boolean;
    userMessage: string;
  };
}

/**
 * Performance metrics for 3D skill demonstrations
 */
export interface SkillDemonstrationMetrics {
  skillId: string;
  renderTime: number;
  frameRate: number;
  memoryUsage: number;
  interactionLatency: number;
  
  // Quality assessment
  quality: {
    visualFidelity: number; // 1-10 scale
    smoothness: number;     // 1-10 scale
    responsiveness: number; // 1-10 scale
    stability: number;      // 1-10 scale
  };
  
  // Recommendations
  recommendations: {
    complexityAdjustment: number; // -1 to 1 scale
    qualityLevel: 'high' | 'medium' | 'low';
    enableAdvancedEffects: boolean;
  };
}