import { emitAudioCue } from '../../engine/audio/audioBus.js'
import { clearHoverAudioState, playHoverAudioOnce } from '../interaction/hoverAudio.js'

export default function Button({ children, variant = 'primary', ...props }) {
  const { onMouseEnter, onMouseLeave, onFocus, onClick } = props
  return (
    <button
      className={`uiButton ${variant}`}
      type="button"
      {...props}
      onMouseEnter={(event) => {
        playHoverAudioOnce(event)
        onMouseEnter?.(event)
      }}
      onMouseLeave={(event) => {
        clearHoverAudioState(event)
        onMouseLeave?.(event)
      }}
      onFocus={(event) => {
        playHoverAudioOnce(event)
        onFocus?.(event)
      }}
      onClick={(event) => {
        emitAudioCue('ui:click')
        onClick?.(event)
      }}
    >
      {children}
    </button>
  )
}
