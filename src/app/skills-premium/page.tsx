'use client';

import { useState } from 'react';
import Link from 'next/link';
import { skillCategories, platformsTools } from '../skills-data';
import styles from './SkillsPremium.module.css';

export default function SkillsPremiumPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleCategory = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className={styles.main}>
      {/* Iridescent Ribbon Decoration */}
      <div className={styles.ribbonTop} aria-hidden="true" />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.badgeDot} />
            <span>Emmy Award Winner</span>
          </div>
          <h1 className={styles.heroTitle}>
            Skills &<br />Expertise
          </h1>
          <p className={styles.heroSubtitle}>
            16+ years of enterprise content operations excellence.
            Building systems that scale, documenting them to last.
          </p>
        </div>
      </section>

      {/* Skills Grid */}
      <section className={styles.skillsSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {skillCategories.map((category, index) => (
              <div key={category.id} className={styles.cardWrapper}>
                {/* Collapsed Card */}
                <button
                  className={`${styles.card} ${openIndex === index ? styles.cardActive : ''}`}
                  onClick={() => toggleCategory(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`panel-${category.id}`}
                >
                  <div className={styles.cardHeader}>
                    <span className={styles.cardPill}>{category.headline}</span>
                    <span className={styles.cardToggle}>
                      {openIndex === index ? '−' : '+'}
                    </span>
                  </div>
                  <p className={styles.cardPreview}>
                    {category.description.substring(0, 100)}...
                  </p>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardDot} />
                    <span className={styles.cardCount}>
                      {category.id === 'platforms-tools'
                        ? `${platformsTools.length} categories`
                        : `${category.competencies.length} competencies`
                      }
                    </span>
                  </div>
                </button>

                {/* Expanded Panel */}
                <div
                  id={`panel-${category.id}`}
                  className={`${styles.panel} ${openIndex === index ? styles.panelOpen : ''}`}
                  role="region"
                  aria-labelledby={`heading-${category.id}`}
                >
                  <div className={styles.panelContent}>
                    {/* Description */}
                    <p className={styles.description}>{category.description}</p>

                    {/* Competencies - Different layout for Platforms & Tools */}
                    {category.id === 'platforms-tools' ? (
                      <div className={styles.platformsGrid}>
                        {platformsTools.map((platform) => (
                          <div key={platform.category} className={styles.platformItem}>
                            <span className={styles.platformDot} />
                            <div>
                              <span className={styles.platformCategory}>{platform.category}</span>
                              <span className={styles.platformTools}>{platform.tools}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <div className={styles.sectionHeader}>
                          <span className={styles.sectionDot} />
                          <h3 className={styles.sectionLabel}>Core Competencies</h3>
                        </div>
                        <ul className={styles.competencies}>
                          {category.competencies.map((comp, i) => (
                            <li key={i} className={styles.competency}>
                              <strong className={styles.competencyLabel}>{comp.label}</strong>
                              <span className={styles.competencyDesc}>{comp.description}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Evidence */}
                        {category.evidence.length > 0 && (
                          <>
                            <div className={styles.sectionHeader}>
                              <span className={styles.sectionDot} />
                              <h3 className={styles.sectionLabel}>Results & Impact</h3>
                            </div>
                            <div className={styles.evidenceGrid}>
                              {category.evidence.map((item, i) => (
                                <div key={i} className={styles.evidenceCard}>
                                  <span className={styles.evidenceDot} />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Iridescent Ribbon Decoration */}
      <div className={styles.ribbonBottom} aria-hidden="true" />

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaBadge}>
            <span className={styles.badgeDot} />
            <span>Portfolio</span>
          </div>
          <h2 className={styles.ctaTitle}>See These Skills<br />In Action</h2>
          <p className={styles.ctaText}>
            Explore detailed case studies showcasing real impact at Fox, Warner Bros, and beyond.
          </p>
          <Link href="/case-studies" className={styles.ctaButton}>
            View Case Studies
            <span className={styles.ctaArrow}>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
