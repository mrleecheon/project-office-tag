import { useLayoutEffect, useMemo } from 'react'
import { useFBX } from '@react-three/drei'
import * as THREE from 'three'
import { usePbrMaps } from '../assets/PbrMaterial.jsx'
import { assetUrl } from '../runtime/assetUrl.js'

const FBX = {
  floor: assetUrl('/models/concrete-interior/fbx/Floor.fbx'),
  wall: assetUrl('/models/concrete-interior/fbx/Wall.fbx'),
  doorway: assetUrl('/models/concrete-interior/fbx/WallDoorway.fbx'),
  corner: assetUrl('/models/concrete-interior/fbx/Wall_Corner.fbx'),
  pillar: assetUrl('/models/concrete-interior/fbx/Pillar.fbx'),
  ceiling: assetUrl('/models/concrete-interior/fbx/Ceiling.fbx'),
}

const _box = new THREE.Box3()
const _size = new THREE.Vector3()
const _center = new THREE.Vector3()

function fitClone(source, fit, mode) {
  const group = source.clone(true)
  group.traverse((node) => {
    if (!node.isMesh) return
    node.geometry = node.geometry.clone()
    node.castShadow = true
    node.receiveShadow = true
  })
  _box.setFromObject(group)
  _box.getSize(_size)
  _box.getCenter(_center)
  group.traverse((node) => {
    if (!node.isMesh) return
    node.geometry.translate(-_center.x, -_box.min.y, -_center.z)
  })
  if (mode === 'floor' || mode === 'ceiling') {
    const s = fit[0] / Math.max(_size.x, _size.z, 0.001)
    group.scale.setScalar(s)
  } else {
    group.scale.set(
      fit[0] / Math.max(_size.x, 0.001),
      fit[1] / Math.max(_size.y, 0.001),
      fit[2] / Math.max(_size.z, 0.001),
    )
  }
  return group
}

const FIT_FLOOR = [2, 0.12, 2]
const FIT_WALL = [2, 3.4, 0.24]
const FIT_DOOR = [2.5, 3.4, 0.28]
const FIT_CORNER = [0.5, 3.4, 0.5]
const FIT_PILLAR = [0.42, 3.4, 0.42]

function ModularPiece({ src, kind, ar, fit, mode, roughness, envMapIntensity, ...props }) {
  const fbx = useFBX(src)
  const maps = usePbrMaps(kind, ar, [1.15, 1.15])
  const object = useMemo(() => fitClone(fbx, fit, mode), [fbx, fit, mode])

  useLayoutEffect(() => {
    const made = []
    object.traverse((node) => {
      if (!node.isMesh) return
      const mat = new THREE.MeshStandardMaterial({
        map: maps.map,
        normalMap: maps.normalMap,
        roughnessMap: maps.roughnessMap,
        roughness: roughness ?? 1,
        metalness: 0,
        envMapIntensity: envMapIntensity ?? maps.envMapIntensity,
      })
      node.material = mat
      made.push(mat)
    })
    return () => {
      made.forEach((mat) => mat.dispose())
    }
  }, [object, maps, roughness, envMapIntensity])

  return <primitive object={object} {...props} />
}

function FloorTile(props) {
  return (
    <ModularPiece
      src={FBX.floor}
      kind="floor"
      mode="floor"
      fit={FIT_FLOOR}
      {...props}
    />
  )
}

function CeilingTile(props) {
  return (
    <ModularPiece
      src={FBX.ceiling}
      kind="wall"
      mode="ceiling"
      fit={FIT_FLOOR}
      {...props}
    />
  )
}

function WallTile(props) {
  return (
    <ModularPiece
      src={FBX.wall}
      kind="wall"
      mode="wall"
      fit={FIT_WALL}
      {...props}
    />
  )
}

function DoorwayTile(props) {
  return (
    <ModularPiece
      src={FBX.doorway}
      kind="wall"
      mode="wall"
      fit={FIT_DOOR}
      {...props}
    />
  )
}

function CornerTile(props) {
  return (
    <ModularPiece
      src={FBX.corner}
      kind="wall"
      mode="wall"
      fit={FIT_CORNER}
      {...props}
    />
  )
}

function PillarTile(props) {
  return (
    <ModularPiece
      src={FBX.pillar}
      kind="wall"
      mode="wall"
      fit={FIT_PILLAR}
      {...props}
    />
  )
}

export function ModularLobbyShell({
  size = [20, 3.4, 20],
  ar = false,
  floorRoughness,
  floorEnvMapIntensity,
}) {
  const [w, h, d] = size
  const tile = 2
  const gap = 2.5
  const floors = []
  const ceilings = []
  const nx = Math.round(w / tile)
  const nz = Math.round(d / tile)

  for (let ix = 0; ix < nx; ix += 1) {
    for (let iz = 0; iz < nz; iz += 1) {
      const x = -w / 2 + (ix + 0.5) * tile
      const z = -d / 2 + (iz + 0.5) * tile
      floors.push(
        <FloorTile
          key={`f-${ix}-${iz}`}
          ar={ar}
          roughness={floorRoughness}
          envMapIntensity={floorEnvMapIntensity}
          position={[x, 0, z]}
        />,
      )
      ceilings.push(
        <CeilingTile key={`c-${ix}-${iz}`} ar={ar} position={[x, h, z]} />,
      )
    }
  }

  const walls = []
  for (let ix = 0; ix < nx; ix += 1) {
    const x = -w / 2 + (ix + 0.5) * tile
    const onDoor = Math.abs(x) < gap / 2
    if (!onDoor) {
      walls.push(
        <WallTile key={`zn-${ix}`} ar={ar} position={[x, 0, -d / 2]} rotation={[0, 0, 0]} />,
      )
    }
    walls.push(
      <WallTile key={`zp-${ix}`} ar={ar} position={[x, 0, d / 2]} rotation={[0, Math.PI, 0]} />,
    )
  }
  for (let iz = 0; iz < nz; iz += 1) {
    const z = -d / 2 + (iz + 0.5) * tile
    walls.push(
      <WallTile key={`xn-${iz}`} ar={ar} position={[-w / 2, 0, z]} rotation={[0, Math.PI / 2, 0]} />,
    )
    walls.push(
      <WallTile key={`xp-${iz}`} ar={ar} position={[w / 2, 0, z]} rotation={[0, -Math.PI / 2, 0]} />,
    )
  }

  return (
    <group>
      {floors}
      {ceilings}
      {walls}
      <DoorwayTile ar={ar} position={[0, 0, -d / 2]} />
      <CornerTile ar={ar} position={[-w / 2, 0, -d / 2]} />
      <CornerTile ar={ar} position={[w / 2, 0, -d / 2]} rotation={[0, -Math.PI / 2, 0]} />
      <CornerTile ar={ar} position={[-w / 2, 0, d / 2]} rotation={[0, Math.PI / 2, 0]} />
      <CornerTile ar={ar} position={[w / 2, 0, d / 2]} rotation={[0, Math.PI, 0]} />
      <PillarTile ar={ar} position={[-w / 2 + 0.35, 0, -d / 2 + 0.35]} />
      <PillarTile ar={ar} position={[w / 2 - 0.35, 0, -d / 2 + 0.35]} />
      <PillarTile ar={ar} position={[-w / 2 + 0.35, 0, d / 2 - 0.35]} />
      <PillarTile ar={ar} position={[w / 2 - 0.35, 0, d / 2 - 0.35]} />
    </group>
  )
}

