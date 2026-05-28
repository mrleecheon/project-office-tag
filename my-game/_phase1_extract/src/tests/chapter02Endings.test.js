import assert from 'node:assert/strict'
import { CHAPTER_02_ENDINGS, resolveChapter02Ending } from '../engine/progression/endings.js'

const baseState = {
  nickname: '테스트',
  flags: [],
  scores: { mysteryEvidence: 0, batteryDesperation: 0, corporateSuspicion: 0, groomyAffinity: 0 },
}

assert.equal(resolveChapter02Ending({ ...baseState, flags: ['ch2_preservedAuditAccess'] }).id, CHAPTER_02_ENDINGS.compliance.id)
assert.equal(resolveChapter02Ending({ ...baseState, flags: ['ch2_confirmedEmployeeIdSpoof'] }).id, CHAPTER_02_ENDINGS.expose.id)
assert.equal(resolveChapter02Ending({ ...baseState, flags: ['ch2_linkedBatteryToCoverup'] }).id, CHAPTER_02_ENDINGS.coverup.id)
assert.equal(resolveChapter02Ending({ ...baseState, flags: ['ch2_withheldMirrorJudgment'] }).id, CHAPTER_02_ENDINGS.withdraw.id)

assert.equal(
  resolveChapter02Ending({
    ...baseState,
    scores: { ...baseState.scores, mysteryEvidence: 6, batteryDesperation: 3 },
  }).id,
  CHAPTER_02_ENDINGS.coverup.id,
)

console.log('chapter02Endings.test.js passed')
