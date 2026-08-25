import { Suspense, useEffect, useState } from 'react'
import WorldCanvas from '../systems/WorldCanvas.jsx'
import WhiteRoom from '../scenes/WhiteRoom.jsx'
import PlayerController from '../systems/PlayerController.jsx'
import OriginalMessenger from '../ui/OriginalMessenger.jsx'
import { useGameState } from '../state/gameStateStore.js'
import { INTRO_SCENE } from '../runtime/productFlow.js'
import '../PlayRoot.css'
import './WhiteRoomIntro.css'

export default function WhiteRoomIntro() {
  const lookId = useGameState((s) => s.lookId)
  const hint = useGameState((s) => s.hint)
  const fade = useGameState((s) => s.fade)
  const debugProbe = useGameState((s) => s.debugProbe)
  const setHint = useGameState((s) => s.setHint)
  const beginTalkline = useGameState((s) => s.beginTalkline)
  const [paperOpen, setPaperOpen] = useState(false)
  const [codeDraft, setCodeDraft] = useState('')
  const [vnReady, setVnReady] = useState(false)

  useEffect(() => {
    const onKey = (event) => {
      if (event.code !== 'KeyE' || lookId !== 'paper' || paperOpen || vnReady) return
      document.exitPointerLock?.()
      setPaperOpen(true)
      setHint('숫자를 입력하시오')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lookId, paperOpen, setHint, vnReady])

  const submitCode = (event) => {
    event.preventDefault()
    setPaperOpen(false)
    setVnReady(true)
  }

  return (
    <div className="play-root">
      <WorldCanvas camera={{ fov: 70, position: [0, 1.6, 3.2] }}>
        <Suspense fallback={null}>
          <WhiteRoom showPaperPrompt={lookId === 'paper' && !paperOpen && !vnReady} />
        </Suspense>
        <PlayerController
          bounds={{ minX: -5.4, maxX: 5.4, minZ: -5.4, maxZ: 5.4 }}
          spawn={[0, 1.6, 3.2]}
        />
      </WorldCanvas>
      {!vnReady && (
        <div className="play-hud">
          <p>{hint}</p>
          <p className="play-hint">클릭 잠금 · WASD · E</p>
        </div>
      )}
      {import.meta.env.DEV && (
        <pre className="play-debug">
          {`lock ${debugProbe.locked ? 'ON' : 'OFF'}
look ${debugProbe.lookId ?? '-'} (${debugProbe.via})
scene white-room`}
        </pre>
      )}
      <div className="play-crosshair" />
      <div className="play-fade" style={{ opacity: fade }} />

      {paperOpen && (
        <form className="white-room-input" onSubmit={submitCode}>
          <label htmlFor="auth-code">숫자를 입력하시오</label>
          <input
            id="auth-code"
            inputMode="numeric"
            value={codeDraft}
            autoFocus
            onChange={(event) => setCodeDraft(event.target.value)}
          />
          <button type="submit">확인</button>
        </form>
      )}

      {vnReady && (
        <OriginalMessenger
          overlay
          startSceneId={INTRO_SCENE.AUTH}
          onInterceptScene={(sceneId) => {
            if (sceneId !== INTRO_SCENE.TALKLINE) return false
            beginTalkline()
            return true
          }}
        />
      )}
    </div>
  )
}
