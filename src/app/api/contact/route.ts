// Tyler Gohr Portfolio - Contact Form API Endpoint
// Handles form submissions and sends admin notifications to tyler@tylergohr.com

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Contact form data interface (supports both basic and enhanced forms)
interface ContactFormData {
  name: string;
  email: string;
  projectType: 'web-app' | 'ecommerce' | 'leadership' | 'integration' | 'other';
  message: string;
  
  // Enhanced form fields (optional)
  companySize?: 'startup' | 'small' | 'medium' | 'enterprise';
  timeline?: 'urgent' | '1-3months' | '3-6months' | 'exploring';
  budget?: 'under-10k' | '10k-50k' | '50k-100k' | '100k+' | 'discuss';
  decisionMaker?: boolean;
  leadScore?: number;
  qualificationLevel?: 'low' | 'medium' | 'high' | 'premium';
}

// API response interface
interface ContactResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

// Rate limiting storage (simple in-memory for now)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Project type labels for email display
const projectTypeLabels = {
  'web-app': 'Web Application Development',
  'ecommerce': 'E-commerce Platform',
  'leadership': 'Technical Leadership Role',
  'integration': 'System Integration & APIs',
  'other': 'Other / Let\'s Discuss'
};

// Enhanced form labels for email display
const companySizeLabels = {
  'startup': 'Startup (1-10 employees)',
  'small': 'Small Business (11-50 employees)',
  'medium': 'Medium Company (51-200 employees)',
  'enterprise': 'Enterprise (200+ employees)'
};

const timelineLabels = {
  'urgent': 'ASAP / Urgent (within 1 month)',
  '1-3months': '1-3 months',
  '3-6months': '3-6 months',
  'exploring': 'Just exploring options'
};

const budgetLabels = {
  'under-10k': 'Under $10,000',
  '10k-50k': '$10,000 - $50,000',
  '50k-100k': '$50,000 - $100,000',
  '100k+': '$100,000+',
  'discuss': 'Let\'s discuss budget'
};

// Environment detection utilities
function detectEnvironment() {
  const isCloudRun = !!(process.env.K_SERVICE || process.env.GOOGLE_CLOUD_PROJECT);
  const isPreview = process.env.K_SERVICE && process.env.K_SERVICE.includes('preview');
  const isLocal = !isCloudRun && process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production' && !isPreview;
  
  return {
    isCloudRun,
    isPreview,
    isLocal,
    isProduction,
    environment: isLocal ? 'local' : isPreview ? 'preview' : isProduction ? 'production' : 'unknown'
  };
}

// Validate environment variables at runtime only
function validateConfig() {
  const env = detectEnvironment();
  console.log('[Contact API] Environment detection:', env);
  
  // Only validate when actually sending emails, not during build
  const required = ['EMAIL_USER', 'EMAIL_PASSWORD', 'EMAIL_TO'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    const errorMessage = `Missing required environment variables: ${missing.join(', ')}`;
    
    // In preview environments, provide more helpful error context
    if (env.isPreview) {
      throw new Error(`${errorMessage} - Preview deployments may not have email configuration. Environment: ${env.environment}`);
    }
    
    throw new Error(errorMessage);
  }
}

// Simple rate limiting
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW || '60000'); // 1 minute
  const maxRequests = parseInt(process.env.RATE_LIMIT_REQUESTS || '5');
  
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    // First request or window expired
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  record.count++;
  return true;
}

