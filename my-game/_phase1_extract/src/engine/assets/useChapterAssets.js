import { useEffect, useState } from 'react'
import { preloadChapterAssetsById } from './assetManifest.js'

export function useChapterAssets(chapterId) {
  const [state, setState] = useState({ chapterId, ready: false, progress: 0 })

  useEffect(() => {
    let cancelled = false
    preloadChapterAssetsById(chapterId, ({ progress: current }) => {
      if (cancelled) return
      setState((previous) => ({
        ...previous,
        chapterId,
        progress: current,
      }))
    }).finally(() => {
      if (cancelled) return
      setState((previous) => ({
        ...previous,
        chapterId,
        ready: true,
      }))
    })
    return () => {
      cancelled = true
    }
  }, [chapterId])

  if (state.chapterId !== chapterId) {
    return { ready: false, progress: 0 }
  }
  return { ready: state.ready, progress: state.progress }
}

