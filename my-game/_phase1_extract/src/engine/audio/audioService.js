import { cueMap } from './cueMap.js'
import { createAudioChannelManager } from '../../game/audio/channels/audioChannelManager.js'

export function createAudioService() {
  let audioContext = null
  const channels = createAudioChannelManager()

  function getContext() {
    if (typeof window === 'undefined') return null
    if (audioContext) return audioContext
    const ContextCtor = window.AudioContext || window.webkitAudioContext
    if (!ContextCtor) return null
    audioContext = new ContextCtor()
    return audioContext
  }

  return {
    play(cueName, detail = {}) {
      const cue = cueMap[cueName]
      if (!cue) return
      if (!channels.canPlay(cueName, Date.now())) return
      const context = getContext()
      if (!context) return
      if (context.state === 'suspended') context.resume().catch(() => {})
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()
      const now = context.currentTime
      const emphasis = detail.important ? 1.15 : 1
      const frequency = (cue.frequency ?? 220) * emphasis
      const duration = Math.max((cue.durationMs ?? 40) / 1000, 0.01)
      const gain = cue.gain ?? 0.02

      oscillator.type = cue.wave ?? 'triangle'
      oscillator.frequency.setValueAtTime(frequency, now)
      gainNode.gain.setValueAtTime(0.0001, now)
      gainNode.gain.linearRampToValueAtTime(gain, now + 0.004)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration)

      oscillator.connect(gainNode)
      gainNode.connect(context.destination)
      oscillator.start(now)
      oscillator.stop(now + duration + 0.005)
    },
  }
}
