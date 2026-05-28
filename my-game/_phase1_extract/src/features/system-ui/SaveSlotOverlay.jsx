import { resolveUiText } from '../../content/manifests/text.js'
import { getUiText } from '../../game/runtime/settings/locale'
import { useLocale } from '../../app/providers/useLocale'

export default function SaveSlotOverlay({
  open,
  onClose,
  slots,
  onSaveSlot,
  onLoadSlot,
  onDeleteSlot,
  locale: forcedLocale,
}) {
  const { locale } = useLocale()
  const activeLocale = forcedLocale ?? locale
  const text = getUiText(activeLocale).saveMenu
  const knownSlots = ['manual-1', 'manual-2', 'autosave']

  if (!open) return null

  return (
    <div className="saveSlotOverlay" role="dialog" aria-modal="true" aria-label={resolveUiText('saveMenuAria', '세이브 슬롯 메뉴')}>
      <header>
        <strong>{text.title}</strong>
        <button type="button" onClick={onClose}>{text.close}</button>
      </header>
      <div className="saveSlotOverlay__grid">
        {knownSlots.map((slotId) => {
          const entry = slots.find((slot) => slot.slotId === slotId)
          return (
            <section key={slotId} className="saveSlotOverlay__slot">
              <h4>{slotId}</h4>
              <p>{entry ? new Date(entry.savedAt).toLocaleString('ko-KR') : text.empty}</p>
              <div>
                <button type="button" onClick={() => onSaveSlot(slotId)}>{text.save}</button>
                <button type="button" onClick={() => onLoadSlot(slotId)} disabled={!entry}>{text.load}</button>
                <button type="button" onClick={() => onDeleteSlot(slotId)} disabled={!entry}>{text.delete}</button>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
