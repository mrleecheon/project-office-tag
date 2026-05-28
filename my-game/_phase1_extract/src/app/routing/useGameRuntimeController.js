import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { SceneModes } from '../../engine/contracts.js'
import { chapterRegistry } from '../../engine/progression/chapterRegistry.js'
import { loadSave, resetGame, setScreen } from '../../engine/state/actions.js'
import { gameReducer } from '../../engine/state/gameReducer.js'
import { selectActiveChapter, selectActiveMap, selectActiveScene, selectRuntimeContext } from '../../engine/state/selectors.js'
import { saveService } from '../../engine/save/saveService.js'
import { createBootstrapState } from '../../game/runtime/bootstrap/createBootstrapState.js'
import { createSceneOrchestrator } from '../../game/runtime/orchestration/sceneOrchestrator.js'
import { useAudioRuntime } from '../runtime/useAudioRuntime.js'
import { useAssetPreload } from '../runtime/useAssetPreload.js'
import { useChapterPreload } from '../runtime/useChapterPreload.js'
import { useEventTimeline } from '../runtime/useEventTimeline.js'
import { usePersistentGameState } from '../runtime/usePersistentGameState.js'
import { useSystemUiRuntime } from '../runtime/useSystemUiRuntime.js'
import { usePersistenceRuntime } from '../runtime/usePersistenceRuntime.js'
import { useSceneTransitionRuntime } from '../runtime/useSceneTransitionRuntime.js'

export function useGameRuntimeController() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createBootstrapState)
  const [clearCopy, setClearCopy] = useState(null)
  const [nextChapterId, setNextChapterId] = useState(null)
  const [runtimeError, setRuntimeError] = useState(null)
  const timeline = useEventTimeline()
  const { debugOpen, saveMenuOpen, setDebugOpen, setSaveMenuOpen } = useSystemUiRuntime({ screen: state.screen })

  usePersistentGameState({ state, saveService })
  useAudioRuntime()
  useChapterPreload({ chapterRegistry, activeChapterId: state.activeChapterId })
  useAssetPreload(state.activeChapterId)

  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

  const chapter = selectActiveChapter(state, chapterRegistry)
  const scene = selectActiveScene(state, chapterRegistry)
  const map = selectActiveMap(state, chapterRegistry)
  const context = useMemo(() => selectRuntimeContext(state), [state])

  const orchestrator = useMemo(() => createSceneOrchestrator({
    dispatch,
    getState: () => stateRef.current,
    setClearCopy,
    setNextChapterId,
    setRuntimeError,
  }), [dispatch])

  const restart = useCallback(() => {
    saveService.clear()
    setClearCopy(null)
    setNextChapterId(null)
    setRuntimeError(null)
    dispatch(resetGame())
  }, [])

  const { handleSceneDone, handleMapMove } = useSceneTransitionRuntime({ dispatch, orchestrator, chapter, scene })

  const handleClearContinue = useCallback(() => {
    const nextChapter = chapterRegistry.getChapter(nextChapterId) ?? chapterRegistry.getNextChapter(state.activeChapterId)
    setClearCopy(null)
    setNextChapterId(null)
    if (nextChapter) orchestrator.enterChapter(nextChapter.id)
    else dispatch(setScreen('playing'))
  }, [dispatch, nextChapterId, orchestrator, state.activeChapterId])

  const {
    slots,
    handleSaveSlot,
    handleLoadSlot: loadSlotInternal,
    handleDeleteSlot,
  } = usePersistenceRuntime({ saveService, state, dispatch, loadSave, setRuntimeError })

  const handleLoadSlot = useCallback((slotId) => {
    loadSlotInternal(slotId)
    setSaveMenuOpen(false)
  }, [loadSlotInternal, setSaveMenuOpen])

  const handleNfcDone = useCallback(() => {
    dispatch(setScreen('boot'))
  }, [])

  const handleBootDone = useCallback(() => {
    dispatch(setScreen('playing'))
  }, [])

  const handleRuntimeErrorContinue = useCallback(() => {
    setRuntimeError(null)
    dispatch(setScreen('playing'))
  }, [])

  const screenMode = state.screen === 'playing' ? scene?.mode : state.screen
  const isSystemScreen = !scene || state.screen !== 'playing' || scene.mode === SceneModes.END || Boolean(runtimeError)

  return {
    state,
    chapter,
    scene,
    map,
    context,
    slots,
    clearCopy,
    debugOpen,
    saveMenuOpen,
    runtimeError,
    timeline,
    screenMode,
    isSystemScreen,
    restart,
    setRuntimeError,
    setSaveMenuOpen,
    orchestrator,
    handleSceneDone,
    handleMapMove,
    handleClearContinue,
    handleSaveSlot,
    handleLoadSlot,
    handleDeleteSlot,
    handleNfcDone,
    handleBootDone,
    handleRuntimeErrorContinue,
    setDebugOpen,
  }
}
