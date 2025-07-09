'use client';

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, jsx-a11y/role-supports-aria-props */
import React, { useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import LiveCodeEditor from './LiveCodeEditor';
import { codeExecutionEngine } from './CodeExecutionEngine';
import { enterpriseCodeDemonstrations } from './EnterpriseCodeExamples';
import { CodeExecutionResult, CodeDemonstration } from './types';
import styles from './LiveCodeDemonstration.module.css';

// Dynamic import for 3D visualization to reduce initial bundle size
const CodeVisualization3D = dynamic(() => import('./CodeVisualization3D'), {
  ssr: false,
  loading: () => (
    <div className={styles.visualizationLoading}>
      <div className={styles.loadingSpinner}></div>
      <p>Loading 3D visualization...</p>
    </div>
  )
});

interface LiveCodeDemonstrationProps {
  selectedDemoId?: string;
  showTabs?: boolean;
  autoExecute?: boolean;
  className?: string;
  onDemoChange?: (demoId: string) => void;
}

export default function LiveCodeDemonstration({
  selectedDemoId,
  showTabs = true,
  autoExecute = false,
  className,
  onDemoChange
}: LiveCodeDemonstrationProps) {
  const [currentDemoId, setCurrentDemoId] = useState(
    selectedDemoId || enterpriseCodeDemonstrations[0]?.id
  );
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get current demonstration
  const currentDemo = useMemo(() => {
    return enterpriseCodeDemonstrations.find(demo => demo.id === currentDemoId) || 
           enterpriseCodeDemonstrations[0];
  }, [currentDemoId]);

  // Filter demonstrations by category
  const filteredDemonstrations = useMemo(() => {
    if (selectedCategory === 'all') {
      return enterpriseCodeDemonstrations;
    }
    return enterpriseCodeDemonstrations.filter(demo => demo.category === selectedCategory);
  }, [selectedCategory]);

  // Available categories
  const categories = useMemo(() => {
    const cats = new Set(enterpriseCodeDemonstrations.map(demo => demo.category));
    return ['all', ...Array.from(cats)];
  }, []);

  const handleDemoChange = useCallback((demoId: string) => {
    setCurrentDemoId(demoId);
    setExecutionResult(null);
    onDemoChange?.(demoId);
  }, [onDemoChange]);

  const handleCodeExecution = useCallback(async (code: string): Promise<CodeExecutionResult> => {
    setIsExecuting(true);
    
    try {
      let result: CodeExecutionResult;
      
      switch (currentDemo.language) {
        case 'javascript':
          result = await codeExecutionEngine.executeJavaScript(code);
          break;
        case 'typescript':
          result = await codeExecutionEngine.executeTypeScript(code);
          break;
        case 'sql':
          result = await codeExecutionEngine.executeSQL(code);
          break;
        default:
          throw new Error(`Unsupported language: ${currentDemo.language}`);
      }
      
      setExecutionResult(result);
      return result;
    } catch (error) {
      const errorResult: CodeExecutionResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown execution error'
      };
      setExecutionResult(errorResult);
      return errorResult;
    } finally {
      setIsExecuting(false);
    }
  }, [currentDemo.language]);

  const handleVisualizationInteraction = useCallback((event: any) => {
    console.log('3D Visualization interaction:', event);
    // Handle 3D visualization interactions if needed
  }, []);

  if (!currentDemo) {
    return (
      <div className={`${styles.liveCodeDemo} ${className || ''}`}>
        <div className={styles.errorState}>
          <h3>No demonstrations available</h3>
          <p>Please check the demonstration configuration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.liveCodeDemo} ${className || ''}`}>
      {showTabs && (
        <div className={styles.demoTabs}>
          <div className={styles.categoryFilter}>
            <label htmlFor="category-select" className={styles.filterLabel}>
              Category:
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.categorySelect}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.tabList}>
            {filteredDemonstrations.map((demo) => (
              <button
                key={demo.id}
                className={`${styles.tab} ${demo.id === currentDemoId ? styles.active : ''}`}
                onClick={() => handleDemoChange(demo.id)}
                aria-selected={demo.id === currentDemoId}
              >
                <div className={styles.tabContent}>
                  <span className={styles.tabTitle}>{demo.title}</span>
                  <span className={styles.tabMeta}>
                    {demo.language.toUpperCase()} • {demo.estimatedTime}min
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.demoContent}>
        <div className={styles.demoHeader}>
          <div className={styles.demoInfo}>
            <h2 className={styles.demoTitle}>{currentDemo.title}</h2>
            <p className={styles.demoDescription}>{currentDemo.description}</p>
            <div className={styles.demoMeta}>
              <span className={styles.metaBadge}>
                {currentDemo.language.toUpperCase()}
              </span>
              <span className={styles.metaBadge}>
                {currentDemo.difficulty.charAt(0).toUpperCase() + currentDemo.difficulty.slice(1)}
              </span>
              <span className={styles.metaBadge}>
                {currentDemo.category.charAt(0).toUpperCase() + currentDemo.category.slice(1)}
              </span>
              {currentDemo.estimatedTime && (
                <span className={styles.metaBadge}>
                  {currentDemo.estimatedTime} min
                </span>
              )}
            </div>
          </div>
          
          <div className={styles.businessValue}>
            <h4>Business Value</h4>
            <p>{currentDemo.businessValue}</p>
          </div>
        </div>

        <div className={styles.demoWorkspace}>
          <div className={styles.editorSection}>
            <LiveCodeEditor
              language={currentDemo.language}
              initialCode={currentDemo.initialCode}
              onExecute={handleCodeExecution}
              onResult={setExecutionResult}
              theme="enterprise-dark"
              enableIntelliSense={true}
              className={styles.demoEditor}
            />
          </div>

          {executionResult && (
            <div className={styles.visualizationSection}>
              <div className={styles.visualizationHeader}>
                <h4>Live Code Visualization</h4>
                <div className={styles.executionMeta}>
                  {executionResult.executionTime && (
                    <span className={styles.executionTime}>
                      {executionResult.executionTime.toFixed(1)}ms
                    </span>
                  )}
                  {executionResult.memoryUsage && (
                    <span className={styles.memoryUsage}>
                      {executionResult.memoryUsage}KB
                    </span>
                  )}
                </div>
              </div>
              
              {executionResult.success && executionResult.visualizationData ? (
                <CodeVisualization3D
                  data={executionResult.visualizationData.data}
                  type={executionResult.visualizationData.type}
                  interactive={true}
                  autoRotate={false}
                  showControls={true}
                  onInteraction={handleVisualizationInteraction}
                  className={styles.visualization}
                />
              ) : (
                <div className={styles.visualizationFallback}>
                  <div className={styles.fallbackContent}>
                    {executionResult.success ? (
                      <>
                        <div className={styles.successIcon}>✅</div>
                        <h4>Code Executed Successfully</h4>
                        <div className={styles.outputPreview}>
                          <pre>{JSON.stringify(executionResult.output, null, 2)}</pre>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.errorIcon}>❌</div>
                        <h4>Execution Error</h4>
                        <div className={styles.errorMessage}>
                          {executionResult.error}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {currentDemo.learningObjectives && (
          <div className={styles.learningObjectives}>
            <h4>Key Features Demonstrated</h4>
            <ul>
              {currentDemo.learningObjectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}