# Navigation Active Links Investigation - /2 Site
**Date**: 2025-06-29  
**Issue**: Incorrect active navigation links as user scrolls down /2 homepage  
**Investigator**: Claude  
**Status**: 🔍 Investigation Started

## Problem Statement
The top navigation for the /2 redesign is not correctly highlighting the active link as users scroll through the homepage sections. Users expect the navigation to reflect their current section position.

## Investigation Timeline

### Initial Analysis - 2025-06-29
**Files Examined:**
- `/src/app/2/components/Navigation/Navigation.tsx` - Main navigation component
- `/src/app/2/page.tsx` - Homepage structure
- `/src/app/2/components/Hero/Hero.tsx` - Hero section (id="hero")
- `/src/app/2/components/About/About.tsx` - About section (id="about") 
- `/src/app/2/components/CaseStudies/CaseStudiesPreview.tsx` - Work section (id="work")

**Current Implementation Details:**
- **Intersection Observer**: Uses 0.6 threshold with rootMargin `-70px 0px -40% 0px`
- **Priority System**: Contact(7) > Skills(6) > Process(5) > Work(4) > Results(3) > About(2) > Hero(1)
- **Navigation Height**: 70px offset for scroll calculations
- **Sections Expected**: hero, about, results, work, process, skills, contact

## Technical Findings

### Navigation Component Analysis
**Intersection Observer Configuration:**
```typescript
{
  threshold: 0.6,
  rootMargin: `-${NAV_HEIGHT}px 0px -40% 0px`,
}
```

**Priority-Based Detection:**
- Higher priority sections override lower ones when multiple visible
- Contact section has highest priority (7), Hero has lowest (1)

**Setup Timing:**
- Initial setup after 1000ms delay
- Retry mechanism with 2500ms delay if sections not found
- Observer only active on `/2` pathname

### Section Structure Analysis
**Expected Sections (from Navigation.tsx):**
1. `hero` - Hero section
2. `about` - About section  
3. `results` - Results section (lazy loaded)
4. `work` - CaseStudiesPreview section (lazy loaded)
5. `process` - HowIWorkPreview section (lazy loaded)
6. `skills` - TechnicalExpertisePreview section (lazy loaded)
7. `contact` - ContactSection section (lazy loaded)

**Lazy Loading Impact:**
- Most sections are lazy loaded with Suspense
- May affect DOM readiness for Intersection Observer

## Potential Issues Identified

### 1. Threshold Too High (0.6)
- Current threshold requires 60% of section to be visible
- May feel unresponsive for long sections
- Users expect active state to change earlier in scroll

### 2. Root Margin Calculation
- Current: `-70px 0px -40% 0px`
- Bottom margin of -40% may be too aggressive
- Could cause active state to change too late

### 3. Priority System Logic
- Current priority favors bottom sections over top
- When multiple sections visible, bottom one wins
- May not match user expectation of "current" section

### 4. Lazy Loading Timing
- Intersection Observer setup may occur before lazy components render
- Retry mechanism exists but may need adjustment
- DOM elements might not be available initially

### 5. Section Height Variations
- Different sections have different heights
- Current threshold/margin may not work well for all sections
- No dynamic adjustment based on content

## Test Plan
**Manual Testing Required:**
1. **Load /2 homepage** - Check initial active state
2. **Slow scroll down** - Verify active states change at appropriate points
3. **Fast scroll** - Test rapid scrolling behavior
4. **Scroll back up** - Verify bidirectional behavior
5. **Mobile testing** - Different viewport behavior
6. **Hash navigation** - Test direct section linking

**Specific Test Cases:**
- [ ] Hero to About transition point
- [ ] About to Results transition point  
- [ ] Results to Work transition point
- [ ] Work to Process transition point
- [ ] Process to Skills transition point
- [ ] Skills to Contact transition point
- [ ] Reverse scroll behavior
- [ ] Direct hash navigation (e.g., `/2#work`)

## Hypotheses for Issues

### Primary Hypothesis: Threshold Too High
**Theory**: 0.6 threshold requires too much of section to be visible
**Expected Behavior**: Active state should change when section header enters viewport
**Test**: Reduce threshold to 0.3-0.4 and test feel

### Secondary Hypothesis: Root Margin Misconfigured  
**Theory**: -40% bottom margin delays active state changes
**Expected Behavior**: Active state should change as section becomes primary focus
**Test**: Adjust root margin to more responsive values

### Tertiary Hypothesis: Priority Logic Inverted
**Theory**: Priority should favor earlier sections when transitioning
**Expected Behavior**: When scrolling down, earlier section should stay active longer
**Test**: Reverse priority system or use different logic

## Next Steps
1. **Live Site Testing**: Test current behavior on tylergohr.com/2
2. **Create Test Implementation**: Branch with adjusted parameters
3. **Preview Testing**: Use PR preview system for validation
4. **Cross-Device Testing**: Mobile, tablet, desktop validation
5. **Performance Testing**: Ensure changes don't affect scroll performance

## Implementation Notes
**Files to Modify:**
- `/src/app/2/components/Navigation/Navigation.tsx` - Main navigation logic
- Possibly add debug logging for investigation

**Testing Strategy:**
- Use PR preview system for live testing
- Test on actual devices, not just browser dev tools
- Document specific scroll positions where issues occur

---
**Investigation Status**: 🔍 Initial analysis complete, ready for live testing
**Next Action**: Test current behavior on live site and document specific issues