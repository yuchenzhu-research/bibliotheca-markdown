import { useMemo, useRef, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

type ExplosionMode = 'linear' | 'random' | 'blend';

// Custom shader uniforms type
interface ShaderUniforms {
  uTime: { value: number };
  uProgress: { value: number };
  uMode: { value: number };
  uResolution: { value: THREE.Vector2 };
  uPointSize: { value: number };
  uPixelRatio: { value: number };
  uTexture: { value: THREE.Texture | null };
  uColorIntensity: { value: number };
  uResidual: { value: number };
  uLinearDirection: { value: THREE.Vector3 };
  uLinearStrength: { value: number };
  uGlitchAmount: { value: number };
  uNoiseScale: { value: number };
  uNoiseStrength: { value: number };
  uMouse: { value: THREE.Vector2 };
  uMouseInfluence: { value: number };
}

interface UseExplosionControlProps {
  mode?: ExplosionMode;
  intensity?: number;
  mouseInfluence?: boolean;
}

export function useExplosionControl({
  mode = 'linear',
  intensity = 1.0,
  mouseInfluence = true,
}: UseExplosionControlProps = {}) {
  const { size, viewport } = useThree();
  const uniformsRef = useRef<ShaderUniforms | null>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const targetModeRef = useRef(mode);
  const currentModeRef = useRef(mode);

  // Smooth mode transition
  const modeTransitionRef = useRef(0);

  // Initialize uniform reference
  const setUniforms = useCallback((uniforms: ShaderUniforms) => {
    uniformsRef.current = uniforms;
  }, []);

  // Mouse movement handler
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!mouseInfluence) return;
    // Normalize to [-1, 1]
    mouseRef.current.x = (e.clientX / size.width) * 2 - 1;
    mouseRef.current.y = -(e.clientY / size.height) * 2 + 1;
  }, [size, mouseInfluence]);

  // Mode switching (with transition)
  const setMode = useCallback((newMode: ExplosionMode) => {
    targetModeRef.current = newMode;
  }, []);

  // GSAP animation transition
  const animateModeTransition = useCallback((toMode: ExplosionMode, duration = 1.2) => {
    const startValue = { value: currentModeRef.current === 'linear' ? 0 : 1 };
    const endValue = { value: toMode === 'linear' ? 0 : 1 };

    gsap.to(startValue, {
      value: endValue.value,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (uniformsRef.current) {
          uniformsRef.current.uMode.value = startValue.value;
        }
        currentModeRef.current = startValue.value < 0.5 ? 'linear' : 'random';
      },
    });
  }, []);

  // Frame loop update
  useFrame((state) => {
    if (!uniformsRef.current) return;

    const u = uniformsRef.current;

    // Update time
    u.uTime.value = state.clock.elapsedTime;

    // Smooth mode transition
    const targetModeValue = targetModeRef.current === 'random' ? 1 : 0;
    modeTransitionRef.current = THREE.MathUtils.lerp(
      modeTransitionRef.current,
      targetModeValue,
      0.05
    );
    u.uMode.value = modeTransitionRef.current;

    // Mouse perturbation
    if (mouseInfluence) {
      mouseRef.current.x = THREE.MathUtils.lerp(mouseRef.current.x, 0, 0.02);
      mouseRef.current.y = THREE.MathUtils.lerp(mouseRef.current.y, 0, 0.02);
      u.uMouse.value.lerp(mouseRef.current, 0.1);
    }

    // Auto intensity modulation
    u.uNoiseStrength.value = THREE.MathUtils.lerp(
      u.uNoiseStrength.value,
      intensity * 3.0,
      0.02
    );
  });

  // Bind global mouse events
  useMemo(() => {
    if (typeof window !== 'undefined' && mouseInfluence) {
      window.addEventListener('mousemove', onMouseMove);
      return () => window.removeEventListener('mousemove', onMouseMove);
    }
  }, [onMouseMove, mouseInfluence]);

  return {
    setUniforms,
    setMode,
    animateModeTransition,
    mode: currentModeRef.current,
  };
}