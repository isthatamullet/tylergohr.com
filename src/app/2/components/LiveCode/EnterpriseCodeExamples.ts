import { EnterpriseCodeExample, CodeDemonstration } from './types';

// React Component Development Examples
export const reactComponentExamples: EnterpriseCodeExample[] = [
  {
    title: "Enterprise Dashboard Component",
    description: "Real-time business metrics dashboard with interactive charts and KPI monitoring",
    businessScenario: "Enterprise client needs a real-time dashboard to monitor business performance metrics, track KPIs, and visualize data trends for executive decision-making.",
    initialCode: `function BusinessDashboard({ metrics, onMetricClick }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculateGrowth = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <div className="enterprise-dashboard">
      <header className="dashboard-header">
        <h1>Executive Dashboard</h1>
        <select 
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </header>

      <div className="metrics-grid">
        <MetricCard 
          title="Total Revenue" 
          value={formatCurrency(metrics.revenue)}
          growth={calculateGrowth(metrics.revenue, metrics.previousRevenue)}
          trend="up"
          onClick={() => onMetricClick('revenue')}
        />
        
        <MetricCard 
          title="Active Users" 
          value={metrics.activeUsers.toLocaleString()}
          growth={calculateGrowth(metrics.activeUsers, metrics.previousActiveUsers)}
          trend={metrics.activeUsers > metrics.previousActiveUsers ? 'up' : 'down'}
          onClick={() => onMetricClick('users')}
        />
        
        <MetricCard 
          title="Conversion Rate" 
          value={\`\${metrics.conversionRate}%\`}
          growth={calculateGrowth(metrics.conversionRate, metrics.previousConversionRate)}
          trend={metrics.conversionRate > metrics.previousConversionRate ? 'up' : 'down'}
          onClick={() => onMetricClick('conversion')}
        />
        
        <MetricCard 
          title="Customer Satisfaction" 
          value={\`\${metrics.satisfaction}/10\`}
          growth={calculateGrowth(metrics.satisfaction, metrics.previousSatisfaction)}
          trend={metrics.satisfaction >= 8 ? 'up' : 'down'}
          onClick={() => onMetricClick('satisfaction')}
        />
      </div>

      <div className="chart-section">
        <ChartVisualization 
          data={metrics.salesData}
          timeframe={selectedTimeframe}
          type="revenue-trend"
        />
      </div>
    </div>
  );
}`,
    category: 'react',
    techStack: ['React', 'TypeScript', 'CSS Modules', 'Chart.js'],
    visualizationType: 'component',
    businessValue: "Demonstrates React expertise for enterprise UI development with real-time data visualization, responsive design, and performance optimization for executive dashboards.",
    keyFeatures: [
      "Real-time metrics monitoring",
      "Interactive data visualization", 
      "Responsive enterprise design",
      "Performance-optimized rendering",
      "Accessibility compliance (WCAG 2.1 AA)"
    ]
  },
  {
    title: "Advanced Form Validation System",
    description: "Enterprise-grade form handling with real-time validation, error recovery, and accessibility features",
    businessScenario: "Enterprise application requires complex form validation for customer onboarding with multi-step validation, real-time feedback, and comprehensive error handling.",
    initialCode: `function EnterpriseFormValidator({ initialData, onSubmit, validationRules }) {
  const [formData, setFormData] = useState(initialData || {});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((fieldName, value) => {
    const rules = validationRules[fieldName];
    if (!rules) return null;

    for (const rule of rules) {
      const result = rule.validator(value, formData);
      if (!result.isValid) {
        return {
          type: rule.type,
          message: rule.message || result.message,
          severity: rule.severity || 'error'
        };
      }
    }
    return null;
  }, [validationRules, formData]);

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Real-time validation for better UX
    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    }
  };

  const handleFieldBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, formData[fieldName]);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const validateAllFields = () => {
    const newErrors = {};
    let hasErrors = false;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {}));

    return !hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (validateAllFields()) {
        await onSubmit(formData);
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        _form: {
          type: 'submission',
          message: error.message || 'Submission failed. Please try again.',
          severity: 'error'
        }
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="enterprise-form">
      {Object.entries(formData).map(([fieldName, value]) => (
        <FormField
          key={fieldName}
          name={fieldName}
          value={value}
          error={errors[fieldName]}
          touched={touched[fieldName]}
          onChange={(value) => handleFieldChange(fieldName, value)}
          onBlur={() => handleFieldBlur(fieldName)}
          disabled={isSubmitting}
        />
      ))}
      
      {errors._form && (
        <FormError error={errors._form} />
      )}
      
      <button 
        type="submit" 
        disabled={isSubmitting || Object.values(errors).some(Boolean)}
        className="submit-button"
      >
        {isSubmitting ? 'Processing...' : 'Submit'}
      </button>
    </form>
  );
}`,
    category: 'react',
    techStack: ['React', 'TypeScript', 'React Hook Form', 'Yup Validation'],
    visualizationType: 'component',
    businessValue: "Demonstrates advanced form handling expertise for enterprise applications with real-time validation, error recovery, and accessibility compliance.",
    keyFeatures: [
      "Real-time field validation",
      "Advanced error handling",
      "Accessibility compliance",
      "Performance optimization",
      "Enterprise security patterns"
    ]
  }
];

