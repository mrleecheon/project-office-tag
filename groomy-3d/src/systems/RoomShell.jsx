import { SKINS } from '../state/gameStateStore.js'
import { Suspense } from 'react'
import OfficeDressing from '../assets/OfficeDressing.jsx'
import { PbrMaterial } from '../assets/PbrMaterial.jsx'
import { FogLayer, RoomEnvironment, RoomLightRig } from './WorldGraphics.jsx'
import { ModularLobbyShell } from './ModularLobbyShell.jsx'

export default function RoomShell({
  size = [12, 3.4, 16],
  ar = false,
  doorway = null,
  doorPosition = '-z',
  roomId = null,
  arSkin = SKINS.ar,
  ruinSkin = SKINS.ruin,
  floorRoughness,
  floorEnvMapIntensity,
  modular = false,
  children,
  ...rest
}) {
  const [w, h, d] = size ?? rest.size ?? [12, 3.4, 16]
  const skin = ar ? arSkin : ruinSkin
  const opening = doorway ?? rest.doorway ?? (doorPosition === 'none' ? null : doorPosition)
  const gap = 2.5
  const side = (w - gap) / 2

  return (
    <group userData={{ roomId }}>
      <FogLayer />
      <hemisphereLight args={[skin.hemiTop, skin.hemiBot, ar ? 0.42 : 0.2]} />
      <ambientLight intensity={ar ? 0.22 : 0.08} />
      <RoomLightRig ar={ar} />
      <Suspense fallback={null}>
        <RoomEnvironment ar={ar} />
      </Suspense>
      <Suspense fallback={null}>
        <OfficeDressing size={[w, h, d]} ar={ar} />

        {modular ? (
          <ModularLobbyShell
            size={[w, h, d]}
            ar={ar}
            floorRoughness={floorRoughness}
            floorEnvMapIntensity={floorEnvMapIntensity}
          />
        ) : (
          <>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[w, d]} />
              <PbrMaterial
                kind="floor"
                ar={ar}
                repeat={[w / 2.2, d / 2.2]}
                roughness={floorRoughness}
                envMapIntensity={floorEnvMapIntensity}
              />
            </mesh>
            <mesh position={[0, h, 0]} receiveShadow>
              <boxGeometry args={[w, 0.16, d]} />
              <PbrMaterial kind="wall" ar={ar} repeat={[w / 2.5, d / 2.5]} />
            </mesh>

            {opening === '-z' ? (
              <>
                <mesh position={[-(gap / 2 + side / 2), h / 2, -d / 2]} receiveShadow>
                  <boxGeometry args={[side, h, 0.24]} />
                  <PbrMaterial kind="wall" ar={ar} repeat={[side / 2, h / 2]} />
                </mesh>
                <mesh position={[gap / 2 + side / 2, h / 2, -d / 2]} receiveShadow>
                  <boxGeometry args={[side, h, 0.24]} />
                  <PbrMaterial kind="wall" ar={ar} repeat={[side / 2, h / 2]} />
                </mesh>
                <mesh position={[0, h - 0.18, -d / 2]} receiveShadow>
                  <boxGeometry args={[gap, 0.36, 0.24]} />
                  <PbrMaterial kind="wall" ar={ar} repeat={[gap / 2, 0.4]} />
                </mesh>
              </>
            ) : (
              <mesh position={[0, h / 2, -d / 2]} receiveShadow>
                <boxGeometry args={[w, h, 0.24]} />
                <PbrMaterial kind="wall" ar={ar} repeat={[w / 2, h / 2]} />
              </mesh>
            )}

            <mesh position={[0, h / 2, d / 2]} receiveShadow>
              <boxGeometry args={[w, h, 0.24]} />
              <PbrMaterial kind="wall" ar={ar} repeat={[w / 2, h / 2]} />
            </mesh>
            <mesh position={[-w / 2, h / 2, 0]} receiveShadow>
              <boxGeometry args={[0.24, h, d]} />
              <PbrMaterial kind="wall" ar={ar} repeat={[d / 2, h / 2]} />
            </mesh>
            <mesh position={[w / 2, h / 2, 0]} receiveShadow>
              <boxGeometry args={[0.24, h, d]} />
              <PbrMaterial kind="wall" ar={ar} repeat={[d / 2, h / 2]} />
            </mesh>
          </>
        )}
        {children}
      </Suspense>
    </group>
  )
}
