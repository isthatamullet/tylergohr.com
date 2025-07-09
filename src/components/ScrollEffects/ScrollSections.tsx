/**
 * ScrollSections Component - Phase 3.2 Day 3
 * 
 * Purpose: Intelligent section-based scroll management with smooth snapping
 * and professional navigation for enterprise technical storytelling.
 * 
 * Features:
 * - Section-based scroll snapping with momentum preservation
 * - Intelligent navigation between architecture layers
 * - Accessibility-compliant section announcements
 * - Performance-optimized intersection observer management
 * - Integration with existing ScrollController and storytelling systems
 * - Professional presentation mode for client demonstrations
 */

'use client';

import React, { createContext, useContext, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useScrollController } from './ScrollController';
// Performance monitoring available for future enhancements
import { useTechnicalStorytellingScroll } from './TechnicalStorytellingScroll';
import { isMobileDevice } from '../../lib/webgl-detection';
// Styles imported but not used yet - will be used for component styling
// import styles from './ScrollSections.module.css';

/**
 * Section configuration interface
 */
export interface ScrollSectionConfig {
  enableSnapping: boolean;
  snapThreshold: number; // 0-1, percentage of section visible to trigger snap
  snapDuration: number; // ms
  debounceDelay: number; // ms
  enableKeyboardNavigation: boolean;
  enableWheelNavigation: boolean;
  announceSection: boolean; // Screen reader announcements
  respectReducedMotion: boolean;
}

/**
 * Architecture section definition with enhanced metadata
 */
export interface ArchitectureSection {
  id: string;
  title: string;
  description: string;
  scrollRange: { start: number; end: number };
  focusNodes: string[]; // IDs of 3D nodes to highlight
  cameraSection?: string; // Reference to camera section from Day 2
  content: {
    headline: string;
    details: string[];
    businessValue: string;
    technologies: string[];
  };
  accessibility: {
    announcement: string;
    landmark: string;
  };
  parallaxIntensity?: number;
  storyDuration?: number; // Time to spend in this section (ms)
}

/**
 * Section tracking state
 */
interface SectionTrackingState {
  activeSection: ArchitectureSection | null;
  visibleSections: Set<string>;
  sectionProgress: Map<string, number>;
  isSnapping: boolean;
  lastSnapTime: number;
}

/**
 * Scroll sections context
 */
interface ScrollSectionsContext {
  sections: ArchitectureSection[];
  trackingState: SectionTrackingState;
  config: ScrollSectionConfig;
  navigateToSection: (sectionId: string, smooth?: boolean) => void;
  snapToNearestSection: () => void;
  registerSectionElement: (sectionId: string, element: HTMLElement) => void;
  unregisterSectionElement: (sectionId: string) => void;
}

const ScrollSectionsContext = createContext<ScrollSectionsContext | null>(null);

/**
 * Hook to access scroll sections functionality
 */
export const useScrollSections = (): ScrollSectionsContext => {
  const context = useContext(ScrollSectionsContext);
  if (!context) {
    throw new Error('useScrollSections must be used within ScrollSectionsProvider');
  }
  return context;
};

/**
 * Get performance-appropriate section configuration
 */
function getScrollSectionConfig(): ScrollSectionConfig {
  const isMobile = isMobileDevice();
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    enableSnapping: !isMobile && !prefersReducedMotion,
    snapThreshold: 0.6, // Snap when 60% of section is visible
    snapDuration: 800, // ms
    debounceDelay: 100, // ms
    enableKeyboardNavigation: true,
    enableWheelNavigation: !isMobile,
    announceSection: true,
    respectReducedMotion: true
  };
}

/**
 * Architecture section definitions for technical expertise storytelling
 */
