export function validateRuntimeSceneIntegrity({ chapterRegistry, chapterId, sceneId }) {
  const chapter = chapterRegistry.getChapter(chapterId)
  if (!chapter) {
    return {
      ok: false,
      code: 'missing-chapter',
      message: `Unknown chapter "${chapterId}"`,
    }
  }
  const scene = chapter.scenes?.[sceneId]
  if (!scene) {
    return {
      ok: false,
      code: 'missing-scene',
      message: `Unknown scene "${chapterId}.${sceneId}"`,
      fallbackSceneId: chapter.startSceneId,
    }
  }
  if (scene.mapId && !chapter.maps?.[scene.mapId]) {
    return {
      ok: false,
      code: 'missing-map',
      message: `Map "${scene.mapId}" does not exist for scene "${chapterId}.${sceneId}"`,
      fallbackSceneId: chapter.startSceneId,
    }
  }
  if (scene.mode === 'vn' && scene.vnStage?.characters && !Array.isArray(scene.vnStage.characters)) {
    return {
      ok: false,
      code: 'invalid-vn-stage',
      message: `VN stage characters must be an array for scene "${chapterId}.${sceneId}"`,
      fallbackSceneId: chapter.startSceneId,
    }
  }
  if (scene.mode === 'chat' && scene.chatTheme && typeof scene.chatTheme !== 'object') {
    return {
      ok: false,
      code: 'invalid-chat-theme',
      message: `Chat theme must be object for scene "${chapterId}.${sceneId}"`,
      fallbackSceneId: chapter.startSceneId,
    }
  }
  return { ok: true, chapter, scene }
}

export function safeResolveSceneTransition({ chapterRegistry, chapterId, sceneId }) {
  const integrity = validateRuntimeSceneIntegrity({ chapterRegistry, chapterId, sceneId })
  if (integrity.ok) return { ok: true, sceneId }
  if (integrity.fallbackSceneId) {
    return {
      ok: true,
      sceneId: integrity.fallbackSceneId,
      recovered: true,
      error: integrity,
    }
  }
  return { ok: false, error: integrity }
}
