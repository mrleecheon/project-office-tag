import { useAccessibility } from '../../app/providers/useAccessibility.js'
import { useLocale } from '../../app/providers/useLocale.js'
import Button from '../../ui/controls/Button.jsx'

export default function SettingsPanel({ onOpenSaveMenu, onRestart }) {
  const { reducedMotion } = useAccessibility()
  const { locale } = useLocale()

  return (
    <section className="messengerPanel settingsPanel" aria-label="설정 패널">
      <header>
        <small>SYSTEM</small>
        <h2>프로필 / 설정</h2>
        <p>데모 빌드에서는 저장 슬롯과 접근성 상태를 여기서 확인합니다.</p>
      </header>

      <div className="settingsGroup">
        <strong>세션</strong>
        <Button onClick={onOpenSaveMenu}>저장 / 불러오기</Button>
        <Button variant="ghost" onClick={onRestart}>처음부터 다시</Button>
      </div>

      <dl className="statusGrid">
        <div>
          <dt>언어</dt>
          <dd>{locale === 'ko' ? '한국어' : locale}</dd>
        </div>
        <div>
          <dt>모션 감소</dt>
          <dd>{reducedMotion ? '활성' : '비활성'}</dd>
        </div>
        <div>
          <dt>입력 방식</dt>
          <dd>선택지 기반</dd>
        </div>
        <div>
          <dt>NFC</dt>
          <dd>브라우저 데모 모드</dd>
        </div>
      </dl>
    </section>
  )
}
