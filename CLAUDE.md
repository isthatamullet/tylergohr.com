# Tyler Gohr Portfolio - Claude Code Project Context

## Quick Project Reference
**Mission**: Create a high-end, creative portfolio website showcasing full-stack development mastery through interactive project demonstrations  
**Status**: 🚀 Production Deployed - tylergohr.com Live  
**Current Priority**: Check GitHub issues for latest development focus and priorities

## Project Goals
- **Primary Purpose**: Demonstrate technical mastery through interactive showcases
- **Live Domain**: tylergohr.com (✅ Production Ready - deployed on Google Cloud Run)
- **Brand Focus**: Confident developer creating impressive, innovative solutions
- **Creative Freedom**: Experimental and artistic approach to web development showcase

## GitHub Repository & Status Tracking
- **Username**: `isthatamullet`
- **Repository**: `tylergohr.com`
- **Full URL**: https://github.com/isthatamullet/tylergohr.com
- **GitHub CLI**: Always use `gh` commands with correct repo context

### 📋 Issue-Based Status System
- **Primary Planning**: #1 - High-End Portfolio Website Implementation (overall roadmap)
- **Latest Completion**: #13 - Professional PR Workflow with Staging Previews (enterprise-grade CI/CD)
- **Previous Milestone**: #5 - Phase 5.5 Jest Testing Framework & Domain Setup
- **Current Work**: Check most recent GitHub issues for active development
- **Next Priorities**: Reference open issues labeled with phase numbers

### 🔍 Quick Status Commands
```bash
# Get current project status
gh issue list --state open --label "current-work"

# Check latest completed work
gh issue view 5  # Phase 5.5 completion details

# View overall roadmap
gh issue view 1  # Master planning issue
```

## Tech Stack (Cutting-Edge 2025)
- **Framework**: Next.js 14+ with App Router + TypeScript (modern development practices)
- **Styling**: CSS Modules with cutting-edge CSS features (🚫 NO Tailwind)
- **Advanced CSS**: Container Queries, CSS Grid Subgrid, Scroll-driven Animations
- **Performance**: Core Web Vitals optimization, Lighthouse 90+ scores
- **Design**: Dark theme with strategic green/red business accents
- **Production Deployment**: ✅ Google Cloud Run (Live at tylergohr.com)

## Essential Development Commands
```bash
# Development workflow
npm run dev                 # Next.js dev server (typically port 3000)
npm run build              # Production build test
npm run start              # Production preview locally

# Quality assurance (✅ All operational)
npm run typecheck          # TypeScript validation
npm run lint               # ESLint validation
npm test                   # Jest testing framework (Phase 5.5 complete)

# Production deployment (✅ Active - PR-based workflow)
# Automated via GitHub Actions → Google Cloud Run
# PREFERRED: Use PR workflow for all changes (see PR Workflow section below)

# PR Workflow Commands (✅ Enterprise-grade preview system operational)
gh pr create --title "Feature description" --body "PR details"  # Create PR with preview
gh pr view <PR_NUMBER> --web                                   # View PR in browser
gh pr merge <PR_NUMBER> --squash --delete-branch               # Merge to production

# Preview URL Testing (✅ Real browser testing on Cloud Run)
# Preview URLs automatically generated for each PR
# Test cross-device: iPhone, iPad, desktop browsers
# Mobile-specific responsive validation essential

# Documentation & Status
# Reference docs/DEPLOYMENT.md for deployment procedures  
# Reference docs/PREVIEW-DEPLOYMENTS.md for preview system
# Check GitHub issue #13 for latest PR workflow implementation
```

## Development Protocols

### 🔴 MANDATORY Pre-Work Checklist
1. **Check GitHub Issues** - Use `gh issue list` to understand current priorities and status
2. **Read TodoList** - Always use TodoRead to understand current task state  
3. **Reference Documentation** - Check `docs/DEPLOYMENT.md` for technical procedures
4. **Verify System Status** - Run quality gates (typecheck, lint, test) before starting
5. **Read Before Edit** - Never blind edit files, always Read first
6. **Document Work** - Create GitHub issues for significant features or fixes

### 🚨 MANDATORY Pre-Commit Quality Gates
**CRITICAL**: Always run this complete sequence before committing to prevent CI/CD failures:

```bash
# Complete quality validation sequence - ALL must pass:
npm run typecheck    # TypeScript validation (Server/Client component compatibility)
npm run lint         # ESLint code quality standards  
npm test            # Jest test suite (component integration)
npm run build       # 🔥 CRITICAL: Production build validation (SSG/SSR compatibility)
```

