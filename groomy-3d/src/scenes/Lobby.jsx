import { AdditiveBlending } from 'three'
import { Sparkles } from '@react-three/drei'
import RoomShell from '../systems/RoomShell.jsx'
import LobbyDoor from '../systems/LobbyDoor.jsx'
import MapEntryTrigger from '../systems/MapEntryTrigger.jsx'
import WorldPrompt from '../systems/WorldPrompt.jsx'
import { FileCabinet, Monitor, OfficeDesk, TaskChair } from '../assets/OfficeFurniture.jsx'
import { MetalOfficeDesk } from '../components/models/MetalOfficeDesk.jsx'
import { PottedPlant04 } from '../components/models/PottedPlant04.jsx'
import { SchoolChair } from '../components/models/SchoolChair.jsx'
import { useGameState } from '../state/gameStateStore.js'

function LightShaft({ position, rotation, args = [1.15, 11, 24, 1, true] }) {
  return (
    <mesh position={position} rotation={rotation} renderOrder={2}>
      <coneGeometry args={args} />
      <meshBasicMaterial
        color="#d7e8ff"
        transparent
        opacity={0.027}
        blending={AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}

function LobbyHeroLight() {
  return (
    <group>
      <spotLight
        position={[-5.1, 3.05, -9.1]}
        angle={0.42}
        penumbra={0.85}
        intensity={18}
        distance={22}
        color="#cfe4ff"
        castShadow={false}
      />
      <mesh position={[-5.15, 2.72, -9.86]}>
        <planeGeometry args={[1.7, 0.82]} />
        <meshBasicMaterial color="#e8f3ff" transparent opacity={0.55} toneMapped={false} />
      </mesh>
      <mesh position={[-5.15, 2.72, -9.88]}>
        <planeGeometry args={[1.86, 0.96]} />
        <meshStandardMaterial color="#2a2a2c" roughness={0.9} />
      </mesh>
      <LightShaft position={[-5.05, 2.55, -9.2]} rotation={[1.12, 0, 0.38]} />
      <LightShaft position={[-4.55, 2.48, -9.05]} rotation={[1.18, 0.04, 0.28]} args={[0.85, 10.2, 20, 1, true]} />
      <LightShaft position={[-5.55, 2.5, -9.1]} rotation={[1.08, -0.05, 0.48]} args={[0.72, 9.4, 18, 1, true]} />
      <Sparkles
        count={36}
        scale={[3.6, 2.8, 9.5]}
        size={2.1}
        speed={0.18}
        opacity={0.28}
        color="#e7f2ff"
        position={[-2.4, 1.55, -3.4]}
      />
    </group>
  )
}

export default function Lobby() {
  const ar = useGameState((s) => s.arFilterOn)
  const hasKey = useGameState((s) => s.hasKey)
  const lookId = useGameState((s) => s.lookId)

  const keyLabel = lookId === 'key' && !hasKey ? 'E  카드키 줍기' : null
  const readerLabel =
    lookId === 'reader' && !ar
      ? hasKey
        ? 'E  사원증 태그'
        : '카드키가 필요하다'
      : null

  return (
    <RoomShell
      size={[20, 3.4, 20]}
      ar={ar}
      doorway="-z"
      modular
      floorRoughness={ar ? 0.38 : 0.3}
      floorEnvMapIntensity={ar ? 1.05 : 0.92}
    >
      <pointLight position={[-2.2, 0.8, -4.2]} intensity={hasKey ? 0 : 4} distance={5} color="#e6c25a" />
      <LobbyHeroLight />

      <OfficeDesk position={[-4.2, 0, -5.4]} width={1.6} depth={0.72} ar={ar} />
      <TaskChair position={[-4.2, 0, -4.55]} rotation={[0, Math.PI, 0]} ar={ar} />
      <Monitor position={[-3.85, 0.75, -5.45]} rotation={[0, 0.15, 0]} ar={ar} />
      <FileCabinet position={[-6.6, 0, -5.5]} ar={ar} />

      <MetalOfficeDesk position={[5.4, 0, -1.8]} rotation={[0, -1.15, 0]} scale={1} />
      <SchoolChair position={[3.55, 0, 1.35]} rotation={[0, 0.4, 0]} />
      <SchoolChair position={[4.85, 0, 1.55]} rotation={[0, -0.25, 0]} />
      <PottedPlant04 position={[-7.35, 0, 2.9]} scale={1.15} />

      {!ar && (
        <>
          <mesh position={[4.8, 0.18, -3.4]} rotation={[0.15, -0.4, 0.1]}>
            <boxGeometry args={[0.7, 0.35, 0.45]} />
            <meshStandardMaterial color="#4a3a30" />
          </mesh>
          <mesh position={[-6.4, 0.12, 3.1]} rotation={[0, 0.6, 0.2]}>
            <boxGeometry args={[0.8, 0.22, 0.5]} />
            <meshStandardMaterial color="#2c2824" />
          </mesh>
        </>
      )}

      <LobbyDoor />
      <mesh position={[0, 1.55, -9.4]} userData={{ interactId: 'door' }}>
        <boxGeometry args={[2.6, 3.1, 1.5]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh position={[1.45, 1.38, -9.55]} userData={{ interactId: 'reader' }}>
        <boxGeometry args={[0.28, 0.42, 0.14]} />
        <meshStandardMaterial
          color={hasKey ? '#d4c070' : '#8a7a4a'}
          emissive={hasKey ? '#d4b24a' : '#5a4a20'}
          emissiveIntensity={hasKey ? 1.4 : 0.7}
        />
      </mesh>
      <mesh position={[1.45, 1.2, -9.2]} userData={{ interactId: 'reader' }}>
        <boxGeometry args={[1.8, 2.4, 2.2]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {readerLabel && <WorldPrompt position={[1.45, 1.72, -9.55]} label={readerLabel} />}
      {!hasKey && (
        <>
          <mesh
            position={[-2.35, 0.08, -4.55]}
            rotation={[0, 0.5, 0]}
            userData={{ interactId: 'key', interactReach: 2 }}
          >
            <boxGeometry args={[0.55, 0.06, 0.28]} />
            <meshStandardMaterial color="#d4c36a" emissive="#b79a30" emissiveIntensity={1.1} />
          </mesh>
          <mesh position={[-2.35, 0.4, -4.55]} userData={{ interactId: 'key', interactReach: 2 }}>
            <boxGeometry args={[0.9, 0.85, 0.9]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          {keyLabel && (
            <WorldPrompt
              position={[-2.35, 0.42, -4.55]}
              label={keyLabel}
              description="노랗게 빛나는 카드 형태의 물체."
            />
          )}
        </>
      )}
      <MapEntryTrigger to="corridor" halfWidth={2.4} zBelow={-8.5} marker={[0, 1.2, -10.1]} />
    </RoomShell>
  )
}
