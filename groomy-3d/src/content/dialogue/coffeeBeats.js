export const KANG_ISOL_COFFEE_BEATS_PART1 = Object.freeze([
  { id: 'isol-c1-01', type: 'dialogue', presentation: 'vn', speaker: '강이솔', text: '오셨네요.', next: 'isol-c1-02' },
  { id: 'isol-c1-02', type: 'dialogue', presentation: 'vn', speaker: '강이솔', text: '커피 내리는 법은 아시죠?', next: 'isol-c1-03' },
  { id: 'isol-c1-03', type: 'dialogue', presentation: 'vn', speaker: '강이솔', text: '아니다, 그쪽이 실수하면 제가 곤란하니까.', next: 'isol-c1-04' },
  { id: 'isol-c1-04', type: 'dialogue', presentation: 'vn', speaker: '강이솔', text: '알려드릴게요.', next: 'isol-c1-then' },
  { id: 'isol-c1-then', type: 'dialogue', presentation: 'vn', speaker: '주인공', text: '그러면...', next: null },
])

export const KANG_ISOL_COFFEE_BEATS_PART2 = Object.freeze([
  { id: 'isol-c2-01', type: 'dialogue', presentation: 'vn', auto: true, speaker: '강이솔', text: '팀장님은 투 샷. 대리님은 원 샷.', next: 'isol-c2-02' },
  { id: 'isol-c2-02', type: 'dialogue', presentation: 'vn', auto: true, speaker: '강이솔', text: '그 멍청한 로봇도 꼴에 커피를 마시긴 해요.', next: 'isol-c2-03' },
  { id: 'isol-c2-03', type: 'dialogue', presentation: 'vn', auto: true, speaker: '강이솔', text: '샷 다섯 번 넣으시면 됩니다.', next: 'isol-c2-04' },
  { id: 'isol-c2-04', type: 'dialogue', presentation: 'vn', auto: true, speaker: '강이솔', text: '솔직히 별 의미도 없죠.', next: 'isol-c2-05' },
  { id: 'isol-c2-05', type: 'dialogue', presentation: 'vn', auto: true, speaker: '강이솔', text: 'AR이 확산되면 이런 쓸모없는 문화도 사라질까 했는데.', next: 'isol-c2-06' },
  { id: 'isol-c2-06', type: 'dialogue', presentation: 'vn', auto: true, speaker: '강이솔', text: '그래요. 말은 그만 할게요.', next: 'isol-c2-07' },
  { id: 'isol-c2-07', type: 'dialogue', presentation: 'vn', auto: true, speaker: '강이솔', text: '커피 타서 직원 분들한테 인사나 돌리고 와요.', next: 'isol-c2-08' },
  { id: 'isol-c2-08', type: 'dialogue', presentation: 'vn', auto: true, speaker: '강이솔', text: '그 후에 회의가 있어요.', next: 'isol-c2-09' },
  { id: 'isol-c2-09', type: 'dialogue', presentation: 'vn', auto: true, speaker: '강이솔', text: '신입 씨는 다른 사람 명의로 자리나 채워주시면 되는데.', next: 'isol-c2-10' },
  { id: 'isol-c2-10', type: 'dialogue', presentation: 'vn', auto: true, speaker: '강이솔', text: '괜히 의견 내거나, 쓸데없는 소리는 자제해요.', next: 'isol-c2-11' },
  { id: 'isol-c2-11', type: 'dialogue', presentation: 'vn', auto: true, speaker: '강이솔', text: '그 쪽은 지금 머릿수 채우는 용도니까.', next: 'isol-c2-12' },
  { id: 'isol-c2-12', type: 'dialogue', presentation: 'vn', auto: true, speaker: '강이솔', text: '아, 말이 길었죠? 커피 타요.', next: null },
])

export const KANG_ISOL_COFFEE_BEATS = Object.freeze([
  ...KANG_ISOL_COFFEE_BEATS_PART1,
  ...KANG_ISOL_COFFEE_BEATS_PART2,
])

export const KANG_ISOL_COFFEE_NUDGE_BEATS = Object.freeze([
  {
    id: 'isol-c-nudge-01',
    type: 'dialogue',
    presentation: 'vn',
    speaker: '강이솔',
    text: '...나한테 물어보기 전에 본인이 최소한의 노력은 해야 하지 않겠어요? 머신도 안 가보고 다시 말을 거시네.',
    next: null,
  },
])
