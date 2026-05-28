import { chapter01 } from './chapter-01/index.js'
import { chapter02 } from './chapter-02/index.js'
import { prologueChapter } from './prologue/index.js'

export const chapters = [prologueChapter, chapter01, chapter02]

const chapterCache = {
  prologue: prologueChapter,
  'chapter-01': chapter01,
  'chapter-02': chapter02,
}

export async function preloadChapterContent(chapterId) {
  return Boolean(chapterCache[chapterId])
}
