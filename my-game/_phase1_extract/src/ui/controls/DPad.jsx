export default function DPad({ onMove, onInteract }) {
  return (
    <div className="dpad">
      <button type="button" onPointerDown={() => onMove(-1, 0)}>▲</button>
      <button type="button" onPointerDown={() => onMove(0, -1)}>◀</button>
      <button type="button" className="action" onPointerDown={onInteract}>●</button>
      <button type="button" onPointerDown={() => onMove(0, 1)}>▶</button>
      <button type="button" onPointerDown={() => onMove(1, 0)}>▼</button>
    </div>
  )
}
