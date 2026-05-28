import assert from 'node:assert/strict'
import { chapterRegistry } from '../engine/progression/chapterRegistry.js'
import { gameReducer } from '../engine/state/gameReducer.js'
import { initialGameState } from '../engine/state/initialState.js'
import { GameActionTypes, setScreen } from '../engine/state/actions.js'
import { createSceneOrchestrator } from '../game/runtime/orchestration/sceneOrchestrator.js'
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

const prologueFlow = ['start', 'lobby_wake', 'groomy_intro', 'chat_boot']

for (const sceneId of prologueFlow) {
  const integrity = safeResolveSceneTransition({
    chapterRegistry,
    chapterId: state.activeChapterId,
    sceneId,
  })
  assert.equal(integrity.ok, true, `integrity failed for ${sceneId}: ${JSON.stringify(integrity)}`)
  assert.equal(errors.length, 0, `runtime error before ${sceneId}: ${JSON.stringify(errors)}`)
  const ok = orchestrator.goToScene(sceneId)
  assert.equal(ok, true, `goToScene failed for ${sceneId}`)
  assert.equal(state.activeSceneId, sceneId, `scene id mismatch after ${sceneId}`)
  assert.equal(errors.length, 0, `runtime error after ${sceneId}: ${JSON.stringify(errors)}`)
}

console.log('vnPrologueFlow.test.js passed')
