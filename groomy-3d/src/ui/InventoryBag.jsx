import { useState } from 'react'
import { BROKEN_ROPE_ITEM, BROKEN_ROPE_ITEM_ID } from '../content/dialogue/groomyFragments.js'
import '../intro/OpeningVnOverlay.css'

export const ITEM_INFO = {
  calendar: { name: '달력', info: '평범해 보이는 달력이다. 2127년 2월 7일에 체크표시가 되어있는 듯 하다.' },
  wallet: { name: '지갑', info: '돈이 가득 들어있는 지갑이다. 누군가의 신분증이 들어있다.' },
  nail: { name: '손톱', info: '매니큐어용 인조 손톱.' },
  [BROKEN_ROPE_ITEM_ID]: { name: BROKEN_ROPE_ITEM.name, info: BROKEN_ROPE_ITEM.info },
}

/**
 * ExploreStage 가방 UI 재사용 (VN 토큰 스타일은 OpeningVnOverlay.css .explore-bag*).
 */
export default function InventoryBag({
  inventory = [],
  itemInfo = ITEM_INFO,
  open = false,
  onToggle,
  selectedId: controlledSelected,
  onSelect,
}) {
  const [localSelected, setLocalSelected] = useState(null)
  const selectedId = controlledSelected !== undefined ? controlledSelected : localSelected
  const setSelected = onSelect ?? setLocalSelected
  const selected = selectedId ? itemInfo[selectedId] : null

  return (
    <>
      <button type="button" className="explore-bag-btn" onClick={() => onToggle?.(!open)}>
        가방
      </button>
      {open && (
        <div className="explore-bag">
          <p className="explore-bag-title">소지품</p>
          {inventory.length === 0 && <p className="explore-bag-empty">비어 있다.</p>}
          {inventory.map((id) => (
            <button
              key={id}
              type="button"
              className="explore-bag-item"
              onClick={() => setSelected(id === selectedId ? null : id)}
            >
              {itemInfo[id]?.name ?? id}
            </button>
          ))}
          {selected && (
            <p className="explore-bag-info">
              <strong>{selected.name}</strong>
              {selected.info}
            </p>
          )}
        </div>
      )}
    </>
  )
}
