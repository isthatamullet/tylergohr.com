#!/bin/bash
# Tyler Gohr Portfolio - Staging Deployment Script
# Deploys specific branch to Cloud Run staging service for preview testing

set -euo pipefail

# Configuration
PROJECT_ID="tylergohr-portfolio"
SERVICE_NAME="tylergohr-portfolio-staging"
REGION="us-central1"
BRANCH="${1:-$(git branch --show-current)}"
REGISTRY="gcr.io"

echo "🚀 Tyler Gohr Portfolio - Staging Deployment"
echo "Branch: ${BRANCH}"
echo "Service: ${SERVICE_NAME}"
echo "Region: ${REGION}"
echo ""

# Verify prerequisites
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi

# Verify we're on the correct branch or checkout if specified
if [ "$BRANCH" != "$(git branch --show-current)" ]; then
    echo "📦 Checking out branch: ${BRANCH}"
    git checkout "$BRANCH" || {
        echo "❌ Failed to checkout branch: ${BRANCH}"
        echo "Available branches:"
        git branch -a
        exit 1
    }
fi

# Generate staging version
STAGING_VERSION="staging-$(date +%Y%m%d-%H%M%S)-${BRANCH//\//-}"
IMAGE_TAG="${REGISTRY}/${PROJECT_ID}/${SERVICE_NAME}:${STAGING_VERSION}"

echo "🏷️  Image tag: ${IMAGE_TAG}"
echo ""

# Set project context
echo "📋 Setting GCP project: ${PROJECT_ID}"
gcloud config set project "${PROJECT_ID}"

# Authenticate Docker for GCR
echo "🔐 Configuring Docker for Google Container Registry"
gcloud auth configure-docker --quiet

# Run quality gates first
echo "🧪 Running quality gates..."
npm ci
npm run typecheck
npm run lint
npm run build

# Build Docker image
echo "🐳 Building Docker image..."
docker build -t "${IMAGE_TAG}" \
    --build-arg NODE_ENV=production \
    --build-arg NEXT_TELEMETRY_DISABLED=1 \
    .

# Push to Container Registry
echo "📤 Pushing image to Google Container Registry..."
docker push "${IMAGE_TAG}"

# Deploy to Cloud Run staging
echo "🚀 Deploying to Cloud Run staging service..."
gcloud run deploy "${SERVICE_NAME}" \
    --image="${IMAGE_TAG}" \
    --region="${REGION}" \
    --platform=managed \
    --port=3000 \
    --memory=1Gi \
    --cpu=0.5 \
    --min-instances=0 \
    --max-instances=3 \
    --concurrency=50 \
    --timeout=300 \
    --allow-unauthenticated \
    --set-env-vars="NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1" \
    --tag="${STAGING_VERSION}" \
    --traffic=100 \
    --quiet

# Get staging service URL
STAGING_URL=$(gcloud run services describe "${SERVICE_NAME}" \
    --region="${REGION}" \
    --format="value(status.url)")

echo ""
echo "✅ Staging deployment completed successfully!"
echo ""
echo "🌐 Staging URL: ${STAGING_URL}"
echo "🏷️  Version: ${STAGING_VERSION}"
echo "🌿 Branch: ${BRANCH}"
echo ""
echo "🧪 Testing staging deployment..."

# Wait for service to be ready
sleep 10

# Test health endpoint
if curl -sSf "${STAGING_URL}/api/health" > /dev/null; then
    echo "✅ Health check passed"
    curl -s "${STAGING_URL}/api/health" | jq . || echo "Health endpoint response received"
else
    echo "⚠️  Health check warning - service may still be starting"
fi

echo ""
echo "🎉 Staging deployment ready for testing!"
echo "📱 Open in browser: ${STAGING_URL}"
echo ""
echo "💡 Useful commands:"
echo "   View logs: gcloud run services logs read ${SERVICE_NAME} --region=${REGION}"
echo "   Delete staging: gcloud run services delete ${SERVICE_NAME} --region=${REGION}"
echo ""