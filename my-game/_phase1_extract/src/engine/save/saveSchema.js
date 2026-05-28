import { SaveVersion } from '../contracts.js'

const VALID_SCREENS = new Set(['nfc', 'boot', 'playing', 'chapterClear'])

function isStringArray(value) {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string')
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isValidScores(value) {
  return isPlainObject(value) && Object.values(value).every((score) => Number.isFinite(score))
}

function isValidMapPosition(value) {
  return isPlainObject(value)
    && typeof value.mapId === 'string'
    && Number.isInteger(value.row)
    && Number.isInteger(value.col)
    && isPlainObject(value.facing)
    && Number.isInteger(value.facing.dr)
    && Number.isInteger(value.facing.dc)
}

function isValidMapPositions(value) {
  return isPlainObject(value) && Object.values(value).every(isValidMapPosition)
}

function isValidRouteHistory(value) {
  return Array.isArray(value) && value.every((entry) => (
    isPlainObject(entry)
      && typeof entry.chapterId === 'string'
      && typeof entry.sceneId === 'string'
  ))
}

export function isValidSave(value) {
  return Boolean(
    value
      && value.version === SaveVersion
      && VALID_SCREENS.has(value.screen)
      && typeof value.activeChapterId === 'string'
      && typeof value.activeSceneId === 'string'
      && typeof value.nickname === 'string'
      && isStringArray(value.flags)
      && isStringArray(value.inventory)
      && isValidScores(value.scores)
      && isStringArray(value.visitedScenes)
      && isValidMapPositions(value.mapPositions)
      && isValidRouteHistory(value.routeHistory),
  )
}
