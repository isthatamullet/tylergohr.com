import { promises as fs } from 'fs';
import { join } from 'path';
import { ProjectContext } from '../types/project.js';

// Testing strategy types
export interface TestStrategy {
  command: string;
  description: string;
  estimated_time: string;
  coverage: string;
  environment: Record<string, string>;
}

export interface TestStrategies {
  test_strategies: Record<string, TestStrategy>;
  file_type_mappings: Record<string, {
    default: string;
    patterns?: Record<string, string>;
  }>;
  context_overrides: Record<string, any>;
  special_conditions: Record<string, {
    strategy: string;
    description: string;
  }>;
  screenshot_generation: Record<string, {
    command: string;
    description: string;
    output_location: string;
    estimated_time: string;
  }>;
}

export interface TestSelectionRequest {
  changedFiles?: string[];
  context?: 'main' | '2' | 'mixed';
  timeConstraints?: 'fast' | 'normal' | 'comprehensive';
  environment?: 'local' | 'cloud-workstation' | 'codespaces' | 'gitpod';
  priority?: 'development' | 'pre-commit' | 'ci-cd';
  includeScreenshots?: boolean;
  forceStrategy?: string;
}

export interface TestSelection {
  primaryStrategy: string;
  command: string;
  description: string;
  estimatedTime: string;
  coverage: string;
  environment: Record<string, string>;
  reasoning: string;
  alternatives: string[];
  screenshots?: {
    strategy: string;
    command: string;
    outputLocation: string;
    estimatedTime: string;
  };
  warnings?: string[];
  optimizations?: string[];
}

export interface TestAnalysis {
  fileAnalysis: {
    file: string;
    type: string;
    suggestedStrategy: string;
    reasoning: string;
  }[];
  contextAnalysis: {
    developmentContext: string;
    timeConstraints: string;
    environment: string;
  };
  specialConditions: {
    condition: string;
    strategy: string;
    reasoning: string;
  }[];
  recommendations: {
    optimal: string;
    fast: string;
    comprehensive: string;
  };
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    mitigation: string[];
  };
}

/**
 * Testing Strategy Intelligence Engine
 * Analyzes file changes and development context to recommend optimal testing strategies
 */
export class TestingStrategyIntelligence {
  private projectContext: ProjectContext;
  private strategiesPath: string;
  private strategies: TestStrategies | null = null;

  constructor(projectContext: ProjectContext) {
    this.projectContext = projectContext;
    this.strategiesPath = join(projectContext.projectRoot, 'scripts/hooks/config/test-strategies.json');
  }

  /**
   * Load testing strategies configuration
   */
  private async loadStrategies(): Promise<TestStrategies> {
    if (this.strategies) {
      return this.strategies;
    }

    try {
      const content = await fs.readFile(this.strategiesPath, 'utf-8');
      this.strategies = JSON.parse(content);
      return this.strategies!;
    } catch (error) {
      throw new Error(`Failed to load testing strategies: ${error}`);
    }
  }

  /**
   * Analyze files and context to determine optimal testing strategy
   */
  async analyzeTestingNeeds(request: TestSelectionRequest): Promise<TestAnalysis> {
    const strategies = await this.loadStrategies();
    const {
      changedFiles = [],
      context = 'main',
      timeConstraints = 'normal',
      environment = 'local',
      priority = 'development'
    } = request;

    // Analyze individual files
    const fileAnalysis = await this.analyzeFiles(changedFiles, strategies);
    
    // Analyze development context
    const contextAnalysis = {
      developmentContext: context,
      timeConstraints,
      environment
    };

    // Check for special conditions
    const specialConditions = this.checkSpecialConditions(changedFiles, strategies);

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      fileAnalysis,
      contextAnalysis,
      specialConditions,
      strategies
    );

    // Assess risk level
    const riskAssessment = this.assessRisk(
      fileAnalysis,
      specialConditions,
      context,
      priority
    );

