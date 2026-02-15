"use client";

import { useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useTexture, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import PhotoParticles from './PhotoParticles';
import { scrollProgressRef } from '../ui/SmoothScrollWrapper';

interface Canvas3DProps {
  imageUrl?: string;
  className?: string;
}

interface SceneProps {
  imageUrl: string;
}

function Scene({ imageUrl }: SceneProps) {
  const texture = useTexture(imageUrl);
  const particlesRef = useRef<THREE.Points>(null);
  const uniformsRef = useRef<any>(null);
  const scroll = useScroll();

  // Configure texture
  useEffect(() => {
    if (texture) {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
    }
  }, [texture]);

  // Sync shader uniforms with scroll
  useFrame(() => {
    if (uniformsRef.current) {
      // Map scroll progress to particle deconstruction
      // For example, particles deconstruct as user scrolls
      const targetProgress = scroll.offset * 2; // deconstructed by scroll end
      uniformsRef.current.uProgress.value = THREE.MathUtils.lerp(
        uniformsRef.current.uProgress.value,
        Math.min(targetProgress, 1),
        0.05
      );

      // Optional: Mode transition based on scroll position
      // Linear mode first, then transition to random as you scroll further
      const targetMode = scroll.offset > 0.5 ? 1 : 0;
      uniformsRef.current.uMode.value = THREE.MathUtils.lerp(
        uniformsRef.current.uMode.value,
        targetMode,
        0.02
      );
    }
  });

  return (
    <PhotoParticles
      ref={particlesRef}
      texture={texture}
      width={512}
      height={512}
      progress={0}
      mode={0}
      pointSize={2.0}
      onReady={(uniforms) => {
        uniformsRef.current = uniforms;
      }}
    />
  );
}

export default function Canvas3D({ imageUrl = '/archive/euclid.jpg', className = '' }: Canvas3DProps) {
  return (
    <div
      className={`fixed inset-0 -z-30 ${className}`}
      style={{ pointerEvents: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 0, 500], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene imageUrl={imageUrl} />
        </Suspense>
      </Canvas>
    </div>
  );
}