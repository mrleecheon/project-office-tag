import { motion } from 'framer-motion'
import { characters } from '../../content/world/characters'
import { riseIn } from '../../engine/animation/motionPresets'

export default function ChatBubble({ message }) {
  if (message.type === 'sys') {
    return (
      <motion.div className="sysLine" {...riseIn}>
        {message.text}
      </motion.div>
    )
  }

  if (message.type === 'sent') {
    return (
      <motion.div className="sentLine" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
        <span>{message.text}</span>
      </motion.div>
    )
  }

  const char = characters[message.char] ?? characters.kim
  return (
    <motion.div className="recvLine" {...riseIn}>
      <b style={{ '--accent': char.accent }}>{char.initial}</b>
      <div>
        {message.showName && <small>{char.name}</small>}
        <p style={{ background: char.bubble, borderColor: char.border, color: char.text }}>{message.text}</p>
      </div>
    </motion.div>
  )
}
