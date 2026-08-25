import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameState } from '../state/gameStateStore.js'

const CLOSED = 0
const OPEN = -1.85
const DURATION = 0.8

export default function RoomDoor({ roomId, z = -8.85, ar = false }) {
  const hinge = useRef()
  const progress = useRef(0)
  const exitOpen = useGameState((s) => s.exitOpen[roomId])
  const exitAnimating = useGameState((s) => s.exitAnimating[roomId])
  const finishExitOpen = useGameState((s) => s.finishExitOpen)

  useFrame((_, delta) => {
    if (!hinge.current) return
    if (exitAnimating && !exitOpen) {
      progress.current = Math.min(1, progress.current + delta / DURATION)
      hinge.current.rotation.y = CLOSED + (OPEN - CLOSED) * progress.current
      if (progress.current >= 1) finishExitOpen(roomId)
    } else {
      hinge.current.rotation.y = exitOpen ? OPEN : CLOSED
    }
  })

  return (
    <group position={[-1.15, 0, z]} ref={hinge}>
      <mesh position={[1.15, 1.55, 0]} userData={{ interactId: 'exitDoor' }}>
        <boxGeometry args={[2.3, 3.1, 0.12]} />
        <meshStandardMaterial
          color={ar ? '#9ec4e8' : '#1c1a18'}
          metalness={ar ? 0.35 : 0.05}
          roughness={ar ? 0.3 : 0.9}
        />
      </mesh>
    </group>
  )
}
