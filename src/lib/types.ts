// Project Portfolio - TypeScript Interfaces

export interface TechStack {
  name: string
  category: 'frontend' | 'backend' | 'database' | 'cloud' | 'tool'
  color: string
  icon?: string
}

export interface ProjectMetric {
  label: string
  value: string | number
  unit?: string
  improvement?: string
  color?: string
}

export interface CodeExample {
  id: string
  title: string
  description: string
  language: string
  code: string
  highlightLines?: number[]
  explanation?: string
}

export interface ArchitectureNode {
  id: string
  label: string
  type: 'frontend' | 'backend' | 'database' | 'external' | 'cloud'
  description: string
  technologies: string[]
  position: { x: number; y: number }
  connections: string[]
}

export interface ProjectChallenge {
  title: string
  description: string
  solution: string
  technologies: string[]
  codeExample?: string
}

export interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  longDescription: string
  
  // Project categorization
  category: 'saas' | 'web-app' | 'ecommerce' | 'api' | 'tool' | 'library'
  industry: 'fintech' | 'saas' | 'e-commerce' | 'productivity' | 'proptech' | 'retail' | 'other'
  status: 'completed' | 'in-progress' | 'concept'
  featured: boolean
  
  // Technical details
  techStack: TechStack[]
  architecture: ArchitectureNode[]
  challenges: ProjectChallenge[]
  codeExamples: CodeExample[]
  
  // Performance and metrics
  metrics: ProjectMetric[]
  timeline: {
    started: string
    completed?: string
    duration: string
  }
  
  // Media and links
  images: string[]
  demoUrl?: string
  githubUrl?: string
  caseStudyUrl?: string
  
  // Deep-dive content (for featured projects)
  deepDive?: {
    problemStatement: string
    solutionOverview: string
    technicalJourney: string[]
    keyInnovations: string[]
    lessonsLearned: string[]
    futureEnhancements: string[]
  }
}

export interface ProjectFilter {
  category?: Project['category']
  industry?: Project['industry']
  technology?: string
  status?: Project['status']
}

export interface ProjectShowcaseProps {
  projects: Project[]
  filter?: ProjectFilter
  limit?: number
  showFeatured?: boolean
}