import { characters } from '../../content/world/characters'
import { useState } from 'react'
import { resolveImageUrl } from '../../game/runtime/preload/assetPreloader'

function slotClass(slot = 'center') {
  if (slot === 'left') return 'left'
  if (slot === 'right') return 'right'
  return 'center'
}

export default function VnPortraitLayer({ entries = [] }) {
  const [failedByKey, setFailedByKey] = useState({})
  return (
    <div className="vnPortraitLayer">
      {entries.map((entry) => {
        const key = `${entry.charId}-${entry.slot ?? 'center'}`
        const char = characters[entry.charId] ?? characters.unknown
        const directSrc = entry.src
        const exprUrl = resolveImageUrl(entry.exprId)
        const baseUrl = resolveImageUrl(entry.baseId)
        const src = directSrc || exprUrl || baseUrl
        const label = entry.expression ? `${char.name} · ${entry.expression}` : char.name
        const failed = failedByKey[key]
        return (
          <div key={key} className={`vnPortrait ${slotClass(entry.slot)}`}>
            {src && !failed
              ? <img src={src} alt={label} onError={() => setFailedByKey((previous) => ({ ...previous, [key]: true }))} />
              : <div className="vnPortraitFallback" style={{ '--accent': char.accent }}>{label}</div>}
          </div>
        )
      })}
    </div>
  )
}

