/**
 * ScrollController Component - Phase 3.2 Day 1
 * 
 * Purpose: Advanced scroll state management with hardware acceleration
 * for Phase 3 Week 2 advanced scroll effects implementation.
 * 
 * Features:
 * - High-performance scroll position tracking with RAF optimization
 * - Device-specific scroll configuration for optimal performance  
 * - Integration with existing Intersection Observer patterns
 * - Hardware-accelerated scroll detection for 120fps targets
 * - Scroll velocity and direction tracking for advanced animations
 */

'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useScroll, MotionValue } from 'framer-motion';
import { isMobileDevice, detectWebGLSupport } from '../../lib/webgl-detection';

/**
 * Scroll state interface for advanced scroll tracking
 */
export interface ScrollState {
  scrollY: number;
  scrollProgress: number; // 0-1 for current viewport
  velocity: number;
  direction: 'up' | 'down' | 'idle';
  isScrolling: boolean;
  section: string | null; // Current section ID
  sectionProgress: number; // 0-1 progress within current section
}

/**
 * Enhanced scroll configuration based on device capabilities
 */
export interface ScrollConfig {
  enableHardwareAcceleration: boolean;
  targetFPS: number;
  velocityThreshold: number;
  scrollingTimeout: number;
  useRAF: boolean; // RequestAnimationFrame optimization
  enableInertia: boolean; // Smooth scroll inertia
  devicePerformanceLevel: 'high' | 'medium' | 'low';
}

/**
 * Scroll controller context for sharing state across components
 */
interface ScrollControllerContext {
  scrollState: ScrollState;
  scrollConfig: ScrollConfig;
  scrollY: MotionValue<number>;
  scrollProgress: MotionValue<number>;
  registerSection: (id: string, element: HTMLElement) => void;
  unregisterSection: (id: string) => void;
  scrollToSection: (id: string, behavior?: ScrollBehavior) => void;
}

const ScrollContext = createContext<ScrollControllerContext | null>(null);

/**
 * Hook to access scroll controller state and methods
 */
export const useScrollController = (): ScrollControllerContext => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScrollController must be used within ScrollControllerProvider');
  }
  return context;
};

/**
 * Performance-optimized scroll configuration based on device capabilities
 */
function getScrollConfig(): ScrollConfig {
  const isMobile = isMobileDevice();
  const webglCapabilities = detectWebGLSupport();
  
  // Determine device performance level
  let devicePerformanceLevel: 'high' | 'medium' | 'low' = 'medium';
  
  if (webglCapabilities.performanceLevel === 'high' && !isMobile) {
    devicePerformanceLevel = 'high';
  } else if (webglCapabilities.performanceLevel === 'low' || isMobile) {
    devicePerformanceLevel = 'low';
  }

  // High-performance desktop configuration
  if (devicePerformanceLevel === 'high') {
    return {
      enableHardwareAcceleration: true,
      targetFPS: 120,
      velocityThreshold: 0.5,
      scrollingTimeout: 150,
      useRAF: true,
      enableInertia: true,
      devicePerformanceLevel: 'high'
    };
  }
  
  // Medium-performance configuration
  if (devicePerformanceLevel === 'medium') {
    return {
      enableHardwareAcceleration: true,
      targetFPS: 60,
      velocityThreshold: 1,
      scrollingTimeout: 200,
      useRAF: true,
      enableInertia: true,
      devicePerformanceLevel: 'medium'
    };
  }
  
  // Low-performance/mobile configuration
  return {
    enableHardwareAcceleration: false,
    targetFPS: 30,
    velocityThreshold: 2,
    scrollingTimeout: 300,
    useRAF: false,
    enableInertia: false,
    devicePerformanceLevel: 'low'
  };
}

/**
 * Section registration and tracking utilities
 */
interface SectionData {
  id: string;
  element: HTMLElement;
  bounds: {
    top: number;
    bottom: number;
    height: number;
  };
}

/**
 * Advanced scroll velocity calculator with smoothing
 */
class ScrollVelocityTracker {
  private positions: { time: number; y: number }[] = [];
  private readonly maxSamples = 5;
  
  update(scrollY: number): number {
    const now = performance.now();
    this.positions.push({ time: now, y: scrollY });
    
    // Keep only recent samples
    if (this.positions.length > this.maxSamples) {
      this.positions.shift();
    }
    
    // Calculate velocity from recent samples
    if (this.positions.length < 2) return 0;
    
    const oldest = this.positions[0];
    const newest = this.positions[this.positions.length - 1];
    const timeDelta = newest.time - oldest.time;
    const yDelta = newest.y - oldest.y;
    
    return timeDelta > 0 ? yDelta / timeDelta : 0;
  }
  
