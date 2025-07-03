"use client"

import React, { useEffect, useRef, useState, Suspense, lazy } from 'react'
import Link from 'next/link'
import { Section } from '@/app/2/components/Section/Section'
import styles from './page.module.css'

// Lazy load footer for better performance
const Footer = lazy(() => import('@/app/2/components/Footer/Footer'))

interface ProcessStep {
  id: string
  title: string
  description: string
  icon: string
  details: string[]
  businessValue: string
}

const processSteps: ProcessStep[] = [
  {
    id: 'discovery',
    title: 'Discovery & Requirements',
    description: 'Stakeholder interviews, problem definition, scope clarification',
    icon: '🔍',
    details: [
      'Comprehensive stakeholder interviews to understand business goals and constraints',
      'Problem definition workshops to identify root causes and opportunities',
      'Scope clarification sessions to define project boundaries and success metrics',
      'Technical requirements gathering with focus on scalability and maintainability',
      'Risk assessment and mitigation strategy development'
    ],
    businessValue: 'Thorough discovery prevents costly scope changes and ensures solutions address real business needs rather than symptoms.'
  },
  {
    id: 'research',
    title: 'Research & Planning',
    description: 'Technical research, architecture planning, GitHub issue roadmap',
    icon: '📊',
    details: [
      'Technology stack evaluation and selection based on project requirements',
      'Architecture planning with scalability and performance considerations',
      'GitHub Issues roadmap creation for transparent project tracking',
      'Resource planning and timeline development with realistic milestones',
      'Competitive analysis and best practices research'
    ],
    businessValue: 'Strategic planning reduces development time by 30-40% and prevents technical debt that costs exponentially more to fix later.'
  },
  {
    id: 'design',
    title: 'Design & Prototyping',
    description: 'UI/UX design, technical prototypes, validation cycles',
    icon: '🎨',
    details: [
      'User experience design focused on business goals and user needs',
      'Interactive prototypes for stakeholder validation and feedback',
      'Technical proof-of-concepts for complex features and integrations',
      'Design system creation for consistency and development efficiency',
      'Accessibility compliance planning from the beginning'
    ],
    businessValue: 'Early validation through prototypes prevents expensive rebuilds and ensures user adoption from day one.'
  },
  {
    id: 'implementation',
    title: 'Implementation',
    description: 'Next.js development, iterative building, code reviews',
    icon: '⚡',
    details: [
      'Next.js 14+ development with TypeScript for type safety and developer experience',
      'Iterative development with regular demos and stakeholder feedback',
      'Code reviews and pair programming for knowledge sharing and quality',
      'CI/CD pipeline setup for automated testing and deployment',
      'Performance optimization built-in from the start'
    ],
    businessValue: 'Modern development practices deliver features 25-40% faster while maintaining enterprise-grade quality and reliability.'
  },
  {
    id: 'testing',
    title: 'Testing & Quality',
    description: 'Jest testing, TypeScript validation, performance optimization',
    icon: '🧪',
    details: [
      'Comprehensive Jest testing suite for component and integration testing',
      'TypeScript validation for compile-time error prevention',
      'Performance testing and Core Web Vitals optimization',
      'Cross-browser and cross-device compatibility testing',
      'Security testing and vulnerability assessment'
    ],
    businessValue: 'Rigorous testing reduces post-launch bugs by 80% and prevents costly emergency fixes that disrupt business operations.'
  },
  {
    id: 'deployment',
    title: 'Deployment & Launch',
    description: 'Google Cloud deployment, CI/CD pipeline, monitoring setup',
    icon: '🚀',
    details: [
      'Google Cloud Run deployment for automatic scaling and reliability',
      'CI/CD pipeline with automated quality gates and rollback capability',
      'Monitoring and alerting setup for proactive issue detection',
      'SSL certificate configuration and security hardening',
      'Performance monitoring and optimization tracking'
    ],
    businessValue: 'Enterprise-grade deployment ensures 99.9% uptime and automatic scaling from zero to millions of users without infrastructure management.'
  },
  {
    id: 'optimization',
    title: 'Optimization & Support',
    description: 'Performance monitoring, continuous improvement, maintenance',
    icon: '📈',
    details: [
      'Continuous performance monitoring and optimization opportunities',
      'User feedback collection and feature prioritization',
      'Security updates and dependency management',
      'Analytics insights for business intelligence and product decisions',
      'Long-term maintenance planning and technical debt management'
    ],
    businessValue: 'Ongoing optimization delivers 15-25% performance improvements over time and keeps applications secure and competitive.'
  }
]

