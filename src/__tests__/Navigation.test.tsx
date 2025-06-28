import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navigation from '@/app/2/components/Navigation/Navigation';

// Mock Next.js usePathname hook for /2 routes
const mockPathname = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

// Mock window methods
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

Object.defineProperty(window, 'scrollY', {
  value: 0,
  writable: true,
} as PropertyDescriptor);

Object.defineProperty(window.history, 'pushState', {
  value: jest.fn(),
  writable: true,
});

Object.defineProperty(window.history, 'replaceState', {
  value: jest.fn(),
  writable: true,
});

// Mock location
delete (window as { location?: unknown }).location;
(window as { location: { href: string; hash: string } }).location = {
  href: '',
  hash: '',
};

// Mock IntersectionObserver
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();
const mockIntersectionObserver = jest.fn().mockImplementation((callback, options) => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
  callback,
  options
}));
window.IntersectionObserver = mockIntersectionObserver;

// Mock requestAnimationFrame
Object.defineProperty(window, 'requestAnimationFrame', {
  value: jest.fn((cb) => cb()),
  writable: true,
});

describe('Navigation Component (/2 Route)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockObserve.mockClear();
    mockUnobserve.mockClear(); 
    mockDisconnect.mockClear();
    mockIntersectionObserver.mockClear();
    mockPathname.mockReturnValue('/2');
    window.location.href = '';
    window.location.hash = '';
    (window.scrollY as number) = 0;
  });

  describe('Basic Rendering', () => {
    it('renders navigation with Enterprise Solutions branding', () => {
      render(<Navigation />);
      
      const logo = screen.getByRole('button', { name: /tyler gohr - return to enterprise solutions homepage/i });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveTextContent('TG');
    });

    it('renders all /2 navigation links', () => {
      render(<Navigation />);
      
      // Check for all /2 specific navigation links
      expect(screen.getByRole('button', { name: /navigate to about section/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /navigate to results section/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /navigate to work section/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /navigate to process section/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /navigate to skills section/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /navigate to contact section/i }));
    });

    it('has proper navigation structure and accessibility', () => {
      render(<Navigation />);
      
      const nav = screen.getByRole('navigation', { name: /main navigation/i });
      expect(nav).toBeInTheDocument();
      
      const menuButton = screen.getByRole('button', { name: /open navigation menu/i });
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      expect(menuButton).toHaveAttribute('aria-controls', 'mobile-navigation');
    });
  });

  describe('Multi-Page Navigation Logic', () => {
    it('handles navigation from /2 landing page to sections', () => {
      const mockElement = { 
        getBoundingClientRect: () => ({ top: 100 }),
      };
      document.getElementById = jest.fn().mockReturnValue(mockElement);

      render(<Navigation />);
      
      const aboutLink = screen.getByRole('button', { name: /navigate to about section/i });
      fireEvent.click(aboutLink);
      
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 30, // 100 - 70 (NAV_HEIGHT)
        behavior: 'smooth',
      });
      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/2#about');
    });

    it('handles navigation from case studies page to landing page sections', () => {
      mockPathname.mockReturnValue('/2/case-studies');
      
      render(<Navigation />);
      
      const aboutLink = screen.getByRole('button', { name: /navigate to about section/i });
      fireEvent.click(aboutLink);
      
      expect(window.location.href).toBe('/2#about');
    });

    it('handles navigation from how-i-work page to landing page sections', () => {
      mockPathname.mockReturnValue('/2/how-i-work');
      
      render(<Navigation />);
      
      const resultsLink = screen.getByRole('button', { name: /navigate to results section/i });
      fireEvent.click(resultsLink);
      
      expect(window.location.href).toBe('/2#results');
    });

    it('handles navigation from technical-expertise page to landing page sections', () => {
      mockPathname.mockReturnValue('/2/technical-expertise');
      
      render(<Navigation />);
      
      const contactLink = screen.getByRole('button', { name: /navigate to contact section/i });
      fireEvent.click(contactLink);
      
      expect(window.location.href).toBe('/2#contact');
    });
  });

  describe('Logo Navigation & Home Functionality', () => {
    it('scrolls to top when logo clicked on /2 landing page', () => {
      render(<Navigation />);
      
      const logo = screen.getByRole('button', { name: /tyler gohr - return to enterprise solutions homepage/i });
      fireEvent.click(logo);
      
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/2');
    });

    it('navigates to /2 when logo clicked from other pages', () => {
      mockPathname.mockReturnValue('/2/case-studies');
      
      render(<Navigation />);
      
      const logo = screen.getByRole('button', { name: /tyler gohr - return to enterprise solutions homepage/i });
      fireEvent.click(logo);
      
      expect(window.location.href).toBe('/2');
    });
  });

  describe('Active Section Management', () => {
    it('sets correct active section based on pathname', () => {
      mockPathname.mockReturnValue('/2/case-studies');
      
      render(<Navigation />);
      
      const workLink = screen.getByRole('button', { name: /navigate to work section/i });
      expect(workLink).toHaveAttribute('aria-current', 'page');
    });

    it('sets process as active for how-i-work page', () => {
      mockPathname.mockReturnValue('/2/how-i-work');
      
      render(<Navigation />);
      
      const processLink = screen.getByRole('button', { name: /navigate to process section/i });
      expect(processLink).toHaveAttribute('aria-current', 'page');
    });

    it('sets skills as active for technical-expertise page', () => {
      mockPathname.mockReturnValue('/2/technical-expertise');
      
      render(<Navigation />);
      
      const skillsLink = screen.getByRole('button', { name: /navigate to skills section/i });
      expect(skillsLink).toHaveAttribute('aria-current', 'page');
    });

    it('handles hash-based navigation on /2 landing page', () => {
      window.location.hash = '#results';
      
      render(<Navigation />);
      
      const resultsLink = screen.getByRole('button', { name: /navigate to results section/i });
      expect(resultsLink).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('Scroll Effects & Logo Float Preparation', () => {
    it('applies scrolled class when scroll position > 200px', async () => {
      render(<Navigation />);
      
      // Simulate scroll event
      (window.scrollY as number) = 250;
      fireEvent.scroll(window);
      
      await waitFor(() => {
        const nav = screen.getByRole('navigation');
        expect(nav).toHaveClass(expect.stringContaining('scrolled'));
      });
    });

    it('removes scrolled class when scroll position <= 200px', async () => {
      render(<Navigation />);
      
      // Simulate scroll event
      (window.scrollY as number) = 100;
      fireEvent.scroll(window);
      
      await waitFor(() => {
        const nav = screen.getByRole('navigation');
        expect(nav).not.toHaveClass(expect.stringContaining('scrolled'));
      });
    });

    it('logo has scrolled state class when navigation is scrolled', async () => {
      render(<Navigation />);
      
      (window.scrollY as number) = 250;
      fireEvent.scroll(window);
      
      await waitFor(() => {
        const logo = screen.getByRole('button', { name: /tyler gohr - return to enterprise solutions homepage/i });
        expect(logo).toHaveClass(expect.stringContaining('logoScrolled'));
      });
    });
  });

  describe('Mobile Menu Functionality', () => {
    it('opens and closes mobile menu correctly', () => {
      render(<Navigation />);
      
      const menuButton = screen.getByRole('button', { name: /open navigation menu/i });
      
      // Open menu
      fireEvent.click(menuButton);
      expect(screen.getByRole('button', { name: /close navigation menu/i })).toBeInTheDocument();
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      
      const mobileNav = document.querySelector('[aria-hidden="false"]');
      expect(mobileNav).toBeInTheDocument();
      
      // Close menu
      fireEvent.click(menuButton);
      expect(screen.getByRole('button', { name: /open navigation menu/i })).toBeInTheDocument();
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes mobile menu when navigation link is clicked', () => {
      const mockElement = { 
        getBoundingClientRect: () => ({ top: 100 }),
      };
      document.getElementById = jest.fn().mockReturnValue(mockElement);

      render(<Navigation />);
      
      const menuButton = screen.getByRole('button', { name: /open navigation menu/i });
      fireEvent.click(menuButton);
      
      // Find mobile navigation links (they have different selectors than desktop)
      const mobileLinks = screen.getAllByRole('button', { name: /navigate to about section/i });
      const mobileAboutLink = mobileLinks.find(link => 
        link.getAttribute('tabIndex') === '0'
      );
      
      fireEvent.click(mobileAboutLink!);
      
      expect(screen.getByRole('button', { name: /open navigation menu/i })).toBeInTheDocument();
    });

    it('manages mobile menu overlay', () => {
      render(<Navigation />);
      
      const menuButton = screen.getByRole('button', { name: /open navigation menu/i });
      fireEvent.click(menuButton);
      
      // Check for overlay
      const overlay = document.querySelector('[aria-hidden="true"]');
      expect(overlay).toBeInTheDocument();
      
      // Click overlay to close menu
      fireEvent.click(overlay!);
      expect(screen.getByRole('button', { name: /open navigation menu/i })).toBeInTheDocument();
    });

    it('manages mobile navigation tabIndex correctly', () => {
      render(<Navigation />);
      
      const menuButton = screen.getByRole('button', { name: /open navigation menu/i });
      
      // When menu is closed, mobile links should have tabIndex -1
      const mobileLinks = screen.getAllByRole('button', { name: /navigate to about section/i });
      const mobileAboutLink = mobileLinks.find(link => 
        link.getAttribute('tabIndex') === '-1'
      );
      expect(mobileAboutLink).toBeInTheDocument();
      
      // When menu is open, mobile links should have tabIndex 0
      fireEvent.click(menuButton);
      const activeMobileLinks = screen.getAllByRole('button', { name: /navigate to about section/i });
      const activeMobileAboutLink = activeMobileLinks.find(link => 
        link.getAttribute('tabIndex') === '0'
      );
      expect(activeMobileAboutLink).toBeInTheDocument();
    });
  });

  describe('Intersection Observer Integration', () => {
    it('sets up intersection observer only on /2 landing page', () => {
      render(<Navigation />);
      
      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          threshold: 0.6,
          rootMargin: '-70px 0px -40% 0px',
        }
      );
    });

    it('does not set up intersection observer on other pages', () => {
      mockPathname.mockReturnValue('/2/case-studies');
      jest.clearAllMocks();
      
      render(<Navigation />);
      
      expect(mockIntersectionObserver).not.toHaveBeenCalled();
    });

    it('observes all section elements on /2 landing page', () => {
      // Mock section elements
      const sections = ['about', 'results', 'work', 'process', 'skills', 'contact'];
      document.getElementById = jest.fn().mockImplementation((id) => 
        sections.includes(id) ? { id } : null
      );

      render(<Navigation />);
      
      expect(mockObserve).toHaveBeenCalledTimes(sections.length);
    });
  });

  describe('Performance Optimizations', () => {
    it('throttles scroll handler with requestAnimationFrame', () => {
      render(<Navigation />);
      
      // Multiple rapid scroll events
      fireEvent.scroll(window);
      fireEvent.scroll(window);
      fireEvent.scroll(window);
      
      // requestAnimationFrame should be called but throttled
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('cleans up event listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      const { unmount } = render(<Navigation />);
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('disconnects intersection observer on unmount', () => {
      const { unmount } = render(<Navigation />);
      unmount();
      
      expect(mockDisconnect).toHaveBeenCalled();
    });
  });

  describe('Custom Props and Styling', () => {
    it('applies custom className prop', () => {
      render(<Navigation className="custom-nav-class" />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('custom-nav-class');
    });

    it('maintains default behavior without className prop', () => {
      render(<Navigation />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });
  });
});