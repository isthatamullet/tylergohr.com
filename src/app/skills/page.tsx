'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { skillCategories, platformsTools } from '../skills-data';
import styles from './Skills.module.css';
import Footer from '@/components/redesign/Footer';

export default function SkillsNeonPage() {
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const scrollToSection = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) {
      const navHeight = 100; // Account for fixed nav
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroLabel}>Expertise</span>
          <h1 className={styles.heroTitle}>
            Skills &<br />Capabilities
          </h1>
          <p className={styles.heroSubtitle}>
            Building content operations that scale—from streaming platforms to AI systems.
          </p>
        </div>
      </section>

      {/* Navigation Menu */}
      <section className={styles.menuSection}>
        <div className={styles.container}>
          <nav className={styles.menu} aria-label="Skills navigation">
            {skillCategories.map((category, index) => (
              <button
                key={category.id}
                className={styles.menuItem}
                onClick={() => scrollToSection(category.id)}
              >
                <span className={styles.menuNumber}>/{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.menuTitle}>{category.headline}</span>
                <span className={styles.menuArrow}>→</span>
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* Full Sections */}
      <section className={styles.sectionsContainer}>
        <div className={styles.container}>
          {skillCategories.map((category, index) => (
            <article
              key={category.id}
              id={category.id}
              ref={(el) => { sectionRefs.current[category.id] = el; }}
              className={styles.skillSection}
            >
              {/* Section Header */}
              <header className={styles.sectionHeader}>
                <span className={styles.sectionNumber}>/{String(index + 1).padStart(2, '0')}</span>
                <h2 className={styles.sectionTitle}>{category.headline}</h2>
              </header>

              {/* Section Content */}
              <div className={styles.sectionContent}>
                <p className={styles.sectionDescription}>{category.description}</p>

                {/* Competencies - Different layout for Platforms & Tools */}
                {category.id === 'platforms-tools' ? (
                  <div className={styles.platformsGrid}>
                    {platformsTools.map((platform) => (
                      <div key={platform.category} className={styles.platformCard}>
                        <span className={styles.platformCategory}>{platform.category}</span>
                        <span className={styles.platformTools}>{platform.tools}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.contentGrid}>
                    {/* Competencies Column */}
                    <div className={styles.competenciesColumn}>
                      <h3 className={styles.columnLabel}>Core Competencies</h3>
                      <ul className={styles.competencies}>
                        {category.competencies.map((comp, i) => (
                          <li key={i} className={styles.competency}>
                            <span className={styles.competencyBullet}>→</span>
                            <div>
                              <strong className={styles.competencyLabel}>{comp.label}</strong>
                              <p className={styles.competencyDesc}>{comp.description}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Evidence Column */}
                    {category.evidence.length > 0 && (
                      <div className={styles.evidenceColumn}>
                        <h3 className={styles.columnLabel}>Results</h3>
                        <div className={styles.evidenceCards}>
                          {category.evidence.map((item, i) => (
                            <div key={i} className={styles.evidenceCard}>
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Back to top */}
              <button
                className={styles.backToTop}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                ↑ Back to menu
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <span className={styles.ctaLabel}>Next Step</span>
          <h2 className={styles.ctaTitle}>See the Work</h2>
          <p className={styles.ctaText}>
            Real projects. Real results. Real impact.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/#contact" className={styles.ctaButton}>
              Get in Touch
            </Link>
            <Link href="/case-studies" className={styles.ctaButtonSecondary}>
              View Case Studies
            </Link>
          </div>
        </div>
      </section>

      <Footer hideCtaCard />
    </main>
  );
}
