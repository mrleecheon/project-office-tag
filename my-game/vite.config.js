import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { claudeReviewBundlePlugin } from './scripts/bundle-claude-review.mjs'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), claudeReviewBundlePlugin()],
})
