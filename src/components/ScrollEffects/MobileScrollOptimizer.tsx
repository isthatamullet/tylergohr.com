/**
 * MobileScrollOptimizer Component - Phase 3.2 Day 3
 * 
 * Purpose: Resolves mobile 3D interaction obstruction issues by optimizing
 * control panel layouts and maximizing 3D interaction viewport access.
 * 
 * Features:
 * - Collapsible control panel design for maximum 3D interaction area
 * - Enhanced touch gesture recognition for sphere manipulation
 * - Bottom-anchored controls for better thumb accessibility
 * - Performance-optimized rendering for mobile GPUs
 * - Full viewport utilization for 3D content
 * - Intelligent control hiding during active 3D interaction
 */

'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// useScrollController available for future enhancements
import { isMobileDevice } from '../../lib/webgl-detection';
import styles from './MobileScrollOptimizer.module.css';

/**
 * Mobile optimization configuration
 */
export interface MobileOptimizationConfig {
  enableControlMinimization: boolean;
  fullViewportAccess: boolean;
  performanceScaling: 'high' | 'medium' | 'low';
  touchGestureOptimization: boolean;
  autoHideControls: boolean;
  autoHideTimeout: number; // ms
  thumbZoneOptimization: boolean;
  adaptiveControlLayout: boolean;
}

/**
 * Touch interaction state tracking
 */
interface TouchInteractionState {
  isActive: boolean;
  touchCount: number;
  lastTouchTime: number;
  gestureType: 'none' | 'pan' | 'rotate' | 'zoom';
  touchStartPositions: { x: number; y: number }[];
}

/**
 * Control panel state management
 */
interface ControlPanelState {
  isMinimized: boolean;
  isAutoHidden: boolean;
  position: 'top' | 'bottom' | 'floating';
  height: number;
  opacity: number;
}

/**
 * Mobile viewport optimization utilities
 */
class MobileViewportOptimizer {
  private static instance: MobileViewportOptimizer | null = null;
  private viewportHeight: number = 0;
  private safeAreaInsets = { top: 0, bottom: 0, left: 0, right: 0 };
  private callbacks = new Set<() => void>();

  private constructor() {
    this.updateViewport();
    this.initializeListeners();
  }

  public static getInstance(): MobileViewportOptimizer {
    if (!MobileViewportOptimizer.instance) {
      MobileViewportOptimizer.instance = new MobileViewportOptimizer();
    }
    return MobileViewportOptimizer.instance;
  }

  private initializeListeners(): void {
    if (typeof window === 'undefined') return;

    // Handle viewport changes
    window.addEventListener('resize', this.updateViewport.bind(this));
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.updateViewport(), 150); // Delay for orientation change
    });

    // Handle safe area changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', this.updateSafeAreas.bind(this));
    this.updateSafeAreas();
  }

  private updateViewport(): void {
    if (typeof window === 'undefined') return;

    // Use visualViewport API if available for more accurate mobile dimensions
    if (window.visualViewport) {
      this.viewportHeight = window.visualViewport.height;
    } else {
      this.viewportHeight = window.innerHeight;
    }

    this.notifyCallbacks();
  }

  private updateSafeAreas(): void {
    if (typeof window === 'undefined') return;

    // Get CSS safe area insets
    const computedStyle = getComputedStyle(document.documentElement);
    this.safeAreaInsets = {
      top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0', 10),
      bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0', 10),
      left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0', 10),
      right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0', 10)
    };

    this.notifyCallbacks();
  }

  public getOptimalViewport(): { width: number; height: number; safeAreas: { top: number; bottom: number; left: number; right: number } } {
    return {
      width: window.innerWidth,
      height: this.viewportHeight,
      safeAreas: this.safeAreaInsets
    };
  }

  public addCallback(callback: () => void): void {
    this.callbacks.add(callback);
  }

  public removeCallback(callback: () => void): void {
    this.callbacks.delete(callback);
  }

  private notifyCallbacks(): void {
    this.callbacks.forEach(callback => callback());
  }
}

/**
 * Touch gesture analyzer for 3D interaction optimization
 */
class TouchGestureAnalyzer {
  private touchStartTime = 0;
  private initialTouchDistance = 0;
  private initialTouchCenter = { x: 0, y: 0 };

  public analyzeTouches(touches: React.TouchList): TouchInteractionState {
    const touchCount = touches.length;
    const currentTime = performance.now();

    if (touchCount === 0) {
      return {
        isActive: false,
        touchCount: 0,
        lastTouchTime: currentTime,
        gestureType: 'none',
        touchStartPositions: []
      };
    }

    const touchPositions: { x: number; y: number }[] = [];
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      touchPositions.push({
        x: touch.clientX,
        y: touch.clientY
      });
    }

    let gestureType: TouchInteractionState['gestureType'] = 'none';

