import { spawn } from "child_process";
import { promises as fs } from "fs";
import { join } from "path";
import { TestExecutionRequest, TestExecutionResult, MCPToolResponse } from "../types/schemas.js";
import { ProjectContext, TestStrategy } from "../types/project.js";
import { detectActivePort } from "../lib/context.js";

/**
 * Execute tests with intelligent strategy selection and timeout-resistant execution
 * Replaces timeout-prone "npm run test:e2e:smoke" and other test commands
 */
export async function executeTestMCP(
  request: TestExecutionRequest,
  context: ProjectContext
) {
  const { testType, skipVisual, fastMode, browser, timeout, strategy, component } = request;
  
  try {
    // Validate environment before testing
    const environmentReady = await validateTestEnvironment(context);
    if (!environmentReady.ready) {
      return {
        content: [
          {
            type: "text",
            text: `⚠️ Test environment not ready

❌ **Environment Issues**:
${environmentReady.issues.map(issue => `- ${issue}`).join('\n')}

🛠️ **Recommended Actions**:
1. Start development server: startDevServerMCP
2. Verify port detection: detectActivePortMCP  
3. Check project setup: validateQualityGatesMCP

💡 **Quick fix**: Use startDevServerMCP first to ensure server is running`,
          },
        ],
        isError: true,
      };
    }
    
    // Get test strategy based on type
    const testStrategy = await getTestStrategy(testType, context);
    if (!testStrategy) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Unknown test type: ${testType}

📋 **Available test types**:
- smoke: Essential functionality validation (<1min)
- dev: Component behavior testing (2-3min) 
- component: Component-specific testing
- visual: Visual regression testing (5-8min)
- navigation: Navigation behavior testing (3-4min)
- accessibility: WCAG compliance testing (2-3min)
- performance: Core Web Vitals testing (4-6min)
- mobile: Cross-device testing (3-5min)
- comprehensive: Full test suite (8-10min)

💡 **Recommended**: Use "smoke" for quick validation during development`,
          },
        ],
        isError: true,
      };
    }
    
    // Prepare test environment
    const testEnv = prepareTestEnvironment(testStrategy, skipVisual, fastMode, browser, context);
    
    // Execute tests with timeout resistance
    const testResult = await executeTestWithTimeout(testStrategy, testEnv, timeout, context);
    
    return formatTestResult(testResult, testStrategy, context);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      content: [
        {
          type: "text",
          text: `💥 Test execution error: ${errorMessage}

🔍 **Context**:
- Test type: ${testType}
- Browser: ${browser}
- Environment: ${context.environment}
- Project: ${context.developmentContext}

🛠️ **Troubleshooting**:
1. Verify development server is running
2. Check environment setup with detectActivePortMCP
3. Try with fastMode=true for quicker execution
4. Use smoke tests first to verify basic functionality`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Validate test environment is ready
 */
async function validateTestEnvironment(context: ProjectContext): Promise<{
  ready: boolean;
  issues: string[];
}> {
  const issues: string[] = [];
  
  // Check if development server is running
  const activeServer = await detectActivePort();
  if (!activeServer) {
    issues.push("No development server detected - use startDevServerMCP to start server");
  } else {
    // Verify server is responsive
    try {
      const response = await fetch(activeServer.url, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) {
        issues.push(`Development server not responding (${response.status}) - server may need restart`);
      }
    } catch {
      issues.push("Development server not accessible - check server health");
    }
  }
  
  // Check for required test files
  const playwrightConfigPath = join(context.projectRoot, "playwright.config.ts");
  try {
    await fs.access(playwrightConfigPath);
  } catch {
    issues.push("Playwright configuration not found - ensure Playwright is set up");
  }
  
  // Check for test directories
  const e2eTestPath = join(context.projectRoot, "e2e");
  try {
    await fs.access(e2eTestPath);
  } catch {
    issues.push("E2E test directory not found - check project structure");
  }
  
  return {
    ready: issues.length === 0,
    issues,
  };
}

/**
 * Get test strategy configuration
 */
async function getTestStrategy(testType: string, context: ProjectContext): Promise<TestStrategy | null> {
  try {
    // Try to load test strategies from the hooks configuration
    const strategiesPath = join(context.projectRoot, "scripts", "hooks", "config", "test-strategies.json");
    
    try {
      const strategiesContent = await fs.readFile(strategiesPath, "utf8");
      const strategiesConfig = JSON.parse(strategiesContent);
      
      const strategy = strategiesConfig.test_strategies[testType];
      if (strategy) {
        return {
          name: testType,
          command: strategy.command,
          description: strategy.description,
          estimatedTime: strategy.estimated_time,
          coverage: strategy.coverage,
          environment: strategy.environment || {},
        };
      }
    } catch {
      // Fall back to built-in strategies
    }
    
    // Built-in fallback strategies
    const builtinStrategies: Record<string, TestStrategy> = {
      smoke: {
        name: "smoke",
        command: "npm run test:e2e:smoke",
        description: "Essential functionality validation",
        estimatedTime: "< 1 minute",
        coverage: "Critical user flows and basic functionality",
        environment: { FAST_MODE: "true", SKIP_VISUAL: "true" },
      },
      dev: {
        name: "dev", 
        command: "npm run test:e2e:dev",
        description: "Component behavior and integration testing",
        estimatedTime: "2-3 minutes",
        coverage: "Component interactions, form validation, navigation",
        environment: { SKIP_VISUAL: "true" },
      },
      visual: {
        name: "visual",
        command: "npx playwright test e2e/quick-screenshots.spec.ts --project=chromium",
        description: "Quick screenshot generation for visual review",
        estimatedTime: "2-3 minutes",
        coverage: "Desktop and mobile screenshots of key pages",
        environment: {},
      },
      comprehensive: {
        name: "comprehensive",
        command: "npm run test:e2e:portfolio",
        description: "Full portfolio functionality validation",
        estimatedTime: "8-10 minutes", 
        coverage: "Complete test suite across all areas",
        environment: {},
      },
    };
    
    return builtinStrategies[testType] || null;
    
  } catch {
    return null;
  }
}

/**
 * Prepare test environment with proper variables
 */
function prepareTestEnvironment(
  strategy: TestStrategy,
  skipVisual: boolean,
  fastMode: boolean,
  browser: string,
  context: ProjectContext
): Record<string, string> {
  const env: Record<string, string> = {
    ...Object.fromEntries(Object.entries(process.env).filter(([_, v]) => v !== undefined)) as Record<string, string>,
    ...strategy.environment,
  };
  
  // Apply request-specific environment settings
  if (skipVisual) {
    env.SKIP_VISUAL = "true";
  }
  
  if (fastMode) {
    env.FAST_MODE = "true";
  }
  
  // Set browser preference
  if (browser !== "all") {
    env.PLAYWRIGHT_BROWSER = browser;
  }
  
  // Ensure port environment is set
  if (context.activePort) {
    env.ACTIVE_DEV_PORT = context.activePort.toString();
    env.ACTIVE_DEV_URL = context.activeUrl || `http://localhost:${context.activePort}`;
  }
  
  return env;
}

