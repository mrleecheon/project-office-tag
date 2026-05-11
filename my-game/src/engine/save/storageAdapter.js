const SAVE_KEY = 'nexus-core-save'

export const localStorageAdapter = {
  read() {
    try {
      return JSON.parse(window.localStorage.getItem(SAVE_KEY))
    } catch {
      return null
    }
  },
  write(value) {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(value))
  },
  clear() {
    window.localStorage.removeItem(SAVE_KEY)
  },
}
