"use client";

import { useState, useEffect } from "react";
import styles from "./SkillsSection.module.css";
import { techStackItems } from "@/lib/projects";
import { TechStack } from "@/lib/types";

interface SkillCategory {
  name: string;
  skills: TechStack[];
  color: string;
}

const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    skills: [
      techStackItems.react,
      techStackItems.typescript,
      techStackItems.tailwind,
      techStackItems.framermotion,
      techStackItems.vite,
      techStackItems.zustand,
    ],
    color: "var(--portfolio-interactive)",
  },
  {
    name: "Backend",
    skills: [
      techStackItems.nodejs,
      techStackItems.socketio,
      techStackItems.stripe,
      techStackItems.quickbooks,
      techStackItems.gmail,
    ],
    color: "var(--portfolio-accent-green)",
  },
  {
    name: "Database",
    skills: [techStackItems.postgresql, techStackItems.supabase],
    color: "var(--portfolio-accent-red)",
  },
  {
    name: "Cloud & DevOps",
    skills: [
      techStackItems.gcp,
      techStackItems.firebase,
      techStackItems.supabase,
    ],
    color: "var(--portfolio-text-secondary)",
  },
];

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<string>("Frontend");
  const [visibleSkills, setVisibleSkills] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const skillId = entry.target.getAttribute("data-skill-id");
            if (skillId) {
              setVisibleSkills((prev) => new Set([...prev, skillId]));
            }
          }
        });
      },
      { threshold: 0.2 },
    );

    const skillElements = document.querySelectorAll("[data-skill-id]");
    skillElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [activeCategory]);

  const handleCategoryChange = (categoryName: string) => {
    setActiveCategory(categoryName);
    setVisibleSkills(new Set());
  };

  const activeSkills =
    skillCategories.find((cat) => cat.name === activeCategory)?.skills || [];

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
            Modern technologies and frameworks powering innovative solutions
          </p>
        </div>

        <div className={styles.skillsContent}>
          {/* Category Filters */}
          <div className={styles.categoryFilters} role="tablist">
            {skillCategories.map((category) => (
              <button
                key={category.name}
                className={`${styles.categoryFilter} ${
                  activeCategory === category.name ? styles.active : ""
                }`}
                onClick={() => handleCategoryChange(category.name)}
                role="tab"
                aria-selected={activeCategory === category.name}
                aria-controls={`skills-panel-${category.name.toLowerCase()}`}
                style={
                  {
                    "--category-color": category.color,
                  } as React.CSSProperties
                }
              >
                <span className={styles.categoryName}>{category.name}</span>
                <span className={styles.categoryCount}>
                  {category.skills.length}
                </span>
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div
            className={styles.skillsGrid}
            role="tabpanel"
            id={`skills-panel-${activeCategory.toLowerCase()}`}
            aria-labelledby="skills-title"
          >
            {activeSkills.map((skill, index) => (
              <div
                key={skill.name}
                className={`${styles.skillCard} ${
                  visibleSkills.has(skill.name) ? styles.visible : ""
                }`}
                data-skill-id={skill.name}
                style={
                  {
                    "--skill-color": skill.color,
                    "--animation-delay": `${index * 100}ms`,
                  } as React.CSSProperties
                }
              >
                <div className={styles.skillIcon}>
                  <div
                    className={styles.skillColorDot}
                    style={{ backgroundColor: skill.color }}
                    aria-hidden="true"
                  />
                </div>
                <div className={styles.skillInfo}>
                  <h3 className={styles.skillName}>{skill.name}</h3>
                  <p className={styles.skillCategory}>{skill.category}</p>
                </div>
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
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className={styles.skillsSummary}>
            <div className={styles.summaryStats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>15+</span>
                <span className={styles.statLabel}>Technologies</span>
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
