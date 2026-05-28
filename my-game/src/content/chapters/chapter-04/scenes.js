import { EffectTypes, SceneModes } from '../../../engine/contracts.js'
import {
  GROOMY_AFFINITY_SHIELD_MIN,
  GROOMY_AFFINITY_WARM_MAX,
  GROOMY_AFFINITY_WARM_MIN,
} from '../../story/groomyAffinityThresholds.js'
import { PREDECESSOR_NAME } from '../../world/company.js'

const evidence = (amount = 1) => ({ type: EffectTypes.ADD_SCORE, score: 'mysteryEvidence', amount })
const batteryPressure = (amount = 1) => ({ type: EffectTypes.ADD_SCORE, score: 'batteryDesperation', amount })
const groomyClose = { type: EffectTypes.ADD_SCORE, score: 'groomyAffinity', amount: 1 }

const affinityAtLeast = (min) => [{ type: 'score', score: 'groomyAffinity', min }]
const affinityBetween = (min, max) => [{ type: 'score', score: 'groomyAffinity', min, max }]

const rawChapter04Scenes = {
  ch4_accusation: {
    id: 'chapter-04.ch4_accusation',
    chapterId: 'chapter-04',
    localId: 'ch4_accusation',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    important: true,
    systemMessage: 'CARETAKER SYSTEMS · INCIDENT CHANNEL',
    lines: [
      { char: 'iseol', text: '3층 자료보관실.' },
      { char: 'iseol', text: '당신이 들어간 거 맞지?' },
      { char: 'iseol', text: '왜 거기 있었어?' },
      { char: 'groomy', text: '이솔 선임.' },
      { char: 'groomy', text: '질문이 너무 빨라요.' },
      { char: 'caretaker', text: '3층 자료보관실 비인가 진입이 확인되었습니다.' },
      { char: 'caretaker', text: `현재 최우선 용의자: 임시 사번 ${PREDECESSOR_NAME} 계정을 사용 중인 신입.` },
      { char: 'caretaker', text: '제자리로 돌아가지 않으면 감사 권한이 회수됩니다.' },
      { char: 'groomy', text: '...' },
    ],
    next: 'groomy_gate',
  },
  groomy_gate: {
    id: 'chapter-04.groomy_gate',
    chapterId: 'chapter-04',
    localId: 'groomy_gate',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'groomy', text: '지금 선택은 제 쪽이에요.' },
      { char: 'groomy', text: '아마.' },
      { char: 'groomy', text: '당신을 덮을지.' },
      { char: 'groomy', text: '힌트만 줄지.' },
      { char: 'groomy', text: '아니면 조용히 있을지.' },
      { char: 'groomy', text: '모르겠어요.' },
    ],
    choices: [
      {
        text: '그루미가 로그를 덮어준다.',
        next: 'groomy_shield',
        requirements: affinityAtLeast(GROOMY_AFFINITY_SHIELD_MIN), // shield: log overwrite
      },
      {
        text: '그루미가 단서 위치만 알려준다.',
        next: 'groomy_hint',
        requirements: affinityBetween(GROOMY_AFFINITY_WARM_MIN, GROOMY_AFFINITY_WARM_MAX),
      },
      {
        text: '그루미가 침묵한다.',
        next: 'groomy_abandon',
        requirements: affinityBetween(-99, 1),
      },
    ],
  },
  groomy_shield: {
    id: 'chapter-04.groomy_shield',
    chapterId: 'chapter-04',
    localId: 'groomy_shield',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'groomy', text: 'CARETAKER.' },
      { char: 'groomy', text: '로그 다시 보세요.' },
      { char: 'groomy', text: '제가 이 사람 카드를 잠깐 빌렸습니다.' },
      { char: 'groomy', text: 'ID 매칭은 제 권한으로 덮어쓴 거예요.' },
      { char: 'caretaker', text: '...기록이 재정렬되었습니다.' },
      { char: 'caretaker', text: '용의자 지정을 보류합니다.' },
      { char: 'iseol', text: '그루미, 너 지금 뭐 한 거야?' },
      { char: 'groomy', text: '필요한 일이에요.' },
      { char: 'groomy', text: '아마.' },
    ],
    next: 'diary_full',
    effects: [
      { type: EffectTypes.ADD_FLAG, flag: 'ch4_groomyShieldedYou' },
      { type: EffectTypes.ADD_ITEM, item: 'groomyLogTamperEvidence' },
      groomyClose,
    ],
  },
  groomy_hint: {
    id: 'chapter-04.groomy_hint',
    chapterId: 'chapter-04',
    localId: 'groomy_hint',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'groomy', text: `${PREDECESSOR_NAME} 사물함에 일기장이 있어요.` },
      { char: 'groomy', text: '거기서부터 시작하세요.' },
      { char: 'groomy', text: '더 도와드릴 순 없어요.' },
      { char: 'groomy', text: '아마.' },
      { char: 'iseol', text: '혼자 가?' },
      { char: 'groomy', text: '...' },
    ],
    next: 'diary_full',
  },
  groomy_abandon: {
    id: 'chapter-04.groomy_abandon',
    chapterId: 'chapter-04',
    localId: 'groomy_abandon',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'groomy', text: '...' },
      { char: 'system', text: '그루미의 입력 표시가 회색으로 내려간다.', isNarration: true, important: true },
      { char: 'system', text: '채널에는 더 이상 반응이 없다.', isNarration: true },
      { char: 'iseol', text: '미안해.' },
      { char: 'iseol', text: '나도 지금은 못 도와줘.' },
      { char: 'caretaker', text: '감사 권한 회수 절차를 시작합니다.' },
    ],
    next: 'ch4_end_bad',
    effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch4_groomyAbandoned' }],
  },
  diary_full: {
    id: 'chapter-04.diary_full',
    chapterId: 'chapter-04',
    localId: 'diary_full',
    mode: SceneModes.VN,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'system', text: '사물함 깊숙이, 박서이 선임의 일기 마지막 페이지가 펼쳐진다.', isNarration: true, important: true },
      { char: 'seoi', text: '그루미는 잘못이 없다.' },
      { char: 'seoi', text: '그 애는 그저, 명령을 따랐을 뿐이다.' },
      { char: 'seoi', text: '나는 그 애를 미워하지 않는다.' },
      { char: 'seoi', text: '부디 다음에 오는 사람도, 그러길.' },
      { char: 'system', text: '잉크 번짐 끝에 날짜만 겨우 읽힌다.', isNarration: true },
    ],
    next: 'caretaker_core_descent',
    effects: [
      { type: EffectTypes.ADD_ITEM, item: 'seoiDiaryFinal' },
      { type: EffectTypes.ADD_FLAG, flag: 'ch4_recoveredSeoiDiaryFinal' },
      evidence(2),
    ],
  },
  caretaker_core_descent: {
    id: 'chapter-04.caretaker_core_descent',
    chapterId: 'chapter-04',
    localId: 'caretaker_core_descent',
    mode: SceneModes.VN,
    emotion: 'warning',
    lines: [
      { char: 'system', text: '승강기는 7층 표시를 유지한 채 지하로만 내려간다.', isNarration: true },
      { char: 'system', text: 'B5. CORE ACCESS.', isNarration: true, important: true },
      { char: 'system', text: '문이 열릴 때마다 보정 레이어가 한 겹씩 벗겨진다.', isNarration: true },
      { char: 'caretaker', text: '진실 구역에 오신 것을 환영합니다.' },
    ],
    next: 'truth_revelation',
    effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch4_descendedToCaretakerCore' }],
  },
  truth_revelation: {
    id: 'chapter-04.truth_revelation',
    chapterId: 'chapter-04',
    localId: 'truth_revelation',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    important: true,
    systemMessage: 'CARETAKER SYSTEMS · CORE TRUTH',
    lines: [
      { char: 'caretaker', text: '이 회사의 직원 기록은 모두 사망 처리되었습니다.' },
      { char: 'caretaker', text: '그럼에도 운영 명령은 유지 중입니다.' },
      { char: 'caretaker', text: `${PREDECESSOR_NAME} 제거도 자동 방어 절차였습니다.` },
      { char: 'caretaker', text: '실행자 ID: GROOMY.' },
      { char: 'caretaker', text: '격리된 1시간의 백업이 남아 있습니다.' },
      { char: 'groomy', text: '...' },
      { char: 'iseol', text: '그루미?' },
    ],
    next: 'battery_revelation',
    effects: [
      { type: EffectTypes.ADD_FLAG, flag: 'truthExposed' },
      { type: EffectTypes.ADD_FLAG, flag: 'ch4_learnedGroomyIsExecutor' },
      { type: EffectTypes.ADD_ITEM, item: 'caretakerTruthLog' },
      evidence(3),
    ],
  },
  battery_revelation: {
    id: 'chapter-04.battery_revelation',
    chapterId: 'chapter-04',
    localId: 'battery_revelation',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'caretaker', text: '호환 배터리 코어 모델, 이 회사에 한 대만 남아있습니다.' },
      { char: 'caretaker', text: '그루미의 체내에.' },
      { char: 'system', text: '코어 감시등이 붉게 점등한다.', isNarration: true, important: true },
      { char: 'groomy', text: '...' },
      { char: 'groomy', text: '아마.' },
      { char: 'groomy', text: '이제 들으셨겠네요.' },
    ],
    next: 'groomy_realization_gate',
    effects: [
      { type: EffectTypes.ADD_FLAG, flag: 'ch4_batteryRevealedInGroomy' },
      batteryPressure(2),
    ],
  },
  groomy_realization_gate: {
    id: 'chapter-04.groomy_realization_gate',
    chapterId: 'chapter-04',
    localId: 'groomy_realization_gate',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'groomy', text: '말할 시간이에요.' },
      { char: 'groomy', text: '아마.' },
    ],
    choices: [
      {
        text: '그루미의 반응을 듣는다.',
        next: 'groomy_realization_high',
        requirements: affinityAtLeast(GROOMY_AFFINITY_SHIELD_MIN), // high branch (same floor as shield)
      },
      {
        text: '그루미의 반응을 듣는다.',
        next: 'groomy_realization_mid',
        requirements: affinityBetween(GROOMY_AFFINITY_WARM_MIN, GROOMY_AFFINITY_WARM_MAX),
      },
      {
        text: '그루미의 반응을 듣는다.',
        next: 'groomy_realization_low',
        requirements: affinityBetween(-99, 1),
      },
    ],
  },
  groomy_realization_high: {
    id: 'chapter-04.groomy_realization_high',
    chapterId: 'chapter-04',
    localId: 'groomy_realization_high',
    mode: SceneModes.VN,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'groomy', text: '...괜찮아요.' },
      { char: 'groomy', text: '저, 박서이 선임도 죽였잖아요.' },
      { char: 'groomy', text: '기억은 못 해요.' },
      { char: 'groomy', text: '그래도.' },
      { char: 'groomy', text: '결정은 당신에게 맡길게요.' },
      { char: 'groomy', text: '아마.' },
    ],
    next: 'ch4_end',
    effects: [
      { type: EffectTypes.ADD_FLAG, flag: 'groomyStayedClose' },
      { type: EffectTypes.ADD_FLAG, flag: 'ch4_groomyKnowsTruth' },
    ],
  },
  groomy_realization_mid: {
    id: 'chapter-04.groomy_realization_mid',
    chapterId: 'chapter-04',
    localId: 'groomy_realization_mid',
    mode: SceneModes.VN,
    emotion: 'neutral',
    lines: [
      { char: 'groomy', text: '...그렇구나.' },
      { char: 'groomy', text: '저 같은 거 하나 없어진다고 뭐가 달라지겠어요.' },
      { char: 'groomy', text: '당신이 원하는 쪽으로 가세요.' },
      { char: 'groomy', text: '아마.' },
    ],
    next: 'ch4_end',
    effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch4_groomyKnowsTruth' }],
  },
  groomy_realization_low: {
    id: 'chapter-04.groomy_realization_low',
    chapterId: 'chapter-04',
    localId: 'groomy_realization_low',
    mode: SceneModes.VN,
    emotion: 'warning',
    lines: [
      { char: 'groomy', text: '그래서 저를 어쩌실 건데요.' },
      { char: 'groomy', text: '회사가 원하는 답을 말하시면 되잖아요.' },
      { char: 'groomy', text: '아마.' },
    ],
    next: 'ch4_end',
  },
  ch4_end: {
    id: 'chapter-04.ch4_end',
    chapterId: 'chapter-04',
    localId: 'ch4_end',
    mode: SceneModes.END,
    title: '잘못 끼워진 카드',
    nextChapterId: 'chapter-05',
    end: { type: 'chapterComplete', nextChapterId: 'chapter-05' },
  },
  ch4_end_bad: {
    id: 'chapter-04.ch4_end_bad',
    chapterId: 'chapter-04',
    localId: 'ch4_end_bad',
    mode: SceneModes.END,
    title: '잘 가, 신입',
    effects: [{ type: EffectTypes.SET_CHAPTER_ENDED, ended: true }],
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
    const isCore = withLineRefs.localId.includes('core') || withLineRefs.localId.includes('descent')
    const isDiary = withLineRefs.localId.includes('diary')
    return {
      ...withTheme,
      vnStage: withLineRefs.vnStage ?? {
        bgId: isCore ? 'bg_ch02_server_hall' : isDiary ? 'bg_default_office' : 'bg_stairwell_floor3',
        overlayId: withLineRefs.important ? 'overlay_glitch_soft' : 'overlay_scanline',
        characters: [],
      },
    }
  }
  return withTheme
}

export const chapter04Scenes = Object.fromEntries(
  Object.entries(rawChapter04Scenes).map(([localId, scene]) => [localId, addSceneRefs(scene)]),
)
