"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./TopNavigation.module.css";

interface NavigationProps {
  className?: string;
}

export default function TopNavigation({ className = "" }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Navigation height for offset calculation
  const NAV_HEIGHT = 70;

  // Throttled scroll handler for performance
  const tickingRef = useRef(false);
  
  const throttledScrollHandler = useCallback(() => {
    if (!tickingRef.current) {
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);
        tickingRef.current = false;
      });
      tickingRef.current = true;
    }
  }, []);

  // Enhanced smooth scroll to section with proper offset
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - NAV_HEIGHT;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Update URL hash
      window.history.pushState(null, "", `#${sectionId}`);
      
      // Update active section immediately for responsive feedback
      setActiveSection(sectionId);
    }
    setIsMenuOpen(false); // Close mobile menu after navigation
  }, []);

  // Handle scroll effect for navigation background
  useEffect(() => {
    window.addEventListener("scroll", throttledScrollHandler, { passive: true });
    return () => window.removeEventListener("scroll", throttledScrollHandler);
  }, [throttledScrollHandler]);

  // Handle initial URL hash on page load
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && ["about", "skills", "projects", "contact"].includes(hash)) {
      setActiveSection(hash);
      // Small delay to ensure DOM is ready
      setTimeout(() => scrollToSection(hash), 100);
    }
  }, [scrollToSection]);

  // Intersection Observer for active section detection
  useEffect(() => {
    const sections = ["about", "skills", "projects", "contact"];
    
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (sections.includes(sectionId)) {
              console.log(`Setting active section: ${sectionId}`); // Debug log
              setActiveSection(sectionId);
              
              // Update URL hash without causing scroll
              if (window.location.hash !== `#${sectionId}`) {
                window.history.replaceState(null, "", `#${sectionId}`);
              }
            }
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: `-${NAV_HEIGHT}px 0px -60% 0px`,
      }
    );

    // Observe all sections
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Handle mobile menu toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Navigation links configuration
  const navLinks = [
    { id: "about", label: "About", href: "#about" },
    { id: "skills", label: "Technical", href: "#skills" },
    { id: "projects", label: "Projects", href: "#projects" },
    { id: "contact", label: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`${styles.navigation} ${isScrolled ? styles.scrolled : ""} ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={styles.container}>
        {/* TG Logo */}
        <button
          onClick={() => scrollToSection("about")}
          className={styles.logo}
          aria-label="Tyler Gohr - Return to top"
        >
          <span className={styles.logoText}>TG</span>
        </button>

        {/* Desktop Navigation Links */}
        <div className={styles.desktopNav}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={`${styles.navLink} ${activeSection === link.id ? styles.active : ""}`}
              aria-label={`Navigate to ${link.label} section`}
              aria-current={activeSection === link.id ? "page" : undefined}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className={styles.mobileMenuButton}
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          <span
            className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerOpen : ""}`}
          ></span>
          <span
            className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerOpen : ""}`}
          ></span>
          <span
            className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerOpen : ""}`}
          ></span>
        </button>

        {/* Mobile Navigation Menu */}
        <div
          id="mobile-navigation"
          className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNavOpen : ""}`}
          aria-hidden={!isMenuOpen}
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={`${styles.mobileNavLink} ${activeSection === link.id ? styles.active : ""}`}
              tabIndex={isMenuOpen ? 0 : -1}
              aria-label={`Navigate to ${link.label} section`}
              aria-current={activeSection === link.id ? "page" : undefined}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div
            className={styles.overlay}
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </nav>
  );
}
