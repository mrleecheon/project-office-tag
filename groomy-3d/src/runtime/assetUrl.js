export function assetUrl(path) {
  const base = import.meta.env.BASE_URL || '/'
  const relative = String(path).replace(/^\//, '')
  const joined = `${base}${relative}`
  // Pages base(`/repo/`)에서 glTF 상대 텍스처가 /textures/... 로 깨지지 않게 origin 절대 URL 사용
  if (typeof window !== 'undefined' && window.location?.origin) {
    return new URL(joined, window.location.origin).href
  }
  return joined
}
