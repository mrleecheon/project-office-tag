import { EffectTypes, SceneModes } from '../../../engine/contracts.js'
import { GUARDIAN_NAME, PERCEPTION_LAYER, PREDECESSOR_NAME, SESSION_EMP_ID } from '../../world/company.js'

const evidence = (amount = 1) => ({ type: EffectTypes.ADD_SCORE, score: 'mysteryEvidence', amount })
const batteryPressure = (amount = 1) => ({ type: EffectTypes.ADD_SCORE, score: 'batteryDesperation', amount })
const corporateHeat = (amount = 1) => ({ type: EffectTypes.ADD_SCORE, score: 'corporateSuspicion', amount })

const rawChapter03Scenes = {
  ch3_storage_entry: {
    id: 'chapter-03.ch3_storage_entry',
    chapterId: 'chapter-03',
    localId: 'ch3_storage_entry',
    mode: SceneModes.VN,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'system', text: '문을 밀자 삐걱 소리와 함께 열린다.', isNarration: true, important: true },
      { char: 'system', text: `${PERCEPTION_LAYER.GLITCH} · 층간 안내가 두 겹으로 겹친다.`, isNarration: true, important: true },
      { char: 'system', text: '3층 자료보관실 안쪽이 드러난다.', isNarration: true, important: true },
      { char: 'system', text: '의자에 앉은 채로 오랫동안 있었던 시체가 있다.', isNarration: true, important: true },
      { char: 'system', text: `목에 걸린 사원증: "${PREDECESSOR_NAME}".`, isNarration: true, important: true },
      { char: 'system', text: '보정 레이어가 이 장면을 숨기지 못했다.', isNarration: true },
    ],
    next: 'recorder_found',
    effects: [
      { type: EffectTypes.ADD_FLAG, flag: 'ch3_foundSeoiBody' },
      { type: EffectTypes.ADD_FLAG, flag: 'ch3_openedStorageDoor' },
      evidence(2),
    ],
  },
  ch3_morning_after: {
    id: 'chapter-03.ch3_morning_after',
    chapterId: 'chapter-03',
    localId: 'ch3_morning_after',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    systemMessage: 'GROOMY OFFICE · 전임자 책상 배정',
    lines: [
      { char: 'iseol', text: '어제 5층 조사는 회사 쪽에서도 봤어요.' },
      { char: 'iseol', text: '감사 채널에 올라간 기록은 지우기 어렵고요.' },
      { char: 'iseol', text: '그래도 당신이 남긴 줄기는 아직 살아 있어요.' },
      { char: 'groomy', text: '좋은 소식이네요.' },
      { char: 'groomy', text: '나쁜 소식도 있고요.' },
      { char: 'groomy', text: `${PREDECESSOR_NAME} 자리가 배정됐어요.` },
      { char: 'groomy', text: '당신 책상이에요.' },
      { char: 'groomy', text: '아마.' },
      { char: 'groomy', text: '회사는 그렇게 부르고 싶어 하니까요.' },
      { char: 'iseol', text: '서랍은 아직 열지 마.' },
      { char: 'groomy', text: '열어도 돼요.' },
      { char: 'groomy', text: '아마.' },
    ],
    next: 'desk_drawer',
  },
  desk_drawer: {
    id: 'chapter-03.desk_drawer',
    chapterId: 'chapter-03',
    localId: 'desk_drawer',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'system', text: '책상 서랍 손잡이가 차갑다.', isNarration: true },
      { char: 'system', text: '가장 안쪽 칸에 접힌 종이 한 장이 걸린다.', isNarration: true },
      { char: 'system', text: '미제출 사직서.', isNarration: true, important: true },
      { char: 'system', text: '사유: 여기 너무 오래 있었습니다.', isNarration: true, important: true },
      { char: 'system', text: '그 아래에는 가족사진이 있다.', isNarration: true },
      { char: 'system', text: '다섯 명의 얼굴 뒤로, 여섯 번째 사람이 잘려 나간 흔적이 남아 있다.', isNarration: true, important: true },
      { char: 'system', text: '보정 레이어가 그 부분만 반복해서 지웠다.', isNarration: true },
      { char: 'groomy', text: '그건 일기장 표지예요.', isNarration: false },
      { char: 'groomy', text: '아마.' },
    ],
    choices: [
      {
        text: '일기장을 펼친다.',
        next: 'ch3_storage_entry',
        effects: [
          { type: EffectTypes.ADD_ITEM, item: 'seoiDiary' },
          { type: EffectTypes.ADD_FLAG, flag: 'ch3_recoveredSeoiDiary' },
          { type: EffectTypes.ADD_FLAG, flag: 'ch3_noticedPhotoAnomaly' },
          evidence(2),
        ],
      },
    ],
  },
  guardian_recall: {
    id: 'chapter-03.guardian_recall',
    chapterId: 'chapter-03',
    localId: 'guardian_recall',
    mode: SceneModes.VN,
    emotion: 'nervous',
    lines: [
      { char: 'player', text: '집에 두고 온 게.' },
      { char: 'player', text: `${GUARDIAN_NAME}야.` },
      { char: 'player', text: '보호자 안드로이드.' },
      { char: 'system', text: '회상 속 얼굴은 흐릿하게 처리된다.', isNarration: true, important: true },
      { char: 'system', text: '밝게 웃던 윤곽만 남고, 눈과 입술은 픽셀처럼 흩어진다.', isNarration: true },
      { char: 'player', text: '배터리가.' },
      { char: 'player', text: '다 되어 가.' },
      { char: 'system', text: `${SESSION_EMP_ID} 사원증이 주머니에서 차갑게 울린다.`, isNarration: true },
    ],
    next: 'bathroom_glitch',
    effects: [
      { type: EffectTypes.ADD_FLAG, flag: 'ch3_recalledGuardian' },
      batteryPressure(1),
    ],
  },
  bathroom_glitch: {
    id: 'chapter-03.bathroom_glitch',
    chapterId: 'chapter-03',
    localId: 'bathroom_glitch',
    mode: SceneModes.VN,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'system', text: `${PERCEPTION_LAYER.GLITCH} · 시각 동기화 불안정`, isNarration: true, important: true },
      { char: 'system', text: '화장실 거울이 한 박자 늦게 반응한다.', isNarration: true },
      { char: 'system', text: '거울 속 공간은 밝은 타일이 아니었다.', isNarration: true },
      { char: 'system', text: '깨진 타일, 무너진 천장, 곰팡이 냄새가 겹쳐 비친다.', isNarration: true, important: true },
      { char: 'system', text: '거울 프레임 뒤쪽에 검붉은 자국이 스며 있다.', isNarration: true, important: true },
      { char: 'system', text: '손을 뻗으면 닿을 것 같고, 닿으면 안 될 것 같다.', isNarration: true },
    ],
    next: 'ch3_end',
    effects: [
      { type: EffectTypes.ADD_FLAG, flag: 'ch3_glimpsedRealBathroom' },
      { type: EffectTypes.ADD_ITEM, item: 'bathroomMirrorTrace' },
      evidence(1),
    ],
  },
  recorder_found: {
    id: 'chapter-03.recorder_found',
    chapterId: 'chapter-03',
    localId: 'recorder_found',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'system', text: '시체 옆 바닥에 작은 녹음기가 놓여 있다.', isNarration: true, important: true },
      { char: 'system', text: '재생 버튼을 누르자 잡음 뒤에 목소리가 이어진다.', isNarration: true },
      { char: 'seoi', text: '만약 이 녹음을 듣는 사람이 있다면—' },
      { char: 'seoi', text: '당신도 나처럼 여기 온 거겠죠.' },
      { char: 'seoi', text: '누군가를 살리려고.' },
      { char: 'groomy', text: '...' },
      { char: 'groomy', text: '그 녹음은 온보딩 범위 밖이에요.' },
      { char: 'groomy', text: '아마.' },
    ],
    next: 'caretaker_warning',
    effects: [
      { type: EffectTypes.ADD_ITEM, item: 'seoiRecorder' },
      { type: EffectTypes.ADD_FLAG, flag: 'ch3_listenedSeoiRecording' },
      evidence(2),
    ],
  },
  caretaker_warning: {
    id: 'chapter-03.caretaker_warning',
    chapterId: 'chapter-03',
    localId: 'caretaker_warning',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    systemMessage: 'CARETAKER SYSTEMS · CORE ALERT',
    lines: [
      { char: 'caretaker', text: '3층 자료보관실 진입이 확인되었습니다.' },
      { char: 'caretaker', text: '제자리로 돌아가세요.' },
      { char: 'iseol', text: '그루미, 이 채널은 뭐야?' },
      { char: 'groomy', text: '회사 본체예요.' },
      { char: 'groomy', text: '아마.' },
      { char: 'groomy', text: '우리보다 먼저 깨어 있는 쪽이고요.' },
    ],
    next: 'guardian_recall',
    effects: [
      { type: EffectTypes.ADD_FLAG, flag: 'ch3_caretakerFirstContact' },
      corporateHeat(2),
    ],
  },
  ch3_end: {
    id: 'chapter-03.ch3_end',
    chapterId: 'chapter-03',
    localId: 'ch3_end',
    mode: SceneModes.END,
    title: '잊혀진 책상',
    nextChapterId: 'chapter-04',
    end: { type: 'chapterComplete', nextChapterId: 'chapter-04' },
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
    const isFloor3 = withLineRefs.localId.includes('floor3') || withLineRefs.localId.includes('storage')
    const isBathroom = withLineRefs.localId.includes('bathroom')
    return {
      ...withTheme,
      vnStage: withLineRefs.vnStage ?? {
        bgId: isFloor3 ? 'bg_stairwell_floor3' : isBathroom ? 'bg_ch02_mirror_room' : 'bg_default_office',
        overlayId: withLineRefs.emotion === 'warning' ? 'overlay_glitch_soft' : 'overlay_scanline',
        characters: [],
      },
    }
  }
  return withTheme
}

export const chapter03Scenes = Object.fromEntries(
  Object.entries(rawChapter03Scenes).map(([localId, scene]) => [localId, addSceneRefs(scene)]),
)
