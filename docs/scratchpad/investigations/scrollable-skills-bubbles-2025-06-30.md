# Scrollable Skills Bubbles Investigation & Implementation Plan

## Problem Statement
**Date:** 2025-06-30  
**Issue:** Green skills bubbles are cut off on the third row of each technical expertise card  
**Location:** tylergohr.com/2 - Technical Expertise section (4 cards with skills)  
**Evidence:** IMG_8426.jpeg shows partial green bubbles at bottom of cards

## Current State Analysis

### Architecture Discovery
- **Component:** `TechnicalExpertisePreview` at `/src/app/2/components/TechnicalExpertise/TechnicalExpertisePreview.tsx`
- **Card Component:** `TechnicalCard` at `/src/app/2/components/ui/Card/Card.tsx` (lines 390-444)
- **Styling:** `/src/app/2/components/ui/Card/Card.module.css` (lines 412-423)

### Root Cause Analysis
```css
.technicalCardSkills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-height: 100px;     /* ⚠️ PROBLEM: Fixed height cuts off content */
  overflow: hidden;      /* ⚠️ PROBLEM: Hides overflowing bubbles */
  transition: max-height 0.3s ease;
}

/* Mobile is even more restrictive */
@media (max-width: 767px) {
  .technicalCardSkills {
    max-height: 60px;     /* ⚠️ PROBLEM: Even more restrictive on mobile */
  }
}
```

### Current Skills Data
Each card contains 4-6 skill tags:
- **Modern Frontend:** 6 skills (React 19, Next.js 14, TypeScript, Advanced CSS, Framer Motion, CSS Grid Subgrid)
- **Backend & Cloud:** 6 skills (Node.js, Express APIs, Google Cloud Platform, PostgreSQL, Prisma ORM, Docker)
- **Enterprise Leadership:** 4 skills (Team Leadership, AI Implementation Pioneer, Product Management, Strategic Planning)
- **Integration & Automation:** 4 skills (Stripe Payment Processing, Real-time Socket.IO, AI-Powered Automation, API Integration)

## Solution Design

### Requirements
1. **Primary:** Make all skill bubbles visible and accessible
2. **UX:** Maintain clean card appearance without overwhelming layout
3. **Interaction:** Hover-to-scroll functionality for discoverability
4. **Responsive:** Work on desktop, tablet, and mobile
5. **Accessibility:** Keyboard navigation support
6. **Performance:** Smooth scrolling without layout shifts

### Implementation Strategy

#### Option A: Pure CSS Scrollable Container (RECOMMENDED)
**Benefits:**
- No JavaScript required
- Better performance
- Simpler implementation
- Maintains existing mobile expand/collapse functionality

**Approach:**
1. Change `overflow: hidden` to `overflow-y: auto`
2. Add custom scrollbar styling (subtle, themed)
3. Show scrollbar on card hover for discoverability
4. Ensure mobile compatibility

#### Option B: JavaScript-Enhanced Scrolling
**Benefits:**
- More control over scroll behavior
- Can add scroll indicators
- Custom scroll events

**Drawbacks:**
- More complex
- Potential performance overhead
- Not necessary for this use case

### Detailed Implementation Plan

#### Phase 1: CSS Scrollable Container
1. **Modify `.technicalCardSkills` CSS:**
   ```css
   .technicalCardSkills {
     display: flex;
     flex-wrap: wrap;
     gap: 0.5rem;
     max-height: 100px;
     overflow-y: auto;        /* Enable vertical scrolling */
     overflow-x: hidden;      /* Prevent horizontal scroll */
     transition: all 0.3s ease;
     scroll-behavior: smooth;
     
     /* Custom scrollbar styling */
     scrollbar-width: thin;
     scrollbar-color: rgba(22, 163, 74, 0.3) transparent;
   }
   ```

2. **Add Webkit scrollbar styling:**
   ```css
   .technicalCardSkills::-webkit-scrollbar {
     width: 4px;
   }
   
   .technicalCardSkills::-webkit-scrollbar-thumb {
     background: rgba(22, 163, 74, 0.3);
     border-radius: 2px;
   }
   
   .technicalCardSkills::-webkit-scrollbar-thumb:hover {
     background: rgba(22, 163, 74, 0.5);
   }
   ```