**Why Each Step Matters:**
- **`npm run typecheck`**: Catches TypeScript errors, Server/Client component mismatches
- **`npm run lint`**: Enforces code standards, catches potential issues
- **`npm test`**: Validates component behavior, prevents regressions
- **`npm run build`**: 🔥 **MOST CRITICAL** - Catches Next.js SSG/SSR serialization errors that only surface in production builds

**Golden Rule**: `npm run dev` success ≠ production build success. Always validate with `npm run build` before committing, especially when:
- Adding event handlers to components
- Mixing Server Components with Client Components  
- Working with Next.js SSG/SSR features
- Passing functions between components

**Quick Pre-Commit Validation:**
```bash
# Single command validation (add to package.json scripts)
npm run validate    # Runs: typecheck && lint && test && build
```

### 🎨 Creative Design Principles
- **Dark Theme Sophistication**: High-contrast design with professional aesthetics
- **Strategic Color Usage**: Green/red accents representing business logic and accounting principles
- **Typography Excellence**: Modern variable fonts enhancing technical presentation
- **Interactive Storytelling**: Every element demonstrates technical mastery through experience
- **Mobile-First Artistry**: Touch-optimized experiences maintaining desktop sophistication
- **Brand Voice**: Confident expertise demonstrated through interactive experiences

### 🚀 Cutting-Edge CSS Features (2025)
- **Container Queries**: Responsive components adapting intelligently to container context
- **CSS Grid Subgrid**: Perfect alignment creating visually stunning, complex layouts
- **CSS Custom Properties**: Dynamic theming system showing technical sophistication
- **Scroll-Driven Animations**: Native CSS animations creating smooth, performance-optimized experiences
- **CSS Logical Properties**: Modern responsive design showcasing current best practices

### 🛡️ File Protection Rules
**NEVER modify without explicit user confirmation:**
- `.env*` files (any environment configuration)
- `next.config.js`, `package.json` (except with explicit permission)
- Any file containing API keys or future deployment credentials

### 🧪 Testing Best Practices
- **Component Testing**: Jest + React Testing Library for interactive components
- **Performance Testing**: Lighthouse CI for Core Web Vitals monitoring
- **Cross-Browser Testing**: Modern browser support with graceful degradation
- **Accessibility Testing**: WCAG 2.1 AA compliance verification
- **Animation Testing**: Smooth 60fps performance across devices

### 🔄 Git Commit Best Practices
- **Portfolio-Focused Commits**: "Add interactive project showcase", "Implement scroll-driven animations"
- **ALWAYS commit ALL pending files**: Include all related changes in single commits
- **Document Creative Features**: Clear commit messages explaining interactive implementations
- **Performance Tracking**: Note performance improvements in commit messages

## 🚀 PR Workflow & Preview System (✅ Operational)

