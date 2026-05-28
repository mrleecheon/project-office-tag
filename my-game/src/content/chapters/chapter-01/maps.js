// CH1 조사 구역 — 채팅 허브용 메타데이터 (타일맵 RPG 미사용)

export const chapter01InvestigationHubs = {
  floor7: {
    hubSceneId: 'floor7_hub',
    label: '7F 복도',
    floorId: '7F',
    ambient: '창문 밖은 너무 밝고, 복도 안쪽은 유난히 조용하다.',
    systemMessage: 'GROOMY OFFICE · 7F 복도 조사',
    emotion: 'neutral',
    prompt: '조사할 위치를 골라 주세요. 번호만 눌러도 됩니다.',
    spots: [
      { label: '게시판', sceneId: 'flavor_board' },
      { label: '냉장고', sceneId: 'flavor_fridge' },
      { label: '보안 포스터', sceneId: 'flavor_poster' },
      { label: '엘리베이터 로그', sceneId: 'flavor_elevator' },
      { label: '회의실', sceneId: 'meeting_entry' },
    ],
    leave: { label: '안내 구역으로 돌아간다', sceneId: 'ch1_floor7_leave' },
  },
  meetingRoom: {
    hubSceneId: 'meeting_room_hub',
    label: '7F 회의실',
    floorId: '7F',
    wallpaperAssetId: 'bg_meeting_room',
    ambient: '프로젝터 팬 소리만 얇게 깔린다.',
    systemMessage: 'GROOMY OFFICE · 회의실 조사',
    emotion: 'neutral',
    prompt: '테이블 주변을 어디부터 살펴볼까요?',
    spots: [
      { label: '화이트보드', sceneId: 'flavor_whiteboard' },
      { label: '프로젝터', sceneId: 'flavor_projector' },
      { label: '창문', sceneId: 'flavor_window' },
      { label: '최민준 팀장 자리', sceneId: 'flavor_choi_seat' },
      { label: '강이솔 자리', sceneId: 'flavor_kim_seat' },
      { label: '회의 시작', sceneId: 'meeting_chat' },
    ],
    leave: { label: '7층 복도로 나간다', sceneId: 'floor7_hub' },
  },
  floor3: {
    hubSceneId: 'floor3_hub',
    label: '3F 계단실',
    floorId: '3F',
    ambient: '발소리가 한 박자 늦게 되돌아온다. 위쪽 자료실 철문 너머로 공기가 무겁게 밀려 온다.',
    foreshadow: [
      '문 틈새로 오래된 피 냄새가 스친다. 보정 레이어가 덮지 못한 것 같다.',
      '안쪽에서 짧은 숨소리가 들렸다가 곧 끊긴다. 문 유리 너머 그림자가 한 번 스쳤다.',
    ],
    systemMessage: 'GROOMY OFFICE · 3F 비상계단 조사',
    emotion: 'warning',
    prompt: '조용히 확인하세요. 위치를 고르면 기록이 남습니다.',
    spots: [
      { label: '혈흔', sceneId: 'clue_blood' },
      { label: '꺼진 CCTV', sceneId: 'clue_camera' },
      { label: '비상구', sceneId: 'exit_floor3' },
    ],
  },
}

/** @deprecated CH1은 RPG 타일맵을 쓰지 않음. 스키마 호환용 빈 객체 */
export const chapter01Maps = {}
