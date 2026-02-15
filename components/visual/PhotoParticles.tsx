"use client";

import React, { useRef, useMemo, useEffect, forwardRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createParticleGeometry } from '../../utils/geometry';

// ============================================
// Vertex Shader (inline for Next.js compatibility)
// ============================================
const particleVertexShader = `
uniform float uTime;
uniform float uProgress;
uniform float uMode;
uniform vec2 uResolution;
uniform float uPointSize;
uniform float uPixelRatio;
uniform float uResidual;
uniform vec3 uLinearDirection;
uniform float uLinearStrength;
uniform float uGlitchAmount;
uniform float uNoiseScale;
uniform float uNoiseStrength;
uniform vec2 uMouse;
uniform float uMouseInfluence;

attribute vec2 index;
attribute float shuffledIndex;
attribute vec3 randomDirection;

varying vec2 vUv;
varying float vProgress;
varying float vMode;

// Simplex Noise 3D
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

vec3 curlNoise(vec3 p) {
  float eps = 0.001;
  float n1 = snoise(vec3(p.x, p.y + eps, p.z));
  float n2 = snoise(vec3(p.x, p.y - eps, p.z));
  float n3 = snoise(vec3(p.x, p.y, p.z + eps));
  float n4 = snoise(vec3(p.x, p.y, p.z - eps));
  float n5 = snoise(vec3(p.x + eps, p.y, p.z));
  float n6 = snoise(vec3(p.x - eps, p.y, p.z));
  float x = n2 - n1; float y = n4 - n3; float z = n5 - n6;
  return normalize(vec3(y, z, x));
}

void main() {
  vUv = uv; vProgress = uProgress; vMode = uMode;
  vec3 originalPos = position;

  float gridX = mod(index, 512.0);
  float gridY = floor(index / 512.0);

  // Linear Mode
  float zDisplacement = uLinearDirection.z * uProgress * uLinearStrength;
  float glitchPhase = sin(gridY * 0.1 + uTime * 2.0) * cos(gridX * 0.1);
  float glitchOffset = step(0.8, glitchPhase) * uGlitchAmount * uProgress;
  float yFlow = uLinearDirection.y * uProgress * uLinearStrength * 0.5;
  float xyScale = 1.0 + uProgress * 0.3;
  float xyDistort = sin(gridX * 0.05 + uTime) * uProgress * 0.5;

  vec3 linearPos = originalPos;
  linearPos.x = (linearPos.x + glitchOffset) * xyScale + xyDistort;
  linearPos.y = linearPos.y * xyScale + yFlow;
  linearPos.z += zDisplacement;

  // Random Mode
  float noiseInput = shuffledIndex * 0.001 + uTime * 0.1;
  vec3 curl = curlNoise(vec3(noiseInput, noiseInput * 0.5, uTime * 0.2));
  float sphericalDispersion = uProgress * uNoiseStrength * 8.0;
  vec3 randomOffset = randomDirection * sphericalDispersion;
  vec3 crawlEffect = curl * uProgress * uNoiseStrength * 2.0;
  vec3 randomPos = originalPos + randomOffset + crawlEffect;

  // Blend
  vec3 finalPos = mix(linearPos, randomPos, uMode);

  // Mouse interaction
  vec2 screenPos = finalPos.xy / uResolution * 2.0;
  float mouseDist = length(screenPos - uMouse);
  float mouseEffect = smoothstep(0.5, 0.0, mouseDist) * uMouseInfluence * (1.0 - uProgress);
  finalPos.x += (finalPos.x - uMouse.x * uResolution.x * 0.5) * mouseEffect;
  finalPos.y += (finalPos.y - uMouse.y * uResolution.y * 0.5) * mouseEffect;

  vec3 pos = mix(finalPos, originalPos, uResidual * (1.0 - uProgress * 0.5));
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float sizeAttenuation = 300.0 / -mvPosition.z;
  float progressScale = 1.0 - uProgress * 0.3;
  gl_PointSize = uPointSize * uPixelRatio * sizeAttenuation * progressScale;
  gl_PointSize = clamp(gl_PointSize, 1.0, 20.0);
}
`;

