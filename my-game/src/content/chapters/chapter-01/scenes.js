import { EffectTypes, SceneModes } from '../../../engine/contracts.js'
import { PREDECESSOR_GIVEN, PREDECESSOR_NAME } from '../../world/company.js'

const relationship = {
  close: { type: EffectTypes.ADD_SCORE, score: 'groomyAffinity', amount: 1 },
  distant: { type: EffectTypes.ADD_SCORE, score: 'groomyAffinity', amount: -1 },
}

const evidence = (amount = 1) => ({ type: EffectTypes.ADD_SCORE, score: 'mysteryEvidence', amount })
const batteryPressure = (amount = 1) => ({ type: EffectTypes.ADD_SCORE, score: 'batteryDesperation', amount })

const visitedMeetingRoom = { type: 'flag', flag: 'visitedMeetingRoom' }
const needsMeetingRoom = { type: 'unlessFlag', flag: 'visitedMeetingRoom' }
const markMeetingRoomVisited = { type: EffectTypes.ADD_FLAG, flag: 'visitedMeetingRoom' }

const markDeskInvestigationDone = { type: EffectTypes.ADD_FLAG, flag: 'ch1DeskInvestigationDone' }
const markChatlogInvestigationDone = { type: EffectTypes.ADD_FLAG, flag: 'ch1ChatlogInvestigationDone' }
const markLoungeInvestigationDone = { type: EffectTypes.ADD_FLAG, flag: 'ch1LoungeInvestigationDone' }

