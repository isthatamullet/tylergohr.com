# Tyler Gohr Portfolio - Deployment Scripts

## 🚀 Google Cloud Setup

### `setup-gcp-service-account.sh`

**Purpose**: Automated setup of Google Cloud Service Account for GitHub Actions CI/CD pipeline.

**Usage**:
```bash
chmod +x scripts/setup-gcp-service-account.sh
./scripts/setup-gcp-service-account.sh [PROJECT_ID]
```

**What it does**:
1. Creates Google Cloud Project (if needed)
2. Enables required APIs (Cloud Run, Container Registry, Cloud Build)
3. Creates service account with proper IAM roles
4. Generates service account key for GitHub Actions
5. Provides instructions for GitHub Secrets setup

**Required permissions**:
- Project Editor or Owner role in Google Cloud
- Billing enabled on the project

**Output**:
- Service account key file: `github-actions-sa-key.json`
- Base64 encoded key for GitHub Secrets
- Setup instructions and verification commands

## 🔐 Security Notes

1. **Service Account Keys**: 
   - Never commit service account keys to version control
   - Store keys securely in GitHub Secrets immediately after generation
   - Consider deleting local key files after setup

2. **IAM Principle of Least Privilege**:
   - Service account has minimal required permissions
   - Roles are scoped to specific services (Cloud Run, Container Registry)
   - No unnecessary administrative access

3. **Key Rotation**:
   - Consider rotating service account keys periodically
   - Monitor service account usage in Google Cloud Console
   - Remove unused keys and service accounts

## 📋 Prerequisites

1. **Google Cloud SDK**: 
   ```bash
   # Install gcloud CLI
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   gcloud init
   ```

2. **Project Setup**:
   ```bash
   # Create new project
   gcloud projects create PROJECT_ID
   gcloud config set project PROJECT_ID
   
   # Enable billing (required for Cloud Run)
   # https://console.cloud.google.com/billing
   ```

3. **Authentication**:
   ```bash
   # Authenticate with Google Cloud
   gcloud auth login
   gcloud auth application-default login
   ```

## 🎯 Next Steps

After running the setup script:

1. **Add GitHub Secrets**:
   - Go to repository settings: `/settings/secrets/actions`
   - Add `GCP_PROJECT_ID` and `GCP_SA_KEY`

2. **Test the Pipeline**:
   - Create a test branch and pull request
   - Verify CI workflow runs successfully
   - Test deployment to staging environment

3. **Production Deployment**:
   - Merge to main branch triggers production deployment
   - Monitor deployment in GitHub Actions and Google Cloud Console

## 🔧 Troubleshooting

### Common Issues

**Permission Denied**:
```bash
# Ensure you have proper Google Cloud permissions
gcloud auth list
gcloud projects get-iam-policy PROJECT_ID
```

**API Not Enabled**:
```bash
# Manually enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

**Billing Not Enabled**:
- Enable billing in Google Cloud Console
- Cloud Run requires active billing account

### Verification Commands

```bash
# Verify service account
gcloud iam service-accounts list

# Check IAM bindings
gcloud projects get-iam-policy PROJECT_ID

# Test service account key
gcloud auth activate-service-account --key-file=github-actions-sa-key.json
```

---

These scripts provide enterprise-grade automation for setting up production deployment infrastructure, demonstrating DevOps expertise and security best practices.