#!/usr/bin/env node

/**
 * Phase 3 Shared State Management System
 * 
 * Provides coordination between MCP and hooks systems through unified project state.
 * Prevents conflicts and enables intelligent cross-system coordination.
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

// =============================================================================
// SHARED PROJECT STATE INTERFACES
// =============================================================================

export interface SharedProjectState {
  // Core state
  activePort: number;
  developmentContext: 'main' | '2' | 'mixed';
  environmentType: 'local' | 'cloud-workstation' | 'codespaces' | 'gitpod';
  
  // System state
  qualityGateStatus: QualityStatus;
  recentChanges: FileChange[];
  performanceBaseline: PerformanceMetrics;
  activeIssues: GitHubIssue[];
  
  // Coordination state
  mcpServerStatus: SystemStatus;
  hooksSystemStatus: SystemStatus;
  lastSyncTimestamp: Date;
  
  // Analytics and metrics
  operationHistory: OperationRecord[];
  systemPreferences: SystemPreferences;
}

export interface QualityStatus {
  typescript: 'passing' | 'failing' | 'unknown';
  eslint: 'passing' | 'failing' | 'unknown';
  build: 'passing' | 'failing' | 'unknown';
  bundleSize: 'within-budget' | 'over-budget' | 'unknown';
  lastValidated: Date;
  errors?: string[];
}

export interface FileChange {
  path: string;
  type: 'added' | 'modified' | 'deleted';
  timestamp: Date;
  scope: 'component' | 'style' | 'test' | 'config' | 'docs';
  context: 'main' | '2' | 'general';
}

export interface PerformanceMetrics {
  bundleSize: number; // KB
  lcp: number; // Largest Contentful Paint (seconds)
  fid: number; // First Input Delay (ms)
  cls: number; // Cumulative Layout Shift
  lighthouse: number; // Lighthouse score
  lastMeasured: Date;
}

export interface GitHubIssue {
  number: number;
  title: string;
  labels: string[];
  priority: 'low' | 'medium' | 'high';
  context: 'main' | '2' | 'general';
  assignee?: string;
}

export interface SystemStatus {
  available: boolean;
  healthy: boolean;
  version: string;
  lastPing: Date;
  responseTime?: number;
  activeOperations: string[];
  errorCount: number;
  successRate: number; // Last 100 operations
}

export interface OperationRecord {
  operation: string;
  system: 'mcp' | 'hooks';
  timestamp: Date;
  success: boolean;
  duration: number; // milliseconds
  context: SharedProjectState['developmentContext'];
  environment: SharedProjectState['environmentType'];
  reason?: string; // For failures or selection reasoning
}

export interface SystemPreferences {
  defaultSystem: 'mcp' | 'hooks' | 'auto';
  operationOverrides: Record<string, 'mcp' | 'hooks'>;
  environmentPreferences: Record<string, 'mcp' | 'hooks'>;
  fallbackEnabled: boolean;
  analyticsEnabled: boolean;
}

export interface Conflict {
  type: 'resource' | 'operation' | 'state';
  severity: 'low' | 'medium' | 'high';
  description: string;
  affectedSystems: ('mcp' | 'hooks')[];
  resolution?: string;
  timestamp: Date;
}

// =============================================================================
// STATE MANAGER CLASS
// =============================================================================

export class StateManager {
  private projectRoot: string;
  private stateFilePath: string;
  private sharedState: SharedProjectState | null = null;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.stateFilePath = join(projectRoot, '.mcp-hooks-shared-state.json');
  }

  /**
   * Initialize shared state management
   */
  async initialize(): Promise<void> {
    console.log('🔗 Initializing Shared State Management...');
    
    try {
      await this.loadSharedState();
      await this.validateState();
      await this.startPeriodicSync();
      
      console.log('✅ Shared State Management initialized successfully');
    } catch (error) {
      console.warn('⚠️  Shared state initialization issue:', error);
      await this.createDefaultState();
    }
  }

  /**
   * Get current shared project state
   */
  async getSharedState(): Promise<SharedProjectState> {
    if (!this.sharedState) {
      await this.loadSharedState();
    }
    return this.sharedState!;
  }

  /**
   * Update shared project state
   */
  async updateSharedState(updates: Partial<SharedProjectState>): Promise<void> {
    const currentState = await this.getSharedState();
    
    this.sharedState = {
      ...currentState,
      ...updates,
      lastSyncTimestamp: new Date()
    };
    
    await this.saveSharedState();
  }

  /**
   * Sync hooks system state to MCP context
   */
  async syncHooksToMCP(): Promise<void> {
    console.log('🔄 Syncing hooks state to MCP...');
    
    try {
      const hooksState = await this.readHooksSessionState();
      await this.updateMCPContext(hooksState);
      
      console.log('✅ Hooks → MCP sync completed');
    } catch (error) {
      console.warn('⚠️  Hooks → MCP sync failed:', error);
    }
  }

  /**
   * Sync MCP insights to hooks system
   */
  async syncMCPToHooks(): Promise<void> {
    console.log('🔄 Syncing MCP insights to hooks...');
    
    try {
      const mcpInsights = await this.getMCPIntelligence();
      await this.updateHooksConfiguration(mcpInsights);
      
      console.log('✅ MCP → Hooks sync completed');
    } catch (error) {
      console.warn('⚠️  MCP → Hooks sync failed:', error);
    }
  }

  /**
   * Detect potential conflicts between systems
   */
  async detectConflicts(): Promise<Conflict[]> {
    console.log('🔍 Detecting system conflicts...');
    
    const conflicts: Conflict[] = [];
    const state = await this.getSharedState();
    
    // Port conflicts
    if (state.mcpServerStatus.available && state.hooksSystemStatus.available) {
      const portConflict = await this.checkPortConflicts();
      if (portConflict) {
        conflicts.push({
          type: 'resource',
          severity: 'high',
          description: `Port ${state.activePort} potentially shared between MCP and hooks`,
          affectedSystems: ['mcp', 'hooks'],
          resolution: 'Use port detection to assign unique ports',
          timestamp: new Date()
        });
      }
    }
    
    // Operation conflicts
    const activeOperations = [
      ...state.mcpServerStatus.activeOperations,
      ...state.hooksSystemStatus.activeOperations
    ];
    
    if (activeOperations.length > 1) {
      const duplicates = this.findDuplicateOperations(activeOperations);
      for (const op of duplicates) {
        conflicts.push({
          type: 'operation',
          severity: 'medium',
          description: `Operation "${op}" running on both systems`,
          affectedSystems: ['mcp', 'hooks'],
          resolution: 'Use hybrid orchestrator for operation routing',
          timestamp: new Date()
        });
      }
    }
    
    // State inconsistencies
    if (Math.abs(state.mcpServerStatus.lastPing.getTime() - state.hooksSystemStatus.lastPing.getTime()) > 60000) {
      conflicts.push({
        type: 'state',
        severity: 'low',
        description: 'System ping timestamps differ by more than 1 minute',
        affectedSystems: ['mcp', 'hooks'],
        resolution: 'Increase sync frequency or check system health',
        timestamp: new Date()
      });
    }
    
    console.log(`🔍 Found ${conflicts.length} potential conflicts`);
    return conflicts;
  }

  /**
   * Record operation for analytics and coordination
   */
  async recordOperation(operation: OperationRecord): Promise<void> {
    const state = await this.getSharedState();
    
    // Add to operation history
    state.operationHistory.push(operation);
    
    // Keep only last 1000 operations
    if (state.operationHistory.length > 1000) {
      state.operationHistory = state.operationHistory.slice(-1000);
    }
    
    // Update system success rates
    await this.updateSystemSuccessRates();
    
    await this.updateSharedState(state);
  }

  /**
   * Get analytics summary for migration effectiveness tracking
   */
  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    const state = await this.getSharedState();
    const recentOperations = state.operationHistory.filter(
      op => Date.now() - op.timestamp.getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
    );
    
    const mcpOperations = recentOperations.filter(op => op.system === 'mcp');
    const hooksOperations = recentOperations.filter(op => op.system === 'hooks');
    
    return {
      totalOperations: recentOperations.length,
      mcpOperations: mcpOperations.length,
      hooksOperations: hooksOperations.length,
      mcpSuccessRate: this.calculateSuccessRate(mcpOperations),
      hooksSuccessRate: this.calculateSuccessRate(hooksOperations),
      averageExecutionTime: {
        mcp: this.calculateAverageTime(mcpOperations),
        hooks: this.calculateAverageTime(hooksOperations)
      },
      mostCommonOperations: this.getMostCommonOperations(recentOperations),
      environmentDistribution: this.getEnvironmentDistribution(recentOperations),
      conflictsDetected: (await this.detectConflicts()).length,
      lastSyncAge: Date.now() - state.lastSyncTimestamp.getTime()
    };
  }

  // =============================================================================
  // PRIVATE IMPLEMENTATION METHODS
  // =============================================================================

  /**
   * Load shared state from file
   */
  private async loadSharedState(): Promise<void> {
    try {
      const stateData = await fs.readFile(this.stateFilePath, 'utf-8');
      const parsedState = JSON.parse(stateData);
      
      // Convert date strings back to Date objects
      this.sharedState = this.deserializeState(parsedState);
    } catch (error) {
      await this.createDefaultState();
    }
  }

  /**
   * Save shared state to file
   */
  private async saveSharedState(): Promise<void> {
    try {
      const serializedState = this.serializeState(this.sharedState!);
      await fs.writeFile(this.stateFilePath, JSON.stringify(serializedState, null, 2));
    } catch (error) {
      console.warn('⚠️  Failed to save shared state:', error);
    }
  }

  /**
   * Create default initial state
   */
  private async createDefaultState(): Promise<void> {
    const defaultState: SharedProjectState = {
      activePort: 3000,
      developmentContext: await this.detectDevelopmentContext(),
      environmentType: this.detectEnvironmentType(),
      qualityGateStatus: {
        typescript: 'unknown',
        eslint: 'unknown',
        build: 'unknown',
        bundleSize: 'unknown',
        lastValidated: new Date()
      },
      recentChanges: [],
      performanceBaseline: {
        bundleSize: 0,
        lcp: 0,
        fid: 0,
        cls: 0,
        lighthouse: 0,
        lastMeasured: new Date()
      },
      activeIssues: [],
      mcpServerStatus: {
        available: false,
        healthy: false,
        version: '1.3.0',
        lastPing: new Date(),
        activeOperations: [],
        errorCount: 0,
        successRate: 100
      },
      hooksSystemStatus: {
        available: false,
        healthy: false,
        version: '1.0.0',
        lastPing: new Date(),
        activeOperations: [],
        errorCount: 0,
        successRate: 100
      },
      lastSyncTimestamp: new Date(),
      operationHistory: [],
      systemPreferences: {
        defaultSystem: 'auto',
        operationOverrides: {},
        environmentPreferences: {},
        fallbackEnabled: true,
        analyticsEnabled: true
      }
    };
    
    this.sharedState = defaultState;
    await this.saveSharedState();
  }

  /**
   * Serialize state for JSON storage (convert Dates to strings)
   */
  private serializeState(state: SharedProjectState): any {
    return JSON.parse(JSON.stringify(state, (key, value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }));
  }

  /**
   * Deserialize state from JSON (convert date strings to Dates)
   */
  private deserializeState(data: any): SharedProjectState {
    const dateFields = [
      'lastSyncTimestamp',
      'qualityGateStatus.lastValidated',
      'performanceBaseline.lastMeasured',
      'mcpServerStatus.lastPing',
      'hooksSystemStatus.lastPing'
    ];
    
    const operationFields = ['recentChanges', 'operationHistory'];
    
    // Convert date strings to Date objects
    dateFields.forEach(field => {
      const value = this.getNestedValue(data, field);
      if (value && typeof value === 'string') {
        this.setNestedValue(data, field, new Date(value));
      }
    });
    
    // Convert operation timestamps
    operationFields.forEach(field => {
      const array = this.getNestedValue(data, field);
      if (Array.isArray(array)) {
        array.forEach(item => {
          if (item.timestamp && typeof item.timestamp === 'string') {
            item.timestamp = new Date(item.timestamp);
          }
        });
      }
    });
    
    return data as SharedProjectState;
  }

  /**
   * Detect current development context
   */
  private async detectDevelopmentContext(): Promise<'main' | '2' | 'mixed'> {
    try {
      const cwd = process.cwd();
      if (cwd.includes('/2')) return '2';
      
      // Check recent changes for context clues
      const gitOutput = await this.runCommand('git', ['diff', '--name-only', 'HEAD~5']);
      const recentFiles = gitOutput.split('\n').filter(f => f.trim());
      
      const hasMainChanges = recentFiles.some(f => !f.includes('/2'));
      const has2Changes = recentFiles.some(f => f.includes('/2'));
      
      if (hasMainChanges && has2Changes) return 'mixed';
      if (has2Changes) return '2';
      return 'main';
    } catch {
      return 'main';
    }
  }

  /**
   * Detect environment type
   */
  private detectEnvironmentType(): SharedProjectState['environmentType'] {
    if (process.env.CLOUDWORKSTATIONS_REGION) return 'cloud-workstation';
    if (process.env.CODESPACES) return 'codespaces';
    if (process.env.GITPOD_WORKSPACE_ID) return 'gitpod';
    return 'local';
  }

  /**
   * Start periodic sync between systems
   */
  private async startPeriodicSync(): Promise<void> {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    this.syncInterval = setInterval(async () => {
      try {
        await this.performPeriodicSync();
      } catch (error) {
        console.warn('⚠️  Periodic sync failed:', error);
      }
    }, 60000); // Every minute
  }

  /**
   * Perform periodic sync operations
   */
  private async performPeriodicSync(): Promise<void> {
    // Update system status
    await this.updateSystemStatuses();
    
    // Sync between systems if both available
    const state = await this.getSharedState();
    if (state.mcpServerStatus.available && state.hooksSystemStatus.available) {
      await this.syncHooksToMCP();
      await this.syncMCPToHooks();
    }
    
    // Clean old data
    await this.cleanupOldData();
  }

  /**
   * Validate current state consistency
   */
  private async validateState(): Promise<void> {
    const state = await this.getSharedState();
    
    // Validate that port is reasonable
    if (state.activePort < 1000 || state.activePort > 65535) {
      state.activePort = 3000;
    }
    
    // Validate timestamps
    if (!state.lastSyncTimestamp || isNaN(state.lastSyncTimestamp.getTime())) {
      state.lastSyncTimestamp = new Date();
    }
    
    await this.updateSharedState(state);
  }

  /**
   * Read hooks session state
   */
  private async readHooksSessionState(): Promise<any> {
    try {
      const sessionFiles = await this.runCommand('find', [
        '/tmp',
        '-name',
        'claude-hooks-session-*',
        '-type',
        'd'
      ]);
      
      if (sessionFiles.trim()) {
        // Found hooks session, read its state
        const sessionDir = sessionFiles.split('\n')[0];
        const stateFile = join(sessionDir, 'shared-state.json');
        
        try {
          const stateData = await fs.readFile(stateFile, 'utf-8');
          return JSON.parse(stateData);
        } catch {
          return {};
        }
      }
      
      return {};
    } catch {
      return {};
    }
  }

  /**
   * Update MCP context with hooks insights
   */
  private async updateMCPContext(hooksState: any): Promise<void> {
    // This would integrate with the MCP server's context management
    // For now, update our shared state
    if (hooksState.activePort) {
      await this.updateSharedState({ activePort: hooksState.activePort });
    }
  }

  /**
   * Get MCP intelligence insights
   */
  private async getMCPIntelligence(): Promise<any> {
    try {
      // Check if MCP server is running
      const mcpHealth = await this.checkMCPHealth();
      return {
        available: mcpHealth,
        intelligence: mcpHealth ? 'enhanced' : 'basic',
        capabilities: mcpHealth ? ['documentation', 'guidance', 'workflows'] : []
      };
    } catch {
      return { available: false };
    }
  }

  /**
   * Update hooks configuration with MCP insights
   */
  private async updateHooksConfiguration(mcpInsights: any): Promise<void> {
    // This would update hooks system configuration
    // For now, log the insights
    console.log('🧠 MCP insights:', JSON.stringify(mcpInsights, null, 2));
  }

  /**
   * Update system statuses
   */
  private async updateSystemStatuses(): Promise<void> {
    const mcpHealthy = await this.checkMCPHealth();
    const hooksHealthy = await this.checkHooksHealth();
    
    const state = await this.getSharedState();
    
    state.mcpServerStatus = {
      ...state.mcpServerStatus,
      available: mcpHealthy,
      healthy: mcpHealthy,
      lastPing: new Date()
    };
    
    state.hooksSystemStatus = {
      ...state.hooksSystemStatus,
      available: hooksHealthy,
      healthy: hooksHealthy,
      lastPing: new Date()
    };
    
    await this.updateSharedState(state);
  }

  /**
   * Check MCP server health
   */
  private async checkMCPHealth(): Promise<boolean> {
    try {
      const mcpPath = join(this.projectRoot, 'mcp-server', 'dist', 'index.js');
      await fs.access(mcpPath);
      
      // Try to run health check
      const result = await this.runCommand('node', [mcpPath, 'health'], { timeout: 5000 });
      return result.includes('health check passed');
    } catch {
      return false;
    }
  }

  /**
   * Check hooks system health
   */
  private async checkHooksHealth(): Promise<boolean> {
    try {
      const hooksPath = join(this.projectRoot, 'scripts', 'hooks', 'orchestrator', 'orchestrator.sh');
      await fs.access(hooksPath);
      
      // Try to run health check
      const result = await this.runCommand(hooksPath, ['health'], { timeout: 5000 });
      return result.includes('healthy') || result.includes('operational');
    } catch {
      return false;
    }
  }

  // Utility methods
  private async runCommand(command: string, args: string[], options: any = {}): Promise<string> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, { cwd: this.projectRoot, ...options });
      let output = '';
      
      child.stdout?.on('data', (data) => output += data.toString());
      child.stderr?.on('data', (data) => output += data.toString());
      
      child.on('close', (code) => {
        if (code === 0) resolve(output);
        else reject(new Error(`Command failed: ${output}`));
      });
      
      if (options.timeout) {
        setTimeout(() => {
          child.kill();
          reject(new Error('Command timed out'));
        }, options.timeout);
      }
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  private calculateSuccessRate(operations: OperationRecord[]): number {
    if (operations.length === 0) return 100;
    const successful = operations.filter(op => op.success).length;
    return Math.round((successful / operations.length) * 100);
  }

  private calculateAverageTime(operations: OperationRecord[]): number {
    if (operations.length === 0) return 0;
    const totalTime = operations.reduce((sum, op) => sum + op.duration, 0);
    return Math.round(totalTime / operations.length);
  }

  private getMostCommonOperations(operations: OperationRecord[]): Array<{operation: string, count: number}> {
    const counts = operations.reduce((acc, op) => {
      acc[op.operation] = (acc[op.operation] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts)
      .map(([operation, count]) => ({ operation, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private getEnvironmentDistribution(operations: OperationRecord[]): Record<string, number> {
    return operations.reduce((acc, op) => {
      acc[op.environment] = (acc[op.environment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private async updateSystemSuccessRates(): Promise<void> {
    const state = await this.getSharedState();
    const recent = state.operationHistory.slice(-100); // Last 100 operations
    
    const mcpOps = recent.filter(op => op.system === 'mcp');
    const hooksOps = recent.filter(op => op.system === 'hooks');
    
    state.mcpServerStatus.successRate = this.calculateSuccessRate(mcpOps);
    state.hooksSystemStatus.successRate = this.calculateSuccessRate(hooksOps);
    
    await this.updateSharedState(state);
  }

  private async checkPortConflicts(): Promise<boolean> {
    try {
      const result = await this.runCommand('lsof', ['-i', `:${(await this.getSharedState()).activePort}`]);
      const processes = result.split('\n').filter(line => line.trim()).length;
      return processes > 2; // More than expected processes using the port
    } catch {
      return false;
    }
  }

  private findDuplicateOperations(operations: string[]): string[] {
    const seen = new Set<string>();
    const duplicates = new Set<string>();
    
    operations.forEach(op => {
      if (seen.has(op)) {
        duplicates.add(op);
      } else {
        seen.add(op);
      }
    });
    
    return Array.from(duplicates);
  }

  private async cleanupOldData(): Promise<void> {
    const state = await this.getSharedState();
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    // Remove old operations
    state.operationHistory = state.operationHistory.filter(
      op => op.timestamp.getTime() > oneWeekAgo
    );
    
    // Remove old file changes
    state.recentChanges = state.recentChanges.filter(
      change => change.timestamp.getTime() > oneWeekAgo
    );
    
    await this.updateSharedState(state);
  }

  /**
   * Cleanup and shutdown
   */
  async shutdown(): Promise<void> {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    
    await this.saveSharedState();
    console.log('🔗 Shared State Management shutdown complete');
  }
}

// =============================================================================
// ANALYTICS SUMMARY INTERFACE
// =============================================================================

export interface AnalyticsSummary {
  totalOperations: number;
  mcpOperations: number;
  hooksOperations: number;
  mcpSuccessRate: number;
  hooksSuccessRate: number;
  averageExecutionTime: {
    mcp: number;
    hooks: number;
  };
  mostCommonOperations: Array<{operation: string, count: number}>;
  environmentDistribution: Record<string, number>;
  conflictsDetected: number;
  lastSyncAge: number; // milliseconds since last sync
}

// =============================================================================
// CLI INTERFACE (if run directly)
// =============================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  const stateManager = new StateManager();
  
  const command = process.argv[2];
  
  if (!command) {
    console.log('Usage: shared-state-manager.ts <command>');
    console.log('Commands:');
    console.log('  init       - Initialize shared state management');
    console.log('  status     - Show current state status');
    console.log('  sync       - Perform manual sync');
    console.log('  conflicts  - Check for conflicts');
    console.log('  analytics  - Show analytics summary');
    console.log('  cleanup    - Clean up old data');
    process.exit(1);
  }
  
  async function runCommand() {
    try {
      await stateManager.initialize();
      
      switch (command) {
        case 'init':
          console.log('✅ Shared state management initialized');
          break;
          
        case 'status':
          const state = await stateManager.getSharedState();
          console.log('📊 Current State:');
          console.log(`   Port: ${state.activePort}`);
          console.log(`   Context: ${state.developmentContext}`);
          console.log(`   Environment: ${state.environmentType}`);
          console.log(`   MCP: ${state.mcpServerStatus.available ? '✅' : '❌'}`);
          console.log(`   Hooks: ${state.hooksSystemStatus.available ? '✅' : '❌'}`);
          console.log(`   Last Sync: ${state.lastSyncTimestamp.toISOString()}`);
          break;
          
        case 'sync':
          await stateManager.syncHooksToMCP();
          await stateManager.syncMCPToHooks();
          console.log('✅ Manual sync completed');
          break;
          
        case 'conflicts':
          const conflicts = await stateManager.detectConflicts();
          console.log(`🔍 Found ${conflicts.length} conflicts:`);
          conflicts.forEach(conflict => {
            console.log(`   ${conflict.severity.toUpperCase()}: ${conflict.description}`);
          });
          break;
          
        case 'analytics':
          const analytics = await stateManager.getAnalyticsSummary();
          console.log('📊 Analytics Summary:');
          console.log(`   Total Operations: ${analytics.totalOperations}`);
          console.log(`   MCP: ${analytics.mcpOperations} (${analytics.mcpSuccessRate}% success)`);
          console.log(`   Hooks: ${analytics.hooksOperations} (${analytics.hooksSuccessRate}% success)`);
          console.log(`   Avg Time - MCP: ${analytics.averageExecutionTime.mcp}ms, Hooks: ${analytics.averageExecutionTime.hooks}ms`);
          break;
          
        case 'cleanup':
          await (stateManager as any).cleanupOldData();
          console.log('✅ Old data cleaned up');
          break;
          
        default:
          console.error(`❌ Unknown command: ${command}`);
          process.exit(1);
      }
      
      await stateManager.shutdown();
    } catch (error) {
      console.error('❌ Error:', error);
      process.exit(1);
    }
  }
  
  runCommand();
}