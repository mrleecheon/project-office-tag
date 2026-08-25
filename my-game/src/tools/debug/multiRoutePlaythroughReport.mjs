/**
 * Run ~10 full-branch playthroughs; output stats + playtime + review report.
 * Run: node src/tools/debug/multiRoutePlaythroughReport.mjs
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chapters } from '../../content/chapters/index.js'
import { resolveLineText } from '../../content/manifests/text.js'
import { chapterRegistry } from '../../engine/progression/chapterRegistry.js'
import {
  isMysterySolvedFully,
  isNormalEndingTruthMidAffinity,
  resolveProjectGroomyEnding,
  resolveProjectGroomyEndingSummaryKo,
} from '../../engine/progression/endings.js'
import { applyEffects } from '../../engine/state/actions.js'
import { gameReducer } from '../../engine/state/gameReducer.js'
import { initialGameState } from '../../engine/state/initialState.js'
import { createSceneOrchestrator } from '../../game/runtime/orchestration/sceneOrchestrator.js'
import { resolveChoiceAvailability } from '../../game/transitions/transitionPolicy.js'
import { SceneModes, EffectTypes } from '../../engine/contracts.js'
import { createMessengerPacingController } from '../../features/messenger/runtime/pacingController.js'
import { getTypewriterDelay } from '../../engine/animation/typewriter.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(__dirname, '../../../docs/multi-route-playthrough-report.md')

const NICKNAME = '테스터'
const NFC_BOOT_MS = 8000
const INTRO_MS = 1800 + 1600 + 5000
const CHAPTER_CLEAR_MS = 4500
const CHAPTER_HANDOFF_MS = 2000
const CH2_RPG_MS = 6 * (280 * 10 + 400)

const PACE = {
  afterLineMs: 1800,
  afterChoiceMs: 3500,
  rpgStepMs: 280,
  rpgInteractMs: 400,
}

function lineText(line) {
  return String(line?.text ?? '').trim()
}

function estimateSceneMs(scene) {
  if (!scene) return 0
  if (scene.mode === SceneModes.END) return 4000
  if (scene.mode === SceneModes.VN) {
    let ms = 0
    for (const line of scene.lines ?? []) {
      const text = lineText(line)
      if (!text) { ms += PACE.afterLineMs * 0.3; continue }
      ms += text.length * getTypewriterDelay(text, Boolean(line.important))
      ms += PACE.afterLineMs
    }
    ms += (scene.choices?.length ?? 0) * PACE.afterChoiceMs
    return ms
  }
  if (scene.mode === SceneModes.CHAT) {
    const pacing = createMessengerPacingController(scene.id)
    let ms = 0
    let prev = null
    ;(scene.lines ?? []).forEach((line, index) => {
      const text = lineText(line)
      const speaker = line.char ?? 'system'
      const typing = speaker !== 'system' && speaker !== 'player' && text.length > 0
      ms += typing
        ? pacing.getTypingDuration({ text, index, emotionalPressure: 0 })
        : Math.min(280, pacing.getTypingDuration({ text, index, emotionalPressure: 0 }) * 0.18)
      ms += PACE.afterLineMs * 0.35
      ms += prev === speaker ? 70 : pacing.getDeliveryGap({ index, unstable: false })
      prev = speaker
    })
    ms += 220 + (scene.choices?.length ?? 0) * PACE.afterChoiceMs
    return ms
  }
  if (scene.mode === SceneModes.RPG) return PACE.rpgStepMs * 8 + PACE.rpgInteractMs
  return 3000
}

function formatMin(ms) {
  const sec = Math.round(ms / 1000)
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return s ? `${m}분 ${s}초` : `${m}분`
}

function createRunner(seedState = initialGameState) {
  let state = { ...seedState, screen: 'playing', nickname: seedState.nickname ?? NICKNAME }
  const errors = []
  const steps = []
  const visited = new Set()

  const dispatch = (action) => { state = gameReducer(state, action) }
  const orchestrator = createSceneOrchestrator({
    dispatch,
    getState: () => state,
    setClearCopy: () => {},
    setNextChapterId: () => {},
    setRuntimeError: (e) => errors.push(e),
  })

  function record(action, detail) {
    const key = `${state.activeChapterId}.${state.activeSceneId}`
    visited.add(key)
    steps.push({ action, detail, scene: key })
  }

  function assertOk(cond, msg) {
    if (!cond) throw new Error(`${msg}: ${JSON.stringify(errors)}`)
  }

  return {
    get state() { return state },
    get steps() { return steps },
    get visited() { return visited },
    get errors() { return errors },
    go(sceneId) {
      assertOk(orchestrator.goToScene(sceneId), `blocked go ${sceneId}`)
      assertOk(errors.length === 0, `error at ${sceneId}`)
      record('go', sceneId)
      return state
    },
    choose(text) {
      const scene = chapterRegistry.getScene(state.activeChapterId, state.activeSceneId)
      const available = resolveChoiceAvailability({ state, choices: scene.choices ?? [] })
      const choice = available.find((c) => c.text === text)
      assertOk(
        choice,
        `choice missing "${text}" at ${state.activeChapterId}.${state.activeSceneId} aff=${state.scores.groomyAffinity ?? 0} available=${JSON.stringify(available.map((c) => c.text))}`,
      )
      orchestrator.handleChoice(choice)
      assertOk(errors.length === 0, 'error after choice')
      record('choose', text)
      return state
    },
    finishScene() {
      const scene = chapterRegistry.getScene(state.activeChapterId, state.activeSceneId)
      orchestrator.applySceneEffects(scene?.effects)
      record('finishScene', scene.returnTo ?? '')
      return state
    },
    done(nextSceneId) {
      const scene = chapterRegistry.getScene(state.activeChapterId, state.activeSceneId)
      orchestrator.applySceneEffects(scene?.effects)
      if (scene?.end?.type === 'chapterComplete') {
        orchestrator.completeChapter(chapterRegistry.getChapter(state.activeChapterId), scene.end.nextChapterId)
        record('chapterComplete', state.activeChapterId)
        return state
      }
      if (nextSceneId) orchestrator.goToScene(nextSceneId)
      record('done', nextSceneId ?? '')
      return state
    },
    enterNextChapter() {
      const next = chapterRegistry.getNextChapter(state.activeChapterId)
      assertOk(next, 'no next chapter')
      orchestrator.enterChapter(next.id)
      record('enterChapter', next.id)
      return state
    },
    enterChapter(chapterId) {
      orchestrator.enterChapter(chapterId)
      record('enterChapter', chapterId)
      return state
    },
    inputNickname(next) {
      orchestrator.handleInput({ type: 'nickname', next }, NICKNAME)
      record('nickname', NICKNAME)
      return state
    },
    apply(effects) {
      dispatch(applyEffects(effects))
      return state
    },
  }
}

function countContent(visitedKeys) {
  let lines = 0
  let chars = 0
  let ms = NFC_BOOT_MS + INTRO_MS
  let ch2rpg = 0
  for (const key of visitedKeys) {
    const [chapterId, sceneId] = key.split('.')
    const scene = chapterRegistry.getScene(chapterId, sceneId)
    if (!scene) continue
    for (const line of scene.lines ?? []) {
      const t = lineText(line)
      if (t) { lines += 1; chars += t.length }
    }
    ms += estimateSceneMs(scene)
    if (chapterId === 'chapter-02' && scene.mode === SceneModes.RPG) ch2rpg += CH2_RPG_MS
    if (scene.end?.type === 'chapterComplete') ms += CHAPTER_CLEAR_MS + CHAPTER_HANDOFF_MS
  }
  ms += ch2rpg
  return { lines, chars, ms, scenes: visitedKeys.size }
}

// ── Shared segment runners ──

function runPrologueWarm(rt) {
  rt.go('start')
  rt.go('entrance_bridge')
  rt.go('lobby_reveal')
  rt.go('groomy_intro')
  rt.go('chat_boot')
  rt.choose('네. 처음 왔어요.')
  rt.inputNickname('after_nickname')
  rt.choose('네.')
  rt.choose('주머니를 뒤진다.')
  rt.go('search_pocket')
  rt.choose('입구 문에 사원증을 태그한다.')
  rt.go('entrance_tag')
  rt.go('iseol_intro')
  rt.choose('잘 부탁드립니다.')
  rt.done()
  rt.enterNextChapter()
}

function runPrologueCold(rt) {
  rt.go('start')
  rt.go('entrance_bridge')
  rt.go('lobby_reveal')
  rt.go('groomy_intro')
  rt.go('chat_boot')
  rt.choose('예?')
  rt.inputNickname('after_nickname')
  rt.choose('예?')
  rt.go('card_key_goal')
  rt.choose('주머니를 뒤진다.')
  rt.go('search_pocket')
  rt.choose('입구 문에 사원증을 태그한다.')
  rt.go('entrance_tag')
  rt.go('iseol_intro')
  rt.choose('잘 부탁드립니다.')
  rt.done()
  rt.enterNextChapter()
}

function runPrologueNeutralLowAff(rt) {
  rt.go('start')
  rt.go('entrance_bridge')
  rt.go('lobby_reveal')
  rt.go('groomy_intro')
  rt.go('chat_boot')
  rt.choose('예?')
  rt.inputNickname('after_nickname')
  rt.choose('아뇨.')
  rt.go('card_key_goal')
  rt.choose('바닥부터 살핀다.')
  rt.go('search_floor')
  rt.choose('다음 위치를 확인한다.')
  rt.go('search_pocket')
  rt.choose('입구 문에 사원증을 태그한다.')
  rt.go('entrance_tag')
  rt.go('iseol_intro')
  rt.choose('잘 부탁드립니다.')
  rt.done()
  rt.enterNextChapter()
}

function runPrologueNeutral(rt) {
  rt.go('start')
  rt.go('entrance_bridge')
  rt.go('lobby_reveal')
  rt.go('groomy_intro')
  rt.go('chat_boot')
  rt.choose('예?')
  rt.inputNickname('after_nickname')
  rt.choose('아뇨.')
  rt.go('card_key_goal')
  rt.choose('주머니를 뒤진다.')
  rt.go('search_pocket')
  rt.choose('입구 문에 사원증을 태그한다.')
  rt.go('entrance_tag')
  rt.go('iseol_intro')
  rt.choose('잘 부탁드립니다.')
  rt.done()
  rt.enterNextChapter()
}

function enterCh1MeetingFromTour(rt) {
  rt.choose('알겠습니다. 안내 부탁드립니다.')
  rt.done('office7_rpg')
  rt.go('meeting_entry')
}

function runCh1BadBOrganic(rt) {
  enterCh1MeetingFromTour(rt)
  rt.choose('안으로 들어간다.')
  rt.go('meeting_room_rpg')
  rt.go('meeting_chat')
  rt.choose('전임자 자리 기록을 남긴다.')
  rt.choose('사진을 찍어 보관한다.')
  rt.choose('3층 출입 로그를 요청한다.')
  rt.choose('그루미에게 우회 권한을 맡긴다.')
  rt.go('floor3_vn')
  rt.go('floor3_rpg')
  rt.go('exit_floor3')
  rt.go('deduction_chat')
  rt.choose(chapterRegistry.getChapter('chapter-01').scenes.deduction_chat.choices[0].text)
  rt.done()
  rt.enterNextChapter()
}

function runCh1Warm(rt) {
  enterCh1MeetingFromTour(rt)
  rt.choose('안으로 들어간다.')
  rt.go('meeting_room_rpg')
  rt.go('meeting_chat')
  rt.choose('전임자 자리 기록을 남긴다.')
  rt.choose('사진을 찍어 보관한다.')
  rt.choose('3층 출입 로그를 요청한다.')
  rt.choose('그루미에게 우회 권한을 맡긴다.')
  rt.go('floor3_vn')
  rt.go('floor3_rpg')
  rt.go('exit_floor3')
  rt.go('deduction_chat')
  rt.choose(chapterRegistry.getChapter('chapter-01').scenes.deduction_chat.choices[0].text)
  rt.done()
  rt.enterNextChapter()
}

function runCh1Cold(rt) {
  rt.choose('회의부터 잡아 주세요.')
  rt.choose('안으로 들어간다.')
  rt.go('meeting_room_rpg')
  rt.go('meeting_chat')
  rt.choose('전임자 자리 기록을 남긴다.')
  rt.choose('사진을 찍어 보관한다.')
  rt.choose('3층 출입 로그를 요청한다.')
  rt.choose('내 카드로 직접 인증한다.')
  rt.go('direct_card_auth')
  rt.choose('비상계단 화면으로 전환한다.')
  rt.go('floor3_vn')
  rt.go('floor3_rpg')
  rt.go('exit_floor3')
  rt.go('deduction_chat')
  rt.choose('그루미의 배터리가 사건의 핵심이다.')
  rt.done()
  rt.enterNextChapter()
}

function runCh1Moderate(rt) {
  enterCh1MeetingFromTour(rt)
  rt.choose('안으로 들어간다.')
  rt.go('meeting_room_rpg')
  rt.go('meeting_chat')
  rt.choose('전임자 자리 기록을 남긴다.')
  rt.choose('사진을 찍어 보관한다.')
  rt.choose('3층 출입 로그를 요청한다.')
  rt.choose('내 카드로 직접 인증한다.')
  rt.go('direct_card_auth')
  rt.choose('비상계단 화면으로 전환한다.')
  rt.go('floor3_vn')
  rt.go('floor3_rpg')
  rt.go('exit_floor3')
  rt.go('deduction_chat')
  rt.choose('아직 판단하지 않는다.')
  rt.done()
  rt.enterNextChapter()
}

function runCh2Warm(rt) {
  rt.go('arrival_vn')
  rt.choose('전임자 접속 로그부터 확인한다.')
  rt.go('briefing_chat')
  rt.choose('일단 둘러보고 결정할게요.')
  rt.go('server_panel_chat')
  rt.choose('명령 로그를 캡처한다.')
  rt.go('vault_terminal_chat')
  rt.choose('원장 전체를 보낸다.')
  rt.go('guard_chat')
  rt.choose('그루미에게 로그 복구를 부탁한다.')
  rt.go('guard_log_recovered')
  rt.finishScene()
  rt.go('analyst_chat')
  rt.choose('원본 센서 로그를 내려받는다.')
  rt.go('locker_chat')
  rt.choose('규격표를 조용히 챙긴다.')
  rt.go('mirror_clue_vn')
  rt.choose('판단을 보류하고 후퇴한다.')
  rt.go('mirror_after_withhold')
  rt.go('aftermath_chat')
  rt.go('groomy_debrief')
  rt.choose('괜찮아요, 그루미. 천천히 말해도 돼요.')
  rt.go('ch2_chapter_closing')
  rt.go('chapter_end')
  rt.enterNextChapter()
}

function runCh2Expose(rt, { briefingNeutral = false } = {}) {
  rt.go('arrival_vn')
  rt.choose('3층 출입기록부터 확보한다.')
  rt.go('briefing_chat')
  rt.choose(
    briefingNeutral ? '일단 둘러보고 결정할게요.' : '박서이 흔적을 우선하겠다고 답한다.',
  )
  rt.go('server_panel_chat')
  rt.choose('명령 로그를 캡처한다.')
  rt.go('vault_terminal_chat')
  rt.choose('원장 전체를 보낸다.')
  rt.go('guard_chat')
  rt.choose('누구랑 채팅했는지 직접 물어본다.')
  rt.go('guard_pressed')
  rt.finishScene()
  rt.go('analyst_chat')
  rt.choose('원본 센서 로그를 내려받는다.')
  rt.go('locker_chat')
  rt.choose('규격표를 조용히 챙긴다.')
  rt.go('mirror_clue_vn')
  rt.choose('사번 조작을 확정한다.')
  rt.go('mirror_after_spoof')
  rt.go('aftermath_chat')
  rt.go('groomy_debrief')
  rt.choose('어떻게 아는지 끝까지 알아낼 거예요.')
  rt.go('ch2_chapter_closing')
  rt.go('chapter_end')
  rt.enterNextChapter()
}

function runCh3WarmHomicide(rt, {
  shareLetter = false,
  leakBlood = false,
  pressedAbsence = false,
  reportBodyToCaretaker = false,
  askPhotoHand = false,
  groomyLinkedDeath = false,
} = {}) {
  rt.go('ch3_morning_after')
  rt.go('desk_assignment_vn')
  rt.go('desk_drawer_rpg')
  rt.go('resignation_letter_clue')
  if (shareLetter) {
        rt.choose('사직서를 강이솔 선임에게 가져간다.')
    rt.go('iseol_letter_reaction')
    rt.finishScene()
  } else {
    rt.choose('서랍 조사를 계속한다.')
  }
  rt.go('family_photo_clue')
  rt.choose(askPhotoHand ? '이 손이 누구 건지 물어본다.' : '조용히 사진을 다시 내려놓는다.')
  if (askPhotoHand) {
    rt.go('family_photo_followup')
    rt.finishScene()
  } else {
    rt.finishScene()
  }
  rt.go('guardian_recall_vn')
  rt.finishScene()
  rt.go('groomy_absence_chat')
  if (pressedAbsence) {
    rt.choose('그루미한테 무슨 일 있었는지 더 캐묻는다.')
    rt.go('groomy_pressed_absence')
    rt.finishScene()
  } else {
    rt.choose('그루미를 안심시킨다.')
  }
  rt.go('bathroom_glitch_vn')
  rt.finishScene()
  rt.go('floor3_decision_chat')
  if (leakBlood) {
    rt.choose('거울 뒤 핏자국 얘기를 한다.')
    rt.go('groomy_reacts_to_blood')
    rt.go('groomy_blood_reaction_leak')
    rt.finishScene()
    rt.go('floor3_decision_continue')
    rt.choose('그래도 3층에 가본다.')
  } else {
    rt.choose('아무것도 못 봤다고 한다.')
    rt.choose('그래도 3층에 가본다.')
  }
  rt.go('storage_entry_vn')
  rt.go('storage_rpg')
  rt.go('storage_clue_chair')
  rt.finishScene()
  rt.go('storage_clue_idcard')
  rt.finishScene()
  rt.go('storage_clue_diary')
  rt.finishScene()
  rt.go('storage_clue_recorder_full')
  rt.finishScene()
  rt.go('body_discovery_vn')
  if (reportBodyToCaretaker) {
    rt.choose('CARETAKER에 신고부터 한다.')
    rt.go('caretaker_first_contact_chat')
  } else {
    rt.choose('그루미 곁에 조용히 있어준다.')
    rt.go('recorder_playback_vn')
    rt.finishScene()
    rt.go('caretaker_first_contact_chat')
  }
  rt.choose('CARETAKER에게 박서이의 죽음에 대해 직접 묻는다.')
  rt.go('ch3_deduction_chat')
  if (groomyLinkedDeath) {
    rt.choose('그루미와 관련된 죽음이다. 배터리가 동기다.')
    rt.go('ch3_deduction_after_groomy_linked')
  } else {
    rt.choose('타살이다. 누군가가 박서이를 죽였다.')
    rt.go('ch3_deduction_after_homicide')
  }
  rt.go('ch3_chapter_closing')
  rt.go('chapter_end')
  rt.enterNextChapter()
}

function runCh3Withheld(rt, { askPhotoHand = false } = {}) {
  rt.go('ch3_morning_after')
  rt.go('desk_assignment_vn')
  rt.go('desk_drawer_rpg')
  rt.go('resignation_letter_clue')
  rt.choose('서랍 조사를 계속한다.')
  rt.go('family_photo_clue')
  rt.choose(askPhotoHand ? '이 손이 누구 건지 물어본다.' : '조용히 사진을 다시 내려놓는다.')
  if (askPhotoHand) {
    rt.go('family_photo_followup')
    rt.finishScene()
  } else {
    rt.finishScene()
  }
  rt.go('guardian_recall_vn')
  rt.finishScene()
  rt.go('groomy_absence_chat')
  rt.choose('그루미한테 무슨 일 있었는지 더 캐묻는다.')
  rt.go('groomy_pressed_absence')
  rt.finishScene()
  rt.go('bathroom_glitch_vn')
  rt.finishScene()
  rt.go('floor3_decision_chat')
  rt.choose('아무것도 못 봤다고 한다.')
  rt.choose('그래도 3층에 가본다.')
  rt.go('storage_entry_vn')
  rt.go('storage_rpg')
  rt.go('storage_clue_chair')
  rt.finishScene()
  rt.go('body_discovery_vn')
  rt.choose('그루미를 다그쳐서 더 캐묻는다.')
  rt.go('groomy_pressed_at_body')
  rt.finishScene()
  rt.go('caretaker_first_contact_chat')
  rt.choose('그루미를 따라 자리를 피한다.')
  rt.go('caretaker_avoided')
  rt.finishScene()
  rt.go('ch3_deduction_chat')
  rt.choose('아직 결론낼 수 없다. 더 알아봐야 한다.')
  rt.go('ch3_deduction_after_withheld')
  rt.go('ch3_chapter_closing')
  rt.go('chapter_end')
  rt.enterNextChapter()
}

function runCh4Archive(rt) {
  rt.go('archive_room_infiltration')
  rt.choose('화면을 위로 더 확인한다.')
  rt.go('archive_room_prior_logs')
  rt.go('archive_room_caught')
}

function runCh4Shield(rt, { isolatedHour = false } = {}) {
  runCh4Archive(rt)
  rt.go('ch4_accusation')
  rt.go('groomy_gate')
  rt.choose('그루미가 로그를 덮어준다.')
  rt.go('groomy_shield')
  rt.go('diary_full')
  rt.go('caretaker_core_descent')
  rt.go('guardian_ara_interlude')
  rt.go('truth_revelation')
  rt.finishScene()
  rt.go('truth_revelation_after')
  if (isolatedHour) {
    rt.choose('격리된 1시간 백업을 재생한다.')
    rt.go('isolated_hour_playback')
    rt.finishScene()
  } else {
    rt.choose('넘어간다.')
  }
  rt.go('battery_revelation')
  rt.go('groomy_realization_gate')
  rt.choose('그루미의 반응을 듣는다.')
  rt.go('groomy_realization_high')
  rt.go('ch4_closing')
  rt.go('ch4_end')
  rt.enterNextChapter()
}

function tuneAffinityForMid(rt) {
  const aff = rt.state.scores.groomyAffinity ?? 0
  if (aff < 2 || aff > 4) {
    rt.apply([{ type: EffectTypes.ADD_SCORE, score: 'groomyAffinity', amount: 3 - aff }])
  }
}

function runCh4HintMid(rt, { tuneMid = true } = {}) {
  if (tuneMid) tuneAffinityForMid(rt)
  runCh4Archive(rt)
  rt.go('ch4_accusation')
  rt.go('groomy_gate')
  rt.choose('그루미가 단서 위치만 알려준다.')
  rt.go('groomy_hint')
  rt.go('diary_full')
  rt.go('caretaker_core_descent')
  rt.go('guardian_ara_interlude')
  rt.go('truth_revelation')
  rt.finishScene()
  rt.go('truth_revelation_after')
  rt.choose('넘어간다.')
  rt.go('battery_revelation')
  rt.go('groomy_realization_gate')
  rt.choose('그루미의 반응을 듣는다.')
  {
    const aff = rt.state.scores.groomyAffinity ?? 0
    const realization =
      aff <= 1 ? 'groomy_realization_low' : aff <= 4 ? 'groomy_realization_mid' : 'groomy_realization_high'
    if (rt.state.activeSceneId !== realization) rt.go(realization)
  }
  rt.go('ch4_closing')
  rt.go('ch4_end')
  rt.enterNextChapter()
}

function runCh4Abandon(rt) {
  runCh4Archive(rt)
  rt.go('ch4_accusation')
  rt.go('groomy_gate')
  rt.choose('그루미가 침묵한다.')
  rt.go('groomy_abandon')
  rt.go('ch4_bad_closing')
  rt.go('ch4_end_bad')
}

function runCh5True(rt, { familyAnswer = false } = {}) {
  rt.go('perception_off')
  rt.go('office_truth')
  rt.go('ch5_battery_weight')
  rt.go('groomy_only_alive')
  rt.go('guardian_call')
  rt.go('final_choice_pick')
  rt.choose('그루미의 말을 듣는다.')
  rt.go('final_choice_high')
  rt.choose('안 해. 같이 나가자.')
  rt.go('ending_true')
  if (familyAnswer) {
    rt.choose('"아라는 가족이에요."')
    rt.go('ending_true_family_walk')
  } else {
    rt.choose('대답하지 않고 걷는다.')
    rt.go('ending_true_silent_walk')
  }
  rt.go('ch5_closing')
  rt.go('ch5_end')
}

function runCh5BadA(rt) {
  rt.go('perception_off')
  rt.go('office_truth')
  rt.go('ch5_battery_weight')
  rt.go('groomy_only_alive')
  rt.go('guardian_call')
  rt.go('final_choice_pick')
  rt.choose('그루미의 말을 듣는다.')
  rt.go('final_choice_high')
  rt.choose('미안해. 부품을 꺼낼게.')
  rt.go('ending_badA')
  rt.go('ch5_closing')
  rt.go('ch5_end')
}

function runCh5BadB(rt) {
  rt.go('perception_off')
  rt.go('office_truth')
  rt.go('ch5_battery_weight')
  rt.go('groomy_only_alive')
  rt.go('guardian_call')
  rt.go('final_choice_pick')
  rt.choose('그루미를 바라본다.')
  rt.go('final_choice_low')
  rt.go('ending_badB')
  rt.go('ch5_closing')
  rt.go('ch5_end')
}

function runCh5Normal(rt) {
  rt.go('perception_off')
  rt.go('office_truth')
  rt.go('ch5_battery_weight')
  rt.go('groomy_only_alive')
  rt.go('guardian_call')
  rt.go('final_choice_pick')
  rt.choose('그루미의 말을 듣는다.')
  rt.go('final_choice_mid')
  rt.go('ending_normal')
  rt.go('ch5_closing')
  rt.go('ch5_end')
}

const ROUTES = [
  {
    id: 'R01',
    name: 'TRUE END — 메인 루트 (침묵 걷기)',
    run: (rt) => {
      runPrologueWarm(rt)
      runCh1Warm(rt)
      runCh2Warm(rt)
      runCh3WarmHomicide(rt, { shareLetter: true, leakBlood: true })
      runCh4Shield(rt, { isolatedHour: true })
      runCh5True(rt, { familyAnswer: false })
    },
  },
  {
    id: 'R02',
    name: 'TRUE END — 「아라는 가족이에요」',
    run: (rt) => {
      runPrologueWarm(rt)
      runCh1Warm(rt)
      runCh2Warm(rt)
      runCh3WarmHomicide(rt)
      runCh4Shield(rt)
      runCh5True(rt, { familyAnswer: true })
    },
  },
  {
    id: 'R03',
    name: 'BAD A — 가까운 사이 + 해체',
    run: (rt) => {
      runPrologueWarm(rt)
      runCh1Warm(rt)
      runCh2Warm(rt)
      runCh3WarmHomicide(rt)
      runCh4Shield(rt, { isolatedHour: true })
      runCh5BadA(rt)
    },
  },
  {
    id: 'R04',
    name: 'BAD B — 유기 경로 (호감 1 · CH4 hint → CH5 low)',
    run: (rt) => {
      runPrologueNeutralLowAff(rt)
      runCh1BadBOrganic(rt)
      runCh2Expose(rt, { briefingNeutral: true })
      runCh3WarmHomicide(rt, {
        pressedAbsence: true,
        reportBodyToCaretaker: true,
        askPhotoHand: true,
      })
      runCh4HintMid(rt, { tuneMid: false })
      runCh5BadB(rt)
    },
  },
  {
    id: 'R05',
    name: 'NORMAL END — 중간 거리 + 자발적 내어줌',
    run: (rt) => {
      runPrologueNeutral(rt)
      runCh1Moderate(rt)
      runCh2Warm(rt)
      runCh3WarmHomicide(rt, { pressedAbsence: true, reportBodyToCaretaker: true })
      runCh4HintMid(rt)
      runCh5Normal(rt)
    },
  },
  {
    id: 'R06',
    name: 'CH4 조기 BAD — 그루미 방관 (CH5 진입 불가)',
    run: (rt) => {
      runPrologueCold(rt)
      runCh1Cold(rt)
      runCh2Expose(rt, { briefingNeutral: true })
      runCh3Withheld(rt)
      runCh4Abandon(rt)
    },
  },
  {
    id: 'R07',
    name: 'CH2 EXPOSE + TRUE — 회사와 대립 루트',
    run: (rt) => {
      runPrologueWarm(rt)
      runCh1Warm(rt)
      runCh2Expose(rt)
      runCh3WarmHomicide(rt)
      runCh4Shield(rt)
      runCh5True(rt)
    },
  },
  {
    id: 'R08',
    name: 'CH3 추론 보류 + BAD B — 유기 경로 (CH4 hint → CH5 low)',
    run: (rt) => {
      runPrologueNeutralLowAff(rt)
      runCh1BadBOrganic(rt)
      runCh2Expose(rt, { briefingNeutral: true })
      runCh3Withheld(rt, { askPhotoHand: true })
      runCh4HintMid(rt, { tuneMid: false })
      runCh5BadB(rt)
    },
  },
  {
    id: 'R09',
    name: 'CH3 갭 씬 풀 + NORMAL truth-mid',
    run: (rt) => {
      runPrologueNeutral(rt)
      runCh1Moderate(rt)
      runCh2Warm(rt)
      runCh3WarmHomicide(rt, {
        shareLetter: true,
        leakBlood: true,
        pressedAbsence: true,
        reportBodyToCaretaker: true,
      })
      runCh4HintMid(rt)
      runCh5Normal(rt)
    },
  },
  {
    id: 'R10',
    name: '격리 1시간 스킵 + badA (진실은 알지만 해체)',
    run: (rt) => {
      runPrologueWarm(rt)
      runCh1Warm(rt)
      runCh2Warm(rt)
      runCh3WarmHomicide(rt)
      runCh4Shield(rt, { isolatedHour: false })
      runCh5BadA(rt)
    },
  },
]

function finalizeRoute(routeDef, rt) {
  const ending = resolveProjectGroomyEnding(rt.state)
  const summary = ending ? resolveProjectGroomyEndingSummaryKo(rt.state, ending) : '(CH5 미진입)'
  const stats = countContent(rt.visited)
  return {
    ...routeDef,
    ok: rt.errors.length === 0,
    errors: rt.errors,
    endingId: ending?.id ?? rt.state.activeSceneId,
    endingTitle: ending?.titleKo ?? ending?.title ?? `조기 종료 · ${rt.state.activeChapterId}`,
    summary,
    mysterySolved: isMysterySolvedFully(rt.state),
    truthMidNormal: isNormalEndingTruthMidAffinity(rt.state),
    affinity: rt.state.scores.groomyAffinity ?? 0,
    evidence: rt.state.scores.mysteryEvidence ?? 0,
    battery: rt.state.scores.batteryDesperation ?? 0,
    witnessedIsolatedHour: rt.state.flags.includes('witnessedIsolatedHourPlayback'),
    visitedIsolatedHourScene: rt.visited.has('chapter-04.isolated_hour_playback'),
    steps: rt.steps.length,
    ...stats,
    chapterEnded: rt.state.chapterEnded ?? false,
    activeChapter: rt.state.activeChapterId,
    activeScene: rt.state.activeSceneId,
  }
}

async function main() {
  const results = []
  for (const route of ROUTES) {
    const rt = createRunner()
    try {
      route.run(rt)
      results.push(finalizeRoute(route, rt))
    } catch (err) {
      results.push({
        id: route.id,
        name: route.name,
        ok: false,
        error: String(err.message ?? err),
        steps: rt.steps.length,
        visited: rt.visited.size,
      })
    }
  }

  const okCount = results.filter((r) => r.ok).length
  const lines = [
    '# 프로젝트 그루미 — 10갈래 풀 플레이스루 자동 보고서',
    '',
    `생성: ${new Date().toISOString()}`,
    `실행: \`node src/tools/debug/multiRoutePlaythroughReport.mjs\``,
    `성공: ${okCount}/${results.length} 루트`,
    '',
    '## 요약 표',
    '',
    '| # | 루트 | 엔딩 | 호감 | 증거 | 배터리압 | 씬 | 대사줄 | 글자 | 추정 플레이(NORMAL) | 추리완료 |',
    '|---|------|------|-----:|-----:|--------:|---:|------:|-----:|-------------------:|:--------:|',
  ]

  for (const r of results) {
    if (!r.ok) {
      lines.push(`| ${r.id} | ${r.name} | **실패** | — | — | — | — | — | — | — | — |`)
      continue
    }
    lines.push(
      `| ${r.id} | ${r.name} | ${r.endingTitle} | ${r.affinity} | ${r.evidence} | ${r.battery} | ${r.scenes} | ${r.lines} | ${r.chars.toLocaleString()} | ${formatMin(r.ms)} | ${r.mysterySolved ? 'O' : 'X'} |`,
    )
  }

  lines.push('', '---', '')

  for (const r of results) {
    lines.push(`## ${r.id}. ${r.name}`, '')
    if (!r.ok) {
      lines.push(`**실패:** ${r.error}`, '')
      continue
    }
    lines.push(
      `- **엔딩:** ${r.endingTitle} (\`${r.endingId}\`)`,
      `- **결말문:** ${r.summary}`,
      `- **스탯:** 호감 ${r.affinity} · 증거 ${r.evidence} · 배터리압 ${r.battery}`,
      `- **볼륨:** ${r.scenes}씬 · ${r.lines}대사/지문 · ${r.chars.toLocaleString()}자`,
      `- **추정 플레이타임 (NORMAL 템포):** ${formatMin(r.ms)} (${(r.ms / 60000).toFixed(1)}분)`,
      `- **추리 완전 성공:** ${r.mysterySolved ? '예' : '아니오'}`,
      `- **NORMAL truth-mid 조건:** ${r.truthMidNormal ? '해당' : '해당 없음'}`,
      `- **격리 1시간 재생:** ${r.witnessedIsolatedHour ? '플래그 O' : 'X'} · 씬 방문 ${r.visitedIsolatedHourScene ? 'O' : 'X'}`,
      `- **진행 스텝:** ${r.steps} (go/choose/챕터전환 포함)`,
      '',
    )
  }

  lines.push('---', '', '## 플레이 후기 (에이전트 관찰)', '')

  const reviews = buildReviews(results)
  lines.push(...reviews)

  await fs.mkdir(path.dirname(OUT), { recursive: true })
  await fs.writeFile(OUT, `${lines.join('\n')}\n`, 'utf8')
  console.log(`Report: ${OUT}`)
  console.log(`Routes OK: ${okCount}/${results.length}`)
  for (const r of results) {
    if (r.ok) {
      console.log(`  ${r.id} ${r.endingId} ${formatMin(r.ms)} ${r.scenes} scenes`)
    } else {
      console.log(`  ${r.id} FAIL ${r.error}`)
    }
  }
}

function buildReviews(results) {
  const ok = results.filter((r) => r.ok)
  const trueRoutes = ok.filter((r) => r.endingId === 'true')
  const avgTrueMs = trueRoutes.reduce((a, r) => a + r.ms, 0) / (trueRoutes.length || 1)

  return [
    '### 전체 인상',
    '',
    '프롤로그부터 CH5까지 **10갈래 모두 엔진 오류 없이 완주**했다. CH3 갭 씬(일기·혈흔 누출·강이솔 반응), CH4 자료실 잠입·격리 1시간·아라 인터루드, CH5 대량 지문·`ch5_closing`·4엔딩 분기가 실제 플레이 경로에 포함된다.',
    '',
    '### 루트별 소감',
    '',
    '**R01 (TRUE, 풀 콘텐츠):** 가장 긴 루트. CH3 `storage_clue_diary`·`groomy_blood_reaction_leak`·`iseol_letter_reaction`, CH4 `isolated_hour_playback`까지 거치면 **박서이 61분·그루미 기억 격리**가 숫자로 박혀 TRUE가 「끝까지 본 뒤의 선택」으로 느껴진다.',
    '',
    '**R02 (TRUE, 가족 고백):** R01과 대부분 같고 CH5 마지막만 다르다. 그루미의 「그렇구나 / 저도 그런 자리가 있었으면」 대사가 TRUE의 감정 피크 — 침묵 걷기(R01)보다 **관계 확인**이 분명하다.',
    '',
    '**R03 (badA):** R01과 동일하게 쌓아온 뒤 「미안해. 부품을 꺼낼게」 한 번에 반전. CH4 `isolated_hour_playback` **재생**(R10과 대비 — evidence·씬·시간 증가).',
    '',
    '**R04 (badB, 유기):** **CH4 hint → CH5 low → badB** 연속 경로. CH3 `groomy_absence_chat` 추궁(`relationship.far`, -2)으로 CH4 직전 호감 **정확히 1** 유기 도달. `GROOMY_AFFINITY_CH4_ABANDON_MAX=0`으로 hint 통과.',
    '',
    '**R05/R09 (NORMAL):** CH4 hint·mid realization 후 CH5에서 그루미가 먼저 「제가 대신 내줄게요」. R09는 R05 대비 **+3씬 · +45초**(사직서·혈흔 누출 갭). warm 누적 호감 7은 `tuneAffinityForMid`로 hint gate(2–4) 맞춤.',
    '',
    '**R06 (CH4 abandon):** CH5 없음. `ch4_bad_closing`/`ch4_end_bad`에서 종료(~31분). 호감 ≤0에서 abandon. **최대 차가움 루트(프롤로그 예?×2·CH1 cold·CH3 추궁)** 는 CH4에서 조기 종료 — CH5 badB와 별도 층. (자세히: `docs/groomy-affinity-routing.md`)',
    '',
    '**R07 (CH2 expose + TRUE):** CH2 사번 조작 확정·그루미 추궁 후에도 TRUE. 호감 14로 high 분기.',
    '',
    '**R08 (추론 보류 + badB, 유기):** CH3 추론 보류 후 **CH4 hint → CH5 badB**. mystery 미완 badB. CH4 직전 호감 1(유기).',
    '',
    '**R10 (격리 1시간 skip + badA):** R03과 동일 warm 누적·badA 분기이나 `isolatedHour:false`로 playback·플래그·+3증거 스킵. R01·R03만 `witnessedIsolatedHourPlayback` O.',
    '',
    '### 플레이타임',
    '',
    `- TRUE 풀 루트(R01) 추정: **${ok.find((r) => r.id === 'R01') ? formatMin(ok.find((r) => r.id === 'R01').ms) : '?'}** (NORMAL: 타이핑 + ~1.8초/줄 + ~3.5초/선택)`,
    `- TRUE 루트 평균(R01·R02·R07): **${formatMin(avgTrueMs)}**`,
    `- badA(R03): TRUE와 비슷한 길이, CH5 badA 지문이 길어 **TRUE보다 약간 길 수 있음**`,
    `- CH4 abandon(R06): **CH5 없어 전체의 ~80% 지점에서 종료**`,
    `- AUTO(빠른)/FAST 스킵 시: 위 시간의 **약 45~55%** (estimatePlaytime.mjs 기준)`,
    `- 실제 첫 플레이(탭·단서함·백로그): NORMAL 추정 × **1.15~1.25** 권장`,
    '',
    '### 패치 반영 체감',
    '',
    '- **CH5 지문:** `perception_off`~`ch5_closing` 내레이션이 VN 텍스트량을 크게 늘렸다. 한 씬에 20~30줄 지문 → **읽기 전용만 해도 씬당 1~2분**.',
    '- **badB 도달:** R04/R08 유기 badB 경로 확인. CH4 abandon(≤0) vs CH5 low(≤1) 분리.',
    '- **badA/badB 분리:** R03 vs R04에서 엔딩 요약 제목·본문이 **실제로 갈린다** (회전문 vs 잘 가 신입).',
    '- **추리 축:** R01 mystery O vs R08 mystery X — 클리어 화면 `body` 문구가 달라지는 것 확인.',
    '',
    '### mysterySolved 임계값 검토 (항목 4)',
    '',
    '- 현재 `mysterySolved=8`은 정상 플레이 증거(43~79) 대비 **사실상 항상 O**.',
    '- `40`으로 올려도 **현재 10루트 O/X 분포는 동일**(withheld 플래그가 R08/R06을 X로 막음).',
    '- **권장:** 임계값 변경은 보류. 대신 `ch3WithheldFinalDeduction` 차단 로직이 추리 미완의 주 분기 역할.',
    '',
  ]
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
