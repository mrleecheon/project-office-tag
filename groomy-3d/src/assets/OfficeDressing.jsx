function CeilingTiles({ width, depth, height, ar }) {
  const step = 1.2
  const tiles = []
  const x0 = -width / 2 + step / 2
  const z0 = -depth / 2 + step / 2
  for (let x = x0; x < width / 2; x += step) {
    for (let z = z0; z < depth / 2; z += step) {
      const ruined = !ar && ((Math.round(x * 3) + Math.round(z * 5)) % 11 === 0)
      tiles.push(
        <mesh
          key={`${x}-${z}`}
          position={[x, height - 0.18, z]}
          rotation={ruined ? [0.18, 0, 0.08] : [0, 0, 0]}
        >
          <boxGeometry args={[1.12, 0.03, 1.12]} />
          <meshStandardMaterial color={ar ? '#eef2f5' : '#6a6258'} roughness={0.9} />
        </mesh>,
      )
    }
  }
  return <group>{tiles}</group>
}

function Fluorescents({ width, depth, height, ar }) {
  const lights = []
  const cols = Math.max(1, Math.round(width / 4))
  const rows = Math.max(1, Math.round(depth / 4))
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = -width / 2 + ((i + 0.5) * width) / cols
      const z = -depth / 2 + ((j + 0.5) * depth) / rows
      const on = ar || (i + j) % 2 === 0
      lights.push(
        <group key={`${i}-${j}`} position={[x, height - 0.26, z]}>
          <mesh>
            <boxGeometry args={[1.15, 0.06, 0.22]} />
            <meshStandardMaterial
              color={on ? '#f4f7ea' : '#3a3834'}
              emissive={on ? '#f0f4c8' : '#000'}
              emissiveIntensity={on ? (ar ? 1.4 : 0.35) : 0}
            />
          </mesh>
          {on && <pointLight intensity={ar ? 4.5 : 1.6} distance={7} color={ar ? '#f5f3e8' : '#c9b48a'} />}
        </group>,
      )
    }
  }
  return <group>{lights}</group>
}

export default function OfficeDressing({ size, ar }) {
  const [w, h, d] = size
  return (
    <group>
      <CeilingTiles width={w} depth={d} height={h} ar={ar} />
      <Fluorescents width={w} depth={d} height={h} ar={ar} />
      <mesh position={[-w / 2 + 0.14, 0.06, 0]}>
        <boxGeometry args={[0.04, 0.12, d - 0.3]} />
        <meshStandardMaterial color={ar ? '#9aa6b0' : '#2a2622'} />
      </mesh>
      <mesh position={[w / 2 - 0.14, 0.06, 0]}>
        <boxGeometry args={[0.04, 0.12, d - 0.3]} />
        <meshStandardMaterial color={ar ? '#9aa6b0' : '#2a2622'} />
      </mesh>
    </group>
  )
}
