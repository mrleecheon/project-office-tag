import assert from 'node:assert/strict'
import { chapterRegistry } from '../engine/progression/chapterRegistry.js'
import { resolveProjectGroomyEnding } from '../engine/progression/endings.js'
import { gameReducer } from '../engine/state/gameReducer.js'
import { initialGameState } from '../engine/state/initialState.js'
import { applyEffects } from '../engine/state/actions.js'
import { createSceneOrchestrator } from '../game/runtime/orchestration/sceneOrchestrator.js'
import { resolveChoiceAvailability } from '../game/transitions/transitionPolicy.js'
import { chapters } from '../content/chapters/index.js'

assert.deepEqual(
  chapters.map((chapter) => chapter.id),
  ['prologue', 'chapter-01', 'chapter-02', 'chapter-03', 'chapter-04', 'chapter-05'],
)

function createRuntime(seedState = initialGameState) {
  let state = { ...seedState, screen: 'playing' }
  const errors = []
  const dispatch = (action) => {
    state = gameReducer(state, action)
  }
  const orchestrator = createSceneOrchestrator({
    dispatch,
    getState: () => state,
    setClearCopy: () => {},
    setNextChapterId: () => {},
    setRuntimeError: (error) => errors.push(error),
  })
  return {
    get state() {
      return state
    },
    errors,
    dispatch,
    orchestrator,
    go(sceneId) {
      const ok = orchestrator.goToScene(sceneId)
      assert.equal(ok, true, `blocked at ${state.activeChapterId}.${sceneId}: ${JSON.stringify(errors)}`)
      assert.equal(errors.length, 0, `runtime error at ${sceneId}: ${JSON.stringify(errors)}`)
      return state
    },
    choose(choiceText) {
      const scene = chapterRegistry.getScene(state.activeChapterId, state.activeSceneId)
      const available = resolveChoiceAvailability({ state, choices: scene.choices ?? [] })
      const choice = available.find((entry) => entry.text === choiceText)
      assert.ok(choice, `choice not available "${choiceText}" in ${state.activeChapterId}.${state.activeSceneId}`)
      orchestrator.handleChoice(choice)
      assert.equal(errors.length, 0, `runtime error after choice: ${JSON.stringify(errors)}`)
      return state
    },
    finishScene() {
      const scene = chapterRegistry.getScene(state.activeChapterId, state.activeSceneId)
      orchestrator.applySceneEffects(scene?.effects)
      return state
    },
    done(nextSceneId) {
      const scene = chapterRegistry.getScene(state.activeChapterId, state.activeSceneId)
      orchestrator.applySceneEffects(scene?.effects)
      if (scene?.end?.type === 'chapterComplete') {
        orchestrator.completeChapter(
          chapterRegistry.getChapter(state.activeChapterId),
          scene.end.nextChapterId,
        )
        return state
      }
      if (nextSceneId) orchestrator.goToScene(nextSceneId)
      return state
    },
    enterNextChapter() {
      const next = chapterRegistry.getNextChapter(state.activeChapterId)
      assert.ok(next, `no next chapter after ${state.activeChapterId}`)
      orchestrator.enterChapter(next.id)
      return state
    },
    apply(effects) {
      dispatch(applyEffects(effects))
      return state
    },
  }
}

// ── Prologue → CH1 ──
const rt = createRuntime()
rt.go('start')
rt.go('entrance_bridge')
rt.go('lobby_reveal')
rt.go('groomy_intro')
rt.go('chat_boot')
rt.choose('네?')
rt.choose('아는데요')
rt.go('ask_nickname')
rt.orchestrator.handleInput({ type: 'nickname', next: 'after_nickname' }, '테스터')
rt.choose('어 열심히 할게…')
rt.go('chat_work_intro')
rt.choose('해결해주시는 건가요?')
rt.choose('이미 들어온 거 아니었어요?')
rt.choose('주머니를 뒤진다.')
rt.go('entrance_tag')
rt.go('iseol_intro')
rt.choose('잘 부탁드립니다.')
rt.done()
rt.enterNextChapter()

