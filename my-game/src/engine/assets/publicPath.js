const BASE = import.meta.env?.BASE_URL ?? '/'

/** Prefix Vite base path for public-folder URLs (GitHub Pages project sites). */
export function resolvePublicPath(path) {
  if (!path || typeof path !== 'string') return path
  if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  if (path.startsWith(BASE)) return path
  if (path.startsWith('/')) return `${BASE}${path.slice(1)}`
  return `${BASE}${path}`
}
