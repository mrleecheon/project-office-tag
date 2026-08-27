import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Matrix4, MathUtils, Quaternion, Vector3 } from 'three'
import WhiteRoom from '../scenes/WhiteRoom.jsx'
import Office from '../scenes/Office.jsx'
import MeetingRoom, {
  MEETING_CUT_CAMERA,
  MEETING_CUT_FOV,
  MEETING_CUT_LOOK,
  MEETING_WALK_SPAWN,
} from '../scenes/MeetingRoom.jsx'
import Stairwell, { STAIR_BOUNDS, STAIR_SPAWN } from '../scenes/Stairwell.jsx'
import CoffeeStation, {
  COFFEE_BREW_CAMERA,
  COFFEE_MACHINE_ORIGIN,
  GROOMY_APPROACH_START,
  GROOMY_DELIVERY_POINT,
  GROOMY_ENTER_CAMERA,
  GROOMY_ENTER_LOOK,
  activeCoffeeOrder,
  isCoffeeGameDone,
} from '../scenes/CoffeeStation.jsx'
import PlayerController from '../systems/PlayerController.jsx'
import WorldCanvas from '../systems/WorldCanvas.jsx'
import WorldErrorBoundary from '../runtime/WorldErrorBoundary.jsx'
import WorldPrompt from '../systems/WorldPrompt.jsx'
import VNOverlay from '../ui/VNOverlay.jsx'
import IncomingCallScreen from '../ui/IncomingCallScreen.jsx'
import FragmentTensionAudio from '../ui/FragmentTensionAudio.jsx'
import { ROOM_GRAPH, useGameState } from '../state/gameStateStore.js'
import {
  CHIP_WAKE_STEP,
  CHOI_STAFF_MONO_BEATS,
  CHOI_STAFF_VN_BEATS,
  GROOMY_CALL_BEATS,
  GROOMY_CHIP_GUIDE_BEATS,
  GROOMY_DELIVERY_BEATS,
  GROOMY_OFFICE_NUDGE_BEATS,
  buildGroomyReturnCallBeats,
  ISOL_STAFF_BEATS,
  KANG_ISOL_COFFEE_BEATS_PART1,
  KANG_ISOL_COFFEE_BEATS_PART2,
  KANG_ISOL_COFFEE_NUDGE_BEATS,
  KANG_ISOL_POST_COFFEE_BEATS,
  MINJUN_DELIVERY_BEATS,
  SUJIN_DELIVERY_BEATS,
  KIM_STAFF_BEATS,
  OFFICE_CHIP_MONOLOGUE_BEATS,
} from '../runtime/productFlow.js'
import {
  BROKEN_ROPE_ITEM_ID,
  FRAGMENT_ROPE_POPUP_BEATS,
  FRAGMENT_VANISH_BEATS,
  GROOMY_FRAGMENTS,
  buildFragmentReadBeats,
} from '../content/dialogue/groomyFragments.js'
import {
  CORPSE_AFTER_TIMER_BEATS,
  CORPSE_DISCOVER_BEATS,
  CORPSE_INSPECT_BEATS,
  MEETING_DOOR_EXIT_CHOICE_BEATS,
  MEETING_DOOR_THOUGHT_BEATS,
  MEETING_SESSION_BEATS,
  STAIR_DOWN_BLOCKED_BEATS,
} from '../content/dialogue/meetingBeats.js'
import InventoryBag from '../ui/InventoryBag.jsx'
import '../PlayRoot.css'
import './OpeningVnOverlay.css'
import './WhiteRoomIntro.css'
import './ChipWakeStage.css'
import '../systems/WorldPrompt.css'

const WHITE_BOUNDS = { minX: -5.4, maxX: 5.4, minZ: -5.4, maxZ: 5.55 }
const WHITE_SPAWN = [0, 1.6, 2.4]

function playDing() {
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return
  const ctx = new Ctx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = 880
  gain.gain.value = 0.08
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
  osc.stop(ctx.currentTime + 0.36)
}

function LookAround({ active, onDone }) {
  const { camera } = useThree()
  const elapsed = useRef(0)
  const finished = useRef(false)
  useEffect(() => {
    elapsed.current = 0
    finished.current = false
  }, [active])
  useFrame((_, delta) => {
    if (!active || finished.current) return
    elapsed.current += delta
    camera.rotation.order = 'YXZ'
    camera.rotation.y = Math.sin(elapsed.current * 0.85) * 0.42
    camera.rotation.x = Math.sin(elapsed.current * 0.55) * 0.1
    if (elapsed.current >= 2.6) {
      finished.current = true
      onDone()
    }
  })
  return null
}