export const architectureSections: ArchitectureSection[] = [
  {
    id: 'architecture-overview',
    title: 'Architecture Overview',
    description: 'High-level enterprise system architecture with modern technology integration',
    scrollRange: { start: 0, end: 0.15 },
    focusNodes: ['react-frontend', 'api-gateway', 'database-cluster'],
    content: {
      headline: 'Enterprise-Grade Architecture',
      details: [
        'Modern React frontend with TypeScript for type safety',
        'Microservices API architecture with intelligent gateway routing',
        'High-availability database clustering with automated failover',
        'Google Cloud Platform integration with auto-scaling capabilities'
      ],
      businessValue: 'Scalable foundation supporting millions of users with 99.9% uptime',
      technologies: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'Google Cloud']
    },
    accessibility: {
      announcement: 'Enterprise architecture overview section displaying system components',
      landmark: 'region'
    },
    parallaxIntensity: 0.8,
    storyDuration: 3000
  },
  {
    id: 'frontend-excellence',
    title: 'Frontend Excellence',
    description: 'React and TypeScript mastery with cutting-edge CSS and design patterns',
    scrollRange: { start: 0.15, end: 0.35 },
    focusNodes: ['react-frontend', 'cdn', 'monitoring'],
    cameraSection: 'frontend-focus',
    content: {
      headline: 'Modern Frontend Architecture',
      details: [
        'React 19 with Server Components for optimal performance',
        'TypeScript strict mode ensuring enterprise-grade type safety',
        'CSS Modules with advanced features like Container Queries',
        'Performance monitoring achieving 90+ Lighthouse scores',
        'Responsive design with WCAG 2.1 AA accessibility compliance'
      ],
      businessValue: 'User experiences that convert visitors to customers while maintaining accessibility',
      technologies: ['React 19', 'TypeScript', 'CSS Modules', 'Framer Motion', 'Next.js 14']
    },
    accessibility: {
      announcement: 'Frontend architecture section focusing on React and TypeScript implementation',
      landmark: 'region'
    },
    parallaxIntensity: 1.0,
    storyDuration: 4000
  },
  {
    id: 'backend-systems',
    title: 'Backend & API Systems',
    description: 'Production-grade Node.js backend with complex business logic and integrations',
    scrollRange: { start: 0.35, end: 0.55 },
    focusNodes: ['api-gateway', 'auth-service', 'database-cluster', 'cache-layer'],
    cameraSection: 'backend-focus',
    content: {
      headline: 'Robust Backend Infrastructure',
      details: [
        'Node.js with Express handling complex business logic',
        'JWT authentication with OAuth 2.0 integration',
        'PostgreSQL with Prisma ORM for type-safe database access',
        'Redis caching layer improving response times by 40%',
        'Real-time features using Socket.IO with horizontal scaling'
      ],
      businessValue: 'Reliable backend systems processing millions of requests with enterprise security',
      technologies: ['Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Redis', 'Socket.IO']
    },
    accessibility: {
      announcement: 'Backend systems section displaying API and database architecture',
      landmark: 'region'
    },
    parallaxIntensity: 0.9,
    storyDuration: 4000
  },
  {
    id: 'cloud-infrastructure',
    title: 'Cloud Infrastructure',
    description: 'Google Cloud Platform deployment with CI/CD automation and monitoring',
    scrollRange: { start: 0.55, end: 0.75 },
    focusNodes: ['cloud-storage', 'monitoring', 'cdn'],
    cameraSection: 'cloud-focus',
    content: {
      headline: 'Cloud-Native Architecture',
      details: [
        'Google Cloud Run containerized deployment with auto-scaling',
        'Cloud SQL PostgreSQL with automated backups and failover',
        'GitHub Actions CI/CD pipeline with automated testing',
        'Cloud Monitoring and Error Reporting for 24/7 observability',
        'CDN integration for global content delivery optimization'
      ],
      businessValue: 'Enterprise-grade cloud infrastructure scaling from startup to millions of users',
      technologies: ['Google Cloud', 'Docker', 'GitHub Actions', 'Cloud SQL', 'Cloud Run']
    },
    accessibility: {
      announcement: 'Cloud infrastructure section showing deployment and monitoring systems',
      landmark: 'region'
    },
    parallaxIntensity: 0.7,
    storyDuration: 3500
  },
  {
    id: 'performance-optimization',
    title: 'Performance & Monitoring',
    description: 'Advanced optimization techniques and real-time monitoring systems',
    scrollRange: { start: 0.75, end: 0.9 },
    focusNodes: ['monitoring', 'cache-layer', 'cdn'],
    cameraSection: 'performance-focus',
    content: {
      headline: 'Performance Excellence',
      details: [
        'Core Web Vitals optimization achieving 90+ scores',
        'Advanced caching strategies reducing load times by 60%',
        'Real-time performance monitoring with alerting',
        'Database query optimization and connection pooling',
        'Bundle optimization and code splitting for faster initial loads'
      ],
      businessValue: 'Fast, reliable applications that provide excellent user experience and SEO benefits',
      technologies: ['Lighthouse', 'Redis', 'CDN', 'Performance API', 'Monitoring']
    },
    accessibility: {
      announcement: 'Performance optimization section displaying monitoring and caching systems',
      landmark: 'region'
    },
    parallaxIntensity: 0.8,
    storyDuration: 3000
  },
  {
    id: 'integration-patterns',
    title: 'Integration Patterns',
    description: 'Enterprise system connections and third-party API integrations',
    scrollRange: { start: 0.9, end: 1.0 },
    focusNodes: ['api-gateway', 'auth-service', 'external-apis'],
    cameraSection: 'integration-focus',
    content: {
      headline: 'Seamless System Integration',
      details: [
        'RESTful API design with comprehensive documentation',
        'Third-party integrations: Stripe, QuickBooks, Gmail APIs',
        'Webhook handling for real-time data synchronization',
        'Error handling and retry mechanisms for reliable integration',
        'API versioning and backward compatibility strategies'
      ],
      businessValue: 'Seamless connections between systems enabling automated workflows and data flow',
      technologies: ['REST APIs', 'Webhooks', 'OAuth 2.0', 'Stripe', 'QuickBooks API']
    },
    accessibility: {
      announcement: 'Integration patterns section showing API connections and third-party services',
      landmark: 'region'
    },
    parallaxIntensity: 0.6,
    storyDuration: 3000
  }
];

