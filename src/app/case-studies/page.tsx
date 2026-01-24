'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { caseStudies, CaseStudy } from './case-study-data';
import styles from './CaseStudiesEditorial.module.css';

export default function CaseStudiesEditorialPage() {
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const scrollToSection = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) {
      const navHeight = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroLabel}>Portfolio</span>
          <h1 className={styles.heroTitle}>
            Case Studies
          </h1>
          <p className={styles.heroSubtitle}>
            Real problems. Real solutions. Measurable results.
          </p>

          {/* Quick Navigation */}
          <nav className={styles.quickNav} aria-label="Case studies navigation">
            {caseStudies.map((study, index) => (
              <button
                key={study.id}
                className={styles.quickNavItem}
                onClick={() => scrollToSection(study.id)}
              >
                <span className={styles.quickNavNumber}>/{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.quickNavLabel}>{study.company}</span>
              </button>
            ))}
          </nav>
        </div>

      </section>

      {/* Case Study Sections */}
      <div className={styles.sectionsContainer}>
        {caseStudies.map((study, index) => (
          <CaseStudySection
            key={study.id}
            study={study}
            index={index}
            onBackToTop={scrollToTop}
            ref={(el) => { sectionRefs.current[study.id] = el; }}
          />
        ))}
      </div>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <span className={styles.ctaLabel}>Next Step</span>
          <h2 className={styles.ctaTitle}>Ready to Build Something That Scales?</h2>
          <p className={styles.ctaText}>
            Let&apos;s discuss how I can help with your content operations challenges.
          </p>
          <Link href="/#contact" className={styles.ctaButton}>
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  );
}

// Case Study Section Component
import { forwardRef } from 'react';

const CaseStudySection = forwardRef<HTMLElement, { study: CaseStudy; index: number; onBackToTop: () => void }>(
  function CaseStudySection({ study, index, onBackToTop }, ref) {
    const isEven = index % 2 === 0;

    return (
      <article
        id={study.id}
        ref={ref}
        className={`${styles.caseStudySection} ${isEven ? styles.sectionLight : styles.sectionDark}`}
      >
        {/* Section Number */}
        <div className={styles.sectionNumber}>
          /{String(index + 1).padStart(2, '0')}
        </div>

        <div className={styles.sectionInner}>
          {/* Header */}
          <header className={styles.sectionHeader}>
            <div className={styles.headerMeta}>
              <span className={styles.company}>{study.company}</span>
              <div className={styles.tags}>
                {study.tags.map((tag, i) => (
                  <span key={i} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>

            <h2 className={styles.sectionTitle}>{study.title}</h2>

            <div className={styles.metricHighlight}>
              <span className={styles.metricValue}>{study.metric}</span>
              <span className={styles.metricLabel}>{study.metricLabel}</span>
            </div>
          </header>

          {/* Summary */}
          <p className={styles.summary}>{study.summary}</p>

          {/* Two Column Layout */}
          <div className={styles.contentGrid}>
            {/* Left Column: Challenge + Approach */}
            <div className={styles.columnLeft}>
              <div className={styles.block}>
                <h3 className={styles.blockTitle}>The Challenge</h3>
                <div className={styles.blockContent}>
                  {study.challenge.split('\n\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              <div className={styles.block}>
                <h3 className={styles.blockTitle}>My Approach</h3>
                <div className={styles.approachList}>
                  {study.approach.map((item, i) => (
                    <div key={i} className={styles.approachItem}>
                      <span className={styles.approachNumber}>{i + 1}</span>
                      <div>
                        <h4 className={styles.approachTitle}>{item.title}</h4>
                        <p className={styles.approachDesc}>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Deliverables + Results */}
            <div className={styles.columnRight}>
              <div className={styles.block}>
                <h3 className={styles.blockTitle}>Key Deliverables</h3>
                <ul className={styles.deliverablesList}>
                  {study.deliverables.map((item, i) => (
                    <li key={i}>
                      <span className={styles.checkmark}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.block}>
                <h3 className={styles.blockTitle}>Results</h3>
                <div className={styles.resultsGrid}>
                  {study.results.map((result, i) => (
                    <div key={i} className={styles.resultItem}>
                      <span className={styles.resultValue}>{result.value}</span>
                      <span className={styles.resultMetric}>{result.metric}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Impact */}
              {study.additionalImpact && study.additionalImpact.length > 0 && (
                <div className={styles.impactBlock}>
                  {study.additionalImpact.map((item, i) => (
                    <p key={i} className={styles.impactItem}>
                      <span className={styles.impactIcon}>★</span>
                      {item}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back to Top */}
        <button
          className={styles.backToTop}
          onClick={onBackToTop}
          aria-label="Back to top"
        >
          ↑ Back to top
        </button>
      </article>
    );
  }
);
