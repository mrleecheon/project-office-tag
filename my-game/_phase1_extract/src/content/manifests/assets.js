const imageAssets = {
  bg_default_office: { id: 'bg_default_office', type: 'image', src: '/assets/placeholders/bg-default-office.png' },
  bg_meeting_room: { id: 'bg_meeting_room', type: 'image', src: '/assets/placeholders/bg-meeting-room.png' },
  bg_stairwell_floor3: { id: 'bg_stairwell_floor3', type: 'image', src: '/assets/placeholders/bg-stairwell-floor3.png' },
  bg_ch02_lobby: { id: 'bg_ch02_lobby', type: 'image', src: '/assets/cg/ch02_lobby.png' },
  bg_ch02_server_hall: { id: 'bg_ch02_server_hall', type: 'image', src: '/assets/cg/ch02_server_hall.png' },
  bg_ch02_mirror_room: { id: 'bg_ch02_mirror_room', type: 'image', src: '/assets/cg/ch02_mirror_room.png' },
  bg_ch02_floor5: { id: 'bg_ch02_floor5', type: 'image', src: '/assets/bg/ch02_floor5.png' },
  tileset_ch02: { id: 'tileset_ch02', type: 'image', src: '/assets/tiles/ch02_tileset.png' },
  sprite_ch02_player: { id: 'sprite_ch02_player', type: 'image', src: '/assets/sprites/player_ch02.png' },
  sprite_ch02_guard: { id: 'sprite_ch02_guard', type: 'image', src: '/assets/sprites/npc_guard.png' },
  sprite_ch02_analyst: { id: 'sprite_ch02_analyst', type: 'image', src: '/assets/sprites/npc_analyst.png' },
  overlay_glitch_soft: { id: 'overlay_glitch_soft', type: 'image', src: '/assets/placeholders/overlay-glitch-soft.png' },
  overlay_scanline: { id: 'overlay_scanline', type: 'image', src: '/assets/placeholders/overlay-scanline.png' },
  portrait_unknown_base: { id: 'portrait_unknown_base', type: 'image', src: '/assets/placeholders/portrait-unknown-base.png' },
  portrait_unknown_smile: { id: 'portrait_unknown_smile', type: 'image', src: '/assets/portraits/unknown/smile.png' },
  portrait_unknown_blank: { id: 'portrait_unknown_blank', type: 'image', src: '/assets/portraits/unknown/blank.png' },
  portrait_kim_base: { id: 'portrait_kim_base', type: 'image', src: '/assets/portraits/kim/base.png' },
  portrait_kim_warning: { id: 'portrait_kim_warning', type: 'image', src: '/assets/portraits/kim/warn.png' },
  portrait_kim_fear: { id: 'portrait_kim_fear', type: 'image', src: '/assets/portraits/kim/fear.png' },
  portrait_choi_base: { id: 'portrait_choi_base', type: 'image', src: '/assets/placeholders/portrait-choi-base.png' },
}

const audioAssets = {
  sfx_chat_ping: { id: 'sfx_chat_ping', type: 'audio', src: '/assets/placeholders/sfx-chat-ping-silent.ogg' },
  sfx_glitch_tick: { id: 'sfx_glitch_tick', type: 'audio', src: '/assets/placeholders/sfx-glitch-tick-silent.ogg' },
  amb_office_hum: { id: 'amb_office_hum', type: 'audio', src: '/assets/placeholders/amb-office-hum-silent.ogg' },
  amb_floor3_pulse: { id: 'amb_floor3_pulse', type: 'audio', src: '/assets/placeholders/amb-floor3-pulse-silent.ogg' },
}

export const assetManifest = {
  images: imageAssets,
  audio: audioAssets,
}

export function resolveImageAsset(assetId) {
  if (!assetId) return null
  return assetManifest.images[assetId] ?? null
}

export function resolveAudioAsset(assetId) {
  if (!assetId) return null
  return assetManifest.audio[assetId] ?? null
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

