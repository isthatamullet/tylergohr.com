import { Project, TechStack, HierarchicalSkillCategory } from "./types";

// Tech Stack Definitions
export const techStackItems: Record<string, TechStack> = {
  react: {
    name: "React.js",
    category: "frontend",
    color: "#61dafb",
    tooltip: {
      context: "Component-based UI library powering modern web applications with efficient virtual DOM and declarative programming patterns.",
      useCases: ["Invoice Chaser real-time dashboard", "Interactive portfolio components", "Complex form state management"],
      experience: "3+ years building production React applications with advanced patterns like custom hooks, context optimization, and performance tuning.",
      keyFeatures: ["Virtual DOM optimization", "Component reusability", "Modern hooks pattern", "TypeScript integration"],
      relatedTech: ["TypeScript", "Zustand", "Framer Motion"]
    }
  },
  nodejs: {
    name: "Node.js",
    category: "backend",
    color: "#339933",
    tooltip: {
      context: "JavaScript runtime built on Chrome's V8 engine, enabling scalable server-side applications with event-driven, non-blocking I/O model.",
      useCases: ["Invoice Chaser API backend", "Real-time payment processing", "Email automation systems", "Webhook handling"],
      experience: "4+ years developing high-performance APIs, microservices, and automation systems with focus on scalability and security.",
      keyFeatures: ["Event-driven architecture", "NPM ecosystem", "Concurrent request handling", "Cross-platform deployment"],
      relatedTech: ["Express.js", "Socket.IO", "Redis", "PostgreSQL"]
    }
  },
  typescript: {
    name: "TypeScript",
    category: "frontend",
    color: "#3178c6",
    tooltip: {
      context: "Strongly typed superset of JavaScript providing compile-time error detection and enhanced developer experience for large-scale applications.",
      useCases: ["Type-safe React components", "API contract enforcement", "Complex business logic validation", "Team collaboration enhancement"],
      experience: "3+ years leveraging TypeScript for enterprise applications with advanced types, generics, and strict mode configurations.",
      keyFeatures: ["Static type checking", "IntelliSense support", "Refactoring safety", "Interface contracts"],
      relatedTech: ["React.js", "Node.js", "Express.js", "Prisma ORM"]
    }
  },
  postgresql: {
    name: "PostgreSQL",
    category: "database",
    color: "#336791",
    tooltip: {
      context: "Advanced open-source relational database with robust ACID compliance, complex queries, and extensibility for mission-critical applications.",
      useCases: ["Invoice Chaser primary data store", "Customer relationship management", "Financial transaction tracking", "Real-time analytics"],
      experience: "4+ years designing complex schemas, optimizing queries, and managing production databases with high transaction volumes.",
      keyFeatures: ["ACID compliance", "Complex joins", "JSON support", "Advanced indexing"],
      relatedTech: ["Prisma ORM", "Node.js", "Express.js", "Redis"]
    }
  },
  socketio: {
    name: "Socket.IO",
    category: "backend",
    color: "#010101",
    tooltip: {
      context: "Real-time bidirectional event-based communication library enabling live updates between clients and servers with automatic fallback support.",
      useCases: ["Invoice Chaser live payment notifications", "Real-time dashboard updates", "Multi-user collaboration", "Live status tracking"],
      experience: "3+ years implementing real-time features for financial applications with room-based broadcasting and scalable connection management.",
      keyFeatures: ["Real-time communication", "Automatic reconnection", "Room-based broadcasting", "Cross-platform support"],
      relatedTech: ["Node.js", "Express.js", "Redis", "React.js"]
    }
  },
  stripe: {
    name: "Stripe",
    category: "backend",
    color: "#635bff",
    tooltip: {
      context: "Comprehensive payment processing platform providing secure, reliable infrastructure for online transactions with extensive API coverage.",
      useCases: ["Invoice Chaser payment processing", "Subscription billing", "Webhook payment notifications", "Financial reconciliation"],
      experience: "3+ years integrating complex payment flows, handling webhooks, and managing subscription-based billing systems for SaaS applications.",
      keyFeatures: ["Secure payment processing", "Webhook system", "Subscription management", "Global compliance"],
      relatedTech: ["Node.js", "Express.js", "Webhooks", "PostgreSQL"]
    }
  },
  firebase: {
    name: "Firebase",
    category: "cloud",
    color: "#ffca28",
    tooltip: {
      context: "Google's mobile and web application development platform providing authentication, real-time database, and hosting solutions.",
      useCases: ["Invoice Chaser user authentication", "Real-time data synchronization", "Push notifications", "Static hosting"],
      experience: "3+ years implementing Firebase Auth, Firestore, and Cloud Functions for rapid application development and user management.",
      keyFeatures: ["Authentication system", "Real-time database", "Cloud functions", "Analytics"],
      relatedTech: ["Google Cloud", "React.js", "Node.js", "JWT"]
    }
  },
  gcp: {
    name: "Google Cloud",
    category: "cloud",
    color: "#4285f4",
    tooltip: {
      context: "Enterprise-grade cloud computing platform offering scalable infrastructure, containerization, and managed services for modern applications.",
      useCases: ["Invoice Chaser production deployment", "Container orchestration", "Managed databases", "CI/CD pipelines"],
      experience: "2+ years deploying production applications using Cloud Run, Cloud Build, and managed PostgreSQL for scalable, cost-effective solutions.",
      keyFeatures: ["Cloud Run containers", "Managed services", "Auto-scaling", "Global infrastructure"],
      relatedTech: ["Firebase", "PostgreSQL", "Node.js", "Docker"]
    }
  },
  quickbooks: {
    name: "QuickBooks API",
    category: "backend",
    color: "#0077c5",
    tooltip: {
      context: "Comprehensive accounting API enabling seamless integration with QuickBooks for automated financial data synchronization and business process automation.",
      useCases: ["Invoice Chaser invoice synchronization", "Customer data import", "Payment tracking", "Financial reporting automation"],
      experience: "2+ years implementing complex OAuth flows, handling rate limits, and synchronizing financial data for automated accounting workflows.",
      keyFeatures: ["OAuth 2.0 integration", "Invoice management", "Customer sync", "Real-time updates"],
      relatedTech: ["OAuth 2.0", "Node.js", "Express.js", "PostgreSQL"]
    }
  },
  gmail: {
    name: "Gmail API",
    category: "backend",
    color: "#ea4335",
    tooltip: {
      context: "Google's email API providing programmatic access to Gmail for automated email management, sending, and integration with business workflows.",
      useCases: ["Invoice Chaser automated follow-ups", "Payment reminder emails", "Customer communication", "Email template management"],
      experience: "3+ years building email automation systems with template rendering, delivery tracking, and intelligent follow-up sequences.",
      keyFeatures: ["Automated email sending", "Template management", "Delivery tracking", "OAuth integration"],
      relatedTech: ["Google Cloud", "OAuth 2.0", "Node.js", "Email APIs"]
    }
  },
  supabase: {
    name: "Supabase",
    category: "cloud",
    color: "#3ecf8e",
    tooltip: {
      context: "Open-source Firebase alternative providing instant APIs, real-time subscriptions, and authentication with PostgreSQL foundation.",
      useCases: ["Rapid prototyping", "Real-time applications", "User authentication", "Database management"],
      experience: "2+ years using Supabase for rapid application development with real-time features and simplified backend architecture.",
      keyFeatures: ["Instant APIs", "Real-time subscriptions", "Built-in auth", "PostgreSQL backend"],
      relatedTech: ["PostgreSQL", "React.js", "TypeScript", "Firebase"]
    }
  },
  tailwind: {
    name: "Tailwind CSS",
    category: "frontend",
    color: "#06b6d4",
    tooltip: {
      context: "Utility-first CSS framework providing low-level utility classes for rapidly building custom designs without writing custom CSS.",
      useCases: ["Rapid UI prototyping", "Consistent design systems", "Responsive layouts", "Component styling"],
      experience: "3+ years building production interfaces with Tailwind's utility classes and custom design systems for efficient development.",
      keyFeatures: ["Utility-first approach", "Responsive design", "Custom design systems", "Built-in optimization"],
      relatedTech: ["React.js", "TypeScript", "Vite", "CSS Modules"]
    }
  },
  framermotion: {
    name: "Framer Motion",
    category: "frontend",
    color: "#bb4b96",
    tooltip: {
      context: "Production-ready motion library for React providing declarative animations, gestures, and layout animations with excellent performance.",
      useCases: ["Interactive UI animations", "Page transitions", "Gesture handling", "Layout animations"],
      experience: "2+ years creating engaging user experiences with complex animations, micro-interactions, and smooth transitions for modern web applications.",
      keyFeatures: ["Declarative animations", "Gesture support", "Layout animations", "Performance optimized"],
      relatedTech: ["React.js", "TypeScript", "CSS Modules", "Zustand"]
    }
  },
  vite: {
    name: "Vite",
    category: "frontend",
    color: "#646cff",
    tooltip: {
      context: "Next-generation frontend build tool providing instant dev server startup and lightning-fast hot module replacement for modern web development.",
      useCases: ["Modern build tooling", "Development server", "Bundle optimization", "Plugin ecosystem"],
      experience: "2+ years leveraging Vite's fast development experience and optimized builds for React applications with complex dependencies.",
      keyFeatures: ["Instant dev server", "Hot module replacement", "Optimized builds", "Plugin ecosystem"],
      relatedTech: ["React.js", "TypeScript", "Tailwind CSS", "Framer Motion"]
    }
  },
  zustand: {
    name: "Zustand",
    category: "frontend",
    color: "#ff6b35",
    tooltip: {
      context: "Lightweight state management solution for React applications providing simple, scalable patterns without boilerplate complexity.",
      useCases: ["Global state management", "Complex form state", "User preferences", "Application data"],
      experience: "2+ years implementing clean state architecture with Zustand for maintainable React applications and shared component state.",
      keyFeatures: ["Minimal boilerplate", "TypeScript support", "Devtools integration", "Flexible patterns"],
      relatedTech: ["React.js", "TypeScript", "Framer Motion", "Vite"]
    }
  },
  // Missing Invoice Chaser Technologies
  express: {
    name: "Express.js",
    category: "backend",
    color: "#000000",
    tooltip: {
      context: "Fast, unopinionated web framework for Node.js providing robust set of features for web and mobile applications with flexible middleware architecture.",
      useCases: ["Invoice Chaser REST API", "Authentication middleware", "Payment webhook processing", "Real-time dashboard endpoints"],
      experience: "3+ years building production APIs with custom middleware, authentication systems, and complex routing for financial applications.",
      keyFeatures: ["Middleware pipeline", "RESTful routing", "Template engine integration", "Error handling"],
      relatedTech: ["Node.js", "JWT", "PostgreSQL", "Socket.IO"]
    }
  },
  jwt: {
    name: "JWT",
    category: "backend",
    color: "#000000",
    tooltip: {
      context: "JSON Web Token standard for securely transmitting information between parties as compact, URL-safe tokens with cryptographic signatures.",
      useCases: ["Invoice Chaser user authentication", "API authorization", "Stateless sessions", "Secure data transmission"],
      experience: "4+ years implementing JWT-based authentication systems with refresh tokens, role-based access, and secure token management.",
      keyFeatures: ["Stateless authentication", "Cryptographic signatures", "Compact format", "Cross-domain support"],
      relatedTech: ["OAuth 2.0", "Express.js", "Firebase", "Node.js"]
    }
  },
  oauth: {
    name: "OAuth 2.0",
    category: "backend",
    color: "#eb5424",
    tooltip: {
      context: "Industry-standard authorization framework enabling secure third-party access to user resources without exposing credentials.",
      useCases: ["QuickBooks API integration", "Google services access", "Third-party authentication", "Secure API access"],
      experience: "3+ years implementing complex OAuth flows for financial APIs, handling refresh tokens, and managing multi-provider authentication.",
      keyFeatures: ["Secure authorization", "Token-based access", "Refresh mechanisms", "Provider agnostic"],
      relatedTech: ["JWT", "QuickBooks API", "Gmail API", "Express.js"]
    }
  },
  prisma: {
    name: "Prisma ORM",
    category: "database",
    color: "#2d3748",
    tooltip: {
      context: "Next-generation ORM providing type-safe database access, intuitive data modeling, and powerful migration system for modern applications.",
      useCases: ["Invoice Chaser data modeling", "Type-safe queries", "Database migrations", "Relation management"],
      experience: "2+ years building robust data layers with Prisma's schema-first approach and type-safe query builder for PostgreSQL applications.",
      keyFeatures: ["Type safety", "Auto-generated client", "Migration system", "Introspection"],
      relatedTech: ["PostgreSQL", "TypeScript", "Node.js", "Express.js"]
    }
  },
  redis: {
    name: "Redis",
    category: "backend",
    color: "#dc382d",
    tooltip: {
      context: "In-memory data structure store used as database, cache, and message broker providing exceptional performance for real-time applications.",
      useCases: ["Invoice Chaser session caching", "Socket.IO scaling", "Rate limiting", "Real-time data store"],
      experience: "3+ years leveraging Redis for caching strategies, session management, and scaling real-time applications with pub/sub patterns.",
      keyFeatures: ["In-memory storage", "Pub/Sub messaging", "Data structures", "High performance"],
      relatedTech: ["Socket.IO", "Node.js", "PostgreSQL", "Express.js"]
    }
  },
  webhooks: {
    name: "Webhooks",
    category: "backend",
    color: "#6366f1",
    tooltip: {
      context: "HTTP callbacks enabling real-time event notifications between systems, allowing applications to react immediately to external changes.",
      useCases: ["Stripe payment notifications", "QuickBooks data sync", "Real-time integrations", "Event-driven architecture"],
      experience: "3+ years building robust webhook systems with retry logic, signature verification, and event processing for financial integrations.",
      keyFeatures: ["Real-time notifications", "Event-driven", "Signature verification", "Retry mechanisms"],
      relatedTech: ["Stripe", "Express.js", "Queue Systems", "Node.js"]
    }
  },
  emailapis: {
    name: "Email APIs",
    category: "backend",
    color: "#ea4335",
    tooltip: {
      context: "Programmatic email services enabling automated communication, template rendering, and delivery tracking for business applications.",
      useCases: ["Invoice Chaser automated reminders", "Transactional emails", "Marketing campaigns", "Customer notifications"],
      experience: "3+ years building email automation systems with template engines, delivery tracking, and intelligent follow-up sequences.",
      keyFeatures: ["Template rendering", "Delivery tracking", "Automation", "Analytics"],
      relatedTech: ["Gmail API", "Node.js", "Queue Systems", "Webhooks"]
    }
  },
  queuesystems: {
    name: "Queue Systems",
    category: "backend",
    color: "#ff6b35",
    tooltip: {
      context: "Asynchronous message processing systems enabling reliable background job execution, load balancing, and system decoupling.",
      useCases: ["Invoice Chaser background processing", "Email sending", "Data synchronization", "Batch operations"],
      experience: "2+ years implementing queue-based architectures for reliable background processing and system scalability with job retry mechanisms.",
      keyFeatures: ["Asynchronous processing", "Job queuing", "Retry logic", "Load balancing"],
      relatedTech: ["Redis", "Node.js", "Email APIs", "Webhooks"]
    }
  },
};

