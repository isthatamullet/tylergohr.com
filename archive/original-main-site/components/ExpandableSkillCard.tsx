"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./ExpandableSkillCard.module.css";
import { HierarchicalSkillCategory } from "@/lib/types";
import CodeDemo from "./CodeDemo";
import SkillTooltip from "./SkillTooltip";

interface ExpandableSkillCardProps {
  category: HierarchicalSkillCategory;
  isVisible: boolean;
  animationDelay: number;
  hoveredSkill?: string | null;
  onSkillHover?: (skillName: string | null) => void;
}

export default function ExpandableSkillCard({
  category,
  isVisible,
  animationDelay,
  hoveredSkill = null,
  onSkillHover,
}: ExpandableSkillCardProps) {
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);
  const [focusedSkill, setFocusedSkill] = useState<string | null>(null);
  const [tooltipSkill, setTooltipSkill] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && expandedSubcategory) {
        setExpandedSubcategory(null);
        setFocusedSkill(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [expandedSubcategory]);

  const handleSubcategoryToggle = (subcategoryName: string) => {
    setExpandedSubcategory(
      expandedSubcategory === subcategoryName ? null : subcategoryName
    );
    setFocusedSkill(null);
  };

  const handleSkillFocus = (skillName: string) => {
    setFocusedSkill(focusedSkill === skillName ? null : skillName);
  };

  // Tooltip event handlers (desktop/mouse only)
  const handleSkillMouseEnter = (skillName: string, event: React.MouseEvent) => {
    // Handle relationship highlighting
    if (onSkillHover) {
      onSkillHover(skillName);
    }

    // Only show tooltips on devices with precise pointing (not touch)
    if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      // Clear any existing timeout
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }

      // Set position based on mouse event
      setTooltipPosition({
        x: event.clientX + 16,
        y: event.clientY - 8,
      });

      // Show tooltip with slight delay for better UX
      tooltipTimeoutRef.current = setTimeout(() => {
        setTooltipSkill(skillName);
      }, 300);
    }
  };

  const handleSkillMouseLeave = () => {
    // Clear relationship highlighting
    if (onSkillHover) {
      onSkillHover(null);
    }

    // Clear timeout if mouse leaves before tooltip shows
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    
    // Hide tooltip immediately
    setTooltipSkill(null);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  const getTotalSkillsCount = () => {
    return category.subcategories.reduce(
      (total, subcategory) => total + subcategory.skills.length,
      0
    );
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.skillCard} ${isVisible ? styles.visible : ""}`}
      style={
        {
          "--category-color": category.color,
          "--animation-delay": `${animationDelay}ms`,
        } as React.CSSProperties
      }
      role="region"
      aria-labelledby={`category-${category.name.replace(/\s+/g, "-").toLowerCase()}`}
    >
      {/* Category Header */}
      <div className={styles.categoryHeader}>
        <div className={styles.categoryIcon} aria-hidden="true">
          {category.emoji}
        </div>
        <div className={styles.categoryInfo}>
          <h3
            id={`category-${category.name.replace(/\s+/g, "-").toLowerCase()}`}
            className={styles.categoryTitle}
          >
            {category.name}
          </h3>
          <p className={styles.categoryDescription}>{category.description}</p>
        </div>
        <div className={styles.categoryStats}>
          <span className={styles.skillCount}>{getTotalSkillsCount()}</span>
          <span className={styles.skillLabel}>Technologies</span>
        </div>
      </div>

      {/* Subcategories */}
      <div className={styles.subcategoriesContainer}>
        {category.subcategories.map((subcategory, index) => (
          <div
            key={subcategory.name}
            className={`${styles.subcategory} ${
              expandedSubcategory === subcategory.name ? styles.expanded : ""
            }`}
          >
            {/* Subcategory Header */}
            <button
              className={styles.subcategoryButton}
              onClick={() => handleSubcategoryToggle(subcategory.name)}
              aria-expanded={expandedSubcategory === subcategory.name}
              aria-controls={`subcategory-content-${subcategory.name.replace(/\s+/g, "-").toLowerCase()}`}
              style={
                {
                  "--subcategory-delay": `${index * 100}ms`,
                } as React.CSSProperties
              }
            >
              <div className={styles.subcategoryHeader}>
                <h4 className={styles.subcategoryTitle}>{subcategory.name}</h4>
                <span className={styles.subcategoryCount}>
                  {subcategory.skills.length}
                </span>
              </div>
              <div
                className={`${styles.expandIcon} ${
                  expandedSubcategory === subcategory.name ? styles.rotated : ""
                }`}
                aria-hidden="true"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4.5 6L8 9.5L11.5 6H4.5Z" />
                </svg>
              </div>
            </button>

            {/* Subcategory Content */}
            <div
              id={`subcategory-content-${subcategory.name.replace(/\s+/g, "-").toLowerCase()}`}
              className={styles.subcategoryContent}
              aria-hidden={expandedSubcategory !== subcategory.name}
            >
              <p className={styles.subcategoryDescription}>
                {subcategory.description}
              </p>

              {/* Skills Grid */}
              <div className={styles.skillsGrid}>
                {subcategory.skills.map((skill, skillIndex) => {
                  const isHovered = hoveredSkill === skill.name;
                  
                  return (
                  <button
                    key={skill.name}
                    className={`${styles.skillItem} ${
                      focusedSkill === skill.name ? styles.focused : ""
                    } ${isHovered ? styles.hovered : ""}`}
                    onClick={() => handleSkillFocus(skill.name)}
                    onMouseEnter={(e) => handleSkillMouseEnter(skill.name, e)}
                    onMouseLeave={handleSkillMouseLeave}
                    style={
                      {
                        "--skill-color": skill.color,
                        "--skill-delay": `${skillIndex * 50}ms`,
                      } as React.CSSProperties
                    }
                    aria-describedby={
                      subcategory.codeExample && focusedSkill === skill.name
                        ? `code-demo-${subcategory.codeExample.id}`
                        : undefined
                    }
                  >
                    <div
                      className={styles.skillColorDot}
                      style={{ backgroundColor: skill.color }}
                      aria-hidden="true"
                    />
                    <span className={styles.skillName}>{skill.name}</span>
                    <div className={styles.skillProgress}>
                      <div
                        className={styles.skillProgressBar}
                        style={
                          {
                            "--progress-color": skill.color,
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  </button>
                  );
                })}
              </div>

              {/* Code Example */}
              {subcategory.codeExample && expandedSubcategory === subcategory.name && (
                <div className={styles.codeExampleContainer}>
                  <CodeDemo
                    codeExample={subcategory.codeExample}
                    autoType={false}
                    typingSpeed={20}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Skill Tooltips */}
      {tooltipSkill && (
        (() => {
          // Find the skill with tooltip data
          const skillWithTooltip = category.subcategories
            .flatMap(subcategory => subcategory.skills)
            .find(skill => skill.name === tooltipSkill && skill.tooltip);
          
          return skillWithTooltip?.tooltip ? (
            <SkillTooltip
              tooltip={skillWithTooltip.tooltip}
              skillName={skillWithTooltip.name}
              skillColor={skillWithTooltip.color}
              isVisible={true}
              position={tooltipPosition}
            />
          ) : null;
        })()
      )}
    </div>
  );
}