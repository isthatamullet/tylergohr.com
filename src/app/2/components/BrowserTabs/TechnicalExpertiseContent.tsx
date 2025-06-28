import React from 'react'
import styles from './TechnicalExpertiseContent.module.css'

interface TechnicalArea {
  id: string
  title: string
  description: string
  skills: string[]
  currentProjects: string[]
  achievements: string[]
  businessValue: string
  badge: {
    label: string
    value: string
    type: 'frontend' | 'backend' | 'cloud' | 'leadership' | 'ai'
  }
}

interface TechnicalExpertiseContentProps {
  area: TechnicalArea
}

export default function TechnicalExpertiseContent({ area }: TechnicalExpertiseContentProps) {
  return (
    <div className={styles.technicalExpertiseContent}>
      {/* Technical Area Header */}
      <header className={styles.areaHeader}>
        <div className={`${styles.badge} ${styles[`badge--${area.badge.type}`]} ${styles.badgeLarge}`}>
          <span className={styles.badgeValue}>{area.badge.value}</span>
          <span className={styles.badgeLabel}>{area.badge.label}</span>
        </div>
        <h2 className={styles.areaTitle}>{area.title}</h2>
        <p className={styles.areaDescription}>{area.description}</p>
      </header>

      {/* Technical Content Grid */}
      <div className={styles.contentGrid}>
        {/* Core Skills */}
        <div className={styles.contentSection}>
          <h3 className={styles.contentTitle}>Core Skills & Technologies</h3>
          <ul className={styles.contentList}>
            {area.skills.map((skill, i) => (
              <li key={i} className={styles.contentListItem}>
                {skill}
              </li>
            ))}
          </ul>
        </div>

        {/* Current Projects */}
        <div className={styles.contentSection}>
          <h3 className={styles.contentTitle}>Current Projects & Applications</h3>
          <ul className={styles.contentList}>
            {area.currentProjects.map((project, i) => (
              <li key={i} className={styles.contentListItem}>
                {project}
              </li>
            ))}
          </ul>
        </div>

        {/* Career Achievements */}
        <div className={styles.contentSection}>
          <h3 className={styles.contentTitle}>Career Achievements</h3>
          <ul className={styles.contentList}>
            {area.achievements.map((achievement, i) => (
              <li key={i} className={styles.contentListItem}>
                {achievement}
              </li>
            ))}
          </ul>
        </div>

        {/* Business Impact */}
        <div className={styles.contentSection}>
          <h3 className={styles.contentTitle}>Technology Leadership</h3>
          <p className={styles.contentText}>
            Beyond technical implementation, I bring enterprise leadership experience from managing teams 
            at Fortune 500 companies. This means understanding how technology decisions impact business 
            goals, stakeholder needs, and long-term scalability.
          </p>
        </div>
      </div>

      {/* Business Value */}
      <div className={styles.businessValue}>
        <h3 className={styles.businessValueTitle}>What This Means for Your Business</h3>
        <p className={styles.businessValueText}>{area.businessValue}</p>
      </div>
    </div>
  )
}