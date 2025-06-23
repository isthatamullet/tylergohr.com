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

---

This API documentation covers all changes introduced in Phase 4.5. For implementation questions or feature requests, please refer to the GitHub issues or create new feature requests.