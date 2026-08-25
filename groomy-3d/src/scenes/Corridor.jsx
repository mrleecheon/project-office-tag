import RoomShell from '../systems/RoomShell.jsx'
import RoomDoor from '../systems/RoomDoor.jsx'
import MapEntryTrigger from '../systems/MapEntryTrigger.jsx'
import { useGameState } from '../state/gameStateStore.js'

export default function Corridor() {
  const ar = useGameState((s) => s.arFilterOn)
  const depth = 18
  const doorZ = -depth / 2 + 0.28

  return (
    <RoomShell size={[8, 3.4, depth]} ar={ar} roomId="corridor" doorway="-z" doorPosition="-z">
      <mesh position={[-2.2, 1.2, -2]}>
        <boxGeometry args={[0.12, 1.6, 2.4]} />
        <meshStandardMaterial color={ar ? '#9ec4e8' : '#3a342e'} emissive={ar ? '#3a7cae' : '#000'} emissiveIntensity={ar ? 0.4 : 0} />
      </mesh>
      <mesh position={[2.2, 1.2, 2]}>
        <boxGeometry args={[0.12, 1.6, 2.4]} />
        <meshStandardMaterial color={ar ? '#9ec4e8' : '#3a342e'} />
      </mesh>
      <RoomDoor roomId="corridor" z={doorZ} ar={ar} />
      <MapEntryTrigger to="office" halfWidth={1.4} zBelow={doorZ + 0.55} marker={[0, 1.2, doorZ + 0.2]} />
    </RoomShell>
  )
}
