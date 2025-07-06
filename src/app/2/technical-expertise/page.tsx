"use client"

import React, { useEffect, useRef, useState, Suspense, lazy } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Section } from '@/app/2/components/Section/Section'
import { BrowserTabs, TechnicalExpertiseContent } from '@/app/2/components/BrowserTabs'
import type { TabData } from '@/app/2/components/BrowserTabs'
import { WebGLParallax } from '@/app/2/components/ScrollEffects/WebGLParallax'
import { Optimized3DInteractionArea, useMobileScrollOptimizer } from '@/app/2/components/ScrollEffects/MobileScrollOptimizer'
import { useScrollEffectsPerformanceOptimizer, PerformanceOptimizerDisplay } from '@/app/2/components/ScrollEffects/ScrollEffectsPerformanceOptimizer'
import { ScrollEffectsIntegrationWrapper } from '@/app/2/components/ScrollEffects/Day4IntegrationTest'
import styles from './page.module.css'

// Lazy load footer for better performance
const Footer = lazy(() => import('@/app/2/components/Footer/Footer'))

// Lazy load the scroll-enhanced 3D architecture diagram for performance - Phase 3.2 Day 2
const ScrollEnhancedInteractiveArchitectureDiagram = lazy(() => import('@/app/2/components/TechnicalExpertise/ScrollEnhancedArchitectureDiagram'))

// Lazy load live code demonstrations for performance - Phase 3.2 Day 5
const ScrollIntegratedLiveCode = lazy(() => import('@/app/2/components/LiveCode/ScrollIntegratedLiveCode'))

interface TechnicalArea {
  id: string
  title: string
  description: string
  skills: string[]
  currentProjects: string[]
  achievements: string[]
  businessValue: string
  badge: {
    label: string
    value: string
    type: 'frontend' | 'backend' | 'cloud' | 'leadership' | 'ai'
  }
}