// Database Query Optimization Examples
export const databaseOptimizationExamples: EnterpriseCodeExample[] = [
  {
    title: "Performance-Optimized Database Queries",
    description: "Enterprise data retrieval with indexing, query optimization, and performance monitoring",
    businessScenario: "Large e-commerce platform needs optimized database queries to handle millions of transactions while maintaining sub-100ms response times for customer-facing operations.",
    initialCode: `-- Optimized customer analytics query with proper indexing
-- Retrieves top customers by revenue with performance metrics

WITH customer_metrics AS (
  SELECT 
    c.id,
    c.company_name,
    c.created_at,
    c.subscription_tier,
    COUNT(DISTINCT o.id) as total_orders,
    COALESCE(SUM(o.total_amount), 0) as total_revenue,
    AVG(o.total_amount) as avg_order_value,
    MAX(o.created_at) as last_order_date,
    EXTRACT(DAYS FROM NOW() - MAX(o.created_at)) as days_since_last_order
  FROM customers c
  LEFT JOIN orders o ON c.id = o.customer_id 
    AND o.status = 'completed'
    AND o.created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
  WHERE c.status = 'active'
    AND c.created_at >= DATE_SUB(NOW(), INTERVAL 24 MONTH)
  GROUP BY c.id, c.company_name, c.created_at, c.subscription_tier
),
revenue_ranking AS (
  SELECT 
    *,
    ROW_NUMBER() OVER (ORDER BY total_revenue DESC) as revenue_rank,
    NTILE(5) OVER (ORDER BY total_revenue DESC) as revenue_quintile,
    CASE 
      WHEN days_since_last_order <= 30 THEN 'Active'
      WHEN days_since_last_order <= 90 THEN 'At Risk'
      ELSE 'Churned'
    END as customer_status
  FROM customer_metrics
  WHERE total_orders > 0
)
SELECT 
  company_name,
  subscription_tier,
  total_orders,
  ROUND(total_revenue, 2) as total_revenue,
  ROUND(avg_order_value, 2) as avg_order_value,
  last_order_date,
  customer_status,
  revenue_rank,
  revenue_quintile,
  -- Customer lifetime value calculation
  ROUND(
    total_revenue * 
    CASE subscription_tier
      WHEN 'enterprise' THEN 1.5
      WHEN 'business' THEN 1.2
      ELSE 1.0
    END, 2
  ) as estimated_clv
FROM revenue_ranking
WHERE revenue_rank <= 100
ORDER BY total_revenue DESC;

-- Performance optimization indexes
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_customer_status_date 
--   ON orders(customer_id, status, created_at) 
--   WHERE status = 'completed';
-- 
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customers_status_created 
--   ON customers(status, created_at) 
--   WHERE status = 'active';`,
    category: 'database',
    techStack: ['PostgreSQL', 'SQL Optimization', 'Query Performance', 'Indexing Strategy'],
    visualizationType: 'data-structure',
    businessValue: "Demonstrates database optimization expertise for enterprise systems with complex analytical queries, proper indexing strategies, and performance monitoring.",
    keyFeatures: [
      "Complex analytical queries",
      "Performance optimization",
      "Proper indexing strategy",
      "Customer lifetime value calculation",
      "Scalable query patterns"
    ]
  }
];

