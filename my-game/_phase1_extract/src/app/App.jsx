import { useState } from 'react'
import GameRouter from './GameRouter'
import AppProviders from './AppProviders'
import ErrorBoundary from './ErrorBoundary'
import PhoneFrame from '../ui/layout/PhoneFrame'
import ProjectOfficeIntro from '../renderers/system/ProjectOfficeIntro.jsx'
import '../styles/globals.css'

export default function App() {
  const [introDone, setIntroDone] = useState(false)

  return (
    <ErrorBoundary>
      <AppProviders>
        <div className="appRoot">
          <PhoneFrame>
            {!introDone ? (
              <ProjectOfficeIntro onComplete={() => setIntroDone(true)} />
            ) : (
              <GameRouter />
            )}
          </PhoneFrame>
        </div>
      </AppProviders>
    </ErrorBoundary>
  )
}
