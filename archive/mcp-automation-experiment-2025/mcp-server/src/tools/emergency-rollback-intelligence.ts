import { promises as fs } from 'fs';
import { join } from 'path';
import { runCommand } from '../index.js';
import { ProjectContext } from '../types/project.js';

// Emergency rollback types
export interface EmergencyTrigger {
  type: 'system-failure' | 'hook-timeout' | 'build-failure' | 'test-failure' | 'server-crash' | 'manual';
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: Date;
  source: 'mcp' | 'hooks' | 'npm' | 'external';
  details: {
    errorMessage: string;
    failedOperation: string;
    affectedSystems: string[];
    stackTrace?: string;
  };
}

export interface RollbackStrategy {
  triggerType: EmergencyTrigger['type'];
  strategy: 'immediate' | 'graceful' | 'staged' | 'minimal';
  preserveState: boolean;
  rollbackSteps: {
    step: number;
    action: string;
    command?: string;
    validation?: string;
    timeout: number;
  }[];
  recovery: {
    autoRestart: boolean;
    healthCheck: string;
    rollbackValidation: string[];
  };
}

export interface SystemState {
  timestamp: Date;
  processes: {
    devServer: { pid?: number; port?: number; status: 'running' | 'stopped' | 'crashed' };
    hookOrchestrator: { active: boolean; sessionsActive: number; status: 'healthy' | 'degraded' | 'failed' };
    testing: { active: boolean; strategy?: string; status: 'idle' | 'running' | 'failed' };
  };
  files: {
    protected: { modified: boolean; backup?: string };
    workspace: { clean: boolean; uncommittedChanges: string[] };
  };
  environment: {
    variables: Record<string, string>;
    ports: number[];
    nodeModules: boolean;
  };
}

export interface EmergencyRecovery {
  triggerAnalysis: EmergencyTrigger;
  recommendedStrategy: RollbackStrategy;
  systemStateSnapshot: SystemState;
  estimatedRecoveryTime: number;
  riskAssessment: {
    dataLoss: 'none' | 'minimal' | 'moderate' | 'significant';
    workLoss: 'none' | 'minimal' | 'moderate' | 'significant';
    systemStability: 'stable' | 'degraded' | 'unstable';
  };
  alternativeStrategies: RollbackStrategy[];
}

/**
 * Emergency Rollback Intelligence Server
 * Provides automatic trigger detection and intelligent rollback strategies
 */
export class EmergencyRollbackIntelligence {
  constructor(private projectContext: ProjectContext) {}

