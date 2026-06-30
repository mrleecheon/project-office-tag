import assert from 'node:assert/strict'
import { resolveMapInvestigationProgress } from '../game/runtime/exploration/investigationProgress.js'

const map = {
  investigation: {
    progressLabel: '테스트 조사',
    exitScene: 'next_scene',
    spots: [
      { flag: 'ch1CheckedMissingMemorialNotice', label: '게시판', tileKey: '2-2', trigger: 'flavor_board' },
    ],
  },
}

const state = {
  flags: ['ch1CheckedMissingMemorialNotice'],
  scores: {},
  inventory: [],
}

const progress = resolveMapInvestigationProgress(map, state)
assert.equal(progress.visited, 1)
assert.equal(progress.spots[0].done, true)
assert.ok(progress.visitedTileKeys.has('2-2'))

console.log('investigationProgress.test.js passed')
