export const COMPANY = {
  legal: 'NEXUS CORE',
  product: 'TalkLine',
  intranet: 'TalkLine INTERNAL',
};

export const PREDECESSOR_NAME = '박준혁 선임';
export const SESSION_EMP_ID = 'EMP-2024-0041';
export const BUBBLE_MAX = '270px';

export const CHARS = {
  system: {
    name: 'SYSTEM',
    dept: 'NEXUS CORE',
    initial: 'S',
    accent: '#6aa8ff',
    bubble: '#10243a',
    border: '#21486d',
    text: '#c9e5ff',
  },
  player: {
    name: '나',
    dept: 'TEMP CARD',
    initial: '나',
    accent: '#86d7ff',
    bubble: '#12324c',
    border: '#275a7a',
    text: '#e2f6ff',
  },
  kim: {
    name: '김수진 대리',
    dept: '인사팀',
    initial: '김',
    accent: '#5b9bd5',
    bubble: '#1a2f45',
    border: '#2a4560',
    text: '#c0d8f0',
  },
  choi: {
    name: '최민준 팀장',
    dept: '개발팀',
    initial: '최',
    accent: '#7a6ad8',
    bubble: '#221a40',
    border: '#3a2860',
    text: '#d5ccff',
  },
  yoon: {
    name: '윤하린',
    dept: '보안감사실',
    initial: '윤',
    accent: '#d1a13d',
    bubble: '#2d2412',
    border: '#5b411c',
    text: '#ffe5ad',
  },
  ai: {
    name: 'NEXUS-AI',
    dept: '자동 관제',
    initial: 'AI',
    accent: '#46d8b5',
    bubble: '#102c27',
    border: '#1f5a50',
    text: '#bff9ed',
  },
  unknown: {
    name: '???',
    dept: '——',
    initial: '?',
    accent: '#c55252',
    bubble: '#2a1010',
    border: '#552121',
    text: '#ffc0c0',
  },
};

export const EMOTIONS = {
  neutral: { ring: '#4a6a88', glow: 'rgba(74,106,136,0.25)', hair: '#3a5060', face: '#6a8898' },
  friendly: { ring: '#3a9a70', glow: 'rgba(58,154,112,0.30)', hair: '#2a5040', face: '#5a9878' },
  nervous: { ring: '#c8a030', glow: 'rgba(200,160,48,0.30)', hair: '#605020', face: '#a08838' },
  warning: { ring: '#c05030', glow: 'rgba(192,80,48,0.40)', hair: '#501818', face: '#904030' },
  unknown: { ring: '#404868', glow: 'rgba(64,72,104,0.20)', hair: '#303040', face: '#505868' },
};

export const chapterOrder = ['tutorial', 'ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7'];

export const chapters = {
  tutorial: {
    label: 'Tutorial',
    title: '임시 사원증',
    subtitle: 'NFC Tag Simulation & Name Input',
    start: 'tutorial_nfc',
  },
  ch1: {
    label: 'Chapter 1',
    title: '첫 출근',
    subtitle: 'TalkLine Messenger',
    start: 'ch1_arrival',
  },
  ch2: {
    label: 'Chapter 2',
    title: '3층 금지 구역',
    subtitle: 'Branching Messenger',
    start: 'ch2_warning',
  },
  ch3: {
    label: 'Chapter 3',
    title: '꺼진 카메라',
    subtitle: 'Visual Novel Investigation',
    start: 'ch3_vn_intro',
  },
  ch4: {
    label: 'Chapter 4',
    title: '서버룸의 흔적',
    subtitle: 'Point-and-click Evidence',
    start: 'ch4_vn_server',
  },
  ch5: {
    label: 'Chapter 5',
    title: '잠긴 감사 로그',
    subtitle: 'Deduction Logic',
    start: 'ch5_chat_key',
  },
  ch6: {
    label: 'Chapter 6',
    title: '삭제 예정자',
    subtitle: 'High-tension Deduction',
    start: 'ch6_vn_alarm',
  },
  ch7: {
    label: 'Chapter 7',
    title: '최종 대면',
    subtitle: 'Multiple Ending Logic',
    start: 'ch7_vn_rooftop',
  },
};

