import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/frontend/dist/',
  server: {
    port: 5173,
    proxy: {
      '/maparj': 'http://localhost:55100',
    },
  },
  build: {
    outDir: '../dist',
  },
})