/**
 * ArchitectureScrollSections Component - Phase 3.2 Day 2
 * 
 * Purpose: Section-based scroll management system that coordinates scroll progress
 * with 3D architecture storytelling, providing smooth transitions between different
 * architectural focus areas as the user scrolls through the technical expertise page.
 * 
 * Features:
 * - Dynamic section registration and progress tracking
 * - Professional storytelling flow through architecture layers
 * - Integration with camera sections for coordinated visual narrative
 * - Performance-optimized scroll event handling
 * - Accessibility support with section announcements
 */

'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useScrollController } from '../ScrollEffects/ScrollController';

/**
 * Architecture section configuration
 */
export interface ArchitectureSection {
  id: string;
  title: string;
  description: string;
  scrollRange: { start: number; end: number }; // 0-1 progress within the overall architecture section
  focusNodes: string[]; // Node IDs to highlight during this section
  cameraSection?: string; // Corresponding camera section ID
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
}

/**
 * Section progress state
 */
interface SectionProgressState {
  currentSection: ArchitectureSection | null;
  sectionProgress: number; // 0-1 progress within current section
  previousSection: ArchitectureSection | null;
  transitionProgress: number; // 0-1 progress of transition between sections
  isTransitioning: boolean;
}

/**
 * Context for sharing section state
 */
interface ArchitectureScrollSectionsContext {
  sections: ArchitectureSection[];
  progressState: SectionProgressState;
  registerSection: (element: HTMLElement, sectionId: string) => void;
  unregisterSection: (sectionId: string) => void;
  scrollToSection: (sectionId: string) => void;
  getCurrentFocusNodes: () => string[];
}

const ArchitectureScrollSectionsContext = createContext<ArchitectureScrollSectionsContext | null>(null);

/**
 * Hook to access architecture scroll sections
 */
export const useArchitectureScrollSections = (): ArchitectureScrollSectionsContext => {
  const context = useContext(ArchitectureScrollSectionsContext);
  if (!context) {
    throw new Error('useArchitectureScrollSections must be used within ArchitectureScrollSectionsProvider');
  }
  return context;
};

/**
 * Get predefined architecture sections for storytelling
 */
