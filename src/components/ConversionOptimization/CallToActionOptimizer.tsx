"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Button } from '../ui/Button/Button'
import { ClientMotionDiv } from '@/app/2/lib/framer-motion-client'
import styles from './CallToActionOptimizer.module.css'

export interface CTAContext {
  currentSection: string
  scrollProgress: number
  timeOnPage: number
  sectionsViewed: string[]
  interactionEvents: string[]
  deviceType: 'mobile' | 'tablet' | 'desktop'
  isReturningVisitor: boolean
  engagementLevel: 'low' | 'medium' | 'high'
}

export interface CTAVariant {
  id: string
  text: string
  description?: string
  urgency: 'low' | 'medium' | 'high' | 'urgent'
  target: 'contact' | 'case-studies' | 'technical-expertise' | 'how-i-work' | 'external'
  action?: () => void
  href?: string
  conditions: {
    minScrollProgress?: number
    minTimeOnPage?: number
    requiredSections?: string[]
    engagementLevel?: CTAContext['engagementLevel'][]
    deviceTypes?: CTAContext['deviceType'][]
  }
}

export interface CallToActionOptimizerProps {
  className?: string
  position?: 'floating' | 'inline' | 'modal' | 'banner'
  context: CTAContext
  customVariants?: CTAVariant[]
  onCTAClick?: (variant: CTAVariant, context: CTAContext) => void
  disabled?: boolean
}

/**
 * Call To Action Optimizer Component
 * Dynamic, context-aware CTAs that adapt based on user behavior and engagement
 * Designed for conversion optimization and intelligent user journey guidance
 */
