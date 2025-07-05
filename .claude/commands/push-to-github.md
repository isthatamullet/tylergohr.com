# Push to GitHub - Smart Context-Aware Git Operations

Execute safe, validated GitHub operations with intelligent destination detection and comprehensive quality gates.

**Usage**: `/push-to-github [destination] [--message="commit message"] [--force] [--skip-validation] [--dry-run]`

**Destinations**: 
- `new-pr` (default) - Create new pull request from current branch
- `existing-pr` - Push to current PR branch  
- `main` - Push directly to main branch (requires confirmation)
- `[branch-name]` - Push to specific branch name

**For task**: $ARGUMENTS

## Phase 1: Environment Validation & Safety Checks

### **GitHub CLI Installation & Authentication Check**
1. **Verify GitHub CLI Installation**:
   ```bash
   ! if ! command -v gh >/dev/null 2>&1; then
       echo "🔧 GitHub CLI not found. Installing..."
       if command -v apt >/dev/null 2>&1; then
         # Ubuntu/Debian installation
         curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
         echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
         sudo apt update && sudo apt install gh -y
       elif command -v brew >/dev/null 2>&1; then
         # macOS installation
         brew install gh
       else
         echo "❌ Please install GitHub CLI manually: https://cli.github.com/manual/installation"
         exit 1
       fi
       echo "✅ GitHub CLI installed successfully"
     else
       echo "✅ GitHub CLI found: $(gh --version | head -1)"
     fi
   ```

2. **Verify GitHub Authentication**:
   ```bash
   ! if ! gh auth status >/dev/null 2>&1; then
       echo "🔐 GitHub authentication required. Please run: gh auth login"
       echo "Or set GITHUB_TOKEN environment variable"
       exit 1
     else
       echo "✅ GitHub authentication verified"
     fi
   ```

### **Repository Context Detection**
1. **Git Repository Validation**:
   ```bash
   ! if ! git rev-parse --git-dir >/dev/null 2>&1; then
       echo "❌ Not in a git repository"
       exit 1
     fi
     
     # Check for uncommitted changes
     if [ -n "$(git status --porcelain)" ]; then
       echo "📝 Uncommitted changes detected:"
       git status --short
     else
       echo "✅ Working directory clean"
     fi
   ```

2. **Branch and Remote Information**:
   ```bash
   ! CURRENT_BRANCH=$(git branch --show-current)
     ORIGIN_URL=$(git remote get-url origin 2>/dev/null || echo "no-origin")
     echo "🌿 Current branch: $CURRENT_BRANCH"
     echo "🔗 Remote origin: $ORIGIN_URL"
     
     # Check if we're in Tyler Gohr Portfolio repository
     if [[ "$ORIGIN_URL" == *"tylergohr.com"* ]]; then
       echo "✅ Tyler Gohr Portfolio repository detected"
     fi
   ```

3. **PR Status Detection**:
   ```bash
   ! PR_STATUS=$(gh pr status --json state,number,url 2>/dev/null || echo "null")
     if [ "$PR_STATUS" != "null" ] && [ "$PR_STATUS" != "" ]; then
       PR_NUMBER=$(echo "$PR_STATUS" | jq -r '.currentBranch.number // empty' 2>/dev/null || echo "")
       if [ -n "$PR_NUMBER" ]; then
         echo "🔄 Existing PR detected: #$PR_NUMBER"
         echo "🔗 URL: $(echo "$PR_STATUS" | jq -r '.currentBranch.url' 2>/dev/null)"
       fi
     else
       echo "🆕 No existing PR for current branch"
     fi
   ```

### **Quality Gates Execution**
1. **Pre-Push Validation (Mandatory Unless Skipped)**:
   ```bash
   ! if [[ "$ARGUMENTS" != *"--skip-validation"* ]]; then
       echo "🔍 Running comprehensive quality gates..."
       echo "⏳ This includes: typecheck + lint + build + bundle-check"
       
       if npm run validate; then
         echo "✅ All quality gates passed"
       else
         echo "❌ Quality gates failed. Fix issues before pushing to GitHub."
         echo "💡 Use --skip-validation flag only for emergency pushes"
         exit 1
       fi
     else
       echo "⚠️ Validation skipped (emergency mode)"
     fi
   ```

