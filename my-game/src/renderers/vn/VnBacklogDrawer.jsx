import { resolveUiText } from '../../content/manifests/text'
import { emitAudioCue } from '../../engine/audio/audioBus'

export default function VnBacklogDrawer({ open, entries, onClose }) {
  if (!open) return null
  return (
    <aside className="vnBacklogDrawer">
      <header>
        <strong>Backlog</strong>
        <button type="button" onClick={() => { emitAudioCue('ui:close'); onClose() }}>{resolveUiText('vnCloseBacklog', '닫기')}</button>
      </header>
      <div>
        {entries.map((entry) => (
          <p key={entry.id}>
            <b>{entry.speaker}</b> {entry.text}
          </p>
        ))}
      </div>
    </aside>
  )
}

