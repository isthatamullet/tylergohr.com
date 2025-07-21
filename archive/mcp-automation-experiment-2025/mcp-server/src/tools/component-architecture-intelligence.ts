import { promises as fs } from 'fs';
import { join } from 'path';
import { ProjectContext } from '../types/project.js';

// Component pattern analysis and generation
export interface ComponentPattern {
  name: string;
  type: 'ui' | 'section' | 'layout' | 'interactive';
  patterns: {
    structure: string[];
    styling: string[];
    props: string[];
    imports: string[];
  };
  brandTokens: string[];
  accessibility: string[];
  animation: string[];
}

export interface ComponentGenerationRequest {
  componentName: string;
  componentType: 'ui' | 'section' | 'layout' | 'interactive';
  section?: 'hero' | 'about' | 'results' | 'case-studies' | 'how-i-work' | 'technical-expertise' | 'contact';
  features: string[];
  styling: 'css-modules' | 'styled-components' | 'emotion';
  animation: boolean;
  responsive: boolean;
  accessibility: boolean;
}

export interface ComponentAnalysis {
  patterns: ComponentPattern[];
  brandTokenUsage: {
    token: string;
    usage: string[];
    compliance: number;
  }[];
  architectureInsights: {
    fileStructure: string[];
    namingConventions: string[];
    importPatterns: string[];
    exportPatterns: string[];
  };
  recommendations: string[];
}

export interface GeneratedComponent {
  componentFile: {
    path: string;
    content: string;
  };
  stylesFile: {
    path: string;
    content: string;
  };
  indexFile?: {
    path: string;
    content: string;
  };
  tests?: {
    path: string;
    content: string;
  };
  usage: string;
  implementation: string[];
}

/**
 * Component Architecture Intelligence Engine
 * Analyzes existing /2 components and generates new components with brand compliance
 */
export class ComponentArchitectureIntelligence {
  private projectContext: ProjectContext;
  private componentsPath: string;
  private brandTokensPath: string;
  private analysisCache: Map<string, ComponentAnalysis> = new Map();

  constructor(projectContext: ProjectContext) {
    this.projectContext = projectContext;
    this.componentsPath = join(projectContext.projectRoot, 'src/app/2/components');
    this.brandTokensPath = join(projectContext.projectRoot, 'src/app/2/styles/brand-tokens.css');
  }

  /**
   * Analyze existing component architecture and patterns
   */
  async analyzeComponentArchitecture(): Promise<ComponentAnalysis> {
    const cacheKey = 'component-architecture';
    if (this.analysisCache.has(cacheKey)) {
      return this.analysisCache.get(cacheKey)!;
    }

    try {
      const [patterns, brandTokenUsage, architectureInsights] = await Promise.all([
        this.analyzeComponentPatterns(),
        this.analyzeBrandTokenUsage(),
        this.analyzeArchitecturePatterns()
      ]);

      const recommendations = this.generateRecommendations(patterns, brandTokenUsage, architectureInsights);

      const analysis: ComponentAnalysis = {
        patterns,
        brandTokenUsage,
        architectureInsights,
        recommendations
      };

      this.analysisCache.set(cacheKey, analysis);
      return analysis;
    } catch (error) {
      throw new Error(`Failed to analyze component architecture: ${error}`);
    }
  }

