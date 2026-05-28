import assert from 'node:assert/strict'
import { createSaveService } from '../engine/save/saveService.js'
import { initialGameState } from '../engine/state/initialState.js'

function createMemoryAdapter() {
  const map = new Map()
  const slots = []
  return {
    read() {
      return map.get('autosave') ?? null
    },
    write(value) {
      map.set('autosave', value)
    },
    readFromSlot(slotId) {
      return map.get(slotId) ?? null
    },
    writeToSlot(slotId, value) {
      const payload = { slotId, savedAt: '2026-01-01T00:00:00.000Z', state: value }
      map.set(slotId, payload)
      const next = slots.filter((entry) => entry.slotId !== slotId)
      next.push({ slotId, savedAt: payload.savedAt })
      slots.splice(0, slots.length, ...next)
    },
    listSlots() {
      return [...slots]
    },
    clearSlot(slotId) {
      map.delete(slotId)
      const next = slots.filter((entry) => entry.slotId !== slotId)
      slots.splice(0, slots.length, ...next)
    },
    clear() {
      map.clear()
      slots.splice(0, slots.length)
    },
  }
}

const adapter = createMemoryAdapter()
const service = createSaveService(adapter)

service.saveSlot('manual-1', initialGameState)
assert.equal(service.listSlots().length, 1)
assert.equal(service.loadSlot('manual-1')?.activeChapterId, initialGameState.activeChapterId)

service.clearSlot('manual-1')
assert.equal(service.listSlots().length, 0)

console.log('saveSlots.test.js passed')
