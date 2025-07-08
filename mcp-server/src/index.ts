#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { 
  RequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { spawn } from "child_process";
import { promises as fs } from "fs";
import { join } from "path";

// Import tool schemas and implementations
import {
  DevServerSchema,
  TestExecutionSchema,
  PortDetectionSchema,
  QualityGatesSchema,
  FileOperationSchema,
  DocumentationQuerySchema,
  ContextualGuidanceSchema,
  WorkflowResolutionSchema,
  ComponentArchitectureAnalysisSchema,
  ComponentGenerationSchema,
  ComponentComplianceValidationSchema,
  ComponentArchitectureInsightsSchema,
  TestingNeedsAnalysisSchema,
  TestingStrategySelectionSchema,
  TestingRecommendationsSchema,
  TestingConfigurationValidationSchema,
  PerformanceMonitoringSchema,
  PerformanceAspectAnalysisSchema,
  PerformanceOptimizationSchema,
  CrossSystemHealthCheckSchema,
  CrossSystemOperationPlanningSchema,
  CrossSystemFallbackExecutionSchema,
  CrossSystemInsightsSchema,
  EmergencyTriggerDetectionSchema,
  RollbackStrategyGenerationSchema,
  EmergencyRollbackExecutionSchema,
  EmergencyRecoveryAnalysisSchema
} from "./types/schemas.js";

import {
  startDevServerMCP,
  executeTestMCP,
  detectActivePortMCP,
  validateQualityGatesMCP,
  handleFileOperationMCP,
  queryDocumentationMCP,
  getContextualGuidanceMCP,
  resolveWorkflowStepsMCP,
  analyzeComponentArchitectureMCP,
  generateComponentMCP,
  validateComponentComplianceMCP,
  getComponentArchitectureInsightsMCP,
  analyzeTestingNeedsMCP,
  selectTestingStrategyMCP,
  getTestingRecommendationsMCP,
  validateTestingConfigurationMCP,
  monitorPerformanceMCP,
  analyzePerformanceAspectMCP,
  getPerformanceOptimizationsMCP,
  checkSystemHealthMCP,
  planCrossSystemOperationMCP,
  executeFallbackStrategyMCP,
  getCoordinationInsightsMCP,
  detectEmergencyTriggersMCP,
  generateRollbackStrategyMCP,
  executeEmergencyRollbackMCP,
  analyzeEmergencyRecoveryMCP
} from "./tools/index.js";

import { ProjectContext } from "./types/project.js";
import { getProjectContext, initializeProjectContext } from "./lib/context.js";

// No custom request schemas needed - MCP uses standard tools/call mechanism