/**
 * Section intersection observer manager
 */
class SectionIntersectionManager {
  private observer: IntersectionObserver | null = null;
  private sectionElements = new Map<string, HTMLElement>();
  private callbacks = new Set<(entries: IntersectionObserverEntry[]) => void>();

  constructor(private config: ScrollSectionConfig) {
    this.initializeObserver();
  }

  private initializeObserver(): void {
    if (typeof window === 'undefined') return;

    this.observer = new IntersectionObserver(
      (entries) => {
        this.callbacks.forEach(callback => callback(entries));
      },
      {
        root: null,
        rootMargin: '-10% 0px -10% 0px', // Only trigger when section is well within viewport
        threshold: [0, 0.25, 0.5, 0.75, 1.0] // Multiple thresholds for precise tracking
      }
    );
  }

  public observeSection(sectionId: string, element: HTMLElement): void {
    if (!this.observer) return;

    this.sectionElements.set(sectionId, element);
    this.observer.observe(element);
  }

  public unobserveSection(sectionId: string): void {
    if (!this.observer) return;

    const element = this.sectionElements.get(sectionId);
    if (element) {
      this.observer.unobserve(element);
      this.sectionElements.delete(sectionId);
    }
  }

  public addCallback(callback: (entries: IntersectionObserverEntry[]) => void): void {
    this.callbacks.add(callback);
  }

  public removeCallback(callback: (entries: IntersectionObserverEntry[]) => void): void {
    this.callbacks.delete(callback);
  }

  public cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.sectionElements.clear();
    this.callbacks.clear();
  }
}

/**
 * Main ScrollSections Provider Component
 */
interface ScrollSectionsProviderProps {
  children: React.ReactNode;
  sections?: ArchitectureSection[];
  config?: Partial<ScrollSectionConfig>;
  enableStorytellingMode?: boolean;
}

