"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./SkillTooltip.module.css";
import { SkillTooltip as SkillTooltipData } from "@/lib/types";

interface SkillTooltipProps {
  tooltip: SkillTooltipData;
  skillName: string;
  skillColor: string;
  isVisible: boolean;
  position: { x: number; y: number };
}

export default function SkillTooltip({
  tooltip,
  skillName,
  skillColor,
  isVisible,
  position,
}: SkillTooltipProps) {
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Adjust tooltip position to prevent overflow
  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      let adjustedX = position.x;
      let adjustedY = position.y;

      // Adjust horizontal position
      if (position.x + rect.width > viewport.width - 20) {
        adjustedX = position.x - rect.width - 20;
      }

      // Adjust vertical position
      if (position.y + rect.height > viewport.height - 20) {
        adjustedY = position.y - rect.height - 20;
      }

      setAdjustedPosition({ x: adjustedX, y: adjustedY });
    }
  }, [isVisible, position]);

  if (!isVisible) return null;

  return (
    <div
      ref={tooltipRef}
      className={`${styles.tooltip} ${isVisible ? styles.visible : ""}`}
      style={
        {
          "--tooltip-x": `${adjustedPosition.x}px`,
          "--tooltip-y": `${adjustedPosition.y}px`,
          "--skill-color": skillColor,
        } as React.CSSProperties
      }
      role="tooltip"
      aria-labelledby={`tooltip-title-${skillName.replace(/\s+/g, "-").toLowerCase()}`}
    >
      {/* Tooltip Arrow */}
      <div className={styles.tooltipArrow} />

      {/* Tooltip Header */}
      <div className={styles.tooltipHeader}>
        <div
          className={styles.skillIndicator}
          style={{ backgroundColor: skillColor }}
        />
        <h4
          id={`tooltip-title-${skillName.replace(/\s+/g, "-").toLowerCase()}`}
          className={styles.tooltipTitle}
        >
          {skillName}
        </h4>
      </div>

      {/* Context */}
      <div className={styles.tooltipSection}>
        <p className={styles.context}>{tooltip.context}</p>
      </div>

      {/* Experience */}
      <div className={styles.tooltipSection}>
        <h5 className={styles.sectionTitle}>Experience</h5>
        <p className={styles.experience}>{tooltip.experience}</p>
      </div>

      {/* Use Cases */}
      <div className={styles.tooltipSection}>
        <h5 className={styles.sectionTitle}>Real-World Applications</h5>
        <ul className={styles.useCasesList}>
          {tooltip.useCases.map((useCase, index) => (
            <li key={index} className={styles.useCaseItem}>
              {useCase}
            </li>
          ))}
        </ul>
      </div>

      {/* Key Features */}
      <div className={styles.tooltipSection}>
        <h5 className={styles.sectionTitle}>Key Features</h5>
        <div className={styles.featuresTags}>
          {tooltip.keyFeatures.map((feature, index) => (
            <span key={index} className={styles.featureTag}>
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Related Technologies */}
      {tooltip.relatedTech.length > 0 && (
        <div className={styles.tooltipSection}>
          <h5 className={styles.sectionTitle}>Related Technologies</h5>
          <div className={styles.relatedTech}>
            {tooltip.relatedTech.map((tech, index) => (
              <span key={index} className={styles.relatedTechItem}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}