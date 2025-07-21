import { ProjectContext } from '../types/project.js';
import {
  TestingStrategyIntelligence,
  TestSelectionRequest,
  TestSelection,
  TestAnalysis
} from './testing-strategy-intelligence.js';

/**
 * Enhanced MCP tools for Testing Strategy Intelligence
 * Provides intelligent test selection, strategy analysis, and testing recommendations
 */

/**
 * Analyze testing needs based on file changes and development context
 */
export async function analyzeTestingNeedsMCP(
  args: {
    changedFiles?: string[];
    context?: 'main' | '2' | 'mixed';
    timeConstraints?: 'fast' | 'normal' | 'comprehensive';
    environment?: 'local' | 'cloud-workstation' | 'codespaces' | 'gitpod';
    priority?: 'development' | 'pre-commit' | 'ci-cd';
    includeRiskAssessment?: boolean;
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
      changedFiles = [],
      context = 'main',
      timeConstraints = 'normal',
      environment = 'local',
      priority = 'development',
      includeRiskAssessment = true
    } = args;

    const intelligence = new TestingStrategyIntelligence(projectContext);
    
    const request: TestSelectionRequest = {
      changedFiles,
      context,
      timeConstraints,
      environment,
      priority
    };

    const analysis = await intelligence.analyzeTestingNeeds(request);

    let response = "# Testing Strategy Analysis\n\n";

    // Context Overview
    response += `## Analysis Context\n`;
    response += `- **Development Context**: ${analysis.contextAnalysis.developmentContext}\n`;
    response += `- **Time Constraints**: ${analysis.contextAnalysis.timeConstraints}\n`;
    response += `- **Environment**: ${analysis.contextAnalysis.environment}\n`;
    response += `- **Files Analyzed**: ${changedFiles.length || 'None specified'}\n\n`;

    // File Analysis
    if (analysis.fileAnalysis.length > 0) {
      response += `## File Impact Analysis\n\n`;
      for (const file of analysis.fileAnalysis) {
        const icon = file.suggestedStrategy === 'comprehensive' ? '🔴' : 
                    file.suggestedStrategy === 'visual' ? '🟡' : 
                    file.suggestedStrategy === 'component' ? '🔵' : '🟢';
        
        response += `${icon} **${file.file}**\n`;
        response += `   - Type: ${file.type}\n`;
        response += `   - Suggested: ${file.suggestedStrategy}\n`;
        response += `   - Reasoning: ${file.reasoning}\n\n`;
      }
    }

    // Special Conditions
    if (analysis.specialConditions.length > 0) {
      response += `## Special Conditions Detected\n\n`;
      for (const condition of analysis.specialConditions) {
        response += `⚠️ **${condition.condition}**\n`;
        response += `   - Strategy: ${condition.strategy}\n`;
        response += `   - Reasoning: ${condition.reasoning}\n\n`;
      }
    }

    // Recommendations
    response += `## Strategy Recommendations\n\n`;
    response += `- **Optimal**: ${analysis.recommendations.optimal}\n`;
    response += `- **Fast**: ${analysis.recommendations.fast}\n`;
    response += `- **Comprehensive**: ${analysis.recommendations.comprehensive}\n\n`;

    // Risk Assessment
    if (includeRiskAssessment) {
      response += `## Risk Assessment\n\n`;
      const riskIcon = analysis.riskAssessment.level === 'high' ? '🔴' : 
                      analysis.riskAssessment.level === 'medium' ? '🟡' : '🟢';
      
      response += `${riskIcon} **Risk Level**: ${analysis.riskAssessment.level.toUpperCase()}\n\n`;
      
      response += `**Risk Factors:**\n`;
      for (const factor of analysis.riskAssessment.factors) {
        response += `- ${factor}\n`;
      }
      
      response += `\n**Mitigation Strategies:**\n`;
      for (const mitigation of analysis.riskAssessment.mitigation) {
        response += `- ${mitigation}\n`;
      }
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
          text: `❌ **Testing Strategy Analysis Error**\n\nFailed to analyze testing needs: ${errorMessage}\n\n**Troubleshooting Steps:**\n1. Ensure test-strategies.json exists in scripts/hooks/config/\n2. Verify file paths are accessible\n3. Check project context is properly initialized\n4. Review testing strategy configuration validity`
        }
      ],
      isError: true
    };
  }
}

/**
 * Select optimal testing strategy with intelligent recommendations
 */
