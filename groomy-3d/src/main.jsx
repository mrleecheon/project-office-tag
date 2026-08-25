import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { useGameState } from './state/gameStateStore.js'
import './index.css'

const boot = new URLSearchParams(window.location.search)
const from = boot.get('from')
if (boot.has('groomy') || boot.has('afterinspect') || from === 'groomy' || from === 'afterinspect') {
  const pork = boot.get('pork') === '1' || boot.get('pork') === 'y'
  useGameState.getState().beginPostInspect({ atePork: pork, nickname: boot.get('nick') })
} else if (boot.has('chipoffice') || from === 'chipoffice') {
  useGameState.getState().returnFromKangIsolMorning()
} else if (boot.has('office') || boot.has('inspect') || from === 'office' || from === 'inspect') {
  useGameState.getState().beginOfficeInspect()
} else if (boot.has('corridor') || from === 'corridor') {
  useGameState.getState().beginExplore()
} else if (boot.has('talkline') || from === 'talkline') {
  useGameState.getState().beginTalkline()
} else if (boot.has('choi') || from === 'choi') {
  useGameState.getState().beginChipOfficeAtChoi()
} else if (boot.has('guide') || boot.has('groomy2') || from === 'guide') {
  useGameState.getState().beginChipWakeGuideChoice()
} else if (boot.has('chipwake') || boot.has('wake') || from === 'chipwake' || from === 'wake') {
  useGameState.getState().beginOnboardingChannel()
} else if (boot.has('isolmorning') || from === 'isolmorning') {
  if (boot.get('talked') === '1') useGameState.setState({ isolTalked: true })
  useGameState.getState().beginKangIsolMorning()
} else if (boot.has('coffee') || from === 'coffee') {
  useGameState.getState().startOfficeCoffeeBrewing()
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
