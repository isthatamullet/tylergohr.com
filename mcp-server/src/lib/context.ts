import { promises as fs } from "fs";
import { join } from "path";
import { spawn } from "child_process";
import { 
  ProjectContext, 
  Environment, 
  DevelopmentContext, 
  PackageJsonInfo, 
  GitInfo,
  CloudEnvironmentInfo 
} from "../types/project.js";

/**
 * Initialize project context by detecting environment and project state
 */
export async function initializeProjectContext(): Promise<ProjectContext> {
  // Ensure we're using the Tyler Gohr portfolio root directory
  const projectRoot = process.env.PROJECT_ROOT || "/home/user/tylergohr.com";
  
  return {
    projectRoot,
    environment: await detectEnvironment(),
    developmentContext: await detectDevelopmentContext(projectRoot),
    lastUpdated: new Date(),
    hooksSystemAvailable: await checkHooksSystemAvailability(projectRoot),
    packageJson: await getPackageJsonInfo(projectRoot),
    gitInfo: await getGitInfo(projectRoot),
  };
}

/**
 * Update project context with current state
 */
export async function getProjectContext(existingContext?: ProjectContext): Promise<ProjectContext> {
  if (!existingContext) {
    return initializeProjectContext();
  }
  
  // Only update if more than 30 seconds have passed
  const now = new Date();
  const timeDiff = now.getTime() - existingContext.lastUpdated.getTime();
  if (timeDiff < 30000) {
    return existingContext;
  }
  
  // Update dynamic elements
  const updatedContext: ProjectContext = {
    ...existingContext,
    lastUpdated: now,
    developmentContext: await detectDevelopmentContext(existingContext.projectRoot),
    gitInfo: await getGitInfo(existingContext.projectRoot),
  };
  
  // Update port information if available
  const activePort = await detectActivePort();
  if (activePort) {
    updatedContext.activePort = activePort.port;
    updatedContext.activeUrl = activePort.url;
  }
  
  return updatedContext;
}

/**
 * Detect the current development environment
 */
export async function detectEnvironment(): Promise<Environment> {
  // Check for Google Cloud Workstations
  if (process.env.CLOUDWORKSTATIONS_REGION) {
    return "cloud-workstation";
  }
  
  // Check for GitHub Codespaces
  if (process.env.CODESPACES) {
    return "codespaces";
  }
  
  // Check for Gitpod
  if (process.env.GITPOD_WORKSPACE_ID) {
    return "gitpod";
  }
  
  // Check for local indicators
  if (process.env.HOME && !process.env.CI) {
    return "local";
  }
  
  return "unknown";
}

/**
 * Detect development context (main vs /2 redesign)
 */
export async function detectDevelopmentContext(projectRoot: string): Promise<DevelopmentContext> {
  try {
    // Check current working directory
    const cwd = process.cwd();
    
    // If we're in the /2 directory structure
    if (cwd.includes("/app/2") || cwd.includes("\\app\\2")) {
      return "2";
    }
    
    // Check if there are recent changes to /2 files
    try {
      const result = await runCommand("git", ["diff", "--name-only", "HEAD~5"], { cwd: projectRoot });
      const recentFiles = result.split('\n').filter(Boolean);
      
      const mainChanges = recentFiles.filter(f => !f.includes("app/2")).length;
      const redesignChanges = recentFiles.filter(f => f.includes("app/2")).length;
      
      if (redesignChanges > mainChanges) {
        return "2";
      } else if (mainChanges > 0 && redesignChanges > 0) {
        return "mixed";
      } else if (mainChanges > 0) {
        return "main";
      }
    } catch {
      // Git command failed, continue with other detection
    }
    
    // Check for specific /2 indicators in current directory
    const currentPath = process.cwd();
    if (currentPath.includes("/2/") || currentPath.includes("\\2\\")) {
      return "2";
    }
    
    return "main";
  } catch {
    return "unknown";
  }
}

/**
 * Check if the hooks system is available
 */
