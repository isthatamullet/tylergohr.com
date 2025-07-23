# Deployment Guide - Tyler Gohr Portfolio

## Overview

This guide covers the complete deployment process for the Tyler Gohr Portfolio, including both the main portfolio and `/2` redesign (Enterprise Solutions Architect), from development to production on Google Cloud Run with custom domain setup.

## Architecture & Infrastructure

### **Deployment Stack**
```bash
# Core infrastructure
- Framework: Next.js 15.3.4 with App Router
- Container Platform: Google Cloud Run (managed serverless)
- Container Registry: Google Container Registry (GCR)
- Domain: tylergohr.com with custom SSL
- DNS Management: Squarespace DNS
- CI/CD: GitHub Actions with automated quality gates
```

### **Multi-Route Architecture**
```bash
# Production routes
https://tylergohr.com          # Main portfolio (full-stack developer focus)
https://tylergohr.com/2        # Enterprise Solutions Architect redesign
https://tylergohr.com/blog     # Blog system with MDX content
https://tylergohr.com/api/*    # API endpoints (contact, health)

# All routes deployed together in single container
# Route handling via Next.js App Router
```

## Containerization

### **Docker Configuration**
```bash
# Multi-stage Dockerfile optimizations
FROM node:18-alpine                  # Base image
├── Stage 1 (deps): Dependencies only
├── Stage 2 (builder): Build application  
└── Stage 3 (runner): Production runtime

# Key optimizations:
- Standalone Next.js output (smaller container)
- Non-root user for security (nextjs:nodejs)
- Health check integration (/api/health)
- Production environment variables
```

### **Container Features**
```bash
# Production optimizations
- Port 3000 with HOSTNAME="0.0.0.0"
- Health check every 30s with /api/health endpoint
- Non-root user execution for security
- Static asset optimization and caching
- Telemetry disabled for performance
```

### **Local Container Testing**
```bash
# Build and test container locally
docker build -t tylergohr-portfolio .
docker run -p 3000:3000 tylergohr-portfolio

# Test health endpoint
curl http://localhost:3000/api/health

# Test both routes
curl http://localhost:3000          # Main portfolio
curl http://localhost:3000/2        # Enterprise redesign
```

## Google Cloud Run Configuration

### **Service Configuration**
```bash
# Production service settings
- Memory: 1Gi (handles Next.js + React workload)
- CPU: 0.5 (sufficient for portfolio traffic)
- Min instances: 0 (cost optimization)
- Max instances: 10 (traffic scaling)
- Concurrency: 50 requests per instance
- Timeout: 300 seconds
- Port: 3000 (Next.js default)
- Platform: managed (fully serverless)
```

### **Environment Variables**
```bash
# Production environment
NODE_ENV=production              # Next.js production mode
NEXT_TELEMETRY_DISABLED=1        # Performance optimization
HOSTNAME=0.0.0.0                 # Cloud Run compatibility
PORT=3000                        # Service port
```

### **Traffic Configuration**
```bash
# Production traffic routing
- 100% traffic to latest revision
- Custom domain: tylergohr.com
- HTTPS enforcement (automatic)
- All routes handled by single service:
  - / (main portfolio)
  - /2 (enterprise redesign)  
  - /blog/* (blog system)
  - /api/* (API endpoints)
```

## Local Development & Testing

### **Smart Port Detection System**
```bash
# Automatic development server detection
# The project uses intelligent port detection that works across all environments:
# - Google Cloud Workstations, GitHub Codespaces, Gitpod
# - Local development (localhost)
# - Automatically detects active dev server port
# - Constructs correct URLs for cloud environments

# For manual command execution (Playwright, testing, etc.)
eval "$(./scripts/detect-active-port.sh quiet export)"
# Sets: ACTIVE_DEV_PORT and ACTIVE_DEV_URL environment variables
# Example: ACTIVE_DEV_PORT=3000, ACTIVE_DEV_URL=http://localhost:3000
```

### **Development Environment**
```bash
# Recommended: Smart development server (auto-detects port)
npm run dev                      # Primary development command
npm run dev:enhanced             # Alias for npm run dev (Agent tool reminder)
npm run dev:claude               # Claude Code optimized

# Port-specific servers (use when you need a specific port)
npm run dev:3000                 # Force port 3000 (local testing)
npm run dev:3001                 # Force port 3001 (conflict resolution)
npm run dev:4000                 # Force port 4000 (alternative development)

# Manual port detection for testing
./scripts/detect-active-port.sh             # Interactive mode
./scripts/detect-active-port.sh quiet       # Quiet mode
./scripts/detect-active-port.sh quiet export # Export format for shell
```

