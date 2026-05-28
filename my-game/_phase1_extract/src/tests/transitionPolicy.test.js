import assert from 'node:assert/strict'
import { initialGameState } from '../engine/state/initialState.js'
import { canEnterScene, resolveChoiceAvailability } from '../game/transitions/transitionPolicy.js'

const openSceneResult = canEnterScene({
  state: initialGameState,
  targetScene: { id: 'scene.open' },
})
assert.equal(openSceneResult.ok, true)

const lockedSceneResult = canEnterScene({
  state: initialGameState,
  targetScene: {
    id: 'scene.locked',
    requirements: [{ type: 'flag', flag: 'openedDoor' }],
  },
})
assert.equal(lockedSceneResult.ok, false)
assert.equal(lockedSceneResult.reason, 'requirements-failed')

const choices = resolveChoiceAvailability({
  state: { ...initialGameState, flags: ['openedDoor'] },
  choices: [
    { text: 'A', next: 'a', requirements: [{ type: 'flag', flag: 'openedDoor' }] },
    { text: 'B', next: 'b', requirements: [{ type: 'flag', flag: 'missingFlag' }] },
    { text: 'C', next: 'c' },
  ],
})
assert.deepEqual(choices.map((choice) => choice.next), ['a', 'c'])

console.log('transitionPolicy.test.js passed')
