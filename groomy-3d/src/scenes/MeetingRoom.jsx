import RoomShell from '../systems/RoomShell.jsx'
import RoomDoor from '../systems/RoomDoor.jsx'
import MapEntryTrigger from '../systems/MapEntryTrigger.jsx'
import { ConferenceTable, FileCabinet, Monitor, PaperStack, TaskChair } from '../assets/OfficeFurniture.jsx'
import { ROOM_GRAPH, useGameState } from '../state/gameStateStore.js'

const HINTS = {
  emptyChair: '빈 의자 위에 산재 종결 서류가 있다. 날짜가 오늘이다.',
  clock: '벽시계가 멈춰 있다. 초침이 없다.',
  stain: '우안으로 보니 바닥 얼룩이 또렷하다. 닦인 척한 자국.',
  window: '창밖이 AR에선 도시, 필터가 옅어지면 콘크리트 벽이다.',
}

export default function MeetingRoom() {
  const ar = useGameState((s) => s.arFilterOn)
  const rightEyeHold = useGameState((s) => s.rightEyeHold)
  const meta = ROOM_GRAPH.meetingRoom
  const d = meta.size[2]
  const doorZ = -d / 2 + 0.28

  return (
    <RoomShell size={meta.size} ar={ar} roomId="meetingRoom" doorway="-z" doorPosition="-z">
      <ConferenceTable ar={ar} />
      {ar && <Monitor position={[0.45, 0.75, 0.1]} rotation={[0, -0.35, 0]} ar />}

      <TaskChair position={[-0.85, 0, 0.95]} rotation={[0, Math.PI, 0]} ar={ar} />
      <TaskChair position={[0, 0, 0.95]} rotation={[0, Math.PI, 0]} ar={ar} />
      <TaskChair position={[0.85, 0, 0.95]} rotation={[0, Math.PI, 0]} ar={ar} />
      <TaskChair position={[-0.85, 0, -0.95]} ar={ar} />
      <TaskChair position={[0.95, 0, -0.95]} fallen ar={ar} interactId="emptyChair" />
      <PaperStack position={[0.15, 0.77, -0.12]} interactId="emptyChair" />
      <FileCabinet position={[-5.4, 0, -3.2]} ar={ar} />
      <FileCabinet position={[-5.4, 0, -2.5]} ar={ar} />

      <mesh position={[0, 2.4, -5.82]} userData={{ interactId: 'clock' }}>
        <cylinderGeometry args={[0.28, 0.28, 0.06, 16]} />
        <meshStandardMaterial color="#d0d0d0" />
      </mesh>
      <mesh position={[0, 2.4, -5.78]} rotation={[Math.PI / 2, 0, 0.4]}>
        <boxGeometry args={[0.02, 0.01, 0.16]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      <mesh position={[-1.6, 0.02, 1.4]} rotation={[0, 0.3, 0]} userData={{ interactId: 'stain' }}>
        <cylinderGeometry args={[0.45, 0.55, 0.02, 10]} />
        <meshStandardMaterial
          color={rightEyeHold ? '#6a2030' : ar ? '#d0d6dc' : '#3a342e'}
          transparent
          opacity={rightEyeHold ? 0.9 : 0.18}
          emissive={rightEyeHold ? '#4a1020' : '#000'}
          emissiveIntensity={rightEyeHold ? 0.5 : 0}
        />
      </mesh>

      <mesh position={[5.88, 1.7, 0]} userData={{ interactId: 'window' }}>
        <boxGeometry args={[0.08, 1.6, 2.2]} />
        <meshStandardMaterial color={ar ? '#8ec8f0' : '#4a4a48'} emissive={ar ? '#4a90c0' : '#111'} emissiveIntensity={ar ? 0.35 : 0.05} />
      </mesh>
      <mesh position={[5.7, 1.7, -1.05]}>
        <boxGeometry args={[0.06, 1.8, 0.08]} />
        <meshStandardMaterial color={ar ? '#c5ced4' : '#2c2824'} />
      </mesh>
      <mesh position={[5.7, 1.7, 1.05]}>
        <boxGeometry args={[0.06, 1.8, 0.08]} />
        <meshStandardMaterial color={ar ? '#c5ced4' : '#2c2824'} />
      </mesh>

      <RoomDoor roomId="meetingRoom" z={doorZ} ar={ar} />
      <MapEntryTrigger to="serverRoom" halfWidth={1.2} zBelow={doorZ - 0.35} marker={[0, 1.2, doorZ - 0.4]} />
    </RoomShell>
  )
}

export const MEETING_HINTS = HINTS
