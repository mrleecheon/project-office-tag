import { useEffect, useMemo, useState } from 'react'
import { AccessibilityContext } from './accessibilityContext'

export function AccessibilityProvider({ children }) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReducedMotion(media.matches)
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = reducedMotion ? '1' : '0'
  }, [reducedMotion])

  const value = useMemo(() => ({ reducedMotion }), [reducedMotion])
  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
}
