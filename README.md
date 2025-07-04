# Tyler Gohr Portfolio

High-end creative portfolio website showcasing full-stack development mastery through interactive project demonstrations.

🌐 **Live Site**: [tylergohr.com](https://tylergohr.com)  
🚀 **Deployment**: Google Cloud Run with enterprise-grade CI/CD  
📊 **Performance**: 90+ Lighthouse scores, Core Web Vitals optimized

## Features

- **Interactive Project Showcases** - Technical storytelling through live demonstrations
- **Modern CSS Mastery** - Container Queries, CSS Grid Subgrid, Scroll-driven Animations
- **Blog System** - File-based Markdown with featured images and responsive design
- **Dark Theme Excellence** - Strategic green/red business accents
- **Performance Optimized** - Next.js 15 with SSG, WebP optimization, lazy loading
- **Accessibility Compliant** - WCAG 2.1 AA standards

## Tech Stack

- **Framework**: Next.js 15 with App Router + TypeScript
- **Styling**: CSS Modules with cutting-edge CSS features (no Tailwind)
- **Blog**: Markdown with gray-matter frontmatter parsing
- **Images**: Next.js Image optimization with WebP conversion
- **Testing**: Jest + React Testing Library + Playwright E2E
- **Deployment**: Google Cloud Run with GitHub Actions CI/CD

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run quality gates
npm run validate  # typecheck + lint + test + build

# Individual commands
npm run typecheck  # TypeScript validation
npm run lint       # ESLint code quality
npm test          # Jest test suite
npm run build     # Production build
```

## Blog Images

The blog system supports featured images with advanced focal point controls for optimal display in both 16:9 featured areas and square thumbnails.

### Quick Start

1. **Add your image** to `/content/blog/assets/`:
   ```
   /content/blog/assets/my-post-featured.jpg
   ```

2. **Update blog post frontmatter**:
   ```yaml
   ---
   title: "My Blog Post"
   # ... other frontmatter
   image: "/images/blog/my-post-featured.jpg"
   imageAlt: "Descriptive text for accessibility"
   imageFocalPoint: "center"      # 16:9 crop for blog post
   thumbnailFocalPoint: "center"  # Square crop for blog card
   ---
   ```

3. **Build and test**:
   ```bash
   npm run build  # Asset pipeline copies images automatically
   npm run dev    # Test locally
   ```

### Focal Point Options

Control image cropping with these focal point values:
- `center` (default)
- `top`, `bottom`, `left`, `right` 
- `top-left`, `top-right`, `bottom-left`, `bottom-right`

### Supported Formats

- **Input**: JPG, JPEG, PNG, GIF, WebP, AVIF (up to 20MB)
- **Output**: WebP with JPEG fallback, responsive sizes
- **Optimization**: Automatic compression and format conversion

### Error Handling

- **Missing images**: Graceful fallback to text-only layout
- **Broken images**: Automatic error recovery with console warnings
- **Build validation**: File size and format checking

For comprehensive documentation, see [`docs/BLOG-IMAGES.md`](docs/BLOG-IMAGES.md).

## Deployment

The site uses an enterprise-grade deployment pipeline:

- **PR Preview URLs**: Every pull request gets a Cloud Run preview environment
- **Automatic Testing**: TypeScript, ESLint, Jest, and build validation
- **Production Deployment**: Automatic deployment to tylergohr.com on merge to main
- **Performance Monitoring**: Lighthouse CI integration

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for technical details.

## Project Status

Track development progress through GitHub issues:
- **Issue #1**: Overall project roadmap
- **Issue #26**: Blog image system implementation  
- **Issue #30**: Focal point system testing and optimization

## License

MIT License - see [LICENSE](LICENSE) for details.
# WebGL Dependencies Fix - Fri Jul  4 10:11:28 AM UTC 2025
