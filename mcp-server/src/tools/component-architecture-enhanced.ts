import { ProjectContext } from '../types/project.js';
import {
  ComponentArchitectureIntelligence,
  ComponentGenerationRequest,
  ComponentAnalysis,
  GeneratedComponent
} from './component-architecture-intelligence.js';

/**
 * Enhanced MCP tools for Component Architecture Intelligence
 * Provides intelligent component generation, analysis, and compliance validation
 */

/**
 * Analyze component architecture and patterns
 */
export async function analyzeComponentArchitectureMCP(
  args: {
    includePatterns?: boolean;
    includeBrandTokens?: boolean;
    includeInsights?: boolean;
    componentType?: 'ui' | 'section' | 'layout' | 'interactive';
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
    const intelligence = new ComponentArchitectureIntelligence(projectContext);
    const analysis = await intelligence.analyzeComponentArchitecture();
    const insights = await intelligence.getArchitectureInsights();

    const {
      includePatterns = true,
      includeBrandTokens = true,
      includeInsights = true,
      componentType
    } = args;

    let response = "# Component Architecture Analysis\n\n";

    // Filter patterns by type if specified
    const patterns = componentType 
      ? analysis.patterns.filter(p => p.type === componentType)
      : analysis.patterns;

    if (includeInsights) {
      response += `## Architecture Overview\n`;
      response += `- **Total Components**: ${insights.componentCount}\n`;
      response += `- **Pattern Distribution**: ${Object.entries(insights.patternDistribution)
        .map(([type, count]) => `${type}: ${count}`).join(', ')}\n`;
      response += `- **Brand Token Coverage**: ${insights.brandTokenCoverage.toFixed(1)}%\n`;
      response += `- **Accessibility Score**: ${insights.accessibilityScore.toFixed(1)}%\n\n`;
    }

    if (includePatterns && patterns.length > 0) {
      response += `## Component Patterns (${patterns.length} found)\n\n`;
      
      for (const pattern of patterns.slice(0, 10)) { // Limit to first 10 for readability
        response += `### ${pattern.name} (${pattern.type})\n`;
        
        if (pattern.patterns.structure.length > 0) {
          response += `**Structure**: ${pattern.patterns.structure.slice(0, 3).join(', ')}\n`;
        }
        
        if (pattern.patterns.styling.length > 0) {
          response += `**Styling**: ${pattern.patterns.styling.slice(0, 3).join(', ')}\n`;
        }
        
        if (pattern.brandTokens.length > 0) {
          response += `**Brand Tokens**: ${pattern.brandTokens.slice(0, 3).join(', ')}\n`;
        }
        
        if (pattern.accessibility.length > 0) {
          response += `**Accessibility**: ${pattern.accessibility.slice(0, 3).join(', ')}\n`;
        }
        
        response += '\n';
      }
    }

    if (includeBrandTokens && analysis.brandTokenUsage.length > 0) {
      response += `## Brand Token Usage\n\n`;
      
      const sortedTokens = analysis.brandTokenUsage
        .sort((a, b) => b.compliance - a.compliance)
        .slice(0, 15); // Top 15 tokens
      
      for (const token of sortedTokens) {
        const complianceIcon = token.compliance >= 80 ? '✅' : token.compliance >= 60 ? '⚠️' : '❌';
        response += `${complianceIcon} **${token.token}**: ${token.compliance}% compliance`;
        if (token.usage.length > 0) {
          response += ` (used in: ${token.usage.slice(0, 3).join(', ')})`;
        }
        response += '\n';
      }
      response += '\n';
    }

    if (includeInsights && insights.architectureRecommendations.length > 0) {
      response += `## Architecture Recommendations\n\n`;
      for (const rec of insights.architectureRecommendations) {
        response += `- ${rec}\n`;
      }
      response += '\n';
    }

    if (includeInsights && insights.performanceOptimizations.length > 0) {
      response += `## Performance Optimizations\n\n`;
      for (const opt of insights.performanceOptimizations.slice(0, 8)) {
        response += `- ${opt}\n`;
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
          text: `❌ **Component Architecture Analysis Error**\n\nFailed to analyze component architecture: ${errorMessage}\n\n**Troubleshooting Steps:**\n1. Ensure /src/app/2/components directory exists\n2. Verify component files are readable\n3. Check brand-tokens.css accessibility\n4. Review component structure for TypeScript compliance`
        }
      ],
      isError: true
    };
  }
}

/**
 * Generate a new component with brand token compliance
 */
