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
  supabase: {
    name: 'Supabase',
    category: 'cloud',
    color: '#3ecf8e',
  },
  tailwind: {
    name: 'Tailwind CSS',
    category: 'frontend',
    color: '#06b6d4',
  },
  framermotion: {
    name: 'Framer Motion',
    category: 'frontend',
    color: '#bb4b96',
  },
  vite: {
    name: 'Vite',
    category: 'frontend',
    color: '#646cff',
  },
  zustand: {
    name: 'Zustand',
    category: 'frontend',
    color: '#ff6b35',
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

// Home Property Management Project
export const homePropertyProject: Project = {
  id: 'home-property-management',
  title: 'Home',
  subtitle: 'Property Management Platform',
  description: 'Comprehensive property management solution streamlining tenant applications, rent collection, and maintenance workflows with automated screening and real-time dashboards.',
  longDescription: 'A full-featured property management platform that revolutionizes how landlords and property managers handle their operations. From automated tenant screening to maintenance coordination, Home provides a complete digital solution for modern property management.',
  
  category: 'saas',
  industry: 'proptech',
  status: 'completed',
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
      id: 'frontend',
      label: 'React Frontend',
      type: 'frontend',
      description: 'Modern React application with TypeScript, Tailwind CSS, and Framer Motion animations',
      technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      position: { x: 100, y: 100 },
      connections: ['supabase-backend', 'stripe-payments']
    },
    {
      id: 'supabase-backend',
      label: 'Supabase Backend',
      type: 'backend',
      description: 'PostgreSQL database with real-time subscriptions, authentication, and row-level security',
      technologies: ['Supabase', 'PostgreSQL', 'Row Level Security'],
      position: { x: 300, y: 100 },
      connections: ['external-services']
    },
    {
      id: 'stripe-payments',
      label: 'Payment Processing',
      type: 'backend',
      description: 'Stripe integration for rent collection and automated payment scheduling',
      technologies: ['Stripe API', 'Webhooks', 'Recurring Payments'],
      position: { x: 500, y: 100 },
      connections: []
    },
    {
      id: 'external-services',
      label: 'Third-party APIs',
      type: 'external',
      description: 'Background checks, credit reports, and property listing syndication',
      technologies: ['Screening APIs', 'Credit Check', 'MLS Integration'],
      position: { x: 300, y: 250 },
      connections: []
    }
  ],
  
  challenges: [
    {
      title: 'Multi-tenant Role Management',
      description: 'Complex permission system supporting landlords, tenants, property managers, and maintenance staff.',
      solution: 'Implemented row-level security in Supabase with dynamic role-based access control and context-aware UI rendering.',
      technologies: ['Supabase RLS', 'TypeScript', 'React Context']
    },
    {
      title: 'Real-time Application Tracking',
      description: 'Instant updates for application status changes across multiple user types.',
      solution: 'Leveraged Supabase real-time subscriptions with optimistic UI updates and conflict resolution.',
      technologies: ['Supabase Realtime', 'React Query', 'WebSocket']
    },
    {
      title: 'Automated Screening Workflow',
      description: 'Orchestrating background checks, credit reports, and income verification seamlessly.',
      solution: 'Built state machine-driven workflow engine with email notifications and automated decision triggers.',
      technologies: ['State Machines', 'Email APIs', 'Webhook Processing']
    }
  ],
  
  codeExamples: [
    {
      id: 'rls-policies',
      title: 'Row Level Security Implementation',
      description: 'Dynamic tenant access control with Supabase RLS',
      language: 'sql',
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
      explanation: 'Supabase RLS policies ensure users only access data they have permission to see, with dynamic role checking.'
    },
    {
      id: 'realtime-updates',
      title: 'Real-time Application Updates',
      description: 'Live application status updates across user dashboards',
      language: 'typescript',
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
      explanation: 'Supabase real-time subscriptions provide instant updates with optimistic UI and user notifications.'
    }
  ],
  
  metrics: [
    {
      label: 'Application Processing',
      value: '75',
      unit: '%',
      improvement: 'faster than manual review',
      color: 'var(--portfolio-accent-green)'
    },
    {
      label: 'Tenant Satisfaction',
      value: '4.8',
      unit: '/5',
      improvement: 'average rating',
      color: 'var(--portfolio-interactive)'
    },
    {
      label: 'Payment Collection',
      value: '95',
      unit: '%',
      improvement: 'on-time payments',
      color: 'var(--portfolio-accent-green)'
    },
    {
      label: 'Maintenance Response',
      value: '<24',
      unit: 'hrs',
      improvement: 'average response time',
      color: 'var(--portfolio-accent-red)'
    }
  ],
  
  timeline: {
    started: '2024-01',
    completed: '2024-09',
    duration: '9 months'
  },
  
  images: [],
  githubUrl: 'https://github.com/tylergohr/home-property-management',
  
  deepDive: {
    problemStatement: 'Property managers struggle with manual tenant screening, rent collection, and maintenance coordination, leading to inefficiencies and poor tenant experiences.',
    solutionOverview: 'Home automates the entire property management lifecycle from tenant acquisition through lease management, with integrated payments and maintenance workflows.',
    technicalJourney: [
      'Requirements analysis: Researched property management pain points and regulatory requirements',
      'Database design: Created multi-tenant schema with proper security and relationship modeling',
      'Authentication system: Implemented role-based access with Supabase RLS for data security',
      'Real-time features: Added live application tracking and maintenance request updates',
      'Payment integration: Built automated rent collection with Stripe recurring payments',
      'Cloud deployment: Deployed to Google Cloud with automated CI/CD pipeline'
    ],
    keyInnovations: [
      'Dynamic role-based access control using Supabase Row Level Security',
      'Real-time application tracking with instant status updates',
      'Automated tenant screening workflow with third-party integrations',
      'Smart maintenance routing based on urgency and technician availability'
    ],
    lessonsLearned: [
      'Multi-tenant applications require careful security architecture from the start',
      'Real-time features significantly improve user engagement and satisfaction',
      'Automated workflows need robust error handling and fallback mechanisms',
      'Property management regulations vary significantly by jurisdiction'
    ],
    futureEnhancements: [
      'AI-powered tenant screening recommendations',
      'IoT integration for smart home monitoring',
      'Advanced analytics and reporting dashboard',
      'Mobile app for tenants and maintenance staff'
    ]
  }
}

