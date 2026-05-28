export default function CluePanel({ storyStatus }) {
  return (
    <section className="messengerPanel cluePanel" aria-label="단서 패널">
      <header>
        <small>CASE LOG</small>
        <h2>전임자 사건 기록</h2>
        <p>단서는 선택지와 조사 결과에 따라 자동 정리됩니다.</p>
      </header>

      <div className="scoreStrip">
        <span>관계도 {storyStatus.scores.groomyAffinity}</span>
        <span>증거 {storyStatus.scores.mysteryEvidence}</span>
        <span>배터리 {storyStatus.scores.batteryDesperation}</span>
        <span>경계 {storyStatus.scores.corporateSuspicion}</span>
      </div>

      <div className="panelList">
        <h3>확보한 단서</h3>
        {storyStatus.clues.length ? storyStatus.clues.map((clue) => (
          <article key={clue.id} className="clueCard">
            <strong>{clue.title}</strong>
            <p>{clue.body}</p>
          </article>
        )) : <p className="emptyPanelText">아직 정리된 단서가 없습니다.</p>}
      </div>

      <div className="panelList">
        <h3>주요 기록</h3>
        {storyStatus.records.length ? storyStatus.records.map((record) => (
          <span key={record.id} className="recordPill">{record.label}</span>
        )) : <p className="emptyPanelText">의미 있는 기록이 아직 없습니다.</p>}
      </div>
    </section>
  )
}
