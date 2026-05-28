import { characters } from '../../content/world/characters'
import { resolveUiText } from '../../content/manifests/text'

export default function VnDialogBox({ line, shown, done }) {
  const char = characters[line?.char] ?? characters.system
  const isNarration = line?.isNarration || line?.char === 'system'

  return (
    <div className={`vnBox ${line?.important ? 'important' : ''}`}>
      <strong className="vnSpeakerTag">
        {line?.important && <span>!</span>}
        {isNarration ? '나레이션' : char.name}
        {!isNarration && <small>{char.dept}</small>}
      </strong>
      <p>
        {shown}
        {!done && <b />}
      </p>
      {done && <em>{resolveUiText('vnTapToContinue', '▶ 탭하여 계속')}</em>}
    </div>
  )
}
