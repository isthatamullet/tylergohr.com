"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";
import DropdownMenu, { DropdownItem } from "./DropdownMenu";

interface NavigationProps {
  className?: string;
}

interface NavLinkConfig {
  id: string;
  label: string;
  href: string;
  type: 'simple' | 'dropdown';
  dropdownItems?: DropdownItem[];
}

export default function Navigation({ className = "" }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileDropdown, setExpandedMobileDropdown] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  // Navigation height for offset calculation
  const NAV_HEIGHT = 70;

  // Dropdown menu data
  const workDropdownItems: DropdownItem[] = [
    {
      title: "Emmy-winning Streaming Platform",
      description: "Technical excellence recognized by Television Academy",
      href: "/2/case-studies?tab=emmy",
      badge: "Emmy Award"
    },
    {
      title: "Fox Corporation Cost Optimization", 
      description: "$2M+ savings through automation architecture",
      href: "/2/case-studies?tab=fox",
      badge: "Cost Savings"
    },
    {
      title: "Warner Bros Delivery Enhancement",
      description: "96% success rate workflow optimization", 
      href: "/2/case-studies?tab=warner",
      badge: "Success Rate"
    },
    {
      title: "AI-Powered Media Automation",
      description: "Revolutionary automation for SDI Media",
      href: "/2/case-studies?tab=ai", 
      badge: "Innovation"
    },
    {
      title: "View All Case Studies",
      description: "Complete project portfolio and technical details",
      href: "/2/case-studies",
      type: "page-link"
    }
  ];

  const processDropdownItems: DropdownItem[] = [
    {
      title: "Discovery & Requirements",
      description: "Comprehensive project analysis and stakeholder alignment",
      href: "/2/how-i-work#discovery"
    },
    {
      title: "Research & Planning", 
      description: "Technical architecture and strategic planning",
      href: "/2/how-i-work#research"
    },
    {
      title: "Design & Prototyping",
      description: "User experience and system design validation",
      href: "/2/how-i-work#design"
    },
    {
      title: "Implementation & Development",
      description: "Agile development with continuous integration",
      href: "/2/how-i-work#implementation"
    },
    {
      title: "Testing & Quality Assurance",
      description: "Comprehensive testing and performance optimization",
      href: "/2/how-i-work#testing"
    },
    {
      title: "Deployment & Launch",
      description: "Production deployment and go-live coordination",
      href: "/2/how-i-work#deployment"
    },
    {
      title: "Optimization & Support",
      description: "Ongoing performance monitoring and enhancement",
      href: "/2/how-i-work#optimization"
    },
    {
      title: "View Full Process",
      description: "Complete development methodology and case studies",
      href: "/2/how-i-work",
      type: "page-link"
    }
  ];

  const skillsDropdownItems: DropdownItem[] = [
    {
      title: "Frontend Development",
      description: "React, Next.js, TypeScript, and modern CSS",
      href: "/2/technical-expertise?tab=frontend",
      icon: "⚛️"
    },
    {
      title: "Backend Architecture",
      description: "Node.js, Python, database design, and API development", 
      href: "/2/technical-expertise?tab=backend",
      icon: "🔧"
    },
    {
      title: "Cloud Infrastructure",
      description: "AWS, Google Cloud, Docker, and DevOps automation",
      href: "/2/technical-expertise?tab=cloud", 
      icon: "☁️"
    },
    {
      title: "Team Leadership",
      description: "Agile methodology, project management, and mentoring",
      href: "/2/technical-expertise?tab=leadership",
      icon: "👥"
    },
    {
      title: "AI Innovation",
      description: "Machine learning integration and automation solutions",
      href: "/2/technical-expertise?tab=ai",
      icon: "🤖"
    },
    {
      title: "View All Skills",
      description: "Complete technical expertise and project examples",
      href: "/2/technical-expertise",
      type: "page-link"
    }
  ];

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
      if (hash && ["hero", "about", "results", "work", "process", "skills", "contact"].includes(hash)) {
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

    const sections = ["hero", "about", "results", "work", "process", "skills", "contact"];
    
    // Section priority system - higher priority sections override lower priority ones
    const sectionPriority: Record<string, number> = {
      'contact': 7,
      'skills': 6,
      'process': 5,
      'work': 4,
      'results': 3,
      'about': 2,
      'hero': 1
    };
    
    // Set up observer with DOM ready delay
    const setupObserver = () => {
      // Clean up previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          // Find all currently intersecting sections
          const intersectingSections = entries
            .filter(entry => entry.isIntersecting)
            .map(entry => entry.target.id)
            .filter(id => sections.includes(id));
          
          if (intersectingSections.length > 0) {
            // Select section with highest priority
            const highestPrioritySection = intersectingSections.reduce((highest, current) => {
              return sectionPriority[current] > sectionPriority[highest] ? current : highest;
            });
            
            setActiveSection(highestPrioritySection);
            
            // Update URL hash without causing scroll
            if (window.location.hash !== `#${highestPrioritySection}`) {
              window.history.replaceState(null, "", `/2#${highestPrioritySection}`);
            }
          }
        },
        {
          threshold: 0.6,
          rootMargin: `-${NAV_HEIGHT}px 0px -40% 0px`,
        }
      );

      // Observe all sections with element verification
      let observedCount = 0;
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          observerRef.current?.observe(element);
          observedCount++;
        } else {
          console.warn(`Navigation: Section element not found: ${sectionId}`);
        }
      });

      console.log(`Navigation: Observing ${observedCount}/${sections.length} sections`);
      
      // If not all sections found, retry after a longer delay
      if (observedCount < sections.length) {
        setTimeout(() => {
          console.log('Navigation: Retrying section observation...');
          setupObserver();
        }, 1000);
      }
    };

    // Initial setup with longer delay to ensure all components are rendered
    const timeoutId = setTimeout(setupObserver, 500);

    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [pathname]);

  // Handle mobile menu toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Dropdown handlers
  const handleDropdownEnter = useCallback((linkId: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(linkId);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150); // Small delay to prevent flickering
  }, []);

  const handleDropdownItemClick = useCallback((href: string) => {
    // Close dropdown immediately
    setActiveDropdown(null);
    setExpandedMobileDropdown(null);
    setIsMenuOpen(false);
    
    // Navigate to the href
    window.location.href = href;
  }, []);

  // Mobile dropdown handlers
  const toggleMobileDropdown = useCallback((linkId: string) => {
    setExpandedMobileDropdown(expandedMobileDropdown === linkId ? null : linkId);
  }, [expandedMobileDropdown]);

  const handleMobileNavClick = useCallback((link: NavLinkConfig) => {
    if (link.type === 'dropdown') {
      // Toggle dropdown for dropdown links
      toggleMobileDropdown(link.id);
    } else {
      // Navigate for simple links
      navigateToSection(link.id);
    }
  }, [navigateToSection, toggleMobileDropdown]);

  // Navigation links configuration for /2 routes
  const navLinks: NavLinkConfig[] = [
    { id: "about", label: "About", href: "#about", type: "simple" },
    { id: "results", label: "Results", href: "#results", type: "simple" },
    { 
      id: "work", 
      label: "Work", 
      href: "#work", 
      type: "dropdown",
      dropdownItems: workDropdownItems
    },
    { 
      id: "process", 
      label: "Process", 
      href: "#process", 
      type: "dropdown",
      dropdownItems: processDropdownItems
    },
    { 
      id: "skills", 
      label: "Skills", 
      href: "#skills", 
      type: "dropdown",
      dropdownItems: skillsDropdownItems
    },
    { id: "contact", label: "Contact", href: "#contact", type: "simple" },
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
            <div
              key={link.id}
              className={`${styles.navItem} ${link.type === 'dropdown' ? styles.hasDropdown : ''}`}
              onMouseEnter={() => link.type === 'dropdown' && handleDropdownEnter(link.id)}
              onMouseLeave={() => link.type === 'dropdown' && handleDropdownLeave()}
            >
              <button
                onClick={() => navigateToSection(link.id)}
                className={`${styles.navLink} ${activeSection === link.id ? styles.active : ""}`}
                aria-label={`Navigate to ${link.label} section`}
                aria-current={activeSection === link.id ? "page" : undefined}
                aria-haspopup={link.type === 'dropdown' ? "menu" : undefined}
                aria-expanded={link.type === 'dropdown' && activeDropdown === link.id ? "true" : "false"}
              >
                {link.label}
              </button>
              
              {/* Dropdown Menu */}
              {link.type === 'dropdown' && link.dropdownItems && (
                <DropdownMenu
                  items={link.dropdownItems}
                  isVisible={activeDropdown === link.id}
                  onItemClick={handleDropdownItemClick}
                />
              )}
            </div>
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
            <div key={link.id} className={styles.mobileNavItem}>
              <div className={styles.mobileNavLinkContainer}>
                <button
                  onClick={() => handleMobileNavClick(link)}
                  className={`${styles.mobileNavLink} ${activeSection === link.id ? styles.active : ""}`}
                  tabIndex={isMenuOpen ? 0 : -1}
                  aria-label={`Navigate to ${link.label} section`}
                  aria-current={activeSection === link.id ? "page" : undefined}
                  aria-expanded={link.type === 'dropdown' ? expandedMobileDropdown === link.id : undefined}
                >
                  {link.label}
                </button>
                
                {/* Dropdown Toggle Arrow for mobile */}
                {link.type === 'dropdown' && (
                  <button
                    onClick={() => toggleMobileDropdown(link.id)}
                    className={`${styles.mobileDropdownToggle} ${expandedMobileDropdown === link.id ? styles.expanded : ''}`}
                    tabIndex={isMenuOpen ? 0 : -1}
                    aria-label={`${expandedMobileDropdown === link.id ? 'Collapse' : 'Expand'} ${link.label} menu`}
                  >
                    <span className={styles.dropdownArrow}>▼</span>
                  </button>
                )}
              </div>
              
              {/* Mobile Dropdown Content */}
              {link.type === 'dropdown' && link.dropdownItems && expandedMobileDropdown === link.id && (
                <div className={styles.mobileDropdownContent}>
                  {link.dropdownItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleDropdownItemClick(item.href)}
                      className={`${styles.mobileDropdownItem} ${item.type === 'page-link' ? styles.mobilePageLink : ''}`}
                      tabIndex={isMenuOpen ? 0 : -1}
                    >
                      <div className={styles.mobileDropdownItemContent}>
                        {item.icon && (
                          <span className={styles.mobileDropdownIcon}>{item.icon}</span>
                        )}
                        <div className={styles.mobileDropdownText}>
                          <div className={styles.mobileDropdownTitle}>
                            {item.title}
                            {item.badge && (
                              <span className={styles.mobileDropdownBadge}>{item.badge}</span>
                            )}
                          </div>
                          <div className={styles.mobileDropdownDescription}>
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
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