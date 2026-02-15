"use client";

import React, { useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import PhotoParticles from './PhotoParticles';
import { useExplosionControl } from '@/hooks/useExplosionControl';

interface Canvas3DProps {
  imageUrl: string;
  scrollProgress?: number; // Controlled by parent scroll
}

function Scene({ imageUrl, scrollProgress = 0 }: Canvas3DProps) {
  const texture = useLoader(TextureLoader, imageUrl);
  const { mode, progress, bindScroll } = useExplosionControl();

  // Sync scroll progress to explosion hook
  useEffect(() => {
    bindScroll(scrollProgress);
  }, [scrollProgress, bindScroll]);

  return (
    <>
      <color attach="background" args={['#0e0e0e']} />
      <ambientLight intensity={0.5} />

      <PhotoParticles
        texture={texture}
        progress={progress} // Pass the MotionValue object directly!
        mode={mode}
        width={10}
      />
    </>
  );
}

// Wrapper to handle React context bridging
export default function Canvas3D({ imageUrl, scrollProgress = 0 }: Canvas3DProps) {
  return (
    <div className="fixed inset-0 top-0 left-0 w-full h-full -z-10 bg-black pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Scene imageUrl={imageUrl} scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}