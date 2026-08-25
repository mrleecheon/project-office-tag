import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ErrorBoundary from '@groomy/game/app/ErrorBoundary.jsx'
import AppProviders from '@groomy/game/app/AppProviders.jsx'
import MessengerAppShell from '@groomy/game/app/routing/MessengerAppShell.jsx'
import OverlayLayer from '@groomy/game/app/routing/OverlayLayer.jsx'
import PhoneFrame from '@groomy/game/ui/layout/PhoneFrame.jsx'
import ChatBubble from '@groomy/game/renderers/chat/ChatBubble.jsx'
import ChoiceDock from '@groomy/game/renderers/chat/ChoiceDock.jsx'
import TypingIndicator from '@groomy/game/renderers/chat/TypingIndicator.jsx'
import { createMessengerPacingController } from '@groomy/game/features/messenger/runtime/pacingController.js'
import { SceneModes } from '@groomy/game/engine/contracts.js'
import { saveService } from '@groomy/game/engine/save/saveService.js'
import { initialGameState } from '@groomy/game/engine/state/initialState.js'
import { chapterRegistry } from '@groomy/game/engine/progression/chapterRegistry.js'
import { resolveUiText } from '@groomy/game/content/manifests/text.js'
import '@groomy/game/styles/globals.css'
import VNOverlay from '../ui/VNOverlay.jsx'
import { useGameState } from '../state/gameStateStore.js'
import {
  createKangIsolMorningCursor,
  getConsecutiveVnBeats,
} from '../runtime/productFlow.js'

const ONBOARDING_CHANNEL = 'CARETAKER SYSTEMS · 신입 온보딩 채널'

function toBubble(beat, index) {
  if (beat.speaker === '주인공') {
    return { id: `${beat.id}-${index}`, type: 'sent', text: beat.text }
  }
  return {
    id: `${beat.id}-${index}`,
    type: 'recv',
    char: 'iseol',
    showName: true,
    text: beat.text,
  }
}

