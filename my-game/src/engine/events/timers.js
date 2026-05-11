export function createTimerBag() {
  const timers = new Set()

  return {
    later(fn, ms) {
      const timer = setTimeout(() => {
        timers.delete(timer)
        fn()
      }, ms)
      timers.add(timer)
      return timer
    },
    clear() {
      for (const timer of timers) clearTimeout(timer)
      timers.clear()
    },
  }
}
