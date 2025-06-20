'use client'

import { useState } from 'react'
import { Project } from '@/lib/types'
import ProjectMetrics from './ProjectMetrics'
import ArchitectureDiagram from './ArchitectureDiagram'
import CodeDemo from './CodeDemo'
import styles from './ProjectDeepDive.module.css'

interface ProjectDeepDiveProps {
  project: Project
  onClose?: () => void
}

export default function ProjectDeepDive({ project, onClose }: ProjectDeepDiveProps) {
  const [activeSection, setActiveSection] = useState<'overview' | 'architecture' | 'code' | 'challenges'>('overview')

  if (!project.deepDive) {
    return (
      <div className={styles.noDeepDive}>
        <h3>Detailed case study coming soon...</h3>
        <p>This project doesn&apos;t have a deep-dive available yet.</p>
      </div>
    )
  }

  const { deepDive } = project

  return (
    <article className={styles.deepDive}>
      {/* Header */}
      <header className={styles.deepDiveHeader}>
        <div className="container">
          <div className={styles.headerContent}>
            <div className={styles.projectInfo}>
              <h1 className={`${styles.projectTitle} slide-in-left`}>{project.title}</h1>
              <p className={`${styles.projectSubtitle} slide-in-right`}>{project.subtitle}</p>
              <p className={`${styles.projectOverview} fade-in-on-scroll`}>
                {deepDive.solutionOverview}
              </p>
            </div>
            
            {onClose && (
              <button 
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close project details"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={styles.navigation}>
        <div className="container">
          <div className={styles.navTabs}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'architecture', label: 'Architecture' },
              { id: 'code', label: 'Code Examples' },
              { id: 'challenges', label: 'Challenges' }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`${styles.navTab} ${activeSection === tab.id ? styles.active : ''}`}
                onClick={() => setActiveSection(tab.id as 'overview' | 'architecture' | 'code' | 'challenges')}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content Sections */}
      <main className={styles.content}>
        <div className="container">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <section className={`${styles.section} fade-in-on-scroll`}>
              {/* Problem Statement */}
              <div className={styles.problemStatement}>
                <h2 className={styles.sectionTitle}>The Problem</h2>
                <p className={styles.sectionText}>{deepDive.problemStatement}</p>
              </div>

              {/* Metrics Display */}
              <ProjectMetrics metrics={project.metrics} />

              {/* Technical Journey */}
              <div className={styles.technicalJourney}>
                <h2 className={styles.sectionTitle}>Technical Journey</h2>
                <div className={styles.journeySteps}>
                  {deepDive.technicalJourney.map((step, index) => (
                    <div key={index} className={`${styles.journeyStep} slide-in-left`}>
                      <div className={styles.stepNumber}>{index + 1}</div>
                      <p className={styles.stepText}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Innovations */}
              <div className={styles.innovations}>
                <h2 className={styles.sectionTitle}>Key Innovations</h2>
                <div className={styles.innovationGrid}>
                  {deepDive.keyInnovations.map((innovation, index) => (
                    <div key={index} className={`${styles.innovationCard} scale-in-on-scroll`}>
                      <div className={styles.innovationIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                        </svg>
                      </div>
                      <p className={styles.innovationText}>{innovation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Architecture Section */}
          {activeSection === 'architecture' && (
            <section className={`${styles.section} fade-in-on-scroll`}>
              <h2 className={styles.sectionTitle}>System Architecture</h2>
              <ArchitectureDiagram architecture={project.architecture} />
              
              {/* Tech Stack Details */}
              <div className={styles.techStackDetails}>
                <h3 className={styles.subsectionTitle}>Technology Stack</h3>
                <div className={styles.techCategories}>
                  {Object.entries(
                    project.techStack.reduce((acc, tech) => {
                      if (!acc[tech.category]) acc[tech.category] = []
                      acc[tech.category].push(tech)
                      return acc
                    }, {} as Record<string, typeof project.techStack>)
                  ).map(([category, techs]) => (
                    <div key={category} className={styles.techCategory}>
                      <h4 className={styles.categoryTitle}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </h4>
                      <div className={styles.categoryTechs}>
                        {techs.map((tech) => (
                          <span 
                            key={tech.name}
                            className={styles.techItem}
                            style={{ '--tech-color': tech.color } as React.CSSProperties}
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Code Examples Section */}
          {activeSection === 'code' && (
            <section className={`${styles.section} fade-in-on-scroll`}>
              <h2 className={styles.sectionTitle}>Code Examples</h2>
              <div className={styles.codeExamples}>
                {project.codeExamples.map((example) => (
                  <CodeDemo key={example.id} codeExample={example} />
                ))}
              </div>
            </section>
          )}

          {/* Challenges Section */}
          {activeSection === 'challenges' && (
            <section className={`${styles.section} fade-in-on-scroll`}>
              <h2 className={styles.sectionTitle}>Technical Challenges</h2>
              <div className={styles.challenges}>
                {project.challenges.map((challenge, index) => (
                  <div key={index} className={`${styles.challengeCard} slide-in-left`}>
                    <h3 className={styles.challengeTitle}>{challenge.title}</h3>
                    <p className={styles.challengeDescription}>{challenge.description}</p>
                    <div className={styles.solution}>
                      <h4 className={styles.solutionTitle}>Solution</h4>
                      <p className={styles.solutionText}>{challenge.solution}</p>
                    </div>
                    <div className={styles.challengeTech}>
                      {challenge.technologies.map((tech) => (
                        <span key={tech} className={styles.challengeTechItem}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Lessons Learned */}
              <div className={styles.lessonsLearned}>
                <h3 className={styles.subsectionTitle}>Lessons Learned</h3>
                <ul className={styles.lessonsList}>
                  {deepDive.lessonsLearned.map((lesson, index) => (
                    <li key={index} className={`${styles.lesson} fade-in-on-scroll`}>
                      {lesson}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Future Enhancements */}
              <div className={styles.futureEnhancements}>
                <h3 className={styles.subsectionTitle}>Future Enhancements</h3>
                <div className={styles.enhancementGrid}>
                  {deepDive.futureEnhancements.map((enhancement, index) => (
                    <div key={index} className={`${styles.enhancementCard} scale-in-on-scroll`}>
                      <div className={styles.enhancementIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z"/>
                        </svg>
                      </div>
                      <p className={styles.enhancementText}>{enhancement}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </article>
  )
}