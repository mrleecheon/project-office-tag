import { useEffect, useMemo, useState } from 'react'

export default function NpcSprite({ npc, tileSize, frameWidth = 32, frameHeight = 32 }) {
  const [frameIndex, setFrameIndex] = useState(0)

  useEffect(() => {
    if (!npc?.sprite) return () => {}
    const interval = setInterval(() => {
      setFrameIndex((value) => (value + 1) % 2)
    }, 460)
    return () => clearInterval(interval)
  }, [npc?.sprite])

  const row = npc.position?.row ?? npc.row ?? 0
  const col = npc.position?.col ?? npc.col ?? 0
  const style = useMemo(() => {
    const spriteSize = Math.floor(tileSize * 0.9)
    const left = col * tileSize + ((tileSize - spriteSize) / 2)
    const top = row * tileSize + ((tileSize - spriteSize) / 2)
    if (!npc?.sprite) {
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
      backgroundImage: `url(${npc.sprite})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${frameWidth * 3}px ${frameHeight * 4}px`,
      backgroundPositionX: `-${frameWidth * frameIndex}px`,
      backgroundPositionY: '0px',
      imageRendering: 'pixelated',
    }
  }, [col, frameHeight, frameIndex, frameWidth, npc?.sprite, row, tileSize])

  return (
    <div className="npcSprite" style={style} title={npc.label ?? npc.name ?? npc.id}>
      {!npc?.sprite ? <span>{(npc.label ?? npc.name ?? 'N').slice(0, 1)}</span> : null}
    </div>
  )
}

