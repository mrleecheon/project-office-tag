import { useEffect, useRef, useState } from 'react'
import { AUDIO_PATHS } from '../systems/audioPaths.js'
import {
  createLoopAudio,
  fadeAudioVolume,
  onGameAudioUnlock,
  safePlay,
  unlockGameAudio,
} from '../systems/gameAudioCore.js'
import './IncomingCallScreen.css'
function formatElapsed(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * 톡라인 톤의 전화 수신/통화 중 오버레이.
 * phase: 'incoming' | 'active'
 */
export default function IncomingCallScreen({
  caller = '그루미',
  phase = 'incoming',
  onAccept,
}) {
  const [elapsed, setElapsed] = useState(0)
  const ringRef = useRef(null)
  const cancelFadeRef = useRef(null)

  useEffect(() => {
    const ring = createLoopAudio(AUDIO_PATHS.phoneRing)
    ring.volume = 0
    ringRef.current = ring
    return () => {
      cancelFadeRef.current?.()
      ring.pause()
      ring.src = ''
      ringRef.current = null
    }
  }, [])

  useEffect(() => {
    const ring = ringRef.current
    if (!ring) return undefined

    cancelFadeRef.current?.()

    if (phase !== 'incoming') {
      cancelFadeRef.current = fadeAudioVolume(ring, 0, 500, () => ring.pause())
      return () => cancelFadeRef.current?.()
    }

    const startRing = () => {
      safePlay(ring)
      cancelFadeRef.current = fadeAudioVolume(ring, 0.42, 400)
    }

    startRing()
    const offUnlock = onGameAudioUnlock(startRing)

    return () => {
      offUnlock()
      cancelFadeRef.current?.()
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'active') {
      setElapsed(0)
      return undefined
    }
    const id = window.setInterval(() => setElapsed((n) => n + 1), 1000)
    return () => window.clearInterval(id)
  }, [phase])

  return (
    <div className={`incoming-call is-${phase}`} role="dialog" aria-label={`${caller} 전화`}>
      <div className="incoming-call-panel">
        <p className="incoming-call-label">{phase === 'active' ? '통화 중' : '수신 전화'}</p>
        <p className="incoming-call-caller">{caller}</p>
        {phase === 'active' ? (
          <div className="incoming-call-active">
            <span className="incoming-call-dot" aria-hidden />
            <span className="incoming-call-timer">{formatElapsed(elapsed)}</span>
          </div>
        ) : (
          <div className="incoming-call-actions">
            <button type="button" className="incoming-call-accept" onClick={() => { unlockGameAudio(); onAccept?.() }}>
              받기
            </button>
            {/* TODO: 끊기 기능은 추후 구현 */}
            <button type="button" className="incoming-call-decline is-disabled" disabled aria-disabled="true">
              끊기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