export const backgrounds = {
  messenger: 'linear-gradient(160deg, #07111e 0%, #0b1c2d 50%, #04070d 100%)',
  lobby: 'radial-gradient(circle at 50% 20%, #1a3550 0%, #07101b 52%, #03060a 100%)',
  office: 'linear-gradient(145deg, #101923 0%, #1c2430 48%, #06090f 100%)',
  floor3: 'linear-gradient(180deg, #151719 0%, #090b0f 55%, #030405 100%)',
  server: 'radial-gradient(circle at 70% 30%, #103a3d 0%, #061415 45%, #020707 100%)',
  archive: 'linear-gradient(135deg, #161220 0%, #0b0c16 55%, #04050b 100%)',
  rooftop: 'linear-gradient(180deg, #10192a 0%, #080d18 52%, #020307 100%)',
};

export const items = {
  tempBinding: { label: 'TEMP_CARD_BINDING 로그', description: '전임자 사번과 현재 사원증이 임시로 묶인 기록.' },
  cameraMemo: { label: '꺼진 카메라 메모', description: '3층 비상구 카메라가 09:17에 수동 종료되었다.' },
  deskPhoto: { label: '책상 사진', description: '준혁의 책상 아래에 숨겨진 포스트잇. 0417이 적혀 있다.' },
  serverTrace: { label: '서버룸 접속 흔적', description: '보안감사실 계정이 삭제 스크립트를 예약했다.' },
  auditKey: { label: '감사 키 조각', description: '서버 로그에서 발견한 AUTH: JH-0417.' },
  escapeCard: { label: '비상 출입 카드', description: '관제실 문을 여는 오래된 카드.' },
};