/**
 * Execute test with timeout resistance
 */
async function executeTestWithTimeout(
  strategy: TestStrategy,
  env: Record<string, string>,
  timeoutMs: number,
  context: ProjectContext
): Promise<TestExecutionResult> {
  const startTime = Date.now();
  
  return new Promise((resolve) => {
    // Parse command and arguments
    const [command, ...args] = strategy.command.split(' ');
    
    const testProcess = spawn(command, args, {
      cwd: context.projectRoot,
      env,
      stdio: "pipe",
    });
    
    let stdout = "";
    let stderr = "";
    let testsPassed = 0;
    let testsFailed = 0;
    let testsRun = 0;
    
    // Set up timeout
    const timeout = setTimeout(() => {
      testProcess.kill('SIGTERM');
      
      const duration = Date.now() - startTime;
      resolve({
        success: false,
        strategy: strategy.name,
        testsRun: 0,
        testsPassed: 0,
        testsFailed: 1,
        duration,
        output: `Test execution timed out after ${timeoutMs}ms`,
        errors: [`Timeout exceeded (${timeoutMs}ms) for test strategy: ${strategy.name}`],
      });
    }, timeoutMs);
    
    testProcess.stdout.on("data", (data) => {
      const output = data.toString();
      stdout += output;
      
      // Parse test results from output (Playwright format)
      const passedMatch = output.match(/(\\d+) passed/);
      if (passedMatch) {
        testsPassed += parseInt(passedMatch[1]);
      }
      
      const failedMatch = output.match(/(\\d+) failed/);
      if (failedMatch) {
        testsFailed += parseInt(failedMatch[1]);
      }
      
      const runMatch = output.match(/(\\d+) tests? ran/);
      if (runMatch) {
        testsRun = parseInt(runMatch[1]);
      }
    });
    
    testProcess.stderr.on("data", (data) => {
      stderr += data.toString();
    });
    
    testProcess.on("close", (code) => {
      clearTimeout(timeout);
      
      const duration = Date.now() - startTime;
      const success = code === 0;
      
      // If we couldn't parse test numbers, estimate from success/failure
      if (testsRun === 0) {
        testsRun = success ? 1 : 1;
        testsPassed = success ? 1 : 0;
        testsFailed = success ? 0 : 1;
      }
      
      resolve({
        success,
        strategy: strategy.name,
        testsRun,
        testsPassed,
        testsFailed,
        duration,
        output: stdout,
        errors: stderr ? [stderr] : undefined,
      });
    });
    
    testProcess.on("error", (error) => {
      clearTimeout(timeout);
      
      const duration = Date.now() - startTime;
      resolve({
        success: false,
        strategy: strategy.name,
        testsRun: 0,
        testsPassed: 0,
        testsFailed: 1,
        duration,
        output: "",
        errors: [error.message],
      });
    });
  });
}

