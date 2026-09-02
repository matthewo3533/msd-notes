import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 3000,
    open: true
  },
  preview: {
    allowedHosts: ['msd-notes.onrender.com', 'localhost', '127.0.0.1'],
    host: '0.0.0.0',
    port: process.env.PORT || 4173
  },
  build: {
    target: 'es2015',
    minify: false,
    rollupOptions: {
      output: {
        // `file://` viewing needs non-module scripts. iife + inlining avoids
        // emitting module-based chunk files that browsers block.
        format: 'iife',
        inlineDynamicImports: true
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
