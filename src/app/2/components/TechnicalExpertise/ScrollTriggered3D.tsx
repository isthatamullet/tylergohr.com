/**
 * ScrollTriggered3D Component - Phase 3.2 Day 2
 * 
 * Purpose: Wrapper component that adds scroll-responsive behavior to 3D scenes
 * while maintaining compatibility with existing manual controls like OrbitControls.
 * 
 * Features:
 * - Seamless integration with Day 1 ScrollController infrastructure
 * - Smooth transitions between manual and scroll-driven camera control
 * - Performance-aware scroll responsiveness based on device capabilities
 * - Zero impact on existing 3D functionality when scroll is disabled
 * - Progressive enhancement for different device performance levels
 */

'use client';

import React, { createContext, useContext, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useScrollController } from '../ScrollEffects/ScrollController';
import { usePerformanceMonitor } from '../ScrollEffects/PerformanceMonitor';
import * as THREE from 'three';

/**
 * Scroll-triggered 3D configuration
 */
export interface ScrollTriggered3DConfig {
  enableScrollAnimations: boolean;
  scrollSensitivity: number;
  transitionSpeed: number;
  manualControlPriority: boolean;
  cameraSmoothness: number;
  nodeAnimationIntensity: number;
  deviceOptimization: 'high' | 'medium' | 'low';
}

/**
 * Node transform data structure
 */
interface NodeTransform {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  opacity: number;
}

/**
 * 3D Animation state for scroll integration
 */
export interface ThreeDAnimationState {
  cameraPosition: THREE.Vector3;
  cameraTarget: THREE.Vector3;
  nodeTransforms: Map<string, {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: number;
    opacity: number;
  }>;
  lightingIntensity: number;
  isManualControl: boolean;
  lastInteractionTime: number;
}

/**
 * Context for sharing 3D scroll state
 */
interface ScrollTriggered3DContext {
  animationState: ThreeDAnimationState;
  config: ScrollTriggered3DConfig;
  registerNode: (nodeId: string, initialTransform: NodeTransform) => void;
  updateNodeTransform: (nodeId: string, transform: NodeTransform) => void;
  setManualControl: (isManual: boolean) => void;
  isScrollControlActive: boolean;
}

const ScrollTriggered3DContext = createContext<ScrollTriggered3DContext | null>(null);

/**
 * Hook to access scroll-triggered 3D state
 */
export const useScrollTriggered3D = (): ScrollTriggered3DContext => {
  const context = useContext(ScrollTriggered3DContext);
  if (!context) {
    throw new Error('useScrollTriggered3D must be used within ScrollTriggered3DProvider');
  }
  return context;
};

/**
 * Get performance-appropriate 3D scroll configuration
 */