export async function checkHooksSystemAvailability(projectRoot: string): Promise<boolean> {
  try {
    const hooksOrchestratorPath = join(projectRoot, "scripts", "hooks", "orchestrator", "orchestrator.sh");
    await fs.access(hooksOrchestratorPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get package.json information
 */
export async function getPackageJsonInfo(projectRoot: string): Promise<PackageJsonInfo | undefined> {
  try {
    const packageJsonPath = join(projectRoot, "package.json");
    const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);
    
    return {
      name: packageJson.name || "",
      version: packageJson.version || "",
      scripts: Object.keys(packageJson.scripts || {}),
      dependencies: Object.keys(packageJson.dependencies || {}),
      devDependencies: Object.keys(packageJson.devDependencies || {}),
    };
  } catch {
    return undefined;
  }
}

/**
 * Get Git repository information
 */
export async function getGitInfo(projectRoot: string): Promise<GitInfo | undefined> {
  try {
    const [branch, statusOutput, lastCommit] = await Promise.all([
      runCommand("git", ["branch", "--show-current"], { cwd: projectRoot }),
      runCommand("git", ["status", "--porcelain"], { cwd: projectRoot }),
      getLastCommitInfo(projectRoot),
    ]);
    
    const statusLines = statusOutput.trim().split('\n').filter(Boolean);
    const hasUnstagedChanges = statusLines.some(line => line[1] !== ' ' && line[1] !== '?');
    const hasStagedChanges = statusLines.some(line => line[0] !== ' ' && line[0] !== '?');
    
    return {
      branch: branch.trim(),
      hasUnstagedChanges,
      hasStagedChanges,
      lastCommit,
    };
  } catch {
    return undefined;
  }
}

/**
 * Get last commit information
 */
async function getLastCommitInfo(projectRoot: string) {
  try {
    const output = await runCommand("git", [
      "log", "-1", "--pretty=format:%H|%s|%an|%ad", "--date=iso"
    ], { cwd: projectRoot });
    
    const [hash, message, author, date] = output.split('|');
    
    return {
      hash: hash.substring(0, 8),
      message,
      author,
      date: new Date(date),
    };
  } catch {
    return undefined;
  }
}

/**
 * Detect active development server port
 */
export async function detectActivePort(): Promise<{ port: number; url: string } | null> {
  try {
    // Check environment variables first
    const envPort = process.env.ACTIVE_DEV_PORT;
    const envUrl = process.env.ACTIVE_DEV_URL;
    
    if (envPort && envUrl) {
      const port = parseInt(envPort);
      if (!isNaN(port)) {
        // Validate the port is actually responding
        const isHealthy = await testPortHealth(port);
        if (isHealthy) {
          return { port, url: envUrl };
        }
      }
    }
    
    // Use the same working logic as smart-dev.sh
    try {
      const netstatOutput = await runCommand("netstat", ["-tlnp"]);
      
      // Find Next.js servers using the proven approach from smart-dev.sh
      const nextServerLines = netstatOutput.split('\n').filter(line => line.includes('next-server'));
      
      if (nextServerLines.length > 0) {
        // Extract ports from Next.js server lines
        for (const line of nextServerLines) {
          const portMatch = line.match(/:(\d+)/);
          if (portMatch) {
            const port = parseInt(portMatch[1]);
            if (port >= 3000 && port <= 4010) {
              const url = await constructUrl(port);
              const isHealthy = await testPortHealth(port);
              if (isHealthy) {
                // Set environment variables when successful detection occurs
                process.env.ACTIVE_DEV_PORT = port.toString();
                process.env.ACTIVE_DEV_URL = url;
                return { port, url };
              }
            }
          }
        }
      }
    } catch {
      // Netstat failed, try fallback with lsof
    }
    
    // Fallback: Try to find Next.js processes and match with lsof
    try {
      const psOutput = await runCommand("ps", ["aux"]);
      const nextjsProcesses = psOutput
        .split('\n')
        .filter(line => line.includes('next-server') || line.includes('next dev'))
        .filter(line => !line.includes('grep'));
      
      for (const processLine of nextjsProcesses) {
        const pid = processLine.split(/\s+/)[1];
        if (pid) {
          try {
            // Use lsof with IPv6 support
            const lsofOutput = await runCommand("lsof", ["-i", "-P", "-n", "-p", pid]);
            const portLines = lsofOutput
              .split('\n')
              .filter(line => line.includes('LISTEN'));
            
            for (const portLine of portLines) {
              const portMatch = portLine.match(/:(\d+)/);
              if (portMatch) {
                const port = parseInt(portMatch[1]);
                if (port >= 3000 && port <= 65535) {
                  const url = await constructUrl(port);
                  const isHealthy = await testPortHealth(port);
                  if (isHealthy) {
                    // Set environment variables when successful detection occurs
                    process.env.ACTIVE_DEV_PORT = port.toString();
                    process.env.ACTIVE_DEV_URL = url;
                    return { port, url };
                  }
                }
              }
            }
          } catch {
            // Continue to next process
          }
        }
      }
    } catch {
      // Process detection failed
    }
    
    // Last resort: Test common development ports directly
    const commonPorts = [3000, 3001, 3002, 4000, 4001];
    for (const port of commonPorts) {
      const isHealthy = await testPortHealth(port);
      if (isHealthy) {
        const url = await constructUrl(port);
        // Set environment variables when successful detection occurs
        process.env.ACTIVE_DEV_PORT = port.toString();
        process.env.ACTIVE_DEV_URL = url;
        return { port, url };
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Test if a port is responding with a Next.js server
 */
async function testPortHealth(port: number): Promise<boolean> {
  try {
    const url = await constructUrl(port);
    const response = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Construct URL based on environment
 */
export async function constructUrl(port: number): Promise<string> {
  const environment = await detectEnvironment();
  
  switch (environment) {
    case "cloud-workstation":
      // Google Cloud Workstations pattern
      if (process.env.CLOUDWORKSTATIONS_REGION) {
        return `https://${port}-tylergohr.cluster-${process.env.CLOUDWORKSTATIONS_REGION}.cloudworkstations.dev`;
      }
      break;
      
    case "codespaces":
      // GitHub Codespaces pattern
      if (process.env.CODESPACE_NAME) {
        return `https://${process.env.CODESPACE_NAME}-${port}.preview.app.github.dev`;
      }
      break;
      
    case "gitpod":
      // Gitpod pattern
      if (process.env.GITPOD_WORKSPACE_URL) {
        const workspaceUrl = process.env.GITPOD_WORKSPACE_URL.replace('https://', '');
        return `https://${port}-${workspaceUrl}`;
      }
      break;
      
    case "local":
    default:
      return `http://localhost:${port}`;
  }
  
  // Fallback to localhost
  return `http://localhost:${port}`;
}

/**
 * Utility function to run commands with timeout
 */
async function runCommand(
  command: string, 
  args: string[], 
  options: any = {}, 
  timeoutMs: number = 10000
): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      stdio: "pipe",
      ...options,
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