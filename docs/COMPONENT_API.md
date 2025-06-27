# Component API Documentation - Phase 4.5 Enhancements

## Overview

This document outlines the new APIs and component changes introduced in Phase 4.5, including category filtering functionality and skill relationship indicators for the Technical Expertise section.

## New TypeScript Interfaces

### SkillsFilter

Interface for managing skills section filtering state.

```typescript
interface SkillsFilter {
  categories?: string[];
  technologyTypes?: ("frontend" | "backend" | "database" | "cloud" | "tool")[];
}
```

**Properties:**
- `categories` - Optional array of category names to filter by (e.g., ["Frontend Mastery", "Backend Architecture"])
- `technologyTypes` - Optional array of technology types to filter by

**Usage:**
```typescript
const [filter, setFilter] = useState<SkillsFilter>({});

// Filter by category
setFilter({ categories: ["Frontend Mastery"] });

// Filter by technology type
setFilter({ technologyTypes: ["frontend", "backend"] });

// Combined filtering
setFilter({ 
  categories: ["Frontend Mastery"], 
  technologyTypes: ["frontend"] 
});
```

### SkillsFilterState

Complete state management interface for filter functionality.

```typescript
interface SkillsFilterState {
  filter: SkillsFilter;
  setFilter: (filter: SkillsFilter) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}
```

**Properties:**
- `filter` - Current filter state
- `setFilter` - Function to update filter state
- `clearFilters` - Function to reset all filters
- `hasActiveFilters` - Boolean indicating if any filters are active

## Component APIs

### SkillsSection (Enhanced)

Main skills section component with new filtering and relationship capabilities.

**New State Properties:**
```typescript
const [filter, setFilter] = useState<SkillsFilter>({});
const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
const [relatedSkills, setRelatedSkills] = useState<Set<string>>(new Set());
```

**New Methods:**
- `handleFilterChange(newFilter: SkillsFilter)` - Updates filter state
- `clearFilters()` - Resets all filters to empty state
- `handleSkillHover(skillName: string | null)` - Manages skill relationship highlighting

**Filter Logic:**
- **Category Filtering**: Filters hierarchical categories by exact name match
- **Technology Type Filtering**: Filters categories containing skills of specified types
- **Combined Filtering**: Both category and technology type filters can be active simultaneously

**Relationship Logic:**
- **Bidirectional Detection**: When skill A relates to skill B, hovering A highlights B
- **Cross-Category Support**: Relationships work across different skill categories
- **Performance Optimized**: Uses Set data structure for O(1) lookup times

### SkillsFilterComponent (New)

Glassmorphism filter interface with category and technology type chips.

**Props Interface:**
```typescript
interface SkillsFilterProps {
  filter: SkillsFilter;
  onFilterChange: (filter: SkillsFilter) => void;
  onClearFilters: () => void;
}
```

**Properties:**
- `filter` - Current filter state to display
- `onFilterChange` - Callback when filter state changes
- `onClearFilters` - Callback to clear all filters

**Features:**
- **Category Chips**: Visual chips for each skill category with emoji and color theming
- **Technology Type Chips**: Chips for frontend, backend, database, cloud, and tool categories
- **Active State Management**: Visual feedback for active filters with `aria-pressed` attributes
- **Mobile Optimization**: 44px+ touch targets with proper spacing
- **Accessibility**: Full ARIA support with screen reader descriptions

**Usage Example:**
```typescript
<SkillsFilterComponent
  filter={filter}
  onFilterChange={handleFilterChange}
  onClearFilters={clearFilters}
/>
```

### ExpandableSkillCard (Enhanced)

Enhanced skill card component with relationship highlighting support.

**New Props:**
```typescript
interface ExpandableSkillCardProps {
  // ... existing props
  hoveredSkill?: string | null;
  relatedSkills?: Set<string>;
  onSkillHover?: (skillName: string | null) => void;
}
```

**New Properties:**
- `hoveredSkill` - Currently hovered skill name for highlighting
- `relatedSkills` - Set of skill names that are related to the hovered skill
- `onSkillHover` - Callback when skill is hovered/unhovered

