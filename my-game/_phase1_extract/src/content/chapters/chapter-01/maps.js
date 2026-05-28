const rawChapter01Maps = {
  floor7: {
    id: 'floor7',
    label: '7F 복도',
    ambient: '창문 밖은 너무 밝고, 복도 안쪽은 유난히 조용하다.',
    hint: '방향키/WASD 이동 · Space/Enter 조사',
    cols: 13,
    rows: 9,
    tileSize: 40,
    playerStart: { row: 4, col: 2, facing: { dr: 0, dc: 1 } },
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    labels: {
      '3-4': '게시판',
      '3-8': '냉장고',
      '5-10': '보안 포스터',
      '7-6': '회의실',
    },
    triggers: {
      '3-4': 'flavor_board',
      '3-8': 'flavor_fridge',
      '5-10': 'flavor_poster',
      '7-6': 'meeting_entry',
    },
  },
  meetingRoom: {
    id: 'meetingRoom',
    label: '7F 회의실',
    ambient: '프로젝터 팬 소리만 얇게 깔린다.',
    hint: '회의 테이블 주변을 둘러본 뒤 회의를 시작하세요.',
    cols: 13,
    rows: 9,
    tileSize: 40,
    playerStart: { row: 7, col: 5, facing: { dr: 0, dc: 1 } },
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 3, 0, 0, 0, 4, 0, 0, 0, 3, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 3, 0, 3, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    labels: {
      '2-2': '화이트보드',
      '2-6': '프로젝터',
      '2-10': '창문',
      '5-5': '최민준 자리',
      '5-7': '김수진 자리',
      '7-6': '회의 시작',
    },
    triggers: {
      '2-2': 'flavor_whiteboard',
      '2-6': 'flavor_projector',
      '2-10': 'flavor_window',
      '5-5': 'flavor_choi_seat',
      '5-7': 'flavor_kim_seat',
      '7-6': 'meeting_chat',
    },
  },
  floor3: {
    id: 'floor3',
    label: '3F 계단실',
    ambient: '발소리가 한 박자 늦게 되돌아온다.',
    hint: '조용히 이동하세요. Space/Enter로 단서를 확인합니다.',
    cols: 13,
    rows: 9,
    tileSize: 40,
    playerStart: { row: 1, col: 1, facing: { dr: 0, dc: 1 } },
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    labels: {
      '5-5': '혈흔',
      '6-6': '꺼진 CCTV',
      '7-10': '비상구',
    },
    triggers: {
      '5-5': 'clue_blood',
      '6-6': 'clue_camera',
      '7-10': 'exit_floor3',
    },
  },
}

function decorateMap(map) {
  const eventTiles = Object.entries(map.triggers ?? {}).map(([key, trigger]) => ({
    id: `${map.id}.${key}`,
    key,
    trigger,
    repeatable: true,
  }))

  const ambientFlags = [{
    id: `${map.id}.scanline`,
    enabled: map.id === 'floor3',
    overlayAssetId: 'overlay_scanline',
    intensity: map.id === 'floor3' ? 0.65 : 0.25,
  }]

  const npcs = map.id === 'meetingRoom'
    ? [
        { id: 'npc_choi', name: '최민준', position: { row: 5, col: 5 }, trigger: 'flavor_choi_seat', spriteAssetId: 'portrait_choi_base' },
        { id: 'npc_kim', name: '김수진', position: { row: 5, col: 7 }, trigger: 'flavor_kim_seat', spriteAssetId: 'portrait_kim_base' },
      ]
    : []

  return {
    ...map,
    floorId: map.id === 'floor3' ? '3F' : '7F',
    minimapAssetId: 'overlay_scanline',
    ambientFlags,
    eventTiles,
    npcs,
  }
}

export const chapter01Maps = Object.fromEntries(
  Object.entries(rawChapter01Maps).map(([mapId, map]) => [mapId, decorateMap(map)]),
)
