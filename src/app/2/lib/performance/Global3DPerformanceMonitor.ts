/**
 * Global3DPerformanceMonitor - Phase 3.3 Week 3 Day 3
 * 
 * Purpose: Master performance coordinator for all 3D elements in the portfolio.
 * Monitors FPS, memory usage, GPU utilization, and automatically adjusts quality
 * settings to maintain optimal performance across all concurrent 3D scenes.
 * 
 * Features:
 * - Real-time performance monitoring across all active 3D components
 * - Automatic quality scaling based on device performance
 * - Resource management and memory optimization
 * - Performance alerts and user notifications
 * - Integration with existing Phase 3 components
 */

'use client';

import { EventEmitter } from 'events';

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  gpuUtilization: number;
  renderTime: number;
  timestamp: number;
}

/**
 * Quality settings configuration
 */
export interface QualitySettings {
  deviceTier: 'high' | 'medium' | 'low';
  maxConcurrentScenes: number;
  particleDensity: number;
  shadowQuality: 'high' | 'medium' | 'low' | 'disabled';
  postProcessing: boolean;
  antiAliasing: boolean;
  textureQuality: 'high' | 'medium' | 'low';
  animationQuality: 'high' | 'medium' | 'low';
}

/**
 * Active 3D scene tracking
 */
export interface Scene3D {
  id: string;
  type: 'skill-card' | 'timeline' | 'technology-viz' | 'project-preview' | 'architecture' | 'scroll-effects';
  priority: 'high' | 'medium' | 'low';
  complexity: number; // 1-10 scale
  isActive: boolean;
  isVisible: boolean;
  lastRenderTime: number;
  memoryUsage: number;
  element?: HTMLElement;
}

/**
 * Performance alert types
 */
export interface PerformanceAlert {
  type: 'fps-drop' | 'memory-high' | 'gpu-overload' | 'render-slow' | 'quality-reduced';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  sceneId?: string;
  timestamp: number;
  action?: 'reduce-quality' | 'disable-scene' | 'cleanup-memory' | 'notify-user';
}

/**
 * Device capability assessment
 */
export interface DeviceCapability {
  tier: 'high' | 'medium' | 'low';
  webglSupport: boolean;
  webgl2Support: boolean;
  maxTextureSize: number;
  maxRenderBufferSize: number;
  estimatedGPUMemory: number;
  isMobile: boolean;
  isTablet: boolean;
  cpuCores: number;
  estimatedPerformance: number; // 1-10 scale
}

/**
 * Resource pool for optimization
 */
export interface ResourcePool {
  geometries: Map<string, unknown>;
  materials: Map<string, unknown>;
  textures: Map<string, unknown>;
  shaders: Map<string, unknown>;
  lastCleanup: number;
  memoryUsage: number;
}

/**
 * Global 3D Performance Monitor class
 */
export class Global3DPerformanceMonitor extends EventEmitter {
  private static instance: Global3DPerformanceMonitor | null = null;
  
  // Core monitoring state
  private isMonitoring: boolean = false;
  private frameCount: number = 0;
  private lastFrameTime: number = 0;
  private performanceHistory: PerformanceMetrics[] = [];
  private maxHistoryLength: number = 100;
  
  // Scene management
  private activeScenes: Map<string, Scene3D> = new Map();
  private sceneRenderTimes: Map<string, number[]> = new Map();
  
  // Quality and optimization
  private currentQuality: QualitySettings;
  private deviceCapability: DeviceCapability;
  private resourcePool: ResourcePool;
  
  // Performance thresholds
  private readonly PERFORMANCE_THRESHOLDS = {
    MIN_FPS: 30,
    TARGET_FPS: 60,
    MAX_MEMORY_MB: 200,
    MAX_RENDER_TIME_MS: 16.67, // 60fps = 16.67ms per frame
    QUALITY_ADJUSTMENT_INTERVAL: 5000, // 5 seconds
    CLEANUP_INTERVAL: 30000, // 30 seconds
  };
  