    if (touchCount === 1) {
      gestureType = 'rotate'; // Single finger for rotation
    } else if (touchCount === 2) {
      // Two fingers could be zoom or pan
      const touch1 = touches[0];
      const touch2 = touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );

      if (this.initialTouchDistance === 0) {
        this.initialTouchDistance = distance;
        gestureType = 'pan';
      } else {
        const distanceChange = Math.abs(distance - this.initialTouchDistance);
        gestureType = distanceChange > 10 ? 'zoom' : 'pan';
      }
    }

    return {
      isActive: true,
      touchCount,
      lastTouchTime: currentTime,
      gestureType,
      touchStartPositions: touchPositions
    };
  }

  public reset(): void {
    this.touchStartTime = 0;
    this.initialTouchDistance = 0;
    this.initialTouchCenter = { x: 0, y: 0 };
  }
}

/**
 * Get performance-appropriate mobile optimization configuration
 */
function getMobileOptimizationConfig(): MobileOptimizationConfig {
  const isMobile = isMobileDevice();
  
  if (!isMobile) {
    // Desktop - minimal optimization needed
    return {
      enableControlMinimization: false,
      fullViewportAccess: true,
      performanceScaling: 'high',
      touchGestureOptimization: false,
      autoHideControls: false,
      autoHideTimeout: 3000,
      thumbZoneOptimization: false,
      adaptiveControlLayout: false
    };
  }

  // Mobile optimization
  return {
    enableControlMinimization: true,
    fullViewportAccess: true,
    performanceScaling: 'medium',
    touchGestureOptimization: true,
    autoHideControls: true,
    autoHideTimeout: 2000,
    thumbZoneOptimization: true,
    adaptiveControlLayout: true
  };
}

/**
 * Mobile-optimized control panel component
 */
interface OptimizedControlPanelProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
  children: React.ReactNode;
  className?: string;
}

