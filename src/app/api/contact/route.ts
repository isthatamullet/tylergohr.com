// Tyler Gohr Portfolio - Contact Form API Endpoint
// Handles form submissions and sends admin notifications to tyler@tylergohr.com

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Contact form data interface (matching ContactForm.tsx)
interface ContactFormData {
  name: string;
  email: string;
  projectType: 'web-app' | 'ecommerce' | 'leadership' | 'integration' | 'other';
  message: string;
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

// Validate environment variables at runtime only
function validateConfig() {
  // Only validate when actually sending emails, not during build
  const required = ['EMAIL_USER', 'EMAIL_PASSWORD', 'EMAIL_TO'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
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
  
  // Sanitize data
  const sanitized: ContactFormData = {
    name: (formData.name as string).trim().substring(0, 100), // Limit length
    email: (formData.email as string).trim().toLowerCase().substring(0, 100),
    projectType: formData.projectType as ContactFormData['projectType'],
    message: (formData.message as string).trim().substring(0, 2000) // Limit message length
  };
  
  return { isValid: true, errors: [], sanitized };
}

// Create email HTML template
function createEmailHTML(data: ContactFormData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Contact Form Submission</title>
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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Form Submission</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Tyler Gohr Portfolio - tylergohr.com</p>
        </div>
        
        <div class="content">
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
            <span class="field-label">Message</span>
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
          <p>Tyler Gohr Portfolio Contact Form</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Create email text version
function createEmailText(data: ContactFormData): string {
  return `
New Contact Form Submission - Tyler Gohr Portfolio

Name: ${data.name}
Email: ${data.email}
Project Type: ${projectTypeLabels[data.projectType]}

Message:
${data.message}

---
Received: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}
Source: Tyler Gohr Portfolio (tylergohr.com)
  `.trim();
}

// Send email notification
async function sendEmailNotification(data: ContactFormData): Promise<void> {
  // Validate config at runtime, not build time
  validateConfig();
  
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Email options
  const mailOptions = {
    from: `"${process.env.CONTACT_FROM_NAME || 'Tyler Gohr Portfolio'}" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `New Contact: ${data.name} - ${projectTypeLabels[data.projectType]}`,
    text: createEmailText(data),
    html: createEmailHTML(data),
    replyTo: data.email, // Allow direct reply to the contact
  };

  // Send email
  await transporter.sendMail(mailOptions);
}

// POST handler for contact form submissions
export async function POST(request: NextRequest): Promise<NextResponse<ContactResponse>> {
  const startTime = Date.now();
  
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
    if (!validation.isValid) {
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
    console.error('Contact form API error:', error instanceof Error ? error.message : 'Unknown error');
    
    return NextResponse.json(
      {
        success: false,
        message: 'Sorry, there was an issue sending your message. Please try again or email me directly.',
        timestamp: new Date().toISOString(),
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