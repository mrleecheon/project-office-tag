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
}

export function resolveChatCueProfile(profileId = 'normal') {
  return audioCueManifest.chat[profileId] ?? audioCueManifest.chat.normal
}

