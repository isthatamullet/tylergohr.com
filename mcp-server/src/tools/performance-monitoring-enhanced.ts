import { ProjectContext } from '../types/project.js';
import {
  PerformanceMonitoringIntelligence,
  PerformanceMonitoringRequest,
  PerformanceAnalysis
} from './performance-monitoring-intelligence.js';

/**
 * Enhanced MCP tools for Performance Monitoring Intelligence
 * Provides real-time Core Web Vitals analysis, bundle monitoring, and performance optimization
 */

/**
 * Monitor real-time performance metrics with enterprise standards
 */
export async function monitorPerformanceMCP(
  args: {
    context?: 'main' | '2' | 'mixed';
    includeBundle?: boolean;
    includeLighthouse?: boolean;
    includeRegression?: boolean;
    includeOptimizations?: boolean;
    realTime?: boolean;
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
      context = 'main',
      includeBundle = true,
      includeLighthouse = true,
      includeRegression = true,
      includeOptimizations = true,
      realTime = false
    } = args;

    const intelligence = new PerformanceMonitoringIntelligence(projectContext);
    
    const request: PerformanceMonitoringRequest = {
      context,
      includeBundle,
      includeLighthouse,
      includeRegression,
      includeOptimizations,
      realTime
    };

    const analysis = await intelligence.monitorPerformance(request);

    let response = `# Performance Monitoring Report\n\n`;

    // Overall Performance Score
    const scoreIcon = analysis.overall.grade === 'excellent' ? '🟢' : 
                     analysis.overall.grade === 'good' ? '🟡' : 
                     analysis.overall.grade === 'needs-improvement' ? '🟠' : '🔴';
    
    response += `## Overall Performance Score\n\n`;
    response += `${scoreIcon} **${analysis.overall.score}/100** - ${analysis.overall.grade.toUpperCase()}\n`;
    response += `📋 **Compliance**: ${analysis.overall.compliance.replace('-', ' ').toUpperCase()}\n`;
    response += `🎯 **Context**: ${context === '2' ? 'Enterprise Solutions Architect (/2 redesign)' : 'Main Portfolio'}\n\n`;

    // Core Web Vitals Analysis
    response += `## Core Web Vitals\n\n`;
    
    const cwv = analysis.coreWebVitals;
    const lcpIcon = cwv.lcp.status === 'excellent' ? '🟢' : cwv.lcp.status === 'good' ? '🟡' : '🔴';
    const fidIcon = cwv.fid.status === 'excellent' ? '🟢' : cwv.fid.status === 'good' ? '🟡' : '🔴';
    const clsIcon = cwv.cls.status === 'excellent' ? '🟢' : cwv.cls.status === 'good' ? '🟡' : '🔴';
    
    response += `${lcpIcon} **LCP (Largest Contentful Paint)**: ${cwv.lcp.value}s - ${cwv.lcp.status.toUpperCase()}\n`;
    if (cwv.lcp.recommendation && cwv.lcp.status !== 'excellent') {
      response += `   💡 ${cwv.lcp.recommendation}\n`;
    }
    response += `\n`;
    
    response += `${fidIcon} **FID (First Input Delay)**: ${cwv.fid.value}s - ${cwv.fid.status.toUpperCase()}\n`;
    if (cwv.fid.recommendation && cwv.fid.status !== 'excellent') {
      response += `   💡 ${cwv.fid.recommendation}\n`;
    }
    response += `\n`;
    
    response += `${clsIcon} **CLS (Cumulative Layout Shift)**: ${cwv.cls.value} - ${cwv.cls.status.toUpperCase()}\n`;
    if (cwv.cls.recommendation && cwv.cls.status !== 'excellent') {
      response += `   💡 ${cwv.cls.recommendation}\n`;
    }
    response += `\n`;

    // Lighthouse Scores
    if (includeLighthouse) {
      response += `## Lighthouse Audit Scores\n\n`;
      const lh = analysis.lighthouse;
      
      const perfIcon = lh.performance.status === 'excellent' ? '🟢' : lh.performance.status === 'good' ? '🟡' : '🔴';
      const a11yIcon = lh.accessibility.status === 'excellent' ? '🟢' : lh.accessibility.status === 'good' ? '🟡' : '🔴';
      const bpIcon = lh.bestPractices.status === 'excellent' ? '🟢' : lh.bestPractices.status === 'good' ? '🟡' : '🔴';
      const seoIcon = lh.seo.status === 'excellent' ? '🟢' : lh.seo.status === 'good' ? '🟡' : '🔴';
      
      response += `${perfIcon} **Performance**: ${lh.performance.score}/100\n`;
      response += `${a11yIcon} **Accessibility**: ${lh.accessibility.score}/100\n`;
      response += `${bpIcon} **Best Practices**: ${lh.bestPractices.score}/100\n`;
      response += `${seoIcon} **SEO**: ${lh.seo.score}/100\n\n`;
      
      // Lighthouse recommendations
      const allRecommendations = [
        ...lh.performance.recommendations,
        ...lh.accessibility.recommendations,
        ...lh.bestPractices.recommendations,
        ...lh.seo.recommendations
      ];
      
      if (allRecommendations.length > 0) {
        response += `**Lighthouse Recommendations**:\n`;
        for (const rec of allRecommendations.slice(0, 5)) {
          response += `- ${rec}\n`;
        }
        response += `\n`;
      }
    }

    // Bundle Size Analysis
    if (includeBundle) {
      response += `## Bundle Size Analysis\n\n`;
      const bundle = analysis.bundleSize;
      
      const jsIcon = bundle.javascript.status === 'good' ? '🟢' : bundle.javascript.status === 'warning' ? '🟡' : '🔴';
      const cssIcon = bundle.css.status === 'good' ? '🟢' : bundle.css.status === 'warning' ? '🟡' : '🔴';
      const totalIcon = bundle.total.status === 'good' ? '🟢' : bundle.total.status === 'warning' ? '🟡' : '🔴';
      
      response += `${jsIcon} **JavaScript**: ${bundle.javascript.size}KB - ${bundle.javascript.status.toUpperCase()}\n`;
      response += `${cssIcon} **CSS**: ${bundle.css.size}KB - ${bundle.css.status.toUpperCase()}\n`;
      response += `${totalIcon} **Total Bundle**: ${bundle.total.size}KB - ${bundle.total.status.toUpperCase()}\n\n`;
      
      // Bundle optimizations
      const bundleOptimizations = [
        ...bundle.javascript.optimizations,
        ...bundle.css.optimizations,
        ...bundle.total.recommendations
      ];
      
      if (bundleOptimizations.length > 0) {
        response += `**Bundle Optimizations**:\n`;
        for (const opt of bundleOptimizations.slice(0, 5)) {
          response += `- ${opt}\n`;
        }
        response += `\n`;
      }
    }

    // Performance Regressions
    if (includeRegression && analysis.regressions.detected) {
      response += `## ⚠️ Performance Regressions Detected\n\n`;
      for (const issue of analysis.regressions.issues) {
        const severityIcon = issue.severity === 'high' ? '🔴' : issue.severity === 'medium' ? '🟡' : '🟠';
        response += `${severityIcon} **${issue.metric}**: ${issue.previousValue} → ${issue.currentValue} (+${issue.increase})\n`;
      }
      response += `\n`;
    }

    // Performance Optimizations
    if (includeOptimizations && analysis.optimizations) {
      response += `## Performance Optimization Recommendations\n\n`;
      
      if (analysis.optimizations.immediate.length > 0) {
        response += `### ⚡ Immediate Actions (High Impact, Low Effort)\n`;
        for (const opt of analysis.optimizations.immediate) {
          response += `- ${opt}\n`;
        }
        response += `\n`;
      }
      
      if (analysis.optimizations.shortTerm.length > 0) {
        response += `### 📅 Short-term Improvements\n`;
        for (const opt of analysis.optimizations.shortTerm) {
          response += `- ${opt}\n`;
        }
        response += `\n`;
      }
      
      if (analysis.optimizations.longTerm.length > 0) {
        response += `### 🎯 Long-term Optimizations\n`;
        for (const opt of analysis.optimizations.longTerm) {
          response += `- ${opt}\n`;
        }
        response += `\n`;
      }
    }

    // Enterprise Standards Context
    if (context === '2') {
      response += `## 🏢 Enterprise Solutions Architect Standards\n\n`;
      response += `- **LCP Target**: ≤2.5s (Enterprise credibility)\n`;
      response += `- **FID Target**: ≤0.1s (Professional responsiveness)\n`;
      response += `- **CLS Target**: ≤0.1 (Stable business presentation)\n`;
      response += `- **Lighthouse Minimum**: 90+ (Enterprise excellence)\n`;
      response += `- **Animation**: 60fps smooth (Professional polish)\n\n`;
    }

    // Quick Action Summary
    response += `## 🚀 Quick Actions\n\n`;
    const quickActions = [
      analysis.overall.grade !== 'excellent' ? 'Focus on Core Web Vitals optimization' : null,
      analysis.bundleSize?.total.status !== 'good' ? 'Optimize bundle size with code splitting' : null,
      analysis.lighthouse?.accessibility.score < 95 ? 'Improve accessibility for enterprise compliance' : null
    ].filter(Boolean);
    
    if (quickActions.length > 0) {
      for (const action of quickActions) {
        response += `1. ${action}\n`;
      }
    } else {
      response += `✨ Excellent performance! All metrics meet enterprise standards.\n`;
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
          text: `❌ **Performance Monitoring Error**\n\nFailed to monitor performance: ${errorMessage}\n\n**Troubleshooting Steps:**\n1. Ensure performance-thresholds.json exists in scripts/hooks/config/\n2. Verify development server is running for real-time monitoring\n3. Check build output exists for bundle analysis (.next directory)\n4. Ensure project context is properly initialized`
        }
      ],
      isError: true
    };
  }
}

