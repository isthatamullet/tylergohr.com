/**
 * ScrollCameraController Component - Phase 3.2 Day 2
 * 
 * Purpose: Enhanced camera control system that smoothly integrates scroll-driven
 * camera movements with existing OrbitControls, providing seamless transitions
 * between manual and automatic camera control.
 * 
 * Features:
 * - Smooth interpolation between scroll-driven and manual camera positions
 * - Intelligent priority system favoring manual control when user interacts
 * - Performance-optimized camera transitions with device-specific smoothness
 * - Maintains compatibility with existing OrbitControls configuration
 * - Professional camera movements for storytelling through scroll progression
 */

'use client';

import React, { useRef, useCallback, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollTriggered3D, useScrollOrbitControls } from './ScrollTriggered3D';
import { useScrollController } from '../ScrollEffects/ScrollController';
import { isMobileDevice } from '../../lib/webgl-detection';

/**
 * Camera section configuration for storytelling
 */
export interface CameraSection {
  id: string;
  name: string;
  scrollRange: { start: number; end: number }; // 0-1 scroll progress within section
  cameraPosition: THREE.Vector3;
  cameraTarget: THREE.Vector3;
  transitionCurve: 'linear' | 'easeInOut' | 'easeIn' | 'easeOut';
  focusNodes?: string[]; // Node IDs to highlight during this section
  description: string;
}

/**
 * Camera transition state
 */
interface CameraTransitionState {
  isTransitioning: boolean;
  fromPosition: THREE.Vector3;
  fromTarget: THREE.Vector3;
  toPosition: THREE.Vector3;
  toTarget: THREE.Vector3;
  progress: number;
  startTime: number;
  duration: number;
}

/**
 * Enhanced OrbitControls with scroll integration
 */
interface ScrollOrbitControlsProps {
  enableManualControl?: boolean;
  onCameraChange?: (position: THREE.Vector3, target: THREE.Vector3) => void;
}

