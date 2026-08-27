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

/** 커피 이후 강이솔 → 전화 노이즈로 끊김 */
export const KANG_ISOL_POST_COFFEE_BEATS = Object.freeze([
  { id: 'isol-pc-01', type: 'dialogue', presentation: 'vn', speaker: '강이솔', text: '잘 했어요.', next: 'isol-pc-02' },
  { id: 'isol-pc-02', type: 'dialogue', presentation: 'vn', speaker: '강이솔', text: '그런데, 서이 씨.', next: 'isol-pc-03' },
  { id: 'isol-pc-03', type: 'dialogue', presentation: 'vn', speaker: '강이솔', text: '궁금해서 묻는 건데요.', next: 'isol-pc-04' },
  { id: 'isol-pc-04', type: 'dialogue', presentation: 'vn', speaker: '강이솔', text: '원래...', next: 'isol-pc-noise' },
  { id: 'isol-pc-noise', type: 'effect', effect: 'screen-noise', next: null },
])

export const GROOMY_CALL_BEATS = Object.freeze([
  { id: 'groomy-call-01', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '미안해요.', next: 'groomy-call-02' },
  { id: 'groomy-call-02', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '여기 씨발, 내가.', next: 'groomy-call-03' },
  { id: 'groomy-call-03', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '아, 날짜를 실수로.', next: 'groomy-call-04' },
  { id: 'groomy-call-04', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '그 전이네.', next: 'groomy-call-05' },
  { id: 'groomy-call-05', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '내가, 내 잘못이니까.', next: 'groomy-call-06' },
  { id: 'groomy-call-06', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '잠깐만, 응.', next: 'groomy-call-07' },
  { id: 'groomy-call-07', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '회의실 자리를 안 채우면 넘어가지지 않던 이유가', next: 'groomy-call-08' },
  { id: 'groomy-call-08', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '그 날이라 그런 거였어, 그래. 그러니까.', next: 'groomy-call-09' },
  { id: 'groomy-call-09', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '돌려 줄게요.', next: 'groomy-call-10' },
  { id: 'groomy-call-10', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '잠시만 기다려줄래요?', next: 'groomy-call-11' },
  { id: 'groomy-call-11', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '아까 그 방에서 기다려 줘요.', next: 'groomy-call-12' },
  { id: 'groomy-call-12', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '데이터가. 아.', next: 'groomy-call-13' },
  { id: 'groomy-call-13', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '... 혹시해서 하는 말인데.', next: 'groomy-call-14' },
  { id: 'groomy-call-14', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '아무것도, 건들지 마세요.', next: 'groomy-call-15' },
  { id: 'groomy-call-15', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '위험하니까.', next: 'groomy-call-16' },
  { id: 'groomy-call-16', type: 'dialogue', presentation: 'vn', speaker: '', text: '(어지러운 것 같다.)', auto: true, timing: 'fast', next: 'groomy-call-17' },
  { id: 'groomy-call-17', type: 'dialogue', presentation: 'vn', speaker: '', text: '(머리가)', auto: true, timing: 'fast', next: 'groomy-call-blink' },
  { id: 'groomy-call-blink', type: 'effect', effect: 'eye-blink', next: null },
])

const groomyRet = (id, text, next) => ({
  id,
  type: 'dialogue',
  presentation: 'vn',
  speaker: '그루미',
  text,
  next,
})

/** 파편 전부 상호작용 후 복귀 전화 — 분기 → 공통 */
export const GROOMY_RETURN_CALL_COMMON_BEATS = Object.freeze([
  groomyRet('groomy-ret-c-01', '7층을 둘러보게 둘까 싶었는데.', 'groomy-ret-c-02'),
  groomyRet('groomy-ret-c-02', '지금 상태로는 위험할 것 같아서.', 'groomy-ret-c-03'),
  groomyRet('groomy-ret-c-03', '회의실로 이송할게요.', 'groomy-ret-c-04'),
  groomyRet('groomy-ret-c-04', '이제 직원들이 이름을 헷갈리지는 않을 거에요.', 'groomy-ret-c-05'),
  groomyRet('groomy-ret-c-05', '머릿수만 채우면 되는 거에요.', 'groomy-ret-c-06'),
  groomyRet('groomy-ret-c-06', '무리하지 마세요.', null),
])

