import { emitAudioCue } from '../../engine/audio/audioBus.js'
import { clearHoverAudioState, playHoverAudioOnce } from '../../ui/interaction/hoverAudio.js'

export default function ChoiceDock({
  choices,
  disabled,
  onChoose,
  variant = 'chat',
  title = '응답 선택',
}) {
  if (!choices?.length) return null
  const isVn = variant === 'vn'
  return (
    <div className={`choiceDock ${isVn ? 'isVn' : ''}`}>
      <small>{title}</small>
      {choices.map((choice, index) => (
        <button
          key={`${choice.text}-${choice.next}`}
          type="button"
          className={isVn ? 'vnChoiceButton' : ''}
          disabled={disabled}
          onMouseEnter={(event) => playHoverAudioOnce(event)}
          onMouseLeave={(event) => clearHoverAudioState(event)}
          onFocus={(event) => playHoverAudioOnce(event)}
          onClick={() => onChoose(choice)}
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          {choice.text}
        </button>
      ))}
    </div>
  )
}
