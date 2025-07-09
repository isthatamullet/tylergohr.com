/**
 * ResourceManager3D - Phase 3.3 Week 3 Day 3
 * 
 * Purpose: Intelligent resource management for multiple concurrent 3D scenes.
 * Handles memory optimization, resource pooling, and automatic cleanup to
 * prevent memory leaks and ensure optimal performance.
 * 
 * Features:
 * - Shared resource pooling (geometries, materials, textures)
 * - Automatic resource cleanup and garbage collection
 * - Memory usage tracking and optimization
 * - Resource priority management
 * - Integration with Global3DPerformanceMonitor
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

// import * as THREE from 'three';
import { getPerformanceMonitor } from './Global3DPerformanceMonitor';

/**
 * Resource types and metadata
 */
export interface ResourceMetadata {
  id: string;
  type: 'geometry' | 'material' | 'texture' | 'shader' | 'mesh';
  size: number; // Estimated size in bytes
  lastUsed: number;
  useCount: number;
  priority: 'high' | 'medium' | 'low';
  sceneIds: Set<string>;
  isShared: boolean;
  memoryEstimate: number;
}

/**
 * Resource pool entry
 */
export interface PooledResource<T = any> {
  resource: T;
  metadata: ResourceMetadata;
  disposed: boolean;
}

/**
 * Memory usage stats
 */
export interface MemoryStats {
  totalAllocated: number;
  totalUsed: number;
  geometries: number;
  materials: number;
  textures: number;
  meshes: number;
  shaders: number;
  poolHitRate: number; // Percentage of requests served from pool
  lastCleanup: number;
}

/**
 * Resource cleanup configuration
 */
export interface CleanupConfig {
  maxIdleTime: number; // Max time resource can be unused (ms)
  maxMemoryUsage: number; // Max total memory usage (MB)
  cleanupInterval: number; // Cleanup interval (ms)
  priorityThresholds: {
    high: number; // High priority resources max idle time
    medium: number; // Medium priority resources max idle time
    low: number; // Low priority resources max idle time
  };
}

/**
 * Resource request options
 */
export interface ResourceRequest {
  id: string;
  type: 'geometry' | 'material' | 'texture' | 'shader';
  sceneId: string;
  priority: 'high' | 'medium' | 'low';
  factory: () => any; // Function to create resource if not in pool
  memoryEstimate?: number;
  shared?: boolean;
}

/**
 * ResourceManager3D class
 */
export class ResourceManager3D {
  private static instance: ResourceManager3D | null = null;
  
  // Resource pools
  private geometryPool: Map<string, PooledResource<any>> = new Map();
  private materialPool: Map<string, PooledResource<any>> = new Map();
  private texturePool: Map<string, PooledResource<any>> = new Map();
  private shaderPool: Map<string, PooledResource<any>> = new Map();
  private meshPool: Map<string, PooledResource<any>> = new Map();
  
  // Statistics tracking
  private stats: MemoryStats = {
    totalAllocated: 0,
    totalUsed: 0,
    geometries: 0,
    materials: 0,
    textures: 0,
    meshes: 0,
    shaders: 0,
    poolHitRate: 0,
    lastCleanup: Date.now()
  };
  
  // Request tracking for hit rate calculation
  private requestCount: number = 0;
  private hitCount: number = 0;
  
  // Cleanup configuration
  private cleanupConfig: CleanupConfig = {
    maxIdleTime: 300000, // 5 minutes
    maxMemoryUsage: 150, // 150MB
    cleanupInterval: 30000, // 30 seconds
    priorityThresholds: {
      high: 600000, // 10 minutes
      medium: 300000, // 5 minutes
      low: 120000 // 2 minutes
    }
  };
  
  // Cleanup interval
  private cleanupInterval: NodeJS.Timeout | null = null;
  
  // Performance monitor integration
  private performanceMonitor = getPerformanceMonitor();