export const GROOMY_RETURN_CALL_COLLECTED_BEATS = Object.freeze([
  groomyRet('groomy-ret-all-01', '내 말을 듣는 법이 없지?', 'groomy-ret-all-02'),
  groomyRet('groomy-ret-all-02', '대체 씨발, 무슨 짓을 한 거야?', 'groomy-ret-all-03'),
  groomyRet('groomy-ret-all-03', '머리가 깨질 것 같다고.', 'groomy-ret-all-04'),
  groomyRet('groomy-ret-all-04', '같이 있으면 너 처럼 기억을 잃은 머저리가 되는 건가?', 'groomy-ret-all-05'),
  groomyRet('groomy-ret-all-05', '...아, 죄송합니다.', 'groomy-ret-all-06'),
  groomyRet('groomy-ret-all-06', '방금 건 내부 디버그 문장이었어요.', 'groomy-ret-all-07'),
  groomyRet('groomy-ret-all-07', '서버 오류를 해결하고 왔어요.', 'groomy-ret-all-08'),
  groomyRet('groomy-ret-all-08', '당신 덕분에 또 버그가 난 것 같지만.', 'groomy-ret-all-09'),
  groomyRet('groomy-ret-all-09', '책임은 당신 몫이죠.', 'groomy-ret-c-01'),
  ...GROOMY_RETURN_CALL_COMMON_BEATS,
])

export const GROOMY_RETURN_CALL_TIMEOUT_BEATS = Object.freeze([
  groomyRet('groomy-ret-to-01', '기다려주셔서 고마워요.', 'groomy-ret-to-02'),
  groomyRet('groomy-ret-to-02', '서버 오류를 해결하고 왔어요.', 'groomy-ret-to-03'),
  groomyRet('groomy-ret-to-03', '워낙 구식이라.', 'groomy-ret-to-04'),
  groomyRet('groomy-ret-to-04', '힘들어서요.', 'groomy-ret-to-05'),
  groomyRet('groomy-ret-to-05', '조금 걸렸네요.', 'groomy-ret-c-01'),
  ...GROOMY_RETURN_CALL_COMMON_BEATS,
])

export function buildGroomyReturnCallBeats({ timedOut = false } = {}) {
  return timedOut ? GROOMY_RETURN_CALL_TIMEOUT_BEATS : GROOMY_RETURN_CALL_COLLECTED_BEATS
}

export const MINJUN_DELIVERY_BEATS = Object.freeze([
  { id: 'minjun-d-01', type: 'dialogue', presentation: 'vn', speaker: '최민준', text: '아, 커피 고마워요.', next: 'minjun-d-02' },
  { id: 'minjun-d-02', type: 'dialogue', presentation: 'vn', speaker: '최민준', text: '수고했어요.', next: 'minjun-d-03' },
  { id: 'minjun-d-03', type: 'dialogue', presentation: 'vn', speaker: '최민준', text: '박서이 씨는 항상 상냥하시네요.', next: 'minjun-d-04' },
  { id: 'minjun-d-04', type: 'dialogue', presentation: 'vn', speaker: '', text: '(예의상 하는 말이라기에는 미소가 짙다.)', next: 'minjun-d-05' },
  { id: 'minjun-d-05', type: 'dialogue', presentation: 'vn', speaker: '최민준', text: '...저기, 이번 프로젝트가 끝나면. 저랑 같이-', next: 'minjun-d-choice' },
  {
    id: 'minjun-d-choice',
    type: 'choice',
    presentation: 'vn',
    speaker: '주인공',
    text: null,
    choices: [
      { id: 'corrected', text: '저는 {{user}}인데요.', next: 'minjun-d-a01' },
      { id: 'accepted', text: '좋아요.', next: 'minjun-d-b01' },
    ],
  },
  { id: 'minjun-d-a01', type: 'dialogue', presentation: 'vn', speaker: '최민준', text: '정말 미안해요.', next: 'minjun-d-a02' },
  { id: 'minjun-d-a02', type: 'dialogue', presentation: 'vn', speaker: '최민준', text: '스킨이 잘못 씌워진 건가?', next: 'minjun-d-a03' },
  { id: 'minjun-d-a03', type: 'dialogue', presentation: 'vn', speaker: '최민준', text: '꼭... 아. 정말 미안해요.', next: 'minjun-d-a04' },
  { id: 'minjun-d-a04', type: 'dialogue', presentation: 'vn', speaker: '최민준', text: '잊어줘요.', next: null },
  { id: 'minjun-d-b01', type: 'dialogue', presentation: 'vn', speaker: '최민준', text: '실제로 만나보고 싶어요.', next: 'minjun-d-b02' },
  { id: 'minjun-d-b02', type: 'dialogue', presentation: 'vn', speaker: '최민준', text: '이 공간에서는 한계가 있으니까.', next: 'minjun-d-b03' },
  { id: 'minjun-d-b03', type: 'dialogue', presentation: 'vn', speaker: '최민준', text: '어디 거주하시는 지는 알 수 없어도.', next: 'minjun-d-b04' },
  { id: 'minjun-d-b04', type: 'dialogue', presentation: 'vn', speaker: '최민준', text: '... 근사한 레스토랑에서, 식사를 대접하고 싶네요.', next: 'minjun-d-b05' },
  { id: 'minjun-d-b05', type: 'dialogue', presentation: 'vn', speaker: '최민준', text: '이 쪽 미각모듈은 아직 모자란 게 많으니까요.', next: null },
])

