import { Project, TechStack } from './types'

// Tech Stack Definitions
export const techStackItems: Record<string, TechStack> = {
  react: {
    name: 'React.js',
    category: 'frontend',
    color: '#61dafb',
  },
  nodejs: {
    name: 'Node.js',
    category: 'backend',
    color: '#339933',
  },
  typescript: {
    name: 'TypeScript',
    category: 'frontend',
    color: '#3178c6',
  },
  postgresql: {
    name: 'PostgreSQL',
    category: 'database',
    color: '#336791',
  },
  socketio: {
    name: 'Socket.IO',
    category: 'backend',
    color: '#010101',
  },
  stripe: {
    name: 'Stripe',
    category: 'backend',
    color: '#635bff',
  },
  firebase: {
    name: 'Firebase',
    category: 'cloud',
    color: '#ffca28',
  },
  gcp: {
    name: 'Google Cloud',
    category: 'cloud',
    color: '#4285f4',
  },
  quickbooks: {
    name: 'QuickBooks API',
    category: 'backend',
    color: '#0077c5',
  },
  gmail: {
    name: 'Gmail API',
    category: 'backend',
    color: '#ea4335',
  },
}

// Featured Project: Invoice Chaser
export const invoiceChaserProject: Project = {
  id: 'invoice-chaser',
  title: 'Invoice Chaser',
  subtitle: 'Automated Payment Collection SaaS',
  description: 'SaaS application that automates payment collection, reducing payment times by 25-40% through intelligent automation and real-time tracking.',
  longDescription: 'A comprehensive SaaS solution that transforms how businesses manage accounts receivable. By integrating with QuickBooks and Gmail, Invoice Chaser automates the entire payment collection process while providing real-time insights and performance analytics.',
  
  category: 'saas',
  industry: 'fintech',
  status: 'completed',
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
      id: 'frontend',
      label: 'React Frontend',
      type: 'frontend',
      description: 'Modern React.js application with TypeScript and real-time updates',
      technologies: ['React.js', 'TypeScript', 'Socket.IO Client'],
      position: { x: 100, y: 100 },
      connections: ['api-gateway', 'auth-service']
    },
    {
      id: 'api-gateway',
      label: 'API Gateway',
      type: 'backend',
      description: 'Node.js Express server handling all API requests and business logic',
      technologies: ['Node.js', 'Express', 'JWT'],
      position: { x: 300, y: 100 },
      connections: ['database', 'external-apis', 'websocket']
    },
    {
      id: 'database',
      label: 'PostgreSQL',
      type: 'database',
      description: 'Primary database for customer data, invoices, and payment tracking',
      technologies: ['PostgreSQL', 'Prisma ORM'],
      position: { x: 500, y: 100 },
      connections: []
    },
    {
      id: 'external-apis',
      label: 'External APIs',
      type: 'external',
      description: 'QuickBooks, Gmail, and Stripe integrations for automation',
      technologies: ['QuickBooks API', 'Gmail API', 'Stripe API'],
      position: { x: 300, y: 250 },
      connections: []
    },
    {
      id: 'websocket',
      label: 'Real-time Updates',
      type: 'backend',
      description: 'Socket.IO for live payment notifications and status updates',
      technologies: ['Socket.IO', 'Redis'],
      position: { x: 100, y: 250 },
      connections: []
    },
    {
      id: 'auth-service',
      label: 'Authentication',
      type: 'cloud',
      description: 'Firebase Authentication with custom JWT integration',
      technologies: ['Firebase Auth', 'JWT'],
      position: { x: 500, y: 250 },
      connections: []
    }
  ],
  
  challenges: [
    {
      title: 'QuickBooks OAuth Integration',
      description: 'Complex OAuth 2.0 flow with QuickBooks requiring careful token management and refresh handling.',
      solution: 'Implemented robust token refresh middleware with automatic retry logic and fallback mechanisms.',
      technologies: ['OAuth 2.0', 'Node.js', 'Express Middleware']
    },
    {
      title: 'Real-time Payment Tracking',
      description: 'Need for instant updates when payments are received or invoice status changes.',
      solution: 'Built Socket.IO infrastructure with Redis for scaling real-time connections across multiple server instances.',
      technologies: ['Socket.IO', 'Redis', 'WebSocket']
    },
    {
      title: 'Email Automation at Scale',
      description: 'Sending personalized payment reminders without triggering spam filters.',
      solution: 'Developed intelligent email sequencing with Gmail API integration and delivery optimization.',
      technologies: ['Gmail API', 'Queue System', 'Email Templates']
    }
  ],
  
  codeExamples: [
    {
      id: 'quickbooks-oauth',
      title: 'QuickBooks OAuth Integration',
      description: 'Secure token management with automatic refresh',
      language: 'typescript',
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
      explanation: 'This middleware automatically handles QuickBooks token refresh, ensuring seamless API access without user interruption.'
    },
    {
      id: 'socket-notifications',
      title: 'Real-time Payment Notifications',
      description: 'Socket.IO implementation for instant updates',
      language: 'typescript',
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
      explanation: 'Socket.IO enables instant payment notifications and real-time dashboard updates across all connected users.'
    }
  ],
  
  metrics: [
    {
      label: 'Payment Time Reduction',
      value: '25-40',
      unit: '%',
      improvement: 'vs manual follow-up',
      color: 'var(--portfolio-accent-green)'
    },
    {
      label: 'Automation Rate',
      value: '95',
      unit: '%',
      improvement: 'of follow-ups automated',
      color: 'var(--portfolio-interactive)'
    },
    {
      label: 'API Integrations',
      value: 3,
      improvement: 'QuickBooks, Gmail, Stripe',
      color: 'var(--portfolio-accent-red)'
    },
    {
      label: 'Real-time Updates',
      value: '<100',
      unit: 'ms',
      improvement: 'notification latency',
      color: 'var(--portfolio-accent-green)'
    }
  ],
  
  timeline: {
    started: '2023-01',
    completed: '2023-08',
    duration: '8 months'
  },
  
  images: [],
  githubUrl: 'https://github.com/tylergohr/invoice-chaser',
  
  deepDive: {
    problemStatement: 'Small businesses struggle with manual invoice follow-up processes, leading to extended payment cycles and cash flow issues. Traditional methods are time-consuming and inconsistent.',
    solutionOverview: 'Invoice Chaser automates the entire payment collection workflow by integrating with existing business tools (QuickBooks, Gmail) and providing intelligent automation with real-time tracking.',
    technicalJourney: [
      'Research phase: Analyzed QuickBooks and Gmail APIs for integration possibilities',
      'Architecture design: Created scalable microservices architecture with real-time capabilities',
      'MVP development: Built core features with React frontend and Node.js backend',
      'Integration challenges: Solved OAuth complexities and email delivery optimization',
      'Real-time features: Implemented Socket.IO for instant notifications and updates',
      'Production deployment: Deployed to Google Cloud Run with CI/CD pipeline'
    ],
    keyInnovations: [
      'Intelligent email sequencing that adapts to customer payment behavior',
      'Real-time dashboard updates using Socket.IO and Redis for scalability',
      'Seamless QuickBooks integration with automatic token refresh',
      'Smart payment detection using Stripe webhooks and bank reconciliation'
    ],
    lessonsLearned: [
      'OAuth token management requires robust error handling and user experience consideration',
      'Real-time features significantly improve user engagement and satisfaction',
      'API rate limiting necessitates intelligent queuing and retry mechanisms',
      'Email deliverability requires careful attention to authentication and content'
    ],
    futureEnhancements: [
      'Machine learning for payment prediction and customer segmentation',
      'Multi-currency support for international businesses',
      'Advanced reporting and analytics dashboard',
      'Mobile app for on-the-go payment tracking'
    ]
  }
}

// All projects array (expandable for future projects)
export const projects: Project[] = [
  invoiceChaserProject,
  // Future projects will be added here
]