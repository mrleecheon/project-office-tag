import { useState } from 'react'
import PlayerSprite from './PlayerSprite'
import NpcSprite from './NpcSprite'

const tileColors = {
  0: '#0d1a26',
  1: '#0a1020',
  2: '#1a3a5a',
  3: '#1a3020',
  4: '#2b2411',
}

function tileIcon(tile, label, activeTarget, key) {
  if (activeTarget?.key === key && activeTarget.type === 'npc') return 'N'
  if (activeTarget?.key === key && activeTarget.type === 'event') return 'E'
  if (tile === 2) return 'D'
  if (label === '혈흔') return '!'
  if (label === '꺼진 CCTV') return 'C'
  if (tile === 3 || tile === 4) return '*'
  return ''
}

export default function TileMap({ map, playerPosition, activeTarget, moveTick }) {
  const [backgroundFailed, setBackgroundFailed] = useState(false)
  const tileSize = map.tileSize ?? 40
  const frameWidth = map.spriteFrame?.width ?? 32
  const frameHeight = map.spriteFrame?.height ?? 32
  const hasBackground = Boolean(map.backgroundImage && !backgroundFailed)
  const hasTileset = Boolean(map.tilesetImage && map.tilesetMap)

  return (
    <div className="mapViewport">
      <div className="tileMap" style={{ width: map.cols * tileSize, height: map.rows * tileSize }}>
        {hasBackground ? (
          <img className="tileMapBackground" src={map.backgroundImage} alt="" onError={() => setBackgroundFailed(true)} />
        ) : null}
        {map.grid.map((row, rowIndex) => row.map((tile, colIndex) => {
          const key = `${rowIndex}-${colIndex}`
          const active = activeTarget?.key === key
          const label = map.labels?.[key]
          return (
            <div
              key={key}
              className={active ? 'tile active' : 'tile'}
              style={{
                left: colIndex * tileSize,
                top: rowIndex * tileSize,
                width: tileSize,
                height: tileSize,
                background: hasBackground ? 'transparent' : tileColors[tile],
              }}
            >
              <span>{tileIcon(tile, label, activeTarget, key)}</span>
            </div>
          )
        }))}
        {hasTileset ? <div className="tilesetStub">TILESET PATH ACTIVE</div> : null}
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
