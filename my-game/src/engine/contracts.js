export const SceneModes = Object.freeze({
  CHAT: 'chat',
  VN: 'vn',
  RPG: 'rpg',
  SYSTEM: 'system',
  END: 'end',
})

export const EffectTypes = Object.freeze({
  SET_NICKNAME: 'setNickname',
  ADD_FLAG: 'addFlag',
  ADD_ITEM: 'addItem',
  SET_SCENE: 'setScene',
  SET_CHAPTER: 'setChapter',
  SET_MAP_POSITION: 'setMapPosition',
  ADD_SCORE: 'addScore',
  SET_CHAPTER_ENDED: 'setChapterEnded',
})

export const SaveVersion = 1

export function makeSceneId(chapterId, localId) {
  return `${chapterId}.${localId}`
}

export function makeMapPosition(mapId, row, col, facing = { dr: 0, dc: 1 }) {
  return { mapId, row, col, facing }
}
