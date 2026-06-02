import { SceneModes } from '../../engine/contracts.js'
import { resolveChapterClearCopy } from '../../engine/progression/endings.js'
import BootScreen from '../../renderers/system/BootScreen.jsx'
import ChapterClearScreen from '../../renderers/system/ChapterClearScreen.jsx'
import DemoEndScreen from '../../renderers/system/DemoEndScreen.jsx'
import NfcScreen from '../../renderers/system/NfcScreen.jsx'

export default function SystemScreenRouter({
  state,
  chapter,
  scene,
  clearCopy,
  runtimeError,
  onNfcDone,
  onBootDone,
  onClearContinue,
  onRestart,
  onEnterChapter,
  onRuntimeErrorContinue,
}) {
  if (runtimeError) {
    return (
      <ChapterClearScreen
        copy={{
          kicker: 'SESSION RECOVERY',
          title: '세션 복구 안내',
          body: `${runtimeError.message}\n안전한 시작 지점으로 복구했습니다.`,
          continueLabel: '복구하기',
        }}
        onContinue={onRuntimeErrorContinue}
        onRestart={onRestart}
      />
    )
  }

  if (state.screen === 'nfc') {
    return <NfcScreen onDone={onNfcDone} />
  }

  if (state.screen === 'boot') {
    return <BootScreen lines={chapter?.bootLines ?? []} onDone={onBootDone} />
  }

  if (state.screen === 'demoEnd') {
    return <DemoEndScreen onRestart={onRestart} />
  }

  if (state.screen === 'chapterClear') {
    return <ChapterClearScreen copy={clearCopy ?? resolveChapterClearCopy(state.activeChapterId, state)} onContinue={onClearContinue} onRestart={onRestart} />
  }

  if (scene?.mode === SceneModes.END) {
    const nextChapterId = state.chapterEnded
      ? null
      : (scene.nextChapterId ?? scene.end?.nextChapterId)
    const baseCopy = resolveChapterClearCopy(chapter.id, state)
    const copy = scene.localId === 'ch4_end_bad'
      ? {
          kicker: 'BAD END',
          title: scene.title ?? '잘 가, 신입',
          body: '그루미가 돕지 않은 채 감사 권한이 회수되었습니다. 진실은 어둠 속에 남았습니다.',
          sub: 'CHAPTER 4 · ABANDON ROUTE',
          continueLabel: '처음으로',
        }
      : baseCopy
    return (
      <ChapterClearScreen
        copy={copy}
        onContinue={() => {
          if (nextChapterId && onEnterChapter(nextChapterId)) return
          onClearContinue()
        }}
        onRestart={onRestart}
      />
    )
  }

  return null
}