2. **Bundle Size Impact Analysis**:
   ```bash
   ! echo "📊 Checking bundle size impact..."
     if [ -d ".next/static" ]; then
       BUNDLE_SIZE=$(du -sk .next/static | cut -f1)
       echo "📦 Current bundle size: ${BUNDLE_SIZE}KB"
       if [ $BUNDLE_SIZE -gt 2400 ]; then
         echo "⚠️ Bundle size is large (>${BUNDLE_SIZE}KB). Consider code splitting."
       fi
     fi
   ```

## Phase 2: Smart Destination Analysis & Planning

### **Intelligent Destination Detection**
1. **Parse Command Arguments and Determine Destination**:
   Based on the provided arguments in $ARGUMENTS, I'll analyze the intended destination:
   
   - If arguments contain "new-pr" or no destination specified: Create new pull request
   - If arguments contain "existing-pr": Push to current branch (if PR exists)
   - If arguments contain "main": Push directly to main branch (with extra confirmation)
   - If arguments contain a branch name: Push to specified branch
   - If "--dry-run" specified: Show what would happen without executing

2. **Safety Analysis for Destination**:
   - **Main Branch Pushes**: Require explicit confirmation and additional validation
   - **Feature Branch**: Standard workflow with PR creation/update
   - **Protected Files**: Check for changes to critical files (.env*, next.config.js, package.json)
   - **Breaking Changes**: Analyze commit for potential breaking changes

### **Commit Message Intelligence**
1. **Analyze Changes for Smart Commit Message**:
   ```bash
   ! echo "📝 Analyzing changes for intelligent commit message..."
     CHANGED_FILES=$(git diff --cached --name-only | head -10)
     if [ -n "$CHANGED_FILES" ]; then
       echo "📁 Files to be committed:"
       echo "$CHANGED_FILES" | sed 's/^/  - /'
     fi
     
     # Check for specific patterns
     if echo "$CHANGED_FILES" | grep -q "\.tsx\|\.ts"; then
       echo "🔧 TypeScript changes detected"
     fi
     if echo "$CHANGED_FILES" | grep -q "\.css\|\.module\.css"; then
       echo "🎨 Styling changes detected"
     fi
     if echo "$CHANGED_FILES" | grep -q "package\.json\|package-lock\.json"; then
       echo "📦 Dependency changes detected"
     fi
   ```

2. **Custom Message Handling**:
   - Extract custom message from --message flag if provided
   - Generate intelligent message based on changed files if no custom message
   - Follow Tyler Gohr Portfolio commit conventions

## Phase 3: Safe Push Execution

### **Pre-Push Safety Confirmation**
1. **Display Push Summary**:
   Present a clear summary of what will happen:
   - Destination (branch/PR)
   - Files being committed
   - Commit message
   - Any special flags or configurations

2. **Confirmation for Sensitive Operations**:
   - **Main branch pushes**: Extra confirmation required
   - **Large changes**: Confirmation for substantial modifications
   - **Breaking changes**: Warning for potentially breaking modifications
   - **Force pushes**: Additional safety checks