// ============================================
// Fragment Shader
// ============================================
const particleFragmentShader = `
uniform sampler2D uTexture;
uniform float uColorIntensity;
uniform float uProgress;
uniform float uMode;

varying vec2 vUv;
varying float vProgress;
varying float vMode;

vec3 adjustContrast(vec3 color, float contrast) {
  return mix(vec3(0.5), color, contrast);
}

vec3 applyVibrance(vec3 color, float vibrance) {
  float luminance = dot(color, vec3(0.299, 0.587, 0.114));
  return mix(vec3(luminance), color, vibrance + 1.0);
}

float circleShape(vec2 uv, float radius) {
  float d = length(uv - 0.5);
  return smoothstep(radius, radius - 0.1, d);
}

void main() {
  vec4 texColor = texture2D(uTexture, vUv);
  float glowFactor = smoothstep(0.0, 1.0, vProgress);

  vec3 linearColor = texColor.rgb * vec3(0.7, 0.9, 1.0);
  linearColor += vec3(0.0, 0.1, 0.2) * glowFactor;

  vec3 randomColor = texColor.rgb * vec3(1.0, 0.8, 0.6);
  randomColor += vec3(0.3, 0.1, 0.0) * glowFactor;

  vec3 finalColor = mix(linearColor, randomColor, vMode);
  finalColor = adjustContrast(finalColor, uColorIntensity);
  finalColor = applyVibrance(finalColor, 0.3);

  float alpha = circleShape(gl_PointCoord, 0.5);
  alpha *= smoothstep(1.0, 0.8, vProgress);
  alpha *= texColor.a;

  if (alpha < 0.01) discard;
  gl_FragColor = vec4(finalColor, alpha);
}
`;

// ============================================
// Interfaces
// ============================================
interface PhotoParticlesProps {
  texture?: THREE.Texture | null;
  width?: number;
  height?: number;
  progress?: number;
  mode?: number;
  pointSize?: number;
  onReady?: (uniforms: ShaderUniforms) => void;
}

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

const PhotoParticles = forwardRef<THREE.Points, PhotoParticlesProps>(({
  texture = null,
  width = 512,
  height = 512,
  progress = 0,
  mode = 0,
  pointSize = 3.0,
  onReady,
}, ref) => {
  const materialRef = useRef<any>(null);
  const { size, viewport } = useThree();

  // ============================================
  // Uniforms initialization
  // ============================================
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uMode: { value: 0 },
    uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
    uPointSize: { value: pointSize },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uTexture: { value: null },
    uColorIntensity: { value: 1.5 },
    uResidual: { value: 0.3 },
    uLinearDirection: { value: new THREE.Vector3(0, 1, 1) },
    uLinearStrength: { value: 5.0 },
    uGlitchAmount: { value: 0.5 },
    uNoiseScale: { value: 2.0 },
    uNoiseStrength: { value: 3.0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uMouseInfluence: { value: 0.2 },
  }), [viewport, pointSize]);

  // ============================================
  // Particle geometry (created once)
  // ============================================
  const geometry = useMemo(() =>
    createParticleGeometry({ width, height }),
    [width, height]
  );

  // ============================================
  // Texture update
  // ============================================
  useEffect(() => {
    if (texture && materialRef.current) {
      materialRef.current.uniforms.uTexture.value = texture;
    }
  }, [texture]);

  // ============================================
  // External progress control
  // ============================================
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uProgress.value = progress;
    }
  }, [progress]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uMode.value = mode;
    }
  }, [mode]);

  // ============================================
  // Notify parent component
  // ============================================
  useEffect(() => {
    if (onReady && materialRef.current) {
      onReady(materialRef.current.uniforms);
    }
  }, [onReady]);

  // ============================================
  // Frame loop: time update
  // ============================================
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  // ============================================
  // Responsive update
  // ============================================
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uResolution.value.set(viewport.width, viewport.height);
    }
  }, [size, viewport]);

  // ============================================
  // Render
  // ============================================
  return (
    <points ref={ref} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
      />
    </points>
  );
});

PhotoParticles.displayName = 'PhotoParticles';

export default PhotoParticles;