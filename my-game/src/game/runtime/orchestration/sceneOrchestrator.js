import { EffectTypes } from '../../../engine/contracts.js'
import { chapterRegistry } from '../../../engine/progression/chapterRegistry.js'
import { resolveChapterClearCopy } from '../../../engine/progression/endings.js'
import { eventBus } from '../../../engine/events/eventBus.js'
import { GameEvents } from '../../../engine/events/gameEvents.js'
import { applyEffects, setChapter, setScene, setScreen } from '../../../engine/state/actions.js'
import { canEnterScene } from '../../transitions/transitionPolicy.js'
import { safeResolveSceneTransition } from '../../../tools/validators/runtimeIntegrity.js'

function resolveNextChapterId(currentChapterId, explicitNextChapterId) {
  return explicitNextChapterId ?? chapterRegistry.getNextChapter(currentChapterId)?.id ?? currentChapterId
}

export function createSceneOrchestrator({ dispatch, getState, setClearCopy, setNextChapterId, setRuntimeError }) {
  function applySceneEffects(effects) {
    if (!effects?.length) return
    dispatch(applyEffects(effects))
  }

  function goToScene(sceneId) {
    const state = getState()
    if (!sceneId) return false
    const transition = safeResolveSceneTransition({
      chapterRegistry,
      chapterId: state.activeChapterId,
      sceneId,
    })
    if (!transition.ok) {
      setRuntimeError(transition.error)
      return false
    }
    const targetScene = chapterRegistry.getScene(state.activeChapterId, transition.sceneId)
    const allowed = canEnterScene({ state, targetScene })
    if (!allowed.ok) {
      if (allowed.reason !== 'requirements-failed') {
        setRuntimeError({
          code: allowed.reason,
          message: '씬 진입 조건을 만족하지 못했습니다.',
        })
      }
      return false
    }
    if (transition.recovered) setRuntimeError(transition.error)
    eventBus.emit(GameEvents.SCENE_ENTERED, { chapterId: state.activeChapterId, sceneId: transition.sceneId })
    dispatch(setScene(transition.sceneId))
    applySceneEffects(targetScene?.effects)
    return true
  }

  function enterChapter(chapterId) {
    if (getState().chapterEnded) return false
    const nextChapter = chapterRegistry.getChapter(chapterId)
    if (!nextChapter) return false
    dispatch(setChapter(nextChapter.id, nextChapter.startSceneId))
    dispatch(setScreen('playing'))
    return true
  }

  function completeChapter(completedChapter, explicitNextChapterId) {
    const state = getState()
    if (state.chapterEnded) {
      setClearCopy(resolveChapterClearCopy(completedChapter.id, state))
      setNextChapterId(null)
      dispatch(setScreen('chapterClear'))
      return null
    }
    const nextChapterId = resolveNextChapterId(completedChapter.id, explicitNextChapterId)
    setClearCopy(resolveChapterClearCopy(completedChapter.id, state))
    setNextChapterId(nextChapterId)
    dispatch(setScreen('chapterClear'))
    return nextChapterId
  }

  function handleChoice(choice) {
    const state = getState()
    eventBus.emit(GameEvents.CHOICE_SELECTED, {
      chapterId: state.activeChapterId,
      choice: choice.text,
      next: choice.next,
    })
    applySceneEffects(choice.effects)
    goToScene(choice.next)
  }

  function handleInput(input, value) {
    const state = getState()
    if (input?.type === 'nickname') {
      dispatch(applyEffects([{ type: EffectTypes.SET_NICKNAME, nickname: value }]))
    }
    eventBus.emit(GameEvents.INPUT_SUBMITTED, {
      chapterId: state.activeChapterId,
      input: input?.type,
      value,
    })
    goToScene(input.next)
  }

  return {
    applySceneEffects,
    goToScene,
    enterChapter,
    completeChapter,
    handleChoice,
    handleInput,
  }
}
