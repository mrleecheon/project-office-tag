import { characters } from '../../content/world/characters'
import { resolveUiText } from '../../content/manifests/text'

export default function VnDialogBox({ line, shown, done, awaitingChoice = false }) {
  const speakerId = line?.speaker ?? line?.char
  const char = characters[speakerId] ?? characters.system
  const isNarration = line?.isNarration || line?.char === 'system'
  const isSfx = Boolean(line?.sfx)
  const isTextOnly = Boolean(line?.textOnly)
  const isWelcomeCaption = Boolean(line?.welcomeCaption)
  const autoAdvance = Boolean(line?.autoAdvance)
  const showTapHint = done && !awaitingChoice && !autoAdvance && !isSfx && !isWelcomeCaption

  return (
    <div
      className={[
        'vnBox',
        line?.important ? 'important' : '',
        line?.emotion ? `emotion-${line.emotion}` : '',
        isNarration ? 'isNarration' : '',
        isSfx ? 'sfx' : '',
        isTextOnly ? 'textOnly' : '',
        isWelcomeCaption ? 'welcomeCaption' : '',
      ].filter(Boolean).join(' ')}
    >
      {!isSfx && !isTextOnly && !isWelcomeCaption && (
        <strong className="vnSpeakerTag">
          {line?.important && <span>!</span>}
          {isNarration ? '나레이션' : char.name}
          {!isNarration && <small>{char.dept}</small>}
        </strong>
      )}
      <p>
        {shown ?? ''}
        {!done && !isSfx && !isWelcomeCaption && <b />}
      </p>
      {showTapHint && <em>{resolveUiText('vnTapToContinue', '▶ 탭하여 계속')}</em>}
    </div>
  )
}
