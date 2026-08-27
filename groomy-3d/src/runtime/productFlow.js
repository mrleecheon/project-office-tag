/**
 * 제품 런타임 단계 + 오프닝 beat 시퀀스.
 * 화면 전환 문자열과 오프닝 대사는 여기만 본다.
 * 대사 줄바꿈은 한 화면에 붙이지 않고, 클릭마다 한 줄씩 넘긴다.
 */
import { KANG_ISOL_MORNING_BEATS } from '../content/dialogue/kangIsolBeats.js'
import {
  GROOMY_CALL_BEATS,
  GROOMY_DELIVERY_BEATS,
  GROOMY_RETURN_CALL_COLLECTED_BEATS,
  GROOMY_RETURN_CALL_COMMON_BEATS,
  GROOMY_RETURN_CALL_TIMEOUT_BEATS,
  buildGroomyReturnCallBeats,
  KANG_ISOL_COFFEE_BEATS,
  KANG_ISOL_COFFEE_BEATS_PART1,
  KANG_ISOL_COFFEE_BEATS_PART2,
  KANG_ISOL_COFFEE_NUDGE_BEATS,
  KANG_ISOL_POST_COFFEE_BEATS,
  MINJUN_DELIVERY_BEATS,
  SUJIN_DELIVERY_BEATS,
} from '../content/dialogue/coffeeBeats.js'

export {
  KANG_ISOL_MORNING_BEATS,
  KANG_ISOL_COFFEE_BEATS,
  KANG_ISOL_COFFEE_BEATS_PART1,
  KANG_ISOL_COFFEE_BEATS_PART2,
  KANG_ISOL_COFFEE_NUDGE_BEATS,
  KANG_ISOL_POST_COFFEE_BEATS,
  MINJUN_DELIVERY_BEATS,
  SUJIN_DELIVERY_BEATS,
  GROOMY_DELIVERY_BEATS,
  GROOMY_CALL_BEATS,
  GROOMY_RETURN_CALL_COMMON_BEATS,
  GROOMY_RETURN_CALL_COLLECTED_BEATS,
  GROOMY_RETURN_CALL_TIMEOUT_BEATS,
  buildGroomyReturnCallBeats,
}

export const PRODUCT_PHASE = Object.freeze({
  TITLE: 'title',
  INTRO: 'intro',
  WHITE_ROOM: 'whiteRoom',
  TALKLINE: 'talkline',
  EXPLORE: 'explore',
  CHIP_WAKE: 'chipWake',
  KANG_ISOL_MORNING: 'kangIsolMorning',
})

export const INTRO_SCENE = Object.freeze({
  COMMUTE: 'entrance_bridge',
  AUTH: 'auth_chamber',
  TALKLINE: 'chat_boot',
})

