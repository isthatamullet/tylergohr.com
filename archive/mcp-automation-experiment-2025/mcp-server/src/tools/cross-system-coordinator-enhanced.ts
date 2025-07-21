import { ProjectContext } from '../types/project.js';
import {
  CrossSystemCoordinatorIntelligence,
  CrossSystemCoordinatorRequest,
  SystemHealth,
  CrossSystemOperation,
  CoordinationInsights
} from './cross-system-coordinator-intelligence.js';

/**
 * Enhanced MCP tools for Cross-System Coordinator Intelligence
 * Provides intelligent coordination between MCP and hooks systems with fallback strategies
 */

/**
 * Check health of both MCP and hooks systems with coordination analysis
 */
export async function checkSystemHealthMCP(
  args: {
    includeInsights?: boolean;
    includeRecommendations?: boolean;
    format?: 'summary' | 'detailed' | 'operational';
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
    const {
      includeInsights = true,
      includeRecommendations = true,
      format = 'detailed'
    } = args;

    const coordinator = new CrossSystemCoordinatorIntelligence(projectContext);
    const health = await coordinator.checkSystemHealth();
    
    let response = `# Cross-System Health Status\\n\\n`;

    // Overall coordination status
    const overallHealthy = health.mcp.operational || health.hooks.operational;
    const healthIcon = overallHealthy ? '🟢' : '🔴';
    
    response += `## Overall System Status\\n\\n`;
    response += `${healthIcon} **Cross-System Coordination**: ${overallHealthy ? 'OPERATIONAL' : 'DEGRADED'}\\n`;
    response += `🎯 **Preferred System**: ${health.coordination.preferredSystem.toUpperCase()}\\n`;
    response += `🔄 **Coordination Mode**: ${health.coordination.coordinationMode.replace('-', ' ').toUpperCase()}\\n`;
    response += `⚡ **Fallback Active**: ${health.coordination.fallbackActive ? 'YES' : 'NO'}\\n\\n`;

    // MCP System Health
    response += `## MCP System Health\\n\\n`;
    const mcpIcon = health.mcp.operational ? '🟢' : '🔴';
    response += `${mcpIcon} **Status**: ${health.mcp.operational ? 'OPERATIONAL' : 'OFFLINE'}\\n`;
    response += `📊 **Response Time**: ${health.mcp.responseTime}ms\\n`;
    response += `🕒 **Last Checked**: ${health.mcp.lastChecked.toLocaleTimeString()}\\n`;
    
    if (health.mcp.capabilities.length > 0) {
      response += `\\n**Capabilities**:\\n`;
      for (const capability of health.mcp.capabilities) {
        response += `- ✅ ${capability}\\n`;
      }
    }
    
    if (health.mcp.errors.length > 0) {
      response += `\\n**Issues**:\\n`;
      for (const error of health.mcp.errors) {
        response += `- ❌ ${error}\\n`;
      }
    }
    response += `\\n`;

    // Hooks System Health
    response += `## Hooks System Health\\n\\n`;
    const hooksIcon = health.hooks.operational ? '🟢' : '🔴';
    response += `${hooksIcon} **Status**: ${health.hooks.operational ? 'OPERATIONAL' : 'OFFLINE'}\\n`;
    response += `📊 **Response Time**: ${health.hooks.responseTime}ms\\n`;
    response += `🕒 **Last Checked**: ${health.hooks.lastChecked.toLocaleTimeString()}\\n`;
    
    if (health.hooks.activeHooks.length > 0) {
      response += `\\n**Active Hooks**:\\n`;
      for (const hook of health.hooks.activeHooks) {
        response += `- ✅ ${hook}\\n`;
      }
    }
    
    if (health.hooks.errors.length > 0) {
      response += `\\n**Issues**:\\n`;
      for (const error of health.hooks.errors) {
        response += `- ❌ ${error}\\n`;
      }
    }
    response += `\\n`;

    // Include insights if requested
    if (includeInsights) {
      const insights = await coordinator.generateCoordinationInsights();
      
      response += `## Coordination Insights\\n\\n`;
      response += `**Recommended System**: ${insights.systemRecommendations.preferredSystem.toUpperCase()}\\n`;
      response += `**Reasoning**: ${insights.systemRecommendations.reasoning}\\n`;
      response += `**Confidence**: ${Math.round(insights.systemRecommendations.confidence * 100)}%\\n\\n`;
      
      if (insights.systemRecommendations.alternatives.length > 0) {
        response += `**Alternatives**:\\n`;
        for (const alt of insights.systemRecommendations.alternatives) {
          response += `- **${alt.system.toUpperCase()}** (${Math.round(alt.score * 100)}%): ${alt.reasoning}\\n`;
        }
        response += `\\n`;
      }
      
      // Operational health summary
      response += `**System Health Summary**:\\n`;
      response += `- Overall: ${insights.operationalHealth.overall.toUpperCase()}\\n`;
      response += `- MCP Health: ${insights.operationalHealth.mcpHealth.toUpperCase()}\\n`;
      response += `- Hooks Health: ${insights.operationalHealth.hooksHealth.toUpperCase()}\\n`;
      response += `- Coordination Efficiency: ${Math.round(insights.operationalHealth.coordinationEfficiency * 100)}%\\n\\n`;
    }

    // Include recommendations if requested
    if (includeRecommendations && includeInsights) {
      const insights = await coordinator.generateCoordinationInsights();
      
      if (insights.optimizations.immediate.length > 0) {
        response += `## Immediate Actions Required\\n\\n`;
        for (const action of insights.optimizations.immediate) {
          response += `⚡ ${action}\\n`;
        }
        response += `\\n`;
      }
      
      if (insights.optimizations.shortTerm.length > 0) {
        response += `## Short-term Optimizations\\n\\n`;
        for (const optimization of insights.optimizations.shortTerm) {
          response += `📅 ${optimization}\\n`;
        }
        response += `\\n`;
      }
      
      if (insights.optimizations.strategic.length > 0) {
        response += `## Strategic Improvements\\n\\n`;
        for (const improvement of insights.optimizations.strategic) {
          response += `🎯 ${improvement}\\n`;
        }
        response += `\\n`;
      }
    }

    // Quick action guidance
    response += `## Quick Actions\\n\\n`;
    if (!health.mcp.operational && !health.hooks.operational) {
      response += `🚨 **CRITICAL**: Both systems offline - manual recovery required\\n`;
      response += `1. Check MCP server build: \`npm run build\` in mcp-server directory\\n`;
      response += `2. Check hooks system: \`./scripts/hooks/orchestrator/orchestrator.sh health\`\\n`;
      response += `3. Run system diagnostics for detailed error information\\n`;
    } else if (!health.mcp.operational) {
      response += `🔧 **MCP System Recovery**:\\n`;
      response += `1. Build MCP server: \`cd mcp-server && npm run build\`\\n`;
      response += `2. Test MCP health: \`node dist/index.js health\`\\n`;
      response += `3. Fallback to hooks system available if needed\\n`;
    } else if (!health.hooks.operational) {
      response += `🔧 **Hooks System Recovery**:\\n`;
      response += `1. Check hooks installation: \`./scripts/hooks/install-hooks.sh\`\\n`;
      response += `2. Test orchestrator: \`./scripts/hooks/orchestrator/orchestrator.sh health\`\\n`;
      response += `3. MCP system available as primary\\n`;
    } else {
      response += `✅ **Both systems operational** - coordination active\\n`;
      response += `💡 Use MCP-primary commands for best performance:\\n`;
      response += `- \`npm run dev:mcp-primary\` for development\\n`;
      response += `- \`npm run test:e2e:smoke:mcp-primary\` for testing\\n`;
      response += `- \`npm run validate:mcp-primary\` for validation\\n`;
    }

    return {
      content: [
        {
          type: "text" as const,
          text: response
        }
      ]
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      content: [
        {
          type: "text" as const,
          text: `❌ **Cross-System Health Check Error**\\n\\nFailed to check system health: ${errorMessage}\\n\\n**Troubleshooting Steps:**\\n1. Ensure you're in the project root directory\\n2. Check if MCP server is built (mcp-server/dist/index.js)\\n3. Verify hooks system is installed\\n4. Run individual system health checks manually`
        }
      ],
      isError: true
    };
  }
}

