import path from 'path';
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';


const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
});