export async function selectTestingStrategyMCP(
  args: {
    changedFiles?: string[];
    context?: 'main' | '2' | 'mixed';
    timeConstraints?: 'fast' | 'normal' | 'comprehensive';
    environment?: 'local' | 'cloud-workstation' | 'codespaces' | 'gitpod';
    priority?: 'development' | 'pre-commit' | 'ci-cd';
    includeScreenshots?: boolean;
    forceStrategy?: string;
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
    const {
      changedFiles = [],
      context = 'main',
      timeConstraints = 'normal',
      environment = 'local',
      priority = 'development',
      includeScreenshots = false,
      forceStrategy,
      includeAlternatives = true
    } = args;

    const intelligence = new TestingStrategyIntelligence(projectContext);
    
    const request: TestSelectionRequest = {
      changedFiles,
      context,
      timeConstraints,
      environment,
      priority,
      includeScreenshots,
      forceStrategy
    };

    const selection = await intelligence.selectTestingStrategy(request);

    let response = `# Recommended Testing Strategy\n\n`;

    // Primary Recommendation
    response += `## ${selection.primaryStrategy.toUpperCase()} Strategy\n\n`;
    response += `**Command**: \`${selection.command}\`\n\n`;
    response += `**Description**: ${selection.description}\n\n`;
    response += `**Estimated Time**: ${selection.estimatedTime}\n\n`;
    response += `**Coverage**: ${selection.coverage}\n\n`;

    // Environment Configuration
    if (Object.keys(selection.environment).length > 0) {
      response += `**Environment Variables**:\n`;
      for (const [key, value] of Object.entries(selection.environment)) {
        response += `- ${key}=${value}\n`;
      }
      response += '\n';
    }

    // Reasoning
    response += `**Selection Reasoning**: ${selection.reasoning}\n\n`;

    // Screenshots
    if (selection.screenshots) {
      response += `## Screenshot Generation\n\n`;
      response += `**Command**: \`${selection.screenshots.command}\`\n`;
      response += `**Output Location**: ${selection.screenshots.outputLocation}\n`;
      response += `**Estimated Time**: ${selection.screenshots.estimatedTime}\n\n`;
    }

    // Alternatives
    if (includeAlternatives && selection.alternatives.length > 0) {
      response += `## Alternative Strategies\n\n`;
      for (const alternative of selection.alternatives) {
        response += `- ${alternative}\n`;
      }
      response += '\n';
    }

    // Warnings
    if (selection.warnings && selection.warnings.length > 0) {
      response += `## Warnings\n\n`;
      for (const warning of selection.warnings) {
        response += `⚠️ ${warning}\n`;
      }
      response += '\n';
    }

    // Optimizations
    if (selection.optimizations && selection.optimizations.length > 0) {
      response += `## Performance Optimizations\n\n`;
      for (const optimization of selection.optimizations) {
        response += `⚡ ${optimization}\n`;
      }
      response += '\n';
    }

    // Quick Execution Guide
    response += `## Quick Execution Guide\n\n`;
    response += `\`\`\`bash\n`;
    if (Object.keys(selection.environment).length > 0) {
      for (const [key, value] of Object.entries(selection.environment)) {
        response += `export ${key}=${value}\n`;
      }
    }
    response += `${selection.command}\n`;
    if (selection.screenshots) {
      response += `${selection.screenshots.command}\n`;
    }
    response += `\`\`\`\n`;

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
          text: `❌ **Testing Strategy Selection Error**\n\nFailed to select testing strategy: ${errorMessage}\n\n**Common Issues:**\n1. Invalid strategy name in forceStrategy parameter\n2. Test strategies configuration file not found\n3. Invalid context, timeConstraints, or priority values\n4. File paths in changedFiles are malformed`
        }
      ],
      isError: true
    };
  }
}

/**
 * Get testing recommendations for specific development scenarios
 */
