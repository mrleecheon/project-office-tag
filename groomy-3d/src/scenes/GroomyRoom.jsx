import RoomShell from '../systems/RoomShell.jsx'
import { ROOM_GRAPH, useGameState } from '../state/gameStateStore.js'

export default function GroomyRoom() {
  const ar = useGameState((s) => s.arFilterOn)
  const meta = ROOM_GRAPH.groomyRoom

  return (
    <RoomShell size={meta.size} ar={ar} roomId="groomyRoom" doorway={null} doorPosition="none">
      <mesh position={[0, 0.7, -1.4]}>
        <boxGeometry args={[1.4, 1.4, 0.6]} />
        <meshStandardMaterial color={ar ? '#b8c8d8' : '#3a3230'} />
      </mesh>
    </RoomShell>
  )
}
