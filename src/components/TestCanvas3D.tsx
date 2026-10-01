import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'
import type { Mesh } from 'three'

function SpinningCube() {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.75
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        scale={clicked ? 1.4 : 1.1}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setClicked(!clicked)}
      >
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <meshStandardMaterial
          color={hovered ? '#3b82f6' : '#0ea5e9'}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  )
}

export function TestCanvas3D() {
  const [status, setStatus] = useState<string>('Ready')

  return (
    <div className="canvas-wrapper">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        <SpinningCube />

        <OrbitControls enableZoom={true} makeDefault />
      </Canvas>

      <div className="canvas-overlay">
        <span>Interaction: Drag to rotate | Click cube to toggle scale</span>
        <button
          className="status-btn"
          onClick={() => setStatus((prev) => (prev === 'Ready' ? 'Active' : 'Ready'))}
        >
          React State: {status}
        </button>
      </div>
    </div>
  )
}
