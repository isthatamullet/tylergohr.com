import { render, screen, fireEvent } from '@testing-library/react';
import { 
  Card, 
  ResultsCard, 
  CaseStudyCard, 
  TechnicalCard, 
  ProcessCard 
} from '@/app/2/components/ui/Card/Card';

// Mock Framer Motion components
jest.mock('@/app/2/lib/framer-motion-client', () => ({
  ClientMotionDiv: ({ children, onClick, whileHover, whileTap, ...props }: React.PropsWithChildren<{ onClick?: () => void; whileHover?: unknown; whileTap?: unknown; [key: string]: unknown }>) => (
    <div 
      onClick={onClick} 
      data-motion="true"
      data-while-hover={JSON.stringify(whileHover)}
      data-while-tap={JSON.stringify(whileTap)}
      {...props}
    >
      {children}
    </div>
  ),
}));

describe('Base Card Component', () => {
  describe('Basic Rendering', () => {
    it('renders card with required variant prop', () => {
      render(<Card variant="results">Test Card Content</Card>);
      
      const card = screen.getByText('Test Card Content');
      expect(card).toBeInTheDocument();
    });

    it('applies correct variant class', () => {
      render(<Card variant="case-study">Case Study Card</Card>);
      
      const cardWrapper = screen.getByText('Case Study Card').parentElement;
      expect(cardWrapper).toHaveClass(expect.stringContaining('card--case-study'));
    });

    it('applies medium size by default', () => {
      render(<Card variant="technical">Technical Card</Card>);
      
      const cardWrapper = screen.getByText('Technical Card').parentElement;
      expect(cardWrapper).toHaveClass(expect.stringContaining('card--md'));
    });

    it('applies custom className', () => {
      render(<Card variant="process" className="custom-card">Process Card</Card>);
      
      const cardWrapper = screen.getByText('Process Card').parentElement;
      expect(cardWrapper).toHaveClass('custom-card');
    });
  });

  describe('Size Variants', () => {
    it('applies small size correctly', () => {
      render(<Card variant="results" size="sm">Small Card</Card>);
      
      const cardWrapper = screen.getByText('Small Card').parentElement;
      expect(cardWrapper).toHaveClass(expect.stringContaining('card--sm'));
    });

    it('applies large size correctly', () => {
      render(<Card variant="results" size="lg">Large Card</Card>);
      
      const cardWrapper = screen.getByText('Large Card').parentElement;
      expect(cardWrapper).toHaveClass(expect.stringContaining('card--lg'));
    });

    it('applies extra large size correctly', () => {
      render(<Card variant="results" size="xl">XL Card</Card>);
      
      const cardWrapper = screen.getByText('XL Card').parentElement;
      expect(cardWrapper).toHaveClass(expect.stringContaining('card--xl'));
    });
  });

  describe('Interactive Cards', () => {
    it('renders as interactive when interactive prop is true', () => {
      const handleClick = jest.fn();
      render(
        <Card variant="case-study" interactive onClick={handleClick}>
          Interactive Card
        </Card>
      );
      
      const cardWrapper = screen.getByText('Interactive Card').parentElement;
      expect(cardWrapper).toHaveClass(expect.stringContaining('card--interactive'));
      expect(cardWrapper).toHaveAttribute('data-motion', 'true');
    });

    it('handles click events on interactive cards', () => {
      const handleClick = jest.fn();
      render(
        <Card variant="case-study" interactive onClick={handleClick}>
          Clickable Card
        </Card>
      );
      
      const cardWrapper = screen.getByText('Clickable Card').parentElement;
      fireEvent.click(cardWrapper!);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not render as interactive by default', () => {
      render(<Card variant="results">Static Card</Card>);
      
      const cardWrapper = screen.getByText('Static Card').parentElement;
      expect(cardWrapper).not.toHaveClass(expect.stringContaining('card--interactive'));
      expect(cardWrapper).toHaveAttribute('data-motion', 'true'); // Still wrapped but not interactive
    });
  });

  describe('Glassmorphism Effect', () => {
    it('applies glassmorphism class when prop is true', () => {
      render(<Card variant="technical" glassmorphism>Glassmorphism Card</Card>);
      
      const cardWrapper = screen.getByText('Glassmorphism Card').parentElement;
      expect(cardWrapper).toHaveClass(expect.stringContaining('card--glassmorphism'));
    });

    it('does not apply glassmorphism by default', () => {
      render(<Card variant="technical">Regular Card</Card>);
      
      const cardWrapper = screen.getByText('Regular Card').parentElement;
      expect(cardWrapper).not.toHaveClass(expect.stringContaining('card--glassmorphism'));
    });
  });

  describe('Loading State', () => {
    it('renders loading overlay when loading prop is true', () => {
      render(<Card variant="results" loading>Loading Card</Card>);
      
      const loadingOverlay = document.querySelector('[class*="loadingOverlay"]');
      expect(loadingOverlay).toBeInTheDocument();
      
      const spinner = document.querySelector('[class*="spinner"]');
      expect(spinner).toBeInTheDocument();
    });

    it('applies loading class when loading', () => {
      render(<Card variant="results" loading>Loading Card</Card>);
      
      const cardWrapper = screen.getByText('Loading Card').parentElement;
      expect(cardWrapper).toHaveClass(expect.stringContaining('card--loading'));
    });

    it('does not render loading overlay by default', () => {
      render(<Card variant="results">Normal Card</Card>);
      
      const loadingOverlay = document.querySelector('[class*="loadingOverlay"]');
      expect(loadingOverlay).toBeNull();
    });
  });

  describe('HTML Attributes Support', () => {
    it('passes through standard HTML attributes', () => {
      render(
        <Card 
          variant="results" 
          id="test-card" 
          data-testid="card-element"
          aria-label="Test card"
        >
          Attributed Card
        </Card>
      );
      
      const cardWrapper = screen.getByTestId('card-element');
      expect(cardWrapper).toHaveAttribute('id', 'test-card');
      expect(cardWrapper).toHaveAttribute('aria-label', 'Test card');
    });
  });
});