// Hierarchical Skills Structure for Interactive Display
export const hierarchicalSkillCategories: HierarchicalSkillCategory[] = [
  {
    name: "Frontend Mastery",
    emoji: "🎯",
    description: "Modern client-side technologies and user experience frameworks",
    color: "var(--portfolio-interactive)",
    subcategories: [
      {
        name: "React Ecosystem",
        description: "Component-based architecture with modern React patterns",
        skills: [techStackItems.react, techStackItems.typescript],
        codeExample: {
          id: "react-hook-example",
          title: "Custom React Hook",
          description: "State management with TypeScript",
          language: "typescript",
          code: `const useSkillsAnimation = (trigger: boolean) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (trigger) {
      setIsVisible(true);
    }
  }, [trigger]);
  
  return { isVisible, setIsVisible };
};`,
          highlightLines: [2, 5]
        }
      },
      {
        name: "Modern CSS",
        description: "Cutting-edge styling with animations and responsive design",
        skills: [techStackItems.tailwind],
        codeExample: {
          id: "css-animation-example",
          title: "CSS Grid Subgrid",
          description: "Advanced layout with container queries",
          language: "css",
          code: `.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-template-rows: subgrid;
  container-type: inline-size;
}

@container (min-width: 400px) {
  .skill-card {
    grid-column: span 2;
  }
}`,
          highlightLines: [3, 7]
        }
      },
      {
        name: "State Management",
        description: "Efficient client-side state handling and data flow",
        skills: [techStackItems.zustand]
      },
      {
        name: "Build Tools & Animation",
        description: "Modern development tooling and smooth user interactions",
        skills: [techStackItems.vite, techStackItems.framermotion]
      }
    ]
  },
  {
    name: "Backend Architecture",
    emoji: "⚡",
    description: "Server-side systems, APIs, and microservices architecture",
    color: "var(--portfolio-accent-green)",
    subcategories: [
      {
        name: "Node.js & Express",
        description: "RESTful APIs, middleware, and server architecture",
        skills: [techStackItems.nodejs, techStackItems.express],
        codeExample: {
          id: "express-middleware-example",
          title: "Custom Express Middleware",
          description: "Authentication and error handling",
          language: "typescript",
          code: `const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};`,
          highlightLines: [3, 5, 6]
        }
      },
      {
        name: "Authentication Systems",
        description: "Secure user authentication and authorization protocols",
        skills: [techStackItems.jwt, techStackItems.oauth]
      },
      {
        name: "Real-time Systems",
        description: "WebSocket connections, caching, and live data updates",
        skills: [techStackItems.socketio, techStackItems.redis],
        codeExample: {
          id: "socket-example",
          title: "Real-time Notifications",
          description: "Socket.IO with Redis scaling",
          language: "typescript",
          code: `io.on('connection', (socket) => {
  socket.on('join:company', (companyId) => {
    socket.join(\`company_\${companyId}\`);
  });
  
  socket.on('payment:update', async (data) => {
    // Cache update in Redis
    await redis.setex(\`payment:\${data.id}\`, 3600, JSON.stringify(data));
    
    // Broadcast to company users
    io.to(\`company_\${data.companyId}\`).emit('payment:received', data);
  });
});`,
          highlightLines: [2, 7, 10]
        }
      },
      {
        name: "API Integration",
        description: "Third-party services, webhooks, and automation systems",
        skills: [
          techStackItems.webhooks,
          techStackItems.emailapis,
          techStackItems.queuesystems,
          techStackItems.stripe,
          techStackItems.quickbooks,
          techStackItems.gmail
        ]
      }
    ]
  },
  {
    name: "Database & Storage",
    emoji: "🗄️",
    description: "Data persistence, querying, and storage optimization",
    color: "var(--portfolio-accent-red)",
    subcategories: [
      {
        name: "SQL Databases",
        description: "Relational database design and advanced querying",
        skills: [techStackItems.postgresql],
        codeExample: {
          id: "sql-query-example",
          title: "Advanced PostgreSQL Query",
          description: "Complex joins with performance optimization",
          language: "sql",
          code: `SELECT 
  u.name,
  COUNT(i.id) as invoice_count,
  SUM(i.amount) as total_amount,
  AVG(DATE_PART('day', i.paid_at - i.created_at)) as avg_payment_days
FROM users u
LEFT JOIN invoices i ON u.id = i.user_id
WHERE i.created_at >= NOW() - INTERVAL '90 days'
GROUP BY u.id, u.name
HAVING COUNT(i.id) > 0
ORDER BY total_amount DESC;`,
          highlightLines: [4, 7, 9]
        }
      },
      {
        name: "ORM & Query Builders",
        description: "Type-safe database interactions and schema management",
        skills: [techStackItems.prisma]
      },
      {
        name: "Cloud Storage",
        description: "Distributed storage and real-time database solutions",
        skills: [techStackItems.supabase]
      }
    ]
  },
  {
    name: "Cloud & DevOps",
    emoji: "☁️",
    description: "Cloud infrastructure, deployment, and scalable system operations",
    color: "var(--portfolio-text-secondary)",
    subcategories: [
      {
        name: "Google Cloud Platform",
        description: "Container orchestration and cloud-native deployment",
        skills: [techStackItems.gcp]
      },
      {
        name: "Authentication Services",
        description: "Managed authentication and user identity solutions",
        skills: [techStackItems.firebase]
      },
      {
        name: "Backend-as-a-Service",
        description: "Managed database and API services for rapid development",
        skills: [techStackItems.supabase]
      }
    ]
  }
];

