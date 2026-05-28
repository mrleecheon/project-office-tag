import { useEffect } from 'react'
import { chapterRegistry } from '../../engine/progression/chapterRegistry.js'
import { preloadChapterAssets } from '../../game/runtime/preload/assetPreloader.js'

export function useAssetPreload(activeChapterId) {
  useEffect(() => {
    const current = chapterRegistry.getChapter(activeChapterId)
    preloadChapterAssets(current).catch(() => {})
    const next = chapterRegistry.getNextChapter(activeChapterId)
    preloadChapterAssets(next).catch(() => {})
  }, [activeChapterId])
}
