/**
 * TechnicalStorytellingScroll Component - Phase 3.2 Day 3
 * 
 * Purpose: Professional scroll hijacking system for controlled narrative pacing
 * and cinematic technical storytelling with enterprise-grade polish.
 * 
 * Features:
 * - Smooth scroll hijacking with natural momentum preservation
 * - Section-based storytelling with professional transitions
 * - Keyboard navigation support for accessibility
 * - Performance-optimized scroll interpolation
 * - Integration with existing ScrollController infrastructure
 * - Client presentation mode for demonstrations
 */

'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useScrollController } from './ScrollController';
// Performance monitoring available for future enhancements
import { isMobileDevice } from '../../lib/webgl-detection';
import styles from './TechnicalStorytellingScroll.module.css';

/**
 * Storytelling scroll configuration
 */
export interface StorytellingScrollConfig {
  enableScrollHijacking: boolean;
  sectionTransitionSpeed: number;
  smoothingFactor: number;
  keyboardNavigation: boolean;
  accessibilityMode: boolean;
  momentumPreservation: boolean;
  presentationMode: boolean;
}

/**
 * Scroll interpolation states
 */
interface ScrollInterpolation {
  current: number;
  target: number;
  velocity: number;
  isAnimating: boolean;
  lastUpdateTime: number;
}

/**
 * Story section definition
 */
interface StorySection {
  id: string;
  title: string;
  description: string;
  scrollPosition: number;
  duration: number; // Time to spend in this section (ms)
  focusElements?: string[]; // CSS selectors for elements to highlight
  cameraPosition?: { x: number; y: number; z: number };
  parallaxIntensity?: number;
}

/**
 * Technical storytelling hook for section-based narrative control
 */
