export default function ChoiceDock({ choices, disabled, onChoose }) {
  if (!choices?.length) return null
  return (
    <footer className="choiceDock">
      {choices.map((choice) => (
        <button key={`${choice.text}-${choice.next}`} type="button" disabled={disabled} onClick={() => onChoose(choice)}>
          <span>▶</span>
          {choice.text}
        </button>
      ))}
    </footer>
  )
}