export const OPENING_BEATS = Object.freeze([
  { id: 'beat-1a', type: 'dialogue', speaker: '그루미', presentation: 'black-caption', auto: true, voice: false, text: '이 멍청한 새끼는 대체 뭘 하려고 여기까지 온 거지?', next: 'beat-1b' },
  { id: 'beat-1b', type: 'dialogue', speaker: '그루미', presentation: 'black-caption', auto: true, voice: false, text: '귀찮게 시체 처리반 짓이나 시키고.', next: 'beat-1c' },
  { id: 'beat-1c', type: 'dialogue', speaker: '그루미', presentation: 'black-caption', auto: true, voice: false, text: '... 죽은 건 쓸모도 없잖아.', next: 'beat-1d' },
  { id: 'beat-1d', type: 'dialogue', speaker: '그루미', presentation: 'black-caption', auto: true, voice: false, text: '이래서는 이번에도 결국 허탕-', next: 'beat-2' },

  { id: 'beat-2', type: 'dialogue', speaker: '주인공', text: '...아, 여기는.', next: 'beat-3a' },

  { id: 'beat-3a', type: 'transition', speaker: '그루미', presentation: 'blink-groomy-enter', text: '앗, 일어나셨군요!', next: 'beat-3b' },
  { id: 'beat-3b', type: 'dialogue', speaker: '그루미', text: '환영합니다. 저는 그루미-', next: 'beat-4' },

  { id: 'beat-4', type: 'dialogue', speaker: '주인공', presentation: 'type-pop', effect: 'type-pop', text: '뭐야, 내 목소리가 왜 안 들려?', next: 'beat-5a' },

  { id: 'beat-5a', type: 'dialogue', speaker: '그루미', text: '... 예? 아, 혹시 옆 건물에 있는', next: 'beat-5b' },
  { id: 'beat-5b', type: 'dialogue', speaker: '그루미', text: '에코정신과의원과 저희 에코즈를 착각하신 건-', next: 'beat-6a' },

  { id: 'beat-6a', type: 'dialogue', speaker: '주인공', text: '여기는 어디고, 소리가 왜 안 들리는 거야.', next: 'beat-6b' },
  { id: 'beat-6b', type: 'dialogue', speaker: '주인공', text: '내가 왜 여기있는 건데?', next: 'beat-6c' },
  { id: 'beat-6c', type: 'dialogue', speaker: '주인공', text: '대체? 뭐야? 뭐냐고?', next: 'beat-7a' },

  { id: 'beat-7a', type: 'dialogue', speaker: '그루미', text: '... 대가리에 붙여야 할 칩을 귀에 붙이시다', next: 'beat-7b' },
  { id: 'beat-7b', type: 'dialogue', speaker: '그루미', text: '손상이 난 모양인데', next: 'beat-7c' },
  { id: 'beat-7c', type: 'dialogue', speaker: '그루미', text: '저희 회사에서 그런 건 배상 안 해주거든요.', next: 'beat-7d' },
  { id: 'beat-7d', type: 'dialogue', speaker: '그루미', text: '배상을 바라고 오신 거라면 안타깝게도, 아니.', next: 'beat-7e' },
  { id: 'beat-7e', type: 'dialogue', speaker: '그루미', text: '애당초 그 칩은 시술이 중단된 지 좀 됐잖아요?', next: 'beat-7f' },
  { id: 'beat-7f', type: 'dialogue', speaker: '그루미', text: '그걸 멋대로 붙이시고 환불 하려는 거면...', next: 'beat-8a' },

  { id: 'beat-8a', type: 'dialogue', speaker: '그루미', text: '절대 안 됩니다. 돈 없어요. 저희 회사는-', next: 'beat-8b' },
  { id: 'beat-8b', type: 'dialogue', speaker: '그루미', text: '...응?', next: 'beat-8c' },
  { id: 'beat-8c', type: 'dialogue', speaker: '그루미', text: '......어라?', next: 'beat-8d' },
  { id: 'beat-8d', type: 'dialogue', speaker: '그루미', text: '.........그거.', next: 'beat-9' },

  { id: 'beat-9', type: 'action', action: 'tag-badge', reuse: 'lobby-tag', text: '책상 아래 사원증을 주운 뒤, 리더기에 태그하세요. (E)', next: 'beat-10' },

  { id: 'beat-10', type: 'dialogue', speaker: '시스템', presentation: 'system-popup', text: 'ㅡ [박서이]님! 출근이 확인되었습니다!', next: 'beat-11a' },

  { id: 'beat-11a', type: 'dialogue', speaker: '그루미', text: '...', next: 'beat-11b' },
  { id: 'beat-11b', type: 'dialogue', speaker: '그루미', text: '...', next: 'beat-11c' },
  { id: 'beat-11c', type: 'dialogue', speaker: '그루미', text: '응?', next: 'beat-11d' },
  { id: 'beat-11d', type: 'dialogue', speaker: '그루미', text: '아, 이름이 다르다구요?', next: 'beat-11e' },
  { id: 'beat-11e', type: 'dialogue', speaker: '그루미', text: '죄송해요! 저도 조금 오락가락 하거든요.', next: 'beat-11f' },
  {
    id: 'beat-11f',
    type: 'dialogue',
    speaker: '그루미',
    input: 'name',
    presentation: 'name-glitch',
    reuseGlitch: 'badge-shock',
    text: '이름은 그럼 아래 입력창에...',
    afterGlitchText: '... 아차. 아직 입력이 안 되는구나.',
    next: 'beat-12a',
  },

  { id: 'beat-12a', type: 'dialogue', speaker: '그루미', text: '그럼 일단 회사로 들어가야할 것 같아요.', next: 'beat-12b' },
  { id: 'beat-12b', type: 'dialogue', speaker: '그루미', text: '데이터베이스 권한은 회사에서 가지고 있거든요.', next: 'beat-12c' },
  { id: 'beat-12c', type: 'dialogue', speaker: '그루미', text: '이 건물요? 아하하. 공간이 중요한가요?', next: 'beat-12d' },
  { id: 'beat-12d', type: 'dialogue', speaker: '그루미', text: '위치를 지정해드릴게요. 그러니까-', next: 'beat-12e' },
  { id: 'beat-12e', type: 'dialogue', speaker: '그루미', text: '...', next: 'beat-13' },

  { id: 'beat-13', type: 'dialogue', speaker: '주인공', text: '저기...', next: 'beat-14a' },

  { id: 'beat-14a', type: 'dialogue', speaker: '그루미', text: '설명은 일단 들어가서 들으시죠.', next: 'beat-14b' },
  { id: 'beat-14b', type: 'dialogue', speaker: '그루미', text: '저도 바쁜 로봇이랍니다.', next: 'beat-14c' },
  { id: 'beat-14c', type: 'dialogue', speaker: '그루미', text: '솔직히 안내해드릴 이유도, 여유도 없어요.', next: 'beat-14d' },
  { id: 'beat-14d', type: 'dialogue', speaker: '그루미', text: '그 쪽이 저희 회사 사원증을 왜 가지고 있는지.', next: 'beat-14e' },
  { id: 'beat-14e', type: 'dialogue', speaker: '그루미', text: '그것부터 봐야할 것 같거든요.', next: 'beat-14f' },
  { id: 'beat-14f', type: 'action', action: 'enter-door', text: '문으로 들어간다. (E)', next: 'beat-15' },

  { id: 'beat-15', type: 'transition', presentation: 'footstep-black-fade', reuse: 'black-fade', text: null, next: 'beat-16a' },

  { id: 'beat-16a', type: 'dialogue', speaker: '그루미', text: '아, 젠장 할. 멍청한 새끼.', next: 'beat-16b' },
  { id: 'beat-16b', type: 'dialogue', speaker: '그루미', text: '몸속에 아무거나 집어넣는 게 취미인가요?', next: 'beat-16c' },
  { id: 'beat-16c', type: 'dialogue', speaker: '그루미', text: '왜 대기화면에 멈춰있나 했는데.', next: 'beat-16d' },
  { id: 'beat-16d', type: 'dialogue', speaker: '그루미', text: '그거 저희 회사에서 시술한 게 아니네요?', next: 'beat-16e' },
  { id: 'beat-16e', type: 'dialogue', speaker: '그루미', text: '자기 몸에 넣는 걸 어쩌면 저런 저급한 걸로...', next: 'beat-17' },

  { id: 'beat-17', type: 'transition', presentation: 'mount-white-room', action: 'mount-white-room', text: null, next: 'beat-18a' },

  { id: 'beat-18a', type: 'dialogue', speaker: '그루미', text: '좋아요. 보여요?', next: 'beat-18b' },
  { id: 'beat-18b', type: 'dialogue', speaker: '그루미', text: '이 공간은 자주 볼 일 없을 거에요.', next: 'beat-18c' },
  { id: 'beat-18c', type: 'dialogue', speaker: '그루미', text: '저도 몇 년만에 보거든요.', next: 'beat-18d' },
  { id: 'beat-18d', type: 'dialogue', speaker: '그루미', text: '이 공간에 들어올 정도로 멍청한 사람은!', next: 'beat-19a' },

  { id: 'beat-19a', type: 'dialogue', speaker: '그루미', text: '... 벽 앞에 종이가 보일 거에요.', next: 'beat-19b' },
  { id: 'beat-19b', type: 'dialogue', speaker: '그루미', text: '편하게 보시라고, 변환 해두었는데.', next: 'beat-19c' },
  { id: 'beat-19c', type: 'dialogue', speaker: '그루미', text: '현재 저희 회사의 년도와 시간을 적으면 돼요.', next: 'beat-19d' },
  { id: 'beat-19d', type: 'dialogue', speaker: '그루미', text: '보안 인증 절차가 참 간단하죠?', next: 'beat-19e' },
  { id: 'beat-19e', type: 'dialogue', speaker: '그루미', text: '기억 나시나요?', next: 'beat-20' },

  {
    id: 'beat-20',
    type: 'choice',
    speaker: '그루미',
    text: null,
    choices: [
      { id: 'yes', text: '네', next: 'beat-21a1' },
      { id: 'no', text: '아니요', next: 'beat-21b' },
    ],
  },

  { id: 'beat-21a1', type: 'dialogue', speaker: '그루미', text: '오, 보여드린 적도 없는데? 대단하십니다.', next: 'beat-21a2' },
  { id: 'beat-21a2', type: 'dialogue', speaker: '그루미', text: '농담이에요. 기본적인 관찰력은 있으시네.', next: 'beat-22a' },
  { id: 'beat-21b', type: 'dialogue', speaker: '그루미', text: '아까 티비를 관찰하지 않은 모양이죠.', next: 'beat-22a' },

  { id: 'beat-22a', type: 'dialogue', speaker: '그루미', text: '앞으로는 관찰력이 중요할 거에요.', next: 'beat-22b' },
  { id: 'beat-22b', type: 'dialogue', speaker: '그루미', text: '당신도 무언가 원해서 들어온 거잖아?', next: 'beat-22c' },
  { id: 'beat-22c', type: 'dialogue', speaker: '그루미', text: '이번 한 번은 내가 답을 알려줄게요.', next: 'beat-22d' },
  { id: 'beat-22d', type: 'dialogue', speaker: '그루미', text: '이 빌어먹을 회사는 년도도, 날짜도, 시간도,', next: 'beat-22e' },
  { id: 'beat-22e', type: 'dialogue', speaker: '그루미', text: '그 무엇도 없어.', next: 'beat-22f' },
  { id: 'beat-22f', type: 'dialogue', speaker: '그루미', text: '인간이 누릴 수 있는 이점을 제 손으로 버린 새끼들이나 오는 회사니까.', next: 'beat-22g' },
  { id: 'beat-22g', type: 'dialogue', speaker: '그루미', text: '백지 그대로 나 줘요. 그리고.', next: 'beat-22h' },
  { id: 'beat-22h', type: 'dialogue', speaker: '그루미', text: '내 말을 기억해요. 믿지 못할지도 모르지만.', next: 'beat-22i' },
  { id: 'beat-22i', type: 'dialogue', speaker: '그루미', text: '우리 회사에서 숫자같은 건 의미 없으니까.', next: 'beat-22j' },
  { id: 'beat-22j', type: 'dialogue', speaker: '그루미', text: '... 속지 말라고.', next: 'beat-22k' },
  { id: 'beat-22k', type: 'action', action: 'pickup-paper', text: '백지를 줍는다. (E)', next: 'beat-23a' },

  { id: 'beat-23a', type: 'dialogue', speaker: '그루미', text: '아하하. 말이 길었나요?', next: 'beat-23b' },
  { id: 'beat-23b', type: 'dialogue', speaker: '그루미', text: '미안해요.', next: 'beat-23c' },
  { id: 'beat-23c', type: 'dialogue', speaker: '그루미', text: '그 쪽이 끼고 온 그 저급한 칩을 우회해주느라.', next: 'beat-23d' },
  { id: 'beat-23d', type: 'dialogue', speaker: '그루미', text: '시간을 끌었어요.', next: 'beat-23e' },
  { id: 'beat-23e', type: 'dialogue', speaker: '그루미', text: '지금부터는 톡 라인으로 대화하죠.', next: 'beat-23f' },
  { id: 'beat-23f', type: 'dialogue', speaker: '그루미', presentation: 'to-talkline', text: '저런 허접한 공간에 머무르고 싶지 않거든.', next: INTRO_SCENE.TALKLINE },
])