// Validate and sanitize form data
function validateFormData(data: unknown): { isValid: boolean; errors: string[]; sanitized?: ContactFormData } {
  const errors: string[] = [];
  
  // Type guard to ensure data is an object
  if (!data || typeof data !== 'object') {
    errors.push('Invalid data format');
    return { isValid: false, errors };
  }
  
  const formData = data as Record<string, unknown>;
  
  // Check required fields
  if (!formData.name || typeof formData.name !== 'string' || formData.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  if (!formData.email || typeof formData.email !== 'string') {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.push('Invalid email format');
    }
  }
  
  if (!formData.message || typeof formData.message !== 'string' || formData.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  }
  
  const validProjectTypes = ['web-app', 'ecommerce', 'leadership', 'integration', 'other'];
  if (!formData.projectType || !validProjectTypes.includes(formData.projectType as string)) {
    errors.push('Invalid project type');
  }
  
  if (errors.length > 0) {
    return { isValid: false, errors };
  }
  
  // Sanitize data (include enhanced form fields)
  const sanitized: ContactFormData = {
    name: (formData.name as string).trim().substring(0, 100), // Limit length
    email: (formData.email as string).trim().toLowerCase().substring(0, 100),
    projectType: formData.projectType as ContactFormData['projectType'],
    message: (formData.message as string).trim().substring(0, 2000) // Limit message length
  };
  
  // Add enhanced form fields if present (including empty strings)
  if (formData.companySize !== undefined) {
    sanitized.companySize = formData.companySize as ContactFormData['companySize'];
  }
  if (formData.timeline !== undefined) {
    sanitized.timeline = formData.timeline as ContactFormData['timeline'];
  }
  if (formData.budget !== undefined) {
    sanitized.budget = formData.budget as ContactFormData['budget'];
  }
  if (typeof formData.decisionMaker === 'boolean') {
    sanitized.decisionMaker = formData.decisionMaker;
  }
  if (typeof formData.leadScore === 'number') {
    sanitized.leadScore = formData.leadScore;
  }
  if (formData.qualificationLevel !== undefined) {
    sanitized.qualificationLevel = formData.qualificationLevel as ContactFormData['qualificationLevel'];
  }
  
  return { isValid: true, errors: [], sanitized };
}

