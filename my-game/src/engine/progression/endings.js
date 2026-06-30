// engine/progression/endings.js
// 변경: 임계값 재조정(5/8), 명시적 엔딩 플래그 우선, CH3~5 클리어 카피 추가

import {
  GROOMY_AFFINITY_TRUTH_MID_NORMAL_MAX,
  GROOMY_AFFINITY_TRUTH_MID_NORMAL_MIN,
  GROOMY_AFFINITY_TRUE_END_MIN,
} from '../../content/story/groomyAffinityThresholds.js'
import { GROOMY_INTERNAL_LOG_TEXT } from '../../content/story/groomyInternalLog.js'

export const PROJECT_GROOMY_ENDING_THRESHOLDS = {
  closeGroomy: GROOMY_AFFINITY_TRUE_END_MIN, // gates: TRUE ending
  mysterySolved: 8,
}

// CH2 임계값은 기존 유지 (이미 정상 작동 중)
export const CHAPTER_02_ENDING_THRESHOLDS = {
  investigation: 5,
  battery: 2,
  corporate: 3,
}

export const PROJECT_GROOMY_ENDINGS = {
  true: {
    id: 'true',
    title: 'TRUE END',
    titleKo: '잃은 것과 남은 것',
    summary: 'Expose the truth, escape with Groomy, and seek another battery source for the caretaker.',
    summaryKo: '진실을 폭로하고, 그루미와 함께 회사를 떠난다. 아라를 위한 다른 배터리는 둘이 함께 찾는다.',
    summaryKoMysterySolved:
      '진실을 전부 알고도 그루미를 선택했다. 박서이를 죽인 게 그루미의 손이었다는 것까지, 7분의 공백 동안 그루미가 도망치라고 외쳤다는 것까지. 그 모든 걸 알면서도 함께 걷기로 했다는 사실이, 이 선택을 단순한 동정이 아니라 — 끝까지 본 다음의 선택으로 만든다. 박서이가 일기에 남긴 마지막 바람이, 비로소 누군가에게 제대로 전해진 셈이다.',
    summaryKoMysteryUnsolved:
      '그루미와 함께 걷기로 한 건, 진실을 다 알기 전에 이미 마음이 정해져 있었기 때문이었다. 어쩌면 그게 더 솔직한 선택이었을 수도 있다 — 증거나 논리가 아니라, 그동안 쌓인 시간이 정한 선택. 다만 박서이의 진짜 마지막 1시간이 무엇이었는지는, 여전히 둘 다 정확히 모른 채로 함께 걷는다.',
  },
  normal: {
    id: 'normal',
    title: 'NORMAL END',
    titleKo: '대신 살아가는 사람',
    summary: 'Fail to expose the full truth, but keep Groomy close enough to leave together or stay by choice.',
    summaryKo: '진실은 끝까지 못 밝혔지만, 그루미가 스스로의 의지로 배터리를 내준다. 아라는 살아남고, 그루미의 자리에 묘한 공백이 남는다.',
    summaryKoTruthMid:
      '진실을 알았지만, 그루미와는 가까워지지 못했다. 그래도 그루미가 스스로의 의지로 배터리를 내준다. 아라는 살아남고, 그루미의 자리에 묘한 공백이 남는다.',
    summaryKoMysteryUnsolved:
      '끝내 다 맞추지 못한 채로 그루미를 떠나보냈다. 박서이가 마지막에 무슨 마음이었는지도, 그루미가 정말 무엇을 겪었는지도 — 정확히는 모른다. 그래도 그루미는 그 모든 걸 안고, 스스로 코어를 내줬다. 모르는 쪽이 오히려 더 미안해지는 결말이다.',
    summaryKoTruthMidMysterySolved:
      '진실은 빠짐없이 알았다. 박서이의 죽음도, 7분의 공백도, 그루미가 기억하지 못하는 이유도. 그런데도 끝내 가까워지지 못한 채 여기까지 왔다. 어쩌면 진실을 안다는 것과, 그 진실을 안고도 곁에 머무는 것은 — 전혀 다른 종류의 일이었던 모양이다.',
    summaryKoTruthMidMysteryUnsolved:
      '진실의 절반만 손에 쥔 채, 그루미와는 가까워지지 못한 채 여기까지 왔다. 박서이가 일기에 남긴 그 문장도, 격리된 1시간의 의미도, 끝내 다 맞춰보지 못한 채로. 그래도 그루미는 스스로 코어를 내줬다. 알면서도 멀어진 것과, 모른 채 멀어진 것 — 어느 쪽이 더 아픈지는 끝내 가르기 어렵다.',
  },
  badA: {
    id: 'badA',
    title: 'BAD END A',
    titleKo: '잘 가, 신입',
    summary: 'Expose the truth, then dismantle Groomy for the compatible battery.',
    summaryKo: '진실을 전부 알면서도 그루미를 해체한다. 아라는 살았지만, 집에 돌아온 당신은 그녀의 질문에 답할 수 없다.',
    summaryKoMysterySolved:
      '진실을 끝까지 추적해서 알았던 만큼, 이 선택의 무게도 더 또렷하게 다가온다. 그루미가 무엇을 겪었는지, 왜 기억하지 못하는지, 박서이가 마지막에 무엇을 남겼는지 — 전부 알면서도 같은 선택을 했다는 사실이 더 깊게 남는다. 알고도 그랬다. 그 한 문장이, 이후로도 오래 따라다닐 것 같다.',
    summaryKoMysteryUnsolved:
      '진실의 절반만 손에 쥔 채로 내린 선택이었다. 박서이가 일기에 남긴 그 문장도, 격리된 1시간의 의미도, 끝내 다 맞춰보지 못한 채로. 어쩌면 그게, 이 선택을 조금 더 가볍게 — 동시에 더 허무하게 — 만든 것 같다. 다 알았다면 다르게 정했을까. 그 질문에는, 끝내 답할 수 없다.',
  },
  badB: {
    id: 'badB',
    title: 'BAD END B',
    titleKo: '회전문',
    summary: 'Fail to expose the truth and dismantle Groomy with the outcome still uncertain.',
    summaryKo: '진실도 모른 채 망설임 없이 그루미를 해체한다. CARETAKER는 곧 다음 직원의 자리를 마련한다.',
    summaryKoMysterySolved:
      '모든 걸 알고도 이 길을 골랐다. 7분의 공백, 박서이의 마지막 일기, 그루미가 도망치라고 외쳤던 그 목소리까지 — 다 알면서도, 결국 가장 차가운 선택을 했다. 이 결말이 가장 무거운 이유는, 무지 때문이 아니라 외면 때문이라는 점이다.',
    summaryKoMysteryUnsolved:
      '끝내 아무것도 제대로 맞추지 못한 채로, 가장 빠른 길을 골랐다. 박서이가 누구였는지도, 왜 죽었는지도, 그루미가 무엇을 겪었는지도 모른 채. 회전문은 그렇게, 아무것도 묻지 않고 다음 사람을 들여보낸다. 가장 가벼운 무게로 끝나는 결말이지만, 그 가벼움 자체가 가장 큰 경고인 셈이다.',
  },
}