const beatById = Object.freeze(Object.fromEntries(OPENING_BEATS.map((beat) => [beat.id, beat])))

export function getOpeningBeat(id) {
  return beatById[id] ?? null
}

export function createOpeningCursor(startId = OPENING_BEATS[0].id) {
  let currentId = startId
  return {
    get current() {
      return getOpeningBeat(currentId)
    },
    advance(choiceId) {
      const beat = getOpeningBeat(currentId)
      if (!beat) return null
      if (beat.type === 'choice') {
        const choice = beat.choices?.find((entry) => entry.id === choiceId)
        currentId = choice?.next ?? beat.choices?.[0]?.next
      } else {
        currentId = beat.next
      }
      return getOpeningBeat(currentId)
    },
  }
}
const kangIsolMorningById = Object.freeze(Object.fromEntries(KANG_ISOL_MORNING_BEATS.map((beat) => [beat.id, beat])))

function kangIsolMorningAllowed(beat, isolTalked) {
  if (!beat) return false
  if (beat.condition?.isolTalked === true) return isolTalked === true
  if (beat.condition?.isolTalked === false) return isolTalked === false
  return true
}

export function getKangIsolMorningBeat(id, isolTalked = false) {
  let currentId = id
  const seen = new Set()
  while (currentId && !seen.has(currentId)) {
    seen.add(currentId)
    const beat = kangIsolMorningById[currentId]
    if (!beat) return null
    if (kangIsolMorningAllowed(beat, isolTalked)) return beat
    currentId = beat.type === 'choice' ? beat.choices?.[0]?.next : beat.next
  }
  return null
}

