import { SaveVersion } from '../contracts.js'

export const initialGameState = {
  version: SaveVersion,
  screen: 'nfc',
  activeChapterId: 'prologue',
  activeSceneId: 'start',
  nickname: '플레이어',
  flags: [],
  inventory: [],
  scores: {
    trust: 0,
    suspicion: 0,
    risk: 0,
    groomyAffinity: 0,
    mysteryEvidence: 0,
    batteryDesperation: 0,
    corporateSuspicion: 0,
  },
  visitedScenes: [],
  mapPositions: {},
  routeHistory: [],
  chapterEnded: false,
}
