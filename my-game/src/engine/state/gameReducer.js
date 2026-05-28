import { EffectTypes } from '../contracts.js'
import { GameActionTypes } from './actions.js'
import { initialGameState } from './initialState.js'

function addUnique(list, value) {
  if (!value || list.includes(value)) return list
  return [...list, value]
}

function applyEffect(state, effect) {
  switch (effect.type) {
    case EffectTypes.SET_NICKNAME:
      return { ...state, nickname: effect.nickname?.trim() || state.nickname }
    case EffectTypes.ADD_FLAG:
      return { ...state, flags: addUnique(state.flags, effect.flag) }
    case EffectTypes.ADD_ITEM:
      return { ...state, inventory: addUnique(state.inventory, effect.item) }
    case EffectTypes.ADD_SCORE:
      return {
        ...state,
        scores: {
          ...state.scores,
          [effect.score]: (state.scores[effect.score] ?? 0) + (effect.amount ?? 0),
        },
      }
    case EffectTypes.SET_SCENE:
      return { ...state, activeSceneId: effect.sceneId }
    case EffectTypes.SET_CHAPTER:
      if (state.chapterEnded) return state
      return {
        ...state,
        activeChapterId: effect.chapterId,
        activeSceneId: effect.sceneId ?? state.activeSceneId,
      }
    case EffectTypes.SET_CHAPTER_ENDED:
      return { ...state, chapterEnded: Boolean(effect.ended) }
    case EffectTypes.SET_MAP_POSITION:
      return {
        ...state,
        mapPositions: {
          ...state.mapPositions,
          [effect.mapId]: effect.position,
        },
      }
    default:
      return state
  }
}

export function gameReducer(state, action) {
  switch (action.type) {
    case GameActionTypes.SET_SCREEN:
      return { ...state, screen: action.screen }
    case GameActionTypes.SET_SCENE:
      return {
        ...state,
        activeSceneId: action.sceneId,
        visitedScenes: addUnique(state.visitedScenes, `${state.activeChapterId}.${action.sceneId}`),
        routeHistory: [...state.routeHistory, { chapterId: state.activeChapterId, sceneId: action.sceneId }],
      }
    case GameActionTypes.SET_CHAPTER:
      if (state.chapterEnded) return state
      return {
        ...state,
        activeChapterId: action.chapterId,
        activeSceneId: action.sceneId,
        visitedScenes: addUnique(state.visitedScenes, `${action.chapterId}.${action.sceneId}`),
        routeHistory: [...state.routeHistory, { chapterId: action.chapterId, sceneId: action.sceneId }],
      }
    case GameActionTypes.SET_NICKNAME:
      return { ...state, nickname: action.nickname?.trim() || state.nickname }
    case GameActionTypes.APPLY_EFFECTS:
      return action.effects.reduce(applyEffect, state)
    case GameActionTypes.SET_MAP_POSITION:
      return {
        ...state,
        mapPositions: {
          ...state.mapPositions,
          [action.mapId]: action.position,
        },
      }
    case GameActionTypes.LOAD_SAVE:
      return { ...initialGameState, ...action.saveState }
    case GameActionTypes.RESET:
      return initialGameState
    default:
      return state
  }
}
