/**
 * 내러티브·구현 갭 추적 (작가/리뷰용).
 * status: completed | in_progress | open
 * 마지막 동기화: 프롤로그 + chapter-01~05 플레이 가능 기준
 */
export const projectGroomyNarrativeReviewNotes = [
  // ── ✅ 완료 (이번 패치 시리즈·기존 구현 반영) ──
  {
    id: 'playable-through-ch5',
    status: 'completed',
    severity: 'info',
    note: '✅ 플레이 가능 범위: prologue, chapter-01~05 (총 6단위). 구버전 "3챕터만 구현" 문구는 폐기.',
  },
  {
    id: 'intro-prologue-bridge',
    status: 'completed',
    severity: 'info',
    note: '✅ ProjectOfficeIntro → entrance_bridge → lobby_reveal → groomy_intro. PERCEPTION OFF→입장 즉시 ON. 사원증 재태그는 entrance_tag.',
  },
  {
    id: 'ch1-meeting-gate',
    status: 'completed',
    severity: 'info',
    note: '✅ CH1 회의실 필수: visitedMeetingRoom 플래그, meeting_chat 경유 없이 floor3 진입 불가.',
  },
  {
    id: 'ch2-ch3-corpse-bridge',
    status: 'completed',
    severity: 'info',
    note: '✅ CH2 floor3_door_approach(3층 문 앞) → CH3 ch3_storage_entry(문 열기·시체) 승→전 클라이맥스 연결.',
  },
  {
    id: 'ending-truth-axis',
    status: 'completed',
    severity: 'info',
    note: '✅ resolveProjectGroomyEnding: truthExposed 반영. 진실 미확인+해체→badB, 진실+고호감+해체→badA. (엔딩 함수 본문은 endings.js)',
  },
  {
    id: 'ch4-executor-reveal',
    status: 'completed',
    severity: 'info',
    note: '✅ CH4 truth_revelation: 박서이 제거 실행자 GROOMY, truthExposed·ch4_learnedGroomyIsExecutor 플래그. CH1은 여전히 "용의자 미지정" 추론만.',
  },
  {
    id: 'flavor-kim-seat-label',
    status: 'completed',
    severity: 'info',
    note: '✅ 회의실 허브 라벨 "강이솔 자리"로 통일 (flavor_iseol_seat / char iseol).',
  },
  {
    id: 'guardian-indirect-scenes',
    status: 'completed',
    severity: 'info',
    note: '✅ 보호자 아라: CH3 guardian_recall(회상), CH5 guardian_call(통화·배터리 12시간), 동기·단서 UI. "씬 없음"은 전용 초상/풀 연출 부재를 의미.',
  },

  // ── 🔄 진행 중 (콘텐츠·에셋·캐논 정리) ──
  {
    id: 'ending-normal-truth-mid',
    status: 'completed',
    severity: 'info',
    note: '✅ NORMAL id 유지. truthExposed + affinity 3–5 + !dismantled → summaryKoTruthMid (resolveProjectGroomyEndingSummaryKo).',
  },
  {
    id: 'prologue-on-timing',
    status: 'completed',
    severity: 'info',
    note: '✅ lobby_reveal이 groomy_intro보다 먼저. CG 「환영합니다」 제거, VN 환영은 groomy_intro 한 번만.',
  },

  // ── ❌ 미결 (유지) ──
  {
    id: 'ch4-full-script-patch',
    status: 'completed',
    severity: 'info',
    note: '✅ ch4_full_script: §1+부록5 잠입, §2~12 지문, 부록0~4, CH5 부분 확장(부록2 충돌 구간 제외). groomyInternalLog.js TRUE 보너스.',
  },
  {
    id: 'ch5-full-script-patch',
    status: 'completed',
    severity: 'info',
    note: '✅ ch5_full_script: §0~10 내레이션, ch5_closing, ending_true 분기 씬, 부록 A(추리 성공/실패 결말문), 부록 B(badA/badB 분리).',
  },
  {
    id: 'ending-badab-collision-fixed',
    status: 'completed',
    severity: 'info',
    note: '✅ dismantledWithFullKnowledge 플래그로 badA(가까운 사이+해체) vs badB(먼 거리+해체) 엔딩 요약 불일치 수정.',
  },
  {
    id: 'badb-unreachable-fixed',
    status: 'completed',
    severity: 'info',
    note: '✅ GROOMY_AFFINITY_CH4_ABANDON_MAX(0) 도입 — CH4 abandon(≤0) vs CH5 badB(≤1) 분리. hint는 1~4.',
  },
  {
    id: 'badb-organic-path-verified',
    status: 'completed',
    severity: 'info',
    note: '✅ badB 유기 경로(2026-06-22): R04/R08 CH4 직전 aff=1 복구 — CH2 expose 시 briefing「일단 둘러보고」(호감 무증가). verifyPlaythroughRoutes badB-organic·multiRoute 10/10·groomyAffinityAudit 통과. **설계 확인 대기:** 2단계 BAD(≤0 abandon vs aff=1 badB) 및 ch4_end_bad/badA 동일 타이틀 의도.',
  },
  {
    id: 'multi-route-simulator-refresh',
    status: 'completed',
    severity: 'info',
    note: '✅ multiRoutePlaythroughReport·groomyAffinityAudit 새 CH1(deduction→chapter_end)·CH2(briefing_chat 경유) 반영. 10루트 10/10, docs/multi-route-playthrough-report.md 재생성.',
  },
  {
    id: 'ch1-rewrite-seoi-canon',
    status: 'completed',
    severity: 'info',
    note: '✅ CH1 전면 재작성: 박서이/CARETAKER 캐논, Seoi 플래그, corporateHeat 제거, flavor_iseol_seat, deduction→chapter_end 직행, 조사 허브 유지.',
  },
  {
    id: 'ch1-ch3-deduction-duplicate',
    status: 'pending_decision',
    severity: 'info',
    note: '⏳ CH1 deduction_chat(ch1Concluded*)와 CH3 ch3_deduction_chat(ch3Concluded*) 이중 존재. isMysterySolvedFully는 CH3 플래그+증거≥8만 사용 — CH1 플래그는 UI 라벨만.',
  },
  {
    id: 'chapter-count-brief',
    status: 'open',
    severity: 'gap',
    note: '❌ 기획안 7챕터 대비 chapter-06·07 미구현. 현재 클리어 루트는 chapter-05 엔딩까지.',
  },
  {
    id: 'guardian-dedicated-asset',
    status: 'open',
    severity: 'gap',
    note: '❌ 아라(보호자 안드로이드) 전용 초상·풀 CG·집 내부 씬 미구현. 배터리 동기는 대사·플래그·CH5 통화로만 전달.',
  },
  {
    id: 'ch3-gap-fill',
    status: 'completed',
    severity: 'info',
    note: '✅ CH3 갭 보강: storage_clue_diary(ch3_recoveredSeoiDiary·seoiDiaryPartial), groomy_blood_reaction_leak(복선 #3), iseol_letter_reaction(강이솔 중반 등장·ch3_sharedLetterWithIseol).',
  },
  {
    id: 'groomy-predecessor-bond',
    status: 'open',
    severity: 'gap',
    note: '❌ 그루미↔박서이 감정사·격리 1시간 전후 캐논 미확정. CH3 일기·CH4 자백 톤은 있으나 설정서 고정 필요.',
  },
  {
    id: 'chapter-02-placeholder-assets',
    status: 'completed',
    severity: 'inconsistency',
    note: '✅ CH2 VN charId 버그 수정(iseol/groomy). baseId 이미지(kim/unknown 에셋)는 여전히 placeholder — ch2-portrait-art-still-placeholder 참고.',
  },
  {
    id: 'ch2-portrait-art-still-placeholder',
    status: 'open',
    severity: 'gap',
    note: '❌ CH2 VN portrait baseId가 kim/unknown 에셋 ID에 묶여 있음. charId는 iseol/groomy로 수정 완료. 전용 아트 교체 필요.',
  },
  {
    id: 'ch2-rewrite-seoi-canon',
    status: 'completed',
    severity: 'info',
    note: '✅ CH2 전면 재작성: briefing_chat·aftermath_chat·vault_box, suspicion 제거, 박서이 캐논, guard/analyst/locker/server 분기.',
  },
  {
    id: 'iseol-antagonist-level',
    status: 'open',
    severity: 'gap',
    note: '❌ 강이솔(iseol) 가해·공범·단순 사수 중 어느 층인지 미확정. CH4 몰아가기·ch4_end_bad 분기만 존재.',
  },
]
