'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './Skills.module.css';

const skillCategories = [
  {
    title: 'Content Operations',
    skills: [
      'CMS & DAM Architecture',
      'Localization (20+ Languages)',
      'Quality Assurance',
    ],
  },
  {
    title: 'Cross-Functional Leadership',
    skills: [
      'Global Team Coordination',
      'Vendor & Partner Management',
      'Executive Stakeholders',
    ],
  },
  {
    title: 'Process & Automation',
    skills: [
      'Workflow Optimization',
      'Documentation & Training',
      'Standards & Compliance',
    ],
  },
  {
    title: 'Technical',
    skills: [
      'AI/ML Integration',
      'Metadata Architecture',
      'Data Analysis',
    ],
  },
];

interface SkillCardProps {
  category: typeof skillCategories[0];
  index: number;
  isVisible: boolean;
}

function SkillCard({ category, index, isVisible }: SkillCardProps) {
  return (
    <div
      className={`${styles.card} ${isVisible ? styles.visible : ''}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <h3 className={styles.cardTitle}>{category.title}</h3>
      <ul className={styles.skillList}>
        {category.skills.map((skill) => (
          <li key={skill} className={styles.skill}>
            <span className={styles.skillIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Skills() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className={styles.skills}>
      {/* Background */}
      <div className={styles.background}>
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet="/images/backgrounds/skills-mobile-bg.webp"
          />
          <Image
            src="/images/backgrounds/skills-bg.webp"
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
        <h2 className={styles.title}>Skills</h2>

        <div className={styles.grid}>
          {skillCategories.map((category, index) => (
            <SkillCard
              key={category.title}
              category={category}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        <a href="/skills" className={styles.cta}>
          View All Skills
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
