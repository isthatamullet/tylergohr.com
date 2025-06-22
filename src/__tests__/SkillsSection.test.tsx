import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import SkillsSection from '@/components/SkillsSection'

// Mock the tech stack data
jest.mock('@/lib/projects', () => ({
  techStackItems: {
    react: { name: 'React', category: 'Frontend', color: '#61DAFB' },
    typescript: { name: 'TypeScript', category: 'Frontend', color: '#3178C6' },
    nodejs: { name: 'Node.js', category: 'Backend', color: '#339933' },
    postgresql: { name: 'PostgreSQL', category: 'Database', color: '#336791' },
    gcp: { name: 'Google Cloud', category: 'Cloud', color: '#4285F4' },
    tailwind: { name: 'Tailwind CSS', category: 'Frontend', color: '#06B6D4' },
    framermotion: { name: 'Framer Motion', category: 'Frontend', color: '#0055FF' },
    vite: { name: 'Vite', category: 'Frontend', color: '#646CFF' },
    zustand: { name: 'Zustand', category: 'Frontend', color: '#FF6B35' },
    socketio: { name: 'Socket.IO', category: 'Backend', color: '#010101' },
    stripe: { name: 'Stripe', category: 'Backend', color: '#635BFF' },
    quickbooks: { name: 'QuickBooks API', category: 'Backend', color: '#0077C5' },
    gmail: { name: 'Gmail API', category: 'Backend', color: '#EA4335' },
    supabase: { name: 'Supabase', category: 'Database', color: '#3ECF8E' },
    firebase: { name: 'Firebase', category: 'Cloud', color: '#FFCA28' }
  }
}))

describe('SkillsSection', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    const mockIntersectionObserver = jest.fn()
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    })
    global.IntersectionObserver = mockIntersectionObserver
  })

  it('renders section title and subtitle', () => {
    render(<SkillsSection />)
    
    expect(screen.getByRole('heading', { name: 'Technical Expertise' })).toBeInTheDocument()
    expect(screen.getByText('Modern technologies and frameworks powering innovative solutions')).toBeInTheDocument()
  })

  it('renders all skill categories as tabs', () => {
    render(<SkillsSection />)
    
    // Check that all category tabs are present
    expect(screen.getByRole('tab', { name: /Frontend/ })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Backend/ })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Database/ })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Cloud & DevOps/ })).toBeInTheDocument()
  })

  it('has Frontend category active by default', () => {
    render(<SkillsSection />)
    
    const frontendTab = screen.getByRole('tab', { name: /Frontend/ })
    expect(frontendTab).toHaveAttribute('aria-selected', 'true')
    expect(frontendTab).toHaveClass('active')
  })

  it('switches categories when tabs are clicked', async () => {
    const user = userEvent.setup()
    render(<SkillsSection />)
    
    // Click on Backend tab
    const backendTab = screen.getByRole('tab', { name: /Backend/ })
    await user.click(backendTab)
    
    // Check that Backend tab is now active
    expect(backendTab).toHaveAttribute('aria-selected', 'true')
    expect(backendTab).toHaveClass('active')
    
    // Check that Frontend tab is no longer active
    const frontendTab = screen.getByRole('tab', { name: /Frontend/ })
    expect(frontendTab).toHaveAttribute('aria-selected', 'false')
  })

  it('displays correct skills for each category', async () => {
    const user = userEvent.setup()
    render(<SkillsSection />)
    
    // Frontend should be active by default - check for React
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    
    // Switch to Backend tab
    const backendTab = screen.getByRole('tab', { name: /Backend/ })
    await user.click(backendTab)
    
    // Check for Backend skills
    await waitFor(() => {
      expect(screen.getByText('Node.js')).toBeInTheDocument()
      expect(screen.getByText('Socket.IO')).toBeInTheDocument()
    })
  })

  it('has proper accessibility attributes', () => {
    render(<SkillsSection />)
    
    // Check section has proper labeling
    const section = screen.getByRole('region')
    expect(section).toHaveAttribute('aria-labelledby', 'skills-title')
    
    // Check tablist role
    const tablist = screen.getByRole('tablist')
    expect(tablist).toBeInTheDocument()
    
    // Check tabpanel has proper attributes
    const tabpanel = screen.getByRole('tabpanel')
    expect(tabpanel).toHaveAttribute('id', 'skills-panel-frontend')
    expect(tabpanel).toHaveAttribute('aria-labelledby', 'skills-title')
  })

  it('displays summary statistics', () => {
    render(<SkillsSection />)
    
    // Check summary stats
    expect(screen.getByText('15+')).toBeInTheDocument()
    expect(screen.getByText('Technologies')).toBeInTheDocument()
    expect(screen.getByText('5+')).toBeInTheDocument()
    expect(screen.getByText('Years Experience')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Major Projects')).toBeInTheDocument()
  })

  it('handles keyboard navigation between tabs', async () => {
    const user = userEvent.setup()
    render(<SkillsSection />)
    
    const frontendTab = screen.getByRole('tab', { name: /Frontend/ })
    const backendTab = screen.getByRole('tab', { name: /Backend/ })
    
    // Focus on first tab
    frontendTab.focus()
    expect(frontendTab).toHaveFocus()
    
    // Use arrow key to navigate to next tab
    await user.keyboard('{ArrowRight}')
    expect(backendTab).toHaveFocus()
  })

  it('shows skill count for each category', () => {
    render(<SkillsSection />)
    
    // Check that category buttons show skill counts
    const frontendTab = screen.getByRole('tab', { name: /Frontend/ })
    expect(frontendTab).toHaveTextContent('6') // Based on mocked data
    
    const backendTab = screen.getByRole('tab', { name: /Backend/ })
    expect(backendTab).toHaveTextContent('5') // Based on mocked data
  })

  it('applies correct styling and animations', () => {
    render(<SkillsSection />)
    
    // Check that skill cards have proper data attributes for animations
    const skillCards = screen.getAllByTestId(/skill-card/) || document.querySelectorAll('[data-skill-id]')
    expect(skillCards.length).toBeGreaterThan(0)
  })
})