import { Suspense, useEffect, useRef, useState, type ComponentRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { PerspectiveCamera } from 'three'
import { AegisFcModel } from './AegisFcModel'

interface HeroScene3DProps {
  /** Desktop camera Z distance. Default 4.2 (Hero). Pass larger value to zoom out. */
  desktopCameraZ?: number
}

export function HeroScene3D({ desktopCameraZ = 4.2 }: HeroScene3DProps) {
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth > 768 : true
  )
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null)

  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth > 768)
    }
    checkViewport()
    window.addEventListener('resize', checkViewport)
    return () => window.removeEventListener('resize', checkViewport)
  }, [])

  // When viewport type changes, nudge the camera without destroying the canvas
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    const cam = controls.object as PerspectiveCamera
    const targetZ = isDesktop ? desktopCameraZ : 5.8
    cam.position.set(0, 0, targetZ)
    cam.updateProjectionMatrix()
    controls.update()
  }, [isDesktop, desktopCameraZ])

  const cameraZ = isDesktop ? desktopCameraZ : 5.8
  const minDist = isDesktop ? desktopCameraZ * 0.45 : 3.0
  const maxDist = isDesktop ? desktopCameraZ * 1.7 : 9.0

  return (
    <div className="spatial-canvas-wrapper">
      <Canvas
        camera={{ position: [0, 0, cameraZ], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Wrap-around lighting — all sides visible regardless of rotation */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 15, 10]} intensity={1.4} />
        <directionalLight position={[-10, 10, -8]} intensity={0.9} color="#cdd8e8" />
        <directionalLight position={[5, -10, 5]} intensity={0.6} color="#b0c8e0" />
        <directionalLight position={[-5, -8, -10]} intensity={0.5} color="#94a3b8" />
        <pointLight position={[0, 8, 3]} intensity={0.7} color="#e8f0ff" />
        <pointLight position={[0, -8, -3]} intensity={0.5} color="#38bdf8" />

        <Suspense fallback={null}>
          <AegisFcModel isDesktop={isDesktop} />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          autoRotate={true}
          autoRotateSpeed={0.8}
          enableDamping={true}
          dampingFactor={0.05}
          enableRotate={true}
          enableZoom={isDesktop}
          enablePan={false}
          minDistance={minDist}
          maxDistance={maxDist}
        />
      </Canvas>
    </div>
  )
}
