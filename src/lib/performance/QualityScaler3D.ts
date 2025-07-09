/**
 * QualityScaler3D - Phase 3.3 Week 3 Day 3
 * 
 * Purpose: Automatic quality adjustment based on device performance and
 * real-time metrics. Ensures optimal performance across all devices by
 * dynamically scaling 3D quality settings.
 * 
 * Features:
 * - Device capability assessment and classification
 * - Real-time performance monitoring and adjustment
 * - Quality scaling algorithms for different 3D effects
 * - Smooth transitions between quality levels
 * - User preference integration
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client';

import { EventEmitter } from 'events';
import { getPerformanceMonitor, type QualitySettings, type PerformanceMetrics } from './Global3DPerformanceMonitor';
import { getResourceManager } from './ResourceManager3D';

/**
 * Quality level definitions
 */
export interface QualityLevel {
  name: 'ultra' | 'high' | 'medium' | 'low' | 'minimal';
  score: number; // 1-10 scale
  settings: QualitySettings;
  description: string;
  minDeviceScore: number;
}

/**
 * Quality scaling configuration
 */
export interface ScalingConfig {
  enableAutoScaling: boolean;
  targetFPS: number;
  minFPS: number;
  maxFPS: number;
  adjustmentInterval: number; // ms
  hysteresis: number; // Prevent rapid switching
  userPreference: 'auto' | 'performance' | 'quality' | 'balanced';
  preserveUserChoice: boolean;
}

/**
 * Quality adjustment reasons
 */
export type QualityAdjustmentReason = 
  | 'fps-drop'
  | 'memory-pressure' 
  | 'gpu-overload'
  | 'scene-complexity'
  | 'device-capability'
  | 'user-preference'
  | 'thermal-throttling'
  | 'battery-level';

/**
 * Quality change event
 */
export interface QualityChangeEvent {
  from: QualityLevel;
  to: QualityLevel;
  reason: QualityAdjustmentReason;
  timestamp: number;
  automatic: boolean;
  metrics?: PerformanceMetrics;
}

/**
 * Device performance assessment
 */
export interface DevicePerformanceProfile {
  deviceClass: 'flagship' | 'midrange' | 'budget' | 'legacy';
  gpuTier: 'high' | 'medium' | 'low';
  memoryTier: 'high' | 'medium' | 'low';
  cpuTier: 'high' | 'medium' | 'low';
  score: number; // Overall performance score 1-10
  limitations: string[];
  recommendations: {
    maxConcurrentScenes: number;
    preferredQuality: QualityLevel['name'];
    disabledFeatures: string[];
  };
}

/**
 * Quality scaling algorithms
 */
interface ScalingAlgorithm {
  name: string;
  evaluate: (metrics: PerformanceMetrics, current: QualityLevel) => number; // -1 to 1 scale
  weight: number;
}

/**
 * QualityScaler3D class
 */
export class QualityScaler3D extends EventEmitter {
  private static instance: QualityScaler3D | null = null;
  
  // Quality levels (ordered from lowest to highest)
  private readonly qualityLevels: QualityLevel[] = [
    {
      name: 'minimal',
      score: 1,
      description: 'Essential functionality only',
      minDeviceScore: 0,
      settings: {
        deviceTier: 'low',
        maxConcurrentScenes: 1,
        particleDensity: 0.1,
        shadowQuality: 'disabled',
        postProcessing: false,
        antiAliasing: false,
        textureQuality: 'low',
        animationQuality: 'low'
      }
    },
    {
      name: 'low',
      score: 3,
      description: 'Basic 3D with reduced effects',
      minDeviceScore: 2,
      settings: {
        deviceTier: 'low',
        maxConcurrentScenes: 2,
        particleDensity: 0.3,
        shadowQuality: 'disabled',
        postProcessing: false,
        antiAliasing: false,
        textureQuality: 'low',
        animationQuality: 'medium'
      }
    },
    {
      name: 'medium',
      score: 5,
      description: 'Balanced quality and performance',
      minDeviceScore: 4,
      settings: {
        deviceTier: 'medium',
        maxConcurrentScenes: 3,
        particleDensity: 0.6,
        shadowQuality: 'low',
        postProcessing: false,
        antiAliasing: false,
        textureQuality: 'medium',
        animationQuality: 'medium'
      }
    },
    {
      name: 'high',
      score: 7,
      description: 'High quality with most effects',
      minDeviceScore: 6,
      settings: {
        deviceTier: 'medium',
        maxConcurrentScenes: 4,
        particleDensity: 0.8,
        shadowQuality: 'medium',
        postProcessing: true,
        antiAliasing: false,
        textureQuality: 'high',
        animationQuality: 'high'
      }
    },
    {
      name: 'ultra',
      score: 10,
      description: 'Maximum quality with all effects',
      minDeviceScore: 8,
      settings: {
        deviceTier: 'high',
        maxConcurrentScenes: 5,
        particleDensity: 1.0,
        shadowQuality: 'high',
        postProcessing: true,
        antiAliasing: true,
        textureQuality: 'high',
        animationQuality: 'high'
      }
    }
  ];
  
