/**
 * usePerformanceMonitoring Hook - Phase 3.3 Week 3 Day 3
 * 
 * Purpose: React hook for integrating existing Phase 3 components with
 * the new global 3D performance monitoring system. Provides automatic
 * scene registration, performance tracking, and optimization.
 * 
 * Features:
 * - Automatic scene registration and cleanup
 * - Performance metrics tracking
 * - Quality scaling integration
 * - Resource management
 * - User-friendly performance notifications
 */

/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { getPerformanceMonitor, type Scene3D, type PerformanceMetrics } from '../lib/performance/Global3DPerformanceMonitor';
import { getQualityScaler, type QualityLevel } from '../lib/performance/QualityScaler3D';
import { getResourceManager, type ResourceRequest } from '../lib/performance/ResourceManager3D';
import { getPerformanceReporting, type RealtimeStatus } from '../lib/performance/PerformanceReporting';

/**
 * Performance monitoring configuration
 */
export interface PerformanceMonitoringConfig {
  sceneType: Scene3D['type'];
  priority: Scene3D['priority'];
  complexity: number; // 1-10 scale
  trackRenderTime: boolean;
  enableQualityScaling: boolean;
  enableResourceManagement: boolean;
  enableUserNotifications: boolean;
  autoOptimize: boolean;
}

/**
 * Performance monitoring hook result
 */
export interface PerformanceMonitoringResult {
  // Current status
  isMonitoring: boolean;
  currentMetrics: PerformanceMetrics | null;
  qualityLevel: QualityLevel | null;
  realtimeStatus: RealtimeStatus | null;
  
  // Scene management
  sceneId: string;
  registerScene: (element: HTMLElement) => void;
  unregisterScene: () => void;
  updateSceneStatus: (isActive: boolean, isVisible: boolean) => void;
  
  // Performance tracking
  recordRenderStart: () => void;
  recordRenderEnd: () => void;
  recordMemoryUsage: (usage: number) => void;
  
  // Resource management
  requestResource: <T>(request: ResourceRequest) => T;
  releaseResource: (resourceId: string) => void;
  
  // Quality control
  setQualityLevel: (level: QualityLevel['name']) => void;
  resetToOptimalQuality: () => void;
  
  // Notifications
  showPerformanceNotification: (message: string, type?: 'info' | 'warning' | 'error') => void;
  
  // Optimization
  optimizeForCurrentDevice: () => void;
  handlePerformanceIssue: (issue: string) => void;
}

/**
 * Default configuration
 */
