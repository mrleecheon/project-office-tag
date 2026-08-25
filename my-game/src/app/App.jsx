import { useEffect } from 'react'
import GameRouter from './GameRouter'
import AppProviders from './AppProviders'
import ErrorBoundary from './ErrorBoundary'
import PhoneFrame from '../ui/layout/PhoneFrame'
import { parseDevBootstrapFromUrl } from '../game/runtime/bootstrap/parseDevBootstrapFromUrl.js'
import '../styles/globals.css'

const devChapterBootstrap = parseDevBootstrapFromUrl(
  typeof window !== 'undefined' ? window.location.search : '',
)

export default function App() {
  const bootstrapAfterOfficeIntro = !devChapterBootstrap

  useEffect(() => {
    const isEditableTarget = (target) => (
      target instanceof Element
      && Boolean(target.closest('input, textarea, [contenteditable="true"], [data-allow-copy="true"]'))
    )

    const blockSelection = (event) => {
      if (isEditableTarget(event.target)) return
      event.preventDefault()
    }

    const blockCopy = (event) => {
      if (isEditableTarget(event.target)) return
      event.preventDefault()
    }

    const blockDoubleClickSelect = (event) => {
      if (isEditableTarget(event.target)) return
      if (window.getSelection) window.getSelection()?.removeAllRanges()
      event.preventDefault()
    }
    const blockCopyShortcut = (event) => {
      if (isEditableTarget(event.target)) return
      const ctrlOrMeta = event.ctrlKey || event.metaKey
      if (!ctrlOrMeta) return
      if (event.key.toLowerCase() === 'c' || event.key.toLowerCase() === 'x') {
        event.preventDefault()
      }
    }

    document.addEventListener('selectstart', blockSelection)
    document.addEventListener('dragstart', blockSelection)
    document.addEventListener('copy', blockCopy)
    document.addEventListener('cut', blockCopy)
    document.addEventListener('dblclick', blockDoubleClickSelect)
    document.addEventListener('keydown', blockCopyShortcut)
    return () => {
      document.removeEventListener('selectstart', blockSelection)
      document.removeEventListener('dragstart', blockSelection)
      document.removeEventListener('copy', blockCopy)
      document.removeEventListener('cut', blockCopy)
      document.removeEventListener('dblclick', blockDoubleClickSelect)
      document.removeEventListener('keydown', blockCopyShortcut)
    }
  }, [])

  return (
    <ErrorBoundary>
      <AppProviders>
        <div className="appRoot">
          <PhoneFrame>
            <GameRouter afterOfficeIntro={bootstrapAfterOfficeIntro} />
          </PhoneFrame>
        </div>
      </AppProviders>
    </ErrorBoundary>
  )
}
