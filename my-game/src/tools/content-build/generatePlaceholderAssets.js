import fs from 'node:fs'
import path from 'node:path'
import { chapters } from '../../content/chapters/index.js'
import { listRegisteredAssetPaths } from '../../content/manifests/assetPaths.js'

const oneByOnePng = globalThis.Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7s2YQAAAAASUVORK5CYII=',
  'base64',
)

const oneByOneJpeg = globalThis.Buffer.from(
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEBAQEA8QDw8QDxAQEA8QEA8QEA8QFREWFhURFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGxAQGi0fHyUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAAEAAQMBIgACEQEDEQH/xAAXAAADAQAAAAAAAAAAAAAAAAAAAQMC/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAER/9oADAMBAAIQAxAAAAG5gP/EABgQAQEAAwAAAAAAAAAAAAAAAAEAEQIS/9oACAEBAAEFAruQ0//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8BP//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8BP//EABYQAAMAAAAAAAAAAAAAAAAAAAABEf/aAAgBAQAGPwKj/8QAFhABAQEAAAAAAAAAAAAAAAAAABEB/9oACAEBAAE/IXP/xAAZEAEBAQEBAQAAAAAAAAAAAAABEQAhMUH/2gAIAQEAAT8hF+4HJPvXwpo3/9oADAMBAAIAAwAAABBP/8QAFBEBAAAAAAAAAAAAAAAAAAAAEP/aAAgBAwEBPxA//8QAFBEBAAAAAAAAAAAAAAAAAAAAEP/aAAgBAgEBPxA//8QAGhABAAMBAQEAAAAAAAAAAAAAAQARITFBUf/aAAgBAQABPxBn0hvw4vBqUOJnGn0zMRxQ9v/aAAwDAQACAAMAAAAQH//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8QP//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8QP//EABoQAQEBAQEBAQAAAAAAAAAAAAERACExQWH/2gAIAQEAAT8Q4wnh1OCn8STtlmk6Q6lDKA8A1f/Z',
  'base64',
)

function collectAssetPaths(value, bucket) {
  if (typeof value === 'string' && value.startsWith('assets/')) {
    bucket.add(value)
    return
  }
  if (Array.isArray(value)) {
    for (const item of value) collectAssetPaths(item, bucket)
    return
  }
  if (!value || typeof value !== 'object') return
  for (const nested of Object.values(value)) collectAssetPaths(nested, bucket)
}

function writePlaceholder(fullPath, extname, relativeAssetPath) {
  if (extname === '.png') {
    fs.writeFileSync(fullPath, oneByOnePng)
    return
  }
  if (extname === '.jpg' || extname === '.jpeg') {
    fs.writeFileSync(fullPath, oneByOneJpeg)
    return
  }
  if (extname === '.svg') {
    const label = relativeAssetPath.replace(/[<>&"]/g, '_')
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="144"><rect width="100%" height="100%" fill="#112130"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#79a7c8" font-size="11">${label}</text></svg>`
    fs.writeFileSync(fullPath, svg, 'utf8')
    return
  }
  // For audio/webp/unknown, an empty file is enough to avoid 404 during layout work.
  fs.writeFileSync(fullPath, '')
}

function main() {
  const assetPaths = new Set()
  collectAssetPaths(chapters, assetPaths)
  for (const registered of listRegisteredAssetPaths()) {
    const relative = registered.replace(/^\//, '')
    if (relative.startsWith('assets/')) assetPaths.add(relative)
  }

  const publicRoot = path.resolve(globalThis.process.cwd(), 'public')
  let created = 0
  let existing = 0

  for (const relativeAssetPath of [...assetPaths].sort()) {
    const targetPath = path.resolve(publicRoot, relativeAssetPath)
    fs.mkdirSync(path.dirname(targetPath), { recursive: true })
    if (fs.existsSync(targetPath)) {
      existing += 1
      continue
    }
    writePlaceholder(targetPath, path.extname(targetPath).toLowerCase(), relativeAssetPath)
    created += 1
  }

  console.log(`Placeholder asset sync complete. created=${created}, existing=${existing}, total=${assetPaths.size}`)
}

main()

