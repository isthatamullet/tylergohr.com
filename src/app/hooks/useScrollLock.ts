import { useEffect } from 'react';

/**
 * Custom hook to lock/unlock body scroll
 * Prevents page scrolling when mobile menu is open while preserving scroll position
 * 
 * @param locked - Boolean indicating whether scroll should be locked
 */
export const useScrollLock = (locked: boolean) => {
  useEffect(() => {
    if (locked) {
      // Preserve current scroll position
      const scrollY = window.scrollY;
      
      // Lock body scroll with position fixed approach
      // This prevents scroll bleeding while maintaining layout
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position when unlocking
      const scrollY = document.body.style.top;
      
      // Reset all body styles
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      // Restore the original scroll position
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    
    // Cleanup function to ensure body styles are reset on unmount
    return () => {
      if (locked) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
      }
    };
  }, [locked]);
};