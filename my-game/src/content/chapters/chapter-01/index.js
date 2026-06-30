import { SceneModes } from '../../../engine/contracts.js'
import { resolveImageAsset } from '../../manifests/assets.js'
import { CH01_ASSETS as ASSETS } from './assets.js'
import { chapter01Maps as rawChapter01Maps } from './maps.js'
import { chapter01Scenes as rawChapter01Scenes } from './scenes.js'

function imageUrl(assetId) {
  return resolveImageAsset(assetId)?.src ?? null
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

export const chapter01Maps = Object.fromEntries(
  Object.entries(rawChapter01Maps).map(([mapId, map]) => [mapId, decorateMap(map)]),
)

export const chapter01 = {
  id: 'chapter-01',
  label: 'Chapter 1',
  title: '첫 번째 날',
  startSceneId: 'morning_briefing',
  scenes: rawChapter01Scenes,
  maps: chapter01Maps,
}

export { chapter01Scenes } from './scenes.js'
