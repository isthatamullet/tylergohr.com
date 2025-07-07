#!/usr/bin/env node

/**
 * Phase 3 Hybrid Orchestrator CLI Wrapper
 * 
 * Simple CLI interface for bash scripts to use the Hybrid Orchestrator
 * without requiring TypeScript compilation at runtime.
 */

const { spawn } = require('child_process');
const { promises: fs } = require('fs');
const { join } = require('path');

// =============================================================================
// SIMPLIFIED HYBRID ORCHESTRATOR (JavaScript Version)
// =============================================================================

class HybridOrchestratorCLI {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.operationMappings = this.getDefaultOperationMappings();
  }

  /**
   * Get default operation mappings based on Phase 3 strategy
   */
  getDefaultOperationMappings() {
    return {
      // MCP excels at timeout-prone operations
      'dev-server': 'mcp',           // Reliable in cloud environments
      'test-execution': 'mcp',       // Timeout-resistant
      'port-detection': 'mcp',       // Native TypeScript logic
      'quality-gates': 'mcp',        // Direct tool access
      'documentation-query': 'mcp',  // Enhanced intelligence
      
      // Hooks excel at proven stable operations
      'file-protection': 'hooks',    // Mature file protection logic
      'visual-workflow': 'hooks',    // Complex Puppeteer coordination
      'performance-monitoring': 'hooks', // Established monitoring patterns
      'screenshot-generation': 'hooks',  // Specialized Puppeteer workflows
      'background-processing': 'hooks'   // Local automation processes
    };
  }

  /**
   * Main selection logic (simplified for CLI use)
   */
  async selectOptimalTool(operation, options = {}) {
    console.log(`🎯 Hybrid Orchestrator: Analyzing operation "${operation}"`);

    // Check for user preference overrides
    const userOverride = this.checkUserPreferences(operation, options);
    if (userOverride) {
      return userOverride;
    }

    // Get environment context
    const environment = this.detectEnvironment();
    const isCloudEnvironment = environment !== 'local';

    // Apply selection logic
    const defaultTool = this.operationMappings[operation] || 'auto';
    let selectedTool = defaultTool;
    let confidence = 75;
    let reasoning = `Default mapping for ${operation}`;

    // Environment-based adjustments
    if (isCloudEnvironment && ['dev-server', 'test-execution', 'quality-gates'].includes(operation)) {
      selectedTool = 'mcp';
      confidence = 90;
      reasoning = `Cloud environment detected - MCP provides better timeout resistance for ${operation}`;
    }

    // Timeout risk assessment
    const timeoutProneOperations = ['dev-server', 'test-execution', 'quality-gates'];
    if (timeoutProneOperations.includes(operation)) {
      selectedTool = 'mcp';
      confidence = Math.max(confidence, 85);
      reasoning += ' - Operation has timeout risk, MCP provides reliability';
    }

    // Check tool availability
    const availability = await this.checkToolAvailability(selectedTool);
    if (!availability.available && availability.fallbackAvailable) {
      const fallbackTool = selectedTool === 'mcp' ? 'hooks' : 'mcp';
      return {
        selectedTool: fallbackTool,
        confidence: confidence - 20,
        reasoning: `${reasoning} - fallback to ${fallbackTool} due to ${selectedTool} unavailability`,
        fallbackUsed: true,
        environment,
        estimatedTime: this.estimateExecutionTime(operation, fallbackTool)
      };
    }

    const result = {
      selectedTool,
      confidence,
      reasoning,
      fallbackUsed: false,
      environment,
      estimatedTime: this.estimateExecutionTime(operation, selectedTool)
    };

    console.log(`🎯 Selected: ${result.selectedTool} (confidence: ${result.confidence}%)`);
    console.log(`🧠 Reasoning: ${result.reasoning}`);

    return result;
  }

  /**
   * Check for user preference overrides
   */
  checkUserPreferences(operation, options) {
    // Check explicit user preference
    if (options.userPreference && options.userPreference !== 'auto') {
      return {
        selectedTool: options.userPreference,
        confidence: 100,
        reasoning: `User explicitly requested ${options.userPreference} tool`,
        fallbackUsed: false,
        environment: this.detectEnvironment(),
        estimatedTime: this.estimateExecutionTime(operation, options.userPreference)
      };
    }

    // Check environment variables
    const useMcp = process.env.USE_MCP;
    const forceHooks = process.env.FORCE_HOOKS;
    
    if (useMcp === 'true') {
      return {
        selectedTool: 'mcp',
        confidence: 95,
        reasoning: 'USE_MCP environment variable set to true',
        fallbackUsed: false,
        environment: this.detectEnvironment(),
        estimatedTime: this.estimateExecutionTime(operation, 'mcp')
      };
    }
    
    if (forceHooks === 'true') {
      return {
        selectedTool: 'hooks',
        confidence: 95,
        reasoning: 'FORCE_HOOKS environment variable set to true',
        fallbackUsed: false,
        environment: this.detectEnvironment(),
        estimatedTime: this.estimateExecutionTime(operation, 'hooks')
      };
    }

    return null;
  }

  /**
   * Detect current environment
   */
  detectEnvironment() {
    if (process.env.CLOUDWORKSTATIONS_REGION) return 'cloud-workstation';
    if (process.env.CODESPACES) return 'codespaces';
    if (process.env.GITPOD_WORKSPACE_ID) return 'gitpod';
    return 'local';
  }

  /**
   * Check tool availability
   */
  async checkToolAvailability(tool) {
    if (tool === 'mcp') {
      try {
        const mcpServerPath = join(this.projectRoot, 'mcp-server', 'dist', 'index.js');
        await fs.access(mcpServerPath);
        return { available: true, fallbackAvailable: true };
      } catch {
        return { 
          available: false, 
          fallbackAvailable: true, 
          reason: 'MCP server not built or accessible' 
        };
      }
    } else {
      try {
        const hooksPath = join(this.projectRoot, 'scripts', 'hooks', 'orchestrator', 'orchestrator.sh');
        await fs.access(hooksPath);
        return { available: true, fallbackAvailable: true };
      } catch {
        return { 
          available: false, 
          fallbackAvailable: false, 
          reason: 'Hooks system not available' 
        };
      }
    }
  }

  /**
   * Estimate execution time
   */
  estimateExecutionTime(operation, tool) {
    const baseTimes = {
      'dev-server': { mcp: 45, hooks: 60 },
      'test-execution': { mcp: 60, hooks: 90 },
      'quality-gates': { mcp: 30, hooks: 45 },
      'port-detection': { mcp: 5, hooks: 15 },
      'visual-workflow': { mcp: 120, hooks: 90 },
      'screenshot-generation': { mcp: 90, hooks: 60 }
    };
    
    return baseTimes[operation]?.[tool] || (tool === 'mcp' ? 30 : 45);
  }

  /**
   * Format output for shell consumption
   */
  formatForShell(result) {
    const output = {
      SELECTED_TOOL: result.selectedTool,
      CONFIDENCE: result.confidence,
      REASONING: result.reasoning,
      FALLBACK_USED: result.fallbackUsed ? 'true' : 'false',
      ENVIRONMENT: result.environment,
      ESTIMATED_TIME: result.estimatedTime
    };

    // Output in shell variable format
    Object.entries(output).forEach(([key, value]) => {
      console.log(`export ${key}="${value}"`);
    });

    return output;
  }
}