function GroomyBlob() {
  const mesh = useRef()
  useFrame((_, delta) => {
    if (!mesh.current) return
    mesh.current.rotation.y += delta * 0.35
  })
  return (
    <group position={[0, 1.15, -2.6]}>
      <mesh ref={mesh} userData={{ interactId: 'groomy-guide', interactReach: 2 }}>
        <icosahedronGeometry args={[0.62, 0]} />
        <meshStandardMaterial
          color="#7dffd4"
          emissive="#3cffb0"
          emissiveIntensity={1.8}
          roughness={0.35}
          flatShading
        />
      </mesh>
      <mesh userData={{ interactId: 'groomy-guide', interactReach: 2 }}>
        <boxGeometry args={[1.15, 1.7, 1.15]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

const _camAim = new Vector3()
const _camLook = new Vector3()
const _camQ = new Quaternion()
const _camM = new Matrix4()

function DirectedCam({ active, aim, look, damp = 1.5, fov = 62 }) {
  const { camera } = useThree()
  useFrame((_, delta) => {
    if (!active || !aim || !look) return
    _camAim.set(aim[0], aim[1], aim[2])
    _camLook.set(look[0], look[1], look[2])
    const k = 1 - Math.exp(-damp * delta)
    camera.position.lerp(_camAim, k)
    _camM.lookAt(camera.position, _camLook, camera.up)
    _camQ.setFromRotationMatrix(_camM)
    camera.quaternion.slerp(_camQ, k)
    camera.fov = MathUtils.lerp(camera.fov ?? 70, fov, k)
    camera.updateProjectionMatrix()
  })
  return null
}

function BlackOfficeDoor() {
  return (
    <group position={[0, 1.55, 5.88]}>
      <mesh userData={{ interactId: 'black-door' }}>
        <boxGeometry args={[1.4, 2.5, 0.12]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
    </group>
  )
}

function GroomyApproach({ playing }) {
  const group = useRef()
  const progress = useRef(playing ? 0 : 1)
  useEffect(() => {
    progress.current = playing ? 0 : 1
  }, [playing])
  useFrame((_, delta) => {
    if (!group.current) return
    if (playing) progress.current = Math.min(1, progress.current + delta * 0.11)
    const t = progress.current
    const a = GROOMY_APPROACH_START
    const b = GROOMY_DELIVERY_POINT
    group.current.position.set(
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    )
    group.current.rotation.y += delta * 0.4
  })
  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial
          color="#7dffd4"
          emissive="#3cffb0"
          emissiveIntensity={1.6}
          roughness={0.35}
          flatShading
        />
      </mesh>
    </group>
  )
}

function GroomyDeliveryAnchor() {
  return (
    <mesh position={GROOMY_DELIVERY_POINT} userData={{ interactId: 'coffee-groomy', interactReach: 2.2 }}>
      <boxGeometry args={[0.9, 1.7, 0.9]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

function SitTrigger() {
  return (
    <mesh position={[-3.1, 0.55, -0.55]} userData={{ interactId: 'sit-desk', interactId: 'sit-desk' }}>
      <boxGeometry args={[1.1, 1.1, 1.1]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

function StaffTrigger({ id, position }) {
  return (
    <mesh position={position} userData={{ interactId: id, interactId: id }}>
      <boxGeometry args={[0.85, 1.6, 0.85]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

export default function ChipWakeStage() {
  const fade = useGameState((s) => s.fade)
  const hint = useGameState((s) => s.hint)
  const lookId = useGameState((s) => s.lookId)
  const chipWakeStep = useGameState((s) => s.chipWakeStep)
  const isolTalked = useGameState((s) => s.isolTalked)
  const kimTalked = useGameState((s) => s.kimTalked)
  const choiTalked = useGameState((s) => s.choiTalked)
  const groomyOfficeNudgeDone = useGameState((s) => s.groomyOfficeNudgeDone)
  const chipOfficeIntroDone = useGameState((s) => s.chipOfficeIntroDone)
  const chipWakeResume = useGameState((s) => s.chipWakeResume)
  const officeAfterMorning = useGameState((s) => s.officeAfterMorning)
  const coffeeBriefingDone = useGameState((s) => s.coffeeBriefingDone)
  const coffeeMachineVisited = useGameState((s) => s.coffeeMachineVisited)
  const markCoffeeBriefingDone = useGameState((s) => s.markCoffeeBriefingDone)
  const markCoffeeMachineVisited = useGameState((s) => s.markCoffeeMachineVisited)
  const setHint = useGameState((s) => s.setHint)
  const setInputMode = useGameState((s) => s.setInputMode)
  const beginChipWakeTalkline = useGameState((s) => s.beginChipWakeTalkline)
  const enterChipOffice = useGameState((s) => s.enterChipOffice)
  const beginKangIsolMorning = useGameState((s) => s.beginKangIsolMorning)
  const setChipOfficeIntroDone = useGameState((s) => s.setChipOfficeIntroDone)
  const markStaffTalked = useGameState((s) => s.markStaffTalked)
  const markGroomyOfficeNudgeDone = useGameState((s) => s.markGroomyOfficeNudgeDone)
  const coffeeGame = useGameState((s) => s.coffeeGame)
  const playerNickname = useGameState((s) => s.playerNickname)
  const isolPostCoffeeUnlocked = useGameState((s) => s.isolPostCoffeeUnlocked)
  const isolPostCoffeeTalked = useGameState((s) => s.isolPostCoffeeTalked)
  const startCoffeeBrewing = useGameState((s) => s.startCoffeeBrewing)
  const pourCoffeeShot = useGameState((s) => s.pourCoffeeShot)
  const deliverCoffeeOrder = useGameState((s) => s.deliverCoffeeOrder)
  const setCoffeeDeliveryFlag = useGameState((s) => s.setCoffeeDeliveryFlag)
  const unlockIsolPostCoffee = useGameState((s) => s.unlockIsolPostCoffee)
  const markIsolPostCoffeeTalked = useGameState((s) => s.markIsolPostCoffeeTalked)
  const beginFragmentHunt = useGameState((s) => s.beginFragmentHunt)
  const tickFragmentTimer = useGameState((s) => s.tickFragmentTimer)
  const markFragmentInteracted = useGameState((s) => s.markFragmentInteracted)
  const addInventoryItem = useGameState((s) => s.addInventoryItem)
  const inventory = useGameState((s) => s.inventory)
  const papers = useGameState((s) => s.papers)
  const paperPositions = useGameState((s) => s.paperPositions)
  const interactedFragmentIds = useGameState((s) => s.interactedFragmentIds)
  const fragmentHuntActive = useGameState((s) => s.fragmentHuntActive)
  const fragmentHuntComplete = useGameState((s) => s.fragmentHuntComplete)
  const fragmentSecondsLeft = useGameState((s) => s.fragmentSecondsLeft)
  const pendingFragmentCall = useGameState((s) => s.pendingFragmentCall)
  const fragmentsTimedOut = useGameState((s) => s.fragmentsTimedOut)
  const enterMeetingAfterFragmentCall = useGameState((s) => s.enterMeetingAfterFragmentCall)
  const beginFragmentReturnCall = useGameState((s) => s.beginFragmentReturnCall)
  const unlockMeetingWalk = useGameState((s) => s.unlockMeetingWalk)
  const setMeetingChoice = useGameState((s) => s.setMeetingChoice)
  const enterStairwellFromMeeting = useGameState((s) => s.enterStairwellFromMeeting)
  const meetingWalkUnlocked = useGameState((s) => s.meetingWalkUnlocked)
  const corpseApproachDone = useGameState((s) => s.corpseApproachDone)
  const corpseTimerActive = useGameState((s) => s.corpseTimerActive)
  const corpseSecondsLeft = useGameState((s) => s.corpseSecondsLeft)
  const corpseInspected = useGameState((s) => s.corpseInspected)
  const corpseSequenceDone = useGameState((s) => s.corpseSequenceDone)
  const stairDownHintDone = useGameState((s) => s.stairDownHintDone)
  const markStairDownHintDone = useGameState((s) => s.markStairDownHintDone)
  const markCorpseApproachDone = useGameState((s) => s.markCorpseApproachDone)
  const startCorpseTimer = useGameState((s) => s.startCorpseTimer)
  const tickCorpseTimer = useGameState((s) => s.tickCorpseTimer)
  const markCorpseInspected = useGameState((s) => s.markCorpseInspected)
  const finishCorpseSequence = useGameState((s) => s.finishCorpseSequence)
  const beginChoiOfficeTalkline = useGameState((s) => s.beginChoiOfficeTalkline)
  const clearChipWakeResume = useGameState((s) => s.clearChipWakeResume)

  const [blinkOn, setBlinkOn] = useState(true)
  const [looking, setLooking] = useState(false)
  const [phoneUp, setPhoneUp] = useState(false)
  const [guideTalk, setGuideTalk] = useState(false)
  const [guideTalked, setGuideTalked] = useState(false)
  const [officeTalk, setOfficeTalk] = useState(!chipOfficeIntroDone)
  const [staffEvent, setStaffEvent] = useState(null)
  const [groomyEnter, setGroomyEnter] = useState(false)
  const [fragmentEvent, setFragmentEvent] = useState(null)
  const [activeFragmentId, setActiveFragmentId] = useState(null)
  const [puzzleDraft, setPuzzleDraft] = useState('')
  const [bagOpen, setBagOpen] = useState(false)
  /** null | 'ring' | 'talk' — 파편 이후 복귀 전화 */
  const [fragmentCallPhase, setFragmentCallPhase] = useState(null)
  /** null | 'session' | 'door-thought' | 'door-choice' */
  const [meetingEvent, setMeetingEvent] = useState(null)
  /** null | 'stair-down' | 'corpse-discover' | 'corpse-inspect' | 'corpse-after' */
  const [stairEvent, setStairEvent] = useState(null)
  const [timerGlitch, setTimerGlitch] = useState(false)
  const corpseTimerWasActive = useRef(false)
  const qaVnOnly = new URLSearchParams(window.location.search).has('vnqa')
  const officeMeta = ROOM_GRAPH.office
  const meetingMeta = ROOM_GRAPH.meetingRoom
  const choiBoot = new URLSearchParams(window.location.search).has('choi')
  const officeSpawn = choiBoot ? [2.55, 1.6, 1.85] : officeMeta.spawn
  const inOffice = chipWakeStep === CHIP_WAKE_STEP.OFFICE
  const inGuide = chipWakeStep === CHIP_WAKE_STEP.GUIDE_3D
  const inFragment = chipWakeStep === CHIP_WAKE_STEP.FRAGMENT_ROOM
  const inMeeting = chipWakeStep === CHIP_WAKE_STEP.MEETING
  const inStair = chipWakeStep === CHIP_WAKE_STEP.STAIRWELL
  const coffeeCam = staffEvent === 'isol-coffee-cam'
  const showGroomy = officeAfterMorning && (groomyEnter || coffeeBriefingDone)
  const coffeeOrder = activeCoffeeOrder(coffeeGame)
  const coffeeGameDone = isCoffeeGameDone(coffeeGame)
  const fragmentBusy = Boolean(fragmentEvent)
  const walking = (
    (inGuide && !guideTalk)
    || (inOffice && !officeTalk && !phoneUp && !staffEvent)
    || (inFragment && fragmentHuntActive && !fragmentBusy && !fragmentHuntComplete && !pendingFragmentCall)
    || (inMeeting && meetingWalkUnlocked && !meetingEvent)
    || (inStair && !corpseSequenceDone && !stairEvent)
  )
  const inputMode = walking ? '3d' : 'vn'
  const machineLook = [
    COFFEE_MACHINE_ORIGIN[0] + 0.35,
    1.12,
    COFFEE_MACHINE_ORIGIN[2],
  ]
  const activeFragment = papers.find((p) => p.id === activeFragmentId) ?? GROOMY_FRAGMENTS.find((p) => p.id === activeFragmentId)
  const fragmentReadBeats = activeFragment && !activeFragment.isInteractivePuzzle
    ? buildFragmentReadBeats(activeFragment)
    : null
  const timerLabel = `${String(Math.floor(fragmentSecondsLeft / 60)).padStart(2, '0')}:${String(fragmentSecondsLeft % 60).padStart(2, '0')}`
  const corpseTimerLabel = `${String(Math.floor(corpseSecondsLeft / 60)).padStart(2, '0')}:${String(corpseSecondsLeft % 60).padStart(2, '0')}`
  const returnCallBeats = buildGroomyReturnCallBeats({ timedOut: fragmentsTimedOut })
  const meetingCutLocked = inMeeting && !meetingWalkUnlocked

  const maybeGroomyNudge = useCallback(() => {
    const state = useGameState.getState()
    if (state.groomyOfficeNudgeDone) return
    if (!state.isolTalked || !state.kimTalked || !state.choiTalked) return
    window.setTimeout(() => setStaffEvent('groomy'), 450)
  }, [])

  useEffect(() => {
    if (!import.meta.env.DEV) return undefined
    window.__START_DELIVERY_VN__ = (kind) => setStaffEvent(kind)
    window.__START_ISOL_POST_COFFEE__ = () => setStaffEvent('isol-post-coffee')
    window.__START_FRAGMENT_HUNT__ = () => beginFragmentHunt()
    window.__START_FRAGMENT_CALL__ = (reason = 'all') => {
      beginFragmentReturnCall(reason === 'timeout' ? 'timeout' : 'all')
      setFragmentCallPhase('ring')
    }
    return () => {
      delete window.__START_DELIVERY_VN__
      delete window.__START_ISOL_POST_COFFEE__
      delete window.__START_FRAGMENT_HUNT__
      delete window.__START_FRAGMENT_CALL__
    }
  }, [beginFragmentHunt, beginFragmentReturnCall])

  useEffect(() => {
    if (!pendingFragmentCall) return
    if (fragmentCallPhase) return
    setFragmentCallPhase('ring')
  }, [pendingFragmentCall, fragmentCallPhase])

  useEffect(() => {
    if (!inMeeting || meetingWalkUnlocked || pendingFragmentCall) return
    if (meetingEvent) return
    setMeetingEvent('session')
  }, [inMeeting, meetingWalkUnlocked, meetingEvent, pendingFragmentCall])

  useEffect(() => {
    if (!inStair || !walking) return
    if (corpseApproachDone || stairEvent || corpseSequenceDone) return
    if (lookId === 'stair-corpse') {
      markCorpseApproachDone()
      setStairEvent('corpse-discover')
    }
  }, [inStair, walking, lookId, corpseApproachDone, stairEvent, corpseSequenceDone, markCorpseApproachDone])

  // 계단 하강 안내는 E로만 (스폰 직후 look 자동발화 방지)

  useEffect(() => {
    if (!corpseTimerActive) return undefined
    const id = window.setInterval(() => tickCorpseTimer(), 1000)
    return () => window.clearInterval(id)
  }, [corpseTimerActive, tickCorpseTimer])

  useEffect(() => {
    if (corpseTimerWasActive.current && !corpseTimerActive && corpseSecondsLeft === 0 && !corpseSequenceDone && inStair) {
      setTimerGlitch(true)
      setStairEvent('corpse-after')
      finishCorpseSequence()
      window.setTimeout(() => setTimerGlitch(false), 700)
    }
    corpseTimerWasActive.current = corpseTimerActive
  }, [corpseTimerActive, corpseSecondsLeft, corpseSequenceDone, inStair, finishCorpseSequence])

  useEffect(() => {
    if (!inFragment || !fragmentHuntActive || fragmentHuntComplete) return undefined
    const id = window.setInterval(() => tickFragmentTimer(), 1000)
    return () => window.clearInterval(id)
  }, [inFragment, fragmentHuntActive, fragmentHuntComplete, tickFragmentTimer])

  useEffect(() => {
    if (!fragmentHuntComplete) return
    setFragmentEvent(null)
    setActiveFragmentId(null)
    setBagOpen(false)
  }, [fragmentHuntComplete])

  useEffect(() => {
    if (!coffeeCam) return undefined
    const id = window.setTimeout(() => setStaffEvent(null), 2800)
    return () => window.clearTimeout(id)
  }, [coffeeCam])

  useEffect(() => {
    setInputMode(inputMode)
    if (inputMode === 'vn') document.exitPointerLock?.()
  }, [inputMode, setInputMode])

  useEffect(() => {
    if (chipWakeStep !== CHIP_WAKE_STEP.BLINK) return undefined
    const blink = window.setTimeout(() => setBlinkOn(false), 1200)
    const look = window.setTimeout(() => setLooking(true), 1300)
    return () => {
      window.clearTimeout(blink)
      window.clearTimeout(look)
    }
  }, [chipWakeStep])

  const finishLook = useCallback(() => {
    setLooking(false)
    playDing()
    setPhoneUp(true)
    window.setTimeout(() => beginChipWakeTalkline(), 900)
  }, [beginChipWakeTalkline])

  useEffect(() => {
    if (!inGuide) return undefined
    setHint('')
    return undefined
  }, [inGuide, setHint])

  useEffect(() => {
    if (!inOffice) return undefined
    setHint('')
    if (chipWakeResume === 'choiMono') {
      clearChipWakeResume()
      setOfficeTalk(false)
      setStaffEvent('choi-mono')
      return undefined
    }
    if (!chipOfficeIntroDone) setOfficeTalk(true)
    else setOfficeTalk(false)
    return undefined
  }, [inOffice, chipWakeResume, chipOfficeIntroDone, clearChipWakeResume, setHint])

  useEffect(() => {
    if (!walking) return undefined
    const onKey = (event) => {
      if (event.code !== 'KeyE') return
      if (inFragment) {
        if (!lookId || !String(lookId).startsWith('frag-')) return
        if (interactedFragmentIds.includes(lookId)) return
        const frag = papers.find((p) => p.id === lookId)
        if (!frag) return
        document.exitPointerLock?.()
        setActiveFragmentId(lookId)
        if (frag.isInteractivePuzzle) {
          setPuzzleDraft('')
          setFragmentEvent('puzzle')
        } else {
          setFragmentEvent('read')
        }
        return
      }
      if (inGuide && lookId === 'groomy-guide' && !guideTalked) {
        setGuideTalk(true)
        return
      }
      if (inGuide && lookId === 'black-door' && guideTalked) enterChipOffice()
      if (inMeeting && lookId === 'meeting-door') {
        document.exitPointerLock?.()
        setMeetingEvent('door-thought')
        return
      }
      if (inStair && lookId === 'stair-down' && !stairDownHintDone) {
        document.exitPointerLock?.()
        setStairEvent('stair-down')
        return
      }
      if (inStair && lookId === 'stair-corpse' && corpseTimerActive && !corpseInspected && !stairEvent) {
        document.exitPointerLock?.()
        markCorpseInspected()
        setStairEvent('corpse-inspect')
        return
      }
      if (!inOffice) return
      if (coffeeGame.phase === 'carrying' && coffeeOrder) {
        if (lookId === coffeeOrder.target) {
          if (lookId === 'staff-choi') setStaffEvent('delivery-minjun')
          else if (lookId === 'staff-kim') setStaffEvent('delivery-sujin')
          else if (lookId === 'coffee-groomy') setStaffEvent('delivery-groomy')
        }
        return
      }
      if (lookId === 'staff-isol') {
        if (officeAfterMorning) {
          if (isolPostCoffeeUnlocked) {
            if (!isolPostCoffeeTalked) setStaffEvent('isol-post-coffee')
            return
          }
          if (coffeeBriefingDone && !coffeeMachineVisited) {
            setStaffEvent('isol-coffee-nudge')
            return
          }
          if (coffeeBriefingDone) return
          setStaffEvent('isol-coffee')
          return
        }
        if (!isolTalked) setStaffEvent('isol')
        return
      }
      if (lookId === 'staff-kim') {
        if (officeAfterMorning) return
        if (!kimTalked) setStaffEvent('kim')
        return
      }
      if (lookId === 'staff-choi') {
        if (officeAfterMorning) return
        if (!choiTalked) setStaffEvent('choi')
        return
      }
      if (lookId === 'coffee-groomy') {
        return
      }
      if (lookId === 'coffee-button' || lookId === 'coffee-deliver') {
        if (!coffeeBriefingDone || coffeeGameDone) return
        if (coffeeGame.phase === 'idle') {
          startCoffeeBrewing()
          markCoffeeMachineVisited()
        } else if (coffeeGame.phase === 'brewing') pourCoffeeShot()
        return
      }
      if (lookId === 'sit-desk' && !officeAfterMorning) beginKangIsolMorning()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [
    walking,
    inGuide,
    inOffice,
    inFragment,
    lookId,
    guideTalked,
    isolTalked,
    kimTalked,
    choiTalked,
    coffeeBriefingDone,
    coffeeMachineVisited,
    officeAfterMorning,
    coffeeGame.phase,
    coffeeOrder,
    coffeeGameDone,
    isolPostCoffeeUnlocked,
    isolPostCoffeeTalked,
    papers,
    interactedFragmentIds,
    inMeeting,
    inStair,
    stairDownHintDone,
    corpseTimerActive,
    corpseInspected,
    stairEvent,
    markCorpseInspected,
    enterChipOffice,
    beginKangIsolMorning,
    startCoffeeBrewing,
    pourCoffeeShot,
    markCoffeeMachineVisited,
  ])

  useEffect(() => {
    if (inFragment) {
      setHint('')
      return
    }
    if (inMeeting && meetingWalkUnlocked && !meetingEvent) {
      setHint(lookId === 'meeting-door' ? 'E' : '')
      return
    }
    if (inStair && !stairEvent && !corpseSequenceDone) {
      if (lookId === 'stair-down' && !stairDownHintDone) setHint('E')
      else if (lookId === 'stair-corpse' && corpseTimerActive && !corpseInspected) setHint('E')
      else setHint('')
      return
    }
    if (inGuide && !guideTalk) {
      if (!guideTalked) {
        setHint(lookId === 'groomy-guide' ? 'E  말 걸기' : '그루미에게 가세요.')
      } else {
        setHint(lookId === 'black-door' ? 'E  검은 문으로 나간다' : '검은 문으로 나가세요.')
      }
    }
    if (inOffice && !officeTalk && !staffEvent && !phoneUp) {
      if (officeAfterMorning) {
        if (lookId === 'staff-isol') {
          if (isolPostCoffeeUnlocked && !isolPostCoffeeTalked) setHint('E  말 걸기')
          else if (!coffeeBriefingDone || !coffeeMachineVisited) setHint('E  말 걸기')
          else setHint('')
        } else if (coffeeGame.phase === 'carrying' && coffeeOrder && lookId === coffeeOrder.target) {
          setHint('E  커피 전달')
        } else if (coffeeGame.phase === 'carrying' && (lookId === 'staff-kim' || lookId === 'staff-choi' || lookId === 'coffee-groomy')) {
          setHint('...이 자리가 아닌 것 같다.')
        } else if ((lookId === 'coffee-button' || lookId === 'coffee-deliver') && coffeeBriefingDone && !coffeeGameDone && (coffeeGame.phase === 'idle' || coffeeGame.phase === 'brewing')) {
          setHint('E  추출')
        } else setHint('')
      } else if (lookId === 'staff-isol') setHint(isolTalked ? '이미 대화함' : 'E  말 걸기')
      else if (lookId === 'staff-kim') setHint(kimTalked ? '이미 대화함' : 'E  말 걸기')
      else if (lookId === 'staff-choi') setHint(choiTalked ? '이미 대화함' : 'E  말 걸기')
      else if (lookId === 'sit-desk') setHint('E  자리에 앉는다')
      else setHint('책상과 의자로 가세요.')
    }
  }, [
    inFragment,
    inMeeting,
    meetingWalkUnlocked,
    meetingEvent,
    inStair,
    stairEvent,
    corpseSequenceDone,
    stairDownHintDone,
    corpseTimerActive,
    corpseInspected,
    inGuide,
    guideTalk,
    guideTalked,
    inOffice,
    officeTalk,
    staffEvent,
    phoneUp,
    lookId,
    isolTalked,
    kimTalked,
    choiTalked,
    officeAfterMorning,
    coffeeBriefingDone,
    coffeeMachineVisited,
    coffeeGame.phase,
    coffeeOrder,
    coffeeGameDone,
    isolPostCoffeeUnlocked,
    isolPostCoffeeTalked,
    setHint,
  ])

  return (
    <div className="opening-stage">
      <div className="opening-frame">
        <div className={`opening-canvas ${inputMode === 'vn' ? 'is-vn' : 'is-3d'}`}>
          {!qaVnOnly && (
          <WorldErrorBoundary fallback={null}>
          <WorldCanvas camera={{ fov: meetingCutLocked ? MEETING_CUT_FOV : 70, position: inOffice ? officeSpawn : inMeeting ? (meetingCutLocked ? MEETING_CUT_CAMERA : MEETING_WALK_SPAWN) : inStair ? STAIR_SPAWN : WHITE_SPAWN }}>
            <Suspense fallback={null}>
              {inOffice ? (
                <>
                  <Office />
                  <SitTrigger />
                  <StaffTrigger id="staff-isol" position={[3.1, 0.8, -0.55]} />
                  <StaffTrigger id="staff-kim" position={[-3.1, 0.8, 0.75]} />
                  <StaffTrigger id="staff-choi" position={[3.1, 0.8, 0.75]} />
                  {officeAfterMorning && (
                    <CoffeeStation
                      origin={COFFEE_MACHINE_ORIGIN}
                      lookId={lookId}
                      phase={coffeeGame.phase}
                      order={coffeeOrder}
                      shots={coffeeGame.currentShots}
                      showPrompt={false}
                    />
                  )}
                  {showGroomy && (
                    <>
                      <GroomyApproach playing={groomyEnter && staffEvent === 'isol-coffee-part2'} />
                      <GroomyDeliveryAnchor />
                    </>
                  )}
                  {staffEvent === 'isol-coffee-part2' && groomyEnter && (
                    <DirectedCam
                      active
                      aim={GROOMY_ENTER_CAMERA}
                      look={GROOMY_ENTER_LOOK}
                      damp={0.85}
                      fov={48}
                    />
                  )}
                  {coffeeCam && (
                    <DirectedCam
                      active
                      aim={COFFEE_BREW_CAMERA}
                      look={machineLook}
                      damp={1.45}
                      fov={58}
                    />
                  )}
                </>
              ) : inMeeting ? (
                <>
                  <MeetingRoom />
                  {meetingCutLocked && (
                    <DirectedCam
                      active
                      aim={MEETING_CUT_CAMERA}
                      look={MEETING_CUT_LOOK}
                      damp={10}
                      fov={MEETING_CUT_FOV}
                    />
                  )}
                </>
              ) : inStair ? (
                <Stairwell />
              ) : (
                <>
                  {inFragment ? (
                    <WhiteRoom
                      papers={papers}
                      paperPositions={paperPositions}
                      interactedIds={interactedFragmentIds}
                      lookId={lookId}
                    />
                  ) : (
                    <WhiteRoom />
                  )}
                  {inGuide && (
                    <>
                      <GroomyBlob />
                      <BlackOfficeDoor />
                    </>
                  )}
                </>
              )}
            </Suspense>
            {!meetingCutLocked && (
              <PlayerController
                key={inOffice ? 'office' : inMeeting ? 'meeting-walk' : inStair ? 'stair' : inFragment ? 'fragment' : 'white'}
                bounds={inOffice ? officeMeta.bounds : inMeeting ? meetingMeta.bounds : inStair ? STAIR_BOUNDS : WHITE_BOUNDS}
                spawn={inOffice ? officeSpawn : inMeeting ? MEETING_WALK_SPAWN : inStair ? STAIR_SPAWN : WHITE_SPAWN}
              />
            )}
            <LookAround active={looking} onDone={finishLook} />
            {walking && hint && !inFragment && (
              <WorldPrompt
                position={
                  lookId === 'meeting-door'
                    ? [0, 2.2, meetingMeta.bounds.minZ + 0.5]
                    : lookId === 'stair-down'
                      ? [0, 1.7, 2.5]
                      : lookId === 'stair-corpse'
                        ? [0.35, 1.6, -2.15]
                    : lookId === 'groomy-guide' || (inGuide && !guideTalked)
                    ? [0, 1.95, -2.6]
                    : lookId === 'sit-desk'
                    ? [-3.1, 1.35, -0.55]
                    : lookId === 'staff-isol'
                      ? [3.1, 1.55, -0.55]
                      : lookId === 'staff-kim'
                        ? [-3.1, 1.55, 0.75]
                        : lookId === 'staff-choi'
                          ? [3.1, 1.55, 0.75]
                        : lookId === 'coffee-button' || lookId === 'coffee-deliver'
                          ? [COFFEE_MACHINE_ORIGIN[0] + 0.35, 1.55, COFFEE_MACHINE_ORIGIN[2] + 0.2]
                          : lookId === 'coffee-groomy'
                            ? [GROOMY_DELIVERY_POINT[0], GROOMY_DELIVERY_POINT[1] + 0.7, GROOMY_DELIVERY_POINT[2]]
                            : [0, 2.45, 5.88]
                }
                label={hint}
              />
            )}
          </WorldCanvas>
          </WorldErrorBoundary>
          )}
        </div>
        {blinkOn && chipWakeStep === CHIP_WAKE_STEP.BLINK && <div className="opening-blink" />}
        {phoneUp && (
          <div className="chip-held-phone" aria-hidden>
            <div className="chip-phone-sleep" />
          </div>
        )}
        {inGuide && guideTalk && (
          <VNOverlay
            beats={GROOMY_CHIP_GUIDE_BEATS}
            onComplete={() => {
              setGuideTalk(false)
              setGuideTalked(true)
            }}
          />
        )}
        {inOffice && officeTalk && !staffEvent && (
          <VNOverlay
            beats={OFFICE_CHIP_MONOLOGUE_BEATS}
            onComplete={() => {
              setOfficeTalk(false)
              setChipOfficeIntroDone()
            }}
          />
        )}
        {staffEvent === 'isol' && (
          <VNOverlay
            key="isol-staff"
            beats={ISOL_STAFF_BEATS}
            onComplete={() => {
              markStaffTalked('isol')
              setStaffEvent(null)
              maybeGroomyNudge()
            }}
          />
        )}
        {staffEvent === 'isol-coffee' && (
          <VNOverlay
            key="isol-coffee"
            beats={KANG_ISOL_COFFEE_BEATS_PART1}
            onComplete={() => {
              setStaffEvent('isol-coffee-part2')
            }}
          />
        )}
        {staffEvent === 'isol-coffee-part2' && (
          <VNOverlay
            key="isol-coffee-part2"
            beats={KANG_ISOL_COFFEE_BEATS_PART2}
            onBeatChange={(beat) => {
              if (beat?.id === 'isol-c2-02') setGroomyEnter(true)
            }}
            onComplete={() => {
              markCoffeeBriefingDone()
              setStaffEvent('isol-coffee-cam')
            }}
          />
        )}
        {staffEvent === 'isol-coffee-nudge' && (
          <VNOverlay
            key="isol-coffee-nudge"
            beats={KANG_ISOL_COFFEE_NUDGE_BEATS}
            onComplete={() => setStaffEvent(null)}
          />
        )}
        {staffEvent === 'kim' && (
          <VNOverlay
            key="kim-staff"
            beats={KIM_STAFF_BEATS}
            onComplete={() => {
              markStaffTalked('kim')
              setStaffEvent(null)
              maybeGroomyNudge()
            }}
          />
        )}
        {staffEvent === 'choi' && (
          <VNOverlay
            key="choi-staff"
            beats={CHOI_STAFF_VN_BEATS}
            onComplete={() => {
              setStaffEvent(null)
              setPhoneUp(true)
              window.setTimeout(() => beginChoiOfficeTalkline(), 900)
            }}
          />
        )}
        {staffEvent === 'choi-mono' && (
          <VNOverlay
            key="choi-mono"
            beats={CHOI_STAFF_MONO_BEATS}
            onComplete={() => {
              markStaffTalked('choi')
              setStaffEvent(null)
              maybeGroomyNudge()
            }}
          />
        )}
        {staffEvent === 'groomy' && (
          <VNOverlay
            key="groomy-nudge"
            beats={GROOMY_OFFICE_NUDGE_BEATS}
            onComplete={() => {
              markGroomyOfficeNudgeDone()
              setStaffEvent(null)
            }}
          />
        )}
        {staffEvent === 'delivery-minjun' && (
          <VNOverlay
            key="delivery-minjun"
            beats={MINJUN_DELIVERY_BEATS}
            userName={playerNickname}
            onChoice={(choiceId) => {
              if (choiceId === 'corrected') setCoffeeDeliveryFlag('minjunResponse', 'corrected')
              if (choiceId === 'accepted') setCoffeeDeliveryFlag('minjunResponse', 'accepted')
            }}
            onComplete={() => {
              deliverCoffeeOrder('staff-choi')
              setStaffEvent(null)
            }}
          />
        )}
        {staffEvent === 'delivery-sujin' && (
          <VNOverlay
            key="delivery-sujin"
            beats={SUJIN_DELIVERY_BEATS}
            userName={playerNickname}
            onComplete={() => {
              deliverCoffeeOrder('staff-kim')
              setStaffEvent(null)
            }}
          />
        )}
        {staffEvent === 'delivery-groomy' && (
          <VNOverlay
            key="delivery-groomy"
            beats={GROOMY_DELIVERY_BEATS}
            userName={playerNickname}
            onChoice={(choiceId) => {
              if (choiceId === 'trust-y') setCoffeeDeliveryFlag('groomyTrust', true)
              if (choiceId === 'trust-n') setCoffeeDeliveryFlag('groomyTrust', false)
            }}
            onComplete={() => {
              deliverCoffeeOrder('coffee-groomy')
              unlockIsolPostCoffee()
              setStaffEvent(null)
            }}
          />
        )}
        {staffEvent === 'isol-post-coffee' && (
          <VNOverlay
            key="isol-post-coffee"
            beats={KANG_ISOL_POST_COFFEE_BEATS}
            userName={playerNickname}
            onComplete={() => setStaffEvent('groomy-call-ring')}
          />
        )}
        {(staffEvent === 'groomy-call-ring' || staffEvent === 'groomy-call-talk') && (
          <IncomingCallScreen
            caller="그루미"
            phase={staffEvent === 'groomy-call-talk' ? 'active' : 'incoming'}
            onAccept={() => setStaffEvent('groomy-call-talk')}
          />
        )}
        {staffEvent === 'groomy-call-talk' && (
          <VNOverlay
            key="groomy-call-talk"
            beats={GROOMY_CALL_BEATS}
            userName={playerNickname}
            onComplete={() => {
              markIsolPostCoffeeTalked()
              setStaffEvent(null)
              beginFragmentHunt()
            }}
          />
        )}
        {inFragment && fragmentEvent === 'read' && fragmentReadBeats && (
          <VNOverlay
            key={`frag-read-${activeFragmentId}`}
            beats={fragmentReadBeats}
            onComplete={() => {
              markFragmentInteracted(activeFragmentId, { collected: true })
              setFragmentEvent(null)
              setActiveFragmentId(null)
            }}
          />
        )}
        {inFragment && fragmentEvent === 'vanish' && (
          <VNOverlay
            key="frag-vanish"
            beats={FRAGMENT_VANISH_BEATS}
            onComplete={() => {
              markFragmentInteracted(activeFragmentId, { collected: false })
              setFragmentEvent(null)
              setActiveFragmentId(null)
            }}
          />
        )}
        {inFragment && fragmentEvent === 'rope-popup' && (
          <VNOverlay
            key="frag-rope"
            beats={FRAGMENT_ROPE_POPUP_BEATS}
            onComplete={() => {
              markFragmentInteracted(activeFragmentId, { collected: false })
              setFragmentEvent(null)
              setActiveFragmentId(null)
            }}
          />
        )}
        {inFragment && fragmentEvent === 'puzzle' && (
          <div className="white-room-input fragment-puzzle">
            <p className="fragment-puzzle-confirm">정말 숫자를 적을까?</p>
            <label htmlFor="frag-lucky-number">좋아하는 숫자를 적어줘</label>
            <input
              id="frag-lucky-number"
              inputMode="numeric"
              value={puzzleDraft}
              autoFocus
              onChange={(event) => setPuzzleDraft(event.target.value)}
            />
            <div className="fragment-puzzle-yn">
              <button
                type="button"
                onClick={() => {
                  setPuzzleDraft('')
                  setFragmentEvent('vanish')
                }}
              >
                Y
              </button>
              <button
                type="button"
                onClick={() => {
                  addInventoryItem(BROKEN_ROPE_ITEM_ID)
                  setPuzzleDraft('')
                  setFragmentEvent('rope-popup')
                }}
              >
                N
              </button>
            </div>
          </div>
        )}
        {inFragment && fragmentHuntActive && !fragmentHuntComplete && (
          <>
            <FragmentTensionAudio active={inFragment} secondsLeft={fragmentSecondsLeft} />
            <div className="fragment-timer" aria-live="polite">
              <span className="fragment-timer-label">그루미가 돌아오기까지</span>
              <span className="fragment-timer-value">{timerLabel}</span>
            </div>
          </>
        )}
        {inFragment && !fragmentBusy && !pendingFragmentCall && (
          <InventoryBag inventory={inventory} open={bagOpen} onToggle={setBagOpen} />
        )}
        {inOffice && coffeeBriefingDone && coffeeOrder && !coffeeGameDone && (
          <div className="play-hud" style={{ zIndex: 9, pointerEvents: 'none' }}>
            <p>
              {coffeeGame.phase === 'idle' && `다음 주문  ${coffeeOrder.name} · ${coffeeOrder.shots}샷`}
              {coffeeGame.phase === 'brewing' && `추출 중  ${coffeeOrder.name}  ${coffeeGame.currentShots}/${coffeeOrder.shots}`}
              {coffeeGame.phase === 'carrying' && `배달 중: ${coffeeOrder.name} 커피`}
            </p>
          </div>
        )}
        {inOffice && coffeeBriefingDone && coffeeGameDone && !isolPostCoffeeTalked && isolPostCoffeeUnlocked && !staffEvent && (
          <div className="play-hud" style={{ zIndex: 9, pointerEvents: 'none' }}>
            <p>강이솔에게 가세요</p>
          </div>
        )}
        {pendingFragmentCall && (fragmentCallPhase === 'ring' || fragmentCallPhase === 'talk') && (
          <IncomingCallScreen
            caller="그루미"
            phase={fragmentCallPhase === 'talk' ? 'active' : 'incoming'}
            onAccept={() => setFragmentCallPhase('talk')}
          />
        )}
        {pendingFragmentCall && fragmentCallPhase === 'talk' && (
          <VNOverlay
            key={fragmentsTimedOut ? 'groomy-return-timeout' : 'groomy-return-collected'}
            beats={returnCallBeats}
            userName={playerNickname}
            onComplete={() => {
              setFragmentCallPhase(null)
              enterMeetingAfterFragmentCall()
            }}
          />
        )}
        {meetingEvent === 'session' && (
          <VNOverlay
            key="meeting-session"
            beats={MEETING_SESSION_BEATS}
            userName={playerNickname}
            onChoice={(choiceId) => setMeetingChoice(choiceId)}
            onComplete={() => {
              setMeetingEvent(null)
              unlockMeetingWalk()
            }}
          />
        )}
        {meetingEvent === 'door-thought' && (
          <VNOverlay
            key="meeting-door-thought"
            beats={MEETING_DOOR_THOUGHT_BEATS}
            onComplete={() => setMeetingEvent('door-choice')}
          />
        )}
        {meetingEvent === 'door-choice' && (
          <VNOverlay
            key="meeting-door-choice"
            beats={MEETING_DOOR_EXIT_CHOICE_BEATS}
            onChoice={(choiceId) => {
              if (choiceId === 'y') {
                setMeetingEvent(null)
                enterStairwellFromMeeting()
              }
            }}
            onComplete={() => setMeetingEvent(null)}
          />
        )}
        {stairEvent === 'stair-down' && (
          <VNOverlay
            key="stair-down"
            beats={STAIR_DOWN_BLOCKED_BEATS}
            onComplete={() => {
              markStairDownHintDone()
              setStairEvent(null)
            }}
          />
        )}
        {stairEvent === 'corpse-discover' && (
          <VNOverlay
            key="corpse-discover"
            beats={CORPSE_DISCOVER_BEATS}
            userName={playerNickname}
            onComplete={() => {
              setStairEvent(null)
              startCorpseTimer()
            }}
          />
        )}
        {stairEvent === 'corpse-inspect' && (
          <VNOverlay
            key="corpse-inspect"
            beats={CORPSE_INSPECT_BEATS}
            onComplete={() => setStairEvent(null)}
          />
        )}
        {stairEvent === 'corpse-after' && (
          <VNOverlay
            key="corpse-after"
            beats={CORPSE_AFTER_TIMER_BEATS}
            userName={playerNickname}
            onComplete={() => setStairEvent(null)}
          />
        )}
        {(corpseTimerActive || timerGlitch) && inStair && (
          <div className={`fragment-timer${timerGlitch ? ' is-glitch' : ''}`} aria-live="polite">
            <span className="fragment-timer-label">조사</span>
            <span className="fragment-timer-value">{timerGlitch ? '00:00' : corpseTimerLabel}</span>
          </div>
        )}
        <div className="play-fade" style={{ opacity: fade }} />
      </div>
    </div>
  )
}

