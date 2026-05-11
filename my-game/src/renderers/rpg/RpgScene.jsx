import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { emitAudioCue } from '../../engine/audio/audioBus'
import { interactionKeys, movementKeys } from '../../engine/events/inputBindings'
import DPad from '../../ui/controls/DPad'
import Hud from '../../ui/layout/Hud'
import InteractionHint from './InteractionHint'
import TileMap from './TileMap'

function isBlocked(map, row, col) {
  return row < 0 || row >= map.rows || col < 0 || col >= map.cols || map.grid[row]?.[col] === 1
}

export default function RpgScene({ chapter, map, state, onTrigger, onMove }) {
  const saved = state.mapPositions[map.id]
  const start = saved ?? map.playerStart
  const [position, setPosition] = useState({ row: start.row, col: start.col, facing: start.facing ?? { dr: 0, dc: 1 } })
  const positionRef = useRef(position)

  useEffect(() => {
    positionRef.current = position
  }, [position])

  const findInteractable = useCallback((pos = positionRef.current) => {
    const facing = pos.facing ?? { dr: 0, dc: 1 }
    const candidates = [
      [pos.row + facing.dr, pos.col + facing.dc],
      [pos.row, pos.col],
      [pos.row - 1, pos.col],
      [pos.row + 1, pos.col],
      [pos.row, pos.col - 1],
      [pos.row, pos.col + 1],
    ]

    for (const [row, col] of candidates) {
      const key = `${row}-${col}`
      const tile = map.grid[row]?.[col]
      if ((tile === 2 || tile === 3 || tile === 4) && map.labels?.[key]) {
        return { key, label: map.labels[key], trigger: map.triggers?.[key] }
      }
    }
    return null
  }, [map])

  const activeTarget = useMemo(() => findInteractable(position), [findInteractable, position])

  const move = useCallback((dr, dc) => {
    setPosition((previous) => {
      const next = { row: previous.row + dr, col: previous.col + dc, facing: { dr, dc } }
      if (isBlocked(map, next.row, next.col)) {
        emitAudioCue('rpg:bump')
        return { ...previous, facing: { dr, dc } }
      }
      emitAudioCue('rpg:step')
      onMove(map.id, next)
      return next
    })
  }, [map, onMove])

  const interact = useCallback(() => {
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
    <div className="rpgScene">
      <Hud chapter={chapter} nickname={state.nickname} />
      <div className="modeBar">RPG MODE · {map.label}</div>
      <TileMap map={map} playerPosition={position} activeTarget={activeTarget} />
      <InteractionHint>{activeTarget ? `[Space/Enter] ${activeTarget.label}` : map.hint}</InteractionHint>
      <DPad onMove={move} onInteract={interact} />
    </div>
  )
}
