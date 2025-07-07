'use client';

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { CodeExecutionEngine, CodeExecutionResult } from './types';
import styles from './LiveCodeEditor.module.css';

export interface LiveCodeEditorProps {
  language: 'javascript' | 'typescript' | 'python' | 'sql';
  initialCode: string;
  theme?: 'enterprise-dark' | 'enterprise-light';
  onCodeChange?: (code: string) => void;
  onExecute?: (code: string) => Promise<CodeExecutionResult>;
  onResult?: (result: CodeExecutionResult) => void;
  readOnly?: boolean;
  enableIntelliSense?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

export default function LiveCodeEditor({
  language,
  initialCode,
  theme = 'enterprise-dark',
  onCodeChange,
  onExecute,
  onResult,
  readOnly = false,
  enableIntelliSense = true,
  title,
  description,
  className
}: LiveCodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor;

    // Configure Monaco Editor for enterprise theme
    monaco.editor.defineTheme('enterprise-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A737D', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'F97583' },
        { token: 'string', foreground: '9ECBFF' },
        { token: 'number', foreground: '79B8FF' },
        { token: 'type', foreground: 'B392F0' },
        { token: 'function', foreground: 'B392F0' },
        { token: 'variable', foreground: 'FFAB70' },
      ],
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#c9d1d9',
        'editorLineNumber.foreground': '#484f58',
        'editorLineNumber.activeForeground': '#c9d1d9',
        'editor.selectionBackground': '#264f78',
        'editor.selectionHighlightBackground': '#264f7840',
        'editorCursor.foreground': '#c9d1d9',
        'editor.findMatchBackground': '#17e5e650',
        'editor.findMatchHighlightBackground': '#17e5e634',
      }
    });

    monaco.editor.defineTheme('enterprise-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A737D', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'D73A49' },
        { token: 'string', foreground: '032F62' },
        { token: 'number', foreground: '005CC5' },
        { token: 'type', foreground: '6F42C1' },
        { token: 'function', foreground: '6F42C1' },
        { token: 'variable', foreground: 'E36209' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#24292e',
        'editorLineNumber.foreground': '#959da5',
        'editorLineNumber.activeForeground': '#24292e',
        'editor.selectionBackground': '#0366d625',
        'editor.selectionHighlightBackground': '#0366d615',
        'editorCursor.foreground': '#24292e',
      }
    });

    // Set up keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleExecuteCode();
    });

    // Configure IntelliSense for TypeScript/JavaScript
    if (enableIntelliSense && (language === 'typescript' || language === 'javascript')) {
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.Latest,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.React,
        reactNamespace: 'React',
        allowJs: true,
        typeRoots: ['node_modules/@types'],
      });

      // Add React types for better IntelliSense
      const reactTypes = `
        declare namespace React {
          interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
            type: T;
            props: P;
            key: Key | null;
          }
          interface Component<P = {}, S = {}> {}
          function createElement<P extends {}>(
            type: string | ComponentType<P>,
            props?: Attributes & P | null,
            ...children: ReactNode[]
          ): ReactElement<P>;
        }
      `;
      
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        reactTypes,
        'file:///node_modules/@types/react/index.d.ts'
      );
    }
  }, [language, enableIntelliSense]);

  const handleCodeChange = useCallback((value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    setError(null);
    onCodeChange?.(newCode);
  }, [onCodeChange]);

  const handleExecuteCode = useCallback(async () => {
    if (isExecuting || !onExecute) return;

    setIsExecuting(true);
    setError(null);

    try {
      const result = await onExecute(code);
      setExecutionResult(result);
      onResult?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown execution error';
      setError(errorMessage);
      console.error('Code execution error:', err);
    } finally {
      setIsExecuting(false);
    }
  }, [code, isExecuting, onExecute, onResult]);

  const formatResult = (result: CodeExecutionResult) => {
    if (result.error) {
      return `Error: ${result.error}`;
    }
    
    if (result.output) {
      return typeof result.output === 'string' 
        ? result.output 
        : JSON.stringify(result.output, null, 2);
    }

    return 'Code executed successfully';
  };

  return (
    <div className={`${styles.liveCodeEditor} ${className || ''}`}>
      {title && (
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          {description && <p className={styles.description}>{description}</p>}
        </div>
      )}
      
      <div className={styles.editorContainer}>
        <div className={styles.editorSection}>
          <div className={styles.editorHeader}>
            <span className={styles.languageLabel}>{language.toUpperCase()}</span>
            {onExecute && (
              <button
                className={styles.executeButton}
                onClick={handleExecuteCode}
                disabled={isExecuting || readOnly}
                aria-label="Execute code (Ctrl+Enter)"
              >
                {isExecuting ? 'Executing...' : 'Run Code'}
              </button>
            )}
          </div>
          
          <Editor
            height="300px"
            language={language}
            value={code}
            theme={theme}
            onChange={handleCodeChange}
            onMount={handleEditorDidMount}
            options={{
              readOnly,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              fontFamily: 'JetBrains Mono, Monaco, "Courier New", monospace',
              lineNumbers: 'on',
              glyphMargin: false,
              folding: true,
              lineDecorationsWidth: 10,
              lineNumbersMinChars: 3,
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
              wordWrap: 'on',
              contextmenu: true,
              selectOnLineNumbers: true,
              roundedSelection: false,
              cursorStyle: 'line',
              renderLineHighlight: 'line',
              suggest: {
                showKeywords: enableIntelliSense,
                showSnippets: enableIntelliSense,
                showFunctions: enableIntelliSense,
                showVariables: enableIntelliSense,
                showClasses: enableIntelliSense,
                showModules: enableIntelliSense,
              },
              quickSuggestions: {
                other: enableIntelliSense,
                comments: false,
                strings: false,
              },
            }}
          />
        </div>
        
        {(executionResult || error) && (
          <div className={styles.outputSection}>
            <div className={styles.outputHeader}>
              <span className={styles.outputLabel}>Output</span>
            </div>
            <div className={`${styles.outputContent} ${error ? styles.error : ''}`}>
              <pre>
                {error || (executionResult && formatResult(executionResult))}
              </pre>
            </div>
          </div>
        )}
      </div>
      
      {onExecute && (
        <div className={styles.shortcuts}>
          <span className={styles.shortcutHint}>
            Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to execute code
          </span>
        </div>
      )}
    </div>
  );
}