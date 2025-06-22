#!/bin/bash
# Tyler Gohr Portfolio - Preview Deployment Monitor
# Monitor and verify PR preview deployment status

set -euo pipefail

echo "🔍 Tyler Gohr Portfolio - Preview Deployment Monitor"
echo "=================================================="
echo ""

# Check current branch and PR status
CURRENT_BRANCH=$(git branch --show-current)
echo "📋 Current branch: ${CURRENT_BRANCH}"

# Get PR information
PR_INFO=$(gh pr view --json number,headRefName,url 2>/dev/null || echo "")
if [ ! -z "$PR_INFO" ]; then
    PR_NUMBER=$(echo "$PR_INFO" | jq -r '.number')
    PR_URL=$(echo "$PR_INFO" | jq -r '.url')
    echo "🔗 PR #${PR_NUMBER}: ${PR_URL}"
else
    echo "ℹ️  No active PR found for current branch"
fi

echo ""

# Check latest workflow runs
echo "🏃 Latest CI Workflow Runs:"
gh run list --workflow="CI - Quality Gates & Preview Deployment" --limit=5 \
    --json status,conclusion,headBranch,createdAt,url \
    --template='{{range .}}{{.status}} {{.conclusion}} {{.headBranch}} {{.createdAt}} {{.url}}{{"\n"}}{{end}}'

echo ""

# If we have a PR, check for preview services
if [ ! -z "$PR_INFO" ] && [ "$PR_NUMBER" != "null" ]; then
    echo "🌐 Checking for Preview Services:"
    
    # Generate expected service name
    BRANCH_SAFE=$(echo "$CURRENT_BRANCH" | sed 's/[^a-zA-Z0-9]/-/g' | head -c 20)
    EXPECTED_SERVICE="portfolio-pr-${PR_NUMBER}-${BRANCH_SAFE}"
    
    echo "🔍 Expected service name: ${EXPECTED_SERVICE}"
    
    # Check if preview service exists
    if gcloud run services describe "$EXPECTED_SERVICE" --region=us-central1 --format="value(status.url)" 2>/dev/null; then
        PREVIEW_URL=$(gcloud run services describe "$EXPECTED_SERVICE" --region=us-central1 --format="value(status.url)")
        echo "✅ Preview service found: ${PREVIEW_URL}"
        
        # Test health endpoint
        echo "🧪 Testing health endpoint..."
        if curl -sSf "${PREVIEW_URL}/api/health" > /dev/null 2>&1; then
            echo "✅ Health check passed"
        else
            echo "⚠️  Health check failed (service may be starting)"
        fi
        
        echo ""
        echo "🎯 Preview Testing Links:"
        echo "📱 Preview Site: ${PREVIEW_URL}"
        echo "🩺 Health Check: ${PREVIEW_URL}/api/health"
        
    else
        echo "ℹ️  No preview service found (may be deploying or not yet created)"
    fi
else
    echo "ℹ️  No PR context available"
fi

echo ""

# Check for any preview services (in case naming is different)
echo "🔍 All Preview Services (portfolio-pr-*):"
gcloud run services list --region=us-central1 --filter="metadata.name:portfolio-pr-*" \
    --format="table(metadata.name,status.url,status.conditions[0].status)" 2>/dev/null || echo "No preview services found"

echo ""

# Resource usage summary
echo "💰 Resource Usage Summary:"
PREVIEW_COUNT=$(gcloud run services list --region=us-central1 --filter="metadata.name:portfolio-pr-*" --format="value(metadata.name)" | wc -l)
echo "Active preview services: ${PREVIEW_COUNT}"

if [ "$PREVIEW_COUNT" -gt 0 ]; then
    echo ""
    echo "🧹 Cleanup Commands (if needed):"
    echo "# Delete all preview services:"
    echo "gcloud run services list --region=us-central1 --filter=\"metadata.name:portfolio-pr-*\" --format=\"value(metadata.name)\" | xargs -I {} gcloud run services delete {} --region=us-central1 --quiet"
fi

echo ""
echo "✅ Monitoring complete!"