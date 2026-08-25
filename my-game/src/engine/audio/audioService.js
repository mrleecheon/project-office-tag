import { cueMap } from './cueMap.js'
import { createAudioChannelManager } from '../../game/audio/channels/audioChannelManager.js'
import { resolveAudioAsset } from '../../content/manifests/assets.js'

export function createAudioService() {
  let audioContext = null
  let bgmPlayer = null
  const channels = createAudioChannelManager()
  const defaultMix = {
    master: 0.86,
    ui: 0.7,
    synth: 0.65,
    bgm: 0.38,
  }

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
      if (cue.assetId && typeof window !== 'undefined') {
        const asset = resolveAudioAsset(cue.assetId)
        if (asset?.src) {
          const player = new window.Audio(asset.src)
          player.volume = Math.max(0, Math.min((cue.gain ?? 0.2) * defaultMix.master * defaultMix.ui, 1))
          player.play().catch(() => {})
          return
        }
      }
      const context = getContext()
      if (!context) return
      if (context.state === 'suspended') context.resume().catch(() => {})
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()
      const now = context.currentTime
      const emphasis = detail.important ? 1.15 : 1
      const frequency = (cue.frequency ?? 220) * emphasis
      const duration = Math.max((cue.durationMs ?? 40) / 1000, 0.01)
      const gain = (cue.gain ?? 0.02) * defaultMix.master * defaultMix.synth

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
    playBgm(assetId, { loop = true, fadeInMs = 450 } = {}) {
      if (typeof window === 'undefined') return
      const asset = resolveAudioAsset(assetId)
      if (!asset?.src) return
      if (bgmPlayer?.dataset?.assetId === assetId) return
      if (bgmPlayer) {
        bgmPlayer.pause()
        bgmPlayer = null
      }
      const audio = new window.Audio(asset.src)
      audio.loop = loop
      audio.volume = 0
      audio.dataset.assetId = assetId
      audio.play().catch(() => {})
      bgmPlayer = audio

      const finalVolume = defaultMix.master * defaultMix.bgm
      const startedAt = Date.now()
      const tick = () => {
        if (!bgmPlayer || bgmPlayer !== audio) return
        const progress = Math.min((Date.now() - startedAt) / Math.max(fadeInMs, 1), 1)
        audio.volume = finalVolume * progress
        if (progress < 1) window.requestAnimationFrame(tick)
      }
      window.requestAnimationFrame(tick)
    },
    stopBgm() {
      if (!bgmPlayer) return
      bgmPlayer.pause()
      bgmPlayer = null
    },
  }
}