**Visual States:**
- `.hovered` - Applied to the skill being directly hovered
- `.related` - Applied to skills related to the hovered skill
- `.dimmed` - Applied to unrelated skills when relationship highlighting is active

**Relationship Features:**
- **Hover Detection**: Mouse enter/leave events trigger relationship highlighting
- **Touch Support**: Optimized for touch devices with proper event handling
- **Performance**: Hardware-accelerated animations with 60fps targeting
- **Accessibility**: Maintains focus management and screen reader support

## Enhanced Data Structure

### Skill Tooltip Enhancements

All skills in `lib/projects.ts` now include enhanced tooltip data with relationship information:

```typescript
interface SkillTooltip {
  context: string;
  useCases: string[];
  experience: string;
  keyFeatures: string[];
  relatedTech: string[]; // New: Array of related technology names
}
```

**Example Enhancement:**
```typescript
react: {
  name: "React.js",
  category: "frontend",
  color: "#61dafb",
  tooltip: {
    context: "Component-based UI library...",
    useCases: ["Invoice Chaser dashboard", "Interactive components"],
    experience: "3+ years building production React applications...",
    keyFeatures: ["Virtual DOM", "Component reusability"],
    relatedTech: ["TypeScript", "Zustand", "Framer Motion"] // NEW
  }
}
```

## Breaking Changes

### None

All changes are backward compatible:
- New props are optional with sensible defaults
- Existing components continue to work without modification
- Enhanced data structures use optional properties

## Performance Considerations

### Filtering Performance
- **O(n) filtering complexity** where n = number of categories
- **Optimized with early returns** for better performance
- **Memoization opportunities**: Consider `useMemo` for large datasets

### Relationship Highlighting Performance
- **Hardware-accelerated CSS animations** for smooth 60fps performance
- **Set-based lookups** for O(1) relationship checking
- **Debounced hover events** to prevent excessive re-renders
- **Reduced motion support** for accessibility compliance

### Memory Usage
- **Efficient Set usage** for related skills tracking
- **Cleanup on unmount** for event listeners and timeouts
- **Optimized re-renders** with proper dependency arrays

## Usage Examples

### Basic Filter Implementation
```typescript
function MySkillsSection() {
  const [filter, setFilter] = useState<SkillsFilter>({});
  
  return (
    <div>
      <SkillsFilterComponent
        filter={filter}
        onFilterChange={setFilter}
        onClearFilters={() => setFilter({})}
      />
      <SkillsSection filter={filter} />
    </div>
  );
}
```

### Advanced Relationship Tracking
```typescript
function AdvancedSkillsSection() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [relatedSkills, setRelatedSkills] = useState<Set<string>>(new Set());
  
  const handleSkillHover = useCallback((skillName: string | null) => {
    setHoveredSkill(skillName);
    
    if (skillName) {
      const related = getRelatedSkills(skillName);
      setRelatedSkills(new Set(related));
    } else {
      setRelatedSkills(new Set());
    }
  }, []);
  
  return (
    <ExpandableSkillCard
      hoveredSkill={hoveredSkill}
      relatedSkills={relatedSkills}
      onSkillHover={handleSkillHover}
      // ... other props
    />
  );
}
```

## Migration Guide

### For Existing SkillsSection Usage
No changes required - all enhancements are backward compatible.

### For Custom Filter Implementations
Replace custom filtering with new SkillsFilterComponent:

```typescript
// Before (custom implementation)
<CustomFilterComponent onFilter={handleCustomFilter} />

// After (new standardized component)
<SkillsFilterComponent
  filter={filter}
  onFilterChange={handleFilterChange}
  onClearFilters={clearFilters}
/>
```

### For Skill Data Extensions
Add relationship data to skill tooltips:

```typescript
// Add to existing skill definitions
relatedTech: ["TechnologyName1", "TechnologyName2"]
```

## Accessibility Features

### Filter Component
- **ARIA Pressed**: Filter chips use `aria-pressed` for state
- **ARIA Describedby**: Help text associated with each filter
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: Comprehensive labeling and descriptions

