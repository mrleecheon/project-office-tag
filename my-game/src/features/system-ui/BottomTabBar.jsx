import { resolveUiText } from '../../content/manifests/text.js'
import { emitAudioCue } from '../../engine/audio/audioBus.js'
import { clearHoverAudioState, playHoverAudioOnce } from '../../ui/interaction/hoverAudio.js'

const tabs = [
  { id: 'chat', icon: '◉', labelKey: 'tabChat', badgeKey: 'tabChatBadge', fallbackLabel: '채팅', fallbackBadge: 'COMMS' },
  { id: 'profile', icon: '◎', labelKey: 'tabProfile', badgeKey: 'tabProfileBadge', fallbackLabel: '프로필', fallbackBadge: 'ID' },
  { id: 'clues', icon: '◇', labelKey: 'tabClues', badgeKey: 'tabCluesBadge', fallbackLabel: '단서', fallbackBadge: 'EVID' },
  { id: 'settings', icon: '▣', labelKey: 'tabSettings', badgeKey: 'tabSettingsBadge', fallbackLabel: '설정', fallbackBadge: 'CTRL' },
]

export default function BottomTabBar({ activeTab, onSelect }) {
  return (
    <nav className="bottomTabBar" aria-label={resolveUiText('bottomTabAria', 'GROOMY OFFICE 하단 탭')}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={activeTab === tab.id ? 'active' : ''}
          aria-current={activeTab === tab.id ? 'page' : undefined}
          onMouseEnter={(event) => playHoverAudioOnce(event)}
          onMouseLeave={(event) => clearHoverAudioState(event)}
          onFocus={(event) => playHoverAudioOnce(event)}
          onClick={() => {
            emitAudioCue(activeTab === tab.id ? 'ui:click' : 'ui:confirm')
            onSelect(tab.id)
          }}
        >
          <span className="navGlyph">{tab.icon}</span>
          <b>{resolveUiText(tab.badgeKey, tab.fallbackBadge)}</b>
          <small>{resolveUiText(tab.labelKey, tab.fallbackLabel)}</small>
        </button>
      ))}
    </nav>
  )
}