  /**
   * Generate a new component following established patterns
   */
  async generateComponent(request: ComponentGenerationRequest): Promise<GeneratedComponent> {
    const analysis = await this.analyzeComponentArchitecture();
    const relevantPatterns = analysis.patterns.filter(p => p.type === request.componentType);
    
    if (relevantPatterns.length === 0) {
      throw new Error(`No patterns found for component type: ${request.componentType}`);
    }

    const basePattern = relevantPatterns[0];
    const brandTokens = await this.loadBrandTokens();

    // Generate component structure
    const componentPath = this.generateComponentPath(request.componentName, request.componentType);
    const componentContent = this.generateComponentContent(request, basePattern, brandTokens);
    const stylesContent = this.generateStylesContent(request, basePattern, brandTokens);
    const indexContent = this.generateIndexContent(request.componentName);
    const testsContent = this.generateTestsContent(request, componentContent);

    return {
      componentFile: {
        path: join(componentPath, `${request.componentName}.tsx`),
        content: componentContent
      },
      stylesFile: {
        path: join(componentPath, `${request.componentName}.module.css`),
        content: stylesContent
      },
      indexFile: {
        path: join(componentPath, 'index.ts'),
        content: indexContent
      },
      tests: {
        path: join(componentPath, `${request.componentName}.test.tsx`),
        content: testsContent
      },
      usage: this.generateUsageExample(request, componentContent),
      implementation: this.generateImplementationSteps(request, componentPath)
    };
  }

  /**
   * Validate component against brand token compliance
   */
  async validateComponentCompliance(componentPath: string): Promise<{
    compliance: number;
    issues: string[];
    recommendations: string[];
  }> {
    try {
      const componentContent = await fs.readFile(componentPath, 'utf-8');
      const brandTokens = await this.loadBrandTokens();
      
      const issues: string[] = [];
      const recommendations: string[] = [];
      let complianceScore = 100;

      // Check brand token usage
      const brandTokenUsage = this.extractBrandTokenUsage(componentContent);
      if (brandTokenUsage.length === 0) {
        issues.push('No brand tokens detected - component should use CSS custom properties from brand-tokens.css');
        complianceScore -= 20;
        recommendations.push('Import and use brand tokens: var(--hero-bg), var(--text-on-dark), etc.');
      }

      // Check accessibility patterns
      if (!componentContent.includes('aria-')) {
        issues.push('Missing accessibility attributes - add appropriate ARIA labels and roles');
        complianceScore -= 15;
        recommendations.push('Add accessibility attributes: aria-label, aria-describedby, role, etc.');
      }

      // Check responsive design
      if (!componentContent.includes('clamp(') && !componentContent.includes('@media')) {
        issues.push('Missing responsive design patterns - use clamp() functions or media queries');
        complianceScore -= 15;
        recommendations.push('Implement responsive design using brand token clamp() functions');
      }

      // Check animation compliance
      if (componentContent.includes('Framer Motion') && !componentContent.includes('prefers-reduced-motion')) {
        issues.push('Animation without reduced motion support');
        complianceScore -= 10;
        recommendations.push('Add prefers-reduced-motion support for accessibility');
      }

      // Check TypeScript interfaces
      if (!componentContent.includes('interface') && !componentContent.includes('type')) {
        issues.push('Missing TypeScript interfaces - define component props interface');
        complianceScore -= 10;
        recommendations.push('Add TypeScript interface for component props');
      }

      return {
        compliance: Math.max(0, complianceScore),
        issues,
        recommendations
      };
    } catch (error) {
      throw new Error(`Failed to validate component compliance: ${error}`);
    }
  }

