'use client'

import { useState, useEffect } from 'react'
import styles from './TopNavigation.module.css'

interface NavigationProps {
  className?: string
}

export default function TopNavigation({ className = '' }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect for navigation background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
    setIsMenuOpen(false) // Close mobile menu after navigation
  }

  // Handle mobile menu toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Navigation links configuration
  const navLinks = [
    { id: 'about', label: 'About', href: '#about' },
    { id: 'skills', label: 'Technical', href: '#skills' },
    { id: 'projects', label: 'Projects', href: '#projects' },
    { id: 'contact', label: 'Contact', href: '#contact' }
  ]

  return (
    <nav 
      className={`${styles.navigation} ${isScrolled ? styles.scrolled : ''} ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={styles.container}>
        {/* TG Logo */}
        <button
          onClick={() => scrollToSection('about')}
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
              className={styles.navLink}
              aria-label={`Navigate to ${link.label} section`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className={styles.mobileMenuButton}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerOpen : ''}`}></span>
          <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerOpen : ''}`}></span>
          <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerOpen : ''}`}></span>
        </button>

        {/* Mobile Navigation Menu */}
        <div 
          id="mobile-navigation"
          className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNavOpen : ''}`}
          aria-hidden={!isMenuOpen}
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={styles.mobileNavLink}
              tabIndex={isMenuOpen ? 0 : -1}
              aria-label={`Navigate to ${link.label} section`}
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
  )
}