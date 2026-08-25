import { useMemo } from 'react'
import { Color } from 'three'
import HeroProp from '../systems/HeroProp.jsx'
import WorldPrompt from '../systems/WorldPrompt.jsx'

export const GROOMY_APPROACH_START = [0.35, 0.95, 4.55]
export const GROOMY_DELIVERY_POINT = [2.55, 0.95, -0.55]
export const GROOMY_ENTER_CAMERA = [3.62, 1.5, -2.42]
export const GROOMY_ENTER_LOOK = [0.45, 1.08, 2.15]
export const COFFEE_MACHINE_ORIGIN = [0, 0, -4.5]
export const COFFEE_BREW_CAMERA = [0, 1.6, -2.75]

const CREAM = new Color('#f0e6d2')
const BREW = new Color('#3b2415')

export function mixCupColor(shots, target) {
  const t = target <= 0 ? 0 : Math.min(1, shots / target)
  return `#${CREAM.clone().lerp(BREW, t).getHexString()}`
}

export function coffeeRecipientForLook(lookId) {
  if (lookId === 'staff-kim') return '팀장님'
  if (lookId === 'staff-choi') return '대리님'
  if (lookId === 'coffee-groomy') return '그루미'
  return null
}

export default function CoffeeStation({
  origin = [0, 0, 0],
  lookId,
  phase,
  order,
  shots,
  showPrompt = true,
}) {
  const cupColor = useMemo(
    () => mixCupColor(shots, order?.shots ?? 1),
    [shots, order?.shots],
  )
  const brewing = phase === 'brewing'
  const canPour = brewing && order && shots < order.shots
  const showExtract = (lookId === 'coffee-button' || lookId === 'coffee-deliver')
    && (phase === 'idle' || canPour)

  return (
    <group position={origin}>
      <mesh position={[0, 0.46, 0]} receiveShadow>
        <boxGeometry args={[2.4, 0.92, 0.9]} />
        <meshStandardMaterial color="#5c5044" roughness={0.85} />
      </mesh>

      {/* TODO: Poly Haven 모델로 교체 */}
      <HeroProp position={[0.35, 0.92, 0]} contactScale={1.6}>
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[0.52, 0.84, 0.42]} />
          <meshStandardMaterial color="#2b2b2e" metalness={0.35} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.92, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.18, 16]} />
          <meshStandardMaterial color="#1a1a1c" metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.38, 0.22]} castShadow userData={{ interactId: 'coffee-button' }}>
          <boxGeometry args={[0.12, 0.08, 0.06]} />
          <meshStandardMaterial
            color={canPour || phase === 'idle' ? '#c45c4a' : '#6a3a3a'}
            emissive={canPour || phase === 'idle' ? '#c45c4a' : '#2a1010'}
            emissiveIntensity={canPour || phase === 'idle' ? 0.55 : 0.2}
          />
        </mesh>
        <mesh position={[0, 0.38, 0.28]} userData={{ interactId: 'coffee-button' }}>
          <boxGeometry args={[0.55, 0.55, 0.4]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </HeroProp>

      {/* TODO: Poly Haven 모델로 교체 */}
      <HeroProp position={[-0.28, 0.92, 0.17]} contactScale={1.1}>
        <mesh position={[0, 0.12, 0]} castShadow userData={{ interactId: 'coffee-deliver' }}>
          <cylinderGeometry args={[0.09, 0.07, 0.16, 18]} />
          <meshStandardMaterial color={cupColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.22, 0]} userData={{ interactId: 'coffee-deliver' }}>
          <boxGeometry args={[0.7, 0.55, 0.7]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </HeroProp>

      {showPrompt && showExtract && (
        <WorldPrompt position={[0.35, 1.55, 0.23]} label="E  추출" />
      )}
    </group>
  )
}
