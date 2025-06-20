import { Project } from '@/lib/types'
import styles from './ProjectCard.module.css'

interface ProjectCardProps {
  project: Project
  onViewDetails?: (project: Project) => void
  className?: string
}

export default function ProjectCard({ project, onViewDetails, className = '' }: ProjectCardProps) {
  const handleClick = () => {
    if (onViewDetails) {
      onViewDetails(project)
    }
  }

  return (
    <article 
      className={`${styles.projectCard} ${className} fade-in-on-scroll`}
      onClick={handleClick}
      role={onViewDetails ? 'button' : undefined}
      tabIndex={onViewDetails ? 0 : undefined}
      onKeyDown={(e) => {
        if (onViewDetails && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      {/* Project Status Badge */}
      <div className={styles.statusBadge}>
        <span className={`${styles.status} ${styles[project.status]}`}>
          {project.status === 'completed' ? 'Live' : 
           project.status === 'in-progress' ? 'In Development' : 'Concept'}
        </span>
        {project.featured && (
          <span className={styles.featured}>Featured</span>
        )}
      </div>

      {/* Project Header */}
      <header className={styles.projectHeader}>
        <h3 className={styles.projectTitle}>{project.title}</h3>
        <p className={styles.projectSubtitle}>{project.subtitle}</p>
      </header>

      {/* Project Description */}
      <div className={styles.projectContent}>
        <p className={styles.projectDescription}>{project.description}</p>
      </div>

      {/* Tech Stack */}
      <div className={styles.techStack}>
        {project.techStack.slice(0, 4).map((tech) => (
          <span 
            key={tech.name}
            className={styles.techItem}
            style={{ '--tech-color': tech.color } as React.CSSProperties}
          >
            {tech.name}
          </span>
        ))}
        {project.techStack.length > 4 && (
          <span className={styles.techMore}>
            +{project.techStack.length - 4} more
          </span>
        )}
      </div>

      {/* Project Metrics */}
      {project.metrics.length > 0 && (
        <div className={styles.metricsPreview}>
          <div className={styles.metric}>
            <span className={styles.metricValue}>
              {project.metrics[0].value}{project.metrics[0].unit}
            </span>
            <span className={styles.metricLabel}>{project.metrics[0].label}</span>
          </div>
        </div>
      )}

      {/* Action Indicator */}
      {onViewDetails && (
        <div className={styles.actionIndicator}>
          <span className={styles.viewDetails}>View Details</span>
          <svg 
            className={styles.arrow} 
            width="16" 
            height="16" 
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 8 8.22 4.28a.75.75 0 0 1 0-1.06Z" />
          </svg>
        </div>
      )}
    </article>
  )
}