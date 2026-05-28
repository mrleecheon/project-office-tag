import { chapters } from '../../content/chapters/index.js'

const IMAGE_PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='256' height='144'><rect width='100%' height='100%' fill='%2314202d'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%235e89ab' font-size='14'>missing image</text></svg>"
const AUDIO_PLACEHOLDER = 'data:audio/mp3;base64,'

function addImage(assetSet, path) {
  if (!path || typeof path !== 'string') return
  assetSet.add(path)
}

function addAudio(assetSet, path) {
  if (!path || typeof path !== 'string') return
  assetSet.add(path)
}

function collectChapterAssets(chapter) {
  const images = new Set()
  const audio = new Set()
  for (const scene of Object.values(chapter?.scenes ?? {})) {
    addImage(images, scene.backgroundImage)
    addImage(images, scene.overlayImage)
    addImage(images, scene.portraitImage)
    addAudio(audio, scene.bgm)
    addAudio(audio, scene.ambientAudio)
    for (const line of scene.lines ?? []) {
      if (line.portrait) addImage(images, line.portrait.src)
      for (const portrait of line.portraits ?? []) addImage(images, portrait.src)
      addAudio(audio, line.voice)
      addAudio(audio, line.sfx)
    }
  }
  for (const map of Object.values(chapter?.maps ?? {})) {
    addImage(images, map.backgroundImage)
    addImage(images, map.tilesetImage)
    addImage(images, map.playerSprite)
    for (const npc of map.npcs ?? []) addImage(images, npc.sprite)
    addAudio(audio, map.ambientAudio)
  }
  return {
    images: [...images],
    audio: [...audio],
  }
}

export const assetManifest = chapters.reduce((acc, chapter) => {
  acc[chapter.id] = collectChapterAssets(chapter)
  return acc
}, {})

function loadImage(path) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ ok: true, path, resolvedPath: path, kind: 'image' })
    img.onerror = () => {
      console.warn(`[assetManifest] failed image: ${path}`)
      resolve({ ok: false, path, resolvedPath: IMAGE_PLACEHOLDER, kind: 'image' })
    }
    img.src = path
  })
}

function loadAudio(path) {
  return new Promise((resolve) => {
    const audio = new Audio()
    const finish = (ok) => {
      audio.oncanplaythrough = null
      audio.onerror = null
      resolve({ ok, path, resolvedPath: ok ? path : AUDIO_PLACEHOLDER, kind: 'audio' })
    }
    audio.oncanplaythrough = () => finish(true)
    audio.onerror = () => {
      console.warn(`[assetManifest] failed audio: ${path}`)
      finish(false)
    }
    audio.src = path
    audio.load()
  })
}

export async function preloadChapterAssetsById(chapterId, onProgress) {
  const chapterAssets = assetManifest[chapterId] ?? { images: [], audio: [] }
  const queue = [
    ...chapterAssets.images.map((path) => ({ kind: 'image', path })),
    ...chapterAssets.audio.map((path) => ({ kind: 'audio', path })),
  ]
  if (!queue.length) {
    onProgress?.({ loaded: 1, total: 1, progress: 1 })
    return []
  }
  let loaded = 0
  const total = queue.length
  const results = []
  for (const entry of queue) {
    // Sequential loading keeps progress deterministic for UI.
    const result = entry.kind === 'image' ? await loadImage(entry.path) : await loadAudio(entry.path)
    loaded += 1
    results.push(result)
    onProgress?.({ loaded, total, progress: loaded / total })
  }
  return results
}

