export const GameActionTypes = Object.freeze({
  SET_SCREEN: 'SET_SCREEN',
  SET_SCENE: 'SET_SCENE',
  SET_CHAPTER: 'SET_CHAPTER',
  SET_NICKNAME: 'SET_NICKNAME',
  APPLY_EFFECTS: 'APPLY_EFFECTS',
  SET_MAP_POSITION: 'SET_MAP_POSITION',
  LOAD_SAVE: 'LOAD_SAVE',
  RESET: 'RESET',
})

export const setScreen = (screen) => ({ type: GameActionTypes.SET_SCREEN, screen })
export const setScene = (sceneId) => ({ type: GameActionTypes.SET_SCENE, sceneId })
export const setChapter = (chapterId, sceneId) => ({ type: GameActionTypes.SET_CHAPTER, chapterId, sceneId })
export const setNickname = (nickname) => ({ type: GameActionTypes.SET_NICKNAME, nickname })
export const applyEffects = (effects = []) => ({ type: GameActionTypes.APPLY_EFFECTS, effects })
export const setMapPosition = (mapId, position) => ({ type: GameActionTypes.SET_MAP_POSITION, mapId, position })
export const loadSave = (saveState) => ({ type: GameActionTypes.LOAD_SAVE, saveState })
export const resetGame = () => ({ type: GameActionTypes.RESET })
