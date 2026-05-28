import { useEffect, useState } from 'react'

export function useSystemUiRuntime({ screen }) {
  const [debugOpen, setDebugOpen] = useState(false)
  const [saveMenuOpen, setSaveMenuOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && screen === 'playing') {
        setSaveMenuOpen((value) => !value)
      }
      if (import.meta.env.DEV && event.key === '`') {
        setDebugOpen((value) => !value)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [screen])

  return {
    debugOpen,
    saveMenuOpen,
    setDebugOpen,
    setSaveMenuOpen,
  }
}