// API Architecture Examples
export const apiArchitectureExamples: EnterpriseCodeExample[] = [
  {
    title: "Scalable API Design Pattern",
    description: "Enterprise-grade RESTful API with proper error handling, validation, and monitoring",
    businessScenario: "Microservices architecture for enterprise SaaS platform requiring robust API design with authentication, rate limiting, comprehensive error handling, and monitoring.",
    initialCode: `class EnterpriseAPIController {
  constructor(dependencies) {
    this.orderService = dependencies.orderService;
    this.notificationService = dependencies.notificationService;
    this.auditService = dependencies.auditService;
    this.rateLimiter = dependencies.rateLimiter;
    this.validator = dependencies.validator;
  }

  async createOrder(req, res, next) {
    const startTime = Date.now();
    const correlationId = req.headers['x-correlation-id'] || generateUUID();
    
    try {
      // Rate limiting check
      await this.rateLimiter.checkLimit(req.user.id, 'order_creation');
      
      // Request validation
      const validationResult = await this.validator.validate(req.body, {
        schema: 'orderCreation',
        context: { userId: req.user.id, tier: req.user.tier }
      });
      
      if (!validationResult.isValid) {
        return this.handleValidationError(res, validationResult.errors, correlationId);
      }

      // Business logic execution
      const orderData = {
        ...validationResult.data,
        customerId: req.user.id,
        correlationId,
        metadata: {
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip,
          timestamp: new Date().toISOString()
        }
      };

      const order = await this.orderService.createOrder(orderData);
      
      // Async notification (non-blocking)
      this.notificationService.sendOrderConfirmation(order)
        .catch(error => {
          console.error('Notification failed:', error);
          // Log but don't fail the request
        });

      // Audit logging
      await this.auditService.logActivity({
        userId: req.user.id,
        action: 'order_created',
        resourceId: order.id,
        correlationId,
        duration: Date.now() - startTime
      });

      // Success response with proper structure
      res.status(201).json({
        success: true,
        data: {
          order: {
            id: order.id,
            status: order.status,
            total: order.total,
            estimatedDelivery: order.estimatedDelivery,
            trackingNumber: order.trackingNumber
          }
        },
        meta: {
          correlationId,
          timestamp: new Date().toISOString(),
          version: 'v1'
        }
      });

    } catch (error) {
      // Comprehensive error handling
      await this.handleAPIError(error, req, res, {
        correlationId,
        duration: Date.now() - startTime,
        operation: 'createOrder'
      });
    }
  }

  async handleAPIError(error, req, res, context) {
    const { correlationId, duration, operation } = context;
    
    // Log error with context
    console.error('API Error:', {
      error: error.message,
      stack: error.stack,
      correlationId,
      operation,
      userId: req.user?.id,
      duration
    });

    // Audit error
    await this.auditService.logError({
      error: error.message,
      correlationId,
      operation,
      userId: req.user?.id,
      duration
    });

    // Determine appropriate response based on error type
    let statusCode = 500;
    let errorResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
        correlationId
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: 'v1'
      }
    };

    if (error.name === 'ValidationError') {
      statusCode = 400;
      errorResponse.error = {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: error.details,
        correlationId
      };
    } else if (error.name === 'UnauthorizedError') {
      statusCode = 401;
      errorResponse.error = {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
        correlationId
      };
    } else if (error.name === 'ForbiddenError') {
      statusCode = 403;
      errorResponse.error = {
        code: 'FORBIDDEN',
        message: 'Insufficient permissions',
        correlationId
      };
    } else if (error.name === 'NotFoundError') {
      statusCode = 404;
      errorResponse.error = {
        code: 'NOT_FOUND',
        message: 'Resource not found',
        correlationId
      };
    } else if (error.name === 'RateLimitError') {
      statusCode = 429;
      errorResponse.error = {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests',
        retryAfter: error.retryAfter,
        correlationId
      };
    }

    res.status(statusCode).json(errorResponse);
  }

  handleValidationError(res, errors, correlationId) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: errors,
        correlationId
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: 'v1'
      }
    });
  }
}`,
    category: 'api',
    techStack: ['Node.js', 'Express', 'Microservices', 'API Design', 'Error Handling'],
    visualizationType: 'architecture',
    businessValue: "Demonstrates full-stack development expertise for enterprise applications with robust API design, comprehensive error handling, and monitoring capabilities.",
    keyFeatures: [
      "Comprehensive error handling",
      "Request validation & sanitization",
      "Rate limiting & security",
      "Audit logging & monitoring",
      "Correlation ID tracking"
    ]
  }
];

