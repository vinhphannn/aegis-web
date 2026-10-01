import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import type { Mesh } from 'three'

function AmbientGeometry() {
  const meshRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.4}>
      <mesh ref={meshRef} scale={1.2}>
        <octahedronGeometry args={[1.6, 0]} />
        <meshStandardMaterial
          color="#38bdf8"
          wireframe={true}
          transparent={true}
          opacity={0.65}
        />
      </mesh>
    </Float>
  )
}

export function TestCanvas3D() {
  return (
    <div className="spatial-canvas-wrapper">
      <div className="spatial-glow" />
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#38bdf8" />

        <AmbientGeometry />
      </Canvas>
    </div>
  )
}
