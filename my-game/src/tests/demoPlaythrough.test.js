import assert from 'node:assert/strict'
import { DEMO_MODE } from '../config/demo.js'
import { chapterRegistry } from '../engine/progression/chapterRegistry.js'
import { gameReducer } from '../engine/state/gameReducer.js'
import { initialGameState } from '../engine/state/initialState.js'
import { createSceneOrchestrator } from '../game/runtime/orchestration/sceneOrchestrator.js'
import { resolveChoiceAvailability } from '../game/transitions/transitionPolicy.js'
import { demoPlayableChapters } from '../content/chapters/index.js'

assert.equal(DEMO_MODE, true)
assert.deepEqual(
  demoPlayableChapters.map((chapter) => chapter.id),
  ['prologue', 'chapter-01'],
)
assert.equal(chapterRegistry.getNextChapter('chapter-01'), null)
assert.equal(chapterRegistry.getChapter('chapter-02'), null)

function createRuntime(seedState = initialGameState) {
  let state = { ...seedState, screen: 'playing' }
  const dispatch = (action) => {
    state = gameReducer(state, action)
  }
  const orchestrator = createSceneOrchestrator({
    dispatch,
    getState: () => state,
    setClearCopy: () => {},
    setNextChapterId: () => {},
    setRuntimeError: () => {},
  })
  return {
    get state() {
      return state
    },
    orchestrator,
    go(sceneId) {
      orchestrator.goToScene(sceneId)
      return state
    },
    choose(choiceText) {
      const scene = chapterRegistry.getScene(state.activeChapterId, state.activeSceneId)
      const available = resolveChoiceAvailability({ state, choices: scene.choices ?? [] })
      const choice = available.find((entry) => entry.text === choiceText)
      assert.ok(choice, `choice not available "${choiceText}" in ${state.activeChapterId}.${state.activeSceneId}`)
      orchestrator.handleChoice(choice)
      return state
    },
  }
}

const rt = createRuntime({
  ...initialGameState,
  activeChapterId: 'chapter-01',
  activeSceneId: 'groomy_bypass',
  nickname: '테스터',
  flags: ['visitedMeetingRoom'],
  visitedScenes: ['chapter-01.groomy_bypass'],
})

rt.choose('비상계단 화면으로 전환한다.')
assert.equal(rt.state.screen, 'demoEnd')
assert.equal(rt.state.activeSceneId, 'groomy_bypass')

const blocked = createRuntime()
blocked.orchestrator.enterChapter('chapter-02')
assert.equal(blocked.state.screen, 'demoEnd')

console.log('demoPlaythrough.test.js passed')
