/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react'
import { createTimerBag } from '../../engine/events/timers'
import { emitAudioCue } from '../../engine/audio/audioBus'
import { createMetadataSimulator } from '../../features/messenger/runtime/metadataSimulator'
import { createMessengerPacingController } from '../../features/messenger/runtime/pacingController'
import { resolveChoiceAvailability } from '../../game/transitions/transitionPolicy'
import { resolveLineText, resolveUiText } from '../../content/manifests/text'
import { resolveChatCueProfile } from '../../content/manifests/audio'
import { resolveImageUrl } from '../../game/runtime/preload/assetPreloader.js'
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
  const [narrationLog, setNarrationLog] = useState([])
  const [typing, setTyping] = useState(null)
  const [choices, setChoices] = useState(null)
  const [locked, setLocked] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const scrollRef = useRef(null)
  const choiceTimerRef = useRef(null)
  const progressionWatchdogRef = useRef(null)
  const lockedRef = useRef(false)
  const onChoiceRef = useRef(onChoice)
  const onAutoNextRef = useRef(onAutoNext)
  const isPersonalChannel = !scene.systemMessage
  const chatWallpaper = resolveImageUrl(scene?.chatTheme?.wallpaperAssetId)

  useEffect(() => {
    onChoiceRef.current = onChoice
    onAutoNextRef.current = onAutoNext
  }, [onAutoNext, onChoice])

  const clearProgressionWatchdog = () => {
    if (!progressionWatchdogRef.current) return
    clearTimeout(progressionWatchdogRef.current)
    progressionWatchdogRef.current = null
  }

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
    setNarrationLog([])
    setChoices(null)
    lockedRef.current = false
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
        const message = {
          id: `${scene.id}-${delivery.lineIndex}-${delivery.chunkIndex}`,
          type: delivery.isNarration ? 'narration' : 'recv',
          char: delivery.char,
          text: delivery.text,
          showName: delivery.isNarration ? false : showName,
          meta: incomingMeta,
        }
        if (delivery.isNarration) {
          setNarrationLog((previous) => [...previous, message])
          return
        }
        setMessages((previous) => [...previous, message])
      }, delay)

      previousChar = delivery.char

      const gap = pacing.getDeliveryGap({ index: delivery.sequence, unstable: incomingMeta.unstable })
      delay += sameSpeakerAsPrevious ? Math.min(70, gap) : gap
    }

    timers.later(() => {
      if (lockedRef.current) return
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
      else onAutoNextRef.current(scene.next ?? scene.returnTo)
    }, delay + 220)

    const watchdogDelay = Math.max(delay + 2400, 3200)
    progressionWatchdogRef.current = timers.later(() => {
      if (lockedRef.current) return
      setTyping(null)
      if (scene.input) return
      setChoices((previous) => {
        if (lockedRef.current || previous?.length) return previous
        const availableChoices = resolveChoiceAvailability({ state: context, choices: scene.choices ?? [] })
        if (availableChoices.length) return availableChoices
        onAutoNextRef.current(scene.next ?? scene.returnTo)
        return previous
      })
    }, watchdogDelay)

    return () => {
      timers.clear()
      clearProgressionWatchdog()
    }
  }, [context, scene])

  useEffect(() => () => {
    if (choiceTimerRef.current) clearTimeout(choiceTimerRef.current)
    clearProgressionWatchdog()
    lockedRef.current = false
  }, [])

  useEffect(() => {
    requestAnimationFrame(() => {
      const node = scrollRef.current
      if (!node) return
      node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' })
    })
  }, [messages, narrationLog, typing])

  const submitName = (event) => {
    event.preventDefault()
    const nickname = nameDraft.trim().slice(0, 14)
    if (nickname.length < 2) return
    onInput(scene.input, nickname)
  }

  const choose = (choice) => {
    if (lockedRef.current) return
    lockedRef.current = true
    setLocked(true)
    setChoices(null)
    clearProgressionWatchdog()
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
      onChoiceRef.current(choice)
    }, pacing.getChoiceCommitDelay({ unstable: emotionalPressure > 0.8 }))
  }

  const typingLabel = typing ? resolveTypingSpeakerLabel(typing.char) : null

  return (
    <div
      className={`chatScene ${scene.emotion === 'warning' ? 'warning' : ''} ${scene.investigationHub ? 'investigationHub' : ''} ${isPersonalChannel ? 'personalChannel' : ''}`}
    >
      <div className="chatSceneLayout">
        <div className="chatBackgroundWrapper" aria-hidden="true">
          {chatWallpaper && <img className="chatBackgroundImage" src={chatWallpaper} alt="" />}
        </div>

        {!isPersonalChannel && (
          <div className="chatSceneNotice">
            <span>{resolveUiText(scene.modeLabelKey, resolveUiText('modeBarChatDefault', 'CHAT MODE · TalkLine Internal'))}</span>
            {scene.emotion === 'warning' && <strong>LOG UNSTABLE</strong>}
          </div>
        )}

        <section className="chatPanelContainer">
          <main className="chatPanelScroll" ref={scrollRef}>
            <div className="chatThread">
              {messages.map((message) => <ChatBubble key={message.id} message={message} />)}
              {narrationLog.map((message) => <ChatBubble key={message.id} message={message} />)}
              {typing && typingLabel && (
                <TypingIndicator charName={typingLabel} unstable={typing.unstable} />
              )}
            </div>
          </main>
          {choices && <ChoiceDock choices={choices} disabled={locked} onChoose={choose} />}
          {scene.input && (
            <footer className="chatPanelFooter">
              <form className="inputForm" onSubmit={submitName}>
                <TextInput value={nameDraft} maxLength="14" placeholder={resolveUiText('chatNamePlaceholder', '표시 이름')} autoFocus onChange={(event) => setNameDraft(event.target.value)} />
                <Button type="submit">{resolveUiText('chatSend', '전송')}</Button>
              </form>
            </footer>
          )}
        </section>
      </div>
    </div>
  )
}
