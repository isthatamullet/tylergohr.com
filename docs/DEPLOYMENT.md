# Tyler Gohr Portfolio - Deployment Guide

## Overview

This guide documents the complete deployment process for the Tyler Gohr portfolio website from development to production on Google Cloud Run with custom domain setup.

## ⚡ Pipeline Optimization

The deployment pipeline now includes intelligent optimization for faster development velocity:

- **Fast-Track Pipeline (2-3 minutes)**: Content, documentation, and styling changes
- **Full Pipeline (8-12 minutes)**: Code, dependencies, and infrastructure changes
- **Smart Detection**: Automatically chooses appropriate pipeline based on file changes

## Architecture

- **Framework**: Next.js 14+ with App Router and TypeScript
- **Hosting**: Google Cloud Run (Container-based deployment)
- **Domain**: tylergohr.com (Custom domain with SSL)
- **CI/CD**: GitHub Actions with automated quality gates
- **DNS**: Squarespace DNS management

## Prerequisites

### Required Tools
- Node.js 18+
- Docker
- Google Cloud CLI (`gcloud`)
- GitHub CLI (`gh`)

### Required Accounts
- Google Cloud Project with Cloud Run enabled
- GitHub repository with Actions enabled
- Domain provider (Squarespace) access

### Environment Setup
```bash
# Install dependencies
npm install

# Verify build works locally
npm run build
npm run start
```

## Local Development

### Development Server
```bash
npm run dev
# Access at http://localhost:3000
```

### Quality Gates (Run before deployment)
```bash
npm run typecheck  # TypeScript validation
npm run lint       # ESLint validation
npm run build      # Production build test
npm test           # Jest test suite
```

## Docker Containerization

### Dockerfile Configuration
The project uses a multi-stage Docker build optimized for production:

```dockerfile
# Multi-stage build: deps → builder → runner
# Final image: ~192MB Alpine Linux with Node.js 18
# Security: Non-root user (nextjs:nodejs)
# Next.js: Standalone output for minimal container size
```

### Build & Test Container Locally
```bash
# Build container
docker build -t tylergohr-portfolio .

# Test container locally
docker run -p 3000:3000 tylergohr-portfolio

# Verify health endpoint
curl http://localhost:3000/api/health
```

## Google Cloud Run Deployment

### Service Configuration
- **Service Name**: `tylergohr-portfolio`
- **Region**: `us-central1`
- **Memory**: 2GB
- **CPU**: 1 vCPU
- **Concurrency**: 100 requests per instance
- **Scaling**: 0-10 instances (auto-scaling)

### Manual Deployment Commands
```bash
# Build and deploy to Cloud Run
gcloud run deploy tylergohr-portfolio \
  --source . \
  --region us-central1 \
  --memory 2Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --concurrency 100 \
  --port 3000

# Verify deployment
gcloud run services list --region us-central1
```

### Health Check Endpoint
The service includes a comprehensive health check at `/api/health`:

```bash
# Test health endpoint
curl https://tylergohr-portfolio-386594369911.us-central1.run.app/api/health
```

**Health Check Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-06-22T01:00:00.000Z",
  "server": {
    "uptime": 3600,
    "memory": {
      "rss": "75 MB",
      "heapUsed": "24 MB"
    }
  }
}
```

## Custom Domain Setup

### Step 1: Domain Mapping in Cloud Run
```bash
# Create domain mapping
gcloud run domain-mappings create \
  --service tylergohr-portfolio \
  --domain tylergohr.com \
  --region us-central1

# Verify domain mapping
gcloud beta run domain-mappings describe \
  --domain tylergohr.com \
  --region us-central1
```

### Step 2: DNS Configuration
Configure the following DNS records in your domain provider (Squarespace):

**A Records (IPv4):**
```
@ A 216.239.32.21
@ A 216.239.34.21
@ A 216.239.36.21
@ A 216.239.38.21
```

**AAAA Records (IPv6):**
```
@ AAAA 2001:4860:4802:32::15
@ AAAA 2001:4860:4802:34::15
@ AAAA 2001:4860:4802:36::15
@ AAAA 2001:4860:4802:38::15
```

**Important Notes:**
- Use the exact IPv6 format shown above
- DNS providers may display IPv6 in expanded format (`:0:0:0:` instead of `::`) - this is normal
- TTL of 4 hours is recommended for production

### Step 3: SSL Certificate
SSL certificates are automatically provisioned by Google Cloud Run:
- Certificate type: Google-managed
- Automatic renewal
- Supports both IPv4 and IPv6

## CI/CD Pipeline (GitHub Actions)

### Pipeline Overview
The project uses two main workflows:

1. **PR Validation** (`ci.yml`): Quality gates for pull requests
2. **Production Deployment** (`deploy.yml`): Automated deployment to Cloud Run

### Quality Gates
All deployments must pass:
- ✅ TypeScript compilation
- ✅ ESLint validation
- ✅ Jest test suite
- ✅ Production build
- ✅ Docker container build
- ✅ Security vulnerability scan

### Deployment Process
1. **Code Push**: Developer pushes to `main` branch
2. **Quality Gates**: All tests and validation must pass
3. **Container Build**: Docker image built and pushed to GCR
4. **Cloud Run Deploy**: Automated deployment with health checks
5. **Traffic Migration**: Gradual rollout (0% → 10% → 50% → 100%)
6. **Health Verification**: Automated health checks at each stage
7. **Rollback**: Automatic rollback if health checks fail

### Manual Deployment
```bash
# Trigger manual deployment
gh workflow run deploy.yml

