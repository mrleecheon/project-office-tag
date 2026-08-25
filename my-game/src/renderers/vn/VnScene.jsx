/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getTypewriterDelay } from '../../engine/animation/typewriter'
import { emitAudioCue } from '../../engine/audio/audioBus'
import { resolveLineText, resolveUiText } from '../../content/manifests/text'
import { resolveChoiceAvailability } from '../../game/transitions/transitionPolicy'
import ChoiceDock from '../chat/ChoiceDock'
import TextInput from '../../ui/controls/TextInput'
import VnCaptionBar from './VnCaptionBar'
import VnStageBackground from './VnStageBackground'
import VnPortraitLayer from './VnPortraitLayer'
import VnEventLayer from './VnEventLayer'
import VnControls from './VnControls'
import VnBacklogDrawer from './VnBacklogDrawer'

export default function VnScene({ scene, context, onChoice, onDone }) {
  const [index, setIndex] = useState(0)
  const [shown, setShown] = useState('')
  const [done, setDone] = useState(false)
  const [autoMode, setAutoMode] = useState(false)
  const [backlogOpen, setBacklogOpen] = useState(false)
  const [backlog, setBacklog] = useState([])
  const [activePortraits, setActivePortraits] = useState([])
  const [choiceClosing, setChoiceClosing] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const [glitching, setGlitching] = useState(false)
  const inputResolvedRef = useRef(false)
  const lineStartedAtRef = useRef(0)
  const lineDoneAtRef = useRef(0)
  const importantImpactPlayedRef = useRef(false)
  const autoTimerRef = useRef(null)
  const choiceExitTimerRef = useRef(null)
  const line = scene.lines?.[index]
  const text = resolveLineText(line, context)
  const isSfx = Boolean(line?.sfx)
  const hideStage = Boolean(line?.hideStage || line?.textOnly || line?.background === 'black')
  const important = Boolean(line?.important)
  const linePause = Number(line?.pause) || 0
  const availableChoices = resolveChoiceAvailability({ state: context, choices: scene.choices ?? [] })
  const showChoices = done && index === (scene.lines?.length ?? 1) - 1 && availableChoices.length > 0
  const displayChoices = showChoices && !choiceClosing

  useEffect(() => {
    setIndex(0)
    setBacklog([])
    setActivePortraits(scene.vnStage?.characters ?? [])
    importantImpactPlayedRef.current = false
    setChoiceClosing(false)
    inputResolvedRef.current = false
    setNameDraft('')
    setGlitching(false)
  }, [scene.id, scene.vnStage?.characters])

  useEffect(() => () => {
    if (choiceExitTimerRef.current) clearTimeout(choiceExitTimerRef.current)
  }, [])

  useEffect(() => {
    if (!showChoices) setChoiceClosing(false)
  }, [showChoices])

  useEffect(() => {
    if (!line) return
    const updates = []
    if (Array.isArray(line.portraits)) updates.push(...line.portraits)
    if (line.portrait && typeof line.portrait === 'object') updates.push(line.portrait)
    if (line.character) {
      updates.push({
        charId: line.character,
        slot: line.position ?? 'center',
        expression: line.expression,
        animation: line.animation,
        idle: line.idle,
        src: line.src,
        clear: line.clear || line.animation === 'exit',
      })
    }
    if (!updates.length) return
    setActivePortraits((previous) => {
      const bySlot = new Map(previous.map((entry) => [entry.slot ?? 'center', entry]))
      for (const update of updates) {
        const slot = update.position ?? update.slot ?? 'center'
        if (update.clear) {
          bySlot.delete(slot)
          continue
        }
        const previousEntry = bySlot.get(slot)
        bySlot.set(slot, {
          charId: update.charId ?? line.character ?? line.char ?? previousEntry?.charId ?? 'unknown',
          slot,
          src: update.src ?? previousEntry?.src,
          expression: update.expression ?? previousEntry?.expression,
          baseId: update.baseId ?? previousEntry?.baseId,
          exprId: update.exprId ?? previousEntry?.exprId,
          animation: update.animation ?? previousEntry?.animation,
          idle: update.idle ?? previousEntry?.idle,
        })
      }
      return [...bySlot.values()].slice(0, 3)
    })
  }, [line])

  useEffect(() => {
    inputResolvedRef.current = false
    setNameDraft('')
    setGlitching(false)
    if (line?.sfxCue !== 'steps') return undefined
    emitAudioCue('rpg:step')
    const timers = [200, 400].map((delay) => window.setTimeout(() => emitAudioCue('rpg:step'), delay))
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [line])

  useEffect(() => {
    setShown('')
    setDone(false)
    lineStartedAtRef.current = Date.now()
    lineDoneAtRef.current = 0
    if (important && !importantImpactPlayedRef.current) {
      emitAudioCue('screen:impact')
      importantImpactPlayedRef.current = true
    }
    if (line?.event === 'badgeTag') emitAudioCue('nfc:scan')
    if (isSfx) {
      emitAudioCue('nfc:scan')
      setShown(text)
      setDone(true)
      lineDoneAtRef.current = Date.now()
      return undefined
    }
    let cursor = 0
    const interval = setInterval(() => {
      cursor += 1
      setShown(text.slice(0, cursor))
      emitAudioCue('typewriter:tick', { important })
      if (cursor >= text.length) {
        clearInterval(interval)
        setDone(true)
        lineDoneAtRef.current = Date.now()
      }
    }, getTypewriterDelay(text, important, line?.typingSpeed))
    return () => clearInterval(interval)
  }, [important, isSfx, line?.event, line?.typingSpeed, text])

  const advance = useCallback(() => {
    if (!line) return
    if (showChoices) return
    if (line?.blockedInput && !inputResolvedRef.current) {
      if (!done) {
        const elapsed = Date.now() - lineStartedAtRef.current
        const minimumSkipDelay = important ? 800 : 300
        if (elapsed < minimumSkipDelay) return
        setShown(text)
        setDone(true)
        lineDoneAtRef.current = Date.now()
      }
      return
    }
    const elapsed = Date.now() - lineStartedAtRef.current
    const minimumSkipDelay = isSfx ? 0 : (important ? 800 : 300)
    if (!done) {
      if (elapsed < minimumSkipDelay) return
      setShown(text)
      setDone(true)
      lineDoneAtRef.current = Date.now()
      return
    }
    const sinceDone = Date.now() - (lineDoneAtRef.current || Date.now())
    if (sinceDone < linePause) return
    const next = index + 1
    if (next < (scene.lines?.length ?? 0)) {
      setBacklog((previous) => [...previous, {
        id: `${scene.id}-${index}`,
        speaker: line?.char ?? 'system',
        text,
      }].slice(-10))
      setIndex(next)
    }
    else if (!availableChoices.length) onDone(scene.next ?? scene.returnTo)
  }, [availableChoices.length, done, important, index, isSfx, line, linePause, onDone, scene.id, scene.lines, scene.next, scene.returnTo, showChoices, text])

  const failNameInput = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (!done || glitching || inputResolvedRef.current) return
    emitAudioCue('ui:glitch')
    setGlitching(true)
    window.setTimeout(() => {
      inputResolvedRef.current = true
      setGlitching(false)
      const next = index + 1
      if (next < (scene.lines?.length ?? 0)) {
        setBacklog((previous) => [...previous, {
          id: `${scene.id}-${index}`,
          speaker: line?.char ?? 'system',
          text,
        }].slice(-10))
        setIndex(next)
        return
      }
      if (!availableChoices.length) onDone(scene.next ?? scene.returnTo)
    }, 480)
  }

  const chooseWithExit = (choice) => {
    if (choiceClosing) return
    setChoiceClosing(true)
    choiceExitTimerRef.current = setTimeout(() => {
      choiceExitTimerRef.current = null
      onChoice(choice)
    }, 230)
  }

  useEffect(() => {
    if (!done || !autoMode || (line?.blockedInput && !inputResolvedRef.current)) return () => {}
    autoTimerRef.current = setTimeout(() => {
      advance()
    }, (linePause || 0) + (important ? 1100 : 700))
    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current)
    }
  }, [advance, autoMode, done, important, linePause])

  useEffect(() => {
    if (!done || !line?.autoAdvance) return undefined
    const delay = (line.autoAdvanceDelay ?? (isSfx ? 420 : 650)) + linePause
    const timer = setTimeout(() => advance(), delay)
    return () => clearTimeout(timer)
  }, [advance, done, isSfx, line?.autoAdvance, line?.autoAdvanceDelay, linePause])

  const skipAll = () => {
    if (availableChoices.length) {
      const lastIndex = (scene.lines?.length ?? 1) - 1
      const lastLine = scene.lines?.[lastIndex]
      if (lastLine) {
        const lastText = resolveLineText(lastLine, context)
        setBacklog((previous) => [...previous, {
          id: `${scene.id}-skip-${lastIndex}`,
          speaker: lastLine.char ?? 'system',
          text: lastText,
        }].slice(-10))
        setIndex(lastIndex)
        setShown(lastText)
        setDone(true)
      }
      return
    }
    if (!scene.lines?.length) {
      onDone(scene.next ?? scene.returnTo)
      return
    }
    const entries = scene.lines.slice(index).map((entry, entryIndex) => ({
      id: `${scene.id}-skip-${entryIndex}`,
      speaker: entry.char ?? 'system',
      text: resolveLineText(entry, context),
    }))
    setBacklog((previous) => [...previous, ...entries].slice(-10))
    onDone(scene.next ?? scene.returnTo)
  }

  return (
    <div
      className={[
        'vnScene',
        hideStage ? 'stageHidden' : '',
        line?.background === 'awake' ? 'stageAwake' : '',
        line?.textOnly ? 'lineTextOnly' : '',
        line?.welcomeCaption ? 'hasWelcomeCaption' : '',
        scene.overlay3d ? 'overlay3d' : '',
        glitching ? 'inputGlitch' : '',
        showChoices ? 'hasChoices' : '',
        showChoices ? 'choicesModalOpen' : '',
      ].filter(Boolean).join(' ')}
      onClick={advance}
    >
      <div className="modeBar">{resolveUiText(scene.modeLabelKey, resolveUiText('modeBarVnDefault', 'VN MODE'))} · {index + 1}/{scene.lines?.length ?? 0}</div>
      <div className={[
        'portraitStage',
        important && !hideStage ? 'shakeStage' : '',
        line?.effect === 'eyeOpen' ? 'eyeOpen' : '',
      ].filter(Boolean).join(' ')}>
        {!hideStage && (
          <>
            <VnStageBackground stage={scene.vnStage} backgroundImage={scene.backgroundImage} />
            <VnPortraitLayer entries={activePortraits} />
          </>
        )}
        {line?.event ? <VnEventLayer eventId={line.event} /> : null}
      </div>
      <VnCaptionBar line={{ ...line, important }} shown={shown} done={done} awaitingChoice={showChoices} />
      {line?.blockedInput && done && !inputResolvedRef.current && (
        <form className="vnBlockedInput" onClick={(event) => event.stopPropagation()} onSubmit={failNameInput}>
          <TextInput
            value={nameDraft}
            maxLength="14"
            autoFocus
            placeholder={resolveUiText('chatNamePlaceholder', '표시 이름')}
            onChange={(event) => setNameDraft(event.target.value)}
          />
          <button type="submit" className="uiButton primary">확인</button>
        </form>
      )}
      <AnimatePresence>
        {displayChoices && (
          <motion.div
            className="vnChoiceBackdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <motion.div
              className="vnChoiceLayer"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <ChoiceDock
                choices={availableChoices}
                disabled={choiceClosing}
                onChoose={chooseWithExit}
                variant="vn"
                title={resolveUiText('vnChoicePrompt', '행동 선택')}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <VnControls
        autoMode={autoMode}
        skipDisabled={showChoices}
        onToggleAuto={() => { emitAudioCue('ui:toggle'); setAutoMode((value) => !value) }}
        onSkip={() => { emitAudioCue('ui:confirm'); skipAll() }}
        onOpenBacklog={() => { emitAudioCue('ui:open'); setBacklogOpen(true) }}
      />
      <VnBacklogDrawer open={backlogOpen} entries={backlog} onClose={() => setBacklogOpen(false)} />
    </div>
  )
}
