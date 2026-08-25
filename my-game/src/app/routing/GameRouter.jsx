import { useMemo } from 'react'
import MessengerAppShell from './MessengerAppShell.jsx'
import OverlayLayer from './OverlayLayer.jsx'
import SystemScreenRouter from './SystemScreenRouter.jsx'
import { useGameRuntimeController } from './useGameRuntimeController.js'

export default function GameRouter({
  afterOfficeIntro = false,
  skipLoad = false,
  startSceneId = null,
  startChapterId = null,
  nickname = null,
  onInterceptScene,
} = {}) {
  const runtime = useGameRuntimeController({
    afterOfficeIntro,
    skipLoad,
    startSceneId,
    startChapterId,
    nickname,
    onInterceptScene,
  })
  const {
    state,
    chapter,
    scene,
    map,
    context,
    slots,
    clearCopy,
    debugOpen,
    saveMenuOpen,
    runtimeError,
    timeline,
    isSystemScreen,
    restart,
    setSaveMenuOpen,
    orchestrator,
    handleSceneDone,
    handleMapMove,
    handleClearContinue,
    handleSaveSlot,
    handleLoadSlot,
    handleDeleteSlot,
    handleNfcDone,
    handleBootDone,
    handleRuntimeErrorContinue,
  } = runtime

  const debugState = useMemo(() => ({
    ...state,
    __activeChapter: chapter,
    __slots: slots,
  }), [chapter, slots, state])

  if (isSystemScreen) {
    return (
      <SystemScreenRouter
        state={state}
        chapter={chapter}
        scene={scene}
        clearCopy={clearCopy}
        runtimeError={runtimeError}
        onNfcDone={handleNfcDone}
        onMenuStart={handleNfcDone}
        onBootDone={handleBootDone}
        onClearContinue={handleClearContinue}
        onRestart={restart}
        onEnterChapter={orchestrator.enterChapter}
        onRuntimeErrorContinue={handleRuntimeErrorContinue}
      />
    )
  }

  return (
    <>
      <MessengerAppShell
        scene={scene}
        chapter={chapter}
        context={context}
        map={map}
        state={state}
        onChoice={(choice) => {
          if (onInterceptScene?.(choice?.next)) return
          orchestrator.handleChoice(choice)
        }}
        onInput={(input, value) => {
          if (onInterceptScene?.(input?.next)) return
          orchestrator.handleInput(input, value)
        }}
        onDone={handleSceneDone}
        onTrigger={(sceneId) => {
          if (onInterceptScene?.(sceneId)) return
          orchestrator.goToScene(sceneId)
        }}
        onMove={handleMapMove}
        onOpenSaveMenu={() => setSaveMenuOpen(true)}
        onRestart={restart}
      />
      <OverlayLayer
        openSaveMenu={saveMenuOpen}
        onCloseSaveMenu={() => setSaveMenuOpen(false)}
        slots={slots}
        onSaveSlot={handleSaveSlot}
        onLoadSlot={handleLoadSlot}
        onDeleteSlot={handleDeleteSlot}
        debugOpen={debugOpen}
        debugState={debugState}
        scene={scene}
        map={map}
        timeline={timeline}
      />
    </>
  )
}