  // Monitoring intervals
  private performanceInterval: NodeJS.Timeout | null = null;
  private cleanupInterval: NodeJS.Timeout | null = null;
  private qualityCheckInterval: NodeJS.Timeout | null = null;

  private constructor() {
    super();
    this.deviceCapability = this.assessDeviceCapability();
    this.currentQuality = this.getOptimalQualitySettings();
    this.resourcePool = {
      geometries: new Map(),
      materials: new Map(),
      textures: new Map(),
      shaders: new Map(),
      lastCleanup: Date.now(),
      memoryUsage: 0
    };
    
    this.setupEventListeners();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): Global3DPerformanceMonitor {
    if (!Global3DPerformanceMonitor.instance) {
      Global3DPerformanceMonitor.instance = new Global3DPerformanceMonitor();
    }
    return Global3DPerformanceMonitor.instance;
  }

  /**
   * Start performance monitoring
   */
  public startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.lastFrameTime = performance.now();
    
    // Start performance measurement loop
    this.performanceInterval = setInterval(() => {
      this.measurePerformance();
    }, 1000); // Every second
    
    // Start resource cleanup
    this.cleanupInterval = setInterval(() => {
      this.cleanupResources();
    }, this.PERFORMANCE_THRESHOLDS.CLEANUP_INTERVAL);
    
    // Start quality monitoring
    this.qualityCheckInterval = setInterval(() => {
      this.checkAndAdjustQuality();
    }, this.PERFORMANCE_THRESHOLDS.QUALITY_ADJUSTMENT_INTERVAL);
    
