import { useEffect, useRef } from 'react'
import { AUDIO_PATHS } from '../systems/audioPaths.js'
import {
  createLoopAudio,
  fadeAudioVolume,
  onGameAudioUnlock,
  safePlay,
} from '../systems/gameAudioCore.js'

/**
 * 흰 방 파편 수집 — 마지막 1분(≤60초) 긴장 루프.
 */
export default function FragmentTensionAudio({ active = false, secondsLeft = 600 }) {
  const audioRef = useRef(null)
  const cancelFadeRef = useRef(null)
  const shouldPlay = active && secondsLeft > 0 && secondsLeft <= 60

  useEffect(() => {
    const audio = createLoopAudio(AUDIO_PATHS.fragmentTension)
    audioRef.current = audio
    return () => {
      cancelFadeRef.current?.()
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined

    cancelFadeRef.current?.()

    if (!shouldPlay) {
      cancelFadeRef.current = fadeAudioVolume(audio, 0, 700, () => audio.pause())
      return () => cancelFadeRef.current?.()
    }

    const target = secondsLeft <= 30 ? 0.22 : 0.16
    safePlay(audio)
    cancelFadeRef.current = fadeAudioVolume(audio, target, 900)
    return () => cancelFadeRef.current?.()
  }, [shouldPlay, secondsLeft])

  useEffect(() => onGameAudioUnlock(() => {
    if (!shouldPlay) return
    const audio = audioRef.current
    if (!audio) return
    safePlay(audio)
  }), [shouldPlay])

  return null
}
