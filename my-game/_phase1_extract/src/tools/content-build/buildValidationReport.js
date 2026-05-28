import fs from 'node:fs'
import path from 'node:path'
import { chapters } from '../../content/chapters/index.js'
import { validateAllChapters } from '../../engine/progression/sceneGraph.js'
import { validateAllChapterSchemas } from '../validators/chapterSchema.js'

function makeReport() {
  const schemaErrors = validateAllChapterSchemas(chapters)
  const graphErrors = validateAllChapters(chapters)
  const chapterSummary = chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    scenes: Object.keys(chapter.scenes ?? {}).length,
    maps: Object.keys(chapter.maps ?? {}).length,
  }))

  return {
    generatedAt: new Date().toISOString(),
    hasErrors: schemaErrors.length > 0 || graphErrors.length > 0,
    schemaErrors,
    graphErrors,
    chapterSummary,
  }
}

const report = makeReport()
const outputPath = path.resolve(globalThis.process.cwd(), 'dist', 'validation-report.json')
fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8')
console.log(`Validation report written: ${outputPath}`)
if (report.hasErrors) globalThis.process.exitCode = 1