### **Enterprise-Grade Development Workflow**
**Status**: Fully implemented and production-tested (Issue #13 complete)

### 🌟 **PR-Based Development Process**
1. **Create Feature Branch**: `git checkout -b feature/descriptive-name`
2. **Develop & Commit**: Make changes with clear commit messages
3. **Push Branch**: `git push -u origin feature/descriptive-name`
4. **Create PR**: `gh pr create --title "Clear title" --body "Description"`
5. **Preview URL Generated**: Automatic Cloud Run deployment (~5 minutes)
6. **Cross-Device Testing**: Test on iPhone, iPad, desktop browsers
7. **Merge to Production**: `gh pr merge --squash --delete-branch`

### 🌐 **Preview URL System**
**URL Format**: `https://portfolio-pr-<NUMBER>-<BRANCH-NAME>-<HASH>.a.run.app`

**Features**:
- ✅ **Automatic Generation**: Every PR gets unique Cloud Run preview URL
- ✅ **Real Browser Testing**: Actual device testing, not just dev tools
- ✅ **Cross-Device Validation**: Essential for responsive design issues
- ✅ **Performance Testing**: Production-like environment with real metrics
- ✅ **Automatic Cleanup**: Preview environments deleted on PR close/merge

### ⚡ **CI/CD Pipeline Performance**
**Complete Enterprise Pipeline**: ~5 minutes total
1. **Quality Gates** (53s): TypeScript, ESLint, build validation
2. **Testing Suite** (27s): Jest component testing
3. **Preview Deployment** (2m34s): Docker build, Cloud Run deployment
4. **Security Analysis** (58s): Container vulnerability scanning
5. **PR Summary** (4s): GitHub notification and results

### 📱 **Cross-Device Testing Protocol**
**Essential Discovery**: Mobile responsive issues only found through actual device testing

**Testing Requirements**:
- **iPhone**: Test mobile-specific responsive behavior
- **iPad**: Validate tablet experience and touch interactions  
- **Desktop**: Confirm desktop functionality and performance
- **Cross-Browser**: Chrome, Firefox, Safari compatibility

**Mobile Considerations**:
- Viewport height differences affect visual positioning
- Touch interactions vs mouse behaviors
- Mobile-specific CSS media queries may be needed
- Navigation behavior varies between devices

### 🏗️ **Branch Naming Best Practices**
**Docker Tag Compatibility**: Branch names affect CI/CD pipeline

**Guidelines**:
- **Keep Under 20 Characters**: Avoid Docker tag truncation issues
- **Use Descriptive Names**: `feature/hero-positioning` vs `feature/adjust-hero-positioning`
- **Avoid Special Characters**: Stick to letters, numbers, hyphens
- **Examples**: `feature/nav-fix`, `feature/mobile-responsive`, `feature/animation-polish`

### 🛠️ **Troubleshooting Common Issues**
**Docker Tag Failures**: Branch name too long or ends with hyphen after sanitization
- **Solution**: Use shorter, descriptive branch names
- **Example**: `feature/hero-up` instead of `feature/adjust-hero-positioning`

**Preview URL Not Updating**: Code changes not reflecting in preview
- **Check**: Ensure you're testing preview URL, not production (tylergohr.com)
- **Wait**: Allow 5 minutes for complete CI/CD pipeline completion

**Mobile Differences**: Change visible on desktop but not mobile
- **Solution**: Add mobile-specific CSS with media queries
- **Test**: Use actual devices, not just browser dev tools

## Featured Project Integration

### 📊 Invoice Chaser Showcase Strategy
**Creative Technical Storytelling**:
- **Problem-Solution Narrative**: Automation reducing payment times 25-40% through elegant code
- **Architecture Deep-Dive**: Interactive diagrams explaining system design decisions
- **Technology Demonstration**: React.js, Node.js, PostgreSQL, Socket.IO real-time features
- **Integration Challenges**: QuickBooks/Gmail APIs, Stripe webhooks, Firebase authentication
- **Live Demo Elements**: Actual system interaction with sanitized data (future implementation)
- **Code Walkthrough**: Syntax-highlighted examples showing implementation approaches

### 🎯 Technical Excellence Display
- **Real-time Features**: Socket.IO implementation with live progress updates
- **Payment Processing**: Stripe integration architecture and webhook handling
- **Cloud Infrastructure**: Google Cloud Run setup and DevOps pipeline
- **Database Design**: PostgreSQL schema and optimization strategies
- **Security Implementation**: Authentication and API protection methods
- **DevOps Automation**: Enterprise-grade PR preview deployment system with automatic staging environments

## Creative Interactive Elements

### 🎨 Visual Design System
```css
/* Portfolio Color Palette */
--portfolio-dark: #0a0a0a;           /* Primary dark background */
--portfolio-accent-green: #16a34a;   /* Business success indicator */
--portfolio-accent-red: #dc2626;     /* Business urgency indicator */
--portfolio-text-primary: #f8fafc;   /* High contrast text */
--portfolio-text-secondary: #94a3b8; /* Secondary information */
--portfolio-interactive: #2563eb;    /* Interactive elements */
```

### 🎪 Animation & Interaction Portfolio
- **Multi-layered Parallax**: Sophisticated 3D depth illusion demonstrating advanced CSS mastery
- **Glassmorphism Elements**: Elegant frosted glass effects with backdrop blur artistry
- **Intelligent Scroll Snap**: Seamless section navigation enhancing user experience storytelling
- **Thoughtful Micro-interactions**: Hover transformations and morphing animations showing attention to detail
- **Dynamic Visual Responses**: Shadows and elements responding to user interaction

### 💻 Developer-Focused Creative Features
- **Live Code Demonstrations**: Syntax-highlighted examples showing actual implementation approaches
- **Development Environment Aesthetics**: Subtle terminal/IDE references creating authentic developer atmosphere
- **Interactive Architecture Visualizations**: Clickable system diagrams explaining technical decisions
- **Real-Time Performance Showcases**: Live metrics demonstrating optimization expertise
- **Animated Code Storytelling**: Typing animations that walk through problem-solving processes

## Performance Excellence Standards

### 🚀 Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: <2.5s proving optimization expertise
- **FID (First Input Delay)**: <100ms demonstrating responsive interactions
- **CLS (Cumulative Layout Shift)**: <0.1 showing professional layout stability
- **Lighthouse Scores**: 90+ across Performance, Accessibility, Best Practices, SEO

### 📱 Mobile-First Creative Innovation
- **Touch-Optimized Parallax**: Smooth mobile scrolling that maintains desktop sophistication
- **Gesture-Enhanced Navigation**: Intuitive swipe interactions for project exploration
- **Progressive Creative Enhancement**: Advanced effects that showcase technical knowledge while remaining accessible
- **Inclusive Motion Design**: Respects accessibility preferences while demonstrating animation expertise

## 📋 Project Status & Development Phases

### ✅ Current Production Status
- **Live Website**: https://tylergohr.com (Google Cloud Run deployment)
- **Testing Framework**: Phase 5.5 Complete (Jest + GitHub Actions CI/CD)
- **Documentation**: Complete deployment guide in `docs/DEPLOYMENT.md`
- **Reference**: GitHub issue #5 for latest technical completion details

### 🔄 Dynamic Phase Tracking
**Important**: For current development status, always check GitHub issues rather than static lists below.

```bash
# Get real-time project status
gh issue view 1    # Overall project roadmap and phase tracking
gh issue list --state open --label "current-work"  # Active development
gh issue list --state closed --label "milestone"   # Completed phases
```

### 📈 Phase Framework (Reference - Check Issues for Current Status)
**Phase 1-5.5**: ✅ **COMPLETED** (See GitHub issue #5 for completion details)
- Creative Foundation & Architecture
- Interactive Animations & Effects  
- Portfolio Showcase & Technical Storytelling
- Advanced Features & Polish
- Testing Framework Excellence

**Next Phases**: Check GitHub issues for current priorities
- **Phase 5.3**: Analytics Integration (Privacy-First Monitoring)
- **Phase 5.4**: Blog System (Technical Content Platform)
- **Phase 5.6**: Production Optimization & Monitoring

### 🎯 Issue Labeling System for Development Tracking
To maintain accurate project status, use these GitHub issue labels:

**Status Labels:**
- `milestone` - Major phase completions (like issue #5)
- `current-work` - Active development tasks  
- `next-phase` - Planned upcoming features
- `reference` - Documentation and context issues

**Development Labels:**
- `phase-5.3` - Analytics Integration work
- `phase-5.4` - Blog System development
- `phase-5.6` - Production optimization
- `enhancement` - Feature improvements
- `bug` - Issues requiring fixes

**Quick Reference Commands:**
```bash
# Check what's currently being worked on
gh issue list --label "current-work" --state open

# See completed milestones  
gh issue list --label "milestone" --state closed

# View next planned work
gh issue list --label "next-phase" --state open
```

## Content & Creative Expression Strategy

### 🎭 Brand Voice & Messaging
- **Tone**: Confident, knowledgeable, creative with authentic technical depth
- **Approach**: "Here's how I solve complex problems" rather than "hire me" messaging
- **Technical Balance**: Deep expertise accessible to both technical and non-technical audiences
- **Natural Integration**: Contact information seamlessly integrated into portfolio experience
- **SEO Strategy**: Optimized for "innovative web developer", "creative full-stack engineer", "technical problem solver"

### 📝 Technical Storytelling Elements
- **Hero Narrative**: Creative introduction with animated typing effects and parallax storytelling
- **Skills Demonstration**: Technical expertise shown through dynamic, interactive progress indicators
- **Project Deep-Dives**: Detailed case studies with interactive architecture explorations
- **Development Philosophy**: Professional approach and problem-solving methodology
- **Technical Expertise**: Clear demonstration of capabilities through interactive examples
- **Knowledge Sharing**: Technical insights and development experiences
- **Professional Accessibility**: Contact information present but integrated naturally into portfolio experience

## Local Development Setup

### 🔧 Development Environment
- **Framework**: Next.js 14+ with App Router for modern React patterns
- **TypeScript**: Strict configuration for code quality
- **CSS Architecture**: CSS Modules with cutting-edge features
- **Performance**: Built-in optimization and monitoring
- **Testing**: Jest + React Testing Library (when implemented)

### 🌐 Future Deployment Planning
- **Platform**: Google Cloud Run (when ready to deploy)
- **Domain**: tylergohr.com custom domain setup
- **CI/CD**: GitHub Actions for automated deployment
- **Monitoring**: Performance and uptime tracking
- **Analytics**: Portfolio interaction insights

## Success Metrics for Creative Portfolio

### 🎯 Development & Technical Demonstration
- **Code Quality**: Clean, readable implementation that serves as a portfolio piece itself
- **Animation Performance**: 60fps interactive effects demonstrating technical execution
- **Cross-Device Experience**: Consistent excellence across all device types and browsers
- **Accessibility Compliance**: Full WCAG 2.1 AA adherence proving inclusive development skills
- **Performance Metrics**: Actual site performance proving optimization claims

### 📊 Creative Excellence
- **Portfolio Interaction**: Time spent exploring projects, code examples, and technical demos
- **Technical Depth**: Scroll depth through project case studies and architecture explanations
- **Interactive Element Usage**: Engagement with live demos, code samples, and visual effects
- **Creative Innovation**: Balancing artistry with technical sophistication

## Quick Development Workflows

### Starting a Development Session (PR-Based)
1. **Check Current Status**: Use `gh issue list` and TodoRead for priorities
2. **Create Feature Branch**: `git checkout -b feature/descriptive-name`
3. **Review Requirements**: Check relevant GitHub issues for specifications
4. **Run Quality Gates**: Verify `npm run typecheck` and `npm run lint` pass
5. **Plan Complex Features**: Use TodoWrite for multi-step implementations

### PR-Based Development Process
1. **Start with mobile-first responsive foundation**
2. **Layer in cutting-edge CSS features incrementally**
3. **Commit changes with descriptive messages**
4. **Create PR**: `gh pr create` with clear title and description
5. **Wait for preview URL**: ~5 minutes for complete CI/CD pipeline
6. **Cross-device testing**: iPhone, iPad, desktop validation
7. **Iterate if needed**: Push updates, preview URL auto-updates
8. **Merge when satisfied**: `gh pr merge --squash --delete-branch`

### Cross-Device Testing & Quality Assurance
1. **Preview URL Testing**: Use actual devices, not just dev tools
2. **Mobile Responsive Validation**: Check iPhone-specific behavior
3. **Performance Monitoring**: Core Web Vitals in production-like environment
4. **Accessibility Testing**: WCAG 2.1 AA compliance across devices
5. **Animation Performance**: Ensure 60fps smooth interactions on all devices
6. **Cross-Browser Compatibility**: Chrome, Firefox, Safari validation

## 📚 Documentation & Reference System

### 🔗 Key Documentation Sources
- **GitHub Issues**: Primary source for current status and detailed work logs
- **docs/DEPLOYMENT.md**: Complete technical deployment procedures and troubleshooting
- **CLAUDE.md** (this file): Core project structure and reference system
- **README.md**: Public project overview and setup instructions

### 📋 Status Reference Hierarchy
1. **Real-time Status**: GitHub issues (most current)
2. **Technical Procedures**: docs/DEPLOYMENT.md (deployment & troubleshooting)
3. **Project Structure**: CLAUDE.md (core context & navigation)
4. **Historical Context**: Closed GitHub issues (completed work & decisions)

### 🎯 Quick Navigation for Claude Sessions
```bash
# Start any session with these commands
gh issue view 5              # Latest major completion (Phase 5.5)
gh issue view 1              # Overall project roadmap
gh issue list --state open   # Current priorities

# Reference technical procedures
cat docs/DEPLOYMENT.md       # When working on deployment/infrastructure
cat CLAUDE.md               # For project context and structure
```

## 🚀 Current Production Status

**Live Website**: https://tylergohr.com  
**Status**: ✅ Production Ready - Modern Next.js portfolio deployed on Google Cloud Run  
**Last Major Update**: Phase 5.5 Complete (Jest Testing Framework + Domain Setup)  
**Pipeline Optimization**: ⚡ Fast-track deployment for content changes implemented  
**Preview System**: 🌐 Enterprise-grade PR preview deployments with automatic Cloud Run staging  
**Next Development**: Check GitHub issues for current priorities

This dynamic documentation system ensures Claude always has access to current, accurate project information while maintaining comprehensive technical references for all deployment and development procedures.