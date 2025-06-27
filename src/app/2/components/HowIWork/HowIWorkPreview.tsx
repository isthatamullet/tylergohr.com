"use client"

import React, { useEffect, useRef, useState } from 'react'
import styles from './HowIWorkPreview.module.css'

export interface ProcessStep {
  id: string
  step: number
  title: string
  description: string
  icon: string
  side: 'left' | 'right' | 'center'
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

  // 7 Process Steps positioned exactly as drawn in user's layout sketch
  // Following the curve flow: center → right → left → right → left → right → center
  const processSteps: ProcessStep[] = [
    {
      id: 'discovery',
      step: 1,
      title: 'Discovery & Requirements',
      description: 'Stakeholder interviews, problem definition, scope clarification',
      icon: '🔍',
      side: 'center',
      x: 350, // Top center start of curve
      y: 50
    },
    {
      id: 'research',
      step: 2,
      title: 'Research & Planning',
      description: 'Technical research, architecture planning, GitHub issue roadmap',
      icon: '📋',
      side: 'right',
      x: 550, // Right tip of first curve extension
      y: 150
    },
    {
      id: 'design',
      step: 3,
      title: 'Design & Prototyping',
      description: 'UI/UX design, technical prototypes, validation cycles',
      icon: '🎨',
      side: 'left',
      x: 150, // Left tip of curve's leftward swing
      y: 250
    },
    {
      id: 'implementation',
      step: 4,
      title: 'Implementation',
      description: 'Next.js development, iterative building, code reviews',
      icon: '⚛️',
      side: 'right',
      x: 550, // Right tip of next rightward extension
      y: 350
    },
    {
      id: 'testing',
      step: 5,
      title: 'Testing & Quality',
      description: 'Jest testing, TypeScript validation, performance optimization',
      icon: '✅',
      side: 'left',
      x: 150, // Left tip of next leftward swing
      y: 450
    },
    {
      id: 'deployment',
      step: 6,
      title: 'Deployment & Launch',
      description: 'Google Cloud deployment, CI/CD pipeline, monitoring setup',
      icon: '🚀',
      side: 'right',
      x: 550, // Right tip of next rightward extension
      y: 550
    },
    {
      id: 'optimization',
      step: 7,
      title: 'Optimization & Support',
      description: 'Performance monitoring, continuous improvement, maintenance',
      icon: '📈',
      side: 'center',
      x: 350, // Bottom center end of curve
      y: 650
    }
  ]

  // SVG S-curve path connecting all 7 steps as drawn in user's sketch
  // Flow: center(1) → right(2) → left(3) → right(4) → left(5) → right(6) → center(7)
  const curvePath = `
    M 350,50
    Q 450,100 550,150
    Q 450,200 150,250
    Q 350,300 550,350
    Q 350,400 150,450
    Q 350,500 550,550
    Q 450,600 350,650
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
            viewBox="0 0 700 750"
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