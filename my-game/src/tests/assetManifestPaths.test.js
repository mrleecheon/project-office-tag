import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { listRegisteredAssetPaths } from '../content/manifests/assetPaths.js'
import { assetManifest } from '../content/manifests/assets.js'

const publicRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../public')
const missing = []

for (const filePath of listRegisteredAssetPaths()) {
  const diskPath = path.join(publicRoot, filePath.replace(/^\//, ''))
  if (!fs.existsSync(diskPath)) missing.push(filePath)
}

assert.equal(missing.length, 0, `registered asset files missing on disk:\n${missing.join('\n')}`)

const manifestPaths = new Set([
  ...Object.values(assetManifest.images).map((entry) => entry.src),
  ...Object.values(assetManifest.audio).map((entry) => entry.src),
])

for (const filePath of listRegisteredAssetPaths()) {
  assert.ok(manifestPaths.has(filePath), `assetPaths entry not wired in assetManifest: ${filePath}`)
}

console.log('assetManifestPaths.test.js passed')
