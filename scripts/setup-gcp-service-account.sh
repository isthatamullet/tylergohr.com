#!/bin/bash
# Tyler Gohr Portfolio - Google Cloud Service Account Setup
# Creates and configures service account for GitHub Actions CI/CD pipeline

set -euo pipefail

# Configuration
PROJECT_ID="${1:-tylergohr-portfolio}"
SERVICE_ACCOUNT_NAME="github-actions-deploy"
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
KEY_FILE="github-actions-sa-key.json"

echo "🚀 Setting up Google Cloud Service Account for GitHub Actions"
echo "Project ID: ${PROJECT_ID}"
echo "Service Account: ${SERVICE_ACCOUNT_EMAIL}"

# Check if gcloud is installed and authenticated
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set the project
echo "📋 Setting project: ${PROJECT_ID}"
gcloud config set project "${PROJECT_ID}"

# Enable required APIs
echo "🔧 Enabling required Google Cloud APIs..."
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    containerregistry.googleapis.com \
    secretmanager.googleapis.com \
    --quiet

# Create service account
echo "👤 Creating service account: ${SERVICE_ACCOUNT_NAME}"
gcloud iam service-accounts create "${SERVICE_ACCOUNT_NAME}" \
    --display-name="GitHub Actions Deployment Service Account" \
    --description="Service account for automated deployment from GitHub Actions" \
    --quiet || echo "Service account may already exist"

# Grant required IAM roles
echo "🔐 Granting IAM roles to service account..."

# Cloud Run roles
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/run.admin" \
    --quiet

# Container Registry roles
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/storage.admin" \
    --quiet

# Cloud Build roles (for container building)
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/cloudbuild.builds.builder" \
    --quiet

# IAM Security Admin (for service account management)
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/iam.serviceAccountUser" \
    --quiet

# Secret Manager (for secrets access if needed)
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/secretmanager.secretAccessor" \
    --quiet

# Create and download service account key
echo "🗝️  Creating service account key..."
gcloud iam service-accounts keys create "${KEY_FILE}" \
    --iam-account="${SERVICE_ACCOUNT_EMAIL}" \
    --quiet

echo "✅ Service account setup completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Add the following secrets to your GitHub repository:"
echo "   - GCP_PROJECT_ID: ${PROJECT_ID}"
echo "   - GCP_SA_KEY: $(cat ${KEY_FILE} | base64 -w 0)"
echo ""
echo "2. Set up GitHub repository secrets:"
echo "   - Go to: https://github.com/isthatamullet/tylergohr.com/settings/secrets/actions"
echo "   - Add the secrets listed above"
echo ""
echo "3. Optional: Set up additional secrets for enhanced features:"
echo "   - LHCI_GITHUB_APP_TOKEN: For Lighthouse CI integration"
echo ""
echo "🔒 Security Note:"
echo "The key file '${KEY_FILE}' contains sensitive credentials."
echo "Please store it securely and add it to GitHub Secrets immediately."
echo "Consider deleting the local file after adding to GitHub Secrets."

# Display IAM policies for verification
echo ""
echo "🔍 Service Account IAM Bindings:"
gcloud projects get-iam-policy "${PROJECT_ID}" \
    --flatten="bindings[].members" \
    --format="table(bindings.role)" \
    --filter="bindings.members:${SERVICE_ACCOUNT_EMAIL}"

echo ""
echo "🎉 Setup completed successfully!"
echo "The service account is ready for GitHub Actions deployment."