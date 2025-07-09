"use client";

import React from 'react';
import { Section } from '../Section/Section';
import styles from './Footer.module.css';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleHomeClick = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  };

  const handleGitHubClick = () => {
    window.open('https://github.com/tylergohr', '_blank', 'noopener,noreferrer');
  };

  return (
    <Section background="footer" as="footer" className={className} paddingY="lg">
      <div className={styles.footer}>
        {/* Row 1: GitHub Link */}
        <div className={styles.githubRow}>
          <button 
            onClick={handleGitHubClick}
            className={styles.githubLink}
            aria-label="Visit Tyler Gohr's GitHub profile (opens in new tab)"
          >
            GitHub
          </button>
        </div>

        {/* Row 2: Navigation Links */}
        <nav className={styles.navigationRow} aria-label="Footer navigation">
          <button 
            onClick={() => handleNavClick('about')}
            className={styles.navLink}
            aria-label="Scroll to About section"
          >
            About
          </button>
          <button 
            onClick={() => handleNavClick('results')}
            className={styles.navLink}
            aria-label="Scroll to Results section"
          >
            Results
          </button>
          <button 
            onClick={() => handleNavClick('work')}
            className={styles.navLink}
            aria-label="Scroll to Case Studies section"
          >
            Work
          </button>
          <button 
            onClick={() => handleNavClick('process')}
            className={styles.navLink}
            aria-label="Scroll to How I Work section"
          >
            Process
          </button>
          <button 
            onClick={() => handleNavClick('skills')}
            className={styles.navLink}
            aria-label="Scroll to Technical Expertise section"
          >
            Skills
          </button>
          <button 
            onClick={() => handleNavClick('contact')}
            className={styles.navLink}
            aria-label="Scroll to Contact section"
          >
            Contact
          </button>
        </nav>

        {/* Row 3: Home Link */}
        <div className={styles.homeRow}>
          <button 
            onClick={handleHomeClick}
            className={styles.homeLink}
            aria-label="Scroll to top of page"
          >
            Home
          </button>
        </div>
      </div>
    </Section>
  );
};

export default Footer;