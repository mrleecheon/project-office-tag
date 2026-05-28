import { SaveVersion } from '../contracts.js'

export function migrateSave(save) {
  if (!save) return null
  const withVersion = !save.version ? { ...save, version: SaveVersion } : save
  return {
    ...withVersion,
    chapterEnded: Boolean(withVersion.chapterEnded),
  }
}