/**
 * Analyze specific performance aspects with detailed insights
 */
export async function analyzePerformanceAspectMCP(
  args: {
    type: 'core-web-vitals' | 'lighthouse' | 'bundle-size' | 'animation' | 'css-performance';
    context?: 'main' | '2' | 'mixed';
    includeRecommendations?: boolean;
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
      type,
      context = 'main',
      includeRecommendations = true,
      includeOptimizations = true
    } = args;

    const intelligence = new PerformanceMonitoringIntelligence(projectContext);
    
    const result = await intelligence.analyzePerformanceAspect({
      type,
      context,
      includeRecommendations,
      includeOptimizations
    });

    let response = `# ${type.replace('-', ' ').toUpperCase()} Analysis\n\n`;

    // Context
    response += `## Analysis Context\n`;
    response += `- **Focus**: ${type.replace('-', ' ')}\n`;
    response += `- **Context**: ${context === '2' ? 'Enterprise Solutions Architect (/2 redesign)' : 'Main Portfolio'}\n`;
    response += `- **Compliance**: ${result.compliance.replace('-', ' ').toUpperCase()}\n\n`;

    // Analysis Results
    response += `## Analysis Results\n\n`;
    
    if (type === 'core-web-vitals') {
      const cwv = result.analysis;
      response += `**LCP**: ${cwv.lcp.value}s (${cwv.lcp.status})\n`;
      response += `**FID**: ${cwv.fid.value}s (${cwv.fid.status})\n`;
      response += `**CLS**: ${cwv.cls.value} (${cwv.cls.status})\n\n`;
    } else if (type === 'lighthouse') {
      const lh = result.analysis;
      response += `**Performance**: ${lh.performance.score}/100 (${lh.performance.status})\n`;
      response += `**Accessibility**: ${lh.accessibility.score}/100 (${lh.accessibility.status})\n`;
      response += `**Best Practices**: ${lh.bestPractices.score}/100 (${lh.bestPractices.status})\n`;
      response += `**SEO**: ${lh.seo.score}/100 (${lh.seo.status})\n\n`;
    } else if (type === 'bundle-size') {
      const bundle = result.analysis;
      response += `**JavaScript**: ${bundle.javascript.size}KB (${bundle.javascript.status})\n`;
      response += `**CSS**: ${bundle.css.size}KB (${bundle.css.status})\n`;
      response += `**Total**: ${bundle.total.size}KB (${bundle.total.status})\n\n`;
    } else if (type === 'animation') {
      const anim = result.analysis;
      response += `**Target FPS**: ${anim.targetFPS}\n`;
      response += `**Minimum FPS**: ${anim.minimumFPS}\n`;
      response += `**Frame Budget**: ${anim.frameBudget}ms\n`;
      response += `**Status**: ${anim.status.toUpperCase()}\n\n`;
    } else if (type === 'css-performance') {
      response += `**Heavy Properties Analysis**: Available\n`;
      response += `**Animation Properties Analysis**: Available\n`;
      response += `**Compliance**: ${result.analysis.compliance.toUpperCase()}\n\n`;
    }

    // Recommendations
    if (includeRecommendations && result.recommendations.length > 0) {
      response += `## Recommendations\n\n`;
      for (const rec of result.recommendations) {
        response += `💡 ${rec}\n`;
      }
      response += `\n`;
    }

    // Optimizations
    if (includeOptimizations && result.optimizations.length > 0) {
      response += `## Optimization Strategies\n\n`;
      for (const opt of result.optimizations) {
        response += `⚡ ${opt}\n`;
      }
      response += `\n`;
    }

    // Type-specific insights
    if (type === 'core-web-vitals') {
      response += `## Core Web Vitals Insights\n\n`;
      response += `- **LCP** measures loading performance - should occur within 2.5s\n`;
      response += `- **FID** measures interactivity - should be less than 100ms\n`;
      response += `- **CLS** measures visual stability - should be less than 0.1\n\n`;
      
      if (context === '2') {
        response += `### Enterprise Standards for /2 Redesign\n`;
        response += `- LCP: ≤2.5s for enterprise credibility\n`;
        response += `- FID: ≤0.1s for professional responsiveness\n`;
        response += `- CLS: ≤0.1 for stable business presentation\n\n`;
      }
    }

    if (type === 'bundle-size') {
      response += `## Bundle Size Guidelines\n\n`;
      response += `- **JavaScript**: <500KB good, <1MB acceptable\n`;
      response += `- **CSS**: <100KB good, <200KB acceptable\n`;
      response += `- **Total**: Aim for <600KB for optimal performance\n\n`;
    }

    if (type === 'animation') {
      response += `## Animation Performance Standards\n\n`;
      response += `- **Target**: 60fps for smooth Enterprise presentation\n`;
      response += `- **GPU Acceleration**: Use transform and opacity\n`;
      response += `- **Avoid**: Animating width, height, left, top properties\n`;
      response += `- **Best Practice**: Use will-change sparingly\n\n`;
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
          text: `❌ **Performance Aspect Analysis Error**\n\nFailed to analyze ${args.type}: ${errorMessage}\n\n**Valid Analysis Types:**\n- core-web-vitals\n- lighthouse\n- bundle-size\n- animation\n- css-performance\n\n**Valid Contexts:**\n- main (main portfolio)\n- 2 (Enterprise Solutions Architect redesign)\n- mixed (both contexts)`
        }
      ],
      isError: true
    };
  }
}

