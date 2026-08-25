import { useState } from 'react'
import { resolveImageUrl } from '../../game/runtime/preload/assetPreloader'

export default function VnStageBackground({ stage, backgroundImage }) {
  const [bgFailed, setBgFailed] = useState(false)
  const [overlayFailed, setOverlayFailed] = useState(false)
  const [scanlineFailed, setScanlineFailed] = useState(false)
  const [glitchFailed, setGlitchFailed] = useState(false)
  const bgUrl = backgroundImage || resolveImageUrl(stage?.bgId)
  const overlayUrl = resolveImageUrl(stage?.overlayId)
  const scanlineUrl = '/assets/effects/overlays/scanline.png'
  const glitchUrl = '/assets/effects/overlays/glitch_soft.png'

  return (
    <div className="vnStageBackground">
      {bgUrl && !bgFailed ? <img className="vnStageLayer bg" src={bgUrl} alt="" onError={() => setBgFailed(true)} /> : <div className="vnStageFallback" aria-hidden="true" />}
      {overlayUrl && !overlayFailed ? <img className="vnStageLayer overlay" src={overlayUrl} alt="" onError={() => setOverlayFailed(true)} /> : null}
      {!scanlineFailed ? <img className="vnStageFx fxScanline" src={scanlineUrl} alt="" onError={() => setScanlineFailed(true)} /> : null}
      {!glitchFailed ? <img className="vnStageFx fxGlitch" src={glitchUrl} alt="" onError={() => setGlitchFailed(true)} /> : null}
      <div className="stageGrid" />
    </div>
  )
}

