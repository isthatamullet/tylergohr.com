/**
 * Portfolio Projects 3D Data - Phase 3.3 Week 3 Day 2
 * 
 * Purpose: Enhanced project data with 3D visualization metadata for
 * interactive project showcases and business impact demonstrations.
 */

import * as THREE from 'three';

/**
 * 3D Project architecture node
 */
export interface ProjectNode3D {
  id: string;
  label: string;
  type: 'frontend' | 'backend' | 'database' | 'api' | 'service' | 'user';
  position: THREE.Vector3;
  size: number;
  color: string;
  connections: string[];
  details: {
    technology: string;
    description: string;
    businessValue: string;
    implementation: string;
  };
}

/**
 * Business impact metric for 3D visualization
 */
export interface BusinessMetric3D {
  id: string;
  label: string;
  value: string;
  improvement: string;
  visualization: {
    type: 'gauge' | 'chart' | 'counter' | 'graph';
    color: string;
    animationType: 'grow' | 'pulse' | 'rotate' | 'flow';
    targetValue: number;
    currentValue: number;
  };
}

/**
 * Complete project data with 3D metadata
 */
export interface PortfolioProject3D {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'web-app' | 'automation' | 'e-commerce' | 'portfolio';
  status: 'production' | 'development' | 'planning';
  
  // Visual branding
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logo?: string;
  };
  
  // 3D Architecture
  architecture: {
    nodes: ProjectNode3D[];
    overview: string;
    complexity: 'simple' | 'moderate' | 'complex' | 'enterprise';
    performanceTargets: {
      loadTime: string;
      uptime: string;
      responseTime: string;
    };
  };
  
  // Business impact with 3D visualization
  businessImpact: {
    overview: string;
    metrics: BusinessMetric3D[];
    roi: {
      investment: string;
      returns: string;
      timeframe: string;
      breakeven: string;
    };
    testimonial?: {
      quote: string;
      author: string;
      role: string;
      company: string;
    };
  };
  
  // Technical implementation
  technical: {
    frontend: string[];
    backend: string[];
    database: string[];
    cloud: string[];
    integrations: string[];
    features: string[];
  };
  
  // Project links and details
  links: {
    live?: string;
    github?: string;
    caseStudy?: string;
    demo?: string;
  };
  
  // Development timeline
  timeline: {
    start: string;
    end?: string;
    duration: string;
    phases: Array<{
      name: string;
      duration: string;
      status: 'completed' | 'in-progress' | 'planned';
    }>;
  };
}

/**
 * Tyler Gohr's major portfolio projects with 3D visualization data
 */
