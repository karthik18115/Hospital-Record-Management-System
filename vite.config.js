/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    force: true, // Attempt to bust caches
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  logLevel: 'info',
})
