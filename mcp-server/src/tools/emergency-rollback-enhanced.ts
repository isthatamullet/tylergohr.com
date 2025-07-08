import { ProjectContext } from '../types/project.js';
import {
  EmergencyRollbackIntelligence,
  EmergencyRollbackRequest,
  EmergencyTrigger,
  RollbackStrategy,
  SystemState,
  EmergencyRecovery
} from './emergency-rollback-intelligence.js';

/**
 * Enhanced MCP tools for Emergency Rollback Intelligence
 * Provides automatic trigger detection and intelligent rollback strategies
 */

/**
 * Detect emergency triggers requiring rollback
 */
export async function detectEmergencyTriggersMCP(
  args: {
    includeMinor?: boolean;
    checkSystems?: ('mcp' | 'hooks' | 'build' | 'server')[];
    format?: 'summary' | 'detailed' | 'actionable';
  },
  projectContext: ProjectContext
): Promise<{
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
}> {
  try {
    const intelligence = new EmergencyRollbackIntelligence(projectContext);
    const triggers = await intelligence.detectEmergencyTriggers();
    
    const { includeMinor = false, checkSystems = ['mcp', 'hooks', 'build', 'server'], format = 'detailed' } = args;
    
    // Filter triggers based on options
    const filteredTriggers = triggers.filter(trigger => {
      if (!includeMinor && trigger.severity === 'low') return false;
      return true;
    });
    
    if (filteredTriggers.length === 0) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            status: "healthy",
            message: "No emergency triggers detected",
            systemsChecked: checkSystems,
            timestamp: new Date().toISOString(),
            recommendation: "System is stable - no rollback required"
          }, null, 2)
        }]
      };
    }
    
    // Format response based on requested format
    let response: string;
    
    switch (format) {
      case 'summary':
        response = JSON.stringify({
          status: "triggers-detected",
          triggerCount: filteredTriggers.length,
          highestSeverity: filteredTriggers[0]?.severity,
          criticalTriggers: filteredTriggers.filter(t => t.severity === 'critical').length,
          recommendation: filteredTriggers.length > 0 ? "Emergency rollback recommended" : "Monitor system"
        }, null, 2);
        break;
        
      case 'actionable':
        const criticalTriggers = filteredTriggers.filter(t => t.severity === 'critical');
        response = JSON.stringify({
          status: "triggers-detected",
          immediateAction: criticalTriggers.length > 0 ? "EXECUTE_EMERGENCY_ROLLBACK" : "MONITOR_AND_PREPARE",
          triggers: filteredTriggers.map(trigger => ({
            type: trigger.type,
            severity: trigger.severity,
            source: trigger.source,
            errorMessage: trigger.details.errorMessage,
            affectedSystems: trigger.details.affectedSystems,
            suggestedAction: trigger.severity === 'critical' ? 'immediate-rollback' : 'prepare-rollback'
          }))
        }, null, 2);
        break;
        
      default: // detailed
        response = JSON.stringify({
          status: "triggers-detected",
          timestamp: new Date().toISOString(),
          analysis: {
            triggerCount: filteredTriggers.length,
            severityBreakdown: {
              critical: filteredTriggers.filter(t => t.severity === 'critical').length,
              high: filteredTriggers.filter(t => t.severity === 'high').length,
              medium: filteredTriggers.filter(t => t.severity === 'medium').length,
              low: filteredTriggers.filter(t => t.severity === 'low').length
            }
          },
          triggers: filteredTriggers,
          recommendation: {
            action: filteredTriggers.some(t => t.severity === 'critical') ? "Execute immediate rollback" : "Prepare rollback strategy",
            urgency: filteredTriggers[0]?.severity || 'low',
            nextSteps: [
              "Review trigger details",
              "Generate rollback strategy",
              "Capture system state",
              "Execute rollback if critical"
            ]
          }
        }, null, 2);
    }
    
    return {
      content: [{
        type: "text",
        text: response
      }]
    };
    
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          error: "Emergency trigger detection failed",
          message: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
          fallbackAction: "Manual system check recommended"
        }, null, 2)
      }],
      isError: true
    };
  }
}