  // Scaling configuration
  private config: ScalingConfig = {
    enableAutoScaling: true,
    targetFPS: 60,
    minFPS: 30,
    maxFPS: 120,
    adjustmentInterval: 3000, // 3 seconds
    hysteresis: 5, // 5 FPS hysteresis
    userPreference: 'auto',
    preserveUserChoice: false
  };
  
  // Current state
  private currentQuality: QualityLevel;
  private deviceProfile: DevicePerformanceProfile;
  private lastAdjustment: number = 0;
  private adjustmentHistory: QualityChangeEvent[] = [];
  private isAdjusting: boolean = false;
  
  // Scaling algorithms
  private scalingAlgorithms: ScalingAlgorithm[] = [
    {
      name: 'fps-based',
      weight: 0.4,
      evaluate: (metrics, current) => {
        const targetFPS = this.config.targetFPS;
        const fpsDiff = metrics.fps - targetFPS;
        
        if (fpsDiff < -this.config.hysteresis) {
          // FPS too low, reduce quality
          return Math.max(-1, fpsDiff / targetFPS);
        } else if (fpsDiff > this.config.hysteresis && current.score < 10) {
          // FPS high enough, could increase quality
          return Math.min(0.5, fpsDiff / (targetFPS * 2));
        }
        
        return 0;
      }
    },
    {
      name: 'memory-based',
      weight: 0.3,
      evaluate: (metrics, current) => {
        const memoryUsageMB = metrics.memoryUsage;
        
        if (memoryUsageMB > 200) {
          return -0.8; // Significantly reduce quality
        } else if (memoryUsageMB > 150) {
          return -0.4; // Moderately reduce quality
        } else if (memoryUsageMB < 100 && current.score < 10) {
          return 0.3; // Can increase quality
        }
        
        return 0;
      }
    },
    {
      name: 'gpu-based',
      weight: 0.2,
      evaluate: (metrics, current) => {
        const gpuUtilization = metrics.gpuUtilization;
        
        if (gpuUtilization > 90) {
          return -0.6; // Reduce quality
        } else if (gpuUtilization > 80) {
          return -0.3; // Slightly reduce quality
        } else if (gpuUtilization < 60 && current.score < 10) {
          return 0.4; // Can increase quality
        }
        
        return 0;
      }
    },
    {
      name: 'frame-time-based',
      weight: 0.1,
      evaluate: (metrics, current) => {
        const targetFrameTime = 1000 / this.config.targetFPS;
        const frameTimeRatio = metrics.frameTime / targetFrameTime;
        
        if (frameTimeRatio > 1.5) {
          return -0.7; // Frame time too high
        } else if (frameTimeRatio < 0.7 && current.score < 10) {
          return 0.3; // Frame time very good
        }
        
        return 0;
      }
    }
  ];
  
  // Performance monitor integration
  private performanceMonitor = getPerformanceMonitor();
  private resourceManager = getResourceManager();
  
  // Adjustment interval
  private adjustmentInterval: NodeJS.Timeout | null = null;

  private constructor() {
    super();
    this.deviceProfile = this.assessDevicePerformance();
    this.currentQuality = this.getInitialQuality();
    this.setupEventListeners();
    this.startAdjustmentLoop();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): QualityScaler3D {
    if (!QualityScaler3D.instance) {
      QualityScaler3D.instance = new QualityScaler3D();
    }
    return QualityScaler3D.instance;
  }

