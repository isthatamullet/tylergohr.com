/**
 * PerformanceBenchmarks - Phase 3.3 Week 3 Day 3
 * 
 * Purpose: Device capability testing and performance benchmarking system.
 * Runs standardized tests to assess device capabilities and provides
 * accurate performance profiles for optimal quality settings.
 * 
 * Features:
 * - Standardized performance benchmarks
 * - Device capability classification
 * - Real-time performance validation
 * - Benchmark result caching
 * - Integration with quality scaling system
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as THREE from 'three';
import { getPerformanceMonitor } from './Global3DPerformanceMonitor';
import { getQualityScaler } from './QualityScaler3D';

/**
 * Benchmark test types
 */
export type BenchmarkTest = 
  | 'webgl-basic'
  | 'geometry-rendering'
  | 'texture-memory'
  | 'particle-systems'
  | 'shader-complexity'
  | 'multi-scene'
  | 'memory-stress';

/**
 * Benchmark result
 */
export interface BenchmarkResult {
  testName: BenchmarkTest;
  score: number; // 1-10 scale
  avgFPS: number;
  minFPS: number;
  maxFPS: number;
  memoryUsed: number; // MB
  renderTime: number; // ms
  duration: number; // Test duration in ms
  passed: boolean;
  details: {
    geometryComplexity?: number;
    textureCount?: number;
    particleCount?: number;
    shaderInstructions?: number;
    concurrentScenes?: number;
  };
  timestamp: number;
}

/**
 * Complete benchmark suite results
 */
export interface BenchmarkSuite {
  overallScore: number; // 1-10 scale
  deviceClass: 'flagship' | 'midrange' | 'budget' | 'legacy';
  recommendedQuality: 'ultra' | 'high' | 'medium' | 'low' | 'minimal';
  results: BenchmarkResult[];
  systemInfo: {
    userAgent: string;
    webglVersion: string;
    renderer: string;
    vendor: string;
    maxTextureSize: number;
    extensions: string[];
  };
  timestamp: number;
  version: string; // Benchmark version for compatibility
}

/**
 * Benchmark configuration
 */
export interface BenchmarkConfig {
  enabledTests: BenchmarkTest[];
  testDuration: number; // Duration per test in ms
  targetFPS: number;
  minAcceptableFPS: number;
  skipOnLowBattery: boolean;
  cacheResults: boolean;
  cacheExpiry: number; // Cache expiry in ms
}

/**
 * Test scene configuration
 */
interface TestScene {
  geometryCount: number;
  textureCount: number;
  particleCount: number;
  lightCount: number;
  complexity: 'simple' | 'moderate' | 'complex';
}

/**
 * PerformanceBenchmarks class
 */
export class PerformanceBenchmarks {
  private static instance: PerformanceBenchmarks | null = null;
  
