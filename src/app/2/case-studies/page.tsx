"use client"

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Section } from '@/app/2/components/Section/Section'
import styles from './page.module.css'

interface CaseStudy {
  id: string
  title: string
  company: string
  challenge: string
  solution: string
  implementation: string[]
  results: string[]
  businessValue: string
  badge: {
    label: string
    value: string
    type: 'emmy' | 'savings' | 'success' | 'innovation'
  }
}

const caseStudies: CaseStudy[] = [
  {
    id: 'content-distribution-platform',
    title: 'Content Distribution Platform Revolution',
    company: 'Fox Corporation',
    challenge: 'Fox Corporation needed to revolutionize their content strategy for their largest direct-to-consumer video product, managing over 17,000 titles while ensuring high-quality, engaging content across diverse platforms. The existing system was inefficient, costly, and couldn&apos;t scale with their growing streaming ambitions.',
    solution: 'As Lead Content Operator, I architected a comprehensive content distribution platform that handled everything from content ingest and user account management to monetization and digital rights management. I completely reworked workflows for closed captioning, digital asset management, and created a product component tracking system that connected all required digital components.',
    implementation: [
      'Content Management: Designed workflows for video, audio, captions, subtitles, metadata, and artwork',
      'Quality Standards: Established industry-leading quality protocols across all content types',
      'Platform Integration: Seamless distribution across Fox Nation, Fox Weather, and pay-per-view events',
      'Security: Implemented robust DRM systems and paywall protection'
    ],
    results: [
      'Cost Savings: Saved Fox Corporation &quot;a few million bucks&quot; through strategic optimization',
      'Efficiency Gains: Improved content management efficiency by 50% through enhanced systems',
      'Revenue Growth: Contributed to successful launches of Fox Nation and Fox Weather platforms',
      'Quality Excellence: Achieved industry-leading content standards across 17,000+ titles'
    ],
    businessValue: 'Whether you&apos;re managing hundreds of products or thousands of digital assets, the right systems architecture makes the difference between chaos and success. I bring the same strategic thinking to businesses of every size—from custom e-commerce platforms to content management solutions that scale with your growth.',
    badge: {
      label: 'Cost Savings',
      value: '$2M+',
      type: 'savings'
    }
  },
  {
    id: 'workflow-transformation',
    title: 'Workflow Transformation Success',
    company: 'Warner Bros Entertainment',
    challenge: 'At Warner Bros Entertainment, feature film delivery success rates were stuck at just 32%. The industry standard demanded near-perfect delivery, but existing processes, vendor relationships, and quality control measures were failing to meet the mark consistently.',
    solution: 'Within my first 3 months, I conducted comprehensive historical research and collaborative root cause analyses. I completely redesigned content strategies, established new operational standards, and rebuilt vendor relationships while introducing enhanced content review standards that addressed the core issues systematically.',
    implementation: [
      'Root Cause Analysis: Deep dive into historical failures to identify systemic issues',
      'Process Redesign: Created new SOPs for content processing, QC, and delivery',
      'Vendor Management: Strengthened relationships with global content platforms',
      'Quality Standards: Implemented robust review measures aligned with industry requirements'
    ],
    results: [
      'Success Rate: Boosted delivery success from 32% to 96% in just 3 months',
      'Operational Excellence: Sustained improvement through systematic process enhancement',
      'Industry Recognition: Hosted visits from Warner Bros executives and Apple&apos;s head of iTunes Movies',
      'Knowledge Transfer: Created comprehensive training materials for cross-departmental use'
    ],
    businessValue: 'Every business has processes that could work better. I specialize in identifying what&apos;s not working, why it&apos;s failing, and implementing solutions that deliver measurable improvements. Whether it&apos;s your customer onboarding, order fulfillment, or content workflow—strategic process optimization drives real business results.',
    badge: {
      label: 'Success Rate',
      value: '96%',
      type: 'success'
    }
  },
  {
    id: 'ai-powered-innovation',
    title: 'AI-Powered Innovation Pioneer',
    company: 'SDI Media',
    challenge: 'High-volume TV production was bottlenecked by manual content review processes. With increasing output demands, the team needed to maintain quality standards while significantly scaling throughput. Manual ad break detection and content processing were slowing down production and limiting growth potential.',
    solution: 'I pioneered the integration of AI tools for content creation, moderation, and optimization. The flagship innovation was an automated ad break time code detection system for TV episodic and made-for-TV film content, enabling content specialists to quickly identify and approve placement while maintaining quality standards.',
    implementation: [
      'AI Automation: Developed automated ad break detection reducing manual review time',
      'Quality Maintenance: Ensured AI tools enhanced rather than replaced human expertise',
      'Workflow Integration: Seamlessly integrated AI tools into existing production processes',
      'Scalable Solutions: Created systems that could handle increasing content volume'
    ],
    results: [
      'Efficiency: Significantly increased high-volume output while maintaining quality',
      'Cost Reduction: Reduced manual review time and error rates by 50%',
      'Innovation Leadership: Pioneered AI implementation in content production workflows',
      'Competitive Advantage: Advanced capabilities ahead of industry standard adoption'
    ],
    businessValue: 'AI isn&apos;t just for big corporations—smart automation can streamline any business process. From customer service chatbots to inventory management, I help businesses identify where AI can eliminate repetitive tasks, reduce errors, and free up your team to focus on what matters most: growing your business.',
    badge: {
      label: 'Efficiency Gains',
      value: '50%',
      type: 'innovation'
    }
  },
  {
    id: 'emmy-winning-streaming',
    title: 'Emmy-Winning Live Streaming Excellence',
    company: '2018 FIFA World Cup',
    challenge: 'The 2018 FIFA World Cup demanded flawless live streaming technology that could deliver high-quality content globally across any device. The technical complexity of real-time, global distribution with perfect reliability required implementing a completely new content management system under pressure.',
    solution: 'I implemented a cutting-edge CMS specifically designed to handle live streaming for the World Cup, ensuring high-quality content could be easily accessed on almost any device with a screen. The system had to perform flawlessly under the intense scrutiny of global audiences and technical experts.',
    implementation: [
      'Live Streaming Innovation: Implemented real-time content distribution system',
      'Global Scalability: Ensured worldwide accessibility across all device types',
      'Quality Assurance: Maintained broadcast-quality standards for live content',
      'Real-time Performance: Zero-tolerance system for delays or quality degradation'
    ],
    results: [
      'Emmy Award: Recognized by The National Academy of Television Arts & Sciences',
      'Global Success: Flawless performance during high-visibility international event',
      'Technical Achievement: Industry recognition for streaming technology innovation',
      'Reliability: Perfect uptime during critical live broadcast periods'
    ],
    businessValue: 'When your business depends on technology performing flawlessly, you need solutions built to the highest standards. Whether it&apos;s your e-commerce platform during Black Friday, your booking system during peak season, or your app launch—I build systems that perform when it matters most.',
    badge: {
      label: 'Emmy Award',
      value: 'Winner',
      type: 'emmy'
    }
  }
]