// Featured Project: Invoice Chaser
export const invoiceChaserProject: Project = {
  id: "invoice-chaser",
  title: "Invoice Chaser",
  subtitle: "Automated Payment Collection SaaS",
  description:
    "SaaS application that automates payment collection, reducing payment times by 25-40% through intelligent automation and real-time tracking.",
  longDescription:
    "A comprehensive SaaS solution that transforms how businesses manage accounts receivable. By integrating with QuickBooks and Gmail, Invoice Chaser automates the entire payment collection process while providing real-time insights and performance analytics.",

  category: "saas",
  industry: "fintech",
  status: "completed",
  featured: true,

  techStack: [
    techStackItems.react,
    techStackItems.nodejs,
    techStackItems.typescript,
    techStackItems.postgresql,
    techStackItems.socketio,
    techStackItems.stripe,
    techStackItems.firebase,
    techStackItems.gcp,
    techStackItems.quickbooks,
    techStackItems.gmail,
  ],

  architecture: [
    {
      id: "frontend",
      label: "React Frontend",
      type: "frontend",
      description:
        "Modern React.js application with TypeScript and real-time updates",
      technologies: ["React.js", "TypeScript", "Socket.IO Client"],
      position: { x: 100, y: 100 },
      connections: ["api-gateway", "auth-service"],
    },
    {
      id: "api-gateway",
      label: "API Gateway",
      type: "backend",
      description:
        "Node.js Express server handling all API requests and business logic",
      technologies: ["Node.js", "Express", "JWT"],
      position: { x: 300, y: 100 },
      connections: ["database", "external-apis", "websocket"],
    },
    {
      id: "database",
      label: "PostgreSQL",
      type: "database",
      description:
        "Primary database for customer data, invoices, and payment tracking",
      technologies: ["PostgreSQL", "Prisma ORM"],
      position: { x: 500, y: 100 },
      connections: [],
    },
    {
      id: "external-apis",
      label: "External APIs",
      type: "external",
      description: "QuickBooks, Gmail, and Stripe integrations for automation",
      technologies: ["QuickBooks API", "Gmail API", "Stripe API"],
      position: { x: 300, y: 250 },
      connections: [],
    },
    {
      id: "websocket",
      label: "Real-time Updates",
      type: "backend",
      description:
        "Socket.IO for live payment notifications and status updates",
      technologies: ["Socket.IO", "Redis"],
      position: { x: 100, y: 250 },
      connections: [],
    },
    {
      id: "auth-service",
      label: "Authentication",
      type: "cloud",
      description: "Firebase Authentication with custom JWT integration",
      technologies: ["Firebase Auth", "JWT"],
      position: { x: 500, y: 250 },
      connections: [],
    },
  ],

  challenges: [
    {
      title: "QuickBooks OAuth Integration",
      description:
        "Complex OAuth 2.0 flow with QuickBooks requiring careful token management and refresh handling.",
      solution:
        "Implemented robust token refresh middleware with automatic retry logic and fallback mechanisms.",
      technologies: ["OAuth 2.0", "Node.js", "Express Middleware"],
    },
    {
      title: "Real-time Payment Tracking",
      description:
        "Need for instant updates when payments are received or invoice status changes.",
      solution:
        "Built Socket.IO infrastructure with Redis for scaling real-time connections across multiple server instances.",
      technologies: ["Socket.IO", "Redis", "WebSocket"],
    },
    {
      title: "Email Automation at Scale",
      description:
        "Sending personalized payment reminders without triggering spam filters.",
      solution:
        "Developed intelligent email sequencing with Gmail API integration and delivery optimization.",
      technologies: ["Gmail API", "Queue System", "Email Templates"],
    },
  ],

  codeExamples: [
    {
      id: "quickbooks-oauth",
      title: "QuickBooks OAuth Integration",
      description: "Secure token management with automatic refresh",
      language: "typescript",
      code: `// QuickBooks OAuth token refresh middleware
export const refreshQBToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId } = req.params;
    const tokenData = await getStoredTokens(companyId);
    
    if (isTokenExpired(tokenData.accessToken)) {
      const refreshResponse = await oauthClient.refreshUsingToken(tokenData.refreshToken);
      
      await updateStoredTokens(companyId, {
        accessToken: refreshResponse.access_token,
        refreshToken: refreshResponse.refresh_token,
        expiresAt: new Date(Date.now() + refreshResponse.expires_in * 1000)
      });
      
      req.qbToken = refreshResponse.access_token;
    } else {
      req.qbToken = tokenData.accessToken;
    }
    
    next();
  } catch (error) {
    logger.error('QB token refresh failed:', error);
    res.status(401).json({ error: 'QuickBooks authentication required' });
  }
};`,
      highlightLines: [5, 8, 15],
      explanation:
        "This middleware automatically handles QuickBooks token refresh, ensuring seamless API access without user interruption.",
    },
    {
      id: "socket-notifications",
      title: "Real-time Payment Notifications",
      description: "Socket.IO implementation for instant updates",
      language: "typescript",
      code: `// Real-time payment notification system
export class PaymentNotificationService {
  private io: Server;
  
  constructor(server: http.Server) {
    this.io = new Server(server, {
      cors: { origin: process.env.FRONTEND_URL }
    });
    
    this.setupEventHandlers();
  }
  
  async notifyPaymentReceived(companyId: string, payment: Payment) {
    // Emit to all company users
    this.io.to(\`company_\${companyId}\`).emit('payment:received', {
      id: payment.id,
      amount: payment.amount,
      customerName: payment.customer.name,
      invoiceNumber: payment.invoice.number,
      timestamp: new Date().toISOString()
    });
    
    // Update dashboard metrics in real-time
    const metrics = await this.calculateUpdatedMetrics(companyId);
    this.io.to(\`company_\${companyId}\`).emit('metrics:updated', metrics);
  }
  
  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      socket.on('join:company', (companyId) => {
        socket.join(\`company_\${companyId}\`);
      });
    });
  }
}`,
      highlightLines: [14, 21, 27],
      explanation:
        "Socket.IO enables instant payment notifications and real-time dashboard updates across all connected users.",
    },
  ],

  metrics: [
    {
      label: "Payment Time Reduction",
      value: "25-40",
      unit: "%",
      improvement: "vs manual follow-up",
      color: "var(--portfolio-accent-green)",
    },
    {
      label: "Automation Rate",
      value: "95",
      unit: "%",
      improvement: "of follow-ups automated",
      color: "var(--portfolio-interactive)",
    },
    {
      label: "API Integrations",
      value: 3,
      improvement: "QuickBooks, Gmail, Stripe",
      color: "var(--portfolio-accent-red)",
    },
    {
      label: "Real-time Updates",
      value: "<100",
      unit: "ms",
      improvement: "notification latency",
      color: "var(--portfolio-accent-green)",
    },
  ],

  timeline: {
    started: "2023-01",
    completed: "2023-08",
    duration: "8 months",
  },

  images: [],
  githubUrl: "https://github.com/tylergohr/invoice-chaser",

  deepDive: {
    problemStatement:
      "Small businesses struggle with manual invoice follow-up processes, leading to extended payment cycles and cash flow issues. Traditional methods are time-consuming and inconsistent.",
    solutionOverview:
      "Invoice Chaser automates the entire payment collection workflow by integrating with existing business tools (QuickBooks, Gmail) and providing intelligent automation with real-time tracking.",
    technicalJourney: [
      "Research phase: Analyzed QuickBooks and Gmail APIs for integration possibilities",
      "Architecture design: Created scalable microservices architecture with real-time capabilities",
      "MVP development: Built core features with React frontend and Node.js backend",
      "Integration challenges: Solved OAuth complexities and email delivery optimization",
      "Real-time features: Implemented Socket.IO for instant notifications and updates",
      "Production deployment: Deployed to Google Cloud Run with CI/CD pipeline",
    ],
    keyInnovations: [
      "Intelligent email sequencing that adapts to customer payment behavior",
      "Real-time dashboard updates using Socket.IO and Redis for scalability",
      "Seamless QuickBooks integration with automatic token refresh",
      "Smart payment detection using Stripe webhooks and bank reconciliation",
    ],
    lessonsLearned: [
      "OAuth token management requires robust error handling and user experience consideration",
      "Real-time features significantly improve user engagement and satisfaction",
      "API rate limiting necessitates intelligent queuing and retry mechanisms",
      "Email deliverability requires careful attention to authentication and content",
    ],
    futureEnhancements: [
      "Machine learning for payment prediction and customer segmentation",
      "Multi-currency support for international businesses",
      "Advanced reporting and analytics dashboard",
      "Mobile app for on-the-go payment tracking",
    ],
  },
};

