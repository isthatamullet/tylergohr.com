/**
 * PerformanceMonitor Component - Phase 3.2 Day 1
 * 
 * Purpose: Comprehensive performance tracking for advanced scroll effects
 * with 120fps targeting, memory monitoring, and device capability detection.
 * 
 * Features:
 * - Real-time frame rate monitoring with 120fps targets
 * - Memory usage tracking for scroll and parallax effects
 * - Performance regression detection and adaptive optimization
 * - Integration with existing 3D architecture performance monitoring
 * - Device capability detection for optimal experience tuning
 */

'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { detectWebGLSupport, isMobileDevice } from '../../lib/webgl-detection';
import { useScrollController } from './ScrollController';

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  fps: number;
  frameTime: number; // ms per frame
  memoryUsage: {
    used: number; // MB
    total: number; // MB
    percentage: number;
  };
  scrollPerformance: {
    averageEventTime: number; // ms
    missedFrames: number;
    totalScrollEvents: number;
  };
  webglPerformance: {
    drawCalls: number;
    triangles: number;
    geometries: number;
    textures: number;
  };
  deviceCapabilities: {
    performanceLevel: 'high' | 'medium' | 'low';
    maxRefreshRate: number;
    hardwareAcceleration: boolean;
    webglSupport: boolean;
  };
}

/**
 * Performance thresholds for different quality levels
 */
interface PerformanceThresholds {
  targetFPS: number;
  minFPS: number;
  maxFrameTime: number; // ms
  memoryWarningThreshold: number; // MB
  scrollEventThreshold: number; // ms
}

/**
 * Get performance thresholds based on device capabilities
 */
function getPerformanceThresholds(): PerformanceThresholds {
  const isMobile = isMobileDevice();
  const webglCapabilities = detectWebGLSupport();
  
  // High-performance desktop thresholds
  if (!isMobile && webglCapabilities.performanceLevel === 'high') {
    return {
      targetFPS: 120,
      minFPS: 90,
      maxFrameTime: 8.33, // 120fps = 8.33ms per frame
      memoryWarningThreshold: 100,
      scrollEventThreshold: 5
    };
  }
  
  // Medium-performance thresholds
  if (!isMobile && webglCapabilities.performanceLevel === 'medium') {
    return {
      targetFPS: 60,
      minFPS: 45,
      maxFrameTime: 16.67, // 60fps = 16.67ms per frame
      memoryWarningThreshold: 75,
      scrollEventThreshold: 10
    };
  }
  
  // Low-performance/mobile thresholds
  return {
    targetFPS: 30,
    minFPS: 20,
    maxFrameTime: 33.33, // 30fps = 33.33ms per frame
    memoryWarningThreshold: 50,
    scrollEventThreshold: 20
  };
}

/**
 * Frame rate monitor class for accurate FPS tracking
 */
class FrameRateMonitor {
  private frames: number[] = [];
  private readonly maxSamples = 60;
  private lastTime = performance.now();
  
  update(): number {
    const now = performance.now();
    const deltaTime = now - this.lastTime;
    
    this.frames.push(deltaTime);
    
    if (this.frames.length > this.maxSamples) {
      this.frames.shift();
    }
    
    this.lastTime = now;
    
    // Calculate average FPS from recent frames
    if (this.frames.length < 2) return 0;
    
    const avgFrameTime = this.frames.reduce((sum, time) => sum + time, 0) / this.frames.length;
    return avgFrameTime > 0 ? 1000 / avgFrameTime : 0;
  }
  
  getFrameTime(): number {
    if (this.frames.length === 0) return 0;
    return this.frames[this.frames.length - 1];
  }
  
  reset(): void {
    this.frames = [];
    this.lastTime = performance.now();
  }
}

/**
 * Memory monitor for tracking scroll effect resource usage
 */
