#!/bin/bash
# Tyler Gohr Portfolio - Cost Monitoring & Resource Management
# Monitor Cloud Run preview deployments and costs

set -euo pipefail

echo "💰 Tyler Gohr Portfolio - Cost Monitoring Dashboard"
echo "================================================"
echo ""

PROJECT_ID="tylergohr-portfolio"
REGION="us-central1"

# Set project context
gcloud config set project "$PROJECT_ID" --quiet 2>/dev/null || {
    echo "⚠️  Unable to set project. Please check gcloud authentication."
    echo "Run: gcloud auth login"
    exit 1
}

echo "📊 Resource Summary for Project: $PROJECT_ID"
echo ""

# Production services
echo "🏭 Production Services:"
gcloud run services list --region="$REGION" --filter="metadata.name:tylergohr-portfolio AND NOT metadata.name:portfolio-pr-*" \
    --format="table(metadata.name,status.url,spec.template.spec.containers[0].resources.limits.memory,spec.template.spec.containers[0].resources.limits.cpu)" \
    2>/dev/null || echo "No production services found"

echo ""

# Preview services
echo "🔬 Preview Services:"
PREVIEW_SERVICES=$(gcloud run services list --region="$REGION" --filter="metadata.name:portfolio-pr-*" \
    --format="value(metadata.name)" 2>/dev/null || echo "")

if [ -z "$PREVIEW_SERVICES" ]; then
    echo "No preview services found"
    PREVIEW_COUNT=0
else
    echo "Found preview services:"
    gcloud run services list --region="$REGION" --filter="metadata.name:portfolio-pr-*" \
        --format="table(metadata.name,status.url,spec.template.spec.containers[0].resources.limits.memory,spec.template.spec.containers[0].resources.limits.cpu,metadata.creationTimestamp)" \
        2>/dev/null
    PREVIEW_COUNT=$(echo "$PREVIEW_SERVICES" | wc -l)
fi

echo ""
echo "📈 Resource Allocation:"
echo "Preview services: $PREVIEW_COUNT"

if [ "$PREVIEW_COUNT" -gt 0 ]; then
    # Calculate estimated costs
    MEMORY_MB_PER_SERVICE=512
    CPU_PER_SERVICE=0.5
    TOTAL_MEMORY_GB=$(echo "scale=2; $PREVIEW_COUNT * $MEMORY_MB_PER_SERVICE / 1024" | bc)
    TOTAL_CPU=$(echo "scale=1; $PREVIEW_COUNT * $CPU_PER_SERVICE" | bc)
    
    echo "Total allocated memory: ${TOTAL_MEMORY_GB}GB"
    echo "Total allocated CPU: ${TOTAL_CPU} vCPU"
    
    # Rough cost estimation (Cloud Run pricing as of 2025)
    # Memory: $0.000000488 per GB-second
    # CPU: $0.000000588 per vCPU-second
    # Request: $0.0000004 per request
    
    MEMORY_COST_PER_HOUR=$(echo "scale=6; $TOTAL_MEMORY_GB * 0.000000488 * 3600" | bc)
    CPU_COST_PER_HOUR=$(echo "scale=6; $TOTAL_CPU * 0.000000588 * 3600" | bc)
    TOTAL_COST_PER_HOUR=$(echo "scale=6; $MEMORY_COST_PER_HOUR + $CPU_COST_PER_HOUR" | bc)
    
    echo ""
    echo "💵 Estimated Costs (if running continuously):"
    echo "Per hour: \$${TOTAL_COST_PER_HOUR}"
    echo "Per day: \$$(echo "scale=4; $TOTAL_COST_PER_HOUR * 24" | bc)"
    echo "Per month: \$$(echo "scale=2; $TOTAL_COST_PER_HOUR * 24 * 30" | bc)"
    echo ""
    echo "💡 Note: Cloud Run charges only when services are actively handling requests."
    echo "   Preview services with zero traffic incur minimal costs."
