"use client"

import React, { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { CaseStudyCard } from './CaseStudyCard'
import { isWebGLReady } from '../../lib/webgl-detection'
import styles from './CaseStudiesPreview.module.css'

// Dynamically import 3D component to prevent SSR issues
const CaseStudyCard3D = dynamic(() => import('./CaseStudyCard3D'), {
  ssr: false,
  loading: () => null // Use 2D version as loading fallback (handled by progressive enhancement)
})

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
  const [webglReady, setWebglReady] = useState<boolean | null>(null) // null = checking, boolean = determined
  const sectionRef = useRef<HTMLElement>(null)

  // Parallax effect for background
  useEffect(() => {
    const handleParallax = () => {
      if (!sectionRef.current) return;
      
      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const scrollY = window.pageYOffset;
      const windowHeight = window.innerHeight;
      
      // Only apply parallax when section is in view
      if (scrollY + windowHeight > sectionTop && scrollY < sectionTop + sectionHeight) {
        const backgroundElement = sectionRef.current.querySelector('[data-parallax-bg]') as HTMLElement;
        if (backgroundElement) {
          const parallaxSpeed = 0.3; // Background moves 30% slower than scroll
          const yPos = (scrollY - sectionTop) * parallaxSpeed;
          backgroundElement.style.transform = `translate3d(0, ${yPos}px, 0)`;
        }
      }
    };

    // Throttle scroll events for performance
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleParallax();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Case studies data from PORTFOLIO-REDESIGN-CONTENT-CONDENSED.md
  const caseStudies: CaseStudy[] = [
    {
      id: 'content-distribution-platform',
      title: 'Content Distribution Platform Revolution',
      challengeTeaser: 'Fox Corporation needed to manage 50,000+ video titles and reduce costs.',
      keyImpact: 'Saved "a few million bucks" through strategic optimization',
      metricBadge: '$2M+ Cost Savings',
      metricCategory: 'savings',
      ctaText: 'See How I Did It',
      link: '/case-studies?tab=fox'
    },
    {
      id: 'workflow-transformation',
      title: 'Workflow Transformation Success',
      challengeTeaser: 'Warner Bros delivery success rates stuck at just 32% - industry demanded perfection.',
      keyImpact: 'Warner Bros delivery performance increased from 32% to 96% in first 3 months through strategic redesign',
      metricBadge: '200% Performance Improvement',
      metricCategory: 'success',
      ctaText: 'Read the Strategy',
      link: '/case-studies?tab=warner'
    },
    {
      id: 'ai-powered-innovation',
      title: 'AI-Powered Innovation Pioneer',
      challengeTeaser: 'Manual content review was bottlenecking high-volume TV production growth.',
      keyImpact: 'Reduced manual review time and errors by 50-75% with AI automation',
      metricBadge: '50-75% Efficiency Gains',
      metricCategory: 'innovation',
      ctaText: 'Explore the Solution',
      link: '/case-studies?tab=ai'
    },
    {
      id: 'emmy-streaming-excellence',
      title: 'Emmy-Winning Live Streaming',
      challengeTeaser: '2018 FIFA World Cup demanded flawless global streaming with zero tolerance for failure.',
      keyImpact: 'Emmy Award recognition for streaming technology excellence',
      metricBadge: 'Emmy Award Winner',
      metricCategory: 'emmy',
      ctaText: 'Discover the Tech',
      link: '/case-studies?tab=emmy'
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

  // Client-only WebGL detection for progressive enhancement
  useEffect(() => {
    // Small delay to ensure client-side hydration is complete
    const timer = setTimeout(() => {
      try {
        const isReady = isWebGLReady()
        setWebglReady(isReady)
      } catch (error) {
        console.warn('WebGL detection failed for 3D cards, using 2D fallback:', error)
        setWebglReady(false)
      }
    }, 150) // Slightly longer delay for stability

    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="work"
      className={styles.caseStudiesSection}
      aria-labelledby="case-studies-title"
      role="region"
    >
      {/* Parallax background overlay */}
      <div 
        className={styles.backgroundOverlay} 
        data-parallax-bg
        aria-hidden="true"
      />
      
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
          {caseStudies.map((caseStudy, index) => {
            // Progressive Enhancement: Use 3D cards when WebGL ready, otherwise 2D
            const CardComponent = webglReady === true ? CaseStudyCard3D : CaseStudyCard;
            
            return (
              <CardComponent
                key={caseStudy.id}
                caseStudy={caseStudy}
                animationDelay={index * 150} // 150ms stagger as specified
                isVisible={isVisible}
                cardIndex={index}
              />
            );
          })}
        </div>

        <div className={`${styles.sectionCTA} ${isVisible ? styles.revealed : ''}`}>
          <a 
            href="/case-studies/" 
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