// ── CH1 fast path to end ──
rt.choose('알겠습니다. 안내 부탁드립니다.')
rt.done('office7_rpg')
rt.go('meeting_entry')
rt.choose('안으로 들어간다.')
rt.go('meeting_room_rpg')
rt.go('meeting_start_gate')
rt.choose('예, 회의를 시작할게요.')
rt.choose('전임자 자리 기록을 남긴다.')
rt.choose('사진을 찍어 보관한다.')
rt.choose('3층 출입 로그를 요청한다.')
rt.choose('그루미에게 우회 권한을 맡긴다.')
rt.go('floor3_vn')
rt.go('floor3_rpg')
rt.go('exit_floor3')
rt.go('deduction_chat')
rt.choose(`${chapterRegistry.getChapter('chapter-01').scenes.deduction_chat.choices[0].text}`)
rt.done()
rt.enterNextChapter()

// ── CH2 investigation path ──
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

// ── CH3 mainline ──
rt.go('ch3_morning_after')
rt.go('desk_assignment_vn')
rt.go('desk_drawer_rpg')
rt.go('resignation_letter_clue')
rt.choose('서랍 조사를 계속한다.')
rt.go('family_photo_clue')
rt.choose('조용히 사진을 다시 내려놓는다.')
rt.finishScene()
rt.go('guardian_recall_vn')
rt.finishScene()
rt.go('groomy_absence_chat')
rt.choose('그루미를 안심시킨다.')
rt.go('bathroom_glitch_vn')
rt.finishScene()
rt.go('floor3_decision_chat')
rt.choose('아무것도 못 봤다고 한다.')
rt.choose('그래도 3층에 가본다.')
rt.go('storage_entry_vn')
rt.go('storage_rpg')
rt.go('storage_clue_chair')
rt.finishScene()
rt.go('storage_clue_idcard')
rt.finishScene()
rt.go('storage_clue_recorder_full')
rt.finishScene()
rt.go('body_discovery_vn')
rt.choose('그루미 곁에 조용히 있어준다.')
rt.go('recorder_playback_vn')
rt.finishScene()
rt.go('caretaker_first_contact_chat')
rt.choose('CARETAKER에게 박서이의 죽음에 대해 직접 묻는다.')
rt.go('ch3_deduction_chat')
rt.choose('타살이다. 누군가가 박서이를 죽였다.')
rt.go('ch3_chapter_closing')
rt.go('chapter_end')
rt.enterNextChapter()

// ── CH4 shield path (affinity already >= 5 from prologue+ch1) ──
assert.ok((rt.state.scores.groomyAffinity ?? 0) >= 5, 'expected high affinity before CH4')
rt.go('ch4_accusation')
rt.go('groomy_gate')
rt.choose('그루미가 로그를 덮어준다.')
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
rt.go('groomy_realization_high')
rt.go('ch4_closing')
rt.go('ch4_end')
rt.enterNextChapter()

// ── CH5 true ending route ──
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
rt.choose('대답하지 않고 걷는다.')
rt.go('ending_true_silent_walk')
rt.go('ch5_closing')
rt.go('ch5_end')
assert.equal(chapterRegistry.getNextChapter('chapter-05'), null)
assert.equal(
  resolveProjectGroomyEnding(rt.state).id,
  'true',
  `expected true ending, got ${resolveProjectGroomyEnding(rt.state).id}`,
)

// ── Low affinity, no truth → ending_badB (dismantle without truthExposed) ──
const low = createRuntime({
  ...initialGameState,
  screen: 'playing',
  activeChapterId: 'chapter-05',
  activeSceneId: 'perception_off',
  nickname: '테스터',
  scores: {
    ...initialGameState.scores,
    groomyAffinity: -2,
    mysteryEvidence: 8,
    batteryDesperation: 3,
  },
  flags: ['ch4_learnedGroomyIsExecutor'],
})
low.go('perception_off')
low.go('office_truth')
low.go('ch5_battery_weight')
low.go('groomy_only_alive')
low.go('guardian_call')
low.go('final_choice_pick')
low.choose('그루미를 바라본다.')
low.finishScene()
low.go('ending_badB')
low.go('ch5_closing')
low.go('ch5_end')
assert.equal(resolveProjectGroomyEnding(low.state).id, 'badB')