  /**
   * Get component architecture insights and optimization suggestions
   */
  async getArchitectureInsights(): Promise<{
    componentCount: number;
    patternDistribution: Record<string, number>;
    brandTokenCoverage: number;
    accessibilityScore: number;
    performanceOptimizations: string[];
    architectureRecommendations: string[];
  }> {
    const analysis = await this.analyzeComponentArchitecture();
    
    const patternDistribution = analysis.patterns.reduce((acc, pattern) => {
      acc[pattern.type] = (acc[pattern.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const brandTokenCoverage = analysis.brandTokenUsage.reduce((avg, token) => 
      avg + token.compliance, 0) / analysis.brandTokenUsage.length;

    return {
      componentCount: analysis.patterns.length,
      patternDistribution,
      brandTokenCoverage,
      accessibilityScore: await this.calculateAccessibilityScore(),
      performanceOptimizations: await this.getPerformanceOptimizations(),
      architectureRecommendations: analysis.recommendations
    };
  }

  // Private helper methods

  private async analyzeComponentPatterns(): Promise<ComponentPattern[]> {
    const patterns: ComponentPattern[] = [];
    
    try {
      const componentDirs = await this.getComponentDirectories();
      
      for (const dir of componentDirs) {
        const pattern = await this.analyzeComponentDirectory(dir);
        if (pattern) {
          patterns.push(pattern);
        }
      }
      
      return patterns;
    } catch (error) {
      console.error('Failed to analyze component patterns:', error);
      return [];
    }
  }

  private async getComponentDirectories(): Promise<string[]> {
    const componentDirs: string[] = [];
    
    const scanDirectory = async (dirPath: string): Promise<void> => {
      try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
          if (entry.isDirectory()) {
            const fullPath = join(dirPath, entry.name);
            componentDirs.push(fullPath);
            await scanDirectory(fullPath); // Recursive scan
          }
        }
      } catch (error) {
        // Directory might not exist or be accessible
      }
    };
    
    await scanDirectory(this.componentsPath);
    return componentDirs;
  }

  private async analyzeComponentDirectory(dirPath: string): Promise<ComponentPattern | null> {
    try {
      const files = await fs.readdir(dirPath);
      const tsxFile = files.find(f => f.endsWith('.tsx'));
      const cssFile = files.find(f => f.endsWith('.module.css'));
      
      if (!tsxFile) return null;
      
      const componentName = tsxFile.replace('.tsx', '');
      const componentContent = await fs.readFile(join(dirPath, tsxFile), 'utf-8');
      const cssContent = cssFile ? await fs.readFile(join(dirPath, cssFile), 'utf-8') : '';
      
      const structure = this.extractStructurePatterns(componentContent);
      const styling = this.extractStylingPatterns(cssContent);
      const props = this.extractPropsPatterns(componentContent);
      const imports = this.extractImportPatterns(componentContent);
      const brandTokens = this.extractBrandTokenUsage(cssContent);
      const accessibility = this.extractAccessibilityPatterns(componentContent);
      const animation = this.extractAnimationPatterns(componentContent);
      
      return {
        name: componentName,
        type: this.determineComponentType(componentName, componentContent),
        patterns: { structure, styling, props, imports },
        brandTokens,
        accessibility,
        animation
      };
    } catch (error) {
      return null;
    }
  }

  private extractStructurePatterns(content: string): string[] {
    const patterns: string[] = [];
    
    // Common React patterns
    if (content.includes('useState')) patterns.push('useState hook');
    if (content.includes('useEffect')) patterns.push('useEffect hook');
    if (content.includes('useRef')) patterns.push('useRef hook');
    if (content.includes('forwardRef')) patterns.push('forwardRef pattern');
    if (content.includes('interface') && content.includes('Props')) patterns.push('TypeScript props interface');
    if (content.includes('React.FC')) patterns.push('React.FC typing');
    if (content.includes('"use client"')) patterns.push('Next.js client component');
    
    return patterns;
  }

  private extractStylingPatterns(content: string): string[] {
    const patterns: string[] = [];
    
    if (content.includes('var(--')) patterns.push('CSS custom properties');
    if (content.includes('clamp(')) patterns.push('Responsive clamp functions');
    if (content.includes('@media')) patterns.push('Media queries');
    if (content.includes('grid')) patterns.push('CSS Grid');
    if (content.includes('flex')) patterns.push('CSS Flexbox');
    if (content.includes('transform')) patterns.push('CSS transforms');
    if (content.includes('transition')) patterns.push('CSS transitions');
    if (content.includes('will-change')) patterns.push('Performance optimizations');
    
    return patterns;
  }

  private extractPropsPatterns(content: string): string[] {
    const patterns: string[] = [];
    
    if (content.includes('children: React.ReactNode')) patterns.push('React children prop');
    if (content.includes('className?:')) patterns.push('Optional className prop');
    if (content.includes('onClick?:')) patterns.push('Optional onClick handler');
    if (content.includes('disabled?:')) patterns.push('Optional disabled state');
    if (content.includes('variant?:')) patterns.push('Variant-based styling');
    if (content.includes('size?:')) patterns.push('Size prop variants');
    
    return patterns;
  }

  private extractImportPatterns(content: string): string[] {
    const patterns: string[] = [];
    
    if (content.includes("import React")) patterns.push('React import');
    if (content.includes("import { ClientMotionDiv")) patterns.push('Framer Motion client import');
    if (content.includes("import styles from")) patterns.push('CSS modules import');
    if (content.includes("import type")) patterns.push('TypeScript type import');
    if (content.includes("from '@/")) patterns.push('Absolute imports');
    
    return patterns;
  }

  private extractBrandTokenUsage(content: string): string[] {
    const tokens: string[] = [];
    const matches = content.match(/var\(--[^)]+\)/g);
    
    if (matches) {
      tokens.push(...matches.map(match => match.replace('var(', '').replace(')', '')));
    }
    
    return [...new Set(tokens)]; // Remove duplicates
  }

  private extractAccessibilityPatterns(content: string): string[] {
    const patterns: string[] = [];
    
    if (content.includes('aria-')) patterns.push('ARIA attributes');
    if (content.includes('role=')) patterns.push('Role attributes');
    if (content.includes('tabIndex')) patterns.push('Tab navigation');
    if (content.includes('aria-label')) patterns.push('Accessibility labels');
    if (content.includes('aria-describedby')) patterns.push('Accessibility descriptions');
    if (content.includes('aria-live')) patterns.push('Live regions');
    
    return patterns;
  }

  private extractAnimationPatterns(content: string): string[] {
    const patterns: string[] = [];
    
    if (content.includes('whileHover')) patterns.push('Hover animations');
    if (content.includes('whileTap')) patterns.push('Tap animations');
    if (content.includes('whileFocus')) patterns.push('Focus animations');
    if (content.includes('animate')) patterns.push('Framer Motion animations');
    if (content.includes('transition')) patterns.push('Animation transitions');
    if (content.includes('variants')) patterns.push('Animation variants');
    if (content.includes('useMotionValue')) patterns.push('Motion values');
    
    return patterns;
  }

  private determineComponentType(name: string, content: string): 'ui' | 'section' | 'layout' | 'interactive' {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('button') || lowerName.includes('input') || lowerName.includes('card')) {
      return 'ui';
    }
    if (lowerName.includes('layout') || lowerName.includes('container') || lowerName.includes('wrapper')) {
      return 'layout';
    }
    if (content.includes('useState') || content.includes('onClick') || content.includes('onChange')) {
      return 'interactive';
    }
    
    return 'section';
  }