// Tyler Gohr Portfolio MCP Server
const server = new Server(
  {
    name: "tyler-gohr-portfolio-development-server",
    version: "1.4.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Global project context
let projectContext: ProjectContext;

// Initialize project context when server starts
server.oninitialized = async () => {
  projectContext = await initializeProjectContext();
};

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "startDevServerMCP",
        description: "Start development server with intelligent port detection and cloud environment support (replaces timeout-prone npm run dev)",
        inputSchema: zodToJsonSchema(DevServerSchema),
      },
      {
        name: "executeTestMCP", 
        description: "Execute tests with intelligent strategy selection and timeout-resistant execution (replaces npm run test:e2e:smoke timeouts)",
        inputSchema: zodToJsonSchema(TestExecutionSchema),
      },
      {
        name: "detectActivePortMCP",
        description: "Detect active development server ports with cloud environment support (replaces complex bash port detection)",
        inputSchema: zodToJsonSchema(PortDetectionSchema),
      },
      {
        name: "validateQualityGatesMCP",
        description: "Run TypeScript validation, ESLint, and build checks (direct tool access without bash timeouts)",
        inputSchema: zodToJsonSchema(QualityGatesSchema),
      },
      {
        name: "handleFileOperationMCP",
        description: "Safe file operations with protection validation and automatic backups",
        inputSchema: zodToJsonSchema(FileOperationSchema),
      },
      {
        name: "queryDocumentationMCP",
        description: "Enhanced documentation intelligence with semantic search and contextual guidance (Phase 3 Tier 1 capability)",
        inputSchema: zodToJsonSchema(DocumentationQuerySchema),
      },
      {
        name: "getContextualGuidanceMCP",
        description: "Get intelligent contextual guidance for development tasks with checklists and warnings (Phase 3 enhanced capability)",
        inputSchema: zodToJsonSchema(ContextualGuidanceSchema),
      },
      {
        name: "resolveWorkflowStepsMCP",
        description: "Resolve complex development workflows into step-by-step guides with validation and troubleshooting (Phase 3 enhanced capability)",
        inputSchema: zodToJsonSchema(WorkflowResolutionSchema),
      },
      {
        name: "analyzeComponentArchitectureMCP",
        description: "Analyze existing /2 component architecture patterns, brand token usage, and architectural insights (Phase 4 Tier 1 capability)",
        inputSchema: zodToJsonSchema(ComponentArchitectureAnalysisSchema),
      },
      {
        name: "generateComponentMCP",
        description: "Generate new /2 components with automatic brand token compliance and enterprise architecture patterns (Phase 4 enhanced capability)",
        inputSchema: zodToJsonSchema(ComponentGenerationSchema),
      },
      {
        name: "validateComponentComplianceMCP",
        description: "Validate component compliance with brand tokens, accessibility standards, and performance best practices (Phase 4 validation)",
        inputSchema: zodToJsonSchema(ComponentComplianceValidationSchema),
      },
      {
        name: "getComponentArchitectureInsightsMCP",
        description: "Get comprehensive architecture insights including performance optimizations and accessibility recommendations (Phase 4 intelligence)",
        inputSchema: zodToJsonSchema(ComponentArchitectureInsightsSchema),
      },
      {
        name: "analyzeTestingNeedsMCP",
        description: "Analyze testing needs based on file changes and development context with intelligent strategy recommendations (Phase 4 Tier 1 capability)",
        inputSchema: zodToJsonSchema(TestingNeedsAnalysisSchema),
      },
      {
        name: "selectTestingStrategyMCP",
        description: "Select optimal testing strategy with intelligent analysis of file changes, risk assessment, and context awareness (Phase 4 enhanced capability)",
        inputSchema: zodToJsonSchema(TestingStrategySelectionSchema),
      },
      {
        name: "getTestingRecommendationsMCP",
        description: "Get testing recommendations for specific development scenarios with workflow guidance and optimization tips (Phase 4 intelligence)",
        inputSchema: zodToJsonSchema(TestingRecommendationsSchema),
      },
      {
        name: "validateTestingConfigurationMCP",
        description: "Validate and optimize testing strategy configuration with health scoring and improvement recommendations (Phase 4 validation)",
        inputSchema: zodToJsonSchema(TestingConfigurationValidationSchema),
      },
      {
        name: "monitorPerformanceMCP",
        description: "Monitor real-time performance metrics with Core Web Vitals analysis, bundle monitoring, and enterprise standards compliance (Phase 4 Tier 1 capability)",
        inputSchema: zodToJsonSchema(PerformanceMonitoringSchema),
      },
      {
        name: "analyzePerformanceAspectMCP",
        description: "Analyze specific performance aspects (Core Web Vitals, Lighthouse, bundle size, animation, CSS) with detailed insights and recommendations (Phase 4 enhanced capability)",
        inputSchema: zodToJsonSchema(PerformanceAspectAnalysisSchema),
      },
      {
        name: "getPerformanceOptimizationsMCP",
        description: "Get performance optimization recommendations with prioritization and implementation guidance for enterprise standards (Phase 4 intelligence)",
        inputSchema: zodToJsonSchema(PerformanceOptimizationSchema),
      },
      {
        name: "checkSystemHealthMCP",
        description: "Check health of both MCP and hooks systems with intelligent coordination analysis and fallback recommendations (Phase 4 Cross-System Coordinator)",
        inputSchema: zodToJsonSchema(CrossSystemHealthCheckSchema),
      },
      {
        name: "planCrossSystemOperationMCP",
        description: "Plan cross-system operations with intelligent system selection, fallback strategies, and monitoring configuration (Phase 4 Cross-System Coordinator)",
        inputSchema: zodToJsonSchema(CrossSystemOperationPlanningSchema),
      },
      {
        name: "executeFallbackStrategyMCP",
        description: "Execute intelligent fallback strategies when primary systems fail, with state preservation and automatic recovery (Phase 4 Cross-System Coordinator)",
        inputSchema: zodToJsonSchema(CrossSystemFallbackExecutionSchema),
      },
      {
        name: "getCoordinationInsightsMCP",
        description: "Get comprehensive insights into cross-system coordination with performance analysis and optimization recommendations (Phase 4 Cross-System Coordinator)",
        inputSchema: zodToJsonSchema(CrossSystemInsightsSchema),
      },
      {
        name: "detectEmergencyTriggersMCP",
        description: "Detect emergency triggers requiring rollback with automatic system health monitoring and trigger analysis (Phase 4 Emergency Rollback Intelligence)",
        inputSchema: zodToJsonSchema(EmergencyTriggerDetectionSchema),
      },
      {
        name: "generateRollbackStrategyMCP",
        description: "Generate intelligent rollback strategies with state preservation and alternative approaches for emergency recovery (Phase 4 Emergency Rollback Intelligence)",
        inputSchema: zodToJsonSchema(RollbackStrategyGenerationSchema),
      },
      {
        name: "executeEmergencyRollbackMCP",
        description: "Execute emergency rollback with intelligent strategy selection, state preservation, and automatic validation (Phase 4 Emergency Rollback Intelligence)",
        inputSchema: zodToJsonSchema(EmergencyRollbackExecutionSchema),
      },
      {
        name: "analyzeEmergencyRecoveryMCP",
        description: "Analyze comprehensive emergency recovery with risk assessment, prevention tips, and system health insights (Phase 4 Emergency Rollback Intelligence)",
        inputSchema: zodToJsonSchema(EmergencyRecoveryAnalysisSchema),
      },
    ],
  };
});