function getScrollTriggered3DConfig(): ScrollTriggered3DConfig {
  // Use the same detection as other components for consistency
  const isMobile = typeof window !== 'undefined' && 
    (window.innerWidth <= 768 || 
     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  
  // Basic WebGL capability detection
  let deviceLevel: 'high' | 'medium' | 'low' = 'medium';
  
  if (typeof window !== 'undefined') {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (gl && gl instanceof WebGLRenderingContext) {
      const renderer = gl.getParameter(gl.RENDERER);
      
      // Basic performance heuristics
      if (!isMobile && (
        renderer.includes('NVIDIA') || 
        renderer.includes('AMD') || 
        renderer.includes('Intel HD') && window.devicePixelRatio >= 2
      )) {
        deviceLevel = 'high';
      } else if (isMobile || renderer.includes('Intel')) {
        deviceLevel = 'low';
      }
    } else {
      deviceLevel = 'low';
    }
  }
  
  // High-performance configuration
  if (deviceLevel === 'high') {
    return {
      enableScrollAnimations: true,
      scrollSensitivity: 1.0,
      transitionSpeed: 0.02,
      manualControlPriority: true,
      cameraSmoothness: 0.05,
      nodeAnimationIntensity: 1.0,
      deviceOptimization: 'high'
    };
  }
  
  // Medium-performance configuration  
  if (deviceLevel === 'medium') {
    return {
      enableScrollAnimations: true,
      scrollSensitivity: 0.7,
      transitionSpeed: 0.04,
      manualControlPriority: true,
      cameraSmoothness: 0.08,
      nodeAnimationIntensity: 0.7,
      deviceOptimization: 'medium'
    };
  }
  
  // Low-performance/mobile configuration
  return {
    enableScrollAnimations: false, // Disable scroll animations on low-end devices
    scrollSensitivity: 0.3,
    transitionSpeed: 0.1,
    manualControlPriority: true,
    cameraSmoothness: 0.15,
    nodeAnimationIntensity: 0.3,
    deviceOptimization: 'low'
  };
}

/**
 * Camera position calculator based on scroll state
 */
class ScrollCameraCalculator {
  private basePosition: THREE.Vector3;
  private baseTarget: THREE.Vector3;
  private config: ScrollTriggered3DConfig;
  
  constructor(config: ScrollTriggered3DConfig) {
    this.config = config;
    this.basePosition = new THREE.Vector3(0, 0, 20);
    this.baseTarget = new THREE.Vector3(0, 0, 0);
  }
  
  calculateCameraPosition(scrollProgress: number, sectionProgress: number): {
    position: THREE.Vector3;
    target: THREE.Vector3;
  } {
    if (!this.config.enableScrollAnimations) {
      return {
        position: this.basePosition.clone(),
        target: this.baseTarget.clone()
      };
    }
    
    // Create smooth camera movement based on scroll progress
    const scrollOffset = scrollProgress * this.config.scrollSensitivity;
    const sectionOffset = sectionProgress * Math.PI * 0.5; // 90-degree rotation over section
    
    // Calculate new camera position with smooth orbital movement
    const radius = 20 + scrollOffset * 5; // Zoom in/out based on scroll
    const azimuth = sectionOffset; // Rotate around Y-axis
    const elevation = Math.PI * 0.3 + sectionProgress * 0.2; // Slight vertical movement
    
    const newPosition = new THREE.Vector3(
      radius * Math.sin(azimuth) * Math.cos(elevation),
      radius * Math.sin(elevation),
      radius * Math.cos(azimuth) * Math.cos(elevation)
    );
    
    // Target stays mostly centered but can shift slightly
    const newTarget = new THREE.Vector3(
      Math.sin(sectionOffset * 0.5) * 2,
      sectionProgress * 3 - 1.5, // Move target up/down through section
      0
    );
    
    return {
      position: newPosition,
      target: newTarget
    };
  }
  
  setBasePositions(position: THREE.Vector3, target: THREE.Vector3): void {
    this.basePosition.copy(position);
    this.baseTarget.copy(target);
  }
}

/**
 * Node animation calculator for scroll-triggered effects
 */
class ScrollNodeAnimator {
  private config: ScrollTriggered3DConfig;
  
  constructor(config: ScrollTriggered3DConfig) {
    this.config = config;
  }
  
  calculateNodeTransform(
    nodeId: string,
    baseTransform: NodeTransform,
    scrollProgress: number,
    sectionProgress: number
  ): {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: number;
    opacity: number;
  } {
    if (!this.config.enableScrollAnimations) {
      return {
        position: baseTransform.position || new THREE.Vector3(0, 0, 0),
        rotation: baseTransform.rotation || new THREE.Euler(0, 0, 0),
        scale: baseTransform.scale || 1,
        opacity: baseTransform.opacity || 1
      };
    }
    
    const intensity = this.config.nodeAnimationIntensity;
    const time = performance.now() * 0.001; // Time-based animation
    
    // Create unique animation offsets for each node
    const nodeHash = this.hashString(nodeId);
    const timeOffset = (nodeHash % 100) / 100; // Unique time offset per node
    
    // Calculate enhanced transformations
    const basePos = baseTransform.position || new THREE.Vector3(0, 0, 0);
    const animatedPosition = basePos.clone();
    
    // Add scroll-triggered floating motion
    animatedPosition.y += Math.sin((time + timeOffset * Math.PI * 2) * 0.5) * 0.2 * intensity;
    animatedPosition.x += Math.cos((time + timeOffset * Math.PI * 2) * 0.3) * 0.1 * intensity;
    
    // Add scroll-based position shifts
    animatedPosition.y += sectionProgress * 1.5 * intensity;
    
    // Enhanced rotation based on scroll progress
    const baseRot = baseTransform.rotation || new THREE.Euler(0, 0, 0);
    const animatedRotation = new THREE.Euler(
      baseRot.x + Math.sin(time + timeOffset) * 0.1 * intensity,
      baseRot.y + sectionProgress * Math.PI * 0.5 * intensity, // Main scroll rotation
      baseRot.z + Math.cos(time + timeOffset * 1.5) * 0.05 * intensity
    );
    
    // Progressive scale and opacity reveals
    const revealProgress = Math.max(0, Math.min(1, (sectionProgress - 0.1) / 0.8));
    const scrollScale = (baseTransform.scale || 1) * (0.8 + revealProgress * 0.4); // Scale up as revealed
    const scrollOpacity = (baseTransform.opacity || 1) * (0.3 + revealProgress * 0.7); // Fade in as revealed
    
    return {
      position: animatedPosition,
      rotation: animatedRotation,
      scale: scrollScale,
      opacity: scrollOpacity
    };
  }
  
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}

/**
 * Main ScrollTriggered3D Provider Component
 */
interface ScrollTriggered3DProviderProps {
  children: React.ReactNode;
  sectionId?: string;
  enableScrollAnimations?: boolean;
}

export function ScrollTriggered3DProvider({
  children,
  sectionId = 'architecture',
  enableScrollAnimations = true
}: ScrollTriggered3DProviderProps) {
  const { scrollState } = useScrollController();
  const { metrics } = usePerformanceMonitor(true, false);
  
  // Configuration and calculators
  const config = useMemo(() => {
    const baseConfig = getScrollTriggered3DConfig();
    return {
      ...baseConfig,
      enableScrollAnimations: baseConfig.enableScrollAnimations && enableScrollAnimations
    };
  }, [enableScrollAnimations]);
  
  const cameraCalculator = useRef(new ScrollCameraCalculator(config));
  const nodeAnimator = useRef(new ScrollNodeAnimator(config));
  
  // Animation state
  const [animationState, setAnimationState] = useState<ThreeDAnimationState>({
    cameraPosition: new THREE.Vector3(0, 0, 20),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    nodeTransforms: new Map(),
    lightingIntensity: 1.0,
    isManualControl: false,
    lastInteractionTime: 0
  });
  
  // Node registry for scroll animations
  const nodeRegistry = useRef<Map<string, NodeTransform>>(new Map());
  
  // Performance monitoring for scroll + 3D
  const performanceState = useRef({
    lastFrameTime: performance.now(),
    frameCount: 0,
    performanceWarningShown: false
  });
  
  // Manual control timeout for returning to scroll control
  const manualControlTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  /**
   * Register a 3D node for scroll animation
   */
  const registerNode = useCallback((nodeId: string, initialTransform: NodeTransform) => {
    nodeRegistry.current.set(nodeId, initialTransform);
  }, []);
  
  /**
   * Update a node's transform manually (for compatibility with existing code)
   */
  const updateNodeTransform = useCallback((nodeId: string, transform: NodeTransform) => {
    setAnimationState(prev => {
      const newTransforms = new Map(prev.nodeTransforms);
      newTransforms.set(nodeId, transform);
      return { ...prev, nodeTransforms: newTransforms };
    });
  }, []);
  
  /**
   * Set manual control state (called by OrbitControls)
   */
  const setManualControl = useCallback((isManual: boolean) => {
    setAnimationState(prev => ({
      ...prev,
      isManualControl: isManual,
      lastInteractionTime: isManual ? performance.now() : prev.lastInteractionTime
    }));
    
    // Set timeout to return to scroll control
    if (isManual) {
      if (manualControlTimeoutRef.current) {
        clearTimeout(manualControlTimeoutRef.current);
      }
      manualControlTimeoutRef.current = setTimeout(() => {
        setAnimationState(prev => ({ ...prev, isManualControl: false }));
      }, 3000); // Return to scroll control after 3 seconds of inactivity
    }
  }, []);
  
  /**
   * Determine if scroll control should be active
   */
  const isScrollControlActive = useMemo(() => {
    if (!config.enableScrollAnimations) return false;
    if (animationState.isManualControl) return false;
    if (scrollState.section !== sectionId) return false;
    return true;
  }, [config.enableScrollAnimations, animationState.isManualControl, scrollState.section, sectionId]);
  
  /**
   * Update animation state based on scroll progress
   */
  useEffect(() => {
    if (!isScrollControlActive) return;
    
    const performanceStart = performance.now();
    
    // Calculate new camera position
    const cameraData = cameraCalculator.current.calculateCameraPosition(
      scrollState.scrollProgress,
      scrollState.sectionProgress
    );
    
    // Calculate node transforms
    const newNodeTransforms = new Map();
    nodeRegistry.current.forEach((baseTransform, nodeId) => {
      const nodeTransform = nodeAnimator.current.calculateNodeTransform(
        nodeId,
        baseTransform,
        scrollState.scrollProgress,
        scrollState.sectionProgress
      );
      newNodeTransforms.set(nodeId, nodeTransform);
    });
    
    // Update animation state
    setAnimationState(prev => ({
      ...prev,
      cameraPosition: cameraData.position,
      cameraTarget: cameraData.target,
      nodeTransforms: newNodeTransforms,
      lightingIntensity: 0.8 + scrollState.sectionProgress * 0.4 // Brighter as we progress
    }));
    
    // Performance monitoring
    const performanceEnd = performance.now();
    const frameDuration = performanceEnd - performanceStart;
    
    performanceState.current.frameCount++;
    
    // Warn if frame processing is too slow
    if (frameDuration > 16 && !performanceState.current.performanceWarningShown) {
      console.warn(`[ScrollTriggered3D] Slow frame processing: ${frameDuration.toFixed(2)}ms`);
      performanceState.current.performanceWarningShown = true;
    }
    
    // Performance metrics integration
    if (metrics && metrics.fps < 30 && config.deviceOptimization === 'high') {
      console.warn('[ScrollTriggered3D] Performance degradation detected, consider reducing animation intensity');
    }
    
  }, [scrollState, isScrollControlActive, metrics, config.deviceOptimization]);
  
  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    const currentNodeRegistry = nodeRegistry.current;
    return () => {
      if (manualControlTimeoutRef.current) {
        clearTimeout(manualControlTimeoutRef.current);
      }
      currentNodeRegistry.clear();
    };
  }, []);
  
  const contextValue: ScrollTriggered3DContext = {
    animationState,
    config,
    registerNode,
    updateNodeTransform,
    setManualControl,
    isScrollControlActive
  };
  
  return (
    <ScrollTriggered3DContext.Provider value={contextValue}>
      {children}
    </ScrollTriggered3DContext.Provider>
  );
}

