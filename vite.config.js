import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true,
    })
  ],
  optimizeDeps: {
    include: ['@chakra-ui/react'], 
    exclude: ['twitter-api-v2'],
    esbuildOptions: {
      target: 'es2020',
    }
  },
  build: {
    target: 'es2020'
  },
  server: {
    proxy: {
      '/twitter-api': {
        target: 'https://api.x.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/twitter-api/, '')
      }
    }
  }
});