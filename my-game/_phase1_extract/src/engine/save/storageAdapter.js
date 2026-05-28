const LEGACY_SAVE_KEY = 'nexus-core-save'
const SLOT_PREFIX = 'nexus-core-save-slot'
const SLOT_INDEX_KEY = 'nexus-core-save-slots'

function getSlotKey(slotId) {
  return `${SLOT_PREFIX}:${slotId}`
}

function nowIso() {
  return new Date().toISOString()
}

export const localStorageAdapter = {
  read() {
    try {
      const autoSave = JSON.parse(window.localStorage.getItem(getSlotKey('autosave')))
      if (autoSave) return autoSave
      const legacy = JSON.parse(window.localStorage.getItem(LEGACY_SAVE_KEY))
      if (legacy) {
        this.writeToSlot('autosave', legacy)
        window.localStorage.removeItem(LEGACY_SAVE_KEY)
      }
      return legacy
    } catch {
      return null
    }
  },
  write(value) {
    this.writeToSlot('autosave', value)
  },
  readFromSlot(slotId) {
    try {
      return JSON.parse(window.localStorage.getItem(getSlotKey(slotId)))
    } catch {
      return null
    }
  },
  writeToSlot(slotId, value) {
    try {
      const payload = {
        slotId,
        savedAt: nowIso(),
        state: value,
      }
      window.localStorage.setItem(getSlotKey(slotId), JSON.stringify(payload))
      const index = this.listSlots().filter((entry) => entry.slotId !== slotId)
      index.push({ slotId, savedAt: payload.savedAt })
      window.localStorage.setItem(SLOT_INDEX_KEY, JSON.stringify(index))
    } catch {
      // Keep runtime alive even if storage quota or private mode blocks writes.
    }
  },
  listSlots() {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(SLOT_INDEX_KEY))
      if (!Array.isArray(parsed)) return []
      return parsed
        .filter((entry) => typeof entry?.slotId === 'string' && typeof entry?.savedAt === 'string')
        .sort((left, right) => right.savedAt.localeCompare(left.savedAt))
    } catch {
      return []
    }
  },
  clearSlot(slotId) {
    window.localStorage.removeItem(getSlotKey(slotId))
    const index = this.listSlots().filter((entry) => entry.slotId !== slotId)
    window.localStorage.setItem(SLOT_INDEX_KEY, JSON.stringify(index))
  },
  clear() {
    for (const { slotId } of this.listSlots()) {
      window.localStorage.removeItem(getSlotKey(slotId))
    }
    window.localStorage.removeItem(SLOT_INDEX_KEY)
    window.localStorage.removeItem(LEGACY_SAVE_KEY)
  },
}
