uniform sampler2D uTexture;
uniform float uColorIntensity;
uniform float uProgress;
uniform float uMode;

varying vec2 vUv;
varying float vProgress;
varying float vMode;

// ============================================
// Color Grading Functions
// ============================================
vec3 adjustContrast(vec3 color, float contrast) {
  return mix(vec3(0.5), color, contrast);
}

vec3 applyVibrance(vec3 color, float vibrance) {
  float luminance = dot(color, vec3(0.299, 0.587, 0.114));
  return mix(vec3(luminance), color, vibrance + 1.0);
}

// ============================================
// Circle Shape with Soft Edge
// ============================================
float circleShape(vec2 uv, float radius) {
  float d = length(uv - 0.5);
  return smoothstep(radius, radius - 0.1, d);
}

// ============================================
// Main
// ============================================
void main() {
  // 1. Sample color from texture
  vec4 texColor = texture2D(uTexture, vUv);

  // 2. Transition based on uProgress
  // As uProgress increases, particle colors brighten and glow
  float glowFactor = smoothstep(0.0, 1.0, vProgress);

  // ========== Linear Mode colors: Blue/Cyan (data stream style) ==========
  vec3 linearColor = texColor.rgb * vec3(0.7, 0.9, 1.0);
  linearColor += vec3(0.0, 0.1, 0.2) * glowFactor; // Cyan glow

  // ========== Random Mode colors: Warm/Orange (explosion style) ==========
  vec3 randomColor = texColor.rgb * vec3(1.0, 0.8, 0.6);
  randomColor += vec3(0.3, 0.1, 0.0) * glowFactor; // Orange-red glow

  // 3. Blend colors
  vec3 finalColor = mix(linearColor, randomColor, vMode);

  // 4. Apply color enhancement
  finalColor = adjustContrast(finalColor, uColorIntensity);
  finalColor = applyVibrance(finalColor, 0.3);

  // 5. Particle shape (circular soft edge)
  float alpha = circleShape(gl_PointCoord, 0.5);

  // 6. Progress affects transparency - slightly translucent when deconstructing
  alpha *= smoothstep(1.0, 0.8, vProgress);

  // 7. Pass through texture alpha
  alpha *= texColor.a;

  // Discard too-faded pixels (optimization + visual)
  if (alpha < 0.01) discard;

  gl_FragColor = vec4(finalColor, alpha);
}