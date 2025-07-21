#!/usr/bin/env node

/**
 * Documentation Intelligence Server - First Enhanced MCP Capability (Tier 1)
 * 
 * Transforms the 8 specialized documentation files into an intelligent,
 * contextual guidance system that provides targeted responses rather than
 * requiring manual file navigation.
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { ProjectContext } from '../types/project.js';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface DocumentationResponse {
  primarySource: string;
  supportingSources: string[];
  contextualAdvice: string;
  suggestedActions: string[];
  confidence: number;
  estimatedReadTime: string;
}

export interface GuidanceResponse {
  relevantDocs: string[];
  checklist: string[];
  warnings: string[];
  nextSteps: string[];
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface WorkflowGuide {
  steps: WorkflowStep[];
  prerequisites: string[];
  estimatedTime: string;
  relatedWorkflows: string[];
}

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
  commands: string[];
  validation: string;
  troubleshooting: string[];
}

export interface DocumentationLink {
  file: string;
  section: string;
  relevanceScore: number;
  summary: string;
}

export interface NextStepSuggestion {
  action: string;
  reasoning: string;
  priority: 'low' | 'medium' | 'high';
  estimatedTime: string;
}

interface DocumentationFileInternal {
  path: string;
  content: string;
  sections: DocumentationSectionInternal[];
  lastModified: Date;
}

interface DocumentationSectionInternal {
  title: string;
  content: string;
  lineStart: number;
  lineEnd: number;
  keywords: string[];
  relatedTopics: string[];
}

// =============================================================================
// DOCUMENTATION INTELLIGENCE ENGINE
// =============================================================================

export class DocumentationIntelligence {
  private projectRoot: string;
  private documentationCache: Map<string, DocumentationFileInternal> = new Map();
  private topicIndex: Map<string, DocumentationLink[]> = new Map();
  private usageAnalytics: Map<string, { count: number; usefulness: number }> = new Map();

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  /**
   * Initialize documentation intelligence by loading and indexing all documentation files
   */
  async initialize(): Promise<void> {
    console.log('🧠 Initializing Documentation Intelligence...');
    
    const docFiles = [
      'docs/TESTING.md',
      'docs/HOOKS.md', 
      'docs/COMMANDS.md',
      'docs/TROUBLESHOOTING.md',
      'docs/ARCHITECTURE.md',
      'docs/DEPLOYMENT.md',
      'docs/CLAUDE-WORKFLOWS.md',
      'docs/DEVELOPMENT.md'
    ];

    for (const filePath of docFiles) {
      try {
        await this.loadAndIndexDocumentation(filePath);
      } catch (error) {
        console.warn(`⚠️  Failed to load ${filePath}:`, error);
      }
    }

    await this.buildTopicIndex();
    console.log(`✅ Documentation Intelligence initialized with ${this.documentationCache.size} files`);
  }

  /**
   * Smart query resolution - main entry point for documentation queries
   */
  async queryDocumentation(query: string, context: ProjectContext): Promise<DocumentationResponse> {
    console.log(`🔍 Querying documentation: "${query}"`);
    
    // Normalize and extract keywords from query
    const keywords = this.extractKeywords(query);
    const queryType = this.classifyQuery(query);
    
    // Find relevant documentation sections
    const relevantSections = await this.findRelevantSections(keywords, context);
    
    // Generate contextual response
    const response = await this.generateContextualResponse(query, relevantSections, context, queryType);
    
    // Track usage for learning
    await this.trackDocumentationUsage(query, 0); // Usefulness will be updated later
    
    return response;
  }

  /**
   * Get contextual guidance for current development task
   */
  async getContextualGuidance(currentTask: string): Promise<GuidanceResponse> {
    console.log(`🎯 Getting contextual guidance for: "${currentTask}"`);
    
    const taskType = this.classifyTask(currentTask);
    const context = this.inferProjectContext(currentTask);
    
    switch (taskType) {
      case 'component-development':
        return await this.getComponentDevelopmentGuidance(currentTask, context);
      case 'testing':
        return await this.getTestingGuidance(currentTask, context);
      case 'performance':
        return await this.getPerformanceGuidance(currentTask, context);
      case 'deployment':
        return await this.getDeploymentGuidance(currentTask, context);
      case 'troubleshooting':
        return await this.getTroubleshootingGuidance(currentTask, context);
      default:
        return await this.getGeneralGuidance(currentTask, context);
    }
  }

  /**
   * Resolve workflow steps for complex development workflows
   */
  async resolveWorkflowSteps(workflow: string): Promise<WorkflowGuide> {
    console.log(`📋 Resolving workflow steps for: "${workflow}"`);
    
    const workflowType = this.classifyWorkflow(workflow);
    
    switch (workflowType) {
      case 'component-creation':
        return await this.getComponentCreationWorkflow();
      case 'testing-setup':
        return await this.getTestingSetupWorkflow();
      case 'performance-optimization':
        return await this.getPerformanceOptimizationWorkflow();
      case 'deployment-process':
        return await this.getDeploymentWorkflow();
      default:
        return await this.getGeneralWorkflow(workflow);
    }
  }

  /**
   * Find related documentation based on topic
   */
  async findRelatedDocumentation(topic: string): Promise<DocumentationLink[]> {
    const keywords = this.extractKeywords(topic);
    const relatedLinks: DocumentationLink[] = [];
    
    for (const keyword of keywords) {
      const links = this.topicIndex.get(keyword.toLowerCase()) || [];
      relatedLinks.push(...links);
    }
    
    // Sort by relevance score and remove duplicates
    const uniqueLinks = this.deduplicateLinks(relatedLinks);
    return uniqueLinks.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 10);
  }

  /**
   * Suggest next steps based on current action
   */
  async suggestNextSteps(currentAction: string): Promise<NextStepSuggestion[]> {
    const actionType = this.classifyAction(currentAction);
    const suggestions: NextStepSuggestion[] = [];
    
    switch (actionType) {
      case 'component-created':
        suggestions.push(
          {
            action: 'Run component-focused tests',
            reasoning: 'Validate new component functionality and integration',
            priority: 'high',
            estimatedTime: '3-5 minutes'
          },
          {
            action: 'Generate visual regression screenshots',
            reasoning: 'Capture visual baseline for future comparisons',
            priority: 'medium',
            estimatedTime: '2-3 minutes'
          },
          {
            action: 'Update documentation if needed',
            reasoning: 'Document new component patterns or usage',
            priority: 'low',
            estimatedTime: '5-10 minutes'
          }
        );
        break;
        
      case 'test-executed':
        suggestions.push(
          {
            action: 'Review test coverage',
            reasoning: 'Ensure adequate coverage for changes',
            priority: 'medium',
            estimatedTime: '2-3 minutes'
          },
          {
            action: 'Run performance validation',
            reasoning: 'Check Core Web Vitals impact',
            priority: 'medium',
            estimatedTime: '3-4 minutes'
          }
        );
        break;
        
      case 'build-completed':
        suggestions.push(
          {
            action: 'Check bundle size impact',
            reasoning: 'Validate bundle stays within 6MB budget',
            priority: 'high',
            estimatedTime: '1-2 minutes'
          },
          {
            action: 'Test production build locally',
            reasoning: 'Validate production build functionality',
            priority: 'medium',
            estimatedTime: '3-5 minutes'
          }
        );
        break;
        
      default:
        suggestions.push(
          {
            action: 'Run quality gates validation',
            reasoning: 'Ensure code quality standards are met',
            priority: 'medium',
            estimatedTime: '2-3 minutes'
          }
        );
    }
    
    return suggestions;
  }

  // =============================================================================
  // PRIVATE IMPLEMENTATION METHODS
  // =============================================================================

  /**
   * Load and index a single documentation file
   */
  private async loadAndIndexDocumentation(filePath: string): Promise<void> {
    const fullPath = join(this.projectRoot, filePath);
    const content = await fs.readFile(fullPath, 'utf-8');
    const stats = await fs.stat(fullPath);
    
    const sections = this.parseDocumentationSections(content);
    
    const docFile: DocumentationFileInternal = {
      path: filePath,
      content,
      sections,
      lastModified: stats.mtime
    };
    
    this.documentationCache.set(filePath, docFile);
  }

  /**
   * Parse documentation content into structured sections
   */
  private parseDocumentationSections(content: string): DocumentationSectionInternal[] {
    const lines = content.split('\n');
    const sections: DocumentationSectionInternal[] = [];
    let currentSection: Partial<DocumentationSectionInternal> | null = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect section headers (## or ###)
      if (line.match(/^##\s+/)) {
        // Save previous section
        if (currentSection && currentSection.title) {
          sections.push(this.completeSection(currentSection, i - 1));
        }
        
        // Start new section
        currentSection = {
          title: line.replace(/^##\s+/, '').replace(/\*\*/g, ''),
          content: '',
          lineStart: i,
          keywords: [],
          relatedTopics: []
        };
      } else if (currentSection) {
        currentSection.content += line + '\n';
      }
    }
    
    // Save final section
    if (currentSection && currentSection.title) {
      sections.push(this.completeSection(currentSection, lines.length - 1));
    }
    
    return sections;
  }

  /**
   * Complete section with extracted keywords and topics
   */
  private completeSection(section: Partial<DocumentationSectionInternal>, lineEnd: number): DocumentationSectionInternal {
    const keywords = this.extractKeywords(section.content || '');
    const relatedTopics = this.extractRelatedTopics(section.content || '');
    
    return {
      title: section.title || '',
      content: section.content || '',
      lineStart: section.lineStart || 0,
      lineEnd,
      keywords,
      relatedTopics
    };
  }

  /**
   * Build searchable topic index from all documentation
   */
  private async buildTopicIndex(): Promise<void> {
    this.topicIndex.clear();
    
    for (const [filePath, docFile] of this.documentationCache) {
      for (const section of docFile.sections) {
        const link: DocumentationLink = {
          file: filePath,
          section: section.title,
          relevanceScore: this.calculateRelevanceScore(section),
          summary: this.generateSectionSummary(section)
        };
        
        // Index by keywords
        for (const keyword of section.keywords) {
          const existing = this.topicIndex.get(keyword.toLowerCase()) || [];
          existing.push(link);
          this.topicIndex.set(keyword.toLowerCase(), existing);
        }
        
        // Index by section title keywords
        const titleKeywords = this.extractKeywords(section.title);
        for (const keyword of titleKeywords) {
          const existing = this.topicIndex.get(keyword.toLowerCase()) || [];
          existing.push(link);
          this.topicIndex.set(keyword.toLowerCase(), existing);
        }
      }
    }
  }

  /**
   * Extract keywords from text content
   */
  private extractKeywords(text: string): string[] {
    const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'this', 'that', 'these', 'those']);
    
    const words = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.has(word))
      .filter(word => !word.match(/^\d+$/)); // Remove pure numbers
    
    // Remove duplicates and sort by frequency
    const wordCount = new Map<string, number>();
    for (const word of words) {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    }
    
    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word]) => word);
  }

  /**
   * Extract related topics from content
   */
  private extractRelatedTopics(content: string): string[] {
    const topics: string[] = [];
    
    // Extract file references
    const fileRefs = content.match(/`[^`]*\.(?:md|ts|tsx|js|json|sh)`/g) || [];
    topics.push(...fileRefs.map(ref => ref.replace(/`/g, '')));
    
    // Extract npm script references
    const npmRefs = content.match(/npm run [a-z:]+/g) || [];
    topics.push(...npmRefs);
    
    // Extract command references
    const commandRefs = content.match(/`[^`]*\.(sh|js|ts)`/g) || [];
    topics.push(...commandRefs.map(ref => ref.replace(/`/g, '')));
    
    return [...new Set(topics)];
  }

  /**
   * Classify query type for better response generation
   */
  private classifyQuery(query: string): 'how-to' | 'troubleshooting' | 'reference' | 'workflow' | 'general' {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('how') || lowerQuery.includes('how to')) {
      return 'how-to';
    } else if (lowerQuery.includes('error') || lowerQuery.includes('problem') || lowerQuery.includes('issue') || lowerQuery.includes('not working')) {
      return 'troubleshooting';
    } else if (lowerQuery.includes('command') || lowerQuery.includes('script') || lowerQuery.includes('reference')) {
      return 'reference';
    } else if (lowerQuery.includes('workflow') || lowerQuery.includes('process') || lowerQuery.includes('steps')) {
      return 'workflow';
    } else {
      return 'general';
    }
  }

  /**
   * Find relevant documentation sections based on keywords and context
   */
  private async findRelevantSections(keywords: string[], context: ProjectContext): Promise<DocumentationLink[]> {
    const allLinks: DocumentationLink[] = [];
    
    for (const keyword of keywords) {
      const links = this.topicIndex.get(keyword.toLowerCase()) || [];
      allLinks.push(...links);
    }
    
    // Apply context-based scoring adjustments
    for (const link of allLinks) {
      if (context.developmentContext === '2' && link.file.includes('DEVELOPMENT.md')) {
        link.relevanceScore += 20; // Boost development docs for /2 context
      }
      if (context.environment !== 'local' && link.file.includes('TROUBLESHOOTING.md')) {
        link.relevanceScore += 15; // Boost troubleshooting for cloud environments
      }
    }
    
    const uniqueLinks = this.deduplicateLinks(allLinks);
    return uniqueLinks.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 5);
  }

  /**
   * Generate contextual response based on query and relevant sections
   */
  private async generateContextualResponse(
    query: string,
    relevantSections: DocumentationLink[],
    context: ProjectContext,
    queryType: string
  ): Promise<DocumentationResponse> {
    if (relevantSections.length === 0) {
      return {
        primarySource: 'No specific documentation found',
        supportingSources: [],
        contextualAdvice: 'Consider checking the general documentation files or asking for more specific guidance.',
        suggestedActions: ['npm run test:e2e:smoke', 'npm run validate'],
        confidence: 10,
        estimatedReadTime: '1 minute'
      };
    }
    
    const primarySource = relevantSections[0];
    const supportingSources = relevantSections.slice(1, 3).map(link => `${link.file}:${link.section}`);
    
    // Generate contextual advice based on current project state
    const contextualAdvice = this.generateContextualAdvice(query, context, primarySource);
    
    // Generate suggested actions based on query type and context
    const suggestedActions = this.generateSuggestedActions(queryType, context, query);
    
    return {
      primarySource: `${primarySource.file}:${primarySource.section}`,
      supportingSources,
      contextualAdvice,
      suggestedActions,
      confidence: Math.min(95, primarySource.relevanceScore + 20),
      estimatedReadTime: this.estimateReadTime(relevantSections)
    };
  }

  /**
   * Generate contextual advice based on current project state
   */
  private generateContextualAdvice(query: string, context: ProjectContext, primarySource: DocumentationLink): string {
    const advice: string[] = [];
    
    // Context-specific advice
    if (context.developmentContext === '2') {
      advice.push('Current /2 redesign context - focus on Enterprise Solutions Architect patterns');
    }
    
    if (context.environment !== 'local') {
      advice.push(`Cloud environment (${context.environment}) detected - MCP tools recommended for reliability`);
    }
    
    // Source-specific advice
    if (primarySource.file.includes('TROUBLESHOOTING.md')) {
      advice.push('Check recent changes and environment variables if issues persist');
    } else if (primarySource.file.includes('TESTING.md')) {
      advice.push('Use npm run test:e2e:smoke for quick validation during development');
    } else if (primarySource.file.includes('DEVELOPMENT.md')) {
      advice.push('Follow established component patterns and brand token usage');
    }
    
    return advice.join('. ') || 'Follow the documentation guidance for best results.';
  }

  /**
   * Generate suggested actions based on query type and context
   */
  private generateSuggestedActions(queryType: string, context: ProjectContext, query: string): string[] {
    const actions: string[] = [];
    const lowerQuery = query.toLowerCase();
    
    // Query-specific actions
    if (lowerQuery.includes('test')) {
      actions.push('npm run test:e2e:smoke', 'npm run test:e2e:dev');
    } else if (lowerQuery.includes('build') || lowerQuery.includes('bundle')) {
      actions.push('npm run build', 'npm run bundle-check');
    } else if (lowerQuery.includes('dev') || lowerQuery.includes('server')) {
      actions.push('npm run dev', 'eval "$(./scripts/detect-active-port.sh quiet export)"');
    } else if (lowerQuery.includes('validate') || lowerQuery.includes('quality')) {
      actions.push('npm run validate', 'npm run typecheck', 'npm run lint');
    }
    
    // Context-specific actions
    if (context.developmentContext === '2') {
      actions.push('npx playwright test e2e/quick-screenshots.spec.ts --project=chromium');
    }
    
    // Default actions if none specified
    if (actions.length === 0) {
      actions.push('npm run test:e2e:smoke', 'npm run validate');
    }
    
    return [...new Set(actions)].slice(0, 4);
  }

  // Additional helper methods...
  private classifyTask(task: string): string {
    const lowerTask = task.toLowerCase();
    if (lowerTask.includes('component')) return 'component-development';
    if (lowerTask.includes('test')) return 'testing';
    if (lowerTask.includes('performance') || lowerTask.includes('bundle')) return 'performance';
    if (lowerTask.includes('deploy')) return 'deployment';
    if (lowerTask.includes('error') || lowerTask.includes('problem')) return 'troubleshooting';
    return 'general';
  }

  private classifyWorkflow(workflow: string): string {
    const lowerWorkflow = workflow.toLowerCase();
    if (lowerWorkflow.includes('component')) return 'component-creation';
    if (lowerWorkflow.includes('test')) return 'testing-setup';
    if (lowerWorkflow.includes('performance')) return 'performance-optimization';
    if (lowerWorkflow.includes('deploy')) return 'deployment-process';
    return 'general';
  }

  private classifyAction(action: string): string {
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes('component') && lowerAction.includes('created')) return 'component-created';
    if (lowerAction.includes('test') && lowerAction.includes('executed')) return 'test-executed';
    if (lowerAction.includes('build') && lowerAction.includes('completed')) return 'build-completed';
    return 'general';
  }

  private inferProjectContext(task: string): '2' | 'main' | 'mixed' {
    if (task.includes('/2') || task.includes('enterprise') || task.includes('redesign')) {
      return '2';
    }
    return 'main';
  }

  private calculateRelevanceScore(section: DocumentationSectionInternal): number {
    let score = 50; // Base score
    
    // Boost for longer content (more comprehensive)
    score += Math.min(20, section.content.length / 100);
    
    // Boost for more keywords (broader coverage)
    score += Math.min(15, section.keywords.length * 2);
    
    // Boost for code examples
    if (section.content.includes('```')) score += 10;
    
    // Boost for command examples
    if (section.content.includes('npm run')) score += 10;
    
    return Math.min(100, score);
  }

  private generateSectionSummary(section: DocumentationSectionInternal): string {
    const firstSentence = section.content.split('.')[0];
    return firstSentence.length > 120 ? firstSentence.substring(0, 120) + '...' : firstSentence;
  }

  private deduplicateLinks(links: DocumentationLink[]): DocumentationLink[] {
    const seen = new Set<string>();
    return links.filter(link => {
      const key = `${link.file}:${link.section}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private estimateReadTime(sections: DocumentationLink[]): string {
    const totalChars = sections.reduce((sum, section) => sum + section.summary.length, 0);
    const minutes = Math.max(1, Math.ceil(totalChars / 1000)); // ~200 words per minute
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  // Placeholder implementations for guidance methods
  private async getComponentDevelopmentGuidance(task: string, context: string): Promise<GuidanceResponse> {
    return {
      relevantDocs: ['DEVELOPMENT.md:Component Development Workflow', 'ARCHITECTURE.md:/2 Component Patterns'],
      checklist: [
        'Create component in src/app/2/components/[Name]/',
        'Follow CSS modules + brand tokens pattern',
        'Implement TypeScript interfaces',
        'Add accessibility attributes',
        'Test with npm run test:e2e:component'
      ],
      warnings: ['Brand tokens file (brand-tokens.css) is protected - requires confirmation'],
      nextSteps: ['Run npm run test:e2e:smoke after implementation'],
      estimatedTime: '30-60 minutes',
      difficulty: 'intermediate'
    };
  }

  private async getTestingGuidance(task: string, context: string): Promise<GuidanceResponse> {
    return {
      relevantDocs: ['TESTING.md:Fast Development Testing', 'COMMANDS.md:Testing Commands'],
      checklist: [
        'Start development server if needed',
        'Run appropriate test strategy for changes',
        'Generate screenshots for visual validation',
        'Check test coverage and performance impact'
      ],
      warnings: ['Ensure development server is running before testing'],
      nextSteps: ['Review test results and update documentation if needed'],
      estimatedTime: '5-15 minutes',
      difficulty: 'beginner'
    };
  }

  private async getPerformanceGuidance(task: string, context: string): Promise<GuidanceResponse> {
    return {
      relevantDocs: ['ARCHITECTURE.md:Performance Optimization', 'TROUBLESHOOTING.md:Performance Issues'],
      checklist: [
        'Check bundle size with npm run bundle-check',
        'Monitor Core Web Vitals',
        'Validate animation performance (60fps)',
        'Test mobile performance'
      ],
      warnings: ['Bundle budget is 6MB - monitor size carefully'],
      nextSteps: ['Run performance testing after optimizations'],
      estimatedTime: '15-30 minutes',
      difficulty: 'intermediate'
    };
  }

  private async getDeploymentGuidance(task: string, context: string): Promise<GuidanceResponse> {
    return {
      relevantDocs: ['DEPLOYMENT.md:Production Deployment', 'COMMANDS.md:Build Commands'],
      checklist: [
        'Run npm run validate for quality gates',
        'Test production build locally',
        'Validate health endpoints',
        'Check container configuration'
      ],
      warnings: ['Always test production build before deployment'],
      nextSteps: ['Monitor deployment health and performance'],
      estimatedTime: '20-45 minutes',
      difficulty: 'advanced'
    };
  }

  private async getTroubleshootingGuidance(task: string, context: string): Promise<GuidanceResponse> {
    return {
      relevantDocs: ['TROUBLESHOOTING.md:Common Issues', 'HOOKS.md:Hook System Debugging'],
      checklist: [
        'Check recent changes for correlation',
        'Validate environment variables',
        'Test in isolation to identify scope',
        'Check logs for error patterns'
      ],
      warnings: ['Document any new issues found for future reference'],
      nextSteps: ['Test fix thoroughly and update troubleshooting docs'],
      estimatedTime: '10-30 minutes',
      difficulty: 'intermediate'
    };
  }

  private async getGeneralGuidance(task: string, context: string): Promise<GuidanceResponse> {
    return {
      relevantDocs: ['DEVELOPMENT.md:Daily Workflows', 'COMMANDS.md:Quick Reference'],
      checklist: [
        'Understand the current project context',
        'Check existing documentation',
        'Start with simple validation',
        'Follow established patterns'
      ],
      warnings: ['When in doubt, ask for clarification'],
      nextSteps: ['Break down complex tasks into smaller steps'],
      estimatedTime: '10-20 minutes',
      difficulty: 'beginner'
    };
  }

  // Placeholder workflow implementations
  private async getComponentCreationWorkflow(): Promise<WorkflowGuide> {
    return {
      steps: [
        {
          step: 1,
          title: 'Create component directory structure',
          description: 'Set up the component directory following /2 architecture patterns',
          commands: ['mkdir src/app/2/components/[ComponentName]'],
          validation: 'Directory exists with proper naming convention',
          troubleshooting: ['Check path is correct', 'Verify permissions']
        },
        {
          step: 2,
          title: 'Implement component with TypeScript',
          description: 'Create the React component with proper TypeScript interfaces',
          commands: ['touch [ComponentName].tsx', 'touch [ComponentName].module.css'],
          validation: 'Component compiles without TypeScript errors',
          troubleshooting: ['Check import paths', 'Validate prop interfaces']
        },
        {
          step: 3,
          title: 'Add styling with brand tokens',
          description: 'Implement CSS modules using the brand tokens system',
          commands: ['npm run typecheck'],
          validation: 'Styles follow brand token patterns',
          troubleshooting: ['Check CSS variable usage', 'Validate responsive design']
        },
        {
          step: 4,
          title: 'Test and validate',
          description: 'Run tests and generate visual validation',
          commands: ['npm run test:e2e:smoke', 'npm run test:e2e:component'],
          validation: 'All tests pass and component renders correctly',
          troubleshooting: ['Check test configuration', 'Validate component props']
        }
      ],
      prerequisites: ['Development server running', 'TypeScript knowledge', 'Understanding of /2 architecture'],
      estimatedTime: '45-90 minutes',
      relatedWorkflows: ['Testing Setup Workflow', 'Performance Optimization Workflow']
    };
  }

  private async getTestingSetupWorkflow(): Promise<WorkflowGuide> {
    return {
      steps: [
        {
          step: 1,
          title: 'Environment validation',
          description: 'Ensure development environment is ready for testing',
          commands: ['npm run dev', 'eval "$(./scripts/detect-active-port.sh quiet export)"'],
          validation: 'Development server accessible',
          troubleshooting: ['Check port conflicts', 'Validate server health']
        }
      ],
      prerequisites: ['Playwright installed', 'Development server capability'],
      estimatedTime: '10-20 minutes',
      relatedWorkflows: ['Component Creation Workflow']
    };
  }

  private async getPerformanceOptimizationWorkflow(): Promise<WorkflowGuide> {
    return {
      steps: [
        {
          step: 1,
          title: 'Baseline measurement',
          description: 'Establish current performance baseline',
          commands: ['npm run test:e2e:performance', 'npm run bundle-check'],
          validation: 'Baseline metrics captured',
          troubleshooting: ['Check measurement tools', 'Validate test environment']
        }
      ],
      prerequisites: ['Performance testing setup', 'Bundle analysis tools'],
      estimatedTime: '30-60 minutes',
      relatedWorkflows: ['Testing Setup Workflow']
    };
  }

  private async getDeploymentWorkflow(): Promise<WorkflowGuide> {
    return {
      steps: [
        {
          step: 1,
          title: 'Pre-deployment validation',
          description: 'Run all quality gates and validation',
          commands: ['npm run validate', 'npm run test:e2e:portfolio'],
          validation: 'All quality gates pass',
          troubleshooting: ['Fix any quality gate failures', 'Validate test reliability']
        }
      ],
      prerequisites: ['Quality gates passing', 'Deployment credentials'],
      estimatedTime: '20-45 minutes',
      relatedWorkflows: ['Performance Optimization Workflow']
    };
  }

  private async getGeneralWorkflow(workflow: string): Promise<WorkflowGuide> {
    return {
      steps: [
        {
          step: 1,
          title: 'Define workflow requirements',
          description: 'Break down the workflow into specific steps',
          commands: ['# Analyze requirements'],
          validation: 'Clear understanding of objectives',
          troubleshooting: ['Clarify unclear requirements', 'Research similar workflows']
        }
      ],
      prerequisites: ['Clear requirements', 'Access to documentation'],
      estimatedTime: 'Variable',
      relatedWorkflows: ['Component Creation Workflow', 'Testing Setup Workflow']
    };
  }

  /**
   * Track documentation usage for learning and optimization
   */
  async trackDocumentationUsage(query: string, usefulness: number): Promise<void> {
    const normalizedQuery = query.toLowerCase().trim();
    const existing = this.usageAnalytics.get(normalizedQuery);
    
    if (existing) {
      existing.count += 1;
      if (usefulness > 0) {
        existing.usefulness = (existing.usefulness + usefulness) / 2;
      }
    } else {
      this.usageAnalytics.set(normalizedQuery, {
        count: 1,
        usefulness: usefulness || 0
      });
    }
  }

  /**
   * Update contextual relevance based on project context
   */
  async updateContextualRelevance(context: ProjectContext): Promise<void> {
    // This could be enhanced to adjust relevance scores based on:
    // - Current development context (main vs /2)
    // - Recent file changes
    // - Active GitHub issues
    // - Performance metrics
    
    console.log(`📊 Updating contextual relevance for ${context.developmentContext} context`);
  }
}