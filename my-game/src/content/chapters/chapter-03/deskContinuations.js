/** Desk RPG: auto-advance to guardian recall when all four clues are resolved. */
export const CH3_DESK_COMPLETE_FLAGS = [
  'ch3FoundResignationLetter',
  'ch3_noticedPhotoAnomaly',
  'ch3_photoBranchResolved',
  'ch3FoundRecorderNotPlayed',
]

export function resolveChapter03SceneDoneTarget(localId, requestedNext, state) {
  if (localId !== 'recorder_found_clue') return requestedNext

  const flags = state.flags ?? {}
  const deskComplete = CH3_DESK_COMPLETE_FLAGS.every((flag) => flags[flag])
  if (deskComplete) return 'guardian_recall_vn'

  return requestedNext ?? 'desk_drawer_rpg'
}
