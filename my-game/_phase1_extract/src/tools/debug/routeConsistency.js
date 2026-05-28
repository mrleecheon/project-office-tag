function collectTargets(scene, chapter) {
  const targets = new Set()
  if (scene.next) targets.add(scene.next)
  if (scene.returnTo) targets.add(scene.returnTo)
  if (scene.input?.next) targets.add(scene.input.next)
  for (const choice of scene.choices ?? []) {
    if (choice?.next) targets.add(choice.next)
  }
  if (scene.mapId && chapter.maps?.[scene.mapId]?.triggers) {
    for (const target of Object.values(chapter.maps[scene.mapId].triggers)) {
      if (target) targets.add(target)
    }
  }
  return targets
}

export function analyzeRouteConsistency({ chapter, routeHistory }) {
  if (!chapter || !Array.isArray(routeHistory)) return []
  const warnings = []
  const chapterRoute = routeHistory.filter((entry) => entry.chapterId === chapter.id)
  for (let i = 1; i < chapterRoute.length; i += 1) {
    const previous = chapterRoute[i - 1]
    const current = chapterRoute[i]
    const scene = chapter.scenes?.[previous.sceneId]
    if (!scene) continue
    const validTargets = collectTargets(scene, chapter)
    if (!validTargets.has(current.sceneId) && current.sceneId !== previous.sceneId) {
      warnings.push(`${previous.sceneId} -> ${current.sceneId} 전이가 선언되지 않았습니다.`)
    }
  }
  return warnings.slice(-5)
}
