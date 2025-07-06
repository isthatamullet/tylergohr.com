'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useInView } from 'framer-motion';
import LiveCodeDemonstration from './LiveCodeDemonstration';
import { enterpriseCodeDemonstrations } from './EnterpriseCodeExamples';
import { ScrollIntegratedCodeDemo } from './types';
import styles from './ScrollIntegratedLiveCode.module.css';

interface ScrollIntegratedLiveCodeProps {
  className?: string;
  enableAutoplay?: boolean;
  autoplayInterval?: number;
  enableScrollTriggers?: boolean;
}

export default function ScrollIntegratedLiveCode({
  className,
  enableAutoplay = false,
  autoplayInterval = 15000,
  enableScrollTriggers = true
}: ScrollIntegratedLiveCodeProps) {
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { 
    amount: 0.3,
    margin: "0px 0px -100px 0px"
  });

  // Scroll-triggered demo configuration
  const scrollDemoConfig: ScrollIntegratedCodeDemo = {
    triggerPoint: 0.3,
    activationThreshold: 0.5,
    deactivationThreshold: 0.1,
    autoExecute: true,
    smoothTransition: true
  };

  // Auto-advance demos when in view and autoplay is enabled
  useEffect(() => {
    if (!enableAutoplay || hasUserInteracted || !isInView) return;

    const interval = setInterval(() => {
      setCurrentDemoIndex(prev => 
        (prev + 1) % enterpriseCodeDemonstrations.length
      );
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [enableAutoplay, hasUserInteracted, isInView, autoplayInterval]);

  // Activate when scrolled into view
  useEffect(() => {
    if (enableScrollTriggers) {
      setIsActive(isInView);
    }
  }, [isInView, enableScrollTriggers]);

  // Handle user interaction to stop autoplay
  const handleDemoChange = useCallback((demoId: string) => {
    setHasUserInteracted(true);
    const demoIndex = enterpriseCodeDemonstrations.findIndex(demo => demo.id === demoId);
    if (demoIndex !== -1) {
      setCurrentDemoIndex(demoIndex);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive || hasUserInteracted) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentDemoIndex(prev => 
            prev === 0 ? enterpriseCodeDemonstrations.length - 1 : prev - 1
          );
          setHasUserInteracted(true);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setCurrentDemoIndex(prev => 
            (prev + 1) % enterpriseCodeDemonstrations.length
          );
          setHasUserInteracted(true);
          break;
        case ' ':
          e.preventDefault();
          setHasUserInteracted(true);
          break;
      }
    };

    if (isActive) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isActive, hasUserInteracted]);

  const currentDemo = enterpriseCodeDemonstrations[currentDemoIndex];

  return (
    <section 
      ref={containerRef}
      className={`${styles.scrollIntegratedLiveCode} ${className || ''} ${isActive ? styles.active : ''}`}
      aria-label="Interactive Live Code Demonstrations"
    >
      <div className={styles.sectionHeader}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>
            Live Code Demonstrations
          </h2>
          <p className={styles.subtitle}>
            Interactive code examples showcasing enterprise-level technical expertise 
            with real-time execution and 3D visualization
          </p>
        </div>
        
        {enableAutoplay && !hasUserInteracted && (
          <div className={styles.autoplayIndicator}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{
                  animationDuration: `${autoplayInterval}ms`,
                  animationPlayState: isInView ? 'running' : 'paused'
                }}
              />
            </div>
            <span className={styles.autoplayText}>
              Auto-advancing demos • Press any key to take control
            </span>
          </div>
        )}
      </div>

      <div className={styles.demoContainer}>
        <LiveCodeDemonstration
          selectedDemoId={currentDemo?.id}
          showTabs={true}
          autoExecute={scrollDemoConfig.autoExecute && isActive}
          onDemoChange={handleDemoChange}
          className={styles.liveDemoComponent}
        />
      </div>

      <div className={styles.navigationHints}>
        <div className={styles.navigationGrid}>
          <div className={styles.navigationItem}>
            <div className={styles.hintIcon}>⌨️</div>
            <span>Use arrow keys to navigate demos</span>
          </div>
          <div className={styles.navigationItem}>
            <div className={styles.hintIcon}>🖱️</div>
            <span>Click tabs to select specific examples</span>
          </div>
          <div className={styles.navigationItem}>
            <div className={styles.hintIcon}>⚡</div>
            <span>Press Ctrl+Enter to execute code</span>
          </div>
          <div className={styles.navigationItem}>
            <div className={styles.hintIcon}>🎯</div>
            <span>Interact with 3D visualizations</span>
          </div>
        </div>
      </div>

      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <h4>Real-time Code Execution</h4>
          <p>
            Safe, sandboxed code execution with timeout protection and 
            memory monitoring for JavaScript, TypeScript, and SQL.
          </p>
        </div>
        <div className={styles.featureCard}>
          <h4>3D Data Visualization</h4>
          <p>
            Interactive 3D rendering of code results using React Three Fiber 
            for immersive data structure and architecture visualization.
          </p>
        </div>
        <div className={styles.featureCard}>
          <h4>Enterprise Code Examples</h4>
          <p>
            Business-relevant demonstrations showcasing React components, 
            API design, database optimization, and performance patterns.
          </p>
        </div>
        <div className={styles.featureCard}>
          <h4>Advanced IDE Features</h4>
          <p>
            Monaco Editor integration with IntelliSense, syntax highlighting, 
            error detection, and enterprise-themed customization.
          </p>
        </div>
      </div>

      {/* Scroll position indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.indicatorProgress}>
          <div 
            className={styles.indicatorFill}
            style={{
              width: `${((currentDemoIndex + 1) / enterpriseCodeDemonstrations.length) * 100}%`
            }}
          />
        </div>
        <span className={styles.indicatorText}>
          Demo {currentDemoIndex + 1} of {enterpriseCodeDemonstrations.length}
        </span>
      </div>
    </section>
  );
}