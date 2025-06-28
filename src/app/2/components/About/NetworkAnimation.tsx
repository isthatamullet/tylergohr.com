"use client"

import React from 'react'
import styles from './NetworkAnimation.module.css'

/**
 * Network Animation Component - CSS-based enterprise network visualization
 * 
 * Features:
 * - Animated network nodes with pulsing effects
 * - Flowing data streams between nodes
 * - 60fps performance with CSS animations
 * - Strategic node positioning representing enterprise architecture
 */
export const NetworkAnimation: React.FC = () => {
  return (
    <div className={styles.networkContainer}>
      <svg 
        className={styles.networkSVG} 
        viewBox="0 0 480 400" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Enterprise network architecture visualization"
      >
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="streamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#16a34a" stopOpacity="0" />
            <stop offset="50%" stopColor="#22c55e" stopOpacity="1" />
            <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
          </linearGradient>
          
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
          </radialGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background Network Connections */}
        <g className={styles.connections}>
          {/* Primary Hub Connections */}
          <path 
            className={`${styles.networkConnection} ${styles.primary}`}
            d="M 240 200 L 120 100"
            strokeDasharray="10 5"
          />
          <path 
            className={`${styles.networkConnection} ${styles.primary}`}
            d="M 240 200 L 360 100"
            strokeDasharray="10 5"
          />
          <path 
            className={`${styles.networkConnection} ${styles.primary}`}
            d="M 240 200 L 180 300"
            strokeDasharray="10 5"
          />
          <path 
            className={`${styles.networkConnection} ${styles.primary}`}
            d="M 240 200 L 300 300"
            strokeDasharray="10 5"
          />
          
          {/* Secondary Connections */}
          <path 
            className={styles.networkConnection}
            d="M 120 100 L 80 200"
            strokeDasharray="5 3"
          />
          <path 
            className={styles.networkConnection}
            d="M 360 100 L 400 200"
            strokeDasharray="5 3"
          />
          <path 
            className={styles.networkConnection}
            d="M 180 300 L 240 320"
            strokeDasharray="5 3"
          />
          <path 
            className={styles.networkConnection}
            d="M 300 300 L 240 80"
            strokeDasharray="5 3"
          />
          
          {/* Cross Connections */}
          <path 
            className={styles.networkConnection}
            d="M 120 100 L 360 100"
            strokeDasharray="8 4"
          />
          <path 
            className={styles.networkConnection}
            d="M 180 300 L 300 300"
            strokeDasharray="8 4"
          />
        </g>

        {/* Flowing Data Streams */}
        <g className={styles.dataStreams}>
          <path 
            className={`${styles.dataStream} ${styles.stream1}`}
            d="M 120 100 Q 180 150 240 200"
            stroke="url(#streamGradient)"
            strokeDasharray="20 10"
          />
          <path 
            className={`${styles.dataStream} ${styles.stream2}`}
            d="M 360 100 Q 300 150 240 200"
            stroke="url(#streamGradient)"
            strokeDasharray="20 10"
          />
          <path 
            className={`${styles.dataStream} ${styles.stream3}`}
            d="M 180 300 Q 210 250 240 200"
            stroke="url(#streamGradient)"
            strokeDasharray="20 10"
          />
          <path 
            className={`${styles.dataStream} ${styles.stream4}`}
            d="M 300 300 Q 270 250 240 200"
            stroke="url(#streamGradient)"
            strokeDasharray="20 10"
          />
        </g>

        {/* Network Nodes */}
        <g className={styles.nodes}>
          {/* Central Hub - Primary Node */}
          <circle 
            className={`${styles.networkNode} ${styles.primary}`}
            cx="240" cy="200" r="8"
            filter="url(#glow)"
          />
          
          {/* Enterprise Nodes - Secondary */}
          <circle 
            className={`${styles.networkNode} ${styles.secondary} ${styles.fox}`}
            cx="120" cy="100" r="6"
            filter="url(#glow)"
          />
          <circle 
            className={`${styles.networkNode} ${styles.secondary} ${styles.warner}`}
            cx="360" cy="100" r="6"
            filter="url(#glow)"
          />
          <circle 
            className={`${styles.networkNode} ${styles.secondary} ${styles.streaming}`}
            cx="180" cy="300" r="6"
            filter="url(#glow)"
          />
          <circle 
            className={`${styles.networkNode} ${styles.secondary} ${styles.ai}`}
            cx="300" cy="300" r="6"
            filter="url(#glow)"
          />
          
          {/* Data Points - Tertiary */}
          <circle 
            className={`${styles.networkNode} ${styles.tertiary}`}
            cx="80" cy="200" r="3"
          />
          <circle 
            className={`${styles.networkNode} ${styles.tertiary}`}
            cx="400" cy="200" r="3"
          />
          <circle 
            className={`${styles.networkNode} ${styles.tertiary}`}
            cx="240" cy="80" r="3"
          />
          <circle 
            className={`${styles.networkNode} ${styles.tertiary}`}
            cx="240" cy="320" r="3"
          />
        </g>

        {/* Node Labels (Hidden but accessible) */}
        <g className={styles.nodeLabels} aria-hidden="true">
          <text x="240" y="190" className={styles.nodeLabel}>Central Hub</text>
          <text x="120" y="90" className={styles.nodeLabel}>Fox Corp</text>
          <text x="360" y="90" className={styles.nodeLabel}>Warner Bros</text>
          <text x="180" y="290" className={styles.nodeLabel}>Streaming</text>
          <text x="300" y="290" className={styles.nodeLabel}>AI Innovation</text>
        </g>

      </svg>
    </div>
  )
}

export default NetworkAnimation