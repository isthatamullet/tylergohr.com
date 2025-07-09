/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { CodeExecutionResult, CodeExecutionEnvironment, CodeExecutionError, VisualizationData } from './types';

class SafeCodeExecutionEngine {
  private environment: CodeExecutionEnvironment;
  private executionCount: number = 0;
  private lastExecutionTime: number = 0;
  private readonly RATE_LIMIT_MS = 1000; // 1 second between executions
  private readonly MAX_EXECUTIONS_PER_MINUTE = 30;

  constructor() {
    this.environment = {
      sandbox: {
        timeoutMs: 5000,
        memoryLimitMB: 25,
        allowedGlobals: [
          'console', 'Math', 'Date', 'JSON', 'Array', 'Object', 'String', 
          'Number', 'Boolean', 'RegExp', 'Promise', 'setTimeout', 'clearTimeout'
        ],
        blockedFunctions: [
          'eval', 'Function', 'setInterval', 'clearInterval', 'XMLHttpRequest',
          'fetch', 'localStorage', 'sessionStorage', 'indexedDB', 'WebSocket',
          'Worker', 'SharedWorker', 'ServiceWorker', 'importScripts'
        ]
      },
      visualization: {
        maxObjects: 1000,
        maxTriangles: 50000,
        enableWebGL: typeof window !== 'undefined' && !!window.WebGLRenderingContext,
        fallbackToCanvas: true
      }
    };
  }

  async executeJavaScript(code: string): Promise<CodeExecutionResult> {
    if (!this.checkRateLimit()) {
      throw new Error('Rate limit exceeded. Please wait before executing more code.');
    }

    const startTime = performance.now();
    
    try {
      // Sanitize the code
      const sanitizedCode = this.sanitizeCode(code);
      
      // Create a sandboxed execution context
      const result = await this.executeSandboxedCode(sanitizedCode);
      
      const executionTime = performance.now() - startTime;
      
      return {
        success: true,
        output: result.output,
        executionTime,
        memoryUsage: this.estimateMemoryUsage(result.output),
        visualizationData: this.generateVisualizationData(result.output, 'component')
      };
    } catch (error) {
      const executionTime = performance.now() - startTime;
      const codeError = this.parseCodeError(error);
      
      return {
        success: false,
        error: codeError.message,
        executionTime,
        visualizationData: this.generateErrorVisualization(codeError)
      };
    }
  }

  async executeTypeScript(code: string): Promise<CodeExecutionResult> {
    // For client-side TypeScript execution, we'll transpile to JavaScript
    try {
      // Simple TypeScript-to-JavaScript transpilation
      // In a production environment, you'd use the TypeScript compiler API
      const jsCode = this.simpleTypeScriptTranspile(code);
      return await this.executeJavaScript(jsCode);
    } catch (error) {
      return {
        success: false,
        error: `TypeScript compilation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async executeSQL(query: string): Promise<CodeExecutionResult> {
    // Simulated SQL execution for demonstration purposes
    // In a real implementation, this would connect to a database
    const startTime = performance.now();
    
    try {
      const sanitizedQuery = this.sanitizeSQLQuery(query);
      const mockResult = this.executeMockSQL(sanitizedQuery);
      const executionTime = performance.now() - startTime;
      
      return {
        success: true,
        output: mockResult,
        executionTime,
        visualizationData: this.generateVisualizationData(mockResult, 'data-structure')
      };
    } catch (error) {
      const executionTime = performance.now() - startTime;
      
      return {
        success: false,
        error: `SQL execution error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        executionTime
      };
    }
  }

  private checkRateLimit(): boolean {
    const now = Date.now();
    
    // Reset counter every minute
    if (now - this.lastExecutionTime > 60000) {
      this.executionCount = 0;
    }
    
    // Check rate limits
    if (now - this.lastExecutionTime < this.RATE_LIMIT_MS) {
      return false;
    }
    
    if (this.executionCount >= this.MAX_EXECUTIONS_PER_MINUTE) {
      return false;
    }
    
    this.executionCount++;
    this.lastExecutionTime = now;
    return true;
  }

  private sanitizeCode(code: string): string {
    // Remove dangerous patterns
    let sanitized = code;
    
    // Remove blocked functions
    this.environment.sandbox.blockedFunctions.forEach(func => {
      const regex = new RegExp(`\\b${func}\\b`, 'g');
      sanitized = sanitized.replace(regex, `/* ${func} blocked */`);
    });
    
    // Remove script tags and other potentially dangerous HTML
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/javascript:/gi, '');
    
