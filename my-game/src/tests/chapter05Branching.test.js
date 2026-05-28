import assert from 'node:assert/strict'
import { chapterRegistry } from '../engine/progression/chapterRegistry.js'
import { initialGameState } from '../engine/state/initialState.js'
import { resolveProjectGroomyEnding } from '../engine/progression/endings.js'
import { resolveChoiceAvailability } from '../game/transitions/transitionPolicy.js'
import { safeResolveSceneTransition } from '../tools/validators/runtimeIntegrity.js'

const pick = chapterRegistry.getScene('chapter-05', 'final_choice_pick')
const high = chapterRegistry.getScene('chapter-05', 'final_choice_high')

function pickRoute(affinity) {
  return resolveChoiceAvailability({
    state: { ...initialGameState, scores: { ...initialGameState.scores, groomyAffinity: affinity } },
    choices: pick.choices,
  })[0]?.next
}

assert.equal(pickRoute(6), 'final_choice_high')
assert.equal(pickRoute(3), 'final_choice_mid')
assert.equal(pickRoute(0), 'final_choice_low')

const highChoices = resolveChoiceAvailability({
  state: { ...initialGameState, scores: { ...initialGameState.scores, groomyAffinity: 6 } },
  choices: high.choices,
}).map((choice) => choice.next)
assert.deepEqual(highChoices, ['ending_badA', 'ending_true'])

assert.equal(chapterRegistry.getNextChapter('chapter-04')?.id, 'chapter-05')
assert.equal(chapterRegistry.getChapter('chapter-05').startSceneId, 'perception_off')

const ch5End = chapterRegistry.getScene('chapter-05', 'ch5_end')
assert.equal(ch5End.mode, 'end')
assert.equal(ch5End.nextChapterId, undefined)

const trueEnding = resolveProjectGroomyEnding({
  ...initialGameState,
  flags: ['groomyStayedClose', 'truthExposed'],
  scores: { groomyAffinity: 6 },
})
assert.equal(trueEnding.id, 'true')

const badAEnding = resolveProjectGroomyEnding({
  ...initialGameState,
  flags: ['dismantledGroomy', 'groomyStayedClose', 'truthExposed'],
  scores: { groomyAffinity: 6 },
})
assert.equal(badAEnding.id, 'badA')

const mainline = [
  'perception_off', 'office_truth', 'ch5_battery_weight', 'groomy_only_alive', 'guardian_call', 'final_choice_pick',
  'final_choice_high', 'ending_true', 'ch5_end',
]
for (const sceneId of mainline) {
  const integrity = safeResolveSceneTransition({
    chapterRegistry,
    chapterId: 'chapter-05',
    sceneId,
  })
  assert.equal(integrity.ok, true, `broken chapter-05 link: ${sceneId}`)
}

console.log('chapter05Branching.test.js passed')
