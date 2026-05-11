import GameRouter from './GameRouter'
import AppProviders from './AppProviders'
import ErrorBoundary from './ErrorBoundary'
import PhoneFrame from '../ui/layout/PhoneFrame'
import '../styles/globals.css'

export default function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <div className="appRoot">
          <PhoneFrame>
            <GameRouter />
          </PhoneFrame>
        </div>
      </AppProviders>
    </ErrorBoundary>
  )
}
