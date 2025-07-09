"use client"

import React from 'react'
import styles from './Section.module.css'

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Background theme for the section
   */
  background?: 'hero' | 'about' | 'results' | 'case-studies' | 'how-i-work' | 'technical-expertise' | 'contact' | 'footer'
  
  /**
   * Semantic HTML element to render
   */
  as?: 'section' | 'div' | 'main' | 'article' | 'aside' | 'footer'
  
  /**
   * Content of the section
   */
  children: React.ReactNode
  
  /**
   * Additional CSS classes
   */
  className?: string
  
  /**
   * Whether to include the standard container wrapper
   */
  container?: boolean
  
  /**
   * Custom container max-width (overrides default)
   */
  maxWidth?: string
  
  /**
   * Whether to center content horizontally
   */
  centered?: boolean
  
  /**
   * Vertical padding override
   */
  paddingY?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  
  /**
   * Horizontal padding override
   */
  paddingX?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * Reusable section wrapper component with brand-matched backgrounds and responsive containers
 * Designed for the Enterprise Solutions Architect portfolio /2 directory
 */
export const Section: React.FC<SectionProps> = ({
  background = 'hero',
  as: Element = 'section',
  children,
  className = '',
  container = true,
  maxWidth,
  centered = false,
  paddingY = 'lg',
  paddingX = 'lg',
  ...props
}) => {
  const sectionClasses = [
    styles.section,
    styles[`section--${background}`],
    styles[`section--padding-y-${paddingY}`],
    styles[`section--padding-x-${paddingX}`],
    centered && styles['section--centered'],
    className
  ].filter(Boolean).join(' ')

  const containerClasses = [
    styles.container,
    maxWidth && styles['container--custom-width']
  ].filter(Boolean).join(' ')

  const content = container ? (
    <div 
      className={containerClasses}
      style={maxWidth ? { maxWidth } : undefined}
    >
      {children}
    </div>
  ) : children

  return (
    <Element
      className={sectionClasses}
      {...props}
    >
      {content}
    </Element>
  )
}

/**
 * Pre-configured section components for common use cases
 */

export const HeroSection: React.FC<Omit<SectionProps, 'background'>> = (props) => (
  <Section background="hero" {...props} />
)

export const AboutSection: React.FC<Omit<SectionProps, 'background'>> = (props) => (
  <Section background="about" {...props} />
)

export const ResultsSection: React.FC<Omit<SectionProps, 'background'>> = (props) => (
  <Section background="results" {...props} />
)

export const CaseStudiesSection: React.FC<Omit<SectionProps, 'background'>> = (props) => (
  <Section background="case-studies" {...props} />
)

export const HowIWorkSection: React.FC<Omit<SectionProps, 'background'>> = (props) => (
  <Section background="how-i-work" {...props} />
)

export const TechnicalExpertiseSection: React.FC<Omit<SectionProps, 'background'>> = (props) => (
  <Section background="technical-expertise" {...props} />
)

export const ContactSection: React.FC<Omit<SectionProps, 'background'>> = (props) => (
  <Section background="contact" {...props} />
)

export default Section