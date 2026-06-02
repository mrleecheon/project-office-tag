import ScreenTransition from '../../ui/layout/ScreenTransition'
import Button from '../../ui/controls/Button'
import { DEMO_TUMBLR_URL } from '../../config/demo.js'

export default function DemoEndScreen({ onRestart }) {
  return (
    <ScreenTransition className="screen ending demo-end">
      <div>
        <small className="systemEyebrow">DEMO</small>
        <h2>── DEMO END ──</h2>
        <p>
          3층에 무엇이 있는지 알고 싶다면?
          <br />
          본편에서 확인하세요.
        </p>
        <a
          className="demoTumblrLink"
          href={DEMO_TUMBLR_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={DEMO_TUMBLR_URL === '#' ? (event) => event.preventDefault() : undefined}
        >
          [텀블벅 링크] (나중에 채울 placeholder)
        </a>
        <Button onClick={onRestart}>처음부터 다시</Button>
      </div>
    </ScreenTransition>
  )
}
