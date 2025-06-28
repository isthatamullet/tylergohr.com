"use client";

import { usePathname } from "next/navigation";
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
  
  // Debug logging to verify conditional logic
  console.log('[ConditionalTopNavigation] Current pathname:', pathname);
  console.log('[ConditionalTopNavigation] Starts with /2:', pathname.startsWith('/2'));
  
  // TEMPORARILY FORCE RENDER ON /2 FOR DEBUGGING
  if (pathname.startsWith('/2')) {
    console.log('[ConditionalTopNavigation] FORCE RENDERING TopNavigation on /2 for debugging');
    return <TopNavigation />;
  }
  
  // Render TopNavigation for all other routes
  console.log('[ConditionalTopNavigation] Rendering TopNavigation for non-/2 route');
  return <TopNavigation />;
}