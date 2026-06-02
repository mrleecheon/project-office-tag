import { DEMO_MODE, isDemoPlayablePosition } from '../../../config/demo.js'
import { chapterRegistry } from '../../../engine/progression/chapterRegistry.js'
import { saveService } from '../../../engine/save/saveService.js'
import { initialGameState } from '../../../engine/state/initialState.js'
import { validateRuntimeSceneIntegrity } from '../../../tools/validators/runtimeIntegrity.js'

function buildDevChapterState({ chapterId, sceneId }) {
  if (DEMO_MODE && !isDemoPlayablePosition(chapterId, sceneId ?? '')) {
    return { ...initialGameState, screen: 'demoEnd' }
  }
  const chapter = chapterRegistry.getChapter(chapterId)
  if (!chapter) return initialGameState

  const activeSceneId = sceneId && chapter.scenes?.[sceneId]
    ? sceneId
    : chapter.startSceneId

  return {
    ...initialGameState,
    screen: 'playing',
    activeChapterId: chapter.id,
    activeSceneId,
    nickname: '테스터',
    flags: ['devChapterBootstrap'],
    visitedScenes: [`${chapter.id}.${activeSceneId}`],
    routeHistory: [{ chapterId: chapter.id, sceneId: activeSceneId }],
  }
}

export function createBootstrapState({ afterOfficeIntro = false, devBootstrap = null } = {}) {
  if (devBootstrap) {
    saveService.clear()
    return buildDevChapterState(devBootstrap)
  }

  const loadedState = saveService.load()
  if (!loadedState) {
    if (afterOfficeIntro) {
      return {
        ...initialGameState,
        screen: 'playing',
        activeSceneId: 'entrance_bridge',
        flags: ['enteredThroughOfficeIntro'],
        visitedScenes: ['prologue.entrance_bridge'],
        routeHistory: [{ chapterId: 'prologue', sceneId: 'entrance_bridge' }],
      }
    }
    return initialGameState
  }
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
  if (DEMO_MODE && !isDemoPlayablePosition(loadedState.activeChapterId, loadedState.activeSceneId)) {
    return { ...initialGameState, ...loadedState, screen: 'demoEnd' }
  }
  return { ...initialGameState, ...loadedState }
}