### **Pre-Deployment Validation**
```bash
# Quality gates (MANDATORY before deployment)
npm run validate                 # typecheck + lint + build + bundle check

# Individual quality checks
npm run typecheck               # TypeScript validation
npm run lint                    # ESLint code quality
npm run build                   # Production build test
npm run bundle-check            # Bundle size validation (<6MB)
```

### **Local Production Testing**
```bash
# Test production build locally
npm run build
npm run start                   # Production server on localhost:3000

# Test both routes
http://localhost:3000           # Main portfolio
http://localhost:3000/2         # Enterprise redesign
http://localhost:3000/api/health # Health check
```

## CI/CD Pipeline

### **GitHub Actions Workflow**
```bash
# Current workflow: .github/workflows/test-validation.yml
- Trigger: Manual dispatch (workflow_dispatch)
- Runtime: ubuntu-latest with Node.js 18
- Timeout: 10 minutes

# Quality gates in CI/CD:
1. TypeScript validation (npm run typecheck)
2. ESLint compliance (npm run lint)  
3. Production build test (npm run build)
4. Bundle size check (6MB budget)
5. Health endpoint validation
6. Docker configuration validation
```

### **Deployment Process**
```bash
# Current deployment approach
1. Manual quality validation via GitHub Actions
2. Manual deployment via Google Cloud Console or gcloud CLI
3. Health check validation post-deployment
4. Custom domain traffic routing verification

# Future automated deployment (when ready):
# - Automatic deployment on main branch push
# - Preview deployments for pull requests
# - Automatic rollback on health check failures
```

## Staging Environment

### **Staging Deployment**
```bash
# Manual staging deployment
./scripts/deploy-staging.sh [branch-name]

# Staging service configuration
- Service: tylergohr-portfolio-staging
- Region: us-central1
- Memory: 1Gi, CPU: 0.5
- Max instances: 3 (lower than production)
- Auto-generated URL for testing
```

### **Staging Workflow**
```bash
# Deploy branch to staging
./scripts/deploy-staging.sh feature/new-feature

# Staging process:
1. Quality gates validation
2. Docker image build with staging tag
3. Push to Google Container Registry
4. Deploy to staging Cloud Run service
5. Health check validation
6. Staging URL provided for testing

# Staging testing URLs
https://[service-url].run.app      # Auto-generated staging URL
https://[service-url].run.app/2    # Enterprise redesign on staging
```

## Production Deployment

### **Manual Production Deployment**
```bash
# Prerequisites
- Google Cloud CLI installed and authenticated
- Docker installed and running
- Production Google Cloud project access
- Custom domain configured

# Production deployment steps
1. Validate quality gates locally
   npm run validate

2. Build and tag production image
   docker build -t gcr.io/tylergohr-portfolio/portfolio:latest .

3. Push to Container Registry
   docker push gcr.io/tylergohr-portfolio/portfolio:latest

4. Deploy to Cloud Run
   gcloud run deploy tylergohr-portfolio \
     --image=gcr.io/tylergohr-portfolio/portfolio:latest \
     --region=us-central1 \
     --platform=managed \
     --allow-unauthenticated

5. Verify deployment
   curl https://tylergohr.com/api/health
   curl https://tylergohr.com/2/api/health
```

### **Production Verification**
```bash
# Post-deployment health checks
curl https://tylergohr.com/api/health           # Main health check
curl https://tylergohr.com                      # Main portfolio
curl https://tylergohr.com/2                    # Enterprise redesign
curl https://tylergohr.com/blog                 # Blog system

# Performance validation
# - Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
# - Bundle size: <6MB total
# - Response times: <500ms for initial load
```

## Domain & DNS Configuration

### **Custom Domain Setup**
```bash
# Domain configuration
- Primary domain: tylergohr.com
- DNS provider: Squarespace DNS
- SSL/TLS: Automatic via Google Cloud Run
- All subdomains redirect to main domain

# DNS records (managed via Squarespace)
A record: @ → Cloud Run IP
CNAME: www → tylergohr.com
```

### **SSL/TLS Configuration**
```bash
# Automatic SSL via Cloud Run
- Certificate: Google-managed SSL certificate
- Renewal: Automatic
- Protocols: TLS 1.2+ enforced
- HTTPS redirect: Automatic
```

