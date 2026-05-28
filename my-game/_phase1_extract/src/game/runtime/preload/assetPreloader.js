import { collectAssetUrlsFromRefs, resolveImageAsset } from '../../../content/manifests/assets.js'

const imageCache = new Map()

function preloadImage(url) {
  if (!url || imageCache.has(url)) return Promise.resolve()
  const img = new Image()
  const promise = new Promise((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = reject
  })
  img.src = url
  imageCache.set(url, promise)
  return promise
}

function collectSceneAssets(scene) {
  const vnCharacterRefs = (scene.vnStage?.characters ?? []).flatMap((character) => [character.baseId, character.exprId])
  const linePortraitRefs = (scene.lines ?? []).flatMap((line) => [
    line.portraitAssetId,
    line.portrait?.baseId,
    line.portrait?.exprId,
  ])
  const manifestRefs = [
    scene.backgroundAssetId,
    scene.overlayAssetId,
    scene.portraitAssetId,
    scene.chatTheme?.wallpaperAssetId,
    scene.vnStage?.bgId,
    scene.vnStage?.overlayId,
    ...vnCharacterRefs,
    ...linePortraitRefs,
  ]

  return [
    scene.backgroundImage,
    scene.overlayImage,
    scene.portraitImage,
    ...collectAssetUrlsFromRefs(manifestRefs),
  ].filter(Boolean)
}

function collectMapAssets(map) {
  const mapRefs = [
    map.backgroundAssetId,
    map.tilesetAssetId,
    map.playerSpriteAssetId,
    map.parallaxAssetId,
    map.minimapAssetId,
    ...(map.ambientFlags ?? []).map((flag) => flag.overlayAssetId),
    ...(map.npcs ?? []).flatMap((npc) => [npc.spriteAssetId]),
  ]
  return [
    map.backgroundImage,
    map.tilesetImage,
    map.playerSprite,
    map.parallaxImage,
    ...collectAssetUrlsFromRefs(mapRefs),
  ].filter(Boolean)
}

export async function preloadChapterAssets(chapter) {
  if (!chapter) return
  const urls = new Set()
  for (const scene of Object.values(chapter.scenes ?? {})) {
    for (const url of collectSceneAssets(scene)) urls.add(url)
  }
  for (const map of Object.values(chapter.maps ?? {})) {
    for (const url of collectMapAssets(map)) urls.add(url)
  }
  await Promise.allSettled([...urls].map(preloadImage))
}

export function resolveImageUrl(assetId, fallbackUrl = '') {
  return resolveImageAsset(assetId)?.src ?? fallbackUrl
}
