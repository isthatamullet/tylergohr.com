'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './About.module.css';

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className={styles.about}>
      {/* Background */}
      <div className={styles.background}>
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet="/images/backgrounds/about-mobile-bg.webp"
          />
          <Image
            src="/images/backgrounds/about-bg.webp"
            alt=""
            fill
            quality={85}
            className={styles.backgroundImage}
          />
        </picture>
        <div className={styles.overlay} />
      </div>

      {/* Content */}
      <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
        {/* Timeline indicator */}
        <div className={styles.timeline}>
          <span className={styles.timelineYear}>2012</span>
          <div className={styles.timelineLine} />
          <span className={styles.timelineYear}>2026</span>
        </div>

        {/* Section title */}
        <h2 className={styles.title}>About Me</h2>

        {/* About text */}
        <div className={styles.text}>
          <p>
            I&apos;ve spent 16 years in the trenches of content operations—at Warner Bros,
            Fox Corporation, SDI Media, and now as an independent consultant. Along the way,
            I&apos;ve transformed chaos into systems, scaled operations across continents,
            and built platforms that won Emmy Awards.
          </p>
          <p>
            My approach is simple: understand the problem deeply, build solutions that
            outlast my tenure, and document everything so others can maintain and extend
            the systems I create. Whether it&apos;s turning a 32% acceptance rate into 96%
            at Warner Bros, or saving $1.5M+ by bringing caption fixes in-house at Fox,
            I look for opportunities others miss.
          </p>
          <p>
            Today, I&apos;m building AI-powered tools like FactSpark while staying hands-on
            with the latest in voice synthesis, image generation, and large language models.
            The technology changes fast—my commitment to operational excellence doesn&apos;t.
          </p>
        </div>

        {/* CTA */}
        <a href="#work" className={styles.cta}>
          See Case Studies
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
