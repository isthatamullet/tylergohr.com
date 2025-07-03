"use client"

import React, { useEffect, useRef, useState } from 'react'
import { CaseStudyCard } from './CaseStudyCard'
import styles from './CaseStudiesPreview.module.css'

export interface CaseStudy {
  id: string
  title: string
  challengeTeaser: string
  keyImpact: string
  metricBadge: string
  metricCategory: 'emmy' | 'savings' | 'success' | 'innovation'
  ctaText: string
  link: string
}

/**
 * Case Studies Preview Section
 * Displays 4 case study cards with scroll-triggered staggered animations
 * Showcases technical leadership impact with metric badges
 */
export const CaseStudiesPreview: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // Case studies data from PORTFOLIO-REDESIGN-CONTENT-CONDENSED.md
  const caseStudies: CaseStudy[] = [
    {
      id: 'content-distribution-platform',
      title: 'Content Distribution Platform Revolution',
      challengeTeaser: 'Fox Corporation needed to manage 50,000+ titles while reducing costs by millions.',
      keyImpact: 'Saved "a few million bucks" through strategic optimization',
      metricBadge: '$2M+ Cost Savings',
      metricCategory: 'savings',
      ctaText: 'See How I Did It',
      link: '/2/case-studies?tab=fox'
    },
    {
      id: 'workflow-transformation',
      title: 'Workflow Transformation Success',
      challengeTeaser: 'Warner Bros delivery success rates stuck at just 32% - industry demanded perfection.',
      keyImpact: 'Boosted success rate from 32% to 96% in 3 months',
      metricBadge: '96% Success Rate',
      metricCategory: 'success',
      ctaText: 'Read the Strategy',
      link: '/2/case-studies?tab=warner'
    },
    {
      id: 'ai-powered-innovation',
      title: 'AI-Powered Innovation Pioneer',
      challengeTeaser: 'Manual content review was bottlenecking high-volume TV production growth.',
      keyImpact: 'Reduced manual review time and errors by 50% with AI automation',
      metricBadge: '50% Efficiency Gains',
      metricCategory: 'innovation',
      ctaText: 'Explore the Solution',
      link: '/2/case-studies?tab=ai'
    },
    {
      id: 'emmy-streaming-excellence',
      title: 'Emmy-Winning Live Streaming',
      challengeTeaser: '2018 FIFA World Cup demanded flawless global streaming with zero tolerance for failure.',
      keyImpact: 'Emmy Award recognition for streaming technology excellence',
      metricBadge: 'Emmy Award Winner',
      metricCategory: 'emmy',
      ctaText: 'Discover the Tech',
      link: '/2/case-studies?tab=emmy'
    }
  ]

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
      id="work"
      className={styles.caseStudiesSection}
      aria-labelledby="case-studies-title"
      role="region"
    >
      <div className={styles.container}>
        <header 
          className={`${styles.caseStudiesHeader} ${isVisible ? styles.revealed : ''}`}
        >
          <h2 id="case-studies-title" className={styles.sectionTitle}>
            Case Studies
          </h2>
          <p className={styles.sectionDescription}>
            Delivering measurable results through strategic technical leadership across Fortune 500 enterprises.
          </p>
        </header>

        <div className={styles.caseStudiesGrid}>
          {caseStudies.map((caseStudy, index) => (
            <CaseStudyCard
              key={caseStudy.id}
              caseStudy={caseStudy}
              animationDelay={index * 150} // 150ms stagger as specified
              isVisible={isVisible}
              cardIndex={index}
            />
          ))}
        </div>

        <div className={`${styles.sectionCTA} ${isVisible ? styles.revealed : ''}`}>
          <a 
            href="/2/case-studies/" 
            className={styles.ctaButton}
            aria-label="View all detailed case studies"
          >
            View All Case Studies →
          </a>
          <p className={styles.ctaSupporting}>
            Explore detailed business impact stories with technical implementation insights
          </p>
        </div>
      </div>
    </section>
  )
}

export default CaseStudiesPreview