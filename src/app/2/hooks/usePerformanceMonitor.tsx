'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface PerformanceMetrics {
  fps: number;
  avgFps: number;
  minFps: number;
  maxFps: number;
  frameTime: number;
  memoryUsage?: number;
  isPerformanceGood: boolean;
  samples: number;
}

export const usePerformanceMonitor = (targetFps: number = 60) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    avgFps: 0,
    minFps: Infinity,
    maxFps: 0,
    frameTime: 0,
    isPerformanceGood: true,
    samples: 0,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);
  const isMonitoringRef = useRef(false);

  const startMonitoring = useCallback(() => {
    if (isMonitoringRef.current) return;
    
    isMonitoringRef.current = true;
    frameCountRef.current = 0;
    lastTimeRef.current = performance.now();
    fpsHistoryRef.current = [];

    const monitor = () => {
      if (!isMonitoringRef.current) return;

      const now = performance.now();
      const deltaTime = now - lastTimeRef.current;
      frameCountRef.current++;

      // Calculate FPS every 250ms
      if (deltaTime >= 250) {
        const fps = Math.round((frameCountRef.current * 1000) / deltaTime);
        const frameTime = deltaTime / frameCountRef.current;
        
        // Add to history (keep last 20 samples)
        fpsHistoryRef.current.push(fps);
        if (fpsHistoryRef.current.length > 20) {
          fpsHistoryRef.current.shift();
        }

        // Calculate statistics
        const avgFps = Math.round(
          fpsHistoryRef.current.reduce((sum, f) => sum + f, 0) / fpsHistoryRef.current.length
        );
        const minFps = Math.min(...fpsHistoryRef.current);
        const maxFps = Math.max(...fpsHistoryRef.current);

        // Performance assessment
        const isPerformanceGood = avgFps >= targetFps * 0.8; // 80% of target FPS

        // Memory usage (if available)
        const memoryUsage = 'memory' in performance && performance.memory ? 
          (performance.memory as { usedJSHeapSize: number }).usedJSHeapSize : 
          undefined;

        setMetrics({
          fps,
          avgFps,
          minFps,
          maxFps,
          frameTime,
          memoryUsage,
          isPerformanceGood,
          samples: fpsHistoryRef.current.length,
        });

        // Reset for next measurement
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      requestAnimationFrame(monitor);
    };

    requestAnimationFrame(monitor);
  }, [targetFps]);

  const stopMonitoring = useCallback(() => {
    isMonitoringRef.current = false;
  }, []);

  const resetMetrics = useCallback(() => {
    frameCountRef.current = 0;
    fpsHistoryRef.current = [];
    setMetrics({
      fps: 0,
      avgFps: 0,
      minFps: Infinity,
      maxFps: 0,
      frameTime: 0,
      isPerformanceGood: true,
      samples: 0,
    });
  }, []);

  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return {
    metrics,
    startMonitoring,
    stopMonitoring,
    resetMetrics,
  };
};

// Hook for automatic performance monitoring in 3D scenes
export const useScenePerformanceMonitor = () => {
  const { metrics, startMonitoring, stopMonitoring } = usePerformanceMonitor(60);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    const newRecommendations: string[] = [];

    if (metrics.avgFps < 30) {
      newRecommendations.push('Consider reducing particle count or effects');
    }
    if (metrics.avgFps < 45) {
      newRecommendations.push('Disable shadows or anti-aliasing');
    }
    if (metrics.memoryUsage && metrics.memoryUsage > 50 * 1024 * 1024) {
      newRecommendations.push('Memory usage high, consider optimizing textures');
    }

    setRecommendations(newRecommendations);
  }, [metrics]);

  return {
    metrics,
    recommendations,
    startMonitoring,
    stopMonitoring,
  };
};

// Component for displaying performance metrics in development
export const PerformanceMonitor = ({ targetFps = 60 }: { targetFps?: number }) => {
  const { metrics, startMonitoring, stopMonitoring } = usePerformanceMonitor(targetFps);

  useEffect(() => {
    startMonitoring();
    return () => stopMonitoring();
  }, [startMonitoring, stopMonitoring]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      left: 10,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace',
      minWidth: '200px',
    }}>
      <div>FPS: {metrics.fps} (avg: {metrics.avgFps})</div>
      <div>Range: {metrics.minFps} - {metrics.maxFps}</div>
      <div>Frame Time: {metrics.frameTime.toFixed(2)}ms</div>
      <div>Performance: {metrics.isPerformanceGood ? '✓' : '⚠️'}</div>
      {metrics.memoryUsage && (
        <div>Memory: {Math.round(metrics.memoryUsage / 1024 / 1024)}MB</div>
      )}
      <div>Samples: {metrics.samples}</div>
    </div>
  );
};