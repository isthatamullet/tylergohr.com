/**
 * PerformanceReporting - Phase 3.3 Week 3 Day 3
 * 
 * Purpose: Real-time metrics and alerts system for 3D performance monitoring.
 * Provides comprehensive performance analytics, user-friendly notifications,
 * and developer debugging tools.
 * 
 * Features:
 * - Real-time performance metrics dashboard
 * - User notifications for performance issues
 * - Developer analytics and debugging tools
 * - Performance trend analysis
 * - Export capabilities for performance data
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client';

import { getPerformanceMonitor, type PerformanceMetrics, type PerformanceAlert } from './Global3DPerformanceMonitor';
import { getQualityScaler, type QualityChangeEvent } from './QualityScaler3D';
import { getResourceManager, type MemoryStats } from './ResourceManager3D';

/**
 * Performance report types
 */
export type ReportType = 'realtime' | 'summary' | 'detailed' | 'export';

/**
 * Performance trend data
 */
export interface PerformanceTrend {
  metric: 'fps' | 'memory' | 'gpu' | 'renderTime';
  values: number[];
  timestamps: number[];
  trend: 'improving' | 'stable' | 'degrading';
  slope: number; // Rate of change
}

/**
 * Performance summary report
 */
export interface PerformanceSummary {
  sessionDuration: number; // ms
  avgFPS: number;
  minFPS: number;
  maxFPS: number;
  avgMemoryUsage: number; // MB
  maxMemoryUsage: number; // MB
  qualityChanges: number;
  alertsTriggered: number;
  scenesRendered: number;
  trends: PerformanceTrend[];
  recommendations: string[];
  score: number; // Overall session score 1-10
}

/**
 * Real-time performance status
 */
export interface RealtimeStatus {
  currentFPS: number;
  currentMemory: number;
  currentGPU: number;
  qualityLevel: string;
  activeScenes: number;
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  alerts: PerformanceAlert[];
  lastUpdate: number;
}

/**
 * User notification configuration
 */
export interface NotificationConfig {
  enabled: boolean;
  showFPSDrops: boolean;
  showMemoryWarnings: boolean;
  showQualityChanges: boolean;
  autoHide: boolean;
  hideDelay: number; // ms
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  style: 'minimal' | 'detailed' | 'developer';
}

/**
 * Performance analytics data
 */
export interface PerformanceAnalytics {
  deviceProfile: {
    userAgent: string;
    deviceClass: string;
    estimatedPerformance: number;
  };
  sessionMetrics: {
    totalSessions: number;
    avgSessionDuration: number;
    avgPerformanceScore: number;
    commonIssues: string[];
  };
  usagePatterns: {
    mostUsedScenes: string[];
    preferredQualityLevel: string;
    qualityChangeFrequency: number;
  };
  performanceHistory: PerformanceSummary[];
}

/**
 * Export format options
 */
export type ExportFormat = 'json' | 'csv' | 'txt' | 'performance-timeline';

/**
 * PerformanceReporting class
 */
export class PerformanceReporting {
  private static instance: PerformanceReporting | null = null;
  
  // Core data storage
  private performanceHistory: PerformanceMetrics[] = [];
  private qualityHistory: QualityChangeEvent[] = [];
  private alertHistory: PerformanceAlert[] = [];
  private sessionStartTime: number = Date.now();
  
  // Real-time status
  private realtimeStatus: RealtimeStatus = {
    currentFPS: 0,
    currentMemory: 0,
    currentGPU: 0,
    qualityLevel: 'medium',
    activeScenes: 0,
    status: 'good',
    alerts: [],
    lastUpdate: Date.now()
  };
  
  // Configuration
  private notificationConfig: NotificationConfig = {
    enabled: true,
    showFPSDrops: true,
    showMemoryWarnings: true,
    showQualityChanges: false,
    autoHide: true,
    hideDelay: 5000,
    position: 'top-right',
    style: 'minimal'
  };
  
  // Notification UI elements
  private notificationContainer: HTMLElement | null = null;
  private activeNotifications: Map<string, HTMLElement> = new Map();
  
  // Analytics storage
  private analytics: PerformanceAnalytics;
  