/**
 * Generate intelligent rollback strategy
 */
export async function generateRollbackStrategyMCP(
  args: {
    triggerType: EmergencyTrigger['type'];
    severity: EmergencyTrigger['severity'];
    preferredStrategy?: 'immediate' | 'graceful' | 'staged' | 'minimal';
    preserveState?: boolean;
    includeAlternatives?: boolean;
  },
  projectContext: ProjectContext
): Promise<{
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
}> {
  try {
    const intelligence = new EmergencyRollbackIntelligence(projectContext);
    
    // Create trigger for strategy generation
    const trigger: EmergencyTrigger = {
      type: args.triggerType,
      severity: args.severity,
      timestamp: new Date(),
      source: 'mcp',
      details: {
        errorMessage: `Manual rollback strategy generation for ${args.triggerType}`,
        failedOperation: 'strategy-generation',
        affectedSystems: ['development-environment']
      }
    };
    
    const strategy = await intelligence.generateRollbackStrategy(trigger);
    
    // Override strategy type if preferred
    if (args.preferredStrategy) {
      strategy.strategy = args.preferredStrategy;
    }
    
    if (args.preserveState !== undefined) {
      strategy.preserveState = args.preserveState;
    }
    
    let response: any = {
      triggerType: args.triggerType,
      severity: args.severity,
      recommendedStrategy: strategy,
      estimatedTime: strategy.rollbackSteps.reduce((total, step) => total + step.timeout, 0),
      riskAssessment: {
        dataLoss: strategy.preserveState ? 'minimal' : 'moderate',
        complexity: strategy.rollbackSteps.length > 3 ? 'high' : 'medium',
        successProbability: strategy.strategy === 'minimal' ? 'high' : 'medium'
      }
    };
    
    // Include alternatives if requested
    if (args.includeAlternatives) {
      const alternatives = await intelligence.generateAlternativeStrategies(trigger);
      response.alternativeStrategies = alternatives;
    }
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(response, null, 2)
      }]
    };
    
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          error: "Rollback strategy generation failed",
          message: error instanceof Error ? error.message : String(error),
          fallbackStrategy: {
            type: 'emergency-reset',
            steps: [
              'Kill all development processes',
              'Reset environment',
              'Restart development server'
            ]
          }
        }, null, 2)
      }],
      isError: true
    };
  }
}

/**
 * Execute emergency rollback
 */
export async function executeEmergencyRollbackMCP(
  args: {
    strategy?: RollbackStrategy;
    triggerType?: EmergencyTrigger['type'];
    dryRun?: boolean;
    confirmExecution?: boolean;
  },
  projectContext: ProjectContext
): Promise<{
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
}> {
  try {
    const intelligence = new EmergencyRollbackIntelligence(projectContext);
    
    // Require confirmation for actual execution
    if (!args.dryRun && !args.confirmExecution) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            status: "confirmation-required",
            message: "Emergency rollback execution requires explicit confirmation",
            usage: "Set confirmExecution: true to proceed with actual rollback",
            recommendation: "Run with dryRun: true first to preview actions"
          }, null, 2)
        }]
      };
    }
    
    // Get or generate strategy
    let strategy = args.strategy;
    if (!strategy && args.triggerType) {
      const trigger: EmergencyTrigger = {
        type: args.triggerType,
        severity: 'high',
        timestamp: new Date(),
        source: 'mcp',
        details: {
          errorMessage: `Manual rollback execution for ${args.triggerType}`,
          failedOperation: 'rollback-execution',
          affectedSystems: ['development-environment']
        }
      };
      strategy = await intelligence.generateRollbackStrategy(trigger);
    }
    
    if (!strategy) {
      throw new Error('No rollback strategy provided or generated');
    }
    
    // Capture system state before rollback
    const systemState = await intelligence.captureSystemState();
    
    if (args.dryRun) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            status: "dry-run",
            strategy: strategy,
            systemState: systemState,
            plannedActions: strategy.rollbackSteps.map(step => ({
              step: step.step,
              action: step.action,
              command: step.command || 'N/A',
              estimatedTime: `${step.timeout}ms`
            })),
            estimatedTotalTime: strategy.rollbackSteps.reduce((total, step) => total + step.timeout, 0),
            note: "This is a dry run - no actual changes will be made"
          }, null, 2)
        }]
      };
    }
    
    // Execute actual rollback
    const result = await intelligence.executeEmergencyRollback(strategy, systemState);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          status: result.success ? "rollback-completed" : "rollback-failed",
          execution: result,
          strategy: strategy,
          preRollbackState: systemState,
          recovery: {
            success: result.success,
            time: `${result.rollbackTime}ms`,
            stepsCompleted: `${result.executedSteps}/${strategy.rollbackSteps.length}`
          },
          nextSteps: result.success ? [
            "Verify system functionality",
            "Run health checks",
            "Resume development"
          ] : [
            "Review errors",
            "Try alternative strategy",
            "Manual intervention may be required"
          ]
        }, null, 2)
      }],
      isError: !result.success
    };
    
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          error: "Emergency rollback execution failed",
          message: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
          fallbackAction: "Manual system recovery required"
        }, null, 2)
      }],
      isError: true
    };
  }
}

