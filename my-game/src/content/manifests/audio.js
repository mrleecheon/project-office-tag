export const audioCueManifest = {
  chat: {
    normal: {
      send: 'choice:selected',
      typeTick: 'typewriter:tick',
      unstableTick: 'screen:impact',
    },
    corrupted: {
      send: 'choice:selected',
      typeTick: 'typewriter:tick',
      unstableTick: 'screen:impact',
    },
  },
  vn: {
    impact: 'screen:impact',
    tick: 'typewriter:tick',
  },
  rpg: {
    step: 'rpg:step',
    bump: 'rpg:bump',
    interact: 'rpg:interact',
  },
  ui: {
    hover: 'ui:hover',
    click: 'ui:click',
    confirm: 'ui:confirm',
    cancel: 'ui:cancel',
    open: 'ui:open',
    close: 'ui:close',
    save: 'ui:save',
    load: 'ui:load',
    toggle: 'ui:toggle',
    transition: 'ui:transition',
    scroll: 'ui:scroll',
    notification: 'ui:notification',
    glitch: 'ui:glitch',
  },
}

export function resolveChatCueProfile(profileId = 'normal') {
  return audioCueManifest.chat[profileId] ?? audioCueManifest.chat.normal
}

