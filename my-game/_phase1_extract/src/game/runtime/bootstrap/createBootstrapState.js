import { chapterRegistry } from '../../../engine/progression/chapterRegistry.js'
import { saveService } from '../../../engine/save/saveService.js'
import { initialGameState } from '../../../engine/state/initialState.js'
import { validateRuntimeSceneIntegrity } from '../../../tools/validators/runtimeIntegrity.js'

export function createBootstrapState() {
  const loadedState = saveService.load()
  if (!loadedState) return initialGameState
  const integrity = validateRuntimeSceneIntegrity({
    chapterRegistry,
    chapterId: loadedState.activeChapterId,
    sceneId: loadedState.activeSceneId,
  })
  if (!integrity.ok) {
    const chapter = chapterRegistry.getChapter(loadedState.activeChapterId)
    if (!chapter) return initialGameState
    return { ...initialGameState, ...loadedState, activeSceneId: chapter.startSceneId }
  }
  return { ...initialGameState, ...loadedState }
}