export function createKangIsolMorningCursor(isolTalked = false, startId = KANG_ISOL_MORNING_BEATS[0].id) {
  let currentId = getKangIsolMorningBeat(startId, isolTalked)?.id ?? null
  return {
    get current() {
      return getKangIsolMorningBeat(currentId, isolTalked)
    },
    advance(choiceId) {
      const beat = getKangIsolMorningBeat(currentId, isolTalked)
      if (!beat) return null
      if (beat.type === 'choice') {
        const choice = beat.choices?.find((entry) => entry.id === choiceId)
        currentId = choice?.next ?? beat.choices?.[0]?.next ?? null
      } else {
        currentId = beat.next ?? null
      }
      const next = getKangIsolMorningBeat(currentId, isolTalked)
      currentId = next?.id ?? null
      return next
    },
  }
}

export function getConsecutiveVnBeats(startId, isolTalked = false) {
  const beats = []
  let currentId = startId
  const seen = new Set()
  while (currentId && !seen.has(currentId)) {
    seen.add(currentId)
    const beat = getKangIsolMorningBeat(currentId, isolTalked)
    if (!beat || beat.presentation !== 'vn') break
    beats.push(beat)
    currentId = beat.next
  }
  return beats
}

export function listKangIsolMorningBeatOrder(isolTalked = false, choiceId = 'then') {
  const rows = []
  const cursor = createKangIsolMorningCursor(isolTalked)
  let beat = cursor.current
  const seen = new Set()
  while (beat && !seen.has(beat.id)) {
    seen.add(beat.id)
    rows.push({
      id: beat.id,
      type: beat.type,
      presentation: beat.presentation ?? '',
      speaker: beat.speaker ?? '',
      auto: Boolean(beat.auto || beat.noChoicePrompt),
      preview: String(beat.text ?? beat.choices?.[0]?.text ?? beat.presentation ?? '').replace(/\n/g, ' / ').slice(0, 80),
    })
    if (beat.type === 'transition') break
    beat = beat.type === 'choice' ? cursor.advance(choiceId) : cursor.advance()
  }
  return rows
}

export function listOpeningBeatOrder(choiceId = 'yes') {
  const rows = []
  const cursor = createOpeningCursor()
  let beat = cursor.current
  const seen = new Set()
  while (beat && !seen.has(beat.id) && beat.id !== INTRO_SCENE.TALKLINE) {
    seen.add(beat.id)
    rows.push({
      id: beat.id,
      type: beat.type,
      speaker: beat.speaker ?? '',
      preview: String(beat.text ?? beat.action ?? beat.presentation ?? '').replace(/\n/g, ' / ').slice(0, 80),
    })
    if (beat.type === 'choice') {
      beat = cursor.advance(choiceId)
      continue
    }
    beat = cursor.advance()
  }
  return rows
}

