import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/auth/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Ensure unique hashes for all assets to prevent caching issues
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    // Disable caching during development
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: [
      'luzionapp.onrender.com',
      '.onrender.com'
    ],
    // Add cache control headers for preview mode
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  }
})