function getArchitectureSections(): ArchitectureSection[] {
  return [
    {
      id: 'overview',
      title: 'Enterprise Architecture Overview',
      description: 'Complete system architecture showcasing modern enterprise patterns',
      scrollRange: { start: 0, end: 0.2 },
      focusNodes: [], // All nodes visible
      cameraSection: 'overview',
      content: {
        headline: 'Modern Enterprise Architecture',
        details: [
          'Microservices-based architecture with clear separation of concerns',
          'Cloud-native design with auto-scaling and resilience patterns',
          'Security-first approach with enterprise authentication',
          'Performance-optimized with caching and CDN integration'
        ],
        businessValue: 'Scalable, maintainable architecture that grows with your business needs',
        technologies: ['React 19', 'Node.js', 'PostgreSQL', 'Google Cloud Run', 'Redis']
      },
      accessibility: {
        announcement: 'Viewing enterprise architecture overview with all system components',
        landmark: 'System overview section'
      }
    },
    {
      id: 'frontend-layer',
      title: 'Frontend Architecture & User Experience',
      description: 'Modern React applications with advanced state management and animations',
      scrollRange: { start: 0.2, end: 0.4 },
      focusNodes: ['react-frontend', 'mobile-app'],
      cameraSection: 'frontend-focus',
      content: {
        headline: 'User-Facing Applications',
        details: [
          'React 19 with TypeScript for type-safe, performant applications',
          'Advanced component patterns and custom hooks',
          'Framer Motion for smooth, engaging animations',
          'Mobile-first responsive design with WCAG compliance'
        ],
        businessValue: 'Enhanced user experience driving engagement and business growth',
        technologies: ['React 19', 'TypeScript', 'Framer Motion', 'CSS Modules', 'React Native']
      },
      accessibility: {
        announcement: 'Focusing on frontend applications including React web app and mobile application',
        landmark: 'Frontend architecture section'
      }
    },
    {
      id: 'api-services',
      title: 'API Gateway & Microservices',
      description: 'Scalable backend services with authentication and business logic',
      scrollRange: { start: 0.4, end: 0.6 },
      focusNodes: ['api-gateway', 'microservice-auth', 'microservice-data'],
      cameraSection: 'api-gateway',
      content: {
        headline: 'Backend Services & API Management',
        details: [
          'Centralized API gateway with rate limiting and authentication',
          'Microservices architecture with dedicated auth and data services',
          'JWT-based authentication with OAuth 2.0 integration',
          'Business logic separation and data validation layers'
        ],
        businessValue: 'Secure, scalable backend infrastructure supporting complex business requirements',
        technologies: ['Node.js', 'Express', 'JWT', 'OAuth 2.0', 'Prisma ORM']
      },
      accessibility: {
        announcement: 'Examining API gateway and microservices including authentication and data services',
        landmark: 'Backend services section'
      }
    },
    {
      id: 'data-persistence',
      title: 'Data Layer & Storage Solutions',
      description: 'Enterprise data management with PostgreSQL and Redis caching',
      scrollRange: { start: 0.6, end: 0.8 },
      focusNodes: ['main-database', 'user-database', 'redis-cache'],
      cameraSection: 'data-layer',
      content: {
        headline: 'Data Persistence & Caching',
        details: [
          'PostgreSQL 15 with connection pooling and replication',
          'Dedicated user database with encryption and GDPR compliance',
          'Redis caching for session management and performance',
          'Automated backups and disaster recovery procedures'
        ],
        businessValue: 'Reliable data persistence ensuring business continuity and compliance',
        technologies: ['PostgreSQL', 'Redis', 'Connection Pooling', 'Data Encryption', 'Backup Systems']
      },
      accessibility: {
        announcement: 'Reviewing data layer including PostgreSQL databases and Redis caching',
        landmark: 'Data storage section'
      }
    },
    {
      id: 'cloud-infrastructure',
      title: 'Cloud Infrastructure & DevOps',
      description: 'Google Cloud Platform with monitoring and auto-scaling',
      scrollRange: { start: 0.8, end: 1.0 },
      focusNodes: ['cloud-run', 'cdn-assets', 'monitoring', 'analytics-db'],
      cameraSection: 'cloud-infrastructure',
      content: {
        headline: 'Cloud-Native Infrastructure',
        details: [
          'Google Cloud Run with containerized auto-scaling applications',
          'Global CDN for fast content delivery and edge caching',
          'Comprehensive monitoring with Prometheus and Grafana',
          'Analytics platform with BigQuery for business intelligence'
        ],
        businessValue: 'Scalable, cost-effective infrastructure with global reach and 99.9% uptime',
        technologies: ['Google Cloud Run', 'Docker', 'CDN', 'Prometheus', 'BigQuery']
      },
      accessibility: {
        announcement: 'Exploring cloud infrastructure including Cloud Run deployment and monitoring systems',
        landmark: 'Cloud infrastructure section'
      }
    }
  ];
}

/**
 * Section transition manager
 */
class SectionTransitionManager {
  private transitionDuration = 300; // ms
  private activeTransition: {
    from: ArchitectureSection | null;
    to: ArchitectureSection | null;
    startTime: number;
  } | null = null;
  
  startTransition(from: ArchitectureSection | null, to: ArchitectureSection | null): void {
    this.activeTransition = {
      from,
      to,
      startTime: performance.now()
    };
  }
  
  getTransitionProgress(): number {
    if (!this.activeTransition) return 0;
    
    const elapsed = performance.now() - this.activeTransition.startTime;
    const progress = Math.min(elapsed / this.transitionDuration, 1);
    
    if (progress >= 1) {
      this.activeTransition = null;
    }
    
    return progress;
  }
  
  isTransitioning(): boolean {
    return this.activeTransition !== null;
  }
  
  getCurrentTransition(): { from: ArchitectureSection | null; to: ArchitectureSection | null } | null {
    return this.activeTransition ? {
      from: this.activeTransition.from,
      to: this.activeTransition.to
    } : null;
  }
}

/**
 * Main ArchitectureScrollSections Provider
 */
interface ArchitectureScrollSectionsProviderProps {
  children: React.ReactNode;
  onSectionChange?: (section: ArchitectureSection | null) => void;
  onFocusNodesChange?: (nodeIds: string[]) => void;
}

