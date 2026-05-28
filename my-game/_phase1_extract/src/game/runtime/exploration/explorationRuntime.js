export function isBlockedTile(map, row, col) {
  return row < 0 || row >= map.rows || col < 0 || col >= map.cols || map.grid[row]?.[col] === 1
}

export function resolveInteractableTarget(map, position) {
  const facing = position.facing ?? { dr: 0, dc: 1 }
  const candidates = [
    [position.row + facing.dr, position.col + facing.dc],
    [position.row, position.col],
    [position.row - 1, position.col],
    [position.row + 1, position.col],
    [position.row, position.col - 1],
    [position.row, position.col + 1],
  ]

  for (const [row, col] of candidates) {
    const key = `${row}-${col}`
    const npc = (map.npcs ?? []).find((entry) => {
      const npcRow = entry.position?.row ?? entry.row
      const npcCol = entry.position?.col ?? entry.col
      return npcRow === row && npcCol === col
    })
    if (npc) {
      return { key, label: npc.label ?? npc.name ?? npc.id, trigger: npc.trigger, type: 'npc' }
    }
    const eventTile = (map.eventTiles ?? []).find((entry) => entry.key === key)
    if (eventTile) {
      return { key, label: map.labels?.[key] ?? 'Event', trigger: eventTile.trigger, type: 'event' }
    }
    const tile = map.grid[row]?.[col]
    if ((tile === 2 || tile === 3 || tile === 4) && map.labels?.[key]) {
      return { key, label: map.labels[key], trigger: map.triggers?.[key], type: 'tile' }
    }
  }
  return null
}

export function canTriggerInteraction(lastTriggerAt, nowMs, cooldownMs = 220) {
  if (!lastTriggerAt) return true
  return nowMs - lastTriggerAt >= cooldownMs
}
