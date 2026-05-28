import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { emitAudioCue } from '../../engine/audio/audioBus'
import { interactionKeys, movementKeys } from '../../engine/events/inputBindings'
import { canTriggerInteraction, isBlockedTile, resolveInteractableTarget } from '../../game/runtime/exploration/explorationRuntime'
import DPad from '../../ui/controls/DPad'
import InteractionHint from './InteractionHint'
import TileMap from './TileMap'

function resolveMapPixelSize(map) {
  const tileSize = map.tileSize ?? 40
  return {
    tileSize,
    width: map.cols * tileSize,
    height: map.rows * tileSize,
  }
}

export default function RpgScene({ chapter, map, state, onTrigger, onMove }) {
  const saved = state.mapPositions[map.id]
  const start = saved ?? map.playerStart
  const [position, setPosition] = useState({ row: start.row, col: start.col, facing: start.facing ?? { dr: 0, dc: 1 } })
  const [moveTick, setMoveTick] = useState(0)
  const [mapScale, setMapScale] = useState(1)
  const positionRef = useRef(position)
  const lastTriggerAtRef = useRef(0)
  const mapAreaRef = useRef(null)
  const mapPixels = useMemo(() => resolveMapPixelSize(map), [map])

  useEffect(() => {
    positionRef.current = position
  }, [position])

  useEffect(() => {
    const node = mapAreaRef.current
    if (!node) return undefined

    const updateScale = () => {
      const bounds = node.getBoundingClientRect()
      const padding = 20
      const nextScale = Math.min(
        1,
        (bounds.width - padding) / mapPixels.width,
        (bounds.height - padding) / mapPixels.height,
      )
      setMapScale(Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1)
    }

    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(node)
    return () => observer.disconnect()
  }, [mapPixels.height, mapPixels.width])

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
      <header className="rpgHeader">
        <div className="rpgHeaderMain">
          <span className="rpgFloorBadge">{map.floorId ?? 'UNK'}</span>
          <strong>{map.label}</strong>
          <small>{chapter?.label ?? 'SESSION'}</small>
        </div>
        <p className="rpgAmbient">{map.ambient}</p>
      </header>

      <div ref={mapAreaRef} className="rpgMapArea">
        <div
          className="rpgMapScaler"
          style={{
            width: mapPixels.width,
            height: mapPixels.height,
            transform: `scale(${mapScale})`,
          }}
        >
          <TileMap
            map={map}
            playerPosition={position}
            activeTarget={activeTarget}
            moveTick={moveTick}
          />
        </div>
        {activeTarget && (
          <div className="rpgTargetBadge">{activeTarget.label}</div>
        )}
      </div>

      <footer className="rpgControls">
        <InteractionHint>{activeTarget ? `[●] ${activeTarget.label}` : map.hint}</InteractionHint>
        <DPad onMove={move} onInteract={interact} />
      </footer>
    </div>
  )
}
