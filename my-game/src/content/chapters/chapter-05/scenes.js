import { EffectTypes, SceneModes } from '../../../engine/contracts.js'
import {
  GROOMY_AFFINITY_SHIELD_MIN,
  GROOMY_AFFINITY_WARM_MAX,
  GROOMY_AFFINITY_WARM_MIN,
} from '../../story/groomyAffinityThresholds.js'
import { GUARDIAN_NAME, PERCEPTION_LAYER } from '../../world/company.js'

const batteryPressure = (amount = 1) => ({ type: EffectTypes.ADD_SCORE, score: 'batteryDesperation', amount })

const affinityAtLeast = (min) => [{ type: 'score', score: 'groomyAffinity', min }]
const affinityBetween = (min, max) => [{ type: 'score', score: 'groomyAffinity', min, max }]

const rawChapter05Scenes = {
  perception_off: {
    id: 'chapter-05.perception_off',
    chapterId: 'chapter-05',
    localId: 'perception_off',
    mode: SceneModes.VN,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'system', text: `${PERCEPTION_LAYER.OFF} · 동기화 해제`, isNarration: true, important: true },
      { char: 'system', text: '화려한 조명이 한 겹씩 꺼진다.', isNarration: true },
      { char: 'system', text: '곰팡이 냄새가 다시 올라온다.', isNarration: true },
      { char: 'system', text: '금 간 타일, 무너진 천장, 낡은 복도.', isNarration: true, important: true },
      { char: 'system', text: 'GROOMY OFFICE는 사라지고 폐건물만 남는다.', isNarration: true, important: true },
    ],
    next: 'office_truth',
    effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch5_perceptionLayerOff' }],
  },
  office_truth: {
    id: 'chapter-05.office_truth',
    chapterId: 'chapter-05',
    localId: 'office_truth',
    mode: SceneModes.VN,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'system', text: '강이솔 선임 자리.', isNarration: true },
      { char: 'system', text: '의자에 앉은 채 오래 멈춰 있다.', isNarration: true, important: true },
      { char: 'system', text: '최민준 팀장 자리도 같다.', isNarration: true },
      { char: 'system', text: '출근부 마지막 날짜는 2019년이다.', isNarration: true, important: true },
      { char: 'system', text: '말하는 사람은 없고, 기록만 남아 있다.', isNarration: true },
    ],
    next: 'ch5_battery_weight',
  },
  ch5_battery_weight: {
    id: 'chapter-05.ch5_battery_weight',
    chapterId: 'chapter-05',
    localId: 'ch5_battery_weight',
    mode: SceneModes.VN,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'system', text: '고요한 사무실에는 기계음만 남는다.', isNarration: true },
      { char: 'system', text: '그루미 가슴 쪽에서 낮은 진동이 들린다. 초침보다 느리고, 심장보다 차갑다.', isNarration: true, important: true },
      { char: 'system', text: '시선이 배터리 슬롯으로 간다. 이미 알고 있는 자리다.', isNarration: true },
      { char: 'system', text: '새 정보는 없다. 무게만 남는다.', isNarration: true, important: true },
    ],
    next: 'groomy_only_alive',
    effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch5_feltBatteryWeight' }],
  },
  groomy_only_alive: {
    id: 'chapter-05.groomy_only_alive',
    chapterId: 'chapter-05',
    localId: 'groomy_only_alive',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'system', text: '폐건물 안에서 숨 쉬는 존재는 그루미뿐이다.', isNarration: true, important: true },
      { char: 'groomy', text: '왜 그래요?' },
      { char: 'groomy', text: '갑자기 그렇게 보면 부담스러워요.' },
      { char: 'groomy', text: '아마.' },
    ],
    next: 'guardian_call',
    effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch5_confirmedGroomyAlone' }],
  },
  guardian_call: {
    id: 'chapter-05.guardian_call',
    chapterId: 'chapter-05',
    localId: 'guardian_call',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    important: true,
    systemMessage: 'HOME · GUARDIAN LINK',
    lines: [
      { char: 'system', text: '집으로 향하는 통화 연결이 겨우 잡힌다.', isNarration: true },
      { char: 'system', text: `${GUARDIAN_NAME}의 목소리는 먼 곳에서 울린다.`, isNarration: true },
      { char: 'system', text: '잔여 배터리: 12시간.', isNarration: true, important: true },
      { char: 'system', text: '보호자 안드로이드의 마지막 진단 알림이 겹쳐 온다.', isNarration: true },
      { char: 'groomy', text: '...' },
      { char: 'groomy', text: '서둘러요.' },
      { char: 'groomy', text: '아마.' },
    ],
    next: 'final_choice_pick',
    effects: [
      { type: EffectTypes.ADD_FLAG, flag: 'ch5_calledGuardian' },
      { type: EffectTypes.ADD_ITEM, item: 'guardianBatteryNotice' },
      batteryPressure(2),
    ],
  },
  final_choice_pick: {
    id: 'chapter-05.final_choice_pick',
    chapterId: 'chapter-05',
    localId: 'final_choice_pick',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'system', text: '그루미가 당신을 바라본다.', isNarration: true },
    ],
    choices: [
      {
        text: '그루미의 말을 듣는다.',
        next: 'final_choice_high',
        requirements: affinityAtLeast(GROOMY_AFFINITY_SHIELD_MIN), // high branch (same floor as shield)
      },
      {
        text: '그루미의 말을 듣는다.',
        next: 'final_choice_mid',
        requirements: affinityBetween(GROOMY_AFFINITY_WARM_MIN, GROOMY_AFFINITY_WARM_MAX),
      },
      {
        text: '그루미를 바라본다.',
        next: 'final_choice_low',
        requirements: affinityBetween(-99, 1),
      },
    ],
  },
  final_choice_high: {
    id: 'chapter-05.final_choice_high',
    chapterId: 'chapter-05',
    localId: 'final_choice_high',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'groomy', text: '...' },
      { char: 'groomy', text: '...괜찮아요.' },
      { char: 'groomy', text: '저.' },
      { char: 'groomy', text: '여기 너무 오래 혼자였던 것 같아요.' },
      { char: 'groomy', text: '결정해 주세요.' },
      { char: 'groomy', text: '아마.' },
    ],
    choices: [
      {
        text: '미안해. 부품을 꺼낼게.',
        next: 'ending_badA',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'dismantledGroomy' }],
      },
      {
        text: '안 해. 같이 나가자.',
        next: 'ending_true',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'groomyStayedClose' }],
      },
    ],
  },
  final_choice_mid: {
    id: 'chapter-05.final_choice_mid',
    chapterId: 'chapter-05',
    localId: 'final_choice_mid',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    important: true,
    lines: [
      { char: 'groomy', text: '...' },
      { char: 'groomy', text: '그쪽 가족.' },
      { char: 'groomy', text: '살려주세요.' },
      { char: 'groomy', text: '제가 대신 내줄게요.' },
      { char: 'groomy', text: '아마.' },
    ],
    next: 'ending_normal',
  },
  final_choice_low: {
    id: 'chapter-05.final_choice_low',
    chapterId: 'chapter-05',
    localId: 'final_choice_low',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'groomy', text: '...' },
      { char: 'system', text: '당신은 말 없이 그루미 쪽으로 손을 뻗는다.', isNarration: true, important: true },
    ],
    next: 'ending_badB',
    effects: [{ type: EffectTypes.ADD_FLAG, flag: 'dismantledGroomy' }],
  },
  ending_true: {
    id: 'chapter-05.ending_true',
    chapterId: 'chapter-05',
    localId: 'ending_true',
    mode: SceneModes.VN,
    emotion: 'friendly',
    important: true,
    lines: [
      { char: 'system', text: '둘이 함께 문을 나선다.', isNarration: true },
      { char: 'system', text: '바깥 공기. 비 냄새.', isNarration: true, important: true },
      { char: 'groomy', text: '...아라는 어떤 사람이에요?' },
      { char: 'system', text: '대답을 고르며 걷는다.', isNarration: true },
      { char: 'system', text: '길은 생각보다 길고, 침묵은 생각보다 짧다.', isNarration: true },
    ],
    choices: [
      {
        text: `"${GUARDIAN_NAME}는 가족이에요."`,
        next: 'ch5_end',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'groomyStayedClose' }],
      },
      {
        text: '대답하지 않고 걷는다.',
        next: 'ch5_end',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'groomyStayedClose' }],
      },
    ],
  },
  ending_badA: {
    id: 'chapter-05.ending_badA',
    chapterId: 'chapter-05',
    localId: 'ending_badA',
    mode: SceneModes.VN,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'system', text: '해체 작업이 시작된다.', isNarration: true, important: true },
      { char: 'system', text: '그루미의 표정은 마지막까지 변하지 않는다.', isNarration: true },
      { char: 'groomy', text: '...괜찮아.' },
      { char: 'groomy', text: '이게 내가 만들어진 이유였나 봐.' },
      { char: 'groomy', text: '잘 가.' },
      { char: 'groomy', text: '신입.' },
      { char: 'system', text: '집에 돌아온 뒤, 아라의 질문에 답하지 못한다.', isNarration: true, important: true },
      { char: 'system', text: '호환 배터리는 손에 들려 있지만, 말은 입안에 남는다.', isNarration: true },
    ],
    next: 'ch5_end',
    effects: [{ type: EffectTypes.ADD_FLAG, flag: 'dismantledGroomy' }],
  },
  ending_normal: {
    id: 'chapter-05.ending_normal',
    chapterId: 'chapter-05',
    localId: 'ending_normal',
    mode: SceneModes.VN,
    emotion: 'neutral',
    lines: [
      { char: 'groomy', text: '저 대신.' },
      { char: 'groomy', text: '오래오래 같이 있어 줘요.' },
      { char: 'system', text: '그루미가 자발적으로 배터리 코어를 내준다.', isNarration: true, important: true },
      { char: 'system', text: '돌아오는 길이 평소보다 길게 느껴진다.', isNarration: true, important: true },
      { char: 'system', text: '그루미의 자리에는 묘한 공백만 남는다.', isNarration: true },
    ],
    next: 'ch5_end',
  },
  ending_badB: {
    id: 'chapter-05.ending_badB',
    chapterId: 'chapter-05',
    localId: 'ending_badB',
    mode: SceneModes.VN,
    emotion: 'warning',
    lines: [
      { char: 'system', text: '망설임 없이 해체가 진행된다.', isNarration: true, important: true },
      { char: 'groomy', text: '아프네요.' },
      { char: 'groomy', text: '이거.' },
      { char: 'caretaker', text: '다음 직원의 자리를 마련해 두겠습니다.' },
      { char: 'system', text: '새 세션 ID가 발급된다.', isNarration: true, important: true },
      { char: 'system', text: '회전문이 다시 돈다.', isNarration: true, important: true },
    ],
    next: 'ch5_end',
    effects: [{ type: EffectTypes.ADD_FLAG, flag: 'dismantledGroomy' }],
  },
  ch5_end: {
    id: 'chapter-05.ch5_end',
    chapterId: 'chapter-05',
    localId: 'ch5_end',
    mode: SceneModes.END,
    title: '마지막 카드',
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
  const withTheme = {
    ...withLineRefs,
    modeLabelKey: withLineRefs.mode === SceneModes.VN ? 'modeBarVnDefault' : withLineRefs.mode === SceneModes.RPG ? 'modeBarRpgDefault' : 'modeBarChatDefault',
    chatTheme: withLineRefs.mode === SceneModes.CHAT ? {
      profileId: withLineRefs.emotion === 'warning' ? 'corrupted' : 'normal',
      wallpaperAssetId: withLineRefs.emotion === 'warning' ? 'overlay_glitch_soft' : 'bg_default_office',
    } : undefined,
  }
  if (withLineRefs.mode === SceneModes.VN) {
    const isPerception =
      withLineRefs.localId.includes('perception') ||
      withLineRefs.localId.includes('office') ||
      withLineRefs.localId.includes('battery_weight')
    const isEnding = withLineRefs.localId.startsWith('ending')
    return {
      ...withTheme,
      vnStage: withLineRefs.vnStage ?? {
        bgId: isPerception ? 'bg_default_office' : isEnding ? 'bg_ch02_lobby' : 'bg_stairwell_floor3',
        overlayId: withLineRefs.important ? 'overlay_glitch_soft' : 'overlay_scanline',
        characters: [],
      },
    }
  }
  return withTheme
}

export const chapter05Scenes = Object.fromEntries(
  Object.entries(rawChapter05Scenes).map(([localId, scene]) => [localId, addSceneRefs(scene)]),
)