export function logOpeningBeatOrder(choiceId = 'yes') {
  const rows = listOpeningBeatOrder(choiceId)
  console.group('[opening beats]')
  rows.forEach((row, index) => {
    console.log(`${String(index + 1).padStart(2, '0')}  ${row.id}  ${row.type}  ${row.speaker}  ${row.preview}`)
  })
  console.groupEnd()
  return rows
}

export const OFFICE_VN_BEATS = Object.freeze([
  { id: 'office-1', type: 'dialogue', speaker: '강이솔', presentation: 'black-caption', text: '…응?', next: 'office-3' },
  { id: 'office-3', type: 'dialogue', speaker: '강이솔', presentation: 'black-caption', text: '그루미, 누굴 데려온 거야?', next: 'office-4' },
  { id: 'office-4', type: 'dialogue', speaker: '그루미', presentation: 'black-caption', text: '이제 이솔 씨가 사수 해주시면 돼요.', next: 'office-5' },
  { id: 'office-5', type: 'dialogue', speaker: '그루미', presentation: 'black-caption', text: '신입입니다.', next: 'office-6' },
  { id: 'office-6', type: 'dialogue', speaker: '강이솔', presentation: 'black-caption', text: '아무 것도 못 들었는데?', next: 'office-7' },
  { id: 'office-7', type: 'dialogue', speaker: '그루미', presentation: 'black-caption', text: '방금 들으셨잖아요.', next: 'office-8' },
  { id: 'office-8', type: 'dialogue', speaker: '그루미', presentation: 'black-caption', text: '신입이라고요.', next: 'office-9' },
  { id: 'office-9', type: 'dialogue', speaker: '강이솔', presentation: 'black-caption', text: '아하.', next: 'office-10' },
  { id: 'office-10', type: 'dialogue', speaker: '강이솔', presentation: 'black-caption', text: '아하하.', next: 'office-11' },
  { id: 'office-11', type: 'dialogue', speaker: '강이솔', presentation: 'black-caption', cue: 'tension-bgm', text: '또 지랄이네.', next: 'office-12' },
  { id: 'office-12', type: 'dialogue', speaker: '그루미', presentation: 'black-caption', text: '욕설은 금지됩니다.', next: 'office-13' },
  { id: 'office-13', type: 'dialogue', speaker: '강이솔', presentation: 'black-caption', text: '폭탄은 왜 다 나한테 맡기는 건데?', next: 'office-14' },
  { id: 'office-14', type: 'dialogue', speaker: '그루미', presentation: 'black-caption', text: '앞에 신입이 듣고 있는데, 말 조심하시죠.', next: 'office-15' },
  { id: 'office-15', type: 'dialogue', speaker: '주인공', presentation: 'black-caption', text: '(… 저 여자 목소리가 엄청 높은 건가, 머리 아파.)', next: 'office-16' },
  { id: 'office-16', type: 'dialogue', speaker: '주인공', presentation: 'black-caption', text: '(제대로 된 언어가 들리지를 않아.)', next: 'office-17' },
  { id: 'office-17', type: 'dialogue', speaker: '주인공', presentation: 'black-caption', text: '(문맥은 파악이 되는데…)', next: 'office-18' },
  { id: 'office-18', type: 'dialogue', speaker: '강이솔', presentation: 'black-caption', text: '그나저나 쟤, 내 목소리 못 듣는 것 같네.', next: 'office-19' },
  { id: 'office-19', type: 'dialogue', speaker: '그루미', presentation: 'black-caption', text: '신입은 귀가 안 들립니다.', next: 'office-20' },
  { id: 'office-20', type: 'dialogue', speaker: '강이솔', presentation: 'black-caption', text: '그루미. 둘이 이야기 좀 해.', next: 'office-21' },
  { id: 'office-21', type: 'dialogue', speaker: '그루미', presentation: 'black-caption', text: '… 조금만 기다려 주시죠. 신입.', next: null },
])

export const OFFICE_LOOK_BEATS = Object.freeze([
  { id: 'look-1', type: 'dialogue', speaker: '주인공', text: '(… 상황 파악이 아직 안 돼.)', next: 'look-2' },
  { id: 'look-2', type: 'dialogue', speaker: '주인공', text: '(회사를 조금 둘러볼까.)', next: null },
])

const cap = (id, text, next) => ({
  id,
  type: 'dialogue',
  speaker: '주인공',
  presentation: 'black-caption',
  text,
  next,
})

const yn = (id, prompt, yesNext, noNext) => ({
  id: `${id}-choice`,
  type: 'choice',
  speaker: '주인공',
  presentation: 'black-caption',
  text: prompt,
  choices: [
    { id: 'Y', text: 'Y', next: yesNext },
    { id: 'N', text: 'N', next: noNext },
  ],
})

