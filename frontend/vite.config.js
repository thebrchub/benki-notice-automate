import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    // This forces Vite to always resolve these imports to the top-level node_modules
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
})