/**
 * Plan cross-system operation with intelligent coordination
 */
export async function planCrossSystemOperationMCP(
  args: {
    operation: 'development' | 'testing' | 'validation' | 'deployment';
    preferredSystem?: 'mcp' | 'hooks' | 'auto';
    enableFallback?: boolean;
    includeMonitoring?: boolean;
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
    const {
      operation,
      preferredSystem = 'auto',
      enableFallback = true,
      includeMonitoring = true
    } = args;

    const coordinator = new CrossSystemCoordinatorIntelligence(projectContext);
    
    const operationPlan = await coordinator.planCrossSystemOperation({
      operation,
      preferredSystem,
      enableFallback,
      healthCheck: true,
      generateInsights: true
    });

    let response = `# Cross-System Operation Plan\\n\\n`;

    // Operation overview
    response += `## Operation Overview\\n\\n`;
    response += `🎯 **Operation Type**: ${operation.toUpperCase()}\\n`;
    response += `🔧 **Requested System**: ${preferredSystem.toUpperCase()}\\n`;
    response += `⚡ **Primary System**: ${operationPlan.executionPlan.primarySystem.toUpperCase()}\\n`;
    response += `🔄 **Fallback System**: ${operationPlan.executionPlan.fallbackSystem?.toUpperCase() || 'NONE'}\\n`;
    response += `🎲 **Risk Level**: ${operationPlan.executionPlan.riskLevel.toUpperCase()}\\n`;
    response += `🤝 **Coordination Required**: ${operationPlan.executionPlan.coordinationRequired ? 'YES' : 'NO'}\\n\\n`;

    // Execution strategy
    response += `## Execution Strategy\\n\\n`;
    
    const riskIcon = operationPlan.executionPlan.riskLevel === 'low' ? '🟢' : 
                     operationPlan.executionPlan.riskLevel === 'medium' ? '🟡' : '🔴';
    
    response += `${riskIcon} **Risk Assessment**: ${operationPlan.executionPlan.riskLevel.toUpperCase()}\\n`;
    
    if (operationPlan.executionPlan.riskLevel === 'high') {
      response += `⚠️ **High Risk Operation** - Enhanced monitoring and fallback strategies active\\n`;
    }
    
    response += `\\n**Primary Execution**:\\n`;
    response += `1. Execute via ${operationPlan.executionPlan.primarySystem.toUpperCase()} system\\n`;
    response += `2. Monitor execution progress and health\\n`;
    response += `3. Apply timeout threshold: ${Math.round(operationPlan.monitoring.timeoutThreshold / 1000)}s\\n`;
    
    if (operationPlan.executionPlan.fallbackSystem) {
      response += `\\n**Fallback Strategy**:\\n`;
      response += `1. Automatic fallback to ${operationPlan.executionPlan.fallbackSystem.toUpperCase()} if primary fails\\n`;
      response += `2. Retry strategy: ${operationPlan.monitoring.retryStrategy.toUpperCase()}\\n`;
      response += `3. Preserve operation state during transition\\n`;
    }
    
    if (operationPlan.executionPlan.coordinationRequired) {
      response += `\\n**Cross-System Coordination**:\\n`;
      response += `1. Coordinate between MCP and hooks systems\\n`;
      response += `2. Ensure consistent state across systems\\n`;
      response += `3. Handle system-specific requirements\\n`;
    }
    response += `\\n`;

    // Monitoring configuration
    if (includeMonitoring) {
      response += `## Monitoring & Safety\\n\\n`;
      response += `⏱️ **Timeout Threshold**: ${Math.round(operationPlan.monitoring.timeoutThreshold / 1000)} seconds\\n`;
      response += `🔄 **Retry Strategy**: ${operationPlan.monitoring.retryStrategy.replace('-', ' ').toUpperCase()}\\n`;
      response += `💓 **Health Check Interval**: ${Math.round(operationPlan.monitoring.healthCheckInterval / 1000)} seconds\\n\\n`;
      
      response += `**Safety Measures**:\\n`;
      response += `- Continuous health monitoring of both systems\\n`;
      response += `- Automatic fallback on timeout or failure\\n`;
      response += `- Operation state preservation during transitions\\n`;
      response += `- Real-time error detection and reporting\\n\\n`;
    }

    // Recommended commands
    response += `## Recommended Commands\\n\\n`;
    
    const systemCommands = {
      mcp: {
        development: 'npm run dev:mcp-primary',
        testing: 'npm run test:e2e:smoke:mcp-primary',
        validation: 'npm run validate:mcp-primary',
        deployment: './scripts/mcp-primary.sh deploy'
      },
      hooks: {
        development: 'npm run dev:enhanced',
        testing: 'npm run test:e2e:smoke:enhanced',
        validation: 'npm run validate:enhanced',
        deployment: './scripts/hooks/deployment-workflow.sh'
      }
    };
    
    const primaryCmd = systemCommands[operationPlan.executionPlan.primarySystem]?.[operation];
    const fallbackCmd = operationPlan.executionPlan.fallbackSystem ? 
      systemCommands[operationPlan.executionPlan.fallbackSystem]?.[operation] : null;
    
    if (primaryCmd) {
      response += `**Primary Command**:\\n`;
      response += `\`\`\`bash\\n${primaryCmd}\\n\`\`\`\\n\\n`;
    }
    
    if (fallbackCmd) {
      response += `**Fallback Command** (if primary fails):\\n`;
      response += `\`\`\`bash\\n${fallbackCmd}\\n\`\`\`\\n\\n`;
    }

    // Success criteria
    response += `## Success Criteria\\n\\n`;
    response += `✅ **Operation Completion**: ${operation} executed successfully\\n`;
    response += `✅ **System Health**: Primary system remains operational\\n`;
    response += `✅ **Timeout Compliance**: Execution within ${Math.round(operationPlan.monitoring.timeoutThreshold / 1000)}s threshold\\n`;
    response += `✅ **State Consistency**: All systems maintain consistent state\\n`;
    
    if (operationPlan.executionPlan.coordinationRequired) {
      response += `✅ **Coordination Success**: Cross-system coordination completed\\n`;
    }

    return {
      content: [
        {
          type: "text" as const,
          text: response
        }
      ]
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      content: [
        {
          type: "text" as const,
          text: `❌ **Cross-System Operation Planning Error**\\n\\nFailed to plan operation: ${errorMessage}\\n\\n**Valid Operations:**\\n- development\\n- testing\\n- validation\\n- deployment\\n\\n**Valid Systems:**\\n- mcp (MCP intelligence system)\\n- hooks (Legacy hooks system)\\n- auto (Automatic selection)`
        }
      ],
      isError: true
    };
  }
}

