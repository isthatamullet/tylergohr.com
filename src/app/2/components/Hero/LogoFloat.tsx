"use client";

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { ClientMotionDiv, useScroll, useTransform } from '@/app/2/lib/framer-motion-client';
import styles from './LogoFloat.module.css';

type LogoState = 'hero' | 'floating' | 'navigation';

export function LogoFloat() {
  const [mounted, setMounted] = useState(false);
  const [logoState, setLogoState] = useState<LogoState>('hero');
  const { scrollY } = useScroll();

  // Mount check for SSR compatibility
  useEffect(() => {
    setMounted(true);
  }, []);

  // Enhanced scroll state management
  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.8; // 80vh trigger point
      const navigationThreshold = window.innerHeight * 1.2; // 120vh for final position

      if (currentScrollY < heroHeight * 0.1) {
        setLogoState('hero');
      } else if (currentScrollY < navigationThreshold) {
        setLogoState('floating');
      } else {
        setLogoState('navigation');
      }
    };

    handleScroll(); // Initial state
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  // Smooth scroll to top functionality
  const handleLogoClick = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Calculate trigger points for enhanced animation
  const triggerPoint = typeof window !== 'undefined' ? window.innerHeight * 0.8 : 640;
  const finalPosition = typeof window !== 'undefined' ? window.innerHeight * 1.2 : 960;

  // Enhanced transform values with better state management
  const x = useTransform(scrollY, [0, triggerPoint, finalPosition], [0, -85, -85]); // Move left and hold
  const y = useTransform(scrollY, [0, triggerPoint, finalPosition], [0, -15, -18]); // Move up with final adjustment
  const scale = useTransform(scrollY, [0, triggerPoint, finalPosition], [1, 0.75, 0.7]); // Progressive scaling
  const opacity = useTransform(scrollY, [0, triggerPoint * 0.1, triggerPoint], [1, 1, 1]);

  // Don't render on server
  if (!mounted) {
    return null;
  }

  return (
    <ClientMotionDiv
      className={`${styles.logoFloat} ${styles[`logoFloat--${logoState}`]}`}
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
      onClick={handleLogoClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleLogoClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label="Tyler Gohr Logo - Click to scroll to top"
      data-logo-state={logoState}
    >
      <div className={styles.logoContainer}>
        <Image 
          src="/images/tech-company-logo.png"
          alt="Tyler Gohr Tech Company Logo"
          className={styles.logoImage}
          width={80}
          height={80}
          priority={true}
        />
      </div>
    </ClientMotionDiv>
  );
}