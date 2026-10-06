import { Suspense, useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { prepareModel } from '../lib/prepareModel'
import { signalBootReady } from '../lib/boot'

function HomeFc({ onReady }: { onReady: () => void }) {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/aegis-fc.glb`)
  const model = useMemo(() => prepareModel(scene, true), [scene])
  useEffect(() => {
    let second = 0
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => { onReady(); signalBootReady() }) })
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second) }
  }, [onReady])
  useEffect(() => () => model.owned.forEach(geometry => geometry.dispose()), [model])
  return <group rotation={[.65, -.35, .2]} scale={4.4 * model.scale} dispose={null}><primitive object={model.scene} dispose={null} /></group>
}

export function HeroScene3D() {
  const [ready, setReady] = useState(false)
  const onReady = useMemo(() => () => setReady(true), [])
  return <div className="spatial-canvas-wrapper home-fc-viewer" data-model-ready={ready} aria-label="Interactive AEGIS FC model. Drag to rotate.">
    <Canvas camera={{ position: [0, 0, 7.8], fov: 38 }} dpr={[1, 1.5]} frameloop="demand" gl={{ antialias: true, alpha: true }} style={{ cursor: 'grab', touchAction: 'pan-y' }}>
      <ambientLight intensity={2.1} />
      <directionalLight position={[2, 8, 8]} intensity={3} color="#ffffff" />
      <directionalLight position={[-8, 5, 6]} intensity={1.5} color="#d6eaff" />
      <directionalLight position={[7, -3, 5]} intensity={1.2} color="#c8dff5" />
      <directionalLight position={[4, 8, -6]} intensity={1.4} color="#38bdf8" />
      <Suspense fallback={null}><HomeFc onReady={onReady} /></Suspense>
      <OrbitControls makeDefault autoRotate={false} enableDamping dampingFactor={.08} enableZoom={false} enablePan={false} />
    </Canvas>
  </div>
}
