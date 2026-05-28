import { projectGroomyUiCopy } from '../../content/story/projectGroomyUi.js'

export default function ProfilePanel({ state, storyStatus, chapter, scene }) {
  return (
    <section className="messengerPanel profilePanel" aria-label="프로필 패널">
      <header>
        <small>TEMP EMPLOYEE PROFILE</small>
        <h2>{state.nickname}</h2>
        <p>{projectGroomyUiCopy.employeeId} · 전임자 권한 임시 매핑</p>
      </header>

      <div className="idCardPreview">
        <span>GROOMY OFFICE</span>
        <strong>{state.nickname}</strong>
        <em>{projectGroomyUiCopy.predecessorName} CARD LINE</em>
      </div>

      <dl className="statusGrid">
        <div>
          <dt>현재 챕터</dt>
          <dd>{chapter?.title ?? '알 수 없음'}</dd>
        </div>
        <div>
          <dt>현재 채널</dt>
          <dd>{scene?.mode === 'vn' ? '비주얼 기록' : projectGroomyUiCopy.channelName}</dd>
        </div>
        <div>
          <dt>그루미 관계</dt>
          <dd>{storyStatus.relationship.tone}</dd>
        </div>
        <div>
          <dt>추리 상태</dt>
          <dd>{storyStatus.mysteryStatus}</dd>
        </div>
        <div>
          <dt>배터리 압박</dt>
          <dd>{storyStatus.pressure.battery}</dd>
        </div>
        <div>
          <dt>회사 경계</dt>
          <dd>{storyStatus.pressure.corporate}</dd>
        </div>
      </dl>

      <p className={`relationshipNote ${storyStatus.relationship.level}`}>{storyStatus.relationship.detail}</p>
    </section>
  )
}