// ── groomy_abandon route (CH4 bad end scene) ──
const abandon = createRuntime({
  ...initialGameState,
  screen: 'playing',
  activeChapterId: 'chapter-04',
  activeSceneId: 'ch4_accusation',
  nickname: '테스터',
  scores: { ...initialGameState.scores, groomyAffinity: 0 },
})
abandon.go('ch4_accusation')
abandon.go('groomy_gate')
abandon.choose('그루미가 침묵한다.')
abandon.finishScene()
abandon.go('ch4_bad_closing')
abandon.go('ch4_end_bad')
assert.ok(abandon.state.flags.includes('ch4_groomyAbandoned'))
assert.equal(abandon.state.activeSceneId, 'ch4_end_bad')
assert.equal(abandon.state.chapterEnded, true)
assert.equal(abandon.orchestrator.enterChapter('chapter-05'), false)

// ── CH4 gate: affinity 1 → hint only (organic badB path enabled) ──
const hintAtOne = createRuntime({
  ...initialGameState,
  activeChapterId: 'chapter-04',
  activeSceneId: 'groomy_gate',
  scores: { ...initialGameState.scores, groomyAffinity: 1 },
})
const hintChoices = resolveChoiceAvailability({
  state: hintAtOne.state,
  choices: chapterRegistry.getScene('chapter-04', 'groomy_gate').choices,
})
assert.deepEqual(
  hintChoices.map((c) => c.next),
  ['groomy_hint'],
  'affinity 1 must hint through CH4 to reach CH5 badB',
)

// ── High affinity bootstrap (+8) ending_true from CH5 only ──
const high = createRuntime({
  ...initialGameState,
  screen: 'playing',
  activeChapterId: 'chapter-05',
  activeSceneId: 'perception_off',
  nickname: '테스터',
  scores: { ...initialGameState.scores, groomyAffinity: 8 },
  flags: ['truthExposed', 'groomyStayedClose'],
})
high.go('perception_off')
high.go('office_truth')
high.go('ch5_battery_weight')
high.go('groomy_only_alive')
high.go('guardian_call')
high.go('final_choice_pick')
high.choose('그루미의 말을 듣는다.')
high.go('final_choice_high')
high.choose('안 해. 같이 나가자.')
high.go('ending_true')
high.choose('대답하지 않고 걷는다.')
high.go('ending_true_silent_walk')
high.go('ch5_closing')
high.go('ch5_end')
assert.equal(resolveProjectGroomyEnding(high.state).id, 'true')

// ── badA: close affinity but dismantle at final choice ──
const badA = createRuntime({
  ...initialGameState,
  screen: 'playing',
  activeChapterId: 'chapter-05',
  activeSceneId: 'final_choice_pick',
  nickname: '테스터',
  scores: { ...initialGameState.scores, groomyAffinity: 6 },
  flags: ['truthExposed'],
})
badA.choose('그루미의 말을 듣는다.')
badA.choose('미안해. 부품을 꺼낼게.')
badA.go('ending_badA')
badA.go('ch5_closing')
badA.go('ch5_end')
assert.equal(resolveProjectGroomyEnding(badA.state).id, 'badA')

// ── normal: mid affinity, groomy volunteers battery ──
const normal = createRuntime({
  ...initialGameState,
  screen: 'playing',
  activeChapterId: 'chapter-05',
  activeSceneId: 'final_choice_pick',
  nickname: '테스터',
  scores: { ...initialGameState.scores, groomyAffinity: 3 },
})
normal.choose('그루미의 말을 듣는다.')
normal.finishScene()
normal.go('ending_normal')
normal.go('ch5_closing')
normal.go('ch5_end')
assert.equal(resolveProjectGroomyEnding(normal.state).id, 'normal')

console.log('fullPlaythrough.test.js passed')
