# Tyler Gohr Portfolio - Preview Deployment System

## Overview

This document describes the automated PR preview deployment system that provides isolated testing environments for every pull request using Google Cloud Run. This enterprise-grade system enables safe testing of changes before production deployment.

## Architecture

### System Components

- **GitHub Actions Workflows**: Automated CI/CD pipeline with preview deployment
- **Google Cloud Run**: Container hosting for preview environments  
- **Google Container Registry**: Docker image storage and management
- **Automatic Resource Management**: Dynamic service creation and cleanup

### Preview Environment Lifecycle

1. **PR Creation/Update** → Triggers enhanced CI workflow
2. **Quality Gates** → TypeScript, ESLint, tests must pass
3. **Container Build** → Docker image built and pushed to GCR
4. **Service Deployment** → Unique Cloud Run service created
5. **Health Validation** → Automatic service health checks
6. **PR Notification** → Comment posted with preview URL and testing guide
7. **Automatic Cleanup** → Resources deleted when PR is closed/merged

## Features

### ✅ Automatic Preview Deployment

- **Unique URLs**: Each PR gets its own Cloud Run service
- **Isolated Environments**: No conflicts between different PRs
- **Production-Like**: Same container and runtime as production
- **Fast Deployment**: Typically 3-5 minutes from push to live URL

### ✅ Smart Resource Management

- **Dynamic Naming**: `portfolio-pr-{number}-{branch-name}`
- **Optimized Resources**: 512MB RAM, 1 CPU for preview workloads
- **Auto-scaling**: Scale to 0 when unused (minimal cost)
- **Automatic Cleanup**: Services deleted on PR close/merge

### ✅ Developer Experience

- **PR Comments**: Automatic status updates with clickable URLs
- **Testing Guide**: Built-in instructions for testing features
- **Health Monitoring**: Automatic service health verification
- **Failure Handling**: Clear error reporting and troubleshooting

### ✅ Cost Optimization

- **Pay-per-use**: Only charged when services handle requests
- **Resource Limits**: Optimized allocation for preview workloads
- **Automatic Cleanup**: No orphaned resources or ongoing costs
- **Monitoring Tools**: Built-in cost tracking and alerts

## Usage Guide

### For Developers

#### Creating a Preview Environment

1. **Create or Update PR** against `main` or `develop` branch
2. **Wait for CI** to complete quality gates (2-3 minutes)
3. **Monitor Deployment** via GitHub Actions workflow
4. **Get Preview URL** from automated PR comment
5. **Test Features** using the live preview environment

#### Testing Your Changes

When the preview deploys successfully, you'll receive a PR comment with:

```markdown
## 🚀 PR Quality Gates & Preview Results

### 🌐 Preview Environment
- **Deployment**: ✅ Deployed
- **Preview URL**: https://portfolio-pr-X-branch-name-hash.us-central1.run.app
- **Health Check**: https://portfolio-pr-X-branch-name-hash.us-central1.run.app/api/health

### 🎯 Testing Guide
1. 🔗 [Open Preview Site] - Click to test changes
2. 📱 Test Navigation - Verify functionality on desktop and mobile
3. 🔄 Check Responsive Design - Test different screen sizes
4. ⚡ Verify Performance - Page loads and animations
```

#### Best Practices

- **Test Thoroughly**: Use preview environment for comprehensive testing
- **Share with Team**: Preview URLs are public and shareable
- **Check Mobile**: Test responsive design on various devices
- **Verify Performance**: Monitor load times and user experience
- **Close PRs Promptly**: Automatic cleanup happens on PR close/merge

### For Reviewers

#### Reviewing Pull Requests

1. **Check CI Status**: Ensure all quality gates pass
2. **Access Preview**: Click preview URL in PR comment
3. **Test Functionality**: Verify features work as expected
4. **Provide Feedback**: Comment on both code and live functionality
5. **Approve/Request Changes**: Based on code review and preview testing

## Monitoring and Management

### Monitoring Tools

#### Preview Status Monitoring
```bash
# Monitor active preview deployments
./scripts/monitor-preview.sh

# Check resource usage and costs
./scripts/cost-monitor.sh
```

#### Manual Monitoring
```bash
# List all preview services
gcloud run services list --region=us-central1 --filter="metadata.name:portfolio-pr-*"

# Check specific service status  
gcloud run services describe portfolio-pr-9-feature-name --region=us-central1

# View service logs
gcloud run services logs read portfolio-pr-9-feature-name --region=us-central1
```

### Resource Management

#### Automatic Cleanup