  private async analyzeBrandTokenUsage(): Promise<{
    token: string;
    usage: string[];
    compliance: number;
  }[]> {
    const brandTokens = await this.loadBrandTokens();
    const usage: { token: string; usage: string[]; compliance: number; }[] = [];
    
    for (const token of brandTokens) {
      const tokenUsage = await this.findTokenUsage(token);
      const compliance = this.calculateTokenCompliance(token, tokenUsage);
      
      usage.push({
        token,
        usage: tokenUsage,
        compliance
      });
    }
    
    return usage;
  }

  private async analyzeArchitecturePatterns(): Promise<{
    fileStructure: string[];
    namingConventions: string[];
    importPatterns: string[];
    exportPatterns: string[];
  }> {
    const componentDirs = await this.getComponentDirectories();
    
    const fileStructure: string[] = [];
    const namingConventions: string[] = [];
    const importPatterns: string[] = [];
    const exportPatterns: string[] = [];
    
    for (const dir of componentDirs.slice(0, 10)) { // Sample first 10 for analysis
      try {
        const files = await fs.readdir(dir);
        
        // Analyze file structure
        if (files.some(f => f.endsWith('.tsx')) && files.some(f => f.endsWith('.module.css'))) {
          fileStructure.push('Component + CSS Modules pattern');
        }
        if (files.includes('index.ts')) {
          fileStructure.push('Index file exports');
        }
        
        // Analyze naming conventions
        const tsxFile = files.find(f => f.endsWith('.tsx'));
        if (tsxFile) {
          const componentName = tsxFile.replace('.tsx', '');
          if (componentName === componentName.charAt(0).toUpperCase() + componentName.slice(1)) {
            namingConventions.push('PascalCase component names');
          }
          
          const content = await fs.readFile(join(dir, tsxFile), 'utf-8');
          
          // Analyze import patterns
          if (content.includes("import styles from './")) {
            importPatterns.push('Relative CSS module imports');
          }
          if (content.includes("from '@/")) {
            importPatterns.push('Absolute path imports');
          }
          
          // Analyze export patterns
          if (content.includes('export default')) {
            exportPatterns.push('Default exports');
          }
          if (content.includes('export const')) {
            exportPatterns.push('Named exports');
          }
        }
      } catch (error) {
        // Skip directories with issues
      }
    }
    
    return {
      fileStructure: [...new Set(fileStructure)],
      namingConventions: [...new Set(namingConventions)],
      importPatterns: [...new Set(importPatterns)],
      exportPatterns: [...new Set(exportPatterns)]
    };
  }