// Handle tool execution using standard MCP tools/call mechanism
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    // Update project context before each tool execution
    projectContext = await getProjectContext(projectContext);
    
    switch (name) {
      case "startDevServerMCP":
        return await startDevServerMCP(DevServerSchema.parse(args), projectContext);
        
      case "executeTestMCP":
        return await executeTestMCP(TestExecutionSchema.parse(args), projectContext);
        
      case "detectActivePortMCP":
        return await detectActivePortMCP(PortDetectionSchema.parse(args), projectContext);
        
      case "validateQualityGatesMCP":
        return await validateQualityGatesMCP(QualityGatesSchema.parse(args), projectContext);
        
      case "handleFileOperationMCP":
        return await handleFileOperationMCP(FileOperationSchema.parse(args), projectContext);
        
      case "queryDocumentationMCP":
        return await queryDocumentationMCP(DocumentationQuerySchema.parse(args), projectContext);
      
      case "getContextualGuidanceMCP":
        return await getContextualGuidanceMCP(ContextualGuidanceSchema.parse(args), projectContext);
        
      case "resolveWorkflowStepsMCP":
        return await resolveWorkflowStepsMCP(WorkflowResolutionSchema.parse(args), projectContext);
        
      case "analyzeComponentArchitectureMCP":
        return await analyzeComponentArchitectureMCP(ComponentArchitectureAnalysisSchema.parse(args), projectContext);
        
      case "generateComponentMCP":
        return await generateComponentMCP(ComponentGenerationSchema.parse(args), projectContext);
        
      case "validateComponentComplianceMCP":
        return await validateComponentComplianceMCP(ComponentComplianceValidationSchema.parse(args), projectContext);
        
      case "getComponentArchitectureInsightsMCP":
        return await getComponentArchitectureInsightsMCP(ComponentArchitectureInsightsSchema.parse(args), projectContext);
        
      case "analyzeTestingNeedsMCP":
        return await analyzeTestingNeedsMCP(TestingNeedsAnalysisSchema.parse(args), projectContext);
        
      case "selectTestingStrategyMCP":
        return await selectTestingStrategyMCP(TestingStrategySelectionSchema.parse(args), projectContext);
        
      case "getTestingRecommendationsMCP":
        return await getTestingRecommendationsMCP(TestingRecommendationsSchema.parse(args), projectContext);
        
      case "validateTestingConfigurationMCP":
        return await validateTestingConfigurationMCP(TestingConfigurationValidationSchema.parse(args), projectContext);
        
      case "monitorPerformanceMCP":
        return await monitorPerformanceMCP(PerformanceMonitoringSchema.parse(args), projectContext);
        
      case "analyzePerformanceAspectMCP":
        return await analyzePerformanceAspectMCP(PerformanceAspectAnalysisSchema.parse(args), projectContext);
        
      case "getPerformanceOptimizationsMCP":
        return await getPerformanceOptimizationsMCP(PerformanceOptimizationSchema.parse(args), projectContext);
        
      case "checkSystemHealthMCP":
        return await checkSystemHealthMCP(CrossSystemHealthCheckSchema.parse(args), projectContext);
        
      case "planCrossSystemOperationMCP":
        return await planCrossSystemOperationMCP(CrossSystemOperationPlanningSchema.parse(args), projectContext);
        
      case "executeFallbackStrategyMCP":
        return await executeFallbackStrategyMCP(CrossSystemFallbackExecutionSchema.parse(args), projectContext);
        
      case "getCoordinationInsightsMCP":
        return await getCoordinationInsightsMCP(CrossSystemInsightsSchema.parse(args), projectContext);
        
      case "detectEmergencyTriggersMCP":
        return await detectEmergencyTriggersMCP(EmergencyTriggerDetectionSchema.parse(args), projectContext);
        
      case "generateRollbackStrategyMCP":
        return await generateRollbackStrategyMCP(RollbackStrategyGenerationSchema.parse(args), projectContext);
        
      case "executeEmergencyRollbackMCP":
        return await executeEmergencyRollbackMCP(EmergencyRollbackExecutionSchema.parse(args), projectContext);
        
      case "analyzeEmergencyRecoveryMCP":
        return await analyzeEmergencyRecoveryMCP(EmergencyRecoveryAnalysisSchema.parse(args), projectContext);
        
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      content: [
        {
          type: "text" as const,
          text: `Error executing ${name}: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Utility function for running commands with timeout resistance
export async function runCommand(
  command: string,
  args: string[],
  options: any = {},
  timeoutMs: number = 120000
): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      stdio: "pipe",
      ...options,
    });
    
    let stdout = "";
    let stderr = "";
    let timeoutId: NodeJS.Timeout;
    
    // Setup timeout
    timeoutId = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error(`Command timed out after ${timeoutMs}ms: ${command} ${args.join(' ')}`));
    }, timeoutMs);
    
    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });
    
    child.on("close", (code) => {
      clearTimeout(timeoutId);
      
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Command failed with code ${code}: ${stderr || stdout}`));
      }
    });
    
    child.on("error", (error) => {
      clearTimeout(timeoutId);
      reject(error);
    });
  });
}

