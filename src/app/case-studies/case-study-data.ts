// Case Studies Data
// Source: /research/CASE_STUDIES_DRAFT.md
// Note: Case Study 4 combines SDI Media + Warner Bros localization

export interface CaseStudyResult {
  metric: string;
  value: string;
  context?: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  company: string;
  metric: string;
  metricLabel: string;
  title: string;
  summary: string;
  challenge: string;
  approach: {
    title: string;
    description: string;
  }[];
  deliverables: string[];
  results: CaseStudyResult[];
  additionalImpact?: string[];
  tags: string[];
  tabLabel: string; // For terminal/browser tabs
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'warner-bros',
    slug: 'warner-bros',
    company: 'Warner Bros.',
    metric: '32% → 96%',
    metricLabel: 'Delivery Acceptance',
    title: 'Content Delivery Transformation',
    summary: 'Transformed iTunes film delivery acceptance from 32% to 96% while tripling monthly volume—in just 3 months. Built direct partnership with Apple and created standards that other WB teams adopted.',
    challenge: `When I joined Warner Bros, the iTunes film delivery operation was in crisis. Only 32% of our submissions were being accepted by Apple. Daily rejection emails went out to hundreds of stakeholders—WB distribution teams, external partners, executives. The rejection rate was damaging our relationship with Apple and creating massive rework costs.

To make matters worse, business needs required us to dramatically increase volume from 30 films per month to over 100.`,
    approach: [
      {
        title: 'Rapid diagnosis',
        description: 'Analyzed every rejection type to understand root causes—file naming issues, format specs, codec mismatches, metadata errors, and more. Each rejection category got documented with specific fixes.'
      },
      {
        title: 'Direct partnership',
        description: "Established a direct working relationship with Apple's head of iTunes content partnerships. When specs were ambiguous, I got clarification directly from the source rather than guessing."
      },
      {
        title: 'Cross-functional adoption',
        description: "A solution no one uses isn't a solution. I worked with QC teams, vendors, and other WB departments to ensure the new standards were actually followed—not just documented."
      },
      {
        title: 'Continuous iteration',
        description: 'Measured results weekly and refined the process based on what was still failing. Every rejection was a learning opportunity.'
      }
    ],
    deliverables: [
      '50-60 pages contributed to the comprehensive 150+ page iTunes publishing manual',
      'QC checklists covering every rejection category with specific validation steps',
      'Training materials for team members, vendors, and cross-departmental stakeholders',
      'Direct Apple relationship for ongoing spec clarification and troubleshooting'
    ],
    results: [
      { metric: 'Delivery acceptance', value: '32% → 96%', context: '3 months' },
      { metric: 'Monthly volume', value: '30 → 100+ films', context: '3 months' },
      { metric: 'Daily rejection emails', value: 'Hundreds → Zero', context: '3 months' }
    ],
    additionalImpact: [
      'Received Exceptional Performance Award presented by WB facility president',
      'TV distribution teams adopted my methodology for their own operations',
      'Earned SME designation within first month—became the go-to person for iTunes delivery',
      'Built direct relationship with Apple iTunes head of content partnerships'
    ],
    tags: ['Quality Assurance', 'Process Design', 'Apple Partnership'],
    tabLabel: 'warner-bros.md'
  },
  {
    id: 'fox-fifa',
    slug: 'fox-fifa',
    company: 'Fox Sports',
    metric: 'Emmy Award',
    metricLabel: 'Outstanding Coverage',
    title: 'Emmy-Winning Streaming Platform',
    summary: "Built the complete CMS powering Fox's 2018 FIFA World Cup streaming from scratch. Live/VOD, transcoding, metadata, multi-platform publishing—serving millions of viewers and earning an Emmy Award.",
    challenge: `Fox needed to deliver the 2018 FIFA World Cup to millions of viewers across every Fox app and device—web, mobile, connected TV, and more. This wasn't just a content delivery challenge; it required building an entirely new content management system from scratch.

The platform needed to handle live streaming of matches in real-time, video-on-demand for replays and highlights, transcoding across multiple formats and quality levels, metadata management for thousands of content pieces, and publishing orchestration to dozens of endpoints simultaneously.`,
    approach: [
      {
        title: 'Live/VOD integration',
        description: 'Built systems to handle both real-time streaming and on-demand content within a unified workflow, enabling instant publishing as matches unfolded.'
      },
      {
        title: 'Multi-format delivery',
        description: 'Designed transcoding and encoding pipelines to serve content optimized for every device type and network condition.'
      },
      {
        title: 'Metadata architecture',
        description: 'Created comprehensive metadata systems covering match details, teams, players, timing, rights, and distribution parameters.'
      },
      {
        title: 'Publishing orchestration',
        description: 'Built automation to push content simultaneously across all Fox apps and websites the moment it was ready.'
      }
    ],
    deliverables: [
      'Complete CMS architecture for live and VOD content management',
      'Transcoding pipelines supporting multiple formats, resolutions, and quality tiers',
      'Metadata system for comprehensive content organization and discovery',
      'Multi-platform publishing to all Fox apps, websites, and connected devices',
      'Real-time workflows enabling immediate content availability during live events'
    ],
    results: [
      { metric: 'Recognition', value: 'Emmy Award', context: 'Outstanding Trans-Media Sports Coverage' },
      { metric: 'Reach', value: 'Millions of viewers', context: 'Global multi-platform' },
      { metric: 'Platforms', value: 'Web, mobile, connected TV', context: 'Seamless delivery' },
      { metric: 'Publishing', value: 'Real-time', context: 'Immediate availability' }
    ],
    tags: ['CMS Architecture', 'Live Streaming', 'Multi-platform'],
    tabLabel: 'fox-fifa.md'
  },
  {
    id: 'fox-catalog',
    slug: 'fox-catalog',
    company: 'Fox',
    metric: '$1.5M+',
    metricLabel: 'Cost Savings',
    title: 'Catalog Optimization',
    summary: 'Saved $1.5M+ by bringing closed caption corrections in-house during a 15,000-title library QC. Identified the problem, pitched the solution, trained the team, eliminated vendor dependency.',
    challenge: `Fox was conducting quality control across their entire library—over 15,000 titles (4,000+ movies and 11,000+ TV episodes). During the transcoding process, we discovered a systemic issue: closed caption files were drifting out of sync, starting slightly off and ending 5-20 seconds misaligned by the end of videos.

The existing solution was to send each file to an external vendor for sync correction at $100-200+ per file. At library scale, this meant millions in unexpected costs that leadership hadn't budgeted for.`,
    approach: [
      {
        title: 'Research',
        description: 'Identified Mac Caption as professional-grade captioning software that could handle sync corrections in-house.'
      },
      {
        title: 'Business case',
        description: 'Pitched the solution to leadership—software cost vs. per-file vendor fees made the ROI obvious.'
      },
      {
        title: 'Training',
        description: 'Once approved, trained two team members on the sync-fix workflow, enabling the team to handle corrections internally.'
      },
      {
        title: 'Quality standards',
        description: 'Established QC procedures to ensure in-house corrections met the same quality bar as vendor work.'
      }
    ],
    deliverables: [
      'Mac Caption implementation — professional captioning software deployed for in-house use',
      'Training program for 2 team members on sync-fix workflows',
      'QC standards ensuring corrections met broadcast quality requirements',
      'Workflow documentation for ongoing library maintenance'
    ],
    results: [
      { metric: 'Cost savings', value: '$1.5M+', context: '6 months' },
      { metric: 'Library scope', value: '15,000+ titles', context: '4,000 movies, 11,000+ TV episodes' },
      { metric: 'Per-file savings', value: '$100-200+', context: 'Per correction' },
      { metric: 'Vendor dependency', value: 'Eliminated', context: 'Caption sync fixes' }
    ],
    additionalImpact: [
      'Proactive initiative—leadership didn\'t know to expect these costs until I identified the problem and proposed the solution'
    ],
    tags: ['Cost Reduction', 'Training', 'Workflow Design'],
    tabLabel: 'fox-catalog.md'
  },
  {
    id: 'localization',
    slug: 'localization',
    company: 'SDI Media + Warner Bros.',
    metric: '20+ Languages',
    metricLabel: 'Global Operations',
    title: 'Global Localization Operations',
    summary: 'Transformed QC from "send and hope" to systematic processes. Managed localization across 20+ languages at SDI Media and coordinated multilingual delivery operations at Warner Bros, including CVAA compliance remediation affecting hundreds of titles.',
    challenge: `SDI Media handled localization for major studios across 20+ languages—subtitles, foreign audio dubs, metadata, and artwork for both TV and film. When I arrived, the QC process was essentially "send and hope"—files went out without systematic validation, and rejections were frequent.

The operation handled hundreds of files per day on high-volume days across languages including Spanish (Latin American + Spain variants), French (Canadian + France variants), Portuguese (Brazil + Portugal), German, Dutch, Italian, and a dozen more.

Beyond the QC issues, I discovered a federal accessibility compliance gap (CVAA) affecting hundreds of titles across multiple distribution platforms. At Warner Bros, I similarly coordinated multilingual content delivery for international markets as part of the iTunes publishing operation.`,
    approach: [
      {
        title: 'Immediate QC transformation',
        description: 'Analyzed rejection patterns to identify root causes: file naming, format specs, codecs, sync issues, language tags, dub card formatting. Created systematic checklists replacing ad-hoc review.'
      },
      {
        title: 'Validation workflows',
        description: 'Implemented validation workflows before any file left the building, ensuring systematic quality control replaced reactive firefighting.'
      },
      {
        title: 'Compliance remediation',
        description: 'Identified the CVAA gap and strategically influenced leadership to prioritize remediation. Designed end-to-end workflow: proxy download → caption authoring coordination → file receipt → platform-specific packaging.'
      },
      {
        title: 'Vendor coordination',
        description: 'Coordinated with 5-10 external vendors and freelancers to execute remediation at scale across dubbing and voiceover operations.'
      }
    ],
    deliverables: [
      'QC checklists covering all rejection categories with specific validation steps',
      'CVAA remediation workflow — end-to-end process for closed caption backfill',
      'Vendor coordination system for managing 5-10 external dubbing and voiceover partners',
      'Language validation procedures for 20+ languages across multiple content types'
    ],
    results: [
      { metric: 'Redeliveries', value: 'Reduced 50%', context: 'Systematic QC' },
      { metric: 'Languages supported', value: '20+', context: 'Subtitles, metadata, foreign audio, artwork' },
      { metric: 'QC transformation', value: 'First month', context: '"Send and hope" → systematic validation' },
      { metric: 'Compliance', value: 'Hundreds of titles', context: 'CVAA accessibility remediation' }
    ],
    additionalImpact: [
      'Languages managed: English, Spanish (2 variants), French (2 variants), Portuguese (2 variants), Dutch, Greek, German, Italian, Norwegian, Swedish, Finnish, Danish, Russian, Turkish, Mandarin, Traditional Chinese, Korean, Thai'
    ],
    tags: ['Localization', 'Compliance', 'Vendor Management'],
    tabLabel: 'localization.md'
  },
  {
    id: 'factspark',
    slug: 'factspark',
    company: 'FactSpark',
    metric: '<200ms',
    metricLabel: 'Query Performance',
    title: 'AI-Powered Content Intelligence',
    summary: 'Built a full-stack AI platform from scratch—semantic search, automated metadata extraction, and claim verification. Solo development using React, FastAPI, and Gemini AI.',
    challenge: `I wanted to build something that demonstrated current AI/ML capabilities while solving a real problem: how do you make large content libraries actually searchable and discoverable?

Traditional search relies on exact keyword matching. But content relationships are semantic—an article about "executive compensation" should surface when someone searches for "CEO pay," even if those exact words don't appear.

I also wanted to explore AI-driven content analysis: Could I automatically extract entities, assess content themes, and even verify factual claims?`,
    approach: [
      {
        title: 'Backend architecture',
        description: 'FastAPI with 40+ API endpoints, ChromaDB vector database for semantic search, Sentence Transformers for embedding generation.'
      },
      {
        title: 'Frontend',
        description: 'React 19 + TypeScript SPA with nested routing, achieving <2 second page loads and 80% reduction in API calls through optimized data fetching.'
      },
      {
        title: 'AI/ML pipeline',
        description: '6-step progressive enhancement workflow processing articles through entity extraction (spaCy NER), semantic analysis, and automated metadata generation across 130+ fields.'
      },
      {
        title: 'Claim verification',
        description: 'Integrated Gemini AI with Google Search grounding to verify factual claims—3-stage validation pipeline processing 67+ claims with automated retry logic.'
      }
    ],
    deliverables: [
      'Full-stack platform — React 19 frontend + FastAPI backend + ChromaDB vector database',
      'Semantic search — <500ms query performance across 1000+ records using Sentence Transformers',
      'Metadata pipeline — 6-step AI workflow generating 130+ fields per article',
      'Claim verification — Gemini AI integration with 3-stage validation and Google Search grounding',
      'Production deployment — Google Cloud with 99.9%+ uptime, SSL, security headers, 30-second rollback'
    ],
    results: [
      { metric: 'Query performance', value: '<200ms', context: 'Average response time' },
      { metric: 'Content processed', value: '130+ articles', context: 'Full metadata' },
      { metric: 'Search performance', value: '<500ms', context: '1000+ records' },
      { metric: 'Error reduction', value: '78%', context: 'Model upgrades and pipeline refinement' },
      { metric: 'API optimization', value: '80% reduction', context: 'Nested routing' },
      { metric: 'Uptime', value: '99.9%+', context: 'Google Cloud production' }
    ],
    additionalImpact: [
      'Technical stack: React 19, TypeScript, FastAPI, Python, ChromaDB, Sentence Transformers, spaCy, Gemini AI, Google Cloud, Nginx'
    ],
    tags: ['AI/ML', 'Full-Stack', 'React + FastAPI'],
    tabLabel: 'factspark.md'
  }
];

// Helper to get case study by slug
export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find(cs => cs.slug === slug);
}

// Helper to get all slugs (for static generation if needed later)
export function getAllCaseStudySlugs(): string[] {
  return caseStudies.map(cs => cs.slug);
}