describe('ResultsCard Component', () => {
  describe('Basic Rendering', () => {
    it('renders with value and label', () => {
      render(<ResultsCard value="42" label="Success Rate" />);
      
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('Success Rate')).toBeInTheDocument();
    });

    it('renders with subtitle when provided', () => {
      render(<ResultsCard value="$2M" label="Cost Savings" subtitle="Annual reduction" />);
      
      expect(screen.getByText('$2M')).toBeInTheDocument();
      expect(screen.getByText('Cost Savings')).toBeInTheDocument();
      expect(screen.getByText('Annual reduction')).toBeInTheDocument();
    });

    it('renders with icon when provided', () => {
      const icon = <span data-testid="test-icon">📊</span>;
      render(<ResultsCard value="96%" label="Delivery Rate" icon={icon} />);
      
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByText('96%')).toBeInTheDocument();
    });
  });

  describe('Trend Indicators', () => {
    it('renders up trend correctly', () => {
      render(<ResultsCard value="150%" label="Efficiency" trend="up" change="+50%" />);
      
      const trendElement = document.querySelector('[class*="trend--up"]');
      expect(trendElement).toBeInTheDocument();
      expect(trendElement).toHaveTextContent('↗ +50%');
    });

    it('renders down trend correctly', () => {
      render(<ResultsCard value="32%" label="Errors" trend="down" change="-68%" />);
      
      const trendElement = document.querySelector('[class*="trend--down"]');
      expect(trendElement).toBeInTheDocument();
      expect(trendElement).toHaveTextContent('↘ -68%');
    });

    it('renders neutral trend correctly', () => {
      render(<ResultsCard value="100%" label="Uptime" trend="neutral" change="0%" />);
      
      const trendElement = document.querySelector('[class*="trend--neutral"]');
      expect(trendElement).toBeInTheDocument();
      expect(trendElement).toHaveTextContent('→ 0%');
    });

    it('does not render trend when not provided', () => {
      render(<ResultsCard value="50" label="Projects" />);
      
      const trendElement = document.querySelector('[class*="resultsCardTrend"]');
      expect(trendElement).toBeNull();
    });
  });
});

