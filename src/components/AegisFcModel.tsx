import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { signalBootReady } from '../lib/boot'

// Construct model URL using Vite BASE_URL for deep-link / subpath safety
const MODEL_URL = `${import.meta.env.BASE_URL}models/aegis-fc.glb`

export function AegisFcModel({ isDesktop = true }: { isDesktop?: boolean }) {
  const { scene } = useGLTF(MODEL_URL)

  // First frame safety: signal boot readiness after WebGL has rendered the first frame
  useEffect(() => {
    let raf1: number
    let raf2: number
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        signalBootReady()
      })
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [])

  // Calculate centering and scale from bounding box ONCE after load
  const { scaleFactor, centerOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()

    box.getSize(size)
    box.getCenter(center)

    // Target: max dimension ~4.2 units for desktop, ~3.5 units for mobile
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const baseTarget = isDesktop ? 4.2 : 3.5
    const targetScale = baseTarget / maxDim

    return {
      scaleFactor: targetScale,
      centerOffset: center.negate(),
    }
  }, [scene, isDesktop])

  return (
    <group
      rotation={[0.65, -0.35, 0.2]}
      scale={[scaleFactor, scaleFactor, scaleFactor]}
    >
      <primitive object={scene} position={centerOffset} />
    </group>
  )
}

// Preload GLB asset
useGLTF.preload(MODEL_URL)
