import { useEffect, useRef } from 'react'

const DEFAULT_FADE_MS = 900

let audioUnlocked = false
const unlockListeners = new Set()

export function isGameAudioUnlocked() {
  return audioUnlocked
}

export function unlockGameAudio() {
  if (audioUnlocked) return
  audioUnlocked = true
  unlockListeners.forEach((fn) => fn())
}

export function onGameAudioUnlock(fn) {
  unlockListeners.add(fn)
  return () => unlockListeners.delete(fn)
}

function clampVolume(value) {
  return Math.max(0, Math.min(1, value))
}

export function fadeAudioVolume(audio, targetVolume, fadeMs = DEFAULT_FADE_MS, onComplete) {
  if (!audio) return undefined
  const from = audio.volume
  const target = clampVolume(targetVolume)
  if (fadeMs <= 0 || from === target) {
    audio.volume = target
    onComplete?.()
    return undefined
  }

  const start = performance.now()
  let frame = 0
  const step = (now) => {
    const t = Math.min(1, (now - start) / fadeMs)
    audio.volume = from + (target - from) * t
    if (t < 1) {
      frame = requestAnimationFrame(step)
    } else {
      onComplete?.()
    }
  }
  frame = requestAnimationFrame(step)
  return () => cancelAnimationFrame(frame)
}

export function createLoopAudio(src) {
  const audio = new Audio(src)
  audio.loop = true
  audio.preload = 'auto'
  audio.volume = 0
  return audio
}

export function createOneShotAudio(src) {
  const audio = new Audio(src)
  audio.preload = 'auto'
  return audio
}

export function safePlay(audio) {
  if (!audio || !audioUnlocked) return Promise.resolve()
  return audio.play().catch(() => {})
}

export function playOneShot(src, volume = 0.35) {
  if (!audioUnlocked) return
  const audio = createOneShotAudio(src)
  audio.volume = clampVolume(volume)
  safePlay(audio)
}

/**
 * 단일 루프 HTMLAudio — active/volume 변화 시 페이드.
 */
export function useHtmlLoopAudio(src, { active = true, volume = 0.1, fadeMs = DEFAULT_FADE_MS } = {}) {
  const audioRef = useRef(null)
  const cancelFadeRef = useRef(null)

  useEffect(() => {
    const audio = createLoopAudio(src)
    audioRef.current = audio
    return () => {
      cancelFadeRef.current?.()
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [src])

  useEffect(() => onGameAudioUnlock(() => {
    const audio = audioRef.current
    if (!audio || !active) return
    safePlay(audio)
    cancelFadeRef.current?.()
    cancelFadeRef.current = fadeAudioVolume(audio, volume, fadeMs)
  }), [active, volume, fadeMs])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined

    cancelFadeRef.current?.()

    if (!active) {
      cancelFadeRef.current = fadeAudioVolume(audio, 0, fadeMs, () => audio.pause())
      return () => cancelFadeRef.current?.()
    }

    safePlay(audio)
    cancelFadeRef.current = fadeAudioVolume(audio, volume, fadeMs)
    return () => cancelFadeRef.current?.()
  }, [active, volume, fadeMs])

  return null
}

/**
 * 폐허 ↔ 오피스 험 크로스페이드 (로비·복도).
 */
export function useRuinOfficeCrossfadeAudio(
  ruinSrc,
  officeSrc,
  { active = true, ar = false, ruinVolume = 0.14, officeVolume = 0.09, fadeMs = DEFAULT_FADE_MS } = {},
) {
  const ruinRef = useRef(null)
  const officeRef = useRef(null)
  const cancelRuinRef = useRef(null)
  const cancelOfficeRef = useRef(null)

  useEffect(() => {
    const ruin = createLoopAudio(ruinSrc)
    const office = createLoopAudio(officeSrc)
    ruinRef.current = ruin
    officeRef.current = office
    return () => {
      cancelRuinRef.current?.()
      cancelOfficeRef.current?.()
      ruin.pause()
      office.pause()
      ruin.src = ''
      office.src = ''
      ruinRef.current = null
      officeRef.current = null
    }
  }, [ruinSrc, officeSrc])

  const applyMix = (nextAr, isActive) => {
    const ruin = ruinRef.current
    const office = officeRef.current
    if (!ruin || !office) return

    cancelRuinRef.current?.()
    cancelOfficeRef.current?.()

    if (!isActive) {
      cancelRuinRef.current = fadeAudioVolume(ruin, 0, fadeMs, () => ruin.pause())
      cancelOfficeRef.current = fadeAudioVolume(office, 0, fadeMs, () => office.pause())
      return
    }

    if (nextAr) {
      safePlay(office)
      cancelRuinRef.current = fadeAudioVolume(ruin, 0, fadeMs, () => ruin.pause())
      cancelOfficeRef.current = fadeAudioVolume(office, officeVolume, fadeMs)
    } else {
      safePlay(ruin)
      cancelOfficeRef.current = fadeAudioVolume(office, 0, fadeMs, () => office.pause())
      cancelRuinRef.current = fadeAudioVolume(ruin, ruinVolume, fadeMs)
    }
  }

  useEffect(() => onGameAudioUnlock(() => applyMix(ar, active)), [ar, active, ruinVolume, officeVolume, fadeMs])

  useEffect(() => {
    applyMix(ar, active)
    return () => {
      cancelRuinRef.current?.()
      cancelOfficeRef.current?.()
    }
  }, [ar, active, ruinVolume, officeVolume, fadeMs])

  return null
}
