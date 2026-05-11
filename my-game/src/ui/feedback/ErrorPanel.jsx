export default function ErrorPanel({ error }) {
  return (
    <div className="errorScreen" role="alert">
      <h1>화면을 불러오지 못했습니다</h1>
      <p>처리 중 문제가 발생했습니다. 새로고침으로 다시 시도하세요.</p>
      <pre>{String(error?.message ?? error)}</pre>
      <button type="button" onClick={() => window.location.reload()}>새로고침</button>
    </div>
  )
}
