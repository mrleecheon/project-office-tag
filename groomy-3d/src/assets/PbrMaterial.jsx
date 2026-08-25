import { useTexture } from '@react-three/drei'
import { useLayoutEffect } from 'react'
import * as THREE from 'three'

const SETS = {
  floorRuin: {
    map: '/tex/concrete_floor_worn_001_diff_1k.jpg',
    normalMap: '/tex/concrete_floor_worn_001_nor_gl_1k.jpg',
    roughnessMap: '/tex/concrete_floor_worn_001_rough_1k.jpg',
  },
  floorAr: {
    map: '/tex/floor_tiles_06_diff_1k.jpg',
    normalMap: '/tex/floor_tiles_06_nor_gl_1k.jpg',
    roughnessMap: '/tex/floor_tiles_06_rough_1k.jpg',
  },
  wallRuin: {
    map: '/tex/concrete_wall_008_diff_1k.jpg',
    normalMap: '/tex/concrete_wall_008_nor_gl_1k.jpg',
    roughnessMap: '/tex/concrete_wall_008_rough_1k.jpg',
  },
  wallAr: {
    map: '/tex/painted_plaster_wall_diff_1k.jpg',
    normalMap: '/tex/painted_plaster_wall_nor_gl_1k.jpg',
    roughnessMap: '/tex/painted_plaster_wall_rough_1k.jpg',
  },
}

export const PBR_SETS = SETS

export function usePbrMaps(kind, ar, repeat = [1, 1]) {
  const set = kind === 'floor' ? (ar ? SETS.floorAr : SETS.floorRuin) : ar ? SETS.wallAr : SETS.wallRuin
  const [map, normalMap, roughnessMap] = useTexture([set.map, set.normalMap, set.roughnessMap])

  useLayoutEffect(() => {
    ;[map, normalMap, roughnessMap].forEach((tex) => {
      tex.wrapS = THREE.RepeatWrapping
      tex.wrapT = THREE.RepeatWrapping
      tex.repeat.set(repeat[0], repeat[1])
      tex.needsUpdate = true
    })
    map.colorSpace = THREE.SRGBColorSpace
  }, [map, normalMap, roughnessMap, repeat[0], repeat[1]])

  return {
    map,
    normalMap,
    roughnessMap,
    envMapIntensity: ar ? 0.55 : 0.28,
  }
}

export function PbrMaterial({
  kind,
  ar,
  repeat = [1, 1],
  roughness,
  envMapIntensity,
}) {
  const maps = usePbrMaps(kind, ar, repeat)
  const { map, normalMap, roughnessMap } = maps

  return (
    <meshStandardMaterial
      map={map}
      normalMap={normalMap}
      roughnessMap={roughnessMap}
      roughness={roughness ?? 1}
      metalness={0}
      envMapIntensity={envMapIntensity ?? maps.envMapIntensity}
    />
  )
}
