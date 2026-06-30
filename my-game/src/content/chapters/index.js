import { chapter01 } from './chapter-01/index.js'
import { chapter02 } from './chapter-02/index.js'
import { chapter03 } from './chapter-03/index.js'
import { chapter04 } from './chapter-04/index.js'
import { chapter05 } from './chapter-05/index.js'
import { prologueChapter } from './prologue/index.js'

export const chapters = [prologueChapter, chapter01, chapter02, chapter03, chapter04, chapter05]

const chapterCache = {
  prologue: prologueChapter,
  'chapter-01': chapter01,
  'chapter-02': chapter02,
  'chapter-03': chapter03,
  'chapter-04': chapter04,
  'chapter-05': chapter05,
}

export async function preloadChapterContent(chapterId) {
  return Boolean(chapterCache[chapterId])
}
