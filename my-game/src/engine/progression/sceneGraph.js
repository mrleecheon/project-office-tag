import { SceneModes } from '../contracts.js'

function collectTargets(scene, chapter = null) {
  const targets = []
  if (scene.next) targets.push(scene.next)
  if (scene.continuationNext) targets.push(scene.continuationNext)
  if (scene.returnTo) targets.push(scene.returnTo)
  if (scene.input?.next) targets.push(scene.input.next)
  for (const choice of scene.choices ?? []) targets.push(choice.next)
  if (scene.mode === SceneModes.RPG && chapter?.maps?.[scene.mapId]) {
    const map = chapter.maps[scene.mapId]
    if (map.triggers) targets.push(...Object.values(map.triggers))
    for (const spot of map.investigation?.spots ?? []) {
      if (spot.revisitScene) targets.push(spot.revisitScene)
    }
  }
  return targets.filter(Boolean)
}

export function validateChapterGraph(chapter) {
  const errors = []
  const sceneIds = new Set(Object.keys(chapter.scenes ?? {}))

  if (!chapter.startSceneId || !sceneIds.has(chapter.startSceneId)) {
    errors.push(`${chapter.id}: missing start scene ${chapter.startSceneId}`)
  }

  for (const [sceneId, scene] of Object.entries(chapter.scenes ?? {})) {
    if (!Object.values(SceneModes).includes(scene.mode)) {
      errors.push(`${chapter.id}.${sceneId}: invalid mode ${scene.mode}`)
    }
    if (scene.mode === SceneModes.RPG && !chapter.maps?.[scene.mapId]) {
      errors.push(`${chapter.id}.${sceneId}: missing map ${scene.mapId}`)
    }
    for (const target of collectTargets(scene, chapter)) {
      if (!sceneIds.has(target)) errors.push(`${chapter.id}.${sceneId}: missing target ${target}`)
    }
  }

  return errors
}

export function validateAllChapters(chapters) {
  return chapters.flatMap(validateChapterGraph)
}

export function getReachableSceneIds(chapter) {
  const seen = new Set()
  const visit = (sceneId) => {
    if (!sceneId || seen.has(sceneId)) return
    const scene = chapter.scenes?.[sceneId]
    if (!scene) return
    seen.add(sceneId)
    collectTargets(scene, chapter).forEach(visit)
  }
  visit(chapter.startSceneId)
  return seen
}
