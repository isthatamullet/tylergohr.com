'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';

interface MetricCardProps {
  value: string;
  label: string;
  delay: number;
}

function MetricCard({ value, label, delay }: MetricCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${styles.metricCard} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.metricValue}>{value}</div>
      <div className={styles.metricLabel}>{label}</div>
    </div>
  );
}

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const metrics = [
    { value: '32% → 96%', label: 'Delivery quality turnaround in 3 months' },
    { value: '20+ Languages', label: 'Global operations across 10+ countries' },
    { value: '$1.5M+ Saved', label: 'Operational improvements in 6 months' },
    { value: 'Emmy Award', label: 'FIFA World Cup Streaming Platform' },
  ];

  return (
    <section className={styles.hero}>
      {/* Background Image */}
      <div className={styles.background}>
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet="/images/backgrounds/hero-mobile-bg.webp"
          />
          <Image
            src="/images/backgrounds/hero-bg.webp"
            alt=""
            fill
            priority
            quality={90}
            className={styles.backgroundImage}
          />
        </picture>
        <div className={styles.overlay} />
      </div>

      {/* Content */}
      <div className={`${styles.content} ${loaded ? styles.loaded : ''}`}>
        {/* Main Headline */}
        <div className={styles.headline}>
          <h1 className={styles.title}>
            <span className={styles.line}>Building Systems</span>
            <span className={styles.line}>That <span className={styles.accent}>Scale</span></span>
          </h1>
          <p className={styles.subtitle}>
            Emmy Award-Winning Content Operations Leader
          </p>
          <p className={styles.tagline}>
            16 years building content operations that scale—from Emmy-winning
            streaming platforms to AI-powered intelligence systems.
          </p>
        </div>

        {/* Metrics */}
        <div className={styles.metrics}>
          {metrics.map((metric, index) => (
            <MetricCard
              key={metric.label}
              value={metric.value}
              label={metric.label}
              delay={800 + (index * 150)}
            />
          ))}
        </div>

        {/* CTAs */}
        <div className={styles.ctas}>
          <a href="#contact" className={styles.btnPrimary}>
            Get in Touch
          </a>
          <a href="/resume" className={styles.btnSecondary}>
            View Resume
          </a>
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator}>
          <span className={styles.scrollText}>Scroll to explore</span>
          <div className={styles.scrollArrow}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
