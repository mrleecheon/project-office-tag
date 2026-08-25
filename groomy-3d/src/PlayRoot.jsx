/**
 * 오피스 로비 3D. 현재 App 런타임에는 연결되지 않는다.
 * 인트로(광고/쇼크/VN/흰 방)와 섞지 말 것. 이후 탐험 모드에서 PlayRoot로 재연결.
 */
import WorldCanvas from './systems/WorldCanvas.jsx'
import { Suspense, useEffect, useState } from 'react'
import { ROOM_GRAPH, useGameState } from './state/gameStateStore.js'
import Lobby from './scenes/Lobby.jsx'
import PlayerController from './systems/PlayerController.jsx'
import './PlayRoot.css'

const LOBBY_PAIN_HINT = '머리가 너무 아파.'

export default function PlayRoot() {
  const lookId = useGameState((s) => s.lookId)
  const hasKey = useGameState((s) => s.hasKey)
  const arFilterOn = useGameState((s) => s.arFilterOn)
  const doorOpen = useGameState((s) => s.doorOpen)
  const hint = useGameState((s) => s.hint)
  const fade = useGameState((s) => s.fade)
  const debugProbe = useGameState((s) => s.debugProbe)
  const pickupKey = useGameState((s) => s.pickupKey)
  const tagReader = useGameState((s) => s.tagReader)
  const meta = ROOM_GRAPH.lobby
  const [painHint, setPainHint] = useState({ show: true, opacity: 1 })
  const isPainHint = hint === LOBBY_PAIN_HINT

  useEffect(() => {
    if (!isPainHint) {
      setPainHint({ show: true, opacity: 1 })
      return undefined
    }
    setPainHint({ show: true, opacity: 1 })
    const fadeId = window.setTimeout(() => {
      setPainHint({ show: true, opacity: 0 })
    }, 2500)
    const hideId = window.setTimeout(() => {
      setPainHint({ show: false, opacity: 0 })
    }, 3800)
    return () => {
      window.clearTimeout(fadeId)
      window.clearTimeout(hideId)
    }
  }, [isPainHint])

  useEffect(() => {
    const onKey = (event) => {
      if (event.code !== 'KeyE') return
      if (lookId === 'key') pickupKey()
      if (lookId === 'reader') tagReader()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lookId, pickupKey, tagReader])

  return (
    <div className="play-root">
      <WorldCanvas camera={{ fov: 70, position: meta.spawn, rotation: [0, 0.28, 0] }}>
        <Suspense fallback={null}>
          <Lobby />
        </Suspense>
        <PlayerController bounds={meta.bounds} spawn={meta.spawn} spawnYaw={0.28} />
      </WorldCanvas>
      <div className="play-hud">
        {(!isPainHint || painHint.show) && (
          <p
            className={isPainHint ? 'play-pain-hint' : undefined}
            style={isPainHint ? { opacity: painHint.opacity } : undefined}
          >
            {hint}
          </p>
        )}
        <p className="play-hint">클릭 잠금 · WASD · E · F 우안 · ESC</p>
      </div>
      {import.meta.env.DEV && (
        <pre className="play-debug">
          {`lock ${debugProbe.locked ? 'ON' : 'OFF'}
look ${debugProbe.lookId ?? '-'} (${debugProbe.via})
key ${hasKey ? '1' : '0'}  tag ${arFilterOn ? '1' : '0'}  door ${doorOpen ? '1' : '0'}
pos ${debugProbe.x}  ${debugProbe.z}
E: key / reader   walk-in: z < -8.5
scene lobby`}
        </pre>
      )}
      <div className="play-crosshair" />
      <div className="play-fade" style={{ opacity: fade }} />
    </div>
  )
}
