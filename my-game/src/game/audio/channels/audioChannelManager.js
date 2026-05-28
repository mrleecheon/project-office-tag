export function createAudioChannelManager() {
  const cooldownByChannel = new Map()
  const channelByCue = new Map([
    ['nfc:scan', 'ui'],
    ['typing:start', 'ui'],
    ['typewriter:tick', 'ui'],
    ['choice:selected', 'ui'],
    ['screen:impact', 'impact'],
    ['rpg:step', 'world'],
    ['rpg:bump', 'world'],
    ['rpg:interact', 'world'],
  ])
  const cooldownMsByChannel = new Map([
    ['ui', 22],
    ['world', 28],
    ['impact', 90],
  ])

  return {
    canPlay(cueName, nowMs) {
      const channel = channelByCue.get(cueName) ?? 'ui'
      const cooldown = cooldownMsByChannel.get(channel) ?? 25
      const previous = cooldownByChannel.get(channel) ?? 0
      if (nowMs - previous < cooldown) return false
      cooldownByChannel.set(channel, nowMs)
      return true
    },
  }
}
