import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // En desarrollo, Vite (5173) reenvía /ws al servidor del juego (8080).
    // Así el cliente usa la misma URL en desarrollo y en producción.
    proxy: {
      '/ws': { target: 'ws://localhost:8080', ws: true },
    },
  },
})
