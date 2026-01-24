'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Resume.module.css';

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  achievements: string[];
}

interface SkillCategory {
  name: string;
  skills: string[];
}

const experience: ExperienceItem[] = [
  {
    title: 'Digital Solutions Architect & Consultant',
    company: 'Self-Employed',
    period: 'Aug 2022 - Present',
    achievements: [
      'Architected content intelligence platform processing 130+ articles with <200ms query performance using AI/ML workflow',
      'Deployed semantic search processing 1000+ records in <500ms by integrating Sentence Transformers with ChromaDB',
      'Built React 19 + TypeScript SPA with FastAPI backend and 40+ endpoints, reducing API calls 80%',
      'Integrated Gemini AI verification processing 67+ claims through 3-stage validation pipeline, eliminating 78% errors',
      'Deployed production system on Google Cloud achieving 99.9%+ uptime with 30-second rollback capability',
    ],
  },
  {
    title: 'Lead Content Operator (Manager)',
    company: 'Fox Corporation',
    period: 'Jan 2017 - Aug 2022',
    achievements: [
      'Built complete Emmy Award-winning CMS powering 2018 FIFA World Cup streaming to millions across all Fox apps and devices',
      'Launched Fox Nation and Fox Weather platforms, delivering 100 full episodes on Fox Nation day 1',
      'Saved $1.5M+ over 6 months by proposing in-house CC sync-fix during 15K-title library QC',
      'Functionally managed 10+ content specialists across LA and NYC with full decision authority',
      'Coordinated daily operations across 10+ countries spanning 4+ continents',
      'Reduced manual review 95% by integrating AI-driven processing while maintaining 98% accuracy',
      'Achieved 50% efficiency improvement across 250K+ asset operations',
    ],
  },
  {
    title: 'Metadata Technician, Content Manager',
    company: 'SDI Media',
    period: 'Feb 2016 - Dec 2016',
    achievements: [
      'Recruited as iTunes distribution SME based on Warner Bros expertise',
      'Transformed QC from "send and hope" to systematic processes in first month, reducing redeliveries 50%',
      'Identified federal CVAA compliance gap affecting hundreds of titles, designed end-to-end remediation workflow',
      'Managed foreign audio dub delivery across 20+ languages for TV and film content',
    ],
  },
  {
    title: 'Metadata Technician, SME',
    company: 'Warner Bros. Entertainment',
    period: 'Feb 2012 - Oct 2014',
    achievements: [
      'Transformed iTunes film delivery from 32% to 96% acceptance while tripling volume (30→100+ films/month) in 3 months',
      'Earned Subject Matter Expert designation within first month through rapid platform mastery',
      'Maintained direct relationship with Apple iTunes head of content partnerships',
      'Contributed 50-60 pages to 150+ page comprehensive iTunes publishing manual',
      'Built iTunes eBook publishing operation from scratch—workflows, training, catalog management',
    ],
  },
];

const skillCategories: SkillCategory[] = [
  {
    name: 'Core Expertise',
    skills: [
      'CMS/DAM Administration & Architecture',
      'Content Optimization & Quality Assurance',
      'Cross-functional Team Leadership',
      'Digital Product Distribution',
      'Metadata Architecture & Management',
    ],
  },
  {
    name: 'Content Operations',
    skills: [
      'Multilingual Content Delivery (20+ languages)',
      'Compliance & Accessibility (ADA, CVAA)',
      'Platform-Specific Publishing',
      'Video QC & Technical Specifications',
      'Closed Captioning & Subtitling',
    ],
  },
  {
    name: 'Technical',
    skills: [
      'AI/ML Integration & Automation',
      'React, TypeScript, Python, FastAPI',
      'Google Cloud Platform',
      'Data Analysis & Performance Metrics',
      'HTML/XML Proficiency',
    ],
  },
  {
    name: 'Platforms & Tools',
    skills: [
      'Brightcove, MPX, iTunes Store',
      'Adobe AEM, SharePoint, Drupal',
      'JIRA, Confluence, Airtable',
      'PowerBI, Google Analytics',
      'Adobe Creative Suite',
    ],
  },
];

const notableProjects = [
  {
    name: 'FIFA World Cup CMS',
    company: 'Fox',
    highlight: 'Emmy Award',
    description: 'Complete streaming infrastructure: live/VOD, transcoding, metadata, publishing across all apps/devices',
  },
  {
    name: 'Fox Nation Launch',
    company: 'Fox',
    highlight: '100 episodes day 1',
    description: 'CMS architecture + workflows for subscription streaming platform',
  },
  {
    name: 'FactSpark Platform',
    company: 'Self',
    highlight: '<200ms queries',
    description: 'AI-powered content intelligence with semantic search and claim verification',
  },
  {
    name: 'iTunes eBook Operation',
    company: 'Warner Bros',
    highlight: 'Built from scratch',
    description: 'Complete publishing operation: QC, metadata, delivery workflows, training',
  },
];

