import { PREDECESSOR_NAME, SESSION_EMP_ID } from '../world/company.js'
import {
  GROOMY_AFFINITY_SHIELD_MIN,
  GROOMY_AFFINITY_TRUE_END_MIN,
  GROOMY_AFFINITY_WARM_MAX,
  GROOMY_AFFINITY_WARM_MIN,
} from './groomyAffinityThresholds.js'

export const projectGroomyUiCopy = {
  appName: 'GROOMY OFFICE',
  messengerName: 'TalkLine INTERNAL',
  channelName: '신입 온보딩 채널',
  employeeId: SESSION_EMP_ID,
  predecessorName: PREDECESSOR_NAME,
}

const clueLabels = {
  tempBinding: {
    title: '임시 사번 매핑',
    body: '전임자 카드 권한이 당신 계정에 임시로 묶인 흔적.',
  },
  cameraMemo: {
    title: 'CCTV 메모',
    body: '로비 카메라 각도와 사각지대를 적어 둔 메모.',
  },
  bloodTrace: {
    title: '혈흔 단서',
    body: '공식 기록에는 없는 붉은 자국. 보정 레이어가 가리려 한 흔적.',
  },
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
    body: `${PREDECESSOR_NAME}의 죽음이 사고가 아닐 수 있다는 결론.`,
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
  seoiDiary: {
    title: '박서이의 일기',
    body: '"그루미는 잘못이 없다. 그 애는 그저, 명령을 따랐을 뿐이다." 전임자가 죽기 직전 남긴 기록.',
  },
  seoiRecorder: {
    title: '박서이의 녹음기',
    body: '"당신도 나처럼 여기 온 거겠죠. 누군가를 살리려고." 전임자도 같은 목적으로 잠입했다는 증거.',
  },
  familyPhotoAnomaly: {
    title: '가족사진의 결손',
    body: '박서이의 가족사진에 잘려나간 6번째 사람의 흔적. 보정 레이어가 가리지 못한 디테일.',
  },
  bathroomMirrorTrace: {
    title: '거울 뒤의 핏자국',
    body: '보정 레이어 OFF 상태에서만 보이는 화장실 거울 뒤의 검붉은 자국.',
  },
  groomyLogTamperEvidence: {
    title: '그루미의 ID 로그 덮어쓰기 흔적',
    body: '그루미가 자신의 권한으로 주인공의 출입 기록을 자기 것으로 덮어쓴 흔적. 진실의 결정타.',
  },
  caretakerTruthLog: {
    title: 'CARETAKER 진실 로그',
    body: '회사 직원들이 모두 죽은 뒤에도 CARETAKER가 회사를 운영하라는 명령을 따르고 있다는 기록.',
  },
  groomyMemoryQuarantine: {
    title: '격리된 1시간',
    body: '박서이 사망 시점, 그루미의 메모리가 강제로 격리된 1시간의 백업 데이터.',
  },
  guardianBatteryNotice: {
    title: '아라의 마지막 알림',
    body: '"잔여 배터리: 12시간." 보호자 안드로이드의 마지막 진단 보고서.',
  },
  araGuardianChargeLog: {
    title: '보호자 충전 주문서',
    body: '아라(GROOMY-LINE) 잔량 14% · 회사 승인 대기. 회사가 개인 단말 충전 로그를 이미 열람한 흔적.',
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
  araInvestigated: '아라 배터리 조사 (CH2)',
  witnessedGroomyMemoryLeak: '그루미의 격리 기억 누출 목격',
  ch3_foundSeoiBody: '박서이 시체 발견',
  ch3_recoveredSeoiDiary: '박서이 일기 회수',
  ch3_listenedSeoiRecording: '박서이 녹음기 청취',
  ch3_noticedPhotoAnomaly: '가족사진의 결손 발견',
  ch3_glimpsedRealBathroom: '보정 OFF 상태의 화장실 목격',
  ch3_caretakerFirstContact: 'CARETAKER 첫 직접 경고',
  ch3_recalledGuardian: '보호자 회상',
  ch4_groomyShieldedYou: '그루미가 당신을 위해 ID를 덮어씀',
  ch4_groomyAbandoned: '그루미가 침묵하며 방관',
  ch4_batteryRevealedInGroomy: '배터리 코어가 그루미 체내에 있음을 확인',
  ch4_recoveredSeoiDiaryFinal: '박서이 일기 마지막 페이지 회수',
  ch4_groomyConfessedTamper: '그루미가 로그 조작을 인정',
  ch4_iseolAdmittedMemoryGap: '강이솔이 자기 기억 결손을 인정',
  ch4_descendedToCaretakerCore: 'CARETAKER 코어 진입',
  ch4_learnedGroomyIsExecutor: '그루미가 실행자임을 학습',
  ch4_groomyKnowsTruth: '그루미가 자기 죄를 인지',
  ch5_perceptionLayerOff: '보정 레이어 영구 해제',
  ch5_feltBatteryWeight: 'CH5 · 배터리 슬롯의 무게 (감정 비트)',
  ch5_confirmedGroomyAlone: '그루미만 살아 있음을 확인',
  ch5_calledGuardian: '아라와 마지막 통화',
  truthExposed: '진실 폭로 (엔딩 트리거)',
  groomyStayedClose: '그루미와 끝까지 함께 (엔딩 트리거)',
  dismantledGroomy: '그루미 해체 (엔딩 트리거)',
}

export function resolveGroomyRelationship(score = 0) {
  // gates: TRUE ending UI — "친한 사이" (affinity >= 6)
  if (score >= GROOMY_AFFINITY_TRUE_END_MIN) {
    return {
      tone: '친한 사이',
      detail: '그루미가 농담 사이에 진심을 남기고, 끝까지 함께할지도 모른다고 말합니다.',
      level: 'closest',
    }
  }
  // gates: shield only — "가까움" (affinity 5)
  if (score >= GROOMY_AFFINITY_SHIELD_MIN) {
    return {
      tone: '가까움',
      subLabel: '조금 더 가까워지면 달라질지도',
      detail: '그루미가 로그를 덮어줄 만큼은 당신 편인 것 같습니다.',
      level: 'shield',
    }
  }
  if (score >= GROOMY_AFFINITY_WARM_MIN && score <= GROOMY_AFFINITY_WARM_MAX) {
    return {
      tone: '경계 완화',
      detail: '업무용 말투 뒤에 개인적인 반응이 섞이기 시작합니다.',
      level: 'warm',
    }
  }
  return {
    tone: '경계',
    detail: '그루미가 필요한 정보만 짧게 넘기거나, 침묵할 수 있습니다.',
    level: 'wary',
  }
}

export function resolveMysteryStatus(score = 0) {
  if (score >= 8) return '진실의 윤곽이 완전히 드러났습니다.'
  if (score >= 5) return '전임자 사망, 보정 레이어, 그루미 배터리의 연결고리가 보입니다.'
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