  private generateRecommendations(
    patterns: ComponentPattern[],
    brandTokenUsage: { token: string; usage: string[]; compliance: number; }[],
    architectureInsights: any
  ): string[] {
    const recommendations: string[] = [];
    
    // Brand token recommendations
    const lowComplianceTokens = brandTokenUsage.filter(t => t.compliance < 80);
    if (lowComplianceTokens.length > 0) {
      recommendations.push(`Improve brand token usage for: ${lowComplianceTokens.map(t => t.token).join(', ')}`);
    }
    
    // Accessibility recommendations
    const accessibilityPatterns = patterns.flatMap(p => p.accessibility);
    if (accessibilityPatterns.length < patterns.length * 2) {
      recommendations.push('Increase accessibility compliance across components');
    }
    
    // Animation recommendations
    const animationPatterns = patterns.flatMap(p => p.animation);
    if (animationPatterns.some(p => !p.includes('reduced motion'))) {
      recommendations.push('Add prefers-reduced-motion support to animated components');
    }
    
    // Performance recommendations
    const performancePatterns = patterns.flatMap(p => p.patterns.styling);
    if (!performancePatterns.some(p => p.includes('Performance optimizations'))) {
      recommendations.push('Add performance optimizations (will-change, transform3d) to animated components');
    }
    
    return recommendations;
  }

  private async loadBrandTokens(): Promise<string[]> {
    try {
      const content = await fs.readFile(this.brandTokensPath, 'utf-8');
      const matches = content.match(/--[a-zA-Z-]+:/g);
      return matches ? matches.map(m => m.replace(':', '')) : [];
    } catch (error) {
      return [];
    }
  }

  private async findTokenUsage(token: string): Promise<string[]> {
    const usage: string[] = [];
    const componentDirs = await this.getComponentDirectories();
    
    for (const dir of componentDirs.slice(0, 20)) { // Limit search for performance
      try {
        const files = await fs.readdir(dir);
        const cssFile = files.find(f => f.endsWith('.module.css'));
        
        if (cssFile) {
          const content = await fs.readFile(join(dir, cssFile), 'utf-8');
          if (content.includes(`var(${token})`)) {
            usage.push(dir.split('/').pop() || 'Unknown component');
          }
        }
      } catch (error) {
        // Skip files with issues
      }
    }
    
    return usage;
  }

