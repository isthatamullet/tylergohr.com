"use client"

import React, { useState, useEffect, useCallback } from 'react'
import styles from './ContactForm.module.css'

export interface ContactFormData {
  name: string
  email: string
  projectType: 'web-app' | 'ecommerce' | 'leadership' | 'integration' | 'other'
  message: string
}

export interface FormErrors {
  name?: string
  email?: string
  message?: string
}

export interface ContactFormProps {
  className?: string
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

/**
 * Contact Form Component
 * Features real-time validation, multiple project types, and professional form handling
 */
export const ContactForm: React.FC<ContactFormProps> = ({ className }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    projectType: 'web-app',
    message: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [isFormValid, setIsFormValid] = useState(false)

  // Project type options with professional descriptions
  const projectTypeOptions = [
    { value: 'web-app', label: 'Web Application Development' },
    { value: 'ecommerce', label: 'E-commerce Platform' },
    { value: 'leadership', label: 'Technical Leadership Role' },
    { value: 'integration', label: 'System Integration & APIs' },
    { value: 'other', label: 'Other / Let\'s Discuss' }
  ] as const

  // Real-time email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Real-time form validation
  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    return newErrors
  }, [formData])

  // Update validation state when form data changes
  useEffect(() => {
    const newErrors = validateForm()
    setErrors(newErrors)
    setIsFormValid(Object.keys(newErrors).length === 0 && Boolean(formData.name && formData.email && formData.message))
  }, [formData, validateForm])

  // Handle input changes with real-time validation
  const handleInputChange = (
    field: keyof ContactFormData,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid) {
      return
    }

    setSubmitStatus('submitting')

    try {
      // Submit form data to contact API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Successful submission
        setSubmitStatus('success')
        
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          projectType: 'web-app',
          message: ''
        })
        
        // Reset success status after 5 seconds
        setTimeout(() => setSubmitStatus('idle'), 5000)
      } else {
        // API returned an error
        console.error('Contact form API error:', result.message)
        setSubmitStatus('error')
        
        // Reset error status after 5 seconds
        setTimeout(() => setSubmitStatus('idle'), 5000)
      }
      
    } catch (error) {
      console.error('Contact form submission error:', error)
      setSubmitStatus('error')
      
      // Reset error status after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }
  }

  return (
    <div className={`${styles.contactForm} ${className || ''}`}>
      <h3 className={styles.formTitle}>Ready to Start Your Project?</h3>
      
      {submitStatus === 'success' && (
        <div className={styles.successMessage} role="alert">
          <h4>Message Sent Successfully!</h4>
          <p>Thanks for reaching out. I&apos;ll review your project details and get back to you within 24 hours.</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className={styles.errorMessage} role="alert">
          <h4>Message Failed to Send</h4>
          <p>Sorry, there was an issue sending your message. Please try again or email me directly.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        {/* Name Field */}
        <div className={styles.fieldGroup}>
          <label htmlFor="contact-name" className={styles.label}>
            Name *
          </label>
          <input
            id="contact-name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
            placeholder="Your full name"
            aria-describedby={errors.name ? 'name-error' : undefined}
            aria-invalid={!!errors.name}
            disabled={submitStatus === 'submitting'}
          />
        </div>

        {/* Email Field */}
        <div className={styles.fieldGroup}>
          <label htmlFor="contact-email" className={styles.label}>
            Email *
          </label>
          <input
            id="contact-email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            placeholder="your.email@company.com"
            aria-describedby={errors.email ? 'email-error' : undefined}
            aria-invalid={!!errors.email}
            disabled={submitStatus === 'submitting'}
          />
        </div>

        {/* Project Type Dropdown */}
        <div className={styles.fieldGroup}>
          <label htmlFor="contact-project-type" className={styles.label}>
            Project Type
          </label>
          <select
            id="contact-project-type"
            value={formData.projectType}
            onChange={(e) => handleInputChange('projectType', e.target.value as ContactFormData['projectType'])}
            className={styles.select}
            disabled={submitStatus === 'submitting'}
          >
            {projectTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Message Field */}
        <div className={styles.fieldGroup}>
          <label htmlFor="contact-message" className={styles.label}>
            Message *
          </label>
          <textarea
            id="contact-message"
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
            placeholder="Tell me about your project, goals, and how I can help..."
            rows={6}
            aria-describedby={errors.message ? 'message-error' : undefined}
            aria-invalid={!!errors.message}
            disabled={submitStatus === 'submitting'}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`${styles.submitButton} ${
            isFormValid && submitStatus !== 'submitting' ? styles.submitReady : styles.submitDisabled
          }`}
          disabled={!isFormValid || submitStatus === 'submitting'}
          aria-describedby="submit-status"
        >
          {submitStatus === 'submitting' ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              Sending Message...
            </>
          ) : (
            'Send Message'
          )}
        </button>

        <p className={styles.submitHelp} id="submit-status">
          {submitStatus === 'idle' && !isFormValid && 'Please fill in all required fields'}
          {submitStatus === 'idle' && isFormValid && 'Ready to send your message'}
          {submitStatus === 'submitting' && 'Processing your message...'}
        </p>
      </form>
    </div>
  )
}

export default ContactForm