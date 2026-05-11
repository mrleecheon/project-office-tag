import { eventBus } from '../events/eventBus.js'
import { GameEvents } from '../events/gameEvents.js'

export function emitAudioCue(name, detail = {}) {
  eventBus.emit(GameEvents.AUDIO_CUE, { name, ...detail })
}
