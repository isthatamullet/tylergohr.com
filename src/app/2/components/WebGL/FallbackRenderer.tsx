'use client';

import { ReactNode } from 'react';
import { useDeviceCapabilities } from '../../hooks/useWebGL';

interface FallbackRendererProps {
  children: ReactNode;
  fallback?: ReactNode;
  lowPerformanceFallback?: ReactNode;
  unsupportedFallback?: ReactNode;
}

export const FallbackRenderer = ({
  children,
  fallback,
  lowPerformanceFallback,
  unsupportedFallback,
}: FallbackRendererProps) => {
  const capabilities = useDeviceCapabilities();

  // WebGL not supported at all
  if (!capabilities.supported) {
    return (
      <div data-webgl="unsupported">
        {unsupportedFallback || fallback || children}
      </div>
    );
  }

  // WebGL supported but low performance
  if (capabilities.shouldUseReducedEffects) {
    return (
      <div data-webgl="reduced">
        {lowPerformanceFallback || fallback || children}
      </div>
    );
  }

  // Full WebGL support
  return (
    <div data-webgl="supported">
      {children}
    </div>
  );
};

// Specific fallback components for different scenarios
export const NetworkFallback = () => (
  <div style={{
    width: '100%',
    height: '200px',
    background: 'linear-gradient(45deg, #1a1a1a, #2a2a2a)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    border: '1px solid #333',
  }}>
    <p style={{ color: '#888', fontSize: '14px' }}>
      Network visualization (2D fallback)
    </p>
  </div>
);

export const ProjectCardFallback = () => (
  <div style={{
    width: '100%',
    height: '300px',
    background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    border: '1px solid #333',
  }}>
    <p style={{ color: '#888', fontSize: '14px' }}>
      Project showcase (2D fallback)
    </p>
  </div>
);

// Progressive enhancement wrapper
export const ProgressiveEnhancement = ({ 
  children, 
  enhance2D,
  enhance3D 
}: {
  children: ReactNode;
  enhance2D?: ReactNode;
  enhance3D?: ReactNode;
}) => {
  const capabilities = useDeviceCapabilities();

  if (!capabilities.supported) {
    return <>{children}</>;
  }

  if (capabilities.shouldUseReducedEffects) {
    return <>{enhance2D || children}</>;
  }

  return <>{enhance3D || children}</>;
};