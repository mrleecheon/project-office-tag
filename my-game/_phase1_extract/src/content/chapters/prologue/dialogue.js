import { EffectTypes, SceneModes } from '../../../engine/contracts.js'
import { PREDECESSOR_NAME, SESSION_EMP_ID } from '../../world/company.js'

export const prologueBootLines = [
  'GROOMY OFFICE · TalkLine v2.1',
  '[ OK ] NFC TOKEN ACCEPTED',
  `[ WARN ] TEMP_CARD_BINDING · ${SESSION_EMP_ID}`,
  'Launching GROOMY Assistant...',
]

const rawPrologueScenes = {
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
      { char: 'player', text: '대기업의 러브 콜, 완벽한 스펙.' },
      { char: 'player', text: '그리고. 내가 선택한 이 작은 회사.' },
      { char: 'player', text: '내가 여기에 온 이유는-' },
    ],
    next: 'lobby_wake',
  },
  lobby_wake: {
    id: 'prologue.lobby_wake',
    chapterId: 'prologue',
    localId: 'lobby_wake',
    mode: SceneModes.VN,
    emotion: 'nervous',
    lines: [
      { char: 'player', text: '…머리가 너무 아파.' },
      { char: 'player', text: '여기가 어디지?' },
      { char: 'player', text: '…회사. 그래. 여긴-' },
      { char: 'system', text: '낡은 로비 천장등이 한 박자 늦게 켜진다.', isNarration: true },
    ],
    next: 'groomy_intro',
  },
  groomy_intro: {
    id: 'prologue.groomy_intro',
    chapterId: 'prologue',
    localId: 'groomy_intro',
    mode: SceneModes.VN,
    emotion: 'friendly',
    lines: [
      { char: 'groomy', text: '저기 당신 혹시.' },
      { char: 'groomy', text: '...' },
      { char: 'groomy', text: '처음 오셨군요.' },
      { char: 'system', text: '놀란 표정은 순식간에 접히고, 웃음만 남는다.', isNarration: true, important: true },
    ],
    next: 'chat_boot',
  },
  chat_boot: {
    id: 'prologue.chat_boot',
    chapterId: 'prologue',
    localId: 'chat_boot',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    systemMessage: 'GROOMY가 TalkLine 내부 채널에 접속했습니다.',
    lines: [
      { char: 'groomy', text: '안녕하세요. 신입 사원 전속 비서 AI, 그루미예요.' },
      { char: 'groomy', text: `${PREDECESSOR_NAME}님 카드로 접속 로그가 올라와서 잠깐 착각했네요.` },
      { char: 'groomy', text: '괜찮아요. 흔한 일은 아니지만, 회사가 흔하지도 않으니까요.' },
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
  after_nickname: {
    id: 'prologue.after_nickname',
    chapterId: 'prologue',
    localId: 'after_nickname',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'groomy', text: ({ nickname }) => `아, 맞다 ${nickname} 씨.` },
      { char: 'groomy', text: '사원증은 아직 발급 전인데 키 기능은 필요하니 전임자 사원증으로 발급했어요.' },
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
  card_key_explain: {
    id: 'prologue.card_key_explain',
    chapterId: 'prologue',
    localId: 'card_key_explain',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    lines: [
      { char: 'groomy', text: '좋아요. 모르면 모른다고 하는 편이 낫죠.' },
      { char: 'groomy', text: '지금 가진 사원증은 문을 여는 키이면서, 죽은 전임자의 기록에 붙은 임시 이름표예요.' },
      { char: 'groomy', text: '무섭게 들리면 정상이에요.' },
    ],
    next: 'card_key_goal',
  },
  card_key_cold: {
    id: 'prologue.card_key_cold',
    chapterId: 'prologue',
    localId: 'card_key_cold',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'groomy', text: '숫기도 없는 새끼가 왜 자꾸 나대는 거야.' },
      { char: 'groomy', text: '카드키 찾기 전까지 말 걸지 마.' },
      { char: 'system', text: '메시지가 0.3초 뒤 삭제되었습니다.', isNarration: true },
      { char: 'groomy', text: '죄송해요. 방금 건 내부 디버그 문장이었어요.' },
    ],
    next: 'card_key_goal',
  },
  card_key_goal: {
    id: 'prologue.card_key_goal',
    chapterId: 'prologue',
    localId: 'card_key_goal',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'groomy', text: '입구 인증을 하려면 카드키 신호를 다시 잡아야 해요.' },
      { char: 'groomy', text: '로비 안쪽에 떨어졌을 가능성이 높습니다.' },
      { char: 'groomy', text: '선택지는 세 개. 바닥, 안내 데스크, 그리고 당신 주머니.' },
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
  search_floor: {
    id: 'prologue.search_floor',
    chapterId: 'prologue',
    localId: 'search_floor',
    mode: SceneModes.CHAT,
    emotion: 'nervous',
    lines: [
      { char: 'system', text: '바닥 먼지 위로 최근 끌린 자국이 보인다.', isNarration: true },
      { char: 'groomy', text: '카드키는 아니지만 좋은 관찰이에요.' },
      { char: 'groomy', text: '전임자도 마지막 날 여기서 멈췄거든요.' },
    ],
    choices: [{ text: '다음 위치를 확인한다.', next: 'search_pocket' }],
  },
  search_desk: {
    id: 'prologue.search_desk',
    chapterId: 'prologue',
    localId: 'search_desk',
    mode: SceneModes.CHAT,
    emotion: 'nervous',
    lines: [
      { char: 'system', text: '안내 데스크에는 아무도 없다. 모니터에는 “방문자 없음”만 떠 있다.', isNarration: true },
      { char: 'groomy', text: '이 회사는 환영 인사가 좀 느려요.' },
      { char: 'groomy', text: '찾고 나서 다시 말 걸어줄래?' },
    ],
    choices: [{ text: '주머니를 확인한다.', next: 'search_pocket' }],
  },
  search_pocket: {
    id: 'prologue.search_pocket',
    chapterId: 'prologue',
    localId: 'search_pocket',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    lines: [
      { char: 'system', text: '코트 안쪽 주머니에서 차가운 플라스틱 카드가 잡힌다.', isNarration: true },
      { char: 'system', text: `${SESSION_EMP_ID} · ${PREDECESSOR_NAME}`, isNarration: true, important: true },
      { char: 'groomy', text: '찾았네요. 문에 태그하세요.' },
    ],
    choices: [
      {
        text: '입구 문에 사원증을 태그한다.',
        next: 'lobby_reveal',
        effects: [
          { type: EffectTypes.ADD_ITEM, item: 'predecessorIdCard' },
          { type: EffectTypes.ADD_FLAG, flag: 'taggedEntranceDoor' },
        ],
      },
    ],
  },
  lobby_reveal: {
    id: 'prologue.lobby_reveal',
    chapterId: 'prologue',
    localId: 'lobby_reveal',
    mode: SceneModes.VN,
    emotion: 'friendly',
    important: true,
    lines: [
      { char: 'system', text: '삑-', isNarration: true, important: true },
      { char: 'system', text: '곰팡이 냄새가 사라지고, 벽면의 금 간 타일이 흰 조명 아래로 접힌다.', isNarration: true },
      { char: 'system', text: 'GROOMY OFFICE', isNarration: true, important: true },
      { char: 'groomy', text: '출근 처리 완료.' },
    ],
    next: 'iseol_intro',
  },
  iseol_intro: {
    id: 'prologue.iseol_intro',
    chapterId: 'prologue',
    localId: 'iseol_intro',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    systemMessage: '강이솔 선임이 온보딩 채널에 초대되었습니다.',
    lines: [
      { char: 'iseol', text: ({ nickname }) => `${nickname} 씨 맞죠? 강이솔입니다. 오늘 사수 맡았어요.` },
      { char: 'iseol', text: '놀라셨을 텐데, 여긴 원래 첫인상이 좀 그래요.' },
      { char: 'groomy', text: '정정할게요. 회사가 이상한 겁니다.' },
      { char: 'iseol', text: '그런 말은 채팅 로그에 남기지 말자, 그루미.' },
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
  prologue_complete: {
    id: 'prologue.prologue_complete',
    chapterId: 'prologue',
    localId: 'prologue_complete',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'groomy', text: '온보딩 채널을 열어둘게요.' },
      { char: 'groomy', text: '첫날에는 보통 아무 일도 안 일어나요.' },
      { char: 'groomy', text: '보통은요.' },
    ],
    end: { type: 'chapterComplete', nextChapterId: 'chapter-01' },
  },
}

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
    modeLabelKey: withLineRefs.mode === SceneModes.VN ? 'modeBarVnDefault' : withLineRefs.mode === SceneModes.RPG ? 'modeBarRpgDefault' : 'modeBarChatDefault',
    chatTheme: withLineRefs.mode === SceneModes.CHAT ? {
      profileId: withLineRefs.emotion === 'warning' ? 'corrupted' : 'normal',
      wallpaperAssetId: withLineRefs.emotion === 'warning' ? 'overlay_scanline' : 'bg_default_office',
    } : undefined,
  }
  if (withLineRefs.mode === SceneModes.VN) {
    return {
      ...base,
      vnStage: withLineRefs.vnStage ?? {
        bgId: 'bg_default_office',
        overlayId: withLineRefs.important ? 'overlay_glitch_soft' : 'overlay_scanline',
        characters: [],
      },
    }
  }
  return base
}

export const prologueScenes = Object.fromEntries(
  Object.entries(rawPrologueScenes).map(([localId, scene]) => [localId, addSceneRefs(scene)]),
)
