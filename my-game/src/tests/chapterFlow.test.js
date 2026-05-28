import assert from 'node:assert/strict'
import { chapterRegistry } from '../engine/progression/chapterRegistry.js'
import { initialGameState } from '../engine/state/initialState.js'
import { createSceneOrchestrator } from '../game/runtime/orchestration/sceneOrchestrator.js'
import { gameReducer } from '../engine/state/gameReducer.js'
import { resolveChoiceAvailability } from '../game/transitions/transitionPolicy.js'

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
    dispatch,
    orchestrator,
    choose(choiceText) {
      const scene = chapterRegistry.getScene(state.activeChapterId, state.activeSceneId)
      const choice = resolveChoiceAvailability({ state, choices: scene.choices ?? [] })
        .find((entry) => entry.text === choiceText)
      assert.ok(choice, `choice not available: ${choiceText}`)
      orchestrator.handleChoice(choice)
      return state
    },
    go(sceneId) {
      assert.equal(orchestrator.goToScene(sceneId), true, `blocked at ${sceneId}`)
      return state
    },
    tryEnterChapter(chapterId) {
      return orchestrator.enterChapter(chapterId)
    },
    simulateClearContinue() {
      if (state.chapterEnded) return 'restart'
      const nextChapter = chapterRegistry.getNextChapter(state.activeChapterId)
      const hasPlayableNext = Boolean(nextChapter?.scenes?.[nextChapter.startSceneId])
      if (hasPlayableNext) {
        orchestrator.enterChapter(nextChapter.id)
        return 'advanced'
      }
      return 'stopped'
    },
  }
}

const abandon = createRuntime({
  ...initialGameState,
  activeChapterId: 'chapter-04',
  activeSceneId: 'ch4_accusation',
  scores: { ...initialGameState.scores, groomyAffinity: 0 },
})

abandon.go('ch4_accusation')
abandon.go('groomy_gate')
abandon.choose('그루미가 침묵한다.')
abandon.go('ch4_end_bad')

assert.equal(abandon.state.activeSceneId, 'ch4_end_bad')
assert.equal(abandon.state.chapterEnded, true, 'ch4_end_bad must set chapterEnded')
assert.ok(abandon.state.flags.includes('ch4_groomyAbandoned'))

assert.equal(abandon.tryEnterChapter('chapter-05'), false, 'CH5 enterChapter blocked when chapterEnded')
assert.equal(abandon.simulateClearContinue(), 'restart', 'clear continue must not advance to CH5')
assert.notEqual(abandon.state.activeChapterId, 'chapter-05')

const ch5Scene = chapterRegistry.getScene('chapter-05', 'perception_off')
assert.ok(ch5Scene, 'CH5 content exists but must stay unreachable from abandon route')

console.log('chapterFlow.test.js passed')
