'use client';

import React, { Suspense } from 'react';
import { Scene, WebGLDetection } from '../WebGL';
import { ProjectCardFallback } from '../WebGL/FallbackRenderer';
import type { CaseStudy } from './CaseStudiesPreview';
import { useDeviceCapabilities } from '../../hooks/useWebGL';

// Lazy load 3D components
const CaseStudyCard3D = React.lazy(() => import('./CaseStudyCard3D'));

interface CaseStudies3DSceneProps {
  caseStudies: CaseStudy[];
  isVisible: boolean;
  className?: string;
}

/**
 * CaseStudies3DScene Component - WebGL scene for 3D case study cards
 * 
 * Features:
 * - Progressive enhancement with 2D fallback
 * - Grid positioning for 4 case study cards
 * - Performance-optimized rendering
 * - Device-adaptive quality settings
 */
export const CaseStudies3DScene: React.FC<CaseStudies3DSceneProps> = ({
  caseStudies,
  isVisible,
  className
}) => {
  const capabilities = useDeviceCapabilities();

  // Calculate grid positions for 4 cards (2x2 grid)
  const getCardPosition = (index: number): [number, number, number] => {
    const spacing = capabilities.mobile ? 2.5 : 3;
    const row = Math.floor(index / 2);
    const col = index % 2;
    
    return [
      (col - 0.5) * spacing, // X: left/right
      (0.5 - row) * spacing, // Y: top/bottom (inverted)
      0 // Z: depth
    ];
  };

  return (
    <div className={className} style={{ width: '100%', height: '600px' }}>
      <WebGLDetection
        fallback={<ProjectCardFallback />}
        onCapabilitiesDetected={(caps) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('Case Studies 3D capabilities:', caps);
          }
        }}
      >
        <Scene
          fallback={<ProjectCardFallback />}
        >
          <Suspense fallback={<ProjectCardFallback />}>
            {/* Enhanced lighting for card visibility */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <directionalLight position={[-5, -5, 5]} intensity={0.4} />
            
            {/* Render 3D cards */}
            {caseStudies.map((caseStudy, index) => (
              <CaseStudyCard3D
                key={caseStudy.id}
                caseStudy={caseStudy}
                position={getCardPosition(index)}
                cardIndex={index}
                isVisible={isVisible}
                animationDelay={index * 150} // Staggered animation
              />
            ))}
            
            {/* Subtle background elements for depth */}
            {capabilities.performance === 'high' && (
              <>
                {/* Background grid for context */}
                <gridHelper 
                  args={[10, 10, '#333333', '#222222']} 
                  position={[0, -2, -2]}
                  rotation={[Math.PI / 2, 0, 0]}
                />
              </>
            )}
          </Suspense>
        </Scene>
      </WebGLDetection>
    </div>
  );
};

export default CaseStudies3DScene;