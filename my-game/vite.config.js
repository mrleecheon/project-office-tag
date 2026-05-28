import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { claudeReviewBundlePlugin } from './scripts/bundle-claude-review.mjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), claudeReviewBundlePlugin()],
})
