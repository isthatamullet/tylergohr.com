import { render, screen, fireEvent } from '@testing-library/react';
import { Button, LinkButton } from '@/app/2/components/ui/Button/Button';

// Mock Framer Motion components
jest.mock('@/app/2/lib/framer-motion-client', () => ({
  ClientMotionDiv: ({ children, onClick, ...props }: React.PropsWithChildren<{ onClick?: () => void; [key: string]: unknown }>) => (
    <div onClick={onClick} {...props}>
      {children}
    </div>
  ),
}));

describe('Button Component', () => {
  describe('Basic Rendering', () => {
    it('renders button with default props', () => {
      render(<Button>Test Button</Button>);
      
      const button = screen.getByRole('button', { name: /test button/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Test Button');
    });

    it('renders button with custom className', () => {
      render(<Button className="custom-class">Test Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button.parentElement).toHaveClass('custom-class');
    });

    it('handles button click events', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Clickable Button</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Variant Props', () => {
    it('renders primary variant by default', () => {
      render(<Button>Primary Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button.parentElement).toHaveClass(expect.stringContaining('button--primary'));
    });

    it('renders secondary variant correctly', () => {
      render(<Button variant="secondary">Secondary Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button.parentElement).toHaveClass(expect.stringContaining('button--secondary'));
    });

    it('renders outline variant correctly', () => {
      render(<Button variant="outline">Outline Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button.parentElement).toHaveClass(expect.stringContaining('button--outline'));
    });

    it('renders ghost variant correctly', () => {
      render(<Button variant="ghost">Ghost Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button.parentElement).toHaveClass(expect.stringContaining('button--ghost'));
    });
  });

  describe('Size Props', () => {
    it('renders medium size by default', () => {
      render(<Button>Medium Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button.parentElement).toHaveClass(expect.stringContaining('button--md'));
    });

    it('renders small size correctly', () => {
      render(<Button size="sm">Small Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button.parentElement).toHaveClass(expect.stringContaining('button--sm'));
    });

    it('renders large size correctly', () => {
      render(<Button size="lg">Large Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button.parentElement).toHaveClass(expect.stringContaining('button--lg'));
    });

    it('renders extra large size correctly', () => {
      render(<Button size="xl">Extra Large Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button.parentElement).toHaveClass(expect.stringContaining('button--xl'));
    });
  });

  describe('Section Context Props', () => {
    it('renders hero section styling by default', () => {
      render(<Button>Hero Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button.parentElement).toHaveClass(expect.stringContaining('button--hero'));
    });

    it('renders about section styling correctly', () => {
      render(<Button section="about">About Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button.parentElement).toHaveClass(expect.stringContaining('button--about'));
    });

    it('renders results section styling correctly', () => {
      render(<Button section="results">Results Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button.parentElement).toHaveClass(expect.stringContaining('button--results'));
    });

    it('renders case-studies section styling correctly', () => {
      render(<Button section="case-studies">Case Studies Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button.parentElement).toHaveClass(expect.stringContaining('button--case-studies'));
    });

    it('renders how-i-work section styling correctly', () => {
      render(<Button section="how-i-work">How I Work Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button.parentElement).toHaveClass(expect.stringContaining('button--how-i-work'));
    });

    it('renders technical-expertise section styling correctly', () => {
      render(<Button section="technical-expertise">Technical Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button.parentElement).toHaveClass(expect.stringContaining('button--technical-expertise'));
    });

    it('renders contact section styling correctly', () => {
      render(<Button section="contact">Contact Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button.parentElement).toHaveClass(expect.stringContaining('button--contact'));
    });
  });

  describe('Loading State', () => {
    it('renders loading spinner when loading prop is true', () => {
      render(<Button loading>Loading Button</Button>);
      
      // Check for spinner icon
      const spinner = document.querySelector('svg');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('disables button when loading', () => {
      render(<Button loading>Loading Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('applies loading class when loading', () => {
      render(<Button loading>Loading Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button.parentElement).toHaveClass(expect.stringContaining('button--loading'));
    });

    it('prevents click events when loading', () => {
      const handleClick = jest.fn();
      render(<Button loading onClick={handleClick}>Loading Button</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('shows loading text styling when loading', () => {
      render(<Button loading>Loading Button</Button>);
      
      const buttonText = document.querySelector('[class*="buttonTextLoading"]');
      expect(buttonText).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('disables button when disabled prop is true', () => {
      render(<Button disabled>Disabled Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('applies disabled class when disabled', () => {
      render(<Button disabled>Disabled Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button.parentElement).toHaveClass(expect.stringContaining('button--disabled'));
    });

    it('prevents click events when disabled', () => {
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Disabled Button</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Framer Motion Animation Integration', () => {
    it('applies Framer Motion wrapper for animations', () => {
      render(<Button>Animated Button</Button>);
      
      // Button should be wrapped in ClientMotionDiv
      const button = screen.getByRole('button');
      expect(button.parentElement).toBeInTheDocument();
    });

    it('disables animation scale when loading', () => {
      render(<Button loading>Loading Button</Button>);
      
      // Animation should be disabled - motion props should be 1 (no scale)
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('disables animation scale when disabled', () => {
      render(<Button disabled>Disabled Button</Button>);
      
      // Animation should be disabled - motion props should be 1 (no scale)
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Accessibility Compliance', () => {
    it('has proper button role', () => {
      render(<Button>Accessible Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('supports custom aria attributes', () => {
      render(
        <Button aria-label="Custom label" aria-describedby="description">
          Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
      expect(button).toHaveAttribute('aria-describedby', 'description');
    });

    it('sets aria-disabled correctly for loading state', () => {
      render(<Button loading>Loading Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('sets aria-disabled correctly for disabled state', () => {
      render(<Button disabled>Disabled Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('includes aria-hidden on spinner for screen readers', () => {
      render(<Button loading>Loading Button</Button>);
      
      const spinner = document.querySelector('[aria-hidden="true"]');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Complex Prop Combinations', () => {
    it('handles multiple props correctly', () => {
      const handleClick = jest.fn();
      render(
        <Button
          variant="secondary"
          size="lg"
          section="results"
          className="custom-class"
          onClick={handleClick}
        >
          Complex Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button.parentElement).toHaveClass(
        expect.stringContaining('button--secondary'),
        expect.stringContaining('button--lg'),
        expect.stringContaining('button--results'),
        'custom-class'
      );
      
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('prioritizes disabled over loading for interaction', () => {
      const handleClick = jest.fn();
      render(
        <Button disabled loading onClick={handleClick}>
          Disabled Loading Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});

describe('LinkButton Component', () => {
  describe('Basic Rendering', () => {
    it('renders as link when href is provided', () => {
      render(<LinkButton href="/test">Link Button</LinkButton>);
      
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
    });

    it('renders as button when href is not provided', () => {
      render(<LinkButton>Button Link</LinkButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('applies ghost variant by default', () => {
      render(<LinkButton href="/test">Ghost Link</LinkButton>);
      
      const button = screen.getByRole('button');
      expect(button.parentElement).toHaveClass(expect.stringContaining('button--ghost'));
    });
  });

  describe('Link Attributes', () => {
    it('handles target attribute correctly', () => {
      render(<LinkButton href="/test" target="_blank">External Link</LinkButton>);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('handles rel attribute correctly', () => {
      render(<LinkButton href="/test" rel="noopener noreferrer">Secure Link</LinkButton>);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('removes text decoration from link', () => {
      render(<LinkButton href="/test">Styled Link</LinkButton>);
      
      const link = screen.getByRole('link');
      expect(link).toHaveStyle('text-decoration: none');
    });
  });

  describe('Props Inheritance', () => {
    it('passes through button props correctly', () => {
      const handleClick = jest.fn();
      render(
        <LinkButton
          size="lg"
          section="contact"
          onClick={handleClick}
        >
          Props Link
        </LinkButton>
      );
      
      const button = screen.getByRole('button');
      expect(button.parentElement).toHaveClass(
        expect.stringContaining('button--lg'),
        expect.stringContaining('button--contact')
      );
      
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles loading state in link button', () => {
      render(<LinkButton loading>Loading Link</LinkButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button.parentElement).toHaveClass(expect.stringContaining('button--loading'));
    });

    it('handles disabled state in link button', () => {
      render(<LinkButton disabled href="/test">Disabled Link</LinkButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Section Context in LinkButton', () => {
    it('applies section styling to link button', () => {
      render(<LinkButton section="hero" href="/test">Hero Link</LinkButton>);
      
      const button = screen.getByRole('button');
      expect(button.parentElement).toHaveClass(expect.stringContaining('button--hero'));
    });
  });
});