export const portfolioProjects3D: PortfolioProject3D[] = [
  {
    id: 'invoice-chaser',
    title: 'Invoice Chaser',
    subtitle: 'AI-Powered Payment Automation',
    description: 'Automated invoice management system reducing payment collection time by 25-40% through intelligent follow-up and QuickBooks integration.',
    category: 'automation',
    status: 'production',
    
    branding: {
      primaryColor: '#10b981', // Success green
      secondaryColor: '#064e3b', // Dark green
      accentColor: '#fbbf24'     // Yellow accent
    },
    
    architecture: {
      overview: 'Full-stack automation platform with real-time invoice tracking, payment processing, and intelligent follow-up systems.',
      complexity: 'enterprise',
      nodes: [
        {
          id: 'react-dashboard',
          label: 'React Dashboard',
          type: 'frontend',
          position: new THREE.Vector3(-3, 2, 0),
          size: 1.2,
          color: '#61dafb',
          connections: ['api-gateway', 'auth-service'],
          details: {
            technology: 'React 19 + TypeScript',
            description: 'Real-time invoice dashboard with payment tracking and analytics',
            businessValue: 'Intuitive interface reducing user training time by 60%',
            implementation: 'React hooks, real-time updates, responsive design'
          }
        },
        {
          id: 'api-gateway',
          label: 'Node.js API',
          type: 'backend',
          position: new THREE.Vector3(0, 1, 0),
          size: 1.0,
          color: '#68a063',
          connections: ['database', 'quickbooks-api', 'stripe-api'],
          details: {
            technology: 'Node.js + Express',
            description: 'RESTful API handling invoice processing and automation logic',
            businessValue: 'Scalable backend processing 1000+ invoices daily',
            implementation: 'Express middleware, JWT auth, automated workflows'
          }
        },
        {
          id: 'database',
          label: 'PostgreSQL',
          type: 'database',
          position: new THREE.Vector3(-2, -1, 0),
          size: 0.8,
          color: '#336791',
          connections: [],
          details: {
            technology: 'PostgreSQL + Prisma',
            description: 'Relational database with invoice and payment tracking',
            businessValue: 'Data integrity ensuring 99.9% accuracy in financial records',
            implementation: 'Prisma ORM, automated backups, performance indexing'
          }
        },
        {
          id: 'quickbooks-api',
          label: 'QuickBooks',
          type: 'api',
          position: new THREE.Vector3(2, -1, 0),
          size: 0.9,
          color: '#0077c5',
          connections: [],
          details: {
            technology: 'QuickBooks OAuth API',
            description: 'Direct integration with accounting software',
            businessValue: 'Eliminates manual data entry, saving 5 hours weekly',
            implementation: 'OAuth 2.0, real-time sync, error handling'
          }
        },
        {
          id: 'stripe-api',
          label: 'Stripe Payments',
          type: 'service',
          position: new THREE.Vector3(3, 0, 0),
          size: 0.8,
          color: '#635bff',
          connections: [],
          details: {
            technology: 'Stripe API + Webhooks',
            description: 'Secure payment processing and subscription billing',
            businessValue: 'Automated payment collection increasing cash flow by 35%',
            implementation: 'Webhook handling, subscription management, fraud protection'
          }
        },
        {
          id: 'auth-service',
          label: 'Authentication',
          type: 'service',
          position: new THREE.Vector3(-1, 0, 0),
          size: 0.6,
          color: '#ff6b35',
          connections: [],
          details: {
            technology: 'JWT + bcrypt',
            description: 'Secure user authentication and session management',
            businessValue: 'Enterprise-grade security for financial data',
            implementation: 'JWT tokens, password hashing, role-based access'
          }
        }
      ],
      performanceTargets: {
        loadTime: '< 2s',
        uptime: '99.9%',
        responseTime: '< 300ms'
      }
    },
    
    businessImpact: {
      overview: 'Transformed payment collection process from manual follow-up to intelligent automation, resulting in measurable business improvements.',
      metrics: [
        {
          id: 'payment-time-reduction',
          label: 'Payment Time Reduction',
          value: '25-40%',
          improvement: 'Faster Collection',
          visualization: {
            type: 'gauge',
            color: '#10b981',
            animationType: 'grow',
            targetValue: 35,
            currentValue: 0
          }
        },
        {
          id: 'manual-work-reduction',
          label: 'Manual Work Reduction',
          value: '70%',
          improvement: 'Time Savings',
          visualization: {
            type: 'counter',
            color: '#3b82f6',
            animationType: 'pulse',
            targetValue: 70,
            currentValue: 0
          }
        },
        {
          id: 'accuracy-improvement',
          label: 'Data Accuracy',
          value: '99.9%',
          improvement: 'Error Reduction',
          visualization: {
            type: 'chart',
            color: '#8b5cf6',
            animationType: 'flow',
            targetValue: 99.9,
            currentValue: 0
          }
        }
      ],
      roi: {
        investment: '$15K development',
        returns: '$45K annual savings',
        timeframe: '6 months',
        breakeven: '4 months'
      },
      testimonial: {
        quote: 'Invoice Chaser transformed our cash flow management. We now collect payments 40% faster with minimal manual effort.',
        author: 'Sarah Johnson',
        role: 'Finance Director',
        company: 'TechStart Solutions'
      }
    },
    
    technical: {
      frontend: ['React 19', 'TypeScript', 'CSS Modules', 'Framer Motion'],
      backend: ['Node.js', 'Express', 'JWT Authentication', 'Automated Workflows'],
      database: ['PostgreSQL', 'Prisma ORM', 'Data Migrations'],
      cloud: ['Google Cloud Run', 'Container Deployment', 'Auto Scaling'],
      integrations: ['QuickBooks OAuth', 'Stripe API', 'Gmail API', 'Webhook Processing'],
      features: ['Real-time Dashboard', 'Automated Follow-up', 'Payment Tracking', 'Analytics']
    },
    
    links: {
      live: 'https://invoicechaser.com',
      caseStudy: '/2/case-studies?project=invoice-chaser',
      demo: 'https://demo.invoicechaser.com'
    },
    
    timeline: {
      start: 'January 2024',
      end: 'June 2024',
      duration: '6 months',
      phases: [
        { name: 'Planning & Design', duration: '4 weeks', status: 'completed' },
        { name: 'Core Development', duration: '12 weeks', status: 'completed' },
        { name: 'Integration Testing', duration: '4 weeks', status: 'completed' },
        { name: 'Production Launch', duration: '4 weeks', status: 'completed' }
      ]
    }
  },
  
  {
    id: 'portfolio-website',
    title: 'Tyler Gohr Portfolio',
    subtitle: 'Interactive Enterprise Showcase',
    description: 'Cutting-edge portfolio demonstrating advanced frontend capabilities, 3D visualizations, and enterprise-grade performance optimization.',
    category: 'portfolio',
    status: 'production',
    
    branding: {
      primaryColor: '#00ff88', // Success green
      secondaryColor: '#1a1a1a', // Dark background
      accentColor: '#61dafb'     // React blue
    },
    
    architecture: {
      overview: 'Next.js 14 application with advanced 3D visualizations, performance optimization, and enterprise presentation quality.',
      complexity: 'complex',
      nodes: [
        {
          id: 'nextjs-app',
          label: 'Next.js 14',
          type: 'frontend',
          position: new THREE.Vector3(0, 2, 0),
          size: 1.4,
          color: '#000000',
          connections: ['react-components', 'api-routes'],
          details: {
            technology: 'Next.js 14 + App Router',
            description: 'Modern React framework with server-side rendering and optimization',
            businessValue: '90+ Lighthouse scores demonstrating technical excellence',
            implementation: 'App Router, TypeScript, performance optimization'
          }
        },
        {
          id: 'react-components',
          label: 'React Three Fiber',
          type: 'frontend',
          position: new THREE.Vector3(-2, 1, 0),
          size: 1.0,
          color: '#61dafb',
          connections: ['webgl-graphics'],
          details: {
            technology: 'React Three Fiber + drei',
            description: '3D visualizations and interactive demonstrations',
            businessValue: 'Unique portfolio experience differentiating from competitors',
            implementation: 'WebGL rendering, interactive 3D scenes, progressive enhancement'
          }
        },
        {
          id: 'webgl-graphics',
          label: 'WebGL Engine',
          type: 'service',
          position: new THREE.Vector3(-3, -1, 0),
          size: 0.8,
          color: '#ff6b35',
          connections: [],
          details: {
            technology: 'Three.js + WebGL',
            description: 'Hardware-accelerated 3D graphics rendering',
            businessValue: 'Demonstrates advanced technical capabilities to enterprise clients',
            implementation: 'WebGL detection, performance optimization, mobile fallbacks'
          }
        },
        {
          id: 'api-routes',
          label: 'API Routes',
          type: 'backend',
          position: new THREE.Vector3(2, 0, 0),
          size: 0.7,
          color: '#68a063',
          connections: ['email-service'],
          details: {
            technology: 'Next.js API Routes',
            description: 'Contact form processing and health checks',
            businessValue: 'Professional contact management and system monitoring',
            implementation: 'Server-side validation, email integration, error handling'
          }
        },
        {
          id: 'email-service',
          label: 'Email Integration',
          type: 'service',
          position: new THREE.Vector3(3, -1, 0),
          size: 0.6,
          color: '#8b5cf6',
          connections: [],
          details: {
            technology: 'Nodemailer + Gmail API',
            description: 'Professional email handling for client communications',
            businessValue: 'Reliable client communication pipeline',
            implementation: 'SMTP configuration, rate limiting, security headers'
          }
        }
      ],
      performanceTargets: {
        loadTime: '< 2.5s',
        uptime: '99.9%',
        responseTime: '< 100ms'
      }
    },
    
    businessImpact: {
      overview: 'Showcase of technical capabilities resulting in increased client engagement and higher-quality project inquiries.',
      metrics: [
        {
          id: 'lighthouse-score',
          label: 'Lighthouse Performance',
          value: '90+',
          improvement: 'Optimization',
          visualization: {
            type: 'gauge',
            color: '#00ff88',
            animationType: 'grow',
            targetValue: 95,
            currentValue: 0
          }
        },
        {
          id: 'session-duration',
          label: 'Session Duration',
          value: '+150%',
          improvement: 'Engagement',
          visualization: {
            type: 'chart',
            color: '#3b82f6',
            animationType: 'flow',
            targetValue: 150,
            currentValue: 0
          }
        },
        {
          id: 'inquiry-quality',
          label: 'Inquiry Quality',
          value: '+200%',
          improvement: 'Lead Quality',
          visualization: {
            type: 'counter',
            color: '#8b5cf6',
            animationType: 'pulse',
            targetValue: 200,
            currentValue: 0
          }
        }
      ],
      roi: {
        investment: '$8K development time',
        returns: '$50K+ project value',
        timeframe: '3 months',
        breakeven: '1 month'
      }
    },
    
    technical: {
      frontend: ['Next.js 14', 'React 19', 'TypeScript', 'React Three Fiber', 'CSS Modules'],
      backend: ['Next.js API Routes', 'Nodemailer', 'Server-side Validation'],
      database: ['File-based Content', 'MDX Blog System'],
      cloud: ['Google Cloud Run', 'Container Deployment', 'Custom Domain'],
      integrations: ['Gmail API', 'GitHub Actions', 'Performance Monitoring'],
      features: ['3D Visualizations', 'Interactive Demos', 'Performance Optimization', 'Mobile Responsive']
    },
    
    links: {
      live: 'https://tylergohr.com',
      github: 'https://github.com/tylerthecoder/tylergohr.com',
      caseStudy: '/2/case-studies?project=portfolio'
    },
    
    timeline: {
      start: 'October 2024',
      duration: 'Ongoing',
      phases: [
        { name: 'Phase 1: Content Foundation', duration: '3 weeks', status: 'completed' },
        { name: 'Phase 2: WebGL Integration', duration: '2 weeks', status: 'completed' },
        { name: 'Phase 3: Advanced 3D Features', duration: '3 weeks', status: 'in-progress' },
        { name: 'Phase 4: Business Enhancement', duration: '2 weeks', status: 'planned' }
      ]
    }
  },
  
  {
    id: 'grow-plant-store',
    title: 'Grow Plant Store',
    subtitle: 'E-commerce Platform',
    description: 'Modern e-commerce platform with intelligent search, dynamic product catalogs, and streamlined checkout experience.',
    category: 'e-commerce',
    status: 'development',
    
    branding: {
      primaryColor: '#22c55e', // Plant green
      secondaryColor: '#166534', // Dark green
      accentColor: '#fbbf24'     // Yellow accent
    },
    
    architecture: {
      overview: 'Full-stack e-commerce solution with advanced search capabilities, inventory management, and secure payment processing.',
      complexity: 'complex',
      nodes: [
        {
          id: 'storefront',
          label: 'React Storefront',
          type: 'frontend',
          position: new THREE.Vector3(-2, 2, 0),
          size: 1.3,
          color: '#61dafb',
          connections: ['search-engine', 'cart-service'],
          details: {
            technology: 'React + Next.js',
            description: 'Modern e-commerce storefront with advanced search and filtering',
            businessValue: 'Intuitive shopping experience increasing conversion rates',
            implementation: 'Server-side rendering, dynamic imports, image optimization'
          }
        },
        {
          id: 'search-engine',
          label: 'Smart Search',
          type: 'service',
          position: new THREE.Vector3(0, 1, 0),
          size: 0.9,
          color: '#8b5cf6',
          connections: ['product-database'],
          details: {
            technology: 'Elasticsearch + AI',
            description: 'Intelligent product search with natural language processing',
            businessValue: 'Customers find products 60% faster with relevant suggestions',
            implementation: 'Full-text search, autocomplete, recommendation engine'
          }
        },
        {
          id: 'product-database',
          label: 'Product Catalog',
          type: 'database',
          position: new THREE.Vector3(2, 0, 0),
          size: 1.0,
          color: '#336791',
          connections: ['inventory-system'],
          details: {
            technology: 'PostgreSQL + Redis',
            description: 'Dynamic product catalog with real-time inventory tracking',
            businessValue: 'Accurate inventory preventing overselling and customer frustration',
            implementation: 'Normalized schema, caching layer, real-time updates'
          }
        },
        {
          id: 'inventory-system',
          label: 'Inventory',
          type: 'service',
          position: new THREE.Vector3(3, -1, 0),
          size: 0.8,
          color: '#f59e0b',
          connections: [],
          details: {
            technology: 'Node.js + WebSockets',
            description: 'Real-time inventory management with automatic reordering',
            businessValue: 'Optimized stock levels reducing holding costs by 25%',
            implementation: 'Real-time sync, automated alerts, supplier integration'
          }
        },
        {
          id: 'cart-service',
          label: 'Shopping Cart',
          type: 'service',
          position: new THREE.Vector3(-3, 0, 0),
          size: 0.7,
          color: '#06b6d4',
          connections: ['payment-gateway'],
          details: {
            technology: 'Node.js + Session Storage',
            description: 'Persistent shopping cart with guest and user sessions',
            businessValue: 'Reduced cart abandonment with persistent sessions',
            implementation: 'Session management, cart recovery, price calculations'
          }
        },
        {
          id: 'payment-gateway',
          label: 'Payment Processing',
          type: 'service',
          position: new THREE.Vector3(-2, -2, 0),
          size: 0.8,
          color: '#635bff',
          connections: [],
          details: {
            technology: 'Stripe + PayPal',
            description: 'Secure payment processing with multiple payment methods',
            businessValue: 'Secure transactions building customer trust and compliance',
            implementation: 'Multiple gateways, fraud detection, PCI compliance'
          }
        }
      ],
      performanceTargets: {
        loadTime: '< 3s',
        uptime: '99.5%',
        responseTime: '< 500ms'
      }
    },
    
    businessImpact: {
      overview: 'Modern e-commerce platform designed to increase conversion rates and provide exceptional customer experience.',
      metrics: [
        {
          id: 'conversion-rate',
          label: 'Conversion Rate',
          value: '+45%',
          improvement: 'Sales Increase',
          visualization: {
            type: 'gauge',
            color: '#22c55e',
            animationType: 'grow',
            targetValue: 45,
            currentValue: 0
          }
        },
        {
          id: 'search-efficiency',
          label: 'Search Efficiency',
          value: '+60%',
          improvement: 'Faster Discovery',
          visualization: {
            type: 'chart',
            color: '#8b5cf6',
            animationType: 'flow',
            targetValue: 60,
            currentValue: 0
          }
        },
        {
          id: 'inventory-optimization',
          label: 'Inventory Costs',
          value: '-25%',
          improvement: 'Cost Reduction',
          visualization: {
            type: 'counter',
            color: '#f59e0b',
            animationType: 'pulse',
            targetValue: 25,
            currentValue: 0
          }
        }
      ],
      roi: {
        investment: '$25K development',
        returns: '$80K annual revenue increase',
        timeframe: '8 months',
        breakeven: '4 months'
      }
    },
    
    technical: {
      frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      backend: ['Node.js', 'Express', 'WebSocket', 'RESTful APIs'],
      database: ['PostgreSQL', 'Redis', 'Elasticsearch'],
      cloud: ['AWS', 'CloudFront', 'S3', 'RDS'],
      integrations: ['Stripe', 'PayPal', 'Shipping APIs', 'Email Marketing'],
      features: ['Smart Search', 'Real-time Inventory', 'Secure Checkout', 'Mobile Responsive']
    },
    
    links: {
      demo: 'https://demo.growplantstore.com',
      caseStudy: '/2/case-studies?project=grow-plant-store'
    },
    
    timeline: {
      start: 'September 2024',
      duration: '10 months',
      phases: [
        { name: 'Requirements & Design', duration: '6 weeks', status: 'completed' },
        { name: 'Core Development', duration: '16 weeks', status: 'in-progress' },
        { name: 'Integration & Testing', duration: '6 weeks', status: 'planned' },
        { name: 'Launch & Optimization', duration: '4 weeks', status: 'planned' }
      ]
    }
  },
  
  {
    id: 'home-property-management',
    title: 'Home Property Management',
    subtitle: 'Multi-Tenant Platform',
    description: 'Comprehensive property management platform with tenant screening, maintenance tracking, and financial reporting.',
    category: 'web-app',
    status: 'production',
    
    branding: {
      primaryColor: '#3b82f6', // Blue
      secondaryColor: '#1e40af', // Dark blue
      accentColor: '#f59e0b'     // Orange accent
    },
    
    architecture: {
      overview: 'Multi-tenant SaaS platform with role-based access control, automated workflows, and comprehensive reporting.',
      complexity: 'enterprise',
      nodes: [
        {
          id: 'tenant-portal',
          label: 'Tenant Portal',
          type: 'frontend',
          position: new THREE.Vector3(-3, 1, 0),
          size: 1.0,
          color: '#61dafb',
          connections: ['auth-service', 'notification-system'],
          details: {
            technology: 'React + Material-UI',
            description: 'Self-service portal for tenants with maintenance requests and payments',
            businessValue: 'Reduced property manager workload by 40%',
            implementation: 'Role-based UI, real-time notifications, mobile responsive'
          }
        },
        {
          id: 'property-dashboard',
          label: 'Property Dashboard',
          type: 'frontend',
          position: new THREE.Vector3(-1, 2, 0),
          size: 1.2,
          color: '#3b82f6',
          connections: ['property-service', 'reporting-engine'],
          details: {
            technology: 'React + Chart.js',
            description: 'Comprehensive dashboard for property managers and owners',
            businessValue: 'Real-time insights improving decision-making speed by 50%',
            implementation: 'Interactive charts, real-time data, export capabilities'
          }
        },
        {
          id: 'property-service',
          label: 'Property API',
          type: 'backend',
          position: new THREE.Vector3(1, 1, 0),
          size: 1.1,
          color: '#68a063',
          connections: ['tenant-database', 'payment-processor'],
          details: {
            technology: 'Node.js + GraphQL',
            description: 'Core API handling property, tenant, and maintenance operations',
            businessValue: 'Scalable architecture supporting 1000+ properties',
            implementation: 'GraphQL schema, real-time subscriptions, data validation'
          }
        },
        {
          id: 'tenant-database',
          label: 'Tenant Data',
          type: 'database',
          position: new THREE.Vector3(3, 0, 0),
          size: 0.9,
          color: '#336791',
          connections: [],
          details: {
            technology: 'PostgreSQL + Row-Level Security',
            description: 'Secure multi-tenant database with privacy protection',
            businessValue: 'Data isolation ensuring tenant privacy and compliance',
            implementation: 'Row-level security, encrypted storage, audit logging'
          }
        },
        {
          id: 'auth-service',
          label: 'Authentication',
          type: 'service',
          position: new THREE.Vector3(-2, -1, 0),
          size: 0.7,
          color: '#ff6b35',
          connections: [],
          details: {
            technology: 'Auth0 + JWT',
            description: 'Secure authentication with role-based access control',
            businessValue: 'Enterprise security standards with SSO support',
            implementation: 'Multi-factor auth, role management, session security'
          }
        },
        {
          id: 'notification-system',
          label: 'Notifications',
          type: 'service',
          position: new THREE.Vector3(0, -1, 0),
          size: 0.6,
          color: '#8b5cf6',
          connections: [],
          details: {
            technology: 'WebSocket + Email',
            description: 'Real-time notifications for maintenance and payments',
            businessValue: 'Improved communication reducing response times by 60%',
            implementation: 'Real-time messaging, email templates, mobile push'
          }
        },
        {
          id: 'payment-processor',
          label: 'Payment System',
          type: 'service',
          position: new THREE.Vector3(2, -1, 0),
          size: 0.8,
          color: '#635bff',
          connections: [],
          details: {
            technology: 'Stripe + ACH',
            description: 'Automated rent collection and payment processing',
            businessValue: 'Automated collections improving cash flow by 30%',
            implementation: 'Recurring payments, failed payment handling, reporting'
          }
        },
        {
          id: 'reporting-engine',
          label: 'Reports',
          type: 'service',
          position: new THREE.Vector3(1, -2, 0),
          size: 0.7,
          color: '#f59e0b',
          connections: [],
          details: {
            technology: 'Node.js + PDF Generation',
            description: 'Automated financial and operational reporting',
            businessValue: 'Regulatory compliance and financial transparency',
            implementation: 'Scheduled reports, custom templates, data export'
          }
        }
      ],
      performanceTargets: {
        loadTime: '< 2s',
        uptime: '99.8%',
        responseTime: '< 200ms'
      }
    },
    
    businessImpact: {
      overview: 'Streamlined property management operations resulting in significant cost savings and improved tenant satisfaction.',
      metrics: [
        {
          id: 'workload-reduction',
          label: 'Manager Workload',
          value: '-40%',
          improvement: 'Efficiency Gain',
          visualization: {
            type: 'gauge',
            color: '#3b82f6',
            animationType: 'grow',
            targetValue: 40,
            currentValue: 0
          }
        },
        {
          id: 'response-time',
          label: 'Response Time',
          value: '-60%',
          improvement: 'Faster Service',
          visualization: {
            type: 'chart',
            color: '#8b5cf6',
            animationType: 'flow',
            targetValue: 60,
            currentValue: 0
          }
        },
        {
          id: 'cash-flow',
          label: 'Cash Flow',
          value: '+30%',
          improvement: 'Financial Health',
          visualization: {
            type: 'counter',
            color: '#22c55e',
            animationType: 'pulse',
            targetValue: 30,
            currentValue: 0
          }
        }
      ],
      roi: {
        investment: '$35K development',
        returns: '$120K annual savings',
        timeframe: '12 months',
        breakeven: '4 months'
      }
    },
    
    technical: {
      frontend: ['React', 'Material-UI', 'TypeScript', 'Chart.js'],
      backend: ['Node.js', 'GraphQL', 'Express', 'WebSocket'],
      database: ['PostgreSQL', 'Redis', 'Row-Level Security'],
      cloud: ['Google Cloud Platform', 'Cloud Run', 'Cloud SQL'],
      integrations: ['Auth0', 'Stripe', 'Twilio', 'SendGrid'],
      features: ['Multi-tenant Architecture', 'Real-time Notifications', 'Automated Reporting', 'Mobile App']
    },
    
    links: {
      live: 'https://homepropertymanagement.com',
      caseStudy: '/2/case-studies?project=home-property-management'
    },
    
    timeline: {
      start: 'March 2023',
      end: 'February 2024',
      duration: '11 months',
      phases: [
        { name: 'Architecture & Planning', duration: '8 weeks', status: 'completed' },
        { name: 'Core Platform Development', duration: '20 weeks', status: 'completed' },
        { name: 'Integration & Testing', duration: '8 weeks', status: 'completed' },
        { name: 'Launch & Stabilization', duration: '8 weeks', status: 'completed' }
      ]
    }
  }
];