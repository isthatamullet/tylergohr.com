"use client";

import styles from "./page.module.css";
import Navigation from "./components/Navigation/Navigation";

export default function EnterprisePage() {
  const navigateToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - 70; // Navigation height

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* Enterprise Solutions Navigation */}
      <Navigation />
      
      <main id="main-content" className={styles.main} role="main">
        {/* Hero Section - Enterprise Solutions Architect */}
        <section
          id="about"
          className={styles.heroSection}
          aria-labelledby="hero-title"
          role="banner"
        >
          <div className={styles.heroContainer}>
            <div className={styles.heroContent}>
              <h1 id="hero-title" className={styles.heroTitle}>
                Enterprise Solutions Architect
              </h1>
              <p className={styles.heroSubtitle}>
                Creating powerful digital solutions that solve real business problems
              </p>
              <p className={styles.heroDescription}>
                From Emmy Award-winning streaming platforms to custom business solutions, 
                I architect digital products that deliver measurable impact. With 16+ years 
                at Fox Corporation and Warner Bros, I transform technical challenges into 
                competitive advantages.
              </p>
              <div className={styles.heroActions}>
                <button
                  className={styles.primaryCta}
                  onClick={() => navigateToSection('contact')}
                  aria-label="Start your project - navigate to contact section"
                >
                  Start Your Project
                </button>
                <button
                  className={styles.secondaryCta}
                  onClick={() => navigateToSection('work')}
                  aria-label="View my work - navigate to case studies section"
                >
                  View My Work
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="results"
          className={styles.aboutSection}
          aria-labelledby="about-title"
          role="region"
        >
          <div className={styles.container}>
            <h2 id="about-title" className={styles.sectionTitle}>
              About
            </h2>
            <div className={styles.aboutContent}>
              <p className={styles.aboutText}>
                I&apos;m Tyler Gohr, an Emmy Award-winning Enterprise Solutions Architect who 
                transforms complex technical challenges into competitive business advantages. 
                Over 16+ years leading technical teams at Fox Corporation and Warner Bros 
                Entertainment, I&apos;ve architected platforms serving millions of users while 
                managing systems with 17,000+ digital assets.
              </p>
              <p className={styles.aboutText}>
                My approach combines Fortune 500-level expertise with a passion for solving 
                real business problems. Whether you&apos;re a growing company needing a custom web 
                application or an enterprise requiring complex digital infrastructure, I bring 
                the same strategic thinking and technical precision to every project—from 
                initial concept through deployment and optimization.
              </p>
              <p className={styles.aboutText}>
                I specialize in AI-powered automation, content distribution systems, and 
                full-stack development, always focusing on solutions that deliver measurable 
                impact while scaling with your business goals.
              </p>
            </div>
          </div>
        </section>

        {/* Results & Impact Section - Placeholder */}
        <section
          id="work"
          className={styles.resultsSection}
          aria-labelledby="results-title"
          role="region"
        >
          <div className={styles.container}>
            <h2 id="results-title" className={styles.sectionTitle}>
              Results & Impact
            </h2>
            <p className={styles.placeholderText}>
              Metrics and achievements coming in Phase 2...
            </p>
          </div>
        </section>

        {/* Case Studies Section - Placeholder */}
        <section
          id="process"
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
          </div>
        </section>

        {/* How I Work Section - Placeholder */}
        <section
          id="skills"
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
          id="contact"
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