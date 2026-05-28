import assert from 'node:assert/strict'
import { isValidSave } from '../engine/save/saveSchema.js'
import { initialGameState } from '../engine/state/initialState.js'

assert.equal(isValidSave(initialGameState), true)
assert.equal(isValidSave({}), false)
assert.equal(isValidSave({ ...initialGameState, version: 999 }), false)
assert.equal(isValidSave({ ...initialGameState, flags: null }), false)
assert.equal(isValidSave({ ...initialGameState, screen: 'unknown' }), false)
assert.equal(isValidSave({ ...initialGameState, scores: { trust: Number.NaN } }), false)
assert.equal(isValidSave({ ...initialGameState, visitedScenes: ['prologue.start', 42] }), false)
assert.equal(isValidSave({
  ...initialGameState,
  mapPositions: { floor5: { mapId: 'floor5', row: 1, col: 2, facing: { dr: 0, dc: 1 } } },
}), true)
assert.equal(isValidSave({
  ...initialGameState,
  mapPositions: { floor5: { mapId: 'floor5', row: '1', col: 2, facing: { dr: 0, dc: 1 } } },
}), false)
assert.equal(isValidSave({
  ...initialGameState,
  routeHistory: [{ chapterId: 'prologue', sceneId: 'start' }],
}), true)
assert.equal(isValidSave({
  ...initialGameState,
  routeHistory: [{ chapterId: 'prologue', sceneId: null }],
}), false)

console.log('saveSchema.test.js passed')
