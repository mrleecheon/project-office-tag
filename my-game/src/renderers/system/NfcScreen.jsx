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
        <h2>ACCESS · NFC UPLINK</h2>
        <button className={active ? 'active' : ''} type="button" onClick={scan}><span /></button>
        <p>사원 카드를 리더에 태그하세요.<small>브라우저 데모: 영역을 탭하면 스캔됩니다</small></p>
        <em>{SESSION_EMP_ID} · 카드 레인지 활성화됨</em>
      </div>
    </ScreenTransition>
  )
}
