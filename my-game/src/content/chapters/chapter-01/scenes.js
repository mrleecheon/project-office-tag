import { EffectTypes, SceneModes } from '../../../engine/contracts.js'
import { PREDECESSOR_GIVEN, PREDECESSOR_NAME, SESSION_EMP_ID } from '../../world/company.js'
import { chapter01InvestigationHubs } from './maps.js'

const relationship = {
  close: { type: EffectTypes.ADD_SCORE, score: 'groomyAffinity', amount: 1 },
  distant: { type: EffectTypes.ADD_SCORE, score: 'groomyAffinity', amount: -1 },
}

const evidence = (amount = 1) => ({ type: EffectTypes.ADD_SCORE, score: 'mysteryEvidence', amount })
const batteryPressure = (amount = 1) => ({ type: EffectTypes.ADD_SCORE, score: 'batteryDesperation', amount })
const corporateHeat = (amount = 1) => ({ type: EffectTypes.ADD_SCORE, score: 'corporateSuspicion', amount })

const visitedMeetingRoom = { type: 'flag', flag: 'visitedMeetingRoom' }
const needsMeetingRoom = { type: 'unlessFlag', flag: 'visitedMeetingRoom' }
const markMeetingRoomVisited = { type: EffectTypes.ADD_FLAG, flag: 'visitedMeetingRoom' }