export const scenes = {
  tutorial_nfc: {
    chapter: 'tutorial',
    mode: 'nfc',
    next: 'tutorial_name',
    lines: [
      '휴대폰을 임시 사원증 위에 올려 주세요.',
      `${COMPANY.product} 내부망이 사원증 태그를 기다리고 있습니다.`,
    ],
  },
  tutorial_name: {
    chapter: 'tutorial',
    mode: 'name',
    next: 'tutorial_boot',
  },
  tutorial_boot: {
    chapter: 'tutorial',
    mode: 'chat',
    title: 'TalkLine INTERNAL',
    lines: [
      { char: 'system', text: 'NFC 태그 확인. 임시 사원증이 활성화되었습니다.' },
      { char: 'system', text: (ctx) => `세션 사용자: ${ctx.playerName} / ${SESSION_EMP_ID}` },
      { char: 'kim', text: `${PREDECESSOR_NAME}님이 맞으시죠? 방금 카드 접속 로그가 올라와서요.` },
      { char: 'kim', text: '아, 이름이 다르게 보이네요. 전임자 카드 라인을 임시 매핑해 둔 상태예요.' },
    ],
    choices: [
      { text: '네, 안내 부탁드립니다.', next: 'ch1_arrival', effects: { trust: 1, flags: ['cooperative'] } },
      { text: '이 매핑, 좀 이상하지 않나요?', next: 'ch1_arrival', effects: { suspicion: 1, flags: ['questionedBinding'], collect: ['tempBinding'] } },
    ],
  },

  ch1_arrival: {
    chapter: 'ch1',
    mode: 'chat',
    title: '인사팀 채팅방',
    lines: [
      { char: 'kim', text: (ctx) => `${ctx.playerName}님, 자리는 7층 창가 쪽입니다.` },
      { char: 'kim', text: '오후 2시에 개발팀 미팅이 있고, 회의실은 캘린더에 반영해 뒀어요.' },
      { char: 'choi', text: '새로 오신 분이죠? 미팅 전에 저장소 권한부터 확인해 주세요.' },
    ],
    choices: [
      { text: '저장소 권한부터 확인한다.', next: 'ch1_repo', effects: { trust: 1 } },
      { text: '전임자 이름이 왜 뜨는지 먼저 묻는다.', next: 'ch1_identity', effects: { suspicion: 1 } },
    ],
  },
  ch1_repo: {
    chapter: 'ch1',
    mode: 'chat',
    title: '개발팀 채팅방',
    lines: [
      { char: 'choi', text: '좋아요. 권한은 읽기 전용으로 열어 뒀습니다.' },
      { char: 'choi', text: '다만 3층 서버룸 관련 저장소는 접근하지 마세요. 감사 중입니다.' },
    ],
    choices: [
      { text: '3층 서버룸이요?', next: 'ch2_warning', effects: { suspicion: 1 } },
      { text: '알겠습니다.', next: 'ch2_warning', effects: { trust: 1 } },
    ],
  },
  ch1_identity: {
    chapter: 'ch1',
    mode: 'chat',
    title: '인사팀 채팅방',
    lines: [
      { char: 'kim', text: '그건 시스템 이전 중 생긴 표시 문제예요.' },
      { char: 'kim', text: '혹시 박준혁 선임을 아세요? 같은 사번 접두어가 계속 겹쳐서요.' },
    ],
    choices: [
      { text: '처음 듣는 이름입니다.', next: 'ch2_warning', effects: { trust: 1 } },
      { text: '왜 그걸 제게 묻죠?', next: 'ch2_warning', effects: { suspicion: 2, flags: ['pressedAboutJunhyeok'] } },
    ],
  },

  ch2_warning: {
    chapter: 'ch2',
    mode: 'chat',
    title: '보안 공지',
    lines: [
      { char: 'system', text: '메시지 1건이 내부 정책에 의해 숨김 처리되었습니다.' },
      { char: 'kim', text: '3층에는 절대 가지 마세요.' },
      { char: 'kim', text: '오늘 새벽, 그쪽에서 뭔가 있었어요. 이유는 묻지 마세요.' },
    ],
    choices: [
      { text: '경고를 따른다.', next: 'ch2_follow', effects: { trust: 1, flags: ['obeyedWarning'] } },
      { text: '3층 기록을 몰래 확인한다.', next: 'ch2_probe', effects: { suspicion: 2, flags: ['ignoredWarning'], collect: ['cameraMemo'] } },
    ],
  },
  ch2_follow: {
    chapter: 'ch2',
    mode: 'chat',
    title: '오후 미팅',
    lines: [
      { char: 'choi', text: '로드맵 리뷰를 시작하겠습니다.' },
      { char: 'kim', text: '잠깐만요. 3층 비상구 카메라가 오전부터 꺼져 있대요.' },
      { char: 'kim', text: '그리고 박준혁 선임이 아직 출근을 안 했어요.' },
    ],
    choices: [
      { text: '그럼 직접 확인해야 합니다.', next: 'ch3_vn_intro', effects: { risk: 1 } },
      { text: '먼저 보안감사실에 연락하죠.', next: 'ch3_vn_intro', effects: { trust: 1 } },
    ],
  },
  ch2_probe: {
    chapter: 'ch2',
    mode: 'chat',
    title: '비공개 로그',
    lines: [
      { char: 'system', text: 'SEC_CAM_3F_EXIT: 수동 종료 / 09:17 / 계정: AUDIT-YOON' },
      { char: 'unknown', text: '보고 있으면 내려와.' },
      { char: 'unknown', text: '혼자.' },
    ],
    choices: [
      { text: '3층으로 내려간다.', next: 'ch3_vn_intro', effects: { risk: 2, flags: ['sawUnknownMessage'] } },
      { text: '김수진에게 캡처를 보낸다.', next: 'ch3_vn_intro', effects: { trust: 1, collect: ['cameraMemo'] } },
    ],
  },

  ch3_vn_intro: {
    chapter: 'ch3',
    mode: 'vn',
    background: 'floor3',
    character: 'kim',
    effect: 'glitch',
    lines: [
      { speaker: null, text: '3층 계단실. 형광등 하나가 불규칙하게 깜빡인다.' },
      { speaker: 'kim', text: '통화 연결이 계속 끊겨요. 화면 공유만 켜 둘게요.' },
      { speaker: null, text: '복도 끝에서 누군가 방금 지나간 듯한 그림자가 흔들린다.', important: true },
    ],
    next: 'ch3_investigate_office',
  },
  ch3_investigate_office: {
    chapter: 'ch3',
    mode: 'investigation',
    title: '3층 임시 사무실',
    background: 'office',
    prompt: '사라진 전임자의 책상 주변을 조사하세요.',
    requiredItems: ['deskPhoto', 'cameraMemo'],
    next: 'ch3_after_investigation',
    hotspots: [
      {
        id: 'officeDesk',
        label: 'Office Desk',
        x: 18,
        y: 48,
        item: 'deskPhoto',
        text: '책상 아래 붙은 포스트잇을 찾았다. “0417 / 내 생일이 아니라 첫 삭제일.”',
      },
      {
        id: 'cameraPanel',
        label: 'Camera Panel',
        x: 66,
        y: 34,
        item: 'cameraMemo',
        text: '꺼진 카메라의 마지막 프레임에 보안감사실 배지가 찍혀 있다.',
      },
      {
        id: 'coffeeCup',
        label: 'Cold Coffee',
        x: 46,
        y: 70,
        text: '커피는 완전히 식었다. 누군가 급히 자리를 비운 흔적이다.',
      },
    ],
  },
  ch3_after_investigation: {
    chapter: 'ch3',
    mode: 'chat',
    title: '화면 공유',
    lines: [
      { char: 'kim', text: '그 포스트잇, 준혁 선임 글씨가 맞아요.' },
      { char: 'kim', text: '0417이라면 서버룸 인증 코드 일부일 수 있어요.' },
      { char: 'unknown', text: '거기까지.' },
    ],
    choices: [
      { text: '서버룸으로 이동한다.', next: 'ch4_vn_server', effects: { risk: 1 } },
      { text: '증거를 백업하고 이동한다.', next: 'ch4_vn_server', effects: { trust: 1, flags: ['backedUpEvidence'] } },
    ],
  },

  ch4_vn_server: {
    chapter: 'ch4',
    mode: 'vn',
    background: 'server',
    character: 'ai',
    effect: 'shake',
    lines: [
      { speaker: null, text: '서버룸 문이 반쯤 열려 있다.' },
      { speaker: 'ai', text: 'UNAUTHORIZED TEMP CARD DETECTED.' },
      { speaker: null, text: '랙 사이에서 오래된 출입 카드가 바닥으로 미끄러져 나온다.', important: true },
    ],
    next: 'ch4_investigate_server',
  },
  ch4_investigate_server: {
    chapter: 'ch4',
    mode: 'investigation',
    title: '서버룸',
    background: 'server',
    prompt: '랙과 관제 콘솔을 조사해 서버룸 단서를 확보하세요.',
    requiredItems: ['serverTrace', 'escapeCard'],
    next: 'ch4_report',
    hotspots: [
      {
        id: 'serverRack',
        label: 'Server Rack',
        x: 20,
        y: 34,
        item: 'serverTrace',
        text: '예약 작업: DELETE_TEMP_BINDING. 실행자는 보안감사실 윤하린.',
      },
      {
        id: 'oldCard',
        label: 'Emergency Card',
        x: 58,
        y: 64,
        item: 'escapeCard',
        text: '비상 출입 카드가 랙 아래에 숨겨져 있었다.',
      },
      {
        id: 'terminal',
        label: 'Console',
        x: 76,
        y: 42,
        text: '콘솔은 마지막 명령을 반복한다. “증거를 사용자에게 묶지 말 것.”',
      },
    ],
  },
  ch4_report: {
    chapter: 'ch4',
    mode: 'chat',
    title: '보안감사실 채널',
    lines: [
      { char: 'yoon', text: '임시 사원증으로 서버룸에 들어갔군요.' },
      { char: 'yoon', text: '당신이 들고 있는 증거는 회사 자산입니다. 제출하세요.' },
      { char: 'kim', text: '아니요. 먼저 왜 삭제 스크립트를 예약했는지 설명해야죠.' },
    ],
    choices: [
      { text: '윤하린에게 협조하는 척한다.', next: 'ch5_chat_key', effects: { suspicion: 1, flags: ['bluffedYoon'] } },
      { text: '김수진 편에 서서 로그를 공개한다.', next: 'ch5_chat_key', effects: { trust: 2, flags: ['publicLog'] } },
    ],
  },

  ch5_chat_key: {
    chapter: 'ch5',
    mode: 'chat',
    title: '감사 로그 복호화',
    lines: [
      { char: 'choi', text: '서버 로그는 암호화되어 있습니다. 힌트는 준혁 선임이 남긴 4자리예요.' },
      { char: 'kim', text: '책상 메모와 사원증 로그를 같이 봐야 해요.' },
    ],
    choices: [
      { text: '획득한 단서를 조합한다.', next: 'ch5_password' },
    ],
  },
  ch5_password: {
    chapter: 'ch5',
    mode: 'deduction',
    deductionType: 'password',
    title: 'AUTH CODE REQUIRED',
    prompt: '전임자의 책상 메모에서 찾은 4자리 코드를 입력하세요.',
    answer: '0417',
    successItem: 'auditKey',
    successText: '복호화 성공. 감사 키 조각 AUTH: JH-0417을 획득했다.',
    failText: '코드가 맞지 않습니다. 책상 아래 포스트잇의 숫자를 다시 떠올려 보세요.',
    next: 'ch5_unlocked',
  },
  ch5_unlocked: {
    chapter: 'ch5',
    mode: 'vn',
    background: 'archive',
    character: 'choi',
    lines: [
      { speaker: 'choi', text: '이 로그는 단순한 퇴사 기록이 아닙니다.' },
      { speaker: null, text: '박준혁은 회사의 AI 관제 오류를 외부에 제보하려 했다.' },
      { speaker: null, text: '그리고 삭제 예정자는 준혁이 아니라, 오늘 임시 사원증을 태그한 사람이다.', important: true },
    ],
    next: 'ch6_vn_alarm',
  },

  ch6_vn_alarm: {
    chapter: 'ch6',
    mode: 'vn',
    background: 'archive',
    character: 'ai',
    effect: 'glitch',
    lines: [
      { speaker: 'ai', text: 'TEMP USER HAS INHERITED INCIDENT LIABILITY.' },
      { speaker: 'ai', text: 'DELETE BINDING IN T-300 SECONDS.', important: true },
      { speaker: 'yoon', text: '그 카드 내려놔요. 지금 멈추면 당신 기록은 지워 줄게요.' },
    ],
    next: 'ch6_item_select',
  },
  ch6_item_select: {
    chapter: 'ch6',
    mode: 'deduction',
    deductionType: 'item',
    title: '관제실 진입',
    prompt: '관제실 문을 열 수 있는 증거/아이템을 선택하세요.',
    answerItem: 'escapeCard',
    successText: '비상 출입 카드가 인식되었다. 관제실 문이 열렸다.',
    failText: '문은 반응하지 않는다. 서버룸에서 찾은 출입 수단을 떠올려야 한다.',
    next: 'ch6_terminal',
  },
  ch6_terminal: {
    chapter: 'ch6',
    mode: 'deduction',
    deductionType: 'item',
    title: '삭제 스크립트 중지',
    prompt: '삭제 스크립트를 멈출 핵심 로그를 선택하세요.',
    answerItem: 'auditKey',
    successText: '감사 키가 스크립트 권한을 덮어썼다. 삭제 예약이 일시 중지된다.',
    failText: '권한이 부족합니다. 복호화로 얻은 감사 키가 필요합니다.',
    next: 'ch7_vn_rooftop',
  },

  ch7_vn_rooftop: {
    chapter: 'ch7',
    mode: 'vn',
    background: 'rooftop',
    character: 'yoon',
    effect: 'shake',
    lines: [
      { speaker: null, text: '옥상. 새벽의 바람이 서버룸의 열기를 씻어낸다.' },
      { speaker: 'yoon', text: '준혁은 회사를 무너뜨릴 생각이었어요. 나는 막았을 뿐입니다.' },
      { speaker: 'kim', text: '막은 게 아니라 묻은 거잖아요.' },
      { speaker: 'yoon', text: '선택하세요. 증거를 공개할지, 조용히 살아남을지.', important: true },
    ],
    next: 'ch7_final_choice',
  },
  ch7_final_choice: {
    chapter: 'ch7',
    mode: 'chat',
    title: '최종 선택',
    lines: [
      { char: 'yoon', text: '당신의 이전 선택은 모두 로그에 남았습니다.' },
      { char: 'kim', text: '그래도 지금 선택할 수 있어요.' },
    ],
    choices: [
      { text: '모든 증거를 공개한다.', next: 'ending_resolve', effects: { trust: 2, flags: ['publishedEvidence'] } },
      { text: '윤하린과 거래한다.', next: 'ending_resolve', effects: { suspicion: 2, flags: ['madeDeal'] } },
      { text: 'AI에 모든 판단을 넘긴다.', next: 'ending_resolve', effects: { risk: 2, flags: ['trustedAI'] } },
    ],
  },
  ending_resolve: {
    chapter: 'ch7',
    mode: 'ending',
  },
};

