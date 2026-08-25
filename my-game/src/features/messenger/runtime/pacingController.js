/** Per-character typing interval for TalkLine bubbles. Tune this one value. */
const TYPING_SPEED_MS = 46

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function hashString(value) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function seededNoise(seed, spread) {
  const base = Math.sin(seed) * 10000
  return (base - Math.floor(base)) * spread
}

function resolveSceneSlowdown(sceneId) {
  if (sceneId?.startsWith('prologue.')) return 1.35
  if (/^chapter-0[1-5]\./.test(sceneId ?? '')) return 1.75
  return 1
}

export function createMessengerPacingController(sceneId) {
  const sceneSeed = hashString(sceneId ?? 'scene')
  const slowdown = resolveSceneSlowdown(sceneId)
  return {
    getTypingDuration({ text, index, emotionalPressure = 0 }) {
      const length = String(text ?? '').length
      const base = (520 + (length * TYPING_SPEED_MS)) * slowdown
      const jitter = seededNoise(sceneSeed + index * 31, 280)
      const pressureSlowdown = clamp(emotionalPressure, 0, 1.4) * 240
      const maxDuration = emotionalPressure > 1.0 ? 5200 : 3400
      return Math.round(clamp(base + jitter + pressureSlowdown, 360, maxDuration))
    },
    getDeliveryGap({ index, unstable }) {
      const base = (160 + seededNoise(sceneSeed + index * 13, 120)) * slowdown
      return unstable ? Math.round(base + 180) : Math.round(base)
    },
    getChoiceCommitDelay({ unstable }) {
      return unstable ? 560 : 380
    },
  }
}
