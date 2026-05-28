import { useMemo, useState } from 'react'
import { SceneModes } from '../../engine/contracts.js'
import { resolveUiText } from '../../content/manifests/text.js'
import { projectGroomyUiCopy } from '../../content/story/projectGroomyUi.js'
import { selectStoryStatus } from '../../game/runtime/story/selectStoryStatus.js'
import BottomTabBar from '../../features/system-ui/BottomTabBar.jsx'
import CluePanel from '../../features/system-ui/CluePanel.jsx'
import ProfilePanel from '../../features/system-ui/ProfilePanel.jsx'
import SettingsPanel from '../../features/system-ui/SettingsPanel.jsx'
import SceneViewport from './SceneViewport.jsx'

function resolveRoomTitle(scene) {
  if (!scene) return projectGroomyUiCopy.channelName
  if (scene.mode === SceneModes.VN) return resolveUiText('roomTitleVn', '비주얼 기록 재생 중')
  if (scene.mode === SceneModes.RPG) return resolveUiText('roomTitleRpg', '사내 위치 조사')
  return scene.systemMessage ? projectGroomyUiCopy.channelName : resolveUiText('roomTitlePersonal', '그루미 개인 채널')
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
}) {
  const [tabState, setTabState] = useState({ sceneId: null, tab: 'chat' })
  const isVn = scene?.mode === SceneModes.VN
  const activeTab = tabState.sceneId === scene?.id ? tabState.tab : 'chat'
  const storyStatus = useMemo(() => selectStoryStatus(state), [state])
  const selectTab = (tab) => setTabState({ sceneId: scene?.id ?? null, tab })

  return (
    <div className={`messengerAppShell ${isVn ? 'cinematic' : ''}`}>
      <header className="companyStatusHeader">
        <div>
          <small>{projectGroomyUiCopy.messengerName}</small>
          <strong>{resolveRoomTitle(scene)}</strong>
        </div>
        <aside>
          <span>{chapter?.label ?? resolveUiText('sessionLabel', 'SESSION')}</span>
          <em>{storyStatus.relationship.tone}</em>
        </aside>
      </header>

      <main className="messengerShellBody">
        <div
          className={`messengerViewport ${isVn || activeTab === 'chat' ? 'active' : ''}`}
          aria-hidden={!isVn && activeTab !== 'chat'}
        >
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
        </div>

        {!isVn && activeTab === 'profile' && (
          <ProfilePanel state={state} storyStatus={storyStatus} chapter={chapter} scene={scene} />
        )}
        {!isVn && activeTab === 'clues' && (
          <CluePanel storyStatus={storyStatus} />
        )}
        {!isVn && activeTab === 'settings' && (
          <SettingsPanel
            onOpenSaveMenu={onOpenSaveMenu}
            onRestart={onRestart}
          />
        )}
      </main>

      <BottomTabBar activeTab={activeTab} onSelect={selectTab} />
    </div>
  )
}