// Performance Optimization Examples
export const performanceOptimizationExamples: EnterpriseCodeExample[] = [
  {
    title: "React Performance Optimization",
    description: "Advanced React optimization techniques for enterprise-scale applications",
    businessScenario: "Large-scale enterprise application with complex UI components experiencing performance issues with thousands of concurrent users and frequent data updates.",
    initialCode: `import React, { memo, useMemo, useCallback, useRef, useEffect } from 'react';
import { debounce } from 'lodash';
import { FixedSizeList as List } from 'react-window';

// Optimized data table component for large datasets
const EnterpriseDataTable = memo(({ 
  data, 
  columns, 
  onRowSelect, 
  onSort,
  loading,
  virtualizeThreshold = 100 
}) => {
  const [sortConfig, setSortConfig] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const tableRef = useRef(null);
  const observerRef = useRef(null);

  // Memoized sorted data to prevent unnecessary recalculations
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  // Debounced search to prevent excessive filtering
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      // Implement search logic
      onSearch?.(searchTerm);
    }, 300),
    [onSearch]
  );

  // Optimized row selection handler
  const handleRowSelect = useCallback((rowId, isSelected) => {
    setSelectedRows(prev => {
      const newSelected = new Set(prev);
      if (isSelected) {
        newSelected.add(rowId);
      } else {
        newSelected.delete(rowId);
      }
      onRowSelect?.(Array.from(newSelected));
      return newSelected;
    });
  }, [onRowSelect]);

  // Optimized sort handler
  const handleSort = useCallback((columnKey) => {
    setSortConfig(prev => ({
      key: columnKey,
      direction: prev?.key === columnKey && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    onSort?.(columnKey);
  }, [onSort]);

  // Virtual scrolling for large datasets
  const RowRenderer = useCallback(({ index, style }) => {
    const row = sortedData[index];
    const isSelected = selectedRows.has(row.id);
    
    return (
      <div style={style} className={\`table-row \${isSelected ? 'selected' : ''}\`}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => handleRowSelect(row.id, e.target.checked)}
        />
        {columns.map(column => (
          <div key={column.key} className="table-cell">
            {column.render ? column.render(row[column.key], row) : row[column.key]}
          </div>
        ))}
      </div>
    );
  }, [sortedData, selectedRows, columns, handleRowSelect]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!tableRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Trigger lazy loading of additional data
            onLoadMore?.();
          }
        });
      },
      { threshold: 0.1 }
    );

    const sentinel = tableRef.current.querySelector('.load-more-sentinel');
    if (sentinel) {
      observerRef.current.observe(sentinel);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [onLoadMore]);

  if (loading) {
    return <TableSkeleton columns={columns} rows={10} />;
  }

  // Use virtualization for large datasets
  if (sortedData.length > virtualizeThreshold) {
    return (
      <div className="enterprise-table" ref={tableRef}>
        <TableHeader columns={columns} onSort={handleSort} sortConfig={sortConfig} />
        <List
          height={400}
          itemCount={sortedData.length}
          itemSize={50}
          itemData={{ data: sortedData, columns, selectedRows, handleRowSelect }}
        >
          {RowRenderer}
        </List>
      </div>
    );
  }

  // Regular rendering for smaller datasets
  return (
    <div className="enterprise-table" ref={tableRef}>
      <TableHeader columns={columns} onSort={handleSort} sortConfig={sortConfig} />
      <div className="table-body">
        {sortedData.map((row, index) => (
          <RowRenderer
            key={row.id}
            index={index}
            style={{ height: 50 }}
          />
        ))}
        <div className="load-more-sentinel" />
      </div>
    </div>
  );
});

EnterpriseDataTable.displayName = 'EnterpriseDataTable';

export default EnterpriseDataTable;`,
    category: 'optimization',
    techStack: ['React', 'React Window', 'Performance Optimization', 'Virtual Scrolling'],
    visualizationType: 'performance',
    businessValue: "Demonstrates advanced React performance optimization for enterprise applications handling large datasets with thousands of concurrent users.",
    keyFeatures: [
      "Virtual scrolling for large datasets",
      "Memoization & optimization",
      "Debounced search & filtering",
      "Intersection Observer lazy loading",
      "Memory-efficient rendering"
    ]
  }
];

