import { useGameState } from '../state/gameStateStore.js'

/** F(우안) 홀드 시에만 보이는 바닥 핏자국/얼룩 */
export default function RightEyeFloorStain({
  position = [1.05, 0.013, 0.42],
  rotation = [-Math.PI / 2, 0, 0.35],
  scale = [0.95, 0.72, 1],
}) {
  const rightEyeHold = useGameState((s) => s.rightEyeHold)

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh renderOrder={2}>
        <circleGeometry args={[0.46, 36]} />
        <meshStandardMaterial
          color="#4a2220"
          transparent
          opacity={rightEyeHold ? 0.78 : 0}
          roughness={0.98}
          metalness={0}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0.18, 0, 0.12]} scale={[0.55, 0.4, 1]} renderOrder={2}>
        <circleGeometry args={[0.28, 24]} />
        <meshStandardMaterial
          color="#3a1818"
          transparent
          opacity={rightEyeHold ? 0.55 : 0}
          roughness={0.98}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
