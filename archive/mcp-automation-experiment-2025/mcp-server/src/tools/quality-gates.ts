import { spawn } from "child_process";
import { promises as fs } from "fs";
import { join } from "path";
import { QualityGatesRequest, QualityGatesResult, MCPToolResponse } from "../types/schemas.js";
import { ProjectContext, QualityStatus } from "../types/project.js";

/**
 * Validate code quality with comprehensive quality gates
 * Replaces manual "npm run validate" and individual quality checks
 */
export async function validateQualityGatesMCP(
  request: QualityGatesRequest,
  context: ProjectContext
) {
  const { checks, fix, strict } = request;
  
  try {
    const startTime = Date.now();
    
    // Determine which checks to run
    const checksToRun = checks.length > 0 ? checks : ["typescript", "eslint", "build", "bundle"];
    
    // Run quality checks
    const results = await runQualityChecks(checksToRun, fix, context);
    
    const duration = Date.now() - startTime;
    const overallSuccess = results.every(r => r.success);
    
    return formatQualityGatesResult(results, duration, overallSuccess, strict, context);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      content: [
        {
          type: "text",
          text: `💥 Quality gates validation error: ${errorMessage}\n\n🔍 **Context**:\n- Checks requested: ${checks.join(', ') || 'all'}\n- Fix mode: ${fix}\n- Environment: ${context.environment}\n\n🛠️ **Troubleshooting**:\n1. Verify npm scripts exist in package.json\n2. Check project dependencies are installed\n3. Ensure TypeScript and ESLint configurations are valid\n4. Try individual checks: validateQualityGatesMCP with specific checks`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Run individual quality checks
 */
async function runQualityChecks(
  checks: string[],
  fix: boolean,
  context: ProjectContext
): Promise<QualityCheckResult[]> {
  const results: QualityCheckResult[] = [];
  
  for (const check of checks) {
    const result = await runSingleQualityCheck(check, fix, context);
    results.push(result);
    
    // If a critical check fails in strict mode, stop early
    if (!result.success && result.critical) {
      break;
    }
  }
  
  return results;
}

/**
 * Run a single quality check
 */
async function runSingleQualityCheck(
  check: string,
  fix: boolean,
  context: ProjectContext
): Promise<QualityCheckResult> {
  const startTime = Date.now();
  
  try {
    switch (check) {
      case "typescript":
        return await runTypeScriptCheck(fix, context, startTime);
        
      case "eslint":
        return await runESLintCheck(fix, context, startTime);
        
      case "build":
        return await runBuildCheck(context, startTime);
        
      case "bundle":
        return await runBundleCheck(context, startTime);
        
      default:
        return {
          check,
          success: false,
          duration: Date.now() - startTime,
          output: `Unknown check type: ${check}`,
          errors: [`Unknown check: ${check}`],
          critical: false,
        };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      check,
      success: false,
      duration: Date.now() - startTime,
      output: "",
      errors: [errorMessage],
      critical: check === "typescript" || check === "build",
    };
  }
}

/**
 * Run TypeScript type checking
 */
async function runTypeScriptCheck(
  fix: boolean,
  context: ProjectContext,
  startTime: number
): Promise<QualityCheckResult> {
  // TypeScript doesn't have an auto-fix mode, so we ignore the fix parameter
  const result = await runCommand("npx", ["tsc", "--noEmit"], context.projectRoot, 30000);
  
  const success = result.code === 0;
  const duration = Date.now() - startTime;
  
  return {
    check: "typescript",
    success,
    duration,
    output: result.stdout + result.stderr,
    errors: success ? undefined : parseTypeScriptErrors(result.stderr),
    critical: true,
    fixAvailable: false,
  };
}

/**
 * Run ESLint code quality check
 */
async function runESLintCheck(
  fix: boolean,
  context: ProjectContext,
  startTime: number
): Promise<QualityCheckResult> {
  const args = ["eslint", "."];
  if (fix) {
    args.push("--fix");
  }
  
  const result = await runCommand("npx", args, context.projectRoot, 45000);
  
  const success = result.code === 0;
  const duration = Date.now() - startTime;
  
  return {
    check: "eslint",
    success,
    duration,
    output: result.stdout + result.stderr,
    errors: success ? undefined : parseESLintErrors(result.stdout),
    critical: false,
    fixAvailable: true,
    fixApplied: fix,
  };
}

/**
 * Run production build check
 */
async function runBuildCheck(
  context: ProjectContext,
  startTime: number
): Promise<QualityCheckResult> {
  const result = await runCommand("npm", ["run", "build"], context.projectRoot, 120000);
  
  const success = result.code === 0;
  const duration = Date.now() - startTime;
  
  // Check for build artifacts
  let buildArtifacts: string[] = [];
  if (success) {
    try {
      const nextBuildPath = join(context.projectRoot, ".next");
      const buildExists = await fs.access(nextBuildPath).then(() => true).catch(() => false);
      if (buildExists) {
        buildArtifacts.push(".next directory created");
      }
    } catch {
      // Continue without artifact check
    }
  }
  
  return {
    check: "build",
    success,
    duration,
    output: result.stdout + result.stderr,
    errors: success ? undefined : parseBuildErrors(result.stderr),
    critical: true,
    fixAvailable: false,
    metadata: {
      artifacts: buildArtifacts,
    },
  };
}

/**
 * Run bundle size validation
 */
async function runBundleCheck(
  context: ProjectContext,
  startTime: number
): Promise<QualityCheckResult> {
  try {
    // First ensure we have a build
    const nextBuildPath = join(context.projectRoot, ".next");
    const buildExists = await fs.access(nextBuildPath).then(() => true).catch(() => false);
    
    if (!buildExists) {
      return {
        check: "bundle",
        success: false,
        duration: Date.now() - startTime,
        output: "No build found - run 'npm run build' first",
        errors: ["Build directory .next not found"],
        critical: false,
        fixAvailable: false,
      };
    }
    
    // Check bundle size using npm script if available
    const packageJsonPath = join(context.projectRoot, "package.json");
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));
    
    if (packageJson.scripts && packageJson.scripts["bundle-check"]) {
      const result = await runCommand("npm", ["run", "bundle-check"], context.projectRoot, 30000);
      
      const success = result.code === 0;
      const duration = Date.now() - startTime;
      
      return {
        check: "bundle",
        success,
        duration,
        output: result.stdout + result.stderr,
        errors: success ? undefined : [result.stderr || "Bundle size check failed"],
        critical: false,
        fixAvailable: false,
      };
    }
    
    // Manual bundle size check
    const bundleInfo = await calculateBundleSize(nextBuildPath);
    const bundleSizeMB = bundleInfo.totalSize / (1024 * 1024);
    const success = bundleSizeMB < 6; // 6MB budget from project standards
    
    return {
      check: "bundle",
      success,
      duration: Date.now() - startTime,
      output: `Bundle size: ${bundleSizeMB.toFixed(2)}MB (Budget: 6MB)`,
      errors: success ? undefined : [`Bundle size ${bundleSizeMB.toFixed(2)}MB exceeds 6MB budget`],
      critical: false,
      fixAvailable: false,
      metadata: {
        bundleSize: bundleSizeMB,
        budget: 6,
        files: bundleInfo.fileCount,
      },
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      check: "bundle",
      success: false,
      duration: Date.now() - startTime,
      output: "",
      errors: [errorMessage],
      critical: false,
      fixAvailable: false,
    };
  }
}

/**
 * Calculate bundle size from .next directory
 */
async function calculateBundleSize(buildPath: string): Promise<{ totalSize: number; fileCount: number }> {
  const result = await runCommand("du", ["-sb", buildPath], process.cwd(), 10000);
  const sizeMatch = result.stdout.match(/^(\d+)/);
  
  if (sizeMatch) {
    const totalSize = parseInt(sizeMatch[1]);
    
    // Count files
    const fileCountResult = await runCommand("find", [buildPath, "-type", "f"], process.cwd(), 10000);
    const fileCount = fileCountResult.stdout.split('\n').filter(Boolean).length;
    
    return { totalSize, fileCount };
  }
  
  throw new Error("Could not calculate bundle size");
}

/**
 * Parse TypeScript errors from output
 */
function parseTypeScriptErrors(stderr: string): string[] {
  const lines = stderr.split('\n').filter(Boolean);
  const errors: string[] = [];
  
  for (const line of lines) {
    if (line.includes('error TS')) {
      errors.push(line.trim());
    }
  }
  
  return errors.length > 0 ? errors : ['TypeScript compilation failed'];
}

/**
 * Parse ESLint errors from output
 */
function parseESLintErrors(stdout: string): string[] {
  const lines = stdout.split('\n').filter(Boolean);
  const errors: string[] = [];
  
  for (const line of lines) {
    if (line.includes('error') || line.includes('problems')) {
      errors.push(line.trim());
    }
  }
  
  return errors.length > 0 ? errors : ['ESLint validation failed'];
}

/**
 * Parse build errors from output
 */
function parseBuildErrors(stderr: string): string[] {
  const lines = stderr.split('\n').filter(Boolean);
  const errors: string[] = [];
  
  for (const line of lines) {
    if (line.includes('error') || line.includes('Error') || line.includes('Failed')) {
      errors.push(line.trim());
    }
  }
  
  return errors.length > 0 ? errors : ['Build failed'];
}

/**
 * Format quality gates results for Claude Code response
 */
function formatQualityGatesResult(
  results: QualityCheckResult[],
  totalDuration: number,
  overallSuccess: boolean,
  strict: boolean,
  context: ProjectContext
): MCPToolResponse {
  const totalSeconds = (totalDuration / 1000).toFixed(1);
  const passedChecks = results.filter(r => r.success);
  const failedChecks = results.filter(r => !r.success);
  
  if (overallSuccess) {
    return {
      content: [
        {
          type: "text",
          text: `✅ Quality gates validation successful!\n\n📊 **Quality Check Results**:\n${results.map(r => formatCheckResult(r)).join('\n')}\n\n⚡ **Performance**:\n- Total duration: ${totalSeconds}s\n- Checks passed: ${passedChecks.length}/${results.length}\n- Environment: ${context.environment}\n\n🎯 **All quality standards met!**\n\n💡 **Next steps**:\n- Ready for testing: executeTestMCP with testType "smoke"\n- Deploy preparation: executeTestMCP with testType "comprehensive"\n- Commit changes: All quality gates passed\n\n📋 **Quality Standards**:\n- ✅ TypeScript: Type safety validated\n- ✅ ESLint: Code quality standards met\n- ✅ Build: Production build successful\n- ✅ Bundle: Size within 6MB budget`,
        },
      ],
    };
  } else {
    const criticalFailures = failedChecks.filter(r => r.critical);
    const nonCriticalFailures = failedChecks.filter(r => !r.critical);
    
    return {
      content: [
        {
          type: "text",
          text: `❌ Quality gates validation failed\n\n📊 **Quality Check Results**:\n${results.map(r => formatCheckResult(r)).join('\n')}\n\n⚡ **Performance**:\n- Total duration: ${totalSeconds}s\n- Checks passed: ${passedChecks.length}/${results.length}\n- Environment: ${context.environment}\n\n${criticalFailures.length > 0 ? `🚨 **Critical Issues** (${criticalFailures.length}):\n${criticalFailures.map(f => `- ${f.check}: ${f.errors?.[0] || 'Failed'}`).join('\n')}\n\n` : ''}${nonCriticalFailures.length > 0 ? `⚠️ **Non-Critical Issues** (${nonCriticalFailures.length}):\n${nonCriticalFailures.map(f => `- ${f.check}: ${f.errors?.[0] || 'Failed'}`).join('\n')}\n\n` : ''}🛠️ **Recommended Actions**:\n1. Fix critical issues first: ${criticalFailures.map(f => f.check).join(', ') || 'None'}\n2. Run with fix mode: validateQualityGatesMCP with fix=true\n3. Check individual issues in detail below\n\n💡 **Quick fixes**:\n- TypeScript errors: Check type definitions and imports\n- ESLint issues: Use validateQualityGatesMCP with fix=true\n- Build failures: Check for missing dependencies or syntax errors\n- Bundle size: Optimize imports and remove unused dependencies\n\n📝 **Detailed Output**:\n${failedChecks.map(f => `**${f.check}**:\n${f.output.slice(-400)}`).join('\n\n')}`,
        },
      ],
      isError: strict || criticalFailures.length > 0,
    };
  }
}

/**
 * Format individual check result
 */
function formatCheckResult(result: QualityCheckResult): string {
  const status = result.success ? "✅" : "❌";
  const duration = (result.duration / 1000).toFixed(1);
  const critical = result.critical ? " (critical)" : "";
  const fixInfo = result.fixApplied ? " (auto-fixed)" : result.fixAvailable ? " (fix available)" : "";
  
  return `- ${status} ${result.check}${critical}: ${duration}s${fixInfo}`;
}

/**
 * Quality check result interface
 */
interface QualityCheckResult {
  check: string;
  success: boolean;
  duration: number;
  output: string;
  errors?: string[];
  critical: boolean;
  fixAvailable?: boolean;
  fixApplied?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Utility function to run commands with timeout
 */
async function runCommand(
  command: string,
  args: string[],
  cwd: string,
  timeoutMs: number
): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "pipe",
    });
    
    let stdout = "";
    let stderr = "";
    
    const timeout = setTimeout(() => {
      child.kill();
      resolve({
        code: 1,
        stdout,
        stderr: stderr + `\nCommand timed out after ${timeoutMs}ms`,
      });
    }, timeoutMs);
    
    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });
    
    child.on("close", (code) => {
      clearTimeout(timeout);
      resolve({
        code: code || 0,
        stdout,
        stderr,
      });
    });
  });
}