export function ScrollOrbitControls({ 
  enableManualControl = true,
  onCameraChange 
}: ScrollOrbitControlsProps) {
  const { camera } = useThree();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const { animationState } = useScrollTriggered3D();
  const { 
    onStart, 
    onEnd, 
    shouldApplyScrollTransforms, 
    scrollCameraPosition, 
    scrollCameraTarget,
    transitionSpeed 
  } = useScrollOrbitControls();
  
  // Transition state for smooth interpolation
  const transitionState = useRef<CameraTransitionState>({
    isTransitioning: false,
    fromPosition: new THREE.Vector3(),
    fromTarget: new THREE.Vector3(),
    toPosition: new THREE.Vector3(),
    toTarget: new THREE.Vector3(),
    progress: 0,
    startTime: 0,
    duration: 1000 // 1 second transition
  });
  
  // Previous frame state for smooth interpolation
  const previousState = useRef({
    position: new THREE.Vector3(),
    target: new THREE.Vector3(),
    isFirstFrame: true
  });
  
  // Configure OrbitControls based on device and performance
  const controlsConfig = useMemo(() => {
    const isMobile = isMobileDevice();
    const cameraDistance = isMobile ? 15 : 20;
    
    return {
      enablePan: !isMobile && enableManualControl,
      enableZoom: enableManualControl,
      enableRotate: enableManualControl,
      autoRotate: false, // Disable auto-rotation when scroll control is active
      autoRotateSpeed: 0.5,
      minDistance: cameraDistance * 0.5,
      maxDistance: cameraDistance * 2,
      maxPolarAngle: Math.PI * 0.8,
      minPolarAngle: Math.PI * 0.1,
      dampingFactor: 0.05,
      enableDamping: true,
      zoomSpeed: isMobile ? 0.3 : 0.5,
      rotateSpeed: isMobile ? 0.3 : 0.5,
      panSpeed: 0.8,
      target: new THREE.Vector3(0, 0, 0)
    };
  }, [enableManualControl]);
  
  /**
   * Easing functions for smooth camera transitions
   */
  const easingFunctions = {
    linear: (t: number) => t,
    easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeIn: (t: number) => t * t,
    easeOut: (t: number) => t * (2 - t)
  };
  
  /**
   * Start a smooth camera transition
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const startTransition = useCallback((
    targetPosition: THREE.Vector3,
    targetLookAt: THREE.Vector3,
    duration: number = 1000
  ) => {
    const currentPosition = camera.position.clone();
    const currentTarget = controlsRef.current?.target?.clone() || new THREE.Vector3(0, 0, 0);
    
    transitionState.current = {
      isTransitioning: true,
      fromPosition: currentPosition,
      fromTarget: currentTarget,
      toPosition: targetPosition.clone(),
      toTarget: targetLookAt.clone(),
      progress: 0,
      startTime: performance.now(),
      duration
    };
  }, [camera]);
  
  /**
   * Update camera position with smooth interpolation
   */
  useFrame(() => {
    if (!shouldApplyScrollTransforms) return;
    
    const currentTime = performance.now();
    
    // Handle smooth transitions
    if (transitionState.current.isTransitioning) {
      const elapsed = currentTime - transitionState.current.startTime;
      const progress = Math.min(elapsed / transitionState.current.duration, 1);
      const easedProgress = easingFunctions.easeInOut(progress);
      
      // Interpolate position and target
      const newPosition = transitionState.current.fromPosition.clone().lerp(
        transitionState.current.toPosition,
        easedProgress
      );
      const newTarget = transitionState.current.fromTarget.clone().lerp(
        transitionState.current.toTarget,
        easedProgress
      );
      
      // Apply interpolated values
      camera.position.copy(newPosition);
      if (controlsRef.current) {
        controlsRef.current.target.copy(newTarget);
        controlsRef.current.update();
      }
      
      // End transition when complete
      if (progress >= 1) {
        transitionState.current.isTransitioning = false;
      }
      
      // Notify parent of camera change
      if (onCameraChange) {
        onCameraChange(newPosition, newTarget);
      }
      
      return;
    }
    
    // Apply scroll-driven camera movement with smooth interpolation
    if (previousState.current.isFirstFrame) {
      // First frame - set directly
      camera.position.copy(scrollCameraPosition);
      if (controlsRef.current) {
        controlsRef.current.target.copy(scrollCameraTarget);
        controlsRef.current.update();
      }
      
      previousState.current.position.copy(scrollCameraPosition);
      previousState.current.target.copy(scrollCameraTarget);
      previousState.current.isFirstFrame = false;
    } else {
      // Smooth interpolation between previous and target positions
      const lerpFactor = Math.min(transitionSpeed * 60 / 1000, 1); // Normalize for 60fps
      
      // Interpolate camera position
      const newPosition = previousState.current.position.clone().lerp(
        scrollCameraPosition,
        lerpFactor
      );
      const newTarget = previousState.current.target.clone().lerp(
        scrollCameraTarget,
        lerpFactor
      );
      
      // Apply interpolated values
      camera.position.copy(newPosition);
      if (controlsRef.current) {
        controlsRef.current.target.copy(newTarget);
        controlsRef.current.update();
      }
      
      // Update previous state
      previousState.current.position.copy(newPosition);
      previousState.current.target.copy(newTarget);
      
      // Notify parent of camera change
      if (onCameraChange) {
        onCameraChange(newPosition, newTarget);
      }
    }
  });
  
  /**
   * Handle manual control events
   */
  const handleControlStart = useCallback(() => {
    onStart();
    
    // Stop any ongoing transitions
    transitionState.current.isTransitioning = false;
    
    // Reset first frame flag to prevent jumps when returning to scroll control
    previousState.current.isFirstFrame = true;
  }, [onStart]);
  
  const handleControlEnd = useCallback(() => {
    onEnd();
  }, [onEnd]);
  
  const handleControlChange = useCallback(() => {
    if (animationState.isManualControl && onCameraChange) {
      onCameraChange(camera.position, controlsRef.current?.target || new THREE.Vector3(0, 0, 0));
    }
  }, [animationState.isManualControl, camera.position, onCameraChange]);
  
  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={controlsConfig.enablePan}
      enableZoom={controlsConfig.enableZoom}
      enableRotate={controlsConfig.enableRotate}
      autoRotate={controlsConfig.autoRotate}
      autoRotateSpeed={controlsConfig.autoRotateSpeed}
      minDistance={controlsConfig.minDistance}
      maxDistance={controlsConfig.maxDistance}
      maxPolarAngle={controlsConfig.maxPolarAngle}
      minPolarAngle={controlsConfig.minPolarAngle}
      dampingFactor={controlsConfig.dampingFactor}
      enableDamping={controlsConfig.enableDamping}
      zoomSpeed={controlsConfig.zoomSpeed}
      rotateSpeed={controlsConfig.rotateSpeed}
      panSpeed={controlsConfig.panSpeed}
      target={controlsConfig.target}
      onStart={handleControlStart}
      onEnd={handleControlEnd}
      onChange={handleControlChange}
    />
  );
}

