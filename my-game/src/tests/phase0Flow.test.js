import assert from 'node:assert/strict'
import { chapterRegistry } from '../engine/progression/chapterRegistry.js'
import { SceneModes } from '../engine/contracts.js'
import { gameReducer } from '../engine/state/gameReducer.js'
import { initialGameState } from '../engine/state/initialState.js'
import { createSceneOrchestrator } from '../game/runtime/orchestration/sceneOrchestrator.js'
import { resolveLineText } from '../content/manifests/text.js'
import { resolveChapterClearCopy } from '../engine/progression/endings.js'
import { safeResolveSceneTransition } from '../tools/validators/runtimeIntegrity.js'

let state = { ...initialGameState, screen: 'playing' }
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

function go(sceneId) {
  const ok = orchestrator.goToScene(sceneId)
  assert.equal(ok, true, `goToScene failed: ${sceneId}`)
  assert.equal(errors.length, 0, `runtime error at ${sceneId}: ${JSON.stringify(errors)}`)
}

function choose(choice) {
  orchestrator.handleChoice(choice)
}

const context = () => ({
  nickname: state.nickname,
  scores: state.scores,
  flags: state.flags,
  inventory: state.inventory,
})

// Nickname substitution
orchestrator.handleInput({ type: 'nickname', next: 'after_nickname' }, '테스터')
const afterNickname = chapterRegistry.getScene('prologue', 'after_nickname')
const nicknameLine = afterNickname.lines.find((line) => typeof line.text === 'function')
assert.match(resolveLineText(nicknameLine, context()), /테스터/)

// groomyAffinity accumulation
const affinityBefore = state.scores.groomyAffinity ?? 0
choose(afterNickname.choices.find((entry) => entry.text === '네.'))
assert.equal(state.scores.groomyAffinity, affinityBefore + 1)

// Prologue mainline scene links
const prologuePath = [
  'start', 'entrance_bridge', 'lobby_reveal', 'groomy_intro', 'chat_boot', 'ask_nickname', 'after_nickname',
  'card_key_goal', 'search_pocket', 'entrance_tag', 'iseol_intro', 'prologue_complete',
]
for (const sceneId of prologuePath) {
  const integrity = safeResolveSceneTransition({
    chapterRegistry,
    chapterId: 'prologue',
    sceneId,
  })
  assert.equal(integrity.ok, true, `broken prologue link: ${sceneId}`)
}

// CH1 → CH2 transition targets
const ch1End = chapterRegistry.getScene('chapter-01', 'chapter_end')
assert.equal(ch1End.end?.nextChapterId, 'chapter-02')

const meetingEntry = chapterRegistry.getScene('chapter-01', 'meeting_entry')
assert.equal(meetingEntry.chatTheme?.wallpaperAssetId, 'bg_meeting_room', 'meeting_entry uses meeting room wallpaper')
const meetingHub = chapterRegistry.getScene('chapter-01', 'meeting_room_hub')
assert.equal(meetingHub.chatTheme?.wallpaperAssetId, 'bg_meeting_room', 'meeting_room_hub uses meeting room wallpaper')
const officeTour = chapterRegistry.getScene('chapter-01', 'office_tour')
assert.equal(officeTour.chatTheme?.wallpaperAssetId, 'bg_default_office', 'non-meeting CH1 chat keeps default office wallpaper')

// CH2 END scene + clear copy
const ch2End = chapterRegistry.getScene('chapter-02', 'chapter_end')
assert.equal(ch2End.mode, SceneModes.END)
assert.equal(ch2End.nextChapterId, undefined)

state = {
  ...state,
  activeChapterId: 'chapter-02',
  activeSceneId: 'floor5_rpg',
  nickname: '테스터',
  scores: { ...state.scores, mysteryEvidence: 5, batteryDesperation: 2, corporateSuspicion: 1 },
}
const groomyDebrief = chapterRegistry.getScene('chapter-02', 'groomy_debrief')
assert.equal(groomyDebrief.next, 'floor3_door_approach')
go('floor3_door_approach')
go('chapter_end')
assert.equal(state.activeSceneId, 'chapter_end')

const clearCopy = resolveChapterClearCopy('chapter-02', state)
assert.equal(clearCopy.kicker, 'CHAPTER 2 CLEAR')
assert.ok(clearCopy.body.length > 0)

// CH2 → CH3 handoff
assert.equal(chapterRegistry.getNextChapter('chapter-02')?.id, 'chapter-03')
assert.equal(chapterRegistry.getChapter('chapter-03').startSceneId, 'ch3_morning_after')

// CH3 scene chain integrity (morning → desk → storage → aftermath → end)
const ch3Path = [
  'ch3_morning_after', 'desk_drawer', 'ch3_storage_entry', 'recorder_found', 'caretaker_warning',
  'guardian_recall', 'bathroom_glitch', 'ch3_end',
]
for (const sceneId of ch3Path) {
  const integrity = safeResolveSceneTransition({
    chapterRegistry,
    chapterId: 'chapter-03',
    sceneId,
  })
  assert.equal(integrity.ok, true, `broken chapter-03 link: ${sceneId}`)
}

const ch3End = chapterRegistry.getScene('chapter-03', 'ch3_end')
assert.equal(ch3End.mode, SceneModes.END)
assert.equal(ch3End.nextChapterId, 'chapter-04')
assert.equal(ch3End.end?.nextChapterId, 'chapter-04')

const ch3Clear = resolveChapterClearCopy('chapter-03', { ...state, activeChapterId: 'chapter-03' })
assert.equal(ch3Clear.title, '잊혀진 책상')

console.log('phase0Flow.test.js passed')
