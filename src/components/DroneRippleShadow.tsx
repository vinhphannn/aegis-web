import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ──────────────────────────────────────────────────────────────────────────────
// DroneRippleShadow
//
// Renders a dynamic water-ripple effect as a flat ellipse directly below the
// drone. Each ring is born at the centre, expands outward, then fades to
// transparent as it reaches the edge — exactly like a water drop impact.
//
// Technique: per-ring lifecycle via fract(time + phaseOffset).
//   t=0  → ring radius = 0, alpha = 0  (born)
//   t=0.5 → ring at mid-radius, alpha peaks
//   t=1  → ring at max-radius, alpha = 0 (dies)
// ──────────────────────────────────────────────────────────────────────────────

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColor;
  uniform float uOpacity;

  varying vec2 vUv;

  // ── Tune these for feel ──────────────────────────────
  #define N_RINGS   4       // concurrent rings
  #define PERIOD    2.2     // seconds for one ring lifecycle
  #define RING_W    0.028   // ring width in UV radius units
  #define MAX_R     0.46    // max radius a ring reaches (UV units, 0.5 = edge)
  #define ASPECT    2.5     // x-stretch to match drone footprint ellipse
  // ────────────────────────────────────────────────────

  float ring(float dist, float r) {
    return 1.0 - smoothstep(0.0, RING_W, abs(dist - r));
  }

  void main() {
    // Centre UV at (0,0)
    vec2 uv = vUv - 0.5;
    // Stretch X so the rings form an ellipse matching the drone footprint
    uv.x /= ASPECT;
    float dist = length(uv);

    float alpha = 0.0;

    for (int i = 0; i < N_RINGS; i++) {
      // Each ring is evenly staggered around the lifecycle period
      float stagger = float(i) / float(N_RINGS);
      // t ∈ [0,1) — fractional position in the lifecycle
      float t = fract(uTime / PERIOD + stagger);

      // Ring radius grows from 0 to MAX_R over the lifecycle
      float r = t * MAX_R;

      // Alpha envelope: sin²(π·t) → zero at birth (t=0) and death (t=1),
      // peaks around t=0.5 for a smooth appear/disappear
      float env = sin(3.14159 * t);
      env = env * env;

      // Extra fade near the edge so rings don't hard-cut at MAX_R
      float edgeFade = 1.0 - smoothstep(MAX_R * 0.7, MAX_R, r);

      alpha += ring(dist, r) * env * edgeFade * 0.85;
    }

    // Soft circular mask — nothing bleeds past the ellipse boundary
    float mask = 1.0 - smoothstep(MAX_R * 0.88, MAX_R * 1.05, dist);

    // Subtle ambient glow at the centre (static contact shadow)
    float core = (1.0 - smoothstep(0.0, 0.15, dist)) * 0.30;

    alpha = clamp(alpha + core, 0.0, 1.0) * mask * uOpacity;

    gl_FragColor = vec4(uColor, alpha);
  }
`

interface DroneRippleShadowProps {
  /** World-Y of the shadow plane — should equal the drone's bottom-most Y */
  yPosition?: number
  /** Overall opacity multiplier (0..1) */
  opacity?: number
  /** Tint colour of the rings */
  color?: string
  /** Half-width of the plane in world units (X axis) */
  radiusX?: number
  /** Half-depth of the plane in world units (Z axis) */
  radiusZ?: number
}

export function DroneRippleShadow({
  yPosition = -1.6,
  opacity = 0.72,
  color = '#38bdf8',
  radiusX = 2.2,
  radiusZ = 1.0,
}: DroneRippleShadowProps) {
  const uniforms = useMemo(
    () => ({
      uTime:    { value: 0 },
      uColor:   { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime()
  })

  // The plane is laid flat (rotated -90° around X) at yPosition
  return (
    <mesh
      position={[0, yPosition, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      {/*
        Segmented geometry gives the GPU more vertices to work with and avoids
        perspective distortion artefacts on large flat planes.
      */}
      <planeGeometry args={[radiusX * 2, radiusZ * 2, 4, 4]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
