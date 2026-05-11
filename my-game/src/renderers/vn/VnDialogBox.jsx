import { characters } from '../../content/world/characters'

export default function VnDialogBox({ line, shown, done }) {
  const char = characters[line?.char] ?? characters.system
  const isNarration = line?.isNarration || line?.char === 'system'

  return (
    <div className={`vnBox ${line?.important ? 'important' : ''}`}>
      <strong>
        {line?.important && <span>!</span>}
        {isNarration ? '나레이션' : char.name}
        {!isNarration && <small>{char.dept}</small>}
      </strong>
      <p>
        {shown}
        {!done && <b />}
      </p>
      {done && <em>▶ 탭하여 계속</em>}
    </div>
  )
}