  reset(): void {
    this.positions = [];
  }
}

/**
 * Main ScrollController Provider Component
 */
interface ScrollControllerProviderProps {
  children: React.ReactNode;
  enableAdvancedFeatures?: boolean;
}

export function ScrollControllerProvider({ 
  children, 
  enableAdvancedFeatures = true 
}: ScrollControllerProviderProps) {
  // Scroll configuration based on device capabilities
  const scrollConfig = useMemo(() => getScrollConfig(), []);
  
  // Framer Motion scroll values for hardware acceleration
  const { scrollY, scrollYProgress } = useScroll();
  
  // Section tracking state
  const sectionsRef = useRef<Map<string, SectionData>>(new Map());
  
  // Scroll state management
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollY: 0,
    scrollProgress: 0,
    velocity: 0,
    direction: 'idle',
    isScrolling: false,
    section: null,
    sectionProgress: 0
  });
  
  // Velocity tracker for smooth scroll animations
  const velocityTracker = useRef(new ScrollVelocityTracker());
  const scrollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);
  const rafId = useRef<number | null>(null);

  /**
   * Update scroll state with performance optimization
   */
  const updateScrollState = useCallback((currentScrollY: number, currentProgress: number) => {
    const velocity = velocityTracker.current.update(currentScrollY);
    const deltaY = currentScrollY - lastScrollY.current;
    
    let direction: 'up' | 'down' | 'idle' = 'idle';
    if (Math.abs(deltaY) > 1) {
      direction = deltaY > 0 ? 'down' : 'up';
    }
    
    // Determine current section and progress within section
    let currentSection: string | null = null;
    let sectionProgress = 0;
    
    const viewport = {
      top: currentScrollY,
      bottom: currentScrollY + window.innerHeight,
      center: currentScrollY + window.innerHeight / 2
    };
    
    // Find the section that contains the viewport center
    for (const [id, sectionData] of sectionsRef.current) {
      if (viewport.center >= sectionData.bounds.top && viewport.center <= sectionData.bounds.bottom) {
        currentSection = id;
        // Calculate progress within this section (0 = top, 1 = bottom)
        const progressInSection = (viewport.center - sectionData.bounds.top) / sectionData.bounds.height;
        sectionProgress = Math.max(0, Math.min(1, progressInSection));
        break;
      }
    }
    
    setScrollState(prev => ({
      ...prev,
      scrollY: currentScrollY,
      scrollProgress: currentProgress,
      velocity: velocity,
      direction: direction,
      isScrolling: true,
      section: currentSection,
      sectionProgress: sectionProgress
    }));
    
    lastScrollY.current = currentScrollY;
    
    // Reset scrolling state after timeout
    if (scrollingTimeoutRef.current) {
      clearTimeout(scrollingTimeoutRef.current);
    }
    
    scrollingTimeoutRef.current = setTimeout(() => {
      setScrollState(prev => ({
        ...prev,
        isScrolling: false,
        direction: 'idle'
      }));
      velocityTracker.current.reset();
    }, scrollConfig.scrollingTimeout);
    
  }, [scrollConfig.scrollingTimeout]);

  /**
   * Optimized scroll event handler with RAF
   */
  const handleScrollUpdate = useCallback(() => {
    if (scrollConfig.useRAF) {
      rafId.current = requestAnimationFrame(() => {
        updateScrollState(scrollY.get(), scrollYProgress.get());
      });
    } else {
      updateScrollState(scrollY.get(), scrollYProgress.get());
    }
  }, [updateScrollState, scrollY, scrollYProgress, scrollConfig.useRAF]);

  /**
   * Section registration methods
   */
  const registerSection = useCallback((id: string, element: HTMLElement) => {
    const bounds = {
      top: element.offsetTop,
      bottom: element.offsetTop + element.offsetHeight,
      height: element.offsetHeight
    };
    
    const sectionData: SectionData = { id, element, bounds };
    
    sectionsRef.current.set(id, sectionData);
    
    // Update bounds on resize
    const updateBounds = () => {
      const newBounds = {
        top: element.offsetTop,
        bottom: element.offsetTop + element.offsetHeight,
        height: element.offsetHeight
      };
      
      const existingSection = sectionsRef.current.get(id);
      if (existingSection) {
        existingSection.bounds = newBounds;
      }
    };
    
    window.addEventListener('resize', updateBounds);
    
    // Store cleanup function
    const cleanup = () => {
      window.removeEventListener('resize', updateBounds);
    };
    
    // Store cleanup in element for later removal
    (element as HTMLElement & { __scrollControllerCleanup?: () => void }).__scrollControllerCleanup = cleanup;
    
  }, []);

  const unregisterSection = useCallback((id: string) => {
    const sectionData = sectionsRef.current.get(id);
    if (sectionData) {
      const elementWithCleanup = sectionData.element as HTMLElement & { __scrollControllerCleanup?: () => void };
      if (elementWithCleanup.__scrollControllerCleanup) {
        elementWithCleanup.__scrollControllerCleanup();
      }
    }
    
    sectionsRef.current.delete(id);
  }, []);

  /**
   * Smooth scroll to section with performance optimization
   */
  const scrollToSection = useCallback((id: string, behavior: ScrollBehavior = 'smooth') => {
    const sectionData = sectionsRef.current.get(id);
    if (!sectionData) {
      console.warn(`ScrollController: Section "${id}" not found`);
      return;
    }
    
    // Use performance-appropriate scrolling method
    if (scrollConfig.enableInertia && behavior === 'smooth') {
      // Hardware-accelerated smooth scroll
      window.scrollTo({
        top: sectionData.bounds.top - 80, // Account for navigation
        behavior: 'smooth'
      });
    } else {
      // Instant scroll for low-performance devices
      window.scrollTo(0, sectionData.bounds.top - 80);
    }
  }, [scrollConfig.enableInertia]);

  /**
   * Initialize scroll tracking with performance monitoring
   */
  useEffect(() => {
    if (!enableAdvancedFeatures) return;
    
    // Subscribe to Framer Motion scroll updates
    const unsubscribeY = scrollY.on('change', handleScrollUpdate);
    const unsubscribeProgress = scrollYProgress.on('change', handleScrollUpdate);
    
    // Initial state update
    handleScrollUpdate();
    
    // Performance monitoring for scroll events
    if (scrollConfig.devicePerformanceLevel === 'high') {
      console.log(`[ScrollController] Initialized with ${scrollConfig.targetFPS}fps target`);
    }
    
    return () => {
      unsubscribeY();
      unsubscribeProgress();
      
      if (scrollingTimeoutRef.current) {
        clearTimeout(scrollingTimeoutRef.current);
      }
      
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleScrollUpdate, scrollY, scrollYProgress, enableAdvancedFeatures, scrollConfig]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    const currentSectionsRef = sectionsRef.current;
    return () => {
      // Clean up all section listeners
      currentSectionsRef.forEach((sectionData) => {
        const elementWithCleanup = sectionData.element as HTMLElement & { __scrollControllerCleanup?: () => void };
        if (elementWithCleanup.__scrollControllerCleanup) {
          elementWithCleanup.__scrollControllerCleanup();
        }
      });
      currentSectionsRef.clear();
    };
  }, []);

  const contextValue: ScrollControllerContext = {
    scrollState,
    scrollConfig,
    scrollY,
    scrollProgress: scrollYProgress,
    registerSection,
    unregisterSection,
    scrollToSection
  };

  return (
    <ScrollContext.Provider value={contextValue}>
      {children}
    </ScrollContext.Provider>
  );
}

