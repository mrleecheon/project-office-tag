import { useEffect, useRef } from 'react'

const SAVE_DEBOUNCE_MS = 450

export function usePersistentGameState({ state, saveService }) {
  const timerRef = useRef(null)

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      saveService.save(state)
      timerRef.current = null
    }, SAVE_DEBOUNCE_MS)
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [saveService, state])
}