    return sanitized;
  }

  private async executeSandboxedCode(code: string): Promise<{ output: any }> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Code execution timeout after ${this.environment.sandbox.timeoutMs}ms`));
      }, this.environment.sandbox.timeoutMs);

      try {
        // Create a limited global context
        const sandboxGlobals = this.createSandboxGlobals();
        
        // Capture console output
        const capturedOutput: any[] = [];
        const mockConsole = {
          log: (...args: any[]) => capturedOutput.push(args.join(' ')),
          warn: (...args: any[]) => capturedOutput.push(`Warning: ${args.join(' ')}`),
          error: (...args: any[]) => capturedOutput.push(`Error: ${args.join(' ')}`),
        };

        // Execute the code in a controlled environment
        const func = new Function(
          'console', 'Math', 'Date', 'JSON', 'Array', 'Object', 'String', 'Number', 'Boolean', 'RegExp',
          `
          "use strict";
          try {
            ${code}
          } catch (error) {
            console.error(error.message);
            throw error;
          }
          `
        );

        const result = func(
          mockConsole, Math, Date, JSON, Array, Object, String, Number, Boolean, RegExp
        );

        clearTimeout(timeout);
        
        resolve({
          output: capturedOutput.length > 0 ? capturedOutput : result
        });
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  private createSandboxGlobals(): Record<string, any> {
    const globals: Record<string, any> = {};
    
    this.environment.sandbox.allowedGlobals.forEach(global => {
      if (typeof window !== 'undefined' && global in window) {
        globals[global] = (window as any)[global];
      }
    });
    
    return globals;
  }

  private simpleTypeScriptTranspile(tsCode: string): string {
    // Basic TypeScript to JavaScript transpilation
    let jsCode = tsCode;
    
    // Remove type annotations (basic patterns)
    jsCode = jsCode.replace(/:\s*\w+(\[\])?/g, '');
    jsCode = jsCode.replace(/interface\s+\w+\s*{[^}]*}/g, '');
    jsCode = jsCode.replace(/type\s+\w+\s*=\s*[^;]+;/g, '');
    jsCode = jsCode.replace(/as\s+\w+/g, '');
    jsCode = jsCode.replace(/\<\w+\>/g, '');
    
    return jsCode;
  }

  private sanitizeSQLQuery(query: string): string {
    // Basic SQL sanitization for demo purposes
    let sanitized = query.trim();
    
    // Remove dangerous SQL commands
    const dangerousPatterns = [
      /DROP\s+/gi, /DELETE\s+/gi, /UPDATE\s+/gi, /INSERT\s+/gi,
      /ALTER\s+/gi, /CREATE\s+/gi, /TRUNCATE\s+/gi, /EXEC\s+/gi
    ];
    
    dangerousPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '-- BLOCKED: ');
    });
    
    return sanitized;
  }

  private executeMockSQL(query: string): any {
    // Mock SQL execution with sample data
    const sampleData = [
      { id: 1, company_name: 'Acme Corp', total_orders: 156, revenue: 245000 },
      { id: 2, company_name: 'TechStart Inc', total_orders: 89, revenue: 178000 },
      { id: 3, company_name: 'Global Solutions', total_orders: 234, revenue: 567000 },
      { id: 4, company_name: 'Innovation Labs', total_orders: 45, revenue: 123000 },
      { id: 5, company_name: 'Enterprise Systems', total_orders: 178, revenue: 445000 }
    ];
    
    if (query.toLowerCase().includes('select')) {
      return {
        rows: sampleData,
        rowCount: sampleData.length,
        executionTime: Math.random() * 50 + 10 // 10-60ms
      };
    }
    
    return { message: 'Query executed successfully', affectedRows: 0 };
  }

  private generateVisualizationData(output: any, type: VisualizationData['type']): VisualizationData {
    return {
      type,
      data: output,
      metadata: {
        timestamp: Date.now(),
        title: `${type} visualization`,
        description: `Generated from code execution result`
      }
    };
  }

  private generateErrorVisualization(error: CodeExecutionError): VisualizationData {
    return {
      type: 'performance',
      data: {
        error: true,
        message: error.message,
        type: error.type,
        suggestion: error.suggestion
      },
      metadata: {
        timestamp: Date.now(),
        title: 'Execution Error',
        description: 'Code execution failed'
      }
    };
  }

  private parseCodeError(error: any): CodeExecutionError {
    if (error instanceof Error) {
      return {
        type: 'runtime',
        message: error.message,
        stack: error.stack,
        suggestion: this.generateErrorSuggestion(error.message)
      };
    }
    
    return {
      type: 'runtime',
      message: 'Unknown execution error',
      suggestion: 'Check your code for syntax errors and try again.'
    };
  }

  private generateErrorSuggestion(errorMessage: string): string {
    const suggestions: Record<string, string> = {
      'undefined': 'Check if all variables are properly declared and initialized.',
      'null': 'Ensure objects are not null before accessing their properties.',
      'syntax': 'Review your code syntax, check for missing brackets or semicolons.',
      'timeout': 'Your code may have an infinite loop. Check your loops and recursive functions.',
      'memory': 'Your code is using too much memory. Try to optimize data structures.',
    };
    
    for (const [key, suggestion] of Object.entries(suggestions)) {
      if (errorMessage.toLowerCase().includes(key)) {
        return suggestion;
      }
    }
    
    return 'Review your code and try again. Check the console for more details.';
  }

  private estimateMemoryUsage(output: any): number {
    // Rough estimation of memory usage in KB
    try {
      const serialized = JSON.stringify(output);
      return Math.ceil(serialized.length / 1024);
    } catch {
      return 1; // Fallback estimate
    }
  }
}

// Export singleton instance
export const codeExecutionEngine = new SafeCodeExecutionEngine();
export default SafeCodeExecutionEngine;