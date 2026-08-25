import { chapterRegistry } from '../../../engine/progression/chapterRegistry.js'
import { saveService } from '../../../engine/save/saveService.js'
import { initialGameState } from '../../../engine/state/initialState.js'
import { validateRuntimeSceneIntegrity } from '../../../tools/validators/runtimeIntegrity.js'

function buildDevChapterState({ chapterId, sceneId }) {
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

export function createBootstrapState({
  afterOfficeIntro = false,
  skipLoad = false,
  startSceneId = null,
  startChapterId = null,
  nickname = null,
  devBootstrap = null,
} = {}) {
  if (devBootstrap) {
    saveService.clear()
    return buildDevChapterState(devBootstrap)
  }

  if (startChapterId) {
    const chapter = chapterRegistry.getChapter(startChapterId)
    const sceneId = startSceneId || chapter?.startSceneId
    const saved = saveService.load()
    return {
      ...initialGameState,
      ...(saved ?? {}),
      screen: 'playing',
      chapterEnded: false,
      activeChapterId: startChapterId,
      activeSceneId: sceneId,
      nickname: nickname || saved?.nickname || initialGameState.nickname,
      flags: [...new Set([...(saved?.flags ?? []), 'enteredThroughOfficeIntro'])],
      visitedScenes: [...new Set([...(saved?.visitedScenes ?? []), `${startChapterId}.${sceneId}`])],
      routeHistory: [...(saved?.routeHistory ?? []), { chapterId: startChapterId, sceneId }],
    }
  }

  const loadedState = skipLoad ? null : saveService.load()
  if (!loadedState) {
    if (afterOfficeIntro) {
      const sceneId = startSceneId || 'entrance_bridge'
      return {
        ...initialGameState,
        screen: 'playing',
        activeSceneId: sceneId,
        flags: ['enteredThroughOfficeIntro'],
        visitedScenes: [`prologue.${sceneId}`],
        routeHistory: [{ chapterId: 'prologue', sceneId }],
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
  return { ...initialGameState, ...loadedState }
}
