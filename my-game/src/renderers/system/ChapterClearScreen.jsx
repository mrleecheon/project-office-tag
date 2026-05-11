import ScreenTransition from '../../ui/layout/ScreenTransition'
import Button from '../../ui/controls/Button'

export default function ChapterClearScreen({ copy, onContinue, onRestart }) {
  return (
    <ScreenTransition className="screen ending">
      <div>
        <h2>{copy.kicker}</h2>
        <h1>{copy.title}</h1>
        <p>{copy.body}<small>{copy.sub}</small></p>
        <Button onClick={onContinue}>계속</Button>
        <Button variant="ghost" onClick={onRestart}>처음부터 다시</Button>
      </div>
    </ScreenTransition>
  )
}
