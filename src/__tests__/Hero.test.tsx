import { render, screen, fireEvent } from '@testing-library/react';
import Hero from '@/app/2/components/Hero/Hero';

// Mock Button component
jest.mock('@/app/2/components/ui/Button/Button', () => ({
  Button: ({ children, onClick, variant, size, section, ...props }: React.PropsWithChildren<{ onClick?: () => void; variant?: string; size?: string; section?: string; [key: string]: unknown }>) => (
    <button 
      onClick={onClick} 
      data-variant={variant}
      data-size={size}
      data-section={section}
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock LogoFloat component
jest.mock('@/app/2/components/Hero/LogoFloat', () => ({
  LogoFloat: () => <div data-testid="logo-float">TG</div>,
}));

// Mock window methods for scroll navigation
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

Object.defineProperty(window, 'pageYOffset', {
  value: 0,
  writable: true,
});

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  top: 100,
  left: 0,
  bottom: 200,
  right: 100,
  width: 100,
  height: 100,
  x: 0,
  y: 100,
  toJSON: jest.fn(),
}));

describe('Hero Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders hero section with correct structure', () => {
      render(<Hero />);
      
      const heroSection = screen.getByRole('banner');
      expect(heroSection).toBeInTheDocument();
      expect(heroSection).toHaveAttribute('id', 'hero');
    });

    it('renders hero title with Enterprise Solutions Architect content', () => {
      render(<Hero />);
      
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Enterprise Solutions Architect');
    });

    it('renders hero subtitle and description', () => {
      render(<Hero />);
      
      // Check for subtitle
      expect(screen.getByText(/creating powerful digital solutions/i)).toBeInTheDocument();
      
      // Check for description with Emmy mention
      expect(screen.getByText(/emmy award-winning streaming platforms/i)).toBeInTheDocument();
      expect(screen.getByText(/fox corporation and warner bros/i)).toBeInTheDocument();
    });

    it('includes Emmy Award positioning in description', () => {
      render(<Hero />);
      
      const description = screen.getByText(/emmy award-winning streaming platforms/i);
      expect(description).toBeInTheDocument();
    });

    it('mentions key enterprise experience', () => {
      render(<Hero />);
      
      expect(screen.getByText(/16\+ years/i)).toBeInTheDocument();
      expect(screen.getByText(/fox corporation and warner bros/i)).toBeInTheDocument();
    });
  });

  describe('Hero Layout Structure', () => {
    it('renders 50/50 grid layout container', () => {
      render(<Hero />);
      
      const heroContainer = document.querySelector('[class*="heroContainer"]');
      expect(heroContainer).toBeInTheDocument();
    });

    it('renders hero graphic placeholder', () => {
      render(<Hero />);
      
      const graphicPlaceholder = document.querySelector('[class*="graphicPlaceholder"]');
      expect(graphicPlaceholder).toBeInTheDocument();
    });

    it('renders tech illustration elements', () => {
      render(<Hero />);
      
      // Check for animated tech elements
      const networkNodes = document.querySelectorAll('[class*="networkNode"]');
      expect(networkNodes.length).toBe(3);
      
      const dataFlows = document.querySelectorAll('[class*="dataFlow"]');
      expect(dataFlows.length).toBe(2);
    });

    it('renders hero content wrapper', () => {
      render(<Hero />);
      
      const contentWrapper = document.querySelector('[class*="contentWrapper"]');
      expect(contentWrapper).toBeInTheDocument();
    });
  });

  describe('LogoFloat Integration', () => {
    it('renders LogoFloat component', () => {
      render(<Hero />);
      
      const logoFloat = screen.getByTestId('logo-float');
      expect(logoFloat).toBeInTheDocument();
      expect(logoFloat).toHaveTextContent('TG');
    });

    it('positions LogoFloat correctly in hero section', () => {
      render(<Hero />);
      
      // LogoFloat should be rendered at the top of hero section
      const heroSection = screen.getByRole('banner');
      const logoFloat = screen.getByTestId('logo-float');
      
      expect(heroSection).toContainElement(logoFloat);
    });
  });

  describe('Call-to-Action Buttons', () => {
    it('renders primary CTA button', () => {
      render(<Hero />);
      
      const primaryCTA = screen.getByRole('button', { name: /start your project/i });
      expect(primaryCTA).toBeInTheDocument();
      expect(primaryCTA).toHaveAttribute('data-variant', 'primary');
      expect(primaryCTA).toHaveAttribute('data-size', 'lg');
      expect(primaryCTA).toHaveAttribute('data-section', 'hero');
    });

    it('renders secondary CTA button', () => {
      render(<Hero />);
      
      const secondaryCTA = screen.getByRole('button', { name: /view my work/i });
      expect(secondaryCTA).toBeInTheDocument();
      expect(secondaryCTA).toHaveAttribute('data-variant', 'secondary');
      expect(secondaryCTA).toHaveAttribute('data-size', 'lg');
      expect(secondaryCTA).toHaveAttribute('data-section', 'hero');
    });

    it('includes proper aria-labels for CTAs', () => {
      render(<Hero />);
      
      const primaryCTA = screen.getByRole('button', { name: /start your project - navigate to contact section/i });
      expect(primaryCTA).toBeInTheDocument();
      
      const secondaryCTA = screen.getByRole('button', { name: /view my work - navigate to case studies section/i });
      expect(secondaryCTA).toBeInTheDocument();
    });
  });

  describe('Navigation Functionality', () => {
    it('handles primary CTA click to contact section', () => {
      // Mock getElementById to return a contact element
      const mockContactElement = document.createElement('div');
      mockContactElement.id = 'contact';
      document.getElementById = jest.fn().mockReturnValue(mockContactElement);

      render(<Hero />);
      
      const primaryCTA = screen.getByRole('button', { name: /start your project/i });
      fireEvent.click(primaryCTA);
      
      expect(document.getElementById).toHaveBeenCalledWith('contact');
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 30, // 100 (getBoundingClientRect top) - 70 (navigation height)
        behavior: 'smooth',
      });
    });

    it('handles secondary CTA click to work section', () => {
      // Mock getElementById to return a work element
      const mockWorkElement = document.createElement('div');
      mockWorkElement.id = 'work';
      document.getElementById = jest.fn().mockReturnValue(mockWorkElement);

      render(<Hero />);
      
      const secondaryCTA = screen.getByRole('button', { name: /view my work/i });
      fireEvent.click(secondaryCTA);
      
      expect(document.getElementById).toHaveBeenCalledWith('work');
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 30, // 100 (getBoundingClientRect top) - 70 (navigation height)
        behavior: 'smooth',
      });
    });

    it('handles navigation when target element does not exist', () => {
      document.getElementById = jest.fn().mockReturnValue(null);

      render(<Hero />);
      
      const primaryCTA = screen.getByRole('button', { name: /start your project/i });
      fireEvent.click(primaryCTA);
      
      // Should not call scrollTo if element doesn't exist
      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility Compliance', () => {
    it('has proper semantic structure', () => {
      render(<Hero />);
      
      const heroSection = screen.getByRole('banner');
      expect(heroSection).toHaveAttribute('aria-labelledby', 'hero-title');
      
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveAttribute('id', 'hero-title');
    });

    it('has proper heading hierarchy', () => {
      render(<Hero />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent('Enterprise Solutions Architect');
    });

    it('includes descriptive text for screen readers', () => {
      render(<Hero />);
      
      // Check that subtitle and description provide context
      expect(screen.getByText(/creating powerful digital solutions/i)).toBeInTheDocument();
      expect(screen.getByText(/transform technical challenges into competitive advantages/i)).toBeInTheDocument();
    });

    it('has accessible button labels', () => {
      render(<Hero />);
      
      const primaryCTA = screen.getByLabelText(/start your project - navigate to contact section/i);
      expect(primaryCTA).toBeInTheDocument();
      
      const secondaryCTA = screen.getByLabelText(/view my work - navigate to case studies section/i);
      expect(secondaryCTA).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('applies correct CSS classes for responsive layout', () => {
      render(<Hero />);
      
      const heroSection = screen.getByRole('banner');
      expect(heroSection).toHaveClass(expect.stringContaining('heroSection'));
      
      const heroContainer = document.querySelector('[class*="heroContainer"]');
      expect(heroContainer).toBeInTheDocument();
    });

    it('renders hero actions container for button layout', () => {
      render(<Hero />);
      
      const heroActions = document.querySelector('[class*="heroActions"]');
      expect(heroActions).toBeInTheDocument();
      
      // Should contain both CTA buttons
      const ctaButtons = screen.getAllByRole('button');
      expect(ctaButtons).toHaveLength(2);
    });
  });

  describe('Typography Hierarchy', () => {
    it('applies correct typography classes', () => {
      render(<Hero />);
      
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass(expect.stringContaining('heroTitle'));
      
      const subtitle = screen.getByText(/creating powerful digital solutions/i);
      expect(subtitle).toHaveClass(expect.stringContaining('heroSubtitle'));
      
      const description = screen.getByText(/emmy award-winning streaming platforms/i);
      expect(description).toHaveClass(expect.stringContaining('heroDescription'));
    });

    it('maintains proper text hierarchy for dual-audience readability', () => {
      render(<Hero />);
      
      // Title should be most prominent
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
      
      // Subtitle should provide clear value proposition
      const subtitle = screen.getByText(/creating powerful digital solutions that solve real business problems/i);
      expect(subtitle).toBeInTheDocument();
      
      // Description should bridge enterprise experience to current goals
      const description = screen.getByText(/emmy award-winning streaming platforms to custom business solutions/i);
      expect(description).toBeInTheDocument();
    });
  });

  describe('Brand Positioning', () => {
    it('emphasizes Enterprise Solutions Architect positioning', () => {
      render(<Hero />);
      
      const title = screen.getByText('Enterprise Solutions Architect');
      expect(title).toBeInTheDocument();
    });

    it('includes dual-audience messaging', () => {
      render(<Hero />);
      
      // Technical professionals positioning
      expect(screen.getByText(/emmy award-winning streaming platforms/i)).toBeInTheDocument();
      expect(screen.getByText(/fox corporation and warner bros/i)).toBeInTheDocument();
      
      // Small business accessibility
      expect(screen.getByText(/custom business solutions/i)).toBeInTheDocument();
      expect(screen.getByText(/transform technical challenges into competitive advantages/i)).toBeInTheDocument();
    });

    it('highlights credibility markers', () => {
      render(<Hero />);
      
      expect(screen.getByText(/emmy award-winning/i)).toBeInTheDocument();
      expect(screen.getByText(/16\+ years/i)).toBeInTheDocument();
      expect(screen.getByText(/fox corporation and warner bros/i)).toBeInTheDocument();
    });
  });

  describe('Animation Performance', () => {
    it('includes animation-ready elements', () => {
      render(<Hero />);
      
      // Tech illustration should have animated elements
      const networkNodes = document.querySelectorAll('[class*="networkNode"]');
      expect(networkNodes.length).toBeGreaterThan(0);
      
      const dataFlows = document.querySelectorAll('[class*="dataFlow"]');
      expect(dataFlows.length).toBeGreaterThan(0);
    });

    it('includes LogoFloat for scroll-based animation', () => {
      render(<Hero />);
      
      const logoFloat = screen.getByTestId('logo-float');
      expect(logoFloat).toBeInTheDocument();
    });
  });

  describe('Integration with Design System', () => {
    it('uses Button component with correct props', () => {
      render(<Hero />);
      
      const buttons = screen.getAllByRole('button');
      
      // Both buttons should use hero section styling
      buttons.forEach(button => {
        expect(button).toHaveAttribute('data-section', 'hero');
        expect(button).toHaveAttribute('data-size', 'lg');
      });
      
      // Should have different variants
      const primaryButton = screen.getByRole('button', { name: /start your project/i });
      expect(primaryButton).toHaveAttribute('data-variant', 'primary');
      
      const secondaryButton = screen.getByRole('button', { name: /view my work/i });
      expect(secondaryButton).toHaveAttribute('data-variant', 'secondary');
    });
  });
});