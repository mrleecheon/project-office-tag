import { useCallback, useEffect, useRef } from 'react'
import { resolveChapter03SceneDoneTarget } from '../../content/chapters/chapter-03/deskContinuations.js'
import { eventBus } from '../../engine/events/eventBus.js'
import { GameEvents } from '../../engine/events/gameEvents.js'
import { setMapPosition } from '../../engine/state/actions.js'

export function useSceneTransitionRuntime({ dispatch, orchestrator, chapter, scene, getState, onInterceptScene }) {
  const sceneRef = useRef(scene)
  const chapterRef = useRef(chapter)

  useEffect(() => {
    sceneRef.current = scene
    chapterRef.current = chapter
  }, [chapter, scene])

  const handleSceneDone = useCallback((nextSceneId) => {
    const activeScene = sceneRef.current
    const activeChapter = chapterRef.current
    orchestrator.applySceneEffects(activeScene?.effects)
    if (activeScene?.end?.type === 'chapterComplete') {
      orchestrator.completeChapter(activeChapter, activeScene.end.nextChapterId)
      return
    }
    if (!nextSceneId) return

    let target = nextSceneId
    if (activeChapter?.id === 'chapter-03' && activeScene?.localId && getState) {
      target = resolveChapter03SceneDoneTarget(
        activeScene.localId,
        nextSceneId,
        getState(),
      ) ?? nextSceneId
    }

    if (onInterceptScene?.(target)) return
    orchestrator.goToScene(target)
  }, [getState, onInterceptScene, orchestrator])

  const handleMapMove = useCallback((mapId, position) => {
    eventBus.emit(GameEvents.MAP_MOVED, { mapId, position })
    dispatch(setMapPosition(mapId, position))
  }, [dispatch])

  return {
    handleSceneDone,
    handleMapMove,
  }
}