export function ArchitectureScrollSectionsProvider({
  children,
  onSectionChange,
  onFocusNodesChange
}: ArchitectureScrollSectionsProviderProps) {
  const { scrollState, registerSection, unregisterSection, scrollToSection } = useScrollController();
  
  // Architecture sections configuration
  const sections = useMemo(() => getArchitectureSections(), []);
  
  // Section progress state
  const [progressState, setProgressState] = useState<SectionProgressState>({
    currentSection: null,
    sectionProgress: 0,
    previousSection: null,
    transitionProgress: 0,
    isTransitioning: false
  });
  
  // Transition manager for smooth section changes
  const transitionManager = useRef(new SectionTransitionManager());
  const lastAnnouncedSection = useRef<string | null>(null);
  
  /**
   * Calculate current section based on scroll progress
   */
  const calculateCurrentSection = useCallback((sectionProgress: number): ArchitectureSection | null => {
    // Only track when we're in the architecture section
    if (scrollState.section !== 'architecture') return null;
    
    // Find the section that contains the current scroll progress
    return sections.find(section => 
      sectionProgress >= section.scrollRange.start && 
      sectionProgress <= section.scrollRange.end
    ) || null;
  }, [sections, scrollState.section]);
  
  /**
   * Update section progress based on scroll state
   */
  useEffect(() => {
    const newCurrentSection = calculateCurrentSection(scrollState.sectionProgress);
    
    // Check if section has changed
    if (newCurrentSection?.id !== progressState.currentSection?.id) {
      // Start transition
      transitionManager.current.startTransition(progressState.currentSection, newCurrentSection);
      
      setProgressState(prev => ({
        ...prev,
        previousSection: prev.currentSection,
        currentSection: newCurrentSection,
        isTransitioning: true
      }));
      
      // Notify parent components
      if (onSectionChange) {
        onSectionChange(newCurrentSection);
      }
      
      // Accessibility announcement
      if (newCurrentSection && newCurrentSection.id !== lastAnnouncedSection.current) {
        // Announce section change to screen readers
        const announcement = newCurrentSection.accessibility.announcement;
        
        // Create a live region for accessibility
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.textContent = announcement;
        
        document.body.appendChild(liveRegion);
        
        setTimeout(() => {
          document.body.removeChild(liveRegion);
        }, 1000);
        
        lastAnnouncedSection.current = newCurrentSection.id;
      }
    }
    
    // Update transition progress
    if (transitionManager.current.isTransitioning()) {
      const transitionProgress = transitionManager.current.getTransitionProgress();
      
      setProgressState(prev => ({
        ...prev,
        transitionProgress,
        isTransitioning: transitionProgress < 1
      }));
    }
    
    // Calculate progress within current section
    if (newCurrentSection) {
      const sectionRange = newCurrentSection.scrollRange.end - newCurrentSection.scrollRange.start;
      const localProgress = (scrollState.sectionProgress - newCurrentSection.scrollRange.start) / sectionRange;
      const clampedProgress = Math.max(0, Math.min(1, localProgress));
      
      setProgressState(prev => ({
        ...prev,
        sectionProgress: clampedProgress
      }));
    }
    
  }, [scrollState.sectionProgress, calculateCurrentSection, progressState.currentSection, onSectionChange]);
  
  /**
   * Get current focus nodes based on section and transitions
   */
  const getCurrentFocusNodes = useCallback((): string[] => {
    if (!progressState.currentSection) return [];
    
    // During transitions, blend focus nodes from both sections
    if (progressState.isTransitioning && progressState.previousSection) {
      const transition = transitionManager.current.getCurrentTransition();
      if (transition && progressState.transitionProgress < 0.5) {
        // Show previous section nodes during first half of transition
        return progressState.previousSection.focusNodes;
      }
    }
    
    return progressState.currentSection.focusNodes;
  }, [progressState]);
  
  /**
   * Notify parent of focus node changes
   */
  useEffect(() => {
    if (onFocusNodesChange) {
      const focusNodes = getCurrentFocusNodes();
      onFocusNodesChange(focusNodes);
    }
  }, [getCurrentFocusNodes, onFocusNodesChange]);
  
  /**
   * Section registration for scroll tracking
   */
  const registerArchitectureSection = useCallback((element: HTMLElement, sectionId: string) => {
    registerSection(sectionId, element);
  }, [registerSection]);
  
  const unregisterArchitectureSection = useCallback((sectionId: string) => {
    unregisterSection(sectionId);
  }, [unregisterSection]);
  
  const scrollToArchitectureSection = useCallback((sectionId: string) => {
    scrollToSection(sectionId);
  }, [scrollToSection]);
  
  const contextValue: ArchitectureScrollSectionsContext = {
    sections,
    progressState,
    registerSection: registerArchitectureSection,
    unregisterSection: unregisterArchitectureSection,
    scrollToSection: scrollToArchitectureSection,
    getCurrentFocusNodes
  };
  
  return (
    <ArchitectureScrollSectionsContext.Provider value={contextValue}>
      {children}
    </ArchitectureScrollSectionsContext.Provider>
  );
}

