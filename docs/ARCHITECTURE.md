# Architecture Guide - Tyler Gohr Portfolio

## Overview

This guide covers the complete technical architecture of the Tyler Gohr Portfolio, including the main portfolio and the `/2` redesign (Enterprise Solutions Architect). The project demonstrates enterprise-grade architecture with modern web technologies, performance optimization, and scalable patterns.

## Project Structure

### **Repository Organization**
```bash
tylergohr.com/
├── src/app/                         # Next.js 14+ App Router architecture
│   ├── layout.tsx                   # Main portfolio layout
│   ├── page.tsx                     # Main portfolio homepage
│   ├── globals.css                  # Global styles and CSS reset
│   ├── 2/                          # /2 redesign (Enterprise Solutions Architect)
│   │   ├── layout.tsx               # Enterprise metadata and navigation
│   │   ├── page.tsx                 # Enterprise homepage
│   │   ├── template.tsx             # Page transitions with Framer Motion
│   │   ├── styles/brand-tokens.css  # Complete design system
│   │   ├── components/              # /2-specific component library
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── lib/                     # Utility libraries
│   │   ├── case-studies/            # Detail page route
│   │   ├── how-i-work/              # Detail page route
│   │   └── technical-expertise/     # Detail page route
│   ├── api/                         # Next.js API routes
│   │   ├── contact/route.ts         # Contact form submission
│   │   └── health/route.ts          # Health check endpoint
│   └── blog/                        # Blog system with MDX support
├── public/                          # Static assets
├── content/blog/                    # MDX blog content
├── docs/                           # Project documentation
├── scripts/                        # Development and deployment automation
├── e2e/                            # Playwright E2E tests
└── .vscode/                        # VS Code integration and automation
```

## Main Portfolio vs /2 Redesign Architecture

### **Shared Infrastructure**
```bash
# Common foundation
- Next.js 14+ App Router
- TypeScript throughout
- Same deployment pipeline (Google Cloud Run)
- Shared API routes and health checks
- Common performance monitoring
- Same quality gates and testing standards
```

### **Architectural Separation**
```bash
# Main Portfolio (/)
- Focus: Full-stack developer & creative problem solver
- Styling: Global CSS with modern features
- Navigation: Creative, portfolio-focused
- Content: Projects, blog, technical showcases
- Brand: Creative developer with cutting-edge skills

# /2 Redesign (/2)
- Focus: Enterprise Solutions Architect
- Styling: Brand tokens system with CSS modules
- Navigation: Professional, business-focused
- Content: Business impact, enterprise case studies
- Brand: Emmy Award, Fox Corporation, Warner Bros experience
```

## /2 Redesign Architecture Deep Dive

### **Layout & Routing System**
```bash
# /2 Layout Structure (src/app/2/layout.tsx)
- Enterprise-specific metadata and SEO
- Structured data (JSON-LD) for business positioning
- Performance optimizations (hero image preloading)
- Accessibility features (skip navigation, ARIA)
- /2-specific navigation component integration

# Route Organization
/2                          # Enterprise homepage
/2/case-studies            # Detailed project showcases  
/2/how-i-work              # Process methodology deep dive
/2/technical-expertise     # Comprehensive skills demonstration
```

### **Component Architecture**
```bash
# Component Library Organization (src/app/2/components/)
├── About/                           # Network animation & Emmy Award background
│   ├── About.tsx                    # Main about section
│   ├── NetworkAnimation.tsx         # Dynamic node connections
│   └── NetworkAnimation3D.tsx       # 3D enhanced version
├── BrowserTabs/                     # Cross-page tab simulation
│   ├── BrowserTabs.tsx              # Tab interface with keyboard navigation
│   ├── CaseStudyContent.tsx         # Case studies tab content
│   └── TechnicalExpertiseContent.tsx # Technical expertise content
├── CaseStudies/                     # Interactive project showcases
│   ├── CaseStudiesPreview.tsx       # Homepage preview cards
│   ├── CaseStudyCard.tsx           # Individual project cards
│   └── CaseStudyCard3D.tsx         # 3D enhanced project cards
├── Contact/                         # Professional engagement
│   ├── ContactSection.tsx           # Main contact component
│   ├── ContactForm.tsx             # Form with validation
│   └── ContactInfo.tsx             # Contact information display
├── Hero/                           # Enterprise positioning
│   ├── Hero.tsx                    # Main hero section
│   └── LogoFloat.tsx               # Animated logo element
├── HowIWork/                       # Process methodology
│   └── HowIWorkPreview.tsx         # Process highlights (7 steps)
├── Navigation/                     # /2-specific navigation
│   ├── Navigation.tsx              # Main navigation component
│   └── DropdownMenu.tsx           # Hover-enhanced dropdowns
├── Results/                        # Business impact metrics
│   ├── Results.tsx                 # Results section container
│   └── MetricCard.tsx             # Animated metric displays
├── Scene/                          # React Three Fiber 3D
│   ├── BasicScene.tsx              # 3D scene setup
│   ├── BasicSceneClient.tsx        # Client-side 3D rendering
│   └── SceneErrorBoundary.tsx      # Error handling for 3D
├── ScrollEffects/                  # Advanced scroll animations
│   ├── MobileScrollOptimizer.tsx   # Mobile performance optimization
│   ├── ParallaxController.tsx      # Parallax effect management
│   ├── ScrollSections.tsx          # Section-based scroll effects
│   ├── TechnicalStorytellingScroll.tsx # Technical content scroll
│   └── WebGLParallax.tsx          # WebGL-powered effects
├── TechnicalExpertise/             # Skills demonstration
│   ├── TechnicalExpertisePreview.tsx # Glassmorphism skill cards
│   ├── InteractiveArchitectureDiagram.tsx # System architecture viz
│   └── ScrollEnhancedArchitectureDiagram.tsx # Scroll-driven diagrams
└── ui/                            # Shared UI components
    ├── Button/                     # Reusable button component
    └── Card/                       # Base card component
```

