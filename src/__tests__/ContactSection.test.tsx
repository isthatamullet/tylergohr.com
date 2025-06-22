import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import ContactSection from '@/components/ContactSection'

describe('ContactSection', () => {
  it('renders section title and subtitle', () => {
    render(<ContactSection />)
    
    expect(screen.getByRole('heading', { name: "Let's Connect" })).toBeInTheDocument()
    expect(screen.getByText('Ready to discuss your next project or explore collaboration opportunities?')).toBeInTheDocument()
  })

  it('renders all form fields with proper labels', () => {
    render(<ContactSection />)
    
    // Check form fields
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Subject')).toBeInTheDocument()
    expect(screen.getByLabelText('Message')).toBeInTheDocument()
  })

  it('has proper form validation', async () => {
    const user = userEvent.setup()
    render(<ContactSection />)
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' })
    
    // Submit button should be disabled when form is empty
    expect(submitButton).toBeDisabled()
    
    // Fill out form fields
    await user.type(screen.getByLabelText('Name'), 'John Doe')
    await user.type(screen.getByLabelText('Email'), 'john@example.com')
    await user.selectOptions(screen.getByLabelText('Subject'), 'project-inquiry')
    await user.type(screen.getByLabelText('Message'), 'I would like to discuss a project.')
    
    // Submit button should now be enabled
    expect(submitButton).not.toBeDisabled()
  })

  it('handles form submission correctly', async () => {
    const user = userEvent.setup()
    render(<ContactSection />)
    
    // Fill out the form
    await user.type(screen.getByLabelText('Name'), 'John Doe')
    await user.type(screen.getByLabelText('Email'), 'john@example.com')
    await user.selectOptions(screen.getByLabelText('Subject'), 'project-inquiry')
    await user.type(screen.getByLabelText('Message'), 'I would like to discuss a project.')
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Send Message' })
    await user.click(submitButton)
    
    // Check loading state
    expect(screen.getByText('Sending...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
    
    // Wait for success message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Message sent successfully!')
    }, { timeout: 2000 })
    
    // Check form is reset
    expect(screen.getByLabelText('Name')).toHaveValue('')
    expect(screen.getByLabelText('Email')).toHaveValue('')
  })

  it('displays subject options correctly', () => {
    render(<ContactSection />)
    
    // Check default option
    expect(screen.getByRole('option', { name: 'Select a subject' })).toBeInTheDocument()
    
    // Check all subject options
    expect(screen.getByRole('option', { name: 'New Project Inquiry' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Collaboration Opportunity' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Technical Discussion' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Other' })).toBeInTheDocument()
  })

  it('renders contact information links', () => {
    render(<ContactSection />)
    
    // Check GitHub link
    const githubLink = screen.getByRole('link', { name: /Visit Tyler's GitHub profile/ })
    expect(githubLink).toHaveAttribute('href', 'https://github.com/isthatamullet')
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
    
    // Check email link
    const emailLink = screen.getByRole('link', { name: /Send email to Tyler/ })
    expect(emailLink).toHaveAttribute('href', 'mailto:tyler.gohr@example.com')
    
    // Check LinkedIn link
    const linkedinLink = screen.getByRole('link', { name: /Connect with Tyler on LinkedIn/ })
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/tyler-gohr')
    expect(linkedinLink).toHaveAttribute('target', '_blank')
  })

  it('has proper accessibility attributes', () => {
    render(<ContactSection />)
    
    // Check section labeling
    const section = screen.getByRole('region')
    expect(section).toHaveAttribute('aria-labelledby', 'contact-title')
    
    // Check form accessibility (form element exists within the section)
    const formElement = document.querySelector('form')
    expect(formElement).toBeInTheDocument()
    expect(formElement).toHaveAttribute('noValidate')
    
    // Check input accessibility
    const nameInput = screen.getByLabelText('Name')
    expect(nameInput).toHaveAttribute('aria-describedby', 'name-error')
    expect(nameInput).toHaveAttribute('required')
    
    const emailInput = screen.getByLabelText('Email')
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('aria-describedby', 'email-error')
    
    const messageTextarea = screen.getByLabelText('Message')
    expect(messageTextarea).toHaveAttribute('aria-describedby', 'message-error')
  })

  it('handles input changes correctly', async () => {
    const user = userEvent.setup()
    render(<ContactSection />)
    
    const nameInput = screen.getByLabelText('Name')
    const emailInput = screen.getByLabelText('Email')
    const messageTextarea = screen.getByLabelText('Message')
    
    // Type in inputs
    await user.type(nameInput, 'Test User')
    await user.type(emailInput, 'test@example.com')
    await user.type(messageTextarea, 'This is a test message')
    
    // Check values are updated
    expect(nameInput).toHaveValue('Test User')
    expect(emailInput).toHaveValue('test@example.com')
    expect(messageTextarea).toHaveValue('This is a test message')
  })

  it('shows loading spinner during submission', async () => {
    const user = userEvent.setup()
    render(<ContactSection />)
    
    // Fill out form
    await user.type(screen.getByLabelText('Name'), 'John Doe')
    await user.type(screen.getByLabelText('Email'), 'john@example.com')
    await user.selectOptions(screen.getByLabelText('Subject'), 'project-inquiry')
    await user.type(screen.getByLabelText('Message'), 'Test message')
    
    // Submit form
    await user.click(screen.getByRole('button', { name: 'Send Message' }))
    
    // Check for loading spinner
    const loadingSpinner = document.querySelector('[aria-hidden="true"]')
    expect(loadingSpinner).toBeInTheDocument()
    expect(screen.getByText('Sending...')).toBeInTheDocument()
  })

  it('displays expectation information', () => {
    render(<ContactSection />)
    
    // Check expectation items
    expect(screen.getByText('Quick Response')).toBeInTheDocument()
    expect(screen.getByText('Usually within 24 hours')).toBeInTheDocument()
    
    expect(screen.getByText('Focused Discussion')).toBeInTheDocument()
    expect(screen.getByText('Technical solutions-oriented')).toBeInTheDocument()
    
    expect(screen.getByText('Action-Oriented')).toBeInTheDocument()
    expect(screen.getByText('Ready to build great things')).toBeInTheDocument()
  })
})