/**
 * Hook for section-specific scroll tracking
 */
export function useScrollSection(sectionId: string, elementRef: React.RefObject<HTMLElement>) {
  const { registerSection, unregisterSection, scrollState } = useScrollController();
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    registerSection(sectionId, element);
    
    return () => {
      unregisterSection(sectionId);
    };
  }, [sectionId, elementRef, registerSection, unregisterSection]);
  
  const isCurrentSection = scrollState.section === sectionId;
  const sectionProgress = isCurrentSection ? scrollState.sectionProgress : 0;
  
  return {
    isCurrentSection,
    sectionProgress,
    isVisible: sectionProgress > 0 && sectionProgress < 1
  };
}

/**
 * Hook for scroll-triggered animations with performance optimization
 */
export function useScrollAnimation(
  trigger: 'enter' | 'exit' | 'progress',
  threshold = 0.1
) {
  const { scrollState } = useScrollController();
  const [isTriggered, setIsTriggered] = useState(false);
  
  useEffect(() => {
    switch (trigger) {
      case 'enter':
        if (scrollState.sectionProgress >= threshold && !isTriggered) {
          setIsTriggered(true);
        }
        break;
      case 'exit':
        if (scrollState.sectionProgress >= (1 - threshold) && !isTriggered) {
          setIsTriggered(true);
        }
        break;
      case 'progress':
        setIsTriggered(scrollState.sectionProgress >= threshold);
        break;
    }
  }, [scrollState.sectionProgress, trigger, threshold, isTriggered]);
  
  return {
    isTriggered,
    progress: scrollState.sectionProgress,
    velocity: scrollState.velocity,
    direction: scrollState.direction
  };
}

export default ScrollControllerProvider;