/**
 * Execute coordinated fallback strategy
 */
export async function executeFallbackStrategyMCP(
  args: {
    trigger: 'timeout' | 'failure' | 'health-degradation' | 'manual';
    fromSystem: 'mcp' | 'hooks';
    operation: string;
    preserveState?: boolean;
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
    const {
      trigger,
      fromSystem,
      operation,
      preserveState = true
    } = args;

    const coordinator = new CrossSystemCoordinatorIntelligence(projectContext);
    
    const fallbackResult = await coordinator.executeFallbackStrategy(
      trigger,
      fromSystem,
      operation
    );

    let response = `# Fallback Strategy Execution\\n\\n`;

    // Fallback overview
    response += `## Fallback Overview\\n\\n`;
    response += `🔄 **Trigger**: ${trigger.replace('-', ' ').toUpperCase()}\\n`;
    response += `📤 **From System**: ${fromSystem.toUpperCase()}\\n`;
    response += `📥 **To System**: ${fallbackResult.newSystem.toUpperCase()}\\n`;
    response += `🎯 **Operation**: ${operation}\\n`;
    response += `⏱️ **Duration**: ${fallbackResult.fallbackDuration}ms\\n\\n`;

    // Execution results
    const statusIcon = fallbackResult.success ? '✅' : '❌';
    response += `## Execution Results\\n\\n`;
    response += `${statusIcon} **Status**: ${fallbackResult.success ? 'SUCCESS' : 'FAILED'}\\n`;
    response += `💾 **State Preserved**: ${fallbackResult.preservedState ? 'YES' : 'NO'}\\n`;
    response += `🔧 **New Active System**: ${fallbackResult.newSystem.toUpperCase()}\\n\\n`;

    // Recommendations
    if (fallbackResult.recommendations.length > 0) {
      response += `## Recommendations\\n\\n`;
      for (const [index, recommendation] of fallbackResult.recommendations.entries()) {
        response += `${index + 1}. ${recommendation}\\n`;
      }
      response += `\\n`;
    }

    // Next steps
    response += `## Next Steps\\n\\n`;
    
    if (fallbackResult.success) {
      response += `🎉 **Fallback Successful** - Continue with ${fallbackResult.newSystem.toUpperCase()} system\\n\\n`;
      response += `**Immediate Actions**:\\n`;
      response += `1. Continue operation using ${fallbackResult.newSystem.toUpperCase()} system\\n`;
      response += `2. Monitor ${fallbackResult.newSystem} system health\\n`;
      response += `3. Investigate ${fromSystem} system issues when convenient\\n\\n`;
      
      response += `**System Recovery**:\\n`;
      response += `1. Diagnose root cause of ${fromSystem} system failure\\n`;
      response += `2. Implement fixes and test ${fromSystem} system recovery\\n`;
      response += `3. Consider switching back to ${fromSystem} when stable\\n`;
    } else {
      response += `💥 **Fallback Failed** - Manual intervention required\\n\\n`;
      response += `**Critical Actions**:\\n`;
      response += `1. **STOP** automated operations immediately\\n`;
      response += `2. Manually check both system health status\\n`;
      response += `3. Contact system administrator if available\\n\\n`;
      
      response += `**Emergency Recovery**:\\n`;
      response += `1. Run comprehensive system diagnostics\\n`;
      response += `2. Check system logs for detailed error information\\n`;
      response += `3. Consider emergency rollback procedures\\n`;
      response += `4. Manual operation execution may be required\\n`;
    }

    // Command suggestions
    response += `\\n## Useful Commands\\n\\n`;
    response += `**System Health Check**:\\n`;
    response += `\`\`\`bash\\n`;
    response += `# Check cross-system health\\n`;
    response += `npm run phase4:status\\n\\n`;
    response += `# Check specific system health\\n`;
    if (fallbackResult.newSystem === 'mcp') {
      response += `node mcp-server/dist/index.js health\\n`;
    } else {
      response += `./scripts/hooks/orchestrator/orchestrator.sh health\\n`;
    }
    response += `\`\`\`\\n\\n`;
    
    response += `**Continue Operation**:\\n`;
    response += `\`\`\`bash\\n`;
    if (fallbackResult.newSystem === 'mcp') {
      response += `# Use MCP system commands\\n`;
      response += `npm run dev:mcp-primary\\n`;
      response += `npm run test:e2e:smoke:mcp-primary\\n`;
      response += `npm run validate:mcp-primary\\n`;
    } else {
      response += `# Use hooks system commands\\n`;
      response += `npm run dev:enhanced\\n`;
      response += `npm run test:e2e:smoke:enhanced\\n`;
      response += `npm run validate:enhanced\\n`;
    }
    response += `\`\`\``;

    return {
      content: [
        {
          type: "text" as const,
          text: response
        }
      ],
      isError: !fallbackResult.success
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      content: [
        {
          type: "text" as const,
          text: `❌ **Fallback Strategy Execution Error**\\n\\nFailed to execute fallback: ${errorMessage}\\n\\n**Valid Triggers:**\\n- timeout\\n- failure\\n- health-degradation\\n- manual\\n\\n**Valid Systems:**\\n- mcp\\n- hooks\\n\\n**Emergency Actions:**\\n1. Check system logs for detailed error information\\n2. Run manual health checks on both systems\\n3. Contact system administrator for assistance`
        }
      ],
      isError: true
    };
  }
}