// Main function to start the server
async function main() {
  console.error("Tyler Gohr Portfolio MCP Server v1.4.0 - Phase 4 Complete");
  console.error("==========================================================");
  console.error("ALL TIER 1 INTELLIGENCE SERVERS OPERATIONAL");
  console.error("Documentation + Component + Testing + Performance + Cross-System + Emergency Rollback Intelligence");
  console.error("Timeout prevention + intelligent automation + emergency recovery + cross-system coordination");
  console.error("");
  
  // Handle command line arguments
  const args = process.argv.slice(2);
  if (args.length > 0) {
    switch (args[0]) {
      case "test":
        console.error("Running basic functionality test...");
        // Initialize project context for testing
        projectContext = await initializeProjectContext();
        console.error(`✅ Server initialized successfully`);
        console.error(`📁 Project root: ${projectContext.projectRoot}`);
        console.error(`🌍 Environment: ${projectContext.environment}`);
        console.error(`🎯 Context: ${projectContext.developmentContext}`);
        process.exit(0);
        break;
        
      case "health":
        console.error("Performing health check...");
        try {
          projectContext = await initializeProjectContext();
          console.error("✅ MCP Server health check passed");
          process.exit(0);
        } catch (error) {
          console.error("❌ MCP Server health check failed:", error);
          process.exit(1);
        }
        break;
        
      default:
        console.error(`Unknown command: ${args[0]}`);
        console.error("Available commands: test, health");
        process.exit(1);
    }
  }
  
  // Start MCP server
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 Tyler Gohr Portfolio MCP Server v1.4.0 running on stdio");
  console.error("🔧 Core Tools: startDevServerMCP, executeTestMCP, detectActivePortMCP, validateQualityGatesMCP");
  console.error("🧠 Documentation Intelligence: queryDocumentationMCP, getContextualGuidanceMCP, resolveWorkflowStepsMCP");
  console.error("🏗️  Component Intelligence: analyzeComponentArchitectureMCP, generateComponentMCP, validateComponentComplianceMCP");
  console.error("🧪 Testing Intelligence: analyzeTestingNeedsMCP, selectTestingStrategyMCP, getTestingRecommendationsMCP");
  console.error("📊 Performance Intelligence: monitorPerformanceMCP, analyzePerformanceAspectMCP, getPerformanceOptimizationsMCP");
  console.error("🔄 Cross-System Coordinator: checkSystemHealthMCP, planCrossSystemOperationMCP, executeFallbackStrategyMCP, getCoordinationInsightsMCP");
  console.error("🚨 Emergency Rollback Intelligence: detectEmergencyTriggersMCP, generateRollbackStrategyMCP, executeEmergencyRollbackMCP, analyzeEmergencyRecoveryMCP");
  console.error("⚡ Ready to provide \"Claude Code superpowers\" with comprehensive intelligent development automation");
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.error('\n🛑 Shutting down Tyler Gohr Portfolio MCP Server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('\n🛑 Shutting down Tyler Gohr Portfolio MCP Server...');
  process.exit(0);
});

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("💥 Server error:", error);
    process.exit(1);
  });
}