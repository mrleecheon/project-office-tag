const CHAPTER_ALIASES = {
  '1': 'chapter-01',
  '01': 'chapter-01',
  'chapter-01': 'chapter-01',
  '2': 'chapter-02',
  '02': 'chapter-02',
  'chapter-02': 'chapter-02',
  '3': 'chapter-03',
  '03': 'chapter-03',
  'chapter-03': 'chapter-03',
  '4': 'chapter-04',
  '04': 'chapter-04',
  'chapter-04': 'chapter-04',
  '5': 'chapter-05',
  '05': 'chapter-05',
  'chapter-05': 'chapter-05',
}

import { DEMO_MODE, isDemoPlayablePosition } from '../../../config/demo.js'

/**
 * Dev-only: ?chapter=2 or ?chapter=chapter-02&scene=floor5_rpg
 */
export function parseDevBootstrapFromUrl(search = '') {
  if (!import.meta.env.DEV) return null

  const params = new URLSearchParams(search)
  const chapterParam = params.get('chapter')
  if (!chapterParam) return null

  const chapterId = CHAPTER_ALIASES[chapterParam.trim()]
  if (!chapterId) return null
  if (DEMO_MODE && !isDemoPlayablePosition(chapterId, params.get('scene')?.trim() ?? '')) return null

  const sceneId = params.get('scene')?.trim() || null
  return { chapterId, sceneId }
}