export const CHAPTER_02_ENDINGS = {
  compliance: {
    id: 'ch2_compliance',
    title: '감사 권한 보존',
    summary: '회사 시스템을 신뢰한 채 5층 기록을 공식 감사 루트로만 남겼습니다. 전임자의 흔적은 보고서 한 줄로 접혔습니다.',
  },
  expose: {
    id: 'ch2_expose',
    title: '사번 조작 확정',
    summary: '중복 센서 로그로 사번 조작을 확정했습니다. 회사는 당신을 위험 인물로 분류하기 시작합니다.',
  },
  coverup: {
    id: 'ch2_coverup',
    title: '은폐선 추적',
    summary: '순찰 공백과 배터리 규격표를 묶어 은폐선을 추적했습니다. 그루미의 배터리가 사건의 중심에 놓입니다.',
  },
  withdraw: {
    id: 'ch2_withdraw',
    title: '판단 보류',
    summary: '거울방에서 판단을 보류하고 후퇴했습니다. 기록은 남았지만, 회사는 당신을 아직 확정하지 못했습니다.',
  },
  incomplete: {
    id: 'ch2_incomplete',
    title: '조사 미완',
    summary: '5층의 단서를 모두 연결하지 못했습니다. 다음 장으로 넘어가기엔 기록이 부족합니다.',
  },
}

