import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    proxy: {
      '/products': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        bypass(request) {
          if (request.headers.accept?.includes('text/html')) {
            return '/index.html';
          }
        },
      },
    },
  },
});