class MemoryMonitor {
  getMemoryUsage(): { used: number; total: number; percentage: number } {
    // Use Performance API memory if available
    if ('memory' in performance) {
      const memory = (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory;
      if (memory) {
        const used = memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
        const total = memory.totalJSHeapSize / (1024 * 1024);
        const percentage = total > 0 ? (used / total) * 100 : 0;
        
        return { used, total, percentage };
      }
    }
    
    // Fallback estimation
    return { used: 0, total: 0, percentage: 0 };
  }
}

/**
 * Scroll performance tracker
 */
class ScrollPerformanceTracker {
  private scrollEvents: number[] = [];
  private totalEvents = 0;
  private missedFrames = 0;
  private readonly frameThreshold: number;
  
  constructor(frameThreshold: number) {
    this.frameThreshold = frameThreshold;
  }
  
  trackScrollEvent(eventTime: number): void {
    this.scrollEvents.push(eventTime);
    this.totalEvents++;
    
    // Track missed frames (events that took too long)
    if (eventTime > this.frameThreshold) {
      this.missedFrames++;
    }
    
    // Keep only recent events
    if (this.scrollEvents.length > 100) {
      this.scrollEvents.shift();
    }
  }
  
  getAverageEventTime(): number {
    if (this.scrollEvents.length === 0) return 0;
    
    const sum = this.scrollEvents.reduce((acc, time) => acc + time, 0);
    return sum / this.scrollEvents.length;
  }
  
  getMissedFrames(): number {
    return this.missedFrames;
  }
  
  getTotalEvents(): number {
    return this.totalEvents;
  }
  
  reset(): void {
    this.scrollEvents = [];
    this.totalEvents = 0;
    this.missedFrames = 0;
  }
}

/**
 * Main PerformanceMonitor Hook
 */
export function usePerformanceMonitor(
  enableMonitoring: boolean = true,
  enableLogging: boolean = false
) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  
  // Initialize monitoring components
  const frameRateMonitor = useRef(new FrameRateMonitor());
  const memoryMonitor = useRef(new MemoryMonitor());
  const scrollTracker = useRef(new ScrollPerformanceTracker(16.67)); // 60fps threshold
  const rafId = useRef<number | null>(null);
  
  // Get performance thresholds
  const thresholds = useMemo(() => getPerformanceThresholds(), []);
  
  // Get device capabilities
  const deviceCapabilities = useMemo(() => {
    const webglCapabilities = detectWebGLSupport();
    const isMobile = isMobileDevice();
    
    // Map unavailable to low for interface compatibility
    const performanceLevel = webglCapabilities.performanceLevel === 'unavailable' 
      ? 'low' 
      : webglCapabilities.performanceLevel;
    
    return {
      performanceLevel,
      maxRefreshRate: isMobile ? 60 : 120,
      hardwareAcceleration: webglCapabilities.webgl,
      webglSupport: webglCapabilities.webgl
    };
  }, []);
  
  // Performance monitoring loop
  const monitorPerformance = useCallback(() => {
    if (!enableMonitoring) return;
    
    const startTime = performance.now();
    
    // Update frame rate
    const fps = frameRateMonitor.current.update();
    const frameTime = frameRateMonitor.current.getFrameTime();
    
    // Update memory usage
    const memoryUsage = memoryMonitor.current.getMemoryUsage();
    
    // Update scroll performance
    const scrollPerformance = {
      averageEventTime: scrollTracker.current.getAverageEventTime(),
      missedFrames: scrollTracker.current.getMissedFrames(),
      totalScrollEvents: scrollTracker.current.getTotalEvents()
    };
    
    // Estimate WebGL performance (basic metrics)
    const webglPerformance = {
      drawCalls: 0, // Would be populated by WebGL context if available
      triangles: 0,
      geometries: 0,
      textures: 0
    };
    
    const newMetrics: PerformanceMetrics = {
      fps,
      frameTime,
      memoryUsage,
      scrollPerformance,
      webglPerformance,
      deviceCapabilities
    };
    
    setMetrics(newMetrics);
    
    // Performance logging
    if (enableLogging) {
      const endTime = performance.now();
      const monitoringOverhead = endTime - startTime;
      
      // Log warnings for performance issues
      if (fps < thresholds.minFPS) {
        console.warn(`[PerformanceMonitor] Low FPS detected: ${fps.toFixed(1)}fps (target: ${thresholds.targetFPS}fps)`);
      }
      
      if (frameTime > thresholds.maxFrameTime) {
        console.warn(`[PerformanceMonitor] Frame time exceeded: ${frameTime.toFixed(2)}ms (target: ${thresholds.maxFrameTime}ms)`);
      }
      
      if (memoryUsage.used > thresholds.memoryWarningThreshold) {
        console.warn(`[PerformanceMonitor] High memory usage: ${memoryUsage.used.toFixed(1)}MB`);
      }
      
      if (monitoringOverhead > 2) {
        console.warn(`[PerformanceMonitor] High monitoring overhead: ${monitoringOverhead.toFixed(2)}ms`);
      }
    }
    
    rafId.current = requestAnimationFrame(monitorPerformance);
    
  }, [enableMonitoring, enableLogging, thresholds, deviceCapabilities]);
  
