/** Demo build flag — true only on the `demo` branch. */
export const DEMO_MODE = true

export const DEMO_GATE_SCENE_ID = 'floor3_vn'

const DEMO_BLOCKED_CHAPTER_IDS = new Set([
  'chapter-02',
  'chapter-03',
  'chapter-04',
  'chapter-05',
])

/** Chapter-01 scenes at or after the 3F VN gate (not playable in demo). */
const CH01_POST_GATE_SCENE_IDS = new Set([
  DEMO_GATE_SCENE_ID,
  'floor3_hub',
  'clue_blood',
  'clue_camera',
  'exit_floor3',
  'deduction_chat',
  'chapter_end',
])

export function isDemoBlockedChapter(chapterId) {
  return DEMO_MODE && DEMO_BLOCKED_CHAPTER_IDS.has(chapterId)
}

export function isChapter01PastDemoGate(sceneId) {
  return CH01_POST_GATE_SCENE_IDS.has(sceneId)
}

export function isDemoPlayablePosition(chapterId, sceneId) {
  if (!DEMO_MODE) return true
  if (isDemoBlockedChapter(chapterId)) return false
  if (chapterId === 'chapter-01' && isChapter01PastDemoGate(sceneId)) return false
  return true
}

/** Transition target should show the demo end screen instead of entering play. */
export function shouldShowDemoEnd(chapterId, sceneId) {
  if (!DEMO_MODE) return false
  if (isDemoBlockedChapter(chapterId)) return true
  if (chapterId === 'chapter-01' && sceneId === DEMO_GATE_SCENE_ID) return true
  if (chapterId === 'chapter-01' && isChapter01PastDemoGate(sceneId)) return true
  return false
}

export const DEMO_TUMBLR_URL = '#'
