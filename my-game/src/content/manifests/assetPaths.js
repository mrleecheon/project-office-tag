/**
 * Canonical public URLs for asset files.
 *
 * Rule: game code and scene content reference stable IDs in assets.js — never these paths.
 * When renaming or moving a file, update this file only (plus move the file on disk).
 *
 * Path pattern: /assets/{category}/…/{name}_{variant}.{ext}
 */

export const assetPaths = {
  backgrounds: {
    shared: {
      officeDefault: '/assets/backgrounds/shared/office_default.png',
      meetingRoom: '/assets/backgrounds/shared/meeting_room.png',
      stairwellFloor3: '/assets/backgrounds/shared/stairwell_floor3.png',
    },
    ch02: {
      lobby: '/assets/backgrounds/ch02/lobby.png',
      serverHall: '/assets/backgrounds/ch02/server_hall.png',
      mirrorRoom: '/assets/backgrounds/ch02/mirror_room.png',
      floor5Audit: '/assets/backgrounds/ch02/floor5_audit.png',
    },
  },
  portraits: {
    groomy: {
      neutralBase: '/assets/portraits/groomy/neutral_base.png',
      smile: '/assets/portraits/groomy/smile.png',
      blank: '/assets/portraits/groomy/blank.png',
    },
    iseol: {
      neutral: '/assets/portraits/iseol/neutral.png',
      warn: '/assets/portraits/iseol/warn.png',
      fear: '/assets/portraits/iseol/fear.png',
    },
    choi: {
      neutral: '/assets/portraits/choi/neutral.png',
    },
  },
  effects: {
    overlays: {
      glitchSoft: '/assets/effects/overlays/glitch_soft.png',
      scanline: '/assets/effects/overlays/scanline.png',
    },
  },
  maps: {
    tilesets: {
      ch02Floor5: '/assets/maps/tilesets/ch02/floor5.png',
    },
  },
  sprites: {
    player: {
      default: '/assets/sprites/player/default.png',
    },
    npc: {
      guard: '/assets/sprites/npc/guard.png',
      analyst: '/assets/sprites/npc/analyst.png',
    },
  },
  intro: {
    scene1OfficeDoor: '/assets/intro/scene1_office_door.png',
    scene2ReaderCloseup: '/assets/intro/scene2_reader_closeup.png',
    scene3CardTag: '/assets/intro/scene3_card_tag.png',
    scene4Title: '/assets/intro/scene4_title.png',
  },
  audio: {
    sfx: {
      chatPingSilent: '/assets/audio/sfx/chat_ping_silent.ogg',
      glitchTickSilent: '/assets/audio/sfx/glitch_tick_silent.ogg',
    },
    ambient: {
      officeHumSilent: '/assets/audio/ambient/office_hum_silent.ogg',
      floor3PulseSilent: '/assets/audio/ambient/floor3_pulse_silent.ogg',
    },
    ui: {
      hover: '/assets/audio/ui/hover.ogg',
      click: '/assets/audio/ui/click.ogg',
      confirm: '/assets/audio/ui/confirm.ogg',
      cancel: '/assets/audio/ui/cancel.ogg',
      open: '/assets/audio/ui/open.ogg',
      close: '/assets/audio/ui/close.ogg',
      save: '/assets/audio/ui/save.ogg',
      load: '/assets/audio/ui/load.ogg',
      toggle: '/assets/audio/ui/toggle.ogg',
      transition: '/assets/audio/ui/transition.ogg',
      notification: '/assets/audio/ui/notification.ogg',
      glitch: '/assets/audio/ui/glitch.ogg',
    },
    bgm: {
      menuLoop: '/assets/audio/bgm/menu_digital_evening.ogg',
      suspenseLoop: '/assets/audio/bgm/investigation_corrupt_data_stream.mp3',
      tensionLoop: '/assets/audio/bgm/tension_claimed_by_the_void_mix.ogg',
    },
  },
}

/** Flat list of every registered file path (for validation tooling). */
export function listRegisteredAssetPaths() {
  const paths = []
  const walk = (node) => {
    if (typeof node === 'string') {
      paths.push(node)
      return
    }
    if (!node || typeof node !== 'object') return
    for (const value of Object.values(node)) walk(value)
  }
  walk(assetPaths)
  return paths
}
