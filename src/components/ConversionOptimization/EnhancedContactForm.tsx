"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Button } from '../ui/Button/Button'
import styles from './EnhancedContactForm.module.css'

// Enhanced form data structure with qualification fields
export interface EnhancedContactFormData {
  // Step 1: Initial engagement
  name: string
  email: string
  projectType: 'web-app' | 'ecommerce' | 'leadership' | 'integration' | 'other'
  
  // Step 2: Business qualification
  companySize?: 'startup' | 'small' | 'medium' | 'enterprise'
  timeline?: 'urgent' | '1-3months' | '3-6months' | 'exploring'
  budget?: 'under-10k' | '10k-50k' | '50k-100k' | '100k+' | 'discuss'
  decisionMaker: boolean
  
  // Step 3: Project details
  message: string
  
  // Lead scoring (calculated)
  leadScore?: number
  qualificationLevel?: 'low' | 'medium' | 'high' | 'premium'
}

export interface FormErrors {
  name?: string
  email?: string
  message?: string
  companySize?: string
  timeline?: string
  budget?: string
}

export interface EnhancedContactFormProps {
  className?: string
  onLeadQualified?: (data: EnhancedContactFormData) => void
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'
type FormStep = 1 | 2 | 3

/**
 * Enhanced Contact Form Component
 * Multi-step progressive qualification with intelligent lead scoring
 * Designed for conversion optimization and business development
 */
export const EnhancedContactForm: React.FC<EnhancedContactFormProps> = ({ 
  className,
  onLeadQualified 
}) => {
  const [currentStep, setCurrentStep] = useState<FormStep>(1)
  const [formData, setFormData] = useState<EnhancedContactFormData>({
    name: '',
    email: '',
    projectType: 'web-app',
    companySize: undefined,
    timeline: undefined,
    budget: undefined,
    decisionMaker: false,
    message: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [isStepValid, setIsStepValid] = useState(false)

  // Project type options with enhanced descriptions
  const projectTypeOptions = [
    { value: 'web-app', label: 'Web Application Development', description: 'Custom web applications and platforms' },
    { value: 'ecommerce', label: 'E-commerce Platform', description: 'Online stores and marketplace solutions' },
    { value: 'leadership', label: 'Technical Leadership Role', description: 'CTO, Technical Advisor, or Team Lead positions' },
    { value: 'integration', label: 'System Integration & APIs', description: 'Connect existing systems and data' },
    { value: 'other', label: 'Other / Let&apos;s Discuss', description: 'Custom solutions and consulting' }
  ] as const

  // Company size options with qualification scoring (memoized for performance)
  const companySizeOptions = useMemo(() => [
    { value: 'startup', label: 'Startup (1-10 employees)', score: 2 },
    { value: 'small', label: 'Small Business (11-50 employees)', score: 3 },
    { value: 'medium', label: 'Medium Company (51-200 employees)', score: 4 },
    { value: 'enterprise', label: 'Enterprise (200+ employees)', score: 5 }
  ] as const, [])

  // Timeline options with urgency scoring (memoized for performance)
  const timelineOptions = useMemo(() => [
    { value: 'urgent', label: 'ASAP / Urgent (within 1 month)', score: 5 },
    { value: '1-3months', label: '1-3 months', score: 4 },
    { value: '3-6months', label: '3-6 months', score: 3 },
    { value: 'exploring', label: 'Just exploring options', score: 1 }
  ] as const, [])

  // Budget options with investment scoring (memoized for performance)
  const budgetOptions = useMemo(() => [
    { value: 'under-10k', label: 'Under $10,000', score: 1 },
    { value: '10k-50k', label: '$10,000 - $50,000', score: 3 },
    { value: '50k-100k', label: '$50,000 - $100,000', score: 4 },
    { value: '100k+', label: '$100,000+', score: 5 },
    { value: 'discuss', label: 'Let&apos;s discuss budget', score: 3 }
  ] as const, [])

  // Calculate lead score based on qualification responses
  const calculateLeadScore = useCallback((data: EnhancedContactFormData): number => {
    let score = 0
    
    // Company size scoring
    const companySizeScore = data.companySize ? companySizeOptions.find(opt => opt.value === data.companySize)?.score || 0 : 0
    score += companySizeScore
    
    // Timeline urgency scoring
    const timelineScore = data.timeline ? timelineOptions.find(opt => opt.value === data.timeline)?.score || 0 : 0
    score += timelineScore
    
    // Budget investment scoring
    const budgetScore = data.budget ? budgetOptions.find(opt => opt.value === data.budget)?.score || 0 : 0
    score += budgetScore
    
    // Decision maker bonus
    if (data.decisionMaker) {
      score += 3
    }
    
    // Project type adjustment
    if (data.projectType === 'leadership') {
      score += 2 // Technical leadership roles typically higher value
    } else if (data.projectType === 'ecommerce') {
      score += 1 // E-commerce projects often have clear ROI
    }
    
    return score
  }, [companySizeOptions, timelineOptions, budgetOptions])

  // Determine qualification level from lead score
  const getQualificationLevel = (score: number): EnhancedContactFormData['qualificationLevel'] => {
    if (score >= 15) return 'premium'
    if (score >= 12) return 'high'
    if (score >= 8) return 'medium'
    return 'low'
  }

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Step-specific validation
  const validateCurrentStep = useCallback((): FormErrors => {
    const newErrors: FormErrors = {}

    if (currentStep === 1) {
      // Step 1: Basic contact information
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
    } else if (currentStep === 2) {
      // Step 2: Business qualification
      if (!formData.companySize) {
        newErrors.companySize = 'Please select your company size'
      }
      if (!formData.timeline) {
        newErrors.timeline = 'Please select your timeline'
      }
      if (!formData.budget) {
        newErrors.budget = 'Please select your budget range'
      }
    } else if (currentStep === 3) {
      // Step 3: Project details
      if (!formData.message.trim()) {
        newErrors.message = 'Message is required'
      } else if (formData.message.trim().length < 10) {
        newErrors.message = 'Message must be at least 10 characters'
      }
    }

    return newErrors
  }, [currentStep, formData])

  // Update validation when form data or step changes
  useEffect(() => {
    const newErrors = validateCurrentStep()
    setErrors(newErrors)
    setIsStepValid(Object.keys(newErrors).length === 0)
  }, [formData, currentStep, validateCurrentStep])

  // Handle input changes
  const handleInputChange = (
    field: keyof EnhancedContactFormData,
    value: string | boolean | undefined
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Navigate between steps
  const nextStep = () => {
    if (isStepValid && currentStep < 3) {
      setCurrentStep(prev => (prev + 1) as FormStep)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => (prev - 1) as FormStep)
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!isStepValid) return

    setSubmitStatus('submitting')

    try {
      // Calculate lead score and qualification
      const leadScore = calculateLeadScore(formData)
      const qualificationLevel = getQualificationLevel(leadScore)
      
      const enhancedFormData: EnhancedContactFormData = {
        ...formData,
        leadScore,
        qualificationLevel
      }


      // Call lead qualification callback if provided
      if (onLeadQualified) {
        onLeadQualified(enhancedFormData)
      }

      // Submit to contact API with enhanced data
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enhancedFormData),
      })

      const result = await response.json()


      if (response.ok && result.success) {
        setSubmitStatus('success')
        
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          projectType: 'web-app',
          companySize: undefined,
          timeline: undefined,
          budget: undefined,
          decisionMaker: false,
          message: ''
        })
        setCurrentStep(1)
        
        // Reset success status after 5 seconds
        setTimeout(() => setSubmitStatus('idle'), 5000)
      } else {
        console.error('[Enhanced Contact Form] ERROR: API returned error response')
        console.error('[Enhanced Contact Form] Error details:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          resultMessage: result.message,
          fullResult: result
        })
        setSubmitStatus('error')
        setTimeout(() => setSubmitStatus('idle'), 5000)
      }
      
    } catch (error) {
      console.error('[Enhanced Contact Form] NETWORK/FETCH ERROR: Request failed before reaching API')
      console.error('[Enhanced Contact Form] Error details:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        type: typeof error,
        errorObject: error
      })
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }
  }

  return (
    <div className={`${styles.enhancedContactForm} ${className || ''}`}>
      <div className={styles.formHeader}>
        <h3 className={styles.formTitle}>
          {currentStep === 1 && "Let&apos;s discuss your project"}
          {currentStep === 2 && "Tell me more about your project"}
          {currentStep === 3 && "Project details"}
        </h3>
        
        {/* Step Progress Indicator */}
        <div className={styles.stepProgress}>
          <div className={styles.stepIndicator}>
            {[1, 2, 3].map(step => (
              <div 
                key={step}
                className={`${styles.stepDot} ${
                  step === currentStep ? styles.stepActive : 
                  step < currentStep ? styles.stepCompleted : styles.stepPending
                }`}
                aria-label={`Step ${step} ${
                  step < currentStep ? 'completed' : 
                  step === currentStep ? 'current' : 'pending'
                }`}
              />
            ))}
          </div>
          <p className={styles.stepText}>Step {currentStep} of 3</p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {submitStatus === 'success' && (
        <div className={styles.successMessage} role="alert">
          <h4>Message Sent Successfully!</h4>
          <p>Thanks for the detailed information. I&apos;ll review your project and get back to you within 24 hours with next steps.</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className={styles.errorMessage} role="alert">
          <h4>Message Failed to Send</h4>
          <p>Sorry, there was an issue sending your message. Please try again or email me directly.</p>
        </div>
      )}

      <div className={styles.formContent}>
        {/* Step 1: Initial Engagement */}
        {currentStep === 1 && (
          <div className={styles.formStep}>
            {/* Name Field */}
            <div className={styles.fieldGroup}>
              <label htmlFor="enhanced-name" className={styles.label}>
                Name *
              </label>
              <input
                id="enhanced-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="Your full name"
                aria-describedby={errors.name ? 'name-error' : undefined}
                aria-invalid={!!errors.name}
                disabled={submitStatus === 'submitting'}
              />
              {errors.name && (
                <p id="name-error" className={styles.errorText} role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className={styles.fieldGroup}>
              <label htmlFor="enhanced-email" className={styles.label}>
                Email *
              </label>
              <input
                id="enhanced-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                placeholder="your.email@company.com"
                aria-describedby={errors.email ? 'email-error' : undefined}
                aria-invalid={!!errors.email}
                disabled={submitStatus === 'submitting'}
              />
              {errors.email && (
                <p id="email-error" className={styles.errorText} role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Project Type Dropdown */}
            <div className={styles.fieldGroup}>
              <label htmlFor="enhanced-project-type" className={styles.label}>
                Project Type
              </label>
              <select
                id="enhanced-project-type"
                value={formData.projectType}
                onChange={(e) => handleInputChange('projectType', e.target.value as EnhancedContactFormData['projectType'])}
                className={styles.select}
                disabled={submitStatus === 'submitting'}
              >
                {projectTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className={styles.helpText}>
                {projectTypeOptions.find(opt => opt.value === formData.projectType)?.description}
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Business Qualification */}
        {currentStep === 2 && (
          <div className={styles.formStep}>
            {/* Company Size */}
            <div className={styles.fieldGroup}>
              <label htmlFor="enhanced-company-size" className={styles.label}>
                Company Size *
              </label>
              <select
                id="enhanced-company-size"
                value={formData.companySize || ''}
                onChange={(e) => handleInputChange('companySize', e.target.value || undefined)}
                className={`${styles.select} ${errors.companySize ? styles.inputError : ''}`}
                disabled={submitStatus === 'submitting'}
              >
                <option value="">Select company size</option>
                {companySizeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.companySize && (
                <p className={styles.errorText} role="alert">
                  {errors.companySize}
                </p>
              )}
            </div>

            {/* Timeline */}
            <div className={styles.fieldGroup}>
              <label htmlFor="enhanced-timeline" className={styles.label}>
                Timeline *
              </label>
              <select
                id="enhanced-timeline"
                value={formData.timeline || ''}
                onChange={(e) => handleInputChange('timeline', e.target.value || undefined)}
                className={`${styles.select} ${errors.timeline ? styles.inputError : ''}`}
                disabled={submitStatus === 'submitting'}
              >
                <option value="">Select timeline</option>
                {timelineOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.timeline && (
                <p className={styles.errorText} role="alert">
                  {errors.timeline}
                </p>
              )}
            </div>

            {/* Budget Range */}
            <div className={styles.fieldGroup}>
              <label htmlFor="enhanced-budget" className={styles.label}>
                Budget Range *
              </label>
              <select
                id="enhanced-budget"
                value={formData.budget || ''}
                onChange={(e) => handleInputChange('budget', e.target.value || undefined)}
                className={`${styles.select} ${errors.budget ? styles.inputError : ''}`}
                disabled={submitStatus === 'submitting'}
              >
                <option value="">Select budget range</option>
                {budgetOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.budget && (
                <p className={styles.errorText} role="alert">
                  {errors.budget}
                </p>
              )}
            </div>

            {/* Decision Maker */}
            <div className={styles.fieldGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.decisionMaker}
                  onChange={(e) => handleInputChange('decisionMaker', e.target.checked)}
                  className={styles.checkbox}
                  disabled={submitStatus === 'submitting'}
                />
                <span className={styles.checkboxText}>
                  I&apos;m the decision maker for this project
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Project Details */}
        {currentStep === 3 && (
          <div className={styles.formStep}>
            {/* Message Field */}
            <div className={styles.fieldGroup}>
              <label htmlFor="enhanced-message" className={styles.label}>
                Project Details *
              </label>
              <textarea
                id="enhanced-message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                placeholder="Tell me about your project goals, challenges, and what success looks like..."
                rows={6}
                aria-describedby={errors.message ? 'message-error' : undefined}
                aria-invalid={!!errors.message}
                disabled={submitStatus === 'submitting'}
              />
              {errors.message && (
                <p id="message-error" className={styles.errorText} role="alert">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Lead Score Preview (for high-value leads) */}
            {formData.companySize && formData.timeline && formData.budget && (
              <div className={styles.qualificationPreview}>
                <h4 className={styles.previewTitle}>Project Overview</h4>
                <div className={styles.previewContent}>
                  <p><strong>Type:</strong> {projectTypeOptions.find(opt => opt.value === formData.projectType)?.label}</p>
                  <p><strong>Company:</strong> {companySizeOptions.find(opt => opt.value === formData.companySize)?.label}</p>
                  <p><strong>Timeline:</strong> {timelineOptions.find(opt => opt.value === formData.timeline)?.label}</p>
                  <p><strong>Budget:</strong> {budgetOptions.find(opt => opt.value === formData.budget)?.label}</p>
                  {formData.decisionMaker && <p><strong>✓</strong> Decision maker contact</p>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className={styles.formActions}>
          {currentStep > 1 && (
            <Button
              variant="outline"
              size="lg"
              section="contact"
              onClick={prevStep}
              disabled={submitStatus === 'submitting'}
              className={styles.backButton}
            >
              ← Back
            </Button>
          )}

          {currentStep < 3 ? (
            <Button
              variant="primary"
              size="lg"
              section="contact"
              onClick={nextStep}
              disabled={!isStepValid || submitStatus === 'submitting'}
              className={styles.nextButton}
            >
              Continue →
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              section="contact"
              onClick={handleSubmit}
              disabled={!isStepValid || submitStatus === 'submitting'}
              loading={submitStatus === 'submitting'}
              className={styles.submitButton}
            >
              {submitStatus === 'submitting' ? 'Sending Message...' : 'Send Message'}
            </Button>
          )}
        </div>

        {/* Step Help Text */}
        <p className={styles.stepHelp}>
          {currentStep === 1 && !isStepValid && 'Please fill in your contact information'}
          {currentStep === 1 && isStepValid && 'Ready to continue to project details'}
          {currentStep === 2 && !isStepValid && 'Please complete the business qualification'}
          {currentStep === 2 && isStepValid && 'Ready to continue to project description'}
          {currentStep === 3 && !isStepValid && 'Please describe your project details'}
          {currentStep === 3 && isStepValid && 'Ready to send your qualified inquiry'}
        </p>
      </div>
    </div>
  )
}

export default EnhancedContactForm