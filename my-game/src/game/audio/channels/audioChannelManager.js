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
  const cooldownMsByCue = new Map([
    ['ui:hover', 120],
    ['ui:scroll', 150],
    ['ui:transition', 220],
  ])

  return {
    canPlay(cueName, nowMs) {
      const channel = channelByCue.get(cueName) ?? 'ui'
      const hasCueCooldown = cooldownMsByCue.has(cueName)
      const cooldown = cooldownMsByCue.get(cueName) ?? cooldownMsByChannel.get(channel) ?? 25
      const cooldownKey = hasCueCooldown ? `cue:${cueName}` : `channel:${channel}`
      const previous = cooldownByChannel.get(cooldownKey) ?? 0
      if (nowMs - previous < cooldown) return false
      cooldownByChannel.set(cooldownKey, nowMs)
      return true
    },
  }
}
