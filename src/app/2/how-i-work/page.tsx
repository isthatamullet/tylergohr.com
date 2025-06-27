"use client"

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Section } from '@/app/2/components/Section/Section'
import styles from './page.module.css'

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

export default function HowIWorkDetailPage() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const [activeStep, setActiveStep] = useState<string | null>(null)
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

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

  const handleStepClick = (stepId: string) => {
    setActiveStep(activeStep === stepId ? null : stepId)
  }

  return (
    <>
      {/* Hero Section */}
      <Section background="how-i-work" paddingY="md" className={styles.compactHero}>
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
              Enterprise methodology from discovery to optimization, combining strategic planning with modern development practices for scalable, maintainable solutions.
            </p>
          </header>
        </div>
      </Section>

      {/* S-Curve Process Section */}
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

            {/* S-Curve Visualization - Exact Canva Design */}
            <div className={`${styles.sCurveContainer} ${visibleSections.has('process') ? styles.revealed : ''}`}>
              {/* SVG S-Curve Path matching Canva design */}
              <svg className={styles.sCurvePath} viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                
                {/* S-Curve Path - Exact shape from Canva */}
                <path
                  d="M 580 80 Q 450 120 320 180 Q 200 240 350 320 Q 500 400 300 480 Q 100 560 400 620 Q 700 680 850 650"
                  stroke="url(#curveGradient)"
                  strokeWidth="6"
                  fill="none"
                  className={styles.animatedPath}
                />
              </svg>

              {/* Process Steps positioned exactly like Canva design */}
              <div className={styles.processSteps}>
                {/* Step 1: Discovery & Requirements - Top right, text RIGHT */}
                <div className={`${styles.processStep} ${styles.step1} ${visibleSections.has('process') ? styles.revealed : ''}`}>
                  <button
                    className={`${styles.stepButton} ${styles.rightText} ${activeStep === processSteps[0].id ? styles.active : ''}`}
                    onClick={() => handleStepClick(processSteps[0].id)}
                  >
                    <div className={styles.stepIcon}>{processSteps[0].icon}</div>
                    <div className={styles.stepContent}>
                      <h3 className={styles.stepTitle}>{processSteps[0].title}</h3>
                      <p className={styles.stepDescription}>{processSteps[0].description}</p>
                    </div>
                  </button>
                  {activeStep === processSteps[0].id && (
                    <div className={styles.stepDetails}>
                      <div className={styles.stepDetailsContent}>
                        <h4>Key Activities</h4>
                        <ul>
                          {processSteps[0].details.map((detail, idx) => (
                            <li key={idx}>{detail}</li>
                          ))}
                        </ul>
                        <div className={styles.businessValue}>
                          <h4>Business Value</h4>
                          <p>{processSteps[0].businessValue}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 2: Research & Planning - Left side, text LEFT */}
                <div className={`${styles.processStep} ${styles.step2} ${visibleSections.has('process') ? styles.revealed : ''}`}>
                  <button
                    className={`${styles.stepButton} ${styles.leftText} ${activeStep === processSteps[1].id ? styles.active : ''}`}
                    onClick={() => handleStepClick(processSteps[1].id)}
                  >
                    <div className={styles.stepContent}>
                      <h3 className={styles.stepTitle}>{processSteps[1].title}</h3>
                      <p className={styles.stepDescription}>{processSteps[1].description}</p>
                    </div>
                    <div className={styles.stepIcon}>{processSteps[1].icon}</div>
                  </button>
                  {activeStep === processSteps[1].id && (
                    <div className={styles.stepDetails}>
                      <div className={styles.stepDetailsContent}>
                        <h4>Key Activities</h4>
                        <ul>
                          {processSteps[1].details.map((detail, idx) => (
                            <li key={idx}>{detail}</li>
                          ))}
                        </ul>
                        <div className={styles.businessValue}>
                          <h4>Business Value</h4>
                          <p>{processSteps[1].businessValue}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 3: Design & Prototyping - Right side, text RIGHT */}
                <div className={`${styles.processStep} ${styles.step3} ${visibleSections.has('process') ? styles.revealed : ''}`}>
                  <button
                    className={`${styles.stepButton} ${styles.rightText} ${activeStep === processSteps[2].id ? styles.active : ''}`}
                    onClick={() => handleStepClick(processSteps[2].id)}
                  >
                    <div className={styles.stepIcon}>{processSteps[2].icon}</div>
                    <div className={styles.stepContent}>
                      <h3 className={styles.stepTitle}>{processSteps[2].title}</h3>
                      <p className={styles.stepDescription}>{processSteps[2].description}</p>
                    </div>
                  </button>
                  {activeStep === processSteps[2].id && (
                    <div className={styles.stepDetails}>
                      <div className={styles.stepDetailsContent}>
                        <h4>Key Activities</h4>
                        <ul>
                          {processSteps[2].details.map((detail, idx) => (
                            <li key={idx}>{detail}</li>
                          ))}
                        </ul>
                        <div className={styles.businessValue}>
                          <h4>Business Value</h4>
                          <p>{processSteps[2].businessValue}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 4: Implementation - Left side, text LEFT */}
                <div className={`${styles.processStep} ${styles.step4} ${visibleSections.has('process') ? styles.revealed : ''}`}>
                  <button
                    className={`${styles.stepButton} ${styles.leftText} ${activeStep === processSteps[3].id ? styles.active : ''}`}
                    onClick={() => handleStepClick(processSteps[3].id)}
                  >
                    <div className={styles.stepContent}>
                      <h3 className={styles.stepTitle}>{processSteps[3].title}</h3>
                      <p className={styles.stepDescription}>{processSteps[3].description}</p>
                    </div>
                    <div className={styles.stepIcon}>{processSteps[3].icon}</div>
                  </button>
                  {activeStep === processSteps[3].id && (
                    <div className={styles.stepDetails}>
                      <div className={styles.stepDetailsContent}>
                        <h4>Key Activities</h4>
                        <ul>
                          {processSteps[3].details.map((detail, idx) => (
                            <li key={idx}>{detail}</li>
                          ))}
                        </ul>
                        <div className={styles.businessValue}>
                          <h4>Business Value</h4>
                          <p>{processSteps[3].businessValue}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 5: Testing & Quality - Right side, text RIGHT */}
                <div className={`${styles.processStep} ${styles.step5} ${visibleSections.has('process') ? styles.revealed : ''}`}>
                  <button
                    className={`${styles.stepButton} ${styles.rightText} ${activeStep === processSteps[4].id ? styles.active : ''}`}
                    onClick={() => handleStepClick(processSteps[4].id)}
                  >
                    <div className={styles.stepIcon}>{processSteps[4].icon}</div>
                    <div className={styles.stepContent}>
                      <h3 className={styles.stepTitle}>{processSteps[4].title}</h3>
                      <p className={styles.stepDescription}>{processSteps[4].description}</p>
                    </div>
                  </button>
                  {activeStep === processSteps[4].id && (
                    <div className={styles.stepDetails}>
                      <div className={styles.stepDetailsContent}>
                        <h4>Key Activities</h4>
                        <ul>
                          {processSteps[4].details.map((detail, idx) => (
                            <li key={idx}>{detail}</li>
                          ))}
                        </ul>
                        <div className={styles.businessValue}>
                          <h4>Business Value</h4>
                          <p>{processSteps[4].businessValue}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 6: Deployment & Launch - Left side, text LEFT */}
                <div className={`${styles.processStep} ${styles.step6} ${visibleSections.has('process') ? styles.revealed : ''}`}>
                  <button
                    className={`${styles.stepButton} ${styles.leftText} ${activeStep === processSteps[5].id ? styles.active : ''}`}
                    onClick={() => handleStepClick(processSteps[5].id)}
                  >
                    <div className={styles.stepContent}>
                      <h3 className={styles.stepTitle}>{processSteps[5].title}</h3>
                      <p className={styles.stepDescription}>{processSteps[5].description}</p>
                    </div>
                    <div className={styles.stepIcon}>{processSteps[5].icon}</div>
                  </button>
                  {activeStep === processSteps[5].id && (
                    <div className={styles.stepDetails}>
                      <div className={styles.stepDetailsContent}>
                        <h4>Key Activities</h4>
                        <ul>
                          {processSteps[5].details.map((detail, idx) => (
                            <li key={idx}>{detail}</li>
                          ))}
                        </ul>
                        <div className={styles.businessValue}>
                          <h4>Business Value</h4>
                          <p>{processSteps[5].businessValue}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 7: Optimization & Support - Right side, text RIGHT */}
                <div className={`${styles.processStep} ${styles.step7} ${visibleSections.has('process') ? styles.revealed : ''}`}>
                  <button
                    className={`${styles.stepButton} ${styles.rightText} ${activeStep === processSteps[6].id ? styles.active : ''}`}
                    onClick={() => handleStepClick(processSteps[6].id)}
                  >
                    <div className={styles.stepIcon}>{processSteps[6].icon}</div>
                    <div className={styles.stepContent}>
                      <h3 className={styles.stepTitle}>{processSteps[6].title}</h3>
                      <p className={styles.stepDescription}>{processSteps[6].description}</p>
                    </div>
                  </button>
                  {activeStep === processSteps[6].id && (
                    <div className={styles.stepDetails}>
                      <div className={styles.stepDetailsContent}>
                        <h4>Key Activities</h4>
                        <ul>
                          {processSteps[6].details.map((detail, idx) => (
                            <li key={idx}>{detail}</li>
                          ))}
                        </ul>
                        <div className={styles.businessValue}>
                          <h4>Business Value</h4>
                          <p>{processSteps[6].businessValue}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
              From discovery to deployment, let&apos;s work together to build something exceptional that delivers real business value and scales with your success.
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
    </>
  )
}