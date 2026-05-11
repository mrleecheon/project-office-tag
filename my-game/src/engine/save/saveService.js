import { migrateSave } from './migrations.js'
import { isValidSave } from './saveSchema.js'
import { localStorageAdapter } from './storageAdapter.js'

export function createSaveService(adapter = localStorageAdapter) {
  return {
    load() {
      const migrated = migrateSave(adapter.read())
      return isValidSave(migrated) ? migrated : null
    },
    save(state) {
      adapter.write(state)
    },
    clear() {
      adapter.clear()
    },
  }
}

export const saveService = createSaveService()
