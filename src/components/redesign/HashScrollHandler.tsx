'use client';

import { useEffect } from 'react';

/**
 * Handles hash navigation on page load.
 * When navigating from another page to /#section, this scrolls
 * instantly (not smoothly) to prevent the jittery "load at top, then scroll" effect.
 */
export default function HashScrollHandler() {
  useEffect(() => {
    // Only run on initial page load, not on hash changes within the page
    const hash = window.location.hash;

    if (hash) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          // Use instant scroll to avoid the jitter
          element.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      }, 0);

      return () => clearTimeout(timer);
    }
  }, []);

  return null;
}
