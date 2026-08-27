import RoomShell from '../systems/RoomShell.jsx'
import SubduedRoomAccent from '../systems/SubduedRoomAccent.jsx'
import { ROOM_GRAPH, useGameState } from '../state/gameStateStore.js'

export const STAIR_SPAWN = [0, 1.6, 1.15]
/** maxZ = 아래층 차단선 — PlayerController clamp로 하강 불가 */
export const STAIR_BOUNDS = { minX: -3.2, maxX: 3.2, minZ: -4.6, maxZ: 2.35 }

/** 아래층 방향 차단선 (이 z 이상으로 못 감) — 플레이어는 -z 반층으로만 */
export const STAIR_DOWN_BLOCK_Z = 2.35

const DIM_LIGHT = {
  ambientScale: 0.72,
  hemiScale: 0.72,
  directionalScale: 0.76,
  floorEnvMapIntensity: 0.34,
}

function StepRun({ startZ, steps, rise = 0.14, run = 0.42, width = 2.2, ar }) {
  const color = ar ? '#c8d0d8' : '#3a342e'
  return (
    <group>
      {Array.from({ length: steps }, (_, i) => (
        <mesh
          key={i}
          position={[0, rise * (i + 0.5), startZ - run * i]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[width, rise, run]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
      ))}
    </group>
  )
}

/** 반층 시체 — 멀리서 사람 실루엣 정도 */
function CorpseSilhouette({ position = [0.35, 1.05, -2.15] }) {
  return (
    <group position={position} rotation={[0.15, 0.55, 1.15]}>
      <mesh userData={{ interactId: 'stair-corpse', interactReach: 2.6 }} castShadow>
        <boxGeometry args={[0.38, 0.22, 0.85]} />
        <meshStandardMaterial color="#4a4540" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.08, 0.52]} castShadow>
        <boxGeometry args={[0.28, 0.26, 0.28]} />
        <meshStandardMaterial color="#3d3834" roughness={0.95} />
      </mesh>
      <mesh position={[0.28, 0.02, 0.1]} rotation={[0, 0, 0.7]} castShadow>
        <boxGeometry args={[0.14, 0.14, 0.5]} />
        <meshStandardMaterial color="#4a4540" roughness={0.95} />
      </mesh>
      <mesh position={[-0.22, -0.02, -0.2]} rotation={[0.2, 0, -0.5]} castShadow>
        <boxGeometry args={[0.14, 0.14, 0.45]} />
        <meshStandardMaterial color="#4a4540" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.2, 0]} userData={{ interactId: 'stair-corpse', interactReach: 2.8 }}>
        <boxGeometry args={[1.4, 1.2, 1.4]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

/** TODO: 상흔 알리바이 단서 — 조사/VN/인벤 연결 예정 (지금은 장식 프리미티브만) */
function SangheonAlibiClue({ ar = false }) {
  const box = ar ? '#8a9098' : '#4a4038'
  const tape = ar ? '#d8c870' : '#6a5a30'
  return (
    <group position={[-1.15, 0.84, -1.72]} rotation={[0, 0.35, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.34, 0.11, 0.24]} />
        <meshStandardMaterial color={box} roughness={0.88} />
      </mesh>
      <mesh position={[0.02, 0.07, 0]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[0.14, 0.02, 0.18]} />
        <meshStandardMaterial color={tape} roughness={0.75} />
      </mesh>
    </group>
  )
}

/**
 * 플레이 가능한 계단실 — 아래 차단, 반층 시체, 위쪽 비상구 유도.
 */
export default function Stairwell() {
  const ar = useGameState((s) => s.arFilterOn)
  const meta = ROOM_GRAPH.stairwell
  const rail = ar ? '#9aa6b0' : '#2c2824'
  const wallDark = ar ? '#d7dee4' : '#2a2622'

  return (
    <RoomShell
      size={meta.size}
      ar={ar}
      roomId="stairwell"
      doorPosition="none"
      floorEnvMapIntensity={DIM_LIGHT.floorEnvMapIntensity}
      ambientScale={DIM_LIGHT.ambientScale}
      hemiScale={DIM_LIGHT.hemiScale}
      directionalScale={DIM_LIGHT.directionalScale}
    >
      <SubduedRoomAccent
        spotPosition={[-1.4, 3.35, -0.6]}
        sparkPosition={[-0.5, 1.55, -1.2]}
        sparkScale={[2.8, 2.6, 4.2]}
        sparkCount={16}
      />

      {/* 아래층으로 보이는 구멍/난간 — 진입 불가 */}
      <mesh position={[0, -0.6, 3.6]} receiveShadow>
        <boxGeometry args={[3.2, 0.08, 2.4]} />
        <meshStandardMaterial color={ar ? '#1a2228' : '#0e0c0a'} />
      </mesh>
      <mesh position={[0, 0.9, STAIR_DOWN_BLOCK_Z + 0.55]} userData={{ interactId: 'stair-down', interactReach: 2.2 }}>
        <boxGeometry args={[2.6, 1.8, 0.2]} />
        <meshStandardMaterial color={rail} transparent opacity={0.35} />
      </mesh>
      {/* 충돌 벽: 아래로 못 감 */}
      <mesh position={[0, 1.2, STAIR_DOWN_BLOCK_Z]} userData={{ interactId: 'stair-down', interactReach: 1.6 }}>
        <boxGeometry args={[3.4, 2.6, 0.35]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* 위로 반층으로 이어지는 계단 */}
      <StepRun startZ={1.6} steps={6} rise={0.12} run={0.48} width={2.3} ar={ar} />

      {/* 반층 참 */}
      <mesh position={[0, 0.78, -2.0]} receiveShadow>
        <boxGeometry args={[3.4, 0.12, 2.6]} />
        <meshStandardMaterial color={ar ? '#cfd6dc' : '#35302c'} roughness={0.9} />
      </mesh>
      <mesh position={[-1.55, 1.35, -2.0]}>
        <boxGeometry args={[0.08, 1.1, 2.5]} />
        <meshStandardMaterial color={rail} />
      </mesh>
      <mesh position={[1.55, 1.35, -2.0]}>
        <boxGeometry args={[0.08, 1.1, 2.5]} />
        <meshStandardMaterial color={rail} />
      </mesh>

      <SangheonAlibiClue ar={ar} />

      <CorpseSilhouette />

      {/* 위쪽 비상구 (장식 — 유도용) */}
      <mesh position={[0, 2.1, -4.55]}>
        <boxGeometry args={[1.2, 2.1, 0.1]} />
        <meshStandardMaterial color={wallDark} emissive={ar ? '#3a5058' : '#1a1010'} emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[0, 3.35, -4.52]}>
        <boxGeometry args={[0.55, 0.12, 0.04]} />
        <meshStandardMaterial color={ar ? '#c04040' : '#6a2020'} emissive="#802020" emissiveIntensity={0.4} />
      </mesh>
    </RoomShell>
  )
}