    return {
      fileAnalysis,
      contextAnalysis,
      specialConditions,
      recommendations,
      riskAssessment
    };
  }

  /**
   * Select optimal testing strategy based on analysis
   */
  async selectTestingStrategy(request: TestSelectionRequest): Promise<TestSelection> {
    const strategies = await this.loadStrategies();
    const analysis = await this.analyzeTestingNeeds(request);

    // Handle forced strategy override
    if (request.forceStrategy && strategies.test_strategies[request.forceStrategy]) {
      const forcedStrategy = strategies.test_strategies[request.forceStrategy];
      return this.buildTestSelection(
        request.forceStrategy,
        forcedStrategy,
        strategies,
        `User requested specific strategy: ${request.forceStrategy}`,
        [],
        request.includeScreenshots
      );
    }

    // Determine primary strategy based on analysis
    const primaryStrategy = this.determinePrimaryStrategy(analysis, request, strategies);
    const strategy = strategies.test_strategies[primaryStrategy];

    if (!strategy) {
      throw new Error(`Unknown testing strategy: ${primaryStrategy}`);
    }

    // Generate reasoning
    const reasoning = this.generateReasoning(analysis, primaryStrategy, request);

    // Generate alternatives
    const alternatives = this.generateAlternatives(primaryStrategy, analysis, strategies);

    return this.buildTestSelection(
      primaryStrategy,
      strategy,
      strategies,
      reasoning,
      alternatives,
      request.includeScreenshots
    );
  }

  /**
   * Get testing recommendations for specific scenarios
   */
  async getTestingRecommendations(scenario: {
    scenario: 'quick-development' | 'pre-commit' | 'comprehensive-review' | 'visual-changes' | 'performance-critical';
    context?: 'main' | '2' | 'mixed';
    timeAvailable?: string;
  }): Promise<{
    primaryRecommendation: TestSelection;
    alternatives: TestSelection[];
    workflow: string[];
    tips: string[];
  }> {
    const strategies = await this.loadStrategies();
    const { scenario: scenarioType, context = 'main', timeAvailable = '5 minutes' } = scenario;

    let request: TestSelectionRequest;
    
    switch (scenarioType) {
      case 'quick-development':
        request = {
          context,
          timeConstraints: 'fast',
          priority: 'development',
          includeScreenshots: false
        };
        break;
        
      case 'pre-commit':
        request = {
          context,
          timeConstraints: 'normal',
          priority: 'pre-commit',
          includeScreenshots: false
        };
        break;
        
      case 'comprehensive-review':
        request = {
          context,
          timeConstraints: 'comprehensive',
          priority: 'ci-cd',
          includeScreenshots: true
        };
        break;
        
      case 'visual-changes':
        request = {
          context,
          timeConstraints: 'normal',
          priority: 'development',
          includeScreenshots: true,
          changedFiles: ['src/app/2/styles/brand-tokens.css', 'src/app/2/components/ui/Button/Button.module.css']
        };
        break;
        
      case 'performance-critical':
        request = {
          context,
          timeConstraints: 'normal',
          priority: 'pre-commit',
          includeScreenshots: false,
          changedFiles: ['src/app/2/components/Results/MetricCard.tsx']
        };
        break;
        
      default:
        throw new Error(`Unknown testing scenario: ${scenarioType}`);
    }

    const primaryRecommendation = await this.selectTestingStrategy(request);
    
    // Generate alternatives
    const alternatives: TestSelection[] = [];
    const timeConstraintOptions = ['fast', 'normal', 'comprehensive'] as const;
    
    for (const timeConstraint of timeConstraintOptions) {
      if (timeConstraint !== request.timeConstraints) {
        const altRequest = { ...request, timeConstraints: timeConstraint };
        try {
          const altSelection = await this.selectTestingStrategy(altRequest);
          alternatives.push(altSelection);
        } catch (error) {
          // Skip invalid alternatives
        }
      }
    }

    // Generate workflow steps
    const workflow = this.generateWorkflow(primaryRecommendation, scenarioType);

    // Generate tips
    const tips = this.generateTips(scenarioType, context, timeAvailable);

    return {
      primaryRecommendation,
      alternatives: alternatives.slice(0, 2), // Limit to top 2 alternatives
      workflow,
      tips
    };
  }

  // Private helper methods

  private async analyzeFiles(
    changedFiles: string[],
    strategies: TestStrategies
  ): Promise<TestAnalysis['fileAnalysis']> {
    const analysis: TestAnalysis['fileAnalysis'] = [];

    for (const file of changedFiles) {
      const extension = file.split('.').pop()?.toLowerCase() || '';
      const mapping = strategies.file_type_mappings[extension];

      if (!mapping) {
        analysis.push({
          file,
          type: 'unknown',
          suggestedStrategy: 'smoke',
          reasoning: 'Unknown file type, defaulting to smoke tests'
        });
        continue;
      }

      let suggestedStrategy = mapping.default;
      let reasoning = `File type .${extension} defaults to ${suggestedStrategy}`;

      // Check pattern-specific mappings
      if (mapping.patterns) {
        for (const [pattern, strategy] of Object.entries(mapping.patterns)) {
          if (file.includes(pattern)) {
            suggestedStrategy = strategy;
            reasoning = `File matches pattern "${pattern}", suggesting ${strategy}`;
            break;
          }
        }
      }

      analysis.push({
        file,
        type: extension,
        suggestedStrategy,
        reasoning
      });
    }

    return analysis;
  }

  private checkSpecialConditions(
    changedFiles: string[],
    strategies: TestStrategies
  ): TestAnalysis['specialConditions'] {
    const conditions: TestAnalysis['specialConditions'] = [];

    for (const [conditionName, condition] of Object.entries(strategies.special_conditions)) {
      let triggered = false;

      switch (conditionName) {
        case 'design_system_change':
          triggered = changedFiles.some(file => 
            file.includes('brand-tokens.css') || 
            file.includes('globals.css') ||
            file.includes('styles/') ||
            file.includes('.module.css')
          );
          break;

        case 'navigation_change':
          triggered = changedFiles.some(file => 
            file.includes('Navigation') || 
            file.includes('BrowserTabs') ||
            file.includes('navigation')
          );
          break;

        case 'performance_critical':
          triggered = changedFiles.some(file => 
            file.includes('MetricCard') || 
            file.includes('animation') ||
            file.includes('Framer Motion') ||
            file.includes('three.js') ||
            file.includes('ScrollEffects')
          );
          break;

        case 'accessibility_critical':
          triggered = changedFiles.some(file => 
            file.includes('accessibility') || 
            file.includes('aria') ||
            file.includes('Navigation') ||
            file.includes('Form') ||
            file.includes('Button')
          );
          break;
      }

      if (triggered) {
        conditions.push({
          condition: conditionName,
          strategy: condition.strategy,
          reasoning: condition.description
        });
      }
    }

    return conditions;
  }

  private generateRecommendations(
    fileAnalysis: TestAnalysis['fileAnalysis'],
    contextAnalysis: TestAnalysis['contextAnalysis'],
    specialConditions: TestAnalysis['specialConditions'],
    strategies: TestStrategies
  ): TestAnalysis['recommendations'] {
    // Determine optimal strategy
    let optimal = 'smoke'; // Default fallback

    // Special conditions override everything
    if (specialConditions.length > 0) {
      optimal = specialConditions[0].strategy;
    } else {
      // Aggregate file suggestions
      const strategyCounts = fileAnalysis.reduce((acc, analysis) => {
        acc[analysis.suggestedStrategy] = (acc[analysis.suggestedStrategy] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Choose most common suggestion, or upgrade based on risk
      optimal = Object.entries(strategyCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'smoke';
    }

    // Apply context overrides
    const overrides = strategies.context_overrides[contextAnalysis.developmentContext];
    if (overrides && overrides[optimal]) {
      optimal = overrides[optimal];
    }

    // Apply time constraints
    if (contextAnalysis.timeConstraints === 'fast') {
      const fastOverrides = strategies.context_overrides.fast;
      if (fastOverrides && fastOverrides[optimal]) {
        optimal = fastOverrides[optimal];
      }
    }

    return {
      optimal,
      fast: 'smoke',
      comprehensive: 'comprehensive'
    };
  }

  private assessRisk(
    fileAnalysis: TestAnalysis['fileAnalysis'],
    specialConditions: TestAnalysis['specialConditions'],
    context: string,
    priority: string
  ): TestAnalysis['riskAssessment'] {
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    const factors: string[] = [];
    const mitigation: string[] = [];

    // Check for high-risk file types
    const highRiskFiles = fileAnalysis.filter(f => 
      f.type === 'tsx' && (f.file.includes('layout.tsx') || f.file.includes('page.tsx'))
    );
    if (highRiskFiles.length > 0) {
      riskLevel = 'high';
      factors.push('Layout or page files modified - affects core user flows');
      mitigation.push('Run comprehensive testing before deployment');
    }

    // Check for special conditions
    if (specialConditions.length > 0) {
      if (riskLevel === 'low') riskLevel = 'medium';
      factors.push(`Special conditions detected: ${specialConditions.map(c => c.condition).join(', ')}`);
      mitigation.push('Address special conditions with targeted testing strategies');
    }

    // Check for /2 redesign context
    if (context === '2' || context === 'mixed') {
      if (riskLevel === 'low') riskLevel = 'medium';
      factors.push('Changes affect /2 redesign - enterprise presentation impact');
      mitigation.push('Include visual regression testing for brand consistency');
    }

    // Check for CI/CD priority
    if (priority === 'ci-cd') {
      if (riskLevel === 'low') riskLevel = 'medium';
      factors.push('CI/CD deployment requires comprehensive validation');
      mitigation.push('Execute full test suite including accessibility and performance');
    }

    // If no risk factors found
    if (factors.length === 0) {
      factors.push('No significant risk factors detected');
      mitigation.push('Standard smoke testing should be sufficient');
    }

    return { level: riskLevel, factors, mitigation };
  }

  private determinePrimaryStrategy(
    analysis: TestAnalysis,
    request: TestSelectionRequest,
    strategies: TestStrategies
  ): string {
    // Start with optimal recommendation
    let strategy = analysis.recommendations.optimal;

    // Apply time constraints override
    if (request.timeConstraints === 'fast') {
      strategy = analysis.recommendations.fast;
    } else if (request.timeConstraints === 'comprehensive') {
      strategy = analysis.recommendations.comprehensive;
    }

    // Apply priority-based adjustments
    if (request.priority === 'ci-cd' && strategy === 'smoke') {
      strategy = 'component'; // Upgrade for CI/CD
    }

    // Apply context overrides
    if (request.context && strategies.context_overrides[request.context]) {
      const contextOverride = strategies.context_overrides[request.context];
      if (contextOverride[strategy]) {
        strategy = contextOverride[strategy];
      }
    }

    return strategy;
  }

  private generateReasoning(
    analysis: TestAnalysis,
    primaryStrategy: string,
    request: TestSelectionRequest
  ): string {
    const reasons: string[] = [];

    // File analysis reasoning
    if (analysis.fileAnalysis.length > 0) {
      const strategies = analysis.fileAnalysis.map(f => f.suggestedStrategy);
      const uniqueStrategies = [...new Set(strategies)];
      reasons.push(`File analysis suggests: ${uniqueStrategies.join(', ')}`);
    }

    // Special conditions
    if (analysis.specialConditions.length > 0) {
      const conditions = analysis.specialConditions.map(c => c.condition);
      reasons.push(`Special conditions detected: ${conditions.join(', ')}`);
    }

    // Context considerations
    if (request.context === '2') {
      reasons.push('Enterprise /2 redesign context requires careful validation');
    }

    // Time constraints
    if (request.timeConstraints === 'fast') {
      reasons.push('Fast execution requested - optimized for speed');
    } else if (request.timeConstraints === 'comprehensive') {
      reasons.push('Comprehensive validation requested - full coverage');
    }

    // Risk assessment
    if (analysis.riskAssessment.level === 'high') {
      reasons.push('High risk assessment suggests thorough testing');
    }

    return reasons.length > 0 
      ? `Selected ${primaryStrategy} because: ${reasons.join('; ')}`
      : `Default ${primaryStrategy} strategy selected`;
  }

  private generateAlternatives(
    primaryStrategy: string,
    analysis: TestAnalysis,
    strategies: TestStrategies
  ): string[] {
    const alternatives: string[] = [];
    
    // Always include fast alternative if not primary
    if (primaryStrategy !== 'smoke') {
      alternatives.push('smoke (fast alternative)');
    }

    // Include comprehensive if not primary and risk is medium+
    if (primaryStrategy !== 'comprehensive' && analysis.riskAssessment.level !== 'low') {
      alternatives.push('comprehensive (thorough validation)');
    }

    // Include specialized alternatives based on special conditions
    for (const condition of analysis.specialConditions) {
      if (condition.strategy !== primaryStrategy) {
        alternatives.push(`${condition.strategy} (for ${condition.condition})`);
      }
    }

    return alternatives.slice(0, 3); // Limit to top 3
  }

  private buildTestSelection(
    strategyName: string,
    strategy: TestStrategy,
    strategies: TestStrategies,
    reasoning: string,
    alternatives: string[],
    includeScreenshots?: boolean
  ): TestSelection {
    const selection: TestSelection = {
      primaryStrategy: strategyName,
      command: strategy.command,
      description: strategy.description,
      estimatedTime: strategy.estimated_time,
      coverage: strategy.coverage,
      environment: strategy.environment,
      reasoning,
      alternatives
    };

    // Add screenshots if requested
    if (includeScreenshots) {
      const screenshotStrategy = strategies.screenshot_generation.visual_changes;
      selection.screenshots = {
        strategy: 'visual_changes',
        command: screenshotStrategy.command,
        outputLocation: screenshotStrategy.output_location,
        estimatedTime: screenshotStrategy.estimated_time
      };
    }

    // Add warnings for time-consuming strategies
    if (strategy.estimated_time.includes('8-10') || strategy.estimated_time.includes('5-8')) {
      selection.warnings = ['Long execution time - consider faster alternatives for development'];
    }

    // Add optimizations
    selection.optimizations = [];
    if (strategy.environment.FAST_MODE) {
      selection.optimizations.push('Fast mode enabled for quicker execution');
    }
    if (strategy.environment.SKIP_VISUAL) {
      selection.optimizations.push('Visual tests skipped for faster feedback');
    }

    return selection;
  }

  private generateWorkflow(selection: TestSelection, scenario: string): string[] {
    const workflow: string[] = [];

    workflow.push('1. Ensure development server is running');
    workflow.push('2. Verify environment variables are set');
    
    if (selection.environment.FAST_MODE) {
      workflow.push('3. Enable fast mode for optimized execution');
    }
    
    workflow.push(`4. Execute: ${selection.command}`);
    
    if (selection.screenshots) {
      workflow.push(`5. Generate screenshots: ${selection.screenshots.command}`);
      workflow.push(`6. Review screenshots in: ${selection.screenshots.outputLocation}`);
    }
    
    workflow.push('7. Review test results and address any failures');
    
    if (scenario === 'pre-commit') {
      workflow.push('8. Run quality gates: npm run validate');
    }

    return workflow;
  }

  private generateTips(scenario: string, context: string, timeAvailable: string): string[] {
    const tips: string[] = [];

    tips.push('Use smoke tests during active development for fastest feedback');
    tips.push('Run visual tests after UI/styling changes');
    
    if (context === '2') {
      tips.push('Brand token compliance is critical for /2 redesign');
      tips.push('Test Enterprise Solutions Architect presentation carefully');
    }
    
    if (scenario === 'quick-development') {
      tips.push('Use FAST_MODE=true for even quicker execution');
      tips.push('Skip visual regression during rapid iteration');
    }
    
    if (scenario === 'pre-commit') {
      tips.push('Always run comprehensive tests before important commits');
      tips.push('Include accessibility testing for user-facing changes');
    }

    tips.push('Use npm run test:e2e:debug for interactive debugging');
    
    return tips;
  }
}