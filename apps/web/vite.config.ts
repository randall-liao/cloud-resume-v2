import { defineConfig } from 'vite'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'

const rootDir = dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // Main resume SPA entry.
        main: resolve(rootDir, 'index.html'),
        // Standalone animated "Spyfall Arena" intro, hosted as its own static
        // page on the same S3/CloudFront bucket (dist/spyfall-arena.html).
        spyfall: resolve(rootDir, 'spyfall-arena.html'),
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    css: true,
  },
})
