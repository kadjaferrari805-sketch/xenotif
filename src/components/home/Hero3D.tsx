'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Icosahedron } from '@react-three/drei'
import type { Mesh } from 'three'

function Blob() {
  const ref = useRef<Mesh>(null)
  useFrame((state, delta) => {
    const m = ref.current
    if (!m) return
    m.rotation.x += delta * 0.15
    m.rotation.y += delta * 0.2
    // Parallaxe douce vers le pointeur (state.pointer ∈ [-1, 1])
    m.position.x += (state.pointer.x * 0.6 - m.position.x) * 0.05
    m.position.y += (state.pointer.y * 0.4 - m.position.y) * 0.05
  })
  return (
    <Icosahedron ref={ref} args={[1.2, 6]}>
      <MeshDistortMaterial
        color="#f97316"
        emissive="#7c2d12"
        emissiveIntensity={0.35}
        metalness={0.6}
        roughness={0.25}
        distort={0.35}
        speed={1.6}
      />
    </Icosahedron>
  )
}

export default function Hero3D() {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4], fov: 45 }}
      frameloop={reduced ? 'demand' : 'always'}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 3]} intensity={1.2} />
      <pointLight position={[-3, -2, -2]} intensity={0.5} color="#84cc16" />
      <Blob />
    </Canvas>
  )
}
