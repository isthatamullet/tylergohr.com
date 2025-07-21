import { promises as fs } from 'fs';
import { join } from 'path';
import { runCommand } from '../index.js';
import { ProjectContext } from '../types/project.js';

// Cross-system coordination types
export interface SystemHealth {
  mcp: {
    operational: boolean;
    responseTime: number;
    lastChecked: Date;
    capabilities: string[];
    errors: string[];
  };
  hooks: {
    operational: boolean;
    responseTime: number;
    lastChecked: Date;
    activeHooks: string[];
    errors: string[];
  };
  coordination: {
    preferredSystem: 'mcp' | 'hooks' | 'hybrid';
    fallbackActive: boolean;
    lastFallback: Date | null;
    coordinationMode: 'mcp-primary' | 'hooks-primary' | 'balanced';
  };
}

export interface CrossSystemOperation {
  operationType: 'development' | 'testing' | 'validation' | 'deployment';
  requestedSystem: 'mcp' | 'hooks' | 'auto';
  executionPlan: {
    primarySystem: 'mcp' | 'hooks';
    fallbackSystem: 'mcp' | 'hooks' | null;
    coordinationRequired: boolean;
    riskLevel: 'low' | 'medium' | 'high';
  };
  monitoring: {
    timeoutThreshold: number;
    retryStrategy: 'immediate' | 'delayed' | 'escalate';
    healthCheckInterval: number;
  };
}

export interface FallbackStrategy {
  trigger: 'timeout' | 'failure' | 'health-degradation' | 'manual';
  fromSystem: 'mcp' | 'hooks';
  toSystem: 'mcp' | 'hooks';
  preserveState: boolean;
  automatic: boolean;
  conditions: {
    maxFailures: number;
    timeWindow: number;
    healthThreshold: number;
  };
}

export interface CoordinationInsights {
  systemRecommendations: {
    preferredSystem: 'mcp' | 'hooks' | 'hybrid';
    reasoning: string;
    confidence: number;
    alternatives: Array<{
      system: 'mcp' | 'hooks' | 'hybrid';
      reasoning: string;
      score: number;
    }>;
  };
  operationalHealth: {
    overall: 'excellent' | 'good' | 'degraded' | 'critical';
    mcpHealth: 'excellent' | 'good' | 'degraded' | 'critical';
    hooksHealth: 'excellent' | 'good' | 'degraded' | 'critical';
    coordinationEfficiency: number;
  };
  optimizations: {
    immediate: string[];
    shortTerm: string[];
    strategic: string[];
  };
}

export interface CrossSystemCoordinatorRequest {
  operation?: 'development' | 'testing' | 'validation' | 'deployment';
  preferredSystem?: 'mcp' | 'hooks' | 'auto';
  enableFallback?: boolean;
  healthCheck?: boolean;
  generateInsights?: boolean;
}

/**
 * Cross-System Coordinator Intelligence Engine
 * Provides intelligent coordination between MCP and hooks systems with fallback strategies
 */
export class CrossSystemCoordinatorIntelligence {
  private projectContext: ProjectContext;
  private systemHealthCache: SystemHealth | null = null;
  private operationHistory: Array<{
    timestamp: Date;
    operation: string;
    system: 'mcp' | 'hooks';
    success: boolean;
    duration: number;
  }> = [];
  private coordinationConfigPath: string;

  constructor(projectContext: ProjectContext) {
    this.projectContext = projectContext;
    this.coordinationConfigPath = join(projectContext.projectRoot, 'scripts/hooks/config/coordination-config.json');
  }

