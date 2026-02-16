  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'

  // https://vite.dev/config/
  export default defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        // Catch any request starting with "/kietdata"
        '/kietdata': {
          target: 'https://api.krishnaaggarwal.com',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  })