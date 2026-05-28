import { EffectTypes, SceneModes } from '../../../engine/contracts.js'
import { CH02_ASSETS as ASSETS } from './assets.js'

const evidence = (amount = 1) => ({ type: EffectTypes.ADD_SCORE, score: 'mysteryEvidence', amount })
const suspicion = (amount = 1) => ({ type: EffectTypes.ADD_SCORE, score: 'corporateSuspicion', amount })
const batteryPressure = (amount = 1) => ({ type: EffectTypes.ADD_SCORE, score: 'batteryDesperation', amount })
const groomyClose = { type: EffectTypes.ADD_SCORE, score: 'groomyAffinity', amount: 1 }

export const rawChapter02Scenes = {
  arrival_vn: {
    id: 'chapter-02.arrival_vn',
    chapterId: 'chapter-02',
    localId: 'arrival_vn',
    mode: SceneModes.VN,
    backgroundAssetId: ASSETS.bg.lobby,
    vnStage: {
      bgId: ASSETS.bg.lobby,
      overlayId: ASSETS.overlay.scanline,
      characters: [],
    },
    lines: [
      {
        char: 'iseol',
        text: '5층 보안감사 구역은 원래 신입 출입 금지예요.',
        portrait: { charId: 'kim', baseId: ASSETS.portrait.kimBase, position: 'left', expression: 'neutral' },
        portraitAssetId: ASSETS.portrait.kimBase,
      },
      {
        char: 'iseol',
        text: '그래도 3층 로그가 여기로 이관됐다는 말이 맞다면 확인해야 해요.',
        portrait: { charId: 'kim', baseId: ASSETS.portrait.kimWarn, position: 'left', expression: 'warning' },
        portraitAssetId: ASSETS.portrait.kimWarn,
      },
      {
        char: 'groomy',
        text: '전임자가 여기서 뭘 숨겼는지부터 보죠.',
        portrait: { charId: 'unknown', baseId: ASSETS.portrait.unknownSmile, position: 'right', expression: 'smile' },
        portraitAssetId: ASSETS.portrait.unknownSmile,
      },
    ],
    choices: [
      {
        text: '전임자 접속 로그부터 확인한다.',
        next: 'signal_vn',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch2_checkedPredecessorLogFirst' },
          { type: EffectTypes.ADD_ITEM, item: 'floor5AccessTrace' },
          evidence(1),
        ],
      },
      {
        text: '3층 출입기록부터 확보한다.',
        next: 'signal_vn',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch2_checkedDoorFirst' },
          { type: EffectTypes.ADD_ITEM, item: 'floor3EntryLog' },
          suspicion(1),
        ],
      },
    ],
  },
  signal_vn: {
    id: 'chapter-02.signal_vn',
    chapterId: 'chapter-02',
    localId: 'signal_vn',
    mode: SceneModes.VN,
    important: true,
    backgroundAssetId: ASSETS.bg.serverHall,
    vnStage: {
      bgId: ASSETS.bg.serverHall,
      overlayId: ASSETS.overlay.glitchSoft,
      characters: [],
    },
    lines: [
      {
        char: 'system',
        text: '서버홀 모니터가 일제히 깜빡이고, 전임자 계정과 당신의 임시 사번이 겹친다.',
        isNarration: true,
      },
      {
        char: 'iseol',
        text: '화면에 보이는 계정이 당신 카드와 중첩돼요.',
        portrait: { charId: 'kim', baseId: ASSETS.portrait.kimFear, position: 'left', expression: 'fear' },
        portraitAssetId: ASSETS.portrait.kimFear,
      },
      {
        char: 'groomy',
        text: '중첩이 아니라 임시 매핑이에요. 회사가 그렇게 부르고 싶어 하니까.',
        portrait: { charId: 'unknown', baseId: ASSETS.portrait.unknownBlank, position: 'center', expression: 'blank' },
        portraitAssetId: ASSETS.portrait.unknownBlank,
      },
    ],
    next: 'briefing_chat',
  },
  briefing_chat: {
    id: 'chapter-02.briefing_chat',
    chapterId: 'chapter-02',
    localId: 'briefing_chat',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    systemMessage: 'GROOMY OFFICE · 5F 감사 채널',
    lines: [
      { char: 'iseol', text: '오늘 목표는 공식 감사 로그만 남기는 거예요.' },
      { char: 'groomy', text: '비공식 목표는 전임자가 왜 5층에 남았는지 찾는 거고요.' },
      { char: 'system', text: '채널에 "외부 조사 금지" 워터마크가 자동으로 붙는다.', isNarration: true },
    ],
    choices: [
      {
        text: '공식 절차를 따르겠다고 답한다.',
        next: 'floor5_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch2_acceptedOfficialAudit' },
          suspicion(-1),
        ],
      },
      {
        text: '전임자 흔적을 우선하겠다고 답한다.',
        next: 'floor5_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch2_prioritizedPredecessorTrail' },
          evidence(1),
          suspicion(1),
        ],
      },
    ],
  },
  floor5_rpg: {
    id: 'chapter-02.floor5_rpg',
    chapterId: 'chapter-02',
    localId: 'floor5_rpg',
    mode: SceneModes.RPG,
    mapId: 'floor5',
  },
  server_panel_chat: {
    id: 'chapter-02.server_panel_chat',
    chapterId: 'chapter-02',
    localId: 'server_panel_chat',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    returnTo: 'floor5_rpg',
    lines: [
      { char: 'system', text: '서버 패널에 전임자 계정의 마지막 원격 명령이 남아 있다.', isNarration: true },
      { char: 'groomy', text: '명령 이름은 "BATTERY_COMPAT_CHECK"예요. 사무용 장비가 아닙니다.' },
      { char: 'iseol', text: '이건 감사 보고서에 넣으면 안 되는 항목이에요.' },
    ],
    choices: [
      {
        text: '명령 로그를 캡처한다.',
        next: 'floor5_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch2_capturedServerCommand' },
          { type: EffectTypes.ADD_ITEM, item: 'auditLedgerFragment' },
          evidence(2),
          batteryPressure(1),
        ],
      },
      {
        text: '이솔에게만 공유한다.',
        next: 'floor5_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch2_sharedServerCommandWithIseol' },
          evidence(1),
          groomyClose,
        ],
      },
    ],
  },
  records_vn: {
    id: 'chapter-02.records_vn',
    chapterId: 'chapter-02',
    localId: 'records_vn',
    mode: SceneModes.VN,
    backgroundAssetId: ASSETS.bg.serverHall,
    vnStage: {
      bgId: ASSETS.bg.serverHall,
      overlayId: ASSETS.overlay.scanline,
      characters: [],
    },
    lines: [
      { char: 'system', text: '기록실 문이 열리고, 종이 대신 냉각 팬 소리가 밀려온다.', isNarration: true },
      { char: 'iseol', text: '여기 원장은 수기가 아니라 센서가 씁니다.', portrait: { charId: 'kim', baseId: ASSETS.portrait.kimBase, position: 'left' }, portraitAssetId: ASSETS.portrait.kimBase },
      { char: 'groomy', text: '그래서 지우기 어렵죠. 지우려면 누군가 살아 있어야 하고요.', portrait: { charId: 'unknown', baseId: ASSETS.portrait.unknownSmile, position: 'right' }, portraitAssetId: ASSETS.portrait.unknownSmile },
    ],
    next: 'records_rpg',
    effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch2_enteredRecordsVault' }],
  },
  records_rpg: {
    id: 'chapter-02.records_rpg',
    chapterId: 'chapter-02',
    localId: 'records_rpg',
    mode: SceneModes.RPG,
    mapId: 'recordsVault',
  },
  vault_terminal_chat: {
    id: 'chapter-02.vault_terminal_chat',
    chapterId: 'chapter-02',
    localId: 'vault_terminal_chat',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    important: true,
    returnTo: 'records_rpg',
    lines: [
      { char: 'system', text: '감사 원장에 "박준혁 / 임시매핑 / 42초차" 항목이 반복된다.', isNarration: true, important: true },
      { char: 'groomy', text: '회사는 이걸 버그라고 부르고, 우리는 패턴이라고 부를 수 있어요.' },
    ],
    choices: [
      {
        text: '원장 전체를 보낸다.',
        next: 'records_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch2_exportedAuditLedger' },
          { type: EffectTypes.ADD_ITEM, item: 'vaultTamperTrace' },
          evidence(2),
          suspicion(1),
        ],
      },
      {
        text: '핵심 줄만 메모한다.',
        next: 'records_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch2_skimmedAuditLedger' },
          evidence(1),
        ],
      },
    ],
  },
  vault_box_chat: {
    id: 'chapter-02.vault_box_chat',
    chapterId: 'chapter-02',
    localId: 'vault_box_chat',
    mode: SceneModes.CHAT,
    returnTo: 'records_rpg',
    lines: [
      { char: 'system', text: '박스 안에는 전임자 명의의 빈 감사 서류 봉투가 있다.', isNarration: true },
      { char: 'iseol', text: '내용물은 비었는데, 봉인 스티커만 새 거예요.' },
    ],
    effects: [
      { type: EffectTypes.ADD_FLAG, flag: 'ch2_foundEmptyAuditEnvelope' },
      evidence(1),
    ],
  },
  guard_chat: {
    id: 'chapter-02.guard_chat',
    chapterId: 'chapter-02',
    localId: 'guard_chat',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    returnTo: 'floor5_rpg',
    lines: [
      { char: 'groomy', text: '보안요원 서준이 아직 채널에 남아 있어요.' },
      { char: 'groomy', text: '서준은 사고 당일 5층 순찰을 "서버 팬 과열"로만 기록했습니다.' },
      { char: 'system', text: '채널 상단에 회사 보안팀의 자동 모니터링 배지가 켜진다.', isNarration: true },
    ],
    choices: [
      {
        text: '규정 질문만 남기고 의심을 낮춘다.',
        next: 'floor5_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch2_trustedSystem' },
          { type: EffectTypes.ADD_FLAG, flag: 'ch2_guardProtocolAccepted' },
        ],
      },
      {
        text: '순찰 공백 11분을 추궁한다.',
        next: 'floor5_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch2_distrustedSystem' },
          { type: EffectTypes.ADD_ITEM, item: 'guardIncidentMemo' },
          suspicion(1),
          evidence(1),
        ],
      },
    ],
  },
  analyst_chat: {
    id: 'chapter-02.analyst_chat',
    chapterId: 'chapter-02',
    localId: 'analyst_chat',
    mode: SceneModes.CHAT,
    emotion: 'nervous',
    returnTo: 'floor5_rpg',
    lines: [
      { char: 'iseol', text: '5층 센서가 같은 사번을 두 명으로 측정해요.' },
      { char: 'iseol', text: '한쪽은 당신, 다른 한쪽은 박준혁 선임의 마지막 접속 기록이에요.' },
      { char: 'groomy', text: '타임스탬프가 이상합니다. 같은 사번인데 42초 차이로 서로 다른 문을 통과했어요.' },
    ],
    choices: [
      {
        text: '원본 센서 로그를 내려받는다.',
        next: 'floor5_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch2_downloadedSensorLog' },
          { type: EffectTypes.ADD_ITEM, item: 'duplicateSensorLog' },
          evidence(2),
        ],
      },
      {
        text: '분석가에게 요약본만 요청한다.',
        next: 'floor5_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch2_requestedAnalystSummary' },
          { type: EffectTypes.ADD_ITEM, item: 'sanitizedAuditSummary' },
          evidence(1),
        ],
      },
    ],
  },
  locker_chat: {
    id: 'chapter-02.locker_chat',
    chapterId: 'chapter-02',
    localId: 'locker_chat',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    important: true,
    returnTo: 'floor5_rpg',
    lines: [
      { char: 'system', text: '보관함 내부에서 전임자의 예비 사원증이 발견됐다.', isNarration: true },
      { char: 'system', text: '사원증 뒷면에는 배터리 규격표 일부가 붙어 있다.', isNarration: true, important: true },
      { char: 'groomy', text: '이 규격은 사무실 장비용이 아닙니다. 누군가 살아 있어야 하는 장치 쪽에 가까워요.' },
    ],
    choices: [
      {
        text: '규격표를 조용히 챙긴다.',
        next: 'floor5_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch2_pocketedBatterySpec' },
          { type: EffectTypes.ADD_ITEM, item: 'batterySpecFragment' },
          batteryPressure(1),
          evidence(1),
        ],
      },
      {
        text: '이솔에게 먼저 공유한다.',
        next: 'floor5_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch2_sharedBatterySpecWithIseol' },
          { type: EffectTypes.ADD_ITEM, item: 'batterySpecFragment' },
          batteryPressure(1),
          evidence(1),
          groomyClose,
        ],
      },
    ],
  },
  escalation_vn: {
    id: 'chapter-02.escalation_vn',
    chapterId: 'chapter-02',
    localId: 'escalation_vn',
    mode: SceneModes.VN,
    important: true,
    backgroundAssetId: ASSETS.bg.serverHall,
    vnStage: {
      bgId: ASSETS.bg.serverHall,
      overlayId: ASSETS.overlay.glitchSoft,
      characters: [],
    },
    requirements: [{ type: 'score', score: 'mysteryEvidence', min: 3 }],
    lines: [
      { char: 'system', text: '감사 경보등이 붉게 점등한다. 5층 전체가 "외부 조사" 상태로 전환된다.', isNarration: true, important: true },
      { char: 'iseol', text: '이제 뒤로 물러나도 기록은 남아요.', portrait: { charId: 'kim', baseId: ASSETS.portrait.kimWarn, position: 'left' }, portraitAssetId: ASSETS.portrait.kimWarn },
      { char: 'groomy', text: '남길지, 지울지, 아니면 덮을지. 다음 방에서 결정해요.', portrait: { charId: 'unknown', baseId: ASSETS.portrait.unknownSmile, position: 'center' }, portraitAssetId: ASSETS.portrait.unknownSmile },
    ],
    returnTo: 'floor5_rpg',
    effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch2_triggeredAuditAlarm' }, suspicion(1)],
  },
  mirror_clue_vn: {
    id: 'chapter-02.mirror_clue_vn',
    chapterId: 'chapter-02',
    localId: 'mirror_clue_vn',
    mode: SceneModes.VN,
    important: true,
    backgroundAssetId: ASSETS.bg.mirrorRoom,
    vnStage: {
      bgId: ASSETS.bg.mirrorRoom,
      overlayId: ASSETS.overlay.glitchSoft,
      characters: [],
    },
    requirements: [{ type: 'flag', flag: 'ch2_triggeredAuditAlarm' }],
    lines: [
      {
        char: 'system',
        text: '깨진 모니터마다 서로 다른 시간의 박준혁 선임이 비친다.',
        isNarration: true,
      },
      {
        char: 'system',
        text: '사번 중첩, 순찰 공백, 배터리 규격표가 같은 5층 서버홀 타임라인 위에 겹친다.',
        isNarration: true,
        important: true,
      },
      {
        char: 'groomy',
        text: '누가 거짓말했는지 고르면, 나머지는 기록으로 남아요.',
        portrait: { charId: 'unknown', baseId: ASSETS.portrait.unknownSmile, position: 'center', expression: 'smile' },
        portraitAssetId: ASSETS.portrait.unknownSmile,
      },
      {
        char: 'iseol',
        text: '판단해요. 지금 선택이 다음 조사 권한을 바꿀 거예요.',
        portrait: { charId: 'kim', baseId: ASSETS.portrait.kimWarn, position: 'left', expression: 'warning' },
        portraitAssetId: ASSETS.portrait.kimWarn,
      },
    ],
    choices: [
      {
        text: '시스템 지시를 따라 감사 권한을 보존한다.',
        next: 'aftermath_chat',
        requirements: [{ type: 'flag', flag: 'ch2_trustedSystem' }],
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch2_preservedAuditAccess' }],
      },
      {
        text: '중복 센서 로그로 사번 조작을 확정한다.',
        next: 'aftermath_chat',
        requirements: [{ type: 'item', item: 'duplicateSensorLog' }],
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch2_confirmedEmployeeIdSpoof' },
          evidence(2),
        ],
      },
      {
        text: '순찰 공백과 배터리 규격표를 묶어 은폐선을 추적한다.',
        next: 'aftermath_chat',
        requirements: [
          { type: 'item', item: 'guardIncidentMemo' },
          { type: 'item', item: 'batterySpecFragment' },
        ],
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch2_linkedBatteryToCoverup' },
          batteryPressure(1),
          evidence(2),
        ],
      },
      {
        text: '판단을 보류하고 후퇴한다.',
        next: 'aftermath_chat',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch2_withheldMirrorJudgment' }],
      },
    ],
  },
  aftermath_chat: {
    id: 'chapter-02.aftermath_chat',
    chapterId: 'chapter-02',
    localId: 'aftermath_chat',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'system', text: '거울방 기록이 감사 채널에 자동 업로드된다.', isNarration: true },
      { char: 'iseol', text: '이제 회사도 당신 선택을 봤어요.' },
      { char: 'groomy', text: '다음은 제 채널에서 마무리할게요.' },
    ],
    next: 'groomy_debrief',
  },
  groomy_debrief: {
    id: 'chapter-02.groomy_debrief',
    chapterId: 'chapter-02',
    localId: 'groomy_debrief',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'groomy', text: '2장은 여기까지예요. 당신이 남긴 기록은 제 메모리에도 남습니다.' },
      { char: 'groomy', text: '배터리, 사번, 순찰 공백. 셋 중 둘만 맞아도 회사는 움직여요.' },
      { char: 'groomy', text: '다음 장에서는 "진실"과 "보호자" 중 무엇을 먼저 고를지 정해질 거예요.' },
    ],
    next: 'chapter_end',
    effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch2_completedInvestigation' }],
  },
  chapter_end: {
    id: 'chapter-02.chapter_end',
    chapterId: 'chapter-02',
    localId: 'chapter_end',
    mode: SceneModes.END,
    title: '감사 구역',
  },
}