export default function KangIsolMorningStage() {
  const isolTalked = useGameState((s) => s.isolTalked)
  const setInputMode = useGameState((s) => s.setInputMode)
  const returnFromKangIsolMorning = useGameState((s) => s.returnFromKangIsolMorning)

  const cursorRef = useRef(null)
  if (!cursorRef.current) cursorRef.current = createKangIsolMorningCursor(isolTalked)

  const pacingRef = useRef(null)
  if (!pacingRef.current) pacingRef.current = createMessengerPacingController('kang-isol-morning')

  const [saveMenuOpen, setSaveMenuOpen] = useState(false)
  const [slots, setSlots] = useState(() => saveService.listSlots())
  const noop = useCallback(() => {}, [])
  const shellScene = useMemo(() => ({
    id: 'kang-isol-morning',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    systemMessage: ONBOARDING_CHANNEL,
  }), [])
  const shellChapter = useMemo(
    () => chapterRegistry.getChapter('chapter-01') ?? { label: 'SESSION' },
    [],
  )
  const shellState = useMemo(() => ({
    ...initialGameState,
    screen: 'playing',
    activeChapterId: 'chapter-01',
    activeSceneId: 'isol_desk_hello',
    flags: ['enteredThroughOfficeIntro'],
  }), [])

  const refreshSlots = useCallback(() => {
    setSlots(saveService.listSlots())
  }, [])
  const [beat, setBeat] = useState(() => cursorRef.current.current)
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const [ready, setReady] = useState(false)
  const [vnBeats, setVnBeats] = useState(null)
  const paceIndexRef = useRef(0)
  const scrollRef = useRef(null)

  const finish = useCallback(() => {
    returnFromKangIsolMorning()
  }, [returnFromKangIsolMorning])

  const goNext = useCallback((choiceId) => {
    const current = cursorRef.current.current
    if (current?.type === 'choice' && !choiceId) return
    const next = cursorRef.current.advance(choiceId)
    setReady(false)
    setTyping(false)
    if (current?.type === 'choice') {
      const picked = current.choices?.find((entry) => entry.id === choiceId) ?? current.choices?.[0]
      if (picked?.text) {
        setMessages((prev) => [
          ...prev,
          { id: `${current.id}-${picked.id}`, type: 'sent', text: picked.text },
        ])
      }
    }
    if (!next || next.type === 'transition' || next.presentation === 'to-3d') {
      finish()
      return
    }
    setBeat(next)
  }, [finish])

  const finishVn = useCallback(() => {
    while (cursorRef.current.current?.presentation === 'vn') {
      cursorRef.current.advance()
    }
    const next = cursorRef.current.current
    setVnBeats(null)
    setInputMode('phone')
    if (!next || next.type === 'transition' || next.presentation === 'to-3d') {
      finish()
      return
    }
    setBeat(next)
  }, [finish, setInputMode])

  useEffect(() => {
    if (!beat) {
      finish()
      return undefined
    }
    if (beat.type === 'transition' || beat.presentation === 'to-3d') {
      finish()
      return undefined
    }
    if (beat.presentation === 'vn') {
      setInputMode('vn')
      setTyping(false)
      setReady(false)
      setVnBeats(getConsecutiveVnBeats(beat.id, isolTalked))
      return undefined
    }

    setInputMode('phone')
    setVnBeats(null)

    if (beat.type === 'choice') {
      setTyping(false)
      setReady(false)
      return undefined
    }

    const auto = Boolean(beat.auto || beat.noChoicePrompt)
    const index = paceIndexRef.current
    paceIndexRef.current += 1
    const duration = pacingRef.current.getTypingDuration({ text: beat.text, index })
    const gap = pacingRef.current.getDeliveryGap({ index, unstable: false })
    setTyping(true)
    setReady(false)
    let cancelled = false
    let autoTimer
    const typeTimer = window.setTimeout(() => {
      if (cancelled) return
      setTyping(false)
      setMessages((prev) => [...prev, toBubble(beat, index)])
      if (auto) {
        autoTimer = window.setTimeout(() => {
          if (!cancelled) goNext()
        }, gap)
        return
      }
      setReady(true)
      autoTimer = window.setTimeout(() => {
        if (!cancelled) goNext()
      }, 2000)
    }, duration)
    return () => {
      cancelled = true
      window.clearTimeout(typeTimer)
      window.clearTimeout(autoTimer)
    }
  }, [beat, finish, goNext, isolTalked, setInputMode])

  useEffect(() => {
    const node = scrollRef.current
    if (!node) return
    node.scrollTop = node.scrollHeight
  }, [messages, typing])

  const clickThread = () => {
    if (vnBeats || beat?.type === 'choice' || typing || !ready) return
    if (beat?.auto || beat?.noChoicePrompt) return
    goNext()
  }

  return (
    <ErrorBoundary>
      <AppProviders>
        {vnBeats ? (
          <div className="appRoot">
            <VNOverlay key={vnBeats[0]?.id} beats={vnBeats} autoAdvanceMs={2000} onComplete={finishVn} />
          </div>
        ) : (
          <div className="appRoot">
            <PhoneFrame>
              <MessengerAppShell
                scene={shellScene}
                chapter={shellChapter}
                context={shellState}
                map={null}
                state={shellState}
                onChoice={noop}
                onInput={noop}
                onDone={noop}
                onTrigger={noop}
                onMove={noop}
                onOpenSaveMenu={() => setSaveMenuOpen(true)}
                onRestart={() => window.location.reload()}
              >
                <div className="chatScene">
                  <div className="chatSceneLayout">
                    <div className="chatBackgroundWrapper" aria-hidden="true" />
                    <div className="chatSceneNotice">
                      <span>
                        {resolveUiText('modeBarChatDefault', 'CHAT MODE · TalkLine Internal')}
                      </span>
                    </div>
                    <section className="chatPanelContainer">
                      <main className="chatPanelScroll" ref={scrollRef} onClick={clickThread}>
                        <div className="chatThread">
                          {messages.map((message) => (
                            <ChatBubble key={message.id} message={message} />
                          ))}
                          {typing && beat?.speaker === '강이솔' && (
                            <TypingIndicator charName="강이솔" />
                          )}
                          {typing && beat?.speaker === '주인공' && beat?.noChoicePrompt && (
                            <TypingIndicator charName="나" />
                          )}
                        </div>
                      </main>
                      {beat?.type === 'choice' && (
                        <ChoiceDock
                          choices={beat.choices}
                          disabled={false}
                          onChoose={(choice) => goNext(choice.id)}
                        />
                      )}
                    </section>
                  </div>
                </div>
              </MessengerAppShell>
              <OverlayLayer
                openSaveMenu={saveMenuOpen}
                onCloseSaveMenu={() => setSaveMenuOpen(false)}
                slots={slots}
                onSaveSlot={(slotId) => {
                  saveService.saveSlot(slotId, shellState)
                  refreshSlots()
                  setSaveMenuOpen(false)
                }}
                onLoadSlot={(slotId) => {
                  saveService.loadSlot(slotId)
                  refreshSlots()
                  setSaveMenuOpen(false)
                }}
                onDeleteSlot={(slotId) => {
                  saveService.clearSlot(slotId)
                  refreshSlots()
                }}
                debugOpen={false}
                debugState={shellState}
                scene={shellScene}
                map={null}
                timeline={[]}
              />
            </PhoneFrame>
          </div>
        )}
      </AppProviders>
    </ErrorBoundary>
  )
}
