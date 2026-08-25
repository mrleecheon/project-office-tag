import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useGameState } from '../state/gameStateStore.js'

const RUIN_FOG = { color: new THREE.Color('#7a848c'), density: 0.038 }
const AR_FOG = { color: new THREE.Color('#d2dbe3'), density: 0.01 }

export function FogLayer() {
  const ar = useGameState((s) => s.arFilterOn)
  const { scene } = useThree()
  const color = useRef(new THREE.Color(RUIN_FOG.color))
  const density = useRef(RUIN_FOG.density)

  useEffect(() => {
    scene.fog = new THREE.FogExp2(color.current.getHex(), density.current)
    scene.background = color.current.clone()
  }, [scene])

  useFrame((_, delta) => {
    const t = Math.min(1, delta * 1.7)
    color.current.lerp(ar ? AR_FOG.color : RUIN_FOG.color, t)
    density.current += ((ar ? AR_FOG.density : RUIN_FOG.density) - density.current) * t
    if (scene.fog) {
      scene.fog.color.copy(color.current)
      scene.fog.density = density.current
    }
    if (scene.background?.isColor) scene.background.copy(color.current)
  })

  return null
}

export function RoomLightRig({ ar = false }) {
  return (
    <directionalLight
      castShadow
      position={[2.4, 6.2, 3.1]}
      intensity={ar ? 1.28 : 0.38}
      color={ar ? '#f3f1ea' : '#c8b492'}
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-bias={-0.00025}
      shadow-camera-near={0.5}
      shadow-camera-far={28}
      shadow-camera-left={-11}
      shadow-camera-right={11}
      shadow-camera-top={11}
      shadow-camera-bottom={-11}
    />
  )
}

export function RoomEnvironment({ ar = false }) {
  return (
    <Environment
      files={ar ? '/hdri/empty_warehouse_01_1k.hdr' : '/hdri/abandoned_workshop_1k.hdr'}
      environmentIntensity={ar ? 0.42 : 0.16}
    />
  )
}

export function enableSoftShadows(gl) {
  gl.shadowMap.enabled = true
  gl.shadowMap.type = THREE.PCFSoftShadowMap
}
