export default function Toast({ children }) {
  if (!children) return null
  return <div className="toast">{children}</div>
}
