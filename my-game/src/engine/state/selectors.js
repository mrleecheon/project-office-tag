export const selectActiveChapter = (state, registry) => registry.getChapter(state.activeChapterId)

export const selectActiveScene = (state, registry) => {
  const chapter = selectActiveChapter(state, registry)
  return chapter?.scenes?.[state.activeSceneId] ?? null
}

export const selectActiveMap = (state, registry) => {
  const chapter = selectActiveChapter(state, registry)
  const scene = selectActiveScene(state, registry)
  return scene?.mapId ? chapter?.maps?.[scene.mapId] : null
}

export const selectRuntimeContext = (state) => ({
  nickname: state.nickname,
  flags: state.flags,
  inventory: state.inventory,
  scores: state.scores,
})
