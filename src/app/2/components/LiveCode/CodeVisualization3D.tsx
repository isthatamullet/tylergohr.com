'use client';

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, OrbitControls, Box, Sphere, Cylinder, Line } from '@react-three/drei';
import * as THREE from 'three';
import { VisualizationData, React3DVisualizationProps } from './types';
import styles from './CodeVisualization3D.module.css';

// Data structure visualization component
function DataStructureVisualization({ data, interactive = true }: { data: any; interactive?: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useFrame((state) => {
    if (meshRef.current && !interactive) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const renderArray = (arr: any[], startPosition: [number, number, number] = [0, 0, 0]) => {
    return arr.map((item, index) => (
      <group key={index} position={[startPosition[0] + index * 2, startPosition[1], startPosition[2]]}>
        <Box
          args={[1.5, 1.5, 1.5]}
          onPointerOver={() => setHoveredIndex(index)}
          onPointerOut={() => setHoveredIndex(null)}
          scale={hoveredIndex === index ? 1.1 : 1}
        >
          <meshStandardMaterial
            color={hoveredIndex === index ? '#10b981' : '#3b82f6'}
            transparent
            opacity={0.8}
          />
        </Box>
        <Text
          position={[0, 0, 0.8]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {String(item).substring(0, 10)}
        </Text>
        <Text
          position={[0, -1, 0]}
          fontSize={0.2}
          color="#888"
          anchorX="center"
          anchorY="middle"
        >
          [{index}]
        </Text>
      </group>
    ));
  };

  const renderObject = (obj: Record<string, any>, startPosition: [number, number, number] = [0, 0, 0]) => {
    const entries = Object.entries(obj);
    return entries.map(([key, value], index) => (
      <group key={key} position={[startPosition[0], startPosition[1] - index * 2, startPosition[2]]}>
        <Cylinder args={[0.8, 0.8, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#ec4899" transparent opacity={0.8} />
        </Cylinder>
        <Text
          position={[-2, 0, 0]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {key}
        </Text>
        <Text
          position={[2, 0, 0]}
          fontSize={0.25}
          color="#ccc"
          anchorX="center"
          anchorY="middle"
        >
          {String(value).substring(0, 15)}
        </Text>
        <Line
          points={[[-1.5, 0, 0], [1.5, 0, 0]]}
          color="#666"
          lineWidth={2}
        />
      </group>
    ));
  };

  const visualizationElements = useMemo(() => {
    if (Array.isArray(data)) {
      return renderArray(data);
    } else if (typeof data === 'object' && data !== null) {
      return renderObject(data);
    } else {
      return (
        <group>
          <Sphere args={[1]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#f59e0b" />
          </Sphere>
          <Text position={[0, -2, 0]} fontSize={0.3} color="white" anchorX="center">
            {String(data)}
          </Text>
        </group>
      );
    }
  }, [data, hoveredIndex]);

  return (
    <group ref={meshRef}>
      {visualizationElements}
    </group>
  );
}

// Chart visualization component
function ChartVisualization({ data }: { data: any }) {
  const meshRef = useRef<THREE.Group>(null);
  const { size } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const chartData = useMemo(() => {
    if (data?.rows && Array.isArray(data.rows)) {
      return data.rows.slice(0, 10); // Limit to 10 items for performance
    }
    return [];
  }, [data]);

  const maxValue = useMemo(() => {
    return Math.max(...chartData.map((item: any) => item.revenue || item.total_orders || 1));
  }, [chartData]);

  const bars = chartData.map((item: any, index: number) => {
    const value = item.revenue || item.total_orders || 0;
    const height = (value / maxValue) * 5;
    const color = new THREE.Color().setHSL(index / chartData.length, 0.7, 0.6);

    return (
      <group key={index} position={[index * 2 - chartData.length, 0, 0]}>
        <Box args={[1.5, height, 1]} position={[0, height / 2, 0]}>
          <meshStandardMaterial color={color} />
        </Box>
        <Text
          position={[0, height + 1, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          rotation={[-Math.PI / 6, 0, 0]}
        >
          {item.company_name?.substring(0, 10) || `Item ${index + 1}`}
        </Text>
        <Text
          position={[0, -1, 0]}
          fontSize={0.15}
          color="#888"
          anchorX="center"
          anchorY="middle"
        >
          {value.toLocaleString()}
        </Text>
      </group>
    );
  });

  return (
    <group ref={meshRef}>
      {bars}
      {/* Chart base */}
      <Box args={[chartData.length * 2 + 2, 0.1, 3]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#333" />
      </Box>
    </group>
  );
}

// Component preview visualization
function ComponentVisualization({ data }: { data: any }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Simulated component structure */}
      <group position={[0, 2, 0]}>
        <Box args={[4, 0.5, 3]}>
          <meshStandardMaterial color="#1f2937" />
        </Box>
        <Text position={[0, 0, 1.6]} fontSize={0.3} color="white" anchorX="center">
          Header Component
        </Text>
      </group>
      
      <group position={[-1.5, 0, 0]}>
        <Box args={[2, 3, 2]}>
          <meshStandardMaterial color="#3b82f6" transparent opacity={0.8} />
        </Box>
        <Text position={[0, 0, 1.1]} fontSize={0.2} color="white" anchorX="center">
          Sidebar
        </Text>
      </group>
      
      <group position={[1, 0, 0]}>
        <Box args={[3, 3, 2]}>
          <meshStandardMaterial color="#10b981" transparent opacity={0.8} />
        </Box>
        <Text position={[0, 0, 1.1]} fontSize={0.2} color="white" anchorX="center">
          Main Content
        </Text>
      </group>
      
      <group position={[0, -2, 0]}>
        <Box args={[4, 0.5, 3]}>
          <meshStandardMaterial color="#6b7280" />
        </Box>
        <Text position={[0, 0, 1.6]} fontSize={0.3} color="white" anchorX="center">
          Footer Component
        </Text>
      </group>
    </group>
  );
}

// Architecture visualization
function ArchitectureVisualization({ data }: { data: any }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Frontend Layer */}
      <group position={[0, 3, 0]}>
        <Box args={[5, 1, 2]}>
          <meshStandardMaterial color="#3b82f6" />
        </Box>
        <Text position={[0, 0, 1.1]} fontSize={0.3} color="white" anchorX="center">
          Frontend (React)
        </Text>
      </group>

      {/* API Layer */}
      <group position={[0, 1, 0]}>
        <Box args={[4, 1, 2]}>
          <meshStandardMaterial color="#10b981" />
        </Box>
        <Text position={[0, 0, 1.1]} fontSize={0.3} color="white" anchorX="center">
          API Layer
        </Text>
      </group>

      {/* Database Layer */}
      <group position={[0, -1, 0]}>
        <Cylinder args={[2, 2, 1]}>
          <meshStandardMaterial color="#f59e0b" />
        </Cylinder>
        <Text position={[0, 0, 1.1]} fontSize={0.3} color="white" anchorX="center">
          Database
        </Text>
      </group>

      {/* Connection lines */}
      <Line points={[[0, 2.5, 0], [0, 1.5, 0]]} color="#666" lineWidth={3} />
      <Line points={[[0, 0.5, 0], [0, -0.5, 0]]} color="#666" lineWidth={3} />
    </group>
  );
}

// Performance metrics visualization
function PerformanceVisualization({ data }: { data: any }) {
  const meshRef = useRef<THREE.Group>(null);
  const [animationPhase, setAnimationPhase] = useState(0);

  useFrame((state) => {
    if (meshRef.current) {
      setAnimationPhase(state.clock.elapsedTime);
    }
  });

  const metrics = [
    { name: 'CPU Usage', value: 65, color: '#ef4444', position: [-3, 0, 0] },
    { name: 'Memory', value: 80, color: '#f59e0b', position: [0, 0, 0] },
    { name: 'Response Time', value: 45, color: '#10b981', position: [3, 0, 0] },
  ];

  return (
    <group ref={meshRef}>
      {metrics.map((metric, index) => {
        const height = (metric.value / 100) * 3;
        const animatedHeight = height * (0.5 + 0.5 * Math.sin(animationPhase + index));
        
        return (
          <group key={metric.name} position={metric.position as [number, number, number]}>
            <Cylinder args={[0.5, 0.5, animatedHeight]} position={[0, animatedHeight / 2, 0]}>
              <meshStandardMaterial color={metric.color} transparent opacity={0.8} />
            </Cylinder>
            <Text
              position={[0, animatedHeight + 1, 0]}
              fontSize={0.2}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {metric.name}
            </Text>
            <Text
              position={[0, -1, 0]}
              fontSize={0.15}
              color="#888"
              anchorX="center"
              anchorY="middle"
            >
              {metric.value}%
            </Text>
          </group>
        );
      })}
    </group>
  );
}

// Main 3D visualization component
export default function CodeVisualization3D({
  data,
  type,
  interactive = true,
  autoRotate = false,
  showControls = true,
  onInteraction,
  className
}: React3DVisualizationProps & { className?: string }) {
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setIsWebGLSupported(!!gl);
    } catch (e) {
      setIsWebGLSupported(false);
      setError('WebGL is not supported in this browser');
    }
  }, []);

  const renderVisualization = () => {
    switch (type) {
      case 'data-structure':
        return <DataStructureVisualization data={data} interactive={interactive} />;
      case 'chart':
        return <ChartVisualization data={data} />;
      case 'component':
        return <ComponentVisualization data={data} />;
      case 'architecture':
        return <ArchitectureVisualization data={data} />;
      case 'performance':
        return <PerformanceVisualization data={data} />;
      default:
        return <DataStructureVisualization data={data} interactive={interactive} />;
    }
  };

  if (!isWebGLSupported) {
    return (
      <div className={`${styles.fallback} ${className || ''}`}>
        <div className={styles.fallbackContent}>
          <div className={styles.fallbackIcon}>📊</div>
          <h3>3D Visualization Unavailable</h3>
          <p>{error || 'WebGL is required for 3D visualizations'}</p>
          <div className={styles.dataPreview}>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.visualization3D} ${className || ''}`}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000', 0);
        }}
        onError={() => setError('3D rendering error occurred')}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {renderVisualization()}
        
        {showControls && (
          <OrbitControls
            enablePan={interactive}
            enableZoom={interactive}
            enableRotate={interactive}
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
            maxDistance={20}
            minDistance={5}
          />
        )}
      </Canvas>
      
      <div className={styles.visualizationInfo}>
        <span className={styles.typeLabel}>{type.replace('-', ' ').toUpperCase()}</span>
        {interactive && (
          <span className={styles.interactionHint}>
            Drag to rotate • Scroll to zoom
          </span>
        )}
      </div>
    </div>
  );
}