import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // This creates a virtual path '/api' that redirects to the target
      '/api': {
        target: 'https://api.krishnaaggarwal.com',
        changeOrigin: true,
        // This removes '/api' from the URL before sending it to the target server
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})