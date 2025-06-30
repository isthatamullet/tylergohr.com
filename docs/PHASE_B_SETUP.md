# Phase B: Production Deployment Setup Guide

## Prerequisites ✅
- ✅ Domain: tylergohr.com (owned on Squarespace)
- ✅ Code: Production-ready portfolio with Docker + CI/CD
- ✅ Infrastructure: All deployment configurations complete

## Step 1: Google Cloud Project Setup

### 1.1 Create Google Cloud Account & Project
```bash
# Install Google Cloud CLI if not installed
# https://cloud.google.com/sdk/docs/install

# Login to Google Cloud
gcloud auth login

# Create the project (choose a billing-enabled account)
gcloud projects create tylergohr-portfolio --name="Tyler Gohr Portfolio"

# Set billing account (required for Cloud Run)
# gcloud billing accounts list
# gcloud billing projects link tylergohr-portfolio --billing-account=BILLING_ACCOUNT_ID
```

### 1.2 Run Automated Setup Script
```bash
# Make setup script executable
chmod +x scripts/setup-gcp-service-account.sh

# Run the setup (this will take 2-3 minutes)
./scripts/setup-gcp-service-account.sh tylergohr-portfolio
```

**What this script does:**
- Creates service account with deployment permissions
- Enables required Google Cloud APIs
- Generates service account key
- Provides GitHub Secrets configuration instructions

## Step 2: GitHub Secrets Configuration

### 2.1 Navigate to Repository Secrets
Go to: https://github.com/isthatamullet/tylergohr.com/settings/secrets/actions

### 2.2 Add Required Secrets

**Secret 1: GCP_PROJECT_ID**
- Name: `GCP_PROJECT_ID`
- Value: `tylergohr-portfolio`

**Secret 2: GCP_SA_KEY**
- Name: `GCP_SA_KEY`
- Value: [Base64 encoded service account key from script output]

The setup script will provide the exact base64 encoded value to copy.

## Step 3: Squarespace DNS Configuration

### 3.1 Access Squarespace Domain Settings
1. Login to Squarespace
2. Go to Settings → Domains → tylergohr.com
3. Click "Use a Different Provider" or "Advanced DNS Settings"

### 3.2 DNS Records to Add

**Important**: Remove existing Squarespace website hosting first!

**Initial Setup (before first deployment):**
```
Type: A
Host: @
Value: 216.239.32.21 (Google Cloud Run global IP)
TTL: 3600

Type: A
Host: www
Value: 216.239.32.21
TTL: 3600
```

**After first deployment (will get specific IPs):**
The deployment process will provide specific IP addresses to update these records.

## Step 4: First Deployment

### 4.1 Enable Google Cloud Billing
1. Go to Google Cloud Console
2. Select tylergohr-portfolio project
3. Enable billing (required for Cloud Run)

### 4.2 Trigger Deployment
```bash
# Push to main branch to trigger automatic deployment
git push origin main
```

Or manually trigger via GitHub Actions:
1. Go to GitHub repository → Actions
2. Select "Deploy - Production Pipeline"
3. Click "Run workflow"
4. Select environment: production

## Step 5: Domain Configuration

### 5.1 Add Custom Domain in Cloud Run
After first successful deployment:
```bash
# Map custom domain (run after first deployment)
gcloud run domain-mappings create --service=tylergohr-portfolio --domain=tylergohr.com --region=us-central1
```

### 5.2 Update DNS with Specific IPs
Google Cloud will provide specific IP addresses for your domain. Update Squarespace DNS with these.

## Expected Timeline

### Immediate (Setup Day)
- **Google Cloud Setup**: 15 minutes
- **GitHub Secrets**: 5 minutes
- **DNS Initial Config**: 10 minutes
- **First Deployment**: 10 minutes (automated)
- **Total Active Time**: ~40 minutes

### DNS Propagation
- **Local/Regional**: 1-6 hours
- **Global Propagation**: 24-48 hours maximum
- **SSL Certificate**: Automatic once DNS propagates

## Verification Steps

### 1. Deployment Health Check
```bash
# Test the health endpoint (after deployment)
curl https://tylergohr-portfolio-xxx-uc.a.run.app/api/health
```

### 2. Custom Domain Test
```bash
# Once DNS propagates
curl https://tylergohr.com/api/health
```

### 3. Performance Validation
- Lighthouse CI automatically runs on deployment
- Core Web Vitals monitoring active
- SSL certificate validates automatically

## Production Features Active

✅ **Zero-Downtime Deployment**: Gradual traffic migration (10% → 50% → 100%)
✅ **Health Monitoring**: Comprehensive health checks and rollback capability
✅ **Performance Budgets**: Lighthouse CI with budget enforcement
✅ **Security**: Container scanning, dependency audits, security headers
✅ **Auto-Scaling**: 0-10 instances based on demand
✅ **SSL/HTTPS**: Google-managed certificates
✅ **CDN**: Global Cloud Run distribution

## Troubleshooting

### Common Issues

**DNS Not Propagating**
```bash
# Check DNS propagation
dig tylergohr.com
nslookup tylergohr.com
```

**Deployment Failures**
```bash
# Check GitHub Actions logs
# Check Google Cloud Run logs
gcloud run services logs read tylergohr-portfolio --region=us-central1
```

**SSL Certificate Issues**
- Wait for DNS propagation (up to 48 hours)
- Verify domain ownership in Google Search Console

## Success Metrics

**Technical Excellence:**
- ✅ <10 minute end-to-end deployment
- ✅ Lighthouse scores 90+ (automated enforcement)
- ✅ Zero-downtime deployment with health checks
- ✅ Automatic rollback on failures
- ✅ Production monitoring and alerting

**Infrastructure Demonstration:**
- ✅ Enterprise-grade CI/CD pipeline
- ✅ Container security scanning
- ✅ Performance budget enforcement
- ✅ Multi-stage deployment validation
- ✅ Professional domain configuration

---

## Next Steps After Phase B

Once Phase B is complete and tylergohr.com is live:

1. **Phase 5.3**: Analytics integration with privacy-first monitoring
2. **Phase 5.4**: Blog system for technical content
3. **Phase 5.5**: Testing framework implementation
4. **Phase 5.6**: Advanced performance optimization
5. **Phase 5.7**: Final production polish

**Phase B Status**: Ready for execution - all infrastructure prepared! 🚀