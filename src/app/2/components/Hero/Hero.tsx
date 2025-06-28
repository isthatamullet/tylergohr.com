"use client";

import Image from 'next/image';
import { useRef } from 'react';
import { ClientMotionDiv, useScroll, useTransform } from '@/app/2/lib/framer-motion-client';
import { Button } from '../ui/Button/Button';
import { LogoFloat } from './LogoFloat';
import styles from './Hero.module.css';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms for the hero graphic
  const graphicY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const graphicScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const graphicOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

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
      ref={heroRef}
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
          <ClientMotionDiv 
            className={styles.graphicContainer}
            style={{
              y: graphicY,
              scale: graphicScale,
              opacity: graphicOpacity
            }}
            transition={{
              type: "tween",
              ease: "linear"
            }}
          >
            <Image 
              src="/images/hero-graphic.svg"
              alt="Enterprise Solutions Architecture - Interactive network diagram showing connected systems and data flows"
              className={styles.heroImage}
              width={580}
              height={400}
              priority={true}
            />
          </ClientMotionDiv>
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