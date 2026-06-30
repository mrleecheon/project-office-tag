import { CH02_ASSETS } from '../chapter-02/assets.js'

export const CH03_ASSETS = {
  bg: {
    office: 'bg_default_office',
    stairwell: 'bg_stairwell_floor3',
    mirror: CH02_ASSETS.bg.mirrorRoom,
  },
  tileset: {
    desk: CH02_ASSETS.tileset.floor5,
    storage: CH02_ASSETS.tileset.floor5,
  },
  sprite: {
    player: CH02_ASSETS.sprite.player,
  },
  portrait: {
    kimBase: CH02_ASSETS.portrait.kimBase,
    kimWarn: CH02_ASSETS.portrait.kimWarn,
    unknownBlank: CH02_ASSETS.portrait.unknownBlank,
  },
  overlay: {
    glitchSoft: CH02_ASSETS.overlay.glitchSoft,
    scanline: CH02_ASSETS.overlay.scanline,
  },
}
