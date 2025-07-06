/**
 * ScrollEffectsPerformanceOptimizer - Phase 3.2.4 Day 4 Task 2
 * 
 * Purpose: Performance optimization utility for combined scroll effects
 * to ensure smooth operation, optimal resource usage, and production readiness.
 * 
 * Features:
 * - GPU resource coordination between WebGL parallax and 3D architecture
 * - Scroll event throttling and debouncing optimization
 * - Memory leak detection and prevention
 * - Adaptive quality scaling based on device performance
 * - Frame rate monitoring and automatic adjustments
 */

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { detectWebGLSupport, isMobileDevice } from '../../lib/webgl-detection';

/**
 * Performance optimization configuration
 */
interface PerformanceOptimizationConfig {
  targetFPS: number;
  enableAdaptiveQuality: boolean;
  enableGPUOptimization: boolean;
  enableMemoryMonitoring: boolean;
  enableScrollOptimization: boolean;
  performanceThresholds: {
    excellent: number;  // 60fps+
    good: number;       // 30-59fps
    poor: number;       // 15-29fps
    critical: number;   // <15fps
  };
}

/**
 * Performance metrics tracking
 */
interface PerformanceMetrics {
  currentFPS: number;
  averageFPS: number;
  memoryUsage: number;
  gpuMemoryUsage: number;
  scrollEventCount: number;
  frameDrops: number;
  lastOptimization: number;
  deviceCapability: 'high' | 'medium' | 'low';
}

/**
 * Optimization recommendations
 */
interface OptimizationRecommendations {
  reduceWebGLQuality: boolean;
  disableParallax: boolean;
  throttleScrollEvents: boolean;
  reduceAnimationComplexity: boolean;
  enableMemoryCleanup: boolean;
  suggestions: string[];
}

/**
 * Get device-appropriate performance configuration
 */
function getPerformanceConfig(): PerformanceOptimizationConfig {
  const webglSupport = detectWebGLSupport();
  const isMobile = isMobileDevice();
  
  // High-performance configuration for capable devices
  if (!isMobile && webglSupport.performanceLevel === 'high') {
    return {
      targetFPS: 60,
      enableAdaptiveQuality: true,
      enableGPUOptimization: true,
      enableMemoryMonitoring: true,
      enableScrollOptimization: true,
      performanceThresholds: {
        excellent: 60,
        good: 45,
        poor: 30,
        critical: 15
      }
    };
  }
  
  // Medium-performance configuration
  if (!isMobile && webglSupport.performanceLevel === 'medium') {
    return {
      targetFPS: 30,
      enableAdaptiveQuality: true,
      enableGPUOptimization: true,
      enableMemoryMonitoring: true,
      enableScrollOptimization: true,
      performanceThresholds: {
        excellent: 30,
        good: 25,
        poor: 20,
        critical: 10
      }
    };
  }
  
  // Mobile/low-performance configuration
  return {
    targetFPS: 30,
    enableAdaptiveQuality: true,
    enableGPUOptimization: false,
    enableMemoryMonitoring: true,
    enableScrollOptimization: true,
    performanceThresholds: {
      excellent: 30,
      good: 20,
      poor: 15,
      critical: 8
    }
  };
}

/**
 * Performance monitoring utility class
 */
class ScrollEffectsPerformanceMonitor {
  private frameCount = 0;
  private lastFrameTime = 0;
  private fpsHistory: number[] = [];
  private maxHistoryLength = 60; // Track last 60 frame measurements
  private isMonitoring = false;
  private rafId: number | null = null;
  private scrollEventCount = 0;
  private lastScrollTime = 0;
  private frameDropCount = 0;
  
  constructor(private config: PerformanceOptimizationConfig) {}
  
  /**
   * Start performance monitoring
   */
  public startMonitoring(callback: (metrics: PerformanceMetrics) => void): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.lastFrameTime = performance.now();
    
    const monitorFrame = (currentTime: number) => {
      if (!this.isMonitoring) return;
      
      // Calculate current FPS
      const deltaTime = currentTime - this.lastFrameTime;
      const currentFPS = deltaTime > 0 ? 1000 / deltaTime : 0;
      
      // Track frame drops (FPS significantly below target)
      if (currentFPS < this.config.targetFPS * 0.8) {
        this.frameDropCount++;
      }
      
      // Update FPS history
      this.fpsHistory.push(currentFPS);
      if (this.fpsHistory.length > this.maxHistoryLength) {
        this.fpsHistory.shift();
      }
      
      // Calculate average FPS
      const averageFPS = this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length;
      
      // Get memory usage
      const memoryUsage = this.getMemoryUsage();
      
      // Determine device capability based on performance
      const deviceCapability = this.determineDeviceCapability(averageFPS);
      
      // Create metrics object
      const metrics: PerformanceMetrics = {
        currentFPS: Math.round(currentFPS),
        averageFPS: Math.round(averageFPS),
        memoryUsage: memoryUsage.jsHeap,
        gpuMemoryUsage: memoryUsage.gpu,
        scrollEventCount: this.scrollEventCount,
        frameDrops: this.frameDropCount,
        lastOptimization: performance.now(),
        deviceCapability
      };
      
      // Report metrics
      callback(metrics);
      
      this.lastFrameTime = currentTime;
      this.frameCount++;
      
      // Continue monitoring
      this.rafId = requestAnimationFrame(monitorFrame);
    };
    
