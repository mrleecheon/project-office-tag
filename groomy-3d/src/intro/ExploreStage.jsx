import { useFrame, useThree } from '@react-three/fiber'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createAudioService } from '@groomy/game/engine/audio/audioService.js'
import Corridor from '../scenes/Corridor.jsx'
import Office from '../scenes/Office.jsx'
import PlayerController from '../systems/PlayerController.jsx'
import WorldCanvas from '../systems/WorldCanvas.jsx'
import { ROOM_GRAPH, useGameState } from '../state/gameStateStore.js'
import {
  GROMI_INTRO_BEATS,
  OFFICE_INSPECT_BEATS,
  OFFICE_INSPECT_IDS,
  OFFICE_LOOK_BEATS,
  OFFICE_VN_BEATS,
  ONBOARDING_INVITE_BEATS,
  PORK_CONDITION_BEATS,
  POST_INVESTIGATION_STAGE,
  buildKangIsolBeats,
} from '../runtime/productFlow.js'
import VNOverlay from '../ui/VNOverlay.jsx'
import '../PlayRoot.css'
import './OpeningVnOverlay.css'

const ITEM_INFO = {
  calendar: { name: '달력', info: '평범해 보이는 달력이다. 2127년 2월 7일에 체크표시가 되어있는 듯 하다.' },
  wallet: { name: '지갑', info: '돈이 가득 들어있는 지갑이다. 누군가의 신분증이 들어있다.' },
  nail: { name: '손톱', info: '매니큐어용 인조 손톱.' },
}

function CorridorWalk({ active, onDone }) {
  const { camera } = useThree()
  const doneRef = useRef(false)
  useEffect(() => {
    doneRef.current = false
  }, [active])
  useFrame((_, delta) => {
    if (!active || doneRef.current) return
    camera.position.x += (0 - camera.position.x) * Math.min(1, delta * 4)
    camera.position.y = 1.6
    camera.position.z -= 3.4 * delta
    if (camera.position.z <= -8.15) {
      doneRef.current = true
      onDone()
    }
  })
  return null
}