/**
 * Generate comprehensive coordination insights and recommendations
 */
export async function getCoordinationInsightsMCP(
  args: {
    includePerformance?: boolean;
    includeOptimizations?: boolean;
    includeAlternatives?: boolean;
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
    const {
      includePerformance = true,
      includeOptimizations = true,
      includeAlternatives = true,
      analysisDepth = 'detailed'
    } = args;

    const coordinator = new CrossSystemCoordinatorIntelligence(projectContext);
    const insights = await coordinator.generateCoordinationInsights();
    
    let response = `# Cross-System Coordination Insights\\n\\n`;

    // System recommendations
    response += `## System Recommendations\\n\\n`;
    response += `🎯 **Recommended System**: ${insights.systemRecommendations.preferredSystem.toUpperCase()}\\n`;
    response += `📋 **Reasoning**: ${insights.systemRecommendations.reasoning}\\n`;
    response += `📊 **Confidence**: ${Math.round(insights.systemRecommendations.confidence * 100)}%\\n\\n`;

    // Include alternatives if requested
    if (includeAlternatives && insights.systemRecommendations.alternatives.length > 0) {
      response += `### Alternative System Options\\n\\n`;
      for (const [index, alt] of insights.systemRecommendations.alternatives.entries()) {
        const scoreBar = '█'.repeat(Math.round(alt.score * 10)) + '░'.repeat(10 - Math.round(alt.score * 10));
        response += `**${index + 1}. ${alt.system.toUpperCase()}** (${Math.round(alt.score * 100)}%)\\n`;
        response += `${scoreBar} ${alt.reasoning}\\n\\n`;
      }
    }

    // Operational health analysis
    response += `## Operational Health Analysis\\n\\n`;
    
    const healthEmojis = {
      excellent: '🟢',
      good: '🟡', 
      degraded: '🟠',
      critical: '🔴'
    };
    
    response += `${healthEmojis[insights.operationalHealth.overall]} **Overall Health**: ${insights.operationalHealth.overall.toUpperCase()}\\n`;
    response += `${healthEmojis[insights.operationalHealth.mcpHealth]} **MCP System**: ${insights.operationalHealth.mcpHealth.toUpperCase()}\\n`;
    response += `${healthEmojis[insights.operationalHealth.hooksHealth]} **Hooks System**: ${insights.operationalHealth.hooksHealth.toUpperCase()}\\n`;
    response += `⚡ **Coordination Efficiency**: ${Math.round(insights.operationalHealth.coordinationEfficiency * 100)}%\\n\\n`;

    // Performance analysis
    if (includePerformance) {
      response += `## Performance Analysis\\n\\n`;
      
      if (insights.operationalHealth.coordinationEfficiency >= 0.9) {
        response += `✨ **Excellent Performance** - Systems operating at optimal efficiency\\n`;
        response += `- Coordination overhead is minimal\\n`;
        response += `- Both systems responding within acceptable thresholds\\n`;
        response += `- No performance degradation detected\\n`;
      } else if (insights.operationalHealth.coordinationEfficiency >= 0.7) {
        response += `⚡ **Good Performance** - Minor optimization opportunities available\\n`;
        response += `- Coordination introducing some overhead\\n`;
        response += `- Response times within acceptable range\\n`;
        response += `- Consider minor optimizations for efficiency gains\\n`;
      } else {
        response += `⚠️ **Performance Issues Detected** - Optimization required\\n`;
        response += `- Significant coordination overhead detected\\n`;
        response += `- Response times may be impacting user experience\\n`;
        response += `- Immediate optimization recommended\\n`;
      }
      response += `\\n`;
    }

    // Optimization recommendations
    if (includeOptimizations) {
      if (insights.optimizations.immediate.length > 0) {
        response += `## ⚡ Immediate Actions Required\\n\\n`;
        for (const [index, action] of insights.optimizations.immediate.entries()) {
          response += `${index + 1}. **${action}**\\n`;
        }
        response += `\\n`;
      }
      
      if (insights.optimizations.shortTerm.length > 0) {
        response += `## 📅 Short-term Optimizations\\n\\n`;
        for (const [index, optimization] of insights.optimizations.shortTerm.entries()) {
          response += `${index + 1}. ${optimization}\\n`;
        }
        response += `\\n`;
      }
      
      if (insights.optimizations.strategic.length > 0) {
        response += `## 🎯 Strategic Improvements\\n\\n`;
        for (const [index, improvement] of insights.optimizations.strategic.entries()) {
          response += `${index + 1}. ${improvement}\\n`;
        }
        response += `\\n`;
      }
    }

    // Detailed analysis for comprehensive mode
    if (analysisDepth === 'comprehensive') {
      response += `## Comprehensive Analysis\\n\\n`;
      
      response += `### System Utilization Patterns\\n`;
      response += `- **MCP System**: Optimal for intelligent automation and timeout prevention\\n`;
      response += `- **Hooks System**: Excellent for file protection and visual workflows\\n`;
      response += `- **Hybrid Approach**: Leverages strengths of both systems\\n\\n`;
      
      response += `### Coordination Strategies\\n`;
      response += `- **MCP-Primary**: Use MCP for main operations, hooks for specialized tasks\\n`;
      response += `- **Hooks-Primary**: Use hooks for main operations, MCP for intelligence\\n`;
      response += `- **Balanced**: Dynamically select optimal system per operation\\n\\n`;
      
      response += `### Risk Assessment\\n`;
      if (insights.operationalHealth.overall === 'excellent') {
        response += `✅ **Low Risk**: Both systems healthy, coordination operating smoothly\\n`;
      } else if (insights.operationalHealth.overall === 'good') {
        response += `⚠️ **Medium Risk**: Minor issues present, monitoring recommended\\n`;
      } else {
        response += `🚨 **High Risk**: System health issues require immediate attention\\n`;
      }
    }

    // Quick action summary
    response += `## Quick Actions\\n\\n`;
    
    if (insights.operationalHealth.overall === 'excellent') {
      response += `🎉 **System Status**: Excellent - Continue current coordination strategy\\n`;
      response += `💡 **Recommendation**: Use ${insights.systemRecommendations.preferredSystem.toUpperCase()} system for optimal performance\\n`;
    } else if (insights.optimizations.immediate.length > 0) {
      response += `🔧 **Action Required**: ${insights.optimizations.immediate.length} immediate issue(s) need attention\\n`;
      response += `🚨 **Priority**: Address immediate actions before continuing operations\\n`;
    } else {
      response += `📊 **Monitoring**: Continue monitoring system health and performance\\n`;
      response += `🔄 **Optimization**: Consider implementing short-term optimizations\\n`;
    }

    return {
      content: [
        {
          type: "text" as const,
          text: response
        }
      ]
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      content: [
        {
          type: "text" as const,
          text: `❌ **Coordination Insights Error**\\n\\nFailed to generate insights: ${errorMessage}\\n\\n**Troubleshooting Steps:**\\n1. Ensure both MCP and hooks systems are accessible\\n2. Check system health manually\\n3. Verify project context is properly initialized\\n4. Run cross-system health check first`
        }
      ],
      isError: true
    };
  }
}