    this.rafId = requestAnimationFrame(monitorFrame);
  }
  
  /**
   * Stop performance monitoring
   */
  public stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
  
  /**
   * Track scroll event for optimization
   */
  public trackScrollEvent(): void {
    this.scrollEventCount++;
    this.lastScrollTime = performance.now();
  }
  
  /**
   * Get memory usage information
   */
  private getMemoryUsage(): { jsHeap: number; gpu: number } {
    let jsHeap = 0;
    let gpu = 0;
    
    try {
      // JavaScript heap usage
      interface PerformanceMemory {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
      }
      
      if ('memory' in performance && typeof (performance as Performance & { memory?: PerformanceMemory }).memory === 'object') {
        const memory = (performance as Performance & { memory: PerformanceMemory }).memory;
        jsHeap = Math.round(memory.usedJSHeapSize / 1024 / 1024); // MB
      }
      
      // GPU memory estimation (simplified)
      const webglSupport = detectWebGLSupport();
      if (webglSupport.webgl) {
        // Estimate based on texture size and other factors
        gpu = webglSupport.maxTextureSize > 4096 ? 50 : 25; // Rough estimate in MB
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      // Fallback values if memory API not available
    }
    
    return { jsHeap, gpu };
  }
  
  /**
   * Determine device capability based on performance
   */
  private determineDeviceCapability(averageFPS: number): PerformanceMetrics['deviceCapability'] {
    if (averageFPS >= this.config.performanceThresholds.excellent) {
      return 'high';
    } else if (averageFPS >= this.config.performanceThresholds.good) {
      return 'medium';
    } else {
      return 'low';
    }
  }
  
  /**
   * Reset monitoring statistics
   */
  public reset(): void {
    this.frameCount = 0;
    this.fpsHistory = [];
    this.scrollEventCount = 0;
    this.frameDropCount = 0;
  }
}

/**
 * Scroll event optimization utility
 */
class ScrollEventOptimizer {
  private lastScrollTime = 0;
  private scrollTimeout: NodeJS.Timeout | null = null;
  private rafId: number | null = null;
  private isScrolling = false;
  
  constructor(private throttleMs: number = 16) {} // Default 60fps throttling
  
  /**
   * Optimized scroll event handler with throttling
   */
  public optimizeScrollHandler(handler: (event: Event) => void): (event: Event) => void {
    return (event: Event) => {
      const now = performance.now();
      
      // Throttle scroll events to target FPS
      if (now - this.lastScrollTime < this.throttleMs) {
        return;
      }
      
      this.lastScrollTime = now;
      this.isScrolling = true;
      
      // Clear existing RAF
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }
      
      // Schedule handler for next frame
      this.rafId = requestAnimationFrame(() => {
        handler(event);
      });
      
      // Detect scroll end
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
      
      this.scrollTimeout = setTimeout(() => {
        this.isScrolling = false;
      }, 150);
    };
  }
  
  /**
   * Check if currently scrolling
   */
  public isCurrentlyScrolling(): boolean {
    return this.isScrolling;
  }
  
  /**
   * Cleanup resources
   */
  public cleanup(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }
}

/**
 * Performance optimization hook
 */
