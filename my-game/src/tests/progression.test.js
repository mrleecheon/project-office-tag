import assert from 'node:assert/strict'
import { chapterRegistry } from '../engine/progression/chapterRegistry.js'
import { initialGameState } from '../engine/state/initialState.js'
import { gameReducer } from '../engine/state/gameReducer.js'
import { applyEffects, setChapter, setScene } from '../engine/state/actions.js'
import { EffectTypes } from '../engine/contracts.js'

const prologue = chapterRegistry.getChapter('prologue')
assert.equal(prologue.startSceneId, 'start')

let state = gameReducer(initialGameState, setScene('clarify_no'))
assert.equal(state.activeSceneId, 'clarify_no')
assert.ok(state.visitedScenes.includes('prologue.clarify_no'))

state = gameReducer(state, applyEffects([
  { type: EffectTypes.ADD_FLAG, flag: 'deniedIdentity' },
  { type: EffectTypes.ADD_FLAG, flag: 'deniedIdentity' },
  { type: EffectTypes.ADD_ITEM, item: 'tempBinding' },
]))
assert.deepEqual(state.flags, ['deniedIdentity'])
assert.deepEqual(state.inventory, ['tempBinding'])

state = gameReducer(state, setChapter('chapter-01', 'rpg_floor7'))
assert.equal(state.activeChapterId, 'chapter-01')
assert.equal(state.activeSceneId, 'rpg_floor7')

console.log('progression.test.js passed')