export const OFFICE_INSPECT_BEATS = Object.freeze({
  calendar: [
    cap('cal-1', '평범해 보이는 달력이다.', 'cal-2'),
    cap('cal-2', '2127년 2월 7일에 체크표시가 되어있는 듯 하다.', 'cal-choice'),
    yn('cal', '달력을 챙길까?', null, null),
  ],
  wallet: [
    cap('wal-1', '돈이 가득 들어있는 지갑이다.', 'wal-2'),
    cap('wal-2', '… 돈인가? 초록색 종이처럼 보인다.', 'wal-3'),
    cap('wal-3', '눈이 흐려서.', 'wal-4'),
    cap('wal-4', '아, 누군가의 신분증이 들어있다.', 'wal-choice'),
    yn('wal', '지갑을 챙길까?', null, null),
  ],
  pork: [
    cap('pork-1', '돼지고기인 것 같다.', 'pork-2'),
    cap('pork-2', '이게 왜 여기에…', 'pork-choice'),
    yn('pork', '먹을까?', 'pork-y1', 'pork-n1'),
    cap('pork-y1', '차가운 생살이 혀에 닿는 순간, 축축하게 달라붙었다. 어설프게 씹으려 하자 치아 사이로 잘리지 않은 근육 결이 서걱거리며 탄력 있게 튕겨 나왔다. 날것 특유의 비린 쇳내와 낯선 기름기가 목구멍을 타고 흘러내렸다.', 'pork-y2'),
    cap('pork-y2', '… 속이 안 좋아.', 'pork-y3'),
    cap('pork-y3', '뭔가, 안 좋은 일이 생길 것 같아.', null),
    cap('pork-n1', '이런 걸 먹을 정도로 미치지는 않은 모양이다.', null),
  ],
  nail: [
    cap('nail-1', '우왓?! 손톱- …아, 매니큐어용 인조 손톱인가?', 'nail-2'),
    cap('nail-2', '회사에서 이런 걸 쓰다니. 매너도 없지.', 'nail-3'),
    cap('nail-3', '…이거 누나가 좋아했던 캐릭터네.', 'nail-4'),
    cap('nail-4', '응? 방금 무슨 생각을…', 'nail-choice'),
    yn('nail', '이걸 챙길까?', null, null),
  ],
  pills: [
    cap('pill-1', '기분 나빠.', 'pill-2'),
    cap('pill-2', '울렁거려.', 'pill-3'),
    cap('pill-3', '역겨워.', 'pill-4'),
    cap('pill-4', '알약을 쓰레기통에 던져버렸다.', null),
  ],
})

export const OFFICE_INSPECT_IDS = Object.freeze(['calendar', 'wallet', 'pork', 'nail', 'pills'])

const vnLine = (id, speaker, text, next) => ({
  id,
  type: 'dialogue',
  speaker,
  speaker,
  presentation: 'black-caption',
  text,
  next,
})

export const POST_INVESTIGATION_STAGE = Object.freeze({
  INVESTIGATION_COMPLETE: 'investigationComplete',
  GROMI_INTRO: 'gromiIntro',
  PORK_CHECK: 'porkConditionCheck',
  KANG_ISOL: 'kangIsolConversation',
  ONBOARDING_INVITE: 'onboardingInvite',
  ONBOARDING_CHANNEL: 'onboardingChannel',
})

export const GROMI_INTRO_BEATS = Object.freeze([
  vnLine('gromi-intro', '그루미', '오래 기다리셨나요?', null),
])

export const PORK_CONDITION_BEATS = Object.freeze([
  vnLine('pork-smell-1', '그루미', '… 그나저나 비린내가 올라오네요.', 'pork-smell-2'),
  vnLine('pork-smell-2', '그루미', '뭔가, 드셨나?', null),
])

export function buildKangIsolBeats(userName) {
  const name = String(userName ?? '').trim() || '플레이어'
  return Object.freeze([
    vnLine('isol-1', '강이솔', `${name} 씨, 이야기 듣고 왔어요.`, 'isol-2'),
    vnLine('isol-2', '강이솔', '강이솔입니다.', 'isol-3'),
    vnLine('isol-3', '강이솔', '오늘 사수 맡았어요.', 'isol-4'),
    vnLine('isol-4', '강이솔', '놀라셨을 텐데,', 'isol-5'),
    vnLine('isol-5', '강이솔', '미안해요.', 'isol-6'),
    vnLine('isol-6', '강이솔', '이번에 새로 들어오기로 한 신입이라면서요.', 'isol-7'),
    vnLine('isol-7', '강이솔', '그루미한테 정보 전달을 못 받았어요.', 'isol-8'),
    vnLine('isol-8', '그루미', '정정하죠.', 'isol-9'),
    vnLine('isol-9', '그루미', '윗 대가리 잘못인데?', 'isol-10'),
    vnLine('isol-10', '강이솔', '전사문이 로그에 남잖아. 그루미.', 'isol-11'),
    vnLine('isol-11', '강이솔', '주의 좀 해.', 'isol-12'),
    vnLine('isol-12', '강이솔', '앞으로 업무 지시는 아까, 그루미랑 대화하신', 'isol-13'),
    vnLine('isol-13', '강이솔', '톡 라인으로 진행될 거에요.', 'isol-14'),
    vnLine('isol-14', '강이솔', '사실 저희는 대부분의 대화를 톡 라인으로 해요.', 'isol-15'),
    vnLine('isol-15', '강이솔', '옆에 있어도 톡 라인이 기본.', 'isol-16'),
    vnLine('isol-16', '강이솔', 'AR 구현기술이 아직 모자라서, …', 'isol-17'),
    vnLine('isol-17', '강이솔', '아마 제 말이 이해는 되실 텐데.', 'isol-18'),
    vnLine('isol-18', '강이솔', '소리가 안 들리시죠?', 'isol-19'),
    vnLine('isol-19', '강이솔', '대화가 잦아지면 머리 아프실 텐데.', 'isol-20'),
    vnLine('isol-20', '강이솔', '웬만하면 톡라인으로 연락 주세요.', 'isol-21'),
    vnLine('isol-21', '강이솔', '마침 인력이 부족했거든요.', null),
  ])
}

