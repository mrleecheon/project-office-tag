export function resolveChapterClearCopy(chapterId, state) {
  if (chapterId === 'chapter-01') {
    return {
      kicker: 'CHAPTER 1 CLEAR',
      title: '첫 번째 단서',
      body: `${state.nickname}님은 3층에서 무언가를 발견했습니다.`,
      sub: '박준혁 선임은 어디 있는 걸까요?',
    }
  }

  return {
    kicker: 'SESSION TRANSFER READY',
    title: '프롤로그 종료',
    body: `${state.nickname}님의 첫 번째 날이 시작되었습니다.`,
    sub: '3층에서 무슨 일이 있었던 걸까요?',
  }
}
