import path from 'path';
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';

const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['frontend'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@style': path.resolve(__dirname, './src/style'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@types': path.resolve(__dirname, './src/types'),
      '@languages': path.resolve(__dirname, './src/languages'),
      '@settings': path.resolve(__dirname, './src/pages/settings'),
    },
  },
});