const awards = [
  { name: 'Emmy Award', org: 'National Academy of Television Arts & Sciences', year: '2018' },
  { name: 'Outstanding Achievement (4x)', org: 'Fox Corporation', year: '2017-2019' },
  { name: 'Exceptional Performance', org: 'Warner Bros. Entertainment', year: '2013' },
];

export default function ResumePage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <main className={styles.main}>
      {/* Iridescent Decorations */}
      <div className={styles.ribbonTop} aria-hidden="true" />
      <div className={styles.ribbonBottom} aria-hidden="true" />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>Resume</span>
          <h1 className={styles.heroTitle}>Tyler Gohr</h1>
          <p className={styles.heroRole}>Enterprise Solutions Architect</p>
          <p className={styles.heroSummary}>
            Emmy Award-winning content leader with 16+ years bridging gaps between what organizations
            have and what they need. Transformed delivery from 32% to 96%, saved $1.5M+ in 6 months,
            managed teams across 10+ countries. Builds systems and documentation that outlast my tenure.
          </p>
          <div className={styles.heroMeta}>
            <span>Meridian, Idaho</span>
            <span className={styles.metaDivider}>|</span>
            <span>tyler.gohr@gmail.com</span>
          </div>
        </div>
      </section>

      {/* Career Highlights */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Career Highlights</h2>
          <div className={styles.highlightsGrid}>
            <div className={styles.highlightCard}>
              <span className={styles.highlightMetric}>32% → 96%</span>
              <span className={styles.highlightLabel}>Delivery Transformation</span>
              <p className={styles.highlightDesc}>While tripling volume in 3 months at Warner Bros</p>
            </div>
            <div className={styles.highlightCard}>
              <span className={styles.highlightMetric}>$1.5M+</span>
              <span className={styles.highlightLabel}>Cost Savings</span>
              <p className={styles.highlightDesc}>In 6 months through in-house CC authoring at Fox</p>
            </div>
            <div className={styles.highlightCard}>
              <span className={styles.highlightMetric}>Emmy Award</span>
              <span className={styles.highlightLabel}>2018 FIFA World Cup</span>
              <p className={styles.highlightDesc}>Built CMS powering streaming to millions</p>
            </div>
            <div className={styles.highlightCard}>
              <span className={styles.highlightMetric}>50%</span>
              <span className={styles.highlightLabel}>Efficiency Improvement</span>
              <p className={styles.highlightDesc}>Across 250K+ asset operations at Fox</p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Experience</h2>
          <div className={styles.experienceList}>
            {experience.map((job, index) => (
              <div key={index} className={styles.experienceItem}>
                <button
                  className={styles.experienceHeader}
                  onClick={() => toggleSection(`exp-${index}`)}
                  aria-expanded={expandedSection === `exp-${index}`}
                >
                  <div className={styles.experienceHeaderLeft}>
                    <h3 className={styles.jobTitle}>{job.title}</h3>
                    <span className={styles.jobCompany}>{job.company}</span>
                  </div>
                  <div className={styles.experienceHeaderRight}>
                    <span className={styles.jobPeriod}>{job.period}</span>
                    <span className={styles.expandIcon}>
                      {expandedSection === `exp-${index}` ? '−' : '+'}
                    </span>
                  </div>
                </button>
                {expandedSection === `exp-${index}` && (
                  <div className={styles.experienceContent}>
                    <ul className={styles.achievementsList}>
                      {job.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notable Projects */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Notable Projects</h2>
          <div className={styles.projectsGrid}>
            {notableProjects.map((project, index) => (
              <div key={index} className={styles.projectCard}>
                <div className={styles.projectHeader}>
                  <h3 className={styles.projectName}>{project.name}</h3>
                  <span className={styles.projectHighlight}>{project.highlight}</span>
                </div>
                <span className={styles.projectCompany}>{project.company}</span>
                <p className={styles.projectDesc}>{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Skills & Expertise</h2>
          <div className={styles.skillsGrid}>
            {skillCategories.map((category, index) => (
              <div key={index} className={styles.skillCategory}>
                <h3 className={styles.skillCategoryName}>{category.name}</h3>
                <ul className={styles.skillsList}>
                  {category.skills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Education */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.twoColumnGrid}>
            <div>
              <h2 className={styles.sectionTitle}>Awards</h2>
              <div className={styles.awardsList}>
                {awards.map((award, index) => (
                  <div key={index} className={styles.awardItem}>
                    <span className={styles.awardName}>{award.name}</span>
                    <span className={styles.awardOrg}>{award.org}</span>
                    <span className={styles.awardYear}>{award.year}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className={styles.sectionTitle}>Education</h2>
              <div className={styles.educationItem}>
                <span className={styles.degree}>Bachelor of Arts, Music Technology</span>
                <span className={styles.school}>La Sierra University</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <span className={styles.ctaBadge}>Next Step</span>
          <h2 className={styles.ctaTitle}>Let&apos;s Build Something Together</h2>
          <p className={styles.ctaText}>
            Ready to discuss how I can help transform your content operations?
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/#contact" className={styles.ctaButtonPrimary}>
              Get in Touch
            </Link>
            <Link href="/case-studies" className={styles.ctaButtonSecondary}>
              View Case Studies
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
