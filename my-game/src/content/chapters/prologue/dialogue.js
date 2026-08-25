// content/chapters/prologue/dialogue.js
// 전면 재작성: 그루미 톤 다듬기(한 호흡 한 문장), 보정 레이어 의미화,
// 박서이 전임자, CARETAKER SYSTEMS 적용

import { EffectTypes, SceneModes } from '../../../engine/contracts.js'
import {
  COMPANY,
  PREDECESSOR_NAME,
  SESSION_EMP_ID,
  PERCEPTION_LAYER,
} from '../../world/company.js'

export const prologueBootLines = [
  `${COMPANY.legal} · TalkLine v2.1`,
  '[ OK ] NFC TOKEN ACCEPTED',
  `[ WARN ] TEMP_CARD_BINDING · ${SESSION_EMP_ID}`,
  `[ WARN ] PRED_ID(${PREDECESSOR_NAME}) → 활성 사용자`,
  `[ INIT ] ${PERCEPTION_LAYER.ON} · BCI 동기화 대기`,
  'Launching GROOMY Assistant...',
]

const rawPrologueScenes = {
  // ─────────────────────────────────────────
  // start — 취업 직후, 기억이 끊기는 직전
  // ─────────────────────────────────────────
  start: {
    id: 'prologue.start',
    chapterId: 'prologue',
    localId: 'start',
    mode: SceneModes.VN,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'system', text: '삑-', isNarration: true, important: true },
      { char: 'player', text: '회사에 취업했다.' },
      { char: 'player', text: '대기업의 러브 콜.' },
      { char: 'player', text: '완벽한 스펙.' },
      { char: 'player', text: '그리고 내가 선택한.' },
      { char: 'player', text: '이 작은 회사.' },
      { char: 'player', text: '내가 여기 온 이유는—' },
      { char: 'system', text: '시야가 한 번 깜빡인다.', isNarration: true, important: true },
    ],
    next: 'entrance_bridge',
  },

  // ─────────────────────────────────────────
  // entrance_bridge — ProjectOfficeIntro 직후. 문 밖→안(OFF) 연결
  // ─────────────────────────────────────────
  entrance_bridge: {
    id: 'prologue.entrance_bridge',
    chapterId: 'prologue',
    localId: 'entrance_bridge',
    mode: SceneModes.VN,
    emotion: 'nervous',
    important: true,
    lines: [
      { char: 'system', text: '문 틈으로 낡은 실내가 보인다.', isNarration: true, important: true },
      { char: 'system', text: `${PERCEPTION_LAYER.OFF} · 보정 없음`, isNarration: true },
      { char: 'system', text: '발을 들이면 곰팡이 냄새가 먼저 올라온다.', isNarration: true },
      { char: 'player', text: '…머리가 너무 아파.' },
      { char: 'player', text: '여기가 어디지?' },
      { char: 'system', text: '낡은 로비 천장등이 한 박자 늦게 켜진다.', isNarration: true },
      { char: 'player', text: '…회사. 그래.' },
      { char: 'player', text: '여긴—' },
    ],
    next: 'lobby_reveal',
  },

  // ─────────────────────────────────────────
  // lobby_reveal — 보정 레이어 ON. 발을 들이는 순간 폐건물 → GROOMY OFFICE
  // 이중 명칭(법인:CARETAKER SYSTEMS / 환영:GROOMY OFFICE)이 처음 드러나는 순간
  // ─────────────────────────────────────────
  lobby_reveal: {
    id: 'prologue.lobby_reveal',
    chapterId: 'prologue',
    localId: 'lobby_reveal',
    mode: SceneModes.VN,
    emotion: 'friendly',
    important: true,
    lines: [
      { char: 'system', text: '삑-', isNarration: true, important: true },
      { char: 'system', text: `${PERCEPTION_LAYER.ON} · 동기화 완료`, isNarration: true },
      { char: 'system', text: '곰팡이 냄새가 사라진다.', isNarration: true },
      { char: 'system', text: '벽면의 금 간 타일이 흰 조명 아래로 접힌다.', isNarration: true },
      { char: 'system', text: '— GROOMY OFFICE —', isNarration: true, important: true },
      { char: 'system', text: '밝은 로비가 한 번에 펼쳐진다.', isNarration: true, important: true },
    ],
    next: 'groomy_intro',
    effects: [{ type: EffectTypes.ADD_FLAG, flag: 'perceptionLayerSynced' }],
  },

  // ─────────────────────────────────────────
  // groomy_intro — 밝아진 로비 안 첫 대면. 미소가 굳었다 풀리는 0.3초.
  // 5단 복선 #2: 전임자 카드 인식 직후 격리 메모리의 일순간 활성화
  // ─────────────────────────────────────────
  groomy_intro: {
    id: 'prologue.groomy_intro',
    chapterId: 'prologue',
    localId: 'groomy_intro',
    mode: SceneModes.VN,
    emotion: 'friendly',
    lines: [
      { char: 'system', text: '그루미가 당신을 본다.', isNarration: true },
      { char: 'groomy', text: '…' },
      { char: 'player', text: '어라. 여기—' },
      { char: 'groomy', text: '…어?' },
      { char: 'system', text: '미소가 0.3초간 굳는다.', isNarration: true, important: true },
      { char: 'groomy', text: '…아.' },
      { char: 'groomy', text: '하.' },
      { char: 'groomy', text: '하하.' },
      { char: 'groomy', text: '처음 오셨군요.' },
      { char: 'groomy', text: '환영합니다, 신입 사원.' },
      { char: 'system', text: '놀란 표정은 순식간에 접히고, 웃음만 남는다.', isNarration: true, important: true },
    ],
    next: 'chat_boot',
  },

  // ─────────────────────────────────────────
  // chat_boot — TalkLine 시작. 삑- 직전까지만 이 시나리오.
  // ─────────────────────────────────────────
  chat_boot: {
    id: 'prologue.chat_boot',
    chapterId: 'prologue',
    localId: 'chat_boot',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    systemMessage: 'GROOMY가 TalkLine 내부 채널에 접속했습니다.',
    lines: [
      { char: 'groomy', text: '안녕하세요.' },
      { char: 'groomy', text: 'TalkLine에 오신 걸 환영해요.' },
      { char: 'groomy', text: '접속은 잘 된 것 같네요.' },
    ],
    choices: [
      {
        text: '네?',
        next: 'chat_call_me',
      },
    ],
  },

  chat_call_me: {
    id: 'prologue.chat_call_me',
    chapterId: 'prologue',
    localId: 'chat_call_me',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    lines: [
      { char: 'groomy', text: '그루미라고 부르세요.' },
      { char: 'groomy', text: '이름 뜻은 묻지 마시고.' },
      { char: 'groomy', text: '당신도 당신 이름 뜻 모르잖아?' },
    ],
    choices: [
      {
        text: '아는데요',
        next: 'chat_meaning_know',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'claimedToKnowNameMeaning' }],
      },
      {
        text: '네…',
        next: 'chat_meaning_quiet',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'admittedNameMeaningUnknown' }],
      },
    ],
  },

  chat_meaning_know: {
    id: 'prologue.chat_meaning_know',
    chapterId: 'prologue',
    localId: 'chat_meaning_know',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    lines: [
      { char: 'groomy', text: '아 예. 참 대단하십니다.' },
    ],
    next: 'ask_nickname',
  },

  chat_meaning_quiet: {
    id: 'prologue.chat_meaning_quiet',
    chapterId: 'prologue',
    localId: 'chat_meaning_quiet',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    lines: [
      { char: 'groomy', text: '숫기도 없으시네.' },
    ],
    next: 'ask_nickname',
  },

  // ─────────────────────────────────────────
  // ask_nickname — 기존 표시이름 입력 시스템 유지
  // ─────────────────────────────────────────
  ask_nickname: {
    id: 'prologue.ask_nickname',
    chapterId: 'prologue',
    localId: 'ask_nickname',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    lines: [
      { char: 'groomy', text: '본론으로 가죠.' },
      { char: 'groomy', text: '아까는 시스템에 접속이 안 됐어요.' },
      { char: 'groomy', text: '아까 입력하신 그 이름은,' },
      { char: 'groomy', text: '제가 인식하지 못 했다는 뜻이에요.' },
      { char: 'groomy', text: '자, 아래 보여요?' },
      { char: 'groomy', text: '적어요. 이름.' },
    ],
    input: { type: 'nickname', next: 'after_nickname' },
  },

  // ─────────────────────────────────────────
  // after_nickname — 이름 확인 후
  // ─────────────────────────────────────────
  after_nickname: {
    id: 'prologue.after_nickname',
    chapterId: 'prologue',
    localId: 'after_nickname',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'groomy', text: '응. 이름 확인했어요.' },
      { char: 'groomy', text: '멋지네요.' },
      { char: 'groomy', text: '솔직히 물어보고 싶은 게 많긴 해요.' },
      { char: 'groomy', text: '당신도 많을 거고.' },
      { char: 'groomy', text: '다만, 우리 회사 직원도 아닌 그 쪽을 신뢰할 수 없으니까.' },
      { char: 'groomy', text: '일단 일 잘하는지 부터 볼까요?' },
    ],
    choices: [
      {
        text: '어 열심히 할게…',
        next: 'chat_work_ok',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'promisedToWorkHard' },
          { type: EffectTypes.ADD_SCORE, score: 'groomyAffinity', amount: 1 },
        ],
      },
      {
        text: '여기가 어디냐니까?',
        next: 'chat_where_cold',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'askedWhereThisIs' },
          { type: EffectTypes.ADD_SCORE, score: 'groomyAffinity', amount: -1 },
        ],
      },
    ],
  },

  chat_work_ok: {
    id: 'prologue.chat_work_ok',
    chapterId: 'prologue',
    localId: 'chat_work_ok',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    lines: [
      { char: 'groomy', text: '말이 적어서 좋아요.' },
      { char: 'groomy', text: '사용하기 좋은 호구.' },
    ],
    next: 'chat_work_intro',
  },

  chat_where_cold: {
    id: 'prologue.chat_where_cold',
    chapterId: 'prologue',
    localId: 'chat_where_cold',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'groomy', text: '다시 말씀드리는데,' },
      { char: 'groomy', text: '저는 설명해드릴 의무가 없어요.' },
      { char: 'groomy', text: '이 회사 직원들을 위해 존재하는 거지.' },
      { char: 'groomy', text: '침입자한테 상냥할 이유 없거든요?' },
      { char: 'groomy', text: '묻고 싶으면 일 부터 해요.' },
      { char: 'groomy', text: '나도 내켜야 대답을 해주지.' },
    ],
    next: 'chat_work_intro',
  },

  chat_work_intro: {
    id: 'prologue.chat_work_intro',
    chapterId: 'prologue',
    localId: 'chat_work_intro',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'groomy', text: '자, 그럼 이제.' },
      { char: 'groomy', text: '업무를 소개해줄게요.' },
      { char: 'groomy', text: '사원은 아니셔서' },
      { char: 'groomy', text: '오실 때 찍으신 그 전임자 사원증에' },
      { char: 'groomy', text: '임시로 당신 정보를 매핑했어요.' },
      { char: 'groomy', text: '뭐, 오류가 나면…' },
      { char: 'groomy', text: '와서 저한테 말 하세요.' },
    ],
    choices: [
      {
        text: '해결해주시는 건가요?',
        next: 'chat_not_fix',
      },
    ],
  },

  chat_not_fix: {
    id: 'prologue.chat_not_fix',
    chapterId: 'prologue',
    localId: 'chat_not_fix',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'groomy', text: '아뇨. 그건 아닌데?' },
      { char: 'groomy', text: '일단 보고요.' },
      { char: 'groomy', text: '일단 입구 인증을 해야해요.' },
    ],
    choices: [
      {
        text: '이미 들어온 거 아니었어요?',
        next: 'chat_gate_auth',
      },
    ],
  },

  chat_gate_auth: {
    id: 'prologue.chat_gate_auth',
    chapterId: 'prologue',
    localId: 'chat_gate_auth',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'groomy', text: '우리 회사는 보안에 철저하거든요.' },
      { char: 'groomy', text: '여러 번 찍어야해요.' },
      { char: 'groomy', text: '자, 주머니에 있겠네.' },
    ],
    choices: [
      {
        text: '주머니를 뒤진다.',
        next: 'chat_tap_card',
        effects: [
          { type: EffectTypes.ADD_ITEM, item: 'predecessorIdCard' },
          { type: EffectTypes.ADD_FLAG, flag: 'searchedOwnPocket' },
          { type: EffectTypes.ADD_FLAG, flag: 'taggedEntranceDoor' },
          { type: EffectTypes.ADD_SCORE, score: 'groomyAffinity', amount: 1 },
        ],
      },
    ],
  },

  chat_tap_card: {
    id: 'prologue.chat_tap_card',
    chapterId: 'prologue',
    localId: 'chat_tap_card',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    lines: [
      { char: 'groomy', text: '응, 그거 찍어요.' },
    ],
    next: 'entrance_tag',
  },

  // ─────────────────────────────────────────
  // entrance_tag — 사원증으로 출입 로그만 등록 (보정 ON은 입장 시 이미 적용됨)
  // ─────────────────────────────────────────
  entrance_tag: {
    id: 'prologue.entrance_tag',
    chapterId: 'prologue',
    localId: 'entrance_tag',
    mode: SceneModes.VN,
    emotion: 'friendly',
    lines: [
      { char: 'system', text: '삑-', isNarration: true, important: true },
      { char: 'system', text: `출입 로그: ${SESSION_EMP_ID} · ${PREDECESSOR_NAME}`, isNarration: true, important: true },
      { char: 'groomy', text: '출근 처리 완료.' },
      { char: 'groomy', text: ({ nickname }) => `${nickname} 씨, 이제 안쪽 통로도 열렸어요.` },
    ],
    next: 'iseol_intro',
  },

  // ─────────────────────────────────────────
  // iseol_intro — 사수 강이솔 등장
  // ─────────────────────────────────────────
  iseol_intro: {
    id: 'prologue.iseol_intro',
    chapterId: 'prologue',
    localId: 'iseol_intro',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    systemMessage: '강이솔 선임이 온보딩 채널에 초대되었습니다.',
    lines: [
      { char: 'iseol', text: ({ nickname }) => `${nickname} 씨 맞죠?` },
      { char: 'iseol', text: '강이솔입니다.' },
      { char: 'iseol', text: '오늘 사수 맡았어요.' },
      { char: 'iseol', text: '놀라셨을 텐데.' },
      { char: 'iseol', text: '여긴 원래 첫인상이 좀 그래요.' },
      { char: 'groomy', text: '정정할게요.' },
      { char: 'groomy', text: '회사가 이상한 겁니다.' },
      { char: 'iseol', text: '그런 말은.' },
      { char: 'iseol', text: '채팅 로그에 남기지 말자, 그루미.' },
    ],
    choices: [
      {
        text: '잘 부탁드립니다.',
        next: 'prologue_complete',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'metIseolPolitely' },
          { type: EffectTypes.ADD_SCORE, score: 'groomyAffinity', amount: 1 },
        ],
      },
      {
        text: '전임자 이야기를 먼저 듣고 싶습니다.',
        next: 'prologue_complete',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'askedAboutPredecessorEarly' },
          { type: EffectTypes.ADD_SCORE, score: 'mysteryEvidence', amount: 1 },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // prologue_complete — 챕터 종료
  // ─────────────────────────────────────────
  prologue_complete: {
    id: 'prologue.prologue_complete',
    chapterId: 'prologue',
    localId: 'prologue_complete',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'groomy', text: '온보딩 채널을 열어둘게요.' },
      { char: 'groomy', text: '첫날에는 보통 아무 일도 안 일어나요.' },
      { char: 'groomy', text: '…' },
      { char: 'groomy', text: '보통은요.' },
    ],
    end: { type: 'chapterComplete', nextChapterId: 'chapter-01' },
  },
}

