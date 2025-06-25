"use client";

import { Button } from '../ui/Button/Button';
import { LogoFloat } from './LogoFloat';
import styles from './Hero.module.css';

export default function Hero() {

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
    <section
      id="hero"
      className={styles.heroSection}
      aria-labelledby="hero-title"
      role="banner"
    >
      {/* Logo Float Animation Component */}
      <LogoFloat />
      
      <div className={styles.heroContainer}>
        {/* Hero Graphic (Left Side) */}
        <div className={styles.heroGraphic}>
          <div className={styles.graphicPlaceholder}>
            <div className={styles.graphicContent}>
              {/* Placeholder for future custom graphic */}
              <div className={styles.techIllustration}>
                <div className={styles.networkNode}></div>
                <div className={styles.networkNode}></div>
                <div className={styles.networkNode}></div>
                <div className={styles.dataFlow}></div>
                <div className={styles.dataFlow}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content (Right Side) */}
        <div className={styles.heroContent}>
          <div className={styles.contentWrapper}>
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
              <Button
                variant="primary"
                size="lg"
                section="hero"
                onClick={() => navigateToSection('contact')}
                aria-label="Start your project - navigate to contact section"
              >
                Start Your Project
              </Button>
              <Button
                variant="secondary"
                size="lg"
                section="hero"
                onClick={() => navigateToSection('work')}
                aria-label="View my work - navigate to case studies section"
              >
                View My Work
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}