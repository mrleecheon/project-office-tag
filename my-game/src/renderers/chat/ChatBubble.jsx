import { motion } from 'framer-motion'
import { characters } from '../../content/world/characters'
import { resolveTemplate, resolveUiText } from '../../content/manifests/text'
import { riseIn } from '../../engine/animation/motionPresets'
function MessageMeta({ meta, className = '' }) {
  if (!meta) return null
  const delivery = meta.delivery ? resolveUiText(meta.delivery, meta.delivery) : null
  const readState = meta.readState
    ? resolveTemplate(meta.readState, { seconds: meta.readDelaySec ?? 0 }, meta.readState)
    : null
  return (
    <em className={`messageMeta ${className}`.trim()}>
      <span>{meta.timestamp}</span>
      {delivery && <span>{delivery}</span>}
      {readState && <span>{readState}</span>}
    </em>
  )
}

export default function ChatBubble({ message }) {
  if (message.type === 'narration' || message.type === 'sys') {
    return (
      <motion.div className={`sysLine ${message.type === 'narration' ? 'narrationInLog' : ''}`} {...riseIn}>
        {message.text}
        <MessageMeta meta={message.meta} className="system" />
      </motion.div>
    )
  }

  if (message.type === 'sent') {
    return (
      <motion.div className="sentLine" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
        <div>
          <span>{message.text}</span>
          <small className="receiptIcon">{message.meta?.readState === 'receiptUnread' ? '◻' : '◼'}</small>
          <MessageMeta meta={message.meta} className="sent" />
        </div>
      </motion.div>
    )
  }

  const char = characters[message.char] ?? characters.kim
  return (
    <motion.div className={`recvLine ${message.char} ${message.meta?.unstable ? 'unstable' : ''}`} {...riseIn}>
      <b style={{ '--accent': char.accent }}>{char.initial}</b>
      <div>
        {message.showName && <small>{char.name}<em>{char.dept}</em></small>}
        <p style={{ background: char.bubble, borderColor: char.border, color: char.text }}>{message.text}</p>
        <MessageMeta meta={message.meta} />
      </div>
    </motion.div>
  )
}