/**
 * Get comprehensive emergency recovery analysis
 */
export async function analyzeEmergencyRecoveryMCP(
  args: {
    includePreventionTips?: boolean;
    includeSystemHealth?: boolean;
    analysisDepth?: 'basic' | 'detailed' | 'comprehensive';
  },
  projectContext: ProjectContext
): Promise<{
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
}> {
  try {
    const intelligence = new EmergencyRollbackIntelligence(projectContext);
    const recovery = await intelligence.analyzeEmergencyRecovery();
    
    const { 
      includePreventionTips = true, 
      includeSystemHealth = true, 
      analysisDepth = 'detailed' 
    } = args;
    
    let response: any = {
      timestamp: new Date().toISOString(),
      recoveryAnalysis: recovery,
      status: recovery.triggerAnalysis ? "emergency-detected" : "system-healthy"
    };
    
    if (analysisDepth === 'comprehensive') {
      // Add comprehensive analysis
      response.riskMatrix = {
        immediate: recovery.riskAssessment.systemStability === 'unstable',
        dataIntegrity: recovery.riskAssessment.dataLoss,
        workContinuity: recovery.riskAssessment.workLoss,
        recoveryComplexity: recovery.alternativeStrategies.length > 2 ? 'high' : 'medium'
      };
      
      response.strategicInsights = {
        recommendedAction: recovery.triggerAnalysis.severity === 'critical' ? 
          'Execute immediate rollback' : 'Prepare rollback strategy',
        timeToRecover: `${Math.round(recovery.estimatedRecoveryTime / 1000)}s`,
        confidenceLevel: recovery.recommendedStrategy.strategy === 'minimal' ? 'high' : 'medium',
        alternativeCount: recovery.alternativeStrategies.length
      };
    }
    
    if (includeSystemHealth) {
      response.systemHealth = {
        processes: recovery.systemStateSnapshot.processes,
        environment: recovery.systemStateSnapshot.environment,
        workspace: recovery.systemStateSnapshot.files.workspace
      };
    }
    
    if (includePreventionTips) {
      response.preventionTips = [
        "Regular system health monitoring prevents emergencies",
        "Automated quality gates catch issues early",
        "State preservation during development reduces rollback risk",
        "Hook system timeout management prevents cascade failures",
        "Development environment isolation improves stability"
      ];
    }
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(response, null, 2)
      }]
    };
    
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          error: "Emergency recovery analysis failed",
          message: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
          basicRecovery: {
            steps: [
              "Check system processes",
              "Verify development server status", 
              "Run basic health checks",
              "Restart services if needed"
            ]
          }
        }, null, 2)
      }],
      isError: true
    };
  }
}