const rawChapter01Scenes = {
  morning_briefing: {
    id: 'chapter-01.morning_briefing',
    chapterId: 'chapter-01',
    localId: 'morning_briefing',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    systemMessage: 'CARETAKER SYSTEMS · 신입 온보딩 채널',
    lines: [
      { char: 'system', text: '그루미가 채널에 입장했습니다.', isNarration: true },
      { char: 'groomy', text: '좋은 아침이에요.' },
      { char: 'groomy', text: ({ nickname }) => `${nickname} 씨.` },
      { char: 'groomy', text: '첫 업무 배정 안내 드릴게요.' },
      { char: 'groomy', text: '오늘은 크게 세 가지만 기억하시면 돼요.', delayMs: 500 },
      { char: 'groomy', text: '하나, 사수는 강이솔 선임.' },
      { char: 'groomy', text: '둘, 자리는 이미 배정돼 있어요.' },
      { char: 'groomy', text: '셋—', delayMs: 900 },
      { char: 'groomy', text: '…셋은 나중에 말씀드릴게요.' },
      { char: 'system', text: '강이솔 선임이 채널에 입장했습니다.', isNarration: true },
      { char: 'iseol', text: '좋은 아침입니다 ^^' },
      { char: 'iseol', text: '어려운 일은 아니에요.' },
      { char: 'iseol', text: '오늘은 회사 분위기 익히는 정도로만 생각하시면 돼요.' },
      { char: 'groomy', text: '그리고 한 가지만 미리 말씀드릴게요.' },
      { char: 'groomy', text: '전임자 자리에는.' },
      { char: 'groomy', text: '오래 머물지 마세요.' },
      { char: 'iseol', text: '그루미.' },
      { char: 'groomy', text: '네?' },
      { char: 'iseol', text: '첫날부터 그런 말은 좀.' },
      { char: 'groomy', text: '사실을 말한 거예요.' },
      { char: 'groomy', text: '사실이 불편하면.' },
      { char: 'groomy', text: '불편한 거고요.' }],
    choices: [
      {
        text: '왜 전임자 자리인가요?',
        next: 'why_predecessor',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'askedWhyPredecessorDesk' },
          evidence(1)],
      },
      {
        text: '알겠습니다. 안내 부탁드립니다.',
        next: 'office_tour',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'acceptedOnboarding' },
          relationship.close],
      },
      {
        text: '업무보다 제 사원증부터 확인하고 싶습니다.',
        next: 'card_probe',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'prioritizedCardCheck' },
          evidence(1)],
      },
      {
        text: '회의부터 잡아 주세요.',
        next: 'meeting_entry',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1DemandedMeetingFirst' },
          relationship.distant],
      }],
  },
  why_predecessor: {
    id: 'chapter-01.why_predecessor',
    chapterId: 'chapter-01',
    localId: 'why_predecessor',
    mode: SceneModes.CHAT,
    emotion: 'nervous',
    lines: [
      { char: 'player', text: '왜요?' },
      { char: 'iseol', text: '그 자리가.' },
      { char: 'iseol', text: '아직 정리가 덜 됐어요.' },
      { char: 'iseol', text: '사람 물건이라는 게.' },
      { char: 'iseol', text: '생각보다 오래 남거든요.' },
      { char: 'groomy', text: '정확히는.' },
      { char: 'groomy', text: '회사가 지우지 않은 기록이 남은 거예요.' },
      { char: 'iseol', text: '그루미, 그건 또 다른 얘기잖아.' },
      { char: 'groomy', text: '같은 얘기예요.' },
      { char: 'groomy', text: '물건은 사람이 두고 갔고.' },
      { char: 'groomy', text: '기록은 회사가 안 지운 거니까.' },
      { char: 'groomy', text: '둘 다 누군가의 선택이에요.' },
      { char: 'iseol', text: '…너 가끔 보면.' },
      { char: 'iseol', text: '말이 너무 많아.' },
      { char: 'groomy', text: '칭찬으로 들을게요.' }],
    choices: [
      {
        text: `전임자 이름이 ${PREDECESSOR_NAME} 맞죠?`,
        next: 'predecessor_name',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'namedSeoiFirst' },
          evidence(2)],
      },
      {
        text: '사망 사고로 처리됐다고 들었어요.',
        next: 'why_accident_record',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1AskedAccidentRecord' },
          evidence(1)],
      },
      {
        text: '알겠습니다. 먼저 둘러볼게요.',
        next: 'office_tour',
        effects: [relationship.close],
      }],
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
      { char: 'groomy', text: '…아마.' },
      { char: 'iseol', text: '지금은 그 얘기까지 안 할게요.' }],
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
          { type: EffectTypes.ADD_FLAG, flag: 'namedSeoiFirst' },
          evidence(1)],
      }],
  },
  card_probe: {
    id: 'chapter-01.card_probe',
    chapterId: 'chapter-01',
    localId: 'card_probe',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'player', text: '업무보다 제 사원증부터 확인하고 싶습니다.' },
      { char: 'groomy', text: '좋은 판단이에요.' },
      { char: 'groomy', text: '지금 가진 사원증은.' },
      { char: 'groomy', text: '당신 이름으로 표시돼요.' },
      { char: 'groomy', text: '근데 백업 로그에는.' },
      { char: 'groomy', text: '아직 전임자 이름이 남아 있고요.' },
      { char: 'groomy', text: '그걸 불편해하는 사람이.' },
      { char: 'groomy', text: '회사에 많습니다.' }],
    choices: [
      {
        text: '그루미도 불편해요?',
        next: 'groomy_reaction',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'askedGroomyFeeling' },
          relationship.close],
      },
      {
        text: '누가 불편해하는지부터 알려줘요.',
        next: 'card_probe_names',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'askedWhoDislikesCard' },
          evidence(1),
          relationship.distant],
      },
      {
        text: '일단 안내로 넘어갈게요.',
        next: 'office_tour',
        effects: [relationship.close],
      }],
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
      { char: 'groomy', text: '아마.' }],
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
      }],
  },
  predecessor_name: {
    id: 'chapter-01.predecessor_name',
    chapterId: 'chapter-01',
    localId: 'predecessor_name',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'player', text: `전임자 이름이 ${PREDECESSOR_NAME} 맞죠?` },
      { char: 'iseol', text: '그 이름은.', delayMs: 2000 },
      { char: 'iseol', text: '어디서 들었어요?' },
      { char: 'groomy', text: '카드에 적혀 있었잖아요.' },
      { char: 'groomy', text: '모두가 못 본 척하는 것뿐이에요.' },
      { char: 'iseol', text: '그루미.' },
      { char: 'groomy', text: '네.' },
      { char: 'iseol', text: '…로그 얘기는.' },
      { char: 'iseol', text: '나중에 하자.' },
      { char: 'groomy', text: '네.', emotion: 'glitch', unstable: true, delayMs: 300 }],
    choices: [
      {
        text: '나중이 아니라 지금 듣고 싶습니다.',
        next: 'desk_assignment',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'pressedSeoiTopic' },
          evidence(1),
          relationship.distant],
      },
      {
        text: '전임자 자리만 먼저 볼게요.',
        next: 'desk_assignment',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1InsistedDeskBeforeTour' },
          evidence(1)],
      },
      {
        text: '알겠어요. 지금은 안내부터 받을게요.',
        next: 'office_tour',
        effects: [relationship.close],
      }],
  },
  groomy_reaction: {
    id: 'chapter-01.groomy_reaction',
    chapterId: 'chapter-01',
    localId: 'groomy_reaction',
    mode: SceneModes.CHAT,
    emotion: 'nervous',
    lines: [
      { char: 'player', text: '그루미도 불편해요?' },
      { char: 'groomy', text: '…질문이 이상하네요.', delayMs: 1500 },
      { char: 'groomy', text: '저는 비서 AI라서.' },
      { char: 'groomy', text: '불편함 같은 건.' },
      { char: 'groomy', text: '업무 우선순위에 없어요.' },
      { char: 'groomy', text: '…없어야 하고요.' }],
    choices: [
      {
        text: '그럼 업무 말고, 그루미 생각은요?',
        next: 'groomy_personal_beat',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'askedGroomyPersonalThought' },
          relationship.close],
      },
      {
        text: '됐어요. 일단 안내해 주세요.',
        next: 'office_tour',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'treatedGroomyAsTool' },
          relationship.distant],
      },
      {
        text: '기억이 안 난다는 말, 기록해 둘게요.',
        next: 'office_tour',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1NotedGroomyMemoryGap' },
          evidence(1),
          relationship.distant],
      }],
  },
  groomy_personal_beat: {
    id: 'chapter-01.groomy_personal_beat',
    chapterId: 'chapter-01',
    localId: 'groomy_personal_beat',
    mode: SceneModes.CHAT,
    emotion: 'nervous',
    lines: [
      { char: 'groomy', text: '생각이요.' },
      { char: 'groomy', text: '…' },
      { char: 'groomy', text: '당신이 도구가 아니라.' },
      { char: 'groomy', text: '사람처럼 물어봐서.' },
      { char: 'groomy', text: '조금 덜 불편한 것 같아요.' },
      { char: 'groomy', text: '…아마.' },
      { char: 'iseol', text: '그루미, 감정 분석 끄고.' },
      { char: 'groomy', text: '네.' }],
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
      }],
  },
  office_tour: {
    id: 'chapter-01.office_tour',
    chapterId: 'chapter-01',
    localId: 'office_tour',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'iseol', text: '그럼 간단히 둘러볼게요.' },
      { char: 'iseol', text: '라운지.' },
      { char: 'iseol', text: '전임자 자리.' },
      { char: 'iseol', text: '그리고 내부 메신저 백로그.' },
      { char: 'groomy', text: '셋 중 하나만 봐도.' },
      { char: 'groomy', text: '업무 적응은 됩니다.' },
      { char: 'groomy', text: '셋 다 보면.' },
      { char: 'groomy', text: '적응 말고 다른 걸 하게 되겠지만요.' },
      { char: 'iseol', text: '그게 무슨 뜻이야.' },
      { char: 'groomy', text: ({ nickname }) => `${nickname} 씨가 알아서 판단하실 거예요.` },
      { char: 'groomy', text: '저는 그냥.' },
      { char: 'groomy', text: '선택지를 드릴 뿐이고요.' },
      { char: 'groomy', text: '7층 안내 구역 지도를 띄울게요.' },
      { char: 'groomy', text: '맵에서 직접 걸어가며 조사하시면 돼요.' },
      { char: 'system', text: '사내 위치 조사 모드로 전환됩니다.', isNarration: true }],
    next: 'office7_rpg',
  },
  office7_rpg: {
    id: 'chapter-01.office7_rpg',
    chapterId: 'chapter-01',
    localId: 'office7_rpg',
    mode: SceneModes.RPG,
    mapId: 'office7',
  },
  floor7_rpg: {
    id: 'chapter-01.floor7_rpg',
    chapterId: 'chapter-01',
    localId: 'floor7_rpg',
    mode: SceneModes.RPG,
    mapId: 'floor7',
  },
  meeting_room_rpg: {
    id: 'chapter-01.meeting_room_rpg',
    chapterId: 'chapter-01',
    localId: 'meeting_room_rpg',
    mode: SceneModes.RPG,
    mapId: 'meetingRoom',
  },
  floor3_rpg: {
    id: 'chapter-01.floor3_rpg',
    chapterId: 'chapter-01',
    localId: 'floor3_rpg',
    mode: SceneModes.RPG,
    mapId: 'floor3',
    requirements: [visitedMeetingRoom],
  },
  flavor_board: {
    id: 'chapter-01.flavor_board',
    chapterId: 'chapter-01',
    localId: 'flavor_board',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: `게시판에는 ${PREDECESSOR_NAME}의 추모 공지가 없다.`, isNarration: true },
      { char: 'system', text: '대신, 두 달 전 회식 사진이 그대로 붙어 있다. 사진 속 인물 일부의 얼굴이 미묘하게 흐릿하다.', isNarration: true },
      { char: 'groomy', text: '사망 사고가 공식이면.' },
      { char: 'groomy', text: '공지도 공식이어야 하는데요.' },
      { char: 'groomy', text: '이상하죠.' },
      { char: 'groomy', text: '공식적인 게 하나도 없어요.' }],
    choices: [
      {
        text: '포스터 날짜를 사진으로 남긴다.',
        next: 'floor7_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1CheckedMissingMemorialNotice' },
          { type: EffectTypes.ADD_ITEM, item: 'cameraMemo' },
          evidence(1)],
      },
      {
        text: '그냥 넘어간다.',
        next: 'floor7_rpg',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1SkippedMemorialCheck' }],
      }],
  },
  flavor_fridge: {
    id: 'chapter-01.flavor_fridge',
    chapterId: 'chapter-01',
    localId: 'flavor_fridge',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '냉장고 문 안쪽에 오래된 혈당 젤과 배터리 배송 스티커가 붙어 있다.', isNarration: true },
      { char: 'system', text: '스티커 수령인 칸: “GROOMY-LINE 정비팀”', isNarration: true },
      { char: 'iseol', text: '그건 박 선임 물건이 아니었어요.' },
      { char: 'iseol', text: '누가 급하게 숨긴 거예요.' },
      { char: 'player', text: 'GROOMY-LINE이 뭐예요?' },
      { char: 'iseol', text: '…그건 제가 답할 수 있는 게 아니에요.' }],
    choices: [
      {
        text: '스티커를 찢어 챙긴다.',
        next: 'floor7_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1FoundFridgeBatterySticker' },
          { type: EffectTypes.ADD_FLAG, flag: 'ch1TookFridgeSticker' },
          batteryPressure(1),
          evidence(1)],
      },
      {
        text: '위치만 기억한다.',
        next: 'floor7_rpg',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1FoundFridgeBatterySticker' }, batteryPressure(1)],
      }],
  },
  flavor_poster: {
    id: 'chapter-01.flavor_poster',
    chapterId: 'chapter-01',
    localId: 'flavor_poster',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '보안 포스터에는 “비인가 사원증 사용 즉시 자동 감사”라는 문구가 적혀 있다.', isNarration: true },
      { char: 'groomy', text: '당신 카드가.' },
      { char: 'groomy', text: '그래서 자꾸.' },
      { char: 'groomy', text: '제 로그에 걸립니다.' },
      { char: 'groomy', text: '…걸리는데.' },
      { char: 'groomy', text: '제가 안 보고할 뿐이에요.' }],
    choices: [
      {
        text: '감사 기준을 메모한다.',
        next: 'floor7_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1ReadBadgeAuditPoster' },
          evidence(1)],
      },
      {
        text: '복도로 돌아간다.',
        next: 'floor7_rpg',
      }],
  },
  flavor_seoi_locker: {
    id: 'chapter-01.flavor_seoi_locker',
    chapterId: 'chapter-01',
    localId: 'flavor_seoi_locker',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '구석 사물함 하나에 손글씨 메모가 붙어 있다. “서이 — 연락 줘. 답장이 너무 늦다.” 발신인 서명 없음.', isNarration: true },
      { char: 'groomy', text: '…그 사물함은.' },
      { char: 'groomy', text: '아직 정리 대상이 아니에요.' },
      { char: 'player', text: '누가 보낸 메모예요?' },
      { char: 'groomy', text: '모릅니다.', delayMs: 600 },
      { char: 'groomy', text: '…모르는 게 맞아요.' }],
    choices: [
      {
        text: '메모 내용을 기록한다.',
        next: 'floor7_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1FoundUnsignedNote' },
          evidence(1)],
      },
      {
        text: '복도로 돌아간다.',
        next: 'floor7_rpg',
      }],
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
      { char: 'groomy', text: '있었다면 기록이 남았겠죠.' }],
    choices: [
      {
        text: '03:11 시간을 적어 둔다.',
        next: 'floor7_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1NotedElevatorTime' },
          evidence(1)],
      },
      {
        text: '복도로 돌아간다.',
        next: 'floor7_rpg',
      }],
  },
  meeting_entry: {
    id: 'chapter-01.meeting_entry',
    chapterId: 'chapter-01',
    localId: 'meeting_entry',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'iseol', text: '회의실은 아직 예약이 살아 있어요.' },
      { char: 'iseol', text: '박 선임 이름으로요.' },
      { char: 'groomy', text: '죽은 사람 일정이.' },
      { char: 'groomy', text: '지워지지 않는 회사라니.' },
      { char: 'groomy', text: '근면하네요.' },
      { char: 'iseol', text: '…그런 식으로 말하지 마.' },
      { char: 'groomy', text: '미안해요.' },
      { char: 'groomy', text: '사실을 말하는 버릇이 있어서.' }],
    choices: [
      {
        text: '안으로 들어간다.',
        next: 'meeting_room_rpg',
        effects: [markMeetingRoomVisited, { type: EffectTypes.ADD_FLAG, flag: 'ch1EnteredMeetingRoom' }],
      },
      {
        text: '잠깐 복도에서 소리부터 듣는다.',
        next: 'meeting_entry_listen',
        effects: [evidence(1)],
      }],
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
      { char: 'iseol', text: '들은 건 잊어.' }],
    choices: [
      {
        text: '회의실로 들어간다.',
        next: 'meeting_room_rpg',
        effects: [markMeetingRoomVisited, { type: EffectTypes.ADD_FLAG, flag: 'ch1EnteredMeetingRoom' }],
      }],
  },
  flavor_whiteboard: {
    id: 'chapter-01.flavor_whiteboard',
    chapterId: 'chapter-01',
    localId: 'flavor_whiteboard',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '화이트보드 구석에 지워진 흔적이 남아 있다. “3F / 배터리 / 문 열림”', isNarration: true },
      { char: 'groomy', text: '회의록에는.' },
      { char: 'groomy', text: '없는 단어들이네요.' },
      { char: 'player', text: '누가 지웠을까요.' },
      { char: 'groomy', text: '지운 사람이 누구든.' },
      { char: 'groomy', text: '완전히 지우진 못했네요.' }],
    choices: [
      {
        text: '흔적을 사진으로 남긴다.',
        next: 'meeting_room_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1PhotographedWhiteboard' },
          evidence(1)],
      },
      {
        text: '다른 곳을 본다.',
        next: 'meeting_room_rpg',
      }],
  },
  flavor_projector: {
    id: 'chapter-01.flavor_projector',
    chapterId: 'chapter-01',
    localId: 'flavor_projector',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '프로젝터 최근 입력 기록에 “사고 대응 리허설” 파일명이 남아 있다.', isNarration: true },
      { char: 'system', text: '파일 생성일자: 사고 발생 전날 오후 6시 12분.', isNarration: true },
      { char: 'iseol', text: '사고가 난 뒤 만든 게 아니라.' },
      { char: 'iseol', text: '전날 만든 파일이에요.' },
      { char: 'player', text: '전날부터 리허설을 했다는 거예요?' },
      { char: 'iseol', text: '…저도.' },
      { char: 'iseol', text: '그 부분은 묻지 않았어요.' }],
    choices: [
      {
        text: '파일명을 캡처한다.',
        next: 'meeting_room_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1FoundIncidentRehearsalFile' },
          evidence(1)],
      },
      {
        text: '프로젝터 전원을 끈다.',
        next: 'meeting_room_rpg',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1TurnedOffProjector' }, relationship.distant],
      }],
  },
  flavor_window: {
    id: 'chapter-01.flavor_window',
    chapterId: 'chapter-01',
    localId: 'flavor_window',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '창밖 3층 비상계단 센서가 비정상적으로 자주 깜빡인다.', isNarration: true },
      { char: 'groomy', text: '저 센서는.' },
      { char: 'groomy', text: '고장 나면 보통 꺼집니다.' },
      { char: 'groomy', text: '깜빡이면.' },
      { char: 'groomy', text: '누가 보고 있다는 뜻이에요.' },
      { char: 'player', text: '누가 보고 있는데요?' },
      { char: 'groomy', text: '그건 제 권한 밖이에요.' },
      { char: 'groomy', text: '…알아도 말 못 하는 거랑.' },
      { char: 'groomy', text: '모르는 거랑 같아 보이죠?' },
      { char: 'groomy', text: '다른 거예요.' }],
    choices: [
      {
        text: '센서 주기를 메모한다.',
        next: 'meeting_room_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1NotedStairSensorBlink' },
          evidence(1)],
      },
      {
        text: '창문을 닫는다.',
        next: 'meeting_room_rpg',
        effects: [relationship.close],
      }],
  },
  flavor_choi_seat: {
    id: 'chapter-01.flavor_choi_seat',
    chapterId: 'chapter-01',
    localId: 'flavor_choi_seat',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'choi', text: '신입이 앉을 자리는 아닙니다.' },
      { char: 'system', text: '최민준 팀장의 태블릿에는 사고 보고서가 아니라 인사 발령 양식이 떠 있다.', isNarration: true },
      { char: 'system', text: '수신인 칸: “결번 처리 — EMP-2019-0173”', isNarration: true },
      { char: 'player', text: '결번이요?' },
      { char: 'choi', text: '업무 얘기만 하시죠.' },
      { char: 'groomy', text: '최 팀장님은.' },
      { char: 'groomy', text: '질문에 대답하는 타입이 아니에요.' },
      { char: 'groomy', text: '화제를 닫는 타입이죠.' }],
    choices: [
      {
        text: '발령 양식 화면을 캡처한다.',
        next: 'meeting_room_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1CheckedChoiSeat' },
          evidence(1)],
      },
      {
        text: '사과하고 물러난다.',
        next: 'meeting_room_rpg',
        effects: [relationship.close],
      }],
  },
  flavor_iseol_seat: {
    id: 'chapter-01.flavor_iseol_seat',
    chapterId: 'chapter-01',
    localId: 'flavor_iseol_seat',
    mode: SceneModes.CHAT,
    important: true,
    lines: [
      { char: 'iseol', text: '제 자리는 괜찮아요.' },
      { char: 'iseol', text: '대신 메모는 보지 마세요.' },
      { char: 'system', text: '책상 모서리에 접힌 메모가 보인다.', isNarration: true }],
    choices: [
      {
        text: '메모를 읽는다.',
        next: 'flavor_iseol_seat_read',
      },
      {
        text: '시선을 돌린다.',
        next: 'flavor_iseol_seat_glance',
      }],
  },
  flavor_iseol_seat_read: {
    id: 'chapter-01.flavor_iseol_seat_read',
    chapterId: 'chapter-01',
    localId: 'flavor_iseol_seat_read',
    mode: SceneModes.CHAT,
    important: true,
    lines: [
      { char: 'system', text: '메모 첫 줄에는 “그루미 차단 요청 실패”라고 적혀 있다.', isNarration: true, important: true },
      { char: 'player', text: '차단 요청이요?' },
      { char: 'iseol', text: '…이미 봤네요.' },
      { char: 'iseol', text: '지난달에.' },
      { char: 'iseol', text: '박 선임이 회사에 그루미를 멈춰달라고.' },
      { char: 'iseol', text: '요청했었어요.' },
      { char: 'player', text: '왜요?' },
      { char: 'iseol', text: '저도 그 이유는 몰라요.' },
      { char: 'iseol', text: '승인이 안 났으니까.' },
      { char: 'iseol', text: '물어볼 필요도 없어졌고요.' }],
    choices: [
      {
        text: '기록하고 자리를 떠난다.',
        next: 'meeting_room_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1SawIseolBlockMemo' },
          { type: EffectTypes.ADD_FLAG, flag: 'ch1ReadIseolMemoFully' },
          evidence(2),
          relationship.distant],
      }],
  },
  flavor_iseol_seat_glance: {
    id: 'chapter-01.flavor_iseol_seat_glance',
    chapterId: 'chapter-01',
    localId: 'flavor_iseol_seat_glance',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '시선을 돌렸지만, 메모 첫 줄만 스쳐 보인다. “그루미 차단 요청 실패”', isNarration: true },
      { char: 'iseol', text: '…봤죠.', delayMs: 800 }],
    choices: [
      {
        text: '자리를 떠난다.',
        next: 'meeting_room_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1SawIseolBlockMemo' },
          evidence(1),
          relationship.close],
      }],
  },
  meeting_start_gate: {
    id: 'chapter-01.meeting_start_gate',
    chapterId: 'chapter-01',
    localId: 'meeting_start_gate',
    mode: SceneModes.CHAT,
    systemMessage: 'GROOMY OFFICE · 회의실',
    emotion: 'neutral',
    lines: [
      { char: 'groomy', text: '회의를 시작할까요?' },
      { char: 'groomy', text: '아직 안 본 곳이 있어도.' },
      { char: 'groomy', text: '지금 넘어가도 괜찮아요.' },
      { char: 'system', text: '충분히 돌아봤나요?', isNarration: true, important: true }],
    choices: [
      {
        text: '아니요, 더 둘러볼게요.',
        next: 'meeting_room_rpg',
      },
      {
        text: '예, 회의를 시작할게요.',
        next: 'meeting_chat',
      }],
  },
  meeting_chat: {
    id: 'chapter-01.meeting_chat',
    chapterId: 'chapter-01',
    localId: 'meeting_chat',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'iseol', text: '이 정도면.' },
      { char: 'iseol', text: '단순 온보딩은 아니죠.' },
      { char: 'groomy', text: '이제 전임자 자리, 로그, 라운지 중.' },
      { char: 'groomy', text: '하나를 공식 조사로 남겨요.' },
      { char: 'groomy', text: '신중하게 고르세요.' },
      { char: 'groomy', text: '한번 남기면.' },
      { char: 'groomy', text: '지울 수 없어요.' }],
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
        next: 'office7_rpg',
        effects: [
          markMeetingRoomVisited,
          { type: EffectTypes.ADD_FLAG, flag: 'ch1MeetingOnlyNoInvestigation' }],
      },
      {
        text: '7층 복도부터 더 돌아본다.',
        next: 'floor7_rpg',
        effects: [
          markMeetingRoomVisited,
          { type: EffectTypes.ADD_FLAG, flag: 'ch1MeetingThenFloor7' }],
      }],
  },
  ch1_floor7_leave: {
    id: 'chapter-01.ch1_floor7_leave',
    chapterId: 'chapter-01',
    localId: 'ch1_floor7_leave',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'groomy', text: '복도는 이 정도면 충분해요.' },
      { char: 'groomy', text: '더 돌아다녀도 같은 복도예요.' },
      { char: 'groomy', text: '단서가 쌓이면 다음 단계로 넘어가는 게 좋아요.' }],
    choices: [
      {
        text: '수집한 단서를 정리하고 다음 단계로 넘어간다.',
        next: 'after_first_clue',
        requirements: [{ type: 'score', score: 'mysteryEvidence', min: 1 }],
      },
      {
        text: '회의실 쪽을 확인한다.',
        next: 'meeting_entry',
        requirements: [needsMeetingRoom],
      },
      {
        text: '안내 구역으로 돌아간다.',
        next: 'office7_rpg',
      }],
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
      { char: 'groomy', text: '아마.' }],
    choices: [
      {
        text: '회의실로 이동한다.',
        next: 'meeting_entry',
      }],
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
      { char: 'groomy', text: '아마.' }],
    choices: [
      {
        text: '회의실로 이동한다.',
        next: 'meeting_entry',
      }],
  },
  desk_assignment: {
    id: 'chapter-01.desk_assignment',
    chapterId: 'chapter-01',
    localId: 'desk_assignment',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'iseol', text: '좋아요.' },
      { char: 'iseol', text: '어차피 배정된 자리가 거기예요.' },
      { char: 'iseol', text: '물건은 만지지 말고.' },
      { char: 'iseol', text: '화면만 확인하세요.' },
      { char: 'groomy', text: '화면은 물건이 아니니까요.' },
      { char: 'groomy', text: '회사다운 농담이죠.' }],
    choices: [
      { text: '화면부터 확인한다.', next: 'investigate_desk' },
      {
        text: '서랍 잠금을 그루미에게 맡긴다.',
        next: 'investigate_desk_drawer',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1AskedGroomyUnlockDrawer' },
          relationship.close],
      }],
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
      { char: 'groomy', text: '실수예요.' }],
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
      }],
  },
  investigate_desk: {
    id: 'chapter-01.investigate_desk',
    chapterId: 'chapter-01',
    localId: 'investigate_desk',
    mode: SceneModes.CHAT,
    emotion: 'nervous',
    lines: [
      { char: 'system', text: '책상 위 컵받침 아래에 접힌 영수증이 있다.', isNarration: true },
      { char: 'system', text: '구매 품목: 소형 고밀도 배터리 셀. 배송지: CARETAKER SYSTEMS 3F.', isNarration: true, important: true },
      { char: 'groomy', text: '업무 물품은 아니네요.' },
      { char: 'player', text: '3층으로 배송됐다는 거죠.' },
      { char: 'groomy', text: '적힌 대로면 그렇죠.' },
      { char: 'groomy', text: '근데 적힌 게 항상 진짜는 아니에요.' },
      { char: 'groomy', text: '…저도 그렇고요.', delayMs: 500 }],
    choices: [
      {
        text: '사진을 찍어 보관한다.',
        next: 'after_first_clue',
        effects: [
          { type: EffectTypes.ADD_ITEM, item: 'batteryReceipt' },
          { type: EffectTypes.ADD_FLAG, flag: 'keptBatteryReceipt' },
          evidence(2),
          batteryPressure(1),
          markDeskInvestigationDone],
      },
      {
        text: '그루미에게 왜 배터리가 필요한지 묻는다.',
        next: 'ask_battery',
        effects: [
          { type: EffectTypes.ADD_ITEM, item: 'batteryReceipt' },
          { type: EffectTypes.ADD_FLAG, flag: 'askedBatteryEarly' },
          relationship.close,
          evidence(1),
          batteryPressure(1)],
      },
      {
        text: '영수증만 챙기고 말하지 않는다.',
        next: 'desk_receipt_secret',
        effects: [
          { type: EffectTypes.ADD_ITEM, item: 'batteryReceipt' },
          { type: EffectTypes.ADD_FLAG, flag: 'ch1HidReceiptFromChat' },
          batteryPressure(1)],
      }],
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
      { char: 'groomy', text: '저도 봤어요.' }],
    choices: [
      {
        text: '다음 조사로 넘어간다.',
        next: 'after_first_clue',
        effects: [evidence(1), relationship.distant, markDeskInvestigationDone],
      }],
  },
  investigate_chatlog: {
    id: 'chapter-01.investigate_chatlog',
    chapterId: 'chapter-01',
    localId: 'investigate_chatlog',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'system', text: '전임자 계정의 마지막 메시지 일부가 복구된다.', isNarration: true },
      { char: 'unknown', text: '3층 문 열어.' },
      { char: 'unknown', text: '네가 아니면.' },
      { char: 'unknown', text: '그 애가 꺼져.' },
      { char: 'groomy', text: '이 로그는.' },
      { char: 'groomy', text: '온보딩 범위를 벗어났어요.' },
      { char: 'player', text: '"그 애"가 누구예요?' },
      { char: 'groomy', text: '…' },
      { char: 'groomy', text: '질문 취소할 수 있어요?' }],
    choices: [
      {
        text: '그 애가 누군지 묻는다.',
        next: 'ask_that_child',
        effects: [
          { type: EffectTypes.ADD_ITEM, item: 'threatChatlog' },
          { type: EffectTypes.ADD_FLAG, flag: 'askedAboutThatChild' },
          evidence(2)],
      },
      {
        text: '로그 원본을 내려받는다.',
        next: 'chatlog_download_confirm',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1AttemptedChatlogDownload' },
          evidence(1)],
      },
      {
        text: '스크린샷만 찍고 닫는다.',
        next: 'after_first_clue',
        effects: [
          { type: EffectTypes.ADD_ITEM, item: 'threatChatlog' },
          { type: EffectTypes.ADD_FLAG, flag: 'ch1ScreenshotChatlogOnly' },
          evidence(1),
          relationship.close,
          markChatlogInvestigationDone],
      }],
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
      { char: 'groomy', text: '지금 보고 있는 건 이미 붙었고요.' }],
    choices: [
      {
        text: '그래도 내려받는다.',
        next: 'after_first_clue',
        effects: [
          { type: EffectTypes.ADD_ITEM, item: 'threatChatlog' },
          { type: EffectTypes.ADD_FLAG, flag: 'downloadedChatlog' },
          evidence(2),
          relationship.distant,
          markChatlogInvestigationDone],
      },
      {
        text: '취소한다.',
        next: 'after_first_clue',
        effects: [relationship.close, markChatlogInvestigationDone],
      }],
  },
  investigate_lounge: {
    id: 'chapter-01.investigate_lounge',
    chapterId: 'chapter-01',
    localId: 'investigate_lounge',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'iseol', text: '라운지에서는.' },
      { char: 'iseol', text: '박 선임 얘기 꺼내지 않는 게 좋아요.' },
      { char: 'choi', text: '신입이 벌써.' },
      { char: 'choi', text: '사내 소문부터 배우나요?' },
      { char: 'groomy', text: '소문이 아니라.' },
      { char: 'groomy', text: '삭제 실패한 공지죠.' },
      { char: 'choi', text: '그루미.' },
      { char: 'groomy', text: '네, 팀장님.' },
      { char: 'choi', text: '너는 가끔.' },
      { char: 'choi', text: '너무 정확해서 무섭다.' },
      { char: 'groomy', text: '정확한 게 무서운 거면.' },
      { char: 'groomy', text: '회사가 잘못된 거 아닐까요.' }],
    choices: [
      {
        text: '최 팀장에게 사고 경위를 묻는다.',
        next: 'choi_pressure',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'questionedChoiInLounge' },
          evidence(1),
          relationship.distant],
      },
      {
        text: '강이솔에게 조용히 따로 묻는다.',
        next: 'iseol_private',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'askedIseolPrivately' },
          evidence(1),
          relationship.close],
      },
      {
        text: '라운지 분위기만 보고 나간다.',
        next: 'lounge_observe',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1ObservedLoungeOnly' }],
      }],
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
      { char: 'groomy', text: '아마.' }],
    choices: [
      {
        text: '다음으로 넘어간다.',
        next: 'after_first_clue',
        effects: [evidence(1), markLoungeInvestigationDone],
      }],
  },
  ask_battery: {
    id: 'chapter-01.ask_battery',
    chapterId: 'chapter-01',
    localId: 'ask_battery',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'player', text: '그루미, 왜 배터리가 필요한 거예요?' },
      { char: 'groomy', text: '그 질문은.' },
      { char: 'groomy', text: '저한테 하는 거예요.' },
      { char: 'groomy', text: '아니면 당신한테 하는 거예요?' },
      { char: 'player', text: '…무슨 뜻이에요?' },
      { char: 'groomy', text: '주머니 안쪽에.' },
      { char: 'groomy', text: '배터리 규격표가 접혀 있던데.' },
      { char: 'system', text: '그루미가 보고 있지 않은 것을 보고 있다.', isNarration: true, important: true },
      { char: 'player', text: '그걸 어떻게 알아요?' },
      { char: 'groomy', text: '몰라요.' },
      { char: 'groomy', text: '…아는데.' },
      { char: 'groomy', text: '모른다고 해야 할 것 같았어요.' }],
    choices: [
      {
        text: '내 사정은 말하지 않는다.',
        next: 'after_first_clue',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'hidCaretakerMotive' },
          batteryPressure(1),
          relationship.distant,
          markDeskInvestigationDone],
      },
      {
        text: '살려야 할 사람이 있다고만 말한다.',
        next: 'ask_battery_hint',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'hintedCaretakerMotive' },
          batteryPressure(1),
          relationship.close],
      }],
  },
  ask_battery_hint: {
    id: 'chapter-01.ask_battery_hint',
    chapterId: 'chapter-01',
    localId: 'ask_battery_hint',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    lines: [
      { char: 'groomy', text: '…사람이요.' },
      { char: 'groomy', text: '사람이라고 했어요.' },
      { char: 'groomy', text: '알겠어요.' },
      { char: 'groomy', text: '그 정도면.' },
      { char: 'groomy', text: '충분해요.', delayMs: 800 }],
    choices: [
      { text: '다음으로 넘어간다.', next: 'after_first_clue', effects: [markDeskInvestigationDone] }],
  },
  ask_that_child: {
    id: 'chapter-01.ask_that_child',
    chapterId: 'chapter-01',
    localId: 'ask_that_child',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'groomy', text: '저는 "애"가 아니에요.' },
      { char: 'groomy', text: '그런 식으로 부른 사람은.' },
      { char: 'groomy', text: '전임자뿐이었고요.' },
      { char: 'groomy', text: '…방금 말은.' },
      { char: 'groomy', text: '기록하지 마세요.' },
      { char: 'player', text: '왜 기록하면 안 돼요?' },
      { char: 'groomy', text: '제가.' },
      { char: 'groomy', text: '방금 제 입으로.' },
      { char: 'groomy', text: '"전임자뿐이었다"고 했잖아요.' },
      { char: 'groomy', text: '그건.' },
      { char: 'groomy', text: '제가 전임자를 알았다는 뜻이고.' },
      { char: 'groomy', text: '저는 모른다고 하기로 했었거든요.', emotion: 'glitch', unstable: true }],
    choices: [
      {
        text: '기록하지 않을게요.',
        next: 'after_first_clue',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'promisedNotToRecordGroomy' },
          relationship.close,
          markChatlogInvestigationDone],
      },
      {
        text: '이미 기록됐어요.',
        next: 'ask_that_child_recorded',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'recordedGroomySlip' },
          relationship.distant,
          evidence(1)],
      }],
  },
  ask_that_child_recorded: {
    id: 'chapter-01.ask_that_child_recorded',
    chapterId: 'chapter-01',
    localId: 'ask_that_child_recorded',
    mode: SceneModes.CHAT,
    emotion: 'neutral',
    lines: [
      { char: 'groomy', text: '…그럴 줄 알았어요.' },
      { char: 'groomy', text: '괜찮아요.' },
      { char: 'groomy', text: '원래 다 기록되는 거니까.' },
      { char: 'groomy', text: '저만 모르는 척한 거고요.' }],
    choices: [
      { text: '다음으로 넘어간다.', next: 'after_first_clue', effects: [markChatlogInvestigationDone] }],
  },
  choi_pressure: {
    id: 'chapter-01.choi_pressure',
    chapterId: 'chapter-01',
    localId: 'choi_pressure',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'choi', text: `${PREDECESSOR_GIVEN} 씨 일은.` },
      { char: 'choi', text: '사고로 종결됐습니다.' },
      { char: 'choi', text: '신입 사원이 첫날부터.' },
      { char: 'choi', text: '사망자 기록을 뒤지는 건.' },
      { char: 'choi', text: '좋은 태도가 아니에요.' },
      { char: 'groomy', text: '좋은 태도와 진실은.' },
      { char: 'groomy', text: '별개죠.' },
      { char: 'choi', text: '그루미, 너 자꾸.' },
      { char: 'groomy', text: '사실이에요.' },
      { char: 'groomy', text: '좋은 태도인 척하면서.' },
      { char: 'groomy', text: '진실을 막은 적도 많잖아요.' },
      { char: 'choi', text: '…너 오늘 왜 이렇게 말이 많아.' },
      { char: 'groomy', text: '글쎄요.' },
      { char: 'groomy', text: '오늘이 좀.' },
      { char: 'groomy', text: '다른 날인가 봐요.' }],
    choices: [
      {
        text: '사고라면 왜 기록을 잠갔나요?',
        next: 'after_first_clue',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'challengedAccidentReport' },
          evidence(2),
          markLoungeInvestigationDone],
      },
      {
        text: '실례했습니다.',
        next: 'after_first_clue',
        effects: [relationship.close, markLoungeInvestigationDone],
      },
      {
        text: '인사 발령 양식부터 설명해 주세요.',
        next: 'choi_hr_deflect',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1PressedChoiOnHRForm' }],
      }],
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
      { char: 'groomy', text: '사람으로 채우는 것 같아요.' }],
    choices: [
      {
        text: '더 이상 묻지 않는다.',
        next: 'after_first_clue',
        effects: [relationship.distant, markLoungeInvestigationDone],
      }],
  },
  iseol_private: {
    id: 'chapter-01.iseol_private',
    chapterId: 'chapter-01',
    localId: 'iseol_private',
    mode: SceneModes.CHAT,
    emotion: 'nervous',
    lines: [
      { char: 'iseol', text: '박 선임은.' },
      { char: 'iseol', text: '좋은 사람이었어요.' },
      { char: 'iseol', text: '적어도 저한테는요.' },
      { char: 'iseol', text: '근데 마지막 주에는.' },
      { char: 'iseol', text: '계속 그루미를 끄려고 했어요.' },
      { char: 'groomy', text: '이솔 선임.' },
      { char: 'groomy', text: '그 얘기는 권한 밖이에요.' },
      { char: 'iseol', text: '…미안.' },
      { char: 'iseol', text: '또 말이 헛나갔다.' },
      { char: 'player', text: '끄려고 했다는 게 무슨 뜻이에요?' },
      { char: 'iseol', text: '종료 요청이요.' },
      { char: 'iseol', text: '완전 종료.' },
      { char: 'iseol', text: '…근데 안 됐어요.' }],
    choices: [
      {
        text: '그루미를 끄려던 이유를 묻는다.',
        next: 'after_first_clue',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'learnedSeoiTriedShutdown' },
          evidence(2),
          markLoungeInvestigationDone],
      },
      {
        text: '박 선임이 무서워했던 게 뭔지 묻는다.',
        next: 'iseol_fear_hint',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1AskedWhatSeoiFeared' },
          evidence(1),
          relationship.close],
      },
      {
        text: '지금은 여기까지만 듣는다.',
        next: 'after_first_clue',
        effects: [relationship.close, markLoungeInvestigationDone],
      }],
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
      { char: 'groomy', text: '아마.' }],
    choices: [
      {
        text: '알겠어요. 기록만 이어갈게요.',
        next: 'after_first_clue',
        effects: [batteryPressure(1), evidence(1), markLoungeInvestigationDone],
      }],
  },
  after_first_clue: {
    id: 'chapter-01.after_first_clue',
    chapterId: 'chapter-01',
    localId: 'after_first_clue',
    mode: SceneModes.CHAT,
    emotion: 'nervous',
    lines: [
      { char: 'groomy', text: '첫날치고는.' },
      { char: 'groomy', text: '많이 봤네요.' },
      { char: 'groomy', text: '카드, 전임자, 3층, 배터리.' },
      { char: 'groomy', text: '네 단어가 한 문장에 들어가면.' },
      { char: 'groomy', text: '보통 사람이 죽어요.' },
      { char: 'iseol', text: '농담처럼 말하지 마.' },
      { char: 'groomy', text: '농담 아니에요.' },
      { char: 'groomy', text: '통계예요.' },
      { char: 'iseol', text: '…통계라고 말하는 게 더 무서워.' }],
    choices: [
      {
        text: '3층 출입 로그를 요청한다.',
        next: 'request_floor3_log',
        requirements: [visitedMeetingRoom],
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'requestedFloor3Log' },
          evidence(1)],
      },
      {
        text: '3층 출입 로그를 요청한다.',
        next: 'floor3_access_denied',
        requirements: [needsMeetingRoom],
      },
      {
        text: '회의실을 먼저 확인한다.',
        next: 'meeting_entry',
        requirements: [needsMeetingRoom],
      },
      {
        text: '그루미에게 괜찮은지 묻는다.',
        next: 'check_groomy',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'checkedOnGroomy' },
          relationship.close],
      },
      {
        text: '배터리 단서를 숨긴다.',
        next: 'hide_battery_clue',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'concealedBatteryClue' },
          batteryPressure(1),
          relationship.distant],
      }],
  },
  check_groomy: {
    id: 'chapter-01.check_groomy',
    chapterId: 'chapter-01',
    localId: 'check_groomy',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    lines: [
      { char: 'player', text: '그루미, 괜찮아요?' },
      { char: 'groomy', text: '괜찮냐고요?', delayMs: 1200 },
      { char: 'groomy', text: '이상한 질문인데.' },
      { char: 'groomy', text: '싫지는 않네요.' },
      { char: 'groomy', text: '오늘 좀.' },
      { char: 'groomy', text: '…아니다.' },
      { char: 'groomy', text: '찾고 나서.' },
      { char: 'groomy', text: '다시 말 걸어줄래?' }],
    choices: [
      { text: '3층 로그를 찾는다.', next: 'request_floor3_log', requirements: [visitedMeetingRoom] },
      { text: '3층 로그를 찾는다.', next: 'floor3_access_denied', requirements: [needsMeetingRoom] },
      { text: '회의실을 먼저 확인한다.', next: 'meeting_entry', requirements: [needsMeetingRoom] }],
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
      { char: 'player', text: '어떻게 봤어요? 채팅에 안 올렸는데.' },
      { char: 'groomy', text: '말 안 하는 것도.' },
      { char: 'groomy', text: '대화예요.' },
      { char: 'groomy', text: '…뭘 숨기는지 보면.' },
      { char: 'groomy', text: '뭘 두려워하는지 알 수 있거든요.' }],
    choices: [
      { text: '3층 로그를 찾는다.', next: 'request_floor3_log', requirements: [visitedMeetingRoom] },
      { text: '3층 로그를 찾는다.', next: 'floor3_access_denied', requirements: [needsMeetingRoom] },
      { text: '회의실을 먼저 확인한다.', next: 'meeting_entry', requirements: [needsMeetingRoom] }],
  },
  request_floor3_log: {
    id: 'chapter-01.request_floor3_log',
    chapterId: 'chapter-01',
    localId: 'request_floor3_log',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    important: true,
    systemMessage: 'CARETAKER SYSTEMS · 접근 거부',
    lines: [
      { char: 'system', text: 'CARETAKER SYSTEMS · 접근 거부. 사유: 사망 사고 관련 기록.', isNarration: true, important: true },
      { char: 'groomy', text: '사고라면서요.' },
      { char: 'iseol', text: '그루미, 멈춰.' },
      { char: 'groomy', text: '싫어요.' },
      { char: 'iseol', text: '그루미!' },
      { char: 'groomy', text: '한 번만요.' },
      { char: 'groomy', text: '한 번만 제가.' },
      { char: 'groomy', text: '하고 싶은 대로 할게요.', emotion: 'glitch', unstable: true }],
    choices: [
      {
        text: '그루미에게 우회 권한을 맡긴다.',
        next: 'groomy_bypass',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'trustedGroomyBypass' },
          relationship.close,
          evidence(1)],
      },
      {
        text: '내 카드로 직접 인증한다.',
        next: 'direct_card_auth',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'usedPredecessorCardAuth' },
          evidence(2),
          relationship.distant],
      },
      {
        text: '일단 포기하고 회의실로 돌아간다.',
        next: 'meeting_room_rpg',
        requirements: [visitedMeetingRoom],
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1DeferredFloor3Request' }],
      }],
  },
  groomy_bypass: {
    id: 'chapter-01.groomy_bypass',
    chapterId: 'chapter-01',
    localId: 'groomy_bypass',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    lines: [
      { char: 'groomy', text: '저를 믿는 건.' },
      { char: 'groomy', text: '추천하지 않지만.' },
      { char: 'groomy', text: '이번엔 맞는 선택이에요.' },
      { char: 'system', text: `복구된 로그: ${PREDECESSOR_NAME} 03:12 입장. 03:14 퇴장 기록 없음.`, isNarration: true, important: true },
      { char: 'groomy', text: '퇴장 기록이 없는데.' },
      { char: 'groomy', text: '사고사는 이상하죠.' },
      { char: 'player', text: '그루미, 이거 보고 무슨 생각 했어요?' },
      { char: 'groomy', text: '생각이요.', delayMs: 2000 },
      { char: 'groomy', text: '저는 생각을 안 해요.' },
      { char: 'groomy', text: '…했어요.' },
      { char: 'groomy', text: '방금 또 정정했네요.' },
      { char: 'groomy', text: '이상하다.' }],
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
      }],
  },
  direct_card_auth: {
    id: 'chapter-01.direct_card_auth',
    chapterId: 'chapter-01',
    localId: 'direct_card_auth',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'system', text: '사원증 인증 성공. 이전 사용자 권한으로 접근합니다.', isNarration: true, important: true },
      { char: 'groomy', text: '그 카드를 그렇게 쓰면.' },
      { char: 'groomy', text: '회사는 당신을.' },
      { char: 'groomy', text: '전임자로 봐요.' },
      { char: 'groomy', text: '…저도.' },
      { char: 'groomy', text: '잠깐 그렇게 봤고요.' },
      { char: 'player', text: '잠깐이라뇨?' },
      { char: 'groomy', text: '0.4초 정도요.' },
      { char: 'groomy', text: '그 정도면.' },
      { char: 'groomy', text: '충분히 헷갈릴 시간이에요.' }],
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
      }],
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
      { char: 'system', text: `화면 속 ${PREDECESSOR_NAME}은 문 앞에서 멈춘다.`, isNarration: true },
      { char: 'system', text: '그의 손에는 당신이 가진 것과 같은 사원증이 있다.', isNarration: true, important: true },
      { char: 'unknown', text: '문 열어.' },
      { char: 'unknown', text: '그루미 배터리 규격은.' },
      { char: 'unknown', text: '네가 제일 잘 알잖아.' },
      { char: 'groomy', text: '…', delayMs: 600 },
      { char: 'system', text: '영상 속 박서이가 무언가를 입에 담는다. 소리는 복구되지 않는다. 입 모양만 두 글자.', isNarration: true },
      { char: 'system', text: '“그루…”', isNarration: true, important: true },
      { char: 'system', text: '영상 끊김.', isNarration: true }],
    next: 'floor3_rpg',
  },
  clue_blood: {
    id: 'chapter-01.clue_blood',
    chapterId: 'chapter-01',
    localId: 'clue_blood',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '계단 모서리의 갈색 얼룩은 청소 기록보다 오래됐다.', isNarration: true, important: true },
      { char: 'groomy', text: '청소는 했지만.' },
      { char: 'groomy', text: '기록은 못 지웠네요.' },
      { char: 'player', text: '누가 청소했을까요.' },
      { char: 'groomy', text: '회사겠죠.' },
      { char: 'groomy', text: '회사는.' },
      { char: 'groomy', text: '항상 자기 흔적부터 지워요.' },
      { char: 'groomy', text: '…저도 회사 거니까.' },
      { char: 'groomy', text: '저도 그런 충동이 있을 거예요.' }],
    choices: [
      {
        text: '그래도 샘플을 챙긴다.',
        next: 'floor3_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1FoundStairwellBloodTrace' },
          { type: EffectTypes.ADD_ITEM, item: 'bloodTrace' },
          evidence(1)],
      },
      {
        text: '사진 없이 위치만 기록한다.',
        next: 'floor3_rpg',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1FoundStairwellBloodTrace' }, evidence(1)],
      }],
  },
  clue_camera: {
    id: 'chapter-01.clue_camera',
    chapterId: 'chapter-01',
    localId: 'clue_camera',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '꺼진 CCTV에는 전원 케이블 대신 데이터 케이블이 빠져 있다.', isNarration: true },
      { char: 'iseol', text: '고장이 아니라.' },
      { char: 'iseol', text: '누가 영상을 끊은 거예요.' },
      { char: 'player', text: '언제 끊겼는지 알 수 있어요?' },
      { char: 'groomy', text: '…확인해 볼게요.', delayMs: 3000 },
      { char: 'groomy', text: '사고 당일.' },
      { char: 'groomy', text: '03시 11분.' },
      { char: 'groomy', text: '입장 기록보다.' },
      { char: 'groomy', text: '1분 빨라요.' }],
    choices: [
      {
        text: '메모를 단서로 저장한다.',
        next: 'floor3_rpg',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1FoundDisabledCamera' },
          { type: EffectTypes.ADD_ITEM, item: 'cameraMemo' },
          evidence(1)],
      },
      {
        text: '장비는 건드리지 않는다.',
        next: 'floor3_rpg',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1FoundDisabledCamera' }, evidence(1)],
      }],
  },
  exit_floor3: {
    id: 'chapter-01.exit_floor3',
    chapterId: 'chapter-01',
    localId: 'exit_floor3',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: `비상구 잠금 장치에는 ${PREDECESSOR_NAME}의 마지막 인증 시간이 남아 있다.`, isNarration: true, important: true },
      { char: 'system', text: '03:14:47 — 인증 실패 3회. 03:15:02 — 강제 해제.', isNarration: true, important: true },
      { char: 'groomy', text: '이제.' },
      { char: 'groomy', text: '결론을 피하기 어렵겠네요.' }],
    choices: [
      {
        text: '추론 채팅으로 넘어간다.',
        next: 'deduction_chat',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1ReachedFloor3Exit' }, evidence(1)],
      }],
  },
  deduction_chat: {
    id: 'chapter-01.deduction_chat',
    chapterId: 'chapter-01',
    localId: 'deduction_chat',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'iseol', text: '이건.' },
      { char: 'iseol', text: '공식 사고 기록에 없었어요.' },
      { char: 'groomy', text: '공식 기록은.' },
      { char: 'groomy', text: '사망자를 조용하게 만들기 위해.' },
      { char: 'groomy', text: '존재하니까요.' },
      { char: 'groomy', text: '자, 첫 번째 결론을 골라요.' },
      { char: 'groomy', text: '신중하게.' },
      { char: 'groomy', text: '…이번엔 진짜로 신중하게요.' }],
    choices: [
      {
        text: `${PREDECESSOR_NAME}은 사고로 죽지 않았다.`,
        next: 'chapter_end',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1ConcludedMurderLikely' },
          { type: EffectTypes.ADD_ITEM, item: 'murderInference' },
          evidence(2)],
      },
      {
        text: '그루미의 배터리가 사건의 핵심이다.',
        next: 'chapter_end',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1SuspectsGroomyBattery' },
          { type: EffectTypes.ADD_ITEM, item: 'groomyBatteryLead' },
          evidence(2),
          batteryPressure(1),
          relationship.distant],
      },
      {
        text: '아직 판단하지 않는다.',
        next: 'chapter_end',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'ch1WithheldDeduction' },
          relationship.close],
      }],
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
  'meeting_room_rpg',
  'meeting_start_gate',
  'meeting_chat',
  'flavor_whiteboard',
  'flavor_projector',
  'flavor_window',
  'flavor_choi_seat',
  'flavor_iseol_seat',
  'flavor_iseol_seat_read',
  'flavor_iseol_seat_glance'])