export async function generateComponentMCP(
  args: {
    componentName: string;
    componentType: 'ui' | 'section' | 'layout' | 'interactive';
    section?: 'hero' | 'about' | 'results' | 'case-studies' | 'how-i-work' | 'technical-expertise' | 'contact';
    features?: string[];
    styling?: 'css-modules' | 'styled-components' | 'emotion';
    animation?: boolean;
    responsive?: boolean;
    accessibility?: boolean;
    generateFiles?: boolean;
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
      componentName,
      componentType,
      section = 'hero',
      features = ['variant', 'size'],
      styling = 'css-modules',
      animation = true,
      responsive = true,
      accessibility = true,
      generateFiles = false
    } = args;

    // Validate component name
    if (!componentName || !/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
      throw new Error('Component name must be PascalCase (e.g., MyComponent, ButtonGroup)');
    }

    const intelligence = new ComponentArchitectureIntelligence(projectContext);
    
    const generationRequest: ComponentGenerationRequest = {
      componentName,
      componentType,
      section,
      features,
      styling,
      animation,
      responsive,
      accessibility
    };

    const generated = await intelligence.generateComponent(generationRequest);

    let response = `# Generated Component: ${componentName}\n\n`;
    
    response += `## Component Overview\n`;
    response += `- **Type**: ${componentType}\n`;
    response += `- **Section**: ${section}\n`;
    response += `- **Features**: ${features.join(', ')}\n`;
    response += `- **Animation**: ${animation ? 'Enabled' : 'Disabled'}\n`;
    response += `- **Responsive**: ${responsive ? 'Yes' : 'No'}\n`;
    response += `- **Accessibility**: ${accessibility ? 'WCAG 2.1 AA compliant' : 'Basic'}\n\n`;

    // Component File
    response += `## Component File (${generated.componentFile.path})\n\n`;
    response += '```tsx\n';
    response += generated.componentFile.content;
    response += '\n```\n\n';

    // Styles File
    response += `## Styles File (${generated.stylesFile.path})\n\n`;
    response += '```css\n';
    response += generated.stylesFile.content;
    response += '\n```\n\n';

    // Index File
    if (generated.indexFile) {
      response += `## Index File (${generated.indexFile.path})\n\n`;
      response += '```typescript\n';
      response += generated.indexFile.content;
      response += '\n```\n\n';
    }

    // Tests File
    if (generated.tests) {
      response += `## Test File (${generated.tests.path})\n\n`;
      response += '```tsx\n';
      response += generated.tests.content;
      response += '\n```\n\n';
    }

    // Usage Example
    response += `## Usage Example\n\n`;
    response += '```tsx\n';
    response += generated.usage;
    response += '\n```\n\n';

    // Implementation Steps
    response += `## Implementation Steps\n\n`;
    for (const step of generated.implementation) {
      response += `${step}\n`;
    }

    if (generateFiles) {
      response += `\n\n⚠️ **Note**: File generation is disabled for safety. Use the generated code above to manually create your component files.\n`;
      response += `\n**Next Steps:**\n`;
      response += `1. Create the component directory structure\n`;
      response += `2. Copy the generated code into the respective files\n`;
      response += `3. Import and test the component in your application\n`;
      response += `4. Validate brand token compliance and accessibility\n`;
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
          text: `❌ **Component Generation Error**\n\nFailed to generate component: ${errorMessage}\n\n**Common Issues:**\n1. Component name must be PascalCase (e.g., MyComponent)\n2. Component type must be: ui, section, layout, or interactive\n3. Features must be valid: variant, size, disabled, loading\n4. Section must be valid: hero, about, results, case-studies, how-i-work, technical-expertise, contact`
        }
      ],
      isError: true
    };
  }
}

/**
 * Validate component compliance with brand tokens and architecture standards
 */
export async function validateComponentComplianceMCP(
  args: {
    componentPath: string;
    checkBrandTokens?: boolean;
    checkAccessibility?: boolean;
    checkPerformance?: boolean;
    checkResponsive?: boolean;
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
      componentPath,
      checkBrandTokens = true,
      checkAccessibility = true,
      checkPerformance = true,
      checkResponsive = true
    } = args;

    const intelligence = new ComponentArchitectureIntelligence(projectContext);
    const fullPath = componentPath.startsWith('/') 
      ? componentPath 
      : `${projectContext.projectRoot}/${componentPath}`;

    const validation = await intelligence.validateComponentCompliance(fullPath);

    let response = `# Component Compliance Validation\n\n`;
    
    response += `## Overall Compliance Score: ${validation.compliance}%\n\n`;
    
    const scoreIcon = validation.compliance >= 90 ? '🟢' : validation.compliance >= 70 ? '🟡' : '🔴';
    response += `${scoreIcon} **Status**: ${
      validation.compliance >= 90 ? 'Excellent' :
      validation.compliance >= 70 ? 'Good' : 'Needs Improvement'
    }\n\n`;

    if (validation.issues.length > 0) {
      response += `## Issues Found (${validation.issues.length})\n\n`;
      for (const issue of validation.issues) {
        response += `❌ ${issue}\n`;
      }
      response += '\n';
    }

    if (validation.recommendations.length > 0) {
      response += `## Recommendations (${validation.recommendations.length})\n\n`;
      for (const rec of validation.recommendations) {
        response += `💡 ${rec}\n`;
      }
      response += '\n';
    }

    // Detailed compliance checks
    if (checkBrandTokens) {
      response += `## Brand Token Compliance\n`;
      const hasBrandTokens = validation.issues.some(issue => 
        !issue.includes('No brand tokens detected'));
      response += hasBrandTokens ? '✅ Brand tokens detected\n' : '❌ No brand tokens found\n';
    }

    if (checkAccessibility) {
      response += `## Accessibility Compliance\n`;
      const hasAccessibility = validation.issues.some(issue => 
        !issue.includes('Missing accessibility attributes'));
      response += hasAccessibility ? '✅ Accessibility attributes found\n' : '❌ Missing accessibility features\n';
    }

    if (checkPerformance) {
      response += `## Performance Compliance\n`;
      const hasPerformance = validation.issues.some(issue => 
        !issue.includes('Animation without reduced motion'));
      response += hasPerformance ? '✅ Performance optimizations detected\n' : '⚠️ Performance could be improved\n';
    }

    if (checkResponsive) {
      response += `## Responsive Design Compliance\n`;
      const hasResponsive = validation.issues.some(issue => 
        !issue.includes('Missing responsive design'));
      response += hasResponsive ? '✅ Responsive design patterns found\n' : '❌ Missing responsive design\n';
    }

    if (validation.compliance >= 90) {
      response += `\n🎉 **Excellent work!** This component meets enterprise architecture standards.\n`;
    } else if (validation.compliance >= 70) {
      response += `\n👍 **Good foundation!** Address the recommendations above to reach excellence.\n`;
    } else {
      response += `\n🔧 **Needs improvement.** Focus on brand tokens, accessibility, and TypeScript compliance.\n`;
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
          text: `❌ **Component Validation Error**\n\nFailed to validate component: ${errorMessage}\n\n**Troubleshooting:**\n1. Verify component file path exists\n2. Ensure file is readable and contains valid TypeScript\n3. Check component follows expected patterns\n4. Verify project structure is correct`
        }
      ],
      isError: true
    };
  }
}

