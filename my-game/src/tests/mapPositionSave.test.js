import assert from 'node:assert/strict'
import { isValidSave } from '../engine/save/saveSchema.js'
import { gameReducer } from '../engine/state/gameReducer.js'
import { initialGameState } from '../engine/state/initialState.js'
import { setMapPosition } from '../engine/state/actions.js'

const afterMove = gameReducer(
  initialGameState,
  setMapPosition('floor5', { row: 3, col: 4, facing: { dr: 0, dc: 1 } }),
)

assert.equal(isValidSave(afterMove), true, 'mapPositions after RPG move must pass save validation')
assert.deepEqual(afterMove.mapPositions.floor5, {
  mapId: 'floor5',
  row: 3,
  col: 4,
  facing: { dr: 0, dc: 1 },
})

console.log('mapPositionSave.test.js passed')