### **Preview/Detail Pattern**
```bash
# Consistent architectural pattern across /2 redesign
Homepage Previews → Detail Pages:

1. CaseStudiesPreview.tsx → /2/case-studies (page.tsx)
   - 4 interactive project cards → Full project case studies
   - Deep linking from cards to specific browser tabs

2. HowIWorkPreview.tsx → /2/how-i-work (page.tsx)  
   - 7 process steps in staircase design → Complete methodology

3. TechnicalExpertisePreview.tsx → /2/technical-expertise (page.tsx)
   - 4 glassmorphism skill cards → Comprehensive technical showcase
```

## Brand Tokens & Design System

### **Brand Tokens Architecture**
```bash
# Central design system (src/app/2/styles/brand-tokens.css)
:root {
  /* Section-specific color system */
  --hero-bg: #0a0a0a;           /* Pure black for hero */
  --about-bg: #1a1a1a;          /* Dark grey for about */
  --results-bg: #10b981;        /* Success green for results */
  --case-studies-bg: #1d4ed8;   /* Navy blue for case studies */
  --how-i-work-bg: #ec4899;     /* Hot pink for process */
  --contact-bg: #fbbf24;        /* Bright yellow for contact */
  
  /* Typography system */
  --font-family-primary: 'JetBrains Mono', monospace;
  --text-on-dark: #ffffff;      /* Text on dark sections */
  --text-on-light: #000000;     /* Text on bright sections */
  
  /* Responsive typography scale */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  
  /* Layout system */
  --container-padding: clamp(1rem, 4vw, 2rem);
  --section-spacing: clamp(2rem, 8vw, 4rem);
}
```

### **Responsive Design System**
```bash
# Breakpoint system
--mobile: 320px                     # Base mobile design
--tablet: 768px                     # iPad breakpoint  
--desktop: 1200px                   # Laptop/desktop
--wide: 1400px                      # Large monitors

# Container query approach for component responsiveness
@container (min-width: 768px) {
  .component { /* Tablet+ styles */ }
}
```

## Technology Stack & Dependencies

### **Core Framework**
```bash
# Next.js 14+ App Router
- React 19.1.0 (latest stable)
- TypeScript 5.8.3
- Next.js 15.3.4 with App Router
- CSS Modules for component styling
- MDX for blog content system
```

### **Styling & Animation**
```bash
# Modern CSS & Animation
- CSS Modules with brand tokens
- Framer Motion 12.19.1 (page transitions, animations)
- CSS Grid Subgrid for complex layouts
- Container Queries for responsive components
- Scroll-driven Animations (native CSS)
```

### **3D & Graphics**
```bash
# React Three Fiber ecosystem
- @react-three/fiber 9.2.0 (3D scenes)
- @react-three/drei 10.4.2 (utilities)
- three.js 0.178.0 (3D graphics)
- WebGL detection and fallbacks
```

### **Testing & Quality**
```bash
# Playwright-only testing approach
- @playwright/test 1.53.1
- @axe-core/playwright 4.10.2 (accessibility)
- Cross-browser testing (Chrome, Firefox, Safari)
- Visual regression testing
- Performance monitoring (Core Web Vitals)
```

### **Development & Automation**
```bash
# Development tooling
- ESLint 9.29.0 with Next.js config
- TypeScript strict mode
- VS Code integration and tasks
- Claude Code hooks system
- Puppeteer 24.11.1 (screenshot automation)
```

