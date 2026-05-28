import { useCallback, useEffect, useRef } from 'react'
import { eventBus } from '../../engine/events/eventBus.js'
import { GameEvents } from '../../engine/events/gameEvents.js'
import { setMapPosition } from '../../engine/state/actions.js'

export function useSceneTransitionRuntime({ dispatch, orchestrator, chapter, scene }) {
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
    if (nextSceneId) orchestrator.goToScene(nextSceneId)
  }, [orchestrator])

  const handleMapMove = useCallback((mapId, position) => {
    eventBus.emit(GameEvents.MAP_MOVED, { mapId, position })
    dispatch(setMapPosition(mapId, position))
  }, [dispatch])

  return {
    handleSceneDone,
    handleMapMove,
  }
}