export function ScrollSectionsProvider({ 
  children, 
  sections = architectureSections, 
  config = {},
  enableStorytellingMode = true
}: ScrollSectionsProviderProps) {
  const finalConfig = useMemo(() => ({ ...getScrollSectionConfig(), ...config }), [config]);
  
  const { scrollToSection: baseScrollToSection } = useScrollController();
  
  // Storytelling integration - always call hook but conditionally use result
  const storytellingHookResult = useTechnicalStorytellingScroll(
    sections.map(section => ({
      id: section.id,
      title: section.title,
      description: section.description,
      scrollPosition: typeof window !== 'undefined' ? section.scrollRange.start * document.documentElement.scrollHeight : 0,
      duration: section.storyDuration || 3000,
      focusElements: section.focusNodes.map(id => `[data-node-id="${id}"]`),
      parallaxIntensity: section.parallaxIntensity
    })),
    { enableScrollHijacking: finalConfig.enableSnapping }
  );
  
  const storytellingHook = enableStorytellingMode ? storytellingHookResult : null;

  // Section tracking state
  const [trackingState, setTrackingState] = useState<SectionTrackingState>({
    activeSection: null,
    visibleSections: new Set(),
    sectionProgress: new Map(),
    isSnapping: false,
    lastSnapTime: 0
  });

  // Intersection observer manager
  const intersectionManagerRef = useRef<SectionIntersectionManager | null>(null);
  const snapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Handle intersection observer entries
   */
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {

    setTrackingState(prev => {
      const newState = { ...prev };
      const newVisibleSections = new Set(prev.visibleSections);
      const newSectionProgress = new Map(prev.sectionProgress);

      entries.forEach(entry => {
        const sectionId = entry.target.getAttribute('data-section-id');
        if (!sectionId) return;

        if (entry.isIntersecting) {
          newVisibleSections.add(sectionId);
          newSectionProgress.set(sectionId, entry.intersectionRatio);
        } else {
          newVisibleSections.delete(sectionId);
          newSectionProgress.delete(sectionId);
        }
      });

      // Determine the most visible section as active
      let mostVisibleSection: ArchitectureSection | null = null;
      let maxVisibility = 0;

      sections.forEach((section: ArchitectureSection) => {
        const visibility = newSectionProgress.get(section.id) || 0;
        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          mostVisibleSection = section;
        }
      });

      // Announce section changes for accessibility
      if (finalConfig.announceSection && 
          mostVisibleSection && 
          (mostVisibleSection as ArchitectureSection).id !== (prev.activeSection as ArchitectureSection | null)?.id) {
        
        // Create or update ARIA live region
        let liveRegion = document.getElementById('section-announcements');
        if (!liveRegion) {
          liveRegion = document.createElement('div');
          liveRegion.id = 'section-announcements';
          liveRegion.setAttribute('aria-live', 'polite');
          liveRegion.setAttribute('aria-atomic', 'true');
          liveRegion.style.position = 'absolute';
          liveRegion.style.left = '-10000px';
          liveRegion.style.width = '1px';
          liveRegion.style.height = '1px';
          liveRegion.style.overflow = 'hidden';
          document.body.appendChild(liveRegion);
        }
        
        liveRegion.textContent = (mostVisibleSection as ArchitectureSection).accessibility?.announcement || (mostVisibleSection as ArchitectureSection).description;
      }

      newState.visibleSections = newVisibleSections;
      newState.sectionProgress = newSectionProgress;
      newState.activeSection = mostVisibleSection;

      return newState;
    });

    // Performance tracking handled by performance monitor
  }, [sections, finalConfig.announceSection]);

  /**
   * Navigate to specific section
   */
  const navigateToSection = useCallback((sectionId: string, smooth = true) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    setTrackingState(prev => ({ ...prev, isSnapping: true }));

    if (storytellingHook) {
      storytellingHook.navigateToSection(sectionId, !smooth);
    } else {
      baseScrollToSection(sectionId, smooth ? 'smooth' : 'auto');
    }

    // Clear snapping state after transition
    setTimeout(() => {
      setTrackingState(prev => ({ ...prev, isSnapping: false }));
    }, finalConfig.snapDuration);

  }, [sections, storytellingHook, baseScrollToSection, finalConfig.snapDuration]);

  /**
   * Snap to nearest section based on current scroll position
   */
  const snapToNearestSection = useCallback(() => {
    if (!finalConfig.enableSnapping || trackingState.isSnapping) return;

    const now = performance.now();
    if (now - trackingState.lastSnapTime < finalConfig.debounceDelay) return;

    let nearestSection: ArchitectureSection | null = null;
    let minDistance = Infinity;

    sections.forEach((section: ArchitectureSection) => {
      const progress = trackingState.sectionProgress.get(section.id) || 0;
      if (progress >= finalConfig.snapThreshold) {
        const distance = Math.abs(0.5 - progress); // Distance from center
        if (distance < minDistance) {
          minDistance = distance;
          nearestSection = section;
        }
      }
    });

    if (nearestSection && (nearestSection as ArchitectureSection).id !== (trackingState.activeSection as ArchitectureSection | null)?.id) {
      setTrackingState(prev => ({ ...prev, lastSnapTime: now }));
      navigateToSection((nearestSection as ArchitectureSection).id);
    }
  }, [finalConfig, trackingState, sections, navigateToSection]);

  /**
   * Register section element for observation
   */
  const registerSectionElement = useCallback((sectionId: string, element: HTMLElement) => {
    intersectionManagerRef.current?.observeSection(sectionId, element);
  }, []);

  /**
   * Unregister section element
   */
  const unregisterSectionElement = useCallback((sectionId: string) => {
    intersectionManagerRef.current?.unobserveSection(sectionId);
  }, []);

  /**
   * Wheel event handler for section navigation
   */
  const handleWheel = useCallback((event: WheelEvent) => {
    if (!finalConfig.enableWheelNavigation || trackingState.isSnapping) return;

    // Debounce wheel events
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const delta = event.deltaY;
      const threshold = 100; // Minimum wheel delta to trigger navigation

      if (Math.abs(delta) > threshold) {
        if (snapTimeoutRef.current) {
          clearTimeout(snapTimeoutRef.current);
        }

        snapTimeoutRef.current = setTimeout(() => {
          snapToNearestSection();
        }, 150); // Wait for wheel momentum to settle
      }
    }, 50);
  }, [finalConfig.enableWheelNavigation, trackingState.isSnapping, snapToNearestSection]);

  /**
   * Initialize intersection observer and event handlers
   */
  useEffect(() => {
    intersectionManagerRef.current = new SectionIntersectionManager(finalConfig);
    intersectionManagerRef.current.addCallback(handleIntersection);

    if (finalConfig.enableWheelNavigation) {
      window.addEventListener('wheel', handleWheel, { passive: true });
    }

    return () => {
      intersectionManagerRef.current?.cleanup();
      window.removeEventListener('wheel', handleWheel);
      
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [finalConfig, handleIntersection, handleWheel]);

  const contextValue: ScrollSectionsContext = {
    sections,
    trackingState,
    config: finalConfig,
    navigateToSection,
    snapToNearestSection,
    registerSectionElement,
    unregisterSectionElement
  };

  return (
    <ScrollSectionsContext.Provider value={contextValue}>
      {children}
    </ScrollSectionsContext.Provider>
  );
}

/**
 * Hook for individual section components
 */
export function useScrollSection(sectionId: string) {
  const { sections, trackingState, registerSectionElement, unregisterSectionElement } = useScrollSections();
  const elementRef = useRef<HTMLElement>(null);

  const section = sections.find(s => s.id === sectionId);
  const isActive = trackingState.activeSection?.id === sectionId;
  const isVisible = trackingState.visibleSections.has(sectionId);
  const progress = trackingState.sectionProgress.get(sectionId) || 0;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.setAttribute('data-section-id', sectionId);
    registerSectionElement(sectionId, element);

    return () => {
      unregisterSectionElement(sectionId);
    };
  }, [sectionId, registerSectionElement, unregisterSectionElement]);

  return {
    elementRef,
    section,
    isActive,
    isVisible,
    progress,
    trackingState
  };
}

export default ScrollSectionsProvider;