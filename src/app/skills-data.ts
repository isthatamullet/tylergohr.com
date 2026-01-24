// Skills data for all page variants
// Source: /research/SKILLS_SECTION_DRAFT.md

export interface Competency {
  label: string;
  description: string;
}

export interface SkillCategory {
  id: string;
  headline: string;
  description: string;
  competencies: Competency[];
  evidence: string[];
}

export interface PlatformCategory {
  category: string;
  tools: string;
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'content-operations',
    headline: 'Content Operations',
    description: 'End-to-end content lifecycle management from ingestion to delivery. I architect CMS and DAM systems that handle enterprise-scale libraries—250,000+ digital assets across 70,000+ titles at Fox. My approach: build systems that scale, then document them so they outlast my tenure.',
    competencies: [
      { label: 'CMS/DAM Architecture', description: 'Designed and administered Brightcove, MPX, Adobe AEM, SharePoint, and proprietary platforms for enterprise content management' },
      { label: 'Digital Asset Management', description: 'Managed 250K+ assets across 70K+ titles including TV, film, short-form video, and live streaming content' },
      { label: 'Rapid Platform Mastery', description: 'Consistently become the go-to expert on new platforms within weeks; earned SME status in first month at Warner Bros, hired specifically for that expertise at next role' },
      { label: 'Platform Launches', description: 'End-to-end delivery of new platform launches: Fox Nation (100 episodes day 1), Fox Weather (audio-only pipelines), iTunes eBook operation (built from scratch)' },
      { label: 'Live Event Operations', description: 'Real-time content publishing during worldwide sporting events including FIFA World Cup; high-pressure, time-critical delivery where delays aren\'t an option' },
      { label: 'Catalog Management', description: 'End-to-end ownership of content libraries spanning movies from the 1910s to current releases' },
      { label: 'Localization at Scale', description: 'Coordinated multilingual delivery across 20+ languages (subtitles, foreign audio, metadata, artwork)' },
      { label: 'Content Ingestion', description: 'Defined intake workflows, validation standards, and acceptance criteria for multiple content sources' },
    ],
    evidence: [
      'Fox: 250,000+ digital assets, 70,000+ titles, 3 platform launches',
      'SDI Media: 20+ languages across hundreds of daily deliveries',
      'Warner Bros: SME in first month; built iTunes eBook operation from scratch',
    ],
  },
  {
    id: 'quality-assurance',
    headline: 'Quality Assurance',
    description: 'I transform chaotic QC into systematic processes that deliver consistent results at scale. At Warner Bros, I took delivery acceptance from 32% to 96% while tripling volume. At SDI, I replaced "send and hope" with systematic checklists in my first month—reducing redeliveries 50%.',
    competencies: [
      { label: 'Technical QA', description: 'File naming, format specs, codecs, sync validation, language tags, transcoding verification' },
      { label: 'Creative QA', description: 'Brand standards compliance, metadata accuracy, content appropriateness' },
      { label: 'Process Design', description: 'Root cause analysis, targeted fixes, systematic checklists, continuous improvement' },
      { label: 'Video Technical', description: 'Frame rates, aspect ratios, color space, audio specs, closed captioning sync' },
      { label: 'Platform Standards', description: 'iTunes, streaming services, OTT platforms—each with unique requirements' },
    ],
    evidence: [
      'Warner Bros: 32% → 96% acceptance rate in 3 months',
      'SDI Media: 50% reduction in redeliveries',
      'Fox: Identified and corrected telecine issues across entire PSA library',
    ],
  },
  {
    id: 'process-automation',
    headline: 'Process & Automation',
    description: 'I don\'t just execute workflows—I optimize them. Whether it\'s bringing CC fixes in-house to save $1.5M+ or building AI-powered tools that reduce manual review by 95%, I look for opportunities to eliminate bottlenecks and scale capacity.',
    competencies: [
      { label: 'Workflow Optimization', description: 'Analyze existing processes, identify inefficiencies, design and implement improvements' },
      { label: 'Product Management', description: 'Co-led enterprise platform scoping for Fox-wide CMS replacement; defined requirements, timelines, and resources through stakeholder discovery; launched project with 250+ JIRA tickets' },
      { label: 'AI/ML Automation', description: 'Ad break detection, semantic analysis, content intelligence pipelines' },
      { label: 'Cost Reduction', description: 'In-house solutions replacing expensive vendor dependencies' },
      { label: 'Capacity Scaling', description: 'Process improvements that enable volume growth without proportional headcount' },
    ],
    evidence: [
      'Fox: $1.5M+ saved bringing CC sync-fix in-house during 15K-title library QC',
      'Fox: 95% reduction in manual review through AI-powered ad break detection (10,000+ episodes)',
      'Fox: 50% efficiency improvement across 250K+ asset operations',
      'Fox: 250+ JIRA tickets for enterprise CMS replacement scoping',
    ],
  },
  {
    id: 'cross-functional-leadership',
    headline: 'Cross-Functional Leadership',
    description: 'Content operations sits at the intersection of engineering, production, partnerships, and executive stakeholders. I coordinate across all of them—whether managing daily operations across 10+ countries or serving as the primary liaison to Apple\'s head of iTunes content partnerships.',
    competencies: [
      { label: 'Global Team Coordination', description: 'Daily operations across 10+ countries spanning 4+ continents (Mexico, Spain, Poland, England, India, Australia, Portugal, Indonesia, South America)' },
      { label: 'Matrix Leadership', description: 'Functional management of 10+ content specialists with decision authority over assignments, standards, and performance' },
      { label: 'Executive Communication', description: 'Hosted VP, Director, and Executive Director-level visits; presented workflows and educated senior stakeholders' },
      { label: 'Vendor Management', description: 'Primary contact for 10+ content sources; managed 5-10 external vendors and freelancers for dubbing and voiceover' },
      { label: 'Partnership Development', description: 'Built and maintained direct relationships with external partners at executive level' },
      { label: 'Budget & Cost Management', description: 'Managed project budgets for QC center construction and platform initiatives; forecasting spend for services and headcount' },
    ],
    evidence: [
      'Fox: 10+ countries, 4+ continents, 10+ content specialists, project budget ownership',
      'Warner Bros: Direct relationship with Apple iTunes head of content partnerships',
      'SDI: Coordinated 5-10 external dubbing/voiceover vendors',
    ],
  },
  {
    id: 'documentation-training',
    headline: 'Documentation & Training',
    description: 'Systems that outlast my tenure require excellent documentation and training. I\'ve contributed 50-60 pages to comprehensive platform manuals, built LMS infrastructure from scratch, and achieved 100% training completion rates across multi-office teams.',
    competencies: [
      { label: 'Technical Documentation', description: 'SOPs, QC checklists, technical specs, workflow guides, reference materials' },
      { label: 'LMS Administration', description: 'SharePoint, Confluence, Trainual—full platform setup including structure, permissions, courses, and version control' },
      { label: 'Assessment Development', description: 'Created knowledge-check quizzes validating learning outcomes across QC standards, CMS usage, and technical specs' },
      { label: 'Training Development', description: 'Onboarding programs, instructional content, screen recordings, cross-departmental education sessions' },
      { label: 'Knowledge Transfer', description: 'Documentation designed to enable others to maintain and extend systems independently' },
    ],
    evidence: [
      'Warner Bros: 50-60 pages contributed to 150+ page iTunes publishing manual',
      'Fox: 5-10 assessments with 100% completion rates across dozens of users',
      'Fox: LMS administration across SharePoint, Confluence, and Trainual',
    ],
  },
  {
    id: 'compliance-accessibility',
    headline: 'Compliance & Accessibility',
    description: 'I\'ve identified compliance gaps others missed and designed end-to-end remediation workflows. At SDI, I discovered a federal CVAA compliance issue affecting hundreds of titles and built the workflow to fix it—from proxy download through platform-specific packaging.',
    competencies: [
      { label: 'Accessibility Compliance', description: 'ADA, CVAA federal requirements, closed captioning standards' },
      { label: 'Regulatory Navigation', description: 'Multinational governmental, cultural, and content requirements across global markets' },
      { label: 'Remediation Design', description: 'End-to-end workflows for compliance gap resolution' },
      { label: 'Standards Enforcement', description: 'Quality bars maintained across vendors, teams, and platforms' },
      { label: 'Content Safety', description: 'Policy enforcement and cultural sensitivity guidelines' },
    ],
    evidence: [
      'SDI: Identified CVAA gap affecting hundreds of titles; designed complete remediation workflow',
      'Warner Bros: 100% compliance with Chicago Manual of Style, ADA, and platform standards',
      'Fox: Content rights and permissions management across regional windowing and subscription tiers',
    ],
  },
  {
    id: 'technical',
    headline: 'Technical',
    description: 'I bridge the gap between technical teams and content operations. Whether architecting metadata systems, integrating AI/ML tools, or building full-stack platforms from scratch, I speak both languages fluently.',
    competencies: [
      { label: 'AI/ML Integration', description: 'Gemini AI, Claude, Sentence Transformers, spaCy NER—integrated into production content workflows' },
      { label: 'Metadata Architecture', description: 'Schema design, taxonomy, entity extraction, semantic search systems' },
      { label: 'Platform Development', description: 'Full-stack builds: React 19 + TypeScript frontend, FastAPI backend, ChromaDB vector database' },
      { label: 'Data Analysis', description: 'PowerBI, Google Analytics, comScore, Nielsen—KPI tracking, performance dashboards, data-driven decisions' },
      { label: 'Markup & Formats', description: 'HTML, XML, EPUB, timed text formats, platform-specific packaging' },
    ],
    evidence: [
      'FactSpark: Full-stack AI platform with 130+ metadata fields, <200ms query performance',
      'Fox: Built Emmy-winning FIFA World Cup CMS from scratch',
      'Fox: Partnered with Comcast development teams on CMS enhancements',
    ],
  },
  {
    id: 'platforms-tools',
    headline: 'Platforms & Tools',
    description: 'Deep hands-on experience across the content operations technology stack—video platforms, DAM systems, project management, analytics, and creative tools.',
    competencies: [], // This category uses a different format (table)
    evidence: [],
  },
];

// Special format for Platforms & Tools category
export const platformsTools: PlatformCategory[] = [
  { category: 'Video/Streaming', tools: 'Brightcove, Comcast MPX, iTunes Store, OTT services, live streaming' },
  { category: 'CMS/DAM', tools: 'Adobe AEM, SharePoint, Drupal, WordPress, proprietary platforms' },
  { category: 'Project Management', tools: 'JIRA, Airtable, Monday.com' },
  { category: 'Learning/Docs', tools: 'SharePoint, Confluence, Trainual' },
  { category: 'Analytics', tools: 'PowerBI, Google Analytics, comScore, Nielsen' },
  { category: 'Creative', tools: 'Adobe Photoshop, Premiere Pro, After Effects, Media Encoder' },
  { category: 'Technical', tools: 'HTML, XML, EPUB, Python, React, TypeScript, FastAPI' },
  { category: 'Video Technical', tools: 'Closed captioning, subtitling, transcoding, DRM systems' },
];
