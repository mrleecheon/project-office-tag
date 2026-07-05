import assert from 'node:assert/strict'
import { chapterRegistry } from '../engine/progression/chapterRegistry.js'
import { gameReducer } from '../engine/state/gameReducer.js'
import { initialGameState } from '../engine/state/initialState.js'
import { createSceneOrchestrator } from '../game/runtime/orchestration/sceneOrchestrator.js'
import { resolveChoiceAvailability } from '../game/transitions/transitionPolicy.js'
import { setChapter, applyEffects } from '../engine/state/actions.js'

const GATE = 'visitedMeetingRoom'

function createRunner(seed = initialGameState) {
  let state = { ...seed, screen: 'playing', nickname: '테스트' }
  const dispatch = (action) => { state = gameReducer(state, action) }
  const orch = createSceneOrchestrator({
    dispatch,
    getState: () => state,
    setClearCopy: () => {},
    setNextChapterId: () => {},
    setRuntimeError: () => {},
  })
  return {
    get state() { return state },
    dispatch,
    orch,
    scene() {
      return chapterRegistry.getScene(state.activeChapterId, state.activeSceneId)
    },
    visibleChoices() {
      const scene = chapterRegistry.getScene(state.activeChapterId, state.activeSceneId)
      return resolveChoiceAvailability({ state, choices: scene?.choices ?? [] })
    },
    choose(text) {
      const choice = this.visibleChoices().find((c) => c.text === text)
      assert.ok(choice, `choice not visible: ${text} at ${state.activeSceneId}`)
      orch.handleChoice(choice)
    },
    go(id) {
      assert.ok(orch.goToScene(id), `go blocked: ${id}`)
    },
    enterCh1HubWithoutMeeting() {
      dispatch(setChapter('chapter-01', 'after_first_clue'))
      state = {
        ...state,
        flags: ['acceptedOnboarding', 'keptBatteryReceipt', 'ch1DeskInvestigationDone'],
        scores: { ...state.scores, mysteryEvidence: 2 },
      }
    },
  }
}

// ── D: denied 씬에 returnTo 없음, 명시적 선택지 ──
const denied = chapterRegistry.getScene('chapter-01', 'floor3_access_denied')
const deniedBypass = chapterRegistry.getScene('chapter-01', 'floor3_access_denied_bypass')

assert.equal(denied.returnTo, undefined, 'floor3_access_denied must not use returnTo')
assert.equal(deniedBypass.returnTo, undefined, 'floor3_access_denied_bypass must not use returnTo')
assert.ok(
  (denied.choices ?? []).some((c) => c.text === '회의실로 이동한다.' && c.next === 'meeting_entry'),
  'floor3_access_denied must offer meeting_entry escape',
)
assert.ok(
  (deniedBypass.choices ?? []).some((c) => c.text === '회의실로 이동한다.' && c.next === 'meeting_entry'),
  'floor3_access_denied_bypass must offer meeting_entry escape',
)

// ── B: 허브에 회의실 안내 (needsMeetingRoom만) ──
const hubScenes = ['after_first_clue', 'check_groomy', 'hide_battery_clue']
for (const sceneId of hubScenes) {
  const scene = chapterRegistry.getScene('chapter-01', sceneId)
  const withoutMeeting = resolveChoiceAvailability({
    state: { ...initialGameState, flags: [], scores: initialGameState.scores },
    choices: scene.choices ?? [],
  })
  assert.ok(
    withoutMeeting.some((c) => c.text === '회의실을 먼저 확인한다.' && c.next === 'meeting_entry'),
    `${sceneId} must show meeting hint when visitedMeetingRoom is missing`,
  )

  const withMeeting = resolveChoiceAvailability({
    state: { ...initialGameState, flags: [GATE], scores: initialGameState.scores },
    choices: scene.choices ?? [],
  })
  assert.equal(
    withMeeting.some((c) => c.text === '회의실을 먼저 확인한다.'),
    false,
    `${sceneId} must hide meeting hint when visitedMeetingRoom is set`,
  )
}

// ── 회의실 미방문: 루프 없이 meeting_entry로 탈출 ──
const loopRt = createRunner()
loopRt.enterCh1HubWithoutMeeting()
loopRt.choose('3층 출입 로그를 요청한다.')
assert.equal(loopRt.state.activeSceneId, 'floor3_access_denied')
assert.equal(loopRt.visibleChoices().length, 1)
loopRt.choose('회의실로 이동한다.')
assert.equal(loopRt.state.activeSceneId, 'meeting_entry')
assert.equal(loopRt.state.flags.includes(GATE), false)

// denied에 머무르면 자동 전환 대상 없음 (choices 필수)
assert.equal(denied.next ?? denied.returnTo ?? null, null)

// 허브에서 회의실 먼저 선택
const hubRt = createRunner()
hubRt.enterCh1HubWithoutMeeting()
hubRt.choose('회의실을 먼저 확인한다.')
assert.equal(hubRt.state.activeSceneId, 'meeting_entry')

// ── 정상 루트: meeting 후 request_floor3_log ──
const normalRt = createRunner()
normalRt.enterCh1HubWithoutMeeting()
normalRt.go('meeting_entry')
normalRt.choose('안으로 들어간다.')
assert.ok(normalRt.state.flags.includes(GATE))
normalRt.go('meeting_room_rpg')
normalRt.go('meeting_start_gate')
normalRt.choose('예, 회의를 시작할게요.')
normalRt.choose('전임자 자리 기록을 남긴다.')
normalRt.choose('사진을 찍어 보관한다.')
assert.equal(normalRt.state.activeSceneId, 'after_first_clue')
normalRt.choose('3층 출입 로그를 요청한다.')
assert.equal(normalRt.state.activeSceneId, 'request_floor3_log')
assert.ok(normalRt.state.flags.includes('requestedFloor3Log'))

// ── 기존 세이브(stuck) 복구: after_first_clue + no gate flag ──
const saveRt = createRunner({
  ...initialGameState,
  screen: 'playing',
  activeChapterId: 'chapter-01',
  activeSceneId: 'after_first_clue',
  flags: ['acceptedOnboarding', 'ch1DeskInvestigationDone'],
  scores: { ...initialGameState.scores, mysteryEvidence: 2 },
})
assert.ok(
  saveRt.visibleChoices().some((c) => c.text === '회의실을 먼저 확인한다.'),
  'stuck save at after_first_clue can see meeting hint',
)
saveRt.choose('회의실을 먼저 확인한다.')
assert.equal(saveRt.state.activeSceneId, 'meeting_entry')

// ── bypass denied 탈출 ──
const bypassRt = createRunner()
bypassRt.dispatch(setChapter('chapter-01', 'groomy_bypass'))
bypassRt.dispatch(applyEffects([
  { type: 'addFlag', flag: 'acceptedOnboarding' },
  { type: 'addFlag', flag: 'trustedGroomyBypass' },
]))
bypassRt.choose('비상계단 화면으로 전환한다.')
assert.equal(bypassRt.state.activeSceneId, 'floor3_access_denied_bypass')
bypassRt.choose('회의실로 이동한다.')
assert.equal(bypassRt.state.activeSceneId, 'meeting_entry')

console.log('chapter01MeetingGate.test.js passed')
