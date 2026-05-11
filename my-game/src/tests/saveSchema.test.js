import assert from 'node:assert/strict'
import { isValidSave } from '../engine/save/saveSchema.js'
import { initialGameState } from '../engine/state/initialState.js'

assert.equal(isValidSave(initialGameState), true)
assert.equal(isValidSave({}), false)
assert.equal(isValidSave({ ...initialGameState, version: 999 }), false)
assert.equal(isValidSave({ ...initialGameState, flags: null }), false)

console.log('saveSchema.test.js passed')