// Component that needs to be wrapped in Suspense
function HowIWorkPageContent() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  // Handle hash-based section scrolling
  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash.slice(1)
      if (hash) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            })
          }
        }, 100)
      }
    }

    // Handle initial hash on page load
    handleHashNavigation()

    // Handle hash changes (browser back/forward)
    window.addEventListener('hashchange', handleHashNavigation)
    
    return () => {
      window.removeEventListener('hashchange', handleHashNavigation)
    }
  }, [])

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
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

    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Hero Section */}
      <Section background="how-i-work" paddingY="none" className={styles.compactHero}>
        <div 
          ref={(el) => { sectionRefs.current['hero'] = el }}
          data-section-id="hero"
          className={styles.heroContainer}
        >
          {/* Hero Content */}
          <header className={`${styles.heroHeader} ${visibleSections.has('hero') ? styles.revealed : ''}`}>
            <h1 className={styles.heroTitle}>
              How I Work
            </h1>
            <p className={styles.heroDescription}>
              Strategic enterprise approach combining modern development practices to deliver scalable, reliable solutions.
            </p>
          </header>
        </div>
      </Section>

      {/* Simple List Process Section */}
      <Section background="about" paddingY="xl">
        <div 
          ref={(el) => { sectionRefs.current['process'] = el }}
          data-section-id="process"
          className={styles.processSection}
        >
          <div className={styles.processContainer}>
            <header className={`${styles.processHeader} ${visibleSections.has('process') ? styles.revealed : ''}`}>
              <h2 className={styles.processTitle}>
                7-Step Development Process
              </h2>
              <p className={styles.processDescription}>
                From initial discovery to ongoing optimization, each project follows a proven methodology that delivers enterprise-grade results while maintaining agility and transparency.
              </p>
            </header>

            {/* Simple List Format */}
            <div className={`${styles.processListContainer} ${visibleSections.has('process') ? styles.revealed : ''}`}>
              {processSteps.map((step, index) => (
                <div
                  key={step.id}
                  id={step.id}
                  className={`${styles.processListItem} ${visibleSections.has('process') ? styles.itemRevealed : ''}`}
                  style={{
                    '--step-index': index,
                    animationDelay: `${index * 100}ms`
                  } as React.CSSProperties}
                >
                  <div className={styles.listItemHeader}>
                    <div className={styles.listItemIcon}>
                      <span className={styles.iconEmoji} role="img" aria-hidden="true">
                        {step.icon}
                      </span>
                    </div>
                    <div className={styles.listItemTitleSection}>
                      <h3 className={styles.listItemTitle}>{step.title}</h3>
                      <p className={styles.listItemDescription}>{step.description}</p>
                    </div>
                  </div>
                  
                  <div className={styles.listItemContent}>
                    <div className={styles.listItemDetails}>
                      <h4 className={styles.detailsHeading}>Key Activities</h4>
                      <ul className={styles.detailsList}>
                        {step.details.map((detail, idx) => (
                          <li key={idx} className={styles.detailsItem}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className={styles.businessValueSection}>
                      <h4 className={styles.businessValueHeading}>Business Value</h4>
                      <p className={styles.businessValueText}>{step.businessValue}</p>
                    </div>
                  </div>
                  
                  {index < processSteps.length - 1 && (
                    <div className={styles.listItemSeparator} aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          </div>
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
              Ready to experience this proven process?
            </h2>
            <p className={styles.ctaDescription}>
              From discovery to deployment, let{"'"}s work together to build something exceptional that delivers real business value and scales with your success.
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
    </>
  )
}

// Main page component with Suspense boundary
export default function HowIWorkDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HowIWorkPageContent />
    </Suspense>
  )
}