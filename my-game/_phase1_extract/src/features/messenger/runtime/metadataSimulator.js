function pad(value) {
  return String(value).padStart(2, '0')
}

function formatClock(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function seededShift(seed, min, max) {
  const raw = Math.sin(seed * 91.17) * 10000
  const fraction = raw - Math.floor(raw)
  return Math.round(min + (max - min) * fraction)
}

function resolveCorruptionTone(emotionalPressure) {
  if (emotionalPressure >= 1.0) return 'deliveryMismatch'
  if (emotionalPressure >= 0.7) return 'deliveryDelayed'
  return 'deliveryStable'
}

function seededProbability(seed) {
  const raw = Math.sin(seed * 17.73) * 10000
  return raw - Math.floor(raw)
}

export function createMetadataSimulator(sceneId, emotionalPressure = 0) {
  const sceneSeed = Array.from(sceneId ?? '').reduce((acc, char) => acc + char.charCodeAt(0), 11)
  const start = new Date()
  start.setSeconds(0, 0)
  start.setMinutes(start.getMinutes() - seededShift(sceneSeed, 1, 4))

  return {
    resolveIncomingMeta(index) {
      const offset = seededShift(sceneSeed + index, 18, 95)
      const timestamp = new Date(start.getTime() + index * offset * 1000)
      const unstableChance = Math.min(0.15 + (emotionalPressure * 0.45), 0.9)
      return {
        timestamp: formatClock(timestamp),
        delivery: resolveCorruptionTone(emotionalPressure),
        unstable: emotionalPressure > 0.8 && seededProbability(sceneSeed + (index * 43)) < unstableChance,
      }
    },
    resolveOutgoingMeta(index) {
      const offset = seededShift(sceneSeed + index * 3, 7, 38)
      const timestamp = new Date(start.getTime() + (index + 1) * offset * 1000)
      const readDelaySec = seededShift(sceneSeed + index * 7, 4, emotionalPressure > 0.8 ? 42 : 18)
      return {
        timestamp: formatClock(timestamp),
        readState: readDelaySec > 30 ? 'receiptUnread' : 'receiptReadIn',
        readDelaySec,
      }
    },
    resolveSystemMeta() {
      return {
        timestamp: formatClock(new Date(start.getTime() + seededShift(sceneSeed, 8, 55) * 1000)),
      }
    },
  }
}
