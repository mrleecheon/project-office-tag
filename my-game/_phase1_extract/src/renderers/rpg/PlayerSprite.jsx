import { useMemo } from 'react'

const directionRows = {
  down: 0,
  left: 1,
  right: 2,
  up: 3,
}

function resolveDirection(facing = { dr: 0, dc: 1 }) {
  if (Math.abs(facing.dr) > Math.abs(facing.dc)) return facing.dr < 0 ? 'up' : 'down'
  return facing.dc < 0 ? 'left' : 'right'
}

export default function PlayerSprite({ position, tileSize, sprite, frameWidth = 32, frameHeight = 32, moveTick = 0 }) {
  const direction = resolveDirection(position.facing)
  const frameIndex = moveTick % 3

  const style = useMemo(() => {
    const spriteSize = Math.floor(tileSize * 0.92)
    const left = position.col * tileSize + ((tileSize - spriteSize) / 2)
    const top = position.row * tileSize + ((tileSize - spriteSize) / 2)
    if (!sprite) {
      return {
        left,
        top,
        width: spriteSize,
        height: spriteSize,
      }
    }
    return {
      left,
      top,
      width: spriteSize,
      height: spriteSize,
      backgroundImage: `url(${sprite})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${frameWidth * 3}px ${frameHeight * 4}px`,
      backgroundPositionX: `-${frameWidth * frameIndex}px`,
      backgroundPositionY: `-${frameHeight * (directionRows[direction] ?? 0)}px`,
      imageRendering: 'pixelated',
    }
  }, [direction, frameHeight, frameIndex, frameWidth, position.col, position.row, sprite, tileSize])

  return (
    <div
      className="playerSprite"
      style={style}
    >
      {!sprite ? <span /> : null}
    </div>
  )
}
