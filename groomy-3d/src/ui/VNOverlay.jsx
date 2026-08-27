import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import '../game/scenes/ShockScene.css'
import './VNOverlay.css'

const TYPING_MS = { default: 18, fast: 7 }

function createCursor(beats) {
  const byId = Object.fromEntries(beats.map((beat) => [beat.id, beat]))
  let currentId = beats[0]?.id ?? null
  return {
    get current() {
      return byId[currentId] ?? null
    },
    advance(choiceId) {
      const beat = byId[currentId]
      if (!beat) return null
      if (beat.type === 'choice') {
        const choice = beat.choices?.find((entry) => entry.id === choiceId)
        currentId = choice?.next ?? beat.choices?.[0]?.next ?? null
      } else {
        currentId = beat.next ?? null
      }
      return byId[currentId] ?? null
    },
  }
}

function interpolateUser(text, userName) {
  if (text == null) return text
  const name = String(userName ?? '').trim() || '플레이어'
  return String(text).split('{{user}}').join(name)
}

function useTypewriter(text, active, intervalMs = TYPING_MS.default) {
  const full = text ?? ''
  const [count, setCount] = useState(0)
  useEffect(() => {
    setCount(0)
    if (!active || !full) return undefined
    const id = window.setInterval(() => {
      setCount((n) => {
        if (n >= full.length) {
          window.clearInterval(id)
          return full.length
        }
        return n + 1
      })
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [active, full, intervalMs])
  return { shown: full.slice(0, count), done: !active || !full || count >= full.length }
}

export default function VNOverlay({
  beats,
  onComplete,
  onBeatChange,
  onChoice,
  actionComplete = false,
  autoAdvanceMs,
  userName = '',
}) {
  const cursorRef = useRef(null)
  if (!cursorRef.current) cursorRef.current = createCursor(beats)
  const [beat, setBeat] = useState(() => cursorRef.current.current)
  const [nameDraft, setNameDraft] = useState('')
  const [glitch, setGlitch] = useState(false)
  const [blinkFx, setBlinkFx] = useState(false)
  const [afterInput, setAfterInput] = useState(false)
  const [waitingAction, setWaitingAction] = useState(false)
  const [skipType, setSkipType] = useState(false)

  const actionDoneRef = useRef(false)

  const rawBody = afterInput ? beat?.afterGlitchText : beat?.text
  const body = useMemo(() => interpolateUser(rawBody, userName), [rawBody, userName])
  const isPopup = beat?.presentation === 'system-popup'
  const isEffect = beat?.type === 'effect'
  const typingMs = beat?.typingSpeed === 'fast' ? TYPING_MS.fast : TYPING_MS.default
  const typing = Boolean(body) && beat?.type !== 'choice' && !waitingAction && !isPopup && !isEffect
  const { shown, done: typed } = useTypewriter(body, typing && !skipType, typingMs)
  const done = isEffect || skipType || typed
  const shownText = skipType ? (body ?? '') : shown

  const goComplete = useCallback(() => {
    onComplete?.()
  }, [onComplete])

  const applyBeat = useCallback((next) => {
    if (!next) {
      goComplete()
      return
    }
    setBeat(next)
    setAfterInput(false)
    setGlitch(false)
    setBlinkFx(false)
    setNameDraft('')
    setSkipType(false)
    onBeatChange?.(next)
  }, [goComplete, onBeatChange])

  const advance = useCallback((choiceId) => {
    const next = cursorRef.current.advance(choiceId)
    applyBeat(next)
  }, [applyBeat])

  useEffect(() => {
    onBeatChange?.(beat)
  }, [])

  useEffect(() => {
    if (!beat) return undefined
    if (beat.type === 'action') {
      actionDoneRef.current = false
      setWaitingAction(true)
      return undefined
    }
    setWaitingAction(false)
    if (beat.type === 'effect' && beat.effect === 'screen-noise') {
      // ShockScene .shock-flash / .shock-noise 재사용
      setGlitch(true)
      const id = window.setTimeout(() => {
        setGlitch(false)
        advance()
      }, 900)
      return () => window.clearTimeout(id)
    }
    if (beat.type === 'effect' && beat.effect === 'eye-blink') {
      // 오프닝 blink-groomy-enter / .vn-overlay-blink 재사용
      setBlinkFx(true)
      const id = window.setTimeout(() => {
        setBlinkFx(false)
        advance()
      }, 1100)
      return () => window.clearTimeout(id)
    }
    if (
      beat.presentation === 'footstep-black-fade'
      || beat.presentation === 'mount-white-room'
      || beat.presentation === 'system-popup'
    ) {
      const ms = beat.presentation === 'system-popup' ? 1100 : beat.presentation === 'mount-white-room' ? 400 : 700
      const id = window.setTimeout(() => advance(), ms)
      return () => window.clearTimeout(id)
    }
    return undefined
  }, [beat, advance])

  useEffect(() => {
    if (beat?.type !== 'action' || !actionComplete) return undefined
    if (actionDoneRef.current) return undefined
    actionDoneRef.current = true
    setWaitingAction(false)
    setGlitch(true)
    const id = window.setTimeout(() => {
      setGlitch(false)
      advance()
    }, 700)
    return () => {
      window.clearTimeout(id)
      actionDoneRef.current = false
    }
  }, [beat, actionComplete, advance])

  useEffect(() => {
    if (!done || waitingAction || !beat || beat.type === 'choice' || beat.type === 'effect' || beat.input) return undefined
    const useHold = beat.auto || beat.timing === 'fast' || autoAdvanceMs != null
    if (!useHold) return undefined
    const hold = autoAdvanceMs != null
      ? autoAdvanceMs
      : beat.timing === 'fast'
        ? Math.min(900, Math.max(420, 280 + String(body ?? '').length * 28))
        : Math.min(4200, Math.max(1100, 800 + String(body ?? '').length * 75))
    const id = window.setTimeout(() => advance(), hold)
    return () => window.clearTimeout(id)
  }, [beat, done, waitingAction, body, advance, autoAdvanceMs])

  useEffect(() => {
    const onKey = (event) => {
      if (event.code !== 'Space' || event.repeat) return
      event.preventDefault()
      if (!beat || waitingAction || beat.type === 'choice' || beat.type === 'effect' || beat.input) return
      if (!done) {
        setSkipType(true)
        return
      }
      advance()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const submitName = (event) => {
    event.preventDefault()
    setGlitch(true)
    window.setTimeout(() => {
      setGlitch(false)
      setAfterInput(true)
    }, 700)
  }

  const clickPanel = () => {
    if (!beat || waitingAction || beat.type === 'choice' || beat.type === 'effect') return
    if (beat.input && !afterInput) return
    if (!done) {
      setSkipType(true)
      return
    }
    advance()
  }

  const dimOff = waitingAction || beat?.type === 'action' || isEffect
  const showBar = beat
    && beat.type !== 'choice'
    && beat.type !== 'effect'
    && beat.presentation !== 'mount-white-room'
    && beat.presentation !== 'footstep-black-fade'
  const showText = !isPopup && Boolean(body)
  const textStyleClass = beat?.style === 'runon' ? ' is-runon' : beat?.style === 'whisper' ? ' is-whisper' : ''

  if (!beat) return null

  return (
    <div
      className={`vn-overlay${isPopup ? ' is-popup' : ''}${!waitingAction && !isEffect && beat.type !== 'choice' && beat.type !== 'action' ? ' is-advance' : ''}`}
      onClick={clickPanel}
    >
      {!dimOff && <div className="vn-overlay-dim" />}
      {beat.presentation === 'black-caption' && <div className="vn-overlay-black" />}
      {(beat.presentation === 'blink-groomy-enter' || blinkFx) && <div className="vn-overlay-blink" />}
      {isPopup && (
        <div
          className="vn-overlay-popup"
          onClick={(event) => {
            event.stopPropagation()
            clickPanel()
          }}
          role="button"
          tabIndex={0}
        >
          {interpolateUser(beat.text, userName)}
        </div>
      )}
      {glitch && (
        <div className="vn-overlay-glitch">
          <div className="shock-flash" />
          <div className="shock-noise" />
        </div>
      )}

      {beat.type === 'choice' && (
        <div className="vn-overlay-choices">
          {beat.text && <p className="vn-overlay-choice-prompt">{interpolateUser(beat.text, userName)}</p>}
          <div className="vn-overlay-choice-row">
            {beat.choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                onClick={() => {
                  onChoice?.(choice.id, beat)
                  advance(choice.id)
                }}
              >
                {interpolateUser(choice.text, userName)}
              </button>
            ))}
          </div>
        </div>
      )}

      {showBar && (
        <div
          className={`vn-overlay-panel${beat.speaker === '그루미' ? ' is-groomy' : ''}${beat.auto ? ' is-auto' : ''}`}
          role="presentation"
        >
          <div className="vn-overlay-dialogue">
            <div className="vn-overlay-speaker">
              {beat.presentation === 'system-popup' ? '\u00a0' : (beat.speaker || '\u00a0')}
            </div>
            <p
              className={`vn-overlay-text${
                beat.speaker === '파편' || String(body ?? '').includes('[파편]') ? ' is-shard' : ''
              }${textStyleClass}`}
              data-effect={waitingAction ? undefined : beat.effect || undefined}
            >
              {waitingAction ? (beat.text || '조사하세요. (E)') : (showText ? shownText : '\u00a0')}
            </p>
          </div>
          {beat.input && !afterInput && done && !waitingAction && (
            <form className="vn-overlay-name" onSubmit={submitName} onClick={(e) => e.stopPropagation()}>
              <input value={nameDraft} onChange={(event) => setNameDraft(event.target.value)} autoFocus />
              <button type="submit">확인</button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