  private constructor() {
    this.startCleanupInterval();
    this.setupEventListeners();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ResourceManager3D {
    if (!ResourceManager3D.instance) {
      ResourceManager3D.instance = new ResourceManager3D();
    }
    return ResourceManager3D.instance;
  }

  /**
   * Request a resource from the pool or create new one
   */
  public requestResource<T>(request: ResourceRequest): T {
    this.requestCount++;
    
    const pool = this.getPoolForType(request.type);
    const existingResource = pool.get(request.id);
    
    if (existingResource && !existingResource.disposed) {
      // Resource exists in pool - update usage
      this.hitCount++;
      this.updateResourceUsage(existingResource, request.sceneId);
      return existingResource.resource as T;
    }
    
    // Create new resource
    const resource = request.factory();
    const metadata: ResourceMetadata = {
      id: request.id,
      type: request.type,
      size: this.estimateResourceSize(resource, request.type),
      lastUsed: Date.now(),
      useCount: 1,
      priority: request.priority,
      sceneIds: new Set([request.sceneId]),
      isShared: request.shared || false,
      memoryEstimate: request.memoryEstimate || this.estimateResourceSize(resource, request.type)
    };
    
    const pooledResource: PooledResource<T> = {
      resource,
      metadata,
      disposed: false
    };
    
    // Add to appropriate pool
    pool.set(request.id, pooledResource as any);
    
    // Update statistics
    this.updateStats();
    
    return resource;
  }

  /**
   * Release a resource (mark as no longer used by a scene)
   */
  public releaseResource(resourceId: string, sceneId: string): void {
    const pools = [
      this.geometryPool,
      this.materialPool,
      this.texturePool,
      this.shaderPool,
      this.meshPool
    ];
    
    for (const pool of pools) {
      const resource = pool.get(resourceId);
      if (resource) {
        resource.metadata.sceneIds.delete(sceneId);
        
        // If no scenes are using this resource and it's not shared, mark for cleanup
        if (resource.metadata.sceneIds.size === 0 && !resource.metadata.isShared) {
          resource.metadata.priority = 'low';
        }
        
        break;
      }
    }
    
    this.updateStats();
  }

  /**
   * Force cleanup of specific resource
   */
  public disposeResource(resourceId: string): boolean {
    const pools = [
      this.geometryPool,
      this.materialPool,
      this.texturePool,
      this.shaderPool,
      this.meshPool
    ];
    
    for (const pool of pools) {
      const resource = pool.get(resourceId);
      if (resource) {
        this.disposePooledResource(resource);
        pool.delete(resourceId);
        this.updateStats();
        return true;
      }
    }
    
    return false;
  }

  /**
   * Get current memory statistics
   */
  public getMemoryStats(): MemoryStats {
    this.updateStats();
    return { ...this.stats };
  }

  /**
   * Force immediate cleanup
   */
  public forceCleanup(): void {
    const beforeStats = this.getMemoryStats();
    
    this.performCleanup();
    
    const afterStats = this.getMemoryStats();
    const cleaned = beforeStats.totalAllocated - afterStats.totalAllocated;
    
    if (cleaned > 0) {
      this.performanceMonitor.emit('resources-cleaned', {
        memoryFreed: cleaned,
        resourcesRemoved: beforeStats.geometries + beforeStats.materials + beforeStats.textures - 
                          (afterStats.geometries + afterStats.materials + afterStats.textures)
      });
    }
  }

  /**
   * Update cleanup configuration
   */
  public updateCleanupConfig(config: Partial<CleanupConfig>): void {
    this.cleanupConfig = { ...this.cleanupConfig, ...config };
  }

  /**
   * Get resource usage by scene
   */
  public getSceneResourceUsage(sceneId: string): {
    geometries: number;
    materials: number;
    textures: number;
    totalMemory: number;
  } {
    const usage = {
      geometries: 0,
      materials: 0,
      textures: 0,
      totalMemory: 0
    };
    
    const pools = [
      { pool: this.geometryPool, type: 'geometries' },
      { pool: this.materialPool, type: 'materials' },
      { pool: this.texturePool, type: 'textures' },
      { pool: this.meshPool, type: 'meshes' },
      { pool: this.shaderPool, type: 'shaders' }
    ];
    
    for (const { pool, type } of pools) {
      for (const resource of pool.values()) {
        if (resource.metadata.sceneIds.has(sceneId)) {
          if (type in usage) {
            (usage as any)[type]++;
          }
          usage.totalMemory += resource.metadata.memoryEstimate;
        }
      }
    }
    
    return usage;
  }

  /**
   * Preload resources for a scene
   */
  public preloadSceneResources(sceneId: string, resources: ResourceRequest[]): Promise<void> {
    return new Promise((resolve) => {
      const loadPromises = resources.map(async (request) => {
        try {
          this.requestResource(request);
        } catch (error) {
          console.warn(`Failed to preload resource ${request.id}:`, error);
        }
      });
      
      Promise.all(loadPromises).then(() => resolve());
    });
  }

  /**
   * Get pool for resource type
   */
  private getPoolForType(type: string): Map<string, PooledResource<any>> {
    switch (type) {
      case 'geometry': return this.geometryPool;
      case 'material': return this.materialPool;
      case 'texture': return this.texturePool;
      case 'shader': return this.shaderPool;
      case 'mesh': return this.meshPool;
      default: throw new Error(`Unknown resource type: ${type}`);
    }
  }

  /**
   * Update resource usage metadata
   */
  private updateResourceUsage(resource: PooledResource, sceneId: string): void {
    resource.metadata.lastUsed = Date.now();
    resource.metadata.useCount++;
    resource.metadata.sceneIds.add(sceneId);
  }

  /**
   * Estimate resource memory size
   */
  private estimateResourceSize(resource: any, type: string): number {
    switch (type) {
      case 'geometry':
        if (resource && resource.attributes) {
          let size = 0;
          for (const attribute of Object.values(resource.attributes)) {
            if (attribute && (attribute as any).array) {
              size += (attribute as any).array.byteLength;
            }
          }
          if (resource.index && resource.index.array) {
            size += resource.index.array.byteLength;
          }
          return size;
        }
        return 1000; // Default estimate
        
      case 'texture':
        if (resource && resource.image) {
          const width = resource.image.width || 256;
          const height = resource.image.height || 256;
          const channels = 4; // RGBA
          return width * height * channels;
        }
        return 65536; // Default 256x256 RGBA
        
      case 'material':
        return 500; // Materials are relatively small
        
      case 'shader':
        return 1000; // Shader programs
        
      case 'mesh':
        return 100; // Mesh objects themselves are small
        
      default:
        return 1000;
    }
  }

  /**
   * Update memory statistics
   */
  private updateStats(): void {
    this.stats.geometries = this.geometryPool.size;
    this.stats.materials = this.materialPool.size;
    this.stats.textures = this.texturePool.size;
    this.stats.meshes = this.meshPool.size;
    this.stats.shaders = this.shaderPool.size;
    
    this.stats.totalAllocated = 0;
    this.stats.totalUsed = 0;
    
    const allPools = [
      this.geometryPool,
      this.materialPool,
      this.texturePool,
      this.shaderPool,
      this.meshPool
    ];
    
    for (const pool of allPools) {
      for (const resource of pool.values()) {
        this.stats.totalAllocated += resource.metadata.memoryEstimate;
        if (resource.metadata.sceneIds.size > 0) {
          this.stats.totalUsed += resource.metadata.memoryEstimate;
        }
      }
    }
    
    // Calculate pool hit rate
    this.stats.poolHitRate = this.requestCount > 0 ? (this.hitCount / this.requestCount) * 100 : 0;
  }

  /**
   * Perform cleanup based on configuration
   */
  private performCleanup(): void {
    const now = Date.now();
    const pools = [
      this.geometryPool,
      this.materialPool,
      this.texturePool,
      this.shaderPool,
      this.meshPool
    ];
    
    let resourcesRemoved = 0;
    let memoryFreed = 0;
    
    for (const pool of pools) {
      const toRemove: string[] = [];
      
      for (const [id, resource] of pool) {
        const idleTime = now - resource.metadata.lastUsed;
        const maxIdleTime = this.cleanupConfig.priorityThresholds[resource.metadata.priority];
        
        // Remove if idle too long or if we're over memory limit
        if (idleTime > maxIdleTime || 
            (this.stats.totalAllocated / (1024 * 1024) > this.cleanupConfig.maxMemoryUsage)) {
          
          // Don't remove high priority resources that are still in use
          if (resource.metadata.priority === 'high' && resource.metadata.sceneIds.size > 0) {
            continue;
          }
          
          toRemove.push(id);
          memoryFreed += resource.metadata.memoryEstimate;
          resourcesRemoved++;
        }
      }
      
      // Remove marked resources
      for (const id of toRemove) {
        const resource = pool.get(id);
        if (resource) {
          this.disposePooledResource(resource);
          pool.delete(id);
        }
      }
    }
    
    this.stats.lastCleanup = now;
    this.updateStats();
    
    if (resourcesRemoved > 0) {
      console.log(`ResourceManager: Cleaned up ${resourcesRemoved} resources, freed ${(memoryFreed / (1024 * 1024)).toFixed(2)}MB`);
    }
  }

  /**
   * Dispose a pooled resource properly
   */
  private disposePooledResource(resource: PooledResource): void {
    if (resource.disposed) return;
    
    try {
      // Dispose Three.js resources properly
      if (resource.resource && typeof resource.resource.dispose === 'function') {
        resource.resource.dispose();
      }
      
      resource.disposed = true;
      resource.metadata.sceneIds.clear();
    } catch (error) {
      console.warn('Error disposing resource:', error);
    }
  }

  /**
   * Start cleanup interval
   */
  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(() => {
      this.performCleanup();
    }, this.cleanupConfig.cleanupInterval);
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Listen for performance alerts
    this.performanceMonitor.on('performance-alert', (alert) => {
      if (alert.action === 'cleanup-memory') {
        this.forceCleanup();
      }
    });
    
    // Listen for quality changes
    this.performanceMonitor.on('quality-reduced', () => {
      // More aggressive cleanup when quality is reduced
      this.cleanupConfig.maxMemoryUsage *= 0.8;
      this.forceCleanup();
    });
    
    this.performanceMonitor.on('quality-improved', () => {
      // Less aggressive cleanup when quality improves
      this.cleanupConfig.maxMemoryUsage *= 1.2;
    });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      this.destroy();
    });
  }

  /**
   * Destroy resource manager
   */
  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    
    // Dispose all resources
    const allPools = [
      this.geometryPool,
      this.materialPool,
      this.texturePool,
      this.shaderPool,
      this.meshPool
    ];
    
    for (const pool of allPools) {
      for (const resource of pool.values()) {
        this.disposePooledResource(resource);
      }
      pool.clear();
    }
    
    this.updateStats();
    ResourceManager3D.instance = null;
  }
}

/**
 * Export singleton instance getter
 */
export const getResourceManager = () => ResourceManager3D.getInstance();

