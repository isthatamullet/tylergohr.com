"use client";

import { useState, useEffect } from "react";
import styles from "./SkillsSection.module.css";
import { hierarchicalSkillCategories } from "@/lib/projects";
import { SkillsFilter } from "@/lib/types";
import ExpandableSkillCard from "./ExpandableSkillCard";
import SkillsFilterComponent from "./SkillsFilter";

export default function SkillsSection() {
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<SkillsFilter>({});
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [relatedSkills, setRelatedSkills] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = entry.target.getAttribute("data-card-id");
            if (cardId) {
              setVisibleCards((prev) => new Set([...prev, cardId]));
            }
          }
        });
      },
      { threshold: 0.1 },
    );

    const cardElements = document.querySelectorAll("[data-card-id]");
    cardElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Filter logic
  const filteredCategories = hierarchicalSkillCategories.filter((categoryItem) => {
    // Category name filtering
    if (filter.categories && filter.categories.length > 0) {
      if (!filter.categories.includes(categoryItem.name)) {
        return false;
      }
    }

    // Technology type filtering - check if category has any matching tech types
    if (filter.technologyTypes && filter.technologyTypes.length > 0) {
      const hasMatchingTechType = categoryItem.subcategories.some((subcategory) =>
        subcategory.skills.some((skill) =>
          filter.technologyTypes!.includes(skill.category)
        )
      );
      if (!hasMatchingTechType) {
        return false;
      }
    }

    return true;
  });

  // Filter management functions
  const handleFilterChange = (newFilter: SkillsFilter) => {
    setFilter(newFilter);
  };

  const clearFilters = () => {
    setFilter({});
  };

  const hasActiveFilters = 
    (filter.categories && filter.categories.length > 0) ||
    (filter.technologyTypes && filter.technologyTypes.length > 0);

  // Relationship highlighting logic
  const handleSkillHover = (skillName: string | null) => {
    setHoveredSkill(skillName);
    
    if (!skillName) {
      setRelatedSkills(new Set());
      return;
    }

    // Find the skill and its related technologies
    const allSkills = hierarchicalSkillCategories.flatMap(category =>
      category.subcategories.flatMap(subcategory => subcategory.skills)
    );
    
    const hoveredSkillData = allSkills.find(skill => skill.name === skillName);
    
    if (hoveredSkillData?.tooltip?.relatedTech) {
      const related = new Set<string>();
      
      // Add directly related technologies
      hoveredSkillData.tooltip.relatedTech.forEach(techName => {
        related.add(techName);
        
        // Find bidirectional relationships - if A relates to B, highlight B when hovering A
        const relatedSkillData = allSkills.find(skill => skill.name === techName);
        if (relatedSkillData?.tooltip?.relatedTech?.includes(skillName)) {
          related.add(techName);
        }
      });
      
      setRelatedSkills(related);
    } else {
      setRelatedSkills(new Set());
    }
  };

  const getTotalTechnologies = () => {
    return filteredCategories.reduce((total, category) => {
      return total + category.subcategories.reduce((subTotal, subcategory) => {
        return subTotal + subcategory.skills.length;
      }, 0);
    }, 0);
  };

  return (
    <section
      id="skills"
      className={styles.skillsSection}
      aria-labelledby="skills-title"
    >
      <div className="container">
        <div className={styles.skillsHeader}>
          <h2 id="skills-title" className={styles.sectionTitle}>
            Technical Expertise
          </h2>
          <p className={styles.sectionSubtitle}>
            Interactive showcase of modern technologies and development expertise
          </p>
        </div>

        <div className={styles.skillsContent}>
          {/* Skills Filter */}
          <SkillsFilterComponent
            filter={filter}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />

          {/* Hierarchical Skills Cards */}
          <div className={styles.skillsGrid}>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, index) => (
                <div
                  key={category.name}
                  data-card-id={category.name}
                  className={styles.skillCardContainer}
                >
                  <ExpandableSkillCard
                    category={category}
                    isVisible={visibleCards.has(category.name)}
                    animationDelay={index * 200}
                    hoveredSkill={hoveredSkill}
                    relatedSkills={relatedSkills}
                    onSkillHover={handleSkillHover}
                  />
                </div>
              ))
            ) : hasActiveFilters ? (
              <div className={styles.noResults}>
                <div className={styles.noResultsContent}>
                  <h3 className={styles.noResultsTitle}>No technologies found</h3>
                  <p className={styles.noResultsText}>
                    Try adjusting your filters to explore different technology categories.
                  </p>
                  <button
                    type="button"
                    className={styles.clearFiltersButton}
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Enhanced Summary Stats */}
          <div className={styles.skillsSummary}>
            <div className={styles.summaryStats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{getTotalTechnologies()}+</span>
                <span className={styles.statLabel}>Technologies</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{filteredCategories.length}</span>
                <span className={styles.statLabel}>Skill Categories</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>5+</span>
                <span className={styles.statLabel}>Years Experience</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>3</span>
                <span className={styles.statLabel}>Major Projects</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