// =============================================================================
// CLI INTERFACE
// =============================================================================

async function main() {
  const args = process.argv.slice(2);
  const operation = args[0];
  const userPreference = args[1];
  const format = args[2] || 'json';

  if (!operation) {
    console.error('Usage: hybrid-orchestrator-cli.js <operation> [userPreference] [format]');
    console.error('');
    console.error('Operations:');
    console.error('  dev-server, test-execution, quality-gates, port-detection,');
    console.error('  visual-workflow, screenshot-generation, performance-monitoring');
    console.error('');
    console.error('User Preference: mcp, hooks, auto (default: auto)');
    console.error('Format: json, shell (default: json)');
    console.error('');
    console.error('Examples:');
    console.error('  ./hybrid-orchestrator-cli.js dev-server');
    console.error('  ./hybrid-orchestrator-cli.js test-execution mcp');
    console.error('  ./hybrid-orchestrator-cli.js quality-gates auto shell');
    process.exit(1);
  }

  try {
    const orchestrator = new HybridOrchestratorCLI();
    const options = {
      userPreference: userPreference === 'auto' ? undefined : userPreference
    };

    const result = await orchestrator.selectOptimalTool(operation, options);

    if (format === 'shell') {
      // Output shell variables for script consumption
      orchestrator.formatForShell(result);
    } else {
      // Output JSON for detailed consumption
      console.log(JSON.stringify(result, null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = HybridOrchestratorCLI;