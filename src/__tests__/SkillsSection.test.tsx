import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import SkillsSection from "@/components/SkillsSection";

// Mock the hierarchical skills data
jest.mock("@/lib/projects", () => ({
  hierarchicalSkillCategories: [
    {
      name: "Frontend Mastery",
      emoji: "🎯",
      description: "Modern client-side technologies and user experience frameworks",
      color: "var(--portfolio-interactive)",
      subcategories: [
        {
          name: "React Ecosystem",
          description: "Component-based architecture with modern React patterns",
          skills: [
            { name: "React.js", category: "frontend", color: "#61dafb" },
            { name: "TypeScript", category: "frontend", color: "#3178c6" },
          ],
        },
        {
          name: "Modern CSS",
          description: "Cutting-edge styling with animations and responsive design",
          skills: [
            { name: "Tailwind CSS", category: "frontend", color: "#06b6d4" },
          ],
        },
      ],
    },
    {
      name: "Backend Architecture",
      emoji: "⚡",
      description: "Server-side systems, APIs, and microservices architecture",
      color: "var(--portfolio-accent-green)",
      subcategories: [
        {
          name: "Node.js & Express",
          description: "RESTful APIs, middleware, and server architecture",
          skills: [
            { name: "Node.js", category: "backend", color: "#339933" },
            { name: "Express.js", category: "backend", color: "#000000" },
          ],
        },
      ],
    },
  ],
}));

