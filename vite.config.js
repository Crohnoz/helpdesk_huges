import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for Hughes Helper
// - React fast refresh
// - Build outDir set to dist (default)
// - OptimizeDeps include react/jsx-runtime for stability

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    host: true,
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
  },
  optimizeDeps: {
    include: ['react/jsx-runtime'],
  },
})
