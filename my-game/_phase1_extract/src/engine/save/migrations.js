import { SaveVersion } from '../contracts.js'

export function migrateSave(save) {
  if (!save) return null
  if (!save.version) return { ...save, version: SaveVersion }
  return save
}