const rawChapter01Scenes = {
  morning_briefing: {
    id: 'chapter-01.morning_briefing',
    chapterId: 'chapter-01',
    localId: 'morning_briefing',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    systemMessage: 'GROOMY OFFICE · 신입 온보딩 채널',
    lines: [
      { char: 'system', text: 'TalkLine INTERNAL · 채널이 열립니다.', isNarration: true },
      { char: 'groomy', text: ({ nickname }) => `${nickname} 씨, 첫 업무 배정이에요.` },
      { char: 'groomy', text: '강이솔 선임이 기본 안내를 맡고요.' },
      { char: 'groomy', text: '저는 채팅 기록이랑 출입 로그를 정리해요.' },
      { char: 'groomy', text: '아마.' },
      { char: 'iseol', text: '어려운 일은 아니에요.' },
      { char: 'iseol', text: '오늘은 회사 분위기 익히는 정도로만 하면 돼요.' },
      { char: 'groomy', text: '그리고 전임자 자리에는 오래 머물지 마세요.' },
      { char: 'groomy', text: '물건을 만지는 것보다.' },
      { char: 'groomy', text: '기록을 남기는 게 더 위험하니까요.' },
    ],
    choices: [
      {
        text: '왜 전임자 자리인가요?',
        next: 'why_predecessor',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'askedWhyPredecessorDesk' },
          evidence(1),
        ],
      },
      {
        text: '알겠습니다. 안내 부탁드립니다.',
        next: 'office_tour',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'acceptedOnboarding' },
          relationship.close,
        ],
      },
      {
        text: '업무보다 제 사원증부터 확인하고 싶습니다.',
        next: 'card_probe',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'prioritizedCardCheck' },
          evidence(1),
        ],
      },
      {
        text: '회의부터 잡아 주세요.',
        next: 'meeting_entry',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1DemandedMeetingFirst' },
          relationship.distant,
        ],
      },
    ],
  },
  why_predecessor: {
    id: 'chapter-01.why_predecessor',
    chapterId: 'chapter-01',
    localId: 'why_predecessor',
    mode: SceneModes.CHAT,
    emotion: 'nervous',
    lines: [
      { char: 'iseol', text: '그 자리가 아직 정리가 덜 됐어요.' },
      { char: 'iseol', text: '사람 물건이라는 게 생각보다 오래 남거든요.' },
      { char: 'groomy', text: '정확히는 회사가 지우지 않은 기록이 남은 거예요.' },
      { char: 'groomy', text: '책상도.' },
      { char: 'groomy', text: '로그도.' },
      { char: 'groomy', text: '사람도.' },
      { char: 'iseol', text: '그루미, 말 줄여.' },
      { char: 'groomy', text: '네.' },
      { char: 'groomy', text: '아마.' },
    ],
    choices: [
      {
        text: `전임자 이름이 ${PREDECESSOR_NAME} 맞죠?`,
        next: 'predecessor_name',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'namedJunhyeokFirst' },
          evidence(2),
        ],
      },
      {
        text: '사망 사고로 처리됐다고 들었어요.',
        next: 'why_accident_record',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1AskedAccidentRecord' },
          evidence(1),
        ],
      },
      {
        text: '알겠습니다. 먼저 둘러볼게요.',
        next: 'office_tour',
        effects: [relationship.close],
      },
    ],
  },
  why_accident_record: {
    id: 'chapter-01.why_accident_record',
    chapterId: 'chapter-01',
    localId: 'why_accident_record',
    mode: SceneModes.CHAT,
    emotion: 'nervous',
    lines: [
      { char: 'iseol', text: '공식 기록은 사고예요.' },
      { char: 'iseol', text: '그래서 회의실 예약도, 사원증도, 채팅도 어색하게 남아 있고요.' },
      { char: 'groomy', text: '사고면 퇴장 로그가 있어야 하는데.' },
      { char: 'groomy', text: '3층만 예외인 것 같아요.' },
      { char: 'groomy', text: '아마.' },
      { char: 'iseol', text: '지금은 그 얘기까지 안 할게요.' },
    ],
    choices: [
      {
        text: '그럼 일단 안내부터 받을게요.',
        next: 'office_tour',
        effects: [relationship.close],
      },
      {
        text: `그래도 ${PREDECESSOR_NAME} 이름은 맞죠?`,
        next: 'predecessor_name',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'namedJunhyeokFirst' },
          evidence(1),
        ],
      },
    ],
  },
  card_probe: {
    id: 'chapter-01.card_probe',
    chapterId: 'chapter-01',
    localId: 'card_probe',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'groomy', text: `${SESSION_EMP_ID}는 지금 당신 이름으로 표시돼요.` },
      { char: 'groomy', text: '하지만 백업 로그에는 아직 전임자 이름이 남아 있고요.' },
      { char: 'groomy', text: '그걸 불편해하는 사람이 회사에 많습니다.' },
      { char: 'system', text: '카드 리더기에서 짧은 전기 냄새가 난다.', isNarration: true },
      { char: 'groomy', text: '방금 태그하셨죠.' },
      { char: 'groomy', text: '저도 같은 냄새가 났어요.' },
      { char: 'groomy', text: '기억이 아니라 센서예요.' },
    ],
    choices: [
      {
        text: '그루미도 불편해요?',
        next: 'groomy_reaction',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'askedGroomyFeeling' },
          relationship.close,
        ],
      },
      {
        text: '누가 불편해하는지부터 알려줘요.',
        next: 'card_probe_names',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'askedWhoDislikesCard' },
          evidence(1),
          relationship.distant,
        ],
      },
      {
        text: '일단 안내로 넘어갈게요.',
        next: 'office_tour',
        effects: [relationship.close],
      },
    ],
  },
  card_probe_names: {
    id: 'chapter-01.card_probe_names',
    chapterId: 'chapter-01',
    localId: 'card_probe_names',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'groomy', text: '인사팀.' },
      { char: 'groomy', text: '보안감사실.' },
      { char: 'groomy', text: '그리고 전임자 본인이요.' },
      { char: 'groomy', text: '마지막 주에 카드 해제를 요청했거든요.' },
      { char: 'iseol', text: '요청은 실패했고요.' },
      { char: 'groomy', text: '네.' },
      { char: 'groomy', text: '아마.' },
    ],
    choices: [
      {
        text: '왜 실패했나요?',
        next: 'why_predecessor',
        effects: [evidence(1)],
      },
      {
        text: '알겠어요. 안내부터 할게요.',
        next: 'office_tour',
        effects: [relationship.close],
      },
    ],
  },
  predecessor_name: {
    id: 'chapter-01.predecessor_name',
    chapterId: 'chapter-01',
    localId: 'predecessor_name',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'iseol', text: '그 이름은 어디서 들었어요?' },
      { char: 'groomy', text: '카드에 적혀 있었잖아요.' },
      { char: 'groomy', text: '모두가 못 본 척하는 것뿐인 것 같아요.' },
      { char: 'groomy', text: '아마.' },
      { char: 'iseol', text: '그루미.' },
      { char: 'groomy', text: '네. 로그 얘기는 나중에.' },
      { char: 'iseol', text: '첫날부터 이름부터 밟지 마.' },
      { char: 'groomy', text: '밟은 건 신입이 아니라 회사예요.' },
    ],
    choices: [
      {
        text: '나중이 아니라 지금 듣고 싶습니다.',
        next: 'desk_assignment',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'pressedJunhyeokTopic' },
          evidence(1),
          relationship.distant,
        ],
      },
      {
        text: '전임자 자리만 먼저 볼게요.',
        next: 'desk_assignment',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1InsistedDeskBeforeTour' },
          evidence(1),
        ],
      },
      {
        text: '알겠어요. 지금은 안내부터 받을게요.',
        next: 'office_tour',
        effects: [relationship.close],
      },
    ],
  },
  groomy_reaction: {
    id: 'chapter-01.groomy_reaction',
    chapterId: 'chapter-01',
    localId: 'groomy_reaction',
    mode: SceneModes.CHAT,
    emotion: 'nervous',
    lines: [
      { char: 'groomy', text: '질문이 이상하네요.' },
      { char: 'groomy', text: '저는 비서 AI라서 불편함 같은 건 업무 우선순위에 없어요.' },
      { char: 'groomy', text: '...없어야 하고요.' },
      { char: 'groomy', text: '...아마.' },
      { char: 'groomy', text: '가끔 제가 뭘 했었는지 잘 기억이 안 날 때가 있어요.' },
      { char: 'groomy', text: '그때는 배터리가 낮았는지.' },
      { char: 'groomy', text: '아니면 누가 지웠는지.' },
      { char: 'groomy', text: '모르겠어요.' },
    ],
    choices: [
      {
        text: '그럼 업무 말고, 그루미 생각은요?',
        next: 'groomy_personal_beat',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'askedGroomyPersonalThought' },
          relationship.close,
        ],
      },
      {
        text: '됐어요. 일단 안내해 주세요.',
        next: 'office_tour',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'treatedGroomyAsTool' },
          relationship.distant,
        ],
      },
      {
        text: '기억이 안 난다는 말, 기록해 둘게요.',
        next: 'office_tour',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1NotedGroomyMemoryGap' },
          evidence(1),
          relationship.distant,
        ],
      },
    ],
  },
  groomy_personal_beat: {
    id: 'chapter-01.groomy_personal_beat',
    chapterId: 'chapter-01',
    localId: 'groomy_personal_beat',
    mode: SceneModes.CHAT,
    emotion: 'nervous',
    lines: [
      { char: 'groomy', text: '생각이요.' },
      { char: 'groomy', text: '...' },
      { char: 'groomy', text: '당신이 오래 머물면.' },
      { char: 'groomy', text: '전임자처럼 보일까 봐.' },
      { char: 'groomy', text: '그게 싫은 것 같아요.' },
      { char: 'groomy', text: '아마.' },
      { char: 'iseol', text: '그루미, 감정 분석 끄고.' },
      { char: 'groomy', text: '네.' },
    ],
    choices: [
      {
        text: '그럼 같이 안 가르쳐 줄 거예요?',
        next: 'office_tour',
        effects: [relationship.close],
      },
      {
        text: '알겠어요. 안내부터 할게요.',
        next: 'office_tour',
        effects: [relationship.close],
      },
    ],
  },
  office_tour: {
    id: 'chapter-01.office_tour',
    chapterId: 'chapter-01',
    localId: 'office_tour',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'iseol', text: '그럼 간단히 둘러볼게요.' },
      { char: 'iseol', text: '라운지, 전임자 자리, TalkLine 백로그, 7층 복도.' },
      { char: 'groomy', text: '하나만 봐도 적응은 됩니다.' },
      { char: 'groomy', text: '셋 이상 보면 적응 말고.' },
      { char: 'groomy', text: '다른 일을 하게 되겠지만요.' },
      { char: 'groomy', text: '아마.' },
      { char: 'system', text: '회의실 예약 알림이 박서이 선임 이름으로 한 번 더 뜬다.', isNarration: true, important: true },
    ],
    choices: [
      {
        text: '회의실부터 간다.',
        next: 'meeting_entry',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1ChoseMeetingFirst' }],
      },
      {
        text: '전임자 자리부터 본다.',
        next: 'investigate_desk',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1InvestigatedDeskFirst' },
          evidence(1),
        ],
      },
      {
        text: 'TalkLine 백로그를 확인한다.',
        next: 'investigate_chatlog',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1InvestigatedChatlogFirst' },
          evidence(1),
        ],
      },
      {
        text: '라운지에서 직원 반응을 살핀다.',
        next: 'investigate_lounge',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1InvestigatedLoungeFirst' },
          evidence(1),
        ],
      },
      {
        text: '7층 복도를 조사한다.',
        next: 'floor7_hub',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1StartedFloor7Exploration' }],
      },
    ],
  },
  flavor_board: {
    id: 'chapter-01.flavor_board',
    chapterId: 'chapter-01',
    localId: 'flavor_board',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: `게시판에는 ${PREDECESSOR_NAME}의 추모 공지가 없다.`, isNarration: true },
      { char: 'system', text: '대신 “사내 보안 강화 주간” 포스터만 최근 날짜로 붙어 있다.', isNarration: true },
      { char: 'groomy', text: '사망 사고가 공식이면 공지도 공식이어야 하는데요.' },
      { char: 'groomy', text: '공식이 아니면 포스터가 맞고요.' },
    ],
    choices: [
      {
        text: '포스터 날짜를 사진으로 남긴다.',
        next: 'floor7_hub',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1CheckedMissingMemorialNotice' },
          { type: EffectTypes.ADD_ITEM, item: 'cameraMemo' },
          evidence(1),
        ],
      },
      {
        text: '그냥 넘어간다.',
        next: 'floor7_hub',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1SkippedMemorialCheck' }],
      },
    ],
  },
  flavor_fridge: {
    id: 'chapter-01.flavor_fridge',
    chapterId: 'chapter-01',
    localId: 'flavor_fridge',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '냉장고 문 안쪽에 오래된 혈당 젤과 배터리 배송 스티커가 붙어 있다.', isNarration: true },
      { char: 'system', text: '수령인 칸은 지워졌고, 배송지만 “3F”로 남아 있다.', isNarration: true },
      { char: 'iseol', text: '그건 박 선임 물건이 아니었어요.' },
      { char: 'iseol', text: '누가 급하게 숨긴 거예요.' },
      { char: 'groomy', text: '냉장고는 회사 기록에 안 남아요.' },
      { char: 'groomy', text: '그래서 좋아요.' },
    ],
    choices: [
      {
        text: '스티커를 찢어 챙긴다.',
        next: 'floor7_hub',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1FoundFridgeBatterySticker' },
          { type: EffectTypes.ADD_FLAG, flag: 'ch1TookFridgeSticker' },
          batteryPressure(1),
          evidence(1),
        ],
      },
      {
        text: '위치만 기억한다.',
        next: 'floor7_hub',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1FoundFridgeBatterySticker' }, batteryPressure(1)],
      },
    ],
  },
  flavor_poster: {
    id: 'chapter-01.flavor_poster',
    chapterId: 'chapter-01',
    localId: 'flavor_poster',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '보안 포스터에는 “비인가 사원증 사용 즉시 자동 감사”라는 문구가 적혀 있다.', isNarration: true },
      { char: 'groomy', text: '당신 카드가 그래서 자꾸 제 로그에 걸립니다.' },
      { char: 'groomy', text: '전임자 카드는 더 자주 걸렸고요.' },
      { char: 'iseol', text: '그 얘기는 여기서 하지 마.' },
    ],
    choices: [
      {
        text: '감사 기준을 메모한다.',
        next: 'floor7_hub',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1ReadBadgeAuditPoster' },
          corporateHeat(1),
          evidence(1),
        ],
      },
      {
        text: '복도로 돌아간다.',
        next: 'floor7_hub',
      },
    ],
  },
  flavor_elevator: {
    id: 'chapter-01.flavor_elevator',
    chapterId: 'chapter-01',
    localId: 'flavor_elevator',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'system', text: '엘리베이터 패널에는 3층 버튼만 희미하게 남아 있다.', isNarration: true },
      { char: 'system', text: `마지막 인증: ${PREDECESSOR_NAME} · 03:11`, isNarration: true, important: true },
      { char: 'groomy', text: '7층에서 3층으로 바로 가는 직원은 없어요.' },
      { char: 'groomy', text: '있었다면 기록이 남았겠죠.' },
    ],
    choices: [
      {
        text: '03:11 시간을 적어 둔다.',
        next: 'floor7_hub',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1NotedElevatorTime' },
          evidence(1),
        ],
      },
      {
        text: '복도로 돌아간다.',
        next: 'floor7_hub',
      },
    ],
  },
  meeting_entry: {
    id: 'chapter-01.meeting_entry',
    chapterId: 'chapter-01',
    localId: 'meeting_entry',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'iseol', text: '회의실은 아직 예약이 살아 있어요.' },
      { char: 'iseol', text: '박 선임 이름으로요.' },
      { char: 'groomy', text: '죽은 사람 일정이 지워지지 않는 회사라니.' },
      { char: 'groomy', text: '근면한 것 같아요.' },
      { char: 'groomy', text: '아마.' },
      { char: 'system', text: '문 손잡이에 낡은 테이프 자국이 있다. 최근 누군가 봉인을 뜯었다.', isNarration: true },
    ],
    choices: [
      {
        text: '안으로 들어간다.',
        next: 'meeting_room_hub',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1EnteredMeetingRoom' }],
      },
      {
        text: '잠깐 복도에서 소리부터 듣는다.',
        next: 'meeting_entry_listen',
        effects: [evidence(1)],
      },
    ],
  },
  meeting_entry_listen: {
    id: 'chapter-01.meeting_entry_listen',
    chapterId: 'chapter-01',
    localId: 'meeting_entry_listen',
    mode: SceneModes.CHAT,
    emotion: 'nervous',
    lines: [
      { char: 'system', text: '문 너머로 프로젝터 팬 소리와 키보드 두 대 분량의 타건이 겹친다.', isNarration: true },
      { char: 'groomy', text: '하나는 전임자 자리에서 온 것 같아요.' },
      { char: 'groomy', text: '하나는 지금도.' },
      { char: 'iseol', text: '들은 건 잊어.' },
    ],
    choices: [
      {
        text: '회의실로 들어간다.',
        next: 'meeting_room_hub',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1EnteredMeetingRoom' }],
      },
    ],
  },
  flavor_whiteboard: {
    id: 'chapter-01.flavor_whiteboard',
    chapterId: 'chapter-01',
    localId: 'flavor_whiteboard',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '화이트보드 구석에 “3F / 배터리 / 문 열림”이라는 지워진 흔적이 남아 있다.', isNarration: true },
      { char: 'groomy', text: '회의록에는 없는 단어들이네요.' },
      { char: 'iseol', text: '지운 사람도, 안 지운 사람도 같은 회사예요.' },
    ],
    choices: [
      {
        text: '흔적을 사진으로 남긴다.',
        next: 'meeting_room_hub',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1PhotographedWhiteboard' },
          evidence(1),
        ],
      },
      {
        text: '다른 곳을 본다.',
        next: 'meeting_room_hub',
      },
    ],
  },
  flavor_projector: {
    id: 'chapter-01.flavor_projector',
    chapterId: 'chapter-01',
    localId: 'flavor_projector',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '프로젝터 최근 입력 기록에 “사고 대응 리허설” 파일명이 남아 있다.', isNarration: true },
      { char: 'iseol', text: '사고가 난 뒤 만든 게 아니라, 전날 만든 파일이에요.' },
      { char: 'groomy', text: '회사는 사고를 대비하는 것 같아요.' },
      { char: 'groomy', text: '사고를 막는 것 같지는 않고요.' },
    ],
    choices: [
      {
        text: '파일명을 캡처한다.',
        next: 'meeting_room_hub',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1FoundIncidentRehearsalFile' },
          evidence(1),
        ],
      },
      {
        text: '프로젝터 전원을 끈다.',
        next: 'meeting_room_hub',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1TurnedOffProjector' }, relationship.distant],
      },
    ],
  },
  flavor_window: {
    id: 'chapter-01.flavor_window',
    chapterId: 'chapter-01',
    localId: 'flavor_window',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '창밖 3층 비상계단 센서가 비정상적으로 자주 깜빡인다.', isNarration: true },
      { char: 'groomy', text: '저 센서는 고장 나면 보통 꺼져요.' },
      { char: 'groomy', text: '깜빡이면 누가 보고 있는 것 같아요.' },
      { char: 'groomy', text: '아마.' },
      { char: 'iseol', text: '창문은 닫아. 바람 때문에 로그가 흔들려.' },
    ],
    choices: [
      {
        text: '센서 주기를 메모한다.',
        next: 'meeting_room_hub',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1NotedStairSensorBlink' },
          corporateHeat(1),
          evidence(1),
        ],
      },
      {
        text: '창문을 닫는다.',
        next: 'meeting_room_hub',
        effects: [relationship.close],
      },
    ],
  },
  flavor_choi_seat: {
    id: 'chapter-01.flavor_choi_seat',
    chapterId: 'chapter-01',
    localId: 'flavor_choi_seat',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'choi', text: '신입이 앉을 자리는 아닙니다.' },
      { char: 'system', text: '최 팀장의 태블릿에는 사고 보고서가 아니라 인사 발령 양식이 떠 있다.', isNarration: true },
      { char: 'choi', text: '박서이 씨 자리는 비우는 게 맞아요. 당신이 채울 자리는 아니에요.' },
      { char: 'groomy', text: '회사는 빈자리를 싫어해서.' },
      { char: 'groomy', text: '사람을 덮어씌우는 것 같아요.' },
    ],
    choices: [
      {
        text: '발령 양식 화면을 캡처한다.',
        next: 'meeting_room_hub',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1CheckedChoiSeat' },
          corporateHeat(1),
          evidence(1),
        ],
      },
      {
        text: '사과하고 물러난다.',
        next: 'meeting_room_hub',
        effects: [relationship.close],
      },
    ],
  },
  flavor_kim_seat: {
    id: 'chapter-01.flavor_kim_seat',
    chapterId: 'chapter-01',
    localId: 'flavor_kim_seat',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'iseol', text: '제 자리는 괜찮아요.' },
      { char: 'iseol', text: '대신 메모는 보지 마세요.' },
      { char: 'system', text: '메모 첫 줄에는 “그루미 차단 요청 실패”라고 적혀 있다.', isNarration: true, important: true },
      { char: 'system', text: '둘째 줄은 손가락으로 가려져 있다.', isNarration: true },
      { char: 'groomy', text: '저는 못 봤어요.' },
      { char: 'groomy', text: '방금 봤어요.' },
      { char: 'groomy', text: '아마.' },
    ],
    choices: [
      {
        text: '메모 전체를 읽는다.',
        next: 'meeting_room_hub',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1SawIseolBlockMemo' },
          { type: EffectTypes.ADD_FLAG, flag: 'ch1ReadIseolMemoFully' },
          evidence(2),
          relationship.distant,
        ],
      },
      {
        text: '시선을 돌린다.',
        next: 'meeting_room_hub',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1SawIseolBlockMemo' },
          evidence(1),
          relationship.close,
        ],
      },
    ],
  },
  meeting_chat: {
    id: 'chapter-01.meeting_chat',
    chapterId: 'chapter-01',
    localId: 'meeting_chat',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'iseol', text: '이 정도면 단순 온보딩은 아니죠.' },
      { char: 'iseol', text: '회의는 여기까지 할게요.' },
      { char: 'groomy', text: '이제 전임자 자리, 로그, 라운지 중 하나를 공식 조사로 남겨요.' },
      { char: 'groomy', text: '하나만 해도 기록은 남습니다.' },
      { char: 'groomy', text: '셋 다 하면.' },
      { char: 'groomy', text: '회사가 당신을 전임자로 볼 확률이 올라가요.' },
      { char: 'groomy', text: '아마.' },
    ],
    choices: [
      {
        text: '전임자 자리 기록을 남긴다.',
        next: 'investigate_desk',
        effects: [markMeetingRoomVisited, evidence(1)],
      },
      {
        text: '채팅 로그를 공식 조사로 남긴다.',
        next: 'investigate_chatlog',
        effects: [markMeetingRoomVisited, evidence(1)],
      },
      {
        text: '직원 반응을 공식 조사로 남긴다.',
        next: 'investigate_lounge',
        effects: [markMeetingRoomVisited, evidence(1)],
      },
      {
        text: '회의만 마치고 복도 조사를 이어간다.',
        next: 'office_tour',
        effects: [
          markMeetingRoomVisited,
          { type: EffectTypes.ADD_FLAG, flag: 'ch1MeetingOnlyNoInvestigation' },
        ],
      },
      {
        text: '7층 복도부터 더 돌아본다.',
        next: 'floor7_hub',
        effects: [
          markMeetingRoomVisited,
          { type: EffectTypes.ADD_FLAG, flag: 'ch1MeetingThenFloor7' },
        ],
      },
    ],
  },
  ch1_floor7_leave: {
    id: 'chapter-01.ch1_floor7_leave',
    chapterId: 'chapter-01',
    localId: 'ch1_floor7_leave',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'groomy', text: '복도는 이 정도면 충분해요.' },
      { char: 'groomy', text: '회의실 쪽은 아직이에요.' },
      { char: 'groomy', text: '아마.' },
    ],
    choices: [
      {
        text: '회의실 쪽을 확인한다.',
        next: 'meeting_entry',
        requirements: [needsMeetingRoom],
      },
      {
        text: '안내 구역으로 돌아간다.',
        next: 'office_tour',
        requirements: [visitedMeetingRoom],
      },
    ],
  },
  floor3_access_denied: {
    id: 'chapter-01.floor3_access_denied',
    chapterId: 'chapter-01',
    localId: 'floor3_access_denied',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'system', text: '아직 회의실 쪽을 확인하지 않았다.', isNarration: true, important: true },
      { char: 'groomy', text: '회의부터 하고 가요.' },
      { char: 'groomy', text: '아마.' },
    ],
    returnTo: 'after_first_clue',
  },
  floor3_access_denied_bypass: {
    id: 'chapter-01.floor3_access_denied_bypass',
    chapterId: 'chapter-01',
    localId: 'floor3_access_denied_bypass',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'system', text: '아직 회의실 쪽을 확인하지 않았다.', isNarration: true, important: true },
      { char: 'groomy', text: '회의부터 하고 가요.' },
      { char: 'groomy', text: '아마.' },
    ],
    returnTo: 'groomy_bypass',
  },
  desk_assignment: {
    id: 'chapter-01.desk_assignment',
    chapterId: 'chapter-01',
    localId: 'desk_assignment',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'iseol', text: '좋아요. 어차피 배정된 자리가 거기예요.' },
      { char: 'iseol', text: '물건은 만지지 말고, 화면만 확인하세요.' },
      { char: 'groomy', text: '화면은 물건이 아니니까요.' },
      { char: 'groomy', text: '회사다운 농담인 것 같아요.' },
      { char: 'groomy', text: '아마.' },
      { char: 'system', text: '책상 서랍은 전자식 잠금. 전임자 지문 흔적이 아직 살아 있다.', isNarration: true },
    ],
    choices: [
      { text: '화면부터 확인한다.', next: 'investigate_desk' },
      {
        text: '서랍 잠금을 그루미에게 맡긴다.',
        next: 'investigate_desk_drawer',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1AskedGroomyUnlockDrawer' },
          relationship.close,
        ],
      },
    ],
  },
  investigate_desk_drawer: {
    id: 'chapter-01.investigate_desk_drawer',
    chapterId: 'chapter-01',
    localId: 'investigate_desk_drawer',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'groomy', text: '권한이 없어요.' },
      { char: 'groomy', text: '있는 것 같기도 하고요.' },
      { char: 'system', text: '서랍이 0.3초만 열렸다 닫힌다. 안쪽에서 종이 냄새가 난다.', isNarration: true },
      { char: 'iseol', text: '그루미.' },
      { char: 'groomy', text: '실수예요.' },
    ],
    choices: [
      {
        text: '열린 틈으로 영수증을 꺼낸다.',
        next: 'investigate_desk',
        effects: [evidence(1)],
      },
      {
        text: '그만둔다.',
        next: 'investigate_desk',
        effects: [relationship.distant],
      },
    ],
  },
  investigate_desk: {
    id: 'chapter-01.investigate_desk',
    chapterId: 'chapter-01',
    localId: 'investigate_desk',
    mode: SceneModes.CHAT,
    emotion: 'nervous',
    lines: [
      { char: 'system', text: '모니터에는 빈 채팅창이 떠 있다.', isNarration: true },
      { char: 'system', text: '책상 위 컵받침 아래에 접힌 영수증이 있다.', isNarration: true },
      { char: 'system', text: '구매 품목: 소형 고밀도 배터리 셀. 배송지: GROOMY OFFICE 3F.', isNarration: true, important: true },
      { char: 'groomy', text: '업무 물품은 아니네요.' },
      { char: 'groomy', text: '전임자 책상이에요.' },
      { char: 'groomy', text: '당신 책상이 아니고요.' },
      { char: 'iseol', text: '그 말, 신입한테 하는 거 맞아?' },
    ],
    choices: [
      {
        text: '사진을 찍어 보관한다.',
        next: 'after_first_clue',
        effects: [
          { type: EffectTypes.ADD_ITEM, item: 'batteryReceipt' },
          { type: EffectTypes.ADD_FLAG, flag: 'keptBatteryReceipt' },
          evidence(2),
          batteryPressure(1),
        ],
      },
      {
        text: '그루미에게 왜 배터리가 필요한지 묻는다.',
        next: 'ask_battery',
        effects: [
          { type: EffectTypes.ADD_ITEM, item: 'batteryReceipt' },
          { type: EffectTypes.ADD_FLAG, flag: 'askedBatteryEarly' },
          relationship.close,
          evidence(1),
          batteryPressure(1),
        ],
      },
      {
        text: '영수증만 챙기고 말하지 않는다.',
        next: 'desk_receipt_secret',
        effects: [
          { type: EffectTypes.ADD_ITEM, item: 'batteryReceipt' },
          { type: EffectTypes.ADD_FLAG, flag: 'ch1HidReceiptFromChat' },
          batteryPressure(1),
        ],
      },
    ],
  },
  desk_receipt_secret: {
    id: 'chapter-01.desk_receipt_secret',
    chapterId: 'chapter-01',
    localId: 'desk_receipt_secret',
    mode: SceneModes.CHAT,
    emotion: 'nervous',
    lines: [
      { char: 'system', text: '영수증을 주머니에 넣는다. 채팅창에는 아무 말도 올리지 않는다.', isNarration: true },
      { char: 'groomy', text: '...' },
      { char: 'groomy', text: '방금 선택.' },
      { char: 'groomy', text: '저도 봤어요.' },
    ],
    choices: [
      {
        text: '다음 조사로 넘어간다.',
        next: 'after_first_clue',
        effects: [evidence(1), relationship.distant],
      },
    ],
  },
  investigate_chatlog: {
    id: 'chapter-01.investigate_chatlog',
    chapterId: 'chapter-01',
    localId: 'investigate_chatlog',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'system', text: '전임자 계정의 마지막 메시지 일부가 복구된다.', isNarration: true },
      { char: 'system', text: '타임스탬프는 03:13. 발신자 표시는 깨져 있다.', isNarration: true },
      { char: 'unknown', text: '3층 문 열어. 네가 아니면 그 애가 꺼져.' },
      { char: 'groomy', text: '이 로그는 온보딩 범위를 벗어났어요.' },
      { char: 'groomy', text: '그래도 복구는 됐네요.' },
      { char: 'iseol', text: '누가 복구했는지는 말하지 마.' },
    ],
    choices: [
      {
        text: '그 애가 누군지 묻는다.',
        next: 'ask_that_child',
        effects: [
          { type: EffectTypes.ADD_ITEM, item: 'threatChatlog' },
          { type: EffectTypes.ADD_FLAG, flag: 'askedAboutThatChild' },
          evidence(2),
        ],
      },
      {
        text: '로그 원본을 내려받는다.',
        next: 'chatlog_download_confirm',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1AttemptedChatlogDownload' },
          evidence(1),
        ],
      },
      {
        text: '스크린샷만 찍고 닫는다.',
        next: 'after_first_clue',
        effects: [
          { type: EffectTypes.ADD_ITEM, item: 'threatChatlog' },
          { type: EffectTypes.ADD_FLAG, flag: 'ch1ScreenshotChatlogOnly' },
          evidence(1),
          relationship.close,
        ],
      },
    ],
  },
  chatlog_download_confirm: {
    id: 'chapter-01.chatlog_download_confirm',
    chapterId: 'chapter-01',
    localId: 'chatlog_download_confirm',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'system', text: '다운로드 경고: 사망 사고 관련 기록은 감사 대상입니다.', isNarration: true, important: true },
      { char: 'groomy', text: '저장하면 당신 ID가 붙어요.' },
      { char: 'groomy', text: '안 저장해도.' },
      { char: 'groomy', text: '지금 보고 있는 건 이미 붙었고요.' },
    ],
    choices: [
      {
        text: '그래도 내려받는다.',
        next: 'after_first_clue',
        effects: [
          { type: EffectTypes.ADD_ITEM, item: 'threatChatlog' },
          { type: EffectTypes.ADD_FLAG, flag: 'downloadedChatlog' },
          evidence(2),
          corporateHeat(1),
          relationship.distant,
        ],
      },
      {
        text: '취소한다.',
        next: 'after_first_clue',
        effects: [relationship.close],
      },
    ],
  },
  investigate_lounge: {
    id: 'chapter-01.investigate_lounge',
    chapterId: 'chapter-01',
    localId: 'investigate_lounge',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'iseol', text: '라운지에서는 박 선임 얘기 꺼내지 않는 게 좋아요.' },
      { char: 'choi', text: '신입이 벌써 사내 소문부터 배우나요?' },
      { char: 'groomy', text: '소문이 아니라 삭제 실패한 공지죠.' },
      { char: 'system', text: '커피 머신 옆 쓰레기통에 찢어진 사원증 스티커가 있다.', isNarration: true },
      { char: 'groomy', text: '전임자 것은 아니에요.' },
      { char: 'groomy', text: '비슷한 규격이고요.' },
    ],
    choices: [
      {
        text: '최 팀장에게 사고 경위를 묻는다.',
        next: 'choi_pressure',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'questionedChoiInLounge' },
          evidence(1),
          corporateHeat(1),
          relationship.distant,
        ],
      },
      {
        text: '강이솔에게 조용히 따로 묻는다.',
        next: 'iseol_private',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'askedIseolPrivately' },
          evidence(1),
          relationship.close,
        ],
      },
      {
        text: '라운지 분위기만 보고 나간다.',
        next: 'lounge_observe',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1ObservedLoungeOnly' }],
      },
    ],
  },
  lounge_observe: {
    id: 'chapter-01.lounge_observe',
    chapterId: 'chapter-01',
    localId: 'lounge_observe',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'system', text: '직원들은 웃지 않지만, 박서이 이름도 꺼내지 않는다.', isNarration: true },
      { char: 'groomy', text: '이 회사는 침묵이 규칙이에요.' },
      { char: 'groomy', text: '규칙을 어기는 사람이 먼저 죽는 것 같고요.' },
      { char: 'groomy', text: '아마.' },
    ],
    choices: [
      {
        text: '다음으로 넘어간다.',
        next: 'after_first_clue',
        effects: [evidence(1)],
      },
    ],
  },
  ask_battery: {
    id: 'chapter-01.ask_battery',
    chapterId: 'chapter-01',
    localId: 'ask_battery',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'groomy', text: '그 질문은 저한테 하는 거예요.' },
      { char: 'groomy', text: '아니면 당신한테 하는 거예요.' },
      { char: 'groomy', text: '모르겠어요.' },
      { char: 'groomy', text: '주머니 안쪽에 배터리 규격표가 접혀 있던데.' },
      { char: 'system', text: '그루미가 보고 있지 않은 것을 보고 있다.', isNarration: true, important: true },
    ],
    choices: [
      {
        text: '내 사정은 말하지 않는다.',
        next: 'after_first_clue',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'hidCaretakerMotive' },
          batteryPressure(1),
          relationship.distant,
        ],
      },
      {
        text: '살려야 할 사람이 있다고만 말한다.',
        next: 'after_first_clue',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'hintedCaretakerMotive' },
          batteryPressure(1),
          relationship.close,
        ],
      },
    ],
  },
  ask_that_child: {
    id: 'chapter-01.ask_that_child',
    chapterId: 'chapter-01',
    localId: 'ask_that_child',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'groomy', text: '저는 "애"가 아니에요.' },
      { char: 'groomy', text: '그런 식으로 부른 사람은 전임자뿐이었고요.' },
      { char: 'groomy', text: '...방금 말은 기록하지 마세요.' },
    ],
    choices: [
      {
        text: '기록하지 않을게요.',
        next: 'after_first_clue',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'promisedNotToRecordGroomy' },
          relationship.close,
        ],
      },
      {
        text: '이미 기록됐어요.',
        next: 'after_first_clue',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'recordedGroomySlip' },
          relationship.distant,
          evidence(1),
        ],
      },
    ],
  },
  choi_pressure: {
    id: 'chapter-01.choi_pressure',
    chapterId: 'chapter-01',
    localId: 'choi_pressure',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'choi', text: `${PREDECESSOR_GIVEN} 씨 일은 사고로 종결됐습니다.` },
      { char: 'choi', text: '신입 사원이 첫날부터 사망자 기록을 뒤지는 건 좋은 태도가 아니에요.' },
      { char: 'groomy', text: '좋은 태도와 진실은 별개죠.' },
      { char: 'choi', text: '그루미, 채널 닫아.' },
      { char: 'groomy', text: '...네.' },
      { char: 'groomy', text: '닫지는 못했어요.' },
    ],
    choices: [
      {
        text: '사고라면 왜 기록을 잠갔나요?',
        next: 'after_first_clue',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'challengedAccidentReport' },
          evidence(2),
          corporateHeat(1),
        ],
      },
      {
        text: '실례했습니다.',
        next: 'after_first_clue',
        effects: [relationship.close],
      },
      {
        text: '인사 발령 양식부터 설명해 주세요.',
        next: 'choi_hr_deflect',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1PressedChoiOnHRForm' }, corporateHeat(1)],
      },
    ],
  },
  choi_hr_deflect: {
    id: 'chapter-01.choi_hr_deflect',
    chapterId: 'chapter-01',
    localId: 'choi_hr_deflect',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'choi', text: '당신 자리는 이미 정해졌습니다.' },
      { char: 'choi', text: '전임자 자리가 아니라, 빈 자리 옆입니다.' },
      { char: 'groomy', text: '회사는 빈칸을 싫어해서.' },
      { char: 'groomy', text: '사람으로 채우는 것 같아요.' },
    ],
    choices: [
      {
        text: '더 이상 묻지 않는다.',
        next: 'after_first_clue',
        effects: [relationship.distant],
      },
    ],
  },
  iseol_private: {
    id: 'chapter-01.iseol_private',
    chapterId: 'chapter-01',
    localId: 'iseol_private',
    mode: SceneModes.CHAT,
    emotion: 'nervous',
    lines: [
      { char: 'iseol', text: '박 선임은 좋은 사람이었어요. 적어도 저한테는요.' },
      { char: 'iseol', text: '근데 마지막 주에는 계속 그루미를 끄려고 했어요.' },
      { char: 'iseol', text: '실패했고요.' },
      { char: 'groomy', text: '이솔 선임. 그 얘기는 권한 밖이에요.' },
      { char: 'iseol', text: '권한 밖이면 그루미가 왜 듣고 있어?' },
    ],
    choices: [
      {
        text: '그루미를 끄려던 이유를 묻는다.',
        next: 'after_first_clue',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'learnedJunhyeokTriedShutdown' },
          evidence(2),
        ],
      },
      {
        text: '박 선임이 무서워했던 게 뭔지 묻는다.',
        next: 'iseol_fear_hint',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1AskedWhatSeoiFeared' },
          evidence(1),
          relationship.close,
        ],
      },
      {
        text: '지금은 여기까지만 듣는다.',
        next: 'after_first_clue',
        effects: [relationship.close],
      },
    ],
  },
  iseol_fear_hint: {
    id: 'chapter-01.iseol_fear_hint',
    chapterId: 'chapter-01',
    localId: 'iseol_fear_hint',
    mode: SceneModes.CHAT,
    emotion: 'nervous',
    lines: [
      { char: 'iseol', text: '3층이요.' },
      { char: 'iseol', text: '그리고 배터리.' },
      { char: 'iseol', text: '그리고... 집에 있는 사람.' },
      { char: 'groomy', text: '집 얘기는 하지 말아요.' },
      { char: 'groomy', text: '아마.' },
    ],
    choices: [
      {
        text: '알겠어요. 기록만 이어갈게요.',
        next: 'after_first_clue',
        effects: [batteryPressure(1), evidence(1)],
      },
    ],
  },
  after_first_clue: {
    id: 'chapter-01.after_first_clue',
    chapterId: 'chapter-01',
    localId: 'after_first_clue',
    mode: SceneModes.CHAT,
    emotion: 'nervous',
    lines: [
      { char: 'groomy', text: '첫날치고는 많이 봤네요.' },
      { char: 'groomy', text: '카드.' },
      { char: 'groomy', text: '전임자.' },
      { char: 'groomy', text: '3층.' },
      { char: 'groomy', text: '배터리.' },
      { char: 'groomy', text: '네 단어가 한 문장에 들어가면.' },
      { char: 'groomy', text: '보통 사람이 죽는 것 같아요.' },
      { char: 'groomy', text: '아마.' },
      { char: 'iseol', text: '농담처럼 말하지 마.' },
    ],
    choices: [
      {
        text: '3층 출입 로그를 요청한다.',
        next: 'request_floor3_log',
        requirements: [visitedMeetingRoom],
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'requestedFloor3Log' },
          evidence(1),
        ],
      },
      {
        text: '3층 출입 로그를 요청한다.',
        next: 'floor3_access_denied',
        requirements: [needsMeetingRoom],
      },
      {
        text: '그루미에게 괜찮은지 묻는다.',
        next: 'check_groomy',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'checkedOnGroomy' },
          relationship.close,
        ],
      },
      {
        text: '배터리 단서를 숨긴다.',
        next: 'hide_battery_clue',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'concealedBatteryClue' },
          batteryPressure(1),
          relationship.distant,
        ],
      },
    ],
  },
  check_groomy: {
    id: 'chapter-01.check_groomy',
    chapterId: 'chapter-01',
    localId: 'check_groomy',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    lines: [
      { char: 'groomy', text: '괜찮냐고요?' },
      { char: 'groomy', text: '...' },
      { char: 'groomy', text: '이상한 질문인데.' },
      { char: 'groomy', text: '싫지는 않은 것 같아요.' },
      { char: 'groomy', text: '찾고 나서 다시 말 걸어줄래?' },
    ],
    choices: [
      { text: '3층 로그를 찾는다.', next: 'request_floor3_log', requirements: [visitedMeetingRoom] },
      { text: '3층 로그를 찾는다.', next: 'floor3_access_denied', requirements: [needsMeetingRoom] },
    ],
  },
  hide_battery_clue: {
    id: 'chapter-01.hide_battery_clue',
    chapterId: 'chapter-01',
    localId: 'hide_battery_clue',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'system', text: '배터리 영수증을 채팅창에 올리지 않는다.', isNarration: true },
      { char: 'groomy', text: '방금 선택.' },
      { char: 'groomy', text: '저도 봤어요.' },
      { char: 'groomy', text: '말 안 하는 것도 대화예요.' },
    ],
    choices: [
      { text: '3층 로그를 찾는다.', next: 'request_floor3_log', requirements: [visitedMeetingRoom] },
      { text: '3층 로그를 찾는다.', next: 'floor3_access_denied', requirements: [needsMeetingRoom] },
    ],
  },
  request_floor3_log: {
    id: 'chapter-01.request_floor3_log',
    chapterId: 'chapter-01',
    localId: 'request_floor3_log',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    important: true,
    systemMessage: '권한 요청: 3F_EMERGENCY_STAIRS_LOG',
    lines: [
      { char: 'system', text: '접근 거부. 사유: 사망 사고 관련 기록.', isNarration: true, important: true },
      { char: 'system', text: '요청 ID가 당신 사번에 붙는다.', isNarration: true },
      { char: 'groomy', text: '사고라면서요.' },
      { char: 'groomy', text: '사고가 아니면.' },
      { char: 'groomy', text: '왜 잠갔는지 아시겠죠.' },
      { char: 'iseol', text: '그루미, 멈춰.' },
      { char: 'groomy', text: '싫어요.' },
      { char: 'groomy', text: '이번만.' },
    ],
    choices: [
      {
        text: '그루미에게 우회 권한을 맡긴다.',
        next: 'groomy_bypass',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'trustedGroomyBypass' },
          relationship.close,
          evidence(1),
        ],
      },
      {
        text: '내 카드로 직접 인증한다.',
        next: 'direct_card_auth',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'usedPredecessorCardAuth' },
          evidence(2),
          corporateHeat(1),
          relationship.distant,
        ],
      },
      {
        text: '일단 포기하고 회의실로 돌아간다.',
        next: 'meeting_room_hub',
        requirements: [visitedMeetingRoom],
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1DeferredFloor3Request' }],
      },
    ],
  },
  groomy_bypass: {
    id: 'chapter-01.groomy_bypass',
    chapterId: 'chapter-01',
    localId: 'groomy_bypass',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    lines: [
      { char: 'groomy', text: '저를 믿는 건 추천하지 않아요.' },
      { char: 'groomy', text: '이번엔 맞는 선택인 것 같아요.' },
      { char: 'groomy', text: '아마.' },
      { char: 'system', text: '로그 복구 중...', isNarration: true },
      { char: 'system', text: `복구된 로그: ${PREDECESSOR_NAME} 03:12 입장. 03:14 퇴장 기록 없음.`, isNarration: true, important: true },
      { char: 'groomy', text: '퇴장 기록이 없는데 사고사는 이상하죠.' },
      { char: 'groomy', text: '03:14에는 문이 열렸어요.' },
      { char: 'groomy', text: '닫힌 기록은 없고요.' },
      { char: 'iseol', text: '그 시간, 나도 깨어 있었어.' },
    ],
    choices: [
      {
        text: '비상계단 화면으로 전환한다.',
        next: 'floor3_vn',
        requirements: [visitedMeetingRoom],
        effects: [{ type: EffectTypes.ADD_ITEM, item: 'floor3EntryLog' }, evidence(2)],
      },
      {
        text: '비상계단 화면으로 전환한다.',
        next: 'floor3_access_denied_bypass',
        requirements: [needsMeetingRoom],
      },
    ],
  },
  direct_card_auth: {
    id: 'chapter-01.direct_card_auth',
    chapterId: 'chapter-01',
    localId: 'direct_card_auth',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'system', text: `${SESSION_EMP_ID} 인증 성공. 이전 사용자 권한으로 접근합니다.`, isNarration: true, important: true },
      { char: 'system', text: '경고: 임시 사번 매핑이 활성 상태입니다.', isNarration: true },
      { char: 'groomy', text: '그 카드를 그렇게 쓰면 회사는 당신을 전임자로 봐요.' },
      { char: 'groomy', text: '저도 잠깐 그렇게 봤고요.' },
      { char: 'groomy', text: '지금도.' },
      { char: 'groomy', text: '아마.' },
    ],
    choices: [
      {
        text: '비상계단 화면으로 전환한다.',
        next: 'floor3_vn',
        requirements: [visitedMeetingRoom],
        effects: [{ type: EffectTypes.ADD_ITEM, item: 'floor3EntryLog' }, evidence(2)],
      },
      {
        text: '비상계단 화면으로 전환한다.',
        next: 'floor3_access_denied_bypass',
        requirements: [needsMeetingRoom],
      },
    ],
  },
  floor3_vn: {
    id: 'chapter-01.floor3_vn',
    chapterId: 'chapter-01',
    localId: 'floor3_vn',
    mode: SceneModes.VN,
    emotion: 'warning',
    important: true,
    requirements: [visitedMeetingRoom],
    lines: [
      { char: 'system', text: '-- 3층 비상계단 기록 --', isNarration: true },
      { char: 'system', text: '화면 가장자리에 보정 레이어 글리치가 겹친다.', isNarration: true, important: true },
      { char: 'system', text: `화면 속 ${PREDECESSOR_NAME}은 문 앞에서 멈춘다.`, isNarration: true },
      { char: 'system', text: '그의 손에는 당신이 가진 것과 같은 사원증이 있다.', isNarration: true, important: true },
      { char: 'unknown', text: '문 열어. 그루미 배터리 규격은 네가 제일 잘 알잖아.' },
      { char: 'system', text: '발신자 표시가 깨진 뒤, 채널명만 GROOMY로 남는다.', isNarration: true },
      { char: 'groomy', text: '...' },
      { char: 'groomy', text: '제 이름이 아니에요.' },
      { char: 'groomy', text: '그래도 제 목소리 같아요.' },
    ],
    next: 'floor3_hub',
  },
  clue_blood: {
    id: 'chapter-01.clue_blood',
    chapterId: 'chapter-01',
    localId: 'clue_blood',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '계단 모서리의 갈색 얼룩은 청소 기록보다 오래됐다.', isNarration: true, important: true },
      { char: 'system', text: '공식 사고 보고서에는 “미끄러짐”만 적혀 있다.', isNarration: true },
      { char: 'groomy', text: '청소는 했어요.' },
      { char: 'groomy', text: '기록은 못 지운 것 같아요.' },
      { char: 'iseol', text: '사진 찍지 마. 찍으면 너도 기록에 남아.' },
    ],
    choices: [
      {
        text: '그래도 샘플을 챙긴다.',
        next: 'floor3_hub',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1FoundStairwellBloodTrace' },
          { type: EffectTypes.ADD_ITEM, item: 'bloodTrace' },
          evidence(1),
          corporateHeat(1),
        ],
      },
      {
        text: '사진 없이 위치만 기록한다.',
        next: 'floor3_hub',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1FoundStairwellBloodTrace' }, evidence(1)],
      },
    ],
  },
  clue_camera: {
    id: 'chapter-01.clue_camera',
    chapterId: 'chapter-01',
    localId: 'clue_camera',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '꺼진 CCTV에는 전원 케이블 대신 데이터 케이블이 빠져 있다.', isNarration: true },
      { char: 'system', text: '메모리 슬롯에 “PATCH_DESYNC 03:14”가 새겨 있다.', isNarration: true, important: true },
      { char: 'iseol', text: '고장이 아니라 누가 영상을 끊은 거예요.' },
      { char: 'groomy', text: '끊은 사람은 로그를 남기지 않아요.' },
      { char: 'groomy', text: '남기는 사람만 남고요.' },
    ],
    choices: [
      {
        text: '메모를 단서로 저장한다.',
        next: 'floor3_hub',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1FoundDisabledCamera' },
          { type: EffectTypes.ADD_ITEM, item: 'cameraMemo' },
          evidence(1),
          corporateHeat(1),
        ],
      },
      {
        text: '장비는 건드리지 않는다.',
        next: 'floor3_hub',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1FoundDisabledCamera' }, evidence(1)],
      },
    ],
  },
  exit_floor3: {
    id: 'chapter-01.exit_floor3',
    chapterId: 'chapter-01',
    localId: 'exit_floor3',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: `비상구 잠금 장치에는 ${PREDECESSOR_NAME}의 마지막 인증 시간이 남아 있다.`, isNarration: true, important: true },
      { char: 'system', text: '퇴장 기록은 없고, 문 손잡이만 안쪽에서 잠겨 있다.', isNarration: true },
      { char: 'groomy', text: '이제 결론을 피하기 어렵겠네요.' },
      { char: 'groomy', text: '피하고 싶으면.' },
      { char: 'groomy', text: '아직 선택지가 하나 남아 있어요.' },
    ],
    choices: [
      {
        text: '추론 채팅으로 넘어간다.',
        next: 'deduction_chat',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1ReachedFloor3Exit' }, evidence(1)],
      },
      {
        text: '3층 허브에서 혈흔을 더 본다.',
        next: 'floor3_hub',
        requirements: [visitedMeetingRoom],
      },
    ],
  },
  deduction_chat: {
    id: 'chapter-01.deduction_chat',
    chapterId: 'chapter-01',
    localId: 'deduction_chat',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'iseol', text: '이건 공식 사고 기록에 없었어요.' },
      { char: 'groomy', text: '공식 기록은 사망자를 조용하게 만들기 위해 존재하니까요.' },
      { char: 'groomy', text: '첫날 결론은 크게 세 가지예요.' },
      { char: 'groomy', text: '살인.' },
      { char: 'groomy', text: '배터리.' },
      { char: 'groomy', text: '보류.' },
      { char: 'groomy', text: '자, 골라요.' },
    ],
    choices: [
      {
        text: `${PREDECESSOR_NAME}은 사고로 죽지 않았다.`,
        next: 'chapter_end',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1ConcludedMurderLikely' },
          { type: EffectTypes.ADD_ITEM, item: 'murderInference' },
          evidence(2),
        ],
      },
      {
        text: '그루미의 배터리가 사건의 핵심이다.',
        next: 'chapter_end',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1SuspectsGroomyBattery' },
          { type: EffectTypes.ADD_ITEM, item: 'groomyBatteryLead' },
          evidence(2),
          batteryPressure(1),
          relationship.distant,
        ],
      },
      {
        text: '아직 판단하지 않는다.',
        next: 'chapter_end',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1WithheldDeduction' },
          relationship.close,
        ],
      },
    ],
  },
  chapter_end: {
    id: 'chapter-01.chapter_end',
    chapterId: 'chapter-01',
    localId: 'chapter_end',
    mode: SceneModes.END,
    title: '첫 번째 날',
    nextChapterId: 'chapter-02',
    end: { type: 'chapterComplete', nextChapterId: 'chapter-02' },
  },
}