export function useTechnicalStorytellingScroll(
  sections: StorySection[],
  config?: Partial<StorytellingScrollConfig>
) {
  const defaultConfig: StorytellingScrollConfig = {
    enableScrollHijacking: true,
    sectionTransitionSpeed: 1000, // ms
    smoothingFactor: 0.1,
    keyboardNavigation: true,
    accessibilityMode: false,
    momentumPreservation: true,
    presentationMode: false
  };

  const finalConfig = { ...defaultConfig, ...config };
  const isMobile = isMobileDevice();

  // Disable scroll hijacking on mobile for better UX
  if (isMobile) {
    finalConfig.enableScrollHijacking = false;
    finalConfig.momentumPreservation = false;
  }

  const { scrollState, scrollToSection } = useScrollController();
  // Performance monitoring handled by global performance monitor

  const interpolationRef = useRef<ScrollInterpolation>({
    current: 0,
    target: 0,
    velocity: 0,
    isAnimating: false,
    lastUpdateTime: 0
  });

  const animationIdRef = useRef<number | null>(null);
  const isScrollHijackedRef = useRef(false);
  const [currentStorySection, setCurrentStorySection] = useState<StorySection | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  /**
   * Smooth scroll interpolation with momentum preservation
   */
  const interpolateScroll = useCallback(() => {
    if (!finalConfig.enableScrollHijacking) return;

    const frameStart = performance.now();
    const interpolation = interpolationRef.current;
    const deltaTime = frameStart - interpolation.lastUpdateTime;

    if (deltaTime < 16) return; // Limit to 60fps max

    const distance = interpolation.target - interpolation.current;
    const dampingFactor = finalConfig.smoothingFactor;

    // Apply smooth interpolation
    interpolation.velocity = interpolation.velocity * 0.9 + distance * dampingFactor;
    interpolation.current += interpolation.velocity;

    // Check if animation is complete
    if (Math.abs(distance) < 1 && Math.abs(interpolation.velocity) < 0.1) {
      interpolation.current = interpolation.target;
      interpolation.velocity = 0;
      interpolation.isAnimating = false;
      setIsTransitioning(false);
      return;
    }

    // Update scroll position
    if (isScrollHijackedRef.current) {
      window.scrollTo(0, interpolation.current);
    }

    interpolation.lastUpdateTime = frameStart;
    interpolation.isAnimating = true;

    // Performance tracking handled by performance monitor

    // Continue animation
    animationIdRef.current = requestAnimationFrame(interpolateScroll);
  }, [finalConfig.enableScrollHijacking, finalConfig.smoothingFactor]);

  /**
   * Navigate to specific story section with smooth transition
   */
  const navigateToSection = useCallback((sectionId: string, immediate = false) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    setCurrentStorySection(section);

    if (immediate || !finalConfig.enableScrollHijacking) {
      // Immediate navigation
      scrollToSection(sectionId, 'auto');
      return;
    }

    // Smooth hijacked scroll
    setIsTransitioning(true);
    isScrollHijackedRef.current = true;

    const interpolation = interpolationRef.current;
    interpolation.target = section.scrollPosition;
    interpolation.lastUpdateTime = performance.now();

    if (!interpolation.isAnimating) {
      interpolation.current = window.scrollY;
      interpolateScroll();
    }

    // Focus elements if specified
    if (section.focusElements) {
      setTimeout(() => {
        section.focusElements?.forEach(selector => {
          const element = document.querySelector(selector);
          if (element) {
            element.classList.add(styles.storyFocus);
            setTimeout(() => {
              element.classList.remove(styles.storyFocus);
            }, section.duration);
          }
        });
      }, finalConfig.sectionTransitionSpeed * 0.5);
    }

    // Release hijack after transition
    setTimeout(() => {
      isScrollHijackedRef.current = false;
      setIsTransitioning(false);
    }, finalConfig.sectionTransitionSpeed);

  }, [sections, finalConfig.enableScrollHijacking, finalConfig.sectionTransitionSpeed, scrollToSection, interpolateScroll]);

  /**
   * Keyboard navigation support
   */
  useEffect(() => {
    if (!finalConfig.keyboardNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle navigation keys
      if (!['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(event.key)) {
        return;
      }

      // Don't interfere with form inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const currentIndex = sections.findIndex(s => s.id === currentStorySection?.id);

      switch (event.key) {
        case 'ArrowDown':
        case 'PageDown':
          event.preventDefault();
          if (currentIndex < sections.length - 1) {
            navigateToSection(sections[currentIndex + 1].id);
          }
          break;
        case 'ArrowUp':
        case 'PageUp':
          event.preventDefault();
          if (currentIndex > 0) {
            navigateToSection(sections[currentIndex - 1].id);
          }
          break;
        case 'Home':
          event.preventDefault();
          navigateToSection(sections[0].id);
          break;
        case 'End':
          event.preventDefault();
          navigateToSection(sections[sections.length - 1].id);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [finalConfig.keyboardNavigation, sections, currentStorySection, navigateToSection]);

  /**
   * Auto-detect current story section based on scroll position
   */
  useEffect(() => {
    if (isTransitioning) return; // Don't update during transitions

    const currentScrollY = scrollState.scrollY;
    const newSection = sections.find(section => {
      const sectionElement = document.getElementById(section.id);
      if (!sectionElement) return false;

      const rect = sectionElement.getBoundingClientRect();
      const elementTop = rect.top + currentScrollY;
      const elementCenter = elementTop + rect.height / 2;
      const viewportCenter = currentScrollY + window.innerHeight / 2;

      return Math.abs(elementCenter - viewportCenter) < rect.height / 2;
    });

    if (newSection && newSection.id !== currentStorySection?.id) {
      setCurrentStorySection(newSection);
    }
  }, [scrollState.scrollY, sections, currentStorySection, isTransitioning]);

  /**
   * Cleanup animation on unmount
   */
  useEffect(() => {
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      isScrollHijackedRef.current = false;
    };
  }, []);

  return {
    currentSection: currentStorySection,
    navigateToSection,
    isTransitioning,
    config: finalConfig,
    // Progress through all sections (0-1)
    storyProgress: sections.length > 0 ? 
      (sections.findIndex(s => s.id === currentStorySection?.id) + 1) / sections.length : 0
  };
}

/**
 * Story Navigation Component
 */
interface StoryNavigationProps {
  sections: StorySection[];
  currentSectionId?: string;
  onNavigate: (sectionId: string) => void;
  className?: string;
  compact?: boolean;
}

export function StoryNavigation({ 
  sections, 
  currentSectionId, 
  onNavigate, 
  className = '',
  compact = false 
}: StoryNavigationProps) {
  return (
    <nav className={`${styles.storyNavigation} ${compact ? styles.compact : ''} ${className}`} 
         aria-label="Technical story sections">
      <ul className={styles.sectionList}>
        {sections.map((section, index) => (
          <li key={section.id} className={styles.sectionItem}>
            <button
              onClick={() => onNavigate(section.id)}
              className={`${styles.sectionButton} ${
                section.id === currentSectionId ? styles.active : ''
              }`}
              aria-current={section.id === currentSectionId ? 'true' : 'false'}
              title={section.description}
            >
              <span className={styles.sectionNumber}>{index + 1}</span>
              <span className={styles.sectionTitle}>{section.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Story Progress Indicator
 */
interface StoryProgressProps {
  progress: number; // 0-1
  currentSection?: StorySection;
  className?: string;
}

export function StoryProgress({ progress, currentSection, className = '' }: StoryProgressProps) {
  return (
    <div className={`${styles.storyProgress} ${className}`} aria-hidden="true">
      <div 
        className={styles.progressBar}
        style={{ transform: `scaleX(${progress})` }}
      />
      {currentSection && (
        <div className={styles.currentSection}>
          <span className={styles.sectionTitle}>{currentSection.title}</span>
          <span className={styles.sectionDescription}>{currentSection.description}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Presentation Mode Controls
 */
interface PresentationControlsProps {
  isPresenting: boolean;
  onTogglePresentation: () => void;
  onNextSection: () => void;
  onPreviousSection: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  className?: string;
}

export function PresentationControls({ 
  isPresenting, 
  onTogglePresentation, 
  onNextSection, 
  onPreviousSection,
  canGoNext,
  canGoPrevious,
  className = '' 
}: PresentationControlsProps) {
  return (
    <div className={`${styles.presentationControls} ${className}`}>
      <button
        onClick={onTogglePresentation}
        className={`${styles.presentationToggle} ${isPresenting ? styles.active : ''}`}
        aria-label={isPresenting ? 'Exit presentation mode' : 'Enter presentation mode'}
      >
        {isPresenting ? '⏹️' : '▶️'}
      </button>
      
      {isPresenting && (
        <div className={styles.navigationControls}>
          <button
            onClick={onPreviousSection}
            disabled={!canGoPrevious}
            className={styles.navButton}
            aria-label="Previous section"
          >
            ⬅️
          </button>
          <button
            onClick={onNextSection}
            disabled={!canGoNext}
            className={styles.navButton}
            aria-label="Next section"
          >
            ➡️
          </button>
        </div>
      )}
    </div>
  );
}

export default useTechnicalStorytellingScroll;