The system automatically cleans up resources when:
- PR is merged to main branch
- PR is closed without merging  
- PR is converted from draft (optional)

Cleanup includes:
- Cloud Run service deletion
- Container image removal
- Resource deallocation
- Cost elimination

#### Manual Cleanup (Emergency)

```bash
# Delete all preview services
gcloud run services list --region=us-central1 \
  --filter="metadata.name:portfolio-pr-*" \
  --format="value(metadata.name)" | \
  xargs -I {} gcloud run services delete {} --region=us-central1 --quiet

# Clean up old container images
gcloud container images list --repository="gcr.io/tylergohr-portfolio" \
  --format="value(name)" | while read image; do
    gcloud container images list-tags "$image" \
      --format="get(digest)" --sort-by="~timestamp" \
      --limit=100 | tail -n +6 | while read digest; do
        gcloud container images delete "$image@$digest" \
          --quiet --force-delete-tags
    done
  done
```

## Configuration

### Workflow Configuration

The preview deployment system is configured in `.github/workflows/ci.yml`:

```yaml
# Preview deployment job
preview-deployment:
  name: 'Deploy Preview Environment'
  needs: [quality-gates]
  if: github.event.action != 'closed' && needs.quality-gates.result == 'success'
```

### Resource Allocation

Preview environments use optimized resource allocation:

```yaml
# Cloud Run configuration for previews
--memory=512Mi        # 512MB RAM (vs 2GB production)
--cpu=1              # 1 vCPU (vs 1 vCPU production)  
--concurrency=10     # 10 requests/instance (vs 100 production)
--max-instances=2    # Max 2 instances (vs 10 production)
--timeout=300        # 5 minutes timeout
```

### Environment Variables

Preview services inherit production configuration:

