#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { 
  RequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
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
  WorkflowResolutionSchema
} from "./types/schemas.js";

import {
  startDevServerMCP,
  executeTestMCP,
  detectActivePortMCP,
  validateQualityGatesMCP,
  handleFileOperationMCP,
  queryDocumentationMCP,
  getContextualGuidanceMCP,
  resolveWorkflowStepsMCP
} from "./tools/index.js";

import { ProjectContext } from "./types/project.js";
import { getProjectContext, initializeProjectContext } from "./lib/context.js";

// No custom request schemas needed - MCP uses standard tools/call mechanism

// Tyler Gohr Portfolio MCP Server
const server = new Server(
  {
    name: "tyler-gohr-portfolio-development-server",
    version: "1.0.0",
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
        inputSchema: DevServerSchema,
      },
      {
        name: "executeTestMCP", 
        description: "Execute tests with intelligent strategy selection and timeout-resistant execution (replaces npm run test:e2e:smoke timeouts)",
        inputSchema: TestExecutionSchema,
      },
      {
        name: "detectActivePortMCP",
        description: "Detect active development server ports with cloud environment support (replaces complex bash port detection)",
        inputSchema: PortDetectionSchema,
      },
      {
        name: "validateQualityGatesMCP",
        description: "Run TypeScript validation, ESLint, and build checks (direct tool access without bash timeouts)",
        inputSchema: QualityGatesSchema,
      },
      {
        name: "handleFileOperationMCP",
        description: "Safe file operations with protection validation and automatic backups",
        inputSchema: FileOperationSchema,
      },
      {
        name: "queryDocumentationMCP",
        description: "Enhanced documentation intelligence with semantic search and contextual guidance (Phase 3 Tier 1 capability)",
        inputSchema: DocumentationQuerySchema,
      },
      {
        name: "getContextualGuidanceMCP",
        description: "Get intelligent contextual guidance for development tasks with checklists and warnings (Phase 3 enhanced capability)",
        inputSchema: ContextualGuidanceSchema,
      },
      {
        name: "resolveWorkflowStepsMCP",
        description: "Resolve complex development workflows into step-by-step guides with validation and troubleshooting (Phase 3 enhanced capability)",
        inputSchema: WorkflowResolutionSchema,
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
  console.error("Tyler Gohr Portfolio MCP Server v1.3.0 - Phase 3");
  console.error("================================================");
  console.error("Enhanced Intelligence: Documentation Intelligence Server (Tier 1)");
  console.error("Timeout prevention + intelligent development automation + contextual guidance");
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
  console.error("🚀 Tyler Gohr Portfolio MCP Server v1.3.0 running on stdio");
  console.error("🔧 Core Tools: startDevServerMCP, executeTestMCP, detectActivePortMCP, validateQualityGatesMCP");
  console.error("🧠 Enhanced Intelligence: queryDocumentationMCP, getContextualGuidanceMCP, resolveWorkflowStepsMCP");
  console.error("⚡ Ready to provide \"Claude Code superpowers\" with intelligent development automation");
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