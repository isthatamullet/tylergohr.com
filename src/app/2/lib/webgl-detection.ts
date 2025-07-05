/**
 * WebGL Detection Utility for Phase 2.2
 * 
 * Provides reliable WebGL support detection with fallback strategies
 * for the Tyler Gohr Portfolio /2 redesign WebGL integration.
 * 
 * Used by React Three Fiber components to determine whether to render
 * 3D content or fall back to 2D alternatives.
 */

export interface WebGLCapabilities {
  webgl: boolean;
  webgl2: boolean;
  maxTextureSize: number;
  vendor: string;
  renderer: string;
  performanceLevel: 'high' | 'medium' | 'low' | 'unavailable';
}

/**
 * Detects WebGL support and capabilities in the current browser
 */
export function detectWebGLSupport(): WebGLCapabilities {
  // Default fallback capabilities
  const fallbackCapabilities: WebGLCapabilities = {
    webgl: false,
    webgl2: false,
    maxTextureSize: 0,
    vendor: 'unknown',
    renderer: 'unavailable',
    performanceLevel: 'unavailable'
  };

  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return fallbackCapabilities;
  }

  try {
    // Create a test canvas element
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null || 
               canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    const gl2 = canvas.getContext('webgl2') as WebGL2RenderingContext | null;

    if (!gl) {
      return fallbackCapabilities;
    }

    // Get WebGL info
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const vendor = debugInfo 
      ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) 
      : gl.getParameter(gl.VENDOR);
    const renderer = debugInfo 
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) 
      : gl.getParameter(gl.RENDERER);

    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

    // Determine performance level based on renderer info
    const performanceLevel = determinePerformanceLevel(renderer, maxTextureSize);

    // Clean up
    canvas.remove();

    return {
      webgl: true,
      webgl2: !!gl2,
      maxTextureSize,
      vendor: vendor || 'unknown',
      renderer: renderer || 'unknown',
      performanceLevel
    };

  } catch (error) {
    console.warn('WebGL detection failed:', error);
    return fallbackCapabilities;
  }
}

/**
 * Determines the performance level based on GPU capabilities
 */
function determinePerformanceLevel(
  renderer: string, 
  maxTextureSize: number
): 'high' | 'medium' | 'low' | 'unavailable' {
  if (!renderer || maxTextureSize < 1024) {
    return 'unavailable';
  }

  const rendererLower = renderer.toLowerCase();

  // High-performance indicators
  if (
    rendererLower.includes('nvidia') ||
    rendererLower.includes('amd') ||
    rendererLower.includes('radeon') ||
    rendererLower.includes('geforce') ||
    maxTextureSize >= 8192
  ) {
    return 'high';
  }

  // Medium-performance indicators  
  if (
    rendererLower.includes('intel') ||
    rendererLower.includes('apple') ||
    maxTextureSize >= 4096
  ) {
    return 'medium';
  }

  // Low-performance fallback
  return 'low';
}

/**
 * Simple WebGL availability check for components
 */
export function isWebGLAvailable(): boolean {
  const capabilities = detectWebGLSupport();
  return capabilities.webgl;
}

/**
 * Check if WebGL performance is suitable for 3D content
 */
export function isWebGLPerformanceSuitable(): boolean {
  const capabilities = detectWebGLSupport();
  return capabilities.performanceLevel === 'high' || capabilities.performanceLevel === 'medium';
}

/**
 * Get a performance-appropriate configuration for 3D scenes
 * Now with safe window access to prevent SSR crashes
 */
export function getWebGLConfig() {
  const capabilities = detectWebGLSupport();
  
  // Safe window access - prevent SSR crashes
  const getPixelRatio = (maxRatio: number) => {
    if (typeof window === 'undefined') return 1;
    return Math.min(window.devicePixelRatio || 1, maxRatio);
  };
  
  switch (capabilities.performanceLevel) {
    case 'high':
      return {
        antialias: true,
        shadows: true,
        maxLights: 4,
        pixelRatio: getPixelRatio(2)
      };
    
    case 'medium':
      return {
        antialias: true,
        shadows: false,
        maxLights: 2,
        pixelRatio: getPixelRatio(1.5)
      };
    
    case 'low':
      return {
        antialias: false,
        shadows: false,
        maxLights: 1,
        pixelRatio: 1
      };
    
    default:
      return null; // No WebGL config - use fallback
  }
}

/**
 * Mobile device detection for WebGL performance optimization
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Comprehensive WebGL readiness check for Enterprise components
 * Fixed to work in production environments (Cloud Run, etc.)
 */
export function isWebGLReady(): boolean {
  // Safe browser environment check
  if (typeof window === 'undefined') {
    return false; // SSR environment - always use fallback
  }

  // Only block in actual automated testing environments
  // Removed production-blocking navigator.webdriver check that was breaking Cloud Run
  if (typeof window !== 'undefined' && window.location.href.includes('localhost:')) {
    // Only block specific testing ports to avoid blocking development
    const testingPorts = ['9323', '4444', '5555']; // Playwright/testing ports
    const currentPort = window.location.port;
    if (testingPorts.includes(currentPort)) {
      return false; // Automated testing environment
    }
  }

  // Check basic WebGL support
  if (!isWebGLAvailable()) {
    return false;
  }

  // On mobile, only allow high-performance GPUs for better UX
  if (isMobileDevice()) {
    const capabilities = detectWebGLSupport();
    return capabilities.performanceLevel === 'high';
  }

  // On desktop, allow medium and high performance
  return isWebGLPerformanceSuitable();
}