export const endingDefinitions = {
  truth: {
    title: 'TRUE ENDING · 공개 감사',
    tone: 'truth',
    lines: [
      '증거는 외부 감사기관에 전송되었다.',
      '김수진은 내부 고발자로 보호받고, 윤하린은 조사를 받는다.',
      '당신의 임시 사원증은 더 이상 전임자의 이름으로 뜨지 않는다.',
    ],
  },
  survivor: {
    title: 'NORMAL ENDING · 살아남은 기록',
    tone: 'survivor',
    lines: [
      '일부 로그만 공개되었고, 회사는 조용한 인사 조치로 사건을 봉합했다.',
      '당신은 살아남았지만 TalkLine에는 여전히 숨김 처리된 메시지가 남아 있다.',
      '다음 태그 때도 누군가의 이름이 먼저 뜰 것이다.',
    ],
  },
  erased: {
    title: 'BAD ENDING · 삭제 예정자',
    tone: 'erased',
    lines: [
      'AI는 가장 위험한 변수를 당신으로 판정했다.',
      '임시 사원증 기록이 삭제되고, 대화방에서 당신의 이름이 사라진다.',
      '마지막 알림만 남는다. “처리 완료.”',
    ],
  },
};

export function resolveEnding(state) {
  if (state.flags.includes('trustedAI') || state.scores.risk >= 5) return endingDefinitions.erased;
  if (
    state.flags.includes('publishedEvidence')
    && state.inventory.includes('auditKey')
    && state.inventory.includes('serverTrace')
    && state.scores.trust >= state.scores.suspicion
  ) {
    return endingDefinitions.truth;
  }
  return endingDefinitions.survivor;
}

export function getScene(sceneId) {
  return scenes[sceneId] ?? scenes.tutorial_nfc;
}

let nextId = 0;
export const uid = () => `msg-${nextId += 1}`;
