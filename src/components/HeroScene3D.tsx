import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AegisDroneModel } from './AegisDroneModel'

interface HeroScene3DProps {
  /** Desktop camera Z distance. Default 4.2 (Hero). Pass larger value to zoom out. */
  desktopCameraZ?: number
}

export function HeroScene3D({ desktopCameraZ = 4.2 }: HeroScene3DProps) {
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth > 768 : true
  )

  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth > 768)
    }
    checkViewport()
    window.addEventListener('resize', checkViewport)
    return () => window.removeEventListener('resize', checkViewport)
  }, [])

  const cameraZ = isDesktop ? desktopCameraZ + 1.0 : 6.5
  const cameraY = isDesktop ? 1.2 : 0.8

  return (
    <div className="spatial-canvas-wrapper">
      <Canvas
        camera={{ position: [0, cameraY, cameraZ], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Ambient fill — lifted to compensate for dark model textures */}
        <ambientLight intensity={2.2} />
        {/* Strong key light from top-front (camera side) — illuminates the top face we now show */}
        <directionalLight position={[2, 8, 6]}  intensity={3.2} color="#ffffff" />
        {/* Side fill lights for arm depth */}
        <directionalLight position={[-8, 6, 4]} intensity={1.6} color="#d6eaff" />
        <directionalLight position={[8, 4, -4]} intensity={1.2} color="#c8dff5" />
        {/* Underside bounce */}
        <directionalLight position={[0, -6, 4]} intensity={0.9} color="#b0c8e0" />
        {/* Accent / rim light from behind */}
        <directionalLight position={[-3, 10, -8]} intensity={1.0} color="#38bdf8" />
        {/* Point lights for local highlights */}
        <pointLight position={[0, 5, 4]}  intensity={1.4} color="#e8f4ff" />
        <pointLight position={[0, -4, 3]} intensity={0.8} color="#7dd3fc" />

        {/* AegisDroneModel renders both the drone and its ripple shadow */}
        <Suspense fallback={null}>
          <AegisDroneModel isDesktop={isDesktop} />
        </Suspense>
      </Canvas>
    </div>
  )
}
