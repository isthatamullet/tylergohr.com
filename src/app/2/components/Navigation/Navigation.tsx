"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className = "" }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pathname = usePathname();

  // Navigation height for offset calculation
  const NAV_HEIGHT = 70;

  // Throttled scroll handler for performance
  const tickingRef = useRef(false);
  
  const throttledScrollHandler = useCallback(() => {
    if (!tickingRef.current) {
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 200); // Updated trigger point to 200px
        tickingRef.current = false;
      });
      tickingRef.current = true;
    }
  }, []);

  // Enhanced navigation handler for /2 routes
  const navigateToSection = useCallback((sectionId: string) => {
    // If we're not on the /2 landing page, navigate to landing page with hash
    if (pathname !== "/2") {
      window.location.href = `/2#${sectionId}`;
      return;
    }
    
    // Same-page navigation
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - NAV_HEIGHT;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Update URL hash
      window.history.pushState(null, "", `/2#${sectionId}`);
      
      // Update active section immediately for responsive feedback
      setActiveSection(sectionId);
    }
    setIsMenuOpen(false); // Close mobile menu after navigation
  }, [pathname]);

  // Logo navigation - always go to /2 landing page top
  const navigateToHome = useCallback(() => {
    if (pathname !== "/2") {
      window.location.href = "/2";
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("about");
      window.history.pushState(null, "", "/2");
    }
    setIsMenuOpen(false);
  }, [pathname]);

  // Handle scroll effect for navigation background
  useEffect(() => {
    window.addEventListener("scroll", throttledScrollHandler, { passive: true });
    return () => window.removeEventListener("scroll", throttledScrollHandler);
  }, [throttledScrollHandler]);

  // Handle active state based on current page/section
  useEffect(() => {
    // If we're on case studies page, set work as active
    if (pathname.startsWith("/2/case-studies")) {
      setActiveSection("work");
      return;
    }
    
    // If we're on how I work page, set process as active  
    if (pathname.startsWith("/2/how-i-work")) {
      setActiveSection("process");
      return;
    }
    
    // If we're on technical expertise page, set skills as active
    if (pathname.startsWith("/2/technical-expertise")) {
      setActiveSection("skills");
      return;
    }
    
    // If we're on /2 landing page, check for hash or default to about
    if (pathname === "/2") {
      const hash = window.location.hash.slice(1);
      if (hash && ["about", "results", "work", "process", "skills", "contact"].includes(hash)) {
        setActiveSection(hash);
        // Small delay to ensure DOM is ready for scrolling
        setTimeout(() => navigateToSection(hash), 100);
      } else {
        setActiveSection("about");
      }
    }
  }, [pathname, navigateToSection]);

  // Intersection Observer for active section detection (only on landing page)
  useEffect(() => {
    // Only set up intersection observer on /2 landing page
    if (pathname !== "/2") {
      return;
    }

    const sections = ["about", "results", "work", "process", "skills", "contact"];
    
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
              setActiveSection(sectionId);
              
              // Update URL hash without causing scroll
              if (window.location.hash !== `#${sectionId}`) {
                window.history.replaceState(null, "", `/2#${sectionId}`);
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
  }, [pathname]);

  // Handle mobile menu toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Navigation links configuration for /2 routes
  const navLinks = [
    { id: "about", label: "About", href: "#about", type: "section" },
    { id: "results", label: "Results", href: "#results", type: "section" },
    { id: "work", label: "Work", href: "#work", type: "section" },
    { id: "process", label: "Process", href: "#process", type: "section" },
    { id: "skills", label: "Skills", href: "#skills", type: "section" },
    { id: "contact", label: "Contact", href: "#contact", type: "section" },
  ];

  return (
    <nav
      className={`${styles.navigation} ${isScrolled ? styles.scrolled : ""} ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={styles.container}>
        {/* TG Logo - with logo float animation preparation */}
        <button
          onClick={navigateToHome}
          className={`${styles.logo} ${isScrolled ? styles.logoScrolled : ""}`}
          aria-label="Tyler Gohr - Return to Enterprise Solutions homepage"
        >
          <span className={styles.logoText}>TG</span>
        </button>

        {/* Desktop Navigation Links */}
        <div className={styles.desktopNav}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => navigateToSection(link.id)}
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
              onClick={() => navigateToSection(link.id)}
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