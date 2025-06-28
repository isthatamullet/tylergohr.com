import { render, screen } from '@testing-library/react';
import { 
  Section, 
  HeroSection, 
  AboutSection, 
  ResultsSection, 
  CaseStudiesSection, 
  HowIWorkSection, 
  TechnicalExpertiseSection, 
  ContactSection 
} from '@/app/2/components/Section/Section';

describe('Section Component', () => {
  describe('Basic Rendering', () => {
    it('renders section with default props', () => {
      render(<Section>Test Content</Section>);
      
      const section = screen.getByText('Test Content');
      expect(section.closest('section')).toBeInTheDocument();
    });

    it('renders with custom children', () => {
      render(
        <Section>
          <h2>Section Title</h2>
          <p>Section paragraph content</p>
        </Section>
      );
      
      expect(screen.getByText('Section Title')).toBeInTheDocument();
      expect(screen.getByText('Section paragraph content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Section className="custom-section">Content</Section>);
      
      const section = screen.getByText('Content').closest('section');
      expect(section).toHaveClass('custom-section');
    });
  });

  describe('HTML Element Variants', () => {
    it('renders as section by default', () => {
      render(<Section>Section Content</Section>);
      
      const element = screen.getByText('Section Content').closest('section');
      expect(element).toBeInTheDocument();
      expect(element?.tagName).toBe('SECTION');
    });

    it('renders as div when specified', () => {
      render(<Section as="div">Div Content</Section>);
      
      const element = screen.getByText('Div Content').closest('div');
      expect(element).toBeInTheDocument();
      expect(element?.tagName).toBe('DIV');
    });

    it('renders as main when specified', () => {
      render(<Section as="main">Main Content</Section>);
      
      const element = screen.getByText('Main Content').closest('main');
      expect(element).toBeInTheDocument();
      expect(element?.tagName).toBe('MAIN');
    });

    it('renders as article when specified', () => {
      render(<Section as="article">Article Content</Section>);
      
      const element = screen.getByText('Article Content').closest('article');
      expect(element).toBeInTheDocument();
      expect(element?.tagName).toBe('ARTICLE');
    });

    it('renders as aside when specified', () => {
      render(<Section as="aside">Aside Content</Section>);
      
      const element = screen.getByText('Aside Content').closest('aside');
      expect(element).toBeInTheDocument();
      expect(element?.tagName).toBe('ASIDE');
    });
  });

  describe('Background Variants', () => {
    it('applies hero background by default', () => {
      render(<Section>Hero Content</Section>);
      
      const section = screen.getByText('Hero Content').closest('section');
      expect(section?.className).toMatch(/section--hero/);
    });

    it('applies about background correctly', () => {
      render(<Section background="about">About Content</Section>);
      
      const section = screen.getByText('About Content').closest('section');
      expect(section?.className).toMatch(/section--about/);
    });

    it('applies results background correctly', () => {
      render(<Section background="results">Results Content</Section>);
      
      const section = screen.getByText('Results Content').closest('section');
      expect(section?.className).toMatch(/section--results/);
    });

    it('applies case-studies background correctly', () => {
      render(<Section background="case-studies">Case Studies Content</Section>);
      
      const section = screen.getByText('Case Studies Content').closest('section');
      expect(section?.className).toMatch(/section--case-studies/);
    });

    it('applies how-i-work background correctly', () => {
      render(<Section background="how-i-work">How I Work Content</Section>);
      
      const section = screen.getByText('How I Work Content').closest('section');
      expect(section?.className).toMatch(/section--how-i-work/);
    });

    it('applies technical-expertise background correctly', () => {
      render(<Section background="technical-expertise">Technical Content</Section>);
      
      const section = screen.getByText('Technical Content').closest('section');
      expect(section?.className).toMatch(/section--technical-expertise/);
    });

    it('applies contact background correctly', () => {
      render(<Section background="contact">Contact Content</Section>);
      
      const section = screen.getByText('Contact Content').closest('section');
      expect(section?.className).toMatch(/section--contact/);
    });

    it('applies footer background correctly', () => {
      render(<Section background="footer">Footer Content</Section>);
      
      const section = screen.getByText('Footer Content').closest('section');
      expect(section?.className).toMatch(/section--footer/);
    });
  });

  describe('Container System', () => {
    it('includes container wrapper by default', () => {
      render(<Section>Container Content</Section>);
      
      const container = document.querySelector('[class*="container"]');
      expect(container).toBeInTheDocument();
      expect(container).toHaveTextContent('Container Content');
    });

    it('excludes container when container prop is false', () => {
      render(<Section container={false}>No Container Content</Section>);
      
      const section = screen.getByText('No Container Content').closest('section');
      expect(section).toHaveTextContent('No Container Content');
      
      // Should not have container wrapper
      const container = section?.querySelector('[class*="container"]');
      expect(container).toBeNull();
    });

    it('applies custom max-width when provided', () => {
      render(<Section maxWidth="800px">Custom Width Content</Section>);
      
      const container = document.querySelector('[class*="container"]');
      expect(container).toHaveStyle('max-width: 800px');
    });

    it('applies custom-width class when maxWidth is provided', () => {
      render(<Section maxWidth="600px">Custom Width</Section>);
      
      const container = document.querySelector('[class*="container"]');
      expect(container?.className).toMatch(/container--custom-width/);
    });
  });

  describe('Padding System', () => {
    it('applies large padding by default', () => {
      render(<Section>Default Padding</Section>);
      
      const section = screen.getByText('Default Padding').closest('section');
      expect(section?.className).toMatch(/section--padding-y-lg/);
      expect(section?.className).toMatch(/section--padding-x-lg/);
    });

    it('applies none padding correctly', () => {
      render(<Section paddingY="none" paddingX="none">No Padding</Section>);
      
      const section = screen.getByText('No Padding').closest('section');
      expect(section?.className).toMatch(/section--padding-y-none/);
      expect(section?.className).toMatch(/section--padding-x-none/);
    });

    it('applies small padding correctly', () => {
      render(<Section paddingY="sm" paddingX="sm">Small Padding</Section>);
      
      const section = screen.getByText('Small Padding').closest('section');
      expect(section?.className).toMatch(/section--padding-y-sm/);
      expect(section?.className).toMatch(/section--padding-x-sm/);
    });

    it('applies medium padding correctly', () => {
      render(<Section paddingY="md" paddingX="md">Medium Padding</Section>);
      
      const section = screen.getByText('Medium Padding').closest('section');
      expect(section?.className).toMatch(/section--padding-y-md/);
      expect(section?.className).toMatch(/section--padding-x-md/);
    });

    it('applies extra large padding correctly', () => {
      render(<Section paddingY="xl" paddingX="xl">XL Padding</Section>);
      
      const section = screen.getByText('XL Padding').closest('section');
      expect(section?.className).toMatch(/section--padding-y-xl/);
      expect(section?.className).toMatch(/section--padding-x-xl/);
    });

    it('allows independent vertical and horizontal padding', () => {
      render(<Section paddingY="sm" paddingX="xl">Mixed Padding</Section>);
      
      const section = screen.getByText('Mixed Padding').closest('section');
      expect(section?.className).toMatch(/section--padding-y-sm/);
      expect(section?.className).toMatch(/section--padding-x-xl/);
    });
  });

  describe('Centered Content', () => {
    it('applies centered class when centered prop is true', () => {
      render(<Section centered>Centered Content</Section>);
      
      const section = screen.getByText('Centered Content').closest('section');
      expect(section?.className).toMatch(/section--centered/);
    });

    it('does not apply centered class by default', () => {
      render(<Section>Default Content</Section>);
      
      const section = screen.getByText('Default Content').closest('section');
      expect(section?.className).not.toMatch(/section--centered/);
    });
  });

  describe('HTML Attributes Support', () => {
    it('passes through standard HTML attributes', () => {
      render(
        <Section 
          id="test-section" 
          data-testid="section-element"
          aria-label="Test section"
        >
          Attributed Content
        </Section>
      );
      
      const section = screen.getByTestId('section-element');
      expect(section).toHaveAttribute('id', 'test-section');
      expect(section).toHaveAttribute('aria-label', 'Test section');
    });

    it('supports role attribute', () => {
      render(<Section role="region">Region Content</Section>);
      
      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Complex Prop Combinations', () => {
    it('handles multiple props correctly', () => {
      render(
        <Section
          as="main"
          background="results"
          paddingY="xl"
          paddingX="sm"
          centered
          maxWidth="900px"
          className="complex-section"
          id="complex-test"
        >
          Complex Section Content
        </Section>
      );
      
      const section = screen.getByText('Complex Section Content').closest('main');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('id', 'complex-test');
      expect(section?.className).toMatch(/section--results/);
      expect(section?.className).toMatch(/section--padding-y-xl/);
      expect(section?.className).toMatch(/section--padding-x-sm/);
      expect(section?.className).toMatch(/section--centered/);
      expect(section).toHaveClass('complex-section');
      
      const container = section?.querySelector('[class*="container"]');
      expect(container).toHaveStyle('max-width: 900px');
    });
  });
});

describe('Pre-configured Section Components', () => {
  describe('HeroSection', () => {
    it('renders with hero background', () => {
      render(<HeroSection>Hero Content</HeroSection>);
      
      const section = screen.getByText('Hero Content').closest('section');
      expect(section?.className).toMatch(/section--hero/);
    });

    it('passes through additional props', () => {
      render(<HeroSection paddingY="xl" centered>Hero Props</HeroSection>);
      
      const section = screen.getByText('Hero Props').closest('section');
      expect(section?.className).toMatch(/section--hero/);
      expect(section?.className).toMatch(/section--padding-y-xl/);
      expect(section?.className).toMatch(/section--centered/);
    });
  });

  describe('AboutSection', () => {
    it('renders with about background', () => {
      render(<AboutSection>About Content</AboutSection>);
      
      const section = screen.getByText('About Content').closest('section');
      expect(section?.className).toMatch(/section--about/);
    });
  });

  describe('ResultsSection', () => {
    it('renders with results background', () => {
      render(<ResultsSection>Results Content</ResultsSection>);
      
      const section = screen.getByText('Results Content').closest('section');
      expect(section?.className).toMatch(/section--results/);
    });
  });

  describe('CaseStudiesSection', () => {
    it('renders with case-studies background', () => {
      render(<CaseStudiesSection>Case Studies Content</CaseStudiesSection>);
      
      const section = screen.getByText('Case Studies Content').closest('section');
      expect(section?.className).toMatch(/section--case-studies/);
    });
  });

  describe('HowIWorkSection', () => {
    it('renders with how-i-work background', () => {
      render(<HowIWorkSection>How I Work Content</HowIWorkSection>);
      
      const section = screen.getByText('How I Work Content').closest('section');
      expect(section?.className).toMatch(/section--how-i-work/);
    });
  });

  describe('TechnicalExpertiseSection', () => {
    it('renders with technical-expertise background', () => {
      render(<TechnicalExpertiseSection>Technical Content</TechnicalExpertiseSection>);
      
      const section = screen.getByText('Technical Content').closest('section');
      expect(section?.className).toMatch(/section--technical-expertise/);
    });
  });

  describe('ContactSection', () => {
    it('renders with contact background', () => {
      render(<ContactSection>Contact Content</ContactSection>);
      
      const section = screen.getByText('Contact Content').closest('section');
      expect(section?.className).toMatch(/section--contact/);
    });
  });

  describe('Pre-configured Components Props Inheritance', () => {
    it('all pre-configured components support custom props', () => {
      const components = [
        { Component: HeroSection, name: 'hero' },
        { Component: AboutSection, name: 'about' },
        { Component: ResultsSection, name: 'results' },
        { Component: CaseStudiesSection, name: 'case-studies' },
        { Component: HowIWorkSection, name: 'how-i-work' },
        { Component: TechnicalExpertiseSection, name: 'technical-expertise' },
        { Component: ContactSection, name: 'contact' },
      ];

      components.forEach(({ Component, name }) => {
        render(
          <Component 
            as="div" 
            paddingY="sm" 
            centered 
            className="test-class"
          >
            {name} content
          </Component>
        );
        
        const element = screen.getByText(`${name} content`).closest('div');
        expect(element?.className).toMatch(new RegExp(`section--${name}`));
        expect(element?.className).toMatch(/section--padding-y-sm/);
        expect(element?.className).toMatch(/section--centered/);
        expect(element).toHaveClass('test-class');
      });
    });
  });

  describe('Container Integration', () => {
    it('all pre-configured components include container by default', () => {
      render(<AboutSection>About Container Test</AboutSection>);
      
      const container = document.querySelector('[class*="container"]');
      expect(container).toBeInTheDocument();
      expect(container).toHaveTextContent('About Container Test');
    });

    it('pre-configured components support container=false', () => {
      render(<ResultsSection container={false}>No Container Test</ResultsSection>);
      
      const section = screen.getByText('No Container Test').closest('section');
      const container = section?.querySelector('[class*="container"]');
      expect(container).toBeNull();
    });
  });
});