export const CallToActionOptimizer: React.FC<CallToActionOptimizerProps> = ({
  className,
  position = 'floating',
  context,
  customVariants = [],
  onCTAClick,
  disabled = false
}) => {
  const [currentVariant, setCurrentVariant] = useState<CTAVariant | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false)

  // Default CTA variants with intelligent targeting
  const defaultVariants: CTAVariant[] = useMemo(() => [
    // Early engagement - Hero/About sections
    {
      id: 'hero-project-start',
      text: 'Start Your Project',
      description: 'Ready to transform your technical challenges?',
      urgency: 'medium',
      target: 'contact',
      conditions: {
        minScrollProgress: 25,
        minTimeOnPage: 15000,
        requiredSections: ['hero'],
        engagementLevel: ['low', 'medium', 'high']
      }
    },
    
    // Case studies engagement
    {
      id: 'case-studies-impressed',
      text: 'Discuss My Similar Project',
      description: 'Impressed by these results? Let\'s talk about your project.',
      urgency: 'high',
      target: 'contact',
      conditions: {
        minScrollProgress: 30,
        minTimeOnPage: 60000, // 1 minute
        requiredSections: ['case-studies'],
        engagementLevel: ['medium', 'high']
      }
    },
    
    // Technical expertise engagement
    {
      id: 'technical-qualified',
      text: 'Get Expert Technical Leadership',
      description: 'Need this level of expertise for your team?',
      urgency: 'high',
      target: 'contact',
      conditions: {
        minScrollProgress: 50,
        minTimeOnPage: 90000, // 1.5 minutes
        requiredSections: ['technical-expertise'],
        engagementLevel: ['high']
      }
    },
    
    // Process methodology engagement
    {
      id: 'process-confident',
      text: 'Apply This Process to My Project',
      description: 'This process could solve your challenges.',
      urgency: 'medium',
      target: 'contact',
      conditions: {
        minScrollProgress: 40,
        minTimeOnPage: 75000, // 1.25 minutes
        requiredSections: ['how-i-work'],
        engagementLevel: ['medium', 'high']
      }
    },
    
    // High engagement qualifier
    {
      id: 'highly-engaged',
      text: 'Schedule Strategy Session',
      description: 'You\'ve seen enough. Let\'s discuss your specific needs.',
      urgency: 'urgent',
      target: 'contact',
      conditions: {
        minScrollProgress: 70,
        minTimeOnPage: 120000, // 2 minutes
        requiredSections: ['case-studies', 'technical-expertise'],
        engagementLevel: ['high']
      }
    },
    
    // Mobile-specific quick action
    {
      id: 'mobile-quick-connect',
      text: 'Quick Project Discussion',
      description: 'Fast-track your project inquiry',
      urgency: 'medium',
      target: 'contact',
      conditions: {
        minScrollProgress: 25,
        minTimeOnPage: 45000, // 45 seconds
        deviceTypes: ['mobile'],
        engagementLevel: ['medium', 'high']
      }
    },
    
    
    // Returning visitor re-engagement
    {
      id: 'returning-visitor',
      text: 'Ready to Move Forward?',
      description: 'Welcome back! Let\'s continue where we left off.',
      urgency: 'high',
      target: 'contact',
      conditions: {
        minScrollProgress: 10,
        minTimeOnPage: 15000, // 15 seconds
        engagementLevel: ['medium', 'high']
      }
    },
    
    // Deep portfolio exploration
    {
      id: 'portfolio-explorer',
      text: 'See More Technical Solutions',
      description: 'Explore my complete portfolio of enterprise solutions',
      urgency: 'low',
      target: 'case-studies',
      conditions: {
        minScrollProgress: 60,
        minTimeOnPage: 150000, // 2.5 minutes
        requiredSections: ['technical-expertise', 'how-i-work'],
        engagementLevel: ['high']
      }
    }
  ], [])

  // Combine default and custom variants
  const allVariants = useMemo(() => [
    ...defaultVariants,
    ...customVariants
  ], [defaultVariants, customVariants])

  // Check if a variant meets its conditions
  const checkVariantConditions = useCallback((variant: CTAVariant): boolean => {
    const { conditions } = variant
    
    // Check scroll progress
    if (conditions.minScrollProgress !== undefined && 
        context.scrollProgress < conditions.minScrollProgress) {
      return false
    }
    
    // Check time on page
    if (conditions.minTimeOnPage !== undefined && 
        context.timeOnPage < conditions.minTimeOnPage) {
      return false
    }
    
    // Check required sections
    if (conditions.requiredSections && 
        !conditions.requiredSections.every(section => 
          context.sectionsViewed.includes(section))) {
      return false
    }
    
    // Check engagement level
    if (conditions.engagementLevel && 
        !conditions.engagementLevel.includes(context.engagementLevel)) {
      return false
    }
    
    // Check device types
    if (conditions.deviceTypes && 
        !conditions.deviceTypes.includes(context.deviceType)) {
      return false
    }
    
    return true
  }, [context])

  // Find the best CTA variant for current context
  const selectOptimalVariant = useCallback((): CTAVariant | null => {
    // Filter variants that meet conditions
    const qualifiedVariants = allVariants.filter(checkVariantConditions)
    
    if (qualifiedVariants.length === 0) {
      return null
    }
    
    // Prioritize by urgency and specificity
    const prioritizedVariants = qualifiedVariants.sort((a, b) => {
      // Urgency priority
      const urgencyOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 }
      const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency]
      if (urgencyDiff !== 0) return urgencyDiff
      
      // Returning visitor gets priority
      if (context.isReturningVisitor) {
        if (a.id === 'returning-visitor') return -1
        if (b.id === 'returning-visitor') return 1
      }
      
      // High engagement gets priority
      if (context.engagementLevel === 'high') {
        const aHighEngagement = a.conditions.engagementLevel?.includes('high')
        const bHighEngagement = b.conditions.engagementLevel?.includes('high')
        if (aHighEngagement && !bHighEngagement) return -1
        if (bHighEngagement && !aHighEngagement) return 1
      }
      
      // More specific conditions (more required sections) get priority
      const aSpecificity = a.conditions.requiredSections?.length || 0
      const bSpecificity = b.conditions.requiredSections?.length || 0
      return bSpecificity - aSpecificity
    })
    
    return prioritizedVariants[0]
  }, [allVariants, checkVariantConditions, context])

  // Update current variant when context changes
  useEffect(() => {
    if (disabled || hasBeenDismissed) return
    
    const optimalVariant = selectOptimalVariant()
    
    // Only update if variant actually changed
    if (optimalVariant?.id !== currentVariant?.id) {
      setCurrentVariant(optimalVariant)
      setIsVisible(!!optimalVariant)
    }
  }, [context, selectOptimalVariant, disabled, hasBeenDismissed, currentVariant?.id])

  // Handle CTA click
  const handleCTAClick = useCallback(() => {
    if (!currentVariant) return
    
    // Call tracking callback
    if (onCTAClick) {
      onCTAClick(currentVariant, context)
    }
    
    // Handle navigation
    if (currentVariant.action) {
      currentVariant.action()
    } else if (currentVariant.href) {
      window.open(currentVariant.href, '_blank')
    } else {
      // Default section navigation
      const targetElement = document.getElementById(currentVariant.target)
      if (targetElement) {
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - 70 // Navigation height
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }
    
    // Hide CTA after click
    setIsVisible(false)
    setTimeout(() => setHasBeenDismissed(true), 1000)
  }, [currentVariant, context, onCTAClick])

  // Handle CTA dismiss
  const handleDismiss = useCallback(() => {
    setIsVisible(false)
    setHasBeenDismissed(true)
  }, [])

  // Don't render if no variant or not visible
  if (!currentVariant || !isVisible || disabled) {
    return null
  }

  // Render based on position type
  const renderCTA = () => {
    const ctaContent = (
      <div className={`${styles.ctaContent} ${styles[`cta--${currentVariant.urgency}`]}`}>
        {currentVariant.description && (
          <p className={styles.ctaDescription}>
            {currentVariant.description}
          </p>
        )}
        <div className={styles.ctaActions}>
          <Button
            variant="primary"
            size={position === 'floating' ? 'md' : 'lg'}
            section="contact"
            onClick={handleCTAClick}
            className={styles.ctaButton}
          >
            {currentVariant.text}
          </Button>
          {position === 'floating' && (
            <button
              className={styles.dismissButton}
              onClick={handleDismiss}
              aria-label="Dismiss call to action"
            >
              ×
            </button>
          )}
        </div>
      </div>
    )

    return (
      <ClientMotionDiv
        initial={{ opacity: 0, y: position === 'floating' ? 20 : 0, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: position === 'floating' ? 20 : 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`${styles.ctaOptimizer} ${styles[`position--${position}`]} ${className || ''}`}
      >
        {ctaContent}
      </ClientMotionDiv>
    )
  }

  return renderCTA()
}

// Hook for managing CTA context
export const useCTAContext = (): [CTAContext, (updates: Partial<CTAContext>) => void] => {
  const [context, setContext] = useState<CTAContext>({
    currentSection: 'hero',
    scrollProgress: 0,
    timeOnPage: 0,
    sectionsViewed: [],
    interactionEvents: [],
    deviceType: 'desktop',
    isReturningVisitor: false,
    engagementLevel: 'low'
  })

  const updateContext = useCallback((updates: Partial<CTAContext>) => {
    setContext(prev => ({ ...prev, ...updates }))
  }, [])

  return [context, updateContext]
}

// Utility function to calculate engagement level
export const calculateEngagementLevel = (context: CTAContext): CTAContext['engagementLevel'] => {
  let score = 0
  
  // Time on page scoring
  if (context.timeOnPage > 120000) score += 3 // 2+ minutes
  else if (context.timeOnPage > 60000) score += 2 // 1+ minute
  else if (context.timeOnPage > 30000) score += 1 // 30+ seconds
  
  // Scroll progress scoring
  if (context.scrollProgress > 70) score += 3
  else if (context.scrollProgress > 50) score += 2
  else if (context.scrollProgress > 25) score += 1
  
  // Sections viewed scoring
  if (context.sectionsViewed.length > 3) score += 2
  else if (context.sectionsViewed.length > 1) score += 1
  
  // Interaction events scoring
  if (context.interactionEvents.length > 5) score += 2
  else if (context.interactionEvents.length > 2) score += 1
  
  // Determine engagement level
  if (score >= 8) return 'high'
  if (score >= 4) return 'medium'
  return 'low'
}

export default CallToActionOptimizer