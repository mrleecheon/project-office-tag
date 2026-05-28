import { useEffect, useRef } from 'react'
import { preloadChapterContent } from '../../content/chapters/index.js'

export function useChapterPreload({ chapterRegistry, activeChapterId }) {
  const loadedRef = useRef(new Set())

  useEffect(() => {
    const nextChapter = chapterRegistry.getNextChapter(activeChapterId)
    if (!nextChapter) return
    if (loadedRef.current.has(nextChapter.id)) return
    preloadChapterContent(nextChapter.id).then((loaded) => {
      if (loaded) loadedRef.current.add(nextChapter.id)
    }).catch(() => {})
  }, [activeChapterId, chapterRegistry])
}
