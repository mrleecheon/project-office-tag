import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { emitAudioCue } from '../../engine/audio/audioBus'
import { interactionKeys, movementKeys } from '../../engine/events/inputBindings'
import { canTriggerInteraction, isBlockedTile, resolveInteractableTarget } from '../../game/runtime/exploration/explorationRuntime'
import DPad from '../../ui/controls/DPad'
import Hud from '../../ui/layout/Hud'
import InteractionHint from './InteractionHint'
import TileMap from './TileMap'

export default function RpgScene({ chapter, map, state, onTrigger, onMove }) {
  const saved = state.mapPositions[map.id]
  const start = saved ?? map.playerStart
  const [position, setPosition] = useState({ row: start.row, col: start.col, facing: start.facing ?? { dr: 0, dc: 1 } })
  const [moveTick, setMoveTick] = useState(0)
  const positionRef = useRef(position)
  const lastTriggerAtRef = useRef(0)

  useEffect(() => {
    positionRef.current = position
  }, [position])

  const findInteractable = useCallback((pos) => resolveInteractableTarget(map, pos ?? positionRef.current), [map])

  const activeTarget = useMemo(() => resolveInteractableTarget(map, position), [map, position])
  const ambientEnabled = (map.ambientFlags ?? []).some((flag) => flag.enabled)

  const move = useCallback((dr, dc) => {
    setPosition((previous) => {
      const next = { row: previous.row + dr, col: previous.col + dc, facing: { dr, dc } }
      if (isBlockedTile(map, next.row, next.col)) {
        emitAudioCue('rpg:bump')
        return { ...previous, facing: { dr, dc } }
      }
      emitAudioCue('rpg:step')
      onMove(map.id, next)
      setMoveTick((value) => value + 1)
      return next
    })
  }, [map, onMove])

  const interact = useCallback(() => {
    const nowMs = Date.now()
    if (!canTriggerInteraction(lastTriggerAtRef.current, nowMs)) return
    lastTriggerAtRef.current = nowMs
    const target = findInteractable()
    if (!target?.trigger) {
      emitAudioCue('rpg:bump')
      return
    }
    emitAudioCue('rpg:interact', { target: target.label })
    onTrigger(target.trigger)
  }, [findInteractable, onTrigger])

  useEffect(() => {
    const onKey = (event) => {
      if (movementKeys.has(event.key)) {
        event.preventDefault()
        const delta = movementKeys.get(event.key)
        move(delta.dr, delta.dc)
      }
      if (interactionKeys.has(event.key)) {
        event.preventDefault()
        interact()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [interact, move])

  return (
    <div className={`rpgScene ${ambientEnabled ? 'ambientOn' : ''}`}>
      <Hud chapter={chapter} nickname={state.nickname} />
      <div className="modeBar">RPG MODE · {map.label}</div>
      <div className="rpgTopBar">
        <span>{map.floorId ?? 'UNK'}</span>
        <span>{map.ambient}</span>
      </div>
      <TileMap map={map} playerPosition={position} activeTarget={activeTarget} moveTick={moveTick} />
      <div className="rpgMiniMap">MINIMAP · {position.row},{position.col}</div>
      <InteractionHint>{activeTarget ? `[Space/Enter] ${activeTarget.label}` : map.hint}</InteractionHint>
      <DPad onMove={move} onInteract={interact} />
    </div>
  )
}
