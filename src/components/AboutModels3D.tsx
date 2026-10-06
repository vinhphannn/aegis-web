import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Box3, Group, MathUtils, Quaternion, Euler, Vector3, Mesh, type BufferGeometry, type Material } from 'three'

import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

const modelRoot = `${import.meta.env.BASE_URL}models/`
type ModelKind = 'drone' | 'fc'

// Chỉnh drone của trang About tại đây. Góc xoay dùng ĐỘ (không phải radian).
const ABOUT_DRONE = {
  positionX: .31, // Tỷ lệ chiều rộng khung: tăng = sang phải.
  positionY: -.08, // Tỷ lệ chiều cao khung: tăng = lên cao (vd -.24 → -.20).
  tiltX: 15, // Nghiêng trước/sau để khớp mặt sân.
  yawY: 0, // Quay hướng thân drone sang trái/phải; giữ phần lật ~180°.
  rollZ: -3.3, // Nghiêng ngang; thử 0 để cân bằng hai bên.
  pointerStrength: 1, // Đặt 0 để cố định góc khi chỉnh, không xoay theo chuột.
  chapterYaw: 2.3, // Góc quay thêm theo cảnh; đặt 0 để giữ cùng hướng mọi cảnh.
}

// Chỉ áp dụng cho khung 2/4, giữ nguyên góc xoay và các khung khác.
const CHAPTER_TWO_DRONE = {
  scaleMultiplier: .85,
  offsetX: -.05,
  offsetY: .05,
}

class ModelBoundary extends Component<{ children: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onUnavailable() }
  render() { return this.state.failed ? null : this.props.children }
}

function Model({ kind, chapter, reduced, onReady }: { kind: ModelKind; chapter: number; reduced: boolean; onReady: (kind: ModelKind) => void }) {
  const { scene } = useGLTF(`${modelRoot}aegis-${kind}.glb`)
  const { viewport, invalidate } = useThree()
  const group = useRef<Group>(null)
  const firstFrame = useRef(false)
  const readyFrame = useRef(0)
  const pointer = useRef({ x: 0, y: 0 })
  const targetRotation = useMemo(() => new Quaternion(), [])
  // GLTFs are cached across Home and About. Clone the hierarchy so poses never
  // reparent or mutate Home's model; retain shared geometry and materials.
  const normalized = useMemo(() => {
    let clone = scene.clone(true)
    const owned: BufferGeometry[] = []
    // The CAD FC contains thousands of static mesh primitives. Batch them by
    // material in world space while preserving its exact shapes and materials.
    // These new buffers belong to About; never dispose cached GLTF resources.
    if (kind === 'fc') {
      clone.updateMatrixWorld(true)
      const batches = new Map<string, { material: Material; geometries: BufferGeometry[] }>()
      clone.traverse(node => {
        if (!(node instanceof Mesh) || Array.isArray(node.material)) return
        const geometry = node.geometry.clone().applyMatrix4(node.matrixWorld)
        const key = `${node.material.uuid}:${Object.keys(geometry.attributes).sort().join(',')}:${!!geometry.index}`
        const batch: { material: Material; geometries: BufferGeometry[] } = batches.get(key) ?? { material: node.material, geometries: [] }
        batch.geometries.push(geometry)
        batches.set(key, batch)
      })
      const batched = new Group()
      for (const batch of batches.values()) {
        const merged = mergeGeometries(batch.geometries)
        if (merged) { owned.push(merged); batched.add(new Mesh(merged, batch.material)) }
        else { batch.geometries.forEach(geometry => { owned.push(geometry); batched.add(new Mesh(geometry, batch.material)) }) }
        if (merged) batch.geometries.forEach(geometry => geometry.dispose())
      }
      if (batched.children.length) clone = batched
    }
    const bounds = new Box3().setFromObject(clone)
    const size = bounds.getSize(new Vector3())
    const center = bounds.getCenter(new Vector3())
    clone.position.sub(center)
    return { scene: clone, scale: 1 / Math.max(size.x, size.y, size.z, .001), owned }
  }, [scene, kind])

  useEffect(() => () => normalized.owned.forEach(geometry => geometry.dispose()), [normalized])
  useEffect(() => { invalidate(); return () => cancelAnimationFrame(readyFrame.current) }, [invalidate])
  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)')
    const move = (event: PointerEvent) => {
      if (reduced || !media.matches || event.pointerType !== 'mouse') return
      pointer.current = { x: (event.clientX / innerWidth - .5) * 2, y: (event.clientY / innerHeight - .5) * 2 }
      invalidate()
    }
    const reset = () => { pointer.current = { x: 0, y: 0 }; invalidate() }
    reset()
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', reset)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', reset)
    }
  }, [reduced, invalidate])
  useEffect(() => { invalidate() }, [chapter, reduced, invalidate])

  useFrame((_, delta) => {
    const object = group.current
    if (!object) return
    const mobile = viewport.width < 8.2
    const featured = kind === 'fc' && chapter === 2
    const showDrone = kind === 'drone' && chapter !== 2
    const chapterTwoDrone = kind === 'drone' && chapter === 1
    const width = kind === 'drone'
      ? viewport.width * (mobile ? .82 : .46)
      : viewport.width * (featured ? (mobile ? .6 : .34) : (mobile ? .42 : .2))
    const x = viewport.width * (kind === 'drone' ? ABOUT_DRONE.positionX + (chapterTwoDrone ? CHAPTER_TWO_DRONE.offsetX : 0) : featured ? (mobile ? .30 : .24) : -.44)
    const y = viewport.height * (kind === 'drone' ? ABOUT_DRONE.positionY + (chapterTwoDrone ? CHAPTER_TWO_DRONE.offsetY : 0) : featured ? (mobile ? -.32 : -.04) : -.46)
    const scale = kind === 'drone' && !showDrone ? 0 : Math.min(width, kind === 'drone' ? 6.8 : 6) * (chapterTwoDrone ? CHAPTER_TWO_DRONE.scaleMultiplier : 1)
    const pointerStrength = kind === 'drone' ? ABOUT_DRONE.pointerStrength : 1
    const angle = new Euler(
      (kind === 'drone' ? MathUtils.degToRad(ABOUT_DRONE.tiltX) : .65) - pointer.current.y * .1 * pointerStrength,
      (kind === 'drone' ? MathUtils.degToRad(ABOUT_DRONE.yawY + chapter * ABOUT_DRONE.chapterYaw) : -.35 + (chapter - 1) * .04) + pointer.current.x * .16 * pointerStrength,
      (kind === 'drone' ? MathUtils.degToRad(ABOUT_DRONE.rollZ) : .2) + pointer.current.x * .025 * pointerStrength,
    )
    targetRotation.setFromEuler(angle)
    const initial = !firstFrame.current
    const ease = reduced || initial ? 1 : 1 - Math.exp(-Math.min(delta, .2) * 8)
    object.position.x = MathUtils.lerp(object.position.x, x, ease)
    object.position.y = MathUtils.lerp(object.position.y, y, ease)
    object.scale.setScalar(MathUtils.lerp(object.scale.x, scale, ease))
    object.quaternion.slerp(targetRotation, ease)
    if (initial) {
      firstFrame.current = true
      // Notify after the renderer has drawn the initial pose, not just fetched GLTF.
      readyFrame.current = requestAnimationFrame(() => onReady(kind))
    }
    if (Math.abs(object.position.x - x) + Math.abs(object.position.y - y) + Math.abs(object.scale.x - scale) + object.quaternion.angleTo(targetRotation) > .002) invalidate()
  })

  return <group ref={group} scale={0} dispose={null}><group scale={normalized.scale}><primitive object={normalized.scene} dispose={null} /></group></group>
}