# Monitor deployment status
gh run list --workflow=deploy.yml
```

## Monitoring & Verification

### Service Health
```bash
# Check service status
gcloud run services describe tylergohr-portfolio --region us-central1

# Check domain mapping status
gcloud beta run domain-mappings describe --domain tylergohr.com --region us-central1

# View service logs
gcloud logs read "resource.type=cloud_run_revision" --limit 50
```

### DNS Verification
```bash
# Test DNS resolution
nslookup tylergohr.com
nslookup tylergohr.com 8.8.8.8

# Test specific record types
nslookup -type=A tylergohr.com
nslookup -type=AAAA tylergohr.com

# Test HTTP response
curl -I https://tylergohr.com
```

### Expected Health Indicators
- **Domain Mapping**: `Ready`, `CertificateProvisioned`, `DomainRoutable` all `True`
- **Service Health**: `Ready`, `ConfigurationsReady`, `RoutesReady` all `True`
- **DNS Resolution**: Returns correct Cloud Run IP addresses
- **HTTPS**: SSL certificate valid and working
- **Response Headers**: `Server: Google Frontend`, Next.js cache headers

## Troubleshooting

### Common Issues

#### 1. Domain Not Loading (404 from GitHub)
**Symptoms**: tylergohr.com shows GitHub Pages 404
**Cause**: GitHub Pages still configured for domain
**Solution**:
```bash
# Check for GitHub Pages configuration in old repositories
# Remove custom domain from GitHub Pages settings
# Wait 10-30 minutes for DNS propagation
```

#### 2. DNS Not Resolving to Cloud Run
**Symptoms**: DNS returns wrong IP addresses
**Cause**: DNS records not updated or propagation delay
**Solution**:
```bash
# Verify DNS records are correct
dig +short tylergohr.com
# Wait for TTL to expire (4 hours max)
# Clear local DNS cache
```

#### 3. SSL Certificate Issues
**Symptoms**: SSL warnings or certificate errors
**Cause**: Certificate not yet provisioned
**Solution**:
```bash
# Check certificate status
gcloud beta run domain-mappings describe --domain tylergohr.com --region us-central1
# Wait for provisioning (usually 10-15 minutes)
```

#### 4. Service Not Responding
**Symptoms**: 500 errors or timeouts
**Cause**: Application startup issues
**Solution**:
```bash
# Check service logs
gcloud logs read "resource.type=cloud_run_revision" --limit 50
# Verify container health locally
docker run -p 3000:3000 tylergohr-portfolio
```

### Diagnostic Commands

```bash
# Complete health check
gcloud run services describe tylergohr-portfolio --region us-central1 \
  --format="value(status.conditions[].type,status.conditions[].status)"

# DNS resolution test
for dns in 8.8.8.8 1.1.1.1 208.67.222.222; do
  echo "Testing DNS: $dns"
  nslookup tylergohr.com $dns
done

# HTTP connectivity test
curl -v https://tylergohr.com 2>&1 | grep -E "HTTP|SSL|Certificate"
```

## Performance Optimization

### Monitoring Metrics
- **Core Web Vitals**: LCP <2.5s, INP <200ms, CLS <0.1
- **Lighthouse Scores**: 90+ for Performance, Accessibility, Best Practices, SEO
- **Response Time**: <500ms average
- **Uptime**: 99.9% availability target

### Performance Features
- **Container Optimization**: 192MB Alpine Linux base image
- **Cold Start Optimization**: Standalone Next.js build
- **CDN**: Google's global edge network
- **Caching**: Aggressive static asset caching
- **Compression**: Automatic gzip/brotli compression

## Security

### Container Security
- **Non-root User**: Container runs as `nextjs:nodejs`
- **Minimal Base Image**: Alpine Linux with only required packages
- **Vulnerability Scanning**: Automated scanning in CI/CD
- **Secret Management**: Environment variables via Cloud Run

### Network Security
- **HTTPS Enforced**: Automatic HTTP → HTTPS redirects
- **Security Headers**: CSP, HSTS, X-Frame-Options
- **CORS Configuration**: Appropriate cross-origin policies
- **Rate Limiting**: Cloud Run automatic DDoS protection

## Rollback Procedures

### Automatic Rollback
The CI/CD pipeline includes automatic rollback:
- Health check failures trigger immediate rollback
- Previous revision receives 100% traffic
- Manual verification of rollback success

### Manual Rollback
```bash
# List available revisions
gcloud run revisions list --service tylergohr-portfolio --region us-central1

