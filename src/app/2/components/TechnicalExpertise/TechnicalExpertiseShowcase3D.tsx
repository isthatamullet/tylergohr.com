/**
 * TechnicalExpertiseShowcase3D Component - Phase 3.3 Week 3 Day 2
 * 
 * Purpose: Comprehensive integration of all 3D skill demonstrations with
 * existing case studies, creating a unified enterprise technical showcase.
 * 
 * Features:
 * - Unified navigation between 3D previews and case studies
 * - Progressive skill demonstration (cards → timeline → projects → architecture)
 * - Seamless integration with existing /2/case-studies routes
 * - Interactive exploration modes with context switching
 * - Enterprise presentation with measurable business impact
 */

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import SkillCard3D from './SkillCard3D';
import SkillProgressionTimeline3D from './SkillProgressionTimeline3D';
import TechnologyVisualization3D from './TechnologyVisualization3D';
import ProjectPreview3D from './ProjectPreview3D';
import ProjectArchitecture3D from './ProjectArchitecture3D';
import type { SkillCard3D as SkillCard3DType } from './SkillDemonstrationTypes';
import styles from './TechnicalExpertiseShowcase3D.module.css';

/**
 * Showcase modes for different demonstration types
 */
type ShowcaseMode = 'overview' | 'skills' | 'timeline' | 'technology' | 'projects' | 'architecture';

/**
 * Integration data connecting 3D components with case studies
 */
interface CaseStudyIntegration {
  projectId: string;
  title: string;
  caseStudyUrl: string;
  preview3D: boolean;
  architecture3D: boolean;
  businessImpact: string[];
  technicalHighlights: string[];
}

/**
 * Case study integrations mapping projects to detailed case studies
 */
const caseStudyIntegrations: CaseStudyIntegration[] = [
  {
    projectId: 'invoice-chaser',
    title: 'Invoice Chaser - AI-Powered Payment Automation',
    caseStudyUrl: '/2/case-studies?project=invoice-chaser',
    preview3D: true,
    architecture3D: true,
    businessImpact: [
      '25-40% reduction in payment collection time',
      '70% reduction in manual work',
      '$45K annual savings with $15K investment',
      '4-month ROI breakeven'
    ],
    technicalHighlights: [
      'React 19 + TypeScript dashboard',
      'Node.js + PostgreSQL + Prisma',
      'QuickBooks & Stripe API integration',
      'Automated workflow orchestration'
    ]
  },
  {
    projectId: 'portfolio-website',
    title: 'Tyler Gohr Portfolio - Interactive Enterprise Showcase',
    caseStudyUrl: '/2/case-studies?project=portfolio',
    preview3D: true,
    architecture3D: true,
    businessImpact: [
      '90+ Lighthouse performance scores',
      '150% increase in session duration',
      '200% improvement in inquiry quality',
      '1-month ROI breakeven'
    ],
    technicalHighlights: [
      'Next.js 14 with React Three Fiber',
      'Advanced 3D visualizations',
      'Progressive enhancement strategy',
      'Enterprise performance optimization'
    ]
  },
  {
    projectId: 'grow-plant-store',
    title: 'Grow Plant Store - E-commerce Platform',
    caseStudyUrl: '/2/case-studies?project=grow-plant-store',
    preview3D: true,
    architecture3D: true,
    businessImpact: [
      '45% increase in conversion rate',
      '60% faster product discovery',
      '25% reduction in inventory costs',
      '4-month ROI breakeven'
    ],
    technicalHighlights: [
      'React + Next.js storefront',
      'Elasticsearch + AI search',
      'Real-time inventory management',
      'Multi-gateway payment processing'
    ]
  },
  {
    projectId: 'home-property-management',
    title: 'Home Property Management - Multi-Tenant Platform',
    caseStudyUrl: '/2/case-studies?project=home-property-management',
    preview3D: true,
    architecture3D: true,
    businessImpact: [
      '40% reduction in manager workload',
      '60% faster response times',
      '30% improvement in cash flow',
      '4-month ROI breakeven'
    ],
    technicalHighlights: [
      'Multi-tenant SaaS architecture',
      'GraphQL + PostgreSQL',
      'Real-time notifications',
      'Enterprise security standards'
    ]
  }
];

/**
 * Skill cards for the overview mode
 */
