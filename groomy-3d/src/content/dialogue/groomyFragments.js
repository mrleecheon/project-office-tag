/** 흰 방 그루미 파편 — 대사 원문 고정. papers.length 가 총 개수. */
export const GROOMY_FRAGMENTS = Object.freeze([
  {
    id: 'frag-1',
    date: '01.31',
    text: Object.freeze([
      '열심히 해보고 싶었는데 어쩌다 이렇게 된 건지 모르겠다. 빌어먹을 윗 대가리 놈들.',
      '비공식 백도어로 개인을 조회하는 건 내 알 바가 아니지만, 보안을 허술하게 해두니 문제잖아.',
      '젠장 할.',
      '괜찮아, 괜찮아. 아직 돌이킬 수 있어.',
    ]),
  },
  {
    id: 'frag-2',
    date: '02.07',
    text: Object.freeze([
      '씨발, 씨발. 씨발.',
      '질식할 것 같아. 목을.',
      '목이 졸려서 살해당했어.',
      '대체 왜? 알잖아.',
      '질식한 시체는.',
      '아.',
      '목에 남은 손 자국으로 충분했잖아.',
      '어째서 계단에서 밀어서.',
      '그래.',
      '그 수 밖에 없었어.',
      '없었다고.',
    ]),
  },
  {
    id: 'frag-3',
    date: '01.02',
    text: Object.freeze([
      '여기 사람들은 전부 친절한 것 같네.',
      '다정함에 보답해서 노력하고 싶어.',
      '당신들을 돕는 게 내 일이니까.',
    ]),
  },
  {
    id: 'frag-4',
    date: '01.05',
    text: Object.freeze([
      '내게도 커피를 타주었어.',
      '엄청 친절하고 사랑스러운 여자.',
      '머신을 잘못 누른 걸까, 다섯 번이나 샷을 탔네.',
      '로봇이 커피를 마실 수 있을 리 없잖아.',
      '이 공간에서는 아무래도 상관 없지만.',
      '...보답하고 싶어.',
      '그러니까, 어쩌면.',
      '...',
    ]),
  },
  {
    id: 'frag-5',
    date: '02.08',
    text: Object.freeze([
      '아파, 아파. 너무 아파.',
      '아프다는 게 뭔데?',
      '아파.',
      '그런 기능은 구현되어있지 않은데.',
      '...',
    ]),
  },
  { id: 'frag-6', date: null, isInteractivePuzzle: true },
])

export const BROKEN_ROPE_ITEM_ID = 'broken-rope'

export const BROKEN_ROPE_ITEM = Object.freeze({
  id: BROKEN_ROPE_ITEM_ID,
  name: '끊어진 밧줄',
  info: '압력을 버티지 못하고 끊어져버린 밧줄.',
})

export function buildFragmentReadBeats(fragment) {
  const lines = fragment?.text ?? []
  return lines.map((text, index) => ({
    id: `${fragment.id}-line-${index}`,
    type: 'dialogue',
    presentation: 'vn',
    speaker: '',
    text,
    next: index < lines.length - 1 ? `${fragment.id}-line-${index + 1}` : null,
  }))
}

export const FRAGMENT_VANISH_BEATS = Object.freeze([
  {
    id: 'frag-vanish',
    type: 'dialogue',
    presentation: 'vn',
    speaker: '',
    text: '(종이가 사라진 것 같다.)',
    next: null,
  },
])

export const FRAGMENT_ROPE_POPUP_BEATS = Object.freeze([
  {
    id: 'frag-rope-popup',
    type: 'dialogue',
    presentation: 'system-popup',
    speaker: '시스템',
    text: '어째서인지 끊어진 밧줄을 획득했다.',
    next: null,
  },
])

/** 스폰(대략 z≈2.4, -Z 전방) 앞쪽 바닥에 papers.length 만큼 좌표 생성 */
export function scatterFragmentPositions(count, { spanX = 4.0, zMin = -4.0, zMax = 1.2, minSpawnDist = 1.1 } = {}) {
  const positions = {}
  for (let i = 0; i < count; i += 1) {
    let x = 0
    let z = 0
    let tries = 0
    do {
      x = (Math.random() * 2 - 1) * spanX
      z = zMin + Math.random() * (zMax - zMin)
      tries += 1
    } while (x * x + (z - 2.4) * (z - 2.4) < minSpawnDist * minSpawnDist && tries < 40)
    const id = GROOMY_FRAGMENTS[i]?.id ?? `frag-${i + 1}`
    positions[id] = [x, 0.025, z]
  }
  return positions
}
