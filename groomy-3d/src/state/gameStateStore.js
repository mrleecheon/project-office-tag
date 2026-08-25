import { create } from 'zustand'
import { saveService } from '@groomy/game/engine/save/saveService.js'
import { OFFICE_INSPECT_IDS, POST_INVESTIGATION_STAGE, PRODUCT_PHASE } from '../runtime/productFlow.js'

export const ROOM_ORDER = ['lobby', 'corridor', 'meetingRoom', 'serverRoom', 'stairwell', 'groomyRoom']

export const ROOM_GRAPH = {
  lobby: {
    id: 'lobby',
    prevRoom: null,
    nextRoom: 'corridor',
    size: [20, 3.4, 20],
    spawn: [0, 1.6, 2.4],
    bounds: { minX: -9.2, maxX: 9.2, minZ: -10.4, maxZ: 9.2 },
    blockMinZ: -8.55,
    hint: '로비.',
  },
  corridor: {
    id: 'corridor',
    prevRoom: 'lobby',
    nextRoom: 'office',
    size: [8, 3.4, 18],
    spawn: [0, 1.6, 6.5],
    bounds: { minX: -3.5, maxX: 3.5, minZ: -9.4, maxZ: 8.4 },
    blockMinZ: -7.2,
    hint: '복도. 형광등이 너무 균일하다.',
  },
  office: {
    id: 'office',
    prevRoom: 'corridor',
    nextRoom: 'meetingRoom',
    size: [14, 3.4, 12],
    spawn: [0, 1.6, 4.4],
    bounds: { minX: -6.4, maxX: 6.4, minZ: -5.4, maxZ: 5.5 },
    blockMinZ: null,
    hint: '사무실.',
  },
  meetingRoom: {
    id: 'meetingRoom',
    prevRoom: 'office',
    nextRoom: 'serverRoom',
    size: [12, 3.4, 12],
    spawn: [0, 1.6, 4.2],
    bounds: { minX: -5.5, maxX: 5.5, minZ: -5.6, maxZ: 5.5 },
    blockMinZ: -4.3,
    hint: '회의실. 공기가 멈춘 것 같다.',
  },
  serverRoom: {
    id: 'serverRoom',
    prevRoom: 'meetingRoom',
    nextRoom: 'stairwell',
    size: [10, 3.4, 12],
    spawn: [0, 1.6, 4],
    bounds: { minX: -4.5, maxX: 4.5, minZ: -5.6, maxZ: 5.5 },
    blockMinZ: -4.3,
    hint: '서버실. TODO 조사 콘텐츠',
  },
  stairwell: {
    id: 'stairwell',
    prevRoom: 'serverRoom',
    nextRoom: 'groomyRoom',
    size: [8, 3.4, 10],
    spawn: [0, 1.6, 3.2],
    bounds: { minX: -3.5, maxX: 3.5, minZ: -4.6, maxZ: 4.5 },
    blockMinZ: -3.3,
    hint: '계단. TODO 조사 콘텐츠',
  },
  groomyRoom: {
    id: 'groomyRoom',
    prevRoom: 'stairwell',
    nextRoom: null,
    size: [10, 3.4, 10],
    spawn: [0, 1.6, 3.2],
    bounds: { minX: -4.5, maxX: 4.5, minZ: -4.6, maxZ: 4.5 },
    blockMinZ: null,
    hint: '그루미의 방. TODO 조사 콘텐츠',
  },
}

const ruin = {
  floor: '#3a342e',
  wall: '#2d2925',
  ceil: '#2a2622',
  bg: '#12100e',
  light: '#c9b48a',
  hemiTop: '#6a645c',
  hemiBot: '#1a1612',
}

const ar = {
  floor: '#e8eef4',
  wall: '#f3f6f8',
  ceil: '#ffffff',
  bg: '#d8e4ee',
  light: '#ffffff',
  hemiTop: '#eef5ff',
  hemiBot: '#b8c8d8',
}

export const SKINS = { ruin, ar }
SKINS.ruin = ruin

