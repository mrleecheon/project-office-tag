import {
  resolveGroomyRelationship,
  resolveKnownClues,
  resolveKnownRecords,
  resolveMysteryStatus,
  resolvePressureStatus,
} from '../../../content/story/projectGroomyUi.js'

export function selectStoryStatus(state) {
  const groomyAffinity = state.scores.groomyAffinity ?? 0
  const mysteryEvidence = state.scores.mysteryEvidence ?? 0
  const batteryDesperation = state.scores.batteryDesperation ?? 0
  const corporateSuspicion = state.scores.corporateSuspicion ?? 0

  return {
    scores: {
      groomyAffinity,
      mysteryEvidence,
      batteryDesperation,
      corporateSuspicion,
    },
    relationship: resolveGroomyRelationship(groomyAffinity),
    mysteryStatus: resolveMysteryStatus(mysteryEvidence),
    pressure: resolvePressureStatus({ batteryDesperation, corporateSuspicion }),
    clues: resolveKnownClues(state.inventory),
    records: resolveKnownRecords(state.flags),
    hasNewPlayerCard: state.inventory.includes('predecessorIdCard'),
    isChapterComplete: state.activeChapterId === 'chapter-02' && state.activeSceneId === 'chapter_end',
  }
}
