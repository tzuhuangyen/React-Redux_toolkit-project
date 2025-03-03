import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base:
    process.env.NODE_ENV === 'production'
      ? '/React-Redux_toolkit-project/'
      : '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://ec-course-api.hexschool.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