/**
 * Format test result for Claude Code response
 */
function formatTestResult(
  result: TestExecutionResult,
  strategy: TestStrategy,
  context: ProjectContext
) {
  const { success, testsRun, testsPassed, testsFailed, duration, output, errors } = result;
  
  const durationSeconds = (duration / 1000).toFixed(1);
  const successRate = testsRun > 0 ? ((testsPassed / testsRun) * 100).toFixed(1) : "0";
  
  if (success) {
    return {
      content: [
        {
          type: "text",
          text: `✅ Tests completed successfully!

📊 **Test Results**:
- Strategy: ${strategy.name} (${strategy.description})
- Tests run: ${testsRun}
- Passed: ${testsPassed}
- Failed: ${testsFailed}
- Success rate: ${successRate}%
- Duration: ${durationSeconds}s
- Environment: ${context.environment}

⚡ **Performance**:
- Estimated time: ${strategy.estimatedTime}
- Actual time: ${durationSeconds}s
- Status: ${duration < 120000 ? "✅ Within timeout limits" : "⚠️ Longer than expected"}

📋 **Coverage**: ${strategy.coverage}

🎯 **Ready for next steps**:
- Quality validation: validateQualityGatesMCP
- Visual review: executeTestMCP with testType "visual"
- Deploy preparation: executeTestMCP with testType "comprehensive"

📝 **Test Output Summary**:
${output.slice(-500)}`,
        },
      ],
    };
  } else {
    return {
      content: [
        {
          type: "text",
          text: `❌ Tests failed - issues detected

📊 **Test Results**:
- Strategy: ${strategy.name} (${strategy.description})
- Tests run: ${testsRun}
- Passed: ${testsPassed}
- Failed: ${testsFailed}
- Success rate: ${successRate}%
- Duration: ${durationSeconds}s
- Environment: ${context.environment}

🔍 **Failure Analysis**:
${errors && errors.length > 0 ? errors.map(error => `- ${error}`).join('\n') : '- Check test output below for details'}

🛠️ **Recommended Actions**:
1. Review test output for specific failures
2. Check development server health: startDevServerMCP with action "status"
3. Validate environment: detectActivePortMCP
4. Try smoke tests first: executeTestMCP with testType "smoke"

📝 **Test Output**:
${output.slice(-800)}

💡 **Quick fixes**:
- Server issues: Restart with startDevServerMCP action "restart"
- Environment issues: Use detectActivePortMCP to check setup
- Timeout issues: Try with fastMode=true`,
        },
      ],
      isError: true,
    };
  }
}