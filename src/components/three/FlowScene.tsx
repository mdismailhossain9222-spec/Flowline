import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ------------------------------------------------------------------ */
/*  A living workflow graph — rounded node cards connected by edges,   */
/*  with data packets that travel along the connections. The whole     */
/*  graph drifts and reacts to the pointer.                            */
/* ------------------------------------------------------------------ */

type Node = { id: number; pos: [number, number, number]; color: string; size: [number, number] }

const NODES: Node[] = [
  { id: 0, pos: [-3.1, 1.4, 0], color: '#4d8dff', size: [1.5, 0.62] },
  { id: 1, pos: [-0.2, 2.1, -0.4], color: '#4ef0b0', size: [1.5, 0.62] },
  { id: 2, pos: [-1.4, -0.4, 0.5], color: '#9b7cff', size: [1.5, 0.62] },
  { id: 3, pos: [2.6, 1.2, -0.2], color: '#4ef0b0', size: [1.5, 0.62] },
  { id: 4, pos: [1.7, -1.5, 0.3], color: '#4d8dff', size: [1.5, 0.62] },
  { id: 5, pos: [-3.4, -1.8, -0.3], color: '#9b7cff', size: [1.5, 0.62] },
]

const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4],
  [2, 5],
  [3, 4],
  [1, 4],
]

function NodeCard({ node }: { node: Node }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime + node.id
    ref.current.position.z = node.pos[2] + Math.sin(t * 0.8) * 0.12
  })
  return (
    <group ref={ref} position={node.pos}>
      {/* card body */}
      <mesh>
        <planeGeometry args={node.size} />
        <meshBasicMaterial color="#121826" transparent opacity={0.92} />
      </mesh>
      {/* border */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(node.size[0], node.size[1])]} />
        <lineBasicMaterial color={node.color} transparent opacity={0.55} />
      </lineSegments>
      {/* status dot */}
      <mesh position={[-node.size[0] / 2 + 0.2, node.size[1] / 2 - 0.18, 0.01]}>
        <circleGeometry args={[0.07, 20]} />
        <meshBasicMaterial color={node.color} />
      </mesh>
      {/* two "text" bars */}
      <mesh position={[0.08, node.size[1] / 2 - 0.18, 0.01]}>
        <planeGeometry args={[0.85, 0.06]} />
        <meshBasicMaterial color="#8b97ad" transparent opacity={0.7} />
      </mesh>
      <mesh position={[-0.15, -0.02, 0.01]}>
        <planeGeometry args={[1.0, 0.05]} />
        <meshBasicMaterial color="#8b97ad" transparent opacity={0.35} />
      </mesh>
      <mesh position={[-0.28, -0.15, 0.01]}>
        <planeGeometry args={[0.74, 0.05]} />
        <meshBasicMaterial color="#8b97ad" transparent opacity={0.25} />
      </mesh>
    </group>
  )
}

function Edges() {
  const geo = useMemo(() => {
    const pts: number[] = []
    EDGES.forEach(([a, b]) => {
      pts.push(...NODES[a].pos, ...NODES[b].pos)
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return g
  }, [])
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#2b3446" transparent opacity={0.9} />
    </lineSegments>
  )
}

/* data packets travelling along each edge */
function Packets() {
  const ref = useRef<THREE.Points>(null)
  const count = EDGES.length
  const offsets = useMemo(() => EDGES.map((_, i) => i / count), [count])

  const positions = useMemo(() => new Float32Array(count * 3), [count])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const [a, b] = EDGES[i]
      const prog = (t * 0.35 + offsets[i]) % 1
      const A = NODES[a].pos
      const B = NODES[b].pos
      positions[i * 3] = A[0] + (B[0] - A[0]) * prog
      positions[i * 3 + 1] = A[1] + (B[1] - A[1]) * prog
      positions[i * 3 + 2] = A[2] + (B[2] - A[2]) * prog
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.16} color="#4ef0b0" transparent opacity={0.95} sizeAttenuation />
    </points>
  )
}

function Graph() {
  const group = useRef<THREE.Group>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  useMemo(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame((state, dt) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      mouse.current.x * 0.28 + Math.sin(t * 0.15) * 0.06,
      3,
      dt
    )
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -mouse.current.y * 0.16, 3, dt)
    const s = THREE.MathUtils.clamp(viewport.width / 11, 0.62, 1.05)
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, s, 4, dt))
  })

  return (
    <group ref={group} scale={0.001}>
      <Edges />
      <Packets />
      {NODES.map((n) => (
        <NodeCard key={n.id} node={n} />
      ))}
    </group>
  )
}

export default function FlowScene({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 8], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Graph />
        </Suspense>
      </Canvas>
    </div>
  )
}