// ─────────────────────────────────────────
// NORMAL epilogue branch (ending-normal-truth-mid) — writer-confirmed 2026-05
// truthExposed + affinity 3–5 + !dismantledGroomy → still NORMAL id, distinct summaryKo.
// ─────────────────────────────────────────
export function isMysterySolvedFully(state) {
  if (state.flags.includes('ch3WithheldFinalDeduction')) return false
  const evidence = state.scores.mysteryEvidence ?? 0
  const concludedCorrectly =
    state.flags.includes('ch3ConcludedHomicide') ||
    state.flags.includes('ch3ConcludedGroomyLinkedDeath')
  return evidence >= PROJECT_GROOMY_ENDING_THRESHOLDS.mysterySolved && concludedCorrectly
}

export function isNormalEndingTruthMidAffinity(state) {
  const affinity = state.scores.groomyAffinity ?? 0
  return (
    state.flags.includes('truthExposed') &&
    !state.flags.includes('dismantledGroomy') &&
    !state.flags.includes('groomyStayedClose') &&
    affinity >= GROOMY_AFFINITY_TRUTH_MID_NORMAL_MIN &&
    affinity <= GROOMY_AFFINITY_TRUTH_MID_NORMAL_MAX
  )
}

export function resolveProjectGroomyEndingSummaryKo(state, ending) {
  const defs = PROJECT_GROOMY_ENDINGS[ending.id] ?? ending
  const mysterySolved = isMysterySolvedFully(state)

  if (ending.id === 'normal') {
    const truthMid = isNormalEndingTruthMidAffinity(state)
    if (truthMid) {
      if (mysterySolved && defs.summaryKoTruthMidMysterySolved) {
        return defs.summaryKoTruthMidMysterySolved
      }
      if (!mysterySolved && defs.summaryKoTruthMidMysteryUnsolved) {
        return defs.summaryKoTruthMidMysteryUnsolved
      }
      if (defs.summaryKoTruthMid) return defs.summaryKoTruthMid
    } else {
      if (!mysterySolved && defs.summaryKoMysteryUnsolved) {
        return defs.summaryKoMysteryUnsolved
      }
    }
  } else if (mysterySolved && defs.summaryKoMysterySolved) {
    return defs.summaryKoMysterySolved
  } else if (!mysterySolved && defs.summaryKoMysteryUnsolved) {
    return defs.summaryKoMysteryUnsolved
  }

  return ending.summaryKo ?? ending.summary
}

// ─────────────────────────────────────────
// Final ending resolver — QA matrix
// | dismantled | dismantledWithFullKnowledge | affinity / flags | ending |
// | true       | true                        | (ignored)        | badA   |
// | true       | false                       | (ignored)        | badB   |
// | false      | —                           | >= 6 or stayed   | TRUE   |
// | false      | —                           | else             | NORMAL |
// ─────────────────────────────────────────
export function resolveProjectGroomyEnding(state) {
  const affinity = state.scores.groomyAffinity ?? 0
  const dismantled = state.flags.includes('dismantledGroomy')
  const truthExposed = state.flags.includes('truthExposed')
  const closeEnoughForTrue =
    state.flags.includes('groomyStayedClose') ||
    affinity >= PROJECT_GROOMY_ENDING_THRESHOLDS.closeGroomy // gates: TRUE ending

  if (dismantled) {
    return state.flags.includes('dismantledWithFullKnowledge')
      ? PROJECT_GROOMY_ENDINGS.badA
      : PROJECT_GROOMY_ENDINGS.badB
  }

  if (truthExposed && closeEnoughForTrue) {
    return PROJECT_GROOMY_ENDINGS.true
  }

  return PROJECT_GROOMY_ENDINGS.normal
}

