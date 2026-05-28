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

export function createMessengerPacingController(sceneId) {
  const sceneSeed = hashString(sceneId ?? 'scene')
  return {
    getTypingDuration({ text, index, emotionalPressure = 0 }) {
      const length = String(text ?? '').length
      const base = 380 + (length * 22)
      const jitter = seededNoise(sceneSeed + index * 31, 240)
      const pressureSlowdown = clamp(emotionalPressure, 0, 1.4) * 180
      const maxDuration = emotionalPressure > 1.0 ? 3800 : 2200
      return Math.round(clamp(base + jitter + pressureSlowdown, 260, maxDuration))
    },
    getDeliveryGap({ index, unstable }) {
      const base = 100 + seededNoise(sceneSeed + index * 13, 80)
      return unstable ? Math.round(base + 120) : Math.round(base)
    },
    getChoiceCommitDelay({ unstable }) {
      return unstable ? 420 : 260
    },
  }
}