// ─────────────────────────────────────────
// 헬퍼: lineKey/chatTheme/vnStage 자동 부착 (기존 로직 유지)
// ─────────────────────────────────────────
function addLineRefs(scene) {
  if (!Array.isArray(scene.lines)) return scene
  return {
    ...scene,
    lines: scene.lines.map((line, index) => ({
      ...line,
      textKey: line.textKey ?? `${scene.id}.line${String(index + 1).padStart(2, '0')}`,
    })),
  }
}

function addSceneRefs(scene) {
  const withLineRefs = addLineRefs(scene)
  const base = {
    ...withLineRefs,
    modeLabelKey:
      withLineRefs.mode === SceneModes.VN
        ? 'modeBarVnDefault'
        : withLineRefs.mode === SceneModes.RPG
        ? 'modeBarRpgDefault'
        : 'modeBarChatDefault',
    chatTheme:
      withLineRefs.mode === SceneModes.CHAT
        ? {
            profileId: withLineRefs.emotion === 'warning' ? 'corrupted' : 'normal',
            wallpaperAssetId:
              withLineRefs.emotion === 'warning' ? 'overlay_scanline' : 'bg_default_office',
          }
        : undefined,
  }
  if (withLineRefs.mode === SceneModes.VN) {
    return {
      ...base,
      vnStage: withLineRefs.vnStage ?? {
        bgId: 'bg_default_office',
        overlayId: withLineRefs.emotion === 'warning' ? 'overlay_glitch_soft' : 'overlay_scanline',
        characters: [],
      },
    }
  }
  return base
}

export const prologueScenes = Object.fromEntries(
  Object.entries(rawPrologueScenes).map(([localId, scene]) => [localId, addSceneRefs(scene)]),
)