export const useGameState = create((set, get) => ({
  hasKey: false,
  arFilterOn: false,
  doorOpen: false,
  doorAnimating: false,
  currentRoom: 'lobby',
  exitOpen: {},
  exitAnimating: {},
  lookId: null,
  hint: '머리가 너무 아파.',
  handoff2d: false,
  introPhase: PRODUCT_PHASE.TITLE,
  talklineSkipLoad: true,
  inputMode: '3d',
  fade: 0,
  rightEyeHold: false,
  foundHints: [],
  debugProbe: { lookId: null, via: 'none', locked: false, x: 0, z: 0 },
  inventory: [],
  officeInspected: {},
  atePork: null,
  exploreStart: 'corridor',
  scriptedWalk: false,
  passageDone: false,
  playerNickname: '',
  postInvestigationStage: null,
  talklineChapterId: null,
  talklineSceneId: null,
  chipWakeStep: null,
  isolTalked: false,
  kimTalked: false,
  choiTalked: false,
  groomyOfficeNudgeDone: false,
  chipOfficeIntroDone: false,
  chipWakeResume: null,
  officeAfterMorning: false,
  coffeeBriefingDone: false,
  coffeeMachineVisited: false,
  coffeeGame: {
    orders: [
      { name: '팀장님', shots: 2 },
      { name: '대리님', shots: 1 },
      { name: '그루미', shots: 5 },
    ],
    currentOrderIndex: 0,
    currentShots: 0,
    phase: 'idle',
  },

  setInputMode: (inputMode) => set({ inputMode }),
  setLookId: (lookId) => set({ lookId }),
  setHint: (hint) => set({ hint }),
  setRightEyeHold: (rightEyeHold) => set({ rightEyeHold }),
  setDebugProbe: (debugProbe) => {
    const prev = get().debugProbe
    if (
      prev
      && prev.lookId === debugProbe.lookId
      && prev.via === debugProbe.via
      && prev.locked === debugProbe.locked
      && prev.x === debugProbe.x
      && prev.z === debugProbe.z
    ) {
      return
    }
    set({ debugProbe })
  },

  isExitOpen: (roomId) => {
    if (roomId === 'lobby') return get().doorOpen
    return Boolean(get().exitOpen[roomId])
  },

  pickupKey: () => {
    if (get().hasKey) return
    set({ hasKey: true, hint: '전임자 사원증을 주웠다. 문에 태그해야 한다.' })
  },

  tagReader: () => {
    const { hasKey, arFilterOn } = get()
    if (!hasKey) {
      set({ hint: '카드키가 없다. 책상 아래를 보자.' })
      return
    }
    if (arFilterOn) return
    set({
      arFilterOn: true,
      doorAnimating: true,
      hint: '삑ㅡ 문이 반응한다.',
    })
  },

  finishDoorOpen: () => {
    if (get().doorOpen) return
    set({
      doorOpen: true,
      doorAnimating: false,
      hint: '문이 열렸다. 안으로 들어가자.',
    })
  },

  startExitOpen: (roomId) => {
    if (roomId === 'lobby') return
    if (get().exitOpen[roomId] || get().exitAnimating[roomId]) return
    set({
      exitAnimating: { ...get().exitAnimating, [roomId]: true },
      hint: '문이 열린다.',
    })
  },

  finishExitOpen: (roomId) => {
    if (get().exitOpen[roomId]) return
    set({
      exitOpen: { ...get().exitOpen, [roomId]: true },
      exitAnimating: { ...get().exitAnimating, [roomId]: false },
      hint: '문이 열렸다.',
    })
  },

  goToRoom: (nextId) => {
    const { currentRoom, fade, handoff2d, introPhase } = get()
    if (currentRoom === nextId) return
    if (introPhase === 'intro' && nextId === 'corridor') return
    if (introPhase !== 'explore' && nextId === 'corridor' && (handoff2d || fade === 1)) return
    if (introPhase === 'explore' && nextId === 'meetingRoom') return
    if (introPhase === 'explore' && currentRoom === 'corridor' && nextId === 'office' && !get().passageDone) {
      if (get().scriptedWalk) return
      set({ scriptedWalk: true, hint: '안쪽 통로를 지나간다.' })
      return
    }
    const meta = ROOM_GRAPH[currentRoom]
    if (meta.nextRoom !== nextId) return
    if (introPhase !== 'explore' && nextId === 'corridor') {
      document.exitPointerLock?.()
      set({ fade: 1 })
      window.setTimeout(() => set({ handoff2d: true }), 80)
      return
    }
    set({ fade: 1 })
    window.setTimeout(() => {
      set({
        currentRoom: nextId,
        fade: 0,
        lookId: null,
        hint: ROOM_GRAPH[nextId].hint,
      })
    }, 300)
  },

  enterCorridor: () => get().goToRoom('corridor'),

  beginWhiteRoom: () => {
    document.exitPointerLock?.()
    set({ introPhase: 'whiteRoom', fade: 0, lookId: null, hint: '백지를 확인하자.' })
  },

  beginIntroFromTitle: () => {
    document.exitPointerLock?.()
    set({
      introPhase: PRODUCT_PHASE.INTRO,
      talklineSkipLoad: true,
      talklineChapterId: null,
      talklineSceneId: null,
      hasKey: false,
      arFilterOn: false,
      doorOpen: false,
      doorAnimating: false,
      currentRoom: 'lobby',
      fade: 0,
      lookId: null,
      handoff2d: false,
      inputMode: '3d',
      hint: '',
    })
  },

  beginContinueFromSave: (slotId) => {
    const slots = saveService.listSlots()
    const autosave = saveService.load()
    const saved = slotId
      ? saveService.loadSlot(slotId)
      : autosave ?? (slots[0] ? saveService.loadSlot(slots[0].slotId) : null)
    if (!saved) return
    document.exitPointerLock?.()
    const useAutosave = Boolean(autosave) && !slotId
    set({
      introPhase: PRODUCT_PHASE.TALKLINE,
      talklineSkipLoad: false,
      talklineChapterId: useAutosave ? null : saved.activeChapterId ?? null,
      talklineSceneId: useAutosave ? null : saved.activeSceneId ?? null,
      playerNickname: saved.nickname || get().playerNickname,
      handoff2d: true,
      fade: 0,
    })
  },

  beginTalkline: () => {
    document.exitPointerLock?.()
    set({ introPhase: 'talkline', talklineSkipLoad: true, handoff2d: true, fade: 0 })
  },

  beginExplore: () => {
    document.exitPointerLock?.()
    const nickname = saveService.load()?.nickname || get().playerNickname
    set({
      introPhase: 'explore',
      currentRoom: 'corridor',
      arFilterOn: true,
      inputMode: '3d',
      fade: 0,
      handoff2d: false,
      lookId: null,
      exitOpen: { corridor: true },
      hint: '복도를 지나 안으로 들어가자.',
      inventory: [],
      officeInspected: {},
      atePork: null,
      exploreStart: 'corridor',
      scriptedWalk: false,
      passageDone: false,
      playerNickname: nickname,
      postInvestigationStage: null,
      talklineChapterId: null,
      talklineSceneId: null,
    })
  },

  beginOfficeInspect: () => {
    document.exitPointerLock?.()
    set({
      introPhase: 'explore',
      currentRoom: 'office',
      arFilterOn: true,
      inputMode: '3d',
      fade: 0,
      handoff2d: false,
      lookId: null,
      exitOpen: { corridor: true },
      hint: ROOM_GRAPH.office.hint,
      inventory: [],
      officeInspected: {},
      atePork: null,
      exploreStart: 'office-free',
      scriptedWalk: false,
      passageDone: true,
    })
  },

  beginPostInspect: ({ atePork = false, nickname } = {}) => {
    document.exitPointerLock?.()
    const inspected = Object.fromEntries(OFFICE_INSPECT_IDS.map((id) => [id, true]))
    const playerNickname = nickname || saveService.load()?.nickname || get().playerNickname || '테스터'
    set({
      introPhase: 'explore',
      currentRoom: 'office',
      arFilterOn: true,
      inputMode: 'vn',
      fade: 0,
      handoff2d: false,
      lookId: null,
      exitOpen: { corridor: true },
      hint: '',
      inventory: ['calendar', 'wallet', 'nail'],
      officeInspected: inspected,
      atePork,
      exploreStart: 'post-inspect',
      scriptedWalk: false,
      passageDone: true,
      playerNickname,
      postInvestigationStage: POST_INVESTIGATION_STAGE.INVESTIGATION_COMPLETE,
      talklineChapterId: null,
      talklineSceneId: null,
    })
  },

  addInventoryItem: (id) => {
    if (get().inventory.includes(id)) return
    set({ inventory: [...get().inventory, id] })
  },

  markOfficeInspected: (id) => {
    if (get().officeInspected[id]) return
    set({ officeInspected: { ...get().officeInspected, [id]: true } })
  },

  setAtePork: (atePork) => set({ atePork }),

  setPostInvestigationStage: (postInvestigationStage) => set({ postInvestigationStage }),

  beginOnboardingChannel: () => {
    document.exitPointerLock?.()
    set({
      introPhase: 'chipWake',
      inputMode: 'vn',
      fade: 0,
      handoff2d: false,
      currentRoom: 'chipWhite',
      lookId: null,
      hint: '',
      postInvestigationStage: POST_INVESTIGATION_STAGE.ONBOARDING_CHANNEL,
      chipWakeStep: 'blink',
      talklineChapterId: null,
      talklineSceneId: null,
      isolTalked: false,
      kimTalked: false,
      choiTalked: false,
      groomyOfficeNudgeDone: false,
      chipOfficeIntroDone: false,
      chipWakeResume: null,
      officeAfterMorning: false,
      coffeeBriefingDone: false,
      coffeeMachineVisited: false,
      coffeeGame: {
        orders: [
          { name: '팀장님', shots: 2 },
          { name: '대리님', shots: 1 },
          { name: '그루미', shots: 5 },
        ],
        currentOrderIndex: 0,
        currentShots: 0,
        phase: 'idle',
      },
    })
  },

  setChipWakeStep: (chipWakeStep) => set({ chipWakeStep }),

  beginChipWakeTalkline: () => {
    document.exitPointerLock?.()
    set({
      introPhase: 'talkline',
      talklineSkipLoad: true,
      chipWakeStep: 'talkline',
      inputMode: 'vn',
      talklineChapterId: 'chapter-01',
      talklineSceneId: 'wake_groomy_1',
    })
  },

  beginChipWakeGuideChoice: () => {
    document.exitPointerLock?.()
    set({
      introPhase: 'talkline',
      talklineSkipLoad: true,
      chipWakeStep: 'talkline',
      inputMode: 'vn',
      talklineChapterId: 'chapter-01',
      talklineSceneId: 'wake_groomy_2',
    })
  },

  beginChipWakeGuide: () => {
    set({
      introPhase: 'chipWake',
      chipWakeStep: 'guide3d',
      inputMode: '3d',
      currentRoom: 'chipWhite',
      lookId: null,
      hint: '',
      talklineChapterId: null,
      talklineSceneId: null,
    })
  },

  enterChipOffice: () => {
    document.exitPointerLock?.()
    set({
      chipWakeStep: 'office',
      inputMode: 'vn',
      currentRoom: 'office',
      lookId: null,
      hint: '',
      fade: 1,
    })
    window.setTimeout(() => set({ fade: 0 }), 280)
  },

  beginIsolDeskTalk: () => {
    document.exitPointerLock?.()
    set({
      introPhase: 'talkline',
      talklineSkipLoad: true,
      inputMode: 'vn',
      fade: 0,
      handoff2d: true,
      chipWakeStep: 'isolTalk',
      talklineChapterId: 'chapter-01',
      talklineSceneId: 'isol_desk_hello',
    })
  },

  beginKangIsolMorning: () => {
    document.exitPointerLock?.()
    set({
      introPhase: PRODUCT_PHASE.KANG_ISOL_MORNING,
      inputMode: 'phone',
      fade: 0,
      handoff2d: true,
      chipWakeStep: 'isolMorning',
      talklineChapterId: null,
      talklineSceneId: null,
      lookId: null,
      hint: '',
    })
  },

  returnFromKangIsolMorning: () => {
    document.exitPointerLock?.()
    set({
      introPhase: PRODUCT_PHASE.CHIP_WAKE,
      chipWakeStep: 'office',
      inputMode: '3d',
      currentRoom: 'office',
      talklineChapterId: null,
      talklineSceneId: null,
      lookId: null,
      hint: '',
      fade: 0,
      handoff2d: false,
      officeAfterMorning: true,
      chipOfficeIntroDone: true,
      coffeeGame: {
        ...get().coffeeGame,
        currentShots: 0,
        phase: 'idle',
      },
    })
  },

  startOfficeCoffeeBrewing: () => {
    const { coffeeGame } = get()
    set({
      coffeeGame: {
        ...coffeeGame,
        currentShots: 0,
        phase: 'brewing',
      },
    })
  },

  startCoffeeBrewing: () => {
    const { coffeeGame } = get()
    const order = coffeeGame.orders[coffeeGame.currentOrderIndex]
    if (!order || coffeeGame.phase !== 'idle') return
    set({
      coffeeGame: {
        ...coffeeGame,
        currentShots: 0,
        phase: 'brewing',
      },
    })
  },

  pourCoffeeShot: () => {
    const { coffeeGame } = get()
    const order = coffeeGame.orders[coffeeGame.currentOrderIndex]
    if (!order || coffeeGame.phase !== 'brewing') return
    if (coffeeGame.currentShots >= order.shots) return
    const currentShots = coffeeGame.currentShots + 1
    set({
      coffeeGame: {
        ...coffeeGame,
        currentShots,
        phase: currentShots >= order.shots ? 'carrying' : 'brewing',
      },
    })
  },

  deliverCoffeeOrder: (recipient) => {
    const { coffeeGame } = get()
    const order = coffeeGame.orders[coffeeGame.currentOrderIndex]
    if (!order || coffeeGame.phase !== 'carrying') return
    if (coffeeGame.currentShots !== order.shots) return
    if (recipient && recipient !== order.name) return
    set({
      coffeeGame: {
        ...coffeeGame,
        currentOrderIndex: coffeeGame.currentOrderIndex + 1,
        currentShots: 0,
        phase: 'idle',
      },
    })
  },

  resetCoffeeGame: () => {
    set({
      coffeeGame: {
        orders: [
          { name: '팀장님', shots: 2 },
          { name: '대리님', shots: 1 },
          { name: '그루미', shots: 5 },
        ],
        currentOrderIndex: 0,
        currentShots: 0,
        phase: 'idle',
      },
    })
  },

  setChipOfficeIntroDone: () => set({ chipOfficeIntroDone: true }),

  markCoffeeBriefingDone: () => set({ coffeeBriefingDone: true }),

  markCoffeeMachineVisited: () => set({ coffeeMachineVisited: true }),

  markStaffTalked: (who) => {
    if (who === 'isol') set({ isolTalked: true })
    if (who === 'kim') set({ kimTalked: true })
    if (who === 'choi') set({ choiTalked: true })
  },

  markGroomyOfficeNudgeDone: () => set({ groomyOfficeNudgeDone: true }),

  beginChipOfficeAtChoi: () => {
    document.exitPointerLock?.()
    set({
      introPhase: PRODUCT_PHASE.CHIP_WAKE,
      chipWakeStep: 'office',
      inputMode: '3d',
      currentRoom: 'office',
      chipOfficeIntroDone: true,
      isolTalked: true,
      kimTalked: true,
      choiTalked: false,
      officeAfterMorning: false,
      lookId: null,
      hint: '',
      fade: 0,
      talklineChapterId: null,
      talklineSceneId: null,
    })
  },

  beginChoiOfficeTalkline: () => {
    document.exitPointerLock?.()
    set({
      introPhase: 'talkline',
      talklineSkipLoad: true,
      chipWakeStep: 'choiTalkline',
      inputMode: 'vn',
      talklineChapterId: 'chapter-01',
      talklineSceneId: 'choi_office_talk',
    })
  },

  returnChipOfficeAfterChoi: () => {
    document.exitPointerLock?.()
    set({
      introPhase: 'chipWake',
      chipWakeStep: 'office',
      inputMode: 'vn',
      currentRoom: 'office',
      chipOfficeIntroDone: true,
      chipWakeResume: 'choiMono',
      talklineChapterId: null,
      talklineSceneId: null,
      lookId: null,
      hint: '',
      fade: 0,
    })
  },

  clearChipWakeResume: () => set({ chipWakeResume: null }),

  finishPassage: () => {
    if (!get().scriptedWalk && get().passageDone) return
    set({ fade: 1, scriptedWalk: false, passageDone: true })
    window.setTimeout(() => get().goToRoom('office'), 280)
  },

  addFoundHint: (id, text) => {
    if (get().foundHints.includes(id)) {
      set({ hint: text })
      return
    }
    set({ foundHints: [...get().foundHints, id], hint: text })
  },
}))

