"use client";

import styles from "./page.module.css";
import Navigation from "./components/Navigation/Navigation";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Results from "./components/Results/Results";
import { Button } from "./components/ui/Button/Button";

export default function EnterprisePage() {

  return (
    <>
      {/* Enterprise Solutions Navigation */}
      <Navigation />
      
      <main id="main-content" className={styles.main} role="main">
        {/* Hero Section - Enterprise Solutions Architect */}
        <Hero />

        {/* About Section - Network Animation */}
        <About />

        {/* Results & Impact Section - Measurable Outcomes */}
        <Results />

        {/* Case Studies Section - Placeholder */}
        <section
          id="work"
          className={styles.caseStudiesSection}
          aria-labelledby="case-studies-title"
          role="region"
        >
          <div className={styles.container}>
            <h2 id="case-studies-title" className={styles.sectionTitle}>
              Case Studies
            </h2>
            <p className={styles.placeholderText}>
              Project showcases coming in Phase 2...
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Button variant="primary" size="md" section="case-studies">
                View Case Study
              </Button>
              <Button variant="secondary" size="md" section="case-studies">
                Technical Details
              </Button>
              <Button variant="outline" size="md" section="case-studies">
                Live Demo
              </Button>
            </div>
          </div>
        </section>

        {/* How I Work Section - Placeholder */}
        <section
          id="process"
          className={styles.howIWorkSection}
          aria-labelledby="how-i-work-title"
          role="region"
        >
          <div className={styles.container}>
            <h2 id="how-i-work-title" className={styles.sectionTitle}>
              How I Work
            </h2>
            <p className={styles.placeholderText}>
              Process methodology coming in Phase 2...
            </p>
          </div>
        </section>

        {/* Technical Expertise Section - Placeholder */}
        <section
          id="skills"
          className={styles.technicalSection}
          aria-labelledby="technical-title"
          role="region"
        >
          <div className={styles.container}>
            <h2 id="technical-title" className={styles.sectionTitle}>
              Technical Expertise
            </h2>
            <p className={styles.placeholderText}>
              Skills and technologies coming in Phase 2...
            </p>
          </div>
        </section>

        {/* Contact Section - Basic */}
        <section
          id="contact"
          className={styles.contactSection}
          aria-labelledby="contact-title"
          role="region"
        >
          <div className={styles.container}>
            <h2 id="contact-title" className={styles.sectionTitle}>
              Contact
            </h2>
            <p className={styles.contactText}>
              Ready to discuss your enterprise solution? Let&apos;s connect.
            </p>
            <p className={styles.placeholderText}>
              Contact form coming in Phase 2...
            </p>
          </div>
        </section>
      </main>
    </>
  );
}