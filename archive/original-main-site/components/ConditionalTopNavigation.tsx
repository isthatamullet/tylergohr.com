"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import TopNavigation from "./TopNavigation";

/**
 * Conditional Top Navigation Component
 * 
 * Renders TopNavigation only on non-/2 pages to prevent conflicts
 * with the specialized /2 page Navigation component.
 * 
 * This fixes the navigation issues by ensuring only one navigation
 * component renders per page route:
 * - Homepage (/) gets TopNavigation  
 * - /2 page gets its own Navigation component
 * - No more competing intersection observers or CSS conflicts
 */
export default function ConditionalTopNavigation() {
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Handle hydration to prevent SSR/client mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  // Additional effect to monitor pathname changes
  useEffect(() => {
    console.log('[ConditionalTopNavigation] Pathname changed to:', pathname);
    console.log('[ConditionalTopNavigation] Will re-evaluate navigation rendering logic');
  }, [pathname]);
  
  // Enhanced debug logging to verify conditional logic
  console.log('[ConditionalTopNavigation] Current pathname:', pathname);
  console.log('[ConditionalTopNavigation] Is hydrated:', isHydrated);
  console.log('[ConditionalTopNavigation] Starts with /2:', pathname.startsWith('/2'));
  console.log('[ConditionalTopNavigation] Should render TopNavigation:', !pathname.startsWith('/2') && isHydrated);
  
  // Don't render anything until hydrated to prevent conflicts
  if (!isHydrated) {
    console.log('[ConditionalTopNavigation] Not hydrated yet, returning null');
    return null;
  }
  
  // Multiple checks to ensure we exclude TopNavigation on ALL /2 routes
  const isRoute2 = pathname === '/2' || pathname.startsWith('/2/');
  const isRoute2CaseStudies = pathname.startsWith('/2/case-studies');
  const isRoute2HowIWork = pathname.startsWith('/2/how-i-work'); 
  const isRoute2TechExpertise = pathname.startsWith('/2/technical-expertise');
  
  if (isRoute2 || isRoute2CaseStudies || isRoute2HowIWork || isRoute2TechExpertise) {
    console.log('[ConditionalTopNavigation] ✅ EXCLUDING TopNavigation on /2 route:', pathname);
    console.log('[ConditionalTopNavigation] Route checks - isRoute2:', isRoute2, 'CaseStudies:', isRoute2CaseStudies, 'HowIWork:', isRoute2HowIWork, 'TechExpertise:', isRoute2TechExpertise);
    console.log('[ConditionalTopNavigation] Returning null - /2 Navigation should be only nav component');
    return null;
  }
  
  // Render TopNavigation for all other routes
  console.log('[ConditionalTopNavigation] ⚠️ RENDERING TopNavigation for non-/2 route:', pathname);
  console.log('[ConditionalTopNavigation] TopNavigation component will be rendered');
  return <TopNavigation />;
}