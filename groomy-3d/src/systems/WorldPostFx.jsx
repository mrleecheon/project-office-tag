import { useEffect, useRef, useState } from 'react'
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Scanline } from '@react-three/postprocessing'
import { useGameState } from '../state/gameStateStore.js'
import WorldErrorBoundary from '../runtime/WorldErrorBoundary.jsx'

function PostFxInner() {
  const ar = useGameState((s) => s.arFilterOn)
  const prev = useRef(ar)
  const [burst, setBurst] = useState(false)

  useEffect(() => {
    if (prev.current === ar) return undefined
    prev.current = ar
    setBurst(true)
    const id = window.setTimeout(() => setBurst(false), 300)
    return () => window.clearTimeout(id)
  }, [ar])

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom luminanceThreshold={0.92} luminanceSmoothing={0.2} intensity={0.18} mipmapBlur />
      <Vignette offset={0.32} darkness={0.38} />
      {burst ? (
        <>
          <ChromaticAberration offset={[0.004, 0.0016]} />
          <Scanline density={1.15} opacity={0.18} />
        </>
      ) : null}
    </EffectComposer>
  )
}

export default function WorldPostFx() {
  return (
    <WorldErrorBoundary fallback={null}>
      <PostFxInner />
    </WorldErrorBoundary>
  )
}