// Create email HTML template
function createEmailHTML(data: ContactFormData): string {
  // Check if this is an enhanced form submission
  const isEnhancedForm = data.companySize || data.timeline || data.budget !== undefined;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Contact Form Submission${isEnhancedForm ? ' - Qualified Lead' : ''}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #16a34a, #dc2626); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 30px; }
        .field { margin-bottom: 20px; }
        .field-label { font-weight: 600; color: #374151; margin-bottom: 8px; display: block; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; }
        .field-value { color: #1f2937; font-size: 16px; line-height: 1.5; }
        .message-box { background: #f9fafb; border-left: 4px solid #16a34a; padding: 20px; border-radius: 0 4px 4px 0; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        .badge { background: #16a34a; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; text-transform: uppercase; }
        .qualification-section { background: #eff6ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .qualification-title { color: #1d4ed8; font-weight: 600; margin-bottom: 15px; font-size: 18px; }
        .qualification-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
        .score-badge { background: #3b82f6; color: white; padding: 6px 12px; border-radius: 20px; font-weight: 600; font-size: 14px; }
        .premium { background: #dc2626; }
        .high { background: #ea580c; }
        .medium { background: #ca8a04; }
        .low { background: #65a30d; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Form Submission${isEnhancedForm ? ' - Qualified Lead' : ''}</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Tyler Gohr Portfolio - tylergohr.com</p>
        </div>
        
        <div class="content">
          ${isEnhancedForm && data.qualificationLevel ? `
            <div class="qualification-section">
              <div class="qualification-title">
                Lead Qualification Summary
                <span class="score-badge ${data.qualificationLevel}">${data.qualificationLevel?.toUpperCase()} PRIORITY</span>
              </div>
              <div class="qualification-grid">
                ${data.companySize ? `<div><strong>Company Size:</strong> ${companySizeLabels[data.companySize]}</div>` : ''}
                ${data.timeline ? `<div><strong>Timeline:</strong> ${timelineLabels[data.timeline]}</div>` : ''}
                ${data.budget ? `<div><strong>Budget:</strong> ${budgetLabels[data.budget]}</div>` : ''}
                ${data.decisionMaker ? `<div><strong>Decision Maker:</strong> ✓ Yes</div>` : '<div><strong>Decision Maker:</strong> No</div>'}
              </div>
              ${data.leadScore ? `<div style="margin-top: 15px;"><strong>Lead Score:</strong> ${data.leadScore}/18</div>` : ''}
            </div>
          ` : ''}
          
          <div class="field">
            <span class="field-label">Name</span>
            <div class="field-value">${data.name}</div>
          </div>
          
          <div class="field">
            <span class="field-label">Email</span>
            <div class="field-value">
              <a href="mailto:${data.email}" style="color: #16a34a; text-decoration: none;">${data.email}</a>
            </div>
          </div>
          
          <div class="field">
            <span class="field-label">Project Type</span>
            <div class="field-value">
              <span class="badge">${projectTypeLabels[data.projectType]}</span>
            </div>
          </div>
          
          <div class="field">
            <span class="field-label">Project Details</span>
            <div class="message-box">
              <div class="field-value">${data.message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>Received at ${new Date().toLocaleString('en-US', { 
            timeZone: 'America/New_York',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
          })}</p>
          <p>Tyler Gohr Portfolio Contact Form${isEnhancedForm ? ' - Enhanced Lead Qualification' : ''}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Create email text version
function createEmailText(data: ContactFormData): string {
  const isEnhancedForm = data.companySize || data.timeline || data.budget !== undefined;
  
  let emailText = `New Contact Form Submission - Tyler Gohr Portfolio${isEnhancedForm ? ' - Qualified Lead' : ''}

Name: ${data.name}
Email: ${data.email}
Project Type: ${projectTypeLabels[data.projectType]}`;

  if (isEnhancedForm) {
    emailText += `

=== LEAD QUALIFICATION ===`;
    if (data.qualificationLevel) {
      emailText += `
Priority Level: ${data.qualificationLevel.toUpperCase()}`;
    }
    if (data.leadScore) {
      emailText += `
Lead Score: ${data.leadScore}/18`;
    }
    emailText += `
Company Size: ${data.companySize ? companySizeLabels[data.companySize] : 'Not specified'}
Timeline: ${data.timeline ? timelineLabels[data.timeline] : 'Not specified'}
Budget: ${data.budget ? budgetLabels[data.budget] : 'Not specified'}
Decision Maker: ${data.decisionMaker ? 'Yes' : 'No'}`;
  }

  emailText += `

Project Details:
${data.message}

---
Received: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}
Source: Tyler Gohr Portfolio (tylergohr.com)${isEnhancedForm ? ' - Enhanced Lead Qualification' : ''}`;

  return emailText.trim();
}

// Send email notification
async function sendEmailNotification(data: ContactFormData): Promise<void> {
  console.log('[Contact API] Starting email notification process');
  console.log('[Contact API] Environment check:', {
    EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Missing',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? 'Set' : 'Missing',
    EMAIL_TO: process.env.EMAIL_TO ? 'Set' : 'Missing',
    NODE_ENV: process.env.NODE_ENV
  });
  
  try {
    // Validate config at runtime, not build time
    validateConfig();
    console.log('[Contact API] Environment validation passed');
  } catch (configError) {
    console.error('[Contact API] Environment validation failed:', configError);
    throw new Error(`Environment configuration error: ${configError instanceof Error ? configError.message : 'Unknown config error'}`);
  }
  
  // Create transporter
  console.log('[Contact API] Creating Gmail transporter');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Create dynamic subject line based on lead qualification
  const isEnhancedForm = data.companySize || data.timeline || data.budget !== undefined;
  let subject = `New Contact: ${data.name} - ${projectTypeLabels[data.projectType]}`;
  
  if (isEnhancedForm && data.qualificationLevel) {
    const priorityPrefix = data.qualificationLevel === 'premium' ? '🔥 PREMIUM' :
                          data.qualificationLevel === 'high' ? '⭐ HIGH PRIORITY' :
                          data.qualificationLevel === 'medium' ? '📈 QUALIFIED' : '';
    if (priorityPrefix) {
      subject = `${priorityPrefix} Lead: ${data.name} - ${projectTypeLabels[data.projectType]}`;
    }
  }

  // Email options
  const mailOptions = {
    from: `"${process.env.CONTACT_FROM_NAME || 'Tyler Gohr Portfolio'}" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject,
    text: createEmailText(data),
    html: createEmailHTML(data),
    replyTo: data.email, // Allow direct reply to the contact
  };

  // Send email
  console.log('[Contact API] Attempting to send email with options:', {
    from: mailOptions.from,
    to: mailOptions.to,
    subject: mailOptions.subject,
    replyTo: mailOptions.replyTo
  });
  
  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('[Contact API] Email sent successfully:', {
      messageId: result.messageId,
      response: result.response
    });
  } catch (emailError) {
    console.error('[Contact API] Email sending failed:', {
      error: emailError instanceof Error ? emailError.message : 'Unknown email error',
      stack: emailError instanceof Error ? emailError.stack : 'No stack trace',
      code: emailError && typeof emailError === 'object' && 'code' in emailError ? emailError.code : 'No error code'
    });
    throw new Error(`Email sending failed: ${emailError instanceof Error ? emailError.message : 'Unknown email error'}`);
  }
}

// POST handler for contact form submissions
export async function POST(request: NextRequest): Promise<NextResponse<ContactResponse>> {
  const startTime = Date.now();
  const env = detectEnvironment();
  
  console.log('[Contact API] Request received in environment:', env);
  console.log('[Contact API] Headers:', {
    'user-agent': request.headers.get('user-agent'),
    'host': request.headers.get('host'),
    'x-forwarded-for': request.headers.get('x-forwarded-for')
  });
  
  try {
    // Check if contact form is enabled
    if (process.env.CONTACT_FORM_ENABLED === 'false') {
      return NextResponse.json(
        {
          success: false,
          message: 'Contact form is currently disabled',
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    // Preview environment warning
    if (env.isPreview) {
      console.log('[Contact API] Warning: Running in preview environment - email configuration may not be available');
    }

    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests. Please wait before submitting again.',
          timestamp: new Date().toISOString(),
        },
        { status: 429 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
      
      // ENHANCED DEBUGGING: Log exact request body data
      console.log('[Contact API] Raw request body received:', JSON.stringify(body, null, 2));
      console.log('[Contact API] Request body analysis:', {
        hasName: !!body.name,
        hasEmail: !!body.email,
        hasMessage: !!body.message,
        hasCompanySize: !!body.companySize,
        companySizeValue: body.companySize,
        companySizeType: typeof body.companySize,
        hasTimeline: !!body.timeline,
        timelineValue: body.timeline,
        timelineType: typeof body.timeline,
        hasBudget: !!body.budget,
        budgetValue: body.budget,
        budgetType: typeof body.budget,
        hasDecisionMaker: body.decisionMaker !== undefined,
        decisionMakerValue: body.decisionMaker,
        hasLeadScore: body.leadScore !== undefined,
        leadScoreValue: body.leadScore,
        hasQualificationLevel: !!body.qualificationLevel,
        qualificationLevelValue: body.qualificationLevel
      });
      
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request format',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Validate form data
    const validation = validateFormData(body);
    
    // ENHANCED DEBUGGING: Log validation results and data transformation
    console.log('[Contact API] Validation results:', {
      isValid: validation.isValid,
      errors: validation.errors,
      sanitizedDataKeys: validation.sanitized ? Object.keys(validation.sanitized) : [],
      originalDataKeys: Object.keys(body)
    });
    
    if (validation.sanitized) {
      console.log('[Contact API] Sanitized data after validation:', JSON.stringify(validation.sanitized, null, 2));
      console.log('[Contact API] Enhanced fields preserved:', {
        hasCompanySize: validation.sanitized.hasOwnProperty('companySize'),
        companySizeValue: validation.sanitized.companySize,
        hasTimeline: validation.sanitized.hasOwnProperty('timeline'),
        timelineValue: validation.sanitized.timeline,
        hasBudget: validation.sanitized.hasOwnProperty('budget'),
        budgetValue: validation.sanitized.budget,
        hasDecisionMaker: validation.sanitized.hasOwnProperty('decisionMaker'),
        decisionMakerValue: validation.sanitized.decisionMaker,
        hasLeadScore: validation.sanitized.hasOwnProperty('leadScore'),
        leadScoreValue: validation.sanitized.leadScore,
        hasQualificationLevel: validation.sanitized.hasOwnProperty('qualificationLevel'),
        qualificationLevelValue: validation.sanitized.qualificationLevel
      });
    }
    
    if (!validation.isValid) {
      console.error('[Contact API] Validation failed with errors:', validation.errors);
      return NextResponse.json(
        {
          success: false,
          message: `Validation failed: ${validation.errors.join(', ')}`,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Send email notification
    console.log('[Contact API] Sending email notification for form data:', {
      name: validation.sanitized!.name,
      email: validation.sanitized!.email,
      projectType: validation.sanitized!.projectType,
      isEnhanced: !!(validation.sanitized!.companySize || validation.sanitized!.timeline || validation.sanitized!.budget),
      leadScore: validation.sanitized!.leadScore,
      qualificationLevel: validation.sanitized!.qualificationLevel
    });
    
    await sendEmailNotification(validation.sanitized!);

    // Success response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully! I will review your project details and get back to you within 24 hours.',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );

    // Add security headers
    response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
    
    return response;

  } catch (error) {
    console.error('[Contact API] Main error handler caught:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      type: typeof error,
      errorObject: error
    });
    
    // Determine if this is a configuration error vs email sending error
    const isConfigError = error instanceof Error && error.message.includes('Environment configuration error');
    const errorMessage = isConfigError 
      ? 'Contact form configuration issue. Please try again later.'
      : 'Sorry, there was an issue sending your message. Please try again or email me directly.';
    
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        timestamp: new Date().toISOString(),
        // In development, include more error details
        ...(process.env.NODE_ENV === 'development' && {
          debugInfo: {
            error: error instanceof Error ? error.message : 'Unknown error',
            type: typeof error
          }
        })
      },
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}