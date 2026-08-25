import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const workspaceRoot = path.resolve(rootDir, '..')
const myGamePublic = path.resolve(workspaceRoot, 'my-game/public')
const require = createRequire(import.meta.url)
const reactDir = path.dirname(require.resolve('react/package.json'))
const reactDomDir = path.dirname(require.resolve('react-dom/package.json'))
const framerDir = path.dirname(require.resolve('framer-motion/package.json'))

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.css': 'text/css',
  '.js': 'text/javascript',
}

function serveMyGamePublic() {
  return {
    name: 'serve-my-game-public',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = decodeURIComponent((req.url ?? '').split('?')[0])
        if (!pathname || pathname === '/' || pathname.startsWith('/@') || pathname.startsWith('/src') || pathname.startsWith('/node_modules')) {
          next()
          return
        }
        const filePath = path.normalize(path.join(myGamePublic, pathname))
        if (!filePath.startsWith(myGamePublic)) {
          next()
          return
        }
        try {
          const stat = fs.statSync(filePath)
          if (!stat.isFile()) {
            next()
            return
          }
          const ext = path.extname(filePath).toLowerCase()
          res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream')
          fs.createReadStream(filePath).pipe(res)
        } catch {
          next()
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [serveMyGamePublic(), react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'framer-motion'],
    alias: {
      '@groomy/game': path.resolve(workspaceRoot, 'my-game/src'),
      react: reactDir,
      'react-dom': reactDomDir,
      'framer-motion': framerDir,
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion'],
  },
  server: {
    port: 5180,
    fs: { allow: [workspaceRoot] },
  },
})