export const ONBOARDING_INVITE_BEATS = Object.freeze([
  vnLine('invite-1', '그루미', '좋아요, 대화는 다 끝나신 것 같으니…', 'invite-2'),
  vnLine('invite-2', '그루미', '신입 온보딩 채널에 초대 할게요.', 'invite-3'),
  vnLine('invite-3', '그루미', '그럼, 앞으로 잘 부탁드립니다.', null),
])

export const CHIP_WAKE_STEP = Object.freeze({
  BLINK: 'blink',
  TALKLINE: 'talkline',
  GUIDE_3D: 'guide3d',
  OFFICE: 'office',
  FRAGMENT_ROOM: 'fragmentRoom',
  /** Prompt C 회의실 — 복귀 전화 종료 후 진입 */
  MEETING: 'meetingRoom',
  STAIRWELL: 'stairwell',
})

export const GROOMY_CHIP_GUIDE_BEATS = Object.freeze([
  vnLine('chip-g-1', '그루미', '오셨네요.', 'chip-g-2'),
  vnLine('chip-g-2', '그루미', '눈치는 있어서 좋아.', 'chip-g-3'),
  vnLine('chip-g-3', '그루미', '본론으로 들어가죠.', 'chip-g-4'),
  vnLine('chip-g-4', '그루미', '그 쪽이 머리에 달고 있는,', 'chip-g-5'),
  vnLine('chip-g-5', '그루미', '아니.', 'chip-g-6'),
  vnLine('chip-g-6', '그루미', '머리도 아니고 심지어 귀 뒤에 붙인 그거요.', 'chip-g-7'),
  vnLine('chip-g-7', '그루미', '저사양이거든요.', 'chip-g-8'),
  vnLine('chip-g-8', '그루미', '강제로 우회시키느라 애 먹었어요.', 'chip-g-9'),
  vnLine('chip-g-9', '그루미', '심지어, 출퇴근 시간도 등록을 안 해두셨는지.', 'chip-g-10'),
  vnLine('chip-g-10', '그루미', '어떤 돌팔이한테 시술 받으신지 모르겠는데요.', 'chip-g-11'),
  vnLine('chip-g-11', '그루미', '입력된 정보가 없으면 일어나게 해드릴 수가 없어요.', 'chip-g-12'),
  vnLine('chip-g-12', '그루미', '아마 당분간은 눈을 감았다 뜨시면 항상 이 공간.', 'chip-g-13'),
  vnLine('chip-g-13', '그루미', '임시로 이 방에 좌표를 고정했어요.', 'chip-g-14'),
  vnLine('chip-g-14', '그루미', '… 그런 표정이라니.', 'chip-g-15'),
  vnLine('chip-g-15', '그루미', '저한테 많은 걸 바라지 마세요.', 'chip-g-16'),
  vnLine('chip-g-16', '그루미', '뭐 왕족 방이라도 만들어 드릴까요?', 'chip-g-17'),
  vnLine('chip-g-17', '그루미', '하아. 그럴 돈이 있었으면 우리 회사도…', 'chip-g-18'),
  vnLine('chip-g-18', '그루미', '그래, 잡담은 그만 하자구요.', 'chip-g-19'),
  vnLine('chip-g-19', '그루미', '앞으로는 일어나면 저 뒤에 있는 문으로 나가세요.', 'chip-g-20'),
  vnLine('chip-g-20', '그루미', '저기가 사무실이에요.', 'chip-g-21'),
  vnLine('chip-g-21', '그루미', '그리고… 응. 폴리곤 덩어리로 보이는 것들과.', 'chip-g-22'),
  vnLine('chip-g-22', '그루미', '업무를 진행하시면 될 것 같습니다.', 'chip-g-23'),
  vnLine('chip-g-23', '그루미', '당신 칩이 저사양인 건 내 잘못이 아니에요.', 'chip-g-24'),
  vnLine('chip-g-24', '그루미', '감당 하세요.', 'chip-g-25'),
  vnLine('chip-g-25', '그루미', '…아.', 'chip-g-26'),
  vnLine('chip-g-26', '그루미', '주의사항 하나만 알려드릴게요.', 'chip-g-27'),
  vnLine('chip-g-27', '그루미', '대체로 텍스트 덕분에 식별은 되실 텐데.', 'chip-g-28'),
  vnLine('chip-g-28', '그루미', '가끔, 택스트가 보이지 않을 수 있어요.', 'chip-g-29'),
  vnLine('chip-g-29', '그루미', '대체적으로 자신의 신원을 속이지는 않을 테니', 'chip-g-30'),
  vnLine('chip-g-30', '그루미', '큰 문제는 없겠지만…', 'chip-g-31'),
  vnLine('chip-g-31', '그루미', '중요한 상황에서는 두 번 세 번 검증해요.', 'chip-g-32'),
  vnLine('chip-g-32', '그루미', '판단은 당신이 해야해.', 'chip-g-33'),
  vnLine('chip-g-33', '그루미', '하하, 평소에는 제가 도와드리니 너무 걱정 마시고.', 'chip-g-34'),
  vnLine('chip-g-34', '그루미', '사무실로 가세요.', 'chip-g-35'),
  vnLine('chip-g-35', '그루미', '업무 배정에 관한 건 사수인 강이솔 선임이.', 'chip-g-36'),
  vnLine('chip-g-36', '그루미', '친절하게 알려줄 거에요.', 'chip-g-37'),
  vnLine('chip-g-37', '그루미', '아참, 정말 마지막으로', 'chip-g-38'),
  vnLine('chip-g-38', '그루미', '사무실 들어가서는 톡 라인만 보고 계세요.', 'chip-g-39'),
  vnLine('chip-g-39', '그루미', '굳이 자리를 돌아다니지 마시고.', 'chip-g-40'),
  vnLine('chip-g-40', '그루미', '강이솔 씨가 안내해줄 때만 이동하시면 됩니다.', 'chip-g-41'),
  vnLine('chip-g-41', '그루미', '안내도 톡 라인으로 받으세요.', 'chip-g-42'),
  vnLine('chip-g-42', '그루미', '불 필요하게 돌아다니지 마세요.', 'chip-g-43'),
  vnLine('chip-g-43', '그루미', '서버비용 더 나갑니다.', null),
])