### Relationship Highlighting  
- **Reduced Motion**: Respects `prefers-reduced-motion` settings
- **Color Independence**: Uses multiple visual cues beyond color
- **Focus Management**: Maintains logical focus order during interactions
- **WCAG 2.1 AA Compliance**: Meets accessibility standards

## Development Notes

### CSS Variables Used
- `--portfolio-interactive` - Interactive element color
- `--portfolio-accent-green` - Success/backend color  
- `--portfolio-accent-red` - Error/database color
- `--portfolio-text-primary` - Primary text color
- `--portfolio-text-secondary` - Secondary text color

### Animation Performance
All animations use `transform` and `opacity` properties for optimal performance with hardware acceleration enabled via `will-change` and `transform3d`.

### Browser Support
- **Modern browsers**: Full feature support
- **Legacy browsers**: Graceful degradation with fallback styles
- **Mobile browsers**: Optimized touch interactions and performance

## 🌐 **Browser Tab Interface Components** ✅ **NEW DESIGN SYSTEM**

### BrowserTabs Component

Interactive browser simulation component for Case Studies and Technical Expertise detail pages.

**Props Interface:**
```typescript
interface BrowserTabsProps {
  tabs: TabData[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  showBrowserChrome?: boolean;
}

interface TabData {
  id: string;
  label: string;
  badge: BadgeData;
  content: React.ReactNode;
  type: 'savings' | 'success' | 'innovation' | 'emmy';
}

interface BadgeData {
  value: string;
  label: string;
  type: 'savings' | 'success' | 'innovation' | 'emmy';
}
```

**Properties:**
- `tabs` - Array of tab data with content and badge information
- `defaultTab` - Optional ID of tab to show on initial load (defaults to first tab)
- `onTabChange` - Optional callback when active tab changes
- `className` - Optional CSS class for styling customization
- `showBrowserChrome` - Optional boolean to show/hide browser chrome (defaults to true)

**State Management:**
```typescript
const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id);
const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
```

**Key Features:**
- **Browser Chrome**: Realistic window controls (close, minimize, maximize)
- **Tab Color System**: Green → Blue → Purple → Gold matching badge colors
- **Smooth Transitions**: 400ms content fade with cubic-bezier easing
- **Touch Optimization**: 44px+ touch targets for mobile accessibility
- **Keyboard Navigation**: Full arrow key support and Enter/Space activation
- **Screen Reader Support**: Proper ARIA tabpanel/tab relationships

**Usage Example:**
```typescript
import { BrowserTabs, TabData } from '@/components/BrowserTabs';

const caseStudyTabs: TabData[] = [
  {
    id: 'cost-savings',
    label: 'Content Distribution Platform Revolution',
    badge: { value: '$2M+', label: 'Cost Savings', type: 'savings' },
    content: <CaseStudyContent study={caseStudies[0]} />,
    type: 'savings'
  },
  // ... more tabs
];

<BrowserTabs 
  tabs={caseStudyTabs}
  defaultTab="cost-savings"
  onTabChange={(tabId) => analytics.track('tab_viewed', { tabId })}
  className="case-studies-browser"
/>
```

### BrowserChrome Component

Realistic browser window chrome with controls and address bar.

**Props Interface:**
```typescript
interface BrowserChromeProps {
  title?: string;
  url?: string;
  className?: string;
}
```

**Properties:**
- `title` - Optional window title (defaults to "Tyler Gohr Portfolio")
- `url` - Optional URL to display in address bar
- `className` - Optional CSS class for customization

**Features:**
- **Window Controls**: Functional close, minimize, maximize buttons
- **Address Bar**: Realistic URL display with SSL indicator
- **Responsive**: Adapts to mobile with simplified chrome

### TabContent Component

Content container with transition animations for tab panels.

**Props Interface:**
```typescript
interface TabContentProps {
  isActive: boolean;
  content: React.ReactNode;
  tabId: string;
  className?: string;
}
```