describe("SkillsSection", () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    global.IntersectionObserver = mockIntersectionObserver;
  });

  it("renders section title and updated subtitle", () => {
    render(<SkillsSection />);

    expect(
      screen.getByRole("heading", { name: "Technical Expertise" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Interactive showcase of modern technologies and development expertise",
      ),
    ).toBeInTheDocument();
  });

  it("renders hierarchical skill categories", () => {
    render(<SkillsSection />);

    // Check that skill category cards are present - use heading role to be specific
    expect(screen.getByRole("heading", { name: "Frontend Mastery" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Backend Architecture" })).toBeInTheDocument();
    
    // Check that emojis are rendered (multiple instances due to filters)
    const frontendEmojis = screen.getAllByText("🎯");
    expect(frontendEmojis.length).toBeGreaterThanOrEqual(1); // Filter chip + category icon
    const backendEmojis = screen.getAllByText("⚡");
    expect(backendEmojis.length).toBeGreaterThanOrEqual(1); // Filter chip + category icon
    
    // Check category descriptions
    expect(screen.getByText("Modern client-side technologies and user experience frameworks")).toBeInTheDocument();
    expect(screen.getByText("Server-side systems, APIs, and microservices architecture")).toBeInTheDocument();
  });

  it("displays expandable subcategories", () => {
    render(<SkillsSection />);

    // Check that subcategory buttons are present
    const reactEcosystemButton = screen.getByRole("button", { name: /React Ecosystem/ });
    const nodeExpressButton = screen.getByRole("button", { name: /Node.js & Express/ });
    
    expect(reactEcosystemButton).toBeInTheDocument();
    expect(nodeExpressButton).toBeInTheDocument();
    
    // Check that subcategory descriptions are present
    expect(screen.getByText("Component-based architecture with modern React patterns")).toBeInTheDocument();
    expect(screen.getByText("RESTful APIs, middleware, and server architecture")).toBeInTheDocument();
  });

  it("expands and collapses subcategories when clicked", async () => {
    const user = userEvent.setup();
    render(<SkillsSection />);

    const reactEcosystemButton = screen.getByRole("button", { name: /React Ecosystem/ });
    
    // Initially collapsed - aria-expanded should be false
    expect(reactEcosystemButton).toHaveAttribute("aria-expanded", "false");
    
    // Click to expand
    await user.click(reactEcosystemButton);
    
    // Should be expanded - aria-expanded should be true
    expect(reactEcosystemButton).toHaveAttribute("aria-expanded", "true");
    
    // Click again to collapse
    await user.click(reactEcosystemButton);
    
    // Should be collapsed again
    expect(reactEcosystemButton).toHaveAttribute("aria-expanded", "false");
  });

  it("displays individual skills within subcategories", async () => {
    const user = userEvent.setup();
    render(<SkillsSection />);

    // Expand React Ecosystem subcategory
    const reactEcosystemButton = screen.getByRole("button", { name: /React Ecosystem/ });
    await user.click(reactEcosystemButton);

    // Check for individual skills
    await waitFor(() => {
      expect(screen.getByText("React.js")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
    });

    // Expand Node.js & Express subcategory
    const nodeExpressButton = screen.getByRole("button", { name: /Node.js & Express/ });
    await user.click(nodeExpressButton);

    // Check for backend skills
    await waitFor(() => {
      expect(screen.getByText("Node.js")).toBeInTheDocument();
      expect(screen.getByText("Express.js")).toBeInTheDocument();
    });
  });

  it("has proper accessibility attributes for hierarchical structure", () => {
    render(<SkillsSection />);

    // Check that category regions exist (main section + category cards)
    const categoryRegions = screen.getAllByRole("region");
    expect(categoryRegions.length).toBeGreaterThan(1); // Main section + category cards

    // Check main section has proper labeling (first region should be the main section)
    const mainSection = categoryRegions.find(region => 
      region.getAttribute("aria-labelledby") === "skills-title"
    );
    expect(mainSection).toBeDefined();
    expect(mainSection).toHaveAttribute("aria-labelledby", "skills-title");

    // Check that subcategory expandable buttons have proper ARIA attributes
    const subcategoryButtons = screen.getAllByRole("button").filter(button => 
      button.getAttribute("aria-expanded") !== null
    );
    expect(subcategoryButtons.length).toBeGreaterThan(0);
    subcategoryButtons.forEach(button => {
      expect(button).toHaveAttribute("aria-expanded");
      expect(button).toHaveAttribute("aria-controls");
    });
  });

  it("displays correct summary statistics for hierarchical structure", () => {
    render(<SkillsSection />);

    // Check summary stats by targeting the summary section specifically
    const summarySection = document.querySelector(".skillsSummary");
    expect(summarySection).toBeInTheDocument();
    
    // Check individual stat items within the summary
    expect(summarySection).toHaveTextContent("5+"); // 5 skills total in mock data (2 React + 1 Tailwind + 2 Node)
    expect(summarySection).toHaveTextContent("Technologies");
    expect(summarySection).toHaveTextContent("2");
    expect(summarySection).toHaveTextContent("Skill Categories");
    expect(summarySection).toHaveTextContent("Years Experience");
    expect(summarySection).toHaveTextContent("Major Projects");
  });

  it("handles keyboard navigation for accessibility", async () => {
    const user = userEvent.setup();
    render(<SkillsSection />);

    const expandableButtons = screen.getAllByRole("button");
    expect(expandableButtons.length).toBeGreaterThan(0);

    // Focus on first expandable button
    const firstButton = expandableButtons[0];
    await user.click(firstButton);
    expect(firstButton).toHaveFocus();

    // Test escape key functionality (component should handle this)
    await user.keyboard("{Escape}");
    // The component handles escape to close expanded sections
  });

  it("displays technology counts correctly in category headers", () => {
    render(<SkillsSection />);

    // Check that technology counts are displayed in the category stats
    const skillCounts = screen.getAllByText("Technologies");
    expect(skillCounts.length).toBeGreaterThan(0);

    // Frontend Mastery: 2 skills in React Ecosystem + 1 in Modern CSS = 3 total
    const frontendSection = screen.getByRole("heading", { name: "Frontend Mastery" }).closest("[role='region']");
    expect(frontendSection).toBeInTheDocument();
    expect(frontendSection).toHaveTextContent("3");

    // Backend Architecture: 2 skills in Node.js & Express = 2 total  
    const backendSection = screen.getByRole("heading", { name: "Backend Architecture" }).closest("[role='region']");
    expect(backendSection).toBeInTheDocument();
    expect(backendSection).toHaveTextContent("2");
  });

  it("applies correct data attributes for card animations", () => {
    render(<SkillsSection />);

    // Check that skill cards have proper data attributes for animations
    const categoryCards = document.querySelectorAll("[data-card-id]");
    expect(categoryCards.length).toBe(2); // Frontend Mastery + Backend Architecture

    // Check that cards have expected data attributes
    const frontendCard = document.querySelector("[data-card-id='Frontend Mastery']");
    const backendCard = document.querySelector("[data-card-id='Backend Architecture']");
    
    expect(frontendCard).toBeInTheDocument();
    expect(backendCard).toBeInTheDocument();
  });

});
