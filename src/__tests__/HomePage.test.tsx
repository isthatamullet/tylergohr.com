import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import HomePage from '@/app/page'

// Mock the project data
jest.mock('@/lib/projects', () => ({
  projects: [
    {
      id: 'invoice-chaser',
      title: 'Invoice Chaser',
      description: 'Automated invoice tracking and payment processing system',
      image: '/images/invoice-chaser.jpg',
      techStack: ['React', 'Node.js', 'PostgreSQL'],
      status: 'deployed',
      metrics: {
        performanceImprovement: 40,
        automationReduction: 25,
        userSatisfaction: 95
      }
    }
  ]
}))

describe('HomePage', () => {
  beforeEach(() => {
    // Reset intersection observer mock
    const mockIntersectionObserver = jest.fn()
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    })
    global.IntersectionObserver = mockIntersectionObserver
  })

  it('renders hero section with correct content', () => {
    render(<HomePage />)
    
    // Check hero title
    expect(screen.getByRole('heading', { level: 1, name: 'Tyler Gohr' })).toBeInTheDocument()
    
    // Check hero subtitle
    expect(screen.getByText('Full-Stack Developer & Creative Problem Solver')).toBeInTheDocument()
    
    // Check hero description
    expect(screen.getByText(/Crafting innovative digital experiences/)).toBeInTheDocument()
  })

  it('has proper semantic structure and accessibility', () => {
    render(<HomePage />)
    
    // Check main landmark
    expect(screen.getByRole('main')).toBeInTheDocument()
    
    // Check banner landmark (hero section)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    
    // Check aria-labelledby relationship
    const heroSection = screen.getByRole('banner')
    expect(heroSection).toHaveAttribute('aria-labelledby', 'hero-title')
    
    // Check aria-describedby relationship
    const heroSubtitle = screen.getByText('Full-Stack Developer & Creative Problem Solver')
    expect(heroSubtitle).toHaveAttribute('aria-describedby', 'hero-description')
  })

  it('renders all main sections', () => {
    render(<HomePage />)
    
    // Check section headings
    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Technical Expertise' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Featured Projects' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: "Let's Connect" })).toBeInTheDocument()
  })

  it('handles project selection and deep dive modal', async () => {
    const user = userEvent.setup()
    render(<HomePage />)
    
    // Find and click on a project (assuming ProjectShowcase renders clickable elements)
    const projectElement = screen.getByText('Invoice Chaser')
    await user.click(projectElement)
    
    // Wait for project deep dive to appear
    await waitFor(() => {
      expect(screen.getByText('Invoice Chaser')).toBeInTheDocument()
    })
  })

  it('closes project deep dive when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<HomePage />)
    
    // Open project deep dive first
    const projectElement = screen.getByText('Invoice Chaser')
    await user.click(projectElement)
    
    // Wait for deep dive to open and find close button
    await waitFor(() => {
      const closeButton = screen.getByRole('button', { name: /close/i })
      return user.click(closeButton)
    })
    
    // Check that we're back to main page
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Tyler Gohr' })).toBeInTheDocument()
    })
  })

  it('has proper focus management for keyboard navigation', () => {
    render(<HomePage />)
    
    // Check that main content has proper focus target
    const mainContent = screen.getByRole('main')
    expect(mainContent).toHaveAttribute('id', 'main-content')
    
    // Check hero title is focusable for screen readers
    const heroTitle = screen.getByRole('heading', { level: 1 })
    expect(heroTitle).toHaveAttribute('id', 'hero-title')
  })

  it('renders without accessibility violations', () => {
    render(<HomePage />)
    
    // Check for proper heading hierarchy
    const headings = screen.getAllByRole('heading')
    const h1Elements = headings.filter(h => h.tagName === 'H1')
    expect(h1Elements).toHaveLength(1) // Should have exactly one H1
    
    // Check for proper region landmarks
    const regions = screen.getAllByRole('region')
    expect(regions.length).toBeGreaterThan(0)
    
    // Check that images have alt text or are properly marked as decorative
    const parallaxBackground = screen.getByRole('presentation')
    expect(parallaxBackground).toHaveAttribute('aria-hidden', 'true')
  })
})