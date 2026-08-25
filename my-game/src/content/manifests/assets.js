import { resolvePublicPath } from '../../engine/assets/publicPath.js'
import { assetPaths as P } from './assetPaths.js'

const imageAssets = {
  bg_default_office: { id: 'bg_default_office', type: 'image', src: P.backgrounds.shared.officeDefault, width: 576, height: 1024 },
  bg_meeting_room: { id: 'bg_meeting_room', type: 'image', src: P.backgrounds.shared.meetingRoom, width: 576, height: 1024 },
  bg_stairwell_floor3: { id: 'bg_stairwell_floor3', type: 'image', src: P.backgrounds.shared.stairwellFloor3, width: 576, height: 1024 },
  bg_ch02_lobby: { id: 'bg_ch02_lobby', type: 'image', src: P.backgrounds.ch02.lobby },
  bg_ch02_server_hall: { id: 'bg_ch02_server_hall', type: 'image', src: P.backgrounds.ch02.serverHall },
  bg_ch02_mirror_room: { id: 'bg_ch02_mirror_room', type: 'image', src: P.backgrounds.ch02.mirrorRoom },
  bg_ch02_floor5: { id: 'bg_ch02_floor5', type: 'image', src: P.backgrounds.ch02.floor5Audit },
  tileset_ch02: { id: 'tileset_ch02', type: 'image', src: P.maps.tilesets.ch02Floor5 },
  sprite_ch02_player: { id: 'sprite_ch02_player', type: 'image', src: P.sprites.player.default },
  sprite_ch02_guard: { id: 'sprite_ch02_guard', type: 'image', src: P.sprites.npc.guard },
  sprite_ch02_analyst: { id: 'sprite_ch02_analyst', type: 'image', src: P.sprites.npc.analyst },
  overlay_glitch_soft: { id: 'overlay_glitch_soft', type: 'image', src: P.effects.overlays.glitchSoft, width: 682, height: 1024 },
  overlay_scanline: { id: 'overlay_scanline', type: 'image', src: P.effects.overlays.scanline, width: 682, height: 1024 },
  portrait_unknown_base: { id: 'portrait_unknown_base', type: 'image', src: P.portraits.groomy.neutralBase, width: 682, height: 1024 },
  portrait_unknown_smile: { id: 'portrait_unknown_smile', type: 'image', src: P.portraits.groomy.smile },
  portrait_unknown_blank: { id: 'portrait_unknown_blank', type: 'image', src: P.portraits.groomy.blank },
  portrait_kim_base: { id: 'portrait_kim_base', type: 'image', src: P.portraits.iseol.neutral },
  portrait_kim_warning: { id: 'portrait_kim_warning', type: 'image', src: P.portraits.iseol.warn },
  portrait_kim_fear: { id: 'portrait_kim_fear', type: 'image', src: P.portraits.iseol.fear },
  portrait_choi_base: { id: 'portrait_choi_base', type: 'image', src: P.portraits.choi.neutral, width: 682, height: 1024 },
  intro_scene1_door: { id: 'intro_scene1_door', type: 'image', src: P.intro.scene1OfficeDoor },
  intro_scene2_reader: { id: 'intro_scene2_reader', type: 'image', src: P.intro.scene2ReaderCloseup },
  intro_scene3_card_tag: { id: 'intro_scene3_card_tag', type: 'image', src: P.intro.scene3CardTag },
  intro_scene4_title: { id: 'intro_scene4_title', type: 'image', src: P.intro.scene4Title },
}

const audioAssets = {
  sfx_chat_ping: { id: 'sfx_chat_ping', type: 'audio', src: P.audio.sfx.chatPingSilent },
  sfx_glitch_tick: { id: 'sfx_glitch_tick', type: 'audio', src: P.audio.sfx.glitchTickSilent },
  amb_office_hum: { id: 'amb_office_hum', type: 'audio', src: P.audio.ambient.officeHumSilent },
  amb_floor3_pulse: { id: 'amb_floor3_pulse', type: 'audio', src: P.audio.ambient.floor3PulseSilent },
  ui_hover: { id: 'ui_hover', type: 'audio', src: P.audio.ui.hover },
  ui_click: { id: 'ui_click', type: 'audio', src: P.audio.ui.click },
  ui_confirm: { id: 'ui_confirm', type: 'audio', src: P.audio.ui.confirm },
  ui_cancel: { id: 'ui_cancel', type: 'audio', src: P.audio.ui.cancel },
  ui_open: { id: 'ui_open', type: 'audio', src: P.audio.ui.open },
  ui_close: { id: 'ui_close', type: 'audio', src: P.audio.ui.close },
  ui_save: { id: 'ui_save', type: 'audio', src: P.audio.ui.save },
  ui_load: { id: 'ui_load', type: 'audio', src: P.audio.ui.load },
  ui_toggle: { id: 'ui_toggle', type: 'audio', src: P.audio.ui.toggle },
  ui_transition: { id: 'ui_transition', type: 'audio', src: P.audio.ui.transition },
  ui_scroll: { id: 'ui_scroll', type: 'audio', src: P.audio.ui.hover },
  ui_notification: { id: 'ui_notification', type: 'audio', src: P.audio.ui.notification },
  ui_glitch: { id: 'ui_glitch', type: 'audio', src: P.audio.ui.glitch },
  bgm_menu_loop: { id: 'bgm_menu_loop', type: 'audio', src: P.audio.bgm.menuLoop },
  bgm_suspense_loop: { id: 'bgm_suspense_loop', type: 'audio', src: P.audio.bgm.suspenseLoop },
  bgm_tension_loop: { id: 'bgm_tension_loop', type: 'audio', src: P.audio.bgm.tensionLoop },
}

export const assetManifest = {
  images: imageAssets,
  audio: audioAssets,
}

export function resolveImageAsset(assetId) {
  if (!assetId) return null
  const asset = assetManifest.images[assetId]
  if (!asset) return null
  return { ...asset, src: resolvePublicPath(asset.src) }
}

export function resolveAudioAsset(assetId) {
  if (!assetId) return null
  const asset = assetManifest.audio[assetId]
  if (!asset) return null
  return { ...asset, src: resolvePublicPath(asset.src) }
}

export function collectAssetUrlsFromRefs(assetRefs = []) {
  const urls = []
  for (const ref of assetRefs) {
    const image = resolveImageAsset(ref)
    if (image?.src) urls.push(image.src)
    const audio = resolveAudioAsset(ref)
    if (audio?.src) urls.push(audio.src)
  }
  return urls
}
