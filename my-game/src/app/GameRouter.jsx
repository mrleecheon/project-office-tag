import { AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useReducer, useState } from 'react'
import { EffectTypes, SceneModes } from '../engine/contracts'
import { chapterRegistry } from '../engine/progression/chapterRegistry'
import { resolveChapterClearCopy } from '../engine/progression/endings'
import { applyEffects, resetGame, setChapter, setMapPosition, setNickname, setScene, setScreen } from '../engine/state/actions'
import { gameReducer } from '../engine/state/gameReducer'
import { initialGameState } from '../engine/state/initialState'
import { selectActiveChapter, selectActiveMap, selectActiveScene, selectRuntimeContext } from '../engine/state/selectors'
import { saveService } from '../engine/save/saveService'
import ChatScene from '../renderers/chat/ChatScene'
import RpgScene from '../renderers/rpg/RpgScene'
import BootScreen from '../renderers/system/BootScreen'
import ChapterClearScreen from '../renderers/system/ChapterClearScreen'
import NfcScreen from '../renderers/system/NfcScreen'
import VnScene from '../renderers/vn/VnScene'

function normalizeEffects(effects = []) {
  return effects
}

function resolveNextChapterId(currentChapterId, explicitNextChapterId) {
  return explicitNextChapterId ?? chapterRegistry.getNextChapter(currentChapterId)?.id ?? currentChapterId
}

export default function GameRouter() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState)
  const [clearCopy, setClearCopy] = useState(null)
  const chapter = selectActiveChapter(state, chapterRegistry)
  const scene = selectActiveScene(state, chapterRegistry)
  const map = selectActiveMap(state, chapterRegistry)
  const context = selectRuntimeContext(state)

  useEffect(() => {
    saveService.save(state)
  }, [state])

  const restart = useCallback(() => {
    saveService.clear()
    dispatch(resetGame())
  }, [])

  const goToScene = useCallback((sceneId) => {
    if (!sceneId) return
    dispatch(setScene(sceneId))
  }, [])

  const enterChapter = useCallback((chapterId) => {
    const nextChapter = chapterRegistry.getChapter(chapterId)
    if (!nextChapter) return
    dispatch(setChapter(nextChapter.id, nextChapter.startSceneId))
    dispatch(setScreen('playing'))
  }, [])

  const completeChapter = useCallback((completedChapter, explicitNextChapterId) => {
    const nextChapterId = resolveNextChapterId(completedChapter.id, explicitNextChapterId)
    setClearCopy(resolveChapterClearCopy(completedChapter.id, state))
    dispatch(setScreen('chapterClear'))
    return nextChapterId
  }, [state])

  const applySceneEffects = useCallback((effects) => {
    if (effects?.length) dispatch(applyEffects(normalizeEffects(effects)))
  }, [])

  const handleChoice = useCallback((choice) => {
    applySceneEffects(choice.effects)
    goToScene(choice.next)
  }, [applySceneEffects, goToScene])

  const handleInput = useCallback((input, value) => {
    if (input?.type === 'nickname') {
      dispatch(setNickname(value))
      dispatch(applyEffects([{ type: EffectTypes.SET_NICKNAME, nickname: value }]))
    }
    goToScene(input.next)
  }, [goToScene])

  const handleSceneDone = useCallback((nextSceneId) => {
    applySceneEffects(scene?.effects)
    if (scene?.end?.type === 'chapterComplete') {
      completeChapter(chapter, scene.end.nextChapterId)
      return
    }
    if (nextSceneId) goToScene(nextSceneId)
  }, [applySceneEffects, chapter, completeChapter, goToScene, scene])

  const handleMapMove = useCallback((mapId, position) => {
    dispatch(setMapPosition(mapId, position))
  }, [])

  const handleClearContinue = useCallback(() => {
    const nextChapter = chapterRegistry.getNextChapter(state.activeChapterId)
    if (nextChapter) enterChapter(nextChapter.id)
    else dispatch(setScreen('playing'))
  }, [enterChapter, state.activeChapterId])

  if (state.screen === 'nfc') {
    return <NfcScreen onDone={() => dispatch(setScreen('boot'))} />
  }

  if (state.screen === 'boot') {
    return <BootScreen lines={chapter?.bootLines ?? []} onDone={() => dispatch(setScreen('playing'))} />
  }

  if (state.screen === 'chapterClear') {
    return <ChapterClearScreen copy={clearCopy} onContinue={handleClearContinue} onRestart={restart} />
  }

  return (
    <AnimatePresence mode="wait">
      {scene?.mode === SceneModes.CHAT && (
        <ChatScene
          key={scene.id}
          scene={scene}
          context={context}
          onChoice={handleChoice}
          onInput={handleInput}
          onAutoNext={handleSceneDone}
        />
      )}
      {scene?.mode === SceneModes.VN && (
        <VnScene key={scene.id} scene={scene} context={context} onDone={handleSceneDone} />
      )}
      {scene?.mode === SceneModes.RPG && (
        <RpgScene
          key={scene.id}
          chapter={chapter}
          scene={scene}
          map={map}
          state={state}
          onTrigger={goToScene}
          onMove={handleMapMove}
        />
      )}
      {scene?.mode === SceneModes.END && (
        <ChapterClearScreen
          key={scene.id}
          copy={resolveChapterClearCopy(chapter.id, state)}
          onContinue={() => enterChapter(scene.nextChapterId)}
          onRestart={restart}
        />
      )}
    </AnimatePresence>
  )
}