  private calculateTokenCompliance(token: string, usage: string[]): number {
    // Simple compliance calculation based on usage frequency
    // More usage = higher compliance (up to 100%)
    return Math.min(100, usage.length * 20);
  }

  private generateComponentPath(componentName: string, componentType: string): string {
    const baseDir = componentType === 'ui' ? 'ui' : componentType;
    return join(this.componentsPath, baseDir, componentName);
  }

  private generateComponentContent(
    request: ComponentGenerationRequest,
    pattern: ComponentPattern,
    brandTokens: string[]
  ): string {
    const sectionBg = request.section ? `--${request.section}-bg` : '--hero-bg';
    const textColor = request.section && ['contact', 'how-i-work'].includes(request.section) 
      ? '--text-on-light' : '--text-on-dark';

    return `"use client"

import React from 'react'
${request.animation ? "import { ClientMotionDiv } from '@/app/2/lib/framer-motion-client'" : ''}
import styles from './${request.componentName}.module.css'

export interface ${request.componentName}Props {
  /**
   * Component content
   */
  children?: React.ReactNode
  
  /**
   * Additional CSS classes
   */
  className?: string
  
  /**
   * Section context for optimized styling
   */
  section?: 'hero' | 'about' | 'results' | 'case-studies' | 'how-i-work' | 'technical-expertise' | 'contact'
  
  ${request.features.includes('variant') ? "/**\n   * Visual variant\n   */\n  variant?: 'primary' | 'secondary' | 'outline'\n  " : ''}
  ${request.features.includes('size') ? "/**\n   * Size variant\n   */\n  size?: 'sm' | 'md' | 'lg'\n  " : ''}
  ${request.features.includes('disabled') ? "/**\n   * Disabled state\n   */\n  disabled?: boolean\n  " : ''}
  ${request.features.includes('loading') ? "/**\n   * Loading state\n   */\n  loading?: boolean\n  " : ''}
}

/**
 * ${request.componentName} component with brand token compliance and accessibility
 * Designed for the Enterprise Solutions Architect portfolio
 */
export const ${request.componentName}: React.FC<${request.componentName}Props> = ({
  children,
  className = '',
  section = 'hero',
  ${request.features.includes('variant') ? "variant = 'primary'," : ''}
  ${request.features.includes('size') ? "size = 'md'," : ''}
  ${request.features.includes('disabled') ? "disabled = false," : ''}
  ${request.features.includes('loading') ? "loading = false," : ''}
  ...props
}) => {
  const componentClasses = [
    styles.${request.componentName.toLowerCase()},
    styles[\`\${request.componentName.toLowerCase()}--\${section}\`],
    ${request.features.includes('variant') ? "styles[`${request.componentName.toLowerCase()}--${variant}`]," : ''}
    ${request.features.includes('size') ? "styles[`${request.componentName.toLowerCase()}--${size}`]," : ''}
    ${request.features.includes('disabled') ? `disabled && styles[\`\${request.componentName.toLowerCase()}--disabled\`],` : ''}
    ${request.features.includes('loading') ? `loading && styles[\`\${request.componentName.toLowerCase()}--loading\`],` : ''}
    className
  ].filter(Boolean).join(' ')

  ${request.animation ? `const animationProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
    whileHover: disabled || loading ? {} : { y: -2 },
    whileTap: disabled || loading ? {} : { scale: 0.98 }
  }` : ''}

  return (
    ${request.animation ? '<ClientMotionDiv' : '<div'}
      className={componentClasses}
      ${request.animation ? '{...animationProps}' : ''}
      ${request.accessibility ? `aria-label="${request.componentName} component"` : ''}
      ${request.features.includes('disabled') ? "aria-disabled={disabled}" : ''}
      {...props}
    >
      {children}
    ${request.animation ? '</ClientMotionDiv>' : '</div>'}
  )
}

export default ${request.componentName}
`;
  }

  private generateStylesContent(
    request: ComponentGenerationRequest,
    pattern: ComponentPattern,
    brandTokens: string[]
  ): string {
    return `/* ${request.componentName} Component Styles */
