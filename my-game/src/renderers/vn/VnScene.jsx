/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useRef, useState } from 'react'
import { getTypewriterDelay } from '../../engine/animation/typewriter'
import { emitAudioCue } from '../../engine/audio/audioBus'
import { resolveLineText, resolveUiText } from '../../content/manifests/text'
import { resolveChoiceAvailability } from '../../game/transitions/transitionPolicy'
import ChoiceDock from '../chat/ChoiceDock'
import VnDialogBox from './VnDialogBox'
import VnStageBackground from './VnStageBackground'
import VnPortraitLayer from './VnPortraitLayer'
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
  const lineStartedAtRef = useRef(0)
  const importantImpactPlayedRef = useRef(false)
  const autoTimerRef = useRef(null)
  const line = scene.lines?.[index]
  const text = resolveLineText(line, context)
  const isSfx = Boolean(line?.sfx)
  const hideStage = Boolean(line?.hideStage || line?.textOnly)
  const important = Boolean(line?.important)
  const availableChoices = resolveChoiceAvailability({ state: context, choices: scene.choices ?? [] })
  const showChoices = done && index === (scene.lines?.length ?? 1) - 1 && availableChoices.length > 0

  useEffect(() => {
    setIndex(0)
    setBacklog([])
    setActivePortraits(scene.vnStage?.characters ?? [])
    importantImpactPlayedRef.current = false
  }, [scene.id, scene.vnStage?.characters])

  useEffect(() => {
    if (!line) return
    const updates = []
    if (Array.isArray(line.portraits)) updates.push(...line.portraits)
    if (line.portrait && typeof line.portrait === 'object') updates.push(line.portrait)
    if (!updates.length) return
    setActivePortraits((previous) => {
      const bySlot = new Map(previous.map((entry) => [entry.slot ?? 'center', entry]))
      for (const update of updates) {
        const slot = update.position ?? update.slot ?? 'center'
        if (update.clear) {
          bySlot.delete(slot)
          continue
        }
        bySlot.set(slot, {
          charId: update.charId ?? line.char ?? 'unknown',
          slot,
          src: update.src,
          expression: update.expression,
          baseId: update.baseId,
          exprId: update.exprId,
        })
      }
      return [...bySlot.values()].slice(0, 3)
    })
  }, [line])

  useEffect(() => {
    setShown('')
    setDone(false)
    lineStartedAtRef.current = Date.now()
    if (important && !importantImpactPlayedRef.current) {
      emitAudioCue('screen:impact')
      importantImpactPlayedRef.current = true
    }
    if (isSfx) {
      emitAudioCue('nfc:scan')
      setShown(text)
      setDone(true)
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
      }
    }, getTypewriterDelay(text, important))
    return () => clearInterval(interval)
  }, [important, isSfx, text])

  const advance = useCallback(() => {
    if (!line) return
    const elapsed = Date.now() - lineStartedAtRef.current
    const minimumSkipDelay = isSfx ? 0 : (important ? 800 : 300)
    if (!done) {
      if (elapsed < minimumSkipDelay) return
      setShown(text)
      setDone(true)
      return
    }
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
  }, [availableChoices.length, done, important, index, isSfx, line?.char, onDone, scene.id, scene.lines, scene.next, scene.returnTo, text])

  useEffect(() => {
    if (!done || !autoMode) return () => {}
    autoTimerRef.current = setTimeout(() => {
      advance()
    }, important ? 1100 : 700)
    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current)
    }
  }, [advance, autoMode, done, important])

  useEffect(() => {
    if (!done || !line?.autoAdvance) return undefined
    const delay = line.autoAdvanceDelay ?? (isSfx ? 420 : 650)
    const timer = setTimeout(() => advance(), delay)
    return () => clearTimeout(timer)
  }, [advance, done, isSfx, line?.autoAdvance, line?.autoAdvanceDelay])

  const skipAll = () => {
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
        line?.textOnly ? 'lineTextOnly' : '',
        line?.welcomeCaption ? 'hasWelcomeCaption' : '',
      ].filter(Boolean).join(' ')}
      onClick={advance}
    >
      <div className="modeBar">{resolveUiText(scene.modeLabelKey, resolveUiText('modeBarVnDefault', 'VN MODE'))} · {index + 1}/{scene.lines?.length ?? 0}</div>
      <div className={['portraitStage', important && !hideStage ? 'shakeStage' : ''].filter(Boolean).join(' ')}>
        {!hideStage && (
          <>
            <VnStageBackground stage={scene.vnStage} backgroundImage={scene.backgroundImage} />
            <VnPortraitLayer entries={activePortraits} />
          </>
        )}
      </div>
      <VnDialogBox line={{ ...line, important }} shown={shown} done={done} />
      {showChoices && (
        <div className="vnChoiceLayer" onClick={(event) => event.stopPropagation()}>
          <ChoiceDock choices={availableChoices} disabled={false} onChoose={onChoice} />
        </div>
      )}
      <VnControls
        autoMode={autoMode}
        skipDisabled={showChoices}
        onToggleAuto={() => setAutoMode((value) => !value)}
        onSkip={skipAll}
        onOpenBacklog={() => setBacklogOpen(true)}
      />
      <VnBacklogDrawer open={backlogOpen} entries={backlog} onClose={() => setBacklogOpen(false)} />
    </div>
  )
}
