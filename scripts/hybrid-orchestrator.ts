#!/usr/bin/env node

/**
 * Phase 3 Hybrid Orchestrator - Intelligent Tool Selection Engine
 * 
 * Provides intelligent selection between MCP tools and hooks system based on:
 * - Operation type and complexity
 * - Environment context (local, cloud, etc.)
 * - User preferences and overrides
 * - System availability and performance
 * - Historical success patterns
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface ProjectContext {
  currentContext: 'main' | '2' | 'mixed';
  developmentPhase: 'feature' | 'testing' | 'optimization' | 'deployment';
  activeEnvironment: 'local' | 'cloud-workstation' | 'codespaces' | 'gitpod';
  recentChanges: FileChange[];
  activeIssues: GitHubIssue[];
  performanceBaseline: PerformanceMetrics;
  qualityGateStatus: QualityStatus;
}

export interface FileChange {
  path: string;
  type: 'added' | 'modified' | 'deleted';
  complexity: 'low' | 'medium' | 'high';
  scope: 'component' | 'style' | 'test' | 'config' | 'docs';
}

export interface GitHubIssue {
  number: number;
  title: string;
  labels: string[];
  priority: 'low' | 'medium' | 'high';
  context: 'main' | '2' | 'general';
}

export interface PerformanceMetrics {
  bundleSize: number;
  buildTime: number;
  testExecutionTime: number;
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
}

export interface QualityStatus {
  typescript: 'passing' | 'failing' | 'unknown';
  eslint: 'passing' | 'failing' | 'unknown';
  tests: 'passing' | 'failing' | 'unknown';
  build: 'passing' | 'failing' | 'unknown';
}

export interface ToolSelectionResult {
  selectedTool: 'mcp' | 'hooks';
  confidence: number; // 0-100
  reasoning: string;
  fallbackAvailable: boolean;
  estimatedExecutionTime: number; // seconds
  recommendedAction: string;
}

export interface OperationContext {
  operation: string;
  parameters?: Record<string, any>;
  urgency: 'low' | 'medium' | 'high';
  userPreference?: 'mcp' | 'hooks' | 'auto';
  environmentOverrides?: Record<string, any>;
}

// =============================================================================
// HYBRID ORCHESTRATOR CLASS
// =============================================================================

export class HybridOrchestrator {
  private projectRoot: string;
  private operationMappings: Record<string, 'mcp' | 'hooks'>;
  private analyticsHistory: ToolAnalytics[];
  
  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.operationMappings = this.getDefaultOperationMappings();
    this.analyticsHistory = [];
  }

  // ============================================================================
  // CORE TOOL SELECTION LOGIC
  // ============================================================================

  /**
   * Main entry point - select optimal tool for operation
   */
  async selectOptimalTool(
    operation: string,
    context: OperationContext,
    projectContext?: ProjectContext
  ): Promise<ToolSelectionResult> {
    console.log(`🎯 Hybrid Orchestrator: Analyzing operation "${operation}"`);

    // Get current project context if not provided
    const currentContext = projectContext || await this.getProjectContext();
    
    // Check for user preference overrides
    const userOverride = this.checkUserPreferences(operation, context);
    if (userOverride) {
      return userOverride;
    }

    // Analyze operation characteristics
    const operationAnalysis = await this.analyzeOperation(operation, context, currentContext);
    
    // Apply intelligent selection logic
    const selection = await this.applySelectionLogic(operationAnalysis, currentContext);
    
    // Record analytics
    this.recordSelection(operation, selection, operationAnalysis);
    
    console.log(`🎯 Selected: ${selection.selectedTool} (confidence: ${selection.confidence}%)`);
    console.log(`🧠 Reasoning: ${selection.reasoning}`);
    
    return selection;
  }

  /**
   * Get default operation mappings based on Phase 3 strategy
   */
  private getDefaultOperationMappings(): Record<string, 'mcp' | 'hooks'> {
    return {
      // MCP excels at timeout-prone operations
      'dev-server': 'mcp',           // Reliable in cloud environments
      'test-execution': 'mcp',       // Timeout-resistant
      'port-detection': 'mcp',       // Native TypeScript logic
      'quality-gates': 'mcp',        // Direct tool access
      'documentation-query': 'mcp',  // Enhanced intelligence
      
      // Hooks excel at proven stable operations
      'file-protection': 'hooks',    // Mature file protection logic
      'visual-workflow': 'hooks',    // Complex Puppeteer coordination
      'performance-monitoring': 'hooks', // Established monitoring patterns
      'screenshot-generation': 'hooks',  // Specialized Puppeteer workflows
      'background-processing': 'hooks'   // Local automation processes
    };
  }

  /**
   * Check for user preference overrides
   */
  private checkUserPreferences(
    operation: string,
    context: OperationContext
  ): ToolSelectionResult | null {
    // Check explicit user preference in context
    if (context.userPreference && context.userPreference !== 'auto') {
      return {
        selectedTool: context.userPreference,
        confidence: 100,
        reasoning: `User explicitly requested ${context.userPreference} tool`,
        fallbackAvailable: true,
        estimatedExecutionTime: this.estimateExecutionTime(operation, context.userPreference),
        recommendedAction: `Use ${context.userPreference} system as requested`
      };
    }

    // Check environment variables
    const envPreference = this.getEnvironmentPreference();
    if (envPreference) {
      return envPreference;
    }

    return null;
  }

  /**
   * Get environment-based preferences
   */
  private getEnvironmentPreference(): ToolSelectionResult | null {
    const useMcp = process.env.USE_MCP;
    const forceHooks = process.env.FORCE_HOOKS;
    
    if (useMcp === 'true') {
      return {
        selectedTool: 'mcp',
        confidence: 95,
        reasoning: 'USE_MCP environment variable set to true',
        fallbackAvailable: process.env.MCP_FALLBACK === 'true',
        estimatedExecutionTime: 30,
        recommendedAction: 'Use MCP tools with environment override'
      };
    }
    
    if (forceHooks === 'true') {
      return {
        selectedTool: 'hooks',
        confidence: 95,
        reasoning: 'FORCE_HOOKS environment variable set to true',
        fallbackAvailable: true,
        estimatedExecutionTime: 45,
        recommendedAction: 'Use hooks system with environment override'
      };
    }

    return null;
  }

  // ============================================================================
  // OPERATION ANALYSIS
  // ============================================================================

  /**
   * Analyze operation characteristics for intelligent selection
   */
  private async analyzeOperation(
    operation: string,
    context: OperationContext,
    projectContext: ProjectContext
  ): Promise<OperationAnalysis> {
    const timeoutRisk = this.assessTimeoutRisk(operation, projectContext);
    const complexity = this.assessComplexity(operation, context);
    const environmentSuitability = this.assessEnvironmentSuitability(operation, projectContext);
    const historicalPerformance = this.getHistoricalPerformance(operation);
    
    return {
      operation,
      timeoutRisk,
      complexity,
      environmentSuitability,
      historicalPerformance,
      defaultMapping: this.operationMappings[operation] || 'auto',
      contextFactors: {
        isCloudEnvironment: projectContext.activeEnvironment !== 'local',
        hasRecentFailures: this.hasRecentFailures(operation),
        isUrgentOperation: context.urgency === 'high',
        requiresCrossPlatform: this.requiresCrossPlatform(operation)
      }
    };
  }

  /**
   * Assess timeout risk for operation
   */
  private assessTimeoutRisk(operation: string, context: ProjectContext): 'low' | 'medium' | 'high' {
    const timeoutProneOperations = [
      'dev-server', 'test-execution', 'quality-gates', 'build-validation'
    ];
    
    if (timeoutProneOperations.includes(operation)) {
      // Higher risk in cloud environments
      return context.activeEnvironment !== 'local' ? 'high' : 'medium';
    }
    
    return 'low';
  }

  /**
   * Assess operation complexity
   */
  private assessComplexity(operation: string, context: OperationContext): 'low' | 'medium' | 'high' {
    const complexOperations = [
      'visual-workflow', 'performance-monitoring', 'screenshot-generation'
    ];
    
    if (complexOperations.includes(operation)) {
      return 'high';
    }
    
    if (context.parameters && Object.keys(context.parameters).length > 3) {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Assess environment suitability
   */
  private assessEnvironmentSuitability(operation: string, context: ProjectContext): {
    mcpSuitability: number;
    hooksSuitability: number;
  } {
    let mcpSuitability = 50; // Base score
    let hooksSuitability = 50; // Base score
    
    // MCP advantages
    if (context.activeEnvironment !== 'local') {
      mcpSuitability += 30; // Better for cloud environments
    }
    
    if (['dev-server', 'test-execution', 'quality-gates'].includes(operation)) {
      mcpSuitability += 20; // Better for timeout-prone operations
    }
    
    // Hooks advantages
    if (['visual-workflow', 'screenshot-generation', 'performance-monitoring'].includes(operation)) {
      hooksSuitability += 30; // Better for complex workflows
    }
    
    if (context.activeEnvironment === 'local') {
      hooksSuitability += 10; // Proven stable locally
    }
    
    return {
      mcpSuitability: Math.min(100, Math.max(0, mcpSuitability)),
      hooksSuitability: Math.min(100, Math.max(0, hooksSuitability))
    };
  }

  // ============================================================================
  // SELECTION LOGIC
  // ============================================================================

  /**
   * Apply intelligent selection logic based on analysis
   */
  private async applySelectionLogic(
    analysis: OperationAnalysis,
    projectContext: ProjectContext
  ): Promise<ToolSelectionResult> {
    let mcpScore = 0;
    let hooksScore = 0;
    let reasoning: string[] = [];

    // Factor 1: Default mapping (25% weight)
    if (analysis.defaultMapping === 'mcp') {
      mcpScore += 25;
      reasoning.push('Operation optimized for MCP');
    } else if (analysis.defaultMapping === 'hooks') {
      hooksScore += 25;
      reasoning.push('Operation optimized for hooks');
    }

    // Factor 2: Timeout risk (30% weight)
    if (analysis.timeoutRisk === 'high') {
      mcpScore += 30;
      reasoning.push('High timeout risk - MCP provides better reliability');
    } else if (analysis.timeoutRisk === 'low') {
      hooksScore += 15;
      reasoning.push('Low timeout risk - hooks system proven stable');
    }

    // Factor 3: Environment suitability (25% weight)
    const mcpEnvScore = (analysis.environmentSuitability.mcpSuitability / 100) * 25;
    const hooksEnvScore = (analysis.environmentSuitability.hooksSuitability / 100) * 25;
    mcpScore += mcpEnvScore;
    hooksScore += hooksEnvScore;

    if (projectContext.activeEnvironment !== 'local') {
      reasoning.push('Cloud environment favors MCP tools');
    }

    // Factor 4: Complexity (20% weight)
    if (analysis.complexity === 'high') {
      hooksScore += 20;
      reasoning.push('High complexity - hooks system has proven workflows');
    } else if (analysis.complexity === 'low') {
      mcpScore += 10;
      reasoning.push('Low complexity - MCP provides simpler interface');
    }

    // Factor 5: Historical performance
    if (analysis.historicalPerformance) {
      if (analysis.historicalPerformance.mcpSuccessRate > analysis.historicalPerformance.hooksSuccessRate) {
        mcpScore += 10;
        reasoning.push('Historical data favors MCP');
      } else {
        hooksScore += 10;
        reasoning.push('Historical data favors hooks');
      }
    }

    // Factor 6: Context factors
    if (analysis.contextFactors.isUrgentOperation && analysis.timeoutRisk === 'high') {
      mcpScore += 15;
      reasoning.push('Urgent operation with timeout risk - prioritize MCP reliability');
    }

    // Determine selection
    const selectedTool = mcpScore >= hooksScore ? 'mcp' : 'hooks';
    const winningScore = Math.max(mcpScore, hooksScore);
    const confidence = Math.min(95, Math.max(60, winningScore));

    // Check tool availability
    const availability = await this.checkToolAvailability(selectedTool);
    if (!availability.available && availability.fallbackAvailable) {
      return {
        selectedTool: selectedTool === 'mcp' ? 'hooks' : 'mcp',
        confidence: confidence - 20,
        reasoning: `${reasoning.join(', ')} - fallback due to ${selectedTool} unavailability`,
        fallbackAvailable: true,
        estimatedExecutionTime: this.estimateExecutionTime(analysis.operation, selectedTool),
        recommendedAction: `Use ${selectedTool === 'mcp' ? 'hooks' : 'mcp'} system as fallback`
      };
    }

    return {
      selectedTool,
      confidence,
      reasoning: reasoning.join(', '),
      fallbackAvailable: true,
      estimatedExecutionTime: this.estimateExecutionTime(analysis.operation, selectedTool),
      recommendedAction: `Use ${selectedTool} system for optimal performance`
    };
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get current project context
   */
  private async getProjectContext(): Promise<ProjectContext> {
    const environment = this.detectEnvironment();
    const context = await this.detectDevelopmentContext();
    
    return {
      currentContext: context,
      developmentPhase: 'feature', // Could be enhanced with git analysis
      activeEnvironment: environment,
      recentChanges: await this.getRecentChanges(),
      activeIssues: [], // Could be enhanced with GitHub API
      performanceBaseline: await this.getPerformanceBaseline(),
      qualityGateStatus: await this.getQualityStatus()
    };
  }

  /**
   * Detect current environment
   */
  private detectEnvironment(): ProjectContext['activeEnvironment'] {
    if (process.env.CLOUDWORKSTATIONS_REGION) return 'cloud-workstation';
    if (process.env.CODESPACES) return 'codespaces';
    if (process.env.GITPOD_WORKSPACE_ID) return 'gitpod';
    return 'local';
  }

  /**
   * Detect development context (main vs /2)
   */
  private async detectDevelopmentContext(): Promise<'main' | '2' | 'mixed'> {
    try {
      const cwd = process.cwd();
      if (cwd.includes('/2')) return '2';
      
      // Check recent changes for context clues
      const recentChanges = await this.getRecentChanges();
      const hasMainChanges = recentChanges.some(change => !change.path.includes('/2'));
      const has2Changes = recentChanges.some(change => change.path.includes('/2'));
      
      if (hasMainChanges && has2Changes) return 'mixed';
      if (has2Changes) return '2';
      return 'main';
    } catch {
      return 'main';
    }
  }

  /**
   * Get recent file changes (simplified implementation)
   */
  private async getRecentChanges(): Promise<FileChange[]> {
    // This would typically use git to get recent changes
    // For now, return empty array - can be enhanced
    return [];
  }

  /**
   * Get performance baseline
   */
  private async getPerformanceBaseline(): Promise<PerformanceMetrics> {
    return {
      bundleSize: 4200, // KB - could read from actual build
      buildTime: 15,    // seconds
      testExecutionTime: 45, // seconds
      coreWebVitals: {
        lcp: 2.1,
        fid: 85,
        cls: 0.08
      }
    };
  }

  /**
   * Get quality gate status
   */
  private async getQualityStatus(): Promise<QualityStatus> {
    return {
      typescript: 'unknown',
      eslint: 'unknown', 
      tests: 'unknown',
      build: 'unknown'
    };
  }

  /**
   * Check tool availability
   */
  private async checkToolAvailability(tool: 'mcp' | 'hooks'): Promise<{
    available: boolean;
    fallbackAvailable: boolean;
    reason?: string;
  }> {
    if (tool === 'mcp') {
      // Check if MCP server is available
      try {
        const mcpServerPath = join(this.projectRoot, 'mcp-server', 'dist', 'index.js');
        await fs.access(mcpServerPath);
        return { available: true, fallbackAvailable: true };
      } catch {
        return { 
          available: false, 
          fallbackAvailable: true, 
          reason: 'MCP server not built or accessible' 
        };
      }
    } else {
      // Check if hooks system is available
      try {
        const hooksPath = join(this.projectRoot, 'scripts', 'hooks', 'orchestrator', 'orchestrator.sh');
        await fs.access(hooksPath);
        return { available: true, fallbackAvailable: true };
      } catch {
        return { 
          available: false, 
          fallbackAvailable: false, 
          reason: 'Hooks system not available' 
        };
      }
    }
  }

  /**
   * Estimate execution time based on tool and operation
   */
  private estimateExecutionTime(operation: string, tool: 'mcp' | 'hooks'): number {
    const baseTimes: Record<string, { mcp: number; hooks: number }> = {
      'dev-server': { mcp: 45, hooks: 60 },
      'test-execution': { mcp: 60, hooks: 90 },
      'quality-gates': { mcp: 30, hooks: 45 },
      'port-detection': { mcp: 5, hooks: 15 },
      'visual-workflow': { mcp: 120, hooks: 90 },
      'screenshot-generation': { mcp: 90, hooks: 60 }
    };
    
    return baseTimes[operation]?.[tool] || (tool === 'mcp' ? 30 : 45);
  }

  /**
   * Get historical performance data
   */
  private getHistoricalPerformance(operation: string): HistoricalPerformance | null {
    // This would typically read from analytics data
    // For now, return null - can be enhanced with actual data
    return null;
  }

  /**
   * Check for recent failures
   */
  private hasRecentFailures(operation: string): boolean {
    // This would check recent execution history
    return false;
  }

  /**
   * Check if operation requires cross-platform compatibility
   */
  private requiresCrossPlatform(operation: string): boolean {
    return ['dev-server', 'test-execution', 'port-detection'].includes(operation);
  }

  /**
   * Record selection for analytics
   */
  private recordSelection(
    operation: string,
    selection: ToolSelectionResult,
    analysis: OperationAnalysis
  ): void {
    const analyticsEntry: ToolAnalytics = {
      timestamp: new Date(),
      operation,
      selectedTool: selection.selectedTool,
      confidence: selection.confidence,
      reasoning: selection.reasoning,
      executionTime: selection.estimatedExecutionTime,
      context: analysis.contextFactors
    };
    
    this.analyticsHistory.push(analyticsEntry);
    
    // Keep only recent entries (last 100)
    if (this.analyticsHistory.length > 100) {
      this.analyticsHistory = this.analyticsHistory.slice(-100);
    }
  }

  /**
   * Get analytics summary
   */
  public getAnalyticsSummary(): AnalyticsSummary {
    if (this.analyticsHistory.length === 0) {
      return {
        totalSelections: 0,
        mcpSelections: 0,
        hooksSelections: 0,
        averageConfidence: 0,
        mostCommonOperations: [],
        performanceMetrics: {}
      };
    }

    const mcpSelections = this.analyticsHistory.filter(a => a.selectedTool === 'mcp').length;
    const hooksSelections = this.analyticsHistory.filter(a => a.selectedTool === 'hooks').length;
    const averageConfidence = this.analyticsHistory.reduce((sum, a) => sum + a.confidence, 0) / this.analyticsHistory.length;

    return {
      totalSelections: this.analyticsHistory.length,
      mcpSelections,
      hooksSelections,
      averageConfidence: Math.round(averageConfidence),
      mostCommonOperations: this.getMostCommonOperations(),
      performanceMetrics: this.getPerformanceMetrics()
    };
  }

  private getMostCommonOperations(): Array<{ operation: string; count: number }> {
    const operationCounts: Record<string, number> = {};
    
    this.analyticsHistory.forEach(entry => {
      operationCounts[entry.operation] = (operationCounts[entry.operation] || 0) + 1;
    });

    return Object.entries(operationCounts)
      .map(([operation, count]) => ({ operation, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private getPerformanceMetrics(): Record<string, any> {
    const avgExecutionTime = this.analyticsHistory.reduce((sum, a) => sum + a.executionTime, 0) / this.analyticsHistory.length;
    
    return {
      averageExecutionTime: Math.round(avgExecutionTime),
      selectionTrends: {
        mcpTrend: this.calculateTrend('mcp'),
        hooksTrend: this.calculateTrend('hooks')
      }
    };
  }

  private calculateTrend(tool: 'mcp' | 'hooks'): 'increasing' | 'decreasing' | 'stable' {
    if (this.analyticsHistory.length < 10) return 'stable';
    
    const recent = this.analyticsHistory.slice(-10);
    const older = this.analyticsHistory.slice(-20, -10);
    
    const recentCount = recent.filter(a => a.selectedTool === tool).length;
    const olderCount = older.filter(a => a.selectedTool === tool).length;
    
    if (recentCount > olderCount + 1) return 'increasing';
    if (recentCount < olderCount - 1) return 'decreasing';
    return 'stable';
  }
}

// =============================================================================
// ADDITIONAL INTERFACES
// =============================================================================

interface OperationAnalysis {
  operation: string;
  timeoutRisk: 'low' | 'medium' | 'high';
  complexity: 'low' | 'medium' | 'high';
  environmentSuitability: {
    mcpSuitability: number;
    hooksSuitability: number;
  };
  historicalPerformance: HistoricalPerformance | null;
  defaultMapping: string;
  contextFactors: {
    isCloudEnvironment: boolean;
    hasRecentFailures: boolean;
    isUrgentOperation: boolean;
    requiresCrossPlatform: boolean;
  };
}

interface HistoricalPerformance {
  mcpSuccessRate: number;
  hooksSuccessRate: number;
  averageExecutionTime: {
    mcp: number;
    hooks: number;
  };
  recentFailures: number;
}

interface ToolAnalytics {
  timestamp: Date;
  operation: string;
  selectedTool: 'mcp' | 'hooks';
  confidence: number;
  reasoning: string;
  executionTime: number;
  context: {
    isCloudEnvironment: boolean;
    hasRecentFailures: boolean;
    isUrgentOperation: boolean;
    requiresCrossPlatform: boolean;
  };
}

interface AnalyticsSummary {
  totalSelections: number;
  mcpSelections: number;
  hooksSelections: number;
  averageConfidence: number;
  mostCommonOperations: Array<{ operation: string; count: number }>;
  performanceMetrics: Record<string, any>;
}

// =============================================================================
// CLI INTERFACE (if run directly)
// =============================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  const orchestrator = new HybridOrchestrator();
  
  const operation = process.argv[2];
  const userPreference = process.argv[3] as 'mcp' | 'hooks' | 'auto' | undefined;
  
  if (!operation) {
    console.log('Usage: hybrid-orchestrator.ts <operation> [userPreference]');
    console.log('Examples:');
    console.log('  hybrid-orchestrator.ts dev-server');
    console.log('  hybrid-orchestrator.ts test-execution mcp');
    console.log('  hybrid-orchestrator.ts quality-gates auto');
    process.exit(1);
  }
  
  const context: OperationContext = {
    operation,
    urgency: 'medium',
    userPreference
  };
  
  orchestrator.selectOptimalTool(operation, context)
    .then(result => {
      console.log('\n🎯 Hybrid Orchestrator Result:');
      console.log(`Selected Tool: ${result.selectedTool}`);
      console.log(`Confidence: ${result.confidence}%`);
      console.log(`Reasoning: ${result.reasoning}`);
      console.log(`Estimated Time: ${result.estimatedExecutionTime}s`);
      console.log(`Fallback Available: ${result.fallbackAvailable}`);
      console.log(`Recommended Action: ${result.recommendedAction}`);
      
      // Show analytics summary
      console.log('\n📊 Analytics Summary:');
      const analytics = orchestrator.getAnalyticsSummary();
      console.log(`Total Selections: ${analytics.totalSelections}`);
      console.log(`MCP: ${analytics.mcpSelections}, Hooks: ${analytics.hooksSelections}`);
      console.log(`Average Confidence: ${analytics.averageConfidence}%`);
    })
    .catch(error => {
      console.error('❌ Error:', error.message);
      process.exit(1);
    });
}

export default HybridOrchestrator;