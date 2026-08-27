import { AdditiveBlending } from 'three'
import { Sparkles } from '@react-three/drei'

function LightShaft({ position, rotation, args = [0.72, 8.5, 16, 1, true], opacity = 0.018 }) {
  return (
    <mesh position={position} rotation={rotation} renderOrder={2}>
      <coneGeometry args={args} />
      <meshBasicMaterial
        color="#d7e8ff"
        transparent
        opacity={opacity}
        blending={AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}

/**
 * 로비 LobbyHeroLight보다 어둡고 Sparkles 밀도 낮은 액센트.
 */
export default function SubduedRoomAccent({
  spotPosition = [2.8, 3.0, 1.2],
  sparkPosition = [0.6, 1.45, -0.4],
  sparkScale = [3.2, 2.2, 3.8],
  sparkCount = 18,
}) {
  return (
    <group>
      <spotLight
        position={spotPosition}
        angle={0.36}
        penumbra={0.92}
        intensity={11}
        distance={15}
        color="#c8daf0"
        castShadow={false}
      />
      <LightShaft position={spotPosition} rotation={[1.14, 0.12, -0.18]} />
      <Sparkles
        count={sparkCount}
        scale={sparkScale}
        size={1.55}
        speed={0.12}
        opacity={0.15}
        color="#e7f2ff"
        position={sparkPosition}
      />
    </group>
  )
}