const SUJIN_RUNON_1 =
  '아서버가터졌어요?로컬에서는잘됐는데잠시만요죄송합니다죄송합니다아하하그래도박서이씨는항상상냥하셔서너무감사해요여기서유일하게당신이상냥해이빌어먹을회사다엎고싶다네,네.2월7일까지완료할게요네그럴게요네감사합니다정말'
const SUJIN_RUNON_2 =
  '죄송합니다잠시만요아니그렇게하면그런구조는안돼요아니그러면다깨지는데아니알겠습니다죄송합니다'

export const SUJIN_DELIVERY_BEATS = Object.freeze([
  { id: 'sujin-d-01', type: 'dialogue', presentation: 'vn', speaker: '김수진', text: '안녕하세요.', next: 'sujin-d-02' },
  { id: 'sujin-d-02', type: 'dialogue', presentation: 'vn', speaker: '김수진', text: '신입이라고 들었어요.', next: 'sujin-d-03' },
  { id: 'sujin-d-03', type: 'dialogue', presentation: 'vn', speaker: '김수진', text: '커피 고마워요.', next: 'sujin-d-04' },
  { id: 'sujin-d-04', type: 'dialogue', presentation: 'vn', speaker: '김수진', text: '저는 김수진 대리라고 해요.', next: 'sujin-d-05' },
  { id: 'sujin-d-05', type: 'dialogue', presentation: 'vn', speaker: '김수진', text: '직무는-', next: 'sujin-d-06' },
  { id: 'sujin-d-06', type: 'dialogue', presentation: 'vn', speaker: '', text: '(전화벨 소리가 울린다.)', next: 'sujin-d-07' },
  { id: 'sujin-d-07', type: 'dialogue', presentation: 'vn', speaker: '김수진', text: '아, 잠시만요.', next: 'sujin-d-08' },
  {
    id: 'sujin-d-08',
    type: 'dialogue',
    presentation: 'vn',
    speaker: '김수진',
    text: SUJIN_RUNON_1,
    style: 'runon',
    typingSpeed: 'fast',
    next: 'sujin-d-09',
  },
  { id: 'sujin-d-09', type: 'dialogue', presentation: 'vn', speaker: '', text: '(5분 후)', next: 'sujin-d-10' },
  {
    id: 'sujin-d-10',
    type: 'dialogue',
    presentation: 'vn',
    speaker: '김수진',
    text: SUJIN_RUNON_2,
    style: 'runon',
    typingSpeed: 'fast',
    next: 'sujin-d-11',
  },
  { id: 'sujin-d-11', type: 'dialogue', presentation: 'vn', speaker: '', text: '(... 지금은 바쁘신 것 같다.)', next: null },
])

