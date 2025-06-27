"use client"

import React, { useState } from 'react'
import styles from './BrowserTabs.module.css'

export interface BadgeData {
  value: string
  label: string
  type: 'savings' | 'success' | 'innovation' | 'emmy' | 'frontend' | 'backend' | 'cloud' | 'leadership' | 'ai'
}

export interface TabData {
  id: string
  label: string
  badge: BadgeData
  content: React.ReactNode
  type: 'savings' | 'success' | 'innovation' | 'emmy' | 'frontend' | 'backend' | 'cloud' | 'leadership' | 'ai'
}

export interface BrowserTabsProps {
  tabs: TabData[]
  defaultTab?: string
  onTabChange?: (tabId: string) => void
  className?: string
  showBrowserChrome?: boolean
}

export default function BrowserTabs({ 
  tabs, 
  defaultTab, 
  onTabChange, 
  className = '',
  showBrowserChrome = true 
}: BrowserTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)

  const handleTabChange = async (tabId: string) => {
    if (tabId === activeTab || isTransitioning) return

    setIsTransitioning(true)
    
    // Brief delay for smooth transition
    setTimeout(() => {
      setActiveTab(tabId)
      setIsTransitioning(false)
      onTabChange?.(tabId)
    }, 200)
  }

  const handleKeyDown = (event: React.KeyboardEvent, tabId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleTabChange(tabId)
    }
    
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      const currentIndex = tabs.findIndex(tab => tab.id === activeTab)
      const nextIndex = event.key === 'ArrowLeft' 
        ? (currentIndex - 1 + tabs.length) % tabs.length
        : (currentIndex + 1) % tabs.length
      handleTabChange(tabs[nextIndex].id)
    }
  }


  return (
    <div className={`${styles.browserContainer} ${className}`}>
      {/* Browser Chrome */}
      {showBrowserChrome && (
        <div className={styles.browserChrome}>
          {/* Window Controls */}
          <div className={styles.windowControls}>
            <div className={`${styles.windowControl} ${styles.windowControlClose}`} />
            <div className={`${styles.windowControl} ${styles.windowControlMinimize}`} />
            <div className={`${styles.windowControl} ${styles.windowControlMaximize}`} />
          </div>
          
          {/* Address Bar */}
          <div className={styles.addressBar}>
            <div className={styles.urlBar}>
              <span className={styles.sslIndicator}>🔒</span>
              <span className={styles.urlText}>tylergohr.com/case-studies</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Bar */}
      <div className={styles.tabBar} role="tablist" aria-label="Case study browser tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`content-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            className={`${styles.tab} ${styles[`tab--${tab.type}`]} ${
              activeTab === tab.id ? styles.tabActive : ''
            }`}
            onClick={() => handleTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
          >
            {/* Badge */}
            <span className={`${styles.tabBadge} ${styles[`badge--${tab.type}`]}`}>
              <span className={styles.badgeValue}>{tab.badge.value}</span>
              <span className={styles.badgeLabel}>{tab.badge.label}</span>
            </span>
            
            {/* Tab Label */}
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className={styles.browserContent}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            id={`content-${tab.id}`}
            hidden={activeTab !== tab.id}
            className={`${styles.contentPanel} ${
              activeTab === tab.id && !isTransitioning 
                ? styles.contentPanelActive 
                : ''
            } ${isTransitioning ? styles.contentPanelTransitioning : ''}`}
          >
            {activeTab === tab.id && tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}