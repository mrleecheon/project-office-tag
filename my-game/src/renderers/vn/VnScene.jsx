/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getTypewriterDelay } from '../../engine/animation/typewriter'
import { emitAudioCue } from '../../engine/audio/audioBus'
import PortraitStage from './PortraitStage'
import VnDialogBox from './VnDialogBox'

export default function VnScene({ scene, context, onDone }) {
  const [index, setIndex] = useState(0)
  const [shown, setShown] = useState('')
  const [done, setDone] = useState(false)
  const line = scene.lines?.[index]
  const text = typeof line?.text === 'function' ? line.text(context) : String(line?.text ?? '')
  const important = Boolean(line?.important || scene.important)

  useEffect(() => {
    setShown('')
    setDone(false)
    let cursor = 0
    if (important) emitAudioCue('screen:impact')
    const interval = setInterval(() => {
      cursor += 1
      setShown(text.slice(0, cursor))
      emitAudioCue('typewriter:tick', { important })
      if (cursor >= text.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, getTypewriterDelay(text, important))
    return () => clearInterval(interval)
  }, [important, text])

  const advance = () => {
    if (!done) {
      setShown(text)
      setDone(true)
      return
    }
    const next = index + 1
    if (next < (scene.lines?.length ?? 0)) setIndex(next)
    else onDone(scene.next ?? scene.returnTo)
  }

  return (
    <motion.div className={`vnScene ${important ? 'important' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={advance}>
      <div className="modeBar">VN MODE · {index + 1}/{scene.lines?.length ?? 0}</div>
      <PortraitStage line={line} />
      <VnDialogBox line={{ ...line, important }} shown={shown} done={done} />
    </motion.div>
  )
}