const defaultConfig: PerformanceMonitoringConfig = {
  sceneType: 'skill-card',
  priority: 'medium',
  complexity: 5,
  trackRenderTime: true,
  enableQualityScaling: true,
  enableResourceManagement: true,
  enableUserNotifications: true,
  autoOptimize: true
};

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitoring(
  componentName: string,
  config: Partial<PerformanceMonitoringConfig> = {}
): PerformanceMonitoringResult {
  const finalConfig = { ...defaultConfig, ...config };
  
  // Refs and state
  const sceneIdRef = useRef<string>(`${componentName}-${Date.now()}`);
  const elementRef = useRef<HTMLElement | null>(null);
  const renderStartTimeRef = useRef<number>(0);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState<PerformanceMetrics | null>(null);
  const [qualityLevel, setQualityLevelState] = useState<QualityLevel | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<RealtimeStatus | null>(null);
  
  // Performance system instances
  const performanceMonitor = getPerformanceMonitor();
  const qualityScaler = getQualityScaler();
  const resourceManager = getResourceManager();
  const performanceReporting = getPerformanceReporting();
  
  // Initialize monitoring
  useEffect(() => {
    if (finalConfig.enableQualityScaling || finalConfig.trackRenderTime || finalConfig.enableResourceManagement) {
      performanceMonitor.startMonitoring();
      setIsMonitoring(true);
      
      // Get initial quality level
      setQualityLevelState(qualityScaler.getCurrentQuality());
    }
    
    return () => {
      if (elementRef.current) {
        performanceMonitor.unregisterScene(sceneIdRef.current);
      }
    };
  }, []);
  
  // Listen for performance updates
  useEffect(() => {
    const handlePerformanceUpdate = (metrics: PerformanceMetrics) => {
      setCurrentMetrics(metrics);
    };
    
    const handleQualityChange = (newQuality: QualityLevel) => {
      setQualityLevelState(newQuality);
      
      if (finalConfig.enableUserNotifications) {
        performanceReporting.showNotification(
          'info',
          'Quality Adjusted',
          `3D quality set to ${newQuality.name} for optimal performance`,
          true
        );
      }
    };
    
    const handleRealtimeUpdate = () => {
      setRealtimeStatus(performanceReporting.getRealtimeStatus());
    };
    
    performanceMonitor.on('performance-updated', handlePerformanceUpdate);
    qualityScaler.on('quality-level-changed', handleQualityChange);
    
    // Update realtime status periodically
    const realtimeInterval = setInterval(handleRealtimeUpdate, 2000);
    
    return () => {
      performanceMonitor.off('performance-updated', handlePerformanceUpdate);
      qualityScaler.off('quality-level-changed', handleQualityChange);
      clearInterval(realtimeInterval);
    };
  }, [finalConfig.enableUserNotifications]);
  
  // Register scene
  const registerScene = useCallback((element: HTMLElement) => {
    elementRef.current = element;
    
    const scene: Scene3D = {
      id: sceneIdRef.current,
      type: finalConfig.sceneType,
      priority: finalConfig.priority,
      complexity: finalConfig.complexity,
      isActive: true,
      isVisible: true,
      lastRenderTime: 0,
      memoryUsage: finalConfig.complexity * 10, // Rough estimate
      element
    };
    
    performanceMonitor.registerScene(scene);
    
    if (finalConfig.autoOptimize) {
      optimizeForCurrentDevice();
    }
  }, [finalConfig]);
  
  // Unregister scene
  const unregisterScene = useCallback(() => {
    performanceMonitor.unregisterScene(sceneIdRef.current);
    elementRef.current = null;
  }, []);
  
  // Update scene status
  const updateSceneStatus = useCallback((isActive: boolean, isVisible: boolean) => {
    performanceMonitor.updateSceneStatus(sceneIdRef.current, isActive, isVisible);
  }, []);
  
  // Record render start time
  const recordRenderStart = useCallback(() => {
    if (finalConfig.trackRenderTime) {
      renderStartTimeRef.current = performance.now();
    }
  }, [finalConfig.trackRenderTime]);
  
  // Record render end and calculate render time
  const recordRenderEnd = useCallback(() => {
    if (finalConfig.trackRenderTime && renderStartTimeRef.current > 0) {
      const renderTime = performance.now() - renderStartTimeRef.current;
      performanceMonitor.recordSceneRenderTime(sceneIdRef.current, renderTime);
      renderStartTimeRef.current = 0;
    }
  }, [finalConfig.trackRenderTime]);
  
  // Record memory usage
  const recordMemoryUsage = useCallback((usage: number) => {
    const scene = performanceMonitor.getActiveScenes().find(s => s.id === sceneIdRef.current);
    if (scene) {
      scene.memoryUsage = usage;
    }
  }, []);
  
  // Request resource
  const requestResource = useCallback(<T>(request: ResourceRequest): T => {
    if (!finalConfig.enableResourceManagement) {
      // If resource management is disabled, just create the resource
      return request.factory() as T;
    }
    
    return resourceManager.requestResource<T>({
      ...request,
      sceneId: sceneIdRef.current
    });
  }, [finalConfig.enableResourceManagement]);
  
  // Release resource
  const releaseResource = useCallback((resourceId: string) => {
    if (finalConfig.enableResourceManagement) {
      resourceManager.releaseResource(resourceId, sceneIdRef.current);
    }
  }, [finalConfig.enableResourceManagement]);
  
  // Set quality level
  const setQualityLevel = useCallback((level: QualityLevel['name']) => {
    if (finalConfig.enableQualityScaling) {
      qualityScaler.setQuality(level, 'user-preference');
    }
  }, [finalConfig.enableQualityScaling]);
  
  // Reset to optimal quality
  const resetToOptimalQuality = useCallback(() => {
    if (finalConfig.enableQualityScaling) {
      qualityScaler.resetToOptimal();
    }
  }, [finalConfig.enableQualityScaling]);
  
  // Show performance notification
  const showPerformanceNotification = useCallback((
    message: string, 
    type: 'info' | 'warning' | 'error' = 'info'
  ) => {
    if (finalConfig.enableUserNotifications) {
      const title = type === 'error' ? 'Performance Issue' :
                   type === 'warning' ? 'Performance Warning' :
                   'Performance Info';
      
      performanceReporting.showNotification(type, title, message, true);
    }
  }, [finalConfig.enableUserNotifications]);
  
  // Optimize for current device
  const optimizeForCurrentDevice = useCallback(() => {
    if (!finalConfig.autoOptimize) return;
    
    const deviceProfile = qualityScaler.getDeviceProfile();
    
    // Adjust scene complexity based on device capability
    const scene = performanceMonitor.getActiveScenes().find(s => s.id === sceneIdRef.current);
    if (scene) {
      const optimalComplexity = Math.min(
        finalConfig.complexity,
        Math.floor(deviceProfile.score * 1.2)
      );
      
      scene.complexity = optimalComplexity;
      
      if (optimalComplexity < finalConfig.complexity) {
        showPerformanceNotification(
          `Scene complexity automatically reduced to ${optimalComplexity} for your device`,
          'info'
        );
      }
    }
    
    // Set optimal quality
    resetToOptimalQuality();
  }, [finalConfig.autoOptimize, finalConfig.complexity, showPerformanceNotification, resetToOptimalQuality]);
  
  // Handle performance issue
  const handlePerformanceIssue = useCallback((issue: string) => {
    console.warn(`Performance issue in ${componentName}:`, issue);
    
    if (finalConfig.autoOptimize) {
      // Try to resolve automatically
      if (issue.includes('fps') || issue.includes('frame')) {
        qualityScaler.adjustQuality('decrease');
        showPerformanceNotification(
          'Quality automatically reduced to improve frame rate',
          'warning'
        );
      } else if (issue.includes('memory')) {
        resourceManager.forceCleanup();
        showPerformanceNotification(
          'Memory optimized to improve performance',
          'info'
        );
      }
    } else {
      showPerformanceNotification(issue, 'warning');
    }
  }, [componentName, finalConfig.autoOptimize, showPerformanceNotification]);
  
  return {
    // Status
    isMonitoring,
    currentMetrics,
    qualityLevel,
    realtimeStatus,
    
    // Scene management
    sceneId: sceneIdRef.current,
    registerScene,
    unregisterScene,
    updateSceneStatus,
    
    // Performance tracking
    recordRenderStart,
    recordRenderEnd,
    recordMemoryUsage,
    
    // Resource management
    requestResource,
    releaseResource,
    
    // Quality control
    setQualityLevel,
    resetToOptimalQuality,
    
    // Notifications
    showPerformanceNotification,
    
    // Optimization
    optimizeForCurrentDevice,
    handlePerformanceIssue
  };
}

/**
 * Simplified hook for basic 3D components
 */
export function useBasic3DPerformance(componentName: string) {
  return usePerformanceMonitoring(componentName, {
    complexity: 5,
    trackRenderTime: true,
    enableQualityScaling: true,
    enableResourceManagement: false,
    enableUserNotifications: false,
    autoOptimize: true
  });
}

/**
 * Hook for complex 3D scenes
 */
export function useAdvanced3DPerformance(componentName: string) {
  return usePerformanceMonitoring(componentName, {
    complexity: 8,
    priority: 'high',
    trackRenderTime: true,
    enableQualityScaling: true,
    enableResourceManagement: true,
    enableUserNotifications: true,
    autoOptimize: true
  });
}

/**
 * Hook for visualization components
 */
export function useVisualization3DPerformance(componentName: string) {
  return usePerformanceMonitoring(componentName, {
    sceneType: 'technology-viz',
    complexity: 7,
    priority: 'medium',
    trackRenderTime: true,
    enableQualityScaling: true,
    enableResourceManagement: true,
    enableUserNotifications: false,
    autoOptimize: true
  });
}