export async function getTestingRecommendationsMCP(
  args: {
    scenario: 'quick-development' | 'pre-commit' | 'comprehensive-review' | 'visual-changes' | 'performance-critical';
    context?: 'main' | '2' | 'mixed';
    timeAvailable?: string;
    includeAlternatives?: boolean;
    includeWorkflow?: boolean;
    includeTips?: boolean;
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
      scenario,
      context = 'main',
      timeAvailable = '5 minutes',
      includeAlternatives = true,
      includeWorkflow = true,
      includeTips = true
    } = args;

    const intelligence = new TestingStrategyIntelligence(projectContext);
    
    const recommendations = await intelligence.getTestingRecommendations({
      scenario,
      context,
      timeAvailable
    });

    let response = `# Testing Recommendations: ${scenario.replace('-', ' ').toUpperCase()}\n\n`;

    // Scenario Context
    response += `## Scenario Overview\n`;
    response += `- **Context**: ${context === '2' ? 'Enterprise Solutions Architect (/2 redesign)' : 'Main Portfolio'}\n`;
    response += `- **Time Available**: ${timeAvailable}\n`;
    response += `- **Scenario**: ${scenario.replace('-', ' ')}\n\n`;

    // Primary Recommendation
    const primary = recommendations.primaryRecommendation;
    response += `## 🎯 Primary Recommendation: ${primary.primaryStrategy.toUpperCase()}\n\n`;
    response += `**Command**: \`${primary.command}\`\n`;
    response += `**Estimated Time**: ${primary.estimatedTime}\n`;
    response += `**Coverage**: ${primary.coverage}\n`;
    response += `**Reasoning**: ${primary.reasoning}\n\n`;

    // Environment setup if needed
    if (Object.keys(primary.environment).length > 0) {
      response += `**Environment Setup**:\n`;
      response += `\`\`\`bash\n`;
      for (const [key, value] of Object.entries(primary.environment)) {
        response += `export ${key}=${value}\n`;
      }
      response += `\`\`\`\n\n`;
    }

    // Screenshots if included
    if (primary.screenshots) {
      response += `**Screenshot Generation**: \`${primary.screenshots.command}\`\n`;
      response += `- Output: ${primary.screenshots.outputLocation}\n`;
      response += `- Time: ${primary.screenshots.estimatedTime}\n\n`;
    }

    // Alternatives
    if (includeAlternatives && recommendations.alternatives.length > 0) {
      response += `## Alternative Strategies\n\n`;
      for (const [index, alt] of recommendations.alternatives.entries()) {
        response += `### ${index + 1}. ${alt.primaryStrategy.toUpperCase()}\n`;
        response += `- **Command**: \`${alt.command}\`\n`;
        response += `- **Time**: ${alt.estimatedTime}\n`;
        response += `- **Use when**: ${alt.reasoning.split(':')[1]?.trim() || 'Alternative approach needed'}\n\n`;
      }
    }

    // Workflow
    if (includeWorkflow) {
      response += `## Recommended Workflow\n\n`;
      for (const step of recommendations.workflow) {
        response += `${step}\n`;
      }
      response += '\n';
    }

    // Tips
    if (includeTips) {
      response += `## Pro Tips\n\n`;
      for (const tip of recommendations.tips) {
        response += `💡 ${tip}\n`;
      }
      response += '\n';
    }

    // Quick Start Commands
    response += `## Quick Start\n\n`;
    response += `\`\`\`bash\n`;
    response += `# Set up environment\n`;
    if (Object.keys(primary.environment).length > 0) {
      for (const [key, value] of Object.entries(primary.environment)) {
        response += `export ${key}=${value}\n`;
      }
    }
    response += `\n# Execute primary strategy\n`;
    response += `${primary.command}\n`;
    
    if (primary.screenshots) {
      response += `\n# Generate screenshots (if needed)\n`;
      response += `${primary.screenshots.command}\n`;
    }
    response += `\`\`\`\n`;

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
          text: `❌ **Testing Recommendations Error**\n\nFailed to generate testing recommendations: ${errorMessage}\n\n**Valid Scenarios:**\n- quick-development\n- pre-commit\n- comprehensive-review\n- visual-changes\n- performance-critical\n\n**Valid Contexts:**\n- main (main portfolio)\n- 2 (Enterprise Solutions Architect redesign)\n- mixed (both contexts)`
        }
      ],
      isError: true
    };
  }
}

/**
 * Validate and optimize testing configuration
 */
