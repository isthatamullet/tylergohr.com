# Original Main Site Archive

## Overview
This archive contains the complete original main site that was replaced by the /2 redesign promotion on January 9, 2025.

## Original Site Characteristics
- **Brand**: "Tyler Gohr - Full-Stack Developer & Creative Problem Solver"
- **Focus**: Creative web development, innovative solutions, technical artistry
- **Navigation**: ConditionalTopNavigation system
- **Styling**: Global CSS with component modules
- **Components**: 27 components in creative portfolio style

## Archive Contents

### `/app/` - Core Application Files
- `layout.tsx` - Original main layout with "Full-Stack Developer" branding
- `page.tsx` - Original homepage with ParallaxSection and ProjectShowcase
- `page.module.css` - Homepage styling
- `globals.css` - Global styles and CSS variables

### `/components/` - Component Library (27 components)
- `ConditionalTopNavigation.tsx` - Navigation system that avoided /2 routes
- `ParallaxSection.tsx` - Creative parallax effects
- `ProjectShowcase.tsx` - Interactive project display
- `ProjectDeepDive.tsx` - Project detail modal
- `SkillsSection.tsx` - Skills presentation
- `ContactSection.tsx` - Contact form and information
- `[additional components]` - Complete component library

### `/lib/` - Utility Libraries
- `projects.ts` - Project data and definitions
- `types.ts` - TypeScript type definitions
- `blog.ts` - Blog system utilities
- `photoData.ts` - Photo gallery data
- `blog-types.ts` - Blog type definitions
- `mdx-blog.ts` - MDX blog processing

## Restoration Instructions
If you need to restore the original main site:

1. **Backup Current State** (if needed):
   ```bash
   cp -r src/app/layout.tsx backup-current-layout.tsx
   cp -r src/app/page.tsx backup-current-page.tsx
   cp -r src/components backup-current-components
   ```

2. **Restore Original Files**:
   ```bash
   cp archive/original-main-site/app/* src/app/
   cp -r archive/original-main-site/components/* src/components/
   cp -r archive/original-main-site/lib/* src/lib/
   ```

3. **Update package.json** if needed (check for any /2-specific dependencies)

4. **Validate Restoration**:
   ```bash
   npm run validate
   npm run test:e2e:smoke
   ```

5. **Test Original Site**:
   ```bash
   npm run dev
   # Visit localhost:3000 to verify original site is restored
   ```

## Original Site Routes
- `/` - Homepage with creative parallax hero
- `/blog` - Blog system (preserved)
- `/blog/[slug]` - Individual blog posts (preserved)
- `/api/contact` - Contact form API (preserved)
- `/api/health` - Health check (preserved)

## Original Site Features
- **Creative Hero**: Parallax background with glassmorphism effects
- **Project Showcase**: Interactive project cards with deep-dive modals
- **Skills Section**: Animated skill demonstrations
- **Contact Form**: Integrated contact submission
- **Blog System**: MDX-powered blog with syntax highlighting
- **Responsive Design**: Mobile-first approach with creative animations

## Migration Date
- **Archived**: January 9, 2025
- **Reason**: Promotion of /2 redesign to main site
- **Replaced By**: Enterprise Solutions Architect redesign

## Git History
Original git history is preserved in this archive. All files maintain their original commit history and can be restored with full version control context.

---

**Archive Created**: January 9, 2025  
**Migration Issue**: GitHub Issue #97  
**Status**: Complete Archive - Safe for Restoration