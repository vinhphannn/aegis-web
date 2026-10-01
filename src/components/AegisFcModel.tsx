import { useMemo, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// Construct model URL using Vite BASE_URL for deep-link / subpath safety
const MODEL_URL = `${import.meta.env.BASE_URL}models/aegis-fc.glb`

export function AegisFcModel({ isDesktop = true }: { isDesktop?: boolean }) {
  const { scene } = useGLTF(MODEL_URL)

  // Clone scene ONCE per component instance so multiple canvases can
  // independently render the same GLB (Three.js objects can only have one parent)
  const clonedScene = useMemo(() => scene.clone(true), [scene])

  // Calculate centering and scale from bounding box ONCE after load
  const { scaleFactor, centerOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene)
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
  }, [clonedScene, isDesktop])

  // Log complexity once on mount
  useEffect(() => {
    let meshCount = 0
    let triangleCount = 0
    const materialsSet = new Set<string>()

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshCount++
        const mesh = child as THREE.Mesh
        if (mesh.geometry?.index) {
          triangleCount += mesh.geometry.index.count / 3
        } else if (mesh.geometry?.attributes.position) {
          triangleCount += mesh.geometry.attributes.position.count / 3
        }
        const mat = mesh.material
        if (Array.isArray(mat)) mat.forEach((m) => materialsSet.add(m.uuid))
        else if (mat) materialsSet.add(mat.uuid)
      }
    })

    console.info('[AEGIS FC]', {
      meshCount,
      triangleCount: Math.round(triangleCount),
      materialCount: materialsSet.size,
    })
  }, [clonedScene])

  return (
    <group
      rotation={[0.65, -0.35, 0.2]}
      scale={[scaleFactor, scaleFactor, scaleFactor]}
    >
      <primitive object={clonedScene} position={centerOffset} />
    </group>
  )
}

// Preload GLB asset
useGLTF.preload(MODEL_URL)
