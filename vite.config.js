import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ['msd-notes.onrender.com', 'localhost', '127.0.0.1'],
    host: '0.0.0.0',
    port: process.env.PORT || 4173
  },
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 3000
  }
}) 