const showcaseSkillCards: SkillCard3DType[] = [
  {
    id: 'frontend-mastery',
    title: 'Frontend Excellence',
    category: 'frontend',
    proficiencyLevel: 9,
    yearsExperience: 16,
    technologies: ['React 19', 'TypeScript', 'Next.js 14', 'Three.js'],
    skills: ['React 19', 'TypeScript', 'Next.js 14', 'Three.js'],
    experience: '16+ years',
    currentExample: 'Tyler Gohr Portfolio with 3D visualizations',
    projects: ['Tyler Gohr Portfolio', 'Invoice Chaser Dashboard'],
    achievement: 'Emmy Award for FIFA World Cup streaming interfaces',
    icon: 'frontend',
    businessValue: 'Enterprise-grade user experiences with 90+ Lighthouse scores',
    achievements: ['Emmy Award for FIFA World Cup streaming', '90+ Lighthouse scores'],
    visualization: {
      type: '3d-skill-orbit',
      particleCount: 50,
      animationDuration: 3000,
      interactionRadius: 2,
      interactionLevel: 'expert',
      animationComplexity: 'high',
      businessMetrics: [
        { label: 'Performance', value: 90, color: '#00ff88' },
        { label: 'Accessibility', value: 95, color: '#61dafb' },
        { label: 'User Experience', value: 88, color: '#ff6b35' }
      ],
      colors: {
        primary: '#61dafb',
        secondary: '#00ff88',
        accent: '#ff6b35'
      }
    },
    performance: {
      desktopComplexity: 'high',
      mobileComplexity: 'medium',
      targetFPS: 60,
      fallbackMode: '2d-card'
    }
  },
  {
    id: 'backend-architecture',
    title: 'Backend Architecture',
    category: 'backend',
    proficiencyLevel: 9,
    yearsExperience: 14,
    technologies: ['Node.js', 'PostgreSQL', 'GraphQL', 'Microservices'],
    skills: ['Node.js', 'PostgreSQL', 'GraphQL', 'Microservices'],
    experience: '14+ years',
    currentExample: 'Invoice Chaser API with automated workflows',
    projects: ['Invoice Chaser API', 'Property Management Platform'],
    achievement: 'First to implement AI automation at Fox Corporation',
    icon: 'backend',
    businessValue: 'Scalable enterprise systems processing 1000+ operations daily',
    achievements: ['AI automation pioneer', '1000+ operations daily'],
    visualization: {
      type: '3d-technology-demo',
      particleCount: 40,
      animationDuration: 3500,
      interactionRadius: 2.2,
      interactionLevel: 'expert',
      animationComplexity: 'high',
      businessMetrics: [
        { label: 'Scalability', value: 92, color: '#3b82f6' },
        { label: 'Reliability', value: 99, color: '#10b981' },
        { label: 'Performance', value: 88, color: '#8b5cf6' }
      ],
      colors: {
        primary: '#68a063',
        secondary: '#3b82f6',
        accent: '#10b981'
      }
    },
    performance: {
      desktopComplexity: 'high',
      mobileComplexity: 'medium',
      targetFPS: 60,
      fallbackMode: '2d-card'
    }
  },
  {
    id: 'enterprise-leadership',
    title: 'Enterprise Leadership',
    category: 'leadership',
    proficiencyLevel: 9,
    yearsExperience: 12,
    technologies: ['Team Management', 'Process Optimization', 'Strategic Planning', 'AI Implementation'],
    skills: ['Team Management', 'Process Optimization', 'Strategic Planning', 'AI Implementation'],
    experience: '12+ years',
    currentExample: 'Fox Corporation team leadership with $2M+ savings',
    projects: ['Fox Corporation CMS', 'Warner Bros Digital Delivery'],
    achievement: 'Improved content delivery success rates from 32% to 96%',
    icon: 'leadership',
    businessValue: 'Led teams of 10+ specialists, delivered $2M+ cost savings',
    achievements: ['32% to 96% success rate improvement', '$2M+ cost savings'],
    visualization: {
      type: '3d-progression-display',
      particleCount: 60,
      animationDuration: 4000,
      interactionRadius: 2.5,
      interactionLevel: 'expert',
      animationComplexity: 'high',
      businessMetrics: [
        { label: 'Team Growth', value: 95, color: '#ff6b35' },
        { label: 'Process Improvement', value: 96, color: '#22c55e' },
        { label: 'Cost Savings', value: 85, color: '#f59e0b' }
      ],
      colors: {
        primary: '#ff6b35',
        secondary: '#22c55e',
        accent: '#f59e0b'
      }
    },
    performance: {
      desktopComplexity: 'high',
      mobileComplexity: 'medium',
      targetFPS: 60,
      fallbackMode: '2d-card'
    }
  },
  {
    id: 'innovation-pioneer',
    title: 'Innovation Pioneer',
    category: 'innovation',
    proficiencyLevel: 9,
    yearsExperience: 16,
    technologies: ['AI/ML Integration', 'Emerging Technologies', 'R&D Leadership', 'Future Planning'],
    skills: ['AI/ML Integration', 'Emerging Technologies', 'R&D Leadership', 'Future Planning'],
    experience: '16+ years',
    currentExample: 'AI Ad Break Detection pioneering implementation',
    projects: ['AI Ad Break Detection', 'Automated Content Management'],
    achievement: 'Emmy Award recognition for technical innovation under pressure',
    icon: 'innovation',
    businessValue: 'Pioneer AI adoption, 50% reduction in manual processes',
    achievements: ['Emmy Award for innovation', '50% manual process reduction'],
    visualization: {
      type: '3d-skill-orbit',
      particleCount: 70,
      animationDuration: 2500,
      interactionRadius: 3,
      interactionLevel: 'expert',
      animationComplexity: 'high',
      businessMetrics: [
        { label: 'Innovation Impact', value: 90, color: '#8a2be2' },
        { label: 'Technology Adoption', value: 88, color: '#00d8ff' },
        { label: 'Future Readiness', value: 92, color: '#ff1493' }
      ],
      colors: {
        primary: '#8a2be2',
        secondary: '#00d8ff',
        accent: '#ff1493'
      }
    },
    performance: {
      desktopComplexity: 'high',
      mobileComplexity: 'medium',
      targetFPS: 60,
      fallbackMode: '2d-card'
    }
  }
];

