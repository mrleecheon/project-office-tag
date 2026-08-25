/**
 * Electron preload will later expose `window.electronAPI`.
 * Until that exists this is always false (web / Vite).
 */
export function isElectron() {
  return typeof window !== 'undefined' && Boolean(window.electronAPI)
}

export function quitApp() {
  // window.electronAPI.quit() is provided by Electron preload (not implemented yet).
  window.electronAPI?.quit?.()
}
