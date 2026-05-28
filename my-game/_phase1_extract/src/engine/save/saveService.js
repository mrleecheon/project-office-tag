import { migrateSave } from './migrations.js'
import { isValidSave } from './saveSchema.js'
import { localStorageAdapter } from './storageAdapter.js'

export function createSaveService(adapter = localStorageAdapter) {
  function parsePayload(payload) {
    if (!payload) return null
    const state = payload.state ?? payload
    const migrated = migrateSave(state)
    return isValidSave(migrated) ? migrated : null
  }

  return {
    load() {
      return parsePayload(adapter.read())
    },
    loadSlot(slotId = 'autosave') {
      if (!adapter.readFromSlot) return this.load()
      return parsePayload(adapter.readFromSlot(slotId))
    },
    save(state) {
      adapter.write(state)
    },
    saveSlot(slotId, state) {
      if (!adapter.writeToSlot) {
        adapter.write(state)
        return
      }
      adapter.writeToSlot(slotId, state)
    },
    listSlots() {
      return adapter.listSlots ? adapter.listSlots() : []
    },
    clearSlot(slotId) {
      if (adapter.clearSlot) adapter.clearSlot(slotId)
    },
    clear() {
      adapter.clear()
    },
  }
}

export const saveService = createSaveService()
