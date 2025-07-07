import { spawn } from "child_process";
import { PortDetectionRequest, PortDetectionResult, MCPToolResponse } from "../types/schemas.js";
import { ProjectContext, ServerInfo } from "../types/project.js";
import { detectActivePort, constructUrl, detectEnvironment } from "../lib/context.js";

/**
 * Intelligent port detection and environment analysis
 * Replaces timeout-prone port detection scripts with reliable TypeScript implementation
 */
export async function detectActivePortMCP(
  request: PortDetectionRequest,
  context: ProjectContext
) {
  const { scanPorts, preferredPort, includeHealth } = request;
  
  try {
    // Fast path: Check if we already have active port information
    const quickCheck = await detectActivePort();
    if (quickCheck && !scanPorts) {
      const healthCheck = includeHealth ? await validatePortHealth(quickCheck.port) : null;
      
      return {
        content: [
          {
            type: "text",
            text: `🔍 Port Detection Results - Quick Check\n\n📍 **Active Development Server**:\n- Port: ${quickCheck.port}\n- URL: ${quickCheck.url}\n- Environment: ${context.environment}\n${healthCheck ? `- Health: ${healthCheck.healthy ? "✅ Healthy" : "⚠️ Unresponsive"}` : ""}\n${healthCheck && healthCheck.responseTime ? `- Response time: ${healthCheck.responseTime}ms` : ""}\n\n🎯 **Ready for development!** Server detected and accessible.\n\n💡 **Environment Variables**:\n- ACTIVE_DEV_PORT=${quickCheck.port}\n- ACTIVE_DEV_URL="${quickCheck.url}"\n\n🚀 **Quick commands**:\n- Start development: Server already running\n- Run tests: executeTestMCP with testType "smoke"\n- Quality check: validateQualityGatesMCP`,
          },
        ],
      };
    }
    
    // Comprehensive scan if requested or no quick result
    const scanResult = await comprehensivePortScan(preferredPort, context);
    
    return formatPortDetectionResult(scanResult, context);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      content: [
        {
          type: "text",
          text: `💥 Port detection error: ${errorMessage}\n\n🔍 **Context**:\n- Environment: ${context.environment}\n- Preferred port: ${preferredPort || "none"}\n- Scan requested: ${scanPorts}\n\n🛠️ **Troubleshooting**:\n1. Try starting a development server first: startDevServerMCP\n2. Check system permissions for port scanning\n3. Verify network connectivity in cloud environments\n4. Use port range scan: detectActivePortMCP with scanPorts=true`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Comprehensive port scanning and analysis
 */
async function comprehensivePortScan(
  preferredPort: number | undefined,
  context: ProjectContext
): Promise<PortDetectionResult> {
  const startTime = Date.now();
  const scannedPorts: ServerInfo[] = [];
  const environment = await detectEnvironment();
  
  // Define port ranges to scan
  const portRanges = [
    preferredPort ? [preferredPort] : [],
    [3000, 3001, 3002, 3003], // Common development ports
    [4000, 4001, 4002],        // Alternative range
    [8000, 8080, 8081],        // Other common dev ports
  ].flat();
  
  // Remove duplicates and ensure preferred port is first
  const uniquePorts = Array.from(new Set(portRanges));
  
  // Scan each port
  for (const port of uniquePorts) {
    try {
      const portInfo = await analyzePort(port, environment);
      if (portInfo) {
        scannedPorts.push(portInfo);
      }
    } catch {
      // Continue with next port
    }
  }
  
  const duration = Date.now() - startTime;
  const activeServers = scannedPorts.filter(p => p.healthy);
  const recommendedPort = findRecommendedPort(scannedPorts, preferredPort);
  
  return {
    activeServers,
    recommendedPort,
    scannedPorts: scannedPorts.length,
    scanDuration: duration,
    environment,
    environmentUrl: recommendedPort ? await constructUrl(recommendedPort) : undefined,
  };
}

/**
 * Analyze individual port for server information
 */
async function analyzePort(port: number, environment: string): Promise<ServerInfo | null> {
  try {
    // Check if port is in use
    const isListening = await checkPortListening(port);
    if (!isListening) {
      return null;
    }
    
    // Get process information
    const processInfo = await getPortProcessInfo(port);
    const url = await constructUrl(port);
    
    // Health check
    const healthCheck = await validatePortHealth(port);
    
    return {
      port,
      url,
      pid: processInfo?.pid,
      processName: processInfo?.processName,
      healthy: healthCheck.healthy,
      responseTime: healthCheck.responseTime,
      lastChecked: new Date(),
    };
  } catch {
    return null;
  }
}

/**
 * Check if port is listening
 */
async function checkPortListening(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const lsof = spawn("lsof", ["-i", `:${port}`, "-sTCP:LISTEN"]);
    let output = "";
    
    lsof.stdout.on("data", (data) => {
      output += data.toString();
    });
    
    lsof.on("close", (code) => {
      resolve(output.trim().length > 0);
    });
    
    lsof.on("error", () => {
      resolve(false);
    });
  });
}

/**
 * Get process information for port
 */
async function getPortProcessInfo(port: number): Promise<{ pid: number; processName: string } | null> {
  try {
    const lsofOutput = await runCommand("lsof", ["-i", `:${port}`, "-sTCP:LISTEN"]);
    const lines = lsofOutput.trim().split('\n');
    
    if (lines.length > 1) {
      const processLine = lines[1];
      const parts = processLine.split(/\s+/);
      const processName = parts[0];
      const pid = parseInt(parts[1]);
      
      if (!isNaN(pid)) {
        return { pid, processName };
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Validate port health with HTTP request
 */
async function validatePortHealth(port: number): Promise<{ healthy: boolean; responseTime?: number }> {
  const startTime = Date.now();
  
  try {
    const url = await constructUrl(port);
    
    const response = await fetch(url, {
      method: "GET",
      headers: { "Accept": "text/html" },
      signal: AbortSignal.timeout(5000),
    });
    
    const responseTime = Date.now() - startTime;
    
    return {
      healthy: response.ok,
      responseTime,
    };
  } catch {
    return {
      healthy: false,
    };
  }
}

/**
 * Find recommended port based on scan results
 */
function findRecommendedPort(scannedPorts: ServerInfo[], preferredPort?: number): number | undefined {
  // If preferred port is healthy, use it
  if (preferredPort) {
    const preferredInfo = scannedPorts.find(p => p.port === preferredPort);
    if (preferredInfo && preferredInfo.healthy) {
      return preferredPort;
    }
  }
  
  // Find healthiest active server
  const healthyServers = scannedPorts.filter(p => p.healthy);
  if (healthyServers.length > 0) {
    // Sort by response time and prefer lower ports
    healthyServers.sort((a, b) => {
      const responseTimeDiff = (a.responseTime || 999) - (b.responseTime || 999);
      if (Math.abs(responseTimeDiff) < 100) {
        return a.port - b.port; // Prefer lower port if response times are similar
      }
      return responseTimeDiff;
    });
    
    return healthyServers[0].port;
  }
  
  return undefined;
}

/**
 * Format port detection results for Claude Code response
 */
function formatPortDetectionResult(
  result: PortDetectionResult,
  context: ProjectContext
): MCPToolResponse {
  const { activeServers, recommendedPort, scannedPorts, scanDuration, environment, environmentUrl } = result;
  
  if (activeServers.length === 0) {
    return {
      content: [
        {
          type: "text",
          text: `🔍 Port Detection Results - No Active Servers\n\n📊 **Scan Summary**:\n- Ports scanned: ${scannedPorts}\n- Active servers: 0\n- Scan duration: ${scanDuration}ms\n- Environment: ${environment}\n\n💡 **No development servers detected**\n\n🚀 **Next steps**:\n1. Start development server: startDevServerMCP\n2. Use specific port: startDevServerMCP with port parameter\n3. Check hooks system: The existing orchestrator may help\n\n🎯 **Recommended action**: Use startDevServerMCP to start a new server\n\n⚙️ **Port availability**: Ports 3000-3003, 4000-4002 appear to be available`,
        },
      ],
    };
  }
  
  const primaryServer = activeServers.find(s => s.port === recommendedPort) || activeServers[0];
  const otherServers = activeServers.filter(s => s !== primaryServer);
  
  return {
    content: [
      {
        type: "text",
        text: `🔍 Port Detection Results - ${activeServers.length} Active Server${activeServers.length > 1 ? 's' : ''}\n\n📍 **Primary Development Server**:\n- Port: ${primaryServer.port}\n- URL: ${primaryServer.url}\n- Process: ${primaryServer.processName || 'unknown'} (PID: ${primaryServer.pid || 'unknown'})\n- Health: ${primaryServer.healthy ? '✅ Healthy' : '⚠️ Unresponsive'}\n- Response time: ${primaryServer.responseTime || 'unknown'}ms\n\n📊 **Scan Summary**:\n- Ports scanned: ${scannedPorts}\n- Active servers: ${activeServers.length}\n- Scan duration: ${scanDuration}ms\n- Environment: ${environment}\n\n${otherServers.length > 0 ? `🔧 **Other Active Servers**:\n${otherServers.map(s => `- Port ${s.port}: ${s.processName || 'unknown'} (${s.healthy ? 'healthy' : 'unresponsive'})`).join('\n')}\n\n` : ''}💡 **Environment Variables** (for current shell):\n\`\`\`bash\nexport ACTIVE_DEV_PORT=${primaryServer.port}\nexport ACTIVE_DEV_URL="${primaryServer.url}"\n\`\`\`\n\n🎯 **Ready for development!** Primary server is ${primaryServer.healthy ? 'healthy and accessible' : 'detected but may need restart'}.\n\n🚀 **Next steps**:\n- Run tests: executeTestMCP with testType "smoke"\n- Quality check: validateQualityGatesMCP\n- Server management: startDevServerMCP with action "status"`,
      },
    ],
  };
}

/**
 * Utility function to run commands with timeout
 */
async function runCommand(
  command: string, 
  args: string[], 
  timeoutMs: number = 5000
): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "pipe",
    });
    
    let stdout = "";
    let stderr = "";
    
    const timeout = setTimeout(() => {
      child.kill();
      reject(new Error(`Command timed out: ${command} ${args.join(' ')}`));
    }, timeoutMs);
    
    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });
    
    child.on("close", (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Command failed with code ${code}: ${stderr || stdout}`));
      }
    });
  });
}