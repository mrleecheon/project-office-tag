export default function PlayerSprite({ position, tileSize }) {
  return (
    <div
      className="playerSprite"
      style={{
        left: position.col * tileSize + 4,
        top: position.row * tileSize + 4,
        width: tileSize - 8,
        height: tileSize - 8,
      }}
    >
      <span />
    </div>
  )
}
