import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/leaflet-sidepanel.js', import.meta.url)),
      formats: ['es', 'cjs', 'umd'],
      name: 'leaflet-sidepanel',
      fileName: (fmt) => `leaflet-sidepanel.${fmt}.js`
    },
    rollupOptions: {
      external: ['leaflet'],
      output: {
        globals: {
          leaflet: 'L',
        }
      }
    }
  }
})