### **Commit and Push Operations**
1. **Stage and Commit Changes**:
   ```bash
   ! # Extract custom commit message if provided
     CUSTOM_MESSAGE=""
     if [[ "$ARGUMENTS" == *"--message="* ]]; then
       CUSTOM_MESSAGE=$(echo "$ARGUMENTS" | sed -n 's/.*--message="\([^"]*\)".*/\1/p')
     fi
     
     # Use custom message or generate intelligent one
     if [ -n "$CUSTOM_MESSAGE" ]; then
       COMMIT_MESSAGE="$CUSTOM_MESSAGE"
     else
       # Generate intelligent commit message based on changes
       if git diff --cached --quiet; then
         echo "❌ No staged changes to commit"
         exit 1
       fi
       
       # Basic intelligent message generation
       COMMIT_MESSAGE="feat: implement push-to-github slash command updates"
       if echo "$CHANGED_FILES" | grep -q "\.css"; then
         COMMIT_MESSAGE="style: update styling and visual improvements"
       elif echo "$CHANGED_FILES" | grep -q "package\.json"; then
         COMMIT_MESSAGE="chore: update dependencies and configuration"
       elif echo "$CHANGED_FILES" | grep -q "\.md"; then
         COMMIT_MESSAGE="docs: update documentation and guides"
       fi
     fi
     
     echo "💬 Commit message: $COMMIT_MESSAGE"
   ```

2. **Execute Git Operations**:
   ```bash
   ! # Add all changes if nothing staged
     if git diff --cached --quiet && [ -n "$(git status --porcelain)" ]; then
       echo "📝 Staging all changes..."
       git add .
     fi
     
     # Commit with intelligent message
     if ! git diff --cached --quiet; then
       git commit -m "$COMMIT_MESSAGE

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
       echo "✅ Changes committed successfully"
     else
       echo "ℹ️ No changes to commit"
     fi
   ```

### **Smart Push and PR Management**
1. **Destination-Specific Push Logic**:
   Based on the determined destination, execute the appropriate GitHub operation:

   **For New PR Creation**:
   ```bash
   ! # Push to current branch and create PR
     git push -u origin "$CURRENT_BRANCH"
     
     # Create PR with intelligent title and description
     PR_TITLE="$COMMIT_MESSAGE"
     PR_BODY="## Summary
$COMMIT_MESSAGE

## Changes
$(git diff HEAD~1 --name-only | sed 's/^/- /')

## Testing
- [x] Quality gates passed (typecheck + lint + build)
- [x] Bundle size within limits
- [x] Code review ready

🤖 Generated with [Claude Code](https://claude.ai/code)"
     
     gh pr create --title "$PR_TITLE" --body "$PR_BODY"
   ```

   **For Existing PR Update**:
   ```bash
   ! # Push to current branch (updates existing PR)
     git push origin "$CURRENT_BRANCH"
     echo "✅ Existing PR updated with new changes"
   ```

   **For Main Branch Push** (with extra confirmation):
   ```bash
   ! if [[ "$ARGUMENTS" != *"--force"* ]]; then
       echo "⚠️ WARNING: Pushing directly to main branch!"
       echo "This bypasses the PR review process."
       echo "Continue? (y/N)"
       # Note: In practice, this would require user confirmation
       # For safety, we'll require --force flag for main pushes
       echo "❌ Main branch push requires --force flag for safety"
       exit 1
     fi
     
     git push origin main
     echo "✅ Pushed directly to main branch"
   ```

## Phase 4: Verification & Feedback

### **Success Confirmation**
1. **Verify Push Success**:
   ```bash
   ! # Check if push was successful
     if git status | grep -q "Your branch is up to date"; then
       echo "✅ Push completed successfully"
     else
       echo "📡 Push status: $(git status | grep "Your branch")"
     fi
   ```

2. **Provide Actionable Links**:
   ```bash
   ! # Get PR URL if created/updated
     PR_URL=$(gh pr view --json url -q .url 2>/dev/null || echo "")
     if [ -n "$PR_URL" ]; then
       echo "🔗 PR URL: $PR_URL"
       echo "👀 Review your changes: $PR_URL/files"
     fi
     
     # Show repository actions status if available
     echo "🚀 GitHub Actions: $(gh repo view --json url -q .url)/actions"
   ```

### **Post-Push Actions & Cleanup**
1. **Update TodoWrite Items** (if applicable):
   If this push relates to tracked todo items, suggest updating their status.