.${request.componentName.toLowerCase()} {
  /* Base styles using brand tokens */
  font-family: var(--font-family-primary);
  font-size: var(--body-size);
  line-height: var(--body-line-height);
  
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Spacing */
  padding: var(--spacing-md);
  margin: 0;
  
  /* Transitions for smooth interactions */
  transition: all 0.3s ease;
  
  /* Performance optimizations */
  will-change: transform, opacity;
  backface-visibility: hidden;
}

/* Section-specific styling */
.${request.componentName.toLowerCase()}--hero {
  background-color: var(--hero-bg);
  color: var(--text-on-dark);
}

.${request.componentName.toLowerCase()}--about {
  background-color: var(--about-bg);
  color: var(--text-on-dark);
}

.${request.componentName.toLowerCase()}--results {
  background-color: var(--results-bg);
  color: var(--text-on-dark);
}

.${request.componentName.toLowerCase()}--case-studies {
  background-color: var(--case-studies-bg);
  color: var(--text-on-dark);
}

.${request.componentName.toLowerCase()}--how-i-work {
  background-color: var(--how-i-work-bg);
  color: var(--text-on-light);
}

.${request.componentName.toLowerCase()}--technical-expertise {
  background-color: var(--hero-bg);
  color: var(--text-on-dark);
}

.${request.componentName.toLowerCase()}--contact {
  background-color: var(--contact-bg);
  color: var(--text-on-light);
}

${request.features.includes('variant') ? `
/* Variant styles */
.${request.componentName.toLowerCase()}--primary {
  background: linear-gradient(135deg, var(--accent-green) 0%, var(--interactive-blue) 100%);
  color: var(--text-on-dark);
}

.${request.componentName.toLowerCase()}--secondary {
  background-color: transparent;
  border: 2px solid var(--accent-green);
  color: var(--accent-green);
}

.${request.componentName.toLowerCase()}--outline {
  background-color: transparent;
  border: 1px solid currentColor;
  color: inherit;
}
` : ''}

${request.features.includes('size') ? `
/* Size variants */
.${request.componentName.toLowerCase()}--sm {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--small-size);
}

.${request.componentName.toLowerCase()}--md {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--body-size);
}

.${request.componentName.toLowerCase()}--lg {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--h3-size);
}
` : ''}

${request.features.includes('disabled') ? `
/* Disabled state */
.${request.componentName.toLowerCase()}--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}
` : ''}

${request.features.includes('loading') ? `
/* Loading state */
.${request.componentName.toLowerCase()}--loading {
  opacity: 0.8;
  cursor: wait;
}
` : ''}

${request.responsive ? `
/* Mobile responsiveness */
@media (max-width: 767px) {
  .${request.componentName.toLowerCase()} {
    padding: var(--spacing-sm);
    font-size: clamp(0.875rem, 2vw, 1rem);
  }
}

@media (max-width: 480px) {
  .${request.componentName.toLowerCase()} {
    padding: var(--spacing-xs);
  }
}
` : ''}

${request.accessibility ? `
/* Accessibility and Performance */
@media (prefers-reduced-motion: reduce) {
  .${request.componentName.toLowerCase()} {
    transition: none;
  }
}

/* Focus styles for keyboard navigation */
.${request.componentName.toLowerCase()}:focus-visible {
  outline: 2px solid var(--interactive-blue);
  outline-offset: 2px;
}
` : ''}

/* GPU acceleration for smooth animations */
.${request.componentName.toLowerCase()} {
  transform: translateZ(0);
}
`;
  }

  private generateIndexContent(componentName: string): string {
    return `export { ${componentName}, type ${componentName}Props } from './${componentName}';
export { default } from './${componentName}';
`;
  }

  private generateTestsContent(request: ComponentGenerationRequest, componentContent: string): string {
    return `import React from 'react';
