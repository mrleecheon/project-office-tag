import { EffectTypes, SceneModes } from '../../../engine/contracts.js'
import { SESSION_EMP_ID } from '../../world/company.js'

const relationship = {
  close: { type: EffectTypes.ADD_SCORE, score: 'groomyAffinity', amount: 1 },
  distant: { type: EffectTypes.ADD_SCORE, score: 'groomyAffinity', amount: -1 },
}

const evidence = (amount = 1) => ({ type: EffectTypes.ADD_SCORE, score: 'mysteryEvidence', amount })
const batteryPressure = (amount = 1) => ({ type: EffectTypes.ADD_SCORE, score: 'batteryDesperation', amount })
const corporateHeat = (amount = 1) => ({ type: EffectTypes.ADD_SCORE, score: 'corporateSuspicion', amount })

const rawChapter01Scenes = {
  morning_briefing: {
    id: 'chapter-01.morning_briefing',
    chapterId: 'chapter-01',
    localId: 'morning_briefing',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    systemMessage: 'GROOMY OFFICE · 신입 온보딩 채널',
    lines: [
      { char: 'groomy', text: ({ nickname }) => `${nickname} 씨, 첫 업무 배정이에요.` },
      { char: 'groomy', text: '강이솔 선임이 기본 안내를 맡고, 저는 채팅 기록과 출입 로그를 정리합니다.' },
      { char: 'iseol', text: '어려운 일은 아니에요. 오늘은 회사 분위기 익히는 정도로만.' },
      { char: 'groomy', text: '그리고 전임자 자리에는 오래 머물지 마세요.' },
    ],
    choices: [
      {
        text: '왜요?',
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
    ],
    choices: [
      {
        text: '전임자 이름이 박준혁 선임 맞죠?',
        next: 'predecessor_name',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'namedJunhyeokFirst' },
          evidence(2),
        ],
      },
      {
        text: '알겠습니다. 먼저 둘러볼게요.',
        next: 'office_tour',
        effects: [relationship.close],
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
        next: 'office_tour',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'askedWhoDislikesCard' },
          evidence(1),
          relationship.distant,
        ],
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
      { char: 'groomy', text: '카드에 적혀 있었잖아요. 모두가 못 본 척하는 것뿐이에요.' },
      { char: 'iseol', text: '그루미.' },
      { char: 'groomy', text: '네. 로그 얘기는 나중에.' },
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
    ],
    choices: [
      {
        text: '그럼 업무 우선순위 말고 그루미 생각은요?',
        next: 'office_tour',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'askedGroomyPersonalThought' },
          relationship.close,
        ],
      },
      {
        text: '됐어요. 로그만 보여줘요.',
        next: 'office_tour',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'treatedGroomyAsTool' },
          relationship.distant,
        ],
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
      { char: 'iseol', text: '그럼 간단히 둘러볼게요. 라운지, 전임자 자리, 그리고 내부 메신저 백로그.' },
      { char: 'groomy', text: '셋 중 하나만 봐도 업무 적응은 됩니다.' },
      { char: 'groomy', text: '셋 다 보면 적응 말고 다른 걸 하게 되겠지만요.' },
    ],
    choices: [
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
        text: '7층을 직접 걸으며 단서를 찾는다.',
        next: 'floor7_rpg',
        effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1StartedFloor7Exploration' }],
      },
    ],
  },
  floor7_rpg: {
    id: 'chapter-01.floor7_rpg',
    chapterId: 'chapter-01',
    localId: 'floor7_rpg',
    mode: SceneModes.RPG,
    mapId: 'floor7',
  },
  flavor_board: {
    id: 'chapter-01.flavor_board',
    chapterId: 'chapter-01',
    localId: 'flavor_board',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '게시판에는 박준혁 선임의 추모 공지가 없다.', isNarration: true },
      { char: 'groomy', text: '사망 사고가 공식이면 공지도 공식이어야 하는데요.' },
    ],
    returnTo: 'floor7_rpg',
    effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1CheckedMissingMemorialNotice' }, evidence(1)],
  },
  flavor_fridge: {
    id: 'chapter-01.flavor_fridge',
    chapterId: 'chapter-01',
    localId: 'flavor_fridge',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '냉장고 문 안쪽에 오래된 혈당 젤과 배터리 배송 스티커가 붙어 있다.', isNarration: true },
      { char: 'iseol', text: '그건 박 선임 물건이 아니었어요. 누가 급하게 숨긴 거예요.' },
    ],
    returnTo: 'floor7_rpg',
    effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1FoundFridgeBatterySticker' }, batteryPressure(1)],
  },
  flavor_poster: {
    id: 'chapter-01.flavor_poster',
    chapterId: 'chapter-01',
    localId: 'flavor_poster',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '보안 포스터에는 “비인가 사원증 사용 즉시 자동 감사”라는 문구가 적혀 있다.', isNarration: true },
      { char: 'groomy', text: '당신 카드가 그래서 자꾸 제 로그에 걸립니다.' },
    ],
    returnTo: 'floor7_rpg',
    effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1ReadBadgeAuditPoster' }, corporateHeat(1)],
  },
  meeting_entry: {
    id: 'chapter-01.meeting_entry',
    chapterId: 'chapter-01',
    localId: 'meeting_entry',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'iseol', text: '회의실은 아직 예약이 살아 있어요. 박 선임 이름으로요.' },
      { char: 'groomy', text: '죽은 사람 일정이 지워지지 않는 회사라니, 근면하네요.' },
    ],
    next: 'meeting_room_rpg',
  },
  meeting_room_rpg: {
    id: 'chapter-01.meeting_room_rpg',
    chapterId: 'chapter-01',
    localId: 'meeting_room_rpg',
    mode: SceneModes.RPG,
    mapId: 'meetingRoom',
  },
  flavor_whiteboard: {
    id: 'chapter-01.flavor_whiteboard',
    chapterId: 'chapter-01',
    localId: 'flavor_whiteboard',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '화이트보드 구석에 “3F / 배터리 / 문 열림”이라는 지워진 흔적이 남아 있다.', isNarration: true },
      { char: 'groomy', text: '회의록에는 없는 단어들이네요.' },
    ],
    returnTo: 'meeting_room_rpg',
    effects: [evidence(1)],
  },
  flavor_projector: {
    id: 'chapter-01.flavor_projector',
    chapterId: 'chapter-01',
    localId: 'flavor_projector',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '프로젝터 최근 입력 기록에 “사고 대응 리허설” 파일명이 남아 있다.', isNarration: true },
      { char: 'iseol', text: '사고가 난 뒤 만든 게 아니라, 전날 만든 파일이에요.' },
    ],
    returnTo: 'meeting_room_rpg',
    effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1FoundIncidentRehearsalFile' }, evidence(1)],
  },
  flavor_window: {
    id: 'chapter-01.flavor_window',
    chapterId: 'chapter-01',
    localId: 'flavor_window',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '창밖 3층 비상계단 센서가 비정상적으로 자주 깜빡인다.', isNarration: true },
      { char: 'groomy', text: '저 센서는 고장 나면 보통 꺼집니다. 깜빡이면 누가 보고 있다는 뜻이에요.' },
    ],
    returnTo: 'meeting_room_rpg',
    effects: [corporateHeat(1)],
  },
  flavor_choi_seat: {
    id: 'chapter-01.flavor_choi_seat',
    chapterId: 'chapter-01',
    localId: 'flavor_choi_seat',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'choi', text: '신입이 앉을 자리는 아닙니다.' },
      { char: 'system', text: '최 팀장의 태블릿에는 사고 보고서가 아니라 인사 발령 양식이 떠 있다.', isNarration: true },
    ],
    returnTo: 'meeting_room_rpg',
    effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1CheckedChoiSeat' }, corporateHeat(1)],
  },
  flavor_kim_seat: {
    id: 'chapter-01.flavor_kim_seat',
    chapterId: 'chapter-01',
    localId: 'flavor_kim_seat',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'iseol', text: '제 자리는 괜찮아요. 대신 메모는 보지 마세요.' },
      { char: 'system', text: '메모 첫 줄에는 “그루미 차단 요청 실패”라고 적혀 있다.', isNarration: true, important: true },
    ],
    returnTo: 'meeting_room_rpg',
    effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1SawIseolBlockMemo' }, evidence(1)],
  },
  meeting_chat: {
    id: 'chapter-01.meeting_chat',
    chapterId: 'chapter-01',
    localId: 'meeting_chat',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'iseol', text: '이 정도면 단순 온보딩은 아니죠.' },
      { char: 'groomy', text: '이제 전임자 자리, 로그, 라운지 중 하나를 공식 조사로 남겨요.' },
    ],
    choices: [
      { text: '전임자 자리 기록을 남긴다.', next: 'investigate_desk', effects: [evidence(1)] },
      { text: '채팅 로그를 공식 조사로 남긴다.', next: 'investigate_chatlog', effects: [evidence(1)] },
      { text: '직원 반응을 공식 조사로 남긴다.', next: 'investigate_lounge', effects: [evidence(1)] },
    ],
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
      { char: 'groomy', text: '화면은 물건이 아니니까요. 회사다운 농담이죠.' },
    ],
    choices: [{ text: '전임자 자리로 간다.', next: 'investigate_desk' }],
  },
  investigate_desk: {
    id: 'chapter-01.investigate_desk',
    chapterId: 'chapter-01',
    localId: 'investigate_desk',
    mode: SceneModes.CHAT,
    emotion: 'nervous',
    lines: [
      { char: 'system', text: '책상 위 컵받침 아래에 접힌 영수증이 있다.', isNarration: true },
      { char: 'system', text: '구매 품목: 소형 고밀도 배터리 셀. 배송지: GROOMY OFFICE 3F.', isNarration: true, important: true },
      { char: 'groomy', text: '업무 물품은 아니네요.' },
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
      { char: 'unknown', text: '3층 문 열어. 네가 아니면 그 애가 꺼져.' },
      { char: 'groomy', text: '이 로그는 온보딩 범위를 벗어났어요.' },
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
        next: 'after_first_clue',
        effects: [
          { type: EffectTypes.ADD_ITEM, item: 'threatChatlog' },
          { type: EffectTypes.ADD_FLAG, flag: 'downloadedChatlog' },
          evidence(2),
          relationship.distant,
        ],
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
    ],
  },
  ask_battery: {
    id: 'chapter-01.ask_battery',
    chapterId: 'chapter-01',
    localId: 'ask_battery',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'groomy', text: '그 질문은 저한테 하는 거예요, 아니면 당신한테 하는 거예요?' },
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
      { char: 'choi', text: '박준혁 씨 일은 사고로 종결됐습니다.' },
      { char: 'choi', text: '신입 사원이 첫날부터 사망자 기록을 뒤지는 건 좋은 태도가 아니에요.' },
      { char: 'groomy', text: '좋은 태도와 진실은 별개죠.' },
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
      { char: 'groomy', text: '이솔 선임. 그 얘기는 권한 밖이에요.' },
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
        text: '지금은 여기까지만 듣는다.',
        next: 'after_first_clue',
        effects: [relationship.close],
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
      { char: 'groomy', text: '카드, 전임자, 3층, 배터리. 네 단어가 한 문장에 들어가면 보통 사람이 죽어요.' },
      { char: 'iseol', text: '농담처럼 말하지 마.' },
    ],
    choices: [
      {
        text: '3층 출입 로그를 요청한다.',
        next: 'request_floor3_log',
        effects: [
          { type: EffectTypes.ADD_FLAG, flag: 'requestedFloor3Log' },
          evidence(1),
        ],
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
      { char: 'groomy', text: '이상한 질문인데, 싫지는 않네요.' },
      { char: 'groomy', text: '찾고 나서 다시 말 걸어줄래?' },
    ],
    choices: [{ text: '3층 로그를 찾는다.', next: 'request_floor3_log' }],
  },
  hide_battery_clue: {
    id: 'chapter-01.hide_battery_clue',
    chapterId: 'chapter-01',
    localId: 'hide_battery_clue',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'system', text: '배터리 영수증을 채팅창에 올리지 않는다.', isNarration: true },
      { char: 'groomy', text: '방금 선택, 저도 봤어요.' },
      { char: 'groomy', text: '말 안 하는 것도 대화예요.' },
    ],
    choices: [{ text: '3층 로그를 찾는다.', next: 'request_floor3_log' }],
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
      { char: 'groomy', text: '사고라면서요.' },
      { char: 'iseol', text: '그루미, 멈춰.' },
      { char: 'groomy', text: '싫어요.' },
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
    ],
  },
  groomy_bypass: {
    id: 'chapter-01.groomy_bypass',
    chapterId: 'chapter-01',
    localId: 'groomy_bypass',
    mode: SceneModes.CHAT,
    emotion: 'friendly',
    lines: [
      { char: 'groomy', text: '저를 믿는 건 추천하지 않지만, 이번엔 맞는 선택이에요.' },
      { char: 'system', text: '복구된 로그: 박준혁 선임 03:12 입장. 03:14 퇴장 기록 없음.', isNarration: true, important: true },
      { char: 'groomy', text: '퇴장 기록이 없는데 사고사는 이상하죠.' },
    ],
    choices: [{ text: '비상계단 화면으로 전환한다.', next: 'floor3_vn', effects: [{ type: EffectTypes.ADD_ITEM, item: 'floor3EntryLog' }, evidence(2)] }],
  },
  direct_card_auth: {
    id: 'chapter-01.direct_card_auth',
    chapterId: 'chapter-01',
    localId: 'direct_card_auth',
    mode: SceneModes.CHAT,
    emotion: 'warning',
    lines: [
      { char: 'system', text: `${SESSION_EMP_ID} 인증 성공. 이전 사용자 권한으로 접근합니다.`, isNarration: true, important: true },
      { char: 'groomy', text: '그 카드를 그렇게 쓰면 회사는 당신을 전임자로 봐요.' },
      { char: 'groomy', text: '저도 잠깐 그렇게 봤고요.' },
    ],
    choices: [{ text: '비상계단 화면으로 전환한다.', next: 'floor3_vn', effects: [{ type: EffectTypes.ADD_ITEM, item: 'floor3EntryLog' }, evidence(2)] }],
  },
  floor3_vn: {
    id: 'chapter-01.floor3_vn',
    chapterId: 'chapter-01',
    localId: 'floor3_vn',
    mode: SceneModes.VN,
    emotion: 'warning',
    important: true,
    lines: [
      { char: 'system', text: '-- 3층 비상계단 기록 --', isNarration: true },
      { char: 'system', text: '화면 속 박준혁 선임은 문 앞에서 멈춘다.', isNarration: true },
      { char: 'system', text: '그의 손에는 당신이 가진 것과 같은 사원증이 있다.', isNarration: true, important: true },
      { char: 'unknown', text: '문 열어. 그루미 배터리 규격은 네가 제일 잘 알잖아.' },
      { char: 'groomy', text: '...' },
    ],
    next: 'floor3_rpg',
  },
  floor3_rpg: {
    id: 'chapter-01.floor3_rpg',
    chapterId: 'chapter-01',
    localId: 'floor3_rpg',
    mode: SceneModes.RPG,
    mapId: 'floor3',
  },
  clue_blood: {
    id: 'chapter-01.clue_blood',
    chapterId: 'chapter-01',
    localId: 'clue_blood',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '계단 모서리의 갈색 얼룩은 청소 기록보다 오래됐다.', isNarration: true, important: true },
      { char: 'groomy', text: '청소는 했지만 기록은 못 지웠네요.' },
    ],
    returnTo: 'floor3_rpg',
    effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1FoundStairwellBloodTrace' }, evidence(1)],
  },
  clue_camera: {
    id: 'chapter-01.clue_camera',
    chapterId: 'chapter-01',
    localId: 'clue_camera',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '꺼진 CCTV에는 전원 케이블 대신 데이터 케이블이 빠져 있다.', isNarration: true },
      { char: 'iseol', text: '고장이 아니라 누가 영상을 끊은 거예요.' },
    ],
    returnTo: 'floor3_rpg',
    effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1FoundDisabledCamera' }, evidence(1), corporateHeat(1)],
  },
  exit_floor3: {
    id: 'chapter-01.exit_floor3',
    chapterId: 'chapter-01',
    localId: 'exit_floor3',
    mode: SceneModes.CHAT,
    lines: [
      { char: 'system', text: '비상구 잠금 장치에는 박준혁 선임의 마지막 인증 시간이 남아 있다.', isNarration: true, important: true },
      { char: 'groomy', text: '이제 결론을 피하기 어렵겠네요.' },
    ],
    next: 'deduction_chat',
    effects: [{ type: EffectTypes.ADD_FLAG, flag: 'ch1ReachedFloor3Exit' }, evidence(1)],
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
      { char: 'groomy', text: '자, 첫 번째 결론을 골라요.' },
    ],
    choices: [
      {
        text: '박준혁 선임은 사고로 죽지 않았다.',
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
    return {
      ...withTheme,
      vnStage: withLineRefs.vnStage ?? {
        bgId: withLineRefs.localId.includes('floor3') ? 'bg_stairwell_floor3' : 'bg_default_office',
        overlayId: withLineRefs.important ? 'overlay_glitch_soft' : 'overlay_scanline',
        characters: [],
      },
    }
  }
  return withTheme
}

export const chapter01Scenes = Object.fromEntries(
  Object.entries(rawChapter01Scenes).map(([localId, scene]) => [localId, addSceneRefs(scene)]),
)
