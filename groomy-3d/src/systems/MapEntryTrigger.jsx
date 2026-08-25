import { useFrame, useThree } from '@react-three/fiber'
import { ROOM_GRAPH, useGameState } from '../state/gameStateStore.js'

export default function MapEntryTrigger({
  to,
  halfWidth = 1.2,
  zBelow = -9.35,
  marker = [0, 1.2, -10.1],
}) {
  const { camera } = useThree()
  const currentRoom = useGameState((s) => s.currentRoom)
  const goToRoom = useGameState((s) => s.goToRoom)
  const doorOpen = useGameState((s) => s.doorOpen)
  const exitOpen = useGameState((s) => s.exitOpen)

  useFrame(() => {
    const meta = ROOM_GRAPH[currentRoom]
    if (!meta || meta.nextRoom !== to) return
    const open = currentRoom === 'lobby' ? doorOpen : Boolean(exitOpen[currentRoom])
    if (!open) return
    const { x, z } = camera.position
    if (Math.abs(x) < halfWidth && z < zBelow) goToRoom(to)
  })

  return (
    <mesh position={marker} visible={false}>
      <boxGeometry args={[2.2, 2.4, 1.2]} />
    </mesh>
  )
}
