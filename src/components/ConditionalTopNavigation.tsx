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
  
  // Don't render TopNavigation on /2 routes - let /2 Navigation handle it
  if (pathname.startsWith('/2')) {
    return null;
  }
  
  // Render TopNavigation for all other routes
  return <TopNavigation />;
}