import { PREDECESSOR_NAME, SESSION_EMP_ID } from '../world/company.js'

export const projectGroomyUiCopy = {
  appName: 'GROOMY OFFICE',
  messengerName: 'TalkLine INTERNAL',
  channelName: '신입 온보딩 채널',
  employeeId: SESSION_EMP_ID,
  predecessorName: PREDECESSOR_NAME,
}

const clueLabels = {
  predecessorIdCard: {
    title: '전임자 사원증',
    body: '죽은 전임자의 권한이 임시로 매핑된 카드.',
  },
  batteryReceipt: {
    title: '배터리 영수증',
    body: '3층으로 배송된 소형 고밀도 배터리 셀 구매 기록.',
  },
  threatChatlog: {
    title: '협박성 채팅 로그',
    body: '“그 애가 꺼져.”라는 문장이 남은 마지막 대화 일부.',
  },
  floor3EntryLog: {
    title: '3층 출입 로그',
    body: '입장 기록은 있지만 퇴장 기록이 없는 전임자 계정 로그.',
  },
  murderInference: {
    title: '첫 번째 추론',
    body: '박준혁 선임의 죽음이 사고가 아닐 수 있다는 결론.',
  },
  groomyBatteryLead: {
    title: '그루미 배터리 단서',
    body: '그루미의 배터리 규격이 사건과 보호자 문제 양쪽에 닿아 있다.',
  },
  floor5AccessTrace: {
    title: '5층 접속 흔적',
    body: '전임자 계정과 임시 사번이 5층 보안감사 구역에서 겹친 기록.',
  },
  guardIncidentMemo: {
    title: '순찰 공백 메모',
    body: '사고 당일 서버홀 순찰 기록에서 11분이 비어 있다.',
  },
  duplicateSensorLog: {
    title: '중복 센서 로그',
    body: '같은 사번이 42초 차이로 서로 다른 문을 지난 원본 로그.',
  },
  sanitizedAuditSummary: {
    title: '감사 로그 요약본',
    body: '분석가가 정리한 5층 센서 이상 요약. 원본보다 정보가 적다.',
  },
  batterySpecFragment: {
    title: '배터리 규격표 조각',
    body: '전임자 예비 사원증 뒤에 붙어 있던 비업무용 배터리 규격 일부.',
  },
  auditLedgerFragment: {
    title: '서버 명령 로그',
    body: 'BATTERY_COMPAT_CHECK 원격 명령의 캡처본.',
  },
  vaultTamperTrace: {
    title: '감사 원장 복사본',
    body: '42초 차 중복 사번 패턴이 반복되는 5층 감사 원장.',
  },
}