```yaml
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## Troubleshooting

### Common Issues

#### Preview Deployment Fails

**Symptoms**: GitHub Actions workflow fails during preview deployment
**Causes**: Resource limits, image build failures, Cloud Run quota issues
**Solutions**:
1. Check workflow logs for specific error messages
2. Verify container builds locally: `docker build -t test .`
3. Check Cloud Run quotas in Google Cloud Console
4. Retry deployment by pushing new commit

#### Preview URL Not Working

**Symptoms**: Preview URL returns 404 or connection errors
**Causes**: Service not fully deployed, health check failures, DNS issues
**Solutions**:
1. Wait 2-3 minutes for service to fully initialize
2. Check health endpoint: `{preview-url}/api/health`
3. Review Cloud Run service logs
4. Verify service status in Google Cloud Console

#### High Resource Usage

**Symptoms**: Unexpected Cloud Run charges, many preview services
**Causes**: PRs not being cleaned up, orphaned services, resource leaks
**Solutions**:
1. Run cost monitoring: `./scripts/cost-monitor.sh`
2. Clean up old services manually
3. Check for failed cleanup workflows
4. Review PR closure processes

#### Cleanup Not Working

**Symptoms**: Preview services remain after PR close/merge
**Causes**: Workflow failures, permission issues, concurrent operations
**Solutions**:
1. Check cleanup workflow logs
2. Manually delete services: `./scripts/cost-monitor.sh`
3. Verify GitHub Actions permissions
4. Re-run cleanup workflow if needed

### Debugging Steps

1. **Check Workflow Status**: Review GitHub Actions logs
2. **Verify Service Status**: Check Cloud Run console
3. **Test Health Endpoint**: Verify application is responding
4. **Review Resource Usage**: Monitor costs and allocation
5. **Check Cleanup Status**: Ensure automatic cleanup is working

## Cost Management

### Cost Structure

Preview deployments use Google Cloud Run's pay-per-use model:

- **CPU**: Charged per vCPU-second while handling requests
- **Memory**: Charged per GB-second while handling requests  
- **Requests**: Charged per million requests
- **Idle Time**: Minimal charges when scaled to 0

### Estimated Costs

With default preview configuration:
- **Per Preview Service**: ~$0.01-0.10 per day (typical usage)
- **Per PR Lifecycle**: ~$0.05-0.50 total (creation to cleanup)
- **Monthly Budget**: $5-20 for active development (5-10 concurrent PRs)

### Cost Optimization Features

- **Auto-scaling to 0**: Services stop consuming resources when idle
- **Optimized Resources**: Reduced CPU/memory vs production
- **Automatic Cleanup**: No ongoing costs after PR closure
- **Monitoring Tools**: Built-in cost tracking and alerts

### Budget Alerts

Set up Google Cloud budget alerts:
1. Google Cloud Console → Billing → Budgets & alerts
2. Create budget for Cloud Run services
3. Set threshold alerts at $10, $25, $50
4. Configure email notifications

## Security

### Access Control

- **Public Access**: Preview services allow unauthenticated access for easy sharing
- **Temporary URLs**: Services are deleted after PR closure
- **No Sensitive Data**: Preview environments should not contain production data
- **Isolated Resources**: Each preview runs in isolated container

### Best Practices

- **Environment Variables**: Never include secrets in preview environments
- **Data Isolation**: Use test/mock data only
- **Access Logging**: Monitor who accesses preview URLs
- **Time Limits**: Close PRs promptly to remove access

## Performance

### Deployment Speed

Typical preview deployment timeline:
- **Quality Gates**: 1-2 minutes
- **Container Build**: 2-3 minutes  
- **Service Deployment**: 1-2 minutes
- **Health Verification**: 30 seconds
- **Total Time**: 4-7 minutes from push to live URL

### Service Performance

Preview services maintain production-level performance:
- **Cold Start**: 2-5 seconds for first request
- **Warm Requests**: <500ms response time
- **Scaling**: Automatic based on traffic
- **Availability**: 99.9% uptime (same as production)

## Integration

### GitHub Integration

The preview system integrates seamlessly with GitHub workflows:

- **PR Comments**: Automatic status updates and URLs
- **Status Checks**: Preview deployment status in PR interface
- **Branch Protection**: Can require successful preview deployment
- **Merge Blocking**: Option to block merges if preview fails

### Development Workflow Integration

Preview deployments enhance the development workflow:

1. **Feature Development**: Code locally with hot reload
2. **PR Creation**: Automatic preview deployment for testing
3. **Code Review**: Reviewers test both code and live functionality  
4. **Testing**: QA team tests features before production
5. **Merge**: Automatic cleanup and production deployment

## Maintenance

### Regular Maintenance Tasks

#### Weekly
- Review active preview services: `./scripts/monitor-preview.sh`
- Check cost usage: `./scripts/cost-monitor.sh`
- Clean up orphaned resources if needed

#### Monthly  
- Review deployment metrics and performance
- Update resource limits based on usage patterns
- Check for workflow optimization opportunities
- Review and update documentation

#### Quarterly
- Audit security and access patterns
- Review cost trends and optimization opportunities  
- Update tools and dependencies
- Validate disaster recovery procedures

### Updates and Improvements

The preview system is designed for continuous improvement:

- **Workflow Updates**: Modify `.github/workflows/ci.yml` as needed
- **Resource Optimization**: Adjust CPU/memory based on usage
- **Feature Enhancements**: Add monitoring, notifications, integrations
- **Security Updates**: Regular security review and updates

## Future Enhancements

### Planned Improvements

- **Multi-region Deployment**: Deploy previews closer to reviewers
- **Database Snapshots**: Isolated database instances for complex testing
- **Performance Monitoring**: Automated Lighthouse testing on previews
- **Slack Integration**: Notifications for preview deployment status
- **Access Controls**: Optional authentication for sensitive previews

### Advanced Features

- **Blue-Green Previews**: Side-by-side comparison environments
- **Load Testing**: Automated performance testing on previews
- **Security Scanning**: Automated vulnerability testing
- **A/B Testing**: Feature flag integration for preview environments

---

## Quick Reference

### Key Commands
```bash
# Monitor previews
./scripts/monitor-preview.sh

# Check costs
./scripts/cost-monitor.sh

# Manual staging deploy
./scripts/deploy-staging.sh [branch-name]

# Manual cleanup
gcloud run services delete [service-name] --region=us-central1
```

### Key URLs
- **GitHub Actions**: https://github.com/isthatamullet/tylergohr.com/actions
- **Google Cloud Console**: https://console.cloud.google.com/run?project=tylergohr-portfolio
- **Preview URL Pattern**: `https://portfolio-pr-{number}-{branch}-{hash}.us-central1.run.app`

### Support
- **Workflow Issues**: Check GitHub Actions logs and this documentation
- **Cloud Run Issues**: Check Google Cloud Console and service logs
- **Cost Concerns**: Use monitoring tools and contact billing support
- **Feature Requests**: Create GitHub issue with enhancement label

---

**Document Version**: 1.0  
**Last Updated**: 2025-06-22  
**System Status**: ✅ Production Ready

This preview deployment system represents enterprise-grade DevOps practices and demonstrates advanced CI/CD capabilities. It provides a professional development workflow that ensures quality while enabling rapid iteration and collaboration.