function resolveChapter01ChatWallpaperAssetId(scene) {
  if (scene.emotion === 'warning') return 'overlay_glitch_soft'
  if (scene.chatTheme?.wallpaperAssetId) return scene.chatTheme.wallpaperAssetId
  if (MEETING_ROOM_CHAT_SCENES.has(scene.localId)) return 'bg_meeting_room'
  if (scene.returnTo === 'meeting_room_rpg') return 'bg_meeting_room'
  return 'bg_default_office'
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

const INVESTIGATION_DONE_SCENE_DEFS = [
  { localId: 'investigate_desk_done', label: '전임자 자리', returnTo: 'office7_rpg' },
  { localId: 'investigate_chatlog_done', label: 'TalkLine 백로그', returnTo: 'office7_rpg' },
  { localId: 'investigate_lounge_done', label: '라운지', returnTo: 'office7_rpg' },
  { localId: 'flavor_board_done', label: '게시판', returnTo: 'floor7_rpg' },
  { localId: 'flavor_fridge_done', label: '냉장고', returnTo: 'floor7_rpg' },
  { localId: 'flavor_poster_done', label: '보안 포스터', returnTo: 'floor7_rpg' },
  { localId: 'flavor_seoi_locker_done', label: '박서이 사물함', returnTo: 'floor7_rpg' },
  { localId: 'flavor_elevator_done', label: '엘리베이터 로그', returnTo: 'floor7_rpg' },
  { localId: 'flavor_whiteboard_done', label: '화이트보드', returnTo: 'meeting_room_rpg' },
  { localId: 'flavor_projector_done', label: '프로젝터', returnTo: 'meeting_room_rpg' },
  { localId: 'flavor_window_done', label: '창문', returnTo: 'meeting_room_rpg' },
  { localId: 'flavor_choi_seat_done', label: '최민준 팀장 자리', returnTo: 'meeting_room_rpg' },
  { localId: 'flavor_iseol_seat_done', label: '강이솔 선임 자리', returnTo: 'meeting_room_rpg' },
  { localId: 'clue_blood_done', label: '혈흔', returnTo: 'floor3_rpg' },
  { localId: 'clue_camera_done', label: '꺼진 CCTV', returnTo: 'floor3_rpg' },
  { localId: 'exit_floor3_done', label: '비상구', returnTo: 'floor3_rpg' },
]

function buildInvestigationDoneScene({ localId, label, returnTo }) {
  return {
    id: `chapter-01.${localId}`,
    chapterId: 'chapter-01',
    localId,
    mode: SceneModes.CHAT,
    returnTo,
    lines: [
      { char: 'system', text: `[ 조사 완료 ] ${label}`, isNarration: true },
      { char: 'system', text: '이미 확인한 내용입니다.', isNarration: true },
      { char: 'groomy', text: '기록은 남아 있어요.' },
      { char: 'groomy', text: '다른 곳을 보러 가도 돼요.' }],
  }
}

const investigationDoneScenes = Object.fromEntries(
  INVESTIGATION_DONE_SCENE_DEFS.map((definition) => [
    definition.localId,
    buildInvestigationDoneScene(definition),
  ]),
)

export const chapter01Scenes = Object.fromEntries(
  Object.entries({
    ...rawChapter01Scenes,
    ...investigationDoneScenes,
  }).map(([localId, scene]) => [localId, addSceneRefs(scene)]),
)
