import { useState } from 'react'
import PlayerSprite from './PlayerSprite'
import NpcSprite from './NpcSprite'

const tileClassByValue = {
  0: 'floor',
  1: 'wall',
  2: 'door',
  3: 'panel',
  4: 'locker',
}

function tileKind(tile, label) {
  if (label === '혈흔') return 'blood'
  if (label === '꺼진 CCTV') return 'camera'
  return tileClassByValue[tile] ?? 'floor'
}

export default function TileMap({ map, playerPosition, activeTarget, moveTick, visitedTileKeys }) {
  const [backgroundFailed, setBackgroundFailed] = useState(false)
  const tileSize = map.tileSize ?? 40
  const frameWidth = map.spriteFrame?.width ?? 32
  const frameHeight = map.spriteFrame?.height ?? 32
  const hasBackground = Boolean(map.backgroundImage && !backgroundFailed)

  return (
    <div className="mapViewport">
      <div className="tileMap" style={{ width: map.cols * tileSize, height: map.rows * tileSize }}>
        {hasBackground ? (
          <img className="tileMapBackground" src={map.backgroundImage} alt="" onError={() => setBackgroundFailed(true)} />
        ) : (
          <div className="tileMapBackdrop" aria-hidden />
        )}
        {map.grid.map((row, rowIndex) => row.map((tile, colIndex) => {
          const key = `${rowIndex}-${colIndex}`
          const active = activeTarget?.key === key
          const label = map.labels?.[key]
          const kind = tileKind(tile, label)
          const isInteractable = Boolean(label && tile !== 1)
          const visited = visitedTileKeys?.has(key)
          return (
            <div
              key={key}
              className={[
                'tile',
                `tile-${kind}`,
                active ? 'active' : '',
                isInteractable ? 'interactable' : '',
                visited ? 'visited' : '',
              ].filter(Boolean).join(' ')}
              style={{
                left: colIndex * tileSize,
                top: rowIndex * tileSize,
                width: tileSize,
                height: tileSize,
              }}
            >
              {isInteractable && (
                <span className="tileLabel">
                  {visited ? `${label} · 완료` : label}
                </span>
              )}
            </div>
          )
        }))}
        {(map.npcs ?? []).map((npc) => (
          <NpcSprite key={npc.id} npc={npc} tileSize={tileSize} frameWidth={frameWidth} frameHeight={frameHeight} />
        ))}
        <PlayerSprite
          position={playerPosition}
          tileSize={tileSize}
          sprite={map.playerSprite}
          frameWidth={frameWidth}
          frameHeight={frameHeight}
          moveTick={moveTick}
        />
      </div>
    </div>
  )
}
