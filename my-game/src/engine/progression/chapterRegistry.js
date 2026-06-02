import { chapters, demoPlayableChapters } from '../../content/chapters/index.js'
import { DEMO_MODE } from '../../config/demo.js'

const registryChapterList = DEMO_MODE ? demoPlayableChapters : chapters

export function createChapterRegistry(chapterList = registryChapterList) {
  const byId = new Map(chapterList.map((chapter) => [chapter.id, chapter]))

  return {
    chapters: chapterList,
    getChapter(chapterId) {
      return byId.get(chapterId) ?? null
    },
    getScene(chapterId, sceneId) {
      return byId.get(chapterId)?.scenes?.[sceneId] ?? null
    },
    getMap(chapterId, mapId) {
      return byId.get(chapterId)?.maps?.[mapId] ?? null
    },
    getNextChapter(chapterId) {
      const index = chapterList.findIndex((chapter) => chapter.id === chapterId)
      return index >= 0 ? chapterList[index + 1] ?? null : null
    },
  }
}

export const chapterRegistry = createChapterRegistry()
