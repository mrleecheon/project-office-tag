import { useCallback, useState } from 'react'
import GameRouter from './GameRouter'
import AppProviders from './AppProviders'
import ErrorBoundary from './ErrorBoundary'
import PhoneFrame from '../ui/layout/PhoneFrame'
import ProjectOfficeIntro from '../renderers/system/ProjectOfficeIntro.jsx'
import { parseDevBootstrapFromUrl } from '../game/runtime/bootstrap/parseDevBootstrapFromUrl.js'
import '../styles/globals.css'

const INTRO_EXIT_MS = 600
const devChapterBootstrap = parseDevBootstrapFromUrl(
  typeof window !== 'undefined' ? window.location.search : '',
)

export default function App() {
  const bootstrapAfterOfficeIntro = !devChapterBootstrap
  const [introExiting, setIntroExiting] = useState(false)
  const [introDone, setIntroDone] = useState(Boolean(devChapterBootstrap))

  const handleIntroComplete = useCallback(() => {
    setIntroExiting(true)
    window.setTimeout(() => setIntroDone(true), INTRO_EXIT_MS)
  }, [])

  return (
    <ErrorBoundary>
      <AppProviders>
        <div className="appRoot">
          <PhoneFrame>
            <GameRouter afterOfficeIntro={bootstrapAfterOfficeIntro} />
            {!introDone ? (
              <ProjectOfficeIntro exiting={introExiting} onComplete={handleIntroComplete} />
            ) : null}
          </PhoneFrame>
        </div>
      </AppProviders>
    </ErrorBoundary>
  )
}
