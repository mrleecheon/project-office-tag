import { useContext } from 'react'
import { AccessibilityContext } from './accessibilityContext'

export function useAccessibility() {
  return useContext(AccessibilityContext)
}
