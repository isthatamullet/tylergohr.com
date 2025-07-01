"use client";

import Image from 'next/image';
import { Button } from '../ui/Button/Button';
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
      <div className={styles.heroContainer}>
        {/* Hero Graphic (Left Side) */}
        <div className={styles.heroGraphic}>
          <div className={styles.graphicContainer}>
            {/* Stacked hero images - main image + 3 floating cloud layers */}
            <Image 
              src="/images/hero-main.png"
              alt="Enterprise Solutions Architecture - Interactive visualization of connected systems and data flows"
              className={styles.heroImage}
              width={580}
              height={400}
              priority={true}
            />
            
            {/* Cloud layer 1 - floating on top */}
            <Image 
              src="/images/hero-cloud-1.png"
              alt=""
              className={styles.cloud1}
              width={580}
              height={400}
              aria-hidden="true"
            />
            
            {/* Cloud layer 2 - floating on top */}
            <Image 
              src="/images/hero-cloud-2.png"
              alt=""
              className={styles.cloud2}
              width={580}
              height={400}
              aria-hidden="true"
            />
            
            {/* Cloud layer 3 - floating on top */}
            <Image 
              src="/images/hero-cloud-3.png"
              alt=""
              className={styles.cloud3}
              width={580}
              height={400}
              aria-hidden="true"
            />
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