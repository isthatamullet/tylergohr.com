# Cloud Run Environment Monitoring Notes

## Known Issues & Considerations

### Cloud Run Deployment Timing Issues
**Date Discovered**: 2025-06-29  
**Pattern**: Multiple UI components affected by container timing during PR preview deployments  
**Status**: Transient - resolve automatically or on page reload

#### Issue Types Observed:
1. **Navigation Visibility** - Components appear missing on initial load
2. **Hover Effects** - CSS interactions fail intermittently  
3. **Fixed Positioning** - Elements scroll away but stick properly on reload  

**Technical Details**:
- Affects both ConditionalTopNavigation and /2 Navigation components
- Related to React hydration timing in containerized environment
- More noticeable during cold container starts
- Does not affect functionality once mounted

**Symptoms**:
- Navigation appears to be missing on initial page load
- Console logs show components are mounting correctly
- Issue resolves on page refresh or subsequent visits
- Local development and production builds unaffected

**Resolution**:
- Issue resolves itself automatically
- Consider adding client-side mounting validation for production monitoring
- Monitor Core Web Vitals for hydration performance

**Reference**: Investigation documented in `docs/scratchpad/investigations/nav-visibility-issue-2025-06-29.md`

## Monitoring Recommendations

### Production Environment Checks
1. **Hydration Performance**: Monitor React hydration timing metrics
2. **Component Mounting**: Consider adding telemetry for critical component mounting
3. **CSS Loading**: Track CSS module loading performance in production
4. **Cold Start Impact**: Monitor correlation between cold starts and UI issues

### Future Investigation Tools
- Puppeteer automation for cross-page testing in CI/CD
- Client-side error reporting for production environment issues
- Performance monitoring for container startup timing
- Automated navigation visibility testing in preview deployments

---

**Last Updated**: 2025-06-29  
**Next Review**: Monitor for pattern recurrence over next deployment cycles