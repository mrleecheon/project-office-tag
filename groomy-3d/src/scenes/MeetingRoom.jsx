import RoomShell from '../systems/RoomShell.jsx'
import { OfficeHumAudio } from '../systems/SceneAmbientAudio.jsx'
import SubduedRoomAccent from '../systems/SubduedRoomAccent.jsx'
import RightEyeFloorStain from '../systems/RightEyeFloorStain.jsx'
import MeetingWindowView from '../systems/MeetingWindowView.jsx'
import { TaskChair } from '../assets/OfficeFurniture.jsx'
import { SchoolChair } from '../components/models/SchoolChair.jsx'
import { OfficeNotepads } from '../components/models/OfficeNotepads.jsx'
import { WallClock } from '../components/models/WallClock.jsx'
import { ROOM_GRAPH, useGameState } from '../state/gameStateStore.js'

/** 테이블 전체가 한눈에 들어오는 고정 컷 앵글 */
export const MEETING_CUT_CAMERA = [5.1, 3.15, 5.35]
export const MEETING_CUT_LOOK = [0, 0.55, 0]
export const MEETING_CUT_FOV = 48
export const MEETING_WALK_SPAWN = [0, 1.6, 3.4]

const TABLE_LEN = 4.2
const TABLE_WID = 1.25
const TABLE_TOP_Y = 0.74

const DIM_LIGHT = {
  ambientScale: 0.74,
  hemiScale: 0.74,
  directionalScale: 0.78,
  floorEnvMapIntensity: 0.38,
}

function MeetingTable({ ar = false }) {
  const wood = ar ? '#d5c4a8' : '#4a3f34'
  const metal = ar ? '#8a96a0' : '#3a3836'
  const legX = TABLE_LEN / 2 - 0.18
  const legZ = TABLE_WID / 2 - 0.16
  return (
    <group>
      <mesh position={[0, TABLE_TOP_Y, 0]} castShadow receiveShadow>
        <boxGeometry args={[TABLE_LEN, 0.06, TABLE_WID]} />
        <meshStandardMaterial color={wood} roughness={0.52} />
      </mesh>
      {[
        [-legX, -legZ],
        [legX, -legZ],
        [-legX, legZ],
        [legX, legZ],
      ].map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, TABLE_TOP_Y / 2, z]} castShadow>
          <boxGeometry args={[0.09, TABLE_TOP_Y, 0.09]} />
          <meshStandardMaterial color={metal} metalness={0.45} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

/** 산재 서류 — HeroProp 밖 프리미티브 (가벼운 보조) */
function LooseSheets({ ar = false }) {
  const paper = ar ? '#ece4cc' : '#8a8070'
  return (
    <group position={[2.05, 0, 0.62]}>
      <mesh position={[0.12, 0.012, 0.08]} rotation={[-Math.PI / 2, 0, 0.55]}>
        <planeGeometry args={[0.24, 0.3]} />
        <meshStandardMaterial color={paper} roughness={0.92} />
      </mesh>
      <mesh position={[-0.18, 0.01, -0.14]} rotation={[-Math.PI / 2, 0, -0.25]}>
        <planeGeometry args={[0.2, 0.26]} />
        <meshStandardMaterial color={paper} roughness={0.92} />
      </mesh>
    </group>
  )
}

const CHAIR_SLOTS = [
  { position: [-1.35, 0, 1.05], rotation: [0, Math.PI, 0] },
  { position: [0, 0, 1.05], rotation: [0, Math.PI, 0] },
  { position: [1.35, 0, 1.05], rotation: [0, Math.PI, 0] },
  { position: [-1.35, 0, -1.05], rotation: [0, 0, 0] },
  { position: [0, 0, -1.05], rotation: [0, 0, 0] },
  { position: [1.35, 0, -1.05], rotation: [0, 0, 0] },
  { position: [-2.45, 0, 0], rotation: [0, Math.PI / 2, 0] },
  { position: [2.45, 0, 0], rotation: [0, -Math.PI / 2, 0], empty: true },
]

/**
 * 회의실 — 테이블·의자 + 위화감 소품 + 출구 문(조사 트리거 없음).
 */
export default function MeetingRoom({ showDoor = true } = {}) {
  const ar = useGameState((s) => s.arFilterOn)
  const meta = ROOM_GRAPH.meetingRoom
  const d = meta.size[2]
  const doorZ = -d / 2 + 0.35

  return (
    <RoomShell
      size={meta.size}
      ar={ar}
      roomId="meetingRoom"
      doorway="-z"
      doorPosition="-z"
      floorEnvMapIntensity={DIM_LIGHT.floorEnvMapIntensity}
      ambientScale={DIM_LIGHT.ambientScale}
      hemiScale={DIM_LIGHT.hemiScale}
      directionalScale={DIM_LIGHT.directionalScale}
    >
      <OfficeHumAudio />
      <SubduedRoomAccent
        spotPosition={[1.6, 2.95, 2.1]}
        sparkPosition={[0.4, 1.42, 0.2]}
        sparkScale={[3.4, 2.1, 3.6]}
        sparkCount={18}
      />

      <MeetingTable ar={ar} />

      {CHAIR_SLOTS.map((slot) => {
        const key = `${slot.position[0]}-${slot.position[2]}`
        if (slot.empty) {
          return (
            <SchoolChair
              key={key}
              position={slot.position}
              rotation={slot.rotation}
            />
          )
        }
        return (
          <TaskChair
            key={key}
            position={slot.position}
            rotation={slot.rotation}
            ar={ar}
          />
        )
      })}

      {/* 빈 의자 옆 산재 서류 — OfficeNotepads(HeroProp+ContactShadows) + 보조 시트 */}
      <OfficeNotepads
        position={[2.08, 0.02, 0.48]}
        rotation={[0, 0.48, 0.04]}
        scale={0.72}
      />
      <LooseSheets ar={ar} />

      {/* 멈춘 벽시계 — 10:00 고정 (HeroProp, contact=false) */}
      <WallClock
        frozen
        position={[0, 2.48, -5.78]}
        rotation={[0, Math.PI, 0]}
        scale={0.38}
      />

      {/* 우안(F) 전용 바닥 얼룩 */}
      <RightEyeFloorStain />

      {/* AR/폐허 창밖 풍경 */}
      <MeetingWindowView ar={ar} />

      {showDoor && (
        <group position={[0, 1.35, doorZ]}>
          <mesh userData={{ interactId: 'meeting-door', interactReach: 2.4 }}>
            <boxGeometry args={[1.35, 2.35, 0.12]} />
            <meshStandardMaterial color={ar ? '#c5ced6' : '#2a2622'} roughness={0.75} />
          </mesh>
          <mesh position={[0.55, 0, 0.08]}>
            <boxGeometry args={[0.08, 0.18, 0.06]} />
            <meshStandardMaterial color={ar ? '#8a96a0' : '#1a1816'} metalness={0.4} />
          </mesh>
        </group>
      )}
    </RoomShell>
  )
}