/**
 * Mode navigation component
 */
interface ModeNavigationProps {
  currentMode: ShowcaseMode;
  onModeChange: (mode: ShowcaseMode) => void;
}

function ModeNavigation({ currentMode, onModeChange }: ModeNavigationProps) {
  const modes: { id: ShowcaseMode; label: string; description: string }[] = [
    { id: 'overview', label: 'Overview', description: 'Complete technical expertise summary' },
    { id: 'skills', label: 'Skills', description: 'Interactive 3D skill demonstrations' },
    { id: 'timeline', label: 'Timeline', description: '16+ years career progression' },
    { id: 'technology', label: 'Technology', description: 'Stack-specific visualizations' },
    { id: 'projects', label: 'Projects', description: '3D project previews' },
    { id: 'architecture', label: 'Architecture', description: 'Detailed system exploration' }
  ];

  return (
    <div className={styles.modeNavigation}>
      <div className={styles.modeButtons}>
        {modes.map((mode) => (
          <button
            key={mode.id}
            className={`${styles.modeButton} ${currentMode === mode.id ? styles.active : ''}`}
            onClick={() => onModeChange(mode.id)}
            title={mode.description}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Case study integration component
 */
interface CaseStudyIntegrationProps {
  integration: CaseStudyIntegration;
  onProjectSelect: (projectId: string) => void;
}

function CaseStudyIntegration({ integration, onProjectSelect }: CaseStudyIntegrationProps) {
  return (
    <div className={styles.caseStudyCard}>
      <div className={styles.caseStudyHeader}>
        <h3>{integration.title}</h3>
        <div className={styles.caseStudyActions}>
          <button
            className={styles.actionButton}
            onClick={() => onProjectSelect(integration.projectId)}
            disabled={!integration.preview3D}
          >
            3D Preview
          </button>
          <Link href={integration.caseStudyUrl} className={styles.actionButton}>
            Case Study
          </Link>
        </div>
      </div>
      
      <div className={styles.caseStudyContent}>
        <div className={styles.impactSection}>
          <h4>Business Impact</h4>
          <ul className={styles.impactList}>
            {integration.businessImpact.map((impact, index) => (
              <li key={index}>{impact}</li>
            ))}
          </ul>
        </div>
        
        <div className={styles.technicalSection}>
          <h4>Technical Highlights</h4>
          <ul className={styles.technicalList}>
            {integration.technicalHighlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Main TechnicalExpertiseShowcase3D component
 */
export interface TechnicalExpertiseShowcase3DProps {
  className?: string;
  initialMode?: ShowcaseMode;
  enableModeNavigation?: boolean;
}

export default function TechnicalExpertiseShowcase3D({
  className,
  initialMode = 'overview',
  enableModeNavigation = true
}: TechnicalExpertiseShowcase3DProps) {
  const [currentMode, setCurrentMode] = useState<ShowcaseMode>(initialMode);
  const [selectedProject, setSelectedProject] = useState<string>('invoice-chaser');

  // Get current project integration
  const currentIntegration = useMemo(() => {
    return caseStudyIntegrations.find(integration => integration.projectId === selectedProject);
  }, [selectedProject]);

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
    setCurrentMode('projects');
  };

  const handleModeChange = (mode: ShowcaseMode) => {
    setCurrentMode(mode);
    // Reset selections when changing modes
    if (mode !== 'projects' && mode !== 'architecture') {
      setSelectedProject('invoice-chaser');
    }
  };

  return (
    <div className={`${styles.showcaseContainer} ${className || ''}`}>
      {/* Mode navigation */}
      {enableModeNavigation && (
        <ModeNavigation
          currentMode={currentMode}
          onModeChange={handleModeChange}
        />
      )}

      {/* Showcase content based on current mode */}
      <div className={styles.showcaseContent}>
        {currentMode === 'overview' && (
          <div className={styles.overviewMode}>
            <div className={styles.overviewHeader}>
              <h2>Enterprise Solutions Architect</h2>
              <p>16+ years of technical excellence delivering measurable business impact</p>
            </div>
            
            <div className={styles.overviewGrid}>
              {showcaseSkillCards.map((card) => (
                <div key={card.id} className={styles.overviewCard}>
                  <SkillCard3D
                    skillData={card}
                    className={styles.overviewSkillCard}
                    enableInteractions={true}
                  />
                </div>
              ))}
            </div>
            
            <div className={styles.caseStudyIntegrations}>
              <h3>Portfolio Projects</h3>
              <div className={styles.integrationGrid}>
                {caseStudyIntegrations.map((integration) => (
                  <CaseStudyIntegration
                    key={integration.projectId}
                    integration={integration}
                    onProjectSelect={handleProjectSelect}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {currentMode === 'skills' && (
          <div className={styles.skillsMode}>
            <h2>Interactive Skill Demonstrations</h2>
            <div className={styles.skillsGrid}>
              {showcaseSkillCards.map((card) => (
                <SkillCard3D
                  key={card.id}
                  skillData={card}
                  className={styles.skillCard}
                  enableInteractions={true}
                />
              ))}
            </div>
          </div>
        )}

        {currentMode === 'timeline' && (
          <div className={styles.timelineMode}>
            <SkillProgressionTimeline3D
              className={styles.timeline}
              enableInteractions={true}
              showControls={true}
            />
          </div>
        )}

        {currentMode === 'technology' && (
          <div className={styles.technologyMode}>
            <TechnologyVisualization3D
              className={styles.technologyViz}
              enableInteractions={true}
              showControls={true}
            />
          </div>
        )}

        {currentMode === 'projects' && (
          <div className={styles.projectsMode}>
            <ProjectPreview3D
              projectId={selectedProject}
              className={styles.projectPreview}
              enableInteractions={true}
              showControls={true}
              showMetrics={true}
            />
            
            {currentIntegration && (
              <div className={styles.projectIntegration}>
                <h3>Explore Further</h3>
                <div className={styles.integrationActions}>
                  <button
                    className={styles.actionButton}
                    onClick={() => setCurrentMode('architecture')}
                  >
                    View Architecture
                  </button>
                  <Link href={currentIntegration.caseStudyUrl} className={styles.actionButton}>
                    Full Case Study
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {currentMode === 'architecture' && (
          <div className={styles.architectureMode}>
            <ProjectArchitecture3D
              projectId={selectedProject}
              className={styles.architectureViz}
              enableInteractions={true}
              showControls={true}
            />
            
            {currentIntegration && (
              <div className={styles.architectureIntegration}>
                <h3>Technical Deep Dive</h3>
                <p>Explore the complete technical implementation and business impact analysis.</p>
                <div className={styles.integrationActions}>
                  <button
                    className={styles.actionButton}
                    onClick={() => setCurrentMode('projects')}
                  >
                    Back to Preview
                  </button>
                  <Link href={currentIntegration.caseStudyUrl} className={styles.actionButton}>
                    Complete Case Study
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mode-specific context information */}
      <div className={styles.contextInfo}>
        {currentMode === 'overview' && (
          <p>Comprehensive view of technical expertise with direct links to detailed case studies and 3D demonstrations.</p>
        )}
        {currentMode === 'skills' && (
          <p>Interactive 3D skill cards showing proficiency levels, business value, and real-world achievements.</p>
        )}
        {currentMode === 'timeline' && (
          <p>16+ years of career progression from web developer to Enterprise Solutions Architect.</p>
        )}
        {currentMode === 'technology' && (
          <p>Technology-specific demonstrations with React and Node.js architecture visualizations.</p>
        )}
        {currentMode === 'projects' && (
          <p>3D project previews with interactive architecture exploration and business metrics.</p>
        )}
        {currentMode === 'architecture' && (
          <p>Detailed system architecture with performance insights and scalability analysis.</p>
        )}
      </div>
    </div>
  );
}