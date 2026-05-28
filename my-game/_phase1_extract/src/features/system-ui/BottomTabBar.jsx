import { resolveUiText } from '../../content/manifests/text.js'

const tabs = [
  { id: 'chat', labelKey: 'tabChat', badgeKey: 'tabChatBadge', fallbackLabel: '채팅', fallbackBadge: 'Talk' },
  { id: 'profile', labelKey: 'tabProfile', badgeKey: 'tabProfileBadge', fallbackLabel: '프로필', fallbackBadge: 'ID' },
  { id: 'clues', labelKey: 'tabClues', badgeKey: 'tabCluesBadge', fallbackLabel: '단서', fallbackBadge: 'Log' },
  { id: 'settings', labelKey: 'tabSettings', badgeKey: 'tabSettingsBadge', fallbackLabel: '설정', fallbackBadge: 'Sys' },
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
          onClick={() => onSelect(tab.id)}
        >
          <span>{resolveUiText(tab.badgeKey, tab.fallbackBadge)}</span>
          {resolveUiText(tab.labelKey, tab.fallbackLabel)}
        </button>
      ))}
    </nav>
  )
}
