'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './CaseStudies.module.css';

const caseStudies = [
  {
    id: 'warner-bros',
    title: 'Content Delivery Transformation',
    company: 'Warner Bros',
    metric: '32% → 96%',
    description: 'Transformed iTunes film delivery acceptance while tripling monthly volume—in just 3 months.',
    tags: ['Quality Assurance', 'Process Design', 'Apple Partnership'],
  },
  {
    id: 'fox-fifa',
    title: 'Emmy-Winning Streaming Platform',
    company: 'Fox Sports',
    metric: 'Emmy Award',
    description: 'Built the complete CMS powering Fox\'s 2018 FIFA World Cup streaming from scratch.',
    tags: ['CMS Architecture', 'Live Streaming', 'Multi-platform'],
  },
  {
    id: 'fox-catalog',
    title: 'Catalog Optimization',
    company: 'Fox',
    metric: '$1.5M+ Saved',
    description: 'Brought closed caption corrections in-house during a 15,000-title library QC.',
    tags: ['Cost Reduction', 'Training', 'Workflow Design'],
  },
  {
    id: 'factspark',
    title: 'AI-Powered Content Intelligence',
    company: 'FactSpark',
    metric: '<200ms',
    description: 'Built a full-stack AI platform from scratch—semantic search, automated metadata extraction, and claim verification.',
    tags: ['AI/ML', 'Full-Stack', 'React + FastAPI'],
  },
];

interface CaseStudyCardProps {
  study: typeof caseStudies[0];
  index: number;
  isVisible: boolean;
}

function CaseStudyCard({ study, index, isVisible }: CaseStudyCardProps) {
  return (
    <a
      href={`/case-studies/${study.id}`}
      className={`${styles.card} ${isVisible ? styles.visible : ''}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={styles.cardHeader}>
        <span className={styles.company}>{study.company}</span>
        <span className={styles.metric}>{study.metric}</span>
      </div>
      <h3 className={styles.cardTitle}>{study.title}</h3>
      <p className={styles.cardDescription}>{study.description}</p>
      <div className={styles.tags}>
        {study.tags.map((tag) => (
          <span key={tag} className={styles.tag}>{tag}</span>
        ))}
      </div>
      <span className={styles.viewMore}>
        View Case Study
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </span>
    </a>
  );
}

export default function CaseStudies() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="work" ref={sectionRef} className={styles.caseStudies}>
      {/* Background */}
      <div className={styles.background}>
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet="/images/backgrounds/casestudies-mobile-bg.webp"
          />
          <Image
            src="/images/backgrounds/casestudies-bg.webp"
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
        <h2 className={styles.title}>Featured Work</h2>
        <p className={styles.subtitle}>
          Real problems. Real solutions. Measurable results.
        </p>

        <div className={styles.grid}>
          {caseStudies.map((study, index) => (
            <CaseStudyCard
              key={study.id}
              study={study}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
