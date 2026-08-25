import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { characters } from '@groomy/game/content/world/characters.js'
import RoomShell from '../systems/RoomShell.jsx'
import { OfficeDesk, TaskChair } from '../assets/OfficeFurniture.jsx'
import { ROOM_GRAPH, useGameState } from '../state/gameStateStore.js'

function CoworkerBlob({ position, accent, bubble, shape = 'icosa', interactId }) {
  const mesh = useRef()
  useFrame((_, delta) => {
    if (!mesh.current) return
    mesh.current.rotation.y += delta * 0.18
  })
  const geo =
    shape === 'dodeca' ? <dodecahedronGeometry args={[0.2, 0]} />
    : shape === 'octa' ? <octahedronGeometry args={[0.22, 0]} />
    : <icosahedronGeometry args={[0.2, 0]} />
  const data = { interactId, interactId: interactId }
  return (
    <group position={position}>
      <mesh position={[0, 0.72, 0]} userData={data}>
        <boxGeometry args={[0.3, 0.44, 0.24]} />
        <meshStandardMaterial color={bubble} roughness={0.7} />
      </mesh>
      <mesh ref={mesh} position={[0, 1.1, 0]} userData={data}>
        {geo}
        <meshStandardMaterial
          color={accent}
          roughness={0.4}
          emissive={accent}
          emissiveIntensity={0.35}
          flatShading
        />
      </mesh>
    </group>
  )
}

function InspectProp({ id, position, color, args, visible = true }) {
  if (!visible) return null
  return (
    <mesh position={position} userData={{ interactId: id }}>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  )
}

export default function Office() {
  const ar = useGameState((s) => s.arFilterOn)
  const inventory = useGameState((s) => s.inventory)
  const officeInspected = useGameState((s) => s.officeInspected)
  const meta = ROOM_GRAPH.office
  const taken = (id) => inventory.includes(id)

  return (
    <RoomShell size={meta.size} ar={ar} roomId="office" doorway="-z" doorPosition="-z">
      <OfficeDesk position={[-3.1, 0, -1.4]} ar={ar} />
      <TaskChair position={[-3.1, 0, -0.55]} rotation={[0, Math.PI, 0]} ar={ar} />
      <OfficeDesk position={[3.1, 0, -1.4]} ar={ar} />
      <TaskChair position={[3.1, 0, -0.55]} rotation={[0, Math.PI, 0]} ar={ar} />
      <OfficeDesk position={[-3.1, 0, 1.6]} ar={ar} />
      <TaskChair position={[-3.1, 0, 0.75]} ar={ar} />
      <OfficeDesk position={[3.1, 0, 1.6]} ar={ar} />
      <TaskChair position={[3.1, 0, 0.75]} ar={ar} />

      <CoworkerBlob
        position={[3.1, 0, -0.55]}
        accent={characters.iseol.accent}
        bubble={characters.iseol.bubble}
        shape="icosa"
        interactId="staff-isol"
      />
      <CoworkerBlob
        position={[-3.1, 0, 0.75]}
        accent={characters.kim.accent}
        bubble={characters.kim.bubble}
        shape="dodeca"
        interactId="staff-kim"
      />
      <CoworkerBlob
        position={[3.1, 0, 0.75]}
        accent={characters.choi.accent}
        bubble={characters.choi.bubble}
        shape="octa"
        interactId="staff-choi"
      />

      <InspectProp id="calendar" position={[-3.35, 0.78, -1.15]} color="#c45c4a" args={[0.28, 0.02, 0.34]} visible={!taken('calendar')} />
      <InspectProp id="wallet" position={[3.35, 0.78, -1.55]} color="#5b3a24" args={[0.16, 0.03, 0.22]} visible={!taken('wallet')} />
      <InspectProp id="pork" position={[-2.85, 0.79, 1.45]} color="#d8a090" args={[0.22, 0.05, 0.16]} />
      <InspectProp id="nail" position={[2.85, 0.78, 1.35]} color="#e8c4d4" args={[0.08, 0.015, 0.12]} visible={!taken('nail')} />
      <InspectProp id="pills" position={[3.45, 0.79, 1.75]} color="#d8d2c4" args={[0.1, 0.04, 0.07]} visible={!officeInspected.pills} />
    </RoomShell>
  )
}