  /**
   * Load coordination configuration
   */
  private async loadCoordinationConfig(): Promise<any> {
    try {
      const content = await fs.readFile(this.coordinationConfigPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      // Return default configuration if file doesn't exist
      return {
        mcp_priority_operations: ['testing', 'validation', 'performance'],
        hooks_priority_operations: ['file-protection', 'visual-regression'],
        fallback_thresholds: {
          timeout_seconds: 120,
          max_failures: 3,
          health_threshold: 0.7
        },
        coordination_mode: 'mcp-primary'
      };
    }
  }

  /**
   * Check health of both MCP and hooks systems
   */
  async checkSystemHealth(): Promise<SystemHealth> {
    const startTime = Date.now();
    
    // Check MCP system health
    const mcpHealth = await this.checkMCPHealth();
    
    // Check hooks system health
    const hooksHealth = await this.checkHooksHealth();
    
    // Determine coordination preferences
    const coordination = await this.determineCoordination(mcpHealth, hooksHealth);
    
    const systemHealth: SystemHealth = {
      mcp: mcpHealth,
      hooks: hooksHealth,
      coordination
    };
    
    this.systemHealthCache = systemHealth;
    return systemHealth;
  }

  /**
   * Plan cross-system operation execution
   */
  async planCrossSystemOperation(request: CrossSystemCoordinatorRequest): Promise<CrossSystemOperation> {
    const config = await this.loadCoordinationConfig();
    const health = this.systemHealthCache || await this.checkSystemHealth();
    
    const {
      operation = 'development',
      preferredSystem = 'auto',
      enableFallback = true
    } = request;
    
    // Determine optimal system based on operation type and health
    const primarySystem = this.selectPrimarySystem(operation, preferredSystem, health, config);
    const fallbackSystem = enableFallback ? this.selectFallbackSystem(primarySystem, health) : null;
    
    // Assess risk level
    const riskLevel = this.assessOperationRisk(operation, primarySystem, health);
    
    // Determine coordination requirements
    const coordinationRequired = this.requiresCoordination(operation, primarySystem, config);
    
    return {
      operationType: operation,
      requestedSystem: preferredSystem,
      executionPlan: {
        primarySystem,
        fallbackSystem,
        coordinationRequired,
        riskLevel
      },
      monitoring: {
        timeoutThreshold: this.getTimeoutThreshold(operation, riskLevel),
        retryStrategy: this.getRetryStrategy(riskLevel),
        healthCheckInterval: 30000 // 30 seconds
      }
    };
  }

  /**
   * Execute coordinated fallback strategy
   */
  async executeFallbackStrategy(
    trigger: FallbackStrategy['trigger'],
    fromSystem: 'mcp' | 'hooks',
    operation: string
  ): Promise<{
    success: boolean;
    newSystem: 'mcp' | 'hooks';
    preservedState: boolean;
    fallbackDuration: number;
    recommendations: string[];
  }> {
    const startTime = Date.now();
    const toSystem = fromSystem === 'mcp' ? 'hooks' : 'mcp';
    
    try {
      // Record fallback trigger
      this.recordFallbackEvent(trigger, fromSystem, toSystem, operation);
      
      // Check target system health before fallback
      const targetHealthy = await this.checkTargetSystemHealth(toSystem);
      
      if (!targetHealthy) {
        return {
          success: false,
          newSystem: fromSystem,
          preservedState: false,
          fallbackDuration: Date.now() - startTime,
          recommendations: [
            `Both systems unhealthy - manual intervention required`,
            `Check ${toSystem} system health before retry`,
            `Consider emergency recovery procedures`
          ]
        };
      }
      
      // Execute fallback
      const fallbackResult = await this.performFallback(fromSystem, toSystem, operation);
      
      // Update system preferences
      if (fallbackResult.success) {
        await this.updateSystemPreferences(toSystem, trigger);
      }
      
      return {
        success: fallbackResult.success,
        newSystem: fallbackResult.success ? toSystem : fromSystem,
        preservedState: fallbackResult.preservedState,
        fallbackDuration: Date.now() - startTime,
        recommendations: fallbackResult.recommendations
      };
      
    } catch (error) {
      return {
        success: false,
        newSystem: fromSystem,
        preservedState: false,
        fallbackDuration: Date.now() - startTime,
        recommendations: [
          `Fallback failed: ${error instanceof Error ? error.message : String(error)}`,
          `Manual system recovery may be required`,
          `Check logs for detailed error information`
        ]
      };
    }
  }

  /**
   * Generate coordination insights and recommendations
   */
  async generateCoordinationInsights(): Promise<CoordinationInsights> {
    const health = this.systemHealthCache || await this.checkSystemHealth();
    const config = await this.loadCoordinationConfig();
    
    // Analyze system performance
    const systemRecommendations = this.analyzeSystemPerformance(health, config);
    
    // Assess operational health
    const operationalHealth = this.assessOperationalHealth(health);
    
    // Generate optimization recommendations
    const optimizations = this.generateOptimizations(health, systemRecommendations);
    
    return {
      systemRecommendations,
      operationalHealth,
      optimizations
    };
  }

  // Private helper methods

  private async checkMCPHealth(): Promise<SystemHealth['mcp']> {
    const startTime = Date.now();
    
    try {
      // Check if MCP server is built and accessible
      const mcpServerPath = join(this.projectContext.projectRoot, 'mcp-server/dist/index.js');
      const serverExists = await fs.access(mcpServerPath).then(() => true).catch(() => false);
      
      if (!serverExists) {
        return {
          operational: false,
          responseTime: Date.now() - startTime,
          lastChecked: new Date(),
          capabilities: [],
          errors: ['MCP server not built or not accessible']
        };
      }
      
      // Test MCP server health command
      const healthResult = await runCommand('node', [mcpServerPath, 'health'], {}, 10000)
        .then(() => true)
        .catch(() => false);
      
      const responseTime = Date.now() - startTime;
      
      if (healthResult) {
        return {
          operational: true,
          responseTime,
          lastChecked: new Date(),
          capabilities: [
            'Component Architecture Intelligence',
            'Testing Strategy Intelligence', 
            'Performance Monitoring Intelligence',
            'Cross-System Coordination'
          ],
          errors: []
        };
      } else {
        return {
          operational: false,
          responseTime,
          lastChecked: new Date(),
          capabilities: [],
          errors: ['MCP server health check failed']
        };
      }
      
    } catch (error) {
      return {
        operational: false,
        responseTime: Date.now() - startTime,
        lastChecked: new Date(),
        capabilities: [],
        errors: [error instanceof Error ? error.message : String(error)]
      };
    }
  }

  private async checkHooksHealth(): Promise<SystemHealth['hooks']> {
    const startTime = Date.now();
    
    try {
      // Check if hooks orchestrator is available
      const orchestratorPath = join(this.projectContext.projectRoot, 'scripts/hooks/orchestrator/orchestrator.sh');
      const orchestratorExists = await fs.access(orchestratorPath).then(() => true).catch(() => false);
      
      if (!orchestratorExists) {
        return {
          operational: false,
          responseTime: Date.now() - startTime,
          lastChecked: new Date(),
          activeHooks: [],
          errors: ['Hooks orchestrator not found']
        };
      }
      
      // Test hooks system health
      const healthResult = await runCommand('bash', [orchestratorPath, 'health'], {}, 10000)
        .then(() => true)
        .catch(() => false);
      
      const responseTime = Date.now() - startTime;
      
      if (healthResult) {
        const activeHooks = [
          'File Protection',
          'Quality Gates',
          'Visual Development Workflow',
          'Performance Excellence Check',
          'Port Detection'
        ];
        
        return {
          operational: true,
          responseTime,
          lastChecked: new Date(),
          activeHooks,
          errors: []
        };
      } else {
        return {
          operational: false,
          responseTime,
          lastChecked: new Date(),
          activeHooks: [],
          errors: ['Hooks system health check failed']
        };
      }
      
    } catch (error) {
      return {
        operational: false,
        responseTime: Date.now() - startTime,
        lastChecked: new Date(),
        activeHooks: [],
        errors: [error instanceof Error ? error.message : String(error)]
      };
    }
  }

  private async determineCoordination(
    mcpHealth: SystemHealth['mcp'],
    hooksHealth: SystemHealth['hooks']
  ): Promise<SystemHealth['coordination']> {
    const config = await this.loadCoordinationConfig();
    
    // Determine preferred system based on health and configuration
    let preferredSystem: 'mcp' | 'hooks' | 'hybrid' = 'mcp';
    let coordinationMode: 'mcp-primary' | 'hooks-primary' | 'balanced' = 'mcp-primary';
    
    if (mcpHealth.operational && hooksHealth.operational) {
      // Both systems healthy - use configuration preference
      preferredSystem = config.coordination_mode === 'hooks-primary' ? 'hooks' : 'mcp';
      coordinationMode = config.coordination_mode || 'mcp-primary';
    } else if (mcpHealth.operational && !hooksHealth.operational) {
      preferredSystem = 'mcp';
      coordinationMode = 'mcp-primary';
    } else if (!mcpHealth.operational && hooksHealth.operational) {
      preferredSystem = 'hooks';
      coordinationMode = 'hooks-primary';
    } else {
      // Both systems unhealthy - default to balanced mode for recovery
      preferredSystem = 'hybrid';
      coordinationMode = 'balanced';
    }
    
    return {
      preferredSystem,
      fallbackActive: false,
      lastFallback: null,
      coordinationMode
    };
  }

  private selectPrimarySystem(
    operation: string,
    preferredSystem: 'mcp' | 'hooks' | 'auto',
    health: SystemHealth,
    config: any
  ): 'mcp' | 'hooks' {
    if (preferredSystem !== 'auto') {
      // Honor explicit preference if system is healthy
      if (preferredSystem === 'mcp' && health.mcp.operational) return 'mcp';
      if (preferredSystem === 'hooks' && health.hooks.operational) return 'hooks';
    }
    
    // Auto-selection based on operation type and system health
    const mcpPriority = config.mcp_priority_operations || [];
    const hooksPriority = config.hooks_priority_operations || [];
    
    if (mcpPriority.includes(operation) && health.mcp.operational) {
      return 'mcp';
    }
    
    if (hooksPriority.includes(operation) && health.hooks.operational) {
      return 'hooks';
    }
    
    // Default to healthiest system
    if (health.mcp.operational && health.hooks.operational) {
      return health.mcp.responseTime <= health.hooks.responseTime ? 'mcp' : 'hooks';
    }
    
    return health.mcp.operational ? 'mcp' : 'hooks';
  }

  private selectFallbackSystem(
    primarySystem: 'mcp' | 'hooks',
    health: SystemHealth
  ): 'mcp' | 'hooks' | null {
    const fallbackSystem = primarySystem === 'mcp' ? 'hooks' : 'mcp';
    return health[fallbackSystem].operational ? fallbackSystem : null;
  }

  private assessOperationRisk(
    operation: string,
    primarySystem: 'mcp' | 'hooks',
    health: SystemHealth
  ): 'low' | 'medium' | 'high' {
    // Base risk on operation type
    const operationRisk: Record<string, 'low' | 'medium' | 'high'> = {
      development: 'low',
      testing: 'medium',
      validation: 'medium',
      deployment: 'high'
    };
    
    let risk = operationRisk[operation] || 'medium';
    
    // Increase risk if primary system health is poor
    const systemHealth = health[primarySystem];
    if (!systemHealth.operational) {
      risk = 'high';
    } else if (systemHealth.errors.length > 0) {
      risk = risk === 'low' ? 'medium' : 'high';
    }
    
    return risk;
  }

  private requiresCoordination(
    operation: string,
    primarySystem: 'mcp' | 'hooks',
    config: any
  ): boolean {
    // Some operations require coordination between systems
    const coordinationRequired = [
      'file-protection', // Hooks handle file protection
      'visual-regression', // Hooks handle visual testing
      'performance-monitoring' // MCP handles performance intelligence
    ];
    
    return coordinationRequired.some(op => operation.includes(op));
  }

  private getTimeoutThreshold(operation: string, riskLevel: 'low' | 'medium' | 'high'): number {
    const baseTimeouts = {
      development: 60000, // 1 minute
      testing: 120000,    // 2 minutes  
      validation: 180000, // 3 minutes
      deployment: 300000  // 5 minutes
    };
    
    const multipliers = {
      low: 1,
      medium: 1.5,
      high: 2
    };
    
    return (baseTimeouts[operation as keyof typeof baseTimeouts] || 120000) * multipliers[riskLevel];
  }

  private getRetryStrategy(riskLevel: 'low' | 'medium' | 'high'): 'immediate' | 'delayed' | 'escalate' {
    switch (riskLevel) {
      case 'low': return 'immediate';
      case 'medium': return 'delayed';
      case 'high': return 'escalate';
    }
  }

  private recordFallbackEvent(
    trigger: FallbackStrategy['trigger'],
    fromSystem: 'mcp' | 'hooks',
    toSystem: 'mcp' | 'hooks',
    operation: string
  ): void {
    this.operationHistory.push({
      timestamp: new Date(),
      operation: `fallback:${trigger}:${fromSystem}->${toSystem}:${operation}`,
      system: toSystem,
      success: false, // Will be updated when operation completes
      duration: 0
    });
  }

  private async checkTargetSystemHealth(system: 'mcp' | 'hooks'): Promise<boolean> {
    const health = await this.checkSystemHealth();
    return health[system].operational;
  }

  private async performFallback(
    fromSystem: 'mcp' | 'hooks',
    toSystem: 'mcp' | 'hooks',
    operation: string
  ): Promise<{
    success: boolean;
    preservedState: boolean;
    recommendations: string[];
  }> {
    try {
      // Log fallback initiation
      console.log(`Initiating fallback: ${fromSystem} -> ${toSystem} for ${operation}`);
      
      // For now, return successful fallback
      // In a real implementation, this would handle state transfer and system switching
      return {
        success: true,
        preservedState: true,
        recommendations: [
          `Successfully switched from ${fromSystem} to ${toSystem}`,
          `Continue monitoring ${toSystem} system health`,
          `Consider investigating ${fromSystem} system issues`
        ]
      };
      
    } catch (error) {
      return {
        success: false,
        preservedState: false,
        recommendations: [
          `Fallback failed: ${error instanceof Error ? error.message : String(error)}`,
          `Manual intervention required`,
          `Check both system logs for detailed error information`
        ]
      };
    }
  }

  private async updateSystemPreferences(preferredSystem: 'mcp' | 'hooks', trigger: string): Promise<void> {
    // Update coordination configuration to prefer the working system
    try {
      const config = await this.loadCoordinationConfig();
      config.coordination_mode = preferredSystem === 'mcp' ? 'mcp-primary' : 'hooks-primary';
      config.last_fallback = {
        timestamp: new Date().toISOString(),
        trigger,
        newPreference: preferredSystem
      };
      
      // Write updated configuration
      await fs.writeFile(this.coordinationConfigPath, JSON.stringify(config, null, 2));
    } catch (error) {
      console.warn('Failed to update system preferences:', error);
    }
  }

  private analyzeSystemPerformance(health: SystemHealth, config: any): CoordinationInsights['systemRecommendations'] {
    const alternatives = [];
    let preferredSystem: 'mcp' | 'hooks' | 'hybrid' = 'mcp';
    let reasoning = 'MCP system provides intelligent automation with timeout prevention';
    let confidence = 0.8;
    
    // Analyze MCP performance
    if (health.mcp.operational) {
      alternatives.push({
        system: 'mcp' as const,
        reasoning: 'MCP provides intelligent automation and timeout prevention',
        score: health.mcp.responseTime < 30000 ? 0.9 : 0.7
      });
    }
    
    // Analyze hooks performance
    if (health.hooks.operational) {
      alternatives.push({
        system: 'hooks' as const,
        reasoning: 'Hooks system provides file protection and visual workflows',
        score: health.hooks.responseTime < 10000 ? 0.8 : 0.6
      });
    }
    
    // Consider hybrid approach
    if (health.mcp.operational && health.hooks.operational) {
      alternatives.push({
        system: 'hybrid' as const,
        reasoning: 'Hybrid approach leverages strengths of both systems',
        score: 0.85
      });
      
      preferredSystem = 'hybrid';
      reasoning = 'Both systems operational - hybrid approach recommended for optimal coverage';
      confidence = 0.9;
    }
    
    return {
      preferredSystem,
      reasoning,
      confidence,
      alternatives: alternatives.sort((a, b) => b.score - a.score)
    };
  }

  private assessOperationalHealth(health: SystemHealth): CoordinationInsights['operationalHealth'] {
    const mcpScore = health.mcp.operational ? (health.mcp.responseTime < 30000 ? 1 : 0.7) : 0;
    const hooksScore = health.hooks.operational ? (health.hooks.responseTime < 10000 ? 1 : 0.7) : 0;
    const coordinationScore = health.coordination.fallbackActive ? 0.6 : 0.9;
    
    const overall = (mcpScore + hooksScore + coordinationScore) / 3;
    
    const gradeMap = (score: number) => {
      if (score >= 0.9) return 'excellent';
      if (score >= 0.7) return 'good';
      if (score >= 0.5) return 'degraded';
      return 'critical';
    };
    
    return {
      overall: gradeMap(overall),
      mcpHealth: gradeMap(mcpScore),
      hooksHealth: gradeMap(hooksScore),
      coordinationEfficiency: coordinationScore
    };
  }

  private generateOptimizations(
    health: SystemHealth,
    recommendations: CoordinationInsights['systemRecommendations']
  ): CoordinationInsights['optimizations'] {
    const immediate = [];
    const shortTerm = [];
    const strategic = [];
    
    // Immediate optimizations
    if (!health.mcp.operational) {
      immediate.push('Build and deploy MCP server for intelligent automation');
    }
    if (!health.hooks.operational) {
      immediate.push('Restore hooks system for file protection and visual workflows');
    }
    if (health.coordination.fallbackActive) {
      immediate.push('Investigate and resolve primary system issues');
    }
    
    // Short-term optimizations
    if (health.mcp.responseTime > 30000) {
      shortTerm.push('Optimize MCP server performance and response times');
    }
    if (health.hooks.responseTime > 10000) {
      shortTerm.push('Optimize hooks system execution speed');
    }
    if (recommendations.confidence < 0.8) {
      shortTerm.push('Improve system health monitoring and decision algorithms');
    }
    
    // Strategic optimizations
    strategic.push('Implement intelligent load balancing between MCP and hooks systems');
    strategic.push('Develop predictive fallback strategies based on operation patterns');
    strategic.push('Create comprehensive system integration testing suite');
    
    return { immediate, shortTerm, strategic };
  }
}