/**
 * Hook for section-specific content and styling
 */
export function useArchitectureSectionContent() {
  const { progressState } = useArchitectureScrollSections();
  const { currentSection, sectionProgress, isTransitioning, transitionProgress } = progressState;
  
  // Get content for current section
  const sectionContent = useMemo(() => {
    if (!currentSection) return null;
    
    return {
      title: currentSection.title,
      description: currentSection.description,
      content: currentSection.content,
      accessibility: currentSection.accessibility,
      focusNodes: currentSection.focusNodes
    };
  }, [currentSection]);
  
  // Calculate opacity and animations based on section progress
  const sectionStyles = useMemo(() => {
    if (!currentSection) {
      return {
        opacity: 0,
        transform: 'translateY(20px)',
        isVisible: false
      };
    }
    
    // Fade in content as section becomes active
    let opacity = 1;
    let translateY = 0;
    
    if (isTransitioning) {
      // Smooth transition between sections
      opacity = 0.7 + (transitionProgress * 0.3);
      translateY = (1 - transitionProgress) * 10;
    } else {
      // Standard section progression
      opacity = 0.5 + (sectionProgress * 0.5);
      translateY = (1 - sectionProgress) * 5;
    }
    
    return {
      opacity: Math.max(0.3, Math.min(1, opacity)),
      transform: `translateY(${translateY}px)`,
      isVisible: opacity > 0.3
    };
  }, [currentSection, sectionProgress, isTransitioning, transitionProgress]);
  
  return {
    sectionContent,
    sectionStyles,
    isTransitioning,
    sectionProgress: Math.max(0, Math.min(1, sectionProgress))
  };
}

/**
 * Component for displaying current section information
 */
interface SectionProgressIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

export function SectionProgressIndicator({ 
  className, 
  showDetails = false 
}: SectionProgressIndicatorProps) {
  const { progressState } = useArchitectureScrollSections();
  const { sectionContent, sectionStyles } = useArchitectureSectionContent();
  
  if (!sectionContent || !sectionStyles.isVisible) return null;
  
  return (
    <div 
      className={className}
      style={{
        opacity: sectionStyles.opacity,
        transform: sectionStyles.transform,
        transition: 'opacity 0.3s ease, transform 0.3s ease'
      }}
      role="status"
      aria-live="polite"
      aria-label={sectionContent.accessibility.landmark}
    >
      <div>
        <h3>{sectionContent.title}</h3>
        <p>{sectionContent.description}</p>
        
        {showDetails && (
          <div>
            <h4>{sectionContent.content.headline}</h4>
            <ul>
              {sectionContent.content.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
            <p><strong>Business Value:</strong> {sectionContent.content.businessValue}</p>
            <p><strong>Technologies:</strong> {sectionContent.content.technologies.join(', ')}</p>
          </div>
        )}
      </div>
      
      {/* Section progress bar */}
      <div style={{ 
        width: '100%', 
        height: '2px', 
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: '1px'
      }}>
        <div style={{
          width: `${progressState.sectionProgress * 100}%`,
          height: '100%',
          backgroundColor: '#10b981',
          borderRadius: '1px',
          transition: 'width 0.1s ease'
        }} />
      </div>
    </div>
  );
}

export default ArchitectureScrollSectionsProvider;