// Home Property Management Project
export const homePropertyProject: Project = {
  id: "home-property-management",
  title: "Home",
  subtitle: "Property Management Platform",
  description:
    "Comprehensive property management solution streamlining tenant applications, rent collection, and maintenance workflows with automated screening and real-time dashboards.",
  longDescription:
    "A full-featured property management platform that revolutionizes how landlords and property managers handle their operations. From automated tenant screening to maintenance coordination, Home provides a complete digital solution for modern property management.",

  category: "saas",
  industry: "proptech",
  status: "completed",
  featured: true,

  techStack: [
    techStackItems.react,
    techStackItems.typescript,
    techStackItems.tailwind,
    techStackItems.framermotion,
    techStackItems.supabase,
    techStackItems.stripe,
    techStackItems.gcp,
    techStackItems.vite,
  ],

  architecture: [
    {
      id: "frontend",
      label: "React Frontend",
      type: "frontend",
      description:
        "Modern React application with TypeScript, Tailwind CSS, and Framer Motion animations",
      technologies: ["React 19", "TypeScript", "Tailwind CSS", "Framer Motion"],
      position: { x: 100, y: 100 },
      connections: ["supabase-backend", "stripe-payments"],
    },
    {
      id: "supabase-backend",
      label: "Supabase Backend",
      type: "backend",
      description:
        "PostgreSQL database with real-time subscriptions, authentication, and row-level security",
      technologies: ["Supabase", "PostgreSQL", "Row Level Security"],
      position: { x: 300, y: 100 },
      connections: ["external-services"],
    },
    {
      id: "stripe-payments",
      label: "Payment Processing",
      type: "backend",
      description:
        "Stripe integration for rent collection and automated payment scheduling",
      technologies: ["Stripe API", "Webhooks", "Recurring Payments"],
      position: { x: 500, y: 100 },
      connections: [],
    },
    {
      id: "external-services",
      label: "Third-party APIs",
      type: "external",
      description:
        "Background checks, credit reports, and property listing syndication",
      technologies: ["Screening APIs", "Credit Check", "MLS Integration"],
      position: { x: 300, y: 250 },
      connections: [],
    },
  ],

  challenges: [
    {
      title: "Multi-tenant Role Management",
      description:
        "Complex permission system supporting landlords, tenants, property managers, and maintenance staff.",
      solution:
        "Implemented row-level security in Supabase with dynamic role-based access control and context-aware UI rendering.",
      technologies: ["Supabase RLS", "TypeScript", "React Context"],
    },
    {
      title: "Real-time Application Tracking",
      description:
        "Instant updates for application status changes across multiple user types.",
      solution:
        "Leveraged Supabase real-time subscriptions with optimistic UI updates and conflict resolution.",
      technologies: ["Supabase Realtime", "React Query", "WebSocket"],
    },
    {
      title: "Automated Screening Workflow",
      description:
        "Orchestrating background checks, credit reports, and income verification seamlessly.",
      solution:
        "Built state machine-driven workflow engine with email notifications and automated decision triggers.",
      technologies: ["State Machines", "Email APIs", "Webhook Processing"],
    },
  ],

  codeExamples: [
    {
      id: "rls-policies",
      title: "Row Level Security Implementation",
      description: "Dynamic tenant access control with Supabase RLS",
      language: "sql",
      code: `-- Row Level Security for tenant applications
CREATE POLICY "Users can view applications for their properties" 
ON applications FOR SELECT 
USING (
  property_id IN (
    SELECT id FROM properties 
    WHERE owner_id = auth.uid() 
    OR manager_id = auth.uid()
  )
  OR applicant_id = auth.uid()
);

-- Dynamic role-based access
CREATE POLICY "Property managers can update applications" 
ON applications FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    JOIN properties p ON p.id = applications.property_id
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('manager', 'owner')
    AND (p.owner_id = auth.uid() OR p.manager_id = auth.uid())
  )
);`,
      highlightLines: [2, 10, 15],
      explanation:
        "Supabase RLS policies ensure users only access data they have permission to see, with dynamic role checking.",
    },
    {
      id: "realtime-updates",
      title: "Real-time Application Updates",
      description: "Live application status updates across user dashboards",
      language: "typescript",
      code: `// Real-time application status updates
export const useApplicationUpdates = (propertyId: string) => {
  const [applications, setApplications] = useState<Application[]>([]);
  
  useEffect(() => {
    const subscription = supabase
      .channel(\`applications_\${propertyId}\`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'applications',
        filter: \`property_id=eq.\${propertyId}\`
      }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          setApplications(prev => 
            prev.map(app => 
              app.id === payload.new.id 
                ? { ...app, ...payload.new }
                : app
            )
          );
          
          // Show toast notification for status changes
          if (payload.old.status !== payload.new.status) {
            toast.success(\`Application \${payload.new.status}\`);
          }
        }
      })
      .subscribe();
      
    return () => subscription.unsubscribe();
  }, [propertyId]);
  
  return applications;
};`,
      highlightLines: [6, 15, 21],
      explanation:
        "Supabase real-time subscriptions provide instant updates with optimistic UI and user notifications.",
    },
  ],

  metrics: [
    {
      label: "Application Processing",
      value: "75",
      unit: "%",
      improvement: "faster than manual review",
      color: "var(--portfolio-accent-green)",
    },
    {
      label: "Tenant Satisfaction",
      value: "4.8",
      unit: "/5",
      improvement: "average rating",
      color: "var(--portfolio-interactive)",
    },
    {
      label: "Payment Collection",
      value: "95",
      unit: "%",
      improvement: "on-time payments",
      color: "var(--portfolio-accent-green)",
    },
    {
      label: "Maintenance Response",
      value: "<24",
      unit: "hrs",
      improvement: "average response time",
      color: "var(--portfolio-accent-red)",
    },
  ],

  timeline: {
    started: "2024-01",
    completed: "2024-09",
    duration: "9 months",
  },

  images: [],
  githubUrl: "https://github.com/tylergohr/home-property-management",

  deepDive: {
    problemStatement:
      "Property managers struggle with manual tenant screening, rent collection, and maintenance coordination, leading to inefficiencies and poor tenant experiences.",
    solutionOverview:
      "Home automates the entire property management lifecycle from tenant acquisition through lease management, with integrated payments and maintenance workflows.",
    technicalJourney: [
      "Requirements analysis: Researched property management pain points and regulatory requirements",
      "Database design: Created multi-tenant schema with proper security and relationship modeling",
      "Authentication system: Implemented role-based access with Supabase RLS for data security",
      "Real-time features: Added live application tracking and maintenance request updates",
      "Payment integration: Built automated rent collection with Stripe recurring payments",
      "Cloud deployment: Deployed to Google Cloud with automated CI/CD pipeline",
    ],
    keyInnovations: [
      "Dynamic role-based access control using Supabase Row Level Security",
      "Real-time application tracking with instant status updates",
      "Automated tenant screening workflow with third-party integrations",
      "Smart maintenance routing based on urgency and technician availability",
    ],
    lessonsLearned: [
      "Multi-tenant applications require careful security architecture from the start",
      "Real-time features significantly improve user engagement and satisfaction",
      "Automated workflows need robust error handling and fallback mechanisms",
      "Property management regulations vary significantly by jurisdiction",
    ],
    futureEnhancements: [
      "AI-powered tenant screening recommendations",
      "IoT integration for smart home monitoring",
      "Advanced analytics and reporting dashboard",
      "Mobile app for tenants and maintenance staff",
    ],
  },
};