3. **Add hover state for discoverability:**
   ```css
   .card--technical:hover .technicalCardSkills::-webkit-scrollbar-thumb {
     background: rgba(22, 163, 74, 0.4);
   }
   ```

#### Phase 2: Mobile Responsiveness
1. **Update mobile styles:**
   ```css
   @media (max-width: 767px) {
     .technicalCardSkills {
       max-height: 80px; /* Slightly increase from 60px */
     }
   }
   ```

2. **Ensure touch scrolling works:**
   ```css
   .technicalCardSkills {
     -webkit-overflow-scrolling: touch; /* iOS smooth scrolling */
   }
   ```

#### Phase 3: Accessibility Enhancements
1. **Keyboard navigation support:**
   ```css
   .technicalCardSkills:focus-within {
     outline: 2px solid var(--accent-green);
     outline-offset: 2px;
   }
   ```

2. **Reduced motion support:**
   ```css
   @media (prefers-reduced-motion: reduce) {
     .technicalCardSkills {
       scroll-behavior: auto;
     }
   }
   ```

### Testing Strategy

#### Visual Testing Requirements
1. **Cross-Device Testing:**
   - Desktop (1200x800): Verify all skills visible with scrolling
   - Tablet (768px): Ensure touch scrolling works
   - Mobile (375px): Test with expanded/collapsed states

2. **Browser Compatibility:**
   - Chrome: Webkit scrollbar styling
   - Firefox: CSS scrollbar properties
   - Safari: iOS touch scrolling

3. **Interaction Testing:**
   - Hover to reveal scrollbar
   - Smooth scrolling behavior
   - Keyboard navigation (tab through skills)
   - Mobile tap-to-expand still functional

4. **Content Testing:**
   - All 4 cards show all skills when scrolled
   - No layout shifts during scroll
   - Scrollbar appears/disappears appropriately

#### Performance Testing
- No impact on card animation performance
- Smooth 60fps scrolling
- No layout thrashing

## Risk Assessment

### Low Risk
- ✅ CSS-only solution is stable
- ✅ Maintains existing mobile functionality
- ✅ Backward compatible

### Medium Risk
- ⚠️ Scrollbar styling varies between browsers
- ⚠️ Need to test touch scrolling on actual devices

### Mitigation Strategies
- Use both webkit and standard scrollbar properties
- Test on actual mobile devices via preview URL
- Fallback to standard browser scrollbars if custom styling fails

## Success Criteria

### Must Have
- [ ] All skill bubbles visible in each card
- [ ] Smooth scrolling functionality
- [ ] Mobile expand/collapse still works
- [ ] No performance degradation

### Should Have
- [ ] Subtle, themed scrollbar styling
- [ ] Hover state for discoverability
- [ ] Cross-browser compatibility

### Could Have
- [ ] Scroll position memory
- [ ] Scroll indicators
- [ ] Animation on scroll reveal

## Implementation Timeline

1. **Phase 1:** CSS modifications (15 minutes)
2. **Phase 2:** Mobile responsiveness (10 minutes)
3. **Phase 3:** Accessibility enhancements (10 minutes)
4. **Testing:** Cross-device visual testing (20 minutes)
5. **Refinement:** Based on testing results (15 minutes)

**Total Estimated Time:** 70 minutes

## Files to Modify

### Primary Changes
- `/src/app/2/components/ui/Card/Card.module.css` (lines 412-423, 557-559)

### Testing Files
- Use existing visual testing framework in `/tests/`
- Create new test: `scrollable-skills-visual-test.js`

## Rollback Plan

If issues arise:
1. Revert CSS changes to original `overflow: hidden`
2. Consider alternative approaches (expand cards, larger containers)
3. Investigate responsive design adjustments

## Notes & Considerations

- Existing mobile expand/collapse functionality should remain intact
- Green color theme (#16a34a / var(--accent-green)) should be maintained
- Card glassmorphism effects should not be affected
- Performance is critical - this is a prominent section of the site

---

**Next Steps:** Execute implementation phases in order, with visual testing after each phase to ensure quality and functionality.