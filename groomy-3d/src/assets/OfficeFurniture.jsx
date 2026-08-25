function palettes(ar) {
  return ar
    ? { wood: '#d5c4a8', metal: '#8a96a0', fabric: '#3d4a55', plastic: '#2a3036' }
    : { wood: '#4a3f34', metal: '#3a3836', fabric: '#2c2826', plastic: '#1e1c1a' }
}

export function TaskChair({ position = [0, 0, 0], rotation = [0, 0, 0], fallen = false, interactId, ar = false }) {
  const { fabric, metal, plastic } = palettes(ar)
  const rot = fallen ? [1.25, 0.35, 0.5] : rotation
  const pos = fallen ? [position[0], 0.22, position[2]] : position

  return (
    <group position={pos} rotation={rot}>
      <mesh position={[0, 0.46, 0]} userData={{ interactId }}>
        <boxGeometry args={[0.46, 0.07, 0.46]} />
        <meshStandardMaterial color={fabric} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.78, -0.18]} userData={{ interactId }}>
        <boxGeometry args={[0.46, 0.55, 0.08]} />
        <meshStandardMaterial color={fabric} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.035, 0.04, 0.36, 8]} />
        <meshStandardMaterial color={metal} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.08, 0]} rotation={[0, Math.PI / 5, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.04, 5]} />
        <meshStandardMaterial color={plastic} />
      </mesh>
    </group>
  )
}

export function OfficeDesk({ position = [0, 0, 0], rotation = [0, 0, 0], width = 1.5, depth = 0.7, ar = false }) {
  const { wood, metal } = palettes(ar)
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.73, 0]}>
        <boxGeometry args={[width, 0.04, depth]} />
        <meshStandardMaterial color={wood} roughness={0.55} />
      </mesh>
      <mesh position={[-width / 2 + 0.08, 0.36, 0]}>
        <boxGeometry args={[0.06, 0.7, depth - 0.08]} />
        <meshStandardMaterial color={metal} />
      </mesh>
      <mesh position={[width / 2 - 0.08, 0.36, 0]}>
        <boxGeometry args={[0.06, 0.7, depth - 0.08]} />
        <meshStandardMaterial color={metal} />
      </mesh>
      <mesh position={[width / 2 - 0.22, 0.32, 0]}>
        <boxGeometry args={[0.28, 0.5, depth - 0.12]} />
        <meshStandardMaterial color={wood} />
      </mesh>
    </group>
  )
}

export function ConferenceTable({ position = [0, 0, 0], ar = false }) {
  const { wood, metal } = palettes(ar)
  return (
    <group position={position}>
      <mesh position={[0, 0.73, 0]}>
        <boxGeometry args={[2.6, 0.05, 1.15]} />
        <meshStandardMaterial color={wood} roughness={0.5} />
      </mesh>
      {[
        [-1.05, -0.4],
        [1.05, -0.4],
        [-1.05, 0.4],
        [1.05, 0.4],
      ].map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, 0.36, z]}>
          <boxGeometry args={[0.08, 0.7, 0.08]} />
          <meshStandardMaterial color={metal} metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

export function Monitor({ position, rotation = [0, 0, 0], ar = false }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[0.52, 0.34, 0.04]} />
        <meshStandardMaterial color="#1a1c1e" />
      </mesh>
      <mesh position={[0, 0.28, 0.022]}>
        <planeGeometry args={[0.46, 0.28]} />
        <meshStandardMaterial
          color={ar ? '#9ec8e8' : '#111'}
          emissive={ar ? '#3a7cae' : '#111'}
          emissiveIntensity={ar ? 0.55 : 0.05}
        />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.14, 0.12, 0.08]} />
        <meshStandardMaterial color="#2a2c2e" />
      </mesh>
    </group>
  )
}

export function PaperStack({ position, interactId }) {
  return (
    <mesh position={position} userData={{ interactId }}>
      <boxGeometry args={[0.22, 0.02, 0.28]} />
      <meshStandardMaterial color="#f2ead8" />
    </mesh>
  )
}

export function FileCabinet({ position, rotation = [0, 0, 0], ar = false }) {
  const { metal } = palettes(ar)
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry args={[0.45, 1.3, 0.55]} />
        <meshStandardMaterial color={metal} metalness={0.25} roughness={0.55} />
      </mesh>
    </group>
  )
}
