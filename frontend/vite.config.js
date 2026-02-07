import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom'],
    alias: {
      // ✅ FIX: Polyfill ALL the Node.js modules needed by xlsx
      stream: path.resolve(__dirname, 'node_modules/stream-browserify'),
      events: path.resolve(__dirname, 'node_modules/events'),
      util: path.resolve(__dirname, 'node_modules/util'),
      buffer: path.resolve(__dirname, 'node_modules/buffer'),
    },
  },
  // ✅ FIX: Define global variables
  define: {
    'process.env': {}, // Some libs check for process.env
    global: 'window',
  },
  // ✅ FIX: Optimize deps to force include these
  optimizeDeps: {
    include: ['xlsx-js-style', 'buffer'],
  },
})