  /**
   * Get current quality level
   */
  public getCurrentQuality(): QualityLevel {
    return { ...this.currentQuality };
  }

  /**
   * Get device performance profile
   */
  public getDeviceProfile(): DevicePerformanceProfile {
    return { ...this.deviceProfile };
  }

  /**
   * Update scaling configuration
   */
  public updateConfig(newConfig: Partial<ScalingConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (this.config.enableAutoScaling && !this.adjustmentInterval) {
      this.startAdjustmentLoop();
    } else if (!this.config.enableAutoScaling && this.adjustmentInterval) {
      this.stopAdjustmentLoop();
    }
  }

  /**
   * Manually set quality level
   */
  public setQuality(qualityName: QualityLevel['name'], reason: QualityAdjustmentReason = 'user-preference'): boolean {
    const targetQuality = this.qualityLevels.find(q => q.name === qualityName);
    if (!targetQuality) return false;
    
    return this.changeQuality(targetQuality, reason, false);
  }

  /**
   * Adjust quality up or down
   */
  public adjustQuality(direction: 'increase' | 'decrease'): void {
    const currentIndex = this.qualityLevels.indexOf(this.currentQuality);
    let targetIndex = currentIndex;
    
    if (direction === 'decrease' && currentIndex > 0) {
      targetIndex = currentIndex - 1;
    } else if (direction === 'increase' && currentIndex < this.qualityLevels.length - 1) {
      targetIndex = currentIndex + 1;
    }
    
    if (targetIndex !== currentIndex) {
      this.changeQuality(this.qualityLevels[targetIndex], 'user-preference', true);
    }
  }

  /**
   * Get available quality levels for current device
   */
  public getAvailableQualityLevels(): QualityLevel[] {
    return this.qualityLevels.filter(level => 
      level.minDeviceScore <= this.deviceProfile.score
    );
  }

  /**
   * Get quality adjustment history
   */
  public getAdjustmentHistory(): QualityChangeEvent[] {
    return [...this.adjustmentHistory];
  }

  /**
   * Reset quality to device optimal
   */
  public resetToOptimal(): void {
    const optimal = this.getOptimalQualityForDevice();
    this.changeQuality(optimal, 'device-capability', false);
  }

  /**
   * Assess device performance capabilities
   */
  private assessDevicePerformance(): DevicePerformanceProfile {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) {
      return {
        deviceClass: 'legacy',
        gpuTier: 'low',
        memoryTier: 'low',
        cpuTier: 'low',
        score: 1,
        limitations: ['No WebGL support'],
        recommendations: {
          maxConcurrentScenes: 1,
          preferredQuality: 'minimal',
          disabledFeatures: ['3d-effects', 'particles', 'shadows']
        }
      };
    }
    
    // Assess GPU capabilities
    const renderer = gl.getParameter(gl.RENDERER) || '';
    const vendor = gl.getParameter(gl.VENDOR) || '';
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const maxRenderBufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
    
