import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameState } from '../state/gameStateStore.js'

const CLOSED = 0
const OPEN = -1.85
const DURATION = 0.8

export default function LobbyDoor() {
  const hinge = useRef()
  const progress = useRef(0)
  const arFilterOn = useGameState((s) => s.arFilterOn)
  const doorOpen = useGameState((s) => s.doorOpen)
  const finishDoorOpen = useGameState((s) => s.finishDoorOpen)

  useFrame((_, delta) => {
    if (!hinge.current) return
    if (arFilterOn && !doorOpen) {
      progress.current = Math.min(1, progress.current + delta / DURATION)
      hinge.current.rotation.y = CLOSED + (OPEN - CLOSED) * progress.current
      if (progress.current >= 1) finishDoorOpen()
    } else {
      hinge.current.rotation.y = doorOpen ? OPEN : CLOSED
    }
  })

  return (
    <group position={[-1.15, 0, -9.72]} ref={hinge}>
      <mesh position={[1.15, 1.55, 0]}>
        <boxGeometry args={[2.3, 3.1, 0.12]} />
        <meshStandardMaterial
          color={arFilterOn ? '#9ec4e8' : '#1c1a18'}
          metalness={arFilterOn ? 0.35 : 0.05}
          roughness={arFilterOn ? 0.3 : 0.9}
        />
      </mesh>
    </group>
  )
}
