'use client';

import { useState } from 'react';
import Link from 'next/link';
import { skillCategories, platformsTools } from '../skills-data';
import styles from './SkillsEditorial.module.css';

export default function SkillsEditorialPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleCategory = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Skills & Expertise</h1>
          <p className={styles.heroSubtitle}>
            16+ years building content operations that scale—from Emmy-winning platforms to AI-powered intelligence systems.
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
                  <span className={styles.cardNumber}>0{index + 1}</span>
                  <h2 className={styles.cardTitle}>{category.headline}</h2>
                  <p className={styles.cardPreview}>
                    {category.description.substring(0, 80)}...
                  </p>
                  <span className={styles.cardToggle}>
                    {openIndex === index ? '−' : '+'}
                  </span>
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
                            <span className={styles.platformCategory}>{platform.category}</span>
                            <span className={styles.platformTools}>{platform.tools}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <h3 className={styles.sectionLabel}>Core Competencies</h3>
                        <ul className={styles.competencies}>
                          {category.competencies.map((comp, i) => (
                            <li key={i} className={styles.competency}>
                              <strong className={styles.competencyLabel}>{comp.label}</strong>
                              <span className={styles.competencyDesc}> — {comp.description}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Evidence */}
                        {category.evidence.length > 0 && (
                          <>
                            <h3 className={styles.sectionLabel}>Evidence</h3>
                            <ul className={styles.evidence}>
                              {category.evidence.map((item, i) => (
                                <li key={i} className={styles.evidenceItem}>{item}</li>
                              ))}
                            </ul>
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

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>See These Skills in Action</h2>
          <p className={styles.ctaText}>
            Explore real projects where I&apos;ve applied these capabilities to deliver measurable results.
          </p>
          <Link href="/case-studies" className={styles.ctaButton}>
            View Case Studies →
          </Link>
        </div>
      </section>
    </main>
  );
}
