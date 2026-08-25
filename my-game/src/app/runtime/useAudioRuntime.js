import { useEffect, useMemo } from 'react'
import { createAudioService } from '../../engine/audio/audioService.js'
import { eventBus } from '../../engine/events/eventBus.js'
import { GameEvents } from '../../engine/events/gameEvents.js'
import { chapterRegistry } from '../../engine/progression/chapterRegistry.js'
import { SceneModes } from '../../engine/contracts.js'

export function useAudioRuntime() {
  const audioService = useMemo(() => createAudioService(), [])

  useEffect(() => {
    audioService.playBgm('bgm_menu_loop')
    const offAudioCue = eventBus.on(GameEvents.AUDIO_CUE, ({ name, ...detail }) => {
      audioService.play(name, detail)
    })
    const offSceneEntered = eventBus.on(GameEvents.SCENE_ENTERED, ({ chapterId, sceneId }) => {
      const scene = chapterRegistry.getScene(chapterId, sceneId)
      if (scene?.emotion === 'warning' || scene?.important) {
        audioService.playBgm('bgm_tension_loop')
      } else if (scene?.mode === SceneModes.RPG) {
        audioService.playBgm('bgm_suspense_loop')
      } else {
        audioService.playBgm('bgm_menu_loop')
      }
      audioService.play('ui:transition')
    })
    return () => {
      offAudioCue()
      offSceneEntered()
      audioService.stopBgm()
    }
  }, [audioService])
}