  // Benchmark configuration
  private config: BenchmarkConfig = {
    enabledTests: ['webgl-basic', 'geometry-rendering', 'texture-memory', 'particle-systems'],
    testDuration: 3000, // 3 seconds per test
    targetFPS: 60,
    minAcceptableFPS: 30,
    skipOnLowBattery: true,
    cacheResults: true,
    cacheExpiry: 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  
  // Current benchmark state
  private isRunning: boolean = false;
  private currentTest: BenchmarkTest | null = null;
  private testResults: BenchmarkResult[] = [];
  private testCanvas: HTMLCanvasElement | null = null;
  private testRenderer: THREE.WebGLRenderer | null = null;
  
  // Performance monitor integration
  private performanceMonitor = getPerformanceMonitor();
  private qualityScaler = getQualityScaler();
  
  // Test scenes
  private readonly testScenes: Record<BenchmarkTest, TestScene> = {
    'webgl-basic': {
      geometryCount: 10,
      textureCount: 2,
      particleCount: 0,
      lightCount: 1,
      complexity: 'simple'
    },
    'geometry-rendering': {
      geometryCount: 100,
      textureCount: 5,
      particleCount: 0,
      lightCount: 3,
      complexity: 'moderate'
    },
    'texture-memory': {
      geometryCount: 20,
      textureCount: 50,
      particleCount: 0,
      lightCount: 2,
      complexity: 'moderate'
    },
    'particle-systems': {
      geometryCount: 10,
      textureCount: 5,
      particleCount: 1000,
      lightCount: 2,
      complexity: 'complex'
    },
    'shader-complexity': {
      geometryCount: 30,
      textureCount: 10,
      particleCount: 200,
      lightCount: 5,
      complexity: 'complex'
    },
    'multi-scene': {
      geometryCount: 150,
      textureCount: 20,
      particleCount: 500,
      lightCount: 8,
      complexity: 'complex'
    },
    'memory-stress': {
      geometryCount: 200,
      textureCount: 100,
      particleCount: 2000,
      lightCount: 10,
      complexity: 'complex'
    }
  };

  private constructor() {
    this.setupBenchmarkEnvironment();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): PerformanceBenchmarks {
    if (!PerformanceBenchmarks.instance) {
      PerformanceBenchmarks.instance = new PerformanceBenchmarks();
    }
    return PerformanceBenchmarks.instance;
  }

  /**
   * Check if cached benchmark results exist and are valid
   */
  public hasCachedResults(): boolean {
    if (!this.config.cacheResults) return false;
    
    const cached = localStorage.getItem('portfolio-benchmark-results');
    if (!cached) return false;
    
    try {
      const results: BenchmarkSuite = JSON.parse(cached);
      const age = Date.now() - results.timestamp;
      return age < this.config.cacheExpiry && results.version === this.getBenchmarkVersion();
    } catch {
      return false;
    }
  }

  /**
   * Get cached benchmark results
   */
  public getCachedResults(): BenchmarkSuite | null {
    if (!this.hasCachedResults()) return null;
    
    try {
      const cached = localStorage.getItem('portfolio-benchmark-results');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  /**
   * Run complete benchmark suite
   */
  public async runBenchmarkSuite(
    onProgress?: (test: BenchmarkTest, progress: number) => void,
    onTestComplete?: (result: BenchmarkResult) => void
  ): Promise<BenchmarkSuite> {
    if (this.isRunning) {
      throw new Error('Benchmark suite is already running');
    }
    
    // Check battery level if supported
    if (this.config.skipOnLowBattery && await this.isLowBattery()) {
      throw new Error('Skipping benchmark due to low battery');
    }
    
    this.isRunning = true;
    this.testResults = [];
    
    try {
      const totalTests = this.config.enabledTests.length;
      
      for (let i = 0; i < totalTests; i++) {
        const test = this.config.enabledTests[i];
        this.currentTest = test;
        
        onProgress?.(test, i / totalTests);
        
        const result = await this.runSingleTest(test);
        this.testResults.push(result);
        
        onTestComplete?.(result);
        
        // Brief pause between tests to allow cleanup
        await this.sleep(500);
      }
      
      onProgress?.(this.config.enabledTests[totalTests - 1], 1);
      
      const suite = this.compileBenchmarkSuite();
      
      // Cache results
      if (this.config.cacheResults) {
        localStorage.setItem('portfolio-benchmark-results', JSON.stringify(suite));
      }
      
      // Apply results to quality scaler
      this.applyBenchmarkResults(suite);
      
      return suite;
    } finally {
      this.isRunning = false;
      this.currentTest = null;
      this.cleanupBenchmarkEnvironment();
    }
  }

  /**
   * Run a single benchmark test
   */
  public async runSingleTest(testName: BenchmarkTest): Promise<BenchmarkResult> {
    const testConfig = this.testScenes[testName];
    const startTime = performance.now();
    
    // Create test scene
    const scene = this.createTestScene(testConfig);
    
    // Performance tracking
    const frameTimings: number[] = [];
    const memoryReadings: number[] = [];
    let lastFrameTime = startTime;
    
    // Animation loop for the test
    const animate = () => {
      if (!this.testRenderer) return;
      
      const now = performance.now();
      const frameTime = now - lastFrameTime;
      frameTimings.push(1000 / frameTime); // Convert to FPS
      lastFrameTime = now;
      
      // Memory reading (if available)
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        memoryReadings.push(memInfo.usedJSHeapSize / (1024 * 1024)); // Convert to MB
      }
      
      // Animate scene elements
      this.animateTestScene(scene, now - startTime);
      
      // Render
      this.testRenderer.render(scene.scene, scene.camera);
      
      // Continue if test duration not reached
      if (now - startTime < this.config.testDuration) {
        requestAnimationFrame(animate);
      }
    };
    
    // Start the test
    requestAnimationFrame(animate);
    
    // Wait for test completion
    await this.sleep(this.config.testDuration);
    
    // Calculate results
    const avgFPS = frameTimings.reduce((sum, fps) => sum + fps, 0) / frameTimings.length;
    const minFPS = Math.min(...frameTimings);
    const maxFPS = Math.max(...frameTimings);
    const avgMemory = memoryReadings.length > 0 
      ? memoryReadings.reduce((sum, mem) => sum + mem, 0) / memoryReadings.length 
      : 0;
    
    // Calculate score based on performance
    const score = this.calculateTestScore(testName, avgFPS, minFPS, avgMemory);
    
    // Cleanup test scene
    this.disposeTestScene(scene);
    
    const result: BenchmarkResult = {
      testName,
      score,
      avgFPS,
      minFPS,
      maxFPS,
      memoryUsed: avgMemory,
      renderTime: 1000 / avgFPS,
      duration: this.config.testDuration,
      passed: minFPS >= this.config.minAcceptableFPS,
      details: {
        geometryComplexity: testConfig.geometryCount,
        textureCount: testConfig.textureCount,
        particleCount: testConfig.particleCount
      },
      timestamp: Date.now()
    };
    
    return result;
  }

  /**
   * Get system information
   */
  public getSystemInfo(): BenchmarkSuite['systemInfo'] {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) {
      return {
        userAgent: navigator.userAgent,
        webglVersion: 'not-supported',
        renderer: 'unknown',
        vendor: 'unknown',
        maxTextureSize: 0,
        extensions: []
      };
    }
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    
    return {
      userAgent: navigator.userAgent,
      webglVersion: gl instanceof WebGL2RenderingContext ? 'webgl2' : 'webgl1',
      renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
      vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      extensions: gl.getSupportedExtensions() || []
    };
  }

  /**
   * Update benchmark configuration
   */
  public updateConfig(newConfig: Partial<BenchmarkConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Clear cached benchmark results
   */
  public clearCache(): void {
    localStorage.removeItem('portfolio-benchmark-results');
  }

  /**
   * Setup benchmark environment
   */
  private setupBenchmarkEnvironment(): void {
    // Create off-screen canvas for testing
    this.testCanvas = document.createElement('canvas');
    this.testCanvas.width = 800;
    this.testCanvas.height = 600;
    this.testCanvas.style.position = 'absolute';
    this.testCanvas.style.top = '-10000px';
    this.testCanvas.style.visibility = 'hidden';
    document.body.appendChild(this.testCanvas);
    
    // Create WebGL renderer
    try {
      this.testRenderer = new THREE.WebGLRenderer({
        canvas: this.testCanvas,
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance'
      });
      this.testRenderer.setSize(800, 600);
      this.testRenderer.setClearColor(0x000000);
    } catch (error) {
      console.warn('Failed to create WebGL renderer for benchmarking:', error);
    }
  }

  /**
   * Create test scene based on configuration
   */
  private createTestScene(config: TestScene): {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    objects: THREE.Object3D[];
  } {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    camera.position.z = 5;
    
    const objects: THREE.Object3D[] = [];
    
    // Add lighting
    for (let i = 0; i < config.lightCount; i++) {
      const light = new THREE.PointLight(0xffffff, 0.5);
      light.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      scene.add(light);
    }
    
    // Add ambient light
    scene.add(new THREE.AmbientLight(0x404040, 0.2));
    
    // Create geometries
    const geometries = [
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
      new THREE.IcosahedronGeometry(0.5, 2)
    ];
    
    // Create materials with textures
    const materials: THREE.Material[] = [];
    for (let i = 0; i < config.textureCount; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      
      // Generate random texture
      ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 50%)`;
      ctx.fillRect(0, 0, 64, 64);
      ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 25%)`;
      for (let j = 0; j < 10; j++) {
        ctx.fillRect(Math.random() * 64, Math.random() * 64, 8, 8);
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      materials.push(new THREE.MeshStandardMaterial({ map: texture }));
    }
    
    // Add geometry objects
    for (let i = 0; i < config.geometryCount; i++) {
      const geometry = geometries[i % geometries.length];
      const material = materials[i % materials.length] || new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      
      scene.add(mesh);
      objects.push(mesh);
    }
    
    // Add particle system if needed
    if (config.particleCount > 0) {
      const particleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(config.particleCount * 3);
      
      for (let i = 0; i < config.particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 50;
      }
      
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        sizeAttenuation: true
      });
      
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);
      objects.push(particles);
    }
    