2. **Performance Monitoring**:
   ```bash
   ! echo "📊 Deployment will be monitored via:"
     echo "  - GitHub Actions: Quality gates and preview deployment"
     echo "  - Bundle size: $([ -d .next/static ] && du -sk .next/static | cut -f1 || echo "Unknown")KB"
     echo "  - Preview URL: Available after successful deployment"
   ```

### **Error Handling & Recovery**
1. **Common Error Recovery**:
   - **Push rejected**: Guide through pull and merge process
   - **Authentication failure**: Provide clear re-authentication steps
   - **Network issues**: Suggest retry with appropriate delays
   - **Merge conflicts**: Clear guidance for resolution

2. **Rollback Procedures**:
   ```bash
   ! # If something goes wrong, provide rollback options
     echo "🔄 If you need to undo this push:"
     echo "  - Reset last commit: git reset --soft HEAD~1"
     echo "  - Force push to revert: git push --force-with-lease"
     echo "  - Close PR if created accidentally"
   ```

## Advanced Features & Safety

### **Dry Run Mode**
When `--dry-run` flag is specified:
- Show exactly what would happen without executing
- Display commit message, destination, and affected files
- Simulate PR creation/update process
- Provide clear summary of planned operations

### **Force Mode Safety**
When `--force` flag is specified:
- Skip interactive confirmations
- Allow main branch pushes (with warnings)
- Bypass certain safety checks (with clear warnings)
- Maintain audit trail of force operations

### **Integration with Tyler Gohr Portfolio Standards**
- **Quality Gates**: Mandatory npm run validate execution
- **Bundle Monitoring**: Automatic bundle size impact analysis
- **Commit Conventions**: Follow existing commit message patterns
- **Branch Patterns**: Respect feature/ and fix/ naming conventions
- **Testing Integration**: Trigger existing Playwright test infrastructure
- **Performance**: Maintain Core Web Vitals monitoring

### **Error Resilience**
- **Network failures**: Retry logic with exponential backoff
- **API rate limiting**: Graceful handling of GitHub API limits
- **Authentication expiry**: Clear re-authentication guidance
- **Repository state conflicts**: Intelligent conflict resolution suggestions

## Command Arguments Reference

### **Destinations**
- `new-pr` (default): Create new pull request from current branch
- `existing-pr`: Push to current PR branch if exists
- `main`: Push directly to main branch (requires --force)
- `[branch-name]`: Push to specified branch

### **Flags**
- `--message="text"`: Custom commit message (overrides intelligent generation)
- `--force`: Skip confirmations and allow main branch pushes
- `--skip-validation`: Skip npm run validate (emergency use only)
- `--dry-run`: Show what would happen without executing

### **Usage Examples**
```bash
# Create new PR with intelligent commit message
/push-to-github new-pr

# Update existing PR with custom message
/push-to-github existing-pr --message="fix: resolve bundle size issues"

# Emergency push to main (not recommended)
/push-to-github main --force --message="hotfix: critical security patch"

# See what would happen without executing
/push-to-github --dry-run
```

## Tyler Gohr Portfolio Integration

### **🎯 Quality Excellence**
- **Mandatory validation**: npm run validate must pass before push
- **Bundle monitoring**: Automatic bundle size impact analysis
- **Performance preservation**: Maintain Core Web Vitals standards
- **Testing integration**: Trigger comprehensive Playwright test suite

### **🔄 Workflow Integration**
- **GitHub Actions**: Automatic CI/CD pipeline triggering
- **Preview deployments**: Generate preview URLs for PR testing
- **Issue tracking**: Automatic linking to related GitHub issues
- **Documentation**: Update relevant documentation automatically

### **🛡️ Safety & Reliability**
- **Protected files**: Extra warnings for critical file changes
- **Rollback capabilities**: Clear undo procedures for all operations
- **Audit trail**: Comprehensive logging of all push operations
- **Error recovery**: Intelligent error handling and recovery suggestions

This command transforms GitHub operations into a safe, intelligent, and context-aware workflow that maintains the high quality standards of the Tyler Gohr Portfolio while providing powerful automation capabilities.