#!/usr/bin/env node

/**
 * Enhanced Documentation Tools - Phase 3 Documentation Intelligence Server
 * 
 * Integrates the DocumentationIntelligence engine with MCP server tools
 * to provide intelligent, contextual guidance that goes beyond basic search.
 */

import { 
  DocumentationQueryRequest, 
  ContextualGuidanceRequest, 
  WorkflowResolutionRequest,
  MCPToolResponse 
} from '../types/schemas.js';
import { ProjectContext } from '../types/project.js';
import { DocumentationIntelligence } from './documentation-intelligence.js';

// Global documentation intelligence instance
let docIntelligence: DocumentationIntelligence | null = null;

/**
 * Initialize documentation intelligence engine
 */
async function initializeDocumentationIntelligence(context: ProjectContext): Promise<DocumentationIntelligence> {
  if (!docIntelligence) {
    docIntelligence = new DocumentationIntelligence(context.projectRoot);
    await docIntelligence.initialize();
  }
  return docIntelligence;
}

/**
 * Enhanced Documentation Query - Main intelligence entry point
 */
export async function queryDocumentationMCP(
  request: DocumentationQueryRequest,
  context: ProjectContext
): Promise<MCPToolResponse> {
  const { query, category, includeExamples, format, intelligence } = request;
  
  try {
    const docEngine = await initializeDocumentationIntelligence(context);
    
    if (intelligence && format === 'guidance') {
      // Use enhanced intelligence for guidance format
      const guidance = await docEngine.getContextualGuidance(query);
      return formatGuidanceResponse(guidance, query);
    } else if (intelligence && format === 'contextual') {
      // Use enhanced intelligence for contextual responses
      const response = await docEngine.queryDocumentation(query, context);
      return formatContextualResponse(response, query);
    } else {
      // Fallback to enhanced search with intelligent formatting
      const response = await docEngine.queryDocumentation(query, context);
      return formatEnhancedResponse(response, query, includeExamples, format);
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      content: [
        {
          type: "text",
          text: `💥 Documentation Intelligence Error: ${errorMessage}\n\n🔍 **Query**: "${query}"\n📂 **Category**: ${category || 'all'}\n\n🛠️ **Troubleshooting**:\n1. Documentation intelligence engine may need initialization\n2. Try simpler query terms\n3. Check if documentation files are available\n4. Use fallback documentation search\n\n💡 **Fallback**: Use basic documentation search with intelligence=false`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Get Contextual Guidance - New Enhanced Capability
 */
export async function getContextualGuidanceMCP(
  request: ContextualGuidanceRequest,
  context: ProjectContext
): Promise<MCPToolResponse> {
  const { currentTask, context: taskContext, urgency, difficulty } = request;
  
  try {
    const docEngine = await initializeDocumentationIntelligence(context);
    
    // Update project context with task-specific information
    const enhancedContext = {
      ...context,
      currentContext: taskContext,
      urgency: urgency as any
    };
    
    const guidance = await docEngine.getContextualGuidance(currentTask);
    
    return {
      content: [
        {
          type: "text",
          text: formatContextualGuidanceText(guidance, currentTask, taskContext, urgency)
        }
      ]
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      content: [
        {
          type: "text",
          text: `💥 Contextual Guidance Error: ${errorMessage}\n\n🎯 **Task**: "${currentTask}"\n📍 **Context**: ${taskContext}\n\n🛠️ **Troubleshooting**:\n1. Documentation intelligence may not be initialized\n2. Try more specific task description\n3. Use queryDocumentationMCP for general guidance\n\n💡 **Alternative**: Query specific documentation categories like "testing" or "development"`
        }
      ],
      isError: true
    };
  }
}

/**
 * Resolve Workflow Steps - New Enhanced Capability
 */
export async function resolveWorkflowStepsMCP(
  request: WorkflowResolutionRequest,
  context: ProjectContext
): Promise<MCPToolResponse> {
  const { workflow, context: workflowContext, includePrerequisites, detailLevel } = request;
  
  try {
    const docEngine = await initializeDocumentationIntelligence(context);
    
    const workflowGuide = await docEngine.resolveWorkflowSteps(workflow);
    
    return {
      content: [
        {
          type: "text", 
          text: formatWorkflowGuideText(workflowGuide, workflow, workflowContext, detailLevel, includePrerequisites)
        }
      ]
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      content: [
        {
          type: "text",
          text: `💥 Workflow Resolution Error: ${errorMessage}\n\n⚙️ **Workflow**: "${workflow}"\n📍 **Context**: ${workflowContext}\n\n🛠️ **Troubleshooting**:\n1. Try more specific workflow description\n2. Use standard workflows: "component creation", "testing setup", "deployment"\n3. Check documentation for established patterns\n\n💡 **Alternative**: Use getContextualGuidanceMCP for task-specific guidance`
        }
      ],
      isError: true
    };
  }
}

// =============================================================================
// FORMATTING FUNCTIONS
// =============================================================================

/**
 * Format guidance response for contextual guidance requests
 */
function formatGuidanceResponse(guidance: any, query: string): MCPToolResponse {
  const content = `🎯 **Contextual Guidance**: "${query}"\n\n` +
    `📚 **Relevant Documentation**:\n${guidance.relevantDocs.map((doc: string) => `- ${doc}`).join('\n')}\n\n` +
    `✅ **Action Checklist**:\n${guidance.checklist.map((item: string, i: number) => `${i + 1}. ${item}`).join('\n')}\n\n` +
    (guidance.warnings.length > 0 ? `⚠️ **Warnings**:\n${guidance.warnings.map((warn: string) => `- ${warn}`).join('\n')}\n\n` : '') +
    `🚀 **Next Steps**:\n${guidance.nextSteps.map((step: string) => `- ${step}`).join('\n')}\n\n` +
    `⏱️ **Estimated Time**: ${guidance.estimatedTime}\n` +
    `📊 **Difficulty**: ${guidance.difficulty}\n\n` +
    `💡 **Tip**: Follow the checklist order for optimal workflow efficiency`;

  return {
    content: [{ type: "text", text: content }]
  };
}

/**
 * Format contextual response using enhanced intelligence
 */
function formatContextualResponse(response: any, query: string): MCPToolResponse {
  const content = `🧠 **Intelligent Documentation Response**: "${query}"\n\n` +
    `📖 **Primary Source**: ${response.primarySource}\n\n` +
    (response.supportingSources.length > 0 ? `📚 **Supporting Sources**:\n${response.supportingSources.map((src: string) => `- ${src}`).join('\n')}\n\n` : '') +
    `💡 **Contextual Advice**: ${response.contextualAdvice}\n\n` +
    `🛠️ **Suggested Actions**:\n${response.suggestedActions.map((action: string) => `- ${action}`).join('\n')}\n\n` +
    `🎯 **Confidence**: ${response.confidence}%\n` +
    `⏱️ **Read Time**: ${response.estimatedReadTime}\n\n` +
    `🚀 **Pro Tip**: Use the suggested actions to implement guidance effectively`;

  return {
    content: [{ type: "text", text: content }]
  };
}

/**
 * Format enhanced response with intelligence insights
 */
function formatEnhancedResponse(response: any, query: string, includeExamples: boolean, format: string): MCPToolResponse {
  if (format === 'summary') {
    const content = `📋 **Documentation Summary**: "${query}"\n\n` +
      `📖 **Primary**: ${response.primarySource}\n` +
      `📚 **Supporting**: ${response.supportingSources.slice(0, 2).join(', ')}\n` +
      `💡 **Advice**: ${response.contextualAdvice}\n` +
      `🎯 **Confidence**: ${response.confidence}%\n\n` +
      `🛠️ **Quick Actions**: ${response.suggestedActions.slice(0, 2).join(', ')}`;

    return {
      content: [{ type: "text", text: content }]
    };
  } else {
    const content = `📚 **Enhanced Documentation Results**: "${query}"\n\n` +
      `🎯 **Primary Source**: ${response.primarySource}\n\n` +
      (response.supportingSources.length > 0 ? `📖 **Supporting Documentation**:\n${response.supportingSources.map((src: string) => `- ${src}`).join('\n')}\n\n` : '') +
      `🧠 **Contextual Analysis**: ${response.contextualAdvice}\n\n` +
      `🛠️ **Recommended Actions**:\n${response.suggestedActions.map((action: string, i: number) => `${i + 1}. ${action}`).join('\n')}\n\n` +
      `📊 **Intelligence Metrics**:\n- Confidence: ${response.confidence}%\n- Read Time: ${response.estimatedReadTime}\n\n` +
      `💡 **Usage Tip**: Follow recommended actions in order for optimal results`;

    return {
      content: [{ type: "text", text: content }]
    };
  }
}

/**
 * Format contextual guidance text
 */
function formatContextualGuidanceText(
  guidance: any,
  currentTask: string,
  taskContext: string,
  urgency: string
): string {
  return `🎯 **Contextual Guidance for Task**: "${currentTask}"\n\n` +
    `📍 **Context**: ${taskContext} development\n` +
    `⚡ **Urgency**: ${urgency}\n` +
    `📊 **Difficulty**: ${guidance.difficulty}\n` +
    `⏱️ **Estimated Time**: ${guidance.estimatedTime}\n\n` +
    `📚 **Relevant Documentation**:\n${guidance.relevantDocs.map((doc: string) => `- ${doc}`).join('\n')}\n\n` +
    `✅ **Task Checklist**:\n${guidance.checklist.map((item: string, i: number) => `${i + 1}. ${item}`).join('\n')}\n\n` +
    (guidance.warnings.length > 0 ? `⚠️ **Important Warnings**:\n${guidance.warnings.map((warn: string) => `- ${warn}`).join('\n')}\n\n` : '') +
    `🚀 **Next Steps After Completion**:\n${guidance.nextSteps.map((step: string) => `- ${step}`).join('\n')}\n\n` +
    (guidance.relatedWorkflows ? `🔗 **Related Workflows**: ${guidance.relatedWorkflows.join(', ')}\n\n` : '') +
    `💡 **Pro Tip**: Complete checklist items in order for optimal workflow efficiency`;
}

/**
 * Format workflow guide text  
 */
function formatWorkflowGuideText(
  workflowGuide: any,
  workflow: string,
  workflowContext: string,
  detailLevel: string,
  includePrerequisites: boolean
): string {
  let content = `⚙️ **Workflow Guide**: "${workflow}"\n\n` +
    `📍 **Context**: ${workflowContext} development\n` +
    `📊 **Detail Level**: ${detailLevel}\n` +
    `⏱️ **Estimated Time**: ${workflowGuide.estimatedTime}\n\n`;

  if (includePrerequisites && workflowGuide.prerequisites.length > 0) {
    content += `📋 **Prerequisites**:\n${workflowGuide.prerequisites.map((req: string) => `- ${req}`).join('\n')}\n\n`;
  }

  content += `🔢 **Workflow Steps**:\n\n`;

  for (const step of workflowGuide.steps) {
    content += `**Step ${step.step}: ${step.title}**\n`;
    content += `${step.description}\n\n`;
    
    if (step.commands.length > 0) {
      content += `💻 **Commands**:\n${step.commands.map((cmd: string) => `\`${cmd}\``).join('\n')}\n\n`;
    }
    
    content += `✅ **Validation**: ${step.validation}\n\n`;
    
    if (detailLevel === 'comprehensive' && step.troubleshooting.length > 0) {
      content += `🔧 **Troubleshooting**:\n${step.troubleshooting.map((fix: string) => `- ${fix}`).join('\n')}\n\n`;
    }
    
    content += `---\n\n`;
  }

  if (workflowGuide.relatedWorkflows.length > 0) {
    content += `🔗 **Related Workflows**: ${workflowGuide.relatedWorkflows.join(', ')}\n\n`;
  }

  content += `💡 **Success Tip**: Validate each step before proceeding to ensure workflow integrity`;

  return content;
}