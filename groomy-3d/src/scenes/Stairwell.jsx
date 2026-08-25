import RoomShell from '../systems/RoomShell.jsx'
import RoomDoor from '../systems/RoomDoor.jsx'
import MapEntryTrigger from '../systems/MapEntryTrigger.jsx'
import { ROOM_GRAPH, useGameState } from '../state/gameStateStore.js'

export default function Stairwell() {
  const ar = useGameState((s) => s.arFilterOn)
  const meta = ROOM_GRAPH.stairwell
  const d = meta.size[2]
  const doorZ = -d / 2 + 0.28

  return (
    <RoomShell size={meta.size} ar={ar} roomId="stairwell" doorway="-z" doorPosition="-z">
      <mesh position={[0, 0.45, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[2.4, 0.2, 1.4]} />
        <meshStandardMaterial color={ar ? '#d0d8e0' : '#3a342e'} />
      </mesh>
      <RoomDoor roomId="stairwell" z={doorZ} ar={ar} />
      <MapEntryTrigger to="groomyRoom" halfWidth={1.2} zBelow={doorZ - 0.35} marker={[0, 1.2, doorZ - 0.4]} />
    </RoomShell>
  )
}