const flagLabels = {
  taggedEntranceDoor: '입구 인증 완료',
  metIseolPolitely: '강이솔 선임과 첫 인사',
  askedAboutPredecessorEarly: '전임자 이름을 초반에 언급',
  ch1ConcludedMurderLikely: '사고사가 아닐 가능성 제기',
  ch1SuspectsGroomyBattery: '그루미 배터리 연관성 의심',
  ch1WithheldDeduction: '첫 번째 결론 보류',
  hintedCaretakerMotive: '보호자 동기를 일부 암시',
  concealedBatteryClue: '배터리 단서 은폐',
  trustedGroomyBypass: '그루미 우회 권한 신뢰',
  usedPredecessorCardAuth: '전임자 카드 권한 직접 사용',
  keptBatteryReceipt: '배터리 영수증 보관',
  askedBatteryEarly: '배터리 용도 질문',
  hidCaretakerMotive: '보호자 동기 은폐',
  promisedNotToRecordGroomy: '그루미 발언 비기록 약속',
  recordedGroomySlip: '그루미 발언 기록',
  challengedAccidentReport: '사고 보고서에 이의 제기',
  learnedJunhyeokTriedShutdown: '전임자의 그루미 종료 시도 파악',
  requestedFloor3Log: '3층 로그 요청',
  ch2_checkedPredecessorLogFirst: '전임자 접속 로그 우선 확인',
  ch2_checkedDoorFirst: '3층 출입기록 우선 확보',
  ch2_guardProtocolAccepted: '보안요원에게 규정 질문만 남김',
  ch2_distrustedSystem: '시스템 지시 불신',
  ch2_downloadedSensorLog: '원본 센서 로그 확보',
  ch2_requestedAnalystSummary: '분석가 요약본 확보',
  ch2_pocketedBatterySpec: '배터리 규격표 은밀히 보관',
  ch2_sharedBatterySpecWithIseol: '배터리 규격표를 이솔과 공유',
  ch2_preservedAuditAccess: '감사 권한 보존',
  ch2_confirmedEmployeeIdSpoof: '사번 조작 가능성 확정',
  ch2_linkedBatteryToCoverup: '배터리 단서와 은폐선 연결',
  ch2_withheldMirrorJudgment: '거울방 판단 보류',
  ch2_acceptedOfficialAudit: '공식 감사 절차 수용',
  ch2_prioritizedPredecessorTrail: '전임자 흔적 우선',
  ch2_capturedServerCommand: '서버 명령 로그 캡처',
  ch2_sharedServerCommandWithIseol: '서버 로그를 이솔과 공유',
  ch2_enteredRecordsVault: '기록 보관실 진입',
  ch2_exportedAuditLedger: '감사 원장 전체 확보',
  ch2_skimmedAuditLedger: '감사 원장 요약 확보',
  ch2_foundEmptyAuditEnvelope: '빈 감사 봉투 발견',
  ch2_triggeredAuditAlarm: '5층 감사 경보 발생',
  ch2_completedInvestigation: '2장 조사 완료',
}

export function resolveGroomyRelationship(score = 0) {
  if (score >= 4) {
    return {
      tone: '가까움',
      detail: '그루미가 농담 사이에 진심을 조금씩 남깁니다.',
      level: 'close',
    }
  }
  if (score >= 1) {
    return {
      tone: '경계 완화',
      detail: '업무용 말투 뒤에 개인적인 반응이 섞이기 시작합니다.',
      level: 'warm',
    }
  }
  if (score <= -2) {
    return {
      tone: '거리둠',
      detail: '그루미가 필요한 정보만 짧게 넘깁니다.',
      level: 'distant',
    }
  }
  return {
    tone: '관찰 중',
    detail: '서로가 서로를 아직 판단하고 있습니다.',
    level: 'neutral',
  }
}

export function resolveMysteryStatus(score = 0) {
  if (score >= 6) return '사건의 윤곽이 거의 드러났습니다.'
  if (score >= 3) return '전임자 사망과 3층 기록이 연결되고 있습니다.'
  if (score >= 1) return '이상한 기록이 하나씩 쌓이고 있습니다.'
  return '아직 공식 안내 밖의 단서는 부족합니다.'
}

export function resolvePressureStatus({ batteryDesperation = 0, corporateSuspicion = 0 } = {}) {
  return {
    battery: batteryDesperation >= 3
      ? '보호자를 살릴 방법이 점점 좁아지고 있습니다.'
      : batteryDesperation >= 1
        ? '배터리 단서가 개인적인 목적과 연결됩니다.'
        : '보호자에 대한 동기는 아직 드러나지 않았습니다.',
    corporate: corporateSuspicion >= 3
      ? '회사가 당신의 움직임을 위험 신호로 보고 있습니다.'
      : corporateSuspicion >= 1
        ? '일부 직원이 당신의 조사를 의식하기 시작했습니다.'
        : '회사 쪽 경계는 아직 낮습니다.',
  }
}

export function resolveKnownClues(inventory = []) {
  return inventory.map((item) => ({
    id: item,
    title: clueLabels[item]?.title ?? item,
    body: clueLabels[item]?.body ?? '아직 정리되지 않은 단서입니다.',
  }))
}

export function resolveKnownRecords(flags = []) {
  return flags
    .filter((flag) => flagLabels[flag])
    .map((flag) => ({ id: flag, label: flagLabels[flag] }))
}
