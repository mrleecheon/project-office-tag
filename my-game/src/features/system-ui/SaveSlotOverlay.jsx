import { useState } from 'react'
import { resolveUiText } from '../../content/manifests/text.js'
import { getUiText } from '../../game/runtime/settings/locale'
import { useLocale } from '../../app/providers/useLocale'
import ModalShell from '../../ui/layout/ModalShell.jsx'
import { emitAudioCue } from '../../engine/audio/audioBus.js'

export default function SaveSlotOverlay({
  open,
  onClose,
  slots,
  onSaveSlot,
  onLoadSlot,
  onDeleteSlot,
  locale: forcedLocale,
}) {
  const [pendingDelete, setPendingDelete] = useState(null)
  const { locale } = useLocale()
  const activeLocale = forcedLocale ?? locale
  const text = getUiText(activeLocale).saveMenu
  const knownSlots = ['manual-1', 'manual-2', 'autosave']

  if (!open) return null

  const requestDelete = (slotId) => {
    emitAudioCue('ui:open')
    setPendingDelete(slotId)
  }

  const confirmDelete = () => {
    if (!pendingDelete) return
    onDeleteSlot(pendingDelete)
    emitAudioCue('ui:cancel')
    setPendingDelete(null)
  }

  return (
    <div className="saveSlotOverlay" role="dialog" aria-modal="true" aria-label={resolveUiText('saveMenuAria', '세이브 슬롯 메뉴')}>
      <header>
        <strong>{text.title}</strong>
        <button type="button" onClick={() => { emitAudioCue('ui:close'); onClose() }}>{text.close}</button>
      </header>
      <p className="saveSlotOverlay__sub">ARCHIVE TERMINAL · INCIDENT MEMORY</p>
      <div className="saveSlotOverlay__grid">
        {knownSlots.map((slotId) => {
          const entry = slots.find((slot) => slot.slotId === slotId)
          return (
            <section key={slotId} className="saveSlotOverlay__slot">
              <h4>{slotId}</h4>
              <p>{entry ? new Date(entry.savedAt).toLocaleString('ko-KR') : text.empty}</p>
              <div>
                <button type="button" onClick={() => { emitAudioCue('ui:save'); onSaveSlot(slotId) }}>{text.save}</button>
                <button type="button" onClick={() => { emitAudioCue('ui:load'); onLoadSlot(slotId) }} disabled={!entry}>{text.load}</button>
                <button type="button" onClick={() => requestDelete(slotId)} disabled={!entry}>{text.delete}</button>
              </div>
            </section>
          )
        })}
      </div>
      <ModalShell open={Boolean(pendingDelete)} title="Delete save data?" description="This action cannot be undone.">
        <div className="modalShellActions">
          <button type="button" className="uiButton ghost" onClick={() => { emitAudioCue('ui:cancel'); setPendingDelete(null) }}>Cancel</button>
          <button type="button" className="uiButton" onClick={confirmDelete}>Delete</button>
        </div>
      </ModalShell>
    </div>
  )
}