const technicalAreas: TechnicalArea[] = [
  {
    id: 'frontend-architecture',
    title: 'Frontend Architecture',
    description: 'Modern React ecosystem mastery with cutting-edge CSS and design systems creating engaging, performant user experiences.',
    skills: [
      'React 19 + TypeScript: Type-safe, performant applications with latest React features',
      'Advanced Patterns: Custom hooks, context optimization, component composition',
      'State Management: Zustand for lightweight, scalable state architecture',
      'Animation & UX: Framer Motion for smooth, engaging user experiences',
      'CSS Modules: Custom styling without framework dependencies',
      'Modern CSS Features: Container Queries, CSS Grid Subgrid, Scroll-driven animations',
      'Responsive Design: Mobile-first approach with WCAG 2.1 AA compliance',
      'Design Systems: Consistent, scalable UI patterns across projects'
    ],
    currentProjects: [
      'Portfolio at tylergohr.com: Interactive skill cards, parallax effects, responsive design system',
      'Invoice Chaser: Complex dashboard with real-time updates and responsive data visualization',
      'Home Property Management: Multi-tenant interface with real-time collaborative features',
      'Grow Plant Store: E-commerce platform with intelligent search and dynamic product catalogs'
    ],
    achievements: [
      'Built Emmy Award-winning streaming interfaces for global FIFA World Cup',
      'Designed content management systems handling 50,000+ digital titles',
      'Created enterprise dashboards for Fortune 500 C-level executives',
      'Delivered 90+ Lighthouse scores across all production applications'
    ],
    businessValue: 'Whether you need a customer-facing application, internal dashboard, or complex data visualization, I create frontend experiences that users love while maintaining enterprise-level performance and accessibility standards.',
    badge: {
      label: 'UI/UX',
      value: 'Expert',
      type: 'frontend'
    }
  },
  {
    id: 'backend-apis',
    title: 'Backend & API Development',
    description: 'Production-grade Node.js and API development with complex business logic, real-time features, and enterprise integrations.',
    skills: [
      'Node.js & Express: RESTful services handling complex business logic',
      'Authentication Systems: JWT, OAuth 2.0, Firebase Auth integration',
      'Real-time Features: Socket.IO with Redis scaling for live updates',
      'Database Integration: PostgreSQL with Prisma ORM for type-safe data access',
      'Payment Processing: Stripe API with webhooks and subscription billing',
      'Business APIs: QuickBooks OAuth integration, Gmail API automation',
      'Security: Enterprise-grade authentication, authorization, input validation',
      'API Design: RESTful endpoints with proper error handling and documentation'
    ],
    currentProjects: [
      'Invoice Chaser: Complex payment processing with QuickBooks/Gmail integration',
      'Home Property Management: Row-level security with automated screening workflows',
      'Grow Plant Store: E-commerce backend with inventory management and order processing',
      'Portfolio API: Contact forms and dynamic content management systems'
    ],
    achievements: [
      'Built payment automation reducing collection time by 25-40%',
      'Designed APIs processing millions of requests for Fox Corporation',
      'Created real-time systems handling thousands of concurrent users',
      'Integrated complex third-party systems (QuickBooks, Stripe, Gmail, Firebase)'
    ],
    businessValue: 'From simple contact forms to complex financial systems, I build backend solutions that scale with your business while maintaining security, performance, and reliability that enterprise customers demand.',
    badge: {
      label: 'API Dev',
      value: '16+ Yrs',
      type: 'backend'
    }
  },
  {
    id: 'cloud-devops',
    title: 'Cloud Infrastructure & DevOps',
    description: 'Google Cloud Platform expertise with enterprise-grade CI/CD pipelines, automated testing, and production monitoring.',
    skills: [
      'Google Cloud Platform: Cloud Run containerized applications with automatic scaling',
      'Database Management: Cloud SQL PostgreSQL with automated backups',
      'CI/CD Pipeline: GitHub Actions with automated testing and preview deployments',
      'Monitoring: Cloud Monitoring, Error Reporting, Performance Insights',
      'GitHub Issues: Project planning and feature tracking with milestone management',
      'PR-Based Development: Feature branches with automated preview URLs',
      'Quality Gates: TypeScript, ESLint, Jest testing with comprehensive validation',
      'Cross-Device Testing: Real browser testing on iPhone, iPad, desktop'
    ],
    currentProjects: [
      'Portfolio deployment: Enterprise-grade CI/CD with 5-minute PR-to-preview pipeline',
      'Invoice Chaser: Production Cloud Run deployment with automated scaling',
      'Preview System: Automated staging environments for every pull request',
      'Monitoring Setup: Real-time performance tracking and error reporting'
    ],
    achievements: [
      'Deployed Emmy Award-winning systems under global scrutiny',
      'Built CI/CD pipelines reducing deployment time from hours to minutes',
      'Created preview deployment systems used by Fortune 500 development teams',
      'Achieved 99.9% uptime for mission-critical enterprise applications'
    ],
    businessValue: 'Whether you need reliable hosting for a small business website or enterprise-scale infrastructure that handles millions of users, I deliver cloud solutions that grow with your success while maintaining performance and cost efficiency.',
    badge: {
      label: 'Cloud Ops',
      value: 'Expert',
      type: 'cloud'
    }
  },
  {
    id: 'leadership-strategy',
    title: 'Technical Leadership & Strategy',
    description: 'Fortune 500 leadership experience managing teams of 10+ with strategic technical decision making and enterprise architecture.',
    skills: [
      'Team Leadership: Led 10+ content specialists across global organizations',
      'Cross-Functional Coordination: Managed relationships between technical teams and executives',
      'Training & Development: Created comprehensive onboarding and technical documentation',
      'Budget & Resource Management: Cost optimization with focus on measurable ROI',
      'Platform Architecture: Defined requirements for enterprise systems handling 50,000+ titles',
      'Stakeholder Communication: Progress reporting to C-level executives and technical teams',
      'Quality Standards: Established protocols improving success rates from 32% to 96%',
      'Change Management: Led organization-wide process improvements and technology adoption'
    ],
    currentProjects: [
      'GitHub-based project management: Issue tracking with milestone planning',
      'Quality assurance leadership: Comprehensive testing strategies from enterprise experience',
      'Documentation standards: Clear technical documentation and knowledge transfer',
      'Vendor management: Complex API integrations with third-party systems'
    ],
    achievements: [
      'Improved content delivery success rates from 32% to 96% in 3 months',
      'Led teams managing $2M+ in cost savings for Fox Corporation',
      'Trained 10+ specialists in enterprise content management workflows',
      'Created 150+ page technical documentation adopted across organization'
    ],
    businessValue: 'Whether you need technical leadership for a growing startup or enterprise project management for complex initiatives, I bring Fortune 500 experience in delivering results while building and developing high-performing teams.',
    badge: {
      label: 'Team Lead',
      value: '10+ Team',
      type: 'leadership'
    }
  },
  {
    id: 'ai-innovation',
    title: 'AI & Financial Technology',
    description: 'Pioneering AI automation and financial technology integration with measurable business impact and innovation leadership.',
    skills: [
      'AI Tools Pioneer: First to implement automated ad break detection systems',
      'Process Automation: Created workflows eliminating repetitive tasks',
      'Modern AI Development: Claude Code integration for rapid prototyping',
      'Business Process Optimization: Identifying automation opportunities for ROI',
      'Stripe Integration: Complete payment processing with webhooks and subscriptions',
      'Financial APIs: QuickBooks integration with complex OAuth flows',
      'Accounting Automation: Built systems reducing payment collection time',
      'Compliance & Security: Financial data handling with enterprise standards'
    ],
    currentProjects: [
      'Invoice Chaser: AI-powered payment automation with intelligent follow-up',
      'Claude Code development: AI-assisted rapid prototyping and problem-solving',
      'Financial automation: Stripe + QuickBooks integration reducing manual work',
      'Content automation: AI tools for content creation and moderation'
    ],
    achievements: [
      'Reduced manual review time by 50% through AI automation implementation',
      'Built financial systems achieving 25-40% payment time reduction',
      'Pioneered AI integration ahead of industry standard adoption',
      'Created automation saving thousands of hours of manual processing'
    ],
    businessValue: 'From payment automation to content management, I help businesses identify where AI and automation can eliminate repetitive tasks, reduce errors, and free up your team to focus on growth and innovation.',
    badge: {
      label: 'Innovation',
      value: 'Pioneer',
      type: 'ai'
    }
  }
]

