import { useState } from 'react'
import ScreenTransition from '../../ui/layout/ScreenTransition'
import { emitAudioCue } from '../../engine/audio/audioBus'
import { SESSION_EMP_ID } from '../../content/world/company'

export default function NfcScreen({ onDone }) {
  const [active, setActive] = useState(false)

  const scan = () => {
    if (active) return
    setActive(true)
    emitAudioCue('nfc:scan')
    try {
      navigator.vibrate?.(28)
    } catch {
      // Optional browser API.
    }
    setTimeout(onDone, 720)
  }

  return (
    <ScreenTransition className="screen nfc">
      <div>
        <small className="systemEyebrow">PROJECT GROOMY</small>
        <h2>사원증을 태그하세요</h2>
        <button className={active ? 'active' : ''} type="button" aria-label="NFC 사원증 태그" onClick={scan}>
          <span />
          <strong>삑-</strong>
        </button>
        <p>죽은 전임자의 자리를 이어받습니다.<small>브라우저 데모: 카드를 탭하면 스캔됩니다</small></p>
        <em>{SESSION_EMP_ID} · TEMP CARD BINDING</em>
      </div>
    </ScreenTransition>
  )
}
