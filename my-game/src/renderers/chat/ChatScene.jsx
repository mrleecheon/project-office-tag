/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react'
import { createTimerBag } from '../../engine/events/timers'
import { getTypingDuration } from '../../engine/animation/typewriter'
import { emitAudioCue } from '../../engine/audio/audioBus'
import ChatBubble from './ChatBubble'
import ChoiceDock from './ChoiceDock'
import TypingIndicator from './TypingIndicator'
import TextInput from '../../ui/controls/TextInput'
import Button from '../../ui/controls/Button'

function resolveLine(line, context) {
  return typeof line.text === 'function' ? line.text(context) : line.text
}

export default function ChatScene({ scene, context, onChoice, onInput, onAutoNext }) {
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(null)
  const [choices, setChoices] = useState(null)
  const [locked, setLocked] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    const timers = createTimerBag()
    let delay = 0
    setMessages([])
    setChoices(null)
    setLocked(false)

    for (const [index, line] of (scene.lines ?? []).entries()) {
      const text = resolveLine(line, context)
      timers.later(() => {
        setTyping(line.char)
        emitAudioCue('typing:start')
      }, delay)
      delay += getTypingDuration(text)
      timers.later(() => {
        setTyping(null)
        setMessages((previous) => [...previous, {
          id: `${scene.id}-${index}`,
          type: 'recv',
          char: line.char,
          text,
          showName: index === 0 || scene.lines[index - 1]?.char !== line.char,
        }])
      }, delay)
      delay += 120
    }

    timers.later(() => {
      if (scene.systemMessage) {
        setMessages((previous) => [...previous, { id: `${scene.id}-system`, type: 'sys', text: scene.systemMessage }])
      }
      if (scene.input) return
      if (scene.choices?.length) setChoices(scene.choices)
      else onAutoNext(scene.next ?? scene.returnTo)
    }, delay + 220)

    return () => timers.clear()
  }, [context, onAutoNext, scene])

  useEffect(() => {
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }))
  }, [messages, typing])

  const submitName = (event) => {
    event.preventDefault()
    const nickname = nameDraft.trim().slice(0, 14)
    if (nickname.length < 2) return
    onInput(scene.input, nickname)
  }

  const choose = (choice) => {
    if (locked) return
    setLocked(true)
    setChoices(null)
    setMessages((previous) => [...previous, { id: `${scene.id}-choice`, type: 'sent', text: choice.text }])
    emitAudioCue('choice:selected')
    setTimeout(() => onChoice(choice), 300)
  }

  return (
    <div className="chatScene">
      <div className="modeBar">CHAT MODE · TalkLine Internal</div>
      <main ref={scrollRef}>
        {messages.map((message) => <ChatBubble key={message.id} message={message} />)}
        {typing && <TypingIndicator />}
      </main>
      {choices && <ChoiceDock choices={choices} disabled={locked} onChoose={choose} />}
      {scene.input && (
        <footer>
          <form className="inputForm" onSubmit={submitName}>
            <TextInput value={nameDraft} maxLength="14" placeholder="표시 이름" autoFocus onChange={(event) => setNameDraft(event.target.value)} />
            <Button type="submit">전송</Button>
          </form>
        </footer>
      )}
    </div>
  )
}
