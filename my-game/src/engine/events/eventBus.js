export function createEventBus() {
  const listeners = new Map()

  return {
    on(eventName, listener) {
      const set = listeners.get(eventName) ?? new Set()
      set.add(listener)
      listeners.set(eventName, set)
      return () => set.delete(listener)
    },
    emit(eventName, payload = {}) {
      for (const listener of listeners.get(eventName) ?? []) listener(payload)
      for (const listener of listeners.get('*') ?? []) listener({ eventName, payload })
    },
  }
}

export const eventBus = createEventBus()
