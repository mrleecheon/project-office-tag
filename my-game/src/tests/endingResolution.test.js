import assert from 'node:assert/strict'
import {
  PROJECT_GROOMY_ENDINGS,
  isMysterySolvedFully,
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

// dismantled + dismantledWithFullKnowledge → badA (affinity irrelevant)
assert.equal(
  resolveProjectGroomyEnding(
    endingState({
      flags: ['dismantledGroomy', 'dismantledWithFullKnowledge', 'truthExposed'],
      scores: { groomyAffinity: 6 },
    }),
  ).id,
  PROJECT_GROOMY_ENDINGS.badA.id,
  'dismantled + dismantledWithFullKnowledge → badA',
)

assert.equal(
  resolveProjectGroomyEnding(
    endingState({
      flags: ['dismantledGroomy', 'dismantledWithFullKnowledge', 'truthExposed'],
      scores: { groomyAffinity: 0 },
    }),
  ).id,
  PROJECT_GROOMY_ENDINGS.badA.id,
  'dismantled + dismantledWithFullKnowledge stays badA at low affinity',
)

// dismantled + truthExposed but no full-knowledge flag → badB (low-affinity path)
assert.equal(
  resolveProjectGroomyEnding(
    endingState({
      flags: ['dismantledGroomy', 'truthExposed'],
      scores: { groomyAffinity: 0 },
    }),
  ).id,
  PROJECT_GROOMY_ENDINGS.badB.id,
  'dismantled + truthExposed without dismantledWithFullKnowledge → badB',
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
  /진실의 절반만 손에 쥔 채/,
  'truth-mid NORMAL without mystery conclusion uses truth-mid mystery-unsolved epilogue',
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
  PROJECT_GROOMY_ENDINGS.normal.summaryKoMysteryUnsolved,
  'path C: no-truth NORMAL uses mystery-unsolved epilogue',
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

assert.equal(
  isMysterySolvedFully(
    endingState({
      flags: ['ch3ConcludedHomicide'],
      scores: { mysteryEvidence: 8 },
    }),
  ),
  true,
  'mystery evidence 8 + homicide conclusion → mystery solved',
)

assert.equal(
  isMysterySolvedFully(
    endingState({
      flags: ['ch3WithheldFinalDeduction'],
      scores: { mysteryEvidence: 10 },
    }),
  ),
  false,
  'withheld deduction blocks mystery-solved even with high evidence',
)

console.log('endingResolution.test.js passed')