export default function ExploreStage() {
  const currentRoom = useGameState((s) => s.currentRoom)
  const fade = useGameState((s) => s.fade)
  const hint = useGameState((s) => s.hint)
  const lookId = useGameState((s) => s.lookId)
  const officeInspected = useGameState((s) => s.officeInspected)
  const inventory = useGameState((s) => s.inventory)
  const scriptedWalk = useGameState((s) => s.scriptedWalk)
  const exploreStart = useGameState((s) => s.exploreStart)
  const setInputMode = useGameState((s) => s.setInputMode)
  const setHint = useGameState((s) => s.setHint)
  const addInventoryItem = useGameState((s) => s.addInventoryItem)
  const markOfficeInspected = useGameState((s) => s.markOfficeInspected)
  const setAtePork = useGameState((s) => s.setAtePork)
  const atePork = useGameState((s) => s.atePork)
  const playerNickname = useGameState((s) => s.playerNickname)
  const setPostInvestigationStage = useGameState((s) => s.setPostInvestigationStage)
  const beginOnboardingChannel = useGameState((s) => s.beginOnboardingChannel)
  const goToRoom = useGameState((s) => s.goToRoom)
  const finishPassage = useGameState((s) => s.finishPassage)
  const [vnPhase, setVnPhase] = useState('idle')
  const [inspectId, setInspectId] = useState(null)
  const [bagOpen, setBagOpen] = useState(false)
  const [bagItem, setBagItem] = useState(null)
  const startedRef = useRef(false)
  const audio = useMemo(() => createAudioService(), [])
  const inOffice = currentRoom === 'office'
  const walking = vnPhase === 'idle' || vnPhase === 'free'
  const inputMode = walking ? '3d' : 'vn'
  const meta = ROOM_GRAPH[currentRoom] ?? ROOM_GRAPH.corridor
  const canInspect = vnPhase === 'free' && OFFICE_INSPECT_IDS.includes(lookId) && !officeInspected[lookId]
  const inspectedLook = vnPhase === 'free' && OFFICE_INSPECT_IDS.includes(lookId) && Boolean(officeInspected[lookId])
  const isolBeats = useMemo(() => buildKangIsolBeats(playerNickname), [playerNickname])
  const beats = vnPhase === 'meeting'
    ? OFFICE_VN_BEATS
    : vnPhase === 'look'
      ? OFFICE_LOOK_BEATS
      : vnPhase === 'inspect'
        ? OFFICE_INSPECT_BEATS[inspectId]
        : vnPhase === 'gromiIntro'
          ? GROMI_INTRO_BEATS
          : vnPhase === 'porkCheck'
            ? PORK_CONDITION_BEATS
            : vnPhase === 'kangIsol'
              ? isolBeats
              : vnPhase === 'onboardingInvite'
                ? ONBOARDING_INVITE_BEATS
                : null

  useEffect(() => {
    useGameState.setState({ introPhase: 'explore' })
  }, [])

  useEffect(() => {
    setInputMode(inputMode)
    if (inputMode === 'vn') document.exitPointerLock?.()
  }, [inputMode, setInputMode])

  useEffect(() => {
    if (exploreStart === 'post-inspect') {
      startedRef.current = true
      setPostInvestigationStage(POST_INVESTIGATION_STAGE.GROMI_INTRO)
      setVnPhase('gromiIntro')
      return undefined
    }
    if (exploreStart === 'office-free') {
      startedRef.current = true
      setVnPhase('free')
      return undefined
    }
    if (!inOffice || startedRef.current) return undefined
    const id = window.setTimeout(() => {
      startedRef.current = true
      setVnPhase('meeting')
    }, 360)
    return () => window.clearTimeout(id)
  }, [inOffice, exploreStart])

  useEffect(() => () => audio.stopBgm(), [audio])

  useEffect(() => {
    if (scriptedWalk) {
      setHint('안쪽 통로를 지나간다.')
      return undefined
    }
    if (vnPhase === 'free') {
      if (canInspect) setHint('E : 조사')
      else if (inspectedLook) setHint('이미 조사함')
      else setHint(ROOM_GRAPH.office.hint)
      return undefined
    }
    if (vnPhase === 'idle' && currentRoom === 'corridor') {
      setHint(lookId === 'exitDoor' ? 'E : 안으로 들어간다' : '복도를 지나 안으로 들어가자.')
    }
    return undefined
  }, [vnPhase, canInspect, inspectedLook, currentRoom, lookId, scriptedWalk, setHint])

  useEffect(() => {
    const onKey = (event) => {
      if (event.code !== 'KeyE' || scriptedWalk) return
      if (vnPhase === 'idle' && currentRoom === 'corridor' && lookId === 'exitDoor') {
        goToRoom('office')
        return
      }
      if (!canInspect) return
      setInspectId(lookId)
      setVnPhase('inspect')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [canInspect, lookId, vnPhase, currentRoom, goToRoom, scriptedWalk])

  const onBeatChange = useCallback((beat) => {
    if (beat?.cue === 'tension-bgm') audio.playBgm('bgm_tension_loop')
  }, [audio])

  const onChoice = useCallback((choiceId) => {
    if (inspectId === 'pork') {
      setAtePork(choiceId === 'Y')
      return
    }
    if (choiceId === 'Y' && (inspectId === 'calendar' || inspectId === 'wallet' || inspectId === 'nail')) {
      addInventoryItem(inspectId)
    }
  }, [inspectId, addInventoryItem, setAtePork])

  const onVnComplete = useCallback(() => {
    if (vnPhase === 'meeting') {
      window.setTimeout(() => setVnPhase('look'), 280)
      return
    }
    if (vnPhase === 'look') {
      setVnPhase('free')
      setHint(ROOM_GRAPH.office.hint)
      return
    }
    if (vnPhase === 'inspect' && inspectId) {
      const nextInspected = { ...officeInspected, [inspectId]: true }
      markOfficeInspected(inspectId)
      setInspectId(null)
      if (OFFICE_INSPECT_IDS.every((id) => nextInspected[id])) {
        setPostInvestigationStage(POST_INVESTIGATION_STAGE.INVESTIGATION_COMPLETE)
        setPostInvestigationStage(POST_INVESTIGATION_STAGE.GROMI_INTRO)
        setVnPhase('gromiIntro')
        return
      }
      setVnPhase('free')
    }
    if (vnPhase === 'gromiIntro') {
      if (atePork) {
        setPostInvestigationStage(POST_INVESTIGATION_STAGE.PORK_CHECK)
        setVnPhase('porkCheck')
        return
      }
      setPostInvestigationStage(POST_INVESTIGATION_STAGE.KANG_ISOL)
      setVnPhase('kangIsol')
      return
    }
    if (vnPhase === 'porkCheck') {
      setPostInvestigationStage(POST_INVESTIGATION_STAGE.KANG_ISOL)
      setVnPhase('kangIsol')
      return
    }
    if (vnPhase === 'kangIsol') {
      setPostInvestigationStage(POST_INVESTIGATION_STAGE.ONBOARDING_INVITE)
      setVnPhase('onboardingInvite')
      return
    }
    if (vnPhase === 'onboardingInvite') {
      beginOnboardingChannel()
    }
  }, [vnPhase, inspectId, officeInspected, markOfficeInspected, setHint, atePork, setPostInvestigationStage, beginOnboardingChannel])

  const selected = bagItem ? ITEM_INFO[bagItem] : null

  return (
    <div className="opening-stage">
      <div className="opening-frame">
        <div className={`opening-canvas ${inputMode === 'vn' ? 'is-vn' : 'is-3d'}`}>
          <WorldCanvas camera={{ fov: 70, position: meta.spawn }}>
            <Suspense fallback={null}>
              {inOffice ? <Office /> : <Corridor />}
            </Suspense>
            <PlayerController
              key={currentRoom}
              bounds={meta.bounds}
              spawn={meta.spawn}
            />
            <CorridorWalk active={scriptedWalk} onDone={finishPassage} />
          </WorldCanvas>
        </div>
        <div className="play-fade" style={{ opacity: fade }} />
        {beats && (
          <VNOverlay
            key={`${vnPhase}-${inspectId ?? ''}`}
            beats={beats}
            onComplete={onVnComplete}
            onBeatChange={onBeatChange}
            onChoice={onChoice}
          />
        )}
        {walking && !scriptedWalk && (
          <p className="play-prompt" style={{ position: 'absolute', left: 24, bottom: 28 }}>
            {hint}
          </p>
        )}
        {vnPhase === 'free' && (
          <button type="button" className="explore-bag-btn" onClick={() => setBagOpen((open) => !open)}>
            가방
          </button>
        )}
        {bagOpen && vnPhase === 'free' && (
          <div className="explore-bag">
            <p className="explore-bag-title">소지품</p>
            {inventory.length === 0 && <p className="explore-bag-empty">비어 있다.</p>}
            {inventory.map((id) => (
              <button key={id} type="button" className="explore-bag-item" onClick={() => setBagItem(id)}>
                {ITEM_INFO[id]?.name ?? id}
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
      </div>
    </div>
  )
}
