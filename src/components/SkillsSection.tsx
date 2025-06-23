"use client";

import { useState, useEffect } from "react";
import styles from "./SkillsSection.module.css";
import { hierarchicalSkillCategories } from "@/lib/projects";
import ExpandableSkillCard from "./ExpandableSkillCard";

export default function SkillsSection() {
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());

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

  const getTotalTechnologies = () => {
    return hierarchicalSkillCategories.reduce((total, category) => {
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
          {/* Hierarchical Skills Cards */}
          <div className={styles.skillsGrid}>
            {hierarchicalSkillCategories.map((category, index) => (
              <div
                key={category.name}
                data-card-id={category.name}
                className={styles.skillCardContainer}
              >
                <ExpandableSkillCard
                  category={category}
                  isVisible={visibleCards.has(category.name)}
                  animationDelay={index * 200}
                />
              </div>
            ))}
          </div>

          {/* Enhanced Summary Stats */}
          <div className={styles.skillsSummary}>
            <div className={styles.summaryStats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{getTotalTechnologies()}+</span>
                <span className={styles.statLabel}>Technologies</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{hierarchicalSkillCategories.length}</span>
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
