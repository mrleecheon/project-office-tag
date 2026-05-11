import { cueMap } from './cueMap.js'

export function createAudioService() {
  return {
    play(cueName) {
      const cue = cueMap[cueName]
      if (!cue) return
      // Hook point for real assets; kept silent until audio files are added.
    },
  }
}
