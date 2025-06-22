"use client";

import { useEffect, useRef, useState } from "react";

interface MagneticEffectOptions {
  strength?: number;
  range?: number;
  enabled?: boolean;
}

export function useMagneticEffect<T extends HTMLElement>({
  strength = 0.3,
  range = 100,
  enabled = true,
}: MagneticEffectOptions = {}) {
  const elementRef = useRef<T>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !enabled) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    // Check if device supports hover (desktop)
    const supportsHover = window.matchMedia("(hover: hover)").matches;
    if (!supportsHover) return;

    let animationId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < range) {
        const normalizedX = deltaX / range;
        const normalizedY = deltaY / range;

        const transformX = normalizedX * strength * 20;
        const transformY = normalizedY * strength * 20;

        // Cancel previous animation
        if (animationId) {
          cancelAnimationFrame(animationId);
        }

        animationId = requestAnimationFrame(() => {
          element.style.transform = `translate3d(${transformX}px, ${transformY}px, 0) scale(${1 + strength * 0.1})`;
        });

        setIsHovered(true);
      } else if (isHovered) {
        // Reset position when mouse leaves range
        animationId = requestAnimationFrame(() => {
          element.style.transform = "translate3d(0, 0, 0) scale(1)";
        });
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      element.style.transform = "translate3d(0, 0, 0) scale(1)";
      setIsHovered(false);
    };

    // Add event listeners to document for broader range detection
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    element.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);

      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      if (element) {
        element.style.transform = "translate3d(0, 0, 0) scale(1)";
      }
    };
  }, [strength, range, enabled, isHovered]);

  return { elementRef, isHovered };
}