    this.emit('monitoring-started', this.currentQuality);
  }

  /**
   * Stop performance monitoring
   */
  public stopMonitoring(): void {
    this.isMonitoring = false;
    
    if (this.performanceInterval) {
      clearInterval(this.performanceInterval);
      this.performanceInterval = null;
    }
    
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    
    if (this.qualityCheckInterval) {
      clearInterval(this.qualityCheckInterval);
      this.qualityCheckInterval = null;
    }
    
    this.emit('monitoring-stopped');
  }

  /**
   * Register a 3D scene for monitoring
   */
  public registerScene(scene: Scene3D): void {
    this.activeScenes.set(scene.id, scene);
    this.sceneRenderTimes.set(scene.id, []);
    
    this.emit('scene-registered', scene);
    
    // Check if we need to adjust quality due to new scene
    if (this.activeScenes.size > this.currentQuality.maxConcurrentScenes) {
      this.adjustQualityForLoad();
    }
  }

  /**
   * Unregister a 3D scene
   */
  public unregisterScene(sceneId: string): void {
    const scene = this.activeScenes.get(sceneId);
    if (scene) {
      this.activeScenes.delete(sceneId);
      this.sceneRenderTimes.delete(sceneId);
      
      this.emit('scene-unregistered', scene);
      
      // Check if we can improve quality after scene removal
      this.checkQualityImprovement();
    }
  }

  /**
   * Update scene activity status
   */
  public updateSceneStatus(sceneId: string, isActive: boolean, isVisible: boolean): void {
    const scene = this.activeScenes.get(sceneId);
    if (scene) {
      scene.isActive = isActive;
      scene.isVisible = isVisible;
      
      this.emit('scene-status-updated', scene);
    }
  }

  /**
   * Record render time for a specific scene
   */
  public recordSceneRenderTime(sceneId: string, renderTime: number): void {
    const times = this.sceneRenderTimes.get(sceneId);
    if (times) {
      times.push(renderTime);
      
      // Keep only recent measurements
      if (times.length > 30) {
        times.splice(0, times.length - 30);
      }
      
      // Update scene's last render time
      const scene = this.activeScenes.get(sceneId);
      if (scene) {
        scene.lastRenderTime = renderTime;
      }
      
      // Check for performance issues
      if (renderTime > this.PERFORMANCE_THRESHOLDS.MAX_RENDER_TIME_MS * 2) {
        this.emitAlert({
          type: 'render-slow',
          severity: 'medium',
          message: `Scene ${sceneId} render time exceeded threshold: ${renderTime.toFixed(2)}ms`,
          sceneId,
          timestamp: Date.now(),
          action: 'reduce-quality'
        });
      }
    }
  }

  /**
   * Get current performance metrics
   */
  public getCurrentMetrics(): PerformanceMetrics | null {
    return this.performanceHistory.length > 0 
      ? this.performanceHistory[this.performanceHistory.length - 1]
      : null;
  }

  /**
   * Get current quality settings
   */
  public getQualitySettings(): QualitySettings {
    return { ...this.currentQuality };
  }

  /**
   * Get active scenes
   */
  public getActiveScenes(): Scene3D[] {
    return Array.from(this.activeScenes.values());
  }

  /**
   * Get device capability assessment
   */
  public getDeviceCapability(): DeviceCapability {
    return { ...this.deviceCapability };
  }

  /**
   * Force quality adjustment
   */
  public adjustQuality(direction: 'increase' | 'decrease'): void {
    if (direction === 'decrease') {
      this.reduceQuality();
    } else {
      this.improveQuality();
    }
  }

  /**
   * Get resource pool usage
   */
  public getResourceUsage(): {
    geometries: number;
    materials: number;
    textures: number;
    memoryUsage: number;
  } {
    return {
      geometries: this.resourcePool.geometries.size,
      materials: this.resourcePool.materials.size,
      textures: this.resourcePool.textures.size,
      memoryUsage: this.resourcePool.memoryUsage
    };
  }

  /**
   * Assess device capabilities
   */
  private assessDeviceCapability(): DeviceCapability {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    const capability: DeviceCapability = {
      tier: 'medium',
      webglSupport: !!gl,
      webgl2Support: !!(canvas.getContext('webgl2')),
      maxTextureSize: gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 0,
      maxRenderBufferSize: gl ? gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) : 0,
      estimatedGPUMemory: 512, // Default estimate in MB
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      isTablet: /iPad|Android/i.test(navigator.userAgent) && !/Mobile/i.test(navigator.userAgent),
      cpuCores: navigator.hardwareConcurrency || 4,
      estimatedPerformance: 5
    };
    
    // Assess performance tier based on capabilities
    if (capability.maxTextureSize >= 4096 && capability.cpuCores >= 8 && !capability.isMobile) {
      capability.tier = 'high';
      capability.estimatedPerformance = 8;
      capability.estimatedGPUMemory = 1024;
    } else if (capability.maxTextureSize >= 2048 && capability.cpuCores >= 4) {
      capability.tier = 'medium';
      capability.estimatedPerformance = 6;
      capability.estimatedGPUMemory = 512;
    } else {
      capability.tier = 'low';
      capability.estimatedPerformance = 3;
      capability.estimatedGPUMemory = 256;
    }
    
    return capability;
  }

  /**
   * Get optimal quality settings for device
   */
  private getOptimalQualitySettings(): QualitySettings {
    const base: QualitySettings = {
      deviceTier: this.deviceCapability.tier,
      maxConcurrentScenes: 3,
      particleDensity: 1.0,
      shadowQuality: 'medium',
      postProcessing: true,
      antiAliasing: true,
      textureQuality: 'high',
      animationQuality: 'high'
    };
    
    switch (this.deviceCapability.tier) {
      case 'high':
        return {
          ...base,
          maxConcurrentScenes: 5,
          particleDensity: 1.0,
          shadowQuality: 'high',
          postProcessing: true,
          antiAliasing: true,
          textureQuality: 'high',
          animationQuality: 'high'
        };
        
      case 'medium':
        return {
          ...base,
          maxConcurrentScenes: 3,
          particleDensity: 0.7,
          shadowQuality: 'medium',
          postProcessing: true,
          antiAliasing: false,
          textureQuality: 'medium',
          animationQuality: 'medium'
        };
        
      case 'low':
        return {
          ...base,
          maxConcurrentScenes: 2,
          particleDensity: 0.4,
          shadowQuality: 'disabled',
          postProcessing: false,
          antiAliasing: false,
          textureQuality: 'low',
          animationQuality: 'low'
        };
    }
  }

  /**
   * Measure current performance
   */
  private measurePerformance(): void {
    const now = performance.now();
    const deltaTime = now - this.lastFrameTime;
    
    // Calculate FPS
    this.frameCount++;
    const fps = this.frameCount > 0 ? 1000 / deltaTime : 0;
    
    // Estimate memory usage (rough approximation)
    const memoryUsage = this.estimateMemoryUsage();
    
    // Create performance metrics
    const metrics: PerformanceMetrics = {
      fps: Math.round(fps),
      frameTime: deltaTime,
      memoryUsage,
      gpuUtilization: this.estimateGPUUtilization(),
      renderTime: this.getAverageRenderTime(),
      timestamp: now
    };
    
    // Add to history
    this.performanceHistory.push(metrics);
    if (this.performanceHistory.length > this.maxHistoryLength) {
      this.performanceHistory.shift();
    }
    
    this.lastFrameTime = now;
    
    // Check for performance issues
    this.checkPerformanceAlerts(metrics);
    
    this.emit('performance-updated', metrics);
  }

  /**
   * Estimate memory usage
   */
  private estimateMemoryUsage(): number {
    let usage = this.resourcePool.memoryUsage;
    
    // Add estimated usage from active scenes
    for (const scene of this.activeScenes.values()) {
      if (scene.isActive) {
        usage += scene.memoryUsage || (scene.complexity * 10); // Rough estimate
      }
    }
    
    return usage;
  }

  /**
   * Estimate GPU utilization
   */
  private estimateGPUUtilization(): number {
    const activeScenes = Array.from(this.activeScenes.values()).filter(s => s.isActive);
    const totalComplexity = activeScenes.reduce((sum, scene) => sum + scene.complexity, 0);
    
    // Rough estimation based on active scenes and device capability
    const baseUtilization = (totalComplexity / (this.deviceCapability.estimatedPerformance * 2)) * 100;
    
    return Math.min(Math.max(baseUtilization, 0), 100);
  }

  /**
   * Get average render time across all scenes
   */
  private getAverageRenderTime(): number {
    let totalTime = 0;
    let count = 0;
    
    for (const times of this.sceneRenderTimes.values()) {
      if (times.length > 0) {
        totalTime += times.reduce((sum, time) => sum + time, 0);
        count += times.length;
      }
    }
    
    return count > 0 ? totalTime / count : 0;
  }

  /**
   * Check for performance alerts
   */
  private checkPerformanceAlerts(metrics: PerformanceMetrics): void {
    // FPS alerts
    if (metrics.fps < this.PERFORMANCE_THRESHOLDS.MIN_FPS) {
      this.emitAlert({
        type: 'fps-drop',
        severity: metrics.fps < 15 ? 'critical' : 'high',
        message: `FPS dropped to ${metrics.fps}, below minimum threshold of ${this.PERFORMANCE_THRESHOLDS.MIN_FPS}`,
        timestamp: Date.now(),
        action: 'reduce-quality'
      });
    }
    
    // Memory alerts
    if (metrics.memoryUsage > this.PERFORMANCE_THRESHOLDS.MAX_MEMORY_MB) {
      this.emitAlert({
        type: 'memory-high',
        severity: 'high',
        message: `Memory usage (${metrics.memoryUsage}MB) exceeded threshold of ${this.PERFORMANCE_THRESHOLDS.MAX_MEMORY_MB}MB`,
        timestamp: Date.now(),
        action: 'cleanup-memory'
      });
    }
    
    // GPU utilization alerts
    if (metrics.gpuUtilization > 90) {
      this.emitAlert({
        type: 'gpu-overload',
        severity: 'medium',
        message: `GPU utilization at ${metrics.gpuUtilization}%`,
        timestamp: Date.now(),
        action: 'reduce-quality'
      });
    }
  }

  /**
   * Check and adjust quality if needed
   */
  private checkAndAdjustQuality(): void {
    const metrics = this.getCurrentMetrics();
    if (!metrics) return;
    
    const recentMetrics = this.performanceHistory.slice(-5); // Last 5 measurements
    if (recentMetrics.length < 3) return;
    
    const avgFPS = recentMetrics.reduce((sum, m) => sum + m.fps, 0) / recentMetrics.length;
    const avgMemory = recentMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / recentMetrics.length;
    
    // Check if we need to reduce quality
    if (avgFPS < this.PERFORMANCE_THRESHOLDS.MIN_FPS || avgMemory > this.PERFORMANCE_THRESHOLDS.MAX_MEMORY_MB) {
      this.reduceQuality();
    }
    // Check if we can improve quality
    else if (avgFPS > this.PERFORMANCE_THRESHOLDS.TARGET_FPS * 0.9 && avgMemory < this.PERFORMANCE_THRESHOLDS.MAX_MEMORY_MB * 0.7) {
      this.improveQuality();
    }
  }

  /**
   * Reduce quality settings
   */
  private reduceQuality(): void {
    let qualityReduced = false;
    
    // Reduce particle density
    if (this.currentQuality.particleDensity > 0.2) {
      this.currentQuality.particleDensity = Math.max(0.2, this.currentQuality.particleDensity - 0.1);
      qualityReduced = true;
    }
    
    // Reduce shadow quality
    if (this.currentQuality.shadowQuality === 'high') {
      this.currentQuality.shadowQuality = 'medium';
      qualityReduced = true;
    } else if (this.currentQuality.shadowQuality === 'medium') {
      this.currentQuality.shadowQuality = 'low';
      qualityReduced = true;
    } else if (this.currentQuality.shadowQuality === 'low') {
      this.currentQuality.shadowQuality = 'disabled';
      qualityReduced = true;
    }
    
    // Disable post-processing
    if (this.currentQuality.postProcessing) {
      this.currentQuality.postProcessing = false;
      qualityReduced = true;
    }
    
    // Disable anti-aliasing
    if (this.currentQuality.antiAliasing) {
      this.currentQuality.antiAliasing = false;
      qualityReduced = true;
    }
    
    // Reduce max concurrent scenes
    if (this.currentQuality.maxConcurrentScenes > 1) {
      this.currentQuality.maxConcurrentScenes = Math.max(1, this.currentQuality.maxConcurrentScenes - 1);
      qualityReduced = true;
    }
    
    if (qualityReduced) {
      this.emit('quality-reduced', this.currentQuality);
      this.emitAlert({
        type: 'quality-reduced',
        severity: 'low',
        message: 'Quality settings automatically reduced to maintain performance',
        timestamp: Date.now()
      });
    }
  }

  /**
   * Improve quality settings
   */
  private improveQuality(): void {
    const original = this.getOptimalQualitySettings();
    let qualityImproved = false;
    
    // Increase particle density
    if (this.currentQuality.particleDensity < original.particleDensity) {
      this.currentQuality.particleDensity = Math.min(original.particleDensity, this.currentQuality.particleDensity + 0.1);
      qualityImproved = true;
    }
    
    // Improve shadow quality
    if (this.currentQuality.shadowQuality === 'disabled' && original.shadowQuality !== 'disabled') {
      this.currentQuality.shadowQuality = 'low';
      qualityImproved = true;
    } else if (this.currentQuality.shadowQuality === 'low' && original.shadowQuality === 'medium') {
      this.currentQuality.shadowQuality = 'medium';
      qualityImproved = true;
    } else if (this.currentQuality.shadowQuality === 'medium' && original.shadowQuality === 'high') {
      this.currentQuality.shadowQuality = 'high';
      qualityImproved = true;
    }
    
    // Enable post-processing
    if (!this.currentQuality.postProcessing && original.postProcessing) {
      this.currentQuality.postProcessing = true;
      qualityImproved = true;
    }
    
    // Enable anti-aliasing
    if (!this.currentQuality.antiAliasing && original.antiAliasing) {
      this.currentQuality.antiAliasing = true;
      qualityImproved = true;
    }
    
    if (qualityImproved) {
      this.emit('quality-improved', this.currentQuality);
    }
  }

  /**
   * Adjust quality for current load
   */
  private adjustQualityForLoad(): void {
    const activeSceneCount = Array.from(this.activeScenes.values()).filter(s => s.isActive).length;
    
    if (activeSceneCount > this.currentQuality.maxConcurrentScenes) {
      this.reduceQuality();
    }
  }

  /**
   * Check if quality can be improved after scene removal
   */
  private checkQualityImprovement(): void {
    setTimeout(() => {
      const metrics = this.getCurrentMetrics();
      if (metrics && metrics.fps > this.PERFORMANCE_THRESHOLDS.TARGET_FPS * 0.9) {
        this.improveQuality();
      }
    }, 2000); // Wait 2 seconds after scene removal
  }

  /**
   * Clean up unused resources
   */
  private cleanupResources(): void {
    const now = Date.now();
    let cleaned = false;
    
    // Clean up geometries, materials, textures that haven't been used recently
    const cleanupThreshold = 60000; // 1 minute
    
    // This would typically integrate with actual Three.js resource tracking
    // For now, just reset the memory usage estimate
    if (now - this.resourcePool.lastCleanup > cleanupThreshold) {
      this.resourcePool.memoryUsage *= 0.9; // Simulate cleanup
      this.resourcePool.lastCleanup = now;
      cleaned = true;
    }
    
    if (cleaned) {
      this.emit('resources-cleaned', this.getResourceUsage());
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Listen for visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Reduce quality when tab is hidden
        this.emit('visibility-hidden');
      } else {
        // Restore quality when tab is visible
        this.emit('visibility-visible');
      }
    });
    
    // Listen for memory pressure (if supported)
    if ('memory' in performance) {
      setInterval(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const memInfo = (performance as any).memory;
        if (memInfo && memInfo.usedJSHeapSize > memInfo.jsHeapSizeLimit * 0.9) {
          this.emitAlert({
            type: 'memory-high',
            severity: 'critical',
            message: 'JavaScript heap near limit',
            timestamp: Date.now(),
            action: 'cleanup-memory'
          });
        }
      }, 10000);
    }
  }

  /**
   * Emit performance alert
   */
  private emitAlert(alert: PerformanceAlert): void {
    this.emit('performance-alert', alert);
    
    // Auto-execute actions for critical alerts
    if (alert.severity === 'critical' && alert.action) {
      this.executeAlertAction(alert);
    }
  }

  /**
   * Execute alert action
   */
  private executeAlertAction(alert: PerformanceAlert): void {
    switch (alert.action) {
      case 'reduce-quality':
        this.reduceQuality();
        break;
        
      case 'cleanup-memory':
        this.cleanupResources();
        break;
        
      case 'disable-scene':
        if (alert.sceneId) {
          const scene = this.activeScenes.get(alert.sceneId);
          if (scene && scene.priority === 'low') {
            this.updateSceneStatus(alert.sceneId, false, false);
          }
        }
        break;
    }
  }

  /**
   * Destroy monitor instance
   */
  public destroy(): void {
    this.stopMonitoring();
    this.removeAllListeners();
    this.activeScenes.clear();
    this.sceneRenderTimes.clear();
    this.performanceHistory = [];
    Global3DPerformanceMonitor.instance = null;
  }
}

/**
 * Export singleton instance getter
 */
export const getPerformanceMonitor = () => Global3DPerformanceMonitor.getInstance();

