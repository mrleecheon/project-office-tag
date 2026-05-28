export default function TypingIndicator({ charName = '김수진 대리', unstable = false }) {
  const label = unstable
    ? `${charName} sync repairing...`
    : `${charName}님이 입력 중입니다...`
  return (
    <div className={`typing ${unstable ? 'unstable' : ''}`}>
      {label}
    </div>
  )
}
