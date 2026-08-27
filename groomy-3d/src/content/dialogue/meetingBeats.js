/** 회의실 → 출구 → 계단실 시체 구간 대사 (원문 고정) */

const n = (id, text, next) => ({
  id,
  type: 'dialogue',
  presentation: 'vn',
  speaker: '',
  text,
  next,
})

const p = (id, text, next) => ({
  id,
  type: 'dialogue',
  presentation: 'vn',
  speaker: '주인공',
  text,
  next,
})

const c = (id, speaker, text, next) => ({
  id,
  type: 'dialogue',
  presentation: 'vn',
  speaker,
  text,
  next,
})

/** 회의 오프닝 → Y/N → 분기 → 퇴장 속마음 */
export const MEETING_SESSION_BEATS = Object.freeze([
  n('meet-01', '회의실의 적막이 무게를 누른다.', 'meet-02'),
  n('meet-02', '귀가 들리지 않는다.', 'meet-03'),
  n('meet-03', '텍스트가 보이지 않는다.', 'meet-04'),
  n('meet-04', '…', 'meet-05'),
  n('meet-05', '(최민준 팀장이 격하게 화를 내고 있는 것 같다.)', 'meet-06'),
  n('meet-06', '(김수진 대리는 귀찮은 듯하다.)', 'meet-07'),
  n('meet-07', '(강이솔 사수는 꽤나 익숙한 것 같은데.)', 'meet-08'),
  n('meet-08', '보이는 걸로만 판단해야 해.', 'meet-09'),
  n('meet-09', '(최민준 팀장이 이 쪽을 돌아본다.)', 'meet-10'),
  p('meet-10', '(… 나한테 의견을 묻는 건가?)', 'meet-choice'),
  {
    id: 'meet-choice',
    type: 'choice',
    presentation: 'vn',
    speaker: '주인공',
    text: null,
    choices: [
      { id: 'y', text: 'Y', next: 'meet-y-01' },
      { id: 'n', text: 'N', next: 'meet-n-01' },
    ],
  },
  p('meet-y-01', '(무슨 말인지는 잘 들리지 않지만…)', 'meet-y-02'),
  p('meet-y-02', '(대충 고개를 끄덕였다.)', 'meet-y-03'),
  n('meet-y-03', '(그 후로도 의미없는 대화가 오갔다.)', 'meet-y-04'),
  n('meet-y-04', '(…)', 'meet-y-05'),
  n('meet-y-05', '(회의가 마무리 되었다.)', 'meet-leave-01'),
  p('meet-n-01', '(알아듣지 못했으니 고개를 저었다.)', 'meet-n-02'),
  n('meet-n-02', '(최민준 팀장의 표정이 굳었다.)', 'meet-n-03'),
  n('meet-n-03', '(이내 옅은 미소가 얼굴에 자리잡는다.)', 'meet-n-04'),
  c('meet-n-04', '최민준', '역시 당신은,', 'meet-n-05'),
  c('meet-n-05', '최민준', '…', 'meet-n-06'),
  c('meet-n-06', '최민준', '존경스럽네.', 'meet-n-07'),
  p('meet-n-07', '(… 잠깐, 목소리가 들렸어?)', 'meet-n-08'),
  n('meet-n-08', '(이 후로 목소리가 들리는 일은 없었다.)', 'meet-n-09'),
  n('meet-n-09', '(아마 착각이였을까.)', 'meet-n-10'),
  n('meet-n-10', '(곧이어 회의가 마무리 되었다.)', 'meet-leave-01'),
  p('meet-leave-01', '(… 오늘은 그루미가 데리러 오지 않는 건가?)', 'meet-leave-02'),
  p('meet-leave-02', '(어디로 가야 하지.)', 'meet-leave-03'),
  p('meet-leave-03', '(…)', 'meet-leave-04'),
  p('meet-leave-04', '(일단 나가보기로 했다.)', null),
])

export const MEETING_DOOR_THOUGHT_BEATS = Object.freeze([
  p('meet-door-01', '(… 이게 문 맞겠지?)', null),
])

export const MEETING_DOOR_EXIT_CHOICE_BEATS = Object.freeze([
  {
    id: 'meet-door-choice',
    type: 'choice',
    presentation: 'vn',
    speaker: '주인공',
    text: '나갈까?',
    choices: [
      { id: 'y', text: 'Y', next: null },
      { id: 'n', text: 'N', next: null },
    ],
  },
])

export const STAIR_DOWN_BLOCKED_BEATS = Object.freeze([
  p('stair-down-01', '(… 내려갈 수가 없네.)', 'stair-down-02'),
  n('stair-down-02', '(다른 출구는 없는 것 같은데.)', 'stair-down-03'),
  p('stair-down-03', '(윗 층 비상구를 이용할까?)', null),
])

export const CORPSE_DISCOVER_BEATS = Object.freeze([
  n('corpse-d-01', '(…)', 'corpse-d-02'),
  n('corpse-d-02', '(계단 한쪽에 무언가가 쓰러져 있다.)', 'corpse-d-03'),
  n('corpse-d-03', '(사람처럼 보인다.)', 'corpse-d-04'),
  n('corpse-d-04', '(조금 더 가까이 다가갔다.)', 'corpse-d-05'),
  p('corpse-d-05', '… 이게.', 'corpse-d-06'),
  p('corpse-d-06', '이게 뭐지?', 'corpse-d-noise'),
  { id: 'corpse-d-noise', type: 'effect', effect: 'screen-noise', next: 'corpse-g-01' },
  c('corpse-g-01', '그루미', '아, 내 실수입니다.', 'corpse-g-02'),
  c('corpse-g-02', '그루미', '늦게 데리러 와서 미안해요.', 'corpse-g-03'),
  c('corpse-g-03', '그루미', '… 갈까요?', null),
])

/** E 조사 — 타이머에 의해 중간에 끊김 */
export const CORPSE_INSPECT_BEATS = Object.freeze([
  n('corpse-i-01', '급하게 시체를 훑었다.', 'corpse-i-02'),
  n('corpse-i-02', '목에는 졸린 자국이 있고.', 'corpse-i-03'),
  n('corpse-i-03', '계단에서 떨어진 듯한-', null),
])

export const CORPSE_AFTER_TIMER_BEATS = Object.freeze([
  { id: 'corpse-a-noise', type: 'effect', effect: 'screen-noise', next: 'corpse-a-01' },
  p('corpse-a-01', '(… 확인을 했어야 했는데-)', 'corpse-a-02'),
  c('corpse-a-02', '그루미', '당신 시각칩이 손상되어서 다행이에요.', 'corpse-a-03'),
  c('corpse-a-03', '그루미', '쥐의 사체 같은 건 역겹잖아요.', 'corpse-a-04'),
  c('corpse-a-04', '그루미', '그래픽 오류에요.', 'corpse-a-05'),
  c('corpse-a-05', '그루미', '걱정마세요.', 'corpse-a-06'),
  c('corpse-a-06', '그루미', '아시다시피 여기서는.', 'corpse-a-07'),
  c('corpse-a-07', '그루미', '대부분은 실제로 다치지 않아요.', 'corpse-a-08'),
  c('corpse-a-08', '그루미', '잘 부탁해요. {{user}}.', null),
])
