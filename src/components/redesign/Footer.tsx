'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
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
    <footer id="contact" ref={sectionRef} className={styles.footer}>
      {/* Background */}
      <div className={styles.background}>
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet="/images/backgrounds/footer-mobile-bg.webp"
          />
          <Image
            src="/images/backgrounds/footer-bg.webp"
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
        {/* CTA Card */}
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>
            Ready to build something that <span className={styles.accent}>scales</span>?
          </h2>
          <p className={styles.ctaText}>
            Let&apos;s talk about your content operations challenges and how I can help.
          </p>
          <div className={styles.ctaButtons}>
            <a href="mailto:tyler.gohr@gmail.com" className={styles.btnPrimary}>
              Get in Touch
            </a>
            <a href="/resume" className={styles.btnSecondary}>
              Download Resume
            </a>
          </div>
        </div>

        {/* Contact Info Grid */}
        <div className={styles.contactGrid}>
          <div className={styles.contactColumn}>
            <h3 className={styles.columnTitle}>Contact</h3>
            <a href="mailto:tyler.gohr@gmail.com" className={styles.contactLink}>
              tyler.gohr@gmail.com
            </a>
            <span className={styles.location}>Meridian, Idaho</span>
          </div>

          <div className={styles.contactColumn}>
            <h3 className={styles.columnTitle}>Connect</h3>
            <a
              href="https://linkedin.com/in/tylergohr"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
              </svg>
              LinkedIn
            </a>
            <a
              href="https://github.com/isthatamullet"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>

          <div className={styles.contactColumn}>
            <h3 className={styles.columnTitle}>Site</h3>
            <a href="#about" className={styles.navLink}>About</a>
            <a href="#skills" className={styles.navLink}>Skills</a>
            <a href="#experience" className={styles.navLink}>Experience</a>
            <a href="#work" className={styles.navLink}>Work</a>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          <span>&copy; {new Date().getFullYear()} Tyler Gohr. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
