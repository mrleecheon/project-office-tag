import VnDialogBox from './VnDialogBox'
import './vn-caption.css'

export default function VnCaptionBar({ line, shown, done, awaitingChoice = false }) {
  const effect = line?.effect
  const overlayLine = Boolean(line?.sfx || line?.textOnly || line?.welcomeCaption)
  if (overlayLine) {
    return <VnDialogBox line={line} shown={shown} done={done} awaitingChoice={awaitingChoice} />
  }
  return (
    <div className={['vnCaptionDock', effect ? `effect-${effect}` : ''].filter(Boolean).join(' ')}>
      <VnDialogBox line={line} shown={shown} done={done} awaitingChoice={awaitingChoice} />
    </div>
  )
}
