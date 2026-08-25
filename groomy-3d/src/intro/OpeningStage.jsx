import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import PlayerController from '../systems/PlayerController.jsx'
import WorldCanvas from '../systems/WorldCanvas.jsx'
import { ROOM_GRAPH, useGameState } from '../state/gameStateStore.js'
import { OPENING_BEATS } from '../runtime/productFlow.js'
import WorldErrorBoundary from '../runtime/WorldErrorBoundary.jsx'
import VNOverlay from '../ui/VNOverlay.jsx'
import WorldPrompt from '../systems/WorldPrompt.jsx'

import '../PlayRoot.css'
import '../game/scenes/ShockScene.css'
import './WhiteRoomIntro.css'
import './OpeningVnOverlay.css'

const Lobby = lazy(() => import('../scenes/Lobby.jsx'))
const WhiteRoom = lazy(() => import('../scenes/WhiteRoom.jsx'))

export default function OpeningStage() {
  const lookId = useGameState((s) => s.lookId)
  const hasKey = useGameState((s) => s.hasKey)
  const arFilterOn = useGameState((s) => s.arFilterOn)
  const fade = useGameState((s) => s.fade)
  const hint = useGameState((s) => s.hint)
  const pickupKey = useGameState((s) => s.pickupKey)
  const tagReader = useGameState((s) => s.tagReader)
  const setInputMode = useGameState((s) => s.setInputMode)
  const setHint = useGameState((s) => s.setHint)
  const beginTalkline = useGameState((s) => s.beginTalkline)
  const [vnBeat, setVnBeat] = useState(OPENING_BEATS[0])
  const [scene, setScene] = useState('lobby')
  const [doorEntered, setDoorEntered] = useState(false)
  const [paperPicked, setPaperPicked] = useState(false)
  const onBeat9 = vnBeat?.id === 'beat-9'
  const onDoorBeat = vnBeat?.action === 'enter-door'
  const onPaperBeat = vnBeat?.action === 'pickup-paper'
  const waitingTag = onBeat9 && !arFilterOn
  const inWhite = scene === 'white'
  const walk3d = onBeat9 || onDoorBeat || onPaperBeat
  const inputMode = walk3d ? '3d' : 'vn'
  const mountWorld = vnBeat?.presentation !== 'black-caption'
  const actionComplete = (onBeat9 && arFilterOn) || (onDoorBeat && doorEntered) || (onPaperBeat && paperPicked)
  const meta = ROOM_GRAPH.lobby

  const goToCorridor = useCallback(() => {
    beginTalkline()
  }, [beginTalkline])

  useEffect(() => {
    useGameState.setState({ introPhase: 'intro' })
  }, [])

  useEffect(() => {
    setInputMode(inputMode)
    if (inputMode === 'vn') document.exitPointerLock?.()
  }, [inputMode, setInputMode])

  useEffect(() => {
    if (!onBeat9) return undefined
    setHint(hasKey ? '사원증을 리더기에 태그하세요.' : '책상 아래 사원증을 주워 E로 집으세요.')
    return undefined
  }, [onBeat9, hasKey, setHint])

  useEffect(() => {
    if (vnBeat?.action === 'mount-white-room' || doorEntered) setScene('white')
    if (vnBeat?.presentation === 'footstep-black-fade') {
      useGameState.setState({ fade: 1 })
      const id = window.setTimeout(() => useGameState.setState({ fade: 0 }), 700)
      return () => window.clearTimeout(id)
    }
    return undefined
  }, [vnBeat, doorEntered])

  useEffect(() => {
    if (onDoorBeat) setHint(lookId === 'door' ? '문으로 들어간다. (E)' : '문 쪽으로 가세요.')
    if (onPaperBeat) setHint(lookId === 'paper' ? '백지를 줍는다. (E)' : '백지를 주우세요.')
  }, [onDoorBeat, onPaperBeat, lookId, setHint])

  useEffect(() => {
    const onKey = (event) => {
      if (event.code !== 'KeyE') return
      if (onBeat9 && lookId === 'key') pickupKey()
      if (waitingTag && lookId === 'reader') tagReader()
      if (onDoorBeat && lookId === 'door') setDoorEntered(true)
      if (onPaperBeat && lookId === 'paper') setPaperPicked(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onBeat9, waitingTag, onDoorBeat, onPaperBeat, lookId, pickupKey, tagReader])

  return (
    <div className="opening-stage">
      <div className="opening-frame">
        <div className={`opening-canvas ${inputMode === 'vn' ? 'is-vn' : 'is-3d'}`}>
          {mountWorld && (
            <WorldErrorBoundary fallback={null}>
              <WorldCanvas camera={{ fov: 70, position: inWhite ? [0, 1.6, 3.2] : meta.spawn, rotation: inWhite ? [0, 0, 0] : [0, 0.28, 0] }}>
                <Suspense fallback={null}>
                  {inWhite ? (
                    <WhiteRoom showPaperPrompt={onPaperBeat && lookId === 'paper' && !paperPicked} />
                  ) : (
                    <Lobby />
                  )}
                </Suspense>
                {onDoorBeat && <WorldPrompt position={[0, 2.35, -9.4]} label={hint} />}
                <PlayerController
                  key={inWhite ? 'white' : 'lobby'}
                  bounds={inWhite ? { minX: -5.4, maxX: 5.4, minZ: -5.4, maxZ: 5.4 } : meta.bounds}
                  spawn={inWhite ? [0, 1.6, 3.2] : meta.spawn}
                  spawnYaw={inWhite ? 0 : 0.28}
                />
              </WorldCanvas>
            </WorldErrorBoundary>
          )}
        </div>
        <div className="play-fade" style={{ opacity: fade }} />
        <VNOverlay
          beats={OPENING_BEATS}
          onComplete={goToCorridor}
          onBeatChange={setVnBeat}
          actionComplete={actionComplete}
        />
        {onPaperBeat && !paperPicked && (
          <button type="button" className="opening-paper-hotspot" aria-label="백지" onClick={() => setPaperPicked(true)} />
        )}
      </div>
    </div>
  )
}
