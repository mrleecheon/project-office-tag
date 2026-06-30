import assert from 'node:assert/strict'
import { chapterRegistry } from '../engine/progression/chapterRegistry.js'
import { initialGameState } from '../engine/state/initialState.js'
import { resolveChoiceAvailability } from '../game/transitions/transitionPolicy.js'
import { safeResolveSceneTransition } from '../tools/validators/runtimeIntegrity.js'

const gate = chapterRegistry.getScene('chapter-04', 'groomy_gate')

function gateChoicesForAffinity(affinity) {
  return resolveChoiceAvailability({
    state: {
      ...initialGameState,
      scores: { ...initialGameState.scores, groomyAffinity: affinity },
    },
    choices: gate.choices,
  })
}

assert.deepEqual(
  gateChoicesForAffinity(6).map((choice) => choice.next),
  ['groomy_shield'],
)

assert.deepEqual(
  gateChoicesForAffinity(3).map((choice) => choice.next),
  ['groomy_hint'],
)

assert.deepEqual(
  gateChoicesForAffinity(1).map((choice) => choice.next),
  ['groomy_hint'],
  'affinity 1 must reach hint (not abandon) so CH5 badB is reachable',
)

assert.deepEqual(
  gateChoicesForAffinity(0).map((choice) => choice.next),
  ['groomy_abandon'],
)

assert.deepEqual(
  gateChoicesForAffinity(-1).map((choice) => choice.next),
  ['groomy_abandon'],
)

const realizationGate = chapterRegistry.getScene('chapter-04', 'groomy_realization_gate')
const realizationChoices = resolveChoiceAvailability({
  state: { ...initialGameState, scores: { ...initialGameState.scores, groomyAffinity: 5 } },
  choices: realizationGate.choices,
})
assert.equal(realizationChoices[0]?.next, 'groomy_realization_high')

const ch3ToCh4 = chapterRegistry.getNextChapter('chapter-03')
assert.equal(ch3ToCh4?.id, 'chapter-04')
assert.equal(chapterRegistry.getChapter('chapter-04').startSceneId, 'archive_room_infiltration')

const mainline = [
  'archive_room_infiltration', 'archive_room_caught', 'ch4_accusation', 'groomy_gate', 'groomy_shield', 'diary_full', 'caretaker_core_descent', 'guardian_ara_interlude',
  'truth_revelation', 'truth_revelation_after', 'battery_revelation', 'groomy_realization_gate', 'groomy_realization_high', 'ch4_closing', 'ch4_end',
]
for (const sceneId of mainline) {
  const integrity = safeResolveSceneTransition({
    chapterRegistry,
    chapterId: 'chapter-04',
    sceneId,
  })
  assert.equal(integrity.ok, true, `broken chapter-04 link: ${sceneId}`)
}

console.log('chapter04Branching.test.js passed')
