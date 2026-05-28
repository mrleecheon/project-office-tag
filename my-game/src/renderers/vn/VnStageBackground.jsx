import { useState } from 'react'
import { resolveImageUrl } from '../../game/runtime/preload/assetPreloader'

export default function VnStageBackground({ stage, backgroundImage }) {
  const [bgFailed, setBgFailed] = useState(false)
  const [overlayFailed, setOverlayFailed] = useState(false)
  const bgUrl = backgroundImage || resolveImageUrl(stage?.bgId)
  const overlayUrl = resolveImageUrl(stage?.overlayId)

  return (
    <div className="vnStageBackground">
      {bgUrl && !bgFailed ? <img className="vnStageLayer bg" src={bgUrl} alt="" onError={() => setBgFailed(true)} /> : <div className="vnStageFallback">BACKGROUND</div>}
      {overlayUrl && !overlayFailed ? <img className="vnStageLayer overlay" src={overlayUrl} alt="" onError={() => setOverlayFailed(true)} /> : null}
      <div className="stageGrid" />
    </div>
  )
}

