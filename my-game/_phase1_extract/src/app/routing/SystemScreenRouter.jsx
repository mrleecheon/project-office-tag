import { SceneModes } from '../../engine/contracts.js'
import { resolveChapterClearCopy } from '../../engine/progression/endings.js'
import BootScreen from '../../renderers/system/BootScreen.jsx'
import ChapterClearScreen from '../../renderers/system/ChapterClearScreen.jsx'
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

  if (state.screen === 'chapterClear') {
    return <ChapterClearScreen copy={clearCopy ?? resolveChapterClearCopy(state.activeChapterId, state)} onContinue={onClearContinue} onRestart={onRestart} />
  }

  if (scene?.mode === SceneModes.END) {
    return (
      <ChapterClearScreen
        copy={resolveChapterClearCopy(chapter.id, state)}
        onContinue={() => {
          if (!onEnterChapter(scene.nextChapterId)) onRestart()
        }}
        onRestart={onRestart}
      />
    )
  }

  return null
}
