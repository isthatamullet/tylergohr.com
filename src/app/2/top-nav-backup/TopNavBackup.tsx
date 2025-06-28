"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import styles from "./TopNavBackup.module.css";

interface TopNavBackupProps {
  className?: string;
}

/**
 * Backup Top Navigation Component
 * 
 * Clean, simple implementation based on screenshot IMG_8420.jpeg
 * Features:
 * - Fixed positioning that stays visible at all times
 * - Active link detection with intersection observer  
 * - Dropdown hover effects for WORK, PROCESS, SKILLS
 * - Visual design matches screenshot exactly
 */
export default function TopNavBackup({ className = "" }: TopNavBackupProps) {
  const [activeSection, setActiveSection] = useState("about");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pathname = usePathname();

  // Navigation height for scroll offset
  const NAV_HEIGHT = 70;

  // Navigation links - matches the screenshot
  const navLinks = [
    { id: "about", label: "ABOUT", hasDropdown: false },
    { id: "results", label: "RESULTS", hasDropdown: false },
    { id: "work", label: "WORK", hasDropdown: true },
    { id: "process", label: "PROCESS", hasDropdown: true },
    { id: "skills", label: "SKILLS", hasDropdown: true },
    { id: "contact", label: "CONTACT", hasDropdown: false },
  ];

  // Dropdown content for hover effects
  const dropdownContent = {
    work: [
      { title: "Emmy-winning Streaming Platform", description: "Technical excellence recognized by Television Academy", href: "/2/case-studies?tab=emmy" },
      { title: "Fox Corporation Cost Optimization", description: "$2M+ savings through automation architecture", href: "/2/case-studies?tab=fox" },
      { title: "Warner Bros Delivery Enhancement", description: "96% success rate workflow optimization", href: "/2/case-studies?tab=warner" },
      { title: "AI-Powered Media Automation", description: "Revolutionary automation for SDI Media", href: "/2/case-studies?tab=ai" },
      { title: "View All Case Studies", description: "Complete project portfolio", href: "/2/case-studies", isPageLink: true }
    ],
    process: [
      { title: "Discovery & Requirements", description: "Comprehensive project analysis", href: "/2/how-i-work#discovery" },
      { title: "Research & Planning", description: "Technical architecture planning", href: "/2/how-i-work#research" },
      { title: "Design & Prototyping", description: "User experience validation", href: "/2/how-i-work#design" },
      { title: "Implementation & Development", description: "Agile development process", href: "/2/how-i-work#implementation" },
      { title: "Testing & Quality Assurance", description: "Performance optimization", href: "/2/how-i-work#testing" },
      { title: "Deployment & Launch", description: "Production deployment", href: "/2/how-i-work#deployment" },
      { title: "View Full Process", description: "Complete methodology", href: "/2/how-i-work", isPageLink: true }
    ],
    skills: [
      { title: "Frontend Development", description: "React, Next.js, TypeScript", href: "/2/technical-expertise?tab=frontend", icon: "⚛️" },
      { title: "Backend Architecture", description: "Node.js, Python, databases", href: "/2/technical-expertise?tab=backend", icon: "🔧" },
      { title: "Cloud Infrastructure", description: "AWS, Google Cloud, DevOps", href: "/2/technical-expertise?tab=cloud", icon: "☁️" },
      { title: "Team Leadership", description: "Agile, project management", href: "/2/technical-expertise?tab=leadership", icon: "👥" },
      { title: "AI Innovation", description: "Machine learning integration", href: "/2/technical-expertise?tab=ai", icon: "🤖" },
      { title: "View All Skills", description: "Complete technical expertise", href: "/2/technical-expertise", isPageLink: true }
    ]
  };

  // Navigate to section with smooth scroll
  const navigateToSection = useCallback((sectionId: string) => {
    // If not on /2 page, navigate there first
    if (pathname !== "/2") {
      window.location.href = `/2#${sectionId}`;
      return;
    }
    
    // Same-page navigation with smooth scroll
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - NAV_HEIGHT;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Update URL hash and active state
      window.history.pushState(null, "", `/2#${sectionId}`);
      setActiveSection(sectionId);
    }
  }, [pathname]);

  // Logo click - navigate to top
  const navigateToHome = useCallback(() => {
    if (pathname !== "/2") {
      window.location.href = "/2";
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("about");
      window.history.pushState(null, "", "/2");
    }
  }, [pathname]);

  // Dropdown handlers
  const handleDropdownEnter = useCallback((linkId: string) => {
    setActiveDropdown(linkId);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  const handleDropdownItemClick = useCallback((href: string) => {
    setActiveDropdown(null);
    window.location.href = href;
  }, []);

  // Intersection Observer for active section detection
  useEffect(() => {
    // Only set up on /2 landing page
    if (pathname !== "/2") {
      return;
    }

    const sections = ["hero", "about", "results", "work", "process", "skills", "contact"];
    
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Section priority for overlapping sections
    const sectionPriority: Record<string, number> = {
      'contact': 7,
      'skills': 6,
      'process': 5,
      'work': 4,
      'results': 3,
      'about': 2,
      'hero': 1
    };

    const setupObserver = () => {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const intersectingSections = entries
            .filter(entry => entry.isIntersecting)
            .map(entry => entry.target.id)
            .filter(id => sections.includes(id));
          
          if (intersectingSections.length > 0) {
            const highestPrioritySection = intersectingSections.reduce((highest, current) => {
              return sectionPriority[current] > sectionPriority[highest] ? current : highest;
            });
            
            setActiveSection(highestPrioritySection);
            
            // Update URL hash
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

      // Observe all sections
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          observerRef.current?.observe(element);
        }
      });
    };

    // Setup with delay for DOM readiness
    const timeoutId = setTimeout(setupObserver, 100);

    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [pathname]);

  // Handle page route active states
  useEffect(() => {
    if (pathname.startsWith("/2/case-studies")) {
      setActiveSection("work");
    } else if (pathname.startsWith("/2/how-i-work")) {
      setActiveSection("process");
    } else if (pathname.startsWith("/2/technical-expertise")) {
      setActiveSection("skills");
    } else if (pathname === "/2") {
      const hash = window.location.hash.slice(1);
      if (hash && ["hero", "about", "results", "work", "process", "skills", "contact"].includes(hash)) {
        setActiveSection(hash);
      } else {
        setActiveSection("about");
      }
    }
  }, [pathname]);

  return (
    <nav className={`${styles.topNavBackup} ${className}`} role="navigation">
      <div className={styles.container}>
        {/* TG Logo - matches screenshot */}
        <button 
          onClick={navigateToHome}
          className={styles.logo}
          aria-label="Tyler Gohr - Return to homepage"
        >
          <span className={styles.logoText}>TG</span>
        </button>

        {/* Navigation Links - matches screenshot */}
        <div className={styles.navLinks}>
          {navLinks.map((link) => (
            <div
              key={link.id}
              className={`${styles.navItem} ${link.hasDropdown ? styles.hasDropdown : ''}`}
              onMouseEnter={() => link.hasDropdown && handleDropdownEnter(link.id)}
              onMouseLeave={() => link.hasDropdown && handleDropdownLeave()}
            >
              <button
                onClick={() => navigateToSection(link.id)}
                className={`${styles.navLink} ${activeSection === link.id ? styles.active : ""}`}
                aria-label={`Navigate to ${link.label} section`}
              >
                {link.label}
              </button>
              
              {/* Dropdown Menu */}
              {link.hasDropdown && activeDropdown === link.id && (
                <div className={styles.dropdown}>
                  {dropdownContent[link.id as keyof typeof dropdownContent]?.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleDropdownItemClick(item.href)}
                      className={`${styles.dropdownItem} ${item.isPageLink ? styles.pageLink : ''}`}
                    >
                      <div className={styles.itemContent}>
                        {'icon' in item && item.icon && <span className={styles.itemIcon}>{item.icon}</span>}
                        <div className={styles.itemText}>
                          <div className={styles.itemTitle}>{item.title}</div>
                          <div className={styles.itemDescription}>{item.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}