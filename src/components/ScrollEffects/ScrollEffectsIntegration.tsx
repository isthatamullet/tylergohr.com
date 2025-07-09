/**
 * ScrollEffectsIntegration Component - Phase 3.2 Day 1 Integration Test
 * 
 * Purpose: Integration test wrapper for Day 1 scroll effects components
 * to verify compatibility with existing 3D architecture and performance.
 * 
 * Features:
 * - Integration wrapper for ScrollController, ParallaxController, and PerformanceMonitor
 * - Compatibility testing with existing InteractiveArchitectureDiagram
 * - Performance impact verification for 3D effects
 * - Development-time debugging and monitoring utilities
 */

'use client';

import React, { useState, useEffect } from 'react';
import { ScrollControllerProvider } from './ScrollController';
import { ParallaxController } from './ParallaxController';
import { PerformanceMonitor, usePerformanceMonitor } from './PerformanceMonitor';

/**
 * Integration test configuration
 */
interface IntegrationTestConfig {
  enableScrollEffects: boolean;
  enableParallax: boolean;
  enablePerformanceMonitoring: boolean;
  enableDebugDisplay: boolean;
  enableLogging: boolean;
}

/**
 * Development configuration based on environment
 */
function getIntegrationConfig(): IntegrationTestConfig {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  return {
    enableScrollEffects: true,
    enableParallax: true,
    enablePerformanceMonitoring: isDevelopment || isLocalhost,
    enableDebugDisplay: isDevelopment && isLocalhost,
    enableLogging: isDevelopment && isLocalhost
  };
}

/**
 * Performance impact test component
 */
function PerformanceImpactTest() {
  const config = getIntegrationConfig();
  const { metrics } = usePerformanceMonitor(
    config.enablePerformanceMonitoring,
    config.enableLogging
  );
  
  const [performanceReport, setPerformanceReport] = useState<{
    baseline: number | null;
    current: number | null;
    impact: number | null;
  }>({
    baseline: null,
    current: null,
    impact: null
  });
  
  // Measure performance impact
  useEffect(() => {
    if (!metrics) return;
    
    // Store baseline FPS on first measurement
    if (performanceReport.baseline === null) {
      setPerformanceReport(prev => ({
        ...prev,
        baseline: metrics.fps
      }));
    } else {
      // Calculate impact after scroll effects are active
      const impact = performanceReport.baseline - metrics.fps;
      setPerformanceReport(prev => ({
        ...prev,
        current: metrics.fps,
        impact: impact
      }));
      
      // Log significant performance changes
      if (config.enableLogging && Math.abs(impact) > 5) {
        console.log(`[ScrollEffects Integration] Performance impact: ${impact > 0 ? '-' : '+'}${Math.abs(impact).toFixed(1)}fps`);
      }
    }
  }, [metrics, performanceReport.baseline, config.enableLogging]);
  
  // Display performance report in development
  if (config.enableDebugDisplay && performanceReport.impact !== null) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontFamily: 'monospace',
        zIndex: 9998,
        maxWidth: '200px'
      }}>
        <div><strong>Scroll Effects Impact</strong></div>
        <div>Baseline: {performanceReport.baseline?.toFixed(1)}fps</div>
        <div>Current: {performanceReport.current?.toFixed(1)}fps</div>
        <div style={{ 
          color: performanceReport.impact && performanceReport.impact > 5 ? '#ef4444' : '#10b981' 
        }}>
          Impact: {performanceReport.impact && performanceReport.impact > 0 ? '-' : '+'}
          {Math.abs(performanceReport.impact || 0).toFixed(1)}fps
        </div>
        <div style={{ fontSize: '9px', marginTop: '4px', opacity: 0.7 }}>
          {performanceReport.impact && Math.abs(performanceReport.impact) < 2 ? 
            '✓ Minimal impact' : 
            '⚠ Monitor performance'
          }
        </div>
      </div>
    );
  }
  
  return null;
}

/**
 * Scroll effects integration test wrapper
 */
interface ScrollEffectsIntegrationProps {
  children: React.ReactNode;
  className?: string;
  enableEffects?: boolean;
}

export function ScrollEffectsIntegration({ 
  children, 
  className,
  enableEffects = true 
}: ScrollEffectsIntegrationProps) {
  const config = getIntegrationConfig();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize integration test
  useEffect(() => {
    if (enableEffects && config.enableScrollEffects) {
      console.log('[ScrollEffects Integration] Initializing Day 1 scroll effects integration test');
      console.log('[ScrollEffects Integration] Configuration:', config);
      setIsInitialized(true);
    }
  }, [enableEffects, config]);
  
  // Don't render effects if disabled or not ready
  if (!enableEffects || !config.enableScrollEffects || !isInitialized) {
    return <>{children}</>;
  }
  
  return (
    <ScrollControllerProvider enableAdvancedFeatures={true}>
      <div className={className} style={{ position: 'relative' }}>
        {/* Parallax background effects */}
        {config.enableParallax && (
          <ParallaxController
            enableEffects={true}
            className="parallax-background"
          />
        )}
        
        {/* Main content */}
        {children}
        
        {/* Performance monitoring overlay */}
        {config.enablePerformanceMonitoring && (
          <PerformanceMonitor
            enableDisplay={config.enableDebugDisplay}
            enableLogging={config.enableLogging}
            position="top-right"
          />
        )}
        
        {/* Performance impact test */}
        <PerformanceImpactTest />
      </div>
    </ScrollControllerProvider>
  );
}

/**
 * Hook for testing scroll integration in components
 */
export function useScrollEffectsTest() {
  const config = getIntegrationConfig();
  const { metrics } = usePerformanceMonitor(config.enablePerformanceMonitoring);
  
  return {
    isEnabled: config.enableScrollEffects,
    isDebugging: config.enableDebugDisplay,
    performanceMetrics: metrics,
    logTestResult: (testName: string, passed: boolean, details?: unknown) => {
      if (config.enableLogging) {
        console.log(`[ScrollEffects Test] ${testName}: ${passed ? 'PASS' : 'FAIL'}`, details || '');
      }
    }
  };
}

/**
 * Simple integration test for scroll detection accuracy
 */
export function runScrollDetectionTest(): Promise<boolean> {
  return new Promise((resolve) => {
    const config = getIntegrationConfig();
    if (!config.enableScrollEffects) {
      resolve(true);
      return;
    }
    
    const testResults = {
      scrollEventCount: 0,
      maxScrollY: 0,
      testStartTime: performance.now()
    };
    
    const testHandler = () => {
      testResults.scrollEventCount++;
      testResults.maxScrollY = Math.max(testResults.maxScrollY, window.scrollY);
    };
    
    // Add test scroll listener
    window.addEventListener('scroll', testHandler, { passive: true });
    
    // Simulate scroll to test detection
    window.scrollTo({ top: 100, behavior: 'auto' });
    
    // Wait for scroll events and cleanup
    setTimeout(() => {
      window.removeEventListener('scroll', testHandler);
      
      const testPassed = testResults.scrollEventCount > 0 && testResults.maxScrollY > 0;
      const testDuration = performance.now() - testResults.testStartTime;
      
      if (config.enableLogging) {
        console.log('[ScrollEffects Integration] Scroll detection test:', {
          passed: testPassed,
          scrollEvents: testResults.scrollEventCount,
          maxScrollY: testResults.maxScrollY,
          duration: `${testDuration.toFixed(2)}ms`
        });
      }
      
      // Reset scroll position
      window.scrollTo({ top: 0, behavior: 'auto' });
      
      resolve(testPassed);
    }, 500);
  });
}

export default ScrollEffectsIntegration;