import { useCallback, useMemo, useReducer, useState } from 'react'
import { DEMO_MODE, isDemoBlockedChapter } from '../../config/demo.js'
import { SceneModes } from '../../engine/contracts.js'
import { chapterRegistry } from '../../engine/progression/chapterRegistry.js'
import { loadSave, resetGame, setScreen } from '../../engine/state/actions.js'
import { gameReducer } from '../../engine/state/gameReducer.js'
import { selectActiveChapter, selectActiveMap, selectActiveScene, selectRuntimeContext } from '../../engine/state/selectors.js'
import { saveService } from '../../engine/save/saveService.js'
import { createBootstrapState } from '../../game/runtime/bootstrap/createBootstrapState.js'
import { parseDevBootstrapFromUrl } from '../../game/runtime/bootstrap/parseDevBootstrapFromUrl.js'
import { createSceneOrchestrator } from '../../game/runtime/orchestration/sceneOrchestrator.js'
import { useAudioRuntime } from '../runtime/useAudioRuntime.js'
import { useAssetPreload } from '../runtime/useAssetPreload.js'
import { useChapterPreload } from '../runtime/useChapterPreload.js'
import { useEventTimeline } from '../runtime/useEventTimeline.js'
import { usePersistentGameState } from '../runtime/usePersistentGameState.js'
import { useSystemUiRuntime } from '../runtime/useSystemUiRuntime.js'
import { usePersistenceRuntime } from '../runtime/usePersistenceRuntime.js'
import { useSceneTransitionRuntime } from '../runtime/useSceneTransitionRuntime.js'

const devBootstrapFromUrl = typeof window !== 'undefined'
  ? parseDevBootstrapFromUrl(window.location.search)
  : null

export function useGameRuntimeController({ afterOfficeIntro = false } = {}) {
  const [state, dispatch] = useReducer(
    gameReducer,
    { afterOfficeIntro, devBootstrap: devBootstrapFromUrl },
    ({ afterOfficeIntro: skipBoot, devBootstrap }) => createBootstrapState({
      afterOfficeIntro: devBootstrap ? false : skipBoot,
      devBootstrap,
    }),
  )
  const [clearCopy, setClearCopy] = useState(null)
  const [nextChapterId, setNextChapterId] = useState(null)
  const [runtimeError, setRuntimeError] = useState(null)
  const timeline = useEventTimeline()
  const { debugOpen, saveMenuOpen, setDebugOpen, setSaveMenuOpen } = useSystemUiRuntime({ screen: state.screen })

  usePersistentGameState({ state, saveService })
  useAudioRuntime()
  useChapterPreload({ chapterRegistry, activeChapterId: state.activeChapterId })
  useAssetPreload(state.activeChapterId)

  const chapter = selectActiveChapter(state, chapterRegistry)
  const scene = selectActiveScene(state, chapterRegistry)
  const map = selectActiveMap(state, chapterRegistry)
  const context = useMemo(() => selectRuntimeContext(state), [state])

  const orchestrator = useMemo(() => createSceneOrchestrator({
    dispatch,
    getState: () => state,
    setClearCopy,
    setNextChapterId,
    setRuntimeError,
  }), [dispatch, state])

  const restart = useCallback(() => {
    saveService.clear()
    setClearCopy(null)
    setNextChapterId(null)
    setRuntimeError(null)
    dispatch(resetGame())
  }, [])

  const { handleSceneDone, handleMapMove } = useSceneTransitionRuntime({ dispatch, orchestrator, chapter, scene })

  const handleClearContinue = useCallback(() => {
    if (state.chapterEnded) {
      restart()
      return
    }

    const nextChapter = chapterRegistry.getChapter(nextChapterId)
      ?? chapterRegistry.getNextChapter(state.activeChapterId)
    const hasPlayableNext = Boolean(nextChapter?.scenes?.[nextChapter.startSceneId])
      && !(DEMO_MODE && isDemoBlockedChapter(nextChapter?.id))

    if (hasPlayableNext) {
      setClearCopy(null)
      setNextChapterId(null)
      orchestrator.enterChapter(nextChapter.id)
      return
    }

    if (clearCopy?.continueLabel === '처음으로') {
      setClearCopy(null)
      setNextChapterId(null)
      restart()
      return
    }

    setClearCopy({
      kicker: 'SESSION COMPLETE',
      title: '세션 종료',
      body: `${state.nickname}님의 기록이 저장되었습니다.`,
      sub: '프롤로그부터 Chapter 5까지 플레이 가능합니다.',
      continueLabel: '처음으로',
    })
    setNextChapterId(null)
    dispatch(setScreen('chapterClear'))
  }, [clearCopy, dispatch, nextChapterId, orchestrator, restart, state.activeChapterId, state.chapterEnded, state.nickname])

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
  const isSystemScreen = !scene
    || state.screen !== 'playing'
    || state.screen === 'demoEnd'
    || scene.mode === SceneModes.END
    || Boolean(runtimeError)

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
