import { Suspense, useEffect, useMemo, useState, type RefObject } from 'react'
import { Canvas, events } from '@react-three/fiber'
import { Model } from './AboutModels3D'
import { signalBootReady } from '../lib/boot'

export function HeroScene3D({ eventRoot }: { eventRoot: RefObject<HTMLElement | null> }) {
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(false)
  const onReady = useMemo(() => () => { setReady(true); signalBootReady() }, [])
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update(); media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return <div className="home-fc-viewer" data-model-ready={ready} aria-label="Interactive AEGIS FC model. Drag to rotate.">
    <Canvas orthographic camera={{ position: [0, 0, 12], zoom: 100, near: .1, far: 100 }} dpr={[1, 1.5]} frameloop="demand" gl={{ antialias: true, alpha: true }} eventSource={eventRoot} events={state => ({
      ...events(state),
      compute: (event, state) => {
        const rect = state.gl.domElement.getBoundingClientRect()
        state.pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1)
        state.raycaster.setFromCamera(state.pointer, state.camera)
      },
    })} style={{ pointerEvents: 'none' }}>
      <ambientLight intensity={2.1} />
      <directionalLight position={[2, 8, 8]} intensity={3} color="#ffffff" />
      <directionalLight position={[-8, 5, 6]} intensity={1.5} color="#d6eaff" />
      <directionalLight position={[7, -3, 5]} intensity={1.2} color="#c8dff5" />
      <directionalLight position={[4, 8, -6]} intensity={1.4} color="#38bdf8" />
      <Suspense fallback={null}><Model hero kind="fc" chapter={2} reduced={reduced} onReady={onReady} /></Suspense>
    </Canvas>
  </div>
}
