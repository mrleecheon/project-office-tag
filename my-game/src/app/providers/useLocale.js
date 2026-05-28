import { useContext } from 'react'
import { LocaleContext } from './localeContext'

export function useLocale() {
  return useContext(LocaleContext)
}
