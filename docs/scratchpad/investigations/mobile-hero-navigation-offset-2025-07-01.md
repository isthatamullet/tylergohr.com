# Mobile Hero Navigation Offset Fix - 2025-07-01

## Problem Statement
The /2 redesign hero image and content are hidden behind the fixed top navigation on mobile devices. The navigation bar is positioned as `fixed` overlay but the Hero section doesn't account for the navigation height, causing content overlap.

## Investigation Summary

### Current Architecture Analysis
- **Navigation Component**: Fixed positioned overlay at top of viewport
- **Navigation Height**: 70px on mobile (hardcoded in component)
- **Hero Section**: Full viewport height without navigation offset
- **Issue**: Hero content starts at top of viewport, hidden behind fixed navigation

### Root Cause
The Hero section uses `min-height: 100vh` and positions content from the very top of the viewport, but the fixed navigation (70px height) overlays the top portion, hiding hero content on mobile devices.

## Solution Strategy

### 1. Add Mobile Navigation Offset to Hero Section
- Add top padding to `.heroSection` on mobile viewports to clear the 70px fixed navigation
- Use CSS custom property for maintainable navigation height value
- Ensure hero content is properly visible below navigation

### 2. Standardize Navigation Height Management
- Extract navigation height to brand tokens as `--navigation-height: 70px`
- Update Navigation component to use brand token instead of hardcoded value
- Update Hero component to use consistent navigation height reference

### 3. Mobile-Specific Layout Adjustments
- Add mobile media query for proper hero section top spacing
- Maintain full viewport experience while ensuring content visibility
- Preserve existing animations and responsive behavior

## Implementation Plan

### Phase 1: Brand Tokens Update
1. Add `--navigation-height: 70px` to brand-tokens.css
2. Add `--hero-mobile-padding-top: calc(var(--navigation-height) + 1rem)` for proper spacing

### Phase 2: Hero Component Updates  
1. Update Hero.module.css mobile styles to include top padding
2. Adjust mobile viewport height calculation to account for navigation
3. Test hero content visibility across mobile devices

### Phase 3: Navigation Component Consistency
1. Update Navigation.tsx to use brand token instead of hardcoded NAV_HEIGHT
2. Update Hero.tsx scroll navigation to use consistent height reference
3. Ensure all navigation offset calculations are standardized

## Files to Modify
1. `/src/app/2/styles/brand-tokens.css` - Add navigation height tokens
2. `/src/app/2/components/Hero/Hero.module.css` - Mobile layout fixes
3. `/src/app/2/components/Navigation/Navigation.tsx` - Use brand token
4. `/src/app/2/components/Hero/Hero.tsx` - Consistent height reference

## Technical Implementation Details

### Brand Tokens Addition
```css
/* Navigation Layout Tokens */
--navigation-height: 70px;
--hero-mobile-padding-top: calc(var(--navigation-height) + 1rem);
```

### Mobile Hero Section Fix
```css
@media (max-width: 767px) {
  .heroSection {
    /* Add top padding to clear fixed navigation */
    padding-top: var(--hero-mobile-padding-top);
    /* Adjust viewport calculation */
    min-height: calc(100vh - var(--navigation-height));
  }
}
```

### Navigation Component Consistency
```tsx
// Replace hardcoded NAV_HEIGHT with brand token
const NAV_HEIGHT = 'var(--navigation-height)';
```

## Success Criteria
- ✅ Hero content fully visible on mobile below fixed navigation
- ✅ Consistent navigation height management across components
- ✅ Maintained responsive design and animation behavior
- ✅ No content overlap with fixed navigation bar
- ✅ Proper spacing maintained across all mobile viewport sizes

## Testing Strategy
1. **Mobile Device Testing**: Test on actual mobile devices (iPhone, Android)
2. **Responsive Testing**: Verify 320px to 767px viewport range
3. **Content Visibility**: Ensure hero text and image are fully visible
4. **Animation Preservation**: Verify floating cloud animations still work
5. **Cross-Browser**: Test Safari, Chrome, Firefox mobile browsers

## Quality Assurance
- Run `npm run validate` for TypeScript and lint checks
- Execute `npx playwright test e2e/visual-regression-2.spec.ts` for visual consistency
- Test `npx playwright test e2e/navigation-component.spec.ts` for navigation behavior
- Verify mobile responsiveness with `npm run test:e2e:mobile`

---

**Implementation Date**: 2025-07-01  
**Priority**: High - Mobile UX critical issue  
**Estimated Effort**: 30 minutes implementation + testing  
**Risk Level**: Low - CSS-only changes with clear rollback path