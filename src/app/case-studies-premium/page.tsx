'use client';

import { useState } from 'react';
import Link from 'next/link';
import { caseStudies, CaseStudy } from '../case-studies/case-study-data';
import styles from './CaseStudiesPremium.module.css';

export default function CaseStudiesPremiumPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <main className={styles.main}>
      {/* Iridescent Ribbon Decorations */}
      <div className={styles.ribbonTop} aria-hidden="true" />
      <div className={styles.ribbonBottom} aria-hidden="true" />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.badgeDot} />
            <span>Portfolio</span>
          </div>
          <h1 className={styles.heroTitle}>
            Case<br />Studies
          </h1>
          <p className={styles.heroSubtitle}>
            Real problems. Real solutions. Measurable results.<br />
            Click a card to explore the full story.
          </p>
        </div>
      </section>

      {/* Cards Grid */}
      <section className={styles.cardsSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {caseStudies.map((study) => (
              <CaseStudyCard
                key={study.id}
                study={study}
                isExpanded={expandedId === study.id}
                onToggle={() => toggleExpand(study.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaBadge}>
            <span className={styles.badgeDot} />
            <span>Next Step</span>
          </div>
          <h2 className={styles.ctaTitle}>Ready to Build<br />Something Great?</h2>
          <p className={styles.ctaText}>
            Let&apos;s discuss how I can help with your content operations challenges.
          </p>
          <Link href="/#contact" className={styles.ctaButton}>
            Get in Touch
            <span className={styles.ctaArrow}>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

// Case Study Card Component
function CaseStudyCard({
  study,
  isExpanded,
  onToggle
}: {
  study: CaseStudy;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={styles.cardWrapper}>
      {/* Collapsed Card */}
      <button
        className={`${styles.card} ${isExpanded ? styles.cardActive : ''}`}
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`panel-${study.id}`}
      >
        <div className={styles.cardHeader}>
          <span className={styles.cardPill}>{study.company}</span>
          <span className={styles.cardToggle}>
            {isExpanded ? '−' : '+'}
          </span>
        </div>

        <div className={styles.metricDisplay}>
          <span className={styles.metricValue}>{study.metric}</span>
          <span className={styles.metricLabel}>{study.metricLabel}</span>
        </div>

        <h3 className={styles.cardTitle}>{study.title}</h3>

        <p className={styles.cardPreview}>
          {study.summary.substring(0, 120)}...
        </p>

        <div className={styles.cardFooter}>
          <div className={styles.tags}>
            {study.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>
      </button>

      {/* Expanded Panel */}
      <div
        id={`panel-${study.id}`}
        className={`${styles.panel} ${isExpanded ? styles.panelOpen : ''}`}
        role="region"
        aria-labelledby={`heading-${study.id}`}
      >
        <div className={styles.panelContent}>
          {/* Summary */}
          <p className={styles.fullSummary}>{study.summary}</p>

          {/* Challenge */}
          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionDot} />
              <h4 className={styles.sectionLabel}>The Challenge</h4>
            </div>
            <div className={styles.sectionBody}>
              {study.challenge.split('\n\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Approach */}
          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionDot} />
              <h4 className={styles.sectionLabel}>My Approach</h4>
            </div>
            <div className={styles.approachList}>
              {study.approach.map((item, i) => (
                <div key={i} className={styles.approachItem}>
                  <span className={styles.approachTitle}>{item.title}</span>
                  <p className={styles.approachDesc}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables */}
          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionDot} />
              <h4 className={styles.sectionLabel}>Key Deliverables</h4>
            </div>
            <ul className={styles.deliverablesList}>
              {study.deliverables.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Results */}
          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionDot} />
              <h4 className={styles.sectionLabel}>Results</h4>
            </div>
            <div className={styles.resultsGrid}>
              {study.results.map((result, i) => (
                <div key={i} className={styles.resultCard}>
                  <span className={styles.resultValue}>{result.value}</span>
                  <span className={styles.resultMetric}>{result.metric}</span>
                  {result.context && (
                    <span className={styles.resultContext}>{result.context}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Impact */}
          {study.additionalImpact && study.additionalImpact.length > 0 && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionDot} />
                <h4 className={styles.sectionLabel}>Additional Impact</h4>
              </div>
              <div className={styles.impactCards}>
                {study.additionalImpact.map((item, i) => (
                  <div key={i} className={styles.impactCard}>
                    <span className={styles.impactDot} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