describe('CaseStudyCard Component', () => {
  describe('Basic Rendering', () => {
    it('renders with title and description', () => {
      render(
        <CaseStudyCard 
          title="Content Platform Revolution" 
          description="Architected Fox Corporation's content distribution system"
        />
      );
      
      expect(screen.getByText('Content Platform Revolution')).toBeInTheDocument();
      expect(screen.getByText("Architected Fox Corporation's content distribution system")).toBeInTheDocument();
    });

    it('renders as interactive by default', () => {
      render(<CaseStudyCard title="Test Project" description="Test description" />);
      
      const cardWrapper = screen.getByText('Test Project').closest('[data-motion="true"]');
      expect(cardWrapper).toBeInTheDocument();
    });

    it('includes default CTA text', () => {
      render(<CaseStudyCard title="Test" description="Test" />);
      
      expect(screen.getByText('Learn More →')).toBeInTheDocument();
    });

    it('uses custom CTA text when provided', () => {
      render(<CaseStudyCard title="Test" description="Test" ctaText="View Details" />);
      
      expect(screen.getByText('View Details →')).toBeInTheDocument();
    });
  });

  describe('Badge System', () => {
    it('renders Emmy badge correctly', () => {
      const badge = { label: 'Award', value: 'Emmy Winner', type: 'emmy' as const };
      render(<CaseStudyCard title="Test" description="Test" badge={badge} />);
      
      const badgeElement = document.querySelector('[class*="badge--emmy"]');
      expect(badgeElement).toBeInTheDocument();
      expect(badgeElement).toHaveTextContent('Award Emmy Winner');
    });

    it('renders savings badge correctly', () => {
      const badge = { label: 'Saved', value: '$2M+', type: 'savings' as const };
      render(<CaseStudyCard title="Test" description="Test" badge={badge} />);
      
      const badgeElement = document.querySelector('[class*="badge--savings"]');
      expect(badgeElement).toBeInTheDocument();
      expect(badgeElement).toHaveTextContent('Saved $2M+');
    });

    it('renders success badge correctly', () => {
      const badge = { label: 'Rate', value: '96%', type: 'success' as const };
      render(<CaseStudyCard title="Test" description="Test" badge={badge} />);
      
      const badgeElement = document.querySelector('[class*="badge--success"]');
      expect(badgeElement).toBeInTheDocument();
    });

    it('renders innovation badge correctly', () => {
      const badge = { label: 'Innovation', value: 'AI-Powered', type: 'innovation' as const };
      render(<CaseStudyCard title="Test" description="Test" badge={badge} />);
      
      const badgeElement = document.querySelector('[class*="badge--innovation"]');
      expect(badgeElement).toBeInTheDocument();
    });
  });

  describe('Technologies Display', () => {
    it('renders technology tags when provided', () => {
      const technologies = ['React', 'Node.js', 'PostgreSQL'];
      render(<CaseStudyCard title="Test" description="Test" technologies={technologies} />);
      
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
    });

    it('does not render tech section when technologies not provided', () => {
      render(<CaseStudyCard title="Test" description="Test" />);
      
      const techSection = document.querySelector('[class*="caseStudyCardTech"]');
      expect(techSection).toBeNull();
    });
  });

  describe('Image Support', () => {
    it('renders image when provided', () => {
      const image = <div data-testid="case-study-image" role="img" aria-label="Test image" />;
      render(<CaseStudyCard title="Test" description="Test" image={image} />);
      
      expect(screen.getByTestId('case-study-image')).toBeInTheDocument();
    });
  });
});

