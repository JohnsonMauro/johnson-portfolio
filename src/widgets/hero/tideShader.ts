/**
 * GLSL for the hero backdrop: a slow "tide" of brand blues flowing over the
 * sidebar navy, with film grain. The people network is drawn over it on its
 * own canvas (peopleNetwork.ts).
 *
 * One oversized triangle covers the viewport; the fragment shader does all the
 * work, so the cost is per pixel. The levers, in order of impact: pixel count
 * (the runtime caps the device pixel ratio), octave count (fbm3 / fbm2 below)
 * and frame rate (the runtime caps it at 30 fps).
 */

export const VERTEX_SHADER = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

export const FRAGMENT_SHADER = `
precision highp float;

uniform float u_time;
uniform vec2 u_res;
uniform vec2 u_mouse;   // -1..1, already smoothed by the runtime
uniform vec2 u_center;  // centre of the hero copy, in the same space as uv
uniform vec3 u_base;    // sidebar navy
uniform vec3 u_deep;    // accent-dark
uniform vec3 u_mid;     // accent
uniform vec3 u_light;   // accent-light

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

vec2 hash2(vec2 p) {
  return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

// Gradient noise with quintic interpolation: smooth enough that the fields
// read as light, not as clouds with edges.
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 ga = hash2(i) * 2.0 - 1.0;
  vec2 gb = hash2(i + vec2(1.0, 0.0)) * 2.0 - 1.0;
  vec2 gc = hash2(i + vec2(0.0, 1.0)) * 2.0 - 1.0;
  vec2 gd = hash2(i + vec2(1.0, 1.0)) * 2.0 - 1.0;
  float a = dot(ga, f);
  float b = dot(gb, f - vec2(1.0, 0.0));
  float c = dot(gc, f - vec2(0.0, 1.0));
  float d = dot(gd, f - vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Three octaves for the colour fields, two for the warp that bends them: the
// wide smoothsteps below erase anything finer, so more octaves only cost.
float fbm3(vec2 p) {
  float v = 0.0;
  float a = 0.62;
  mat2 m = mat2(1.6, -1.2, 1.2, 1.6);
  for (int i = 0; i < 3; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

float fbm2(vec2 p) {
  float v = 0.0;
  float a = 0.72;
  mat2 m = mat2(1.6, -1.2, 1.2, 1.6);
  for (int i = 0; i < 2; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  float t = u_time * 0.035;
  vec2 par = u_mouse * 0.08;

  // The current: a domain warp that drifts one way while the fields drift the
  // other, so the light never simply slides across the screen.
  vec2 p = uv + par;
  vec2 warp = vec2(fbm2(p * 0.9 + t), fbm2(p * 0.9 + vec2(3.1, 1.7) - t));
  float n1 = fbm3(p * 0.9 + warp * 0.9 + t * 0.4);
  float n2 = fbm3(p * 0.9 + warp * 0.9 + vec2(4.0, 2.0) - t * 0.3);

  float deepF = smoothstep(-0.35, 0.8, n1);
  float lightF = smoothstep(-0.3, 0.85, n2);

  // Deep water rises from the lower left, the lit surface sits upper right.
  float deepPos = smoothstep(-0.95, 0.95, -uv.x - uv.y * 0.6);
  float lightPos = smoothstep(-0.95, 0.95, uv.x + uv.y * 0.45);

  // A calm pool behind the name keeps the title readable at any size. It
  // shrinks on portrait screens, where uv spans less than one unit across.
  float pool = min(1.0, u_res.x / u_res.y * 1.4);
  vec2 cc = (uv - u_center - par * 0.4) * vec2(0.8, 1.25);
  float vis = smoothstep(0.1 * pool, 0.7 * pool, length(cc));

  vec3 glow = vec3(0.0);
  glow += u_deep * deepF * deepPos * 1.2;
  glow += u_mid * lightF * lightPos * 0.95;
  glow += u_light * lightF * lightF * lightPos * 0.35;
  glow += (u_deep * deepPos + u_mid * lightPos) * 0.1;
  glow *= vis;

  // Filmic rolloff keeps the brightest overlaps from clipping to white.
  glow = vec3(1.0) - exp(-glow * 1.8);

  vec3 col = u_base + glow;
  col += (hash(gl_FragCoord.xy * 1.3 + fract(u_time) * 97.0) - 0.5) * 0.045;

  gl_FragColor = vec4(col, 1.0);
}
`;