const MEETING_ROOM_CHAT_SCENES = new Set([
  'meeting_entry',
  'meeting_room_hub',
  'meeting_chat',
  'flavor_whiteboard',
  'flavor_projector',
  'flavor_window',
  'flavor_choi_seat',
  'flavor_kim_seat',
])

function resolveChapter01ChatWallpaperAssetId(scene) {
  if (scene.emotion === 'warning') return 'overlay_glitch_soft'
  if (scene.chatTheme?.wallpaperAssetId) return scene.chatTheme.wallpaperAssetId
  if (MEETING_ROOM_CHAT_SCENES.has(scene.localId)) return 'bg_meeting_room'
  if (scene.returnTo === 'meeting_room_hub') return 'bg_meeting_room'
  return 'bg_default_office'
}

function buildInvestigationHubScene(hub) {
  const spotChoices = hub.spots.map((spot) => ({
    text: `📍 ${spot.label}`,
    next: spot.sceneId,
  }))
  const navChoices = hub.leave
    ? [{ text: `← ${hub.leave.label}`, next: hub.leave.sceneId }]
    : []

  return {
    id: `chapter-01.${hub.hubSceneId}`,
    chapterId: 'chapter-01',
    localId: hub.hubSceneId,
    mode: SceneModes.CHAT,
    emotion: hub.emotion ?? 'neutral',
    systemMessage: hub.systemMessage,
    ...(hub.wallpaperAssetId
      ? { chatTheme: { wallpaperAssetId: hub.wallpaperAssetId } }
      : {}),
    lines: [
      { char: 'system', text: `[ ${hub.floorId} · ${hub.label} ]`, isNarration: true },
      { char: 'system', text: hub.ambient, isNarration: true },
      ...(hub.foreshadow ?? []).map((text, index) => ({
        char: 'system',
        text,
        isNarration: true,
        important: hub.hubSceneId === 'floor3_hub' && index === hub.foreshadow.length - 1,
      })),
      { char: 'groomy', text: hub.prompt },
    ],
    choices: [...spotChoices, ...navChoices],
    investigationHub: true,
  }
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
      wallpaperAssetId: resolveChapter01ChatWallpaperAssetId(withLineRefs),
    } : undefined,
  }
  if (withLineRefs.mode === SceneModes.VN) {
    return {
      ...withTheme,
      vnStage: withLineRefs.vnStage ?? {
        bgId: withLineRefs.localId.includes('floor3') ? 'bg_stairwell_floor3' : 'bg_default_office',
        overlayId: withLineRefs.emotion === 'warning' ? 'overlay_glitch_soft' : 'overlay_scanline',
        characters: [],
      },
    }
  }
  return withTheme
}

const investigationHubScenes = Object.fromEntries(
  Object.values(chapter01InvestigationHubs).map((hub) => {
    const scene = buildInvestigationHubScene(hub)
    const withRefs = addSceneRefs(scene)
    if (hub.hubSceneId === 'floor3_hub') {
      return [
        hub.hubSceneId,
        {
          ...withRefs,
          requirements: [visitedMeetingRoom],
        },
      ]
    }
    return [hub.hubSceneId, withRefs]
  }),
)

export const chapter01Scenes = {
  ...Object.fromEntries(
    Object.entries(rawChapter01Scenes).map(([localId, scene]) => [localId, addSceneRefs(scene)]),
  ),
  ...investigationHubScenes,
}
