// Project Portfolio - TypeScript Interfaces

export interface SkillTooltip {
  context: string;
  useCases: string[];
  experience: string;
  keyFeatures: string[];
  relatedTech: string[];
}

export interface TechStack {
  name: string;
  category: "frontend" | "backend" | "database" | "cloud" | "tool";
  color: string;
  icon?: string;
  tooltip?: SkillTooltip;
}

export interface ProjectMetric {
  label: string;
  value: string | number;
  unit?: string;
  improvement?: string;
  color?: string;
}

export interface CodeExample {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  highlightLines?: number[];
  explanation?: string;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  type: "frontend" | "backend" | "database" | "external" | "cloud";
  description: string;
  technologies: string[];
  position: { x: number; y: number };
  connections: string[];
}

export interface ProjectChallenge {
  title: string;
  description: string;
  solution: string;
  technologies: string[];
  codeExample?: string;
}

// Professional Photography Types
export interface PhotoAsset {
  id: string;
  title: string;
  description?: string;
  category: 'professional' | 'projects' | 'behind-scenes' | 'blog';
  filename: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  tags?: string[];
  featured?: boolean;
  dateTaken?: string;
  location?: string;
  camera?: string;
  settings?: {
    aperture?: string;
    shutterSpeed?: string;
    iso?: number;
    focalLength?: string;
  };
}

export interface PhotoFilter {
  category?: PhotoAsset['category'];
  tag?: string;
  featured?: boolean;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;

  // Project categorization
  category: "saas" | "web-app" | "ecommerce" | "api" | "tool" | "library";
  industry:
    | "fintech"
    | "saas"
    | "e-commerce"
    | "productivity"
    | "proptech"
    | "retail"
    | "other";
  status: "completed" | "in-progress" | "concept";
  featured: boolean;

  // Technical details
  techStack: TechStack[];
  architecture: ArchitectureNode[];
  challenges: ProjectChallenge[];
  codeExamples: CodeExample[];

  // Performance and metrics
  metrics: ProjectMetric[];
  timeline: {
    started: string;
    completed?: string;
    duration: string;
  };

  // Media and links
  images: string[];
  demoUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;

  // Deep-dive content (for featured projects)
  deepDive?: {
    problemStatement: string;
    solutionOverview: string;
    technicalJourney: string[];
    keyInnovations: string[];
    lessonsLearned: string[];
    futureEnhancements: string[];
  };
}

export interface ProjectFilter {
  category?: Project["category"];
  industry?: Project["industry"];
  technology?: string;
  status?: Project["status"];
}

export interface ProjectShowcaseProps {
  projects: Project[];
  filter?: ProjectFilter;
  limit?: number;
  showFeatured?: boolean;
}

// Hierarchical Skills Structure
export interface SkillSubcategory {
  name: string;
  description: string;
  skills: TechStack[];
  codeExample?: CodeExample;
}

export interface HierarchicalSkillCategory {
  name: string;
  emoji: string;
  description: string;
  color: string;
  subcategories: SkillSubcategory[];
}

