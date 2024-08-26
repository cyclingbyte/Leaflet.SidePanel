import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/leaflet-sidepanel.ts', import.meta.url)),
      formats: ['es', 'cjs', 'umd'],
      name: 'leaflet-sidepanel',
      fileName: (format) => `leaflet-sidepanel.${format}.js`
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