describe('TechnicalCard Component', () => {
  describe('Basic Rendering', () => {
    it('renders with category and skills', () => {
      const skills = ['TypeScript', 'React', 'Next.js'];
      render(<TechnicalCard category="Frontend Development" skills={skills} />);
      
      expect(screen.getByText('Frontend Development')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Next.js')).toBeInTheDocument();
    });

    it('applies glassmorphism by default', () => {
      render(<TechnicalCard category="Test" skills={['Skill1']} />);
      
      const cardWrapper = screen.getByText('Test').closest('[class*="card--glassmorphism"]');
      expect(cardWrapper).toBeInTheDocument();
    });

    it('renders with experience when provided', () => {
      render(<TechnicalCard category="Backend" skills={['Node.js']} experience="5+ years" />);
      
      expect(screen.getByText('5+ years')).toBeInTheDocument();
    });

    it('renders current example when provided', () => {
      render(
        <TechnicalCard 
          category="DevOps" 
          skills={['Docker']} 
          currentExample="Portfolio deployment on Google Cloud Run"
        />
      );
      
      expect(screen.getByText(/Portfolio deployment on Google Cloud Run/)).toBeInTheDocument();
    });
  });

  describe('Mobile Expand/Collapse', () => {
    it('renders toggle button when onToggle is provided', () => {
      const handleToggle = jest.fn();
      render(
        <TechnicalCard 
          category="Mobile Dev" 
          skills={['Flutter']} 
          onToggle={handleToggle}
        />
      );
      
      const toggleButton = document.querySelector('[class*="technicalCardToggle"]');
      expect(toggleButton).toBeInTheDocument();
    });

    it('handles toggle click events', () => {
      const handleToggle = jest.fn();
      render(
        <TechnicalCard 
          category="Mobile Dev" 
          skills={['Flutter']} 
          onToggle={handleToggle}
        />
      );
      
      const cardWrapper = screen.getByText('Mobile Dev').closest('[data-motion="true"]');
      fireEvent.click(cardWrapper!);
      
      expect(handleToggle).toHaveBeenCalledTimes(1);
    });

    it('applies expanded toggle styling when expanded', () => {
      render(
        <TechnicalCard 
          category="Test" 
          skills={['Test']} 
          expanded 
          onToggle={() => {}}
        />
      );
      
      const toggle = document.querySelector('[class*="toggle--expanded"]');
      expect(toggle).toBeInTheDocument();
    });

    it('applies expanded skills styling when expanded', () => {
      render(
        <TechnicalCard 
          category="Test" 
          skills={['Test']} 
          expanded 
          onToggle={() => {}}
        />
      );
      
      const skills = document.querySelector('[class*="skills--expanded"]');
      expect(skills).toBeInTheDocument();
    });

    it('shows current example when expanded', () => {
      render(
        <TechnicalCard 
          category="Test" 
          skills={['Test']} 
          currentExample="Test example"
          expanded 
          onToggle={() => {}}
        />
      );
      
      expect(screen.getByText(/Test example/)).toBeInTheDocument();
    });

    it('shows current example when no toggle handler', () => {
      render(
        <TechnicalCard 
          category="Test" 
          skills={['Test']} 
          currentExample="Always visible example"
        />
      );
      
      expect(screen.getByText(/Always visible example/)).toBeInTheDocument();
    });
  });

  describe('Icon Support', () => {
    it('renders icon when provided', () => {
      const icon = <span data-testid="tech-icon">🚀</span>;
      render(<TechnicalCard category="Test" skills={['Test']} icon={icon} />);
      
      expect(screen.getByTestId('tech-icon')).toBeInTheDocument();
    });
  });
});

describe('ProcessCard Component', () => {
  describe('Basic Rendering', () => {
    it('renders with step number, title, and description', () => {
      render(
        <ProcessCard 
          step={1} 
          title="Planning Phase" 
          description="Comprehensive project analysis and requirement gathering"
        />
      );
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('Planning Phase')).toBeInTheDocument();
      expect(screen.getByText('Comprehensive project analysis and requirement gathering')).toBeInTheDocument();
    });

    it('renders with duration when provided', () => {
      render(
        <ProcessCard 
          step={2} 
          title="Development" 
          description="Implementation phase" 
          duration="2-4 weeks"
        />
      );
      
      expect(screen.getByText('⏱ 2-4 weeks')).toBeInTheDocument();
    });

    it('renders visual element when provided', () => {
      const visual = <span data-testid="process-visual">📋</span>;
      render(
        <ProcessCard 
          step={1} 
          title="Test" 
          description="Test" 
          visual={visual}
        />
      );
      
      expect(screen.getByTestId('process-visual')).toBeInTheDocument();
    });
  });

  describe('Tools Display', () => {
    it('renders tool tags when provided', () => {
      const tools = ['Figma', 'GitHub', 'VS Code'];
      render(
        <ProcessCard 
          step={1} 
          title="Design" 
          description="UI/UX design phase" 
          tools={tools}
        />
      );
      
      expect(screen.getByText('Figma')).toBeInTheDocument();
      expect(screen.getByText('GitHub')).toBeInTheDocument();
      expect(screen.getByText('VS Code')).toBeInTheDocument();
    });

    it('does not render tools section when not provided', () => {
      render(<ProcessCard step={1} title="Test" description="Test" />);
      
      const toolsSection = document.querySelector('[class*="processCardTools"]');
      expect(toolsSection).toBeNull();
    });
  });

  describe('Step Number Styling', () => {
    it('renders step number in styled circle', () => {
      render(<ProcessCard step={5} title="Test" description="Test" />);
      
      const stepElement = document.querySelector('[class*="processCardStep"]');
      expect(stepElement).toBeInTheDocument();
      expect(stepElement).toHaveTextContent('5');
    });
  });
});

