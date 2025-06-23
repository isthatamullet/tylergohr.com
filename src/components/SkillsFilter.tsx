"use client";

import { SkillsFilter } from "@/lib/types";
import { hierarchicalSkillCategories } from "@/lib/projects";
import styles from "./SkillsFilter.module.css";

interface SkillsFilterProps {
  filter: SkillsFilter;
  onFilterChange: (filter: SkillsFilter) => void;
  onClearFilters: () => void;
}

export default function SkillsFilterComponent({
  filter,
  onFilterChange,
  onClearFilters,
}: SkillsFilterProps) {
  // Get available categories and technology types
  const categories = hierarchicalSkillCategories.map((cat) => ({
    name: cat.name,
    color: cat.color,
    emoji: cat.emoji,
  }));

  const technologyTypes = [
    { id: "frontend", label: "Frontend", color: "var(--portfolio-interactive)" },
    { id: "backend", label: "Backend", color: "var(--portfolio-accent-green)" },
    { id: "database", label: "Database", color: "var(--portfolio-accent-red)" },
    { id: "cloud", label: "Cloud", color: "var(--portfolio-text-secondary)" },
    { id: "tool", label: "Tools", color: "var(--portfolio-text-primary)" },
  ] as const;

  const toggleCategory = (categoryName: string) => {
    const currentCategories = filter.categories || [];
    const newCategories = currentCategories.includes(categoryName)
      ? currentCategories.filter((cat) => cat !== categoryName)
      : [...currentCategories, categoryName];

    onFilterChange({
      ...filter,
      categories: newCategories.length > 0 ? newCategories : undefined,
    });
  };

  const toggleTechnologyType = (type: "frontend" | "backend" | "database" | "cloud" | "tool") => {
    const currentTypes = filter.technologyTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];

    onFilterChange({
      ...filter,
      technologyTypes: newTypes.length > 0 ? newTypes : undefined,
    });
  };

  const hasActiveFilters = 
    (filter.categories && filter.categories.length > 0) ||
    (filter.technologyTypes && filter.technologyTypes.length > 0);

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Filter by Category</h3>
        <div className={styles.filterChips} role="group" aria-label="Category filters">
          {categories.map((category) => (
            <button
              key={category.name}
              type="button"
              className={`${styles.filterChip} ${
                filter.categories?.includes(category.name) ? styles.active : ""
              }`}
              onClick={() => toggleCategory(category.name)}
              style={
                {
                  "--chip-color": category.color,
                } as React.CSSProperties
              }
              aria-pressed={filter.categories?.includes(category.name) || false}
              aria-describedby={`category-${category.name.replace(/\s+/g, "-").toLowerCase()}-help`}
            >
              <span className={styles.chipEmoji} aria-hidden="true">
                {category.emoji}
              </span>
              <span className={styles.chipLabel}>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Filter by Technology Type</h3>
        <div className={styles.filterChips} role="group" aria-label="Technology type filters">
          {technologyTypes.map((techType) => (
            <button
              key={techType.id}
              type="button"
              className={`${styles.filterChip} ${
                filter.technologyTypes?.includes(techType.id) ? styles.active : ""
              }`}
              onClick={() => toggleTechnologyType(techType.id)}
              style={
                {
                  "--chip-color": techType.color,
                } as React.CSSProperties
              }
              aria-pressed={filter.technologyTypes?.includes(techType.id) || false}
              aria-describedby={`type-${techType.id}-help`}
            >
              <span className={styles.chipLabel}>{techType.label}</span>
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <div className={styles.clearSection}>
          <button
            type="button"
            className={styles.clearButton}
            onClick={onClearFilters}
            aria-label="Clear all active filters"
          >
            <span className={styles.clearIcon} aria-hidden="true">
              ✕
            </span>
            Clear Filters
          </button>
        </div>
      )}

      {/* Screen reader descriptions */}
      <div className="sr-only">
        {categories.map((category) => (
          <div
            key={`${category.name}-help`}
            id={`category-${category.name.replace(/\s+/g, "-").toLowerCase()}-help`}
          >
            Filter to show only {category.name} technologies
          </div>
        ))}
        {technologyTypes.map((techType) => (
          <div key={`${techType.id}-help`} id={`type-${techType.id}-help`}>
            Filter to show only {techType.label} technologies
          </div>
        ))}
      </div>
    </div>
  );
}