# Emergency Restoration Guide

## Quick Rollback (5 minutes)

If you need to immediately restore the original main site:

```bash
# 1. Navigate to project root
cd /home/user/tylergohr.com

# 2. Backup current state (optional but recommended)
mkdir -p backup-before-rollback
cp -r src/app/layout.tsx backup-before-rollback/
cp -r src/app/page.tsx backup-before-rollback/
cp -r src/components backup-before-rollback/

# 3. Restore original files
cp archive/original-main-site/app/layout.tsx src/app/
cp archive/original-main-site/app/page.tsx src/app/
cp archive/original-main-site/app/page.module.css src/app/
cp archive/original-main-site/app/globals.css src/app/

# 4. Restore component library
rm -rf src/components
cp -r archive/original-main-site/components src/

# 5. Restore lib files
cp -r archive/original-main-site/lib/* src/lib/

# 6. Validate restoration
npm run validate
npm run test:e2e:smoke

# 7. Start development server
npm run dev
```

## Detailed Restoration Steps

### Step 1: Preparation
```bash
# Ensure you're in the correct directory
pwd
# Should show: /home/user/tylergohr.com

# Check archive exists
ls -la archive/original-main-site/
# Should show: app/ components/ lib/ docs/
```

### Step 2: File Restoration
```bash
# Restore core application files
cp archive/original-main-site/app/layout.tsx src/app/layout.tsx
cp archive/original-main-site/app/page.tsx src/app/page.tsx
cp archive/original-main-site/app/page.module.css src/app/page.module.css
cp archive/original-main-site/app/globals.css src/app/globals.css

# Restore component library (27 components)
cp -r archive/original-main-site/components/* src/components/

# Restore utility libraries
cp -r archive/original-main-site/lib/* src/lib/
```

### Step 3: Validation
```bash
# Check TypeScript compilation
npm run typecheck
# Should pass without errors

# Check ESLint
npm run lint
# Should pass without errors

# Test production build
npm run build
# Should complete successfully

# Run smoke tests
npm run test:e2e:smoke
# Should pass all tests
```

### Step 4: Manual Verification
1. **Start development server**: `npm run dev`
2. **Navigate to localhost:3000**
3. **Verify original site elements**:
   - Hero section with "Full-Stack Developer & Creative Problem Solver"
   - Parallax background effects
   - Project showcase with interactive cards
   - Skills section with animations
   - Contact form functionality

### Step 5: Clean Up (if restoration successful)
```bash
# Remove any /2-specific files that might remain
rm -rf src/app/2/
rm -rf src/app/case-studies/
rm -rf src/app/how-i-work/
rm -rf src/app/technical-expertise/
rm -rf src/app/styles/brand-tokens.css
```

## Troubleshooting Common Issues

### Issue: TypeScript Errors
```bash
# Check for missing type definitions
npm install --save-dev @types/react @types/node

# Clear Next.js cache
rm -rf .next
npm run build
```

### Issue: Import Errors
```bash
# Check for broken imports in components
grep -r "from.*@/app/2" src/components/
# Should return no results after restoration

# Check for /2-specific imports
grep -r "/2/" src/
# Should return no results after restoration
```

### Issue: CSS Not Loading
```bash
# Verify globals.css is in correct location
ls -la src/app/globals.css
# Should exist

# Check for CSS import in layout
grep "globals.css" src/app/layout.tsx
# Should show: import "./globals.css";
```

### Issue: Components Not Found
```bash
# Verify component directory structure
ls -la src/components/
# Should show 27 component files

# Check for component import paths
grep -r "from.*components" src/app/
# Should show relative imports like "@/components/ComponentName"
```

## Expected Results After Restoration

### Homepage Should Show:
- Tyler Gohr - Full-Stack Developer & Creative Problem Solver
- Parallax hero section with glassmorphism
- About section with creative styling
- Skills section with animations
- Project showcase with interactive cards
- Contact section with working form

### Navigation Should Include:
- ConditionalTopNavigation system
- No references to /2 routes
- Working links to blog and other sections

### Performance Should Maintain:
- Core Web Vitals targets
- Mobile responsiveness
- Accessibility compliance
- Cross-browser compatibility

## Post-Restoration Tasks

1. **Update documentation** to reflect current site state
2. **Notify stakeholders** about the restoration
3. **Monitor site performance** for any issues
4. **Review analytics** to ensure tracking is working
5. **Test contact form** to ensure submissions work

## Support

If restoration fails or you encounter issues:
1. Check the GitHub issue history for similar problems
2. Review the CLAUDE.md file for project context
3. Run comprehensive tests: `npm run test:e2e:portfolio`
4. Check logs for specific error messages
5. Consider partial restoration if full restoration fails

---

**Last Updated**: January 9, 2025  
**Migration Issue**: GitHub Issue #97  
**Restoration Timeline**: 5-15 minutes depending on complexity