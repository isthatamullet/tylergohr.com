"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./TopNavigation.module.css";

interface NavigationProps {
  className?: string;
}

export default function TopNavigation({ className = "" }: NavigationProps) {
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
        setIsScrolled(window.scrollY > 50);
        tickingRef.current = false;
      });
      tickingRef.current = true;
    }
  }, []);

  // Enhanced navigation handler for both same-page and cross-page navigation
  const navigateToSection = useCallback((sectionId: string) => {
    // If we're not on the homepage, navigate to homepage with hash
    if (pathname !== "/") {
      window.location.href = `/#${sectionId}`;
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
      window.history.pushState(null, "", `#${sectionId}`);
      
      // Update active section immediately for responsive feedback
      setActiveSection(sectionId);
    }
    setIsMenuOpen(false); // Close mobile menu after navigation
  }, [pathname]);

  // Logo navigation - always go to homepage top
  const navigateToHome = useCallback(() => {
    if (pathname !== "/") {
      window.location.href = "/";
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("about");
      window.history.pushState(null, "", "/");
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
    // If we're on blog page, set blog as active
    if (pathname.startsWith("/blog")) {
      setActiveSection("blog");
      return;
    }
    
    // If we're on homepage, check for hash or default to about
    if (pathname === "/") {
      const hash = window.location.hash.slice(1);
      if (hash && ["about", "skills", "projects", "contact"].includes(hash)) {
        setActiveSection(hash);
        // Small delay to ensure DOM is ready for scrolling
        setTimeout(() => navigateToSection(hash), 100);
      } else {
        setActiveSection("about");
      }
    }
  }, [pathname, navigateToSection]);

  // Intersection Observer for active section detection (only on homepage)
  useEffect(() => {
    // Only set up intersection observer on homepage
    if (pathname !== "/") {
      return;
    }

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
  }, [pathname]);

  // Handle mobile menu toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Navigation links configuration
  const navLinks = [
    { id: "about", label: "About", href: "#about", type: "section" },
    { id: "skills", label: "Technical", href: "#skills", type: "section" },
    { id: "projects", label: "Projects", href: "#projects", type: "section" },
    { id: "blog", label: "Blog", href: "/blog", type: "page" },
    { id: "contact", label: "Contact", href: "#contact", type: "section" },
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
          onClick={navigateToHome}
          className={styles.logo}
          aria-label="Tyler Gohr - Return to homepage"
        >
          <span className={styles.logoText}>TG</span>
        </button>

        {/* Desktop Navigation Links */}
        <div className={styles.desktopNav}>
          {navLinks.map((link) => (
            link.type === "page" ? (
              <Link
                key={link.id}
                href={link.href}
                className={`${styles.navLink} ${activeSection === link.id ? styles.active : ""}`}
                aria-label={`Navigate to ${link.label} page`}
                aria-current={activeSection === link.id ? "page" : undefined}
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.id}
                onClick={() => navigateToSection(link.id)}
                className={`${styles.navLink} ${activeSection === link.id ? styles.active : ""}`}
                aria-label={`Navigate to ${link.label} section`}
                aria-current={activeSection === link.id ? "page" : undefined}
              >
                {link.label}
              </button>
            )
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
            link.type === "page" ? (
              <Link
                key={link.id}
                href={link.href}
                className={`${styles.mobileNavLink} ${activeSection === link.id ? styles.active : ""}`}
                tabIndex={isMenuOpen ? 0 : -1}
                aria-label={`Navigate to ${link.label} page`}
                aria-current={activeSection === link.id ? "page" : undefined}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ) : (
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
            )
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
