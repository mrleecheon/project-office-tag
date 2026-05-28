const TYPING_SPEAKER_IDS = new Set(['kim', 'groomy', 'iseol'])

const TYPING_SPEAKER_LABELS = {
  kim: '김수진 대리',
  groomy: '그루미',
  iseol: '강이솔',
}

export function shouldShowTypingIndicator(charId) {
  return TYPING_SPEAKER_IDS.has(charId)
}

export function resolveTypingSpeakerLabel(charId) {
  return TYPING_SPEAKER_LABELS[charId] ?? null
}

export function shouldKeepLineTogether(line) {
  return Boolean(line?.keepTogether || line?.unsplit || line?.monologue || line?.singleBubble)
}

/**
 * Splits dialogue into one chat bubble per sentence.
 * Use line.keepTogether (or unsplit/monologue/singleBubble) to keep a long explanation in one bubble.
 */
export function splitChatDeliveryChunks(text, { keepTogether = false } = {}) {
  const raw = String(text ?? '').trim()
  if (!raw) return []
  if (keepTogether) return [raw]

  const chunks = []
  for (const paragraph of raw.split(/\n+/).map((part) => part.trim()).filter(Boolean)) {
    const sentences = paragraph
      .split(/(?<=[.!?…]["'」』)]?)\s+/)
      .map((part) => part.trim())
      .filter(Boolean)
    if (sentences.length) chunks.push(...sentences)
    else chunks.push(paragraph)
  }

  return chunks.length ? chunks : [raw]
}

export function buildChatDeliveries(lines = [], resolveLineText, context = {}) {
  const deliveries = []
  let sequence = 0

  for (const [lineIndex, line] of lines.entries()) {
    const text = resolveLineText(line, context)
    const chunks = splitChatDeliveryChunks(text, { keepTogether: shouldKeepLineTogether(line) })

    for (const [chunkIndex, chunkText] of chunks.entries()) {
      deliveries.push({
        lineIndex,
        chunkIndex,
        char: line.char,
        text: chunkText,
        sequence: sequence++,
      })
    }
  }

  return deliveries
}