/**
 * Get component architecture insights and optimization recommendations
 */
export async function getComponentArchitectureInsightsMCP(
  args: {
    includePerformance?: boolean;
    includeAccessibility?: boolean;
    includeBrandTokens?: boolean;
    includeRecommendations?: boolean;
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
      includeAccessibility = true,
      includeBrandTokens = true,
      includeRecommendations = true
    } = args;

    const intelligence = new ComponentArchitectureIntelligence(projectContext);
    const insights = await intelligence.getArchitectureInsights();

    let response = `# Component Architecture Insights\n\n`;

    response += `## System Overview\n`;
    response += `- **Total Components**: ${insights.componentCount}\n`;
    response += `- **Component Types**: ${Object.entries(insights.patternDistribution)
      .map(([type, count]) => `${type} (${count})`).join(', ')}\n\n`;

    if (includeBrandTokens) {
      response += `## Brand Token Integration\n`;
      response += `- **Coverage**: ${insights.brandTokenCoverage.toFixed(1)}%\n`;
      const coverageIcon = insights.brandTokenCoverage >= 80 ? '🟢' : insights.brandTokenCoverage >= 60 ? '🟡' : '🔴';
      response += `${coverageIcon} **Status**: ${
        insights.brandTokenCoverage >= 80 ? 'Excellent coverage' :
        insights.brandTokenCoverage >= 60 ? 'Good coverage' : 'Needs improvement'
      }\n\n`;
    }

    if (includeAccessibility) {
      response += `## Accessibility Compliance\n`;
      response += `- **Score**: ${insights.accessibilityScore.toFixed(1)}%\n`;
      const accessibilityIcon = insights.accessibilityScore >= 80 ? '🟢' : insights.accessibilityScore >= 60 ? '🟡' : '🔴';
      response += `${accessibilityIcon} **Status**: ${
        insights.accessibilityScore >= 80 ? 'WCAG 2.1 AA compliant' :
        insights.accessibilityScore >= 60 ? 'Good accessibility' : 'Needs improvement'
      }\n\n`;
    }

    if (includePerformance && insights.performanceOptimizations.length > 0) {
      response += `## Performance Optimization Opportunities\n\n`;
      for (const opt of insights.performanceOptimizations.slice(0, 10)) {
        response += `- ${opt}\n`;
      }
      response += '\n';
    }

    if (includeRecommendations && insights.architectureRecommendations.length > 0) {
      response += `## Architecture Recommendations\n\n`;
      for (const rec of insights.architectureRecommendations) {
        response += `💡 ${rec}\n`;
      }
      response += '\n';
    }

    // Quick action items
    response += `## Quick Wins\n`;
    if (insights.brandTokenCoverage < 80) {
      response += `1. **Improve brand token usage** - Current coverage: ${insights.brandTokenCoverage.toFixed(1)}%\n`;
    }
    if (insights.accessibilityScore < 80) {
      response += `2. **Enhance accessibility** - Add ARIA attributes and keyboard navigation\n`;
    }
    response += `3. **Performance audit** - Review and implement performance optimizations\n`;
    response += `4. **Consistency review** - Ensure all components follow established patterns\n`;

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
          text: `❌ **Architecture Insights Error**\n\nFailed to generate architecture insights: ${errorMessage}\n\n**Possible Issues:**\n1. Component directory structure might be missing\n2. Brand tokens file might not be accessible\n3. Component analysis encountered parsing errors\n4. Project context might be incomplete`
        }
      ],
      isError: true
    };
  }
}