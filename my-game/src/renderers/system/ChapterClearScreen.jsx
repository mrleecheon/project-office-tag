import { resolveUiText } from '../../content/manifests/text.js'
import ScreenTransition from '../../ui/layout/ScreenTransition'
import Button from '../../ui/controls/Button'

export default function ChapterClearScreen({ copy, onContinue, onRestart }) {
  return (
    <ScreenTransition className="screen ending">
      <div>
        <small className="systemEyebrow">SESSION LOG</small>
        <h2>{copy.kicker}</h2>
        <h1>{copy.title}</h1>
        <p>{copy.body}<small>{copy.sub}</small></p>
        {copy.bonusLog ? (
          <pre className="endingBonusLog">{copy.bonusLog}</pre>
        ) : null}
        <Button onClick={onContinue}>{copy.continueLabel ?? resolveUiText('chapterClearContinue', '계속')}</Button>
        <Button variant="ghost" onClick={onRestart}>{resolveUiText('chapterClearRestart', '처음부터 다시')}</Button>
      </div>
    </ScreenTransition>
  )
}