fi

echo ""

# Check for old preview services that should be cleaned up
echo "🕐 Preview Service Ages:"
if [ "$PREVIEW_COUNT" -gt 0 ]; then
    echo "$PREVIEW_SERVICES" | while read -r service; do
        if [ ! -z "$service" ]; then
            CREATED=$(gcloud run services describe "$service" --region="$REGION" \
                --format="value(metadata.creationTimestamp)" 2>/dev/null || echo "unknown")
            
            if [ "$CREATED" != "unknown" ]; then
                # Calculate age
                CREATED_TIMESTAMP=$(date -d "$CREATED" +%s 2>/dev/null || echo "0")
                CURRENT_TIMESTAMP=$(date +%s)
                AGE_SECONDS=$((CURRENT_TIMESTAMP - CREATED_TIMESTAMP))
                AGE_HOURS=$((AGE_SECONDS / 3600))
                
                if [ "$AGE_HOURS" -gt 24 ]; then
                    echo "⚠️  $service: ${AGE_HOURS}h old (consider cleanup)"
                elif [ "$AGE_HOURS" -gt 8 ]; then
                    echo "🟡 $service: ${AGE_HOURS}h old"
                else
                    echo "🟢 $service: ${AGE_HOURS}h old"
                fi
            else
                echo "❓ $service: age unknown"
            fi
        fi
    done
else
    echo "No preview services to check"
fi

echo ""

# Container Registry storage
echo "📦 Container Registry Storage:"
TOTAL_IMAGES=$(gcloud container images list --repository="gcr.io/$PROJECT_ID" \
    --format="value(name)" 2>/dev/null | wc -l || echo "0")
echo "Total container images: $TOTAL_IMAGES"

if [ "$TOTAL_IMAGES" -gt 0 ]; then
    echo ""
    echo "🗂️  Images by service:"
    gcloud container images list --repository="gcr.io/$PROJECT_ID" \
        --format="table(name)" 2>/dev/null | grep -v "NAME" | while read -r image; do
            if [ ! -z "$image" ]; then
                TAG_COUNT=$(gcloud container images list-tags "$image" --format="value(digest)" 2>/dev/null | wc -l || echo "0")
                echo "  $image: $TAG_COUNT tags"
            fi
        done
fi

echo ""

# Cleanup recommendations
echo "🧹 Cleanup Recommendations:"

if [ "$PREVIEW_COUNT" -gt 5 ]; then
    echo "⚠️  High number of preview services ($PREVIEW_COUNT). Consider cleanup."
fi

if [ "$TOTAL_IMAGES" -gt 50 ]; then
    echo "⚠️  High number of container images ($TOTAL_IMAGES). Consider cleanup."
fi

echo ""
echo "🛠️  Cleanup Commands:"
echo ""
echo "# Delete all preview services:"
echo "gcloud run services list --region=$REGION --filter=\"metadata.name:portfolio-pr-*\" --format=\"value(metadata.name)\" | xargs -I {} gcloud run services delete {} --region=$REGION --quiet"
echo ""
echo "# Delete old container images (keep 5 most recent per service):"
echo "gcloud container images list --repository=\"gcr.io/$PROJECT_ID\" --format=\"value(name)\" | while read image; do"
echo "  gcloud container images list-tags \"\$image\" --format=\"get(digest)\" --sort-by=\"~timestamp\" --limit=100 | tail -n +6 | while read digest; do"
echo "    gcloud container images delete \"\$image@\$digest\" --quiet --force-delete-tags"
echo "  done"
echo "done"

echo ""
echo "✅ Cost monitoring complete!"
echo ""
echo "💡 Tips for cost optimization:"
echo "   - Preview services auto-scale to 0 when not in use"
echo "   - Close/merge PRs promptly to trigger automatic cleanup"
echo "   - Monitor for orphaned services from failed workflows"
echo "   - Regular container image cleanup (automated in CI)"