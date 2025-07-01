import { render, screen, fireEvent } from '@testing-library/react';
import TopNavigation from '@/components/TopNavigation';

// Mock Next.js usePathname hook
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Mock scrollIntoView
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

describe('TopNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders navigation with TG logo', () => {
    render(<TopNavigation />);
    
    const logo = screen.getByRole('button', { name: /tyler gohr - return to homepage/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveTextContent('TG');
  });

  it('renders all navigation links', () => {
    render(<TopNavigation />);
    
    expect(screen.getByRole('button', { name: /navigate to about section/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /navigate to technical section/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /navigate to projects section/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /navigate to blog page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /navigate to contact section/i })).toBeInTheDocument();
  });

  it('opens and closes mobile menu', () => {
    render(<TopNavigation />);
    
    const menuButton = screen.getByRole('button', { name: /open navigation menu/i });
    expect(menuButton).toBeInTheDocument();
    
    // Open menu
    fireEvent.click(menuButton);
    expect(screen.getByRole('button', { name: /close navigation menu/i })).toBeInTheDocument();
    
    // Close menu
    fireEvent.click(menuButton);
    expect(screen.getByRole('button', { name: /open navigation menu/i })).toBeInTheDocument();
  });

  it('handles navigation link clicks', () => {
    // Mock getElementById
    const mockElement = { 
      getBoundingClientRect: () => ({ top: 100 }),
      scrollIntoView: jest.fn() 
    };
    document.getElementById = jest.fn().mockReturnValue(mockElement);

    render(<TopNavigation />);
    
    const aboutLink = screen.getByRole('button', { name: /navigate to about section/i });
    fireEvent.click(aboutLink);
    
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    render(<TopNavigation />);
    
    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(nav).toBeInTheDocument();
    
    const menuButton = screen.getByRole('button', { name: /open navigation menu/i });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });
});