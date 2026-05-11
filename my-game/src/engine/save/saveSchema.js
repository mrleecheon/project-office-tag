import { SaveVersion } from '../contracts.js'

export function isValidSave(value) {
  return Boolean(
    value
      && value.version === SaveVersion
      && typeof value.activeChapterId === 'string'
      && typeof value.activeSceneId === 'string'
      && Array.isArray(value.flags)
      && Array.isArray(value.inventory),
  )
}
