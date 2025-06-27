"use client";

import styles from "./page.module.css";
import Navigation from "./components/Navigation/Navigation";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Results from "./components/Results/Results";
import CaseStudiesPreview from "./components/CaseStudies/CaseStudiesPreview";
import HowIWorkPreview from "./components/HowIWork/HowIWorkPreview";
import TechnicalExpertisePreview from "./components/TechnicalExpertise/TechnicalExpertisePreview";

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

        {/* Case Studies Preview Section - 4 Interactive Cards */}
        <CaseStudiesPreview />

        {/* How I Work Preview Section - 4 Process Highlight Cards */}
        <HowIWorkPreview />

        {/* Technical Expertise Preview Section - 4 Glassmorphism Cards */}
        <TechnicalExpertisePreview />

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