**Properties:**
- `isActive` - Boolean indicating if this tab content should be visible
- `content` - React content to render inside the tab panel
- `tabId` - Unique identifier for accessibility attributes
- `className` - Optional CSS class for styling

**Animation Features:**
- **Fade Transition**: Smooth opacity and transform animations
- **Performance Optimized**: Hardware-accelerated with proper `will-change`
- **Reduced Motion**: Respects user preference for reduced motion
- **Height Management**: Dynamic height adjustment for content changes

## Performance Considerations

### Browser Tab Interface
- **Lazy Loading**: Only renders active tab content to reduce initial bundle
- **Animation Performance**: Uses transform/opacity for 60fps animations
- **Memory Efficiency**: Cleanup of inactive tab resources
- **Bundle Impact**: ~15KB gzipped for complete browser interface

### Accessibility Features
- **WCAG 2.1 AA Compliance**: Full accessibility standard adherence
- **Keyboard Navigation**: Arrow keys, Enter, Space, Home, End support
- **Screen Reader Support**: Proper ARIA roles and live regions
- **Focus Management**: Logical focus order and visual indicators
- **Touch Optimization**: 44px minimum touch targets on mobile

### Mobile Optimization Strategy
- **Responsive Tabs**: Horizontal scrolling on small screens
- **Touch Gestures**: Optional swipe between tabs (configurable)
- **Simplified Chrome**: Reduced browser controls on mobile
- **Performance**: Optimized animations for mobile devices

## Integration Examples

### Case Studies Implementation
```typescript
// src/app/2/case-studies/page.tsx
import { BrowserTabs } from '@/components/BrowserTabs';
import { caseStudiesData } from '@/data/caseStudies';

export default function CaseStudiesPage() {
  const tabs = caseStudiesData.map(study => ({
    id: study.id,
    label: study.title,
    badge: study.badge,
    content: <CaseStudyContent study={study} />,
    type: study.badge.type
  }));

  return (
    <Section background="case-studies" className={styles.compactHero}>
      <div className={styles.heroContainer}>
        <header className={styles.heroHeader}>
          <h1>Case Studies</h1>
          <p>Deep-dive into strategic technical leadership...</p>
        </header>
        
        <BrowserTabs 
          tabs={tabs}
          defaultTab="content-distribution-platform"
          className={styles.caseStudiesBrowser}
        />
      </div>
    </Section>
  );
}
```

### Technical Expertise Implementation
```typescript
// src/app/2/technical-expertise/page.tsx - Future implementation
const techExpertiseTabs = [
  {
    id: 'frontend-mastery',
    label: 'Frontend Architecture',
    badge: { value: 'React', label: 'Primary', type: 'innovation' },
    content: <TechCategory category="frontend" />,
    type: 'innovation'
  },
  // ... more technical categories
];
```

## CSS Integration

### Required CSS Variables
```css
/* Add to brand-tokens.css or component styles */
--browser-chrome-bg: linear-gradient(135deg, #f1f3f4 0%, #e8eaed 100%);
--browser-content-bg: #ffffff;
--tab-border-color: #e1e4e8;
--tab-active-bg: #ffffff;
--tab-hover-bg: rgba(255, 255, 255, 0.6);

/* Tab type colors - matches existing badge system */
--tab-savings-color: #22c55e;
--tab-success-color: #3b82f6;  
--tab-innovation-color: #a855f7;
--tab-emmy-color: #fbbf24;
```

### Component Styling Classes
```css
.browserContainer { /* Main container */ }
.browserChrome { /* Window chrome styling */ }
.tabBar { /* Tab bar container */ }
.tab { /* Individual tab styling */ }
.tab--active { /* Active tab state */ }
.tab--savings { /* Green tab variant */ }
.tab--success { /* Blue tab variant */ }
.tab--innovation { /* Purple tab variant */ }
.tab--emmy { /* Gold tab variant */ }
.browserContent { /* Content area */ }
.contentTransition { /* Animation classes */ }
```

---

This API documentation covers all components in the Browser Tab Interface system, introduced as part of the Interactive Component Patterns design system. For implementation questions or feature requests, please refer to the GitHub issues or create new feature requests.