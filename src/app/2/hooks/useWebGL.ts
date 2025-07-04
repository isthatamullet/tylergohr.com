'use client';

import { useState, useEffect } from 'react';

export interface WebGLCapabilities {
  supported: boolean;
  renderer: string;
  maxTextureSize: number;
  performance: 'high' | 'medium' | 'low';
  mobile: boolean;
}

export const useWebGL = (): WebGLCapabilities => {
  const [capabilities, setCapabilities] = useState<WebGLCapabilities>({
    supported: false,
    renderer: 'none',
    maxTextureSize: 0,
    performance: 'low',
    mobile: false,
  });

  useEffect(() => {
    const detectWebGL = (): WebGLCapabilities => {
      // Mobile detection
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      // Create canvas for WebGL detection
      const canvas = document.createElement('canvas');
      let gl: WebGLRenderingContext | null = null;

      try {
        gl = canvas.getContext('webgl') as WebGLRenderingContext || 
             canvas.getContext('experimental-webgl') as WebGLRenderingContext;
      } catch (e) {
        console.warn('WebGL detection failed:', e);
      }

      if (!gl) {
        return {
          supported: false,
          renderer: 'none',
          maxTextureSize: 0,
          performance: 'low',
          mobile: isMobile,
        };
      }

      // Get renderer info
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = debugInfo 
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'unknown'
        : gl.getParameter(gl.RENDERER) || 'unknown';

      // Get max texture size
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0;

      // Assess performance level
      const assessPerformance = (): 'high' | 'medium' | 'low' => {
        // Mobile devices default to medium/low performance
        if (isMobile) {
          return maxTextureSize >= 4096 ? 'medium' : 'low';
        }

        // Desktop performance assessment
        const rendererLower = renderer.toLowerCase();
        
        // High-end GPUs
        if (
          rendererLower.includes('nvidia') ||
          rendererLower.includes('amd') ||
          rendererLower.includes('radeon') ||
          rendererLower.includes('geforce')
        ) {
          return maxTextureSize >= 8192 ? 'high' : 'medium';
        }

        // Intel integrated graphics
        if (rendererLower.includes('intel')) {
          return maxTextureSize >= 4096 ? 'medium' : 'low';
        }

        // Default assessment based on texture size
        if (maxTextureSize >= 8192) return 'high';
        if (maxTextureSize >= 4096) return 'medium';
        return 'low';
      };

      // Clean up
      canvas.remove();

      return {
        supported: true,
        renderer,
        maxTextureSize,
        performance: assessPerformance(),
        mobile: isMobile,
      };
    };

    setCapabilities(detectWebGL());
  }, []);

  return capabilities;
};

// Additional utility hooks
export const useDeviceCapabilities = () => {
  const webgl = useWebGL();

  return {
    ...webgl,
    // Derived capabilities
    canHandle3D: webgl.supported && webgl.performance !== 'low',
    shouldUseReducedEffects: webgl.mobile || webgl.performance === 'low',
    recommendedParticleCount: webgl.performance === 'high' ? 100 : webgl.performance === 'medium' ? 50 : 25,
  };
};