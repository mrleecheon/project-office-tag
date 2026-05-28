#!/usr/bin/env node
/**
 * Bundles my-game source into one txt for Claude / external review.
 *
 * Usage:
 *   node scripts/bundle-claude-review.mjs          # one-shot
 *   node scripts/bundle-claude-review.mjs --watch  # rebuild on save
 *
 * Output: claude_review_bundle.txt (project root)
 * With `npm run dev`, vite plugin rebuilds the bundle automatically.
 */

import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const BUNDLE_ROOT = path.resolve(__dirname, '..')
export const BUNDLE_OUT = path.join(BUNDLE_ROOT, 'claude_review_bundle.txt')

const EXTENSIONS = new Set([
  '.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx',
  '.css', '.json', '.md', '.html',
])

const SKIP_DIRS = new Set([
  'node_modules', 'dist', '.git', 'public',
])

const SKIP_FILES = new Set([
  'claude_review_bundle.txt',
  'package-lock.json',
  'bundle-claude-review.mjs',
])

const ROOT_FILES = [
  'package.json',
  'vite.config.js',
  'eslint.config.js',
  'index.html',
  'UNITY_INTEGRATION.md',
  'build-extract-scenes.mjs',
]

const WATCH_ROOTS = ['src', 'scripts']

function normalizeRel(filePath) {
  return path.relative(BUNDLE_ROOT, filePath).replace(/\\/g, '/')
}

export function shouldInclude(relPath, name) {
  if (SKIP_FILES.has(name)) return false
  const ext = path.extname(name).toLowerCase()
  if (!EXTENSIONS.has(ext)) return false
  const parts = relPath.split('/')
  if (parts.some((p) => SKIP_DIRS.has(p))) return false
  return true
}

/** Returns true if this absolute path should trigger a bundle rebuild. */
export function isBundleSourcePath(absPath) {
  const rel = normalizeRel(absPath)
  if (!rel || rel.startsWith('..')) return false
  if (rel === 'claude_review_bundle.txt') return false

  const name = path.basename(rel)
  if (ROOT_FILES.includes(rel)) return shouldInclude(rel, name)

  const top = rel.split('/')[0]
  if (!WATCH_ROOTS.includes(top)) return false
  return shouldInclude(rel, name)
}

async function walk(dir, base = '') {
  const entries = await fsp.readdir(dir, { withFileTypes: true })
  const files = []
  for (const ent of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const rel = base ? `${base}/${ent.name}` : ent.name
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue
      files.push(...await walk(full, rel))
    } else if (shouldInclude(rel.replace(/\\/g, '/'), ent.name)) {
      files.push(rel.replace(/\\/g, '/'))
    }
  }
  return files
}

function separator(relPath) {
  const line = '='.repeat(16)
  return `\n\n${line} FILE: ${relPath} ${line}\n\n`
}

let building = false
let pending = false

export async function buildClaudeBundle({ quiet = false } = {}) {
  if (building) {
    pending = true
    return null
  }
  building = true

  try {
    const relFiles = new Set()

    for (const name of ROOT_FILES) {
      try {
        await fsp.access(path.join(BUNDLE_ROOT, name))
        relFiles.add(name)
      } catch { /* skip */ }
    }

    for (const sub of WATCH_ROOTS) {
      const subPath = path.join(BUNDLE_ROOT, sub)
      try {
        const found = await walk(subPath, sub)
        found.forEach((f) => relFiles.add(f))
      } catch { /* skip */ }
    }

    const sorted = [...relFiles].sort((a, b) => a.localeCompare(b))
    const parts = [
      [
        '# Claude review bundle — my-game',
        `# Generated: ${new Date().toISOString()}`,
        `# Files: ${sorted.length}`,
        '# Auto-updated: npm run dev | npm run bundle:claude:watch',
      ].join('\n') + '\n\n',
    ]

    let totalBytes = 0
    for (const rel of sorted) {
      const full = path.join(BUNDLE_ROOT, rel)
      const content = await fsp.readFile(full, 'utf8')
      totalBytes += Buffer.byteLength(content, 'utf8')
      parts.push(separator(rel), content)
    }

    await fsp.writeFile(BUNDLE_OUT, parts.join(''), 'utf8')

    const stat = await fsp.stat(BUNDLE_OUT)
    const kb = (stat.size / 1024).toFixed(1)
    const mb = (stat.size / 1024 / 1024).toFixed(2)
    if (!quiet) {
      console.log(`[bundle:claude] ${BUNDLE_OUT}`)
      console.log(`  ${sorted.length} files, ${kb} KB (${mb} MB), ~${Math.round(totalBytes / 4)} tokens`)
    }
    return { files: sorted.length, bytes: stat.size }
  } finally {
    building = false
    if (pending) {
      pending = false
      return buildClaudeBundle({ quiet })
    }
  }
}

function scheduleRebuild(runner, delayMs = 350) {
  let timer = null
  return (changedPath) => {
    if (changedPath && !isBundleSourcePath(changedPath)) return
    clearTimeout(timer)
    timer = setTimeout(() => {
      runner().catch((err) => console.error('[bundle:claude]', err))
    }, delayMs)
  }
}

async function startWatch() {
  const rebuild = scheduleRebuild(() => buildClaudeBundle(), 350)

  await buildClaudeBundle()
  console.log('[bundle:claude] watching src/, scripts/, root configs… (Ctrl+C to stop)')

  for (const sub of WATCH_ROOTS) {
    const dir = path.join(BUNDLE_ROOT, sub)
    try {
      fs.watch(dir, { recursive: true }, (_event, filename) => {
        if (!filename) return rebuild(dir)
        rebuild(path.join(dir, filename.toString()))
      })
    } catch (err) {
      console.warn(`[bundle:claude] could not watch ${sub}/:`, err.message)
    }
  }

  for (const name of ROOT_FILES) {
    const file = path.join(BUNDLE_ROOT, name)
    try {
      await fsp.access(file)
      fs.watch(file, () => rebuild(file))
    } catch { /* skip */ }
  }
}

async function main() {
  const watch = process.argv.includes('--watch')
  if (watch) {
    await startWatch()
    return
  }
  await buildClaudeBundle()
}

const isMain = process.argv[1]
  && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))

if (isMain) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

/** Vite plugin: rebuild bundle when source files change during dev. */
export function claudeReviewBundlePlugin() {
  const rebuild = scheduleRebuild(() => buildClaudeBundle({ quiet: true }), 400)
  return {
    name: 'claude-review-bundle',
    configureServer(server) {
      buildClaudeBundle({ quiet: true }).catch((err) => {
        console.error('[bundle:claude]', err)
      })
      const onFs = (file) => rebuild(file)
      server.watcher.on('change', onFs)
      server.watcher.on('add', onFs)
      server.watcher.on('unlink', onFs)
    },
    buildStart() {
      return buildClaudeBundle({ quiet: true })
    },
  }
}
