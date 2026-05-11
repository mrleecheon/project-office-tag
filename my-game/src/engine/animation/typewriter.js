export const getTypewriterDelay = (text, important = false) => (
  important ? 42 : Math.max(20, Math.min(32, 420 / Math.max(String(text).length, 1)))
)

export const getTypingDuration = (text) => Math.max(420, String(text ?? '').length * 22)