# Rollback to specific revision
gcloud run services update-traffic tylergohr-portfolio \
  --to-revisions REVISION-NAME=100 \
  --region us-central1
```

---

**Last Updated**: 2025-06-22  
**Document Version**: 1.0  
**Deployment Status**: ✅ Production Ready

## 📋 Pipeline Architecture

### PR Validation Workflow (`ci.yml`)
- **Code Quality**: TypeScript checking, ESLint, Prettier formatting
- **Security**: Dependency audit, license compliance checking
- **Build Validation**: Bundle size analysis, Docker image building
- **Testing**: Unit tests, component tests, accessibility validation
- **Performance**: Lighthouse CI integration with budget enforcement
- **Docker Security**: Container vulnerability scanning, structure testing

### Deployment Workflow (`deploy.yml`)
- **Pre-deployment Validation**: Quality gates, version generation
- **Container Build**: Multi-stage Docker build with Google Container Registry
- **Cloud Run Deployment**: Automated deployment with health checks
- **Traffic Migration**: Gradual traffic shifting (10% → 50% → 100%)
- **Health Monitoring**: Comprehensive health checks and performance validation
- **Rollback Capability**: Automatic rollback on deployment failures

## 🔐 Required GitHub Secrets

### Essential Secrets

#### `GCP_PROJECT_ID`
- **Description**: Google Cloud Project ID for deployment
- **Example**: `tylergohr-portfolio`
- **Usage**: Identifies the GCP project for Cloud Run deployment

#### `GCP_SA_KEY`
- **Description**: Google Cloud Service Account key (JSON, base64 encoded)
- **Setup**: Generated by `scripts/setup-gcp-service-account.sh`
- **Format**: Base64 encoded JSON service account key
- **Permissions**: Cloud Run Admin, Storage Admin, Cloud Build Builder

### Optional Enhancement Secrets

#### `LHCI_GITHUB_APP_TOKEN`
- **Description**: Lighthouse CI GitHub App token for performance reporting
- **Usage**: Enhanced Lighthouse reporting with PR comments
- **Setup**: Install Lighthouse CI GitHub App and generate token

## 🛠️ Setup Instructions

### Step 1: Google Cloud Setup

1. **Create Google Cloud Project**
   ```bash
   gcloud projects create tylergohr-portfolio
   gcloud config set project tylergohr-portfolio
   ```

2. **Run Service Account Setup**
   ```bash
   chmod +x scripts/setup-gcp-service-account.sh
   ./scripts/setup-gcp-service-account.sh tylergohr-portfolio
   ```

3. **Enable Billing** (Required for Cloud Run)
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable billing for the project

### Step 2: GitHub Secrets Configuration

1. **Navigate to Repository Secrets**
   - Go to: `https://github.com/isthatamullet/tylergohr.com/settings/secrets/actions`

2. **Add Required Secrets**
   ```
   Name: GCP_PROJECT_ID
   Value: tylergohr-portfolio
   
   Name: GCP_SA_KEY
   Value: [Base64 encoded service account JSON key]
   ```

3. **Verify Service Account Key Format**
   ```bash
   # The key should be base64 encoded:
   cat github-actions-sa-key.json | base64 -w 0
   ```

### Step 3: Environment Configuration

1. **Production Environment**
   - Environment: `production`
   - Branch: `main`
   - URL: Will be provided after first deployment

2. **Staging Environment** (Optional)
   - Environment: `staging`
   - Branch: `develop`
   - URL: Separate Cloud Run service for testing

## 🔄 Deployment Process

### Automatic Deployment (Main Branch)
1. Push to `main` branch triggers deployment workflow
2. Pre-deployment validation runs (typecheck, lint, build)
3. Docker container is built and pushed to GCR
4. Application is deployed to Cloud Run with 0% traffic
5. Health checks validate the new deployment
6. Traffic is gradually migrated (10% → 50% → 100%)
7. Old revisions are cleaned up (keeps 5 most recent)

### Manual Deployment
```bash
# Trigger manual deployment via GitHub UI
# Go to: Actions → Deploy - Production Pipeline → Run workflow
# Select environment: staging | production
# Optional: Force deployment (skips some health checks)
```

### Pull Request Validation
1. Create PR targeting `main` branch
2. CI pipeline runs automatically with comprehensive checks
3. PR status checks must pass before merging
4. Lighthouse performance budgets are enforced

## 📊 Performance Budgets

