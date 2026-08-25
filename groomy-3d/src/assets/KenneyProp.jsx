import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import HeroProp from '../systems/HeroProp.jsx'
import { assetUrl } from '../runtime/assetUrl.js'

const BASE = assetUrl('/models/kenney-furniture')

export const KENNEY = {
  table: `${BASE}/table.glb`,
  tableCross: `${BASE}/tableCross.glb`,
  chair: `${BASE}/chair.glb`,
  chairDesk: `${BASE}/chairDesk.glb`,
  chairRounded: `${BASE}/chairRounded.glb`,
  books: `${BASE}/books.glb`,
  bookcase: `${BASE}/bookcaseOpenLow.glb`,
  screen: `${BASE}/computerScreen.glb`,
}

export default function KenneyProp({
  src,
  position,
  rotation,
  scale = 1,
  interactId,
}) {
  const { scene } = useGLTF(src)
  const clone = useMemo(() => {
    const next = scene.clone(true)
    if (interactId) {
      next.traverse((node) => {
        if (node.isMesh) node.userData.interactId = interactId
      })
    }
    return next
  }, [scene, interactId])

  return (
    <HeroProp position={position} rotation={rotation} scale={scale}>
      <primitive object={clone} />
    </HeroProp>
  )
}

Object.values(KENNEY).forEach((src) => useGLTF.preload(src))