## Monitoring & Health Checks

### **Health Check Endpoint**
```bash
# Health check implementation (src/app/api/health/route.ts)
GET /api/health

Response format:
{
  "status": "healthy",
  "timestamp": "2025-01-06T...",
  "version": "1.0.0",
  "environment": "production"
}
```

### **Container Health Monitoring**
```bash
# Docker health check (Dockerfile)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health
```

### **Cloud Run Monitoring**
```bash
# Automatic monitoring via Google Cloud
- Health check failures trigger alerts
- Automatic restart on health check failures
- Request metrics and performance monitoring
- Error rate and latency tracking
```

## Performance Optimization

### **Bundle Optimization**
```bash
# Production build optimizations (next.config.js)
- Standalone output for minimal container size
- Image optimization (AVIF, WebP formats)
- CSS optimization and minification
- Code splitting and lazy loading
- Telemetry disabled for performance
```

### **Caching Strategy**
```bash
# Cache headers configuration
Static assets: Cache-Control: public, max-age=31536000, immutable
Dynamic content: Standard Next.js caching
Images: Optimized with next/image component
```

### **Core Web Vitals Targets**
```bash
# Performance targets for both routes
- LCP (Largest Contentful Paint): <2.5s
- FID (First Input Delay): <100ms  
- CLS (Cumulative Layout Shift): <0.1
- Bundle Size: <6MB total
- Initial Load: <3s for complete page
```

## Security Configuration

### **Container Security**
```bash
# Security measures
- Non-root user execution (nextjs:nodejs)
- Security headers via next.config.js
- Input validation on API endpoints
- Rate limiting on contact form (5 requests/minute)
- Environment variable protection
```

### **Security Headers**
```bash
# Configured security headers (next.config.js)
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content Security Policy: Configured for image handling
```

## Troubleshooting

### **Common Deployment Issues**
```bash
# Build failures
- Check TypeScript errors: npm run typecheck
- Check ESLint issues: npm run lint
- Check bundle size: npm run bundle-check
- Verify all dependencies: npm ci

# Container issues
- Test locally: docker build -t test . && docker run -p 3000:3000 test
- Check health endpoint: curl http://localhost:3000/api/health
- Verify standalone build: ls -la .next/standalone
```

### **Cloud Run Issues**
```bash
# Service deployment problems
gcloud run services list --region=us-central1      # Check service status
gcloud run revisions list --service=tylergohr-portfolio # Check revisions
gcloud run services logs read tylergohr-portfolio --region=us-central1 # View logs

# Health check failures
curl https://tylergohr.com/api/health              # Test health endpoint
gcloud run services describe tylergohr-portfolio --region=us-central1 # Service details
```

### **Domain & DNS Issues**
```bash
# DNS propagation and routing
dig tylergohr.com                                  # Check DNS resolution
curl -I https://tylergohr.com                      # Check HTTPS redirect
curl -I https://tylergohr.com/2                    # Check /2 route

# SSL certificate issues
openssl s_client -connect tylergohr.com:443        # Check SSL certificate
curl -v https://tylergohr.com                      # Verbose SSL check
```

### **Performance Issues**
```bash
# Bundle size problems
npm run bundle-check                               # Check current bundle size
npx next build --analyze                           # Analyze bundle composition

# Core Web Vitals issues
# Use Chrome DevTools Lighthouse
# Test on: https://pagespeed.web.dev/
# Monitor: https://search.google.com/search-console
```

## Rollback Procedures

### **Quick Rollback**
```bash
# Rollback to previous revision
gcloud run services update-traffic tylergohr-portfolio \
  --to-revisions=[PREVIOUS_REVISION]=100 \
  --region=us-central1

# List available revisions
gcloud run revisions list --service=tylergohr-portfolio --region=us-central1
```

### **Emergency Procedures**
```bash
# Complete service restart
gcloud run services delete tylergohr-portfolio --region=us-central1
# Then redeploy from known good image

# Health check override (temporary)
gcloud run services update tylergohr-portfolio \
  --remove-env-vars=HEALTH_CHECK_ENABLED \
  --region=us-central1
```

---

**Deployment Focus**: Containerized Google Cloud Run with /2 redesign support  
**Performance**: <2.5s LCP, <6MB bundle, automatic scaling  
**Security**: Non-root containers, security headers, HTTPS enforcement  
**Monitoring**: Health checks, automatic restarts, performance tracking