// Component that uses search params - needs to be wrapped in Suspense
function TechnicalExpertisePageContent() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})
  const searchParams = useSearchParams()
  
  // Mobile optimization for 3D interaction - Phase 3.2 Day 3
  const mobileOptimizer = useMobileScrollOptimizer()
  
  // Performance optimization for scroll effects - Phase 3.2.4 Day 4 Task 2
  const performanceOptimizer = useScrollEffectsPerformanceOptimizer()

  // Map URL tab parameters to actual technical area IDs
  const tabMapping = {
    'frontend': 'frontend-architecture',
    'backend': 'backend-apis',
    'cloud': 'cloud-devops', 
    'leadership': 'leadership-strategy',
    'ai': 'ai-innovation'
  }

  // Get the default tab from URL parameter or fall back to first area
  const getDefaultTab = (): string => {
    const tabParam = searchParams.get('tab')
    if (tabParam && tabParam in tabMapping) {
      return tabMapping[tabParam as keyof typeof tabMapping]
    }
    return 'frontend-architecture' // Default to first tab
  }

  const [defaultTab] = useState<string>(getDefaultTab)

  // Intersection Observer for scroll-triggered animations with performance optimization
  useEffect(() => {
    // Start performance monitoring when page loads
    performanceOptimizer.startOptimization()
    
    const observer = new IntersectionObserver(
      (entries) => {
        // Track scroll events for performance optimization
        performanceOptimizer.trackScrollEvent()
        
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section-id')
            if (sectionId) {
              setVisibleSections(prev => new Set([...prev, sectionId]))
            }
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -5% 0px'
      }
    )

    // Initialize hero section as visible immediately
    setVisibleSections(prev => new Set([...prev, 'hero']))

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref)
    })

    return () => {
      observer.disconnect()
      performanceOptimizer.stopOptimization()
    }
  }, [performanceOptimizer])

  // Transform technical areas data into tab format
  const technicalExpertiseTabs: TabData[] = technicalAreas.map((area) => {
    // Map long titles to shorter tab labels
    const tabLabels: { [key: string]: string } = {
      'frontend-architecture': 'Frontend',
      'backend-apis': 'Backend', 
      'cloud-devops': 'Cloud',
      'leadership-strategy': 'Leadership',
      'ai-innovation': 'AI & FinTech'
    }
    
    return {
      id: area.id,
      label: tabLabels[area.id] || area.title,
      badge: area.badge,
      content: <TechnicalExpertiseContent area={area} />,
      type: area.badge.type
    }
  })

  const handleTabChange = (tabId: string) => {
    // Optional: Add analytics tracking
    console.log(`Viewed technical area: ${tabId}`)
  }

  return (
    <>
      {/* Hero Section - Blue Bar Only */}
      <Section background="technical-expertise" paddingY="none" className={styles.compactHero}>
        <div 
          ref={(el) => { sectionRefs.current['hero'] = el }}
          data-section-id="hero"
          className={styles.heroContainer}
        >
          {/* Hero Content */}
          <header className={`${styles.heroHeader} ${visibleSections.has('hero') ? styles.revealed : ''}`}>
            <h1 className={styles.heroTitle}>
              Technical Expertise
            </h1>
            <p className={styles.heroDescription}>
              16+ years of enterprise leadership experience combined with cutting-edge modern development practices and proven results.
            </p>
          </header>
        </div>
      </Section>

      {/* Browser Section - Black Background */}
      <Section background="hero" paddingY="sm">
        <div 
          ref={(el) => { sectionRefs.current['browser'] = el }}
          data-section-id="browser"
          className={`${styles.browserSection} ${visibleSections.has('hero') ? styles.revealed : ''}`}
        >
          <BrowserTabs 
            tabs={technicalExpertiseTabs}
            defaultTab={defaultTab}
            onTabChange={handleTabChange}
            className={styles.technicalExpertiseBrowser}
            urlPath="technical-expertise"
          />
        </div>
      </Section>

      {/* Interactive Architecture Diagram Section - Phase 3.2 Day 3 Enhanced */}
      <Section background="about" paddingY="xl">
        <WebGLParallax intensity={0.8} enableInteraction={true}>
          <div 
            ref={(el) => { sectionRefs.current['architecture'] = el }}
            data-section-id="architecture"
            className={`${styles.architectureSection} ${visibleSections.has('architecture') ? styles.revealed : ''}`}
          >
            <div className={styles.architectureContainer}>
              <header className={styles.architectureHeader}>
                <h2 className={styles.architectureTitle}>
                  Enterprise Architecture Visualization
                </h2>
                <p className={styles.architectureDescription}>
                  Interactive 3D diagram showcasing real-world enterprise system architecture with modern technology stacks, 
                  microservices patterns, and cloud infrastructure design. Enhanced with GPU-accelerated parallax backgrounds 
                  and mobile-optimized controls.
                </p>
              </header>
              
              {/* Mobile-optimized 3D interaction area */}
              <Optimized3DInteractionArea 
                onTouchInteraction={mobileOptimizer.setTouchInteraction}
                className={styles.diagramWrapper}
              >
                <Suspense fallback={
                  <div className={styles.diagramFallback}>
                    <div className={styles.loadingContainer}>
                      <div className={styles.loadingSpinner}></div>
                      <p>Loading scroll-enhanced 3D architecture diagram...</p>
                    </div>
                  </div>
                }>
                  <ScrollEnhancedInteractiveArchitectureDiagram />
                </Suspense>
              </Optimized3DInteractionArea>
            </div>
            
            <div className={styles.architectureFeatures}>
              <div className={styles.featureList}>
                <div className={styles.feature}>
                  <h4 className={styles.featureTitle}>🎯 Interactive Exploration</h4>
                  <p className={styles.featureDescription}>
                    Click nodes to explore detailed technology specifications and business value
                  </p>
                </div>
                <div className={styles.feature}>
                  <h4 className={styles.featureTitle}>🏗️ Enterprise Patterns</h4>
                  <p className={styles.featureDescription}>
                    Real-world microservices architecture with proven scalability patterns
                  </p>
                </div>
                <div className={styles.feature}>
                  <h4 className={styles.featureTitle}>☁️ Cloud-Native Design</h4>
                  <p className={styles.featureDescription}>
                    Google Cloud Platform integration with auto-scaling and monitoring
                  </p>
                </div>
                <div className={styles.feature}>
                  <h4 className={styles.featureTitle}>🔐 Security & Performance</h4>
                  <p className={styles.featureDescription}>
                    Enterprise-grade authentication, data protection, and performance optimization
                  </p>
                </div>
              </div>
            </div>
          </div>
        </WebGLParallax>
      </Section>

      {/* Live Code Demonstrations Section - Phase 3.2 Day 5 */}
      <Section background="hero" paddingY="xl">
        <div 
          ref={(el) => { sectionRefs.current['live-code'] = el }}
          data-section-id="live-code"
          data-testid="live-code-section"
          className={`${styles.liveCodeSection} ${visibleSections.has('live-code') ? styles.revealed : ''}`}
        >
          <Suspense fallback={
            <div className={styles.liveCodeFallback}>
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading interactive live code demonstrations...</p>
              </div>
            </div>
          }>
            <ScrollIntegratedLiveCode 
              enableAutoplay={true}
              autoplayInterval={20000}
              enableScrollTriggers={true}
              className={styles.scrollIntegratedLiveCode}
            />
          </Suspense>
        </div>
      </Section>

      {/* Call to Action Section */}
      <Section background="contact" paddingY="xl">
        <div 
          ref={(el) => { sectionRefs.current['cta'] = el }}
          data-section-id="cta"
          className={`${styles.ctaSection} ${visibleSections.has('cta') ? styles.revealed : ''}`}
        >
          <div className={styles.ctaContainer}>
            <h2 className={styles.ctaTitle}>
              Ready to leverage this expertise for your project?
            </h2>
            <p className={styles.ctaDescription}>
              From modern frontend applications to enterprise backend systems, let{"'"}s discuss how my technical 
              experience can deliver the innovative solutions your business needs.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/2#contact" className={styles.ctaPrimary}>
                Start Your Project →
              </Link>
              <Link href="/2" className={styles.ctaSecondary}>
                ← Back to Portfolio
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer Section - Navigation Links & Professional Information */}
      <Suspense fallback={<div>Loading footer...</div>}>
        <Footer />
      </Suspense>
      
      {/* Performance Optimization Display - Phase 3.2.4 Day 4 Task 2 */}
      <PerformanceOptimizerDisplay 
        position="bottom-right" 
        className="technical-expertise-performance-monitor" 
      />
    </>
  )
}

// Main page component with Suspense boundary and scroll integration - Phase 3.2.4 Day 4
export default function TechnicalExpertiseDetailPage() {
  return (
    <ScrollEffectsIntegrationWrapper 
      enableTesting={process.env.NODE_ENV === 'development'}
      className="technical-expertise-scroll-integration"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <TechnicalExpertisePageContent />
      </Suspense>
    </ScrollEffectsIntegrationWrapper>
  )
}