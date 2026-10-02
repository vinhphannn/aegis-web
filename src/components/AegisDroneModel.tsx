import { useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { signalBootReady } from '../lib/boot'

const MODEL_URL = `${import.meta.env.BASE_URL}models/aegis-drone.glb`

// Smooth interpolation speed
const LOOK_LERP = 0.055

export function AegisDroneModel({ isDesktop = true }: { isDesktop?: boolean }) {
  const { scene } = useGLTF(MODEL_URL)
  const { gl } = useThree()
  const groupRef = useRef<THREE.Group>(null)

  // Mouse in NDC — tracked globally so cursor works outside canvas
  const mouse = useRef(new THREE.Vector2(0, 0))

  // ─── Rest pose ─────────────────────────────────────────────────────────────
  // The Sketchfab GLB stores the drone in the XY plane with its belly at Z_max
  // (Z ≈ 1.487), which faces the camera (+Z). To show the TOP instead:
  //   1. Flip 180° around Y (π) → belly faces -Z (away from camera), top faces +Z ✓
  //   2. Small backward tilt on X (−0.28 rad ≈ −16°) for a slight top-down angle
  //   3. Small yaw (0.30 rad) for a natural 3/4 hero pose
  const REST_X = -0.28
  const REST_Y = Math.PI + 0.30
  const REST_Z = 0.04
  const restEuler = new THREE.Euler(REST_X, REST_Y, REST_Z)
  const targetQuat = useRef(new THREE.Quaternion().setFromEuler(restEuler))

  // Boot signal
  useEffect(() => {
    let r1: number, r2: number
    r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => signalBootReady())
    })
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2) }
  }, [])

  // Global mouse listener — works anywhere on the page
  useEffect(() => {
    const canvas = gl.domElement
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [gl])

  // Normalise scale / center from bounding box
  const { scaleFactor, centerOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const baseTarget = isDesktop ? 4.8 : 3.8
    const targetScale = baseTarget / maxDim

    return { scaleFactor: targetScale, centerOffset: center.negate() }
  }, [scene, isDesktop])

  useFrame(() => {
    const group = groupRef.current
    if (!group) return

    // Direct NDC → Euler offset — no raycaster; avoids plane-intersection ambiguity.
    // mouse.x ∈ [-1, 1]: positive = cursor right
    // mouse.y ∈ [-1, 1]: positive = cursor above centre
    const mx = THREE.MathUtils.clamp(mouse.current.x, -1.5, 1.5)
    const my = THREE.MathUtils.clamp(mouse.current.y, -1.5, 1.5)

    // cursor up (my>0)   → REST_X + my → slightly less X tilt → top tilts toward cursor ✓
    // cursor right (mx>0) → REST_Y + mx → after π Y-flip, + is the correct direction for right ✓
    // slight banking roll
    const desiredEuler = new THREE.Euler(
      REST_X - my * 0.46,
      REST_Y + mx * 0.80,
      REST_Z + mx * 0.09,
    )
    targetQuat.current.setFromEuler(desiredEuler)
    group.quaternion.slerp(targetQuat.current, LOOK_LERP)
  })

  return (
    <group
      ref={groupRef}
      scale={[scaleFactor, scaleFactor, scaleFactor]}
    >
      <primitive object={scene} position={centerOffset} />
    </group>
  )
}

// Preload drone GLB asset for Home Hero
useGLTF.preload(MODEL_URL)
