import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// This flag is crucial for detecting Cloudflare Pages preview environment
const isPreview = !!process.env.CF_PAGES || !!process.env.CLOUDFLARE_PAGES || process.env.VITE_PREVIEW === 'true'
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    port: 8001, // Set to 8001 as requested
    hmr: isPreview
      ? {
          protocol: 'wss',
          clientPort: 443,
          path: '/__vite_ws'
        }
      : true
  },
  preview: {
    host: true,
    strictPort: true,
    port: 8001 // Set to 8001 as requested
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
})