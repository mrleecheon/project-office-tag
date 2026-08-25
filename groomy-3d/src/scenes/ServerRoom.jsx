import RoomShell from '../systems/RoomShell.jsx'
import RoomDoor from '../systems/RoomDoor.jsx'
import MapEntryTrigger from '../systems/MapEntryTrigger.jsx'
import { ROOM_GRAPH, useGameState } from '../state/gameStateStore.js'

function SkeletonRoom({ roomId }) {
  const ar = useGameState((s) => s.arFilterOn)
  const meta = ROOM_GRAPH[roomId]
  const d = meta.size[2]
  const doorZ = -d / 2 + 0.28

  return (
    <RoomShell size={meta.size} ar={ar} roomId={roomId} doorway={meta.nextRoom ? '-z' : null} doorPosition={meta.nextRoom ? '-z' : 'none'}>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[1.2, 0.12, 1.2]} />
        <meshStandardMaterial color={ar ? '#c5d0da' : '#4a4038'} />
      </mesh>
      {meta.nextRoom && (
        <>
          <RoomDoor roomId={roomId} z={doorZ} ar={ar} />
          <MapEntryTrigger
            to={meta.nextRoom}
            halfWidth={1.2}
            zBelow={doorZ - 0.35}
            marker={[0, 1.2, doorZ - 0.4]}
          />
        </>
      )}
    </RoomShell>
  )
}

export default function ServerRoom() {
  return <SkeletonRoom roomId="serverRoom" />
}
