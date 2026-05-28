/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react'
import { createTimerBag } from '../../engine/events/timers'
import { emitAudioCue } from '../../engine/audio/audioBus'
import { createMetadataSimulator } from '../../features/messenger/runtime/metadataSimulator'
import { createMessengerPacingController } from '../../features/messenger/runtime/pacingController'
import { resolveChoiceAvailability } from '../../game/transitions/transitionPolicy'
import { resolveLineText, resolveUiText } from '../../content/manifests/text'
import { resolveChatCueProfile } from '../../content/manifests/audio'
import { resolveImageUrl } from '../../game/runtime/preload/assetPreloader'
import ChatBubble from './ChatBubble'
import ChoiceDock from './ChoiceDock'
import {
  buildChatDeliveries,
  resolveTypingSpeakerLabel,
  shouldShowTypingIndicator,
  splitChatDeliveryChunks,
} from './formatChatText'
import TypingIndicator from './TypingIndicator'
import TextInput from '../../ui/controls/TextInput'
import Button from '../../ui/controls/Button'

function resolveEmotionalPressure(scene) {
  const byEmotion = {
    friendly: 0.1,
    neutral: 0.2,
    nervous: 0.6,
    warning: 1.05,
  }
  return scene.important ? 1.2 : (byEmotion[scene.emotion] ?? 0.35)
}

export default function ChatScene({ scene, context, onChoice, onInput, onAutoNext }) {
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(null)
  const [choices, setChoices] = useState(null)
  const [locked, setLocked] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const scrollRef = useRef(null)
  const choiceTimerRef = useRef(null)
  const progressionWatchdogRef = useRef(null)
  const wallpaperUrl = resolveImageUrl(scene.chatTheme?.wallpaperAssetId)

  useEffect(() => {
    const timers = createTimerBag()
    const emotionalPressure = resolveEmotionalPressure(scene)
    const cueProfile = resolveChatCueProfile(scene.chatTheme?.profileId)
    const pacing = createMessengerPacingController(scene.id)
    const metadata = createMetadataSimulator(scene.id, emotionalPressure)
    const deliveries = buildChatDeliveries(scene.lines ?? [], resolveLineText, context)
    let delay = 0
    let previousChar = null

    setMessages([])
    setChoices(null)
    setLocked(false)

    for (const delivery of deliveries) {
      const incomingMeta = metadata.resolveIncomingMeta(delivery.lineIndex)
      const showTyping = shouldShowTypingIndicator(delivery.char)
      const sameSpeakerAsPrevious = previousChar === delivery.char
      const showName = previousChar !== delivery.char

      timers.later(() => {
        if (showTyping) {
          setTyping({ char: delivery.char, unstable: incomingMeta.unstable })
        }
        emitAudioCue(cueProfile.typeTick)
      }, delay)

      delay += showTyping
        ? pacing.getTypingDuration({ text: delivery.text, index: delivery.sequence, emotionalPressure })
        : Math.min(280, pacing.getTypingDuration({ text: delivery.text, index: delivery.sequence, emotionalPressure }) * 0.18)

      timers.later(() => {
        setTyping(null)
        setMessages((previous) => [...previous, {
          id: `${scene.id}-${delivery.lineIndex}-${delivery.chunkIndex}`,
          type: 'recv',
          char: delivery.char,
          text: delivery.text,
          showName,
          meta: incomingMeta,
        }])
      }, delay)

      previousChar = delivery.char

      const gap = pacing.getDeliveryGap({ index: delivery.sequence, unstable: incomingMeta.unstable })
      delay += sameSpeakerAsPrevious ? Math.min(70, gap) : gap
    }

    timers.later(() => {
      const availableChoices = resolveChoiceAvailability({ state: context, choices: scene.choices ?? [] })
      if (scene.systemMessage) {
        const systemChunks = splitChatDeliveryChunks(scene.systemMessage)
        setMessages((previous) => [
          ...previous,
          ...systemChunks.map((text, chunkIndex) => ({
            id: `${scene.id}-system-${chunkIndex}`,
            type: 'sys',
            text,
            meta: metadata.resolveSystemMeta(),
          })),
        ])
      }
      if (scene.input) return
      if (availableChoices.length) setChoices(availableChoices)
      else onAutoNext(scene.next ?? scene.returnTo)
    }, delay + 220)

    const watchdogDelay = Math.max(delay + 2400, 3200)
    progressionWatchdogRef.current = timers.later(() => {
      setTyping(null)
      if (scene.input) return
      setChoices((previous) => {
        if (previous?.length) return previous
        const availableChoices = resolveChoiceAvailability({ state: context, choices: scene.choices ?? [] })
        if (availableChoices.length) return availableChoices
        onAutoNext(scene.next ?? scene.returnTo)
        return previous
      })
    }, watchdogDelay)

    return () => timers.clear()
  }, [context, onAutoNext, scene])

  useEffect(() => () => {
    if (choiceTimerRef.current) clearTimeout(choiceTimerRef.current)
    if (progressionWatchdogRef.current) clearTimeout(progressionWatchdogRef.current)
  }, [])

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
    const emotionalPressure = resolveEmotionalPressure(scene)
    const pacing = createMessengerPacingController(scene.id)
    const metadata = createMetadataSimulator(scene.id, emotionalPressure)
    setMessages((previous) => [...previous, {
      id: `${scene.id}-choice`,
      type: 'sent',
      text: choice.text,
      meta: metadata.resolveOutgoingMeta(previous.length),
    }])
    emitAudioCue('choice:selected')
    choiceTimerRef.current = setTimeout(() => {
      choiceTimerRef.current = null
      onChoice(choice)
    }, pacing.getChoiceCommitDelay({ unstable: emotionalPressure > 0.8 }))
  }

  const typingLabel = typing ? resolveTypingSpeakerLabel(typing.char) : null

  return (
    <div
      className={`chatScene ${scene.emotion === 'warning' ? 'warning' : ''}`}
      style={wallpaperUrl ? { '--chatWallpaper': `url(${wallpaperUrl})` } : undefined}
    >
      <div className="chatSceneNotice">
        <span>{resolveUiText(scene.modeLabelKey, resolveUiText('modeBarChatDefault', 'CHAT MODE · TalkLine Internal'))}</span>
        {scene.emotion === 'warning' && <strong>LOG UNSTABLE</strong>}
      </div>
      <main ref={scrollRef}>
        {messages.map((message) => <ChatBubble key={message.id} message={message} />)}
        {typing && typingLabel && (
          <TypingIndicator charName={typingLabel} unstable={typing.unstable} />
        )}
      </main>
      {choices && <ChoiceDock choices={choices} disabled={locked} onChoose={choose} />}
      {scene.input && (
        <footer>
          <form className="inputForm" onSubmit={submitName}>
            <TextInput value={nameDraft} maxLength="14" placeholder={resolveUiText('chatNamePlaceholder', '표시 이름')} autoFocus onChange={(event) => setNameDraft(event.target.value)} />
            <Button type="submit">{resolveUiText('chatSend', '전송')}</Button>
          </form>
        </footer>
      )}
    </div>
  )
}
