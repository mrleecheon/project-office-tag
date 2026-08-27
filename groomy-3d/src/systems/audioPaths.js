import { assetUrl } from '../runtime/assetUrl.js'

/** Freesound CC0 파일을 같은 경로에 넣으면 자동 재생됩니다. */
export const AUDIO_PATHS = {
  officeHum: assetUrl('/audio/office-hum.mp3'),
  ruinAmbient: assetUrl('/audio/ruin-ambient.mp3'),
  footstep: assetUrl('/audio/footstep.mp3'),
  phoneRing: assetUrl('/audio/phone-ring.mp3'),
  fragmentTension: assetUrl('/audio/fragment-tension.mp3'),
}
