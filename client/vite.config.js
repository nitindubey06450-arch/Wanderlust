import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    },
    // Exclude large video files from file watcher to prevent EBUSY errors
    watch: {
      ignored: ['**/public/videos/**']
    }
  }
});