export function OptimizedControlPanel({ 
  isMinimized, 
  onToggleMinimize, 
  children, 
  className = '' 
}: OptimizedControlPanelProps) {
  const [config] = useState(getMobileOptimizationConfig);
  const viewport = MobileViewportOptimizer.getInstance().getOptimalViewport();

  if (!config.enableControlMinimization) {
    // Desktop - return children as-is
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`${styles.optimizedControlPanel} ${isMinimized ? styles.minimized : ''} ${className}`}>
      <button 
        className={styles.toggleButton}
        onClick={onToggleMinimize}
        aria-label={isMinimized ? 'Show controls' : 'Hide controls'}
        style={{
          bottom: `${viewport.safeAreas.bottom + 20}px`
        }}
      >
        {isMinimized ? '⚙️' : '✕'}
      </button>
      
      <div 
        className={styles.controlContent}
        style={{
          maxHeight: isMinimized ? '0' : `${viewport.height * 0.4}px`,
          paddingBottom: `${viewport.safeAreas.bottom}px`
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * 3D interaction area component with mobile optimization
 */
interface Optimized3DInteractionAreaProps {
  children: React.ReactNode;
  onTouchInteraction?: (state: TouchInteractionState) => void;
  className?: string;
}

export function Optimized3DInteractionArea({ 
  children, 
  onTouchInteraction,
  className = '' 
}: Optimized3DInteractionAreaProps) {
  const [config] = useState(getMobileOptimizationConfig);
  const [touchState, setTouchState] = useState<TouchInteractionState>({
    isActive: false,
    touchCount: 0,
    lastTouchTime: 0,
    gestureType: 'none',
    touchStartPositions: []
  });

  const gestureAnalyzer = useRef(new TouchGestureAnalyzer());
  const interactionAreaRef = useRef<HTMLDivElement>(null);

  /**
   * Touch event handlers
   */
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (!config.touchGestureOptimization) return;

    const newState = gestureAnalyzer.current.analyzeTouches(event.touches);
    setTouchState(newState);
    onTouchInteraction?.(newState);
  }, [config.touchGestureOptimization, onTouchInteraction]);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (!config.touchGestureOptimization) return;

    const newState = gestureAnalyzer.current.analyzeTouches(event.touches);
    setTouchState(newState);
    onTouchInteraction?.(newState);
  }, [config.touchGestureOptimization, onTouchInteraction]);

  const handleTouchEnd = useCallback(() => {
    if (!config.touchGestureOptimization) return;

    gestureAnalyzer.current.reset();
    const newState: TouchInteractionState = {
      isActive: false,
      touchCount: 0,
      lastTouchTime: performance.now(),
      gestureType: 'none',
      touchStartPositions: []
    };
    setTouchState(newState);
    onTouchInteraction?.(newState);
  }, [config.touchGestureOptimization, onTouchInteraction]);

  const viewport = MobileViewportOptimizer.getInstance().getOptimalViewport();

  return (
    <div 
      ref={interactionAreaRef}
      className={`${styles.optimized3DArea} ${className}`}
      style={{
        height: config.fullViewportAccess ? `${viewport.height}px` : 'auto',
        paddingTop: `${viewport.safeAreas.top}px`,
        paddingBottom: `${viewport.safeAreas.bottom}px`,
        paddingLeft: `${viewport.safeAreas.left}px`,
        paddingRight: `${viewport.safeAreas.right}px`
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      data-touch-active={touchState.isActive}
      data-gesture-type={touchState.gestureType}
    >
      {children}
      
      {/* Touch gesture indicator */}
      {config.touchGestureOptimization && touchState.isActive && (
        <div className={styles.gestureIndicator}>
          {touchState.gestureType === 'rotate' && '🔄 Rotate'}
          {touchState.gestureType === 'zoom' && '🔍 Zoom'}
          {touchState.gestureType === 'pan' && '✋ Pan'}
        </div>
      )}
    </div>
  );
}

/**
 * Main mobile scroll optimizer hook
 */
export function useMobileScrollOptimizer() {
  const [config] = useState(getMobileOptimizationConfig);
  const [controlPanelState, setControlPanelState] = useState<ControlPanelState>({
    isMinimized: config.enableControlMinimization,
    isAutoHidden: false,
    position: 'bottom',
    height: 0,
    opacity: 1
  });

  const [touchInteractionState, setTouchInteractionState] = useState<TouchInteractionState>({
    isActive: false,
    touchCount: 0,
    lastTouchTime: 0,
    gestureType: 'none',
    touchStartPositions: []
  });

  // Scroll state available but not currently used
  const autoHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const viewportOptimizer = useMemo(() => MobileViewportOptimizer.getInstance(), []);

  /**
   * Auto-hide controls during 3D interaction
   */
  useEffect(() => {
    if (!config.autoHideControls) return;

    if (touchInteractionState.isActive) {
      // Hide controls during active touch interaction
      setControlPanelState(prev => ({ 
        ...prev, 
        isAutoHidden: true,
        opacity: 0.3
      }));

      // Clear existing timeout
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
      }
    } else {
      // Show controls after interaction ends
      autoHideTimeoutRef.current = setTimeout(() => {
        setControlPanelState(prev => ({ 
          ...prev, 
          isAutoHidden: false,
          opacity: 1
        }));
      }, config.autoHideTimeout);
    }

    return () => {
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
      }
    };
  }, [touchInteractionState.isActive, config.autoHideControls, config.autoHideTimeout]);

  /**
   * Viewport optimization callback
   */
  const handleViewportChange = useCallback(() => {
    const viewport = viewportOptimizer.getOptimalViewport();
    
    // Adjust control panel position based on viewport
    if (config.adaptiveControlLayout) {
      const newPosition = viewport.height < 600 ? 'floating' : 'bottom';
      setControlPanelState(prev => ({ ...prev, position: newPosition }));
    }
  }, [config.adaptiveControlLayout, viewportOptimizer]);

  /**
   * Register viewport change callback
   */
  useEffect(() => {
    viewportOptimizer.addCallback(handleViewportChange);
    return () => viewportOptimizer.removeCallback(handleViewportChange);
  }, [viewportOptimizer, handleViewportChange]);

  /**
   * Control panel actions
   */
  const toggleControlMinimization = useCallback(() => {
    setControlPanelState(prev => ({ 
      ...prev, 
      isMinimized: !prev.isMinimized 
    }));
  }, []);

  const setTouchInteraction = useCallback((state: TouchInteractionState) => {
    setTouchInteractionState(state);
  }, []);

  return {
    config,
    controlPanelState,
    touchInteractionState,
    viewport: viewportOptimizer.getOptimalViewport(),
    toggleControlMinimization,
    setTouchInteraction,
    isOptimized: config.enableControlMinimization
  };
}

/**
 * Performance scaling utilities for mobile 3D
 */
export const MobilePerformanceScaler = {
  getOptimalNodeCount: (baseCount: number, performanceLevel: 'high' | 'medium' | 'low'): number => {
    switch (performanceLevel) {
      case 'high': return baseCount;
      case 'medium': return Math.floor(baseCount * 0.7);
      case 'low': return Math.floor(baseCount * 0.5);
      default: return baseCount;
    }
  },

  getOptimalAnimationSpeed: (baseSpeed: number, performanceLevel: 'high' | 'medium' | 'low'): number => {
    switch (performanceLevel) {
      case 'high': return baseSpeed;
      case 'medium': return baseSpeed * 0.8;
      case 'low': return baseSpeed * 0.6;
      default: return baseSpeed;
    }
  },

  getOptimalParticleCount: (baseCount: number, performanceLevel: 'high' | 'medium' | 'low'): number => {
    switch (performanceLevel) {
      case 'high': return baseCount;
      case 'medium': return Math.floor(baseCount * 0.5);
      case 'low': return Math.floor(baseCount * 0.25);
      default: return baseCount;
    }
  }
};

export default useMobileScrollOptimizer;