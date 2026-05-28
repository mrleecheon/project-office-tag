import { resolveUiText } from '../../content/manifests/text'

export default function VnControls({ autoMode, skipDisabled = false, onToggleAuto, onSkip, onOpenBacklog }) {
  return (
    <div className="vnControls" onClick={(event) => event.stopPropagation()}>
      <button type="button" onClick={onToggleAuto}>{autoMode ? resolveUiText('vnAutoOn', 'AUTO ON') : resolveUiText('vnAutoOff', 'AUTO OFF')}</button>
      <button type="button" disabled={skipDisabled} onClick={onSkip}>{resolveUiText('vnSkip', 'SKIP')}</button>
      <button type="button" onClick={onOpenBacklog} aria-label={resolveUiText('vnBacklog', 'BACKLOG')}>[=]</button>
    </div>
  )
}

