"use client";

import { useState } from "react";
import { Project, ProjectFilter } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import styles from "./ProjectShowcase.module.css";

interface ProjectShowcaseProps {
  projects: Project[];
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  limit?: number;
  onProjectSelect?: (project: Project) => void;
}

export default function ProjectShowcase({
  projects,
  title = "Featured Projects",
  subtitle = "Innovative solutions demonstrating technical mastery",
  showFilters = false,
  limit,
  onProjectSelect,
}: ProjectShowcaseProps) {
  const [filter, setFilter] = useState<ProjectFilter>({});

  // Filter projects based on current filter
  const filteredProjects = projects.filter((project) => {
    if (filter.category && project.category !== filter.category) return false;
    if (filter.industry && project.industry !== filter.industry) return false;
    if (filter.status && project.status !== filter.status) return false;
    if (
      filter.technology &&
      !project.techStack.some((tech) =>
        tech.name.toLowerCase().includes(filter.technology!.toLowerCase()),
      )
    )
      return false;
    return true;
  });

  // Apply limit if specified
  const displayProjects = limit
    ? filteredProjects.slice(0, limit)
    : filteredProjects;

  // Get unique categories, industries, and technologies for filters
  const categories = [...new Set(projects.map((p) => p.category))];
  const industries = [...new Set(projects.map((p) => p.industry))];
  const technologies = [
    ...new Set(projects.flatMap((p) => p.techStack.map((t) => t.name))),
  ];

  const clearFilters = () => {
    setFilter({});
  };

  const hasActiveFilters = Object.keys(filter).some(
    (key) => filter[key as keyof ProjectFilter],
  );

  return (
    <section
      className={styles.projectShowcase}
      aria-labelledby="projects-title"
      role="region"
    >
      {/* Section Header */}
      <header className={styles.showcaseHeader}>
        <div className="container">
          <h2
            id="projects-title"
            className={`${styles.showcaseTitle} slide-in-left`}
          >
            {title}
          </h2>
          <p
            id="projects-description"
            className={`${styles.showcaseSubtitle} slide-in-right`}
          >
            {subtitle}
          </p>
        </div>
      </header>

      {/* Filters */}
      {showFilters && (
        <div className={styles.filtersSection}>
          <div className="container">
            <form
              className={`${styles.filters} fade-in-on-scroll`}
              role="search"
              aria-labelledby="filters-title"
              onSubmit={(e) => e.preventDefault()}
            >
              <h3 id="filters-title" className="sr-only">
                Filter Projects
              </h3>

              <div className={styles.filterGroup}>
                <label htmlFor="category-filter" className={styles.filterLabel}>
                  Category
                </label>
                <select
                  id="category-filter"
                  className={styles.filterSelect}
                  value={filter.category || ""}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      category:
                        (e.target.value as Project["category"]) || undefined,
                    }))
                  }
                  aria-describedby="category-help"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <div id="category-help" className="sr-only">
                  Filter projects by category type
                </div>
              </div>

              <div className={styles.filterGroup}>
                <label htmlFor="industry-filter" className={styles.filterLabel}>
                  Industry
                </label>
                <select
                  id="industry-filter"
                  className={styles.filterSelect}
                  value={filter.industry || ""}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      industry:
                        (e.target.value as Project["industry"]) || undefined,
                    }))
                  }
                  aria-describedby="industry-help"
                >
                  <option value="">All Industries</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry.charAt(0).toUpperCase() + industry.slice(1)}
                    </option>
                  ))}
                </select>
                <div id="industry-help" className="sr-only">
                  Filter projects by industry sector
                </div>
              </div>

              <div className={styles.filterGroup}>
                <label
                  htmlFor="technology-filter"
                  className={styles.filterLabel}
                >
                  Technology
                </label>
                <select
                  id="technology-filter"
                  className={styles.filterSelect}
                  value={filter.technology || ""}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      technology: e.target.value || undefined,
                    }))
                  }
                  aria-describedby="technology-help"
                >
                  <option value="">All Technologies</option>
                  {technologies.map((tech) => (
                    <option key={tech} value={tech}>
                      {tech}
                    </option>
                  ))}
                </select>
                <div id="technology-help" className="sr-only">
                  Filter projects by technology stack
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  className={styles.clearFilters}
                  onClick={clearFilters}
                  aria-label="Clear all active filters"
                >
                  Clear Filters
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className={styles.projectsSection}>
        <div className="container">
          {displayProjects.length > 0 ? (
            <div
              className={styles.projectsGrid}
              role="grid"
              aria-label={`${displayProjects.length} project${displayProjects.length === 1 ? "" : "s"} found`}
            >
              {displayProjects.map((project, index) => (
                <div
                  key={project.id}
                  role="gridcell"
                  aria-rowindex={Math.floor(index / 3) + 1}
                  aria-colindex={(index % 3) + 1}
                  aria-label={`Project ${index + 1} of ${displayProjects.length}: ${project.title}`}
                >
                  <ProjectCard
                    project={project}
                    onViewDetails={onProjectSelect}
                    className={styles.projectCard}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noResults} role="status" aria-live="polite">
              <h3 className={styles.noResultsTitle}>No projects found</h3>
              <p className={styles.noResultsText}>
                Try adjusting your filters or check back later for new projects.
              </p>
              <button
                type="button"
                className={styles.clearFilters}
                onClick={clearFilters}
                aria-label="Clear all filters to show all projects"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
