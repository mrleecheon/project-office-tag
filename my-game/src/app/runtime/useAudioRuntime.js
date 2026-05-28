import { useEffect, useMemo } from 'react'
import { createAudioService } from '../../engine/audio/audioService.js'
import { eventBus } from '../../engine/events/eventBus.js'
import { GameEvents } from '../../engine/events/gameEvents.js'

export function useAudioRuntime() {
  const audioService = useMemo(() => createAudioService(), [])

  useEffect(() => {
    const offAudioCue = eventBus.on(GameEvents.AUDIO_CUE, ({ name, ...detail }) => {
      audioService.play(name, detail)
    })
    return () => offAudioCue()
  }, [audioService])
}