export function AboutModels3D({ chapter, onPrepared }: { chapter: number; onPrepared: () => void }) {
  const [enabled, setEnabled] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [ready, setReady] = useState<Partial<Record<ModelKind, boolean>>>({})
  const onReady = useMemo(() => (kind: ModelKind) => setReady(previous => previous[kind] ? previous : { ...previous, [kind]: true }), [])

  useEffect(() => { if (ready.drone && ready.fc) onPrepared() }, [ready, onPrepared])

  useEffect(() => {
    const height = window.matchMedia('(min-height: 651px)')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { setEnabled(height.matches && !document.hidden); setReduced(motion.matches); if (!height.matches) onPrepared() }
    height.addEventListener('change', update)
    motion.addEventListener('change', update)
    document.addEventListener('visibilitychange', update)
    update()
    return () => {
      height.removeEventListener('change', update)
      motion.removeEventListener('change', update)
      document.removeEventListener('visibilitychange', update)
    }
  }, [onPrepared])

  return (
    <div className="about-model-parallax" data-models-ready={!!ready.drone && !!ready.fc}>
      {enabled && (
        <ModelBoundary onUnavailable={onPrepared}>
          <Canvas orthographic camera={{ position: [0, 0, 12], zoom: 100, near: .1, far: 100 }} dpr={[1, 1.5]} frameloop="demand" gl={{ alpha: true, antialias: true }} style={{ pointerEvents: 'none' }}>
            <ambientLight intensity={2.1} />
            <directionalLight position={[2, 8, 8]} intensity={3} color="#ffffff" />
            <directionalLight position={[-8, 5, 6]} intensity={1.5} color="#d6eaff" />
            <directionalLight position={[7, -3, 5]} intensity={1.2} color="#c8dff5" />
            <directionalLight position={[4, 8, -6]} intensity={1.4} color="#38bdf8" />
            <Suspense fallback={null}>
              <Model kind="drone" chapter={chapter} reduced={reduced} onReady={onReady} />
              <Model kind="fc" chapter={chapter} reduced={reduced} onReady={onReady} />
            </Suspense>
          </Canvas>
        </ModelBoundary>
      )}
    </div>
  )
}