    // Basic performance indicators
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android/i.test(navigator.userAgent) && !/Mobile/i.test(navigator.userAgent);
    const cpuCores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as any).deviceMemory || (isMobile ? 2 : 8);
    
    // Calculate scores
    let gpuScore = 5;
    let cpuScore = 5;
    let memoryScore = 5;
    
    // GPU assessment
    if (renderer.toLowerCase().includes('adreno') || renderer.toLowerCase().includes('mali')) {
      gpuScore = isMobile ? 4 : 6; // Mobile GPU
    } else if (renderer.toLowerCase().includes('intel')) {
      gpuScore = 5; // Integrated GPU
    } else if (renderer.toLowerCase().includes('nvidia') || renderer.toLowerCase().includes('amd')) {
      gpuScore = 8; // Dedicated GPU
    }
    
    if (maxTextureSize >= 4096) gpuScore += 1;
    if (canvas.getContext('webgl2')) gpuScore += 1;
    
    // CPU assessment
    cpuScore = Math.min(10, 3 + (cpuCores / 2));
    if (isMobile) cpuScore *= 0.7;
    
    // Memory assessment
    memoryScore = Math.min(10, memory / 2);
    
    // Overall score
    const overallScore = Math.round((gpuScore * 0.4 + cpuScore * 0.3 + memoryScore * 0.3));
    
    // Determine device class
    let deviceClass: DevicePerformanceProfile['deviceClass'] = 'budget';
    if (overallScore >= 8) deviceClass = 'flagship';
    else if (overallScore >= 6) deviceClass = 'midrange';
    else if (overallScore >= 4) deviceClass = 'budget';
    else deviceClass = 'legacy';
    
    const limitations: string[] = [];
    const disabledFeatures: string[] = [];
    
    if (isMobile) {
      limitations.push('Mobile device constraints');
      if (overallScore < 6) {
        disabledFeatures.push('advanced-particles', 'complex-shadows');
      }
    }
    
    if (memory < 4) {
      limitations.push('Limited memory');
      disabledFeatures.push('high-resolution-textures');
    }
    
    if (gpuScore < 6) {
      limitations.push('Limited GPU performance');
      disabledFeatures.push('post-processing', 'anti-aliasing');
    }
    
    return {
      deviceClass,
      gpuTier: gpuScore >= 7 ? 'high' : gpuScore >= 5 ? 'medium' : 'low',
      memoryTier: memoryScore >= 7 ? 'high' : memoryScore >= 5 ? 'medium' : 'low',
      cpuTier: cpuScore >= 7 ? 'high' : cpuScore >= 5 ? 'medium' : 'low',
      score: overallScore,
      limitations,
      recommendations: {
        maxConcurrentScenes: Math.max(1, Math.min(5, Math.floor(overallScore / 2))),
        preferredQuality: overallScore >= 8 ? 'ultra' : 
                         overallScore >= 6 ? 'high' :
                         overallScore >= 4 ? 'medium' : 
                         overallScore >= 2 ? 'low' : 'minimal',
        disabledFeatures
      }
    };
  }

  /**
   * Get initial quality level for device
   */
  private getInitialQuality(): QualityLevel {
    // Check for user preference in localStorage
    const savedPreference = localStorage.getItem('portfolio-3d-quality');
    if (savedPreference && this.config.preserveUserChoice) {
      const savedQuality = this.qualityLevels.find(q => q.name === savedPreference);
      if (savedQuality && savedQuality.minDeviceScore <= this.deviceProfile.score) {
        return savedQuality;
      }
    }
    
    return this.getOptimalQualityForDevice();
  }

  /**
   * Get optimal quality level for current device
   */
  private getOptimalQualityForDevice(): QualityLevel {
    const recommendedName = this.deviceProfile.recommendations.preferredQuality;
    const recommended = this.qualityLevels.find(q => q.name === recommendedName);
    
    if (recommended) return recommended;
    
    // Fallback: find highest quality level device can handle
    return this.qualityLevels
      .filter(q => q.minDeviceScore <= this.deviceProfile.score)
      .sort((a, b) => b.score - a.score)[0] || this.qualityLevels[0];
  }

  /**
   * Evaluate if quality should be adjusted
   */
  private evaluateQualityAdjustment(): number {
    const metrics = this.performanceMonitor.getCurrentMetrics();
    if (!metrics) return 0;
    
    let totalScore = 0;
    let totalWeight = 0;
    
    for (const algorithm of this.scalingAlgorithms) {
      const score = algorithm.evaluate(metrics, this.currentQuality);
      totalScore += score * algorithm.weight;
      totalWeight += algorithm.weight;
    }
    
    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  /**
   * Perform automatic quality adjustment
   */
  private performAutoAdjustment(): void {
    if (this.isAdjusting || !this.config.enableAutoScaling) return;
    
    const now = Date.now();
    if (now - this.lastAdjustment < this.config.adjustmentInterval) return;
    
    const adjustmentScore = this.evaluateQualityAdjustment();
    
    // Determine if we should change quality
    let targetQuality: QualityLevel | null = null;
    let reason: QualityAdjustmentReason = 'fps-drop';
    
    if (adjustmentScore < -0.3) {
      // Reduce quality
      const currentIndex = this.qualityLevels.indexOf(this.currentQuality);
      if (currentIndex > 0) {
        targetQuality = this.qualityLevels[currentIndex - 1];
        
        // Determine primary reason
        const metrics = this.performanceMonitor.getCurrentMetrics()!;
        if (metrics.memoryUsage > 150) reason = 'memory-pressure';
        else if (metrics.gpuUtilization > 85) reason = 'gpu-overload';
        else reason = 'fps-drop';
      }
    } else if (adjustmentScore > 0.4) {
      // Increase quality
      const currentIndex = this.qualityLevels.indexOf(this.currentQuality);
      if (currentIndex < this.qualityLevels.length - 1) {
        const nextQuality = this.qualityLevels[currentIndex + 1];
        if (nextQuality.minDeviceScore <= this.deviceProfile.score) {
          targetQuality = nextQuality;
          reason = 'device-capability';
        }
      }
    }
    
    if (targetQuality && targetQuality !== this.currentQuality) {
      this.changeQuality(targetQuality, reason, true);
    }
  }

  /**
   * Change quality level
   */
  private changeQuality(newQuality: QualityLevel, reason: QualityAdjustmentReason, automatic: boolean): boolean {
    if (newQuality === this.currentQuality) return false;
    
    this.isAdjusting = true;
    
    const changeEvent: QualityChangeEvent = {
      from: this.currentQuality,
      to: newQuality,
      reason,
      timestamp: Date.now(),
      automatic,
      metrics: this.performanceMonitor.getCurrentMetrics() || undefined
    };
    
    // Update current quality
    this.currentQuality = newQuality;
    this.lastAdjustment = changeEvent.timestamp;
    
    // Update performance monitor settings
    this.performanceMonitor.emit('quality-changed', newQuality.settings);
    
    // Save user preference if manual
    if (!automatic) {
      localStorage.setItem('portfolio-3d-quality', newQuality.name);
    }
    
    // Add to history
    this.adjustmentHistory.push(changeEvent);
    if (this.adjustmentHistory.length > 50) {
      this.adjustmentHistory.shift();
    }
    
    // Emit quality change event
    this.emit('quality-level-changed', changeEvent);
    
    console.log(`Quality changed: ${changeEvent.from.name} → ${changeEvent.to.name} (${reason})`);
    
    this.isAdjusting = false;
    return true;
  }

  /**
   * Start automatic adjustment loop
   */
  private startAdjustmentLoop(): void {
    if (this.adjustmentInterval) return;
    
    this.adjustmentInterval = setInterval(() => {
      this.performAutoAdjustment();
    }, this.config.adjustmentInterval);
  }

  /**
   * Stop automatic adjustment loop
   */
  private stopAdjustmentLoop(): void {
    if (this.adjustmentInterval) {
      clearInterval(this.adjustmentInterval);
      this.adjustmentInterval = null;
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Listen for performance alerts
    this.performanceMonitor.on('performance-alert', (alert) => {
      if (alert.severity === 'critical') {
        // Force quality reduction for critical alerts
        const currentIndex = this.qualityLevels.indexOf(this.currentQuality);
        if (currentIndex > 0) {
          this.changeQuality(this.qualityLevels[currentIndex - 1], alert.type as QualityAdjustmentReason, true);
        }
      }
    });
    
    // Listen for visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Reduce quality when tab is hidden
        this.config.enableAutoScaling = false;
      } else {
        // Re-enable auto scaling when tab is visible
        this.config.enableAutoScaling = true;
        this.startAdjustmentLoop();
      }
    });
    
    // Listen for battery status (if supported)
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateForBattery = () => {
          if (battery.level < 0.2 && !battery.charging) {
            // Low battery, reduce quality
            this.changeQuality(this.qualityLevels[0], 'battery-level', true);
          }
        };
        
        battery.addEventListener('levelchange', updateForBattery);
        battery.addEventListener('chargingchange', updateForBattery);
      });
    }
  }

  /**
   * Destroy quality scaler
   */
  public destroy(): void {
    this.stopAdjustmentLoop();
    QualityScaler3D.instance = null;
  }
}

/**
 * Export singleton instance getter
 */
export const getQualityScaler = () => QualityScaler3D.getInstance();