export async function validateTestingConfigurationMCP(
  args: {
    checkStrategies?: boolean;
    checkCommands?: boolean;
    checkEnvironment?: boolean;
    includeOptimizations?: boolean;
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
      checkStrategies = true,
      checkCommands = true,
      checkEnvironment = true,
      includeOptimizations = true
    } = args;

    const intelligence = new TestingStrategyIntelligence(projectContext);
    
    // Load strategies to validate
    const strategies = await (intelligence as any).loadStrategies();

    let response = `# Testing Configuration Validation\n\n`;

    let validationScore = 0;
    let totalChecks = 0;

    // Validate Strategies
    if (checkStrategies) {
      response += `## Strategy Configuration\n\n`;
      const strategyNames = Object.keys(strategies.test_strategies);
      totalChecks += strategyNames.length;
      
      for (const strategyName of strategyNames) {
        const strategy = strategies.test_strategies[strategyName];
        const isValid = strategy.command && strategy.description && strategy.estimated_time;
        
        if (isValid) validationScore++;
        
        const icon = isValid ? '✅' : '❌';
        response += `${icon} **${strategyName}**: ${strategy.description}\n`;
        if (!isValid) {
          response += `   - Missing required fields\n`;
        }
      }
      response += `\n**Strategy Validation**: ${validationScore}/${strategyNames.length} strategies valid\n\n`;
    }

    // Validate Commands
    if (checkCommands) {
      response += `## Command Validation\n\n`;
      const commands = Object.values(strategies.test_strategies).map(s => 
        (s && typeof s === 'object' && 'command' in s) ? s.command : ''
      ).filter(cmd => typeof cmd === 'string');
      let validCommands = 0;
      
      for (const command of commands) {
        if (typeof command === 'string') {
          const isNpmScript = command.startsWith('npm run') || command.startsWith('npx');
          if (isNpmScript) validCommands++;
        }
      }
      
      response += `✅ **Valid Commands**: ${validCommands}/${commands.length}\n`;
      response += `📋 **Command Types**: npm scripts, npx commands, shell commands\n\n`;
    }

    // Environment Validation
    if (checkEnvironment) {
      response += `## Environment Variables\n\n`;
      const envVars = new Set<string>();
      
      Object.values(strategies.test_strategies).forEach(strategy => {
        if (strategy && 
            typeof strategy === 'object' && 
            'environment' in strategy && 
            strategy.environment &&
            typeof strategy.environment === 'object') {
          Object.keys(strategy.environment as Record<string, any>).forEach(key => envVars.add(key));
        }
      });
      
      response += `**Environment Variables Used**:\n`;
      for (const envVar of Array.from(envVars).sort()) {
        response += `- ${envVar}\n`;
      }
      
      if (envVars.size === 0) {
        response += `- None configured\n`;
      }
      response += '\n';
    }

    // Configuration Insights
    response += `## Configuration Insights\n\n`;
    const fileTypeMappings = Object.keys(strategies.file_type_mappings);
    const contextOverrides = Object.keys(strategies.context_overrides);
    const specialConditions = Object.keys(strategies.special_conditions);
    
    response += `- **File Types**: ${fileTypeMappings.length} supported (${fileTypeMappings.join(', ')})\n`;
    response += `- **Context Overrides**: ${contextOverrides.length} contexts (${contextOverrides.join(', ')})\n`;
    response += `- **Special Conditions**: ${specialConditions.length} conditions (${specialConditions.join(', ')})\n\n`;

    // Optimizations
    if (includeOptimizations) {
      response += `## Optimization Recommendations\n\n`;
      
      const optimizations: string[] = [];
      
      // Check for fast mode usage
      const fastModeStrategies = Object.entries(strategies.test_strategies)
        .filter(([, strategy]) => 
          strategy && 
          typeof strategy === 'object' && 
          'environment' in strategy && 
          strategy.environment &&
          typeof strategy.environment === 'object' &&
          (strategy.environment as Record<string, any>).FAST_MODE
        )
        .map(([name]) => name);
      
      if (fastModeStrategies.length > 0) {
        optimizations.push(`Fast mode enabled for: ${fastModeStrategies.join(', ')}`);
      }
      
      // Check for visual skipping
      const skipVisualStrategies = Object.entries(strategies.test_strategies)
        .filter(([, strategy]) => 
          strategy && 
          typeof strategy === 'object' && 
          'environment' in strategy && 
          strategy.environment &&
          typeof strategy.environment === 'object' &&
          (strategy.environment as Record<string, any>).SKIP_VISUAL
        )
        .map(([name]) => name);
      
      if (skipVisualStrategies.length > 0) {
        optimizations.push(`Visual tests skipped for: ${skipVisualStrategies.join(', ')}`);
      }
      
      // General recommendations
      optimizations.push('Consider adding timeout configurations for cloud environments');
      optimizations.push('Implement parallel test execution for faster CI/CD');
      optimizations.push('Add environment-specific strategy overrides');
      
      for (const optimization of optimizations) {
        response += `💡 ${optimization}\n`;
      }
    }

    // Overall Health Score
    const healthScore = Math.round((validationScore / Math.max(totalChecks, 1)) * 100);
    const healthIcon = healthScore >= 90 ? '🟢' : healthScore >= 70 ? '🟡' : '🔴';
    
    response += `\n## Overall Configuration Health\n\n`;
    response += `${healthIcon} **Health Score**: ${healthScore}%\n`;
    response += `📊 **Status**: ${healthScore >= 90 ? 'Excellent' : healthScore >= 70 ? 'Good' : 'Needs Improvement'}\n`;

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
          text: `❌ **Testing Configuration Validation Error**\n\nFailed to validate testing configuration: ${errorMessage}\n\n**Possible Issues:**\n1. test-strategies.json file not found or not readable\n2. Invalid JSON format in configuration file\n3. Missing required configuration fields\n4. Project context not properly initialized`
        }
      ],
      isError: true
    };
  }
}