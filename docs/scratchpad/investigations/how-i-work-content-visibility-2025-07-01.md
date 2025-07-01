# How I Work Detail Page - Content Visibility Investigation - 2025-07-01

## Issue Description
Content beneath the hero section on the "How I Work" detail page (`/2/how-i-work`) doesn't appear until the user starts scrolling down. The content should be visible immediately on page load, but the existing scroll-triggered animation effects should be preserved.

## Root Cause Analysis

### Current Implementation Problem
The page uses an IntersectionObserver-based visibility system that conflates "initial content visibility" with "scroll-triggered animations." This causes content to be hidden until it enters the viewport rather than being visible by default.

### Affected Components & Files

#### 1. Main Page Component
**File**: `src/app/2/how-i-work/page.tsx`
- **Lines 120-180**: IntersectionObserver setup and visibility state management
- **Line 173**: Only hero section initialized as visible immediately
- **Lines 155-170**: Observer configuration with restrictive intersection thresholds

#### 2. CSS Reveal Classes
**File**: `src/app/2/how-i-work/page.module.css`

**Sections Starting with `opacity: 0`:**
- **Line 74**: `.processHeader { opacity: 0; }` - Process section header
- **Line 380**: `.processListContainer { opacity: 0; }` - Main process content
- **Line 400**: `.processListItem { opacity: 0; }` - Individual process steps
- **Line 546**: `.ctaSection { opacity: 0; }` - Call-to-action section

**Reveal Classes (when visible):**
- **Line 79**: `.processHeader.revealed { opacity: 1; }`
- **Line 385**: `.processListContainer.revealed { opacity: 1; }`
- **Line 405**: `.processListItem.itemRevealed { opacity: 1; }`
- **Line 551**: `.ctaSection.revealed { opacity: 1; }`

#### 3. CSS Custom Properties
**File**: `src/app/2/styles/brand-tokens.css`
- **Line 108**: `--detail-reveal-transform: translateY(30px);`
- **Line 109**: `--detail-reveal-duration: 0.8s;`
- **Line 110**: `--detail-reveal-easing: cubic-bezier(0.16, 1, 0.3, 1);`

## Current Problematic Behavior

### IntersectionObserver Configuration
```javascript
{
  threshold: 0.1,           // Content must be 10% visible
  rootMargin: '0px 0px -5% 0px'  // Reduces effective viewport by 5% at bottom
}
```

### Visibility State Management
```javascript
// Only hero initialized as visible (line 173)
setVisibleSections(prev => new Set([...prev, 'hero']))

// Other sections wait for intersection
entries.forEach((entry) => {
  if (entry.isIntersecting) {
    const sectionId = entry.target.getAttribute('data-section-id')
    if (sectionId) {
      setVisibleSections(prev => new Set([...prev, sectionId]))
    }
  }
})
```

## Solution Strategy

### Approach: Separate Initial Visibility from Animation Triggers
1. **Make content visible by default** - Remove `opacity: 0` from initial state
2. **Use scroll position for animations** - Trigger reveal animations when scrolling into view
3. **Preserve animation effects** - Keep existing transform/transition effects
4. **Maintain performance** - Use efficient scroll detection methods

### Implementation Plan

#### Phase 1: CSS Modifications
1. **Remove initial opacity restrictions** from:
   - `.processHeader`
   - `.processListContainer` 
   - `.processListItem`
   - `.ctaSection`

2. **Create animation-ready states** using transform properties instead of opacity

3. **Preserve reveal animation effects** when `.revealed` class is added

#### Phase 2: JavaScript Logic Updates
1. **Remove dependency on intersection for initial visibility**
2. **Use IntersectionObserver only for animation triggers**
3. **Ensure animations still fire when scrolling into view**
4. **Maintain smooth performance and avoid layout thrashing**

#### Phase 3: Animation Timing
1. **Stagger animations** for visual polish
2. **Use existing CSS custom properties** for consistent timing
3. **Test animation performance** across devices

## Technical Implementation Details

### Files to Modify

#### 1. `src/app/2/how-i-work/page.module.css`
**Changes needed:**
- Line 74: Change `.processHeader { opacity: 0; }` to default visible state
- Line 380: Change `.processListContainer { opacity: 0; }` to default visible state  
- Line 400: Change `.processListItem { opacity: 0; }` to default visible state
- Line 546: Change `.ctaSection { opacity: 0; }` to default visible state

**Preserve:**
- All `.revealed` state animations and transforms
- Existing animation timing and easing curves
- Mobile responsive behavior

#### 2. `src/app/2/how-i-work/page.tsx`
**Changes needed:**
- Lines 155-180: Update IntersectionObserver logic to trigger animations only
- Line 173: Remove special case for hero-only visibility
- Consider using `useEffect` with scroll position for more precise control

### Animation Preservation Requirements
- **Transform effects**: Keep existing `translateY(30px)` reveals
- **Timing**: Maintain `0.8s` duration and `cubic-bezier(0.16, 1, 0.3, 1)` easing
- **Stagger effects**: Preserve individual item animation delays
- **Mobile behavior**: Ensure animations work properly on touch devices

## Testing Strategy

### Visual Testing Requirements
1. **Page load behavior**: Content appears immediately without scroll
2. **Animation triggers**: Scroll-triggered animations still fire correctly
3. **Performance**: No layout shifts or janky animations
4. **Cross-device**: Test on mobile, tablet, desktop viewports
5. **Browser compatibility**: Verify across Chrome, Firefox, Safari

### Test Scenarios
1. **Fresh page load**: All content visible immediately
2. **Scroll down**: Animation effects trigger at appropriate scroll positions
3. **Scroll up/down repeatedly**: Animations don't break or duplicate
4. **Mobile touch scrolling**: Smooth animation performance
5. **Fast scrolling**: Animations don't lag or cause performance issues

## Expected Outcome
- ✅ Content visible immediately on page load
- ✅ Scroll-triggered animations preserved and enhanced
- ✅ No performance degradation
- ✅ Consistent behavior across all devices
- ✅ Professional polish maintained

## Dependencies
- CSS custom properties in `brand-tokens.css` (already correct)
- Section component structure (already correct)
- IntersectionObserver API support (widely supported)

## Risk Mitigation
- **Incremental changes**: Test each CSS change individually
- **Fallback behavior**: Ensure content is always visible even if animations fail
- **Performance monitoring**: Watch for any scroll performance issues
- **Cross-browser testing**: Verify behavior across target browsers

## Next Steps
1. Create backup of current implementation
2. Implement CSS changes first (safer, more visible impact)
3. Test content visibility immediately
4. Refine JavaScript animation triggers
5. Comprehensive testing across devices and browsers

---

## Related Files Reference
- **Main page**: `src/app/2/how-i-work/page.tsx`
- **Page styles**: `src/app/2/how-i-work/page.module.css`
- **Brand tokens**: `src/app/2/styles/brand-tokens.css`
- **Section component**: `src/app/2/components/Section/Section.tsx`

## Success Criteria
- [ ] Content appears immediately on page load
- [ ] Scroll animations trigger smoothly
- [ ] No layout shifts or performance issues
- [ ] Consistent cross-device behavior
- [ ] Professional visual polish maintained