import { render, screen } from '@testing-library/react';
import { ${request.componentName} } from './${request.componentName}';

describe('${request.componentName}', () => {
  it('renders without crashing', () => {
    render(<${request.componentName}>Test content</${request.componentName}>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <${request.componentName} className="custom-class">
        Content
      </${request.componentName}>
    );
    const component = screen.getByText('Content').parentElement;
    expect(component).toHaveClass('custom-class');
  });

  ${request.features.includes('variant') ? `
  it('applies variant styles', () => {
    render(
      <${request.componentName} variant="secondary">
        Content
      </${request.componentName}>
    );
    const component = screen.getByText('Content').parentElement;
    expect(component).toHaveClass('${request.componentName.toLowerCase()}--secondary');
  });
  ` : ''}

  ${request.features.includes('disabled') ? `
  it('handles disabled state', () => {
    render(
      <${request.componentName} disabled>
        Content
      </${request.componentName}>
    );
    const component = screen.getByText('Content').parentElement;
    expect(component).toHaveClass('${request.componentName.toLowerCase()}--disabled');
    expect(component).toHaveAttribute('aria-disabled', 'true');
  });
  ` : ''}

  ${request.accessibility ? `
  it('has proper accessibility attributes', () => {
    render(
      <${request.componentName}>
        Content
      </${request.componentName}>
    );
    const component = screen.getByText('Content').parentElement;
    expect(component).toHaveAttribute('aria-label');
  });
  ` : ''}
});
`;
  }

  private generateUsageExample(request: ComponentGenerationRequest, componentContent: string): string {
    return `// Basic usage
import { ${request.componentName} } from '@/app/2/components/${request.componentType}/${request.componentName}';

function MyPage() {
  return (
    <${request.componentName}>
      Your content here
    </${request.componentName}>
  );
}

${request.features.includes('variant') ? `
// With variant
<${request.componentName} variant="primary">
  Primary content
</${request.componentName}>
` : ''}

${request.section ? `
// Section-specific styling
<${request.componentName} section="${request.section}">
  Section content
</${request.componentName}>
` : ''}

${request.features.includes('disabled') || request.features.includes('loading') ? `
// With state
<${request.componentName} 
  ${request.features.includes('disabled') ? 'disabled' : ''}
  ${request.features.includes('loading') ? 'loading' : ''}
>
  State content
</${request.componentName}>
` : ''}
`;
  }

  private generateImplementationSteps(request: ComponentGenerationRequest, componentPath: string): string[] {
    return [
      `1. Create component directory: mkdir -p ${componentPath}`,
      `2. Add component files: ${request.componentName}.tsx, ${request.componentName}.module.css`,
      `3. Add index.ts for clean exports`,
      `4. Add test file: ${request.componentName}.test.tsx`,
      `5. Import and use in your pages or components`,
      `6. Test component with npm run test:e2e:component`,
      `7. Validate brand token compliance`,
      `8. Ensure accessibility compliance with screen readers`,
      `9. Test responsive behavior across devices`,
      `10. Add component to component library documentation`
    ];
  }

  private async calculateAccessibilityScore(): Promise<number> {
    const patterns = await this.analyzeComponentPatterns();
    const totalAccessibilityFeatures = patterns.reduce((sum, pattern) => 
      sum + pattern.accessibility.length, 0);
    const averageFeatures = totalAccessibilityFeatures / patterns.length;
    
    // Score based on average accessibility features per component
    return Math.min(100, averageFeatures * 25);
  }

  private async getPerformanceOptimizations(): Promise<string[]> {
    return [
      'Add will-change properties for animated components',
      'Use transform3d for GPU acceleration',
      'Implement lazy loading for below-fold components',
      'Optimize bundle size with dynamic imports',
      'Add prefers-reduced-motion support',
      'Use CSS containment for isolated components',
      'Implement virtualization for long lists',
      'Optimize image loading with next/image'
    ];
  }
}