// Grow Plant Store Project
export const growPlantProject: Project = {
  id: 'grow-plant-store',
  title: 'Grow',
  subtitle: 'Modern Plant E-commerce Platform',
  description: 'Beautiful e-commerce platform for plant enthusiasts featuring dynamic product catalogs, intelligent search, and seamless checkout experiences with modern animations.',
  longDescription: 'A sophisticated e-commerce platform designed specifically for plant lovers, combining beautiful design with powerful functionality. Features real-time inventory, smart search capabilities, and an intuitive shopping experience.',
  
  category: 'ecommerce',
  industry: 'retail',
  status: 'completed',
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
      id: 'frontend',
      label: 'React Frontend',
      type: 'frontend',
      description: 'Modern React application with TypeScript, Tailwind CSS, and smooth animations',
      technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      position: { x: 100, y: 100 },
      connections: ['state-management', 'backend-services']
    },
    {
      id: 'state-management',
      label: 'Zustand Store',
      type: 'frontend',
      description: 'Lightweight state management for cart, wishlist, and user preferences',
      technologies: ['Zustand', 'LocalStorage', 'Optimistic Updates'],
      position: { x: 300, y: 100 },
      connections: ['backend-services']
    },
    {
      id: 'backend-services',
      label: 'Supabase Backend',
      type: 'backend',
      description: 'PostgreSQL database with authentication, real-time updates, and image storage',
      technologies: ['Supabase', 'PostgreSQL', 'Storage Buckets'],
      position: { x: 500, y: 100 },
      connections: ['external-apis']
    },
    {
      id: 'external-apis',
      label: 'External Services',
      type: 'external',
      description: 'Pixabay API for plant images and Stripe for payment processing',
      technologies: ['Pixabay API', 'Stripe Checkout', 'Image CDN'],
      position: { x: 300, y: 250 },
      connections: []
    }
  ],
  
  challenges: [
    {
      title: 'Dynamic Product Catalog',
      description: 'Creating flexible product categories and filtering system for diverse plant inventory.',
      solution: 'Implemented dynamic taxonomy system with faceted search and intelligent categorization.',
      technologies: ['PostgreSQL', 'Full-text Search', 'React Query']
    },
    {
      title: 'Image Performance Optimization',
      description: 'Handling high-quality plant images without compromising page load times.',
      solution: 'Built progressive image loading with WebP format conversion and CDN optimization.',
      technologies: ['Image CDN', 'WebP', 'Lazy Loading']
    },
    {
      title: 'Shopping Cart Persistence',
      description: 'Maintaining cart state across sessions and devices for better user experience.',
      solution: 'Implemented hybrid local/cloud storage with automatic sync and conflict resolution.',
      technologies: ['Zustand', 'Supabase', 'LocalStorage']
    }
  ],
  
  codeExamples: [
    {
      id: 'product-search',
      title: 'Intelligent Plant Search',
      description: 'Full-text search with category filtering and relevance scoring',
      language: 'typescript',
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
      explanation: 'Combines full-text search with dynamic filtering for intelligent product discovery.'
    },
    {
      id: 'cart-management',
      title: 'Persistent Shopping Cart',
      description: 'Zustand store with cloud sync and offline support',
      language: 'typescript',
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
      explanation: 'Zustand store provides seamless cart persistence with automatic cloud synchronization.'
    }
  ],
  
  metrics: [
    {
      label: 'Conversion Rate',
      value: '3.2',
      unit: '%',
      improvement: 'above industry average',
      color: 'var(--portfolio-accent-green)'
    },
    {
      label: 'Page Load Speed',
      value: '<2',
      unit: 's',
      improvement: 'average load time',
      color: 'var(--portfolio-interactive)'
    },
    {
      label: 'Cart Abandonment',
      value: '12',
      unit: '%',
      improvement: 'below industry average',
      color: 'var(--portfolio-accent-green)'
    },
    {
      label: 'Customer Satisfaction',
      value: '4.6',
      unit: '/5',
      improvement: 'average rating',
      color: 'var(--portfolio-accent-red)'
    }
  ],
  
  timeline: {
    started: '2024-03',
    completed: '2024-07',
    duration: '5 months'
  },
  
  images: [],
  githubUrl: 'https://github.com/tylergohr/grow-plant-store',
  
  deepDive: {
    problemStatement: 'Plant enthusiasts struggle to find quality plants online due to poor product presentation, limited care information, and unreliable shopping experiences.',
    solutionOverview: 'Grow provides a beautiful, intuitive platform specifically designed for plant lovers, with detailed care guides, high-quality imagery, and seamless purchasing.',
    technicalJourney: [
      'Market research: Analyzed existing plant e-commerce platforms and identified UX gaps',
      'Design system: Created plant-focused design language with natural colors and smooth animations',
      'Product catalog: Built flexible taxonomy system for diverse plant categories and attributes',
      'Search optimization: Implemented intelligent search with plant-specific filters and suggestions',
      'Payment integration: Added Stripe checkout with inventory management and order tracking',
      'Performance optimization: Optimized images and implemented progressive loading'
    ],
    keyInnovations: [
      'Plant-specific search with care requirements and growing conditions',
      'Visual plant care calendar with automated reminders',
      'Community-driven plant care tips and reviews',
      'Smart wishlist with availability notifications'
    ],
    lessonsLearned: [
      'E-commerce UX requires careful attention to product discovery and trust signals',
      'Image optimization is critical for product-heavy applications',
      'State management complexity grows quickly with cart and user features',
      'Plant community engagement drives retention and sales'
    ],
    futureEnhancements: [
      'AR plant placement visualization for home decoration',
      'Plant health tracking with photo recognition',
      'Subscription service for plant care supplies',
      'Social features for plant care community'
    ]
  }
}

// All projects array (expandable for future projects)
export const projects: Project[] = [
  invoiceChaserProject,
  homePropertyProject,
  growPlantProject,
]