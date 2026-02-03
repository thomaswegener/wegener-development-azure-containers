import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react({ jsxRuntime: 'automatic' })],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: isSsrBuild
    ? undefined
    : {
        rollupOptions: {
          output: {
            manualChunks: {
              react: ['react', 'react-dom', 'react-router', 'react-router-dom'],
              i18n: ['i18next', 'react-i18next'],
              icons: ['react-icons', 'react-bootstrap-icons'],
            },
          },
        },
      },
}));