export const GROOMY_DELIVERY_BEATS = Object.freeze([
  { id: 'groomy-d-01', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '잘 다녀오셨어요?', next: 'groomy-d-02' },
  { id: 'groomy-d-02', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '수고 많았네요.', next: 'groomy-d-03' },
  { id: 'groomy-d-03', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '커피는... 어라.', next: 'groomy-d-04' },
  { id: 'groomy-d-04', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '이런 걸 팀원들에게 나눠준 거에요? 물 맛만 나는데.', next: 'groomy-d-05' },
  { id: 'groomy-d-05', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '설탕은요?', next: 'groomy-d-06' },
  { id: 'groomy-d-06', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '없었어요? 테이블에.', next: 'groomy-d-07' },
  { id: 'groomy-d-07', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '아, 구현이 안 된 건가.', next: 'groomy-d-08' },
  { id: 'groomy-d-08', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '좋아요. 본론으로 넘어가죠.', next: 'groomy-d-09' },
  { id: 'groomy-d-09', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '오늘 회의가 있어요.', next: 'groomy-d-10' },
  { id: 'groomy-d-10', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '당신을 데려온 것도 그 이유고.', next: 'groomy-d-11' },
  { id: 'groomy-d-11', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '당신이 할 일은 없어요.', next: 'groomy-d-12' },
  { id: 'groomy-d-12', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '제발, 사고치지 말고.', next: 'groomy-d-13' },
  { id: 'groomy-d-13', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '얌전히 계세요.', next: 'groomy-d-14' },
  { id: 'groomy-d-14', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '쓸데없이 뭔가 건드리지 말고.', next: 'groomy-d-15' },
  { id: 'groomy-d-15', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '아, 물건이 필요하면 주워서 창에 넣으실 수는 있을 텐데.', next: 'groomy-d-16' },
  { id: 'groomy-d-16', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '칩이 저사양이셔서 그런가? 수용 공간이 적더라고요.', next: 'groomy-d-17' },
  { id: 'groomy-d-17', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '차라리 잘 됐죠. 뭐 주울 것도 없는데요.', next: 'groomy-d-18' },
  { id: 'groomy-d-18', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '그래도 가끔 일 할때 뭔가 옮길 일이 있을 수 있기도 하고.', next: 'groomy-d-19' },
  { id: 'groomy-d-19', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '그 쪽도 뭔가 받을 수도 있으니까.', next: 'groomy-d-20' },
  { id: 'groomy-d-20', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '중요한 것만 담아요.', next: 'groomy-d-21' },
  { id: 'groomy-d-21', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '가득 차버리면 더는 무언가를 담을 수 없어요.', next: 'groomy-d-22' },
  { id: 'groomy-d-22', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '당연히 교체야 된다지만, 교체된 건 뭔가 미묘하게.', next: 'groomy-d-23' },
  { id: 'groomy-d-23', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '특히 중요한 정보가 섞일지도 몰라요.', next: 'groomy-d-24' },
  { id: 'groomy-d-24', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '섞여버리면 본질을 잃게 돼요.', next: 'groomy-d-25' },
  { id: 'groomy-d-25', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '주의하라는 말이에요.', next: 'groomy-d-info' },
  {
    id: 'groomy-d-info',
    type: 'choice',
    presentation: 'vn',
    speaker: '주인공',
    text: null,
    choices: [{ id: 'info', text: '...정보?', next: 'groomy-d-26' }],
  },
  { id: 'groomy-d-26', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '네. 이 물건들은 결국 코드니까요.', next: 'groomy-d-27' },
  { id: 'groomy-d-27', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '적힌 값이 섞이면 별 수 없어요.', next: 'groomy-d-28' },
  { id: 'groomy-d-28', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '나는 복구를 할 줄 알지만.', next: 'groomy-d-29' },
  { id: 'groomy-d-29', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '아.', next: 'groomy-d-30' },
  { id: 'groomy-d-30', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '저기, 나를 신뢰해요?', next: 'groomy-d-trust' },
  {
    id: 'groomy-d-trust',
    type: 'choice',
    presentation: 'vn',
    speaker: '주인공',
    text: null,
    choices: [
      { id: 'trust-y', text: 'Y', next: 'groomy-d-y01' },
      { id: 'trust-n', text: 'N', next: 'groomy-d-n01' },
    ],
  },
  { id: 'groomy-d-y01', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '닮았네요 당신.', next: 'groomy-d-y02' },
  { id: 'groomy-d-y02', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '...아니, 아니에요.', next: 'groomy-d-y03' },
  { id: 'groomy-d-y03', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '강이솔 씨가 친절하게 안내 해줄 테니. 톡라인을 켜요.', next: 'groomy-d-y04' },
  { id: 'groomy-d-y04', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '혹시, 헷갈리면.', next: 'groomy-d-y05' },
  { id: 'groomy-d-y05', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '나를 불러요.', next: null },
  { id: 'groomy-d-n01', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '그 얼굴로 이런 말 들으니 정말.', next: 'groomy-d-n02' },
  { id: 'groomy-d-n02', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '그래도 이럴 때는... 가 봐요.', next: 'groomy-d-n03' },
  { id: 'groomy-d-n03', type: 'dialogue', presentation: 'vn', speaker: '그루미', text: '강이솔 씨가 친절하게 안내 해줄 테니. 톡라인을 켜요.', next: 'groomy-d-n04' },
  { id: 'groomy-d-n04', type: 'dialogue', presentation: 'vn', speaker: '', text: '...그럼 그렇지.', next: 'groomy-d-n05' },
  {
    id: 'groomy-d-n05',
    type: 'dialogue',
    presentation: 'vn',
    speaker: '',
    text: '(낮은 목소리로 그루미의 속삭임이 들린다.)',
    style: 'whisper',
    next: null,
  },
])