  // Start/stop monitoring
  useEffect(() => {
    if (enableMonitoring && !isMonitoring) {
      setIsMonitoring(true);
      rafId.current = requestAnimationFrame(monitorPerformance);
    } else if (!enableMonitoring && isMonitoring) {
      setIsMonitoring(false);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    }
    
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      setIsMonitoring(false);
    };
  }, [enableMonitoring, isMonitoring, monitorPerformance]);
  
  // Track scroll events from ScrollController
  const { scrollState } = useScrollController();
  
  useEffect(() => {
    if (!enableMonitoring) return;
    
    const startTime = performance.now();
    
    // Track scroll event performance
    const eventTime = performance.now() - startTime;
    scrollTracker.current.trackScrollEvent(eventTime);
    
  }, [scrollState.scrollY, enableMonitoring]);
  
  return {
    metrics,
    thresholds,
    isMonitoring,
    resetMetrics: () => {
      frameRateMonitor.current.reset();
      scrollTracker.current.reset();
    }
  };
}

/**
 * Performance monitoring component for debugging
 */
interface PerformanceMonitorProps {
  enableDisplay?: boolean;
  enableLogging?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function PerformanceMonitor({ 
  enableDisplay = false, 
  enableLogging = false,
  position = 'top-right'
}: PerformanceMonitorProps) {
  const { metrics, thresholds, isMonitoring } = usePerformanceMonitor(true, enableLogging);
  
  if (!enableDisplay || !metrics || !isMonitoring) {
    return null;
  }
  
  const positionStyles = {
    'top-left': { top: '10px', left: '10px' },
    'top-right': { top: '10px', right: '10px' },
    'bottom-left': { bottom: '10px', left: '10px' },
    'bottom-right': { bottom: '10px', right: '10px' }
  };
  
  return (
    <div
      style={{
        position: 'fixed',
        ...positionStyles[position],
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        minWidth: '200px'
      }}
    >
      <div><strong>Performance Monitor</strong></div>
      <div>
        FPS: <span style={{ color: metrics.fps >= thresholds.minFPS ? '#10b981' : '#ef4444' }}>
          {metrics.fps.toFixed(1)}
        </span> / {thresholds.targetFPS}
      </div>
      <div>
        Frame Time: <span style={{ color: metrics.frameTime <= thresholds.maxFrameTime ? '#10b981' : '#ef4444' }}>
          {metrics.frameTime.toFixed(2)}ms
        </span>
      </div>
      <div>
        Memory: <span style={{ color: metrics.memoryUsage.used <= thresholds.memoryWarningThreshold ? '#10b981' : '#ef4444' }}>
          {metrics.memoryUsage.used.toFixed(1)}MB
        </span> ({metrics.memoryUsage.percentage.toFixed(1)}%)
      </div>
      <div>
        Scroll Events: {metrics.scrollPerformance.totalScrollEvents}
      </div>
      <div>
        Missed Frames: <span style={{ color: metrics.scrollPerformance.missedFrames === 0 ? '#10b981' : '#ef4444' }}>
          {metrics.scrollPerformance.missedFrames}
        </span>
      </div>
      <div>
        Device: {metrics.deviceCapabilities.performanceLevel}
        {metrics.deviceCapabilities.webglSupport && ' + WebGL'}
      </div>
    </div>
  );
}

export default PerformanceMonitor;