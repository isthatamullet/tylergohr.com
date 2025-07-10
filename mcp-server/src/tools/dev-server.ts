import { spawn } from "child_process";
import { promises as fs } from "fs";
import { join } from "path";
import { DevServerRequest, DevServerResult, MCPToolResponse } from "../types/schemas.js";
import { ProjectContext } from "../types/project.js";
import { constructUrl, detectActivePort } from "../lib/context.js";

/**
 * Start development server with intelligent port detection and cloud environment support
 * Replaces timeout-prone "npm run dev" commands with reliable TypeScript implementation
 */
export async function startDevServerMCP(
  request: DevServerRequest,
  context: ProjectContext
) {
  const { port: requestedPort, enhanced, action, environment } = request;
  
  try {
    switch (action) {
      case "status":
        return await getServerStatus(context);
        
      case "stop":
        return await stopServer(context);
        
      case "restart":
        const stopResult = await stopServer(context);
        if (stopResult.isError) {
          return stopResult;
        }
        // Wait a moment before starting
        await new Promise(resolve => setTimeout(resolve, 2000));
        return await startServer(requestedPort, enhanced, context);
        
      case "start":
      default:
        return await startServer(requestedPort, enhanced, context);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      content: [
        {
          type: "text",
          text: `❌ Development server error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Start the development server
 */
async function startServer(
  requestedPort: number | undefined,
  enhanced: boolean,
  context: ProjectContext
) {
  
  // Check if server is already running
  const existingServer = await detectActivePort();
  if (existingServer) {
    const isHealthy = await validateServerHealth(existingServer.port);
    if (isHealthy) {
      return {
        content: [
          {
            type: "text",
            text: `✅ Development server already running successfully
            
📍 **Server Details**:
- Port: ${existingServer.port}
- URL: ${existingServer.url}
- Environment: ${context.environment}
- Status: Healthy and responsive

🎯 **Ready for development!** Your server is already up and accessible.

💡 **Next steps**:
- Run tests: executeTestMCP with testType "smoke"
- Validate quality: validateQualityGatesMCP  
- Generate screenshots: executeTestMCP with testType "visual"`,
          },
        ],
      };
    }
  }
  
  // Find optimal port
  const targetPort = await findOptimalPort(requestedPort, context);
  
  // Prepare environment
  const env = {
    ...process.env,
    PORT: targetPort.toString(),
    NODE_ENV: "development",
  };
  
  // Choose the command based on enhanced flag and available scripts
  const command = enhanced ? "dev:enhanced" : "dev";
  
  try {
    // Start the server process
    const serverProcess = spawn("npm", ["run", command], {
      cwd: context.projectRoot,
      env,
      stdio: ["ignore", "pipe", "pipe"],
      detached: true,
    });
    
    let serverStartupOutput = "";
    let serverStartupError = "";
    
    // Collect startup output
    serverProcess.stdout.on("data", (data) => {
      serverStartupOutput += data.toString();
    });
    
    serverProcess.stderr.on("data", (data) => {
      serverStartupError += data.toString();
    });
    
    // Wait for server to start (with timeout)
    const serverUrl = await constructUrl(targetPort);
    const startupSuccess = await waitForServerStartup(targetPort, 45000); // 45 second timeout
    
    if (startupSuccess) {
      // Save server info for future reference
      process.env.ACTIVE_DEV_PORT = targetPort.toString();
      process.env.ACTIVE_DEV_URL = serverUrl;
      
      return {
        content: [
          {
            type: "text", 
            text: `🚀 Development server started successfully!

📍 **Server Details**:
- Port: ${targetPort}
- URL: ${serverUrl}
- Environment: ${context.environment}
- PID: ${serverProcess.pid}
- Command: npm run ${command}

⚡ **Performance Benefits**:
- ✅ Eliminated 2-minute timeout risk
- ✅ Cloud environment URL auto-detection
- ✅ Intelligent port conflict resolution
- ✅ 30-45 second reliable startup vs potential failures

🎯 **Ready for development!** Server is healthy and accessible.

💡 **Next steps**:
- Run quick tests: executeTestMCP with testType "smoke" 
- Validate code quality: validateQualityGatesMCP
- Generate visual review: executeTestMCP with testType "visual"

📊 **Startup Log Summary**:
${serverStartupOutput.slice(-300)}`,
          },
        ],
      };
    } else {
      // Server failed to start within timeout
      serverProcess.kill();
      
      return {
        content: [
          {
            type: "text",
            text: `⚠️ Development server startup timed out after 45 seconds

🔍 **Troubleshooting Information**:
- Attempted port: ${targetPort}
- Environment: ${context.environment}
- Command: npm run ${command}

📋 **Startup Output**:
${serverStartupOutput}

❌ **Startup Errors**:
${serverStartupError}

🛠️ **Recommended Actions**:
1. Check for port conflicts: detectActivePortMCP
2. Try different port: startDevServerMCP with specific port
3. Use enhanced mode: startDevServerMCP with enhanced=true
4. Check hooks system: The existing hooks orchestrator may help

💡 **Alternative**: Try the enhanced hooks system - it may handle this automatically`,
          },
        ],
        isError: true,
      };
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      content: [
        {
          type: "text",
          text: `💥 Failed to start development server

❌ **Error**: ${errorMessage}

🔍 **Context**:
- Target port: ${targetPort}
- Environment: ${context.environment}  
- Project root: ${context.projectRoot}
- Command attempted: npm run ${command}

🛠️ **Recommended Actions**:
1. Verify npm scripts: Check package.json for "dev" script
2. Check dependencies: Ensure Node.js and npm are working
3. Try port detection: Use detectActivePortMCP to check conflicts
4. Check permissions: Ensure write access to project directory

💡 **Fallback**: The existing hooks system may handle this scenario better`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Get current server status
 */
async function getServerStatus(context: ProjectContext) {
  const activeServer = await detectActivePort();
  
  if (!activeServer) {
    return {
      content: [
        {
          type: "text",
          text: `📊 Development Server Status: Not Running

🔍 **Status Check Results**:
- Active servers detected: None
- Ports scanned: 3000-4010
- Environment: ${context.environment}

💡 **To start server**: Use startDevServerMCP with action "start"`,
        },
      ],
    };
  }
  
  const isHealthy = await validateServerHealth(activeServer.port);
  const healthStatus = isHealthy ? "✅ Healthy" : "⚠️ Unresponsive";
  
  return {
    content: [
      {
        type: "text",
        text: `📊 Development Server Status: Running

📍 **Server Details**:
- Port: ${activeServer.port}
- URL: ${activeServer.url}
- Health: ${healthStatus}
- Environment: ${context.environment}

${isHealthy ? 
  "🎯 **Server is ready for development!**" : 
  "⚠️ **Server may need restart** - Use startDevServerMCP with action 'restart'"
}

💡 **Available actions**: start, stop, restart, status`,
      },
    ],
  };
}

/**
 * Stop the development server
 */
async function stopServer(context: ProjectContext) {
  try {
    const activeServer = await detectActivePort();
    
    if (!activeServer) {
      return {
        content: [
          {
            type: "text",
            text: `ℹ️ No development server currently running

🔍 **Status**: No active Next.js development servers detected
- Ports checked: 3000-4010  
- Environment: ${context.environment}

✅ **Result**: Nothing to stop - server is already not running`,
          },
        ],
      };
    }
    
    // Try to find and kill the process
    const processKilled = await killServerProcess(activeServer.port);
    
    if (processKilled) {
      // Clear environment variables
      delete process.env.ACTIVE_DEV_PORT;
      delete process.env.ACTIVE_DEV_URL;
      
      return {
        content: [
          {
            type: "text",
            text: `🛑 Development server stopped successfully

📍 **Stopped Server**:
- Port: ${activeServer.port}
- URL: ${activeServer.url}
- Environment: ${context.environment}

✅ **Server process terminated and port freed**

💡 **To restart**: Use startDevServerMCP with action "start"`,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: `⚠️ Could not stop development server

🔍 **Details**:
- Detected server on port: ${activeServer.port}
- URL: ${activeServer.url}
- Environment: ${context.environment}

❌ **Issue**: Process may be owned by different user or protected

🛠️ **Manual steps**: 
1. Try: pkill -f "next-server"
2. Or: lsof -ti :${activeServer.port} | xargs kill
3. Or restart your development environment`,
          },
        ],
        isError: true,
      };
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      content: [
        {
          type: "text",
          text: `💥 Error stopping development server: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Find optimal port for development server
 */
async function findOptimalPort(
  requestedPort: number | undefined,
  context: ProjectContext
): Promise<number> {
  // Start with requested port or default to 3000
  let targetPort = requestedPort || 3000;
  
  // Check if requested port is available
  if (await isPortAvailable(targetPort)) {
    return targetPort;
  }
  
  // If not available, find next available port
  for (let port = targetPort; port <= targetPort + 10; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  
  // Fallback to higher range
  for (let port = 4000; port <= 4010; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  
  // Last resort
  return 3000;
}

/**
 * Check if a port is available
 */
async function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    // spawn is already imported at the top of the file
    
    const lsof = spawn("lsof", ["-i", `:${port}`]);
    let output = "";
    
    lsof.stdout.on("data", (data: any) => {
      output += data.toString();
    });
    
    lsof.on("close", (code: number) => {
      // If lsof finds nothing, the port is available
      resolve(output.trim() === "");
    });
    
    lsof.on("error", () => {
      // If lsof command fails, assume port is available
      resolve(true);
    });
  });
}

/**
 * Wait for server to start up and respond
 */
async function waitForServerStartup(port: number, timeoutMs: number): Promise<boolean> {
  const startTime = Date.now();
  const url = await constructUrl(port);
  
  while (Date.now() - startTime < timeoutMs) {
    if (await validateServerHealth(port)) {
      return true;
    }
    
    // Wait 2 seconds before next check
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return false;
}

/**
 * Validate that the server is healthy and responding
 */
async function validateServerHealth(port: number): Promise<boolean> {
  try {
    const url = await constructUrl(port);
    
    // Try to make a simple HTTP request
    const response = await fetch(url, {
      method: "GET",
      headers: { "Accept": "text/html" },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Kill the server process running on specified port
 */
async function killServerProcess(port: number): Promise<boolean> {
  try {
    // spawn is already imported at the top of the file
    
    // Find the PID using the port
    const lsof = spawn("lsof", ["-ti", `:${port}`]);
    let pidOutput = "";
    
    lsof.stdout.on("data", (data: any) => {
      pidOutput += data.toString();
    });
    
    return new Promise((resolve) => {
      lsof.on("close", (code: number) => {
        const pids = pidOutput.trim().split('\n').filter(Boolean);
        
        if (pids.length === 0) {
          resolve(false);
          return;
        }
        
        // Kill each PID
        let killCount = 0;
        for (const pid of pids) {
          const kill = spawn("kill", ["-TERM", pid]);
          kill.on("close", () => {
            killCount++;
            if (killCount === pids.length) {
              resolve(true);
            }
          });
        }
      });
      
      lsof.on("error", () => {
        resolve(false);
      });
    });
  } catch {
    return false;
  }
}