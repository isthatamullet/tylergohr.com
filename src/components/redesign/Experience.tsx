'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './Experience.module.css';

const experiences = [
  {
    number: '01',
    company: 'Consulting',
    title: 'Digital Solutions Architect',
    dates: '2022 – Present',
    headline: 'FactSpark AI Platform, Hands-on AI/ML',
    bullets: [
      'Architected FactSpark content intelligence platform processing 130+ articles with <200ms query performance',
      'Integrated Gemini AI claim verification with 3-stage validation pipeline',
      'Provided AI training and strategy consulting for entrepreneurs',
    ],
  },
  {
    number: '02',
    company: 'Fox Corporation',
    title: 'Lead Content Operator',
    dates: '2017 – 2022',
    headline: 'Emmy Award, $1.5M+ Saved, Global Operations',
    bullets: [
      'Built complete CMS powering Emmy-winning 2018 FIFA World Cup streaming',
      'Saved $1.5M+ by bringing closed caption sync-fix in-house during 15,000-title library QC',
      'Functionally managed 10+ content specialists across 10+ countries',
    ],
  },
  {
    number: '03',
    company: 'SDI Media',
    title: 'Metadata Technician',
    dates: '2016',
    headline: '20+ Languages, CVAA Compliance, QC Overhaul',
    bullets: [
      'Transformed QC from "send and hope" to systematic validation in first month',
      'Identified federal CVAA compliance gap affecting hundreds of titles',
      'Managed foreign audio dub delivery across 20+ languages',
    ],
  },
  {
    number: '04',
    company: 'SDA Church',
    title: 'Digital Consultant',
    dates: '2014 – 2016',
    headline: 'Paper-to-Digital Transformation',
    bullets: [
      'Led 100% paper-to-digital transformation of secretariat office operations',
      'Built registration and resource publishing systems for 1,000+ attendee events',
    ],
  },
  {
    number: '05',
    company: 'Warner Bros.',
    title: 'Metadata Technician, SME',
    dates: '2012 – 2014',
    headline: '32% → 96% Acceptance, Apple Partnership',
    bullets: [
      'Transformed iTunes film delivery acceptance from 32% to 96% while tripling volume',
      'Earned go-to SME status within first month; direct relationship with Apple',
      'Received Exceptional Performance Award presented by WB facility president',
    ],
  },
];

interface ExperienceCardProps {
  experience: typeof experiences[0];
  index: number;
  isVisible: boolean;
}

function ExperienceCard({ experience, index, isVisible }: ExperienceCardProps) {
  return (
    <div
      className={`${styles.card} ${isVisible ? styles.visible : ''}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={styles.cardLeft}>
        <span className={styles.number}>{experience.number}</span>
        <div className={styles.line} />
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.company}>{experience.company}</h3>
            <p className={styles.jobTitle}>{experience.title}</p>
          </div>
          <span className={styles.dates}>{experience.dates}</span>
        </div>
        <p className={styles.headline}>{experience.headline}</p>
        <ul className={styles.bullets}>
          {experience.bullets.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Experience() {
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
    <section id="experience" ref={sectionRef} className={styles.experience}>
      {/* Background */}
      <div className={styles.background}>
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet="/images/backgrounds/experience-mobile-bg.webp"
          />
          <Image
            src="/images/backgrounds/experience-bg.webp"
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
        <h2 className={styles.title}>Experience</h2>

        <div className={styles.timeline}>
          {experiences.map((exp, index) => (
            <ExperienceCard
              key={exp.company}
              experience={exp}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        <a href="/resume" className={styles.cta}>
          Download Full Resume
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
        </a>
      </div>
    </section>
  );
}
