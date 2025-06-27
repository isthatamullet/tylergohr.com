"use client"

import React, { useEffect, useRef, useState } from 'react'
import styles from './HowIWorkPreview.module.css'

export interface ProcessStep {
  id: string
  step: number
  title: string
  description: string
  icon: string
  side: 'left' | 'right'
  x: number
  y: number
}

/**
 * How I Work Preview Section
 * Displays 7-step S-curve design showcasing enterprise methodology
 * Uses SVG-based flowing curve with scroll-triggered animations
 */
export const HowIWorkPreview: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [pathLength, setPathLength] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  // 7 Process Steps from PHASE-2-SECTION-LAYOUT-REQUIREMENTS.md
  const processSteps: ProcessStep[] = [
    {
      id: 'discovery',
      step: 1,
      title: 'Discovery & Requirements',
      description: 'Stakeholder interviews, problem definition, scope clarification',
      icon: '🔍',
      side: 'right',
      x: 450,
      y: 100
    },
    {
      id: 'research',
      step: 2,
      title: 'Research & Planning',
      description: 'Technical research, architecture planning, GitHub issue roadmap',
      icon: '📋',
      side: 'left',
      x: 150,
      y: 200
    },
    {
      id: 'design',
      step: 3,
      title: 'Design & Prototyping',
      description: 'UI/UX design, technical prototypes, validation cycles',
      icon: '🎨',
      side: 'right',
      x: 450,
      y: 300
    },
    {
      id: 'implementation',
      step: 4,
      title: 'Implementation',
      description: 'Next.js development, iterative building, code reviews',
      icon: '⚛️',
      side: 'left',
      x: 150,
      y: 400
    },
    {
      id: 'testing',
      step: 5,
      title: 'Testing & Quality',
      description: 'Jest testing, TypeScript validation, performance optimization',
      icon: '✅',
      side: 'right',
      x: 450,
      y: 500
    },
    {
      id: 'deployment',
      step: 6,
      title: 'Deployment & Launch',
      description: 'Google Cloud deployment, CI/CD pipeline, monitoring setup',
      icon: '🚀',
      side: 'left',
      x: 150,
      y: 600
    },
    {
      id: 'optimization',
      step: 7,
      title: 'Optimization & Support',
      description: 'Performance monitoring, continuous improvement, maintenance',
      icon: '📈',
      side: 'right',
      x: 450,
      y: 700
    }
  ]

  // SVG S-curve path (connecting all 7 steps)
  const curvePath = `
    M 300,50 
    Q 375,75 450,100 
    Q 525,125 450,150 
    Q 300,175 150,200 
    Q 0,225 150,250 
    Q 300,275 450,300 
    Q 600,325 450,350 
    Q 300,375 150,400 
    Q 0,425 150,450 
    Q 300,475 450,500 
    Q 600,525 450,550 
    Q 300,575 150,600 
    Q 0,625 150,650 
    Q 300,675 450,700
  `.trim()

  // Calculate path length for animation
  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength()
      setPathLength(length)
    }
  }, [])

  // Intersection Observer for scroll-triggered section animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="process"
      className={styles.howIWorkSection}
      aria-labelledby="how-i-work-title"
      role="region"
    >
      <div className={styles.container}>
        <header 
          className={`${styles.howIWorkHeader} ${isVisible ? styles.revealed : ''}`}
        >
          <h2 id="how-i-work-title" className={styles.sectionTitle}>
            How I Work
          </h2>
          <p className={styles.sectionDescription}>
            Enterprise methodology from discovery to optimization, ensuring scalable solutions and measurable outcomes.
          </p>
        </header>

        {/* Desktop S-Curve Layout */}
        <div className={`${styles.sCurveContainer} ${isVisible ? styles.revealed : ''}`}>
          {/* SVG S-Curve Path */}
          <svg 
            className={styles.sCurveSvg}
            viewBox="0 0 600 750"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              ref={pathRef}
              d={curvePath}
              className={styles.curvePath}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={pathLength}
              strokeDashoffset={isVisible ? 0 : pathLength}
            />
          </svg>

          {/* Process Steps */}
          {processSteps.map((step, index) => (
            <div
              key={step.id}
              className={`${styles.processStep} ${styles[step.side]} ${isVisible ? styles.stepRevealed : ''}`}
              style={{
                '--step-x': `${step.x}px`,
                '--step-y': `${step.y}px`,
                '--step-index': index,
                animationDelay: `${index * 100 + 300}ms` // Start after path begins drawing
              } as React.CSSProperties}
            >
              <div className={styles.stepIcon}>
                <span className={styles.iconEmoji} role="img" aria-hidden="true">
                  {step.icon}
                </span>
              </div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>
                  {step.title}
                </h3>
                <p className={styles.stepDescription}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Vertical Layout */}
        <div className={styles.mobileProcessList}>
          {processSteps.map((step, index) => (
            <div
              key={`mobile-${step.id}`}
              className={`${styles.mobileProcessStep} ${isVisible ? styles.mobileStepRevealed : ''}`}
              style={{
                '--step-index': index,
                animationDelay: `${index * 100}ms`
              } as React.CSSProperties}
            >
              <div className={styles.mobileStepIcon}>
                <span className={styles.iconEmoji} role="img" aria-hidden="true">
                  {step.icon}
                </span>
              </div>
              <div className={styles.mobileStepContent}>
                <h3 className={styles.mobileStepTitle}>
                  {step.title}
                </h3>
                <p className={styles.mobileStepDescription}>
                  {step.description}
                </p>
              </div>
              {index < processSteps.length - 1 && (
                <div className={styles.mobileConnector} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>

        <div className={`${styles.sectionCTA} ${isVisible ? styles.revealed : ''}`}>
          <a 
            href="/2/how-i-work" 
            className={styles.ctaButton}
            aria-label="View complete development process methodology"
          >
            View Full Process →
          </a>
          <p className={styles.ctaSupporting}>
            Discover the complete methodology behind enterprise-quality development
          </p>
        </div>
      </div>
    </section>
  )
}

export default HowIWorkPreview