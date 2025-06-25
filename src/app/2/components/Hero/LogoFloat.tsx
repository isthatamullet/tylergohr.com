"use client";

import { useEffect, useState } from 'react';
import { ClientMotionDiv, useScroll, useTransform } from '@/app/2/lib/framer-motion-client';
import styles from './LogoFloat.module.css';

export function LogoFloat() {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  // Mount check for SSR compatibility
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate trigger point (80vh)
  const triggerPoint = typeof window !== 'undefined' ? window.innerHeight * 0.8 : 640;

  // Transform values based on scroll position
  const x = useTransform(scrollY, [0, triggerPoint], [0, -85]); // Move left (85vw)
  const y = useTransform(scrollY, [0, triggerPoint], [0, -15]); // Move up (15vh)
  const scale = useTransform(scrollY, [0, triggerPoint], [1, 0.75]); // Scale down to 75%
  const opacity = useTransform(scrollY, [0, triggerPoint * 0.1, triggerPoint], [1, 1, 1]);

  // Don't render on server
  if (!mounted) {
    return null;
  }

  return (
    <ClientMotionDiv
      className={styles.logoFloat}
      style={{
        x: `${x}vw`,
        y: `${y}vh`,
        scale,
        opacity,
      }}
      transition={{
        type: "tween",
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94], // Professional easing curve
      }}
      aria-label="Tyler Gohr Logo"
    >
      <div className={styles.logoContainer}>
        {/* Temporary logo placeholder - will be replaced with actual logo */}
        <div className={styles.logoPlaceholder}>
          <div className={styles.logoInitials}>TG</div>
        </div>
      </div>
    </ClientMotionDiv>
  );
}