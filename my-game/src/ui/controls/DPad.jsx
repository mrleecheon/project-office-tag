function press(handler) {
  return (event) => {
    event.preventDefault()
    event.stopPropagation()
    handler()
  }
}

export default function DPad({ onMove, onInteract }) {
  return (
    <div className="dpad" role="group" aria-label="이동 및 조사">
      <button type="button" aria-label="위로" onPointerDown={press(() => onMove(-1, 0))}>▲</button>
      <button type="button" aria-label="왼쪽" onPointerDown={press(() => onMove(0, -1))}>◀</button>
      <button type="button" className="action" aria-label="조사" onPointerDown={press(onInteract)}>●</button>
      <button type="button" aria-label="오른쪽" onPointerDown={press(() => onMove(0, 1))}>▶</button>
      <button type="button" aria-label="아래" onPointerDown={press(() => onMove(1, 0))}>▼</button>
    </div>
  )
}