## Performance Architecture

### **Core Web Vitals Optimization**
```bash
# Performance targets for /2 redesign
- LCP (Largest Contentful Paint): <2.5s
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1
- Bundle Size: <6MB budget

# Optimization strategies
- Hero image preloading (fetchPriority="high")
- Font preconnections (Google Fonts)
- Image optimization (AVIF, WebP formats)
- Code splitting and lazy loading
- CSS optimization and minification
```

### **Bundle Optimization**
```bash
# webpack optimizations (next.config.js)
- Standalone output for containerized deployment
- Package import optimization (lucide-react)
- Image optimization with multiple formats
- CSS bundle splitting and optimization
- Cache headers for static assets
```

### **Animation Performance**
```bash
# 60fps animation standards
- GPU acceleration for 3D transforms
- CSS-based animations over JavaScript when possible
- Reduced motion compliance (prefers-reduced-motion)
- Mobile performance optimization
- Intersection Observer for scroll-triggered animations
```

## API & Data Architecture

### **API Routes**
```bash
# Next.js API architecture (src/app/api/)
/api/contact                        # Contact form submission
  - POST: Process form data
  - Email delivery via Nodemailer
  - Rate limiting (5 requests/minute)
  - Input validation and sanitization

/api/health                         # Health check endpoint
  - GET: System health status
  - Database connectivity checks
  - Performance metrics
  - Deployment validation
```

### **Data Flow**
```bash
# Contact form architecture
ContactForm.tsx → /api/contact → Nodemailer → tyler@tylergohr.com
  ↓
Form validation (client + server)
Rate limiting protection
Error handling and user feedback
Success confirmation and analytics
```

### **Content Management**
```bash
# Blog system (MDX)
content/blog/2025/
├── invoice-chaser-architecture.md  # Technical deep-dives
└── modern-css-techniques.md        # Development tutorials

# Content processing
- MDX compilation with @next/mdx
- Syntax highlighting with Prism
- Responsive image optimization
- SEO optimization and metadata
```

## Deployment Architecture

### **Google Cloud Run Configuration**
```bash
# Containerized deployment
- Docker with Next.js standalone output
- Automatic HTTPS with custom domain (tylergohr.com)
- Auto-scaling based on traffic
- Health check integration (/api/health)
- Environment variable management
```

### **CI/CD Pipeline**
```bash
# GitHub Actions workflow
1. Code quality gates (TypeScript, ESLint)
2. Production build validation
3. Playwright E2E test suite
4. Performance testing (Core Web Vitals)
5. Container build and deployment
6. Health check validation
```

### **Environment Management**
```bash
# Multi-environment support
- Local development (localhost:3000)
- Google Cloud Workstations (cloud development)
- Preview deployments (feature branches)
- Production deployment (main branch)
```

## Security Architecture

### **Security Headers & Protection**
```bash
# next.config.js security configuration
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Content Security Policy for images
- HTTPS enforcement
- Rate limiting on API endpoints
```

### **Data Protection**
```bash
# Contact form security
- Input validation and sanitization
- Rate limiting (5 requests/minute)
- CSRF protection
- Server-side validation
- Secure email delivery
```

## Accessibility Architecture

### **WCAG 2.1 AA Compliance**
```bash
# Accessibility features (/2 layout)
- Skip navigation link
- ARIA live regions for announcements
- Semantic HTML structure
- Keyboard navigation support
- Focus management and visibility
- Screen reader compatibility
- Color contrast compliance (21:1 ratios)
```

### **Interactive Accessibility**
```bash
# Component accessibility patterns
- BrowserTabs: Full keyboard navigation (arrow keys, Enter, Space)
- Forms: Proper labeling and error handling
- Animations: Reduced motion compliance
- Images: Descriptive alt text
- Navigation: ARIA landmarks and roles
```

## Integration Patterns

### **Context Switching Architecture**
```bash
# Main portfolio ↔ /2 redesign
- Independent routing systems
- Shared infrastructure (API, deployment)
- Separate styling approaches
- Different navigation patterns
- Context-aware development workflows
```

### **Component Reusability**
```bash
# Shared components
- PerformanceOptimizations (both layouts)
- WebVitals monitoring (both layouts)
- Common UI patterns (buttons, cards)

# /2-specific components
- Complete component isolation
- Brand tokens integration
- Enterprise-focused functionality
```

---

**Architecture Focus**: Enterprise-grade scalability with modern web technologies  
**Performance**: <2.5s LCP, 60fps animations, <6MB bundle budget  
**Accessibility**: WCAG 2.1 AA compliance with enterprise presentation standards  
**Deployment**: Containerized Google Cloud Run with automatic scaling