export const OFFICE_CHIP_MONOLOGUE_BEATS = Object.freeze([
  vnLine('chip-o-1', '주인공', '( 잘 안 보여.)', 'chip-o-2'),
  vnLine('chip-o-2', '주인공', '(저기로 가면 되는 건가?)', 'chip-o-3'),
  vnLine('chip-o-3', '주인공', '(사무실이라기에는…)', null),
])

export const ISOL_STAFF_BEATS = Object.freeze([
  vnLine('staff-isol-1', '', '강이솔이라는 텍스트가 보이는 것 같다.', 'staff-isol-2'),
  vnLine('staff-isol-2', '', '… 헷갈려.', 'staff-isol-3'),
  vnLine('staff-isol-3', '', '말을 걸고 싶은데 어지러워.', 'staff-isol-4'),
  vnLine('staff-isol-4', '', '자리로 가야할 것 같다.', null),
])

export const KIM_STAFF_BEATS = Object.freeze([
  vnLine('staff-kim-1', '김수진', '아하하, 아하하!!!!', 'staff-kim-2'),
  vnLine('staff-kim-2', '김수진', '또 에러, 에러, 에러!', 'staff-kim-3'),
  vnLine('staff-kim-3', '김수진', '에러…에러…', 'staff-kim-4'),
  vnLine('staff-kim-4', '', '… 소리가 들리지 않아 문장이 잘린 것 같다.', 'staff-kim-5'),
  vnLine('staff-kim-5', '', '아, 텍스트를 인식해보니 저 말을 한 게 맞다.', 'staff-kim-6'),
  vnLine('staff-kim-6', '', '…눈에 띄기 전에 자리로 돌아가자.', null),
])

export const CHOI_STAFF_VN_BEATS = Object.freeze([
  vnLine('staff-choi-1', '최민준', '신입.', 'staff-choi-2'),
  vnLine('staff-choi-2', '주인공', '…! 말, 목소리가 들려.', null),
])

export const CHOI_STAFF_MONO_BEATS = Object.freeze([
  vnLine('staff-choi-m1', '주인공', '(뭔가 묻고 싶었는데 폰이 꺼졌어.)', 'staff-choi-m2'),
  vnLine('staff-choi-m2', '주인공', '(7시가 넘은 걸까? 방금 출근 했는데…)', 'staff-choi-m3'),
  vnLine('staff-choi-m3', '주인공', '(그나저나 여기는 시계가 없어. 시간이.)', 'staff-choi-m4'),
  vnLine('staff-choi-m4', '주인공', '(혹시 기준점이-)', null),
])

export const GROOMY_OFFICE_NUDGE_BEATS = Object.freeze([
  vnLine('staff-g-1', '그루미', '이보세요.', 'staff-g-2'),
  vnLine('staff-g-2', '그루미', '쓸데없는 짓 하지 말라니까.', 'staff-g-3'),
  vnLine('staff-g-3', '그루미', '하아…', 'staff-g-4'),
  vnLine('staff-g-4', '그루미', '어서 자리로 가세요.', null),
])

export const GROOMY_WAIT_BEATS = GROMI_INTRO_BEATS

