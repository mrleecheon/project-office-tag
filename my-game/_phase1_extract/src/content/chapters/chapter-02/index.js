import { SceneModes } from '../../../engine/contracts.js'
import { resolveImageAsset } from '../../manifests/assets.js'
import { CH02_ASSETS as ASSETS } from './assets.js'
import { rawChapter02Maps } from './maps.js'
import { rawChapter02Scenes } from './scenes.js'

function addLineRefs(scene) {
  if (!Array.isArray(scene.lines)) return scene
  return {
    ...scene,
    lines: scene.lines.map((line, index) => ({
      ...line,
      textKey: line.textKey ?? `${scene.id}.line${String(index + 1).padStart(2, '0')}`,
    })),
  }
}

function imageUrl(assetId) {
  return resolveImageAsset(assetId)?.src ?? null
}

function hydrateLinePortrait(line) {
  if (!line.portrait) return line
  const portrait = line.portrait
  const resolvedSrc = portrait.src ?? imageUrl(portrait.baseId ?? portrait.exprId)
  if (!resolvedSrc) return line
  return {
    ...line,
    portrait: { ...portrait, src: resolvedSrc },
  }
}

function addSceneRefs(scene) {
  const withLineRefs = addLineRefs(scene)

  const base = {
    ...withLineRefs,
    modeLabelKey:
      withLineRefs.mode === SceneModes.VN ? 'modeBarVnDefault'
      : withLineRefs.mode === SceneModes.RPG ? 'modeBarRpgDefault'
      : 'modeBarChatDefault',
  }

  if (Array.isArray(withLineRefs.lines)) {
    base.lines = withLineRefs.lines.map(hydrateLinePortrait)
  }

  if (withLineRefs.mode === SceneModes.CHAT) {
    base.chatTheme = withLineRefs.chatTheme ?? {
      profileId: withLineRefs.emotion === 'warning' ? 'corrupted' : 'normal',
      wallpaperAssetId: withLineRefs.emotion === 'warning' ? ASSETS.overlay.glitchSoft : ASSETS.bg.lobby,
    }
  }

  if (withLineRefs.mode === SceneModes.VN) {
    const stage = withLineRefs.vnStage ?? {}
    base.vnStage = {
      bgId: stage.bgId ?? withLineRefs.backgroundAssetId ?? ASSETS.bg.lobby,
      overlayId: stage.overlayId ?? (withLineRefs.important ? ASSETS.overlay.glitchSoft : ASSETS.overlay.scanline),
      characters: stage.characters ?? [],
    }
    base.backgroundImage = base.backgroundImage ?? imageUrl(base.vnStage.bgId)
  }

  return base
}

function decorateMap(map) {
  return {
    ...map,
    backgroundImage: imageUrl(map.backgroundAssetId) ?? map.backgroundImage,
    tilesetImage: imageUrl(map.tilesetAssetId) ?? map.tilesetImage,
    playerSprite: imageUrl(map.playerSpriteAssetId) ?? map.playerSprite,
    npcs: (map.npcs ?? []).map((npc) => ({
      ...npc,
      sprite: imageUrl(npc.spriteAssetId) ?? npc.sprite,
    })),
  }
}

export const chapter02Maps = Object.fromEntries(
  Object.entries(rawChapter02Maps).map(([mapId, map]) => [mapId, decorateMap(map)]),
)

export const chapter02Scenes = Object.fromEntries(
  Object.entries(rawChapter02Scenes).map(([localId, scene]) => [localId, addSceneRefs(scene)]),
)

export const chapter02 = {
  id: 'chapter-02',
  label: 'Chapter 2',
  title: '감사 구역',
  startSceneId: 'arrival_vn',
  scenes: chapter02Scenes,
  maps: chapter02Maps,
}
