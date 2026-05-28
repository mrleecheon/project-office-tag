import assert from 'node:assert/strict'
import { chapters } from '../content/chapters/index.js'
import { validateAllChapterSchemas } from '../tools/validators/chapterSchema.js'

const errors = validateAllChapterSchemas(chapters)
assert.deepEqual(errors, [], `Chapter schema errors:\n${errors.join('\n')}`)

console.log('contentSchema.test.js passed')
