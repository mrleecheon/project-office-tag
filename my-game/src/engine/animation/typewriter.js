export const getTypewriterDelay = (text, important = false, typingSpeed) => {
  if (typeof typingSpeed === 'number' && Number.isFinite(typingSpeed)) return typingSpeed
  if (typingSpeed === 'slow') return important ? 68 : 56
  if (typingSpeed === 'fast') return important ? 28 : 18
  return important ? 42 : Math.max(20, Math.min(32, 420 / Math.max(String(text).length, 1)))
}

export const getTypingDuration = (text) => Math.max(420, String(text ?? '').length * 22)