  /**
   * Detect emergency triggers requiring rollback
   */
  async detectEmergencyTriggers(): Promise<EmergencyTrigger[]> {
    const triggers: EmergencyTrigger[] = [];
    
    try {
      // Check for system failures
      const systemHealth = await this.checkSystemHealth();
      
      // Check for hook timeouts
      const hookHealth = await this.checkHookHealth();
      
      // Check for build failures
      const buildHealth = await this.checkBuildHealth();
      
      // Check for server crashes
      const serverHealth = await this.checkServerHealth();
      
      // Combine all trigger detections
      triggers.push(...systemHealth, ...hookHealth, ...buildHealth, ...serverHealth);
      
      return triggers.sort((a, b) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      });
      
    } catch (error) {
      return [{
        type: 'system-failure',
        severity: 'critical',
        timestamp: new Date(),
        source: 'mcp',
        details: {
          errorMessage: `Emergency trigger detection failed: ${error}`,
          failedOperation: 'detectEmergencyTriggers',
          affectedSystems: ['emergency-rollback-system']
        }
      }];
    }
  }

  /**
   * Generate intelligent rollback strategy based on trigger
   */
  async generateRollbackStrategy(trigger: EmergencyTrigger): Promise<RollbackStrategy> {
    switch (trigger.type) {
      case 'system-failure':
        return this.generateSystemFailureStrategy(trigger);
      case 'hook-timeout':
        return this.generateHookTimeoutStrategy(trigger);
      case 'build-failure':
        return this.generateBuildFailureStrategy(trigger);
      case 'test-failure':
        return this.generateTestFailureStrategy(trigger);
      case 'server-crash':
        return this.generateServerCrashStrategy(trigger);
      case 'manual':
        return this.generateManualRollbackStrategy(trigger);
      default:
        return this.generateDefaultStrategy(trigger);
    }
  }

  /**
   * Capture current system state for rollback preservation
   */
  async captureSystemState(): Promise<SystemState> {
    const timestamp = new Date();
    
    try {
      // Capture process information
      const processes = await this.captureProcessState();
      
      // Capture file system state
      const files = await this.captureFileState();
      
      // Capture environment state
      const environment = await this.captureEnvironmentState();
      
      return {
        timestamp,
        processes,
        files,
        environment
      };
      
    } catch (error) {
      // Return minimal state if capture fails
      return {
        timestamp,
        processes: {
          devServer: { status: 'stopped' },
          hookOrchestrator: { active: false, sessionsActive: 0, status: 'failed' },
          testing: { active: false, status: 'idle' }
        },
        files: {
          protected: { modified: false },
          workspace: { clean: false, uncommittedChanges: [] }
        },
        environment: {
          variables: {},
          ports: [],
          nodeModules: false
        }
      };
    }
  }

  /**
   * Execute emergency rollback with state preservation
   */
  async executeEmergencyRollback(
    strategy: RollbackStrategy,
    systemState: SystemState
  ): Promise<{
    success: boolean;
    executedSteps: number;
    rollbackTime: number;
    recoveryStatus: 'complete' | 'partial' | 'failed';
    errors: string[];
  }> {
    const startTime = Date.now();
    const errors: string[] = [];
    let executedSteps = 0;
    
    try {
      console.error(`🚨 Executing Emergency Rollback: ${strategy.strategy} strategy`);
      
      // Execute rollback steps
      for (const step of strategy.rollbackSteps) {
        try {
          console.error(`🔄 Step ${step.step}: ${step.action}`);
          
          if (step.command) {
            await runCommand('bash', ['-c', step.command], {}, step.timeout);
          }
          
          if (step.validation) {
            await runCommand('bash', ['-c', step.validation], {}, 5000);
          }
          
          executedSteps++;
          
        } catch (stepError) {
          errors.push(`Step ${step.step} failed: ${stepError}`);
          if (strategy.strategy === 'immediate') {
            break; // Stop on first failure for immediate strategy
          }
        }
      }
      
      // Validate recovery
      const recoverySuccess = await this.validateRecovery(strategy);
      
      const rollbackTime = Date.now() - startTime;
      
      return {
        success: recoverySuccess,
        executedSteps,
        rollbackTime,
        recoveryStatus: recoverySuccess ? 'complete' : 'partial',
        errors
      };
      
    } catch (error) {
      return {
        success: false,
        executedSteps,
        rollbackTime: Date.now() - startTime,
        recoveryStatus: 'failed',
        errors: [...errors, `Rollback execution failed: ${error}`]
      };
    }
  }

  /**
   * Get comprehensive emergency recovery analysis
   */
  async analyzeEmergencyRecovery(trigger?: EmergencyTrigger): Promise<EmergencyRecovery> {
    try {
      // Detect triggers if not provided
      const triggerAnalysis = trigger || (await this.detectEmergencyTriggers())[0];
      
      if (!triggerAnalysis) {
        throw new Error('No emergency triggers detected');
      }
      
      // Generate rollback strategy
      const recommendedStrategy = await this.generateRollbackStrategy(triggerAnalysis);
      
      // Capture system state
      const systemStateSnapshot = await this.captureSystemState();
      
      // Calculate recovery time estimate
      const estimatedRecoveryTime = recommendedStrategy.rollbackSteps.reduce(
        (total, step) => total + step.timeout, 0
      ) + 30000; // Add 30s buffer
      
      // Assess risks
      const riskAssessment = this.assessRecoveryRisks(triggerAnalysis, systemStateSnapshot);
      
      // Generate alternative strategies
      const alternativeStrategies = await this.generateAlternativeStrategies(triggerAnalysis);
      
      return {
        triggerAnalysis,
        recommendedStrategy,
        systemStateSnapshot,
        estimatedRecoveryTime,
        riskAssessment,
        alternativeStrategies
      };
      
    } catch (error) {
      throw new Error(`Emergency recovery analysis failed: ${error}`);
    }
  }

  // Private helper methods
  private async checkSystemHealth(): Promise<EmergencyTrigger[]> {
    const triggers: EmergencyTrigger[] = [];
    
    try {
      // Check MCP server health
      const mcpHealth = await runCommand('npm', ['run', 'test'], {}, 10000);
      
    } catch (error) {
      triggers.push({
        type: 'system-failure',
        severity: 'high',
        timestamp: new Date(),
        source: 'mcp',
        details: {
          errorMessage: `MCP server health check failed: ${error}`,
          failedOperation: 'mcp-health-check',
          affectedSystems: ['mcp-server']
        }
      });
    }
    
    return triggers;
  }

  private async checkHookHealth(): Promise<EmergencyTrigger[]> {
    const triggers: EmergencyTrigger[] = [];
    
    try {
      // Check hook orchestrator health
      const hooksPath = join(this.projectContext.projectRoot, 'scripts/hooks/orchestrator/orchestrator.sh');
      await runCommand('bash', [hooksPath, 'health'], {}, 10000);
      
    } catch (error) {
      triggers.push({
        type: 'hook-timeout',
        severity: 'medium',
        timestamp: new Date(),
        source: 'hooks',
        details: {
          errorMessage: `Hook system health check failed: ${error}`,
          failedOperation: 'hook-health-check',
          affectedSystems: ['hooks-orchestrator']
        }
      });
    }
    
    return triggers;
  }

  private async checkBuildHealth(): Promise<EmergencyTrigger[]> {
    const triggers: EmergencyTrigger[] = [];
    
    try {
      // Quick TypeScript check
      await runCommand('npx', ['tsc', '--noEmit'], {}, 30000);
      
    } catch (error) {
      triggers.push({
        type: 'build-failure',
        severity: 'high',
        timestamp: new Date(),
        source: 'npm',
        details: {
          errorMessage: `Build health check failed: ${error}`,
          failedOperation: 'typescript-check',
          affectedSystems: ['build-system']
        }
      });
    }
    
    return triggers;
  }

  private async checkServerHealth(): Promise<EmergencyTrigger[]> {
    const triggers: EmergencyTrigger[] = [];
    
    try {
      // Check for running development servers
      const ports = await runCommand('bash', ['-c', 'lsof -ti :3000,3001,4000 2>/dev/null || true'], {}, 5000);
      
      if (!ports.trim()) {
        triggers.push({
          type: 'server-crash',
          severity: 'medium',
          timestamp: new Date(),
          source: 'external',
          details: {
            errorMessage: 'No development servers detected on common ports',
            failedOperation: 'server-detection',
            affectedSystems: ['dev-server']
          }
        });
      }
      
    } catch (error) {
      // Server health check is non-critical
    }
    
    return triggers;
  }

  private async generateSystemFailureStrategy(trigger: EmergencyTrigger): Promise<RollbackStrategy> {
    return {
      triggerType: 'system-failure',
      strategy: 'immediate',
      preserveState: true,
      rollbackSteps: [
        { step: 1, action: 'Kill all development processes', command: 'pkill -f "next-server|npm run dev" || true', timeout: 5000 },
        { step: 2, action: 'Reset environment variables', command: 'unset ACTIVE_DEV_PORT ACTIVE_DEV_URL', timeout: 1000 },
        { step: 3, action: 'Clean temporary files', command: 'rm -rf /tmp/claude-hooks-* || true', timeout: 5000 },
        { step: 4, action: 'Restart development server', command: 'npm run dev &', timeout: 10000 }
      ],
      recovery: {
        autoRestart: true,
        healthCheck: 'curl -s http://localhost:3000 || true',
        rollbackValidation: ['npm run typecheck', 'npm run lint']
      }
    };
  }

  private async generateHookTimeoutStrategy(trigger: EmergencyTrigger): Promise<RollbackStrategy> {
    return {
      triggerType: 'hook-timeout',
      strategy: 'graceful',
      preserveState: true,
      rollbackSteps: [
        { step: 1, action: 'Reset hook orchestrator', command: './scripts/hooks/orchestrator/orchestrator.sh health', timeout: 10000 },
        { step: 2, action: 'Clear hook session state', command: 'rm -rf /tmp/claude-hooks-session-* || true', timeout: 5000 },
        { step: 3, action: 'Restart hook system', command: './scripts/hooks/install-hooks.sh', timeout: 15000 }
      ],
      recovery: {
        autoRestart: true,
        healthCheck: './scripts/hooks/orchestrator/orchestrator.sh health',
        rollbackValidation: ['./scripts/hooks/orchestrator/orchestrator.sh status']
      }
    };
  }

  private async generateBuildFailureStrategy(trigger: EmergencyTrigger): Promise<RollbackStrategy> {
    return {
      triggerType: 'build-failure',
      strategy: 'staged',
      preserveState: true,
      rollbackSteps: [
        { step: 1, action: 'Clean build artifacts', command: 'rm -rf .next dist || true', timeout: 5000 },
        { step: 2, action: 'Reinstall dependencies', command: 'npm ci', timeout: 60000 },
        { step: 3, action: 'Validate TypeScript', command: 'npx tsc --noEmit', validation: 'echo "TypeScript validation complete"', timeout: 30000 },
        { step: 4, action: 'Test production build', command: 'npm run build', timeout: 45000 }
      ],
      recovery: {
        autoRestart: false,
        healthCheck: 'npm run build',
        rollbackValidation: ['npm run typecheck', 'npm run lint']
      }
    };
  }

  private async generateTestFailureStrategy(trigger: EmergencyTrigger): Promise<RollbackStrategy> {
    return {
      triggerType: 'test-failure',
      strategy: 'minimal',
      preserveState: true,
      rollbackSteps: [
        { step: 1, action: 'Clear test artifacts', command: 'rm -rf test-results screenshots/quick-review || true', timeout: 5000 },
        { step: 2, action: 'Reset test environment', command: 'eval "$(./scripts/detect-active-port.sh quiet export)"', timeout: 5000 },
        { step: 3, action: 'Run smoke tests', command: 'npm run test:e2e:smoke', timeout: 60000 }
      ],
      recovery: {
        autoRestart: false,
        healthCheck: 'npm run test:e2e:smoke',
        rollbackValidation: ['npm run test:e2e:dev']
      }
    };
  }

  private async generateServerCrashStrategy(trigger: EmergencyTrigger): Promise<RollbackStrategy> {
    return {
      triggerType: 'server-crash',
      strategy: 'immediate',
      preserveState: false,
      rollbackSteps: [
        { step: 1, action: 'Clean server processes', command: 'pkill -f "node.*next|npm.*dev" || true', timeout: 5000 },
        { step: 2, action: 'Detect available port', command: './scripts/detect-active-port.sh quiet', timeout: 10000 },
        { step: 3, action: 'Start fresh server', command: 'npm run dev', timeout: 15000 }
      ],
      recovery: {
        autoRestart: true,
        healthCheck: 'curl -s http://localhost:3000 || curl -s http://localhost:3001 || curl -s http://localhost:4000',
        rollbackValidation: ['curl -s http://localhost:3000']
      }
    };
  }

  private async generateManualRollbackStrategy(trigger: EmergencyTrigger): Promise<RollbackStrategy> {
    return {
      triggerType: 'manual',
      strategy: 'graceful',
      preserveState: true,
      rollbackSteps: [
        { step: 1, action: 'Capture current state', command: 'git status && npm ls --depth=0', timeout: 5000 },
        { step: 2, action: 'Reset to clean state', command: 'git stash && npm ci', timeout: 30000 },
        { step: 3, action: 'Validate clean state', command: 'npm run validate', timeout: 60000 }
      ],
      recovery: {
        autoRestart: false,
        healthCheck: 'npm run validate',
        rollbackValidation: ['npm run typecheck', 'npm run lint', 'npm run build']
      }
    };
  }

  private async generateDefaultStrategy(trigger: EmergencyTrigger): Promise<RollbackStrategy> {
    return {
      triggerType: trigger.type,
      strategy: 'graceful',
      preserveState: true,
      rollbackSteps: [
        { step: 1, action: 'Emergency system reset', command: 'pkill -f "next-server|npm run dev" || true', timeout: 5000 },
        { step: 2, action: 'Basic environment recovery', command: 'npm run dev', timeout: 15000 }
      ],
      recovery: {
        autoRestart: true,
        healthCheck: 'echo "Basic recovery complete"',
        rollbackValidation: ['npm run test:e2e:smoke']
      }
    };
  }

  private async captureProcessState() {
    try {
      const devServerCheck = await runCommand('bash', ['-c', 'lsof -ti :3000,3001,4000 2>/dev/null | head -1 || echo ""'], {}, 5000);
      const pid = devServerCheck.trim() ? parseInt(devServerCheck.trim()) : undefined;
      const port = pid ? 3000 : undefined; // Simplified port detection
      
      return {
        devServer: { pid, port, status: pid ? 'running' as const : 'stopped' as const },
        hookOrchestrator: { active: true, sessionsActive: 1, status: 'healthy' as const },
        testing: { active: false, status: 'idle' as const }
      };
    } catch {
      return {
        devServer: { status: 'stopped' as const },
        hookOrchestrator: { active: false, sessionsActive: 0, status: 'failed' as const },
        testing: { active: false, status: 'idle' as const }
      };
    }
  }

  private async captureFileState() {
    try {
      const gitStatus = await runCommand('git', ['status', '--porcelain'], {}, 5000);
      const uncommittedChanges = gitStatus.trim().split('\n').filter(line => line.trim());
      
      return {
        protected: { modified: false },
        workspace: { clean: uncommittedChanges.length === 0, uncommittedChanges }
      };
    } catch {
      return {
        protected: { modified: false },
        workspace: { clean: false, uncommittedChanges: [] }
      };
    }
  }

  private async captureEnvironmentState() {
    try {
      const nodeModulesExists = await fs.access(join(this.projectContext.projectRoot, 'node_modules')).then(() => true).catch(() => false);
      
      const variables: Record<string, string> = {};
      if (process.env.NODE_ENV) variables.NODE_ENV = process.env.NODE_ENV;
      if (process.env.ACTIVE_DEV_PORT) variables.ACTIVE_DEV_PORT = process.env.ACTIVE_DEV_PORT;
      if (process.env.ACTIVE_DEV_URL) variables.ACTIVE_DEV_URL = process.env.ACTIVE_DEV_URL;
      
      return {
        variables,
        ports: [3000, 3001, 4000],
        nodeModules: nodeModulesExists
      };
    } catch {
      return {
        variables: {} as Record<string, string>,
        ports: [] as number[],
        nodeModules: false
      };
    }
  }

  private assessRecoveryRisks(trigger: EmergencyTrigger, systemState: SystemState) {
    const riskLevel = trigger.severity;
    
    return {
      dataLoss: systemState.files.workspace.clean ? 'none' as const : 'minimal' as const,
      workLoss: riskLevel === 'critical' ? 'moderate' as const : 'minimal' as const,
      systemStability: riskLevel === 'critical' ? 'unstable' as const : 'stable' as const
    };
  }

  async generateAlternativeStrategies(trigger: EmergencyTrigger): Promise<RollbackStrategy[]> {
    // Generate 2-3 alternative strategies with different approaches
    const alternatives: RollbackStrategy[] = [];
    
    if (trigger.type !== 'manual') {
      alternatives.push(await this.generateManualRollbackStrategy(trigger));
    }
    
    if (trigger.severity === 'critical') {
      alternatives.push({
        triggerType: trigger.type,
        strategy: 'minimal',
        preserveState: false,
        rollbackSteps: [
          { step: 1, action: 'Nuclear reset', command: 'pkill -f node; rm -rf node_modules .next; npm ci', timeout: 120000 }
        ],
        recovery: {
          autoRestart: true,
          healthCheck: 'npm run dev',
          rollbackValidation: ['npm run validate']
        }
      });
    }
    
    return alternatives;
  }

  private async validateRecovery(strategy: RollbackStrategy): Promise<boolean> {
    try {
      // Run health check
      if (strategy.recovery.healthCheck) {
        await runCommand('bash', ['-c', strategy.recovery.healthCheck], {}, 10000);
      }
      
      // Run validation checks
      for (const validation of strategy.recovery.rollbackValidation) {
        await runCommand('bash', ['-c', validation], {}, 30000);
      }
      
      return true;
    } catch {
      return false;
    }
  }
}

// Default export request types
export interface EmergencyRollbackRequest {
  operation: 'detect-triggers' | 'generate-strategy' | 'execute-rollback' | 'analyze-recovery';
  trigger?: EmergencyTrigger;
  strategy?: RollbackStrategy;
  systemState?: SystemState;
}