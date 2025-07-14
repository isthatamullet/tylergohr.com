"use client"

import React, { useEffect, useRef, useState, Suspense, lazy } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Section } from '@/components/Section/Section'
import { BrowserTabs, CaseStudyContent } from '@/components/BrowserTabs'
import type { TabData } from '@/components/BrowserTabs'
import styles from './page.module.css'

// Lazy load footer and business metrics for better performance
const Footer = lazy(() => import('@/components/Footer/Footer'))

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
    challenge: 'Fox Corporation needed to revolutionize their content strategy for their largest direct-to-consumer video product, managing 80,000+ digital products while ensuring high-quality, engaging content across diverse platforms. The existing system was inefficient, costly, and couldn&apos;t scale with their growing streaming ambitions.',
    solution: 'As Lead Content Operator, I architected a comprehensive content distribution platform that handled everything from content ingest and user account management to monetization and digital rights management. I completely reworked workflows for closed captioning, digital asset management, and created a product component tracking system that connected all required digital components.',
    implementation: [
      'Content Management: Designed workflows for video, audio, captions, subtitles, metadata, and artwork',
      'Quality Standards: Established industry-leading quality protocols across all content types',
      'Platform Integration: Seamless distribution across Fox Nation, Fox Weather, and pay-per-view events',
      'Security: Implemented robust DRM systems and paywall protection'
    ],
    results: [
      '2-Year ROI Impact: Saved Fox Corporation &quot;a few million bucks&quot; through strategic optimization within two years',
      'Efficiency Gains: Improved content management efficiency by 50% through enhanced systems',
      'Revenue Growth: Contributed to successful launches of Fox Nation and Fox Weather platforms',
      'Quality Excellence: Achieved industry-leading content standards across 80,000+ digital products'
    ],
    businessValue: 'Whether you&apos;re managing hundreds of products or thousands of digital assets, the right systems architecture makes the difference between chaos and success. I bring the same strategic thinking to businesses of every size — from custom e-commerce platforms to content management solutions that scale with your growth.',
    badge: {
      label: '2-Year ROI Impact',
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
      '200% Performance Improvement: Boosted delivery success from 32% to 96% in just 3 months',
      'Operational Excellence: Sustained improvement through systematic process enhancement',
      'Industry Recognition: Hosted visits from Warner Bros executives and Apple&apos;s head of iTunes Movies',
      'Knowledge Transfer: Created comprehensive training materials for cross-departmental use'
    ],
    businessValue: 'Every business has processes that could work better. I specialize in identifying what&apos;s not working, why it&apos;s failing, and implementing solutions that deliver measurable improvements. Whether it&apos;s your customer onboarding, order fulfillment, or content workflow — strategic process optimization drives real business results.',
    badge: {
      label: 'Success Rate',
      value: '200%',
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
      'Efficiency Gains: Reduced manual review time and error rates by 50-75%',
      'Innovation Leadership: Pioneered AI implementation in content production workflows',
      'Competitive Advantage: Advanced capabilities ahead of industry standard adoption'
    ],
    businessValue: 'AI isn&apos;t just for big corporations — smart automation can streamline any business process. From customer service chatbots to inventory management, I help businesses identify where AI can eliminate repetitive tasks, reduce errors, and free up your team to focus on what matters most: growing your business.',
    badge: {
      label: 'Efficiency Gains',
      value: '50-75%',
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
    businessValue: 'When your business depends on technology performing flawlessly, you need solutions built to the highest standards. Whether it&apos;s your e-commerce platform during Black Friday, your booking system during peak season, or your app launch — I build systems that perform when it matters most.',
    badge: {
      label: 'Emmy Award',
      value: 'Winner',
      type: 'emmy'
    }
  }
]

// Component that uses search params - needs to be wrapped in Suspense
function CaseStudiesPageContent() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})
  const searchParams = useSearchParams()

  // Map URL tab parameters to actual case study IDs
  const tabMapping = {
    'emmy': 'emmy-winning-streaming',
    'fox': 'content-distribution-platform', 
    'warner': 'workflow-transformation',
    'ai': 'ai-powered-innovation'
  }

  // Get the default tab from URL parameter or fall back to first case study
  const getDefaultTab = (): string => {
    const tabParam = searchParams.get('tab')
    if (tabParam && tabParam in tabMapping) {
      return tabMapping[tabParam as keyof typeof tabMapping]
    }
    return 'content-distribution-platform' // Default to first tab
  }

  const [defaultTab] = useState<string>(getDefaultTab)

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

  // Transform case studies data into tab format with shorter tab labels
  const caseStudyTabs: TabData[] = caseStudies.map((study) => {
    // Map long titles to shorter tab labels
    const tabLabels: { [key: string]: string } = {
      'content-distribution-platform': 'Cost Savings',
      'workflow-transformation': 'Workflow', 
      'ai-powered-innovation': 'AI',
      'emmy-winning-streaming': 'Emmy'
    }
    
    return {
      id: study.id,
      label: tabLabels[study.id] || study.title,
      badge: study.badge,
      content: <CaseStudyContent study={study} />,
      type: study.badge.type
    }
  })

  const handleTabChange = (tabId: string) => {
    // Optional: Add analytics tracking
    console.log(`Viewed case study: ${tabId}`)
  }

  return (
    <>
      {/* Hero Section - Blue Bar Only */}
      <Section background="case-studies" paddingY="none" className={styles.compactHero}>
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
            tabs={caseStudyTabs}
            defaultTab={defaultTab}
            onTabChange={handleTabChange}
            className={styles.caseStudiesBrowser}
          />
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
              Ready to deliver similar results for your business?
            </h2>
            <p className={styles.ctaDescription}>
              Let{"'"}s discuss your project and explore how my proven approach to strategic technical leadership 
              can deliver the measurable outcomes your business needs.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/#contact" className={styles.ctaPrimary}>
                Start Your Project →
              </Link>
              <Link href="/" className={styles.ctaSecondary}>
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
export default function CaseStudiesDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CaseStudiesPageContent />
    </Suspense>
  )
}