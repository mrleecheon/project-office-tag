export default function ChoiceDock({ choices, disabled, onChoose }) {
  if (!choices?.length) return null
  return (
    <div className="choiceDock">
      <small>응답 선택</small>
      {choices.map((choice, index) => (
        <button key={`${choice.text}-${choice.next}`} type="button" disabled={disabled} onClick={() => onChoose(choice)}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          {choice.text}
        </button>
      ))}
    </div>
  )
}
