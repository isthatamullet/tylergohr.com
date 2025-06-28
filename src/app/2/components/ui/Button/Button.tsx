"use client"

import React from 'react'
import { ClientMotionDiv } from '@/app/2/lib/framer-motion-client'
import styles from './Button.module.css'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  
  /**
   * Size of the button
   */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  
  /**
   * Section context for optimized styling
   */
  section?: 'hero' | 'about' | 'results' | 'case-studies' | 'how-i-work' | 'technical-expertise' | 'contact'
  
  /**
   * Button content
   */
  children: React.ReactNode
  
  /**
   * Additional CSS classes
   */
  className?: string
  
  /**
   * Whether button is in loading state
   */
  loading?: boolean
  
  /**
   * Whether button is disabled
   */
  disabled?: boolean
  
  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

/**
 * Professional button component with section-matched styling and smooth animations
 * Designed for the Enterprise Solutions Architect portfolio
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  section = 'hero',
  children,
  className = '',
  loading = false,
  disabled = false,
  onClick,
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    styles[`button--${section}`],
    loading && styles['button--loading'],
    disabled && styles['button--disabled'],
    className
  ].filter(Boolean).join(' ')

  return (
    <ClientMotionDiv
      whileHover={{ 
        scale: disabled || loading ? 1 : 1.02,
        y: disabled || loading ? 0 : -2 
      }}
      whileTap={{ 
        scale: disabled || loading ? 1 : 0.98 
      }}
      whileFocus={{
        scale: disabled || loading ? 1 : 1.01,
        y: disabled || loading ? 0 : -1
      }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        duration: 0.15 
      }}
      animate={{
        scale: 1,
        y: 0
      }}
    >
      <button
        className={buttonClasses}
        disabled={disabled || loading}
        onClick={onClick}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className={styles.spinner} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" className={styles.spinnerIcon}>
              <circle 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
                strokeDasharray="31.416"
                strokeDashoffset="31.416"
              />
            </svg>
          </span>
        )}
        
        <span className={loading ? styles.buttonTextLoading : styles.buttonText}>
          {children}
        </span>
      </button>
    </ClientMotionDiv>
  )
}

/**
 * Link-styled button for navigation actions
 */
export interface LinkButtonProps extends Omit<ButtonProps, 'variant'> {
  href?: string
  target?: string
  rel?: string
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  target,
  rel,
  children,
  ...props
}) => {
  if (href) {
    return (
      <a href={href} target={target} rel={rel} style={{ textDecoration: 'none' }}>
        <Button variant="ghost" {...props}>
          {children}
        </Button>
      </a>
    )
  }
  
  return <Button variant="ghost" {...props}>{children}</Button>
}

export default Button