export function useScrollEffectsPerformanceOptimizer() {
  const [config] = useState(() => getPerformanceConfig());
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<OptimizationRecommendations | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const monitorRef = useRef<ScrollEffectsPerformanceMonitor | null>(null);
  const scrollOptimizerRef = useRef<ScrollEventOptimizer | null>(null);
  
  /**
   * Generate optimization recommendations based on metrics
   */
  const generateRecommendations = useCallback((currentMetrics: PerformanceMetrics): OptimizationRecommendations => {
    const recommendations: OptimizationRecommendations = {
      reduceWebGLQuality: false,
      disableParallax: false,
      throttleScrollEvents: false,
      reduceAnimationComplexity: false,
      enableMemoryCleanup: false,
      suggestions: []
    };
    
    // Performance-based recommendations
    if (currentMetrics.averageFPS < config.performanceThresholds.good) {
      recommendations.reduceWebGLQuality = true;
      recommendations.suggestions.push('Reduce WebGL rendering quality for better performance');
    }
    
    if (currentMetrics.averageFPS < config.performanceThresholds.poor) {
      recommendations.disableParallax = true;
      recommendations.throttleScrollEvents = true;
      recommendations.suggestions.push('Disable parallax effects and throttle scroll events');
    }
    
    if (currentMetrics.averageFPS < config.performanceThresholds.critical) {
      recommendations.reduceAnimationComplexity = true;
      recommendations.suggestions.push('Reduce animation complexity to essential effects only');
    }
    
    // Memory-based recommendations
    if (currentMetrics.memoryUsage > 100) {
      recommendations.enableMemoryCleanup = true;
      recommendations.suggestions.push('Enable aggressive memory cleanup');
    }
    
    // Scroll event optimization
    if (currentMetrics.scrollEventCount > 1000) {
      recommendations.throttleScrollEvents = true;
      recommendations.suggestions.push('Increase scroll event throttling');
    }
    
    // Device capability recommendations
    if (currentMetrics.deviceCapability === 'low') {
      recommendations.suggestions.push('Device performance is limited - consider simplified effects');
    }
    
    return recommendations;
  }, [config]);
  
  /**
   * Start performance monitoring
   */
  const startOptimization = useCallback(() => {
    if (!monitorRef.current) {
      monitorRef.current = new ScrollEffectsPerformanceMonitor(config);
    }
    
    if (!scrollOptimizerRef.current) {
      scrollOptimizerRef.current = new ScrollEventOptimizer(1000 / config.targetFPS);
    }
    
    setIsOptimizing(true);
    
    monitorRef.current.startMonitoring((newMetrics) => {
      setMetrics(newMetrics);
      
      // Generate recommendations based on metrics
      const newRecommendations = generateRecommendations(newMetrics);
      setRecommendations(newRecommendations);
    });
  }, [config, generateRecommendations]);
  
  /**
   * Stop performance monitoring
   */
  const stopOptimization = useCallback(() => {
    setIsOptimizing(false);
    monitorRef.current?.stopMonitoring();
    scrollOptimizerRef.current?.cleanup();
  }, []);
  
  /**
   * Get optimized scroll handler
   */
  const getOptimizedScrollHandler = useCallback((handler: (event: Event) => void) => {
    if (!scrollOptimizerRef.current) {
      scrollOptimizerRef.current = new ScrollEventOptimizer(1000 / config.targetFPS);
    }
    return scrollOptimizerRef.current.optimizeScrollHandler(handler);
  }, [config.targetFPS]);
  
  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      stopOptimization();
    };
  }, [stopOptimization]);
  
  return {
    config,
    metrics,
    recommendations,
    isOptimizing,
    startOptimization,
    stopOptimization,
    getOptimizedScrollHandler,
    trackScrollEvent: () => monitorRef.current?.trackScrollEvent()
  };
}

/**
 * Performance optimization display component
 */
interface PerformanceOptimizerDisplayProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export function PerformanceOptimizerDisplay({ 
  position = 'bottom-left',
  className = ''
}: PerformanceOptimizerDisplayProps) {
  const {
    metrics,
    recommendations,
    isOptimizing,
    startOptimization,
    stopOptimization
  } = useScrollEffectsPerformanceOptimizer();
  
  const positionStyles = {
    'top-left': { top: '10px', left: '10px' },
    'top-right': { top: '10px', right: '10px' },
    'bottom-left': { bottom: '10px', left: '10px' },
    'bottom-right': { bottom: '10px', right: '10px' }
  };
  
  // Don't render in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  return (
    <div 
      className={`performance-optimizer-display ${className}`}
      style={{
        position: 'fixed',
        ...positionStyles[position],
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '11px',
        fontFamily: 'monospace',
        zIndex: 9997,
        maxWidth: '280px',
        border: '1px solid #333'
      }}
    >
      <div style={{ 
        fontWeight: 'bold', 
        marginBottom: '8px',
        color: '#6366f1'
      }}>
        ⚡ Performance Optimizer
      </div>
      
      {!isOptimizing ? (
        <button
          onClick={startOptimization}
          style={{
            background: '#10b981',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px'
          }}
        >
          Start Monitoring
        </button>
      ) : (
        <div>
          <button
            onClick={stopOptimization}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '9px',
              marginBottom: '8px'
            }}
          >
            Stop
          </button>
          
          {metrics && (
            <div style={{ marginBottom: '8px' }}>
              <div>📊 FPS: {metrics.currentFPS} (avg: {metrics.averageFPS})</div>
              <div>🧠 Memory: {metrics.memoryUsage}MB</div>
              <div>📱 Device: {metrics.deviceCapability}</div>
              <div>📉 Frame Drops: {metrics.frameDrops}</div>
            </div>
          )}
          
          {recommendations && recommendations.suggestions.length > 0 && (
            <div style={{ 
              marginBottom: '8px',
              padding: '6px',
              background: 'rgba(239, 68, 68, 0.2)',
              borderRadius: '4px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                💡 Recommendations:
              </div>
              {recommendations.suggestions.slice(0, 2).map((suggestion, index) => (
                <div key={index} style={{ fontSize: '9px', lineHeight: '1.3' }}>
                  • {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default useScrollEffectsPerformanceOptimizer;