describe('Card Component Integration', () => {
  describe('Prop Inheritance', () => {
    it('all specialized cards inherit base card props', () => {
      const props = {
        size: 'lg' as const,
        className: 'test-class',
        id: 'test-id'
      };

      // Test ResultsCard
      render(<ResultsCard {...props} value="test" label="test" />);
      let element = screen.getByText('test').closest('#test-id');
      expect(element).toHaveClass(expect.stringContaining('card--lg'), 'test-class');

      // Test CaseStudyCard
      render(<CaseStudyCard {...props} title="title" description="desc" />);
      element = screen.getByText('title').closest('#test-id');
      expect(element).toHaveClass(expect.stringContaining('card--lg'), 'test-class');

      // Test TechnicalCard
      render(<TechnicalCard {...props} category="cat" skills={['skill']} />);
      element = screen.getByText('cat').closest('#test-id');
      expect(element).toHaveClass(expect.stringContaining('card--lg'), 'test-class');

      // Test ProcessCard
      render(<ProcessCard {...props} step={1} title="proc" description="desc" />);
      element = screen.getByText('proc').closest('#test-id');
      expect(element).toHaveClass(expect.stringContaining('card--lg'), 'test-class');
    });
  });

  describe('Loading State Support', () => {
    it('all card variants support loading state', () => {
      const components = [
        () => <ResultsCard loading value="test" label="test" />,
        () => <CaseStudyCard loading title="test" description="test" />,
        () => <TechnicalCard loading category="test" skills={['test']} />,
        () => <ProcessCard loading step={1} title="test" description="test" />
      ];

      components.forEach((Component, index) => {
        render(<Component key={index} />);
        
        const loadingOverlay = document.querySelector('[class*="loadingOverlay"]');
        expect(loadingOverlay).toBeInTheDocument();
      });
    });
  });
});