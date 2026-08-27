import { AUDIO_PATHS } from './audioPaths.js'
import { useHtmlLoopAudio, useRuinOfficeCrossfadeAudio } from './gameAudioCore.js'
import { useGameState } from '../state/gameStateStore.js'

/** 오피스·회의실 — 형광등 험 상시 루프 (아주 낮은 볼륨) */
export function OfficeHumAudio({ active = true, volume = 0.09 } = {}) {
  useHtmlLoopAudio(AUDIO_PATHS.officeHum, { active, volume })
  return null
}

/** 로비·복도 — 폐허 앰비 ↔ AR 전환 시 오피스 험 크로스페이드 */
export function RuinOfficeCrossfadeAudio({ active = true } = {}) {
  const ar = useGameState((s) => s.arFilterOn)
  useRuinOfficeCrossfadeAudio(AUDIO_PATHS.ruinAmbient, AUDIO_PATHS.officeHum, {
    active,
    ar,
    ruinVolume: 0.14,
    officeVolume: 0.09,
  })
  return null
}