// Complete code demonstrations array
export const enterpriseCodeDemonstrations: CodeDemonstration[] = [
  ...reactComponentExamples.map(example => ({
    id: example.title.toLowerCase().replace(/\s+/g, '-'),
    title: example.title,
    description: example.description,
    language: 'javascript' as const,
    initialCode: example.initialCode,
    businessValue: example.businessValue,
    category: example.category as 'frontend',
    difficulty: 'expert' as const,
    visualizationType: example.visualizationType,
    estimatedTime: 15,
    learningObjectives: example.keyFeatures
  })),
  ...databaseOptimizationExamples.map(example => ({
    id: example.title.toLowerCase().replace(/\s+/g, '-'),
    title: example.title,
    description: example.description,
    language: 'sql' as const,
    initialCode: example.initialCode,
    businessValue: example.businessValue,
    category: 'database' as const,
    difficulty: 'expert' as const,
    visualizationType: example.visualizationType,
    estimatedTime: 10,
    learningObjectives: example.keyFeatures
  })),
  ...apiArchitectureExamples.map(example => ({
    id: example.title.toLowerCase().replace(/\s+/g, '-'),
    title: example.title,
    description: example.description,
    language: 'javascript' as const,
    initialCode: example.initialCode,
    businessValue: example.businessValue,
    category: 'backend' as const,
    difficulty: 'expert' as const,
    visualizationType: example.visualizationType,
    estimatedTime: 20,
    learningObjectives: example.keyFeatures
  })),
  ...performanceOptimizationExamples.map(example => ({
    id: example.title.toLowerCase().replace(/\s+/g, '-'),
    title: example.title,
    description: example.description,
    language: 'javascript' as const,
    initialCode: example.initialCode,
    businessValue: example.businessValue,
    category: 'performance' as const,
    difficulty: 'expert' as const,
    visualizationType: example.visualizationType,
    estimatedTime: 25,
    learningObjectives: example.keyFeatures
  }))
];

export default enterpriseCodeDemonstrations;