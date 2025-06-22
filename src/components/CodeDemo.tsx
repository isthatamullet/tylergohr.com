"use client";

import { useState, useEffect, useRef } from "react";
import { CodeExample } from "@/lib/types";
import styles from "./CodeDemo.module.css";

interface CodeDemoProps {
  codeExample: CodeExample;
  autoType?: boolean;
  typingSpeed?: number;
}

export default function CodeDemo({
  codeExample,
  autoType = true,
  typingSpeed = 30,
}: CodeDemoProps) {
  const [isTyping, setIsTyping] = useState(false);
  const [displayedCode, setDisplayedCode] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Simple syntax highlighting (basic implementation)
  const highlightSyntax = (code: string, language: string) => {
    if (language === "typescript" || language === "javascript") {
      return code
        .replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>')
        .replace(
          /\b(const|let|var|function|return|if|else|for|while|class|interface|export|import|async|await|try|catch|throw)\b/g,
          '<span class="keyword">$1</span>',
        )
        .replace(
          /\b(string|number|boolean|object|undefined|null)\b/g,
          '<span class="type">$1</span>',
        )
        .replace(
          /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g,
          '<span class="string">$1$2$1</span>',
        )
        .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>');
    }
    return code;
  };

  // Animated typing effect
  useEffect(() => {
    if (!autoType || !isTyping) return;

    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;

    const typeCode = () => {
      if (currentIndex <= codeExample.code.length) {
        setDisplayedCode(codeExample.code.slice(0, currentIndex));
        currentIndex++;
        timeoutId = setTimeout(typeCode, typingSpeed);
      } else {
        setIsTyping(false);
      }
    };

    typeCode();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isTyping, codeExample.code, typingSpeed, autoType]);

  // Intersection Observer for auto-typing on scroll
  useEffect(() => {
    if (!autoType) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isTyping && displayedCode === "") {
            setIsTyping(true);
          }
        });
      },
      { threshold: 0.3 },
    );

    if (codeRef.current) {
      observerRef.current.observe(codeRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [autoType, isTyping, displayedCode]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeExample.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleReplay = () => {
    setDisplayedCode("");
    setIsTyping(true);
  };

  const codeToDisplay = isTyping ? displayedCode : codeExample.code;

  return (
    <div className={`${styles.codeDemo} fade-in-on-scroll`}>
      {/* Header */}
      <header className={styles.codeDemoHeader}>
        <div className={styles.codeInfo}>
          <h3 className={styles.codeTitle}>{codeExample.title}</h3>
          <p className={styles.codeDescription}>{codeExample.description}</p>
        </div>

        <div className={styles.codeActions}>
          {autoType && (
            <button
              className={styles.actionButton}
              onClick={handleReplay}
              disabled={isTyping}
              aria-label="Replay typing animation"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9V7L18.5 9.5C17.19 8.07 15.38 7 13.31 7C9.73 7 6.8 9.93 6.8 13.5S9.73 20 13.31 20C15.76 20 17.88 18.69 18.92 16.64C19.27 15.96 19.04 15.16 18.35 14.82C17.66 14.47 16.87 14.7 16.53 15.39C15.85 16.72 14.69 17.5 13.31 17.5C11.07 17.5 9.3 15.73 9.3 13.5S11.07 9.5 13.31 9.5C14.69 9.5 15.85 10.28 16.53 11.61L14 14H21V9Z" />
              </svg>
            </button>
          )}

          <button
            className={styles.actionButton}
            onClick={handleCopy}
            aria-label="Copy code to clipboard"
          >
            {copied ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" />
              </svg>
            )}
          </button>

          {codeExample.explanation && (
            <button
              className={styles.actionButton}
              onClick={() => setShowExplanation(!showExplanation)}
              aria-label="Toggle explanation"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Code Block */}
      <div className={styles.codeContainer}>
        <div className={styles.codeHeader}>
          <div className={styles.windowControls}>
            <span className={styles.windowControl}></span>
            <span className={styles.windowControl}></span>
            <span className={styles.windowControl}></span>
          </div>
          <span className={styles.languageLabel}>{codeExample.language}</span>
        </div>

        <pre ref={codeRef} className={styles.codeBlock}>
          <code
            className={styles.code}
            dangerouslySetInnerHTML={{
              __html: highlightSyntax(codeToDisplay, codeExample.language),
            }}
          />
          {isTyping && <span className={styles.cursor}>|</span>}
        </pre>

        {/* Line Numbers */}
        <div className={styles.lineNumbers}>
          {codeToDisplay.split("\n").map((_, index) => (
            <span
              key={index + 1}
              className={`${styles.lineNumber} ${
                codeExample.highlightLines?.includes(index + 1)
                  ? styles.highlighted
                  : ""
              }`}
            >
              {index + 1}
            </span>
          ))}
        </div>
      </div>

      {/* Explanation Panel */}
      {showExplanation && codeExample.explanation && (
        <div className={`${styles.explanation} scale-in-on-scroll`}>
          <h4 className={styles.explanationTitle}>Code Explanation</h4>
          <p className={styles.explanationText}>{codeExample.explanation}</p>

          {codeExample.highlightLines &&
            codeExample.highlightLines.length > 0 && (
              <div className={styles.highlightInfo}>
                <h5 className={styles.highlightTitle}>Key Lines</h5>
                <div className={styles.highlightList}>
                  {codeExample.highlightLines.map((lineNum) => (
                    <span key={lineNum} className={styles.highlightLine}>
                      Line {lineNum}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {/* Copy Success Message */}
      {copied && (
        <div className={styles.copySuccess}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
          </svg>
          Code copied to clipboard!
        </div>
      )}
    </div>
  );
}
