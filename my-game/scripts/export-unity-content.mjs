import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { chapters } from '../src/content/chapters/index.js'
import { assetManifest } from '../src/content/manifests/assets.js'
import { audioCueManifest } from '../src/content/manifests/audio.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const outputRoot = path.join(projectRoot, 'dist', 'unity')

const PLACEHOLDER_CONTEXT = Object.freeze({
  nickname: '{nickname}',
})

function resolveFunctionValue(fn) {
  try {
    const value = fn(PLACEHOLDER_CONTEXT)
    return typeof value === 'string' ? value : ''
  } catch {
    return ''
  }
}

function sanitize(value, keyPath = []) {
  if (value === null || value === undefined) return value
  if (Array.isArray(value)) return value.map((item, index) => sanitize(item, [...keyPath, String(index)]))

  if (typeof value === 'function') {
    const lastKey = keyPath[keyPath.length - 1] ?? ''
    if (lastKey === 'text') {
      return resolveFunctionValue(value)
    }
    return undefined
  }

  if (typeof value !== 'object') return value

  const result = {}
  for (const [key, innerValue] of Object.entries(value)) {
    const sanitized = sanitize(innerValue, [...keyPath, key])
    if (sanitized !== undefined) {
      result[key] = sanitized
    }
  }
  return result
}

function normalizeChapter(chapter) {
  const scenes = Object.values(chapter.scenes ?? {})
  const maps = Object.values(chapter.maps ?? {})

  return sanitize({
    id: chapter.id,
    label: chapter.label,
    title: chapter.title,
    startSceneId: chapter.startSceneId,
    bootLines: chapter.bootLines ?? [],
    scenes,
    maps,
  })
}

async function writeJson(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

async function exportUnityContent() {
  const normalizedChapters = chapters.map(normalizeChapter)
  const chapterIndex = normalizedChapters.map(({ id, label, title, startSceneId }) => ({
    id,
    label,
    title,
    startSceneId,
  }))

  const bundle = {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    chapters: normalizedChapters,
    chapterIndex,
    manifests: sanitize({
      assets: assetManifest,
      audioCues: audioCueManifest,
    }),
  }

  await writeJson(path.join(outputRoot, 'content-bundle.json'), bundle)
  await writeJson(path.join(outputRoot, 'chapter-index.json'), chapterIndex)
  await writeJson(path.join(outputRoot, 'manifests', 'assets.json'), sanitize(assetManifest))
  await writeJson(path.join(outputRoot, 'manifests', 'audio-cues.json'), sanitize(audioCueManifest))

  for (const chapter of normalizedChapters) {
    await writeJson(path.join(outputRoot, 'chapters', `${chapter.id}.json`), chapter)
  }

  console.log(`Unity export complete: ${path.relative(projectRoot, outputRoot)}`)
}

exportUnityContent().catch((error) => {
  console.error('[export-unity-content] failed:', error)
  process.exitCode = 1
})