export default function CaseStudiesDetailPage() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
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

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId]
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      {/* Hero Section */}
      <Section background="case-studies" paddingY="md" className={styles.compactHero}>
        <div 
          ref={(el) => { sectionRefs.current['hero'] = el }}
          data-section-id="hero"
          className={styles.heroContainer}
        >
          {/* Hero Content */}
          <header className={`${styles.heroHeader} ${visibleSections.has('hero') ? styles.revealed : ''}`}>
            <h1 className={styles.heroTitle}>
              Case Studies
            </h1>
            <p className={styles.heroDescription}>
              Deep-dive into strategic technical leadership delivering measurable results across Fortune 500 enterprises.
            </p>
          </header>

          {/* Quick Navigation */}
          <nav className={`${styles.quickNav} ${visibleSections.has('hero') ? styles.revealed : ''}`} aria-label="Case study navigation">
            <h2 className={styles.quickNavTitle}>Featured Case Studies</h2>
            <ul className={styles.quickNavList}>
              {caseStudies.map((study, index) => (
                <li
                  key={study.id}
                  className={styles.quickNavItem}
                  style={{ '--item-index': index } as React.CSSProperties}
                >
                  <button
                    onClick={() => scrollToSection(study.id)}
                    className={styles.quickNavButton}
                  >
                    <span className={`${styles.badge} ${styles[`badge--${study.badge.type}`]}`}>
                      <span className={styles.badgeValue}>{study.badge.value}</span>
                      <span className={styles.badgeLabel}>{study.badge.label}</span>
                    </span>
                    <span className={styles.studyTitle}>{study.title}</span>
                    <span className={styles.studyCompany}>{study.company}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Section>

      {/* Case Studies Detail Sections */}
      {caseStudies.map((study, index) => (
        <Section
          key={study.id}
          background={index % 2 === 0 ? 'hero' : 'about'}
          paddingY="xl"
        >
          <div
            ref={(el) => { sectionRefs.current[study.id] = el }}
            data-section-id={study.id}
            className={`${styles.caseStudySection} ${visibleSections.has(study.id) ? styles.revealed : ''}`}
            id={study.id}
          >
            <div className={styles.caseStudyContainer}>
              {/* Case Study Header */}
              <header className={styles.caseStudyHeader}>
                <div className={`${styles.badge} ${styles[`badge--${study.badge.type}`]} ${styles.badgeLarge}`}>
                  <span className={styles.badgeValue}>{study.badge.value}</span>
                  <span className={styles.badgeLabel}>{study.badge.label}</span>
                </div>
                <h2 className={styles.caseStudyTitle}>{study.title}</h2>
                <p className={styles.caseStudyCompany}>{study.company}</p>
              </header>

              {/* Case Study Content Grid */}
              <div className={styles.caseStudyGrid}>
                {/* Challenge */}
                <div className={styles.contentSection}>
                  <h3 className={styles.contentTitle}>The Challenge</h3>
                  <p className={styles.contentText}>{study.challenge}</p>
                </div>

                {/* Solution */}
                <div className={styles.contentSection}>
                  <h3 className={styles.contentTitle}>My Solution</h3>
                  <p className={styles.contentText}>{study.solution}</p>
                </div>

                {/* Technical Implementation */}
                <div className={styles.contentSection}>
                  <h3 className={styles.contentTitle}>Technical Implementation</h3>
                  <ul className={styles.contentList}>
                    {study.implementation.map((item, i) => (
                      <li key={i} className={styles.contentListItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Results */}
                <div className={styles.contentSection}>
                  <h3 className={styles.contentTitle}>Measurable Results</h3>
                  <ul className={styles.contentList}>
                    {study.results.map((result, i) => (
                      <li key={i} className={styles.contentListItem}>
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Business Value */}
              <div className={styles.businessValue}>
                <h3 className={styles.businessValueTitle}>What This Means for Your Business</h3>
                <p className={styles.businessValueText}>{study.businessValue}</p>
              </div>
            </div>
          </div>
        </Section>
      ))}

      {/* Call to Action Section */}
      <Section background="contact" paddingY="xl">
        <div 
          ref={(el) => { sectionRefs.current['cta'] = el }}
          data-section-id="cta"
          className={`${styles.ctaSection} ${visibleSections.has('cta') ? styles.revealed : ''}`}
        >
          <div className={styles.ctaContainer}>
            <h2 className={styles.ctaTitle}>
              Ready to deliver similar results for your business?
            </h2>
            <p className={styles.ctaDescription}>
              Let&apos;s discuss your project and explore how my proven approach to strategic technical leadership 
              can deliver the measurable outcomes your business needs.
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