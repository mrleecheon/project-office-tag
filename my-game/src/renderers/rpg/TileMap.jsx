import PlayerSprite from './PlayerSprite'

const tileColors = {
  0: '#0d1a26',
  1: '#0a1020',
  2: '#1a3a5a',
  3: '#1a3020',
  4: '#2b2411',
}

function tileIcon(tile, label) {
  if (tile === 2) return 'D'
  if (label === '혈흔') return '!'
  if (label === '꺼진 CCTV') return 'C'
  if (tile === 3 || tile === 4) return '*'
  return ''
}

export default function TileMap({ map, playerPosition, activeTarget }) {
  const tileSize = map.tileSize ?? 40

  return (
    <div className="mapViewport">
      <div className="tileMap" style={{ width: map.cols * tileSize, height: map.rows * tileSize }}>
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
                background: tileColors[tile],
              }}
            >
              <span>{tileIcon(tile, label)}</span>
            </div>
          )
        }))}
        <PlayerSprite position={playerPosition} tileSize={tileSize} />
      </div>
    </div>
  )
}
