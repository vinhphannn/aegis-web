import { Suspense, useEffect, useRef, useState, type ComponentRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { PerspectiveCamera } from 'three'
import { AegisFcModel } from './AegisFcModel'

export function FcSectionScene3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldMountCanvas, setShouldMountCanvas] = useState(false)
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth > 768 : true
  )
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null)

  // Lazy mount 3D Canvas only when FC section approaches viewport (800px rootMargin)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMountCanvas(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth > 768)
    }
    checkViewport()
    window.addEventListener('resize', checkViewport)
    return () => window.removeEventListener('resize', checkViewport)
  }, [])

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    const cam = controls.object as PerspectiveCamera
    const targetZ = isDesktop ? 4.5 : 5.8
    cam.position.set(0, 0, targetZ)
    cam.updateProjectionMatrix()
    controls.update()
  }, [isDesktop, shouldMountCanvas])

  const cameraZ = isDesktop ? 4.5 : 5.8
  const minDist = isDesktop ? 2.0 : 3.0
  const maxDist = isDesktop ? 7.5 : 9.0

  return (
    <div ref={containerRef} className="spatial-canvas-wrapper">
      {shouldMountCanvas && (
        <Canvas
          camera={{ position: [0, 0, cameraZ], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={1.2} />
          <directionalLight position={[10, 15, 10]} intensity={1.4} />
          <directionalLight position={[-10, 10, -8]} intensity={0.9} color="#cdd8e8" />
          <directionalLight position={[5, -10, 5]} intensity={0.6} color="#b0c8e0" />

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
      )}
    </div>
  )
}