### Lighthouse Thresholds
- **Performance**: ≥ 90
- **Accessibility**: ≥ 90
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90

### Core Web Vitals
- **First Contentful Paint**: ≤ 2.5s
- **Largest Contentful Paint**: ≤ 2.5s
- **Time to Interactive**: ≤ 3.5s
- **Cumulative Layout Shift**: ≤ 0.1

### Bundle Size Budget
- **Maximum Bundle Size**: 150KB
- **Build Time Budget**: 5 minutes
- **Container Image Size**: Target < 200MB

## 🔍 Monitoring and Health Checks

### Health Check Endpoint
- **URL**: `/api/health`
- **Method**: `GET` or `HEAD`
- **Response**: JSON with system status, memory usage, uptime
- **Thresholds**: Memory warning at 400MB, error at 900MB

### Cloud Run Health Checks
- **Startup Probe**: 40s grace period, 30s interval
- **Liveness Probe**: 30s interval, 3s timeout, 3 retries
- **Traffic Requirements**: Health check must pass before traffic allocation

### Performance Monitoring
- **Response Time**: < 3s target for deployment validation
- **Memory Usage**: Monitored and reported in health checks
- **Error Rates**: Tracked through Cloud Run metrics

## 🚨 Troubleshooting

### Common Issues

#### Service Account Permissions
```bash
# Verify service account has required roles
gcloud projects get-iam-policy tylergohr-portfolio \
  --flatten="bindings[].members" \
  --filter="bindings.members:github-actions-deploy@tylergohr-portfolio.iam.gserviceaccount.com"
```

#### Docker Build Failures
```bash
# Test Docker build locally
docker build -t portfolio-test .
docker run -p 3000:3000 portfolio-test

# Check health endpoint
curl http://localhost:3000/api/health
```

#### Cloud Run Deployment Issues
```bash
# Check Cloud Run service logs
gcloud run services logs read tylergohr-portfolio --region=us-central1

# Verify service configuration
gcloud run services describe tylergohr-portfolio --region=us-central1
```

#### GitHub Actions Failures
1. Check workflow logs in GitHub Actions tab
2. Verify all required secrets are set
3. Ensure service account has proper permissions
4. Check Google Cloud quotas and billing

### Emergency Rollback

#### Automatic Rollback
- Pipeline automatically rolls back on health check failures
- Previous stable revision receives 100% traffic
- Rollback verification ensures service stability

#### Manual Rollback
```bash
# List available revisions
gcloud run revisions list --service=tylergohr-portfolio --region=us-central1

# Rollback to specific revision
gcloud run services update-traffic tylergohr-portfolio \
  --region=us-central1 \
  --to-revisions=REVISION_NAME=100
```

## 🎯 Performance Optimization

### Container Optimization
- **Multi-stage Docker build**: Minimizes final image size
- **Alpine Linux base**: Security and size benefits
- **Standalone Next.js output**: Optimized for containerization
- **Non-root user**: Enhanced security posture

### Cloud Run Configuration
- **Memory**: 2GB for optimal performance
- **CPU**: 1 vCPU with automatic scaling
- **Concurrency**: 100 requests per instance
- **Scaling**: 0-10 instances based on demand
- **Timeout**: 300s for complex operations

### Caching Strategy
- **Docker Layer Caching**: GitHub Actions cache for faster builds
- **NPM Dependencies**: Cached between workflow runs
- **Static Assets**: Aggressive caching with proper headers
- **CDN Integration**: Future enhancement for global distribution

## 📈 Metrics and Analytics

### Deployment Metrics
- **Build Time**: Tracked and reported in workflows
- **Deployment Duration**: End-to-end pipeline timing
- **Success Rate**: Deployment success/failure tracking
- **Rollback Frequency**: Monitoring deployment stability

### Application Metrics
- **Response Times**: Monitored during health checks
- **Memory Usage**: Tracked in health endpoint
- **Error Rates**: Cloud Run built-in monitoring
- **Traffic Patterns**: Cloud Run analytics

## 🔮 Future Enhancements

### Planned Improvements
- **Multi-region Deployment**: Global availability
- **Blue-Green Deployment**: Zero-downtime deployments
- **Canary Releases**: Advanced traffic splitting
- **Enhanced Monitoring**: Prometheus/Grafana integration
- **Security Scanning**: Advanced vulnerability detection
- **Performance Regression Detection**: Automated performance monitoring

### Integration Opportunities
- **Slack Notifications**: Deployment status updates
- **PagerDuty Integration**: Incident management
- **Datadog Monitoring**: Advanced APM
- **Sentry Error Tracking**: Production error monitoring

---

This deployment pipeline represents enterprise-grade DevOps practices, demonstrating expertise in automation, security, and reliability. The gradual traffic migration and comprehensive health checks ensure zero-downtime deployments while maintaining high availability and performance standards.