export function resolveChapter02Ending(state) {
  if (state.flags.includes('ch2_withheldMirrorJudgment')) return CHAPTER_02_ENDINGS.withdraw
  if (state.flags.includes('ch2_linkedBatteryToCoverup')) return CHAPTER_02_ENDINGS.coverup
  if (state.flags.includes('ch2_confirmedEmployeeIdSpoof')) return CHAPTER_02_ENDINGS.expose
  if (state.flags.includes('ch2_preservedAuditAccess')) return CHAPTER_02_ENDINGS.compliance

  const evidence = state.scores.mysteryEvidence ?? 0
  const battery = state.scores.batteryDesperation ?? 0
  const corporate = state.scores.corporateSuspicion ?? 0

  if (
    battery >= CHAPTER_02_ENDING_THRESHOLDS.battery &&
    evidence >= CHAPTER_02_ENDING_THRESHOLDS.investigation
  ) {
    return CHAPTER_02_ENDINGS.coverup
  }
  if (
    corporate >= CHAPTER_02_ENDING_THRESHOLDS.corporate &&
    evidence >= CHAPTER_02_ENDING_THRESHOLDS.investigation
  ) {
    return CHAPTER_02_ENDINGS.expose
  }
  if (evidence >= CHAPTER_02_ENDING_THRESHOLDS.investigation) {
    return CHAPTER_02_ENDINGS.compliance
  }
  return CHAPTER_02_ENDINGS.incomplete
}

// ─────────────────────────────────────────
// 챕터별 클리어 카피
// CH3~5 추가
// ─────────────────────────────────────────
export function resolveChapterClearCopy(chapterId, state) {
  if (chapterId === 'prologue') {
    return {
      kicker: 'PROLOGUE CLEAR',
      title: '임시 사원증',
      body: `${state.nickname}님은 전임자의 사원증으로 GROOMY OFFICE에 입장했습니다.`,
      sub: '첫날의 채팅 로그가 열립니다.',
    }
  }

  if (chapterId === 'chapter-01') {
    const evidenceCount = state.scores.mysteryEvidence ?? 0
    const reachedFloor3Door = state.flags.includes('ch1ReachedFloor3Exit')
    return {
      kicker: 'CHAPTER 1 CLEAR',
      title: '첫 번째 날',
      body: `${state.nickname}님, 살인 가능성 기록 ${evidenceCount}건을 확보했습니다.`,
      sub: reachedFloor3Door
        ? `3층 자료실 문 앞·비상계단까지 접근. 시체는 아직 확인하지 못했습니다. · 그루미 관계도: ${state.scores.groomyAffinity ?? 0}`
        : `3층 문 앞까지는 닿지 못했습니다. · 그루미 관계도: ${state.scores.groomyAffinity ?? 0}`,
    }
  }

  if (chapterId === 'chapter-02') {
    const ending = resolveChapter02Ending(state)
    return {
      kicker: 'CHAPTER 2 CLEAR',
      title: ending.title,
      body: ending.summary,
      sub: `의심 기록 ${state.scores.mysteryEvidence ?? 0} · 배터리 압박 ${state.scores.batteryDesperation ?? 0} · 회사 경계 ${state.scores.corporateSuspicion ?? 0}`,
    }
  }

  if (chapterId === 'chapter-03') {
    return {
      kicker: 'CHAPTER 3 CLEAR',
      title: '잊혀진 책상',
      body: `${state.nickname}님은 박서이 선임의 시체와 녹음을 확인했습니다. CARETAKER가 당신을 주시하기 시작합니다.`,
      sub: `그루미 관계도: ${state.scores.groomyAffinity ?? 0} · 의심 기록: ${state.scores.mysteryEvidence ?? 0}`,
    }
  }

  if (chapterId === 'chapter-04') {
    return {
      kicker: 'CHAPTER 4 CLEAR',
      title: '잘못 끼워진 카드',
      body: '그루미가 박서이를 죽인 실행자였음이 드러났습니다. 그리고 그루미는 자신이 한 일을 기억하지 못합니다.',
      sub: `그루미 관계도: ${state.scores.groomyAffinity ?? 0} · 배터리 압박: ${state.scores.batteryDesperation ?? 0}`,
    }
  }

  if (chapterId === 'chapter-05') {
    const ending = resolveProjectGroomyEnding(state)
    const copy = {
      kicker: 'FINAL CHAPTER · ENDING',
      title: ending.titleKo ?? ending.title,
      body: resolveProjectGroomyEndingSummaryKo(state, ending),
      sub: `[${ending.title}]`,
      continueLabel: '처음으로',
    }
    if (ending.id === 'true') {
      copy.bonusLog = GROOMY_INTERNAL_LOG_TEXT
    }
    return copy
  }

  return {
    kicker: 'SESSION TRANSFER READY',
    title: '세션 종료',
    body: `${state.nickname}님의 기록이 저장되었습니다.`,
    sub: resolveProjectGroomyEnding(state).titleKo ?? resolveProjectGroomyEnding(state).title,
  }
}
