uniform float uTime;
uniform float uProgress;          // 0-1: complete → deconstructed
uniform float uMode;              // 0-1: Linear → Random
uniform vec2 uResolution;
uniform float uPointSize;
uniform float uPixelRatio;
uniform float uResidual;          // how much original position to retain

// Linear Mode uniforms
uniform vec3 uLinearDirection;
uniform float uLinearStrength;
uniform float uGlitchAmount;

// Random Mode uniforms
uniform float uNoiseScale;
uniform float uNoiseStrength;

// Mouse interaction
uniform vec2 uMouse;
uniform float uMouseInfluence;

attribute vec2 index;             // original grid index (0 to width*height)
attribute float shuffledIndex;    // shuffled index (for randomness)
attribute vec3 randomDirection;   // pre-calculated random direction

varying vec2 vUv;
varying float vProgress;
varying float vMode;
varying vec3 vColor;

// ============================================
// Simplex Noise 3D (simplified)
// ============================================
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
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

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
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// ============================================
// Curl Noise (for fluid-like particle movement)
// ============================================
vec3 curlNoise(vec3 p) {
  float eps = 0.001;

  float n1 = snoise(vec3(p.x, p.y + eps, p.z));
  float n2 = snoise(vec3(p.x, p.y - eps, p.z));
  float n3 = snoise(vec3(p.x, p.y, p.z + eps));
  float n4 = snoise(vec3(p.x, p.y, p.z - eps));
  float n5 = snoise(vec3(p.x + eps, p.y, p.z));
  float n6 = snoise(vec3(p.x - eps, p.y, p.z));

  float x = n2 - n1;
  float y = n4 - n3;
  float z = n5 - n6;

  return normalize(vec3(y, z, x));
}

// ============================================
// Main Position Calculation
// ============================================
void main() {
  vUv = uv;
  vProgress = uProgress;
  vMode = uMode;

  // Original position
  vec3 originalPos = position;

  // ========== MODE B: Linear Mode (structured displacement) ==========
  // Calculate displacement based on grid position
  float gridX = mod(index, 512.0);
  float gridY = floor(index / 512.0);

  // 1. Z-axis stretch (simulating depth/speed lines)
  float zDisplacement = uLinearDirection.z * uProgress * uLinearStrength;

  // 2. Glitch effect - discrete displacement based on sine waves
  float glitchPhase = sin(gridY * 0.1 + uTime * 2.0) * cos(gridX * 0.1);
  float glitchOffset = step(0.8, glitchPhase) * uGlitchAmount * uProgress;

  // 3. Y-axis flow (drifting upward)
  float yFlow = uLinearDirection.y * uProgress * uLinearStrength * 0.5;

  // 4. XY plane distortion
  float xyScale = 1.0 + uProgress * 0.3;
  float xyDistort = sin(gridX * 0.05 + uTime) * uProgress * 0.5;

  vec3 linearPos = originalPos;
  linearPos.x = (linearPos.x + glitchOffset) * xyScale + xyDistort;
  linearPos.y = linearPos.y * xyScale + yFlow;
  linearPos.z += zDisplacement;

  // ========== MODE A: Random Mode (Curl Noise explosion) ==========
  // Use shuffledIndex for uniform random distribution
  float noiseInput = shuffledIndex * 0.001 + uTime * 0.1;
  vec3 curl = curlNoise(vec3(noiseInput, noiseInput * 0.5, uTime * 0.2));

  // Spherical dispersion
  float sphericalDispersion = uProgress * uNoiseStrength * 8.0;
  vec3 randomOffset = randomDirection * sphericalDispersion;

  // Add curl noise perturbation
  vec3 crawlEffect = curl * uProgress * uNoiseStrength * 2.0;

  vec3 randomPos = originalPos + randomOffset + crawlEffect;

  // ========== Blend the two modes ==========
  // uMode = 0: pure Linear, uMode = 1: pure Random
  vec3 finalPos = mix(linearPos, randomPos, uMode);

  // ========== Mouse interaction perturbation ==========
  // Particles near mouse get pushed away
  vec2 screenPos = finalPos.xy / uResolution * 2.0;
  float mouseDist = length(screenPos - uMouse);
  float mouseEffect = smoothstep(0.5, 0.0, mouseDist) * uMouseInfluence * (1.0 - uProgress);
  finalPos.x += (finalPos.x - uMouse.x * uResolution.x * 0.5) * mouseEffect;
  finalPos.y += (finalPos.y - uMouse.y * uResolution.y * 0.5) * mouseEffect;

  // ========== Final transform ==========
  // Attenuate uResidual based on progress (more deconstructed = more deviation)
  vec3 pos = mix(finalPos, originalPos, uResidual * (1.0 - uProgress * 0.5));

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Particle size attenuation + progress scale
  float sizeAttenuation = 300.0 / -mvPosition.z;
  float progressScale = 1.0 - uProgress * 0.3; // Shrink when deconstructing
  gl_PointSize = uPointSize * uPixelRatio * sizeAttenuation * progressScale;
  gl_PointSize = clamp(gl_PointSize, 1.0, 20.0);
}