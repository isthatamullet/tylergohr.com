'use client';

import { useState } from 'react';
import Link from 'next/link';
import { caseStudies, CaseStudy } from '../case-studies/case-study-data';
import styles from './CaseStudiesTerminal.module.css';

export default function CaseStudiesTerminalPage() {
  const [activeTab, setActiveTab] = useState<string>(caseStudies[0].id);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setIsTransitioning(false);
    }, 150);
  };

  const activeStudy = caseStudies.find(cs => cs.id === activeTab) || caseStudies[0];

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroLabel}>~/portfolio/case-studies</span>
          <h1 className={styles.heroTitle}>
            Case<br />Studies
          </h1>
          <p className={styles.heroSubtitle}>
            Real problems. Real solutions. Measurable results.
          </p>
        </div>
      </section>

      {/* Terminal Window */}
      <section className={styles.terminalSection}>
        <div className={styles.container}>
          <div className={styles.terminalWindow}>
            {/* Window Chrome */}
            <div className={styles.windowChrome}>
              <div className={styles.windowControls}>
                <span className={`${styles.windowDot} ${styles.dotClose}`} />
                <span className={`${styles.windowDot} ${styles.dotMinimize}`} />
                <span className={`${styles.windowDot} ${styles.dotMaximize}`} />
              </div>
              <div className={styles.windowTitle}>
                case-studies — bash — 120×40
              </div>
              <div className={styles.windowActions} />
            </div>

            {/* Tab Bar */}
            <div className={styles.tabBar} role="tablist">
              {caseStudies.map((study) => (
                <button
                  key={study.id}
                  role="tab"
                  aria-selected={activeTab === study.id}
                  className={`${styles.tab} ${activeTab === study.id ? styles.tabActive : ''}`}
                  onClick={() => handleTabChange(study.id)}
                >
                  <span className={styles.tabIcon}>📄</span>
                  <span className={styles.tabLabel}>{study.tabLabel}</span>
                  {activeTab === study.id && <span className={styles.tabClose}>×</span>}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className={styles.contentArea}>
              <div className={styles.sidebar}>
                {/* Line Numbers */}
                <div className={styles.lineNumbers}>
                  {Array.from({ length: 50 }, (_, i) => (
                    <span key={i} className={styles.lineNumber}>{i + 1}</span>
                  ))}
                </div>
              </div>

              <div
                className={`${styles.editorContent} ${isTransitioning ? styles.transitioning : ''}`}
              >
                <CaseStudyContent study={activeStudy} />
              </div>
            </div>

            {/* Status Bar */}
            <div className={styles.statusBar}>
              <div className={styles.statusLeft}>
                <span className={styles.statusItem}>
                  <span className={styles.statusIcon}>⎇</span> main
                </span>
                <span className={styles.statusItem}>UTF-8</span>
              </div>
              <div className={styles.statusRight}>
                <span className={styles.statusItem}>Markdown</span>
                <span className={styles.statusItem}>Ln 1, Col 1</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <span className={styles.ctaLabel}>$ next --step</span>
          <h2 className={styles.ctaTitle}>Ready to Talk?</h2>
          <p className={styles.ctaText}>
            Let&apos;s discuss how I can help with your content operations challenges.
          </p>
          <Link href="/#contact" className={styles.ctaButton}>
            Get in Touch
            <span className={styles.ctaCursor}>_</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

// Case Study Content Component (Markdown-style)
function CaseStudyContent({ study }: { study: CaseStudy }) {
  return (
    <article className={styles.caseStudy}>
      {/* Header */}
      <header className={styles.caseStudyHeader}>
        <div className={styles.metricBadge}>
          <span className={styles.metricValue}>{study.metric}</span>
          <span className={styles.metricLabel}>{study.metricLabel}</span>
        </div>
        <h2 className={styles.caseStudyTitle}>
          <span className={styles.mdHash}># </span>
          {study.title}
        </h2>
        <p className={styles.caseStudyCompany}>{study.company}</p>
      </header>

      {/* Summary */}
      <p className={styles.summary}>{study.summary}</p>

      {/* Challenge */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.mdHash}>## </span>
          The Challenge
        </h3>
        <div className={styles.sectionContent}>
          {study.challenge.split('\n\n').map((paragraph, i) => (
            <p key={i} className={styles.paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* Approach */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.mdHash}>## </span>
          My Approach
        </h3>
        <div className={styles.approachGrid}>
          {study.approach.map((item, i) => (
            <div key={i} className={styles.approachItem}>
              <h4 className={styles.approachTitle}>
                <span className={styles.mdBullet}>- </span>
                <span className={styles.highlight}>{item.title}:</span>
              </h4>
              <p className={styles.approachDesc}>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Deliverables */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.mdHash}>## </span>
          Key Deliverables
        </h3>
        <ul className={styles.deliverablesList}>
          {study.deliverables.map((item, i) => (
            <li key={i} className={styles.deliverableItem}>
              <span className={styles.mdBullet}>- </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Results */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.mdHash}>## </span>
          Results
        </h3>
        <div className={styles.resultsTable}>
          <div className={styles.tableHeader}>
            <span>| Metric</span>
            <span>| Value</span>
            <span>| Context |</span>
          </div>
          <div className={styles.tableDivider}>|--------|--------|---------|</div>
          {study.results.map((result, i) => (
            <div key={i} className={styles.tableRow}>
              <span>| {result.metric}</span>
              <span>| <span className={styles.resultValue}>{result.value}</span></span>
              <span>| {result.context || '-'} |</span>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Impact */}
      {study.additionalImpact && study.additionalImpact.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.mdHash}>## </span>
            Additional Impact
          </h3>
          <ul className={styles.impactList}>
            {study.additionalImpact.map((item, i) => (
              <li key={i} className={styles.impactItem}>
                <span className={styles.mdBullet}>&gt; </span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tags */}
      <footer className={styles.caseStudyFooter}>
        <span className={styles.tagsLabel}>tags: </span>
        {study.tags.map((tag, i) => (
          <span key={i} className={styles.tag}>[{tag}]</span>
        ))}
      </footer>
    </article>
  );
}
