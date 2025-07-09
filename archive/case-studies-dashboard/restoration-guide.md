# Real-Time Business Impact Dashboard - Restoration Guide

## Overview
This guide provides step-by-step instructions for restoring the Real-Time Business Impact Dashboard component to the Case Studies page if needed in the future.

## Prerequisites

### 1. Dependencies
Ensure these packages are installed in your project:
```bash
npm install recharts framer-motion
```

### 2. Verify Dependencies
Check that these versions are compatible with your React version:
```json
{
  "react": "^18.0.0",
  "framer-motion": "^10.0.0",
  "recharts": "^2.5.0"
}
```

## Restoration Steps

### Step 1: Move Component Files Back
Move the archived component files back to their original location:

```bash
# From the archive directory
git mv RealTimeMetricsDashboard.tsx ../../src/app/2/components/BusinessMetrics/
git mv RealTimeMetricsDashboard.module.css ../../src/app/2/components/BusinessMetrics/
```

### Step 2: Restore Case Studies Page Integration

#### 2.1 Add Lazy Import
Add the lazy import to `/src/app/2/case-studies/page.tsx` (around line 13):

```typescript
const RealTimeMetricsDashboard = lazy(() => import('@/app/2/components/BusinessMetrics/RealTimeMetricsDashboard'))
```

#### 2.2 Add Component Integration
Add the dashboard section to `/src/app/2/case-studies/page.tsx` (after the browser tabs section, before the CTA section):

```typescript
{/* Business Metrics Dashboard Section */}
<Section background="hero" paddingY="xl">
  <div 
    ref={(el) => { sectionRefs.current['metrics'] = el }}
    data-section-id="metrics"
    className={`${styles.metricsSection} ${visibleSections.has('metrics') ? styles.revealed : ''}`}
  >
    <Suspense fallback={<div className={styles.loadingPlaceholder}>Loading business metrics...</div>}>
      <RealTimeMetricsDashboard className={styles.businessMetrics} />
    </Suspense>
  </div>
</Section>
```

### Step 3: Update Page CSS (if needed)
Ensure these styles exist in `/src/app/2/case-studies/page.module.css`:

```css
.metricsSection {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.metricsSection.revealed {
  opacity: 1;
  transform: translateY(0);
}

.businessMetrics {
  max-width: 1200px;
  margin: 0 auto;
}

.loadingPlaceholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}
```

### Step 4: Update Section References
Ensure the `sectionRefs` system includes the 'metrics' section in the component state management.

### Step 5: Test Integration

#### 5.1 Development Testing
```bash
# Start development server
npm run dev

# Navigate to /2/case-studies
# Verify dashboard loads without errors
# Test all dashboard tabs (Overview, Revenue, Performance, Quality)
# Verify responsive design on mobile/tablet
```

#### 5.2 Quality Gates
```bash
# Run quality validation
npm run validate

# Individual checks
npm run typecheck
npm run lint
npm run build
```

#### 5.3 Performance Testing
```bash
# Check bundle size impact
npm run bundle-check

# Verify performance metrics
# - Dashboard should load within 2 seconds
# - Animations should be smooth (60fps)
# - No console errors or warnings
```

## Verification Checklist

### Functionality
- [ ] Dashboard loads without errors
- [ ] All four tabs work (Overview, Revenue, Performance, Quality)
- [ ] Metrics animate smoothly
- [ ] Real-time updates function (3-second intervals)
- [ ] Mobile responsive design works
- [ ] Loading placeholder displays correctly

### Performance
- [ ] Bundle size remains under 6MB budget
- [ ] Page load time under 2.5 seconds
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Production build succeeds

### Integration
- [ ] Component integrates with existing page scroll system
- [ ] Section visibility animations work
- [ ] Brand color tokens are applied correctly
- [ ] Dark theme styling is consistent
- [ ] Accessibility features function (keyboard navigation, ARIA)

## Troubleshooting

### Common Issues

#### 1. Recharts Import Errors
```bash
# If you get recharts import errors
npm install recharts
npm install --save-dev @types/recharts
```

#### 2. Framer Motion Compatibility
```bash
# If animations don't work
npm install framer-motion@latest
# Check for version compatibility with React
```

#### 3. CSS Module Issues
```bash
# If styles don't apply
# Verify CSS module imports are correct
# Check brand token variables are available
```

#### 4. Performance Issues
```bash
# If dashboard causes performance problems
# Consider lazy loading improvements
# Check for memory leaks in animations
# Verify chart rendering optimization
```

## Customization Options

### Modify Dashboard Data
Edit the `performanceData` and `realTimeMetrics` arrays in `RealTimeMetricsDashboard.tsx` to update:
- Business metrics values
- Chart data points
- Categories and labels
- Trend indicators

### Styling Customization
Modify `RealTimeMetricsDashboard.module.css` to adjust:
- Color schemes
- Animation timing
- Responsive breakpoints
- Glassmorphism effects

### Integration Position
The dashboard can be integrated at different positions on the Case Studies page:
- **Before browser tabs** (higher priority)
- **After browser tabs** (current/recommended)
- **After CTA section** (lower priority)

## Performance Considerations

### Bundle Size Impact
- **Dashboard component**: ~45KB (compressed)
- **Recharts library**: ~180KB (compressed)
- **Additional animations**: ~15KB (compressed)
- **Total impact**: ~240KB additional bundle size

### Optimization Recommendations
1. **Keep lazy loading** to avoid blocking initial page load
2. **Consider code splitting** for Recharts if used elsewhere
3. **Implement intersection observer** for animation triggers
4. **Add loading skeletons** for better perceived performance

## Future Enhancements

### Potential Improvements
1. **Real API integration** instead of mock data
2. **Advanced filtering** and date range selection
3. **Export functionality** for business metrics
4. **Comparison views** between different time periods
5. **Interactive drill-down** capabilities

### Technical Debt
- Consider migrating to Chart.js or D3.js for better performance
- Implement proper data fetching with React Query
- Add proper error boundaries for chart rendering
- Consider server-side rendering for initial data

---

**Restoration Guide Version**: 1.0  
**Compatible with**: Tyler Gohr Portfolio v2.0+  
**Last updated**: December 2024  
**Estimated restoration time**: 30-45 minutes