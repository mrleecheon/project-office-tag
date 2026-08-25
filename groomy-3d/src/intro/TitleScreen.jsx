import { useMemo, useState } from 'react'
import AppProviders from '@groomy/game/app/AppProviders.jsx'
import OverlayLayer from '@groomy/game/app/routing/OverlayLayer.jsx'
import { saveService } from '@groomy/game/engine/save/saveService.js'
import SettingsPanel from '@groomy/game/features/system-ui/SettingsPanel.jsx'
import '@groomy/game/styles/globals.css'
import { useGameState } from '../state/gameStateStore.js'
import { isElectron, quitApp } from '../runtime/platform.js'
import './TitleScreen.css'

function readContinueSave() {
  const autosave = saveService.load()
  if (autosave) return autosave
  const latest = saveService.listSlots()[0]
  if (!latest) return null
  return saveService.loadSlot(latest.slotId)
}

export default function TitleScreen() {
  const beginIntroFromTitle = useGameState((s) => s.beginIntroFromTitle)
  const beginContinueFromSave = useGameState((s) => s.beginContinueFromSave)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [saveMenuOpen, setSaveMenuOpen] = useState(false)
  const [slots, setSlots] = useState(() => saveService.listSlots())
  const hasSave = useMemo(() => Boolean(readContinueSave()), [slots])
  const showQuit = isElectron()

  const refreshSlots = () => setSlots(saveService.listSlots())

  return (
    <div className="title-screen">
      <div className="title-screen-bg" />
      {!settingsOpen && (
        <div className="title-screen-body">
          <div className="title-screen-brand">
            <p className="title-screen-mark">GROOMY</p>
            <div className="title-screen-rule" />
            <p className="title-screen-sub">Caretaker Systems</p>
          </div>
          <nav className="title-screen-nav" aria-label="타이틀 메뉴">
            <button type="button" onClick={beginIntroFromTitle}>시작하기</button>
            <button
              type="button"
              disabled={!hasSave}
              className={hasSave ? undefined : 'is-disabled'}
              aria-disabled={!hasSave}
              onClick={() => {
                if (!hasSave) return
                beginContinueFromSave()
              }}
            >
              이어하기
            </button>
            <button type="button" onClick={() => setSettingsOpen(true)}>설정</button>
            {showQuit && (
              <button type="button" onClick={quitApp}>종료</button>
            )}
          </nav>
        </div>
      )}
      {settingsOpen && (
        <AppProviders>
          <div className="title-settings-layer">
            <div className="title-settings-bar">
              <button type="button" className="title-settings-close" onClick={() => { setSaveMenuOpen(false); setSettingsOpen(false) }}>
                닫기
              </button>
            </div>
            <div className="title-settings-body">
              <SettingsPanel
                onOpenSaveMenu={() => {
                  refreshSlots()
                  setSaveMenuOpen(true)
                }}
                onRestart={() => {
                  setSaveMenuOpen(false)
                  setSettingsOpen(false)
                  beginIntroFromTitle()
                }}
              />
            </div>
            <OverlayLayer
              openSaveMenu={saveMenuOpen}
              onCloseSaveMenu={() => setSaveMenuOpen(false)}
              slots={slots}
              onSaveSlot={(slotId) => {
                const current = saveService.load()
                if (!current) return
                saveService.saveSlot(slotId, current)
                refreshSlots()
                setSaveMenuOpen(false)
              }}
              onLoadSlot={(slotId) => {
                const loaded = saveService.loadSlot(slotId)
                if (!loaded) return
                refreshSlots()
                setSaveMenuOpen(false)
                beginContinueFromSave(slotId)
              }}
              onDeleteSlot={(slotId) => {
                saveService.clearSlot(slotId)
                refreshSlots()
              }}
              debugOpen={false}
              debugState={{}}
              scene={null}
              map={null}
              timeline={[]}
            />
          </div>
        </AppProviders>
      )}
    </div>
  )
}
