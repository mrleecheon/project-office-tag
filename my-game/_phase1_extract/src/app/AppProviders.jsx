import { AccessibilityProvider } from './providers/AccessibilityProvider'
import { LocaleProvider } from './providers/LocaleProvider'

export default function AppProviders({ children }) {
  return (
    <LocaleProvider>
      <AccessibilityProvider>
        {children}
      </AccessibilityProvider>
    </LocaleProvider>
  )
}
