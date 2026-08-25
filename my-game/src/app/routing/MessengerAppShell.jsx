import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SceneModes } from '../../engine/contracts.js'
import { resolveUiText } from '../../content/manifests/text.js'
import { projectGroomyUiCopy } from '../../content/story/projectGroomyUi.js'
import { selectStoryStatus } from '../../game/runtime/story/selectStoryStatus.js'
import { emitAudioCue } from '../../engine/audio/audioBus.js'
import CluePanel from '../../features/system-ui/CluePanel.jsx'
import ProfilePanel from '../../features/system-ui/ProfilePanel.jsx'
import SettingsPanel from '../../features/system-ui/SettingsPanel.jsx'
import SceneViewport from './SceneViewport.jsx'
import { clearHoverAudioState, playHoverAudioOnce } from '../../ui/interaction/hoverAudio.js'

function resolveRoomTitle(scene) {
  if (!scene) return projectGroomyUiCopy.channelName
  if (scene.mode === SceneModes.VN) return resolveUiText('roomTitleVn', '비주얼 기록 재생 중')
  if (scene.mode === SceneModes.RPG) return resolveUiText('roomTitleRpg', '사내 위치 조사')
  if (scene.systemMessage) return scene.systemMessage
  return resolveUiText('roomTitlePersonal', '그루미 개인 채널')
}

export default function MessengerAppShell({
  scene,
  chapter,
  context,
  map,
  state,
  onChoice,
  onInput,
  onDone,
  onTrigger,
  onMove,
  onOpenSaveMenu,
  onRestart,
  children,
}) {
  const [homeOpen, setHomeOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const isImmersive = scene?.mode === SceneModes.VN || scene?.mode === SceneModes.RPG
  const isPersonalChannel = scene?.mode === SceneModes.CHAT && !scene?.systemMessage
  const storyStatus = useMemo(() => selectStoryStatus(state), [state])
  const overlayOpen = homeOpen || panelOpen || settingsOpen
  useEffect(() => {
    if (isImmersive) {
      setHomeOpen(false)
      setPanelOpen(null)
      setSettingsOpen(false)
    }
  }, [isImmersive])

  const openHome = () => {
    emitAudioCue('ui:open')
    setSettingsOpen(false)
    setPanelOpen(null)
    setHomeOpen(true)
  }

  const openPanel = (panelId) => {
    emitAudioCue('ui:confirm')
    setHomeOpen(false)
    setSettingsOpen(false)
    setPanelOpen(panelId)
  }

  const openSettings = () => {
    emitAudioCue('ui:open')
    setHomeOpen(false)
    setPanelOpen(null)
    setSettingsOpen(true)
  }

  const closeOverlay = () => {
    emitAudioCue('ui:close')
    setHomeOpen(false)
    setPanelOpen(null)
    setSettingsOpen(false)
  }

  return (
    <div className={`messengerAppShell ${isImmersive ? 'cinematic' : ''} ${scene?.overlay3d ? 'overlay3d' : ''} ${overlayOpen ? 'menuOverlayOpen' : ''}`}>
      <header className="companyStatusHeader">
        <div>
          <small>{projectGroomyUiCopy.messengerName}</small>
          <strong>{resolveRoomTitle(scene)}</strong>
        </div>
        <aside>
          <span>{chapter?.label ?? resolveUiText('sessionLabel', 'SESSION')}</span>
          <em>{storyStatus.relationship.tone}</em>
          {!isImmersive && (
            <button
              type="button"
              className="headerGearButton"
              aria-label="Open menu"
              onMouseEnter={(event) => playHoverAudioOnce(event)}
              onMouseLeave={(event) => clearHoverAudioState(event)}
              onFocus={(event) => playHoverAudioOnce(event)}
              onClick={openHome}
            >
              ⚙
            </button>
          )}
        </aside>
      </header>

      <main className="messengerShellBody">
        <section className={`sceneDeck ${isImmersive ? 'immersiveDeck' : ''} ${overlayOpen ? 'menuModalOpen' : ''}`}>
          <div
            className={`messengerViewport active ${isPersonalChannel ? 'personalChannel' : ''}`}
            aria-hidden={false}
          >
            {children ?? (
              <SceneViewport
                scene={scene}
                chapter={chapter}
                context={context}
                map={map}
                state={state}
                onChoice={onChoice}
                onInput={onInput}
                onDone={onDone}
                onTrigger={onTrigger}
                onMove={onMove}
              />
            )}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {overlayOpen && !isImmersive && (
              <motion.div
                key="menuModalBackdrop"
                className="menuModalBackdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
              />
            )}
            {homeOpen && !isImmersive && (
              <motion.section
                key="homeHub"
                className="floatingPanel modalPanel homeHubPanel"
                initial={{ opacity: 0, y: 10, scale: 0.965 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.975 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
              >
                <header>
                  <strong>HOME</strong>
                  <button type="button" onClick={closeOverlay}>×</button>
                </header>
                <div className="hubGrid">
                  <button type="button" className="hubActionCard" onClick={closeOverlay}><span>◉</span><b>Messenger</b></button>
                  <button type="button" className="hubActionCard" onClick={() => openPanel('profile')}><span>◎</span><b>Profile</b></button>
                  <button type="button" className="hubActionCard" onClick={() => openPanel('clues')}><span>◇</span><b>Clues</b></button>
                  <button type="button" className="hubActionCard" onClick={() => openPanel('archive')}><span>▣</span><b>Archive</b></button>
                  <button type="button" className="hubActionCard full" onClick={openSettings}><span>⚙</span><b>Settings</b></button>
                </div>
              </motion.section>
            )}
            {panelOpen && !isImmersive && (
              <motion.section
                key={`panel-${panelOpen}`}
                className="floatingPanel contentPanel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
              >
                <header>
                  <strong>{panelOpen === 'profile' ? 'PROFILE' : panelOpen === 'clues' ? 'CLUES' : 'ARCHIVE'}</strong>
                  <button type="button" onClick={closeOverlay}>×</button>
                </header>
                <div className="floatingPanelBody">
                  {panelOpen === 'profile' && <ProfilePanel state={state} storyStatus={storyStatus} chapter={chapter} scene={scene} />}
                  {panelOpen === 'clues' && <CluePanel storyStatus={storyStatus} />}
                  {panelOpen === 'archive' && (
                    <div className="archiveQuickPanel">
                      <p>세이브 / 로드 / 기록 관리</p>
                      <button type="button" onClick={() => { emitAudioCue('ui:open'); onOpenSaveMenu() }}>Open Save/Load</button>
                    </div>
                  )}
                </div>
              </motion.section>
            )}
            {settingsOpen && !isImmersive && (
              <motion.section
                key="settingsOverlay"
                className="floatingPanel modalPanel settingsOverlayPanel"
                initial={{ opacity: 0, y: 10, scale: 0.965 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.975 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
              >
                <header>
                  <strong>SETTINGS</strong>
                  <button type="button" onClick={closeOverlay}>×</button>
                </header>
                <div className="floatingPanelBody">
                  <SettingsPanel onOpenSaveMenu={onOpenSaveMenu} onRestart={onRestart} />
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </section>

      </main>
    </div>
  )
}