// Grow Plant Store Project
export const growPlantProject: Project = {
  id: "grow-plant-store",
  title: "Grow",
  subtitle: "Modern Plant E-commerce Platform",
  description:
    "Beautiful e-commerce platform for plant enthusiasts featuring dynamic product catalogs, intelligent search, and seamless checkout experiences with modern animations.",
  longDescription:
    "A sophisticated e-commerce platform designed specifically for plant lovers, combining beautiful design with powerful functionality. Features real-time inventory, smart search capabilities, and an intuitive shopping experience.",

  category: "ecommerce",
  industry: "retail",
  status: "completed",
  featured: true,

  techStack: [
    techStackItems.react,
    techStackItems.typescript,
    techStackItems.tailwind,
    techStackItems.framermotion,
    techStackItems.supabase,
    techStackItems.stripe,
    techStackItems.zustand,
    techStackItems.vite,
  ],

  architecture: [
    {
      id: "frontend",
      label: "React Frontend",
      type: "frontend",
      description:
        "Modern React application with TypeScript, Tailwind CSS, and smooth animations",
      technologies: ["React 19", "TypeScript", "Tailwind CSS", "Framer Motion"],
      position: { x: 100, y: 100 },
      connections: ["state-management", "backend-services"],
    },
    {
      id: "state-management",
      label: "Zustand Store",
      type: "frontend",
      description:
        "Lightweight state management for cart, wishlist, and user preferences",
      technologies: ["Zustand", "LocalStorage", "Optimistic Updates"],
      position: { x: 300, y: 100 },
      connections: ["backend-services"],
    },
    {
      id: "backend-services",
      label: "Supabase Backend",
      type: "backend",
      description:
        "PostgreSQL database with authentication, real-time updates, and image storage",
      technologies: ["Supabase", "PostgreSQL", "Storage Buckets"],
      position: { x: 500, y: 100 },
      connections: ["external-apis"],
    },
    {
      id: "external-apis",
      label: "External Services",
      type: "external",
      description:
        "Pixabay API for plant images and Stripe for payment processing",
      technologies: ["Pixabay API", "Stripe Checkout", "Image CDN"],
      position: { x: 300, y: 250 },
      connections: [],
    },
  ],

  challenges: [
    {
      title: "Dynamic Product Catalog",
      description:
        "Creating flexible product categories and filtering system for diverse plant inventory.",
      solution:
        "Implemented dynamic taxonomy system with faceted search and intelligent categorization.",
      technologies: ["PostgreSQL", "Full-text Search", "React Query"],
    },
    {
      title: "Image Performance Optimization",
      description:
        "Handling high-quality plant images without compromising page load times.",
      solution:
        "Built progressive image loading with WebP format conversion and CDN optimization.",
      technologies: ["Image CDN", "WebP", "Lazy Loading"],
    },
    {
      title: "Shopping Cart Persistence",
      description:
        "Maintaining cart state across sessions and devices for better user experience.",
      solution:
        "Implemented hybrid local/cloud storage with automatic sync and conflict resolution.",
      technologies: ["Zustand", "Supabase", "LocalStorage"],
    },
  ],

  codeExamples: [
    {
      id: "product-search",
      title: "Intelligent Plant Search",
      description:
        "Full-text search with category filtering and relevance scoring",
      language: "typescript",
      code: `// Advanced plant search with Supabase full-text search
export const useProductSearch = () => {
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchProducts = useCallback(async (
    query: string, 
    filters: SearchFilters
  ) => {
    setIsLoading(true);
    
    let searchQuery = supabase
      .from('products')
      .select('*, categories(*), inventory(*)')
      .eq('status', 'active')
      .order('popularity_score', { ascending: false });
    
    // Full-text search on multiple fields
    if (query) {
      searchQuery = searchQuery.or(\`
        name.ilike.%\${query}%,
        description.ilike.%\${query}%,
        care_instructions.ilike.%\${query}%,
        categories.name.ilike.%\${query}%
      \`);
    }
    
    // Apply dynamic filters
    if (filters.category) {
      searchQuery = searchQuery.eq('category_id', filters.category);
    }
    
    if (filters.priceRange) {
      searchQuery = searchQuery
        .gte('price', filters.priceRange.min)
        .lte('price', filters.priceRange.max);
    }
    
    const { data, error } = await searchQuery;
    
    if (!error && data) {
      setSearchResults(data);
    }
    
    setIsLoading(false);
  }, []);
  
  return { searchProducts, searchResults, isLoading };
};`,
      highlightLines: [11, 18, 25],
      explanation:
        "Combines full-text search with dynamic filtering for intelligent product discovery.",
    },
    {
      id: "cart-management",
      title: "Persistent Shopping Cart",
      description: "Zustand store with cloud sync and offline support",
      language: "typescript",
      code: `// Shopping cart store with persistence and sync
interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  syncWithCloud: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity) => {
        const items = get().items;
        const existingItem = items.find(item => item.productId === product.id);
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          set({
            items: [...items, {
              productId: product.id,
              product,
              quantity,
              addedAt: new Date()
            }]
          });
        }
        
        // Optimistically sync to cloud
        get().syncWithCloud();
      },
      
      syncWithCloud: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const items = get().items;
        await supabase
          .from('user_carts')
          .upsert({
            user_id: user.id,
            cart_data: items,
            updated_at: new Date()
          });
      }
    }),
    {
      name: 'grow-cart-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);`,
      highlightLines: [9, 28, 35],
      explanation:
        "Zustand store provides seamless cart persistence with automatic cloud synchronization.",
    },
  ],

  metrics: [
    {
      label: "Conversion Rate",
      value: "3.2",
      unit: "%",
      improvement: "above industry average",
      color: "var(--portfolio-accent-green)",
    },
    {
      label: "Page Load Speed",
      value: "<2",
      unit: "s",
      improvement: "average load time",
      color: "var(--portfolio-interactive)",
    },
    {
      label: "Cart Abandonment",
      value: "12",
      unit: "%",
      improvement: "below industry average",
      color: "var(--portfolio-accent-green)",
    },
    {
      label: "Customer Satisfaction",
      value: "4.6",
      unit: "/5",
      improvement: "average rating",
      color: "var(--portfolio-accent-red)",
    },
  ],

  timeline: {
    started: "2024-03",
    completed: "2024-07",
    duration: "5 months",
  },

  images: [],
  githubUrl: "https://github.com/tylergohr/grow-plant-store",

  deepDive: {
    problemStatement:
      "Plant enthusiasts struggle to find quality plants online due to poor product presentation, limited care information, and unreliable shopping experiences.",
    solutionOverview:
      "Grow provides a beautiful, intuitive platform specifically designed for plant lovers, with detailed care guides, high-quality imagery, and seamless purchasing.",
    technicalJourney: [
      "Market research: Analyzed existing plant e-commerce platforms and identified UX gaps",
      "Design system: Created plant-focused design language with natural colors and smooth animations",
      "Product catalog: Built flexible taxonomy system for diverse plant categories and attributes",
      "Search optimization: Implemented intelligent search with plant-specific filters and suggestions",
      "Payment integration: Added Stripe checkout with inventory management and order tracking",
      "Performance optimization: Optimized images and implemented progressive loading",
    ],
    keyInnovations: [
      "Plant-specific search with care requirements and growing conditions",
      "Visual plant care calendar with automated reminders",
      "Community-driven plant care tips and reviews",
      "Smart wishlist with availability notifications",
    ],
    lessonsLearned: [
      "E-commerce UX requires careful attention to product discovery and trust signals",
      "Image optimization is critical for product-heavy applications",
      "State management complexity grows quickly with cart and user features",
      "Plant community engagement drives retention and sales",
    ],
    futureEnhancements: [
      "AR plant placement visualization for home decoration",
      "Plant health tracking with photo recognition",
      "Subscription service for plant care supplies",
      "Social features for plant care community",
    ],
  },
};

// All projects array (expandable for future projects)
export const projects: Project[] = [
  invoiceChaserProject,
  homePropertyProject,
  growPlantProject,
];
