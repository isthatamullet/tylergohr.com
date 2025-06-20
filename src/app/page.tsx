'use client'

import { useState } from 'react'
import styles from './page.module.css'
import ParallaxSection from '@/components/ParallaxSection'
import ProjectShowcase from '@/components/ProjectShowcase'
import ProjectDeepDive from '@/components/ProjectDeepDive'
import SkillsSection from '@/components/SkillsSection'
import ContactSection from '@/components/ContactSection'
import { projects } from '@/lib/projects'
import { Project } from '@/lib/types'

export default function HomePage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project)
  }

  const handleCloseDeepDive = () => {
    setSelectedProject(null)
  }

  if (selectedProject) {
    return (
      <ProjectDeepDive 
        project={selectedProject} 
        onClose={handleCloseDeepDive}
      />
    )
  }

  return (
    <main id="main-content" className={styles.main} role="main">
      {/* Hero Section with Parallax Background */}
      <section 
        className={styles.heroSection}
        aria-labelledby="hero-title"
        role="banner"
      >
        <div 
          className={styles.parallaxBackground}
          aria-hidden="true"
          role="presentation"
        >
          <div className={styles.parallaxLayer1}></div>
          <div className={styles.parallaxLayer2}></div>
          <div className={styles.parallaxLayer3}></div>
        </div>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 id="hero-title" className={styles.heroTitle}>
              Tyler Gohr
            </h1>
            <p className={styles.heroSubtitle} aria-describedby="hero-description">
              Full-Stack Developer & Creative Problem Solver
            </p>
            <p id="hero-description" className={styles.heroDescription}>
              Crafting innovative digital experiences through cutting-edge web technologies and creative problem-solving
            </p>
          </div>
        </div>
      </section>

      {/* About Section with Glassmorphism */}
      <ParallaxSection className={styles.aboutSection}>
        <div className="container">
          <div 
            className={`${styles.glassCard} scale-in-on-scroll`}
            role="region"
            aria-labelledby="about-title"
          >
            <h2 id="about-title" className={`${styles.sectionTitle} slide-in-left`}>
              About
            </h2>
            <p className={`${styles.sectionDescription} slide-in-right`}>
              I specialize in building full-stack applications that solve real business problems. 
              From React frontends to Node.js backends, from database design to cloud deployment, 
              I create comprehensive solutions that deliver results.
            </p>
          </div>
        </div>
      </ParallaxSection>

      {/* Skills Section */}
      <SkillsSection />

      {/* Project Showcase Section */}
      <section 
        role="region" 
        aria-labelledby="projects-title"
        aria-describedby="projects-description"
      >
        <ProjectShowcase 
          projects={projects}
          title="Featured Projects"
          subtitle="Innovative solutions demonstrating technical mastery through interactive showcases"
          onProjectSelect={handleProjectSelect}
          limit={3}
        />
      </section>

      {/* Contact Section */}
      <ContactSection />
    </main>
  )
}