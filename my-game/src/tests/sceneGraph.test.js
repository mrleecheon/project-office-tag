import assert from 'node:assert/strict'
import { chapters } from '../content/chapters/index.js'
import { getReachableSceneIds, validateAllChapters } from '../engine/progression/sceneGraph.js'

const errors = validateAllChapters(chapters)
assert.deepEqual(errors, [], `Scene graph errors:\n${errors.join('\n')}`)

for (const chapter of chapters) {
  const reachable = getReachableSceneIds(chapter)
  assert.ok(reachable.has(chapter.startSceneId), `${chapter.id}: start scene is unreachable`)
  for (const sceneId of Object.keys(chapter.scenes)) {
    assert.ok(reachable.has(sceneId), `${chapter.id}: ${sceneId} is unreachable`)
  }
}

console.log('sceneGraph.test.js passed')