/**
 * Hook for integrating with existing OrbitControls
 */
export function useScrollOrbitControls() {
  const { setManualControl, isScrollControlActive, animationState, config } = useScrollTriggered3D();
  
  const handleControlStart = useCallback(() => {
    setManualControl(true);
  }, [setManualControl]);
  
  const handleControlEnd = useCallback(() => {
    // Don't immediately end manual control - let the timeout handle it
  }, []);
  
  const shouldApplyScrollTransforms = !animationState.isManualControl && isScrollControlActive;
  
  return {
    onStart: handleControlStart,
    onEnd: handleControlEnd,
    shouldApplyScrollTransforms,
    scrollCameraPosition: animationState.cameraPosition,
    scrollCameraTarget: animationState.cameraTarget,
    transitionSpeed: config.transitionSpeed
  };
}

/**
 * Hook for scroll-triggered node animations
 */
export function useScrollNodeAnimation(nodeId: string, initialTransform?: NodeTransform) {
  const { registerNode, animationState, isScrollControlActive } = useScrollTriggered3D();
  
  // Register node on mount
  useEffect(() => {
    if (initialTransform) {
      registerNode(nodeId, initialTransform);
    }
  }, [nodeId, initialTransform, registerNode]);
  
  const nodeTransform = animationState.nodeTransforms.get(nodeId);
  const shouldAnimate = isScrollControlActive && nodeTransform;
  
  return {
    shouldAnimate,
    transform: nodeTransform,
    lightingIntensity: animationState.lightingIntensity
  };
}

export default ScrollTriggered3DProvider;