/**
 * Get performance optimization recommendations with prioritization
 */
export async function getPerformanceOptimizationsMCP(
  args: {
    context?: 'main' | '2' | 'mixed';
    priority?: 'immediate' | 'short-term' | 'long-term' | 'all';
    category?: 'core-web-vitals' | 'bundle' | 'animation' | 'css' | 'all';
    includeDetails?: boolean;
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
      context = 'main',
      priority = 'all',
      category = 'all',
      includeDetails = true
    } = args;

    const intelligence = new PerformanceMonitoringIntelligence(projectContext);
    
    const optimizations = await intelligence.getPerformanceOptimizations({
      context,
      priority,
      category
    });

    let response = `# Performance Optimization Recommendations\n\n`;

    // Context and filters
    response += `## Optimization Scope\n`;
    response += `- **Context**: ${context === '2' ? 'Enterprise Solutions Architect (/2 redesign)' : 'Main Portfolio'}\n`;
    response += `- **Priority**: ${priority.replace('-', ' ').toUpperCase()}\n`;
    response += `- **Category**: ${category.replace('-', ' ').toUpperCase()}\n\n`;

    // Immediate optimizations
    if ((priority === 'all' || priority === 'immediate') && optimizations.immediate.length > 0) {
      response += `## ⚡ Immediate Actions (High Impact, Low Effort)\n\n`;
      for (const [index, opt] of optimizations.immediate.entries()) {
        const impactIcon = opt.impact === 'high' ? '🔴' : opt.impact === 'medium' ? '🟡' : '🟢';
        const effortIcon = opt.effort === 'low' ? '🟢' : opt.effort === 'medium' ? '🟡' : '🔴';
        
        response += `### ${index + 1}. ${opt.optimization}\n`;
        response += `${impactIcon} **Impact**: ${opt.impact.toUpperCase()} | ${effortIcon} **Effort**: ${opt.effort.toUpperCase()}\n`;
        response += `📂 **Category**: ${opt.category.replace('-', ' ')}\n`;
        
        if (includeDetails) {
          response += `📖 **Description**: ${opt.description}\n`;
        }
        response += `\n`;
      }
    }

    // Short-term optimizations
    if ((priority === 'all' || priority === 'short-term') && optimizations.shortTerm.length > 0) {
      response += `## 📅 Short-term Improvements (1-2 weeks)\n\n`;
      for (const [index, opt] of optimizations.shortTerm.entries()) {
        const impactIcon = opt.impact === 'high' ? '🔴' : opt.impact === 'medium' ? '🟡' : '🟢';
        const effortIcon = opt.effort === 'low' ? '🟢' : opt.effort === 'medium' ? '🟡' : '🔴';
        
        response += `### ${index + 1}. ${opt.optimization}\n`;
        response += `${impactIcon} **Impact**: ${opt.impact.toUpperCase()} | ${effortIcon} **Effort**: ${opt.effort.toUpperCase()}\n`;
        response += `📂 **Category**: ${opt.category.replace('-', ' ')}\n`;
        
        if (includeDetails) {
          response += `📖 **Description**: ${opt.description}\n`;
        }
        response += `\n`;
      }
    }

    // Long-term optimizations
    if ((priority === 'all' || priority === 'long-term') && optimizations.longTerm.length > 0) {
      response += `## 🎯 Long-term Strategic Improvements (1+ months)\n\n`;
      for (const [index, opt] of optimizations.longTerm.entries()) {
        const impactIcon = opt.impact === 'high' ? '🔴' : opt.impact === 'medium' ? '🟡' : '🟢';
        const effortIcon = opt.effort === 'low' ? '🟢' : opt.effort === 'medium' ? '🟡' : '🔴';
        
        response += `### ${index + 1}. ${opt.optimization}\n`;
        response += `${impactIcon} **Impact**: ${opt.impact.toUpperCase()} | ${effortIcon} **Effort**: ${opt.effort.toUpperCase()}\n`;
        response += `📂 **Category**: ${opt.category.replace('-', ' ')}\n`;
        
        if (includeDetails) {
          response += `📖 **Description**: ${opt.description}\n`;
        }
        response += `\n`;
      }
    }

    // Implementation priorities
    response += `## 🚀 Implementation Strategy\n\n`;
    response += `1. **Start with immediate actions** - Quick wins with high impact\n`;
    response += `2. **Plan short-term improvements** - Schedule during development cycles\n`;
    response += `3. **Roadmap long-term optimizations** - Include in quarterly planning\n`;
    response += `4. **Monitor impact** - Measure performance gains after each optimization\n\n`;

    // Category-specific guidance
    if (category === 'core-web-vitals' || category === 'all') {
      response += `## 📊 Core Web Vitals Focus\n`;
      response += `- **LCP Optimization**: Image preloading, server response optimization\n`;
      response += `- **FID Improvement**: JavaScript splitting, event handler optimization\n`;
      response += `- **CLS Prevention**: Image dimensions, layout shift avoidance\n\n`;
    }

    if (category === 'bundle' || category === 'all') {
      response += `## 📦 Bundle Size Optimization\n`;
      response += `- **Code Splitting**: Dynamic imports for route-based splitting\n`;
      response += `- **Tree Shaking**: Remove unused code and dependencies\n`;
      response += `- **Compression**: Gzip/Brotli compression for assets\n\n`;
    }

    if (context === '2') {
      response += `## 🏢 Enterprise /2 Redesign Considerations\n`;
      response += `- **Brand Consistency**: Maintain professional presentation during optimization\n`;
      response += `- **Animation Performance**: Ensure 60fps for enterprise credibility\n`;
      response += `- **Accessibility**: Maintain WCAG 2.1 AA compliance during changes\n`;
      response += `- **Core Web Vitals**: Target enterprise-grade thresholds (LCP ≤2.5s)\n\n`;
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
          text: `❌ **Performance Optimization Error**\n\nFailed to generate optimization recommendations: ${errorMessage}\n\n**Valid Priorities:**\n- immediate (quick wins)\n- short-term (1-2 weeks)\n- long-term (1+ months)\n- all (comprehensive)\n\n**Valid Categories:**\n- core-web-vitals (LCP, FID, CLS)\n- bundle (JavaScript, CSS size)\n- animation (60fps performance)\n- css (CSS property optimization)\n- all (comprehensive)`
        }
      ],
      isError: true
    };
  }
}