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
  // chat_boot — TalkLine 채널 진입. 그루미가 카드 미스매치를 흘림.
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
      { char: 'groomy', text: '신입 사원 전속 비서 AI예요.' },
      { char: 'groomy', text: '그루미라고 불러 주세요.' },
      { char: 'groomy', text: `${PREDECESSOR_NAME}님 카드로 접속 로그가 올라와서` },
      { char: 'groomy', text: '잠깐 착각했네요.' },
      { char: 'groomy', text: '괜찮아요.' },
      { char: 'groomy', text: '흔한 일은 아니지만.' },
      { char: 'groomy', text: '회사가 흔하지도 않으니까요.' },
    ],
    choices: [
      {
        text: '네. 처음 왔어요.',
        next: 'ask_nickname',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'introAdmittedNewcomer' },
          { type: EffectTypes.ADD_SCORE, score: 'groomyAffinity', amount: 1 },
        ],
      },
      {
        text: '방금 전까지 기억이 흐릿해요.',
        next: 'ask_nickname',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'introMentionedHaze' },
          { type: EffectTypes.ADD_SCORE, score: 'mysteryEvidence', amount: 1 },
          { type: EffectTypes.ADD_SCORE, score: 'groomyAffinity', amount: 1 },
        ],
      },
      {
        text: '예?',
        next: 'ask_nickname',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'introStalled' },
          { type: EffectTypes.ADD_SCORE, score: 'groomyAffinity', amount: -1 },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // ask_nickname — 닉네임 입력
  // ─────────────────────────────────────────
  ask_nickname: {
    id: 'prologue.ask_nickname',
    chapterId: 'prologue',
    localId: 'ask_nickname',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    lines: [
      { char: 'groomy', text: '정식 사원 정보가 아직 비어 있네요.' },
      { char: 'groomy', text: '제가 부를 이름부터 입력해 주세요.' },
    ],
    input: { type: 'nickname', next: 'after_nickname' },
  },

  // ─────────────────────────────────────────
  // after_nickname — 임시 카드 설명
  // ─────────────────────────────────────────
  after_nickname: {
    id: 'prologue.after_nickname',
    chapterId: 'prologue',
    localId: 'after_nickname',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'groomy', text: ({ nickname }) => `아, 맞다 ${nickname} 씨.` },
      { char: 'groomy', text: '사원증은 아직 발급 전인데' },
      { char: 'groomy', text: '키 기능은 필요하니까.' },
      { char: 'groomy', text: '전임자 사원증으로 발급했어요.' },
      { char: 'groomy', text: '그건 아시죠?' },
    ],
    choices: [
      {
        text: '네.',
        next: 'card_key_goal',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'claimedToKnowTempCard' },
          { type: EffectTypes.ADD_SCORE, score: 'groomyAffinity', amount: 1 },
        ],
      },
      {
        text: '아뇨.',
        next: 'card_key_explain',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'admittedCardIgnorance' },
          { type: EffectTypes.ADD_SCORE, score: 'groomyAffinity', amount: 1 },
        ],
      },
      {
        text: '예?',
        next: 'card_key_cold',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'confusedAboutCard' },
          { type: EffectTypes.ADD_SCORE, score: 'groomyAffinity', amount: -1 },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // card_key_explain — 모른다고 답한 분기
  // ─────────────────────────────────────────
  card_key_explain: {
    id: 'prologue.card_key_explain',
    chapterId: 'prologue',
    localId: 'card_key_explain',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    lines: [
      { char: 'groomy', text: '좋아요.' },
      { char: 'groomy', text: '모르면 모른다고 하는 편이 낫죠.' },
      { char: 'groomy', text: '지금 가진 사원증은' },
      { char: 'groomy', text: '문을 여는 키이면서.' },
      { char: 'groomy', text: '죽은 전임자의 기록에 붙은' },
      { char: 'groomy', text: '임시 이름표예요.' },
      { char: 'groomy', text: '무섭게 들리면 정상이에요.' },
    ],
    next: 'card_key_goal',
  },

  // ─────────────────────────────────────────
  // card_key_cold — 5단 복선 #1: 격리된 기억의 잔재가 새어나옴
  // 기존 욕설+삭제 연출 유지, 톤만 한 호흡 단위로 끊음
  // ─────────────────────────────────────────
  card_key_cold: {
    id: 'prologue.card_key_cold',
    chapterId: 'prologue',
    localId: 'card_key_cold',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'groomy', text: '숫기도 없는 새끼가.' },
      { char: 'groomy', text: '왜 자꾸 나대는 거야.' },
      { char: 'groomy', text: '카드키 찾기 전까지.' },
      { char: 'groomy', text: '말 걸지 마.' },
      { char: 'system', text: '메시지가 0.3초 뒤 삭제되었습니다.', isNarration: true, important: true },
      { char: 'groomy', text: '…' },
      { char: 'groomy', text: '죄송해요.' },
      { char: 'groomy', text: '방금 건 내부 디버그 문장이었어요.' },
      { char: 'groomy', text: '신경 쓰지 마세요.' },
    ],
    next: 'card_key_goal',
    effects: [
      // 5단 복선 #1 플래그 — 나중에 회수
      { type: EffectTypes.ADD_FLAG, flag: 'witnessedGroomyMemoryLeak' },
    ],
  },

  // ─────────────────────────────────────────
  // card_key_goal — 카드키 찾기 시작
  // ─────────────────────────────────────────
  card_key_goal: {
    id: 'prologue.card_key_goal',
    chapterId: 'prologue',
    localId: 'card_key_goal',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'groomy', text: '입구 인증을 하려면' },
      { char: 'groomy', text: '카드키 신호를 다시 잡아야 해요.' },
      { char: 'groomy', text: '로비 안쪽에 떨어졌을 가능성이 높습니다.' },
      { char: 'groomy', text: '선택지는 세 개.' },
      { char: 'groomy', text: '바닥, 안내 데스크.' },
      { char: 'groomy', text: '그리고 당신 주머니.' },
    ],
    choices: [
      {
        text: '바닥부터 살핀다.',
        next: 'search_floor',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'searchedLobbyFloor' },
          { type: EffectTypes.ADD_SCORE, score: 'mysteryEvidence', amount: 1 },
        ],
      },
      {
        text: '안내 데스크를 확인한다.',
        next: 'search_desk',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'searchedLobbyDesk' },
          { type: EffectTypes.ADD_SCORE, score: 'mysteryEvidence', amount: 1 },
        ],
      },
      {
        text: '주머니를 뒤진다.',
        next: 'search_pocket',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'searchedOwnPocket' },
          { type: EffectTypes.ADD_SCORE, score: 'groomyAffinity', amount: 1 },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // search_floor — 박서이의 마지막 발자국
  // ─────────────────────────────────────────
  search_floor: {
    id: 'prologue.search_floor',
    chapterId: 'prologue',
    localId: 'search_floor',
    mode: SceneModes.CHAT,
    emotion: 'nervous',
    lines: [
      { char: 'system', text: '바닥 먼지 위로 최근 끌린 자국이 보인다.', isNarration: true },
      { char: 'system', text: '한 사람의 발자국이 입구에서 멈춰 있다.', isNarration: true },
      { char: 'groomy', text: '카드키는 아니지만.' },
      { char: 'groomy', text: '좋은 관찰이에요.' },
      { char: 'groomy', text: '전임자도 마지막 날.' },
      { char: 'groomy', text: '여기서 멈췄거든요.' },
    ],
    choices: [{ text: '다음 위치를 확인한다.', next: 'search_pocket' }],
  },

  // ─────────────────────────────────────────
  // search_desk — 무인 데스크
  // ─────────────────────────────────────────
  search_desk: {
    id: 'prologue.search_desk',
    chapterId: 'prologue',
    localId: 'search_desk',
    mode: SceneModes.CHAT,
    emotion: 'nervous',
    lines: [
      { char: 'system', text: '안내 데스크에는 아무도 없다.', isNarration: true },
      { char: 'system', text: '모니터에는 "방문자 없음"만 떠 있다.', isNarration: true },
      { char: 'groomy', text: '이 회사는 환영 인사가 좀 느려요.' },
      { char: 'groomy', text: '찾고 나서 다시 말 걸어줄래?' },
    ],
    choices: [{ text: '주머니를 확인한다.', next: 'search_pocket' }],
  },

  // ─────────────────────────────────────────
  // search_pocket — 전임자 사원증 발견
  // ─────────────────────────────────────────
  search_pocket: {
    id: 'prologue.search_pocket',
    chapterId: 'prologue',
    localId: 'search_pocket',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    lines: [
      { char: 'system', text: '코트 안쪽 주머니에서 차가운 플라스틱 카드가 잡힌다.', isNarration: true },
      { char: 'system', text: `${SESSION_EMP_ID} · ${PREDECESSOR_NAME}`, isNarration: true, important: true },
      { char: 'groomy', text: '찾았네요.' },
      { char: 'groomy', text: '문에 태그하세요.' },
    ],
    choices: [
      {
        text: '입구 문에 사원증을 태그한다.',
        next: 'entrance_tag',
        effects: [
          { type: EffectTypes.ADD_ITEM, item: 'predecessorIdCard' },
          { type: EffectTypes.ADD_FLAG, flag: 'taggedEntranceDoor' },
        ],
      },
    ],
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
