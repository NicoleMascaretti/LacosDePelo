import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
    allowedHosts: ["f35f0d60c644.ngrok-free.app"],
  },
  plugins: [react()],
})