    return { scene, camera, objects };
  }

  /**
   * Animate test scene
   */
  private animateTestScene(sceneData: { objects: THREE.Object3D[] }, elapsedTime: number): void {
    const time = elapsedTime * 0.001; // Convert to seconds
    
    sceneData.objects.forEach((object, index) => {
      if (object instanceof THREE.Mesh) {
        object.rotation.x = time * (0.5 + index * 0.1);
        object.rotation.y = time * (0.3 + index * 0.05);
        
        // Add some movement
        object.position.y += Math.sin(time + index) * 0.01;
      } else if (object instanceof THREE.Points) {
        // Animate particles
        object.rotation.y = time * 0.2;
        
        const positions = object.geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
          const i3 = i * 3;
          positions.array[i3 + 1] += Math.sin(time + i * 0.1) * 0.01;
        }
        positions.needsUpdate = true;
      }
    });
  }

  /**
   * Calculate test score based on performance metrics
   */
  private calculateTestScore(testName: BenchmarkTest, avgFPS: number, minFPS: number, memoryUsed: number): number {
    // Base score from FPS performance
    let score = Math.min(10, (avgFPS / this.config.targetFPS) * 10);
    
    // Penalty for low minimum FPS
    if (minFPS < this.config.minAcceptableFPS) {
      score *= 0.5;
    }
    
    // Memory usage penalty
    if (memoryUsed > 100) {
      score *= Math.max(0.3, 1 - (memoryUsed - 100) / 200);
    }
    
    // Test-specific adjustments
    switch (testName) {
      case 'webgl-basic':
        // Basic test should run well on all devices
        if (avgFPS < 30) score *= 0.3;
        break;
        
      case 'particle-systems':
        // Particle systems are demanding
        score *= 1.2; // Bonus for good particle performance
        break;
        
      case 'memory-stress':
        // Memory test focuses on memory efficiency
        if (memoryUsed > 150) score *= 0.5;
        break;
        
      case 'multi-scene':
        // Multi-scene test is most demanding
        score *= 1.5; // Bonus for handling complexity
        break;
    }
    
    return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
  }

  /**
   * Compile complete benchmark suite results
   */
  private compileBenchmarkSuite(): BenchmarkSuite {
    const overallScore = this.testResults.reduce((sum, result) => sum + result.score, 0) / this.testResults.length;
    
    let deviceClass: BenchmarkSuite['deviceClass'] = 'legacy';
    let recommendedQuality: BenchmarkSuite['recommendedQuality'] = 'minimal';
    
    if (overallScore >= 8) {
      deviceClass = 'flagship';
      recommendedQuality = 'ultra';
    } else if (overallScore >= 6) {
      deviceClass = 'midrange';
      recommendedQuality = 'high';
    } else if (overallScore >= 4) {
      deviceClass = 'budget';
      recommendedQuality = 'medium';
    } else if (overallScore >= 2) {
      deviceClass = 'budget';
      recommendedQuality = 'low';
    }
    
    return {
      overallScore: Math.round(overallScore * 10) / 10,
      deviceClass,
      recommendedQuality,
      results: [...this.testResults],
      systemInfo: this.getSystemInfo(),
      timestamp: Date.now(),
      version: this.getBenchmarkVersion()
    };
  }

  /**
   * Apply benchmark results to quality scaler
   */
  private applyBenchmarkResults(suite: BenchmarkSuite): void {
    // Update quality scaler with benchmark results
    this.qualityScaler.resetToOptimal();
    
    // Emit benchmark completion event
    this.performanceMonitor.emit('benchmark-complete', suite);
  }

  /**
   * Dispose test scene resources
   */
  private disposeTestScene(sceneData: { scene: THREE.Scene; objects: THREE.Object3D[] }): void {
    sceneData.objects.forEach(object => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (object.material instanceof THREE.Material) {
          object.material.dispose();
        }
      }
      sceneData.scene.remove(object);
    });
  }

  /**
   * Cleanup benchmark environment
   */
  private cleanupBenchmarkEnvironment(): void {
    if (this.testRenderer) {
      this.testRenderer.dispose();
      this.testRenderer = null;
    }
    
    if (this.testCanvas && this.testCanvas.parentNode) {
      this.testCanvas.parentNode.removeChild(this.testCanvas);
      this.testCanvas = null;
    }
  }

  /**
   * Check if device is on low battery
   */
  private async isLowBattery(): Promise<boolean> {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        return battery.level < 0.2 && !battery.charging;
      } catch {
        return false;
      }
    }
    return false;
  }

  /**
   * Get benchmark version for cache compatibility
   */
  private getBenchmarkVersion(): string {
    return '1.0.0';
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Destroy benchmarks instance
   */
  public destroy(): void {
    if (this.isRunning) {
      this.isRunning = false;
    }
    this.cleanupBenchmarkEnvironment();
    PerformanceBenchmarks.instance = null;
  }
}

/**
 * Export singleton instance getter
 */
export const getPerformanceBenchmarks = () => PerformanceBenchmarks.getInstance();