/**
 * Camera section manager for architectural storytelling
 */
export function useCameraSections() {
  // Define camera sections for architectural storytelling
  const cameraSections: CameraSection[] = useMemo(() => [
    {
      id: 'overview',
      name: 'System Overview',
      scrollRange: { start: 0, end: 0.2 },
      cameraPosition: new THREE.Vector3(0, 8, 25),
      cameraTarget: new THREE.Vector3(0, 0, 0),
      transitionCurve: 'easeInOut',
      description: 'Complete enterprise architecture overview showing all system layers'
    },
    {
      id: 'frontend-focus',
      name: 'Frontend Architecture', 
      scrollRange: { start: 0.2, end: 0.4 },
      cameraPosition: new THREE.Vector3(-12, 6, 15),
      cameraTarget: new THREE.Vector3(-6, 4, 0),
      transitionCurve: 'easeInOut',
      focusNodes: ['react-frontend', 'mobile-app'],
      description: 'Frontend layer highlighting React applications and mobile interfaces'
    },
    {
      id: 'api-gateway',
      name: 'API Gateway & Services',
      scrollRange: { start: 0.4, end: 0.6 },
      cameraPosition: new THREE.Vector3(5, 8, 12),
      cameraTarget: new THREE.Vector3(0, 2, 0),
      transitionCurve: 'easeInOut',
      focusNodes: ['api-gateway', 'microservice-auth', 'microservice-data'],
      description: 'API layer showcasing microservices architecture and authentication'
    },
    {
      id: 'data-layer',
      name: 'Data & Storage',
      scrollRange: { start: 0.6, end: 0.8 },
      cameraPosition: new THREE.Vector3(15, 4, 8),
      cameraTarget: new THREE.Vector3(6, 1, 0),
      transitionCurve: 'easeInOut',
      focusNodes: ['main-database', 'user-database', 'redis-cache'],
      description: 'Data persistence layer with PostgreSQL and Redis caching'
    },
    {
      id: 'cloud-infrastructure',
      name: 'Cloud Infrastructure',
      scrollRange: { start: 0.8, end: 1.0 },
      cameraPosition: new THREE.Vector3(0, -8, 18),
      cameraTarget: new THREE.Vector3(0, -2, 2),
      transitionCurve: 'easeInOut',
      focusNodes: ['cloud-run', 'cdn-assets', 'monitoring'],
      description: 'Cloud infrastructure with Google Cloud Run and monitoring systems'
    }
  ], []);
  
  /**
   * Get camera section based on scroll progress
   */
  const getCameraSection = useCallback((sectionProgress: number): CameraSection | null => {
    return cameraSections.find(section => 
      sectionProgress >= section.scrollRange.start && 
      sectionProgress <= section.scrollRange.end
    ) || null;
  }, [cameraSections]);
  
  /**
   * Get interpolated camera position within a section
   */
  const getInterpolatedCameraPosition = useCallback((
    section: CameraSection
  ): { position: THREE.Vector3; target: THREE.Vector3 } => {
    // For single sections, return the defined position
    // For future enhancement, this could interpolate between multiple positions within a section
    return {
      position: section.cameraPosition.clone(),
      target: section.cameraTarget.clone()
    };
  }, []);
  
  return {
    cameraSections,
    getCameraSection,
    getInterpolatedCameraPosition
  };
}

/**
 * Hook for section-based camera control
 */
export function useScrollCameraSection() {
  const { animationState, config } = useScrollTriggered3D();
  const { getCameraSection, getInterpolatedCameraPosition } = useCameraSections();
  const { scrollState } = useScrollController();
  
  // Get current camera section and position
  const currentSection = useMemo(() => {
    if (!config.enableScrollAnimations) return null;
    return getCameraSection(scrollState.sectionProgress);
  }, [config.enableScrollAnimations, getCameraSection, scrollState.sectionProgress]);
  
  const targetCameraPosition = useMemo(() => {
    if (!currentSection) {
      return {
        position: new THREE.Vector3(0, 0, 20),
        target: new THREE.Vector3(0, 0, 0)
      };
    }
    
    return getInterpolatedCameraPosition(currentSection);
  }, [currentSection, getInterpolatedCameraPosition]);
  
  return {
    currentSection,
    targetCameraPosition,
    isActive: !animationState.isManualControl && config.enableScrollAnimations
  };
}

export default ScrollOrbitControls;