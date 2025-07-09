"use client"

import { useCallback, useMemo } from 'react'
import { EnhancedContactFormData } from './EnhancedContactForm'

export interface QualificationCriteria {
  companySize: { [key: string]: number }
  timeline: { [key: string]: number }
  budget: { [key: string]: number }
  projectType: { [key: string]: number }
  decisionMaker: number
}

export interface QualificationResult {
  leadScore: number
  qualificationLevel: 'low' | 'medium' | 'high' | 'premium'
  priority: 'standard' | 'elevated' | 'high' | 'urgent'
  recommendedFollowUp: 'email' | 'call' | 'proposal' | 'meeting'
  estimatedValue: 'under-10k' | '10k-50k' | '50k-100k' | '100k+' | 'enterprise'
  riskFactors: string[]
  strengths: string[]
  nextSteps: string[]
}

export interface LeadQualificationFlowProps {
  onQualificationComplete?: (result: QualificationResult) => void
  customCriteria?: Partial<QualificationCriteria>
}

/**
 * Lead Qualification Flow Utility
 * Intelligent lead scoring and routing system for conversion optimization
 * Provides actionable insights for business development follow-up
 */
export const LeadQualificationFlow = ({
  onQualificationComplete,
  customCriteria
}: LeadQualificationFlowProps) => {
  
  // Default qualification criteria with business intelligence
  const defaultCriteria: QualificationCriteria = useMemo(() => ({
    companySize: {
      'startup': 2,     // Startup - lower budget but potential for growth
      'small': 3,       // Small business - moderate budget, good conversion
      'medium': 4,      // Medium company - good budget, decision complexity
      'enterprise': 5   // Enterprise - high budget, longer sales cycle
    },
    timeline: {
      'urgent': 5,      // ASAP - highest priority, ready to move
      '1-3months': 4,   // Near-term - good planning, serious interest
      '3-6months': 3,   // Mid-term - planning phase, nurture opportunity
      'exploring': 1    // Early stage - educational, long-term nurture
    },
    budget: {
      'under-10k': 1,   // Small project - quick turnaround
      '10k-50k': 3,     // Standard project - good value
      '50k-100k': 4,    // Large project - significant value
      '100k+': 5,       // Premium project - highest value
      'discuss': 3      // Unknown budget - needs qualification
    },
    projectType: {
      'web-app': 3,     // Web application - standard complexity
      'ecommerce': 4,   // E-commerce - higher value, clear ROI
      'leadership': 5,  // Technical leadership - highest value role
      'integration': 3, // System integration - technical expertise
      'other': 2        // Other - needs clarification
    },
    decisionMaker: 3    // Decision maker bonus
  }), [])

  // Merge custom criteria with defaults
  const criteria = useMemo(() => ({
    ...defaultCriteria,
    ...customCriteria
  }), [defaultCriteria, customCriteria])

  // Calculate comprehensive lead score
  const calculateLeadScore = useCallback((data: EnhancedContactFormData): number => {
    let score = 0
    
    // Company size scoring
    score += (data.companySize && criteria.companySize[data.companySize]) || 0
    
    // Timeline urgency scoring
    score += (data.timeline && criteria.timeline[data.timeline]) || 0
    
    // Budget investment scoring
    score += (data.budget && criteria.budget[data.budget]) || 0
    
    // Project type complexity scoring
    score += criteria.projectType[data.projectType] || 0
    
    // Decision maker bonus
    if (data.decisionMaker) {
      score += criteria.decisionMaker
    }
    
    // Business logic adjustments
    
    // Enterprise + urgent = highest priority
    if (data.companySize === 'enterprise' && data.timeline === 'urgent') {
      score += 2
    }
    
    // Leadership roles with decision maker = premium opportunity
    if (data.projectType === 'leadership' && data.decisionMaker) {
      score += 3
    }
    
    // E-commerce + medium/enterprise company = strong opportunity
    if (data.projectType === 'ecommerce' && 
        (data.companySize === 'medium' || data.companySize === 'enterprise')) {
      score += 2
    }
    
    // High budget + short timeline = urgent opportunity
    if ((data.budget === '50k-100k' || data.budget === '100k+') && 
        (data.timeline === 'urgent' || data.timeline === '1-3months')) {
      score += 2
    }
    
    return Math.min(score, 20) // Cap at 20 for consistency
  }, [criteria])

  // Determine qualification level from score
  const getQualificationLevel = useCallback((score: number): QualificationResult['qualificationLevel'] => {
    if (score >= 16) return 'premium'  // 16-20: Highest value opportunities
    if (score >= 12) return 'high'     // 12-15: Strong prospects
    if (score >= 8) return 'medium'    // 8-11: Good prospects
    return 'low'                       // 0-7: Nurture opportunities
  }, [])

  // Determine priority level for follow-up
  const getPriorityLevel = useCallback((
    score: number, 
    data: EnhancedContactFormData
  ): QualificationResult['priority'] => {
    // Urgent timeline always elevates priority
    if (data.timeline === 'urgent') return 'urgent'
    
    // High-value projects get elevated priority
    if (score >= 16) return 'urgent'
    if (score >= 12) return 'high'
    if (score >= 8) return 'elevated'
    
    return 'standard'
  }, [])

  // Recommend follow-up method based on qualification
  const getRecommendedFollowUp = useCallback((
    qualificationLevel: QualificationResult['qualificationLevel'],
    data: EnhancedContactFormData
  ): QualificationResult['recommendedFollowUp'] => {
    // Premium and high-value leads get personal attention
    if (qualificationLevel === 'premium') return 'meeting'
    if (qualificationLevel === 'high') return 'call'
    
    // Leadership roles always get calls
    if (data.projectType === 'leadership') return 'call'
    
    // Urgent timeline gets calls
    if (data.timeline === 'urgent') return 'call'
    
    // Decision makers with good budget get proposals
    if (data.decisionMaker && 
        (data.budget === '50k-100k' || data.budget === '100k+' || data.budget === 'discuss')) {
      return 'proposal'
    }
    
    // Medium qualification gets calls
    if (qualificationLevel === 'medium') return 'call'
    
    // Low qualification gets email nurture
    return 'email'
  }, [])

  // Estimate project value based on qualification data
  const getEstimatedValue = useCallback((data: EnhancedContactFormData): QualificationResult['estimatedValue'] => {
    // Budget is the primary indicator
    if (data.budget === '100k+') return '100k+'
    if (data.budget === '50k-100k') return '50k-100k'
    if (data.budget === '10k-50k') return '10k-50k'
    if (data.budget === 'under-10k') return 'under-10k'
    
    // If budget is "discuss", estimate based on other factors
    if (data.budget === 'discuss') {
      // Enterprise companies typically have larger budgets
      if (data.companySize === 'enterprise') {
        if (data.projectType === 'leadership') return 'enterprise'
        return '100k+'
      }
      
      // Medium companies with complex projects
      if (data.companySize === 'medium') {
        if (data.projectType === 'ecommerce' || data.projectType === 'integration') {
          return '50k-100k'
        }
        return '10k-50k'
      }
      
      // Small companies and startups
      if (data.companySize === 'small') return '10k-50k'
      return 'under-10k'
    }
    
    return 'under-10k'
  }, [])

  // Identify risk factors for the lead
  const identifyRiskFactors = useCallback((data: EnhancedContactFormData): string[] => {
    const risks: string[] = []
    
    // Budget-related risks
    if (data.budget === 'under-10k') {
      risks.push('Limited budget may constrain project scope')
    }
    if (data.budget === 'discuss') {
      risks.push('Budget qualification needed during initial call')
    }
    
    // Timeline-related risks
    if (data.timeline === 'exploring') {
      risks.push('Early exploration phase - long sales cycle expected')
    }
    if (data.timeline === 'urgent' && !data.decisionMaker) {
      risks.push('Urgent timeline without decision maker contact')
    }
    
    // Decision-making risks
    if (!data.decisionMaker) {
      risks.push('Need to identify and engage decision maker')
    }
    
    // Company size risks
    if (data.companySize === 'startup') {
      risks.push('Startup funding and budget stability considerations')
    }
    if (data.companySize === 'enterprise' && data.timeline === 'urgent') {
      risks.push('Enterprise urgent projects may have complex approval processes')
    }
    
    // Project type risks
    if (data.projectType === 'other') {
      risks.push('Project scope and requirements need clarification')
    }
    
    return risks
  }, [])

  // Identify lead strengths for sales approach
  const identifyStrengths = useCallback((data: EnhancedContactFormData): string[] => {
    const strengths: string[] = []
    
    // Decision maker strengths
    if (data.decisionMaker) {
      strengths.push('Direct contact with decision maker')
    }
    
    // Budget strengths
    if (data.budget === '100k+') {
      strengths.push('Premium budget for comprehensive solution')
    }
    if (data.budget === '50k-100k') {
      strengths.push('Strong budget for quality implementation')
    }
    
    // Timeline strengths
    if (data.timeline === 'urgent') {
      strengths.push('Urgent timeline indicates high motivation')
    }
    if (data.timeline === '1-3months') {
      strengths.push('Near-term timeline with good planning window')
    }
    
    // Company size strengths
    if (data.companySize === 'enterprise') {
      strengths.push('Enterprise client with complex technical needs')
    }
    if (data.companySize === 'medium') {
      strengths.push('Medium company with established processes')
    }
    
    // Project type strengths
    if (data.projectType === 'leadership') {
      strengths.push('Technical leadership role - high-value opportunity')
    }
    if (data.projectType === 'ecommerce') {
      strengths.push('E-commerce project with clear ROI potential')
    }
    if (data.projectType === 'integration') {
      strengths.push('Technical integration needs match expertise')
    }
    
    return strengths
  }, [])

  // Generate next steps based on qualification
  const generateNextSteps = useCallback((
    qualificationLevel: QualificationResult['qualificationLevel'],
    followUpMethod: QualificationResult['recommendedFollowUp'],
    data: EnhancedContactFormData
  ): string[] => {
    const steps: string[] = []
    
    // Immediate response timing
    if (data.timeline === 'urgent' || qualificationLevel === 'premium') {
      steps.push('Respond within 2 hours with initial availability')
    } else if (qualificationLevel === 'high') {
      steps.push('Respond within 4 hours with follow-up plan')
    } else {
      steps.push('Respond within 24 hours as committed')
    }
    
    // Follow-up method specific steps
    switch (followUpMethod) {
      case 'meeting':
        steps.push('Schedule 60-minute discovery meeting')
        steps.push('Prepare comprehensive capability presentation')
        steps.push('Research company background and technical needs')
        break
        
      case 'call':
        steps.push('Schedule 30-minute qualification call')
        steps.push('Prepare technical discussion points')
        if (!data.decisionMaker) {
          steps.push('Identify decision maker and include in follow-up')
        }
        break
        
      case 'proposal':
        steps.push('Gather detailed requirements via email/call')
        steps.push('Prepare formal project proposal')
        steps.push('Include relevant case studies and references')
        break
        
      case 'email':
        steps.push('Send detailed email response with relevant examples')
        steps.push('Include case studies matching project type')
        steps.push('Schedule follow-up call in 1-2 weeks')
        break
    }
    
    // Project-specific steps
    if (data.projectType === 'leadership') {
      steps.push('Share leadership experience and team scale examples')
    }
    if (data.projectType === 'ecommerce') {
      steps.push('Provide e-commerce performance optimization case studies')
    }
    if (data.budget === 'discuss') {
      steps.push('Qualify budget range during initial conversation')
    }
    
    return steps
  }, [])

  // Main qualification function
  const qualifyLead = useCallback((data: EnhancedContactFormData): QualificationResult => {
    const leadScore = calculateLeadScore(data)
    const qualificationLevel = getQualificationLevel(leadScore)
    const priority = getPriorityLevel(leadScore, data)
    const recommendedFollowUp = getRecommendedFollowUp(qualificationLevel, data)
    const estimatedValue = getEstimatedValue(data)
    const riskFactors = identifyRiskFactors(data)
    const strengths = identifyStrengths(data)
    const nextSteps = generateNextSteps(qualificationLevel, recommendedFollowUp, data)
    
    const result: QualificationResult = {
      leadScore,
      qualificationLevel,
      priority,
      recommendedFollowUp,
      estimatedValue,
      riskFactors,
      strengths,
      nextSteps
    }
    
    // Call completion callback if provided
    if (onQualificationComplete) {
      onQualificationComplete(result)
    }
    
    return result
  }, [
    calculateLeadScore,
    getQualificationLevel,
    getPriorityLevel,
    getRecommendedFollowUp,
    getEstimatedValue,
    identifyRiskFactors,
    identifyStrengths,
    generateNextSteps,
    onQualificationComplete
  ])

  // Utility function to get qualification summary
  const getQualificationSummary = useCallback((result: QualificationResult): string => {
    const levelLabels = {
      'low': 'Low Priority',
      'medium': 'Medium Priority',
      'high': 'High Priority',
      'premium': 'Premium Opportunity'
    }
    
    const followUpLabels = {
      'email': 'Email Response',
      'call': 'Phone Call',
      'proposal': 'Formal Proposal',
      'meeting': 'Discovery Meeting'
    }
    
    return `${levelLabels[result.qualificationLevel]} (Score: ${result.leadScore}/20) - ${followUpLabels[result.recommendedFollowUp]} recommended`
  }, [])

  // Return qualification functions for use by other components
  return {
    qualifyLead,
    getQualificationSummary,
    calculateLeadScore,
    criteria
  }
}

// Hook for using lead qualification in other components
export const useLeadQualification = (customCriteria?: Partial<QualificationCriteria>) => {
  const qualificationFlow = LeadQualificationFlow({ customCriteria })
  return qualificationFlow
}

// Utility function for standalone lead qualification
export const qualifyLeadData = (
  data: EnhancedContactFormData,
  customCriteria?: Partial<QualificationCriteria>
): QualificationResult => {
  const flow = LeadQualificationFlow({ customCriteria })
  return flow.qualifyLead(data)
}

export default LeadQualificationFlow