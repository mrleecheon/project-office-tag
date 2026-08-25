import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Matrix4, MathUtils, Quaternion, Vector3 } from 'three'
import WhiteRoom from '../scenes/WhiteRoom.jsx'
import Office from '../scenes/Office.jsx'
import CoffeeStation, {
  COFFEE_BREW_CAMERA,
  COFFEE_MACHINE_ORIGIN,
  GROOMY_APPROACH_START,
  GROOMY_DELIVERY_POINT,
} from '../scenes/CoffeeStation.jsx'
import PlayerController from '../systems/PlayerController.jsx'
import WorldCanvas from '../systems/WorldCanvas.jsx'
import WorldPrompt from '../systems/WorldPrompt.jsx'
import VNOverlay from '../ui/VNOverlay.jsx'
import { ROOM_GRAPH, useGameState } from '../state/gameStateStore.js'
import {
  CHIP_WAKE_STEP,
  CHOI_STAFF_MONO_BEATS,
  CHOI_STAFF_VN_BEATS,
  GROOMY_CHIP_GUIDE_BEATS,
  GROOMY_OFFICE_NUDGE_BEATS,
  ISOL_STAFF_BEATS,
  KANG_ISOL_COFFEE_BEATS_PART1,
  KANG_ISOL_COFFEE_BEATS_PART2,
  KANG_ISOL_COFFEE_NUDGE_BEATS,
  KIM_STAFF_BEATS,
  OFFICE_CHIP_MONOLOGUE_BEATS,
} from '../runtime/productFlow.js'
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
    if (playing) progress.current = Math.min(1, progress.current + delta * 0.32)
    const t = progress.current
    const a = GROOMY_APPROACH_START
    const b = GROOMY_DELIVERY_POINT
    group.current.position.set(
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    )
  })
  return (
    <group ref={group}>
      <mesh userData={{ interactId: 'coffee-groomy', interactReach: 2.2 }}>
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
  const startOfficeCoffeeBrewing = useGameState((s) => s.startOfficeCoffeeBrewing)
  const pourCoffeeShot = useGameState((s) => s.pourCoffeeShot)
  const beginChoiOfficeTalkline = useGameState((s) => s.beginChoiOfficeTalkline)
  const clearChipWakeResume = useGameState((s) => s.clearChipWakeResume)

  const [blinkOn, setBlinkOn] = useState(true)
  const [looking, setLooking] = useState(false)
  const [phoneUp, setPhoneUp] = useState(false)
  const [guideTalk, setGuideTalk] = useState(false)
  const [guideTalked, setGuideTalked] = useState(false)
  const [officeTalk, setOfficeTalk] = useState(!chipOfficeIntroDone)
  const [staffEvent, setStaffEvent] = useState(null)
  const officeMeta = ROOM_GRAPH.office
  const choiBoot = new URLSearchParams(window.location.search).has('choi')
  const officeSpawn = choiBoot ? [2.55, 1.6, 1.85] : officeMeta.spawn
  const inOffice = chipWakeStep === CHIP_WAKE_STEP.OFFICE
  const inGuide = chipWakeStep === CHIP_WAKE_STEP.GUIDE_3D
  const coffeeCam = staffEvent === 'isol-coffee-cam'
  const walking = ((inGuide && !guideTalk) || (inOffice && !officeTalk && !phoneUp && !staffEvent))
  const inputMode = walking ? '3d' : 'vn'
  const machineLook = [
    COFFEE_MACHINE_ORIGIN[0] + 0.35,
    1.12,
    COFFEE_MACHINE_ORIGIN[2],
  ]

  const maybeGroomyNudge = useCallback(() => {
    const state = useGameState.getState()
    if (state.groomyOfficeNudgeDone) return
    if (!state.isolTalked || !state.kimTalked || !state.choiTalked) return
    window.setTimeout(() => setStaffEvent('groomy'), 450)
  }, [])

  useEffect(() => {
    if (!coffeeCam) return undefined
    const id = window.setTimeout(() => {
      markCoffeeBriefingDone()
      setStaffEvent(null)
    }, 2600)
    return () => window.clearTimeout(id)
  }, [coffeeCam, markCoffeeBriefingDone])

  useEffect(() => {
    if (!officeAfterMorning || coffeeMachineVisited) return undefined
    if (lookId === 'coffee-button' || lookId === 'coffee-deliver') markCoffeeMachineVisited()
    return undefined
  }, [officeAfterMorning, coffeeMachineVisited, lookId, markCoffeeMachineVisited])

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
      if (inGuide && lookId === 'groomy-guide' && !guideTalked) {
        setGuideTalk(true)
        return
      }
      if (inGuide && lookId === 'black-door' && guideTalked) enterChipOffice()
      if (!inOffice) return
      if (lookId === 'staff-isol') {
        if (officeAfterMorning) {
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
      if (lookId === 'coffee-button' || lookId === 'coffee-deliver') {
        if (coffeeGame.phase === 'brewing') {
          pourCoffeeShot()
        }
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
    lookId,
    guideTalked,
    isolTalked,
    kimTalked,
    choiTalked,
    coffeeBriefingDone,
    coffeeMachineVisited,
    officeAfterMorning,
    coffeeGame.phase,
    enterChipOffice,
    beginKangIsolMorning,
    startOfficeCoffeeBrewing,
    pourCoffeeShot,
  ])

  useEffect(() => {
    if (inGuide && !guideTalk) {
      if (!guideTalked) {
        setHint(lookId === 'groomy-guide' ? 'E  말 걸기' : '그루미에게 가세요.')
      } else {
        setHint(lookId === 'black-door' ? 'E  검은 문으로 나간다' : '검은 문으로 나가세요.')
      }
    }
    if (inOffice && !officeTalk && !staffEvent && !phoneUp) {
      if (officeAfterMorning) {
        if (lookId === 'staff-isol') setHint('E  말 걸기')
        else if (lookId === 'staff-kim' || lookId === 'staff-choi') setHint('...이 자리가 아닌 것 같다.')
        else if ((lookId === 'coffee-button' || lookId === 'coffee-deliver') && coffeeGame.phase === 'brewing') {
          setHint('E  추출')
        } else setHint('')
      } else if (lookId === 'staff-isol') setHint(isolTalked ? '이미 대화함' : 'E  말 걸기')
      else if (lookId === 'staff-kim') setHint(kimTalked ? '이미 대화함' : 'E  말 걸기')
      else if (lookId === 'staff-choi') setHint(choiTalked ? '이미 대화함' : 'E  말 걸기')
      else if (lookId === 'sit-desk') setHint('E  자리에 앉는다')
      else setHint('책상과 의자로 가세요.')
    }
  }, [
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
    coffeeGame.phase,
    setHint,
  ])

  return (
    <div className="opening-stage">
      <div className="opening-frame">
        <div className={`opening-canvas ${inputMode === 'vn' ? 'is-vn' : 'is-3d'}`}>
          <WorldCanvas camera={{ fov: 70, position: inOffice ? officeSpawn : WHITE_SPAWN }}>
            <Suspense fallback={null}>
              {inOffice ? (
                <>
                  <Office />
                  <SitTrigger />
                  <StaffTrigger id="staff-isol" position={[3.1, 0.8, -0.55]} />
                  <StaffTrigger id="staff-kim" position={[-3.1, 0.8, 0.75]} />
                  <StaffTrigger id="staff-choi" position={[3.1, 0.8, 0.75]} />
                  {officeAfterMorning && (
                    <>
                      <CoffeeStation
                        origin={COFFEE_MACHINE_ORIGIN}
                        lookId={lookId}
                        phase={coffeeGame.phase}
                        order={coffeeGame.orders[coffeeGame.currentOrderIndex] ?? null}
                        shots={coffeeGame.currentShots}
                        showPrompt={coffeeGame.phase === 'brewing'}
                      />
                      <GroomyApproach playing />
                    </>
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
              ) : (
                <>
                  <WhiteRoom />
                  {inGuide && (
                    <>
                      <GroomyBlob />
                      <BlackOfficeDoor />
                    </>
                  )}
                </>
              )}
            </Suspense>
            <PlayerController
              key={inOffice ? 'office' : 'white'}
              bounds={inOffice ? officeMeta.bounds : WHITE_BOUNDS}
              spawn={inOffice ? officeSpawn : WHITE_SPAWN}
            />
            <LookAround active={looking} onDone={finishLook} />
            {walking && hint && (
              <WorldPrompt
                position={
                  lookId === 'groomy-guide' || (inGuide && !guideTalked)
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
            autoAdvanceMs={2000}
            onComplete={() => {
              setStaffEvent('isol-coffee-part2')
            }}
          />
        )}
        {staffEvent === 'isol-coffee-part2' && (
          <VNOverlay
            key="isol-coffee-part2"
            beats={KANG_ISOL_COFFEE_BEATS_PART2}
            autoAdvanceMs={2000}
            onComplete={() => {
              startOfficeCoffeeBrewing()
              markCoffeeBriefingDone()
              setStaffEvent('isol-coffee-cam')
            }}
          />
        )}
        {staffEvent === 'isol-coffee-nudge' && (
          <VNOverlay
            key="isol-coffee-nudge"
            beats={KANG_ISOL_COFFEE_NUDGE_BEATS}
            autoAdvanceMs={2000}
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
        <div className="play-fade" style={{ opacity: fade }} />
      </div>
    </div>
  )
}

