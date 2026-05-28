import assert from 'node:assert/strict'
import { chapterRegistry } from '../engine/progression/chapterRegistry.js'
import { safeResolveSceneTransition, validateRuntimeSceneIntegrity } from '../tools/validators/runtimeIntegrity.js'

const valid = validateRuntimeSceneIntegrity({
  chapterRegistry,
  chapterId: 'prologue',
  sceneId: 'start',
})
assert.equal(valid.ok, true)

const missing = validateRuntimeSceneIntegrity({
  chapterRegistry,
  chapterId: 'prologue',
  sceneId: 'missing_scene',
})
assert.equal(missing.ok, false)
assert.equal(missing.code, 'missing-scene')

const recovered = safeResolveSceneTransition({
  chapterRegistry,
  chapterId: 'prologue',
  sceneId: 'missing_scene',
})
assert.equal(recovered.ok, true)
assert.equal(recovered.recovered, true)
assert.equal(recovered.sceneId, 'start')

console.log('runtimeIntegrity.test.js passed')