  // Performance monitor integration
  private performanceMonitor = getPerformanceMonitor();
  private qualityScaler = getQualityScaler();
  private resourceManager = getResourceManager();
  
  // Update intervals
  private realtimeUpdateInterval: NodeJS.Timeout | null = null;
  private analyticsUpdateInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.analytics = this.loadAnalytics();
    this.setupEventListeners();
    this.createNotificationUI();
    this.startRealtimeUpdates();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): PerformanceReporting {
    if (!PerformanceReporting.instance) {
      PerformanceReporting.instance = new PerformanceReporting();
    }
    return PerformanceReporting.instance;
  }

  /**
   * Get real-time performance status
   */
  public getRealtimeStatus(): RealtimeStatus {
    return { ...this.realtimeStatus };
  }

  /**
   * Generate performance summary for current session
   */
  public generateSummary(): PerformanceSummary {
    const sessionDuration = Date.now() - this.sessionStartTime;
    
    if (this.performanceHistory.length === 0) {
      return {
        sessionDuration,
        avgFPS: 0,
        minFPS: 0,
        maxFPS: 0,
        avgMemoryUsage: 0,
        maxMemoryUsage: 0,
        qualityChanges: this.qualityHistory.length,
        alertsTriggered: this.alertHistory.length,
        scenesRendered: 0,
        trends: [],
        recommendations: ['Insufficient data for analysis'],
        score: 5
      };
    }
    
    const fpsValues = this.performanceHistory.map(m => m.fps);
    const memoryValues = this.performanceHistory.map(m => m.memoryUsage);
    
    const summary: PerformanceSummary = {
      sessionDuration,
      avgFPS: this.average(fpsValues),
      minFPS: Math.min(...fpsValues),
      maxFPS: Math.max(...fpsValues),
      avgMemoryUsage: this.average(memoryValues),
      maxMemoryUsage: Math.max(...memoryValues),
      qualityChanges: this.qualityHistory.length,
      alertsTriggered: this.alertHistory.length,
      scenesRendered: this.performanceMonitor.getActiveScenes().length,
      trends: this.calculateTrends(),
      recommendations: this.generateRecommendations(),
      score: this.calculateSessionScore()
    };
    
    return summary;
  }

  /**
   * Get performance analytics
   */
  public getAnalytics(): PerformanceAnalytics {
    this.updateAnalytics();
    return { ...this.analytics };
  }

  /**
   * Export performance data
   */
  public exportData(format: ExportFormat = 'json'): string {
    const data = {
      summary: this.generateSummary(),
      analytics: this.getAnalytics(),
      rawMetrics: this.performanceHistory,
      qualityHistory: this.qualityHistory,
      alertHistory: this.alertHistory,
      deviceProfile: this.qualityScaler.getDeviceProfile(),
      resourceUsage: this.resourceManager.getMemoryStats(),
      exportTimestamp: Date.now()
    };
    
    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
        
      case 'csv':
        return this.convertToCSV(data);
        
      case 'txt':
        return this.convertToText(data);
        
      case 'performance-timeline':
        return this.convertToPerformanceTimeline(data);
        
      default:
        return JSON.stringify(data, null, 2);
    }
  }

  /**
   * Download performance report
   */
  public downloadReport(filename: string = 'performance-report', format: ExportFormat = 'json'): void {
    const data = this.exportData(format);
    const extension = format === 'performance-timeline' ? 'json' : format;
    
    const blob = new Blob([data], { 
      type: format === 'json' || format === 'performance-timeline' ? 'application/json' : 'text/plain' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Show user notification
   */
  public showNotification(
    type: 'info' | 'warning' | 'error' | 'success',
    title: string,
    message: string,
    autoHide: boolean = true
  ): void {
    if (!this.notificationConfig.enabled) return;
    
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const notification = this.createNotificationElement(id, type, title, message);
    
    if (this.notificationContainer) {
      this.notificationContainer.appendChild(notification);
      this.activeNotifications.set(id, notification);
      
      // Auto-hide after delay
      if (autoHide && this.notificationConfig.autoHide) {
        setTimeout(() => {
          this.hideNotification(id);
        }, this.notificationConfig.hideDelay);
      }
    }
  }

  /**
   * Hide notification
   */
  public hideNotification(id: string): void {
    const notification = this.activeNotifications.get(id);
    if (notification && notification.parentNode) {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
        this.activeNotifications.delete(id);
      }, 300);
    }
  }

  /**
   * Update notification configuration
   */
  public updateNotificationConfig(config: Partial<NotificationConfig>): void {
    this.notificationConfig = { ...this.notificationConfig, ...config };
    
    if (!this.notificationConfig.enabled) {
      this.clearAllNotifications();
    }
    
    // Update notification container position
    if (this.notificationContainer) {
      this.updateNotificationPosition();
    }
  }

  /**
   * Clear performance history
   */
  public clearHistory(): void {
    this.performanceHistory = [];
    this.qualityHistory = [];
    this.alertHistory = [];
    this.sessionStartTime = Date.now();
  }

  /**
   * Calculate performance trends
   */
  private calculateTrends(): PerformanceTrend[] {
    if (this.performanceHistory.length < 10) return [];
    
    const trends: PerformanceTrend[] = [];
    const recentData = this.performanceHistory.slice(-30); // Last 30 data points
    
    // FPS trend
    const fpsValues = recentData.map(m => m.fps);
    const fpsTimestamps = recentData.map(m => m.timestamp);
    trends.push({
      metric: 'fps',
      values: fpsValues,
      timestamps: fpsTimestamps,
      trend: this.determineTrend(fpsValues),
      slope: this.calculateSlope(fpsValues)
    });
    
    // Memory trend
    const memoryValues = recentData.map(m => m.memoryUsage);
    trends.push({
      metric: 'memory',
      values: memoryValues,
      timestamps: fpsTimestamps,
      trend: this.determineTrend(memoryValues, true), // Inverted for memory (lower is better)
      slope: this.calculateSlope(memoryValues)
    });
    
    // GPU utilization trend
    const gpuValues = recentData.map(m => m.gpuUtilization);
    trends.push({
      metric: 'gpu',
      values: gpuValues,
      timestamps: fpsTimestamps,
      trend: this.determineTrend(gpuValues, true), // Inverted for GPU utilization
      slope: this.calculateSlope(gpuValues)
    });
    
    return trends;
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const summary = this.generateSummary();
    
    if (summary.avgFPS < 30) {
      recommendations.push('Consider reducing quality settings to improve frame rate');
    }
    
    if (summary.maxMemoryUsage > 200) {
      recommendations.push('Memory usage is high - try closing other browser tabs');
    }
    
    if (summary.qualityChanges > 10) {
      recommendations.push('Frequent quality changes detected - consider manual quality setting');
    }
    
    if (summary.alertsTriggered > 5) {
      recommendations.push('Multiple performance alerts - check system resources');
    }
    
    const trends = summary.trends.find(t => t.metric === 'fps');
    if (trends && trends.trend === 'degrading') {
      recommendations.push('Performance is degrading over time - restart may help');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Performance looks good! All systems operating normally.');
    }
    
    return recommendations;
  }

  /**
   * Calculate overall session score
   */
  private calculateSessionScore(): number {
    const summary = this.generateSummary();
    
    let score = 10;
    
    // FPS score (40% weight)
    const fpsScore = Math.min(10, (summary.avgFPS / 60) * 10);
    score = score * 0.6 + fpsScore * 0.4;
    
    // Memory score (30% weight)
    const memoryScore = Math.max(0, 10 - (summary.maxMemoryUsage - 100) / 20);
    score = score * 0.7 + memoryScore * 0.3;
    
    // Stability score (30% weight)
    const stabilityScore = Math.max(0, 10 - summary.alertsTriggered - summary.qualityChanges * 0.5);
    score = score * 0.7 + stabilityScore * 0.3;
    
    return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Listen for performance updates
    this.performanceMonitor.on('performance-updated', (metrics: PerformanceMetrics) => {
      this.performanceHistory.push(metrics);
      
      // Keep only recent history
      if (this.performanceHistory.length > 1000) {
        this.performanceHistory = this.performanceHistory.slice(-500);
      }
      
      this.updateRealtimeStatus(metrics);
    });
    
    // Listen for quality changes
    this.performanceMonitor.on('quality-level-changed', (event: QualityChangeEvent) => {
      this.qualityHistory.push(event);
      
      if (this.notificationConfig.showQualityChanges) {
        this.showNotification(
          'info',
          'Quality Changed',
          `Quality adjusted to ${event.to.name} (${event.reason})`,
          true
        );
      }
    });
    
    // Listen for performance alerts
    this.performanceMonitor.on('performance-alert', (alert: PerformanceAlert) => {
      this.alertHistory.push(alert);
      
      if (this.shouldShowAlert(alert)) {
        this.showNotification(
          this.getAlertNotificationType(alert.severity),
          this.getAlertTitle(alert.type),
          alert.message,
          alert.severity !== 'critical'
        );
      }
    });
    
    // Listen for page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseReporting();
      } else {
        this.resumeReporting();
      }
    });
  }

  /**
   * Create notification UI
   */
  private createNotificationUI(): void {
    this.notificationContainer = document.createElement('div');
    this.notificationContainer.className = 'performance-notifications';
    this.updateNotificationPosition();
    document.body.appendChild(this.notificationContainer);
  }

  /**
   * Update notification container position
   */
  private updateNotificationPosition(): void {
    if (!this.notificationContainer) return;
    
    const styles: Record<string, string> = {
      position: 'fixed',
      zIndex: '10000',
      pointerEvents: 'none',
      maxWidth: '400px',
      padding: '1rem'
    };
    
    switch (this.notificationConfig.position) {
      case 'top-right':
        styles.top = '0';
        styles.right = '0';
        break;
      case 'top-left':
        styles.top = '0';
        styles.left = '0';
        break;
      case 'bottom-right':
        styles.bottom = '0';
        styles.right = '0';
        break;
      case 'bottom-left':
        styles.bottom = '0';
        styles.left = '0';
        break;
    }
    
    Object.assign(this.notificationContainer.style, styles);
  }

  /**
   * Create notification element
   */
  private createNotificationElement(
    id: string,
    type: 'info' | 'warning' | 'error' | 'success',
    title: string,
    message: string
  ): HTMLElement {
    const notification = document.createElement('div');
    notification.id = id;
    notification.className = `performance-notification ${type}`;
    
    const colors = {
      info: '#3b82f6',
      warning: '#f59e0b',
      error: '#ef4444',
      success: '#10b981'
    };
    
    const bgColors = {
      info: 'rgba(59, 130, 246, 0.1)',
      warning: 'rgba(245, 158, 11, 0.1)',
      error: 'rgba(239, 68, 68, 0.1)',
      success: 'rgba(16, 185, 129, 0.1)'
    };
    
    Object.assign(notification.style, {
      background: bgColors[type],
      border: `1px solid ${colors[type]}`,
      borderRadius: '8px',
      padding: '12px 16px',
      marginBottom: '8px',
      color: 'white',
      fontSize: '14px',
      fontFamily: 'system-ui, sans-serif',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(8px)',
      transition: 'all 0.3s ease',
      pointerEvents: 'auto',
      cursor: 'pointer'
    });
    
    const content = document.createElement('div');
    content.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 4px; color: ${colors[type]}">${title}</div>
      <div style="opacity: 0.9; line-height: 1.4">${message}</div>
    `;
    
    notification.appendChild(content);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
      this.hideNotification(id);
    });
    
    return notification;
  }

  /**
   * Update real-time status
   */
  private updateRealtimeStatus(metrics: PerformanceMetrics): void {
    this.realtimeStatus = {
      currentFPS: Math.round(metrics.fps),
      currentMemory: Math.round(metrics.memoryUsage),
      currentGPU: Math.round(metrics.gpuUtilization),
      qualityLevel: this.qualityScaler.getCurrentQuality().name,
      activeScenes: this.performanceMonitor.getActiveScenes().filter(s => s.isActive).length,
      status: this.determineOverallStatus(metrics),
      alerts: this.alertHistory.slice(-5), // Last 5 alerts
      lastUpdate: Date.now()
    };
  }

  /**
   * Determine overall performance status
   */
  private determineOverallStatus(metrics: PerformanceMetrics): RealtimeStatus['status'] {
    if (metrics.fps >= 55 && metrics.memoryUsage < 100 && metrics.gpuUtilization < 70) {
      return 'excellent';
    } else if (metrics.fps >= 45 && metrics.memoryUsage < 150 && metrics.gpuUtilization < 80) {
      return 'good';
    } else if (metrics.fps >= 30 && metrics.memoryUsage < 200 && metrics.gpuUtilization < 90) {
      return 'fair';
    } else if (metrics.fps >= 20 && metrics.memoryUsage < 250) {
      return 'poor';
    } else {
      return 'critical';
    }
  }

  /**
   * Start real-time updates
   */
  private startRealtimeUpdates(): void {
    this.realtimeUpdateInterval = setInterval(() => {
      const metrics = this.performanceMonitor.getCurrentMetrics();
      if (metrics) {
        this.updateRealtimeStatus(metrics);
      }
    }, 1000);
    
    this.analyticsUpdateInterval = setInterval(() => {
      this.saveAnalytics();
    }, 30000); // Save analytics every 30 seconds
  }

  /**
   * Pause reporting
   */
  private pauseReporting(): void {
    if (this.realtimeUpdateInterval) {
      clearInterval(this.realtimeUpdateInterval);
      this.realtimeUpdateInterval = null;
    }
  }

  /**
   * Resume reporting
   */
  private resumeReporting(): void {
    if (!this.realtimeUpdateInterval) {
      this.startRealtimeUpdates();
    }
  }

  /**
   * Load analytics from storage
   */
  private loadAnalytics(): PerformanceAnalytics {
    try {
      const stored = localStorage.getItem('portfolio-performance-analytics');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore errors, use default
    }
    
    return {
      deviceProfile: {
        userAgent: navigator.userAgent,
        deviceClass: 'unknown',
        estimatedPerformance: 5
      },
      sessionMetrics: {
        totalSessions: 0,
        avgSessionDuration: 0,
        avgPerformanceScore: 5,
        commonIssues: []
      },
      usagePatterns: {
        mostUsedScenes: [],
        preferredQualityLevel: 'medium',
        qualityChangeFrequency: 0
      },
      performanceHistory: []
    };
  }

  /**
   * Update analytics
   */
  private updateAnalytics(): void {
    const deviceProfile = this.qualityScaler.getDeviceProfile();
    const currentSummary = this.generateSummary();
    
    this.analytics.deviceProfile = {
      userAgent: navigator.userAgent,
      deviceClass: deviceProfile.deviceClass,
      estimatedPerformance: deviceProfile.score
    };
    
    this.analytics.sessionMetrics.totalSessions++;
    this.analytics.sessionMetrics.avgSessionDuration = 
      (this.analytics.sessionMetrics.avgSessionDuration + currentSummary.sessionDuration) / 2;
    this.analytics.sessionMetrics.avgPerformanceScore = 
      (this.analytics.sessionMetrics.avgPerformanceScore + currentSummary.score) / 2;
    
    this.analytics.usagePatterns.preferredQualityLevel = this.qualityScaler.getCurrentQuality().name;
    this.analytics.usagePatterns.qualityChangeFrequency = currentSummary.qualityChanges;
    
    // Add current session to history
    this.analytics.performanceHistory.push(currentSummary);
    if (this.analytics.performanceHistory.length > 10) {
      this.analytics.performanceHistory.shift();
    }
  }

  /**
   * Save analytics to storage
   */
  private saveAnalytics(): void {
    this.updateAnalytics();
    try {
      localStorage.setItem('portfolio-performance-analytics', JSON.stringify(this.analytics));
    } catch {
      // Storage might be full, ignore
    }
  }

  /**
   * Clear all notifications
   */
  private clearAllNotifications(): void {
    for (const id of this.activeNotifications.keys()) {
      this.hideNotification(id);
    }
  }

  /**
   * Utility methods
   */
  private average(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private determineTrend(values: number[], inverted: boolean = false): 'improving' | 'stable' | 'degrading' {
    if (values.length < 5) return 'stable';
    
    const slope = this.calculateSlope(values);
    const threshold = 0.1;
    
    if (inverted) {
      if (slope < -threshold) return 'improving';
      if (slope > threshold) return 'degrading';
    } else {
      if (slope > threshold) return 'improving';
      if (slope < -threshold) return 'degrading';
    }
    
    return 'stable';
  }

  private calculateSlope(values: number[]): number {
    const n = values.length;
    if (n < 2) return 0;
    
    const xSum = (n * (n - 1)) / 2;
    const ySum = values.reduce((sum, val) => sum + val, 0);
    const xySum = values.reduce((sum, val, i) => sum + val * i, 0);
    const x2Sum = (n * (n - 1) * (2 * n - 1)) / 6;
    
    return (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
  }

  private shouldShowAlert(alert: PerformanceAlert): boolean {
    if (alert.type === 'fps-drop') return this.notificationConfig.showFPSDrops;
    if (alert.type === 'memory-high') return this.notificationConfig.showMemoryWarnings;
    return true;
  }

  private getAlertNotificationType(severity: PerformanceAlert['severity']): 'info' | 'warning' | 'error' | 'success' {
    switch (severity) {
      case 'low': return 'info';
      case 'medium': return 'warning';
      case 'high': case 'critical': return 'error';
      default: return 'info';
    }
  }

  private getAlertTitle(type: PerformanceAlert['type']): string {
    switch (type) {
      case 'fps-drop': return 'Performance Issue';
      case 'memory-high': return 'Memory Warning';
      case 'gpu-overload': return 'GPU Overload';
      case 'render-slow': return 'Slow Rendering';
      case 'quality-reduced': return 'Quality Adjusted';
      default: return 'Performance Alert';
    }
  }

  private convertToCSV(data: any): string {
    const metrics = data.rawMetrics || [];
    if (metrics.length === 0) return 'No data available';
    
    const headers = ['timestamp', 'fps', 'memoryUsage', 'gpuUtilization', 'renderTime'];
    const rows = metrics.map((m: PerformanceMetrics) => [
      new Date(m.timestamp).toISOString(),
      m.fps,
      m.memoryUsage,
      m.gpuUtilization,
      m.renderTime
    ]);
    
    return [headers.join(','), ...rows.map((row: any[]) => row.join(','))].join('\n');
  }

  private convertToText(data: any): string {
    const summary = data.summary;
    return `
Performance Report
==================

Session Duration: ${Math.round(summary.sessionDuration / 1000)}s
Average FPS: ${summary.avgFPS.toFixed(1)}
Memory Usage: ${summary.avgMemoryUsage.toFixed(1)}MB (max: ${summary.maxMemoryUsage.toFixed(1)}MB)
Quality Changes: ${summary.qualityChanges}
Alerts Triggered: ${summary.alertsTriggered}
Overall Score: ${summary.score}/10

Recommendations:
${summary.recommendations.map((r: string) => `- ${r}`).join('\n')}
    `.trim();
  }

  private convertToPerformanceTimeline(data: any): string {
    // Convert to Chrome DevTools Performance Timeline format
    const events = data.rawMetrics.map((m: PerformanceMetrics, i: number) => ({
      name: 'PerformanceMetric',
      cat: 'portfolio',
      ph: 'I',
      ts: m.timestamp * 1000, // Convert to microseconds
      pid: 1,
      tid: 1,
      args: {
        fps: m.fps,
        memory: m.memoryUsage,
        gpu: m.gpuUtilization,
        renderTime: m.renderTime
      }
    }));
    
    return JSON.stringify({ traceEvents: events }, null, 2);
  }

  /**
   * Destroy performance reporting
   */
  public destroy(): void {
    if (this.realtimeUpdateInterval) {
      clearInterval(this.realtimeUpdateInterval);
      this.realtimeUpdateInterval = null;
    }
    
    if (this.analyticsUpdateInterval) {
      clearInterval(this.analyticsUpdateInterval);
      this.analyticsUpdateInterval = null;
    }
    
    this.clearAllNotifications();
    
    if (this.notificationContainer && this.notificationContainer.parentNode) {
      this.notificationContainer.parentNode.removeChild(this.notificationContainer);
      this.notificationContainer = null;
    }
    
    this.saveAnalytics();
    PerformanceReporting.instance = null;
  }
}

/**
 * Export singleton instance getter
 */
export const getPerformanceReporting = () => PerformanceReporting.getInstance();

