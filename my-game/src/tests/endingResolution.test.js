import assert from 'node:assert/strict'
import {
  PROJECT_GROOMY_ENDINGS,
  isNormalEndingTruthMidAffinity,
  resolveProjectGroomyEnding,
  resolveProjectGroomyEndingSummaryKo,
} from '../engine/progression/endings.js'
import { initialGameState } from '../engine/state/initialState.js'

function endingState({ flags = [], scores = {} }) {
  return {
    ...initialGameState,
    flags,
    scores: { ...initialGameState.scores, ...scores },
  }
}

// dismantled + truthExposed → badA (affinity irrelevant)
assert.equal(
  resolveProjectGroomyEnding(
    endingState({
      flags: ['dismantledGroomy', 'truthExposed'],
      scores: { groomyAffinity: 6 },
    }),
  ).id,
  PROJECT_GROOMY_ENDINGS.badA.id,
  'dismantled + truthExposed → badA',
)

assert.equal(
  resolveProjectGroomyEnding(
    endingState({
      flags: ['dismantledGroomy', 'truthExposed'],
      scores: { groomyAffinity: 0 },
    }),
  ).id,
  PROJECT_GROOMY_ENDINGS.badA.id,
  'dismantled + truthExposed stays badA at low affinity',
)

// dismantled + no truth → badB
assert.equal(
  resolveProjectGroomyEnding(
    endingState({
      flags: ['dismantledGroomy'],
      scores: { groomyAffinity: 6 },
    }),
  ).id,
  PROJECT_GROOMY_ENDINGS.badB.id,
  'dismantled without truthExposed → badB',
)

// no dismantle + affinity 6 → TRUE
assert.equal(
  resolveProjectGroomyEnding(
    endingState({
      flags: ['truthExposed'],
      scores: { groomyAffinity: 6 },
    }),
  ).id,
  PROJECT_GROOMY_ENDINGS.true.id,
  'no dismantle + affinity 6 → TRUE',
)

assert.equal(
  resolveProjectGroomyEnding(
    endingState({
      flags: ['groomyStayedClose', 'truthExposed'],
      scores: { groomyAffinity: 3 },
    }),
  ).id,
  PROJECT_GROOMY_ENDINGS.true.id,
  'groomyStayedClose overrides mid affinity for TRUE',
)

// no dismantle + truthExposed + affinity 4 → NORMAL (truth-mid epilogue)
const truthMidState = endingState({
  flags: ['truthExposed'],
  scores: { groomyAffinity: 4 },
})

assert.equal(
  resolveProjectGroomyEnding(truthMidState).id,
  PROJECT_GROOMY_ENDINGS.normal.id,
  'no dismantle + truthExposed + affinity 4 → NORMAL',
)

assert.equal(
  isNormalEndingTruthMidAffinity(truthMidState),
  true,
  'affinity 4 + truthExposed uses truth-mid NORMAL epilogue',
)

assert.match(
  resolveProjectGroomyEndingSummaryKo(truthMidState, PROJECT_GROOMY_ENDINGS.normal),
  /진실을 알았지만.*가까워지지 못했다/,
  'truth-mid NORMAL epilogue must acknowledge truth without closeness',
)

// path C: no dismantle + no truth + affinity 3 → NORMAL (default epilogue)
const pathCState = endingState({
  flags: [],
  scores: { groomyAffinity: 3 },
})

assert.equal(
  resolveProjectGroomyEnding(pathCState).id,
  PROJECT_GROOMY_ENDINGS.normal.id,
  'path C: no dismantle + no truth + affinity 3 → NORMAL',
)

assert.equal(
  resolveProjectGroomyEndingSummaryKo(pathCState, PROJECT_GROOMY_ENDINGS.normal),
  PROJECT_GROOMY_ENDINGS.normal.summaryKo,
  'path C: no-truth NORMAL keeps default epilogue',
)

// path C (high affinity): truthExposed false, affinity 6, not dismantled → NORMAL
assert.equal(
  resolveProjectGroomyEnding(
    endingState({
      flags: [],
      scores: { groomyAffinity: 6 },
    }),
  ).id,
  PROJECT_GROOMY_ENDINGS.normal.id,
  'path C: no truth + affinity 6 without dismantle → NORMAL (